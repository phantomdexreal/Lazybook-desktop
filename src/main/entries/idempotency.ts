/*
LazyBooks | src/main/entries/idempotency.ts
Responsibility: Idempotency + duplicate guard (client_request_id <-> Tally remote id, pre-post lookup, post-crash reconciliation) and the posting handlers
Introduced by: Phase 27 (idempotency)
STATUS: IMPLEMENTED (Phase 27)
*/

/**
 * `createEntryHandlers(deps)` returns the listener handlers for the eight voucher kinds, `ledger` and `stock_item`.
 * Alter, cancel and delete are Phase 30. Every handler runs the same sequence (SHARED_CONTRACTS 4.2, ENTRY_PAYLOADS 5, TALLY_WIRE 8):
 *
 *   1. Build + re-validate (Phases 25/26). A `BuildError` is a final validation failure, nothing is sent to Tally.
 *   2. PRE-CHECK, always, before every post (not only for a recovered row): ask Tally for a voucher whose REMOTEID is the `client_request_id`
 *      (masters: a master of that name). Found -> `ok:true` with the existing guid, nothing is posted (DUPLICATE_CLIENT_REQUEST semantics).
 *      A failed pre-check read throws (listener: retryable TALLY_UNREACHABLE, or needs_review): the post is NEVER attempted blind.
 *   3. POST through the serialised Tally client. REMOTEID is the voucher attribute (equal REMOTEIDs overwrite each other in Tally), so even a
 *      post whose answer was lost cannot create a second voucher: the retry finds it at step 2, or overwrites it.
 *   4. READ BACK by REMOTEID. Found -> `ok:true` with guid, voucher number, alter id. Empty -> AMBIGUOUS_RESULT (needs_review), never a blind retry.
 *      Assumed fallback (TW-ENTRY-REMOTEID): when Tally does not echo REMOTEID, a single created voucher is read back by LASTVCHID (master id).
 *
 * Crash window: the process dying between step 3 and the write of the result leaves the row in `posting`; the listener re-claims it with
 * `recovered:true` and this module's pre-check decides: voucher present -> posted exactly once, absent -> posted now. In flight in this process the
 * same request id can never run twice (`inFlight` set).
 * Duplicate guard on top: a voucher number already used for the same voucher type in the vault (by another remote id) is refused with
 * VOUCHER_NUMBER_EXISTS before anything is sent (the vault may be stale; Tally has the last word).
 * No Electron import; never logs payloads, names or guids (ids of requests only).
 */
import { logger } from '../logger';
import type { TallyClient } from '../tally/client';
import { textOf } from '../tally/masters/map';
import type { Row } from '../tally/xml';
import { buildVoucherImport, lookupFromTables, VOUCHER_KINDS, BuildError, type FlagMap, type LookupTables, type VoucherKind } from './builders';
import { buildMasterImport, masterLookupFromTables, type MasterKind } from './masters';
import type { EntryContext, EntryHandler, EntryKind, EntryOutcome } from './listener';
import { mapImportFailure } from './results';

export const REQ_VOUCHER_BY_REMOTE = 'LBVoucherByRemote';
export const REQ_MASTER_BY_NAME = 'LBMasterByName';
const MESSAGE_MAX = 300;

export interface IdempotencyDeps {
  client: Pick<TallyClient, 'collection' | 'importData'>;
  /** Vault tables for the lookups (production: `vault.readTable`), null while the vault is not ready. */
  tables: () => LookupTables | null;
  /** `app_settings.quotation_voucher_type_guid` or null. */
  quotationVoucherTypeGuid?: () => string | null;
  /** Effective feature flags; omit to skip the flag check (the listener already enforces `entries`). */
  flags?: () => FlagMap | undefined;
  /** Tally message to detail mapping; default is `mapTallyMessage` of `results.ts` (Phase 28: `entry_rules.json` `tally_message_map`). */
  mapMessage?: (text: string) => string | null;
}

/** TDL formula string literal: double quotes doubled. */
const q = (s: string): string => `"${s.replace(/"/g, '""')}"`;
const ymd = (iso: string): string => iso.replace(/-/g, '');
const clip = (s: string): string => (s.length > MESSAGE_MAX ? s.slice(0, MESSAGE_MAX - 1) + '.' : s);
const norm = (s: string): string => s.trim().replace(/\s+/g, ' ').toLowerCase();

export interface FoundVoucher {
  guid: string;
  masterId: string;
  voucherNumber: string;
  alterId: number | null;
}

const remoteOf = (r: Row): string => textOf(r['@REMOTEID'] as string) || textOf(r['REMOTEID'] as string);

function toFound(r: Row): FoundVoucher {
  const a = parseInt(textOf(r['ALTERID'] as string), 10);
  return { guid: textOf(r['GUID'] as string), masterId: textOf(r['MASTERID'] as string), voucherNumber: textOf(r['VOUCHERNUMBER'] as string), alterId: Number.isFinite(a) ? a : null };
}

/** Look in Tally for the voucher whose REMOTEID is `requestId` (the whole financial year of the company; the result is also checked client-side). */
export async function findVoucherByRemoteId(client: IdempotencyDeps['client'], company: { name: string; starting_from: string; ending_at: string }, requestId: string, byMasterId?: string): Promise<FoundVoucher | null> {
  const byRemote = !byMasterId;
  const formula = byRemote ? `$RemoteID = ${q(requestId)}` : `$MasterID = ${q(byMasterId as string)}`;
  const rows = await client.collection(REQ_VOUCHER_BY_REMOTE, ['MASTERID', 'GUID', 'ALTERID', 'VOUCHERNUMBER', 'REMOTEID'], {
    type: 'Voucher',
    company: company.name,
    fromDate: ymd(company.starting_from),
    toDate: ymd(company.ending_at),
    filters: [{ name: 'LBRemote', formula }],
    priority: 'entry',
  });
  const hit = rows.find((r) => (byRemote ? remoteOf(r) === requestId : textOf(r['MASTERID'] as string) === byMasterId));
  return hit ? toFound(hit) : null;
}

export interface FoundMaster {
  guid: string;
  name: string;
}

/** Look in Tally for a ledger or stock item by name (case-insensitive, checked client-side). */
export async function findMasterByName(client: IdempotencyDeps['client'], company: { name: string }, kind: MasterKind, name: string): Promise<FoundMaster | null> {
  const rows = await client.collection(REQ_MASTER_BY_NAME, ['GUID'], {
    type: kind === 'ledger' ? 'Ledger' : 'StockItem',
    company: company.name,
    filters: [{ name: 'LBName', formula: `$Name = ${q(name.trim())}` }],
    priority: 'entry',
  });
  const hit = rows.find((r) => norm(textOf(r['@NAME'] as string)) === norm(name));
  return hit ? { guid: textOf(hit['GUID'] as string), name: textOf(hit['@NAME'] as string) } : null;
}

/** Map an unsuccessful import result to a failed outcome (Phase 28: `results.ts` holds the table, the friendly texts and the raw text rule). */
const failure = mapImportFailure;

export function createEntryHandlers(deps: IdempotencyDeps): Partial<Record<EntryKind, EntryHandler>> {
  const inFlight = new Set<string>();

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

  const voucherHandler: EntryHandler = (ctx) =>
    guarded(ctx, async () => {
      const t = deps.tables();
      if (!t) return { ok: false, detail: 'TALLY_UNREACHABLE', message: 'The local copy of the company is not ready yet. The entry will be tried again.' };
      const lk = lookupFromTables(t, deps.quotationVoucherTypeGuid?.() ?? null);
      const env = ctx.envelope;
      const built = buildVoucherImport({ ...env, data: env.data }, lk, {}, deps.flags?.());
      const id = env.client_request_id;

      // duplicate guard on the voucher number (vault view)
      const d = env.data as { number?: string; voucher_type_guid?: string };
      if (d.number && d.voucher_type_guid) {
        const clash = (t.tx_voucher ?? []).find((v) => String(v['voucher_type_guid']) === d.voucher_type_guid && norm(String(v['number'] ?? '')) === norm(d.number as string) && String(v['remote_id'] ?? '') !== id);
        if (clash) return { ok: false, detail: 'VOUCHER_NUMBER_EXISTS', message: `Voucher number ${d.number} is already used for this voucher type.` };
      }

      // pre-check (every attempt); a throw here means nothing was posted
      const before = await findVoucherByRemoteId(deps.client, lk.company, id);
      if (before) {
        logger.info('entries', 'duplicate request found in Tally, not posting', { requestId: id, recovered: ctx.recovered });
        return { ok: true, guid: before.guid, voucher_number: before.voucherNumber || undefined, alter_id: before.alterId ?? undefined, message: 'DUPLICATE_CLIENT_REQUEST: already in Tally.' };
      }

      const res = await deps.client.importData(built.xml, { priority: 'entry' });
      if (!res.ok) {
        // Tally refused or answered unclearly. An unclear answer may still have created it: look before declaring anything.
        if (res.ambiguous) {
          const late = await findVoucherByRemoteId(deps.client, lk.company, id);
          if (late) return { ok: true, guid: late.guid, voucher_number: late.voucherNumber || undefined, alter_id: late.alterId ?? undefined, message: 'Posted (confirmed by read-back).' };
        }
        return failure(res, deps.mapMessage);
      }
      let found = await findVoucherByRemoteId(deps.client, lk.company, id);
      if (!found && res.created === 1 && res.lastVchId) {
        found = await findVoucherByRemoteId(deps.client, lk.company, id, res.lastVchId); // assumed fallback: REMOTEID not echoed (TW-ENTRY-REMOTEID)
        if (found) logger.warn('entries', 'REMOTEID not echoed by Tally, confirmed by master id', { requestId: id });
      }
      if (!found) return { ok: false, detail: 'AMBIGUOUS_RESULT', message: 'Tally accepted the entry but it could not be read back. Check Tally, then act in the review queue.' };
      return { ok: true, guid: found.guid, voucher_number: found.voucherNumber || undefined, alter_id: found.alterId ?? undefined };
    });

  const masterHandler: EntryHandler = (ctx) =>
    guarded(ctx, async () => {
      const t = deps.tables();
      if (!t) return { ok: false, detail: 'TALLY_UNREACHABLE', message: 'The local copy of the company is not ready yet. The entry will be tried again.' };
      const lk = masterLookupFromTables(t, deps.quotationVoucherTypeGuid?.() ?? null);
      const env = ctx.envelope;
      const kind = env.kind as MasterKind;
      const built = buildMasterImport({ ...env, data: env.data }, lk, deps.flags?.());
      if (built.duplicateOf) return { ok: true, guid: built.duplicateOf.guid, message: 'DUPLICATE_CLIENT_REQUEST: already in Tally.' };
      const id = env.client_request_id;
      // pre-check in Tally itself: the vault can be stale. A master of that name that appeared while this very entry was being posted is ours.
      const there = await findMasterByName(deps.client, lk.company, kind, built.masterName);
      if (there) {
        if (ctx.recovered) {
          logger.info('entries', 'recovered master found in Tally, not posting', { requestId: id });
          return { ok: true, guid: there.guid, message: 'DUPLICATE_CLIENT_REQUEST: already in Tally.' };
        }
        return { ok: false, detail: 'MASTER_EXISTS', message: `A ${kind === 'ledger' ? 'ledger' : 'stock item'} with this name already exists in Tally; choose another name.` };
      }
      const res = await deps.client.importData(built.xml, { priority: 'entry' });
      if (!res.ok) {
        if (res.ambiguous) {
          const late = await findMasterByName(deps.client, lk.company, kind, built.masterName);
          if (late) return { ok: true, guid: late.guid, message: 'Created (confirmed by read-back).' };
        }
        return failure(res, deps.mapMessage);
      }
      const found = await findMasterByName(deps.client, lk.company, kind, built.masterName);
      if (!found) return { ok: false, detail: 'AMBIGUOUS_RESULT', message: 'Tally accepted the master but it could not be read back. Check Tally, then act in the review queue.' };
      return { ok: true, guid: found.guid };
    });

  const handlers: Partial<Record<EntryKind, EntryHandler>> = { ledger: masterHandler, stock_item: masterHandler };
  for (const k of VOUCHER_KINDS as readonly VoucherKind[]) handlers[k] = voucherHandler;
  return handlers;
}
