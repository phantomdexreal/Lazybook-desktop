/*
LazyBooks | src/main/tally/reconcile.ts
Responsibility: Deleted vouchers + renamed masters: deletion detection against Tally's guid list, rename detection and name fix-ups, as sync change operations
Introduced by: Phase 12 (tally-deletes-renames)
STATUS: IMPLEMENTED (Phase 12)
Reads through the Phase 8 client only. No Electron import: testable from Node. The vault (Phase 15/16) supplies the stored rows;
the scheduler (Phase 18) decides when to run (`deletedCheckDue`) and hands the returned operations to the chunker (Phase 20).
*/

import { logger } from '../logger';
import type { TallyClient } from './client';
import { textOf, type MasterTables, type TableRow } from './masters/map';
import type { VoucherTables } from './vouchers/map';

export const REQ_VOUCHER_GUIDS = 'LBVoucherGuids';
/** constants.json desktop.deleted_check_interval_h */
export const DELETED_CHECK_INTERVAL_H = 24;

/** A sync change operation (SYNC_SPEC section 4), before chunking. */
export interface ChangeOp {
  table_name: string;
  op: 'delete_children' | 'delete' | 'upsert';
  payload: Array<Record<string, unknown>>;
}

export interface StoredVoucherRef {
  guid: string;
  /** ISO `YYYY-MM-DD` voucher date as stored. */
  date: string;
}

export interface DeletedCheckInput {
  from: string;
  to: string;
  /** Vouchers currently in the vault for this company. */
  stored: StoredVoucherRef[];
  /** Accept an empty Tally answer even though vouchers are stored (default false: treated as a failed read, never as "delete all"). */
  allowEmpty?: boolean;
}

export interface DeletedCheckResult {
  deleted: string[];
  /** guids Tally listed in the window */
  tallyCount: number;
  /** stored vouchers inside the window that were compared */
  comparedCount: number;
  /** delete_children then delete, in that order; empty when nothing was deleted */
  ops: ChangeOp[];
}

/** True when the daily check (or a manual request) should run. Times are epoch milliseconds. */
export function deletedCheckDue(o: { lastCheckedAt: number | null; now: number; manual?: boolean; intervalH?: number }): boolean {
  if (o.manual || o.lastCheckedAt === null) return true;
  return o.now - o.lastCheckedAt >= (o.intervalH ?? DELETED_CHECK_INTERVAL_H) * 3600_000;
}

const ymd = (iso: string): string => iso.replace(/-/g, '');
const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function deleteOps(companyGuid: string, guids: string[]): ChangeOp[] {
  if (guids.length === 0) return [];
  const keys = guids.map((guid) => ({ company_guid: companyGuid, guid }));
  // children first (parent stays), then the parent rows (SYNC_SPEC section 4)
  return [
    { table_name: 'tx_voucher', op: 'delete_children', payload: keys },
    { table_name: 'tx_voucher', op: 'delete', payload: keys.map((k) => ({ ...k })) },
  ];
}

/** Remove the given vouchers and all their child rows from a set of voucher tables (what the vault and devices do). Pure. */
export function removeVouchers(tables: VoucherTables, guids: string[]): VoucherTables {
  const gone = new Set(guids);
  const out: VoucherTables = {};
  for (const [t, rows] of Object.entries(tables)) out[t] = rows.filter((r) => !gone.has(String(t === 'tx_voucher' ? r.guid : r.voucher_guid)));
  return out;
}

// ------------------------------------------------------------------ renames
export interface Rename {
  table: string;
  guid: string;
  oldName: string;
  newName: string;
}

const RENAMEABLE = ['tm_group', 'tm_ledger', 'tm_voucher_type', 'tm_stock_group', 'tm_stock_category', 'tm_unit', 'tm_godown', 'tm_stock_item', 'tm_cost_centre', 'tm_currency', 'tm_employee', 'tm_gst_registration'];

/**
 * Masters whose guid is unchanged but whose name changed. Rows with a fallback guid (`n:<name>`) are skipped: for those a rename
 * changes the identity, so it appears as one master gone and one new (the next full master refresh replaces them).
 */
export function detectRenames(oldMasters: MasterTables, newMasters: MasterTables): Rename[] {
  const out: Rename[] = [];
  for (const table of RENAMEABLE) {
    const before = new Map<string, string>();
    for (const r of oldMasters[table] ?? []) before.set(String(r.guid), String(r.name));
    for (const r of newMasters[table] ?? []) {
      const guid = String(r.guid);
      const old = before.get(guid);
      if (old !== undefined && !guid.startsWith('n:') && old !== String(r.name)) out.push({ table, guid, oldName: old, newName: String(r.name) });
    }
  }
  return out;
}

/** [voucher table, guid column, name column] per master table: where a master's name is stored denormalised. */
const NAME_REFS: Record<string, Array<[string, string, string]>> = {
  tm_ledger: [['tx_voucher', 'party_guid', 'party_name'], ['tx_ledger_line', 'ledger_guid', 'ledger_name'], ['tx_bill_alloc', 'ledger_guid', 'ledger_name']],
  tm_voucher_type: [['tx_voucher', 'voucher_type_guid', 'voucher_type_name']],
  tm_stock_item: [['tx_inventory_line', 'stock_item_guid', 'stock_item_name']],
  tm_godown: [['tx_inventory_line', 'godown_guid', 'godown_name'], ['tx_batch_alloc', 'godown_guid', 'godown_name']],
};
const TABLE_ORDER = ['tx_voucher', 'tx_ledger_line', 'tx_inventory_line', 'tx_batch_alloc', 'tx_bill_alloc', 'tx_tax_line'];

export interface RenameFixup {
  /** Stored voucher rows with their name columns corrected (all tables, same order); input is not mutated. */
  tables: VoucherTables;
  /** Voucher guids that had at least one name corrected. */
  affectedVouchers: string[];
  /** One `upsert` per table that changed, in sync table order (rows replace by primary key). */
  ops: ChangeOp[];
}

/**
 * Re-resolve the denormalised names of stored voucher rows after masters were renamed (TALLY_WIRE section 4: a rename keeps the
 * guid; names in child rows are fixed here instead of waiting for a full window refresh). Matching is by guid only.
 */
export function applyRenames(stored: VoucherTables, renames: Rename[]): RenameFixup {
  const newName = new Map<string, string>(); // `${table}|${guid}` -> name
  for (const r of renames) newName.set(`${r.table}|${r.guid}`, r.newName);
  const changedPk = new Map<string, TableRow[]>();
  const affected = new Set<string>();
  const out: VoucherTables = {};
  for (const [t, rows] of Object.entries(stored)) {
    const refs: Array<[string, string, string]> = [];
    for (const [master, list] of Object.entries(NAME_REFS)) for (const [vt, g, n] of list) if (vt === t) refs.push([master, g, n]);
    out[t] = rows.map((row) => {
      let next: TableRow | null = null;
      for (const [master, gcol, ncol] of refs) {
        const nn = newName.get(`${master}|${String(row[gcol])}`);
        if (nn !== undefined && row[ncol] !== nn) {
          next = next ?? { ...row };
          next[ncol] = nn;
        }
      }
      if (!next) return row;
      const list = changedPk.get(t) ?? [];
      list.push(next);
      changedPk.set(t, list);
      affected.add(String(t === 'tx_voucher' ? row.guid : row.voucher_guid));
      return next;
    });
  }
  const ops: ChangeOp[] = TABLE_ORDER.filter((t) => changedPk.has(t)).map((t) => ({ table_name: t, op: 'upsert', payload: changedPk.get(t) as TableRow[] }));
  return { tables: out, affectedVouchers: [...affected], ops };
}

// ------------------------------------------------------------------ Tally side
export interface ReconcileDeps {
  client: TallyClient;
  getCompanyName: () => string | null;
  getCompanyGuid: () => string | null;
}

export interface Reconciler {
  /** Ask Tally for the guid list of the window and compare it with the stored vouchers. Throws on any Tally error (nothing is deleted then). */
  checkDeleted(input: DeletedCheckInput): Promise<DeletedCheckResult>;
}

export function createReconciler(deps: ReconcileDeps): Reconciler {
  return {
    async checkDeleted(input) {
      if (!ISO.test(input.from) || !ISO.test(input.to) || input.from > input.to) throw new Error('Invalid voucher date window');
      const company = deps.getCompanyName();
      if (!company) throw new Error('No company selected');
      const companyGuid = deps.getCompanyGuid();
      if (!companyGuid) throw new Error('Company record not read yet');
      const started = Date.now();
      const rows = await deps.client.collection(REQ_VOUCHER_GUIDS, ['GUID', 'ALTERID'], { type: 'Voucher', company, fromDate: ymd(input.from), toDate: ymd(input.to) });
      const inTally = new Set<string>();
      for (const r of rows) {
        const g = textOf(r['GUID'] as string);
        if (g !== '') inTally.add(g);
      }
      // only vouchers dated inside the window are compared: one that left the window is not "deleted"
      const compared = input.stored.filter((s) => s.date >= input.from && s.date <= input.to);
      if (inTally.size === 0 && compared.length > 0 && !input.allowEmpty) {
        const err = new Error('Tally returned no vouchers for the window; refusing to delete anything');
        (err as Error & { code?: string }).code = 'RECONCILE_EMPTY_ANSWER';
        logger.warn('tally', 'deleted check refused: empty answer', { compared: compared.length });
        throw err;
      }
      const deleted = compared.filter((s) => !inTally.has(s.guid)).map((s) => s.guid);
      const res: DeletedCheckResult = { deleted, tallyCount: inTally.size, comparedCount: compared.length, ops: deleteOps(companyGuid, deleted) };
      logger.info('tally', 'deleted check', { ms: Date.now() - started, tally: inTally.size, compared: compared.length, deleted: deleted.length });
      return res;
    },
  };
}
