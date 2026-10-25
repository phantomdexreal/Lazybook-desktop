/*
LazyBooks | src/main/entries/alter.ts
Responsibility: Alter / cancel / delete (edits on posted vouchers: alter.action replace, kinds cancel and delete)
Introduced by: Phase 30 (alter-cancel-delete)
STATUS: IMPLEMENTED (Phase 30)
*/

/**
 * `createAlterHandlers(deps)` returns the listener handlers `alter`, `cancel` and `delete`.
 *   - `alter`: action `replace` runs here; the four e-invoice / e-way actions are delegated to `einvoice.ts` (Phase 29).
 *   - `cancel`: Tally's own Cancel (the voucher keeps its number and is marked cancelled).
 *   - `delete`: Tally's own Delete (the voucher is removed; devices learn it from the next deleted-voucher check).
 *
 * Sequence (ENTRY_PAYLOADS sections 3 and 5, TALLY_WIRE section 8):
 *   1. Re-validate: schema of `entry_rules.json` (+ S11 for alter), the target must be a voucher this PC knows (vault; else TARGET_NOT_FOUND),
 *      `replace` builds the replacement with the Phase 25 builders (all S01-S11 checks, UNBALANCED guard) before anything is sent.
 *   2. READ the target in Tally by guid (alter id, master id, number, type, cancelled flag, REMOTEID, IRN state).
 *   3. Already done? replace: the voucher carries this request's REMOTEID. cancel: already cancelled. delete: gone (only for a retried or recovered row).
 *      -> `ok:true`, nothing sent. This runs BEFORE the conflict check because the action itself moves the alter id.
 *   4. Conflict: Tally's alter id differs from `expected_alter_id` (when given) -> ALTER_CONFLICT (needs_review), Tally is NOT touched.
 *   5. Guards that need no Tally call: a live e-invoice (IRN, not cancelled) cannot be replaced, cancelled or deleted (EINVOICE_REJECTED, assumed Tally rule);
 *      replace may not change the voucher type; the voucher number may not clash with another voucher of the same type in the vault.
 *   6. Import (`ACTION` Alter / Cancel / Delete with TAGNAME="MASTER ID") and READ BACK. The read-back decides, never the import answer alone:
 *      replace: alter id moved or REMOTEID echoed; cancel: cancelled; delete: gone. Otherwise AMBIGUOUS_RESULT (needs_review), never a blind retry.
 *   7. After a change `onChanged()` (scheduler `syncNow`) pulls the new state so the vault and the devices get the edit.
 *
 * ASSUMED, to confirm on a real TallyPrime (checklist TW-ENTRY-REMOTEID covers REMOTEID; Cancel and Delete are listed under Open questions in PHASE_STATUS, human): `ACTION="Cancel"` / `"Delete"` with MASTER ID identification (TALLY_WIRE says
 * they are not on the help pages checked), the cancel reason written as the narration `Cancelled: <reason>` (no other tag exists for it), REMOTEID being
 * replaced by an Alter import, the read-back field names ISCANCELLED and REMOTEID, and that Tally refuses to change an e-invoiced voucher.
 * No Electron import. Logs request ids only, never payloads, numbers, names or guids.
 */
import { logger } from '../logger';
import type { TallyClient } from '../tally/client';
import { textOf } from '../tally/masters/map';
import { escapeXml, type Row } from '../tally/xml';
import { BuildError, buildVoucherImport, checkFields, lookupFromTables, VOUCHER_KINDS, type FlagMap, type LookupTables, type VoucherKind } from './builders';
import { checkAlterPayload, createAlterHandler as createEinvoiceAlterHandler, isEinvoiceAction } from './einvoice';
import type { EntryContext, EntryHandler, EntryKind, EntryOutcome } from './listener';
import { mapImportFailure } from './results';
import rules from '../../../docs/shared/entry_rules.json';

export const REQ_VOUCHER_TARGET = 'LBVoucherTarget';
const MESSAGE_MAX = 300;
const CONFLICT_TEXT = 'The voucher was changed in Tally after it was opened here. Check it in Tally, then act in the review queue.';

export interface AlterDeps {
  client: Pick<TallyClient, 'collection' | 'importData'>;
  /** Vault tables for the lookups (production: `vault.readTable`), null while the vault is not ready. */
  tables: () => LookupTables | null;
  quotationVoucherTypeGuid?: () => string | null;
  flags?: () => FlagMap | undefined;
  /** Called after Tally changed (production: scheduler `syncNow`), so the vault and the devices get the edit. Failures are ignored. */
  onChanged?: () => void | Promise<unknown>;
  mapMessage?: (text: string) => string | null;
}

/** A voucher as Tally reports it, with what the three actions need. */
export interface TargetState {
  guid: string;
  masterId: string;
  alterId: number | null;
  voucherNumber: string;
  voucherType: string;
  date: string;
  cancelled: boolean;
  remoteId: string;
  irn: string;
  irnCancelled: boolean;
}

const q = (s: string): string => `"${s.replace(/"/g, '""')}"`;
const ymd = (iso: string): string => iso.replace(/-/g, '');
const clip = (s: string): string => (s.length > MESSAGE_MAX ? s.slice(0, MESSAGE_MAX - 1) + '.' : s);
const norm = (s: string): string => s.trim().replace(/\s+/g, ' ').toLowerCase();
const yes = (s: string): boolean => /^(yes|y|true|1)$/i.test(s.trim());
const t = (r: Row, k: string): string => textOf(r[k] as string);

function toState(r: Row): TargetState {
  const a = parseInt(t(r, 'ALTERID'), 10);
  return {
    guid: t(r, 'GUID'),
    masterId: t(r, 'MASTERID'),
    alterId: Number.isFinite(a) ? a : null,
    voucherNumber: t(r, 'VOUCHERNUMBER'),
    voucherType: t(r, 'VOUCHERTYPENAME'),
    date: t(r, 'DATE'),
    cancelled: yes(t(r, 'ISCANCELLED')),
    remoteId: t(r, '@REMOTEID') || t(r, 'REMOTEID'),
    irn: t(r, 'IRN'),
    irnCancelled: yes(t(r, 'IRNCANCELLED')),
  };
}

/** Read the target voucher from Tally by guid (whole financial year; the answer is also compared client-side). */
export async function readTarget(client: AlterDeps['client'], company: { name: string; starting_from: string; ending_at: string }, guid: string): Promise<TargetState | null> {
  const rows = await client.collection(REQ_VOUCHER_TARGET, ['GUID', 'MASTERID', 'ALTERID', 'VOUCHERNUMBER', 'VOUCHERTYPENAME', 'DATE', 'ISCANCELLED', 'REMOTEID', 'IRN', 'IRNCANCELLED'], {
    type: 'Voucher',
    company: company.name,
    fromDate: ymd(company.starting_from),
    toDate: ymd(company.ending_at),
    filters: [{ name: 'LBTarget', formula: `$GUID = ${q(guid)}` }],
    priority: 'entry',
  });
  const hit = rows.find((r) => t(r, 'GUID') === guid);
  return hit ? toState(hit) : null;
}

/** Cancel or Delete import (TALLY_WIRE section 8: ACTION Cancel / Delete are assumed). `narration` is only used by cancel. */
export function buildActionImport(company: string, st: TargetState, action: 'Cancel' | 'Delete', narration?: string): string {
  return [
    '<ENVELOPE>',
    ' <HEADER>',
    '  <TALLYREQUEST>Import Data</TALLYREQUEST>',
    ' </HEADER>',
    ' <BODY>',
    '  <IMPORTDATA>',
    '   <REQUESTDESC>',
    '    <REPORTNAME>Vouchers</REPORTNAME>',
    '    <STATICVARIABLES>',
    `     <SVCURRENTCOMPANY>${escapeXml(company)}</SVCURRENTCOMPANY>`,
    '    </STATICVARIABLES>',
    '   </REQUESTDESC>',
    '   <REQUESTDATA>',
    '    <TALLYMESSAGE xmlns:UDF="TallyUDF">',
    `     <VOUCHER VCHTYPE="${escapeXml(st.voucherType)}" ACTION="${action}" TAGNAME="MASTER ID" TAGVALUE="${escapeXml(st.masterId)}">`,
    `      <DATE>${escapeXml(st.date)}</DATE>`,
    `      <VOUCHERTYPENAME>${escapeXml(st.voucherType)}</VOUCHERTYPENAME>`,
    `      <VOUCHERNUMBER>${escapeXml(st.voucherNumber)}</VOUCHERNUMBER>`,
    ...(narration ? [`      <NARRATION>${escapeXml(narration)}</NARRATION>`] : []),
    '     </VOUCHER>',
    '    </TALLYMESSAGE>',
    '   </REQUESTDATA>',
    '  </IMPORTDATA>',
    ' </BODY>',
    '</ENVELOPE>',
    '',
  ].join('\n');
}

type Spec = Parameters<typeof checkFields>[0];
const KIND_FIELDS = (rules as unknown as { kinds: Record<string, { fields: Spec }> }).kinds;

/** Schema check of a cancel / delete payload. Returns a message or null. */
export function checkTargetPayload(kind: 'cancel' | 'delete', data: unknown): string | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'The change request is not an object.';
  const errs: { detail: string; path: string; message: string }[] = [];
  checkFields(KIND_FIELDS[kind]!.fields, data as never, '$.data', errs as never);
  return errs[0] ? `${errs[0].message} (${errs[0].path})` : null;
}

export interface AlterHandlers {
  alter: EntryHandler;
  cancel: EntryHandler;
  delete: EntryHandler;
}

export function createAlterHandlers(deps: AlterDeps): Pick<Record<EntryKind, EntryHandler>, 'alter' | 'cancel' | 'delete'> {
  const inFlight = new Set<string>();

  async function changed(): Promise<void> {
    try {
      await deps.onChanged?.();
    } catch (e) {
      logger.warn('entries', 'refresh after voucher change failed', { error: (e as Error).message });
    }
  }

  async function guarded(ctx: EntryContext, run: () => Promise<EntryOutcome>): Promise<EntryOutcome> {
    const id = ctx.envelope.client_request_id;
    if (inFlight.has(id)) return { ok: false, detail: 'AMBIGUOUS_RESULT', message: 'This entry is already being posted.' };
    inFlight.add(id);
    try {
      return await run();
    } catch (e) {
      if (e instanceof BuildError) return { ok: false, detail: e.detail, message: clip(`${e.message} (${e.path})`) };
      throw e;
    } finally {
      inFlight.delete(id);
    }
  }

  /** Steps shared by the three actions up to the Tally read: tables, company, target known to the vault, target read from Tally. */
  async function prepare(guid: string): Promise<{ t: LookupTables; co: { name: string; starting_from: string; ending_at: string }; st: TargetState | null } | EntryOutcome> {
    const tb = deps.tables();
    if (!tb || !tb.tm_company?.[0]) return { ok: false, detail: 'TALLY_UNREACHABLE', message: 'The local copy of the company is not ready yet. The entry will be tried again.' };
    const c = tb.tm_company[0] as Row;
    const co = { name: textOf(c['name'] as string), starting_from: textOf(c['starting_from'] as string), ending_at: textOf(c['ending_at'] as string) };
    const inVault = (tb.tx_voucher ?? []).some((v) => String(v['guid']) === guid);
    if (!inVault) return { ok: false, detail: 'TARGET_NOT_FOUND', message: 'The voucher to change was not found on this PC.' };
    return { t: tb, co, st: await readTarget(deps.client, co, guid) };
  }

  const gone = (): EntryOutcome => ({ ok: false, detail: 'TARGET_NOT_FOUND', message: 'The voucher to change was not found in Tally.' });
  const conflict = (): EntryOutcome => ({ ok: false, detail: 'ALTER_CONFLICT', message: CONFLICT_TEXT });
  const liveIrn = (s: TargetState): boolean => !!s.irn && !s.irnCancelled;
  const einvoiced = (what: string): EntryOutcome => ({ ok: false, detail: 'EINVOICE_REJECTED', message: `This voucher has a live e-invoice (IRN), so it cannot be ${what}. Cancel the e-invoice first.` });

  /** Import + settle: a refused import maps through the table, an unclear answer is settled by one read-back. */
  async function send(xml: string, settle: () => Promise<boolean>): Promise<{ ok: true } | EntryOutcome> {
    const res = await deps.client.importData(xml, { priority: 'entry' });
    if (res.ok) return { ok: true };
    if (res.ambiguous && (await settle())) return { ok: true };
    return mapImportFailure(res, deps.mapMessage);
  }

  const replace = (ctx: EntryContext): Promise<EntryOutcome> =>
    guarded(ctx, async () => {
      const env = ctx.envelope;
      const id = env.client_request_id;
      const bad = checkAlterPayload(env.data);
      if (bad) return { ok: false, detail: 'PAYLOAD_INVALID', message: clip(bad) };
      const d = env.data as { target_voucher_guid: string; expected_alter_id: number; target_kind?: string; replacement?: { number?: string; voucher_type_guid?: string } };
      if (!(VOUCHER_KINDS as readonly string[]).includes(d.target_kind ?? '')) return { ok: false, detail: 'PAYLOAD_INVALID', message: 'This kind of voucher cannot be replaced here.' };
      const p = await prepare(d.target_voucher_guid);
      if ('ok' in p) return p;
      const { t: tb, co, st } = p;
      if (!st) return gone();

      // already applied (retry, recovered row): the voucher carries this request's REMOTEID
      if (st.remoteId === id) return { ok: true, guid: st.guid, voucher_number: st.voucherNumber || undefined, alter_id: st.alterId ?? undefined, message: 'Already changed in Tally.' };
      if (st.alterId !== null && st.alterId !== d.expected_alter_id) return conflict();
      if (liveIrn(st)) return einvoiced('replaced');

      const lk = lookupFromTables(tb, deps.quotationVoucherTypeGuid?.() ?? null);
      const built = buildVoucherImport({ ...env, kind: d.target_kind as VoucherKind, data: d.replacement as never }, lk, { action: 'Alter', masterId: st.masterId }, deps.flags?.());
      if (norm(built.voucherTypeName) !== norm(st.voucherType)) return { ok: false, detail: 'VOUCHER_TYPE_MISMATCH', message: 'The voucher type of a voucher cannot be changed. Create a new voucher instead.' };
      const num = d.replacement?.number;
      if (num && d.replacement?.voucher_type_guid) {
        const clash = (tb.tx_voucher ?? []).find((v) => String(v['voucher_type_guid']) === d.replacement?.voucher_type_guid && norm(String(v['number'] ?? '')) === norm(num) && String(v['guid']) !== st.guid && String(v['remote_id'] ?? '') !== id);
        if (clash) return { ok: false, detail: 'VOUCHER_NUMBER_EXISTS', message: `Voucher number ${num} is already used for this voucher type.` };
      }

      const moved = async (): Promise<boolean> => {
        const a = await readTarget(deps.client, co, st.guid);
        return !!a && (a.remoteId === id || a.alterId !== st.alterId);
      };
      const r = await send(built.xml, moved);
      if (!r.ok) return r;
      const after = await readTarget(deps.client, co, st.guid);
      if (!after || !(after.remoteId === id || after.alterId !== st.alterId)) {
        return { ok: false, detail: 'AMBIGUOUS_RESULT', message: 'Tally accepted the change but it could not be confirmed. Check the voucher in Tally, then act in the review queue.' };
      }
      void changed();
      logger.info('entries', 'voucher replaced', { requestId: id });
      return { ok: true, guid: after.guid, voucher_number: after.voucherNumber || undefined, alter_id: after.alterId ?? undefined, message: 'Voucher changed in Tally.' };
    });

  const cancel = (ctx: EntryContext): Promise<EntryOutcome> =>
    guarded(ctx, async () => {
      const id = ctx.envelope.client_request_id;
      const bad = checkTargetPayload('cancel', ctx.envelope.data);
      if (bad) return { ok: false, detail: 'PAYLOAD_INVALID', message: clip(bad) };
      const d = ctx.envelope.data as { target_voucher_guid: string; expected_alter_id?: number; reason?: string };
      const p = await prepare(d.target_voucher_guid);
      if ('ok' in p) return p;
      const { co, st } = p;
      if (!st) return gone();
      const done = (note: string): EntryOutcome => ({ ok: true, guid: st.guid, voucher_number: st.voucherNumber || undefined, alter_id: st.alterId ?? undefined, message: note });
      if (st.cancelled) return done('Already cancelled in Tally.');
      if (d.expected_alter_id !== undefined && st.alterId !== null && st.alterId !== d.expected_alter_id) return conflict();
      if (liveIrn(st)) return einvoiced('cancelled');
      const xml = buildActionImport(co.name, st, 'Cancel', d.reason ? `Cancelled: ${d.reason}` : undefined);
      const settled = async (): Promise<boolean> => !!(await readTarget(deps.client, co, st.guid))?.cancelled;
      const r = await send(xml, settled);
      if (!r.ok) return r;
      const after = await readTarget(deps.client, co, st.guid);
      if (!after || !after.cancelled) return { ok: false, detail: 'AMBIGUOUS_RESULT', message: 'Tally accepted the cancel but the voucher does not show as cancelled. Check it in Tally, then act in the review queue.' };
      void changed();
      logger.info('entries', 'voucher cancelled', { requestId: id });
      return { ok: true, guid: after.guid, voucher_number: after.voucherNumber || undefined, alter_id: after.alterId ?? undefined, message: 'Voucher cancelled in Tally.' };
    });

  const del = (ctx: EntryContext): Promise<EntryOutcome> =>
    guarded(ctx, async () => {
      const id = ctx.envelope.client_request_id;
      const bad = checkTargetPayload('delete', ctx.envelope.data);
      if (bad) return { ok: false, detail: 'PAYLOAD_INVALID', message: clip(bad) };
      const d = ctx.envelope.data as { target_voucher_guid: string; expected_alter_id?: number };
      const p = await prepare(d.target_voucher_guid);
      if ('ok' in p) return p;
      const { co, st } = p;
      // a voucher that is gone is "done" only for a retried or recovered row (an earlier try may have deleted it); otherwise there was nothing to delete
      if (!st) return ctx.recovered || ctx.attempt > 1 ? { ok: true, guid: d.target_voucher_guid, message: 'Already deleted in Tally.' } : gone();
      if (d.expected_alter_id !== undefined && st.alterId !== null && st.alterId !== d.expected_alter_id) return conflict();
      if (liveIrn(st)) return einvoiced('deleted');
      const xml = buildActionImport(co.name, st, 'Delete');
      const settled = async (): Promise<boolean> => (await readTarget(deps.client, co, st.guid)) === null;
      const r = await send(xml, settled);
      if (!r.ok) return r;
      if ((await readTarget(deps.client, co, st.guid)) !== null) return { ok: false, detail: 'AMBIGUOUS_RESULT', message: 'Tally accepted the delete but the voucher is still there. Check it in Tally, then act in the review queue.' };
      void changed();
      logger.info('entries', 'voucher deleted', { requestId: id });
      return { ok: true, guid: d.target_voucher_guid, voucher_number: st.voucherNumber || undefined, message: 'Voucher deleted in Tally.' };
    });

  const alter = createEinvoiceAlterHandler(
    { client: deps.client, tables: deps.tables as never, flags: deps.flags, onChanged: deps.onChanged, mapMessage: deps.mapMessage },
    (ctx) => replace(ctx),
  );
  return { alter, cancel, delete: del };
}

export { isEinvoiceAction };
