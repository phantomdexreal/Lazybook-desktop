/*
LazyBooks | src/main/entries/einvoice.ts
Responsibility: E-invoice + e-way actions (alter.action einvoice_generate, einvoice_cancel, eway_generate, eway_cancel)
Introduced by: Phase 29 (einvoice-actions)
STATUS: IMPLEMENTED (Phase 29)
*/

/**
 * `createEinvoiceActions(deps)` returns `run(ctx)`, the handler for the four e-invoice / e-way values of `alter.action`
 * (ENTRY_PAYLOADS section 3, TALLY_WIRE section 8). `replace` is Phase 30; `createAlterHandler` below is the registration seam
 * that Phase 30 extends (it fails `replace` with a plain text until then).
 *
 * Sequence (no direct GSP call anywhere; Tally runs its own flow):
 *   1. Re-validate the payload against `entry_rules.json` (`checkFields`) plus S11 and the `einvoice_eway` flag.
 *   2. READ the target voucher in Tally by guid (also its e-invoice fields). Missing -> TARGET_NOT_FOUND.
 *   3. Conflict check: Tally's alter id differs from `expected_alter_id` -> ALTER_CONFLICT (needs_review), Tally is NOT touched.
 *   4. Idempotent shortcuts: the wanted state is already there (IRN present, IRN cancelled, e-way number present or cleared)
 *      -> ok:true with the numbers, nothing is sent. This is what makes a retry or a crash-recovered row safe.
 *      Impossible requests (cancel without an IRN, e-way cancel without an e-way bill) -> EINVOICE_REJECTED, nothing is sent.
 *   5. POST the action as an Alter of the voucher (TAGNAME="MASTER ID", the confirmed alter identification).
 *   6. READ BACK. The wanted state is there -> ok:true, IRN / ack number / e-way number in `message`, new `alter_id`.
 *      The state did not change although the import was accepted -> EINVOICE_REJECTED (Tally did not run its flow:
 *      not logged in to the portal, not enabled for this company or release, ...). A refusal text that maps to nothing known
 *      becomes EINVOICE_REJECTED with the Tally text kept in `tally_raw`; known texts keep their detail (TALLY_COMPANY_NOT_LOADED, ...).
 *   7. After a change `onChanged()` asks the scheduler for one pull so the new numbers reach the vault and from there the devices.
 *
 * ASSUMED, to confirm on a real TallyPrime (new checklist item TW-EINV, human): the import tags below (IRNREQUEST, IRNCANCELREASON,
 * IRNCANCELREMARKS, EWAYBILLREQUEST, EWAYBILLCANCEL..., EWAYBILLDETAILS.LIST fields) and the read-back field names (IRN, IRNACKNO,
 * IRNACKDATE, IRNCANCELLED, EWAYBILLNO) which follow `tx_voucher` in `data_model.json`. The release / GST-portal dependence is the
 * reason for step 6: the connector trusts the read-back, not the import answer.
 * No Electron import; logs request ids only, never payloads, IRNs or guids.
 */
import { logger } from '../logger';
import type { TallyClient } from '../tally/client';
import { textOf } from '../tally/masters/map';
import { escapeXml, type Row } from '../tally/xml';
import { checkFields } from './builders/validate';
import type { FlagMap, LookupTables } from './builders';
import type { EntryContext, EntryHandler, EntryOutcome } from './listener';
import { mapImportFailure } from './results';
import rules from '../../../docs/shared/entry_rules.json';

export const REQ_VOUCHER_BY_GUID = 'LBVoucherByGuid';
const MESSAGE_MAX = 300;

export type EinvoiceAction = 'einvoice_generate' | 'einvoice_cancel' | 'eway_generate' | 'eway_cancel';
export const EINVOICE_ACTIONS: readonly EinvoiceAction[] = ['einvoice_generate', 'einvoice_cancel', 'eway_generate', 'eway_cancel'];
export const isEinvoiceAction = (a: unknown): a is EinvoiceAction => typeof a === 'string' && (EINVOICE_ACTIONS as readonly string[]).includes(a);

/** Tally's own words for the e-invoice cancel reasons (portal codes 1 to 4). */
const CANCEL_REASON: Record<string, string> = {
  duplicate: 'Duplicate',
  data_entry_mistake: 'Data Entry Mistake',
  order_cancelled: 'Order Cancelled',
  others: 'Others',
};
const MODE: Record<string, string> = { road: 'Road', rail: 'Rail', air: 'Air', ship: 'Ship' };

export interface AlterData {
  target_voucher_guid: string;
  expected_alter_id: number;
  action: string;
  target_kind?: string;
  replacement?: unknown;
  reason?: string;
  remarks?: string;
  eway?: { transporter_id?: string; vehicle_no?: string; distance_km?: number; mode?: string };
}

export interface EinvoiceDeps {
  client: Pick<TallyClient, 'collection' | 'importData'>;
  /** Vault tables for the company row (name, financial year); null while the vault is not ready. */
  tables: () => Pick<LookupTables, 'tm_company'> | null;
  /** Effective feature flags; omit to skip the `einvoice_eway` check. */
  flags?: () => FlagMap | undefined;
  /** Called after Tally changed, so the next pull brings the numbers to the vault and the devices. Failures are ignored. */
  onChanged?: () => void | Promise<unknown>;
  mapMessage?: (text: string) => string | null;
}

/** The e-invoice state of a voucher as Tally reports it. */
export interface EinvoiceState {
  guid: string;
  masterId: string;
  alterId: number | null;
  voucherNumber: string;
  voucherType: string;
  date: string;
  irn: string;
  ackNo: string;
  ackDate: string;
  irnCancelled: boolean;
  ewayNo: string;
}

const q = (s: string): string => `"${s.replace(/"/g, '""')}"`;
const ymd = (iso: string): string => iso.replace(/-/g, '');
const clip = (s: string): string => (s.length > MESSAGE_MAX ? s.slice(0, MESSAGE_MAX - 1) + '.' : s);
const yes = (s: string): boolean => /^(yes|y|true|1)$/i.test(s.trim());
const t = (r: Row, k: string): string => textOf(r[k] as string);

function toState(r: Row): EinvoiceState {
  const a = parseInt(t(r, 'ALTERID'), 10);
  return {
    guid: t(r, 'GUID'),
    masterId: t(r, 'MASTERID'),
    alterId: Number.isFinite(a) ? a : null,
    voucherNumber: t(r, 'VOUCHERNUMBER'),
    voucherType: t(r, 'VOUCHERTYPENAME'),
    date: t(r, 'DATE'),
    irn: t(r, 'IRN'),
    ackNo: t(r, 'IRNACKNO'),
    ackDate: t(r, 'IRNACKDATE'),
    irnCancelled: yes(t(r, 'IRNCANCELLED')),
    ewayNo: t(r, 'EWAYBILLNO'),
  };
}

/** Read the voucher and its e-invoice fields from Tally by guid (whole financial year, result also compared client-side). */
export async function readEinvoiceState(client: EinvoiceDeps['client'], company: { name: string; starting_from: string; ending_at: string }, guid: string): Promise<EinvoiceState | null> {
  const rows = await client.collection(REQ_VOUCHER_BY_GUID, ['GUID', 'MASTERID', 'ALTERID', 'VOUCHERNUMBER', 'VOUCHERTYPENAME', 'DATE', 'IRN', 'IRNACKNO', 'IRNACKDATE', 'IRNCANCELLED', 'EWAYBILLNO'], {
    type: 'Voucher',
    company: company.name,
    fromDate: ymd(company.starting_from),
    toDate: ymd(company.ending_at),
    filters: [{ name: 'LBGuid', formula: `$GUID = ${q(guid)}` }],
    priority: 'entry',
  });
  const hit = rows.find((r) => t(r, 'GUID') === guid);
  return hit ? toState(hit) : null;
}

/** Payload checks: schema of `entry_rules.json` plus S11 (the e-invoice / e-way part). Returns a message or null. */
export function checkAlterPayload(data: unknown): string | null {
  const fields = (rules as unknown as { kinds: { alter: { fields: Record<string, never> } } }).kinds.alter.fields;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'The change request is not an object.';
  const errs: { path: string; msg: string }[] = [];
  checkFields(fields as never, data as never, 'data', errs as never);
  if (errs.length > 0) {
    const e = errs[0] as unknown as { path?: string; message?: string; msg?: string };
    return `${e.message ?? e.msg ?? 'invalid'} (${e.path ?? 'data'})`;
  }
  const d = data as AlterData;
  if (d.action === 'einvoice_cancel' && !d.reason) return 'An e-invoice cancel needs a reason (data.reason).';
  if (d.action === 'eway_generate' && !(d.eway && (d.eway.transporter_id || d.eway.vehicle_no))) return 'An e-way bill needs a transporter id or a vehicle number (data.eway).';
  if (d.action === 'replace' && (!d.target_kind || d.replacement === undefined)) return 'A replace needs target_kind and replacement.';
  return null;
}

/** The Alter import for one action. Tags are assumed (TW-EINV); the voucher is identified by its master id, as for every alter. */
export function buildEinvoiceImport(company: string, st: EinvoiceState, d: AlterData, requestId: string): string {
  const e = (tag: string, v: string): string => `      <${tag}>${escapeXml(v)}</${tag}>\n`;
  let body = '';
  switch (d.action as EinvoiceAction) {
    case 'einvoice_generate':
      body += e('IRNREQUEST', 'Generate');
      break;
    case 'einvoice_cancel':
      body += e('IRNREQUEST', 'Cancel');
      body += e('IRNCANCELREASON', CANCEL_REASON[d.reason ?? 'others'] ?? 'Others');
      body += e('IRNCANCELREMARKS', d.remarks ?? '');
      break;
    case 'eway_generate': {
      body += e('EWAYBILLREQUEST', 'Generate');
      body += '      <EWAYBILLDETAILS.LIST>\n';
      const w = d.eway ?? {};
      if (w.transporter_id) body += '  ' + e('TRANSPORTERID', w.transporter_id);
      if (w.vehicle_no) body += '  ' + e('VEHICLENUMBER', w.vehicle_no);
      if (w.distance_km !== undefined) body += '  ' + e('DISTANCE', String(w.distance_km));
      if (w.mode) body += '  ' + e('MODEOFTRANSPORT', MODE[w.mode] ?? 'Road');
      body += '      </EWAYBILLDETAILS.LIST>\n';
      break;
    }
    case 'eway_cancel':
      body += e('EWAYBILLREQUEST', 'Cancel');
      body += e('EWAYBILLCANCELREASON', CANCEL_REASON[d.reason ?? 'others'] ?? 'Others');
      body += e('EWAYBILLCANCELREMARKS', d.remarks ?? '');
      break;
  }
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
    `     <VOUCHER REMOTEID="${escapeXml(requestId)}" VCHTYPE="${escapeXml(st.voucherType)}" ACTION="Alter" TAGNAME="MASTER ID" TAGVALUE="${escapeXml(st.masterId)}">`,
    `      <DATE>${escapeXml(st.date)}</DATE>`,
    `      <VOUCHERTYPENAME>${escapeXml(st.voucherType)}</VOUCHERTYPENAME>`,
    `      <VOUCHERNUMBER>${escapeXml(st.voucherNumber)}</VOUCHERNUMBER>`,
    body.replace(/\n$/, ''),
    '     </VOUCHER>',
    '    </TALLYMESSAGE>',
    '   </REQUESTDATA>',
    '  </IMPORTDATA>',
    ' </BODY>',
    '</ENVELOPE>',
    '',
  ].join('\n');
}

/** Is the wanted end state already reached? */
function reached(a: EinvoiceAction, s: EinvoiceState): boolean {
  switch (a) {
    case 'einvoice_generate': return !!s.irn && !s.irnCancelled;
    case 'einvoice_cancel': return s.irnCancelled;
    case 'eway_generate': return !!s.ewayNo;
    case 'eway_cancel': return !s.ewayNo;
  }
}

/** Plain sentence with the numbers Tally gave (IRN, ack, e-way); this is what a device shows (result.message). */
export function describe(a: EinvoiceAction, s: EinvoiceState): string {
  const ack = [s.ackNo ? `Ack ${s.ackNo}` : '', s.ackDate ? `dated ${s.ackDate}` : ''].filter(Boolean).join(' ');
  switch (a) {
    case 'einvoice_generate': return clip(`E-invoice generated. IRN ${s.irn}${ack ? '. ' + ack : ''}.`);
    case 'einvoice_cancel': return clip(`E-invoice cancelled. IRN ${s.irn || 'not shown'}.`);
    case 'eway_generate': return clip(`E-way bill generated. Number ${s.ewayNo}.`);
    case 'eway_cancel': return 'E-way bill cancelled.';
  }
}

const outcomeOk = (a: EinvoiceAction, s: EinvoiceState, note?: string): EntryOutcome => ({
  ok: true,
  guid: s.guid,
  voucher_number: s.voucherNumber || undefined,
  alter_id: s.alterId ?? undefined,
  message: note ? clip(`${note} ${describe(a, s)}`) : describe(a, s),
});

export interface EinvoiceActions {
  run: EntryHandler;
}

export function createEinvoiceActions(deps: EinvoiceDeps): EinvoiceActions {
  const inFlight = new Set<string>();

  async function work(ctx: EntryContext): Promise<EntryOutcome> {
    const env = ctx.envelope;
    const id = env.client_request_id;
    const bad = checkAlterPayload(env.data);
    if (bad) return { ok: false, detail: 'PAYLOAD_INVALID', message: clip(bad) };
    const d = env.data as unknown as AlterData;
    if (!isEinvoiceAction(d.action)) return { ok: false, detail: 'PAYLOAD_INVALID', message: 'This is not an e-invoice or e-way action.' };
    const action = d.action;
    const flags = deps.flags?.();
    if (flags && flags.einvoice_eway === false) return { ok: false, detail: 'FLAG_DISABLED', message: 'E-invoice and e-way actions are switched off for this license.' };
    const tb = deps.tables();
    const company = tb?.tm_company?.[0] as Row | undefined;
    if (!company) return { ok: false, detail: 'TALLY_UNREACHABLE', message: 'The local copy of the company is not ready yet. The entry will be tried again.' };
    const co = { name: textOf(company['name'] as string), starting_from: textOf(company['starting_from'] as string), ending_at: textOf(company['ending_at'] as string) };

    const before = await readEinvoiceState(deps.client, co, d.target_voucher_guid);
    if (!before) return { ok: false, detail: 'TARGET_NOT_FOUND', message: 'The voucher to change was not found in Tally.' };

    // idempotent shortcut first: the wanted state is already there (a retry, a recovered row, or someone did it in Tally), so the device gets the numbers
    // and nothing is sent. This runs before the conflict check because this very action moves the alter id.
    // An e-way cancel with no e-way bill is "done" only when something shows we did it (a recovered row or a moved alter id); otherwise there was nothing to cancel.
    const nothingToCancel = action === 'eway_cancel' && !before.ewayNo && !ctx.recovered && before.alterId === d.expected_alter_id;
    if (reached(action, before) && !nothingToCancel) {
      logger.info('entries', 'e-invoice action already in effect, not sending', { requestId: id, action, recovered: ctx.recovered });
      return outcomeOk(action, before, 'Already done in Tally.');
    }
    if (before.alterId !== null && before.alterId !== d.expected_alter_id) {
      logger.warn('entries', 'e-invoice action refused, voucher changed in Tally', { requestId: id, action });
      return { ok: false, detail: 'ALTER_CONFLICT', message: 'The voucher was changed in Tally after it was opened here. Check it in Tally, then act in the review queue.' };
    }

    // impossible requests: nothing is sent
    if (action === 'einvoice_cancel' && !before.irn) return { ok: false, detail: 'EINVOICE_REJECTED', message: 'This voucher has no IRN, so there is no e-invoice to cancel.' };
    if (action === 'eway_cancel' && !before.ewayNo) return { ok: false, detail: 'EINVOICE_REJECTED', message: 'This voucher has no e-way bill to cancel.' };
    if (action === 'einvoice_generate' && before.irnCancelled) return { ok: false, detail: 'EINVOICE_REJECTED', message: 'The e-invoice of this voucher was cancelled; Tally does not generate a second IRN for it.' };

    const xml = buildEinvoiceImport(co.name, before, d, id);
    const res = await deps.client.importData(xml, { priority: 'entry' });
    if (!res.ok) {
      if (res.ambiguous) {
        const late = await readEinvoiceState(deps.client, co, d.target_voucher_guid);
        if (late && reached(action, late)) {
          void changed();
          return outcomeOk(action, late, 'Confirmed by read-back.');
        }
      }
      const f = mapImportFailure(res, deps.mapMessage);
      // Tally's own words are what the user needs for these (portal login, GSTIN, e-way rules): keep the first line in the message
      const first = (f.tally_raw ?? '').split(' | ')[0] ?? '';
      if (f.detail === 'UNKNOWN') return { ...f, detail: 'EINVOICE_REJECTED', message: clip(`Tally did not accept the e-invoice or e-way step.${first ? ' Tally said: ' + first : ''}`) };
      if (f.detail === 'EINVOICE_REJECTED' && first) return { ...f, message: clip(`${f.message} Tally said: ${first}`) };
      return f;
    }
    const after = await readEinvoiceState(deps.client, co, d.target_voucher_guid);
    if (!after) return { ok: false, detail: 'AMBIGUOUS_RESULT', message: 'Tally accepted the step but the voucher could not be read back. Check Tally, then act in the review queue.' };
    if (!reached(action, after)) {
      return { ok: false, detail: 'EINVOICE_REJECTED', message: 'Tally accepted the request but the e-invoice or e-way details did not change. Check the GST portal login and settings in Tally, then try again.' };
    }
    void changed();
    logger.info('entries', 'e-invoice action done', { requestId: id, action });
    return outcomeOk(action, after);
  }

  async function changed(): Promise<void> {
    try {
      await deps.onChanged?.();
    } catch (e) {
      logger.warn('entries', 'refresh after e-invoice action failed', { error: (e as Error).message });
    }
  }

  return {
    run: async (ctx) => {
      const id = ctx.envelope.client_request_id;
      if (inFlight.has(id)) return { ok: false, detail: 'AMBIGUOUS_RESULT', message: 'This entry is already being posted.' };
      inFlight.add(id);
      try {
        return await work(ctx);
      } finally {
        inFlight.delete(id);
      }
    },
  };
}

/**
 * The `alter` handler for the listener: e-invoice and e-way actions run here; `replace` is Phase 30 and fails with a plain text until then.
 */
export function createAlterHandler(deps: EinvoiceDeps, replace?: EntryHandler): EntryHandler {
  const actions = createEinvoiceActions(deps);
  return async (ctx) => {
    const a = (ctx.envelope.data as { action?: unknown } | null)?.action;
    if (isEinvoiceAction(a)) return actions.run(ctx);
    if (a === 'replace' && replace) return replace(ctx);
    return { ok: false, detail: 'UNKNOWN', message: 'This connector cannot change vouchers yet. Update LazyBooks on this PC and try again.' };
  };
}
