/*
LazyBooks | src/main/db/migrate.ts
Responsibility: SQLite schema + migrations - ordered, transactional migration runner
Introduced by: Phase 15 (sqlite-schema)
STATUS: IMPLEMENTED (Phase 15)
Each migration runs in its own transaction and is recorded in `_lb_migrations`; PRAGMA user_version mirrors the highest applied id.
A migration is never edited after release: schema changes after v1 are NEW migrations (Phase 16 adds its change-tracking columns this way).
*/

import type { Database } from 'better-sqlite3';
import { rowToParams } from './codec';
import type { DataModel } from './model';
import { insertSql, schemaHash, schemaStatements } from './schema';

export interface Migration {
  id: number;
  name: string;
  up: (db: Database, model: DataModel) => void;
}

/** Writes the static seed rows (ref_voucher_kind). Idempotent: rows replace by primary key. */
export function seedReference(db: Database, model: DataModel): number {
  let n = 0;
  for (const name of model.tables_order) {
    const t = model.tables[name];
    if (!t?.seed_rows?.length) continue;
    const st = db.prepare(insertSql(name, t, true));
    for (const r of t.seed_rows) {
      st.run(...rowToParams(t, r));
      n += 1;
    }
  }
  return n;
}

export const MIGRATIONS: Migration[] = [
  {
    id: 1,
    name: 'schema-from-data-model',
    up(db, model) {
      for (const stmt of schemaStatements(model)) db.exec(stmt);
      seedReference(db, model);
      db.exec(`CREATE TABLE IF NOT EXISTS "_lb_vault_meta" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL) WITHOUT ROWID;`);
      db.prepare(`INSERT OR REPLACE INTO "_lb_vault_meta" ("key","value") VALUES (?,?)`).run('schema_hash_v1', schemaHash(model));
      db.prepare(`INSERT OR REPLACE INTO "_lb_vault_meta" ("key","value") VALUES (?,?)`).run('data_model_version_v1', String(model.data_model_version));
    },
  },
  {
    id: 2,
    name: 'change-tracking',
    up(db) {
      // Tracking beside the data (data tables stay exactly the shared model). One state row per synced row: hash, deleted flag (tombstone), seq of its last change.
      db.exec(`CREATE TABLE IF NOT EXISTS "_lb_row_state" ("table_name" TEXT NOT NULL, "pk" TEXT NOT NULL, "hash" TEXT NOT NULL, "deleted" INTEGER NOT NULL, "updated_seq" INTEGER NOT NULL, PRIMARY KEY ("table_name","pk")) WITHOUT ROWID;`);
      db.exec(`CREATE INDEX IF NOT EXISTS "_lb_row_state__seq" ON "_lb_row_state" ("updated_seq","table_name");`);
      db.exec(`CREATE TABLE IF NOT EXISTS "_lb_device_cursors" ("device_id" TEXT NOT NULL PRIMARY KEY, "cursor" INTEGER NOT NULL, "updated_at" TEXT NOT NULL) WITHOUT ROWID;`);
      const st = db.prepare(`INSERT OR IGNORE INTO "_lb_vault_meta" ("key","value") VALUES (?,?)`);
      st.run('change_seq', '0');
      st.run('tombstone_floor', '0');
    },
  },
];

export interface MigrateResult {
  from: number;
  to: number;
  applied: string[];
}

export function currentVersion(db: Database): number {
  return Number(db.pragma('user_version', { simple: true }) ?? 0);
}

/** Applies every migration above the stored version, in order. Throws (and rolls that migration back) on failure. */
export function migrate(db: Database, model: DataModel, migrations: Migration[] = MIGRATIONS, now: () => Date = () => new Date()): MigrateResult {
  db.exec(`CREATE TABLE IF NOT EXISTS "_lb_migrations" ("id" INTEGER NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "applied_at" TEXT NOT NULL) WITHOUT ROWID;`);
  const from = currentVersion(db);
  const ids = migrations.map((m) => m.id);
  if (ids.some((id, i) => id !== i + 1)) throw new Error('Migration ids must be 1..N without gaps');
  if (from > migrations.length) {
    const e = new Error('The vault was written by a newer LazyBooks version');
    (e as Error & { code?: string }).code = 'VAULT_NEWER';
    throw e;
  }
  const applied: string[] = [];
  for (const m of migrations) {
    if (m.id <= from) continue;
    db.transaction(() => {
      m.up(db, model);
      db.prepare(`INSERT INTO "_lb_migrations" ("id","name","applied_at") VALUES (?,?,?)`).run(m.id, m.name, now().toISOString());
      db.pragma(`user_version = ${m.id}`);
    })();
    applied.push(m.name);
  }
  return { from, to: currentVersion(db), applied };
}
