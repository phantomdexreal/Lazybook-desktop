/*
LazyBooks | src/main/sync/store.ts
Responsibility: Sync scheduler - read-only helpers over the vault (stored keys, cursors) used to turn a Tally pull into change operations
Introduced by: Phase 18 (sync-scheduler)
STATUS: IMPLEMENTED (Phase 18)
Synchronous reads on the better-sqlite3 handle of the vault. Nothing here writes; writes go through the Phase 16 upsert layer.
*/

import type { Database } from 'better-sqlite3';
import type { Row } from '../db/codec';
import type { DataModel, ModelTable } from '../db/model';
import { quoteIdent as q } from '../db/schema';

export interface Store {
  /** Primary-key columns of every stored row of `table` (for a company-scoped table: of the given company only). */
  keyRows(table: string, companyGuid: string | null): Row[];
  /** Primary keys of the child rows of the given vouchers. */
  childKeys(table: string, companyGuid: string, voucherGuids: string[]): Row[];
  /** Stored vouchers of a company: guid and ISO date. */
  vouchers(companyGuid: string): Array<{ guid: string; date: string }>;
  /** Highest stored voucher alter_id of a company, 0 when none. */
  maxVoucherAlterId(companyGuid: string): number;
  /** Count of stored vouchers of a company. */
  voucherCount(companyGuid: string): number;
}

/** Stable text of a primary key, equal for a stored row and a pulled row. */
export function pkKey(t: ModelTable, row: Row): string {
  return JSON.stringify(t.primary_key.map((k) => String(row[k])));
}

export function createStore(db: Database, model: DataModel): Store {
  const table = (name: string): ModelTable => {
    const t = model.tables[name];
    if (!t) throw new Error(`Unknown table ${name}`);
    return t;
  };
  const pkCols = (t: ModelTable): string => t.primary_key.map(q).join(', ');
  return {
    keyRows(name, companyGuid) {
      const t = table(name);
      const scoped = companyGuid !== null && t.primary_key[0] === 'company_guid';
      const sql = `SELECT ${pkCols(t)} FROM ${q(name)}${scoped ? ` WHERE "company_guid" = ?` : ''}`;
      return (scoped ? db.prepare(sql).all(companyGuid) : db.prepare(sql).all()) as Row[];
    },
    childKeys(name, companyGuid, guids) {
      const t = table(name);
      const out: Row[] = [];
      for (let i = 0; i < guids.length; i += 400) {
        const part = guids.slice(i, i + 400);
        const sql = `SELECT ${pkCols(t)} FROM ${q(name)} WHERE "company_guid" = ? AND "voucher_guid" IN (${part.map(() => '?').join(',')})`;
        out.push(...(db.prepare(sql).all(companyGuid, ...part) as Row[]));
      }
      return out;
    },
    vouchers(companyGuid) {
      return db.prepare(`SELECT "guid", "date" FROM "tx_voucher" WHERE "company_guid" = ?`).all(companyGuid) as Array<{ guid: string; date: string }>;
    },
    maxVoucherAlterId(companyGuid) {
      const r = db.prepare(`SELECT MAX("alter_id") AS m FROM "tx_voucher" WHERE "company_guid" = ?`).get(companyGuid) as { m: number | null };
      return r.m === null ? 0 : Number(r.m);
    },
    voucherCount(companyGuid) {
      const r = db.prepare(`SELECT COUNT(*) AS n FROM "tx_voucher" WHERE "company_guid" = ?`).get(companyGuid) as { n: number };
      return Number(r.n);
    },
  };
}
