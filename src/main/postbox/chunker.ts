/*
LazyBooks | src/main/postbox/chunker.ts
Responsibility: Chunker
Introduced by: Phase 20 (chunker) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 20)
*/

/**
 * Rows -> chunks (SYNC_SPEC sections 3, 5, 6). Pure: no I/O, no Electron, no Supabase, no clock unless injected.
 * It turns table rows (or a list of change ops) into an ordered chunk sequence, and an ordered sequence into
 * `sync_chunks` insert rows addressed to one device. Reading the vault, deciding what a request needs (Phase 22),
 * encrypting (Phase 21; the `encode` seam below) and inserting (Phases 22 and 23) are not done here.
 *
 * Rules implemented:
 * - a payload is at most `chunk_max_payload_bytes` (200000) of compact UTF-8 JSON and at most `chunk_max_rows` (500) rows,
 *   split greedily in the given row order; the limit applies to the PLAINTEXT payload (before gzip/encryption);
 * - upsert rows omit columns equal to their data_model default, primary-key columns always stay (section 3.2);
 * - initial sequence: tables in `table_order`, per table `clear` (not tm_company) then upserts, vouchers via `replace_scope`,
 *   then child tables of the sent vouchers; `seq` contiguous from 1; `is_last` only on the final chunk; an empty sequence is one
 *   empty `tm_company` upsert (section 6);
 * - a single row larger than the limit is sent alone (it cannot be split); `oversize` counts them.
 */
import { SYNC_DEFAULTS } from '../../shared/constants';
import type { DataModel, ModelTable } from '../db/model';

export type Row = Record<string, unknown>;
export type ChunkOpName = 'upsert' | 'delete' | 'clear' | 'replace_scope' | 'delete_children';

/** One change operation (same shape as the vault's `VaultOp`). */
export interface ChunkOp {
  table_name: string;
  op: ChunkOpName;
  payload: Row[] | Row;
}

/** A chunk before it is addressed to a device. */
export interface ChunkDraft {
  seq: number;
  table_name: string;
  op: ChunkOpName;
  enc: boolean;
  is_last: boolean;
  payload: unknown;
}

export interface ChunkLimits {
  maxPayloadBytes: number;
  maxRows: number;
}

export const DEFAULT_LIMITS: ChunkLimits = { maxPayloadBytes: SYNC_DEFAULTS.chunkMaxPayloadBytes, maxRows: SYNC_DEFAULTS.chunkMaxRows };

/** Phase 21 plugs encryption in here: receives the PLAINTEXT payload, returns what is stored (`enc` true = envelope). */
export type PayloadEncoder = (payload: unknown) => { enc: boolean; payload: unknown };

export interface SequenceOptions {
  limits?: ChunkLimits;
  encode?: PayloadEncoder;
}

export interface SequenceStats {
  chunks: number;
  rows: number;
  /** rows that alone exceed the byte limit */
  oversize: number;
}

const enc = new TextEncoder();
const bytes = (v: unknown): number => enc.encode(JSON.stringify(v)).length;

function canonicalDefault(v: unknown): unknown {
  return v === undefined ? null : v;
}

/** Omit every column whose value equals its default, except primary-key columns (SYNC_SPEC 3.2). Output keeps model column order. */
export function compactRow(model: DataModel, table: string, row: Row): Row {
  const meta = tableMeta(model, table);
  const out: Row = {};
  for (const c of meta.columns) {
    const def = canonicalDefault(c.default);
    const raw = row[c.name];
    const v = raw === undefined ? def : raw;
    if (meta.primary_key.includes(c.name) || JSON.stringify(v) !== JSON.stringify(def)) out[c.name] = v;
  }
  return out;
}

function tableMeta(model: DataModel, table: string): ModelTable {
  const m = model.tables[table];
  if (!m) throw new Error(`Unknown table ${table}`);
  return m;
}

/**
 * Greedy split in the given order. The size of an array payload is 2 + sum(row sizes) + (n - 1) commas, tracked
 * incrementally, so a very large table costs one pass.
 */
export function splitRows<T>(rows: T[], limits: ChunkLimits = DEFAULT_LIMITS): { parts: T[][]; oversize: number } {
  const parts: T[][] = [];
  let cur: T[] = [];
  let size = 2;
  let oversize = 0;
  for (const r of rows) {
    const n = bytes(r);
    if (n + 2 > limits.maxPayloadBytes) oversize += 1;
    const next = size + n + (cur.length > 0 ? 1 : 0);
    if (cur.length > 0 && (cur.length + 1 > limits.maxRows || next > limits.maxPayloadBytes)) {
      parts.push(cur);
      cur = [r];
      size = 2 + n;
    } else {
      cur.push(r);
      size = next;
    }
  }
  if (cur.length > 0) parts.push(cur);
  return { parts, oversize };
}

/** Builds a sequence chunk by chunk; `finish()` sets `is_last` (adding the empty tm_company upsert when nothing was added). */
export function createSequenceBuilder(o: SequenceOptions = {}) {
  const limits = o.limits ?? DEFAULT_LIMITS;
  const chunks: ChunkDraft[] = [];
  const stats: SequenceStats = { chunks: 0, rows: 0, oversize: 0 };

  function add(table: string, op: ChunkOpName, payload: unknown): void {
    const e = o.encode ? o.encode(payload) : { enc: false, payload };
    chunks.push({ seq: chunks.length + 1, table_name: table, op, enc: e.enc, is_last: false, payload: e.payload });
    stats.chunks += 1;
  }

  /** Split `rows` into upsert / delete / delete_children chunks. Empty input adds nothing. */
  function addRows(table: string, op: 'upsert' | 'delete' | 'delete_children', rows: Row[]): void {
    const { parts, oversize } = splitRows(rows, limits);
    stats.oversize += oversize;
    for (const p of parts) {
      add(table, op, p);
      stats.rows += p.length;
    }
  }

  return {
    add,
    addRows,
    finish(): { chunks: ChunkDraft[]; stats: SequenceStats } {
      if (chunks.length === 0) add('tm_company', 'upsert', []);
      const last = chunks[chunks.length - 1];
      if (last) last.is_last = true;
      return { chunks, stats };
    },
  };
}

export interface InitialInput {
  model: DataModel;
  /** vault rows per table, wire shape (decoded: json columns as arrays/objects, decimals as strings, dates ISO) */
  tables: Record<string, Row[]>;
  companyGuid: string;
  /** inclusive ISO dates of the voucher window */
  from: string;
  to: string;
}

function lessStr(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * The initial sequence for one company and window (SYNC_SPEC section 5): masters in table order (`clear`, then upserts),
 * `replace_scope`, vouchers sorted by (date, guid), then the child rows of exactly those vouchers sorted by primary key.
 */
export function initialSequence(i: InitialInput, o: SequenceOptions = {}): { chunks: ChunkDraft[]; stats: SequenceStats } {
  const b = createSequenceBuilder(o);
  const order = SYNC_DEFAULTS.tableOrder as readonly string[];
  const voucher = tableMeta(i.model, 'tx_voucher');
  const dateCol = voucher.date_column ?? 'date';
  const children = new Set((voucher.children ?? []).map((c) => c.table));

  for (const t of order) {
    const meta = tableMeta(i.model, t);
    if (children.has(t) || meta.scope === 'date_windowed') continue;
    const rows = (i.tables[t] ?? []).filter((r) => (t === 'tm_company' ? r['guid'] === i.companyGuid : r['company_guid'] === i.companyGuid));
    if (t !== 'tm_company') b.add(t, 'clear', { company_guid: i.companyGuid });
    b.addRows(t, 'upsert', rows.map((r) => compactRow(i.model, t, r)));
  }

  b.add('tx_voucher', 'replace_scope', { company_guid: i.companyGuid, from: i.from, to: i.to });
  const vouchers = (i.tables['tx_voucher'] ?? [])
    .filter((r) => r['company_guid'] === i.companyGuid && String(r[dateCol]) >= i.from && String(r[dateCol]) <= i.to)
    .sort((x, y) => lessStr(String(x[dateCol]), String(y[dateCol])) || lessStr(String(x['guid']), String(y['guid'])));
  const guids = new Set(vouchers.map((v) => String(v['guid'])));
  b.addRows('tx_voucher', 'upsert', vouchers.map((r) => compactRow(i.model, 'tx_voucher', r)));

  for (const t of order) {
    if (!children.has(t)) continue;
    const pk = tableMeta(i.model, t).primary_key;
    const key = (r: Row): string[] => pk.map((k) => String(r[k]).padStart(8, '0'));
    const rows = (i.tables[t] ?? [])
      .filter((r) => guids.has(String(r['voucher_guid'])))
      .sort((x, y) => {
        const a = key(x);
        const c = key(y);
        for (let n = 0; n < a.length; n += 1) {
          const d = lessStr(a[n] as string, c[n] as string);
          if (d !== 0) return d;
        }
        return 0;
      });
    b.addRows(t, 'upsert', rows.map((r) => compactRow(i.model, t, r)));
  }
  return b.finish();
}

/**
 * Chunks a list of change ops in the order given (a delta, Phase 22). Upsert rows are compacted; `delete` and
 * `delete_children` key lists are split by the same limits; `clear` and `replace_scope` pass through unchanged.
 * An empty row list adds no chunk. The caller puts the `tm_company` upsert first (SYNC_SPEC section 7).
 */
export function opsSequence(model: DataModel, ops: ChunkOp[], o: SequenceOptions = {}): { chunks: ChunkDraft[]; stats: SequenceStats } {
  const b = createSequenceBuilder(o);
  for (const op of ops) {
    if (op.op === 'clear' || op.op === 'replace_scope') {
      b.add(op.table_name, op.op, op.payload);
      continue;
    }
    const rows = Array.isArray(op.payload) ? op.payload : [];
    b.addRows(op.table_name, op.op, op.op === 'upsert' ? rows.map((r) => compactRow(model, op.table_name, r)) : rows);
  }
  return b.finish();
}

/** A `sync_chunks` row to insert (id is assigned by the database). */
export interface SyncChunkRow {
  license_key: string;
  device_id: string;
  request_id: string;
  seq: number;
  table_name: string;
  op: ChunkOpName;
  payload: unknown;
  enc: boolean;
  is_last: boolean;
  created_at: string;
  expires_at: string;
}

export interface Target {
  licenseKey: string;
  deviceId: string;
  requestId: string;
  nowMs: number;
  ttlHours?: number;
}

/** Per-device targeting and expiry (`expires_at` = created + `chunk_ttl_hours`). */
export function addressChunks(chunks: ChunkDraft[], t: Target): SyncChunkRow[] {
  const created = new Date(t.nowMs).toISOString();
  const expires = new Date(t.nowMs + (t.ttlHours ?? SYNC_DEFAULTS.chunkTtlHours) * 3600_000).toISOString();
  return chunks.map((c) => ({
    license_key: t.licenseKey,
    device_id: t.deviceId,
    request_id: t.requestId,
    seq: c.seq,
    table_name: c.table_name,
    op: c.op,
    payload: c.payload,
    enc: c.enc,
    is_last: c.is_last,
    created_at: created,
    expires_at: expires,
  }));
}

/** Contract checks on a finished sequence (SYNC_SPEC section 6). Returns plain-language problems; empty = valid. */
export function validateSequence(chunks: Pick<ChunkDraft, 'seq' | 'is_last'>[]): string[] {
  const bad: string[] = [];
  if (chunks.length === 0) return ['The sequence has no chunks.'];
  chunks.forEach((c, n) => {
    if (c.seq !== n + 1) bad.push(`Chunk ${n + 1} has seq ${c.seq}.`);
    if (c.is_last !== (n === chunks.length - 1)) bad.push(`Chunk ${n + 1} has a wrong is_last flag.`);
  });
  return bad;
}

/** Plain (not encrypted) chunks back to ops, for tests and for applying a sequence to a vault. */
export function chunksToOps(chunks: ChunkDraft[]): ChunkOp[] {
  return chunks.map((c) => {
    if (c.enc) throw new Error('Encrypted chunk: decrypt first');
    return { table_name: c.table_name, op: c.op, payload: c.payload as Row[] | Row };
  });
}
