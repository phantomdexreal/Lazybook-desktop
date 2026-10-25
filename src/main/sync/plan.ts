/*
LazyBooks | src/main/sync/plan.ts
Responsibility: Sync scheduler - pure planning: turn a Tally pull into vault operations (upserts plus the deletes a pull implies)
Introduced by: Phase 18 (sync-scheduler)
STATUS: IMPLEMENTED (Phase 18)
No Electron, no I/O. The vault's upsert layer drops unchanged rows by hash, so replaying a pull yields no new seq. Nothing is cleared and re-sent:
a master missing from a complete master pull becomes a `delete`; a voucher child row that an edited voucher no longer has becomes a `delete`
of that child row (instead of delete_children + upsert, which would re-send unchanged vouchers on every lookback re-read).
*/

import type { Row } from '../db/codec';
import type { VaultOp } from '../db/upsert';
import type { DataModel } from '../db/model';
import { pkKey, type Store } from './store';

const NEVER = 'ref_voucher_kind';

function keyOf(model: DataModel, table: string, row: Row): Row {
  const o: Row = {};
  for (const k of model.tables[table].primary_key) o[k] = row[k];
  return o;
}

/** Ops for a complete master pull: company row, then every master table in sync order; stored masters Tally no longer has are deleted. */
export function planMasters(model: DataModel, companyRow: Row, companyGuid: string, tables: Record<string, Row[]>, store: Pick<Store, 'keyRows'>): VaultOp[] {
  const ops: VaultOp[] = [{ table_name: 'tm_company', op: 'upsert', payload: [companyRow] }];
  for (const name of model.tables_order) {
    if (name === NEVER || name === 'tm_company' || !name.startsWith('tm_')) continue;
    const rows = tables[name];
    if (!rows) continue; // a table the pull did not carry is left alone, never emptied
    const t = model.tables[name];
    const pulled = new Set(rows.map((r) => pkKey(t, r)));
    const gone = store.keyRows(name, companyGuid).filter((k) => !pulled.has(pkKey(t, k)));
    if (gone.length > 0) ops.push({ table_name: name, op: 'delete', payload: gone });
    if (rows.length > 0) ops.push({ table_name: name, op: 'upsert', payload: rows });
  }
  return ops;
}

/** Ops for a voucher pull: children the edited vouchers lost are deleted, then vouchers and children are upserted in sync order. */
export function planVouchers(model: DataModel, companyGuid: string, tables: Record<string, Row[]>, store: Pick<Store, 'childKeys'>): VaultOp[] {
  const children = ((model.tables['tx_voucher'] as unknown as { children?: Array<{ table: string }> }).children ?? []).map((c) => c.table);
  const vouchers = tables['tx_voucher'] ?? [];
  const guids = vouchers.map((v) => String(v.guid));
  const deletes: VaultOp[] = [];
  const upserts: VaultOp[] = [];
  if (vouchers.length > 0) upserts.push({ table_name: 'tx_voucher', op: 'upsert', payload: vouchers });
  for (const c of children) {
    const rows = tables[c] ?? [];
    const t = model.tables[c];
    const pulled = new Set(rows.map((r) => pkKey(t, r)));
    const lost = store.childKeys(c, companyGuid, guids).filter((k) => !pulled.has(pkKey(t, k)));
    if (lost.length > 0) deletes.push({ table_name: c, op: 'delete', payload: lost.map((k) => keyOf(model, c, k)) });
    if (rows.length > 0) upserts.push({ table_name: c, op: 'upsert', payload: rows });
  }
  return [...deletes, ...upserts];
}
