/*
LazyBooks | src/main/db/vault.ts
Responsibility: SQLite schema + migrations - open the vault (WAL, integrity check, rolling backup, recovery) and run migrations
Introduced by: Phase 15 (sqlite-schema)
STATUS: IMPLEMENTED (Phase 15)
No Electron import: the caller passes the directory (`<userData>/vault`). Binding: better-sqlite3 (see DEPENDENCY_VERSIONS.md).
Upserts with change tracking, tombstones and device cursors are Phase 16; this file only owns the database file and its schema.
*/

import Database, { type Database as Db } from 'better-sqlite3';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { rowToParams, storedToRow, type Row } from './codec';
import { dataModel, type DataModel } from './model';
import { currentVersion, migrate, seedReference, type MigrateResult } from './migrate';
import { insertSql, schemaHash, selectAllSql } from './schema';
import { createCursors, type Cursors } from './cursors';
import { createUpsertLayer, type UpsertLayer } from './upsert';
import { logger } from '../logger';

export const VAULT_FILE = 'vault.sqlite';
export const BACKUP_DIR = 'backups';

export interface OpenVaultOptions {
  /** Directory that holds the database (`<userData>/vault`). Created when missing. */
  dir: string;
  model?: DataModel;
  /** Rolling backups to keep (default 3). */
  backupsKeep?: number;
  /** Skip the start-up backup when the newest one is younger than this (default 1 h; 0 = always back up). */
  minBackupIntervalMs?: number;
  now?: () => Date;
}

export interface IntegrityResult {
  ok: boolean;
  messages: string[];
}

export interface VaultInfo {
  path: string;
  migration: MigrateResult;
  /** `fresh` = the file did not exist; `backup` = a corrupt file was quarantined and the newest good backup restored; `empty` = corrupt and no usable backup (full resync). */
  origin: 'fresh' | 'existing' | 'backup' | 'empty';
  backupPath: string | null;
  quarantinedPath: string | null;
  /** True when data_model.json no longer matches the schema this vault was created from (a new migration or a vault reset is needed). */
  schemaStale: boolean;
}

export interface Vault extends UpsertLayer, Cursors {
  readonly db: Db;
  readonly info: VaultInfo;
  /** `quick` (default) = PRAGMA quick_check; `full` = PRAGMA integrity_check. */
  integrityCheck(mode?: 'quick' | 'full'): IntegrityResult;
  /** Runs fn in one transaction (rolls back when it throws). */
  transaction<T>(fn: () => T): T;
  /** Raw INSERT OR REPLACE of wire rows with NO change tracking (fixture checks, tests). Production writes use `upsert`/`applyOps`. Returns rows written. */
  bulkLoad(table: string, rows: Row[]): number;
  /** All rows of a table as wire rows (canonical decimals, booleans, parsed json), ordered by primary key. */
  readTable(table: string): Row[];
  count(table: string): number;
  /** Selected plain columns only (raw stored values: text, numbers), ordered by primary key. Cheap lookups on big tables (Phase 41). Unknown table or column throws. */
  readColumns(table: string, columns: string[]): Row[];
  /** Cheap change signature of a table (row count and highest alter id when the table has one); equal signatures mean no voucher changed. */
  stamp(table: string): string;
  /** Checkpoints the WAL and closes. Safe to call twice. */
  close(): void;
}

export function vaultPath(dir: string): string {
  return join(dir, VAULT_FILE);
}

const sqlString = (s: string): string => `'${s.replace(/'/g, "''")}'`;
const stamp = (d: Date): string => d.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');

/** Time encoded in a backup file name (`vault-YYYYMMDDTHHMMSSZ.sqlite`); 0 when unparseable. */
function stampToMs(file: string): number {
  const m = /vault-(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z\.sqlite$/.exec(file);
  return m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6])) : 0;
}

function openRaw(path: string): Db {
  const db = new Database(path);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('busy_timeout = 5000');
  db.pragma('foreign_keys = OFF');
  return db;
}

function check(db: Db, mode: 'quick' | 'full'): IntegrityResult {
  const rows = db.pragma(mode === 'full' ? 'integrity_check' : 'quick_check') as { [k: string]: string }[];
  const messages = rows.map((r) => String(Object.values(r)[0] ?? ''));
  return { ok: messages.length === 1 && messages[0] === 'ok', messages };
}

/** Quick check of a file without keeping it open. A file that is not a database counts as damaged. */
function fileIsHealthy(path: string): boolean {
  let db: Db | null = null;
  try {
    db = new Database(path, { readonly: true, fileMustExist: true });
    return check(db, 'quick').ok;
  } catch {
    return false;
  } finally {
    try {
      db?.close();
    } catch {
      // ignore
    }
  }
}

function listBackups(dir: string): string[] {
  const bdir = join(dir, BACKUP_DIR);
  if (!existsSync(bdir)) return [];
  return readdirSync(bdir)
    .filter((f) => /^vault-\d{8}T\d{6}Z\.sqlite$/.test(f))
    .sort()
    .reverse()
    .map((f) => join(bdir, f));
}

function removeWalFiles(path: string): void {
  for (const ext of ['-wal', '-shm']) rmSync(path + ext, { force: true });
}

/** Moves a damaged database (and its WAL/SHM) aside so nothing is lost and nothing is reused. */
function quarantine(path: string, now: Date): string {
  const dest = path.replace(/\.sqlite$/, `.corrupt-${stamp(now)}.sqlite`);
  renameSync(path, dest);
  for (const ext of ['-wal', '-shm']) {
    if (existsSync(path + ext)) renameSync(path + ext, dest + ext);
  }
  return dest;
}

/** VACUUM INTO a new file in backups/, then prune to `keep`. Returns the path or null when skipped. */
function rollingBackup(db: Db, dir: string, keep: number, minIntervalMs: number, now: Date): string | null {
  const existing = listBackups(dir);
  if (minIntervalMs > 0 && existing[0]) {
    const at = stampToMs(existing[0]);
    const age = now.getTime() - at;
    if (at > 0 && age >= 0 && age < minIntervalMs) return null;
  }
  const bdir = join(dir, BACKUP_DIR);
  mkdirSync(bdir, { recursive: true });
  const dest = join(bdir, `vault-${stamp(now)}.sqlite`);
  if (existsSync(dest)) return null;
  db.exec(`VACUUM INTO ${sqlString(dest)}`);
  for (const old of listBackups(dir).slice(Math.max(keep, 1))) rmSync(old, { force: true });
  return dest;
}

export function openVault(opts: OpenVaultOptions): Vault {
  const model = opts.model ?? dataModel;
  const now = opts.now ?? ((): Date => new Date());
  const keep = opts.backupsKeep ?? 3;
  const minInterval = opts.minBackupIntervalMs ?? 3_600_000;
  mkdirSync(opts.dir, { recursive: true });
  const path = vaultPath(opts.dir);

  let origin: VaultInfo['origin'] = existsSync(path) ? 'existing' : 'fresh';
  let quarantinedPath: string | null = null;

  // 1. damaged file: set it aside, restore the newest healthy backup, else start empty (the connector then does a full resync)
  if (origin === 'existing' && !fileIsHealthy(path)) {
    quarantinedPath = quarantine(path, now());
    logger.error('vault', 'vault damaged, moved aside', { quarantined: true });
    const good = listBackups(opts.dir).find((b) => fileIsHealthy(b));
    if (good) {
      removeWalFiles(path);
      const src = new Database(good, { readonly: true, fileMustExist: true });
      try {
        src.exec(`VACUUM INTO ${sqlString(path)}`);
      } finally {
        src.close();
      }
      origin = 'backup';
      logger.warn('vault', 'vault restored from backup', {});
    } else {
      origin = 'empty';
      logger.warn('vault', 'no usable backup, starting an empty vault (full resync needed)', {});
    }
  }

  const db = openRaw(path);
  let backupPath: string | null = null;
  try {
    // 2. backup the healthy database before touching its schema (nothing to back up while it has no schema yet)
    if (currentVersion(db) > 0) backupPath = rollingBackup(db, opts.dir, keep, minInterval, now());

    // 3. migrate, then re-assert the static seed (idempotent)
    const migration = migrate(db, model, undefined, now);
    seedReference(db, model);
    const stored = db.prepare(`SELECT "value" FROM "_lb_vault_meta" WHERE "key" = ?`).get('schema_hash_v1') as { value: string } | undefined;
    const schemaStale = stored?.value !== schemaHash(model);
    if (schemaStale) logger.warn('vault', 'data model changed since this vault was created', {});
    logger.info('vault', 'vault opened', { origin, from: migration.from, to: migration.to, backup: backupPath !== null, stale: schemaStale });

    return makeVault(db, model, { path, migration, origin, backupPath, quarantinedPath, schemaStale });
  } catch (e) {
    try {
      db.close();
    } catch {
      // ignore
    }
    throw e;
  }
}

function makeVault(db: Db, model: DataModel, info: VaultInfo): Vault {
  let closed = false;
  const tableOf = (name: string) => {
    const t = model.tables[name];
    if (!t) throw new Error('Unknown vault table');
    return t;
  };
  const upsertLayer = createUpsertLayer(db, model);
  const cursorLayer = createCursors(db);
  return {
    ...upsertLayer,
    ...cursorLayer,
    db,
    info,
    integrityCheck: (mode = 'quick') => check(db, mode),
    transaction: <T>(fn: () => T): T => db.transaction(fn)(),
    bulkLoad(table, rows) {
      const t = tableOf(table);
      const st = db.prepare(insertSql(table, t, true));
      db.transaction(() => {
        for (const r of rows) st.run(...rowToParams(t, r));
      })();
      return rows.length;
    },
    readTable(table) {
      const t = tableOf(table);
      const st = db.prepare(selectAllSql(table, t));
      st.safeIntegers(true);
      return (st.all() as Row[]).map((r) => storedToRow(t, r));
    },
    count(table) {
      tableOf(table);
      const r = db.prepare(`SELECT COUNT(*) AS n FROM "${table}"`).get() as { n: number };
      return Number(r.n);
    },
    readColumns(table, columns) {
      const t = tableOf(table);
      const known = new Set(t.columns.map((c) => c.name));
      for (const c of columns) if (!known.has(c)) throw new Error('Unknown vault column');
      const order = t.primary_key.map((k) => `"${k}"`).join(', ');
      return db.prepare(`SELECT ${columns.map((c) => `"${c}"`).join(', ')} FROM "${table}" ORDER BY ${order}`).all() as Row[];
    },
    stamp(table) {
      const t = tableOf(table);
      const n = (db.prepare(`SELECT COUNT(*) AS n FROM "${table}"`).get() as { n: number }).n;
      if (!t.columns.some((c) => c.name === 'alter_id')) return String(n);
      const m = (db.prepare(`SELECT MAX(alter_id) AS m FROM "${table}"`).get() as { m: unknown }).m;
      return `${n}:${String(m ?? '')}`;
    },
    close() {
      if (closed) return;
      closed = true;
      try {
        db.pragma('wal_checkpoint(TRUNCATE)');
      } catch {
        // a failed checkpoint must not block shutdown; the WAL is replayed on next open
      }
      db.close();
    },
  };
}

/** Deletes the database, its WAL/SHM and (with `backups`) the backup folder. Close the vault first. Used by Tools -> Reset vault (Phase 37). */
export function deleteVaultFiles(dir: string, opts: { backups?: boolean } = {}): void {
  const p = vaultPath(dir);
  rmSync(p, { force: true });
  removeWalFiles(p);
  if (opts.backups) rmSync(join(dir, BACKUP_DIR), { recursive: true, force: true });
}
