/*
LazyBooks | src/main/tally/vouchers/paging.ts
Responsibility: Paged voucher reads (vouchers start+1 to start+size), voucher counting, paging-ignored detection, adaptive page size
Introduced by: Phase 44 (tally-paging) — docs/specs/voucher-batching.md sections 3, 4, 7, 8
STATUS: IMPLEMENTED (Phase 44)
Reads through the Phase 8 client only, with the existing voucher request, fields and fetch list unchanged (`buildVoucherRequest`).
Nothing here is called by the scheduler yet (Phase 45). No Electron import: testable from Node.

Paging recipe (ASSUMED, TW-PAGING-01: verify on a real Tally): the collection carries one number variable `LBPageNo` that grows by one for
every voucher the collection looks at, and a filter `LBPageKeep` that keeps a voucher only when `start < LBPageNo <= start + size`. The filter is
listed AFTER the narrowing filter (`LBChanged`, `$AlterID > N`) so the counter only counts vouchers that passed it; the date window is applied by
Tally through the static variables before any filter runs.
*/

import { VOUCHER_BATCH } from '../../../shared/constants';
import { logger } from '../../logger';
import { TallyError, type TallyClient } from '../client';
import { textOf } from '../masters/map';
import type { Row } from '../xml';
import { buildVoucherRequest, monthChunks, VOUCHER_TIMEOUT_MS } from './index';

export const PAGE_VAR = 'LBPageNo';
export const PAGE_FILTER = 'LBPageKeep';
/** Request id of the light guid list (same id the Phase 14 guard and the Phase 12 deleted check use). */
export const REQ_COUNT = 'LBVoucherGuids';

const ymd = (iso: string): string => iso.replace(/-/g, '');
const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** The compute variable and filter that make a request return vouchers `start + 1` to `start + size` only. Pure. */
export function pagingParts(start: number, size: number): {
  computeVars: Array<{ name: string; formula: string }>;
  pageFilter: { name: string; formula: string };
} {
  if (!Number.isInteger(start) || start < 0) throw new Error('Invalid page start');
  if (!Number.isInteger(size) || size < 1) throw new Error('Invalid page size');
  return {
    computeVars: [{ name: PAGE_VAR, formula: `Number : ##${PAGE_VAR} + 1` }],
    pageFilter: { name: PAGE_FILTER, formula: `##${PAGE_VAR} > ${start} AND ##${PAGE_VAR} <= ${start + size}` },
  };
}

export interface PageResult {
  /** Rows kept after the date window check (same check as the plain read). */
  rows: Row[];
  /** Rows Tally returned, before that check. The last-page decision uses this number. */
  rawCount: number;
  firstGuid: string | null;
  /** True when this page is the last one (fewer rows than asked for). */
  last: boolean;
  /** True when Tally returned more rows than asked for: it did not honour the paging filter. */
  oversize: boolean;
}

export interface PagingDeps {
  client: TallyClient;
  /** Test hook for every pause (after a timeout, between pages). */
  sleep?: (ms: number) => Promise<void>;
  /** Pause between two pages; default `VOUCHER_BATCH.voucherBatchPauseMs`. */
  pauseMs?: number;
  /** Pause after a timeout; default `VOUCHER_BATCH.splitPauseS * 1000`. */
  timeoutPauseMs?: number;
  /** Lowest page size adaptive backoff may reach; default `VOUCHER_BATCH.adaptiveFloor`. */
  floor?: number;
}

export interface WindowReadOptions {
  company: string;
  from: string;
  to: string;
  /** Narrow to vouchers with `$AlterID` above this (incremental pull); null for none. */
  alterAbove: number | null;
  /** Wanted page size (the user setting, or the size stored in a checkpoint). */
  size: number;
  /** First page start, to resume inside a window (default 0). */
  startAt?: number;
  /** Called after every page with that page's rows. When given, rows are NOT kept in memory and `rows` of the result stays empty. */
  onPage?: (rows: Row[], info: { start: number; size: number; index: number }) => void | Promise<void>;
}

export interface WindowReadResult {
  /** All rows of the window (empty when `onPage` was given). */
  rows: Row[];
  /** Rows seen (after the window check), counted whether or not they were kept. */
  count: number;
  pages: number;
  /** Position reached: the next page would start here. */
  nextStart: number;
  /** Page size in use at the end (lower than asked after a timeout). */
  effectiveSize: number;
  /** True when this window (or an earlier one of the same reader) found that Tally ignores paging. */
  pagingIgnored: boolean;
}

export interface Paging {
  /** One request: vouchers `start + 1` to `start + size` of the window. Throws `TallyError` as the client does. */
  readPage(company: string, from: string, to: string, start: number, size: number, alterAbove: number | null): Promise<PageResult>;
  /** All pages of one window, with adaptive size, the paging-ignored fallback and a pause between pages. */
  readWindow(o: WindowReadOptions): Promise<WindowReadResult>;
  /** Number of vouchers dated inside the window (guid list; per month when the whole window times out). Optional narrowing by `$AlterID`. */
  countWindow(company: string, from: string, to: string, alterAbove?: number | null): Promise<number>;
  /** Run state: the size in use and whether paging was found ignored. A reader is meant to live for one sync run. */
  state(): { effectiveSize: number | null; pagingIgnored: boolean };
}

const isTimeout = (e: unknown): boolean => e instanceof TallyError && e.detail === 'TALLY_TIMEOUT';

export function createPaging(deps: PagingDeps): Paging {
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  const pauseMs = deps.pauseMs ?? VOUCHER_BATCH.voucherBatchPauseMs;
  const timeoutPauseMs = deps.timeoutPauseMs ?? VOUCHER_BATCH.splitPauseS * 1000;
  const floor = deps.floor ?? VOUCHER_BATCH.adaptiveFloor;
  let req: ReturnType<typeof buildVoucherRequest> | null = null; // built on first use (this module and ./index import each other)
  let effective: number | null = null;
  let ignored = false;

  const guidOf = (r: Row): string => textOf(r['GUID'] as string);
  const dateOf = (r: Row): string => {
    const t = textOf(r['DATE'] as string);
    return /^\d{8}/.test(t) ? `${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}` : '';
  };
  const inWindow = (rows: Row[], from: string, to: string): Row[] =>
    rows.filter((r) => {
      const d = dateOf(r);
      return d === '' || (d >= from && d <= to);
    });

  /** The existing voucher request, optionally with the paging parts; everything else exactly as the plain read. */
  async function request(company: string, from: string, to: string, alterAbove: number | null, page: { start: number; size: number } | null): Promise<Row[]> {
    req ??= buildVoucherRequest();
    const filters: Array<{ name: string; formula: string }> = [];
    if (alterAbove !== null) filters.push({ name: 'LBChanged', formula: `$AlterID > ${Math.trunc(alterAbove)}` });
    let computeVars: Array<{ name: string; formula: string }> | undefined;
    if (page) {
      const p = pagingParts(page.start, page.size);
      computeVars = p.computeVars;
      filters.push(p.pageFilter); // after the narrowing filter: order matters (TW-PAGING-01)
    }
    return deps.client.collection(req.id, req.fields, {
      type: req.type, fetch: req.fetch, filters: filters.length > 0 ? filters : undefined, computeVars,
      company, fromDate: ymd(from), toDate: ymd(to), timeoutMs: VOUCHER_TIMEOUT_MS, retries: 0,
    });
  }

  async function readPage(company: string, from: string, to: string, start: number, size: number, alterAbove: number | null): Promise<PageResult> {
    if (!ISO.test(from) || !ISO.test(to) || from > to) throw new Error('Invalid voucher date window');
    const raw = await request(company, from, to, alterAbove, { start, size });
    const first = raw.length > 0 ? guidOf(raw[0] as Row) : '';
    return { rows: inWindow(raw, from, to), rawCount: raw.length, firstGuid: first !== '' ? first : null, last: raw.length < size, oversize: raw.length > size };
  }

  async function readWindow(o: WindowReadOptions): Promise<WindowReadResult> {
    if (!ISO.test(o.from) || !ISO.test(o.to) || o.from > o.to) throw new Error('Invalid voucher date window');
    if (!Number.isInteger(o.size) || o.size < 1) throw new Error('Invalid page size');
    const keep: Row[] = [];
    let count = 0;
    let pages = 0;
    let start = o.startAt ?? 0;
    let size = effective === null ? o.size : Math.min(effective, o.size);
    const emit = async (rows: Row[], at: number, sz: number): Promise<void> => {
      count += rows.length;
      if (o.onPage) await o.onPage(rows, { start: at, size: sz, index: pages });
      else keep.push(...rows);
    };
    const result = (): WindowReadResult => ({ rows: keep, count, pages, nextStart: start, effectiveSize: size, pagingIgnored: ignored });

    // an earlier window of this run found that Tally ignores paging: read the plain window (the month-window behaviour)
    if (ignored) {
      const rows = inWindow(await request(o.company, o.from, o.to, o.alterAbove, null), o.from, o.to);
      await emit(rows, 0, rows.length);
      pages += 1;
      return result();
    }

    let prevFirst: string | null = null;
    let timeoutsAtFloor = 0;
    for (;;) {
      let page: PageResult;
      try {
        page = await readPage(o.company, o.from, o.to, start, size, o.alterAbove);
        timeoutsAtFloor = 0;
      } catch (e) {
        if (!isTimeout(e)) throw e;
        // Tally keeps working on the abandoned request: wait, then read the SAME page again with half the size
        if (size <= floor) {
          timeoutsAtFloor += 1;
          if (timeoutsAtFloor >= 2) {
            logger.warn('tally', 'voucher page timed out twice at the smallest size', { start, size });
            throw e;
          }
        }
        const next = Math.max(floor, Math.floor(size / 2));
        logger.warn('tally', 'voucher page timed out, reading it again with a smaller size', { start, size, next });
        await sleep(timeoutPauseMs);
        size = next;
        effective = size;
        continue;
      }

      // Tally ignoring the paging filter: more rows than asked, or the same first voucher on two different pages
      const repeated = pages > 0 && page.firstGuid !== null && page.firstGuid === prevFirst;
      if (page.oversize || repeated) {
        ignored = true;
        logger.warn('tally', 'paging ignored', { start, size, rows: page.rawCount, repeated });
        if (repeated) return result(); // those rows were already delivered by the earlier page
        await emit(page.rows, start, page.rawCount);
        pages += 1;
        start += page.rawCount;
        return result(); // oversize: this answer already holds the whole window
      }

      await emit(page.rows, start, size);
      pages += 1;
      start += page.rawCount;
      prevFirst = page.firstGuid;
      if (page.last) return result();
      await sleep(pauseMs);
    }
  }

  async function countOnce(company: string, from: string, to: string, alterAbove: number | null): Promise<Set<string>> {
    const rows = await deps.client.collection(REQ_COUNT, ['GUID', 'ALTERID'], {
      type: 'Voucher', company, fromDate: ymd(from), toDate: ymd(to), timeoutMs: VOUCHER_TIMEOUT_MS, retries: 0,
    });
    const guids = new Set<string>();
    for (const r of rows) {
      const g = guidOf(r);
      if (g === '') continue;
      if (alterAbove !== null && !(Number(textOf(r['ALTERID'] as string)) > alterAbove)) continue;
      guids.add(g);
    }
    return guids;
  }

  async function countWindow(company: string, from: string, to: string, alterAbove: number | null = null): Promise<number> {
    if (!ISO.test(from) || !ISO.test(to) || from > to) throw new Error('Invalid voucher date window');
    try {
      return (await countOnce(company, from, to, alterAbove)).size;
    } catch (e) {
      const months = monthChunks(from, to);
      if (!isTimeout(e) || months.length < 2) throw e;
      logger.warn('tally', 'voucher count timed out, counting month by month', { from, to, months: months.length });
      await sleep(timeoutPauseMs);
      let total = 0;
      for (const [mf, mt] of months) {
        total += (await countOnce(company, mf, mt, alterAbove)).size; // a voucher has one date, so months never overlap
        await sleep(pauseMs);
      }
      return total;
    }
  }

  return { readPage, readWindow, countWindow, state: () => ({ effectiveSize: effective, pagingIgnored: ignored }) };
}
