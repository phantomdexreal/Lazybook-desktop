/*
LazyBooks | src/main/tally/vouchers/index.ts
Responsibility: Vouchers pull: full window, incremental by AlterID, plus the always-re-read lookback window, mapped to the tx_* tables
Introduced by: Phase 11 (tally-vouchers)
STATUS: IMPLEMENTED (Phase 11)
Reads through the Phase 8 client only (serialised queue, 'sync' priority). No Electron import: testable from Node.
The cursor (highest stored alter_id) is passed in by the caller; the vault that stores it is Phase 15/16 and the scheduler Phase 18.
Deletion detection is Phase 12 (not here).
*/

import { VOUCHER_BATCH } from '../../../shared/constants';
import { logger } from '../../logger';
import { TallyError, type TallyClient } from '../client';
import type { Row } from '../xml';
import { textOf, type MasterTables } from '../masters/map';
import { VOUCHER_TABLES } from './columns';
import { mapVouchers, type VoucherTables } from './map';
import { createPaging } from './paging';

export { mapVouchers, emptyVoucherTables, type VoucherTables } from './map';
export { VOUCHER_TABLES } from './columns';

export const REQ_VOUCHERS = 'LBVouchers';

/**
 * One voucher request per calendar month, not one for the whole financial year: a year of vouchers with every nested list
 * (ledger entries, inventory, batches, bills) can take Tally minutes, and Tally serves one request at a time, so a single huge
 * export times out and the repeated attempts then pile up behind each other. The proven predecessor also read vouchers in small
 * pages with a 3 minute timeout.
 */
export const VOUCHER_TIMEOUT_MS = VOUCHER_BATCH.voucherTimeoutS * 1000;
/** A chunk that still times out is cut in half this many times at most (a month becomes about 4 days). */
const MAX_SPLITS = 3;
/** Pause before reading the smaller halves, so Tally can finish the abandoned request first. */
const SPLIT_PAUSE_MS = VOUCHER_BATCH.splitPauseS * 1000;

/** NATIVEMETHOD fields (simple tags of tx_voucher) and FETCH lists (everything nested). Request id/type come from data_model. */
export function buildVoucherRequest(): { id: string; type: string; fields: string[]; fetch: string[] } {
  const spec = VOUCHER_TABLES.tx_voucher;
  const fields: string[] = ['MASTERID'];
  const fetch: string[] = [
    'ALLLEDGERENTRIES.LIST', 'LEDGERENTRIES.LIST', 'ALLINVENTORYENTRIES.LIST', 'INVENTORYENTRIES.LIST', 'INVENTORYENTRIESOUT.LIST',
    'INVENTORYENTRIESIN.LIST', 'ACCOUNTINGALLOCATIONS.LIST', 'BATCHALLOCATIONS.LIST', 'BILLALLOCATIONS.LIST', 'BASICUSERDESCRIPTION.LIST',
  ];
  for (const c of spec.columns) {
    if (!c.tag || c.tag.startsWith('@')) continue;
    const nested = c.tag.includes('/') || c.tag.endsWith('.LIST');
    const tag = nested ? c.tag.split('/')[0] : c.tag;
    const target = nested ? fetch : fields;
    if (!target.includes(tag)) target.push(tag);
  }
  return { id: spec.request ?? REQ_VOUCHERS, type: spec.type ?? 'Voucher', fields, fetch };
}

export interface PullOptions {
  /** Date window, inclusive, ISO `YYYY-MM-DD` (normally the company financial year). */
  from: string;
  to: string;
  /** Highest alter_id already stored for this company. Omit (or null) for a full window pull. */
  sinceAlterId?: number | null;
  /** Also re-read the last N days by date to catch edits that kept an old AlterID (constants sync.lookback_days_default). 0 = off. */
  lookbackDays?: number;
  /** ISO date treated as today for the lookback window (tests). */
  today?: string;
}

export interface VouchersResult {
  mode: 'full' | 'incremental';
  tables: VoucherTables;
  /** Highest alter_id seen in this pull (max with the cursor); the caller stores it after a successful commit. */
  maxAlterId: number;
  /** guids of the vouchers in this pull */
  guids: string[];
  counts: Record<string, number>;
}

/** One date range of a batched run; `narrow` is true when the `$AlterID > cursor` filter applies (false for the lookback re-read). */
export type BatchWindow = [from: string, to: string, narrow: boolean];

export interface BatchInfo {
  windowIndex: number;
  windowCount: number;
  windowFrom: string;
  windowTo: string;
  /** Position of this page inside its window, and where the next page starts. */
  start: number;
  nextStart: number;
  /** Page size asked for, and the size in use (lower after an adaptive backoff). */
  size: number;
  effectiveSize: number;
  /** Vouchers in this batch, and vouchers read so far in the run (including those of a resumed run). */
  count: number;
  done: number;
  /** True once Tally was found to ignore the paging filter: the rest of the run reads whole month windows. */
  pagingIgnored: boolean;
}

export interface BatchedPullOptions extends PullOptions {
  /** Vouchers per request (the user setting, or the size stored in a checkpoint). */
  size: number;
  /** Continue a run that stopped: its windows, the window and page position reached, and the vouchers already read. */
  resume?: { windows: BatchWindow[]; windowIndex: number; nextStart: number; done: number; total: number | null };
  /** Ask Tally for the total first (progress bar). A failed count is not an error: the total stays null. Default true. */
  count?: boolean;
  /** Called once, before the first batch, with the windows of the run and the total (null when unknown). */
  onStart?: (info: { windows: BatchWindow[]; total: number | null; size: number }) => void | Promise<void>;
  /** Called after every batch with ITS mapped tables only; nothing is kept here. If it throws, the run stops (nothing half-applied: the caller owns the staging). */
  onBatch: (tables: VoucherTables, info: BatchInfo) => void | Promise<void>;
  /** Called when a whole window has been read. */
  onWindowDone?: (info: { windowIndex: number; windowCount: number; done: number }) => void | Promise<void>;
}

export interface BatchedResult {
  mode: 'full' | 'incremental';
  windows: BatchWindow[];
  /** Vouchers read in this run, including those a resumed run had already read. */
  done: number;
  total: number | null;
  effectiveSize: number;
  pagingIgnored: boolean;
}

export interface VoucherDeps {
  client: TallyClient;
  /** Test hook for the pause after a timeout. */
  sleep?: (ms: number) => Promise<void>;
  /** Pause between two pages of a batched pull (default `VOUCHER_BATCH.voucherBatchPauseMs`). */
  pauseMs?: number;
  getCompanyName: () => string | null;
  getCompanyGuid: () => string | null;
  getCompanyState: () => string;
  /** Masters of the selected company (Phase 10 `masters.last()?.tables`). Required: names are resolved against them. */
  getMasters: () => MasterTables | null;
  onPulled?: (r: VouchersResult) => void;
}

export interface Vouchers {
  pull(opts: PullOptions): Promise<VouchersResult>;
  /** Phase 45: the same window and filters as `pull`, read page by page (`size` vouchers per request), each page mapped and handed to `onBatch`. */
  pullBatched(opts: BatchedPullOptions): Promise<BatchedResult>;
  last(): VouchersResult | null;
}

const ymd = (iso: string): string => iso.replace(/-/g, '');
const ISO = /^\d{4}-\d{2}-\d{2}$/;

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
/** Calendar-month ranges covering [from, to], inclusive, ISO dates. */
export function monthChunks(from: string, to: string): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  let start = from;
  while (start <= to) {
    const d = new Date(`${start}T00:00:00Z`);
    const endOfMonth = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).toISOString().slice(0, 10);
    const end = endOfMonth < to ? endOfMonth : to;
    out.push([start, end]);
    start = addDays(end, 1);
  }
  return out;
}
function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
}
function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const rowDate = (r: Row): string => {
  const t = textOf(r['DATE'] as string);
  return /^\d{8}/.test(t) ? `${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}` : '';
};

/** The windows of a run: calendar months of the date window (narrowed by the cursor when incremental), then the lookback months (not narrowed). Pure. */
export function planWindows(opts: PullOptions, localToday_ = localToday): BatchWindow[] {
  const cursor = opts.sinceAlterId ?? null;
  const incremental = cursor !== null && cursor >= 0;
  const out: BatchWindow[] = monthChunks(opts.from, opts.to).map(([f, t]) => [f, t, incremental] as BatchWindow);
  const lookback = opts.lookbackDays ?? 0;
  if (incremental && lookback > 0) {
    const today = opts.today ?? localToday_();
    const lf = addDays(today, -lookback);
    const lbFrom = lf < opts.from ? opts.from : lf;
    const lbTo = today > opts.to ? opts.to : today;
    if (lbFrom <= lbTo) for (const [cf, ct] of monthChunks(lbFrom, lbTo)) out.push([cf, ct, false]);
  }
  return out;
}

export function createVouchers(deps: VoucherDeps): Vouchers {
  let lastResult: VouchersResult | null = null;
  const req = buildVoucherRequest();

  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));

  /** Read one date range; when Tally times out, wait, then read the two halves (up to MAX_SPLITS levels). */
  async function read(company: string, from: string, to: string, alterAbove: number | null, depth = 0): Promise<Row[]> {
    try {
      return await readOnce(company, from, to, alterAbove);
    } catch (e) {
      const timedOut = e instanceof TallyError && e.detail === 'TALLY_TIMEOUT';
      if (!timedOut || depth >= MAX_SPLITS || from >= to) throw e;
      const mid = addDays(from, Math.floor(daysBetween(from, to) / 2));
      logger.warn('tally', 'voucher range timed out, reading it in halves', { from, to, depth });
      await sleep(SPLIT_PAUSE_MS);
      const first = await read(company, from, mid, alterAbove, depth + 1);
      const second = await read(company, addDays(mid, 1), to, alterAbove, depth + 1);
      return [...first, ...second];
    }
  }

  async function readOnce(company: string, from: string, to: string, alterAbove: number | null): Promise<Row[]> {
    const filters = alterAbove !== null ? [{ name: 'LBChanged', formula: `$AlterID > ${Math.trunc(alterAbove)}` }] : undefined;
    const rows = await deps.client.collection(req.id, req.fields, {
      type: req.type, fetch: req.fetch, filters, company, fromDate: ymd(from), toDate: ymd(to), timeoutMs: VOUCHER_TIMEOUT_MS, retries: 0,
    });
    // the window is also enforced here, so a Tally build that ignores SVFROMDATE/SVTODATE cannot leak other periods
    return rows.filter((r) => {
      const d = rowDate(r);
      return d === '' || (d >= from && d <= to);
    });
  }

  return {
    async pull(opts) {
      if (!ISO.test(opts.from) || !ISO.test(opts.to) || opts.from > opts.to) throw new Error('Invalid voucher date window');
      const company = deps.getCompanyName();
      if (!company) throw new Error('No company selected');
      const companyGuid = deps.getCompanyGuid();
      if (!companyGuid) throw new Error('Company record not read yet');
      const masters = deps.getMasters();
      if (!masters) throw new Error('Masters not pulled yet');
      const started = Date.now();
      const cursor = opts.sinceAlterId ?? null;
      const incremental = cursor !== null && cursor >= 0;

      const byGuid = new Map<string, Row>();
      const put = (rows: Row[]): void => {
        for (const r of rows) {
          const g = textOf(r['GUID'] as string);
          if (g !== '') byGuid.set(g, r); // later reads win; the lookback read sees the same data
        }
      };
      for (const [cf, ct] of monthChunks(opts.from, opts.to)) put(await read(company, cf, ct, incremental ? cursor : null));
      const lookback = opts.lookbackDays ?? 0;
      if (incremental && lookback > 0) {
        const today = opts.today ?? localToday();
        const lf = addDays(today, -lookback);
        const lbFrom = lf < opts.from ? opts.from : lf;
        const lbTo = today > opts.to ? opts.to : today;
        if (lbFrom <= lbTo) for (const [cf, ct] of monthChunks(lbFrom, lbTo)) put(await read(company, cf, ct, null));
      }
      const rows = [...byGuid.values()];
      const tables = mapVouchers({ rows, companyGuid, companyState: deps.getCompanyState(), masters });
      let maxAlterId = cursor ?? 0;
      for (const v of tables.tx_voucher) maxAlterId = Math.max(maxAlterId, Number(v.alter_id) || 0);
      const counts: Record<string, number> = {};
      for (const [t, r] of Object.entries(tables)) counts[t] = r.length;
      lastResult = { mode: incremental ? 'incremental' : 'full', tables, maxAlterId, guids: tables.tx_voucher.map((v) => String(v.guid)), counts };
      logger.info('tally', 'vouchers pulled', { mode: lastResult.mode, ms: Date.now() - started, max_alter_id: maxAlterId, counts });
      deps.onPulled?.(lastResult);
      return lastResult;
    },
    async pullBatched(opts) {
      if (!ISO.test(opts.from) || !ISO.test(opts.to) || opts.from > opts.to) throw new Error('Invalid voucher date window');
      if (!Number.isInteger(opts.size) || opts.size < 1) throw new Error('Invalid batch size');
      const company = deps.getCompanyName();
      if (!company) throw new Error('No company selected');
      const companyGuid = deps.getCompanyGuid();
      if (!companyGuid) throw new Error('Company record not read yet');
      const masters = deps.getMasters();
      if (!masters) throw new Error('Masters not pulled yet');
      const started = Date.now();
      const cursor = opts.sinceAlterId ?? null;
      const incremental = cursor !== null && cursor >= 0;
      // one reader per run: the reduced size and the "paging ignored" latch last for this run only
      const paging = createPaging({ client: deps.client, sleep: deps.sleep, pauseMs: deps.pauseMs });
      const windows = opts.resume ? opts.resume.windows : planWindows(opts);

      let total: number | null = opts.resume ? opts.resume.total : null;
      if (!opts.resume && opts.count !== false) {
        try {
          total = await paging.countWindow(company, opts.from, opts.to, incremental ? cursor : null);
        } catch (e) {
          logger.warn('tally', 'voucher count failed, progress will have no total', { message: (e as Error).message });
        }
      }
      await opts.onStart?.({ windows, total, size: opts.size });

      let done = opts.resume ? opts.resume.done : 0;
      let effectiveSize = opts.size;
      const firstWindow = opts.resume ? opts.resume.windowIndex : 0;
      for (let wi = firstWindow; wi < windows.length; wi += 1) {
        const [wf, wt, narrow] = windows[wi] as BatchWindow;
        const w = await paging.readWindow({
          company, from: wf, to: wt, alterAbove: narrow ? cursor : null, size: opts.size,
          startAt: wi === firstWindow && opts.resume ? opts.resume.nextStart : 0,
          onPage: async (rows, page) => {
            const own = rows.filter((r) => textOf(r['GUID'] as string) !== '');
            const tables = mapVouchers({ rows: own, companyGuid, companyState: deps.getCompanyState(), masters });
            done += own.length;
            const st = paging.state();
            effectiveSize = st.effectiveSize ?? opts.size;
            await opts.onBatch(tables, {
              windowIndex: wi, windowCount: windows.length, windowFrom: wf, windowTo: wt, start: page.start, nextStart: page.start + page.size, // a short page is the last of its window, so the overshoot is never used
              size: opts.size, effectiveSize, count: own.length, done, pagingIgnored: st.pagingIgnored,
            });
          },
        });
        effectiveSize = w.effectiveSize;
        await opts.onWindowDone?.({ windowIndex: wi, windowCount: windows.length, done });
      }
      const st = paging.state();
      logger.info('tally', 'vouchers pulled in batches', { mode: incremental ? 'incremental' : 'full', ms: Date.now() - started, windows: windows.length, done, total, size: opts.size, effective_size: st.effectiveSize ?? opts.size, paging_ignored: st.pagingIgnored });
      return { mode: incremental ? 'incremental' : 'full', windows, done, total, effectiveSize: st.effectiveSize ?? opts.size, pagingIgnored: st.pagingIgnored };
    },
    last: () => lastResult,
  };
}
