/*
LazyBooks | src/main/db/upsert.ts
Responsibility: Upsert layer + change tracking - idempotent writes, row hash, updated_seq, tombstones, "what changed since X"
Introduced by: Phase 16 (upsert-layer)
STATUS: IMPLEMENTED (Phase 16)
Tracking lives beside the data, not in it: `_lb_row_state(table_name, pk, hash, deleted, updated_seq)`, so the data tables stay exactly the shared model.
Every call that changes something takes ONE new seq (`change_seq`, allocated lazily); a call that changes nothing leaves the counter alone,
so replaying the same Tally pull is a no-op. The operations are the SYNC_SPEC section 4 ones: upsert, delete, clear, replace_scope, delete_children.
*/

import { createHash } from 'node:crypto';
import type { Database } from 'better-sqlite3';
import { rowToParams, storedToRow, toSql, type Row, type SqlValue } from './codec';
import type { DataModel, ModelTable } from './model';
import { insertSql, quoteIdent as q } from './schema';
import { headSeq, setMeta, tombstoneFloor } from './seq';

/** A sync operation (SYNC_SPEC section 4). `payload` is an array of rows/keys, or an object for `clear` and `replace_scope`. */
export interface VaultOp {
  table_name: string;
  op: 'upsert' | 'delete' | 'clear' | 'replace_scope' | 'delete_children';
  payload: Row[] | Row;
}

export interface OpResult {
  inserted: number;
  updated: number;
  unchanged: number;
  deleted: number;
  /** The seq these changes carry; null when nothing changed. */
  seq: number | null;
}

export interface ChangedBatch {
  table_name: string;
  op: 'upsert' | 'delete';
  payload: Row[];
}

export interface ChangedSince {
  /** Head seq at the moment of the call. After the device applied everything, its cursor becomes this. */
  upTo: number;
  /** True when the cursor is older than the pruned tombstones: the device must be given an initial sync instead. */
  needsFull: boolean;
  /** Per table in sync order: deletes first, then upserts, in batches of at most `batch` rows. Lazy. */
  batches: Iterable<ChangedBatch>;
}

export interface UpsertLayer {
  upsert(table: string, rows: Row[]): OpResult;
  deleteRows(table: string, keys: Row[]): OpResult;
  clear(table: string, companyGuid?: string): OpResult;
  replaceScope(companyGuid: string, from: string, to: string): OpResult;
  deleteChildren(keys: Row[]): OpResult;
  /** Applies a list (or a lazily produced sequence, Phase 45: staged vouchers streamed in chunks) of ops in one transaction (all or nothing, one seq). */
  applyOps(ops: Iterable<VaultOp>): OpResult;
  changedSince(cursor: number, opts?: { tables?: string[]; batch?: number }): ChangedSince;
  /** Empties every synced table, the row state and tombstones; devices then need an initial sync (used for a restored Tally, guards.ts). */
  clearVault(): void;
  headSeq(): number;
}

const NEVER_SYNCED = 'ref_voucher_kind';

function zero(): OpResult {
  return { inserted: 0, updated: 0, unchanged: 0, deleted: 0, seq: null };
}

function plain(v: SqlValue): string | number | null {
  return typeof v === 'bigint' ? v.toString() : v;
}

export function createUpsertLayer(db: Database, model: DataModel): UpsertLayer {
  const syncTables = model.tables_order.filter((t) => t !== NEVER_SYNCED);
  const table = (name: string): ModelTable => {
    const t = model.tables[name];
    if (!t || name === NEVER_SYNCED) throw new Error('Table is not a synced vault table');
    return t;
  };
  const voucherChildren = ((model.tables['tx_voucher'] as unknown as { children?: Array<{ table: string }> }).children ?? []).map((c) => c.table);

  /** One call = one seq, allocated on the first real change. */
  const session = () => {
    let seq: number | null = null;
    return (): number => {
      if (seq === null) {
        seq = headSeq(db) + 1;
        setMeta(db, 'change_seq', String(seq));
      }
      return seq;
    };
  };

  const pkParams = (t: ModelTable, row: Row): SqlValue[] =>
    t.primary_key.map((k) => {
      const c = t.columns.find((x) => x.name === k);
      if (!c || !Object.prototype.hasOwnProperty.call(row, k)) throw new Error(`Missing key column ${k}`);
      return toSql(c.type, row[k], false);
    });
  const pkText = (vals: SqlValue[]): string => JSON.stringify(vals.map(plain));
  const hashOf = (params: SqlValue[]): string => createHash('sha256').update(JSON.stringify(params.map(plain))).digest('hex');
  const where = (t: ModelTable): string => t.primary_key.map((k) => `${q(k)} = ?`).join(' AND ');

  const stateGet = db.prepare(`SELECT "hash","deleted" FROM "_lb_row_state" WHERE "table_name" = ? AND "pk" = ?`);
  const stateSet = db.prepare(`INSERT OR REPLACE INTO "_lb_row_state" ("table_name","pk","hash","deleted","updated_seq") VALUES (?,?,?,?,?)`);

  function doUpsert(name: string, rows: Row[], next: () => number, res: OpResult): void {
    const t = table(name);
    const ins = db.prepare(insertSql(name, t, true));
    const exists = db.prepare(`SELECT 1 FROM ${q(name)} WHERE ${where(t)}`);
    for (const row of rows) {
      const params = rowToParams(t, row);
      const pk = t.primary_key.map((k) => params[t.columns.findIndex((c) => c.name === k)] as SqlValue);
      const key = pkText(pk);
      const h = hashOf(params);
      const st = stateGet.get(name, key) as { hash: string; deleted: number } | undefined;
      const present = exists.get(...pk) !== undefined;
      if (st && st.deleted === 0 && st.hash === h && present) {
        res.unchanged += 1;
        continue;
      }
      ins.run(...params);
      stateSet.run(name, key, h, 0, next());
      if (present) res.updated += 1;
      else res.inserted += 1;
    }
  }

  function removeMatching(name: string, whereSql: string, args: SqlValue[], next: () => number, res: OpResult): void {
    const t = table(name);
    const sel = db.prepare(`SELECT ${t.primary_key.map(q).join(', ')} FROM ${q(name)} WHERE ${whereSql}`);
    sel.safeIntegers(true);
    const found = sel.all(...args) as Row[];
    const del = db.prepare(`DELETE FROM ${q(name)} WHERE ${where(t)}`);
    for (const r of found) {
      const pk = t.primary_key.map((k) => r[k] as SqlValue);
      del.run(...pk);
      stateSet.run(name, pkText(pk), '', 1, next());
      res.deleted += 1;
    }
  }

  function doDelete(name: string, keys: Row[], next: () => number, res: OpResult): void {
    const t = table(name);
    const del = db.prepare(`DELETE FROM ${q(name)} WHERE ${where(t)}`);
    for (const k of keys) {
      const pk = pkParams(t, k);
      if (del.run(...pk).changes > 0) {
        stateSet.run(name, pkText(pk), '', 1, next());
        res.deleted += 1;
      } else {
        const st = stateGet.get(name, pkText(pk)) as { deleted: number } | undefined;
        // a row that was never in the vault but is known to be live on devices (state says live) still needs its tombstone
        if (st && st.deleted === 0) {
          stateSet.run(name, pkText(pk), '', 1, next());
          res.deleted += 1;
        }
      }
    }
  }

  function dispatch(op: VaultOp, next: () => number, res: OpResult): void {
    const arr = Array.isArray(op.payload) ? op.payload : null;
    switch (op.op) {
      case 'upsert':
        if (!arr) throw new Error('upsert payload must be an array');
        return doUpsert(op.table_name, arr, next, res);
      case 'delete':
        if (!arr) throw new Error('delete payload must be an array');
        return doDelete(op.table_name, arr, next, res);
      case 'clear': {
        const t = table(op.table_name);
        const cg = !arr && typeof (op.payload as Row)['company_guid'] === 'string' ? String((op.payload as Row)['company_guid']) : null;
        if (cg !== null && t.primary_key[0] !== 'company_guid') throw new Error('Table is not company scoped');
        return removeMatching(op.table_name, cg === null ? '1 = 1' : `"company_guid" = ?`, cg === null ? [] : [cg], next, res);
      }
      case 'replace_scope': {
        if (op.table_name !== 'tx_voucher' || arr) throw new Error('replace_scope applies to tx_voucher with {company_guid, from, to}');
        const p = op.payload as Row;
        const cg = String(p['company_guid'] ?? '');
        const from = String(p['from'] ?? '');
        const to = String(p['to'] ?? '');
        if (!cg || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) throw new Error('Invalid replace_scope scope');
        for (const c of voucherChildren) removeMatching(c, `"company_guid" = ? AND "voucher_date" >= ? AND "voucher_date" <= ?`, [cg, from, to], next, res);
        removeMatching('tx_voucher', `"company_guid" = ? AND "date" >= ? AND "date" <= ?`, [cg, from, to], next, res);
        return;
      }
      case 'delete_children': {
        if (op.table_name !== 'tx_voucher' || !arr) throw new Error('delete_children applies to tx_voucher with an array of keys');
        for (const k of arr) {
          const cg = String(k['company_guid'] ?? '');
          const guid = String(k['guid'] ?? '');
          if (!cg || !guid) throw new Error('delete_children key needs company_guid and guid');
          for (const c of voucherChildren) removeMatching(c, `"company_guid" = ? AND "voucher_guid" = ?`, [cg, guid], next, res);
        }
        return;
      }
      default:
        throw new Error('Unknown operation');
    }
  }

  function run(ops: Iterable<VaultOp>): OpResult {
    return db.transaction(() => {
      const res = zero();
      const next = session();
      const used = (): number => {
        const s = next();
        res.seq = s;
        return s;
      };
      for (const op of ops) dispatch(op, used, res);
      return res;
    })();
  }

  const api: UpsertLayer = {
    upsert: (name, rows) => run([{ table_name: name, op: 'upsert', payload: rows }]),
    deleteRows: (name, keys) => run([{ table_name: name, op: 'delete', payload: keys }]),
    clear: (name, companyGuid) => run([{ table_name: name, op: 'clear', payload: companyGuid ? { company_guid: companyGuid } : [] }]),
    replaceScope: (company_guid, from, to) => run([{ table_name: 'tx_voucher', op: 'replace_scope', payload: { company_guid, from, to } }]),
    deleteChildren: (keys) => run([{ table_name: 'tx_voucher', op: 'delete_children', payload: keys }]),
    applyOps: (ops) => run(ops),
    headSeq: () => headSeq(db),
    clearVault() {
      db.transaction(() => {
        for (const name of syncTables) db.exec(`DELETE FROM ${q(name)}`);
        db.exec(`DELETE FROM "_lb_row_state"`);
        // every device cursor is now behind the floor, so every device is told to resync in full
        setMeta(db, 'change_seq', String(headSeq(db) + 1));
        setMeta(db, 'tombstone_floor', String(headSeq(db)));
      })();
    },
    changedSince(cursor, opts = {}) {
      if (!Number.isInteger(cursor) || cursor < 0) throw new Error('Invalid cursor');
      const upTo = headSeq(db);
      const batch = Math.max(1, Math.floor(opts.batch ?? 500));
      const wanted = opts.tables ? new Set(opts.tables) : null;
      const needsFull = cursor < tombstoneFloor(db);
      function* gen(): Generator<ChangedBatch> {
        if (needsFull || cursor >= upTo) return;
        for (const name of syncTables) {
          if (wanted && !wanted.has(name)) continue;
          const t = model.tables[name] as ModelTable;
          for (const kind of ['delete', 'upsert'] as const) {
            const st = db.prepare(
              `SELECT "pk" FROM "_lb_row_state" WHERE "table_name" = ? AND "deleted" = ? AND "updated_seq" > ? AND "updated_seq" <= ? ORDER BY "pk"`,
            );
            const read = db.prepare(`SELECT ${t.columns.map((c) => q(c.name)).join(', ')} FROM ${q(name)} WHERE ${where(t)}`);
            read.safeIntegers(true);
            let buf: Row[] = [];
            for (const r of st.iterate(name, kind === 'delete' ? 1 : 0, cursor, upTo) as Iterable<{ pk: string }>) {
              const vals = JSON.parse(r.pk) as Array<string | number | null>;
              if (kind === 'delete') {
                const o: Row = {};
                t.primary_key.forEach((k, i) => {
                  const c = t.columns.find((x) => x.name === k);
                  o[k] = c && (c.type === 'int' || c.type === 'bool') ? Number(vals[i]) : vals[i];
                });
                buf.push(o);
              } else {
                const args = vals.map((v, i) => {
                  const c = t.columns.find((x) => x.name === t.primary_key[i]);
                  return toSql(c ? c.type : 'text', v, false);
                });
                const stored = read.get(...args) as Row | undefined;
                if (stored) buf.push(storedToRow(t, stored));
              }
              if (buf.length >= batch) {
                yield { table_name: name, op: kind, payload: buf };
                buf = [];
              }
            }
            if (buf.length > 0) yield { table_name: name, op: kind, payload: buf };
          }
        }
      }
      return { upTo, needsFull, batches: gen() };
    },
  };
  return api;
}
