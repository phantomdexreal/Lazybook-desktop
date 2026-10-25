/*
LazyBooks | src/main/tally/closing.ts
Responsibility: Closing balances + Tally-computed reports (closing values taken from Tally, never recomputed)
Introduced by: Phase 13 (tally-closing)
STATUS: IMPLEMENTED (Phase 13)
Reads through the Phase 8 client only (serialised queue, 'sync' priority). No Electron import: testable from Node.
Storing the result is Phase 15/16 (vault); the 24 h timer and the after-sync trigger are Phase 18 (`closingDue` is the helper).
*/

import { logger } from '../logger';
import type { TallyClient } from './client';
import type { Row } from './xml';
import { canon, pathText, listRows, ratio2, toScaled, fromScaled, type TableRow } from './masters/map';

/** Request ids (assumed, TW items): small collections carrying only identity + closing fields. */
export const REQ_CLOSING_GROUPS = 'LBClosingGroups';
export const REQ_CLOSING_LEDGERS = 'LBClosingLedgers';
export const REQ_CLOSING_STOCK = 'LBClosingStock';
/** constants.json desktop.closing_balance_interval_h */
export const CLOSING_INTERVAL_H = 24;

export interface ChangeOp {
  table_name: string;
  op: 'delete_children' | 'delete' | 'upsert';
  payload: Array<Record<string, unknown>>;
}

export interface GroupClosing { guid: string; name: string; closing_balance: string; opening_balance: string | null }
export interface LedgerClosing { guid: string; name: string; closing_balance: string }
export interface StockClosing { guid: string; name: string; closing_qty: string; closing_value: string }
/** Amount Tally reports as On Account for a ledger (signed as Tally gives it). */
export interface OnAccount { ledger_guid: string; ledger_name: string; amount: string }

export interface ClosingReading {
  asOf: string;
  groups: GroupClosing[];
  ledgers: LedgerClosing[];
  stock: StockClosing[];
  onAccount: OnAccount[];
}

export interface StoredMasters {
  tm_group: TableRow[];
  tm_ledger: TableRow[];
  tm_stock_item: TableRow[];
}

export interface ClosingApplied {
  tables: StoredMasters;
  /** Rows whose closing figures changed (or all rows when `force`). Keys: `tm_group`, `tm_ledger`, `tm_stock_item`. */
  changed: Record<string, number>;
  /** Tally rows with no stored master (the next master refresh will bring them). */
  unmatched: Record<string, number>;
  ops: ChangeOp[];
}

const cleanAmount = (text: string): string | null => {
  const t = text.trim();
  return t === '' ? null : canon(t.split(/\s+/)[0]);
};
const qtyOf = (text: string): string | null => {
  const t = text.trim();
  return t === '' ? null : canon(t.split(/\s+/)[0]);
};
const nameOf = (r: Row): string => (typeof r['@NAME'] === 'string' ? (r['@NAME'] as string).trim() : '');
const keyOf = (guid: string, name: string): string => (guid !== '' ? guid : `n:${name}`);

/** True when the periodic refresh should run. Times are epoch milliseconds. */
export function closingDue(o: { lastRefreshedAt: number | null; now: number; syncChangedVouchers?: boolean; intervalH?: number }): boolean {
  if (o.syncChangedVouchers || o.lastRefreshedAt === null) return true;
  return o.now - o.lastRefreshedAt >= (o.intervalH ?? CLOSING_INTERVAL_H) * 3600_000;
}

/** Pure: map the three closing answers. Objects without a name are skipped; absent figures read as 0.00. */
export function mapClosing(input: { groups: Row[]; ledgers: Row[]; stock: Row[]; asOf: string }): ClosingReading {
  const groups: GroupClosing[] = [];
  for (const r of input.groups) {
    const name = nameOf(r);
    if (!name) continue;
    groups.push({
      guid: keyOf(pathText(r, 'GUID'), name),
      name,
      closing_balance: cleanAmount(pathText(r, 'CLOSINGBALANCE')) ?? '0.00',
      opening_balance: cleanAmount(pathText(r, 'OPENINGBALANCE')),
    });
  }
  const ledgers: LedgerClosing[] = [];
  const onAccount: OnAccount[] = [];
  for (const r of input.ledgers) {
    const name = nameOf(r);
    if (!name) continue;
    const guid = keyOf(pathText(r, 'GUID'), name);
    ledgers.push({ guid, name, closing_balance: cleanAmount(pathText(r, 'CLOSINGBALANCE')) ?? '0.00' });
    // On Account: bill allocations Tally itself marks as On Account (BILLTYPE, TW-ONACCOUNT assumed); summed per ledger.
    let sum = 0n;
    let any = false;
    for (const b of listRows(r, 'BILLALLOCATIONS.LIST')) {
      if (pathText(b, 'BILLTYPE').trim().toLowerCase() !== 'on account') continue;
      const v = toScaled(cleanAmount(pathText(b, 'CLOSINGBALANCE') || pathText(b, 'AMOUNT')) ?? '');
      if (v !== null) { sum += v; any = true; }
    }
    if (any) onAccount.push({ ledger_guid: guid, ledger_name: name, amount: fromScaled(sum) });
  }
  const stock: StockClosing[] = [];
  for (const r of input.stock) {
    const name = nameOf(r);
    if (!name) continue;
    stock.push({
      guid: keyOf(pathText(r, 'GUID'), name),
      name,
      closing_qty: qtyOf(pathText(r, 'CLOSINGBALANCE')) ?? '0.00',
      closing_value: cleanAmount(pathText(r, 'CLOSINGVALUE')) ?? '0.00',
    });
  }
  return { asOf: input.asOf, groups, ledgers, stock, onAccount };
}

/**
 * Pure: write the closing figures onto stored master rows (matched by guid) and emit full-row upserts
 * for the rows that changed. Inputs are not mutated. Stock `closing_rate` follows the masters rule.
 */
export function applyClosing(stored: StoredMasters, reading: ClosingReading, opts: { force?: boolean } = {}): ClosingApplied {
  const changed: Record<string, number> = { tm_group: 0, tm_ledger: 0, tm_stock_item: 0 };
  const unmatched: Record<string, number> = { tm_group: 0, tm_ledger: 0, tm_stock_item: 0 };
  const ops: ChangeOp[] = [];
  const out: StoredMasters = { tm_group: [], tm_ledger: [], tm_stock_item: [] };

  const run = (table: keyof StoredMasters, items: Array<{ guid: string }>, patch: (row: TableRow, item: never) => TableRow) => {
    const byGuid = new Map<string, unknown>(items.map((i) => [i.guid, i]));
    const seen = new Set<string>();
    const upserts: TableRow[] = [];
    for (const row of stored[table]) {
      const item = byGuid.get(String(row.guid));
      if (!item) { out[table].push(row); continue; }
      seen.add(String(row.guid));
      const next = patch({ ...row }, item as never);
      const same = Object.keys(next).every((k) => next[k] === row[k]);
      out[table].push(next);
      if (!same || opts.force) { upserts.push(next); changed[table]++; }
    }
    unmatched[table] = items.filter((i) => !seen.has(i.guid)).length;
    if (upserts.length) ops.push({ table_name: table, op: 'upsert', payload: upserts });
  };

  // Table order of SYNC_SPEC section 5: groups, ledgers, stock items.
  run('tm_group', reading.groups, (row, g: GroupClosing) => {
    row.closing_balance = g.closing_balance;
    if (g.opening_balance !== null) row.opening_balance = g.opening_balance;
    row.closing_as_of = reading.asOf;
    return row;
  });
  run('tm_ledger', reading.ledgers, (row, l: LedgerClosing) => {
    row.closing_balance = l.closing_balance;
    row.closing_as_of = reading.asOf;
    return row;
  });
  run('tm_stock_item', reading.stock, (row, s: StockClosing) => {
    row.closing_qty = s.closing_qty;
    row.closing_value = s.closing_value;
    row.closing_rate = ratio2(s.closing_value, s.closing_qty);
    row.closing_as_of = reading.asOf;
    return row;
  });
  return { tables: out, changed, unmatched, ops };
}

export interface GstHeadSummary {
  /** Sum of credit (positive) closing balances of the duty ledgers of this head (Tally sign: Cr positive). */
  credit: string;
  /** Absolute sum of debit (negative) closing balances. */
  debit: string;
  /** credit - debit (positive = payable, negative = input credit). */
  net: string;
  ledgers: number;
}
export interface GstSummaryInputs {
  heads: Record<string, GstHeadSummary>;
}

/**
 * GST summary inputs as Tally reports them: the closing balances of the duty ledgers, grouped by the
 * ledger's own `gst_duty_head` column (never by ledger name). No tax is recomputed here.
 */
export function gstSummaryInputs(ledgers: TableRow[]): GstSummaryInputs {
  const acc = new Map<string, { cr: bigint; dr: bigint; n: number }>();
  for (const l of ledgers) {
    const head = String(l.gst_duty_head ?? '').trim();
    if (!head) continue;
    const v = toScaled(String(l.closing_balance ?? '0'));
    if (v === null) continue;
    const a = acc.get(head) ?? { cr: 0n, dr: 0n, n: 0 };
    if (v >= 0n) a.cr += v; else a.dr += -v;
    a.n++;
    acc.set(head, a);
  }
  const heads: Record<string, GstHeadSummary> = {};
  for (const [h, a] of acc) heads[h] = { credit: fromScaled(a.cr), debit: fromScaled(a.dr), net: fromScaled(a.cr - a.dr), ledgers: a.n };
  return { heads };
}

export interface ClosingTotals {
  /** Primary-group closing sums by `nature` (asset, liability, income, expense), Tally sign kept. */
  byNature: Record<string, string>;
}

/** Sum the closing balances of root groups (no parent) by `nature`, exactly as Tally reports each group. */
export function groupTotalsByNature(groups: TableRow[]): ClosingTotals {
  const sums = new Map<string, bigint>();
  for (const g of groups) {
    if (String(g.parent_name ?? '') !== '') continue;
    const v = toScaled(String(g.closing_balance ?? '0'));
    if (v === null) continue;
    const n = String(g.nature ?? '');
    sums.set(n, (sums.get(n) ?? 0n) + v);
  }
  return { byNature: Object.fromEntries([...sums].map(([k, v]) => [k, fromScaled(v)])) };
}

export interface ClosingDeps {
  client: TallyClient;
  getCompanyName: () => string | null;
  /** ISO date the figures are read as of; default today (local). */
  getAsOf?: () => string;
  onRead?: (r: ClosingReading) => void;
}

export interface Closing {
  /** Read closing figures from Tally. Any Tally error aborts the whole read (no partial result). */
  read(): Promise<ClosingReading>;
  last(): ClosingReading | null;
}

const isoToday = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function createClosing(deps: ClosingDeps): Closing {
  let lastReading: ClosingReading | null = null;
  return {
    async read() {
      const company = deps.getCompanyName();
      if (!company) throw new Error('No company selected');
      const started = Date.now();
      const keep = (rows: Row[]) => rows.filter((r) => typeof r['@NAME'] === 'string');
      // one request at a time through the shared queue; a failure aborts the read
      const groups = keep(await deps.client.collection(REQ_CLOSING_GROUPS, ['GUID', 'CLOSINGBALANCE', 'OPENINGBALANCE'], { type: 'Group', company }));
      const ledgers = keep(await deps.client.collection(REQ_CLOSING_LEDGERS, ['GUID', 'CLOSINGBALANCE'], { type: 'Ledger', fetch: ['BILLALLOCATIONS.LIST'], company }));
      const stock = keep(await deps.client.collection(REQ_CLOSING_STOCK, ['GUID', 'CLOSINGBALANCE', 'CLOSINGVALUE'], { type: 'StockItem', company }));
      lastReading = mapClosing({ groups, ledgers, stock, asOf: deps.getAsOf?.() ?? isoToday() });
      logger.info('tally', 'closing read', {
        ms: Date.now() - started,
        groups: lastReading.groups.length,
        ledgers: lastReading.ledgers.length,
        stock: lastReading.stock.length,
        onAccount: lastReading.onAccount.length,
      });
      deps.onRead?.(lastReading);
      return lastReading;
    },
    last: () => lastReading,
  };
}
