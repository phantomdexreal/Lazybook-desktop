/*
LazyBooks | src/main/snapshot/build.ts
Responsibility: Snapshot builder
Introduced by: Phase 31 (snapshot-builder)
STATUS: IMPLEMENTED (Phase 31)
*/

/**
 * Cloud copy snapshots (SYNC_SPEC section 8, format `LBS1`). Two layers:
 * - pure functions (`fullLines`, `deltaLines`, `encodeSnapshot`, `decodeSnapshotObject`, `snapshotLinesToOps`): rows or change
 *   batches -> text lines -> gzip -> optional AES-256-GCM -> objects of at most `object_max_bytes`, plus the manifest row;
 * - `createSnapshotBuilder`: reads the vault, builds, uploads through an injected `SnapshotStore` port, inserts the manifest row.
 * Retention, quota, rebuild rules and scheduling are Phase 32; wiring the port to Supabase Storage is left to the phase that
 * schedules snapshots (nothing calls `build` in production yet).
 *
 * Object = gzip(header line + one JSON line per row/delete/clear), then when `enc`: iv(12) || ciphertext+tag with AAD `lb1|<license>`.
 * A full snapshot has only `clear` and upsert lines; a delta has upserts and deletes. `sha256` covers the stored bytes of all parts in order.
 */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { gunzipSync, gzipSync } from 'node:zlib';
import { SNAPSHOT_DEFAULTS, SYNC_DEFAULTS } from '../../shared/constants';
import { CRYPTO } from '../crypto/envelope';
import type { Vault } from '../db';
import type { DataModel } from '../db/model';
import { LbError } from '../errors';
import { logger } from '../logger';
import { compactRow, type Row } from '../postbox/chunker';

export type SnapshotKind = 'full' | 'delta';

/** Row of the `snapshots` table (created_at is set by the server). */
export interface SnapshotManifestRow {
  license_key: string;
  company_guid: string;
  kind: SnapshotKind;
  seq: number;
  /** Prefix `{license_key}/{company_guid}/{kind}/{seq}-`; the objects are `<prefix><part>.lbs`, part from 1. */
  storage_path: string;
  bytes: number;
  sha256: string;
  enc: boolean;
  from_alter_id: number;
  to_alter_id: number;
}

export interface SnapshotHeader {
  lbs: 1;
  company_guid: string;
  kind: SnapshotKind;
  seq: number;
  part: number;
  parts: number;
  as_of: string;
  schema_version: 1;
  from_alter_id: number;
  to_alter_id: number;
}

/** One body line of an object. */
export type SnapshotLine = { table: string; row: Row } | { table: string; delete: Row } | { table: string; clear: Row };

export interface SnapshotObject {
  part: number;
  path: string;
  bytes: Buffer;
}

export interface EncodeInput {
  licenseKey: string;
  companyGuid: string;
  kind: SnapshotKind;
  seq: number;
  /** YYYY-MM-DD */
  asOf: string;
  fromAlterId: number;
  toAlterId: number;
  /** Body lines, already serialised (one JSON object each, no newline). */
  lines: string[];
  /** Null = plaintext objects (only when the e2e flag is off). */
  key: Buffer | null;
  maxObjectBytes?: number;
  /** Test seam: deterministic IVs. */
  ivFor?: (part: number) => Buffer;
}

export interface EncodedSnapshot {
  objects: SnapshotObject[];
  manifest: SnapshotManifestRow;
}

const SAFE_SEGMENT = (s: string): boolean => s.length > 0 && !/[\/\\\u0000-\u001f]/.test(s) && !s.includes('..');

export function snapshotPrefix(licenseKey: string, companyGuid: string, kind: SnapshotKind, seq: number): string {
  if (!SAFE_SEGMENT(licenseKey) || !SAFE_SEGMENT(companyGuid)) throw new LbError('BAD_RESPONSE', 'The license or company id cannot be used in a storage path.');
  return `${licenseKey}/${companyGuid}/${kind}/${seq}-`;
}

function tableMeta(model: DataModel, table: string) {
  const m = model.tables[table];
  if (!m) throw new Error(`Unknown table ${table}`);
  return m;
}

const line = (v: SnapshotLine): string => JSON.stringify(v);

/**
 * Lines of a full snapshot: tables in sync order; per table (not tm_company) a `clear` of the company, then its rows
 * (compact, in the order given, normally primary-key order). Child tables are cleared too, because a full snapshot has no replace_scope.
 */
export function fullLines(model: DataModel, tables: Record<string, Row[]>, companyGuid: string): string[] {
  const out: string[] = [];
  for (const t of SYNC_DEFAULTS.tableOrder as readonly string[]) {
    tableMeta(model, t);
    const rows = (tables[t] ?? []).filter((r) => (t === 'tm_company' ? r['guid'] === companyGuid : r['company_guid'] === companyGuid));
    if (t !== 'tm_company') out.push(line({ table: t, clear: { company_guid: companyGuid } }));
    for (const r of rows) out.push(line({ table: t, row: compactRow(model, t, r) }));
  }
  return out;
}

export interface DeltaBatch {
  table_name: string;
  op: 'upsert' | 'delete';
  payload: Row[];
}

/**
 * Lines of a delta: the company row first (so a device's cursors move, SYNC_SPEC section 7), then the vault's change batches
 * (already in table order, deletes before upserts per table). `changed` counts the lines besides the company row.
 */
export function deltaLines(model: DataModel, companyRow: Row, batches: Iterable<DeltaBatch>, companyGuid: string): { lines: string[]; changed: number } {
  const lines = [line({ table: 'tm_company', row: compactRow(model, 'tm_company', companyRow) })];
  let changed = 0;
  for (const b of batches) {
    if (b.table_name === 'tm_company') continue; // always sent first
    for (const r of b.payload) {
      if (r['company_guid'] !== undefined && r['company_guid'] !== companyGuid) continue;
      lines.push(b.op === 'upsert' ? line({ table: b.table_name, row: compactRow(model, b.table_name, r) }) : line({ table: b.table_name, delete: r }));
      changed += 1;
    }
  }
  return { lines, changed };
}

function encryptObject(key: Buffer, licenseKey: string, gz: Buffer, iv?: Buffer): Buffer {
  const v = iv ?? randomBytes(CRYPTO.ivBytes);
  if (v.length !== CRYPTO.ivBytes) throw new Error('IV must be 12 bytes');
  const c = createCipheriv('aes-256-gcm', key, v, { authTagLength: CRYPTO.tagBytes });
  c.setAAD(Buffer.from(CRYPTO.aadPrefix + licenseKey, 'utf8'));
  return Buffer.concat([v, c.update(gz), c.final(), c.getAuthTag()]);
}

function plainOf(stored: Buffer, key: Buffer | null, licenseKey: string): Buffer {
  if (!key) return gunzipSync(stored);
  if (stored.length < CRYPTO.ivBytes + CRYPTO.tagBytes) throw new LbError('LB_CRYPTO_DECRYPT_FAILED', 'Could not decrypt the data (malformed object).');
  try {
    const d = createDecipheriv('aes-256-gcm', key, stored.subarray(0, CRYPTO.ivBytes), { authTagLength: CRYPTO.tagBytes });
    d.setAAD(Buffer.from(CRYPTO.aadPrefix + licenseKey, 'utf8'));
    d.setAuthTag(stored.subarray(stored.length - CRYPTO.tagBytes));
    const gz = Buffer.concat([d.update(stored.subarray(CRYPTO.ivBytes, stored.length - CRYPTO.tagBytes)), d.final()]);
    return gunzipSync(gz);
  } catch {
    throw new LbError('LB_CRYPTO_DECRYPT_FAILED', 'Could not decrypt the data (wrong key or damaged data).');
  }
}

/** Reads one stored object back: header and body lines. Used by tests, verification after upload, and as the reference for a reader. */
export function decodeSnapshotObject(stored: Buffer, key: Buffer | null, licenseKey: string): { header: SnapshotHeader; lines: SnapshotLine[] } {
  const text = plainOf(stored, key, licenseKey).toString('utf8');
  const raw = text.split('\n').filter((l) => l.length > 0);
  const first = raw[0];
  if (!first) throw new LbError('BAD_RESPONSE', 'The snapshot object is empty.');
  const header = JSON.parse(first) as SnapshotHeader;
  if (header.lbs !== 1) throw new LbError('BAD_RESPONSE', 'Unknown snapshot format.');
  return { header, lines: raw.slice(1).map((l) => JSON.parse(l) as SnapshotLine) };
}

/** Snapshot lines as chunk-style ops (SYNC_SPEC section 8: "as if they were chunks"): consecutive upserts of one table are grouped. */
export function snapshotLinesToOps(lines: SnapshotLine[]): { table_name: string; op: 'upsert' | 'delete' | 'clear'; payload: Row[] | Row }[] {
  const ops: { table_name: string; op: 'upsert' | 'delete' | 'clear'; payload: Row[] | Row }[] = [];
  for (const l of lines) {
    if ('clear' in l) {
      ops.push({ table_name: l.table, op: 'clear', payload: l.clear });
      continue;
    }
    const op = 'row' in l ? 'upsert' : 'delete';
    const item = 'row' in l ? l.row : l.delete;
    const prev = ops[ops.length - 1];
    if (prev && prev.table_name === l.table && prev.op === op && Array.isArray(prev.payload)) prev.payload.push(item);
    else ops.push({ table_name: l.table, op, payload: [item] });
  }
  return ops;
}

function groupLines(lines: string[], rawBudget: number): string[][] {
  const groups: string[][] = [];
  let cur: string[] = [];
  let size = 0;
  for (const l of lines) {
    const n = Buffer.byteLength(l, 'utf8') + 1;
    if (cur.length > 0 && size + n > rawBudget) {
      groups.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(l);
    size += n;
  }
  if (cur.length > 0 || groups.length === 0) groups.push(cur);
  return groups;
}

/**
 * Lines -> objects. Parts are cut by raw size first; when a stored (compressed, encrypted) part is still above the object limit
 * the raw budget is halved and the cut is redone. Every object carries its own header (part P of M).
 */
export function encodeSnapshot(i: EncodeInput): EncodedSnapshot {
  const max = i.maxObjectBytes ?? SNAPSHOT_DEFAULTS.objectMaxBytes;
  const prefix = snapshotPrefix(i.licenseKey, i.companyGuid, i.kind, i.seq);
  let budget = Math.max(1024, max - 4096);
  for (;;) {
    const groups = groupLines(i.lines, budget);
    const objects: SnapshotObject[] = groups.map((g, idx) => {
      const header: SnapshotHeader = {
        lbs: 1,
        company_guid: i.companyGuid,
        kind: i.kind,
        seq: i.seq,
        part: idx + 1,
        parts: groups.length,
        as_of: i.asOf,
        schema_version: 1,
        from_alter_id: i.fromAlterId,
        to_alter_id: i.toAlterId,
      };
      const text = [JSON.stringify(header), ...g].join('\n') + '\n';
      const gz = gzipSync(Buffer.from(text, 'utf8'));
      const bytes = i.key ? encryptObject(i.key, i.licenseKey, gz, i.ivFor?.(idx + 1)) : gz;
      return { part: idx + 1, path: `${prefix}${idx + 1}.lbs`, bytes };
    });
    const tooBig = objects.some((o) => o.bytes.length > max);
    if (!tooBig) {
      const h = createHash('sha256');
      let total = 0;
      for (const o of objects) {
        h.update(o.bytes);
        total += o.bytes.length;
      }
      return {
        objects,
        manifest: {
          license_key: i.licenseKey,
          company_guid: i.companyGuid,
          kind: i.kind,
          seq: i.seq,
          storage_path: prefix,
          bytes: total,
          sha256: h.digest('hex'),
          enc: i.key !== null,
          from_alter_id: i.fromAlterId,
          to_alter_id: i.toAlterId,
        },
      };
    }
    if (groups.every((g) => g.length <= 1)) throw new LbError('BAD_RESPONSE', 'A single row is larger than the snapshot object limit.');
    budget = Math.floor(budget / 2);
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------

/** Storage and manifest port. Production wiring (Supabase Storage + `snapshots` table, connector role) comes with the scheduling phase. */
export interface SnapshotStore {
  /** Manifest rows of this company, any order. */
  listManifest(companyGuid: string): Promise<(SnapshotManifestRow & { created_at?: string })[]>;
  putObject(path: string, bytes: Buffer): Promise<void>;
  removeObject(path: string): Promise<void>;
  insertManifest(row: SnapshotManifestRow): Promise<void>;
  /** Objects under a path prefix with their stored sizes. When present, the builder verifies the upload before the manifest row is inserted. */
  listObjects?(prefix: string): Promise<{ path: string; bytes: number }[]>;
}

/** True when the objects of a snapshot are all there: parts 1..N contiguous under `prefix` and the sizes add up to the manifest `bytes`. */
export function objectsComplete(prefix: string, bytes: number, objects: { path: string; bytes: number }[]): boolean {
  const parts = new Map<number, number>();
  for (const o of objects) {
    if (!o.path.startsWith(prefix)) continue;
    const m = /^(\d+)\.lbs$/.exec(o.path.slice(prefix.length));
    if (m) parts.set(Number(m[1]), o.bytes);
  }
  if (parts.size === 0) return false;
  let sum = 0;
  for (let i = 1; i <= parts.size; i += 1) {
    const b = parts.get(i);
    if (b === undefined) return false;
    sum += b;
  }
  return sum === bytes;
}

/** Name of the vault device cursor that tracks what the last published snapshot already contains. */
export function snapshotCursorId(companyGuid: string): string {
  return '__snapshot__:' + companyGuid;
}

export interface SnapshotBuilderDeps {
  getVault(): Vault | null;
  model: DataModel;
  licenseKey(): string | null;
  /** Raw key from the keystore (`getKey`). */
  getKey(): Buffer | null;
  /** False only when the e2e_encryption flag is explicitly off (plaintext objects, debugging). Default true. */
  e2eEnabled?: () => boolean;
  store: SnapshotStore;
  maxObjectBytes?: number;
  now?: () => number;
  ivFor?: (part: number) => Buffer;
}

export type BuildResult =
  | { ok: true; kind: SnapshotKind; upgraded: boolean; row: SnapshotManifestRow; parts: number; lines: number }
  | { ok: false; reason: 'unchanged' }
  /** The snapshot would not fit in `maxBytes`; nothing was uploaded and the cursor did not move. */
  | { ok: false; reason: 'over_quota'; kind: SnapshotKind; bytes: number };

export interface BuildOptions {
  /** Refuse (before any upload) a snapshot whose stored size is above this. */
  maxBytes?: number;
}

const alterOf = (company: Row): number => Number(company['alter_id_voucher'] ?? 0) || 0;

export function createSnapshotBuilder(d: SnapshotBuilderDeps) {
  const now = d.now ?? Date.now;
  let running: Promise<BuildResult> | null = null;

  async function run(kind: SnapshotKind, opts: BuildOptions): Promise<BuildResult> {
    const vault = d.getVault();
    const lic = d.licenseKey();
    if (!vault) throw new LbError('NOT_CONFIGURED', 'The local data store is not open.');
    if (!lic) throw new LbError('NOT_CONFIGURED', 'No license is active.');
    const enc = d.e2eEnabled ? d.e2eEnabled() : true;
    const key = enc ? d.getKey() : null;
    if (enc && !key) throw new LbError('LB_CRYPTO_BAD_PASSPHRASE', 'Set up the data passphrase first (Settings, Security).');

    const company = vault.readTable('tm_company')[0];
    if (!company) throw new LbError('NOT_CONFIGURED', 'This PC has not read the company from Tally yet.');
    const cg = String(company['guid']);
    const manifest = await d.store.listManifest(cg);
    const seq = manifest.reduce((m, r) => Math.max(m, Number(r.seq)), 0) + 1;
    const latest = manifest.slice().sort((a, b) => Number(b.seq) - Number(a.seq))[0];
    const cursorId = snapshotCursorId(cg);
    const hasFull = manifest.some((r) => r.kind === 'full');

    // Everything below up to the first await is synchronous, so the reads and the head seq belong to one state.
    let effective: SnapshotKind = kind;
    let lines: string[] = [];
    let upTo = vault.headSeq();
    let fromAlter = 0;
    if (kind === 'delta') {
      const cursor = vault.cursor(cursorId);
      const ch = cursor > 0 && hasFull ? vault.changedSince(cursor, { batch: SYNC_DEFAULTS.chunkMaxRows }) : null;
      if (!ch || ch.needsFull) {
        effective = 'full';
      } else {
        const dl = deltaLines(d.model, company, ch.batches, cg);
        if (dl.changed === 0) {
          vault.setCursor(cursorId, ch.upTo);
          return { ok: false, reason: 'unchanged' };
        }
        lines = dl.lines;
        upTo = ch.upTo;
        fromAlter = latest ? Number(latest.to_alter_id) : 0;
      }
    }
    if (effective === 'full') {
      const tables: Record<string, Row[]> = {};
      for (const t of SYNC_DEFAULTS.tableOrder) tables[t] = vault.readTable(t);
      lines = fullLines(d.model, tables, cg);
      upTo = vault.headSeq();
      fromAlter = 0;
    }

    const asOf = new Date(now()).toISOString().slice(0, 10);
    const enc1 = encodeSnapshot({
      licenseKey: lic,
      companyGuid: cg,
      kind: effective,
      seq,
      asOf,
      fromAlterId: fromAlter,
      toAlterId: alterOf(company),
      lines,
      key,
      maxObjectBytes: d.maxObjectBytes,
      ivFor: d.ivFor,
    });

    if (opts.maxBytes !== undefined && enc1.manifest.bytes > opts.maxBytes) {
      logger.info('snapshot', 'snapshot would exceed the size budget, not uploaded', { kind: effective, bytes: enc1.manifest.bytes, maxBytes: opts.maxBytes });
      return { ok: false, reason: 'over_quota', kind: effective, bytes: enc1.manifest.bytes };
    }

    // Objects first, the manifest row last: a device only sees a snapshot that is complete.
    const done: string[] = [];
    try {
      for (const o of enc1.objects) {
        await d.store.putObject(o.path, o.bytes);
        done.push(o.path);
      }
      if (d.store.listObjects) {
        const got = await d.store.listObjects(enc1.manifest.storage_path);
        if (!objectsComplete(enc1.manifest.storage_path, enc1.manifest.bytes, got)) throw new LbError('BAD_RESPONSE', 'The uploaded snapshot could not be verified.');
      }
      await d.store.insertManifest(enc1.manifest);
    } catch (e) {
      for (const p of done) {
        try {
          await d.store.removeObject(p);
        } catch {
          /* the retention sweep (Phase 32) removes orphans */
        }
      }
      logger.warn('snapshot', 'snapshot upload failed, nothing published', { kind: effective, seq, err: e });
      throw e;
    }
    vault.setCursor(cursorId, upTo);
    logger.info('snapshot', 'snapshot published', { kind: effective, requested: kind, seq, parts: enc1.objects.length, bytes: enc1.manifest.bytes, lines: lines.length, enc: enc1.manifest.enc });
    return { ok: true, kind: effective, upgraded: effective !== kind, row: enc1.manifest, parts: enc1.objects.length, lines: lines.length };
  }

  return {
    /** Builds and publishes one snapshot. A delta that cannot be built (no full yet, no cursor, tombstones pruned) becomes a full one (`upgraded`). Single-flight. */
    build(kind: SnapshotKind, opts: BuildOptions = {}): Promise<BuildResult> {
      if (!running) {
        running = run(kind, opts).finally(() => {
          running = null;
        });
      }
      return running;
    },
  };
}

export type SnapshotBuilder = ReturnType<typeof createSnapshotBuilder>;
