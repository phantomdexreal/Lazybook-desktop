/*
LazyBooks | src/main/tally/vouchers/index.ts
Responsibility: Vouchers pull: full window, incremental by AlterID, plus the always-re-read lookback window, mapped to the tx_* tables
Introduced by: Phase 11 (tally-vouchers)
STATUS: IMPLEMENTED (Phase 11)
Reads through the Phase 8 client only (serialised queue, 'sync' priority). No Electron import: testable from Node.
The cursor (highest stored alter_id) is passed in by the caller; the vault that stores it is Phase 15/16 and the scheduler Phase 18.
Deletion detection is Phase 12 (not here).
*/

import { logger } from '../../logger';
import type { TallyClient } from '../client';
import type { Row } from '../xml';
import { textOf, type MasterTables } from '../masters/map';
import { VOUCHER_TABLES } from './columns';
import { mapVouchers, type VoucherTables } from './map';

export { mapVouchers, emptyVoucherTables, type VoucherTables } from './map';
export { VOUCHER_TABLES } from './columns';

export const REQ_VOUCHERS = 'LBVouchers';

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

export interface VoucherDeps {
  client: TallyClient;
  getCompanyName: () => string | null;
  getCompanyGuid: () => string | null;
  getCompanyState: () => string;
  /** Masters of the selected company (Phase 10 `masters.last()?.tables`). Required: names are resolved against them. */
  getMasters: () => MasterTables | null;
  onPulled?: (r: VouchersResult) => void;
}

export interface Vouchers {
  pull(opts: PullOptions): Promise<VouchersResult>;
  last(): VouchersResult | null;
}

const ymd = (iso: string): string => iso.replace(/-/g, '');
const ISO = /^\d{4}-\d{2}-\d{2}$/;

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const rowDate = (r: Row): string => {
  const t = textOf(r['DATE'] as string);
  return /^\d{8}/.test(t) ? `${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}` : '';
};

export function createVouchers(deps: VoucherDeps): Vouchers {
  let lastResult: VouchersResult | null = null;
  const req = buildVoucherRequest();

  async function read(company: string, from: string, to: string, alterAbove: number | null): Promise<Row[]> {
    const filters = alterAbove !== null ? [{ name: 'LBChanged', formula: `$AlterID > ${Math.trunc(alterAbove)}` }] : undefined;
    const rows = await deps.client.collection(req.id, req.fields, { type: req.type, fetch: req.fetch, filters, company, fromDate: ymd(from), toDate: ymd(to) });
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
      put(await read(company, opts.from, opts.to, incremental ? cursor : null));
      const lookback = opts.lookbackDays ?? 0;
      if (incremental && lookback > 0) {
        const today = opts.today ?? localToday();
        const lf = addDays(today, -lookback);
        put(await read(company, lf < opts.from ? opts.from : lf, today > opts.to ? opts.to : today, null));
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
    last: () => lastResult,
  };
}
