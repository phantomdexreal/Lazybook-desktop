/*
LazyBooks | src/main/postbox/serve.ts
Responsibility: Serve initial + delta
Introduced by: Phase 22 (serve-initial-delta) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 22)
*/

/**
 * Turns an `initial` or `delta` request into encrypted `sync_chunks` rows for the device that asked, and moves that
 * device's vault cursor once the device has applied the last chunk (SYNC_SPEC sections 2, 4, 6, 7).
 *
 * - initial: masters in full, vouchers of the date window, from the vault (never straight from Tally; the scheduler keeps
 *   the vault current and `refresh` is asked to run once first so the answer is fresh when Tally is up).
 * - delta: everything the vault changed after this device's cursor (`changedSince`), deletes included, plus the company row
 *   first so the device's alter-id cursors always move. A device with no cursor, or one older than the pruned tombstones,
 *   is given an initial sequence instead (the device does not care which kind produced a stream).
 * - ack: the device deletes chunks as it applies them, so "the last chunk is gone" means the whole sequence was applied; only
 *   then does the cursor move to the head seq read at serve time. Never on a timer, never on insert.
 * - resend: chunks already stored for the same request id are removed before the new sequence goes in, so a retried request
 *   cannot leave two different streams behind.
 * Pending acks are kept in memory: after a restart the cursor stays where it was and the next delta re-sends a little (every
 * op is idempotent). In-flight limits, retries and cleanup are `hygiene.ts` (Phase 23); with it a long sequence is sent in windows of at most
 * 40 unacked chunks per device, so `serve` returns only after the device has taken all but the last window. No Electron import; never logs names, guids or row data.
 */
import { SYNC_DEFAULTS } from '../../shared/constants';
import { LbError } from '../errors';
import { logger } from '../logger';
import type { Vault } from '../db';
import type { DataModel } from '../db/model';
import type { TargetClient } from '../supabase';
import { addressChunks, initialSequence, opsSequence, validateSequence, type ChunkDraft, type ChunkOp, type PayloadEncoder, type Row, type SyncChunkRow } from './chunker';
import type { SyncRequest } from './listener';
import type { Hygiene } from './hygiene';

const HISTORY_DAYS_DEFAULT = 365; // constants sync.history_days_default
const HISTORY_DAYS_MAX = 1095; // constants sync.history_days_max
const INSERT_GROUP_BYTES = 1_500_000; // one POST stays well under typical request body limits
const INSERT_GROUP_ROWS = 50;
const ACK_POLL_MS = 5000;

export interface ServeDeps {
  getVault(): Vault | null;
  model: DataModel;
  licenseKey(): string | null;
  /** The company the connector is set up for (config), used when the request names none. */
  companyGuid?: () => string | null;
  activation: { getAccessToken(): Promise<string>; targetClient(): TargetClient | null };
  /** Payload encoder (Phase 21 `keystore.encoder()`); it throws when no key is available, which fails the request. */
  encoder: () => PayloadEncoder;
  /** Ask the scheduler for one pull first. A failure (Tally closed) is logged and the vault is served as it is. */
  refresh?: () => Promise<unknown>;
  /** Phase 23: in-flight window, retry with backoff, request budget and cleanup. Absent: plain unlimited inserts (tests of the bare path). */
  hygiene?: Hygiene;
  ackPollMs?: number;
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (t: unknown) => void;
}

interface PendingAck {
  requestId: string;
  deviceId: string;
  lastSeq: number;
  upTo: number;
  giveUpAt: number;
}

export interface ServeResult {
  mode: 'initial' | 'delta';
  chunks: number;
  rows: number;
  oversize: number;
  upTo: number;
  /** a delta request answered with an initial sequence (no cursor, or the device is behind the pruned tombstones) */
  upgraded: boolean;
}

function isoDate(ms: number): string {
  const d = new Date(ms);
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function shiftDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  const t = new Date(Date.UTC(y, m - 1, d));
  t.setUTCDate(t.getUTCDate() + days);
  return t.toISOString().slice(0, 10);
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** The voucher window of an initial request (SYNC_SPEC 2): null dates mean today minus 365 days .. today, clipped to the books. */
export function resolveWindow(req: Pick<SyncRequest, 'from_date' | 'to_date'>, company: Row | undefined, nowMs: number): { from: string; to: string } {
  const today = isoDate(nowMs);
  let to = req.to_date && ISO.test(req.to_date) ? req.to_date : today;
  const books = company ? String(company['starting_from'] ?? '') : '';
  const end = company ? String(company['ending_at'] ?? '') : '';
  if (ISO.test(end) && to > end) to = end; // clip the end first so a default start is counted back from the real end
  let from = req.from_date && ISO.test(req.from_date) ? req.from_date : shiftDays(to, -HISTORY_DAYS_DEFAULT);
  const earliest = shiftDays(to, -HISTORY_DAYS_MAX);
  if (from < earliest) from = earliest;
  if (ISO.test(books) && from < books) from = books;
  if (to < from) to = from;
  return { from, to };
}

export function createServe(d: ServeDeps) {
  const now = d.now ?? Date.now;
  const setT = d.setTimer ?? ((fn: () => void, ms: number) => setTimeout(fn, ms));
  const clearT = d.clearTimer ?? ((t: unknown) => clearTimeout(t as NodeJS.Timeout));
  const ackMs = d.ackPollMs ?? ACK_POLL_MS;
  const pending = new Map<string, PendingAck>();
  let timer: unknown = null;
  let polling: Promise<void> | null = null;
  let stopped = false;

  async function session(): Promise<{ client: TargetClient; s: { accessToken: string; refreshToken: string; expiresAt: number } }> {
    const client = d.activation.targetClient();
    if (!client) throw new LbError('NOT_CONFIGURED', 'This PC is not signed in to the data project.');
    return { client, s: { accessToken: await d.activation.getAccessToken(), refreshToken: '', expiresAt: now() + 3600_000 } };
  }

  function pickCompany(vault: Vault, req: SyncRequest): Row {
    const companies = vault.readTable('tm_company');
    const want = req.company_guid ?? d.companyGuid?.() ?? null;
    const hit = want ? companies.find((c) => c['guid'] === want) : companies.length === 1 ? companies[0] : undefined;
    if (!hit) {
      throw new LbError('NOT_CONFIGURED', companies.length === 0 ? 'This PC has not read the company from Tally yet. Try again in a few minutes.' : 'That company is not the one this PC syncs.');
    }
    return hit;
  }

  function windowFilter(row: Row, table: string, from: string, to: string): boolean {
    const col = table === 'tx_voucher' ? 'date' : 'voucher_date';
    const v = String(row[col] ?? '');
    return !ISO.test(v.slice(0, 10)) || (v.slice(0, 10) >= from && v.slice(0, 10) <= to);
  }

  function buildInitial(vault: Vault, company: Row, req: SyncRequest, encode: PayloadEncoder): { chunks: ChunkDraft[]; rows: number; oversize: number; upTo: number } {
    const upTo = vault.headSeq(); // read first: nothing else writes between these synchronous calls
    const tables: Record<string, Row[]> = {};
    for (const t of SYNC_DEFAULTS.tableOrder) tables[t] = vault.readTable(t);
    const w = resolveWindow(req, company, now());
    const seq = initialSequence({ model: d.model, tables, companyGuid: String(company['guid']), from: w.from, to: w.to }, { encode });
    return { chunks: seq.chunks, rows: seq.stats.rows, oversize: seq.stats.oversize, upTo };
  }

  function buildDelta(vault: Vault, company: Row, req: SyncRequest, cursor: number, encode: PayloadEncoder): { chunks: ChunkDraft[]; rows: number; oversize: number; upTo: number } | null {
    const ch = vault.changedSince(cursor, { batch: SYNC_DEFAULTS.chunkMaxRows });
    if (ch.needsFull) return null;
    const ops: ChunkOp[] = [{ table_name: 'tm_company', op: 'upsert', payload: [company] }];
    const win = req.from_date && req.to_date && ISO.test(req.from_date) && ISO.test(req.to_date) ? { from: req.from_date, to: req.to_date } : null;
    const children = new Set((d.model.tables['tx_voucher']?.children ?? []).map((c) => c.table));
    for (const b of ch.batches) {
      if (b.table_name === 'tm_company') continue; // the current row is always first
      let payload = b.payload;
      if (win && b.op === 'upsert' && (b.table_name === 'tx_voucher' || children.has(b.table_name))) payload = payload.filter((r) => windowFilter(r, b.table_name, win.from, win.to));
      if (payload.length > 0) ops.push({ table_name: b.table_name, op: b.op, payload });
    }
    const seq = opsSequence(d.model, ops, { encode });
    return { chunks: seq.chunks, rows: seq.stats.rows, oversize: seq.stats.oversize, upTo: ch.upTo };
  }

  async function insertAll(rows: SyncChunkRow[], req: SyncRequest): Promise<void> {
    const { client, s } = await session();
    const rid = encodeURIComponent(req.id);
    const call = async (method: 'GET' | 'POST' | 'DELETE', path: string, body?: unknown, extra?: Record<string, string>): Promise<unknown> =>
      d.hygiene ? d.hygiene.rest(method, path, body, extra) : client.rest(s, method, path, body, extra);
    const old = (await call('GET', `sync_chunks?select=id&request_id=eq.${rid}&limit=1`)) as unknown[];
    if (Array.isArray(old) && old.length > 0) {
      await call('DELETE', `sync_chunks?request_id=eq.${rid}`);
      logger.info('postbox', 'earlier chunks of this request removed before resend', {});
    }
    const postGroups = async (slice: SyncChunkRow[]): Promise<void> => {
      let group: SyncChunkRow[] = [];
      let bytes = 0;
      const flush = async (): Promise<void> => {
        if (group.length === 0) return;
        await call('POST', 'sync_chunks', group, { prefer: 'return=minimal' });
        group = [];
        bytes = 0;
      };
      for (const r of slice) {
        const size = JSON.stringify(r.payload).length;
        if (group.length > 0 && (bytes + size > INSERT_GROUP_BYTES || group.length >= INSERT_GROUP_ROWS)) await flush();
        group.push(r);
        bytes += size;
      }
      await flush();
    };
    if (d.hygiene) {
      const w = await d.hygiene.sendWindowed(req.device_id, req.id, rows, postGroups);
      if (w.waits > 0) logger.info('postbox', 'sequence sent in windows', { windows: w.windows, waits: w.waits });
      return;
    }
    await postGroups(rows);
  }

  async function serve(req: SyncRequest, kind: 'initial' | 'delta'): Promise<ServeResult> {
    const vault = d.getVault();
    if (!vault) throw new LbError('NOT_CONFIGURED', 'The local data store is not available on this PC.');
    const lic = d.licenseKey();
    if (!lic) throw new LbError('NOT_CONFIGURED', 'No license is active on this PC.');
    const encode = d.encoder(); // build the encoder before any work so a locked key fails fast with its own message
    if (d.refresh) {
      try {
        await d.refresh();
      } catch (e) {
        logger.warn('postbox', 'refresh before serving failed, serving the vault as it is', { err: e });
      }
    }
    const company = pickCompany(vault, req);
    // Superseded: the device asked again, so an unfinished earlier sequence of it must never move the cursor.
    for (const [k, p] of pending) if (p.deviceId === req.device_id) pending.delete(k);

    let built: { chunks: ChunkDraft[]; rows: number; oversize: number; upTo: number } | null = null;
    let mode: 'initial' | 'delta' = kind;
    let upgraded = false;
    if (kind === 'delta') {
      const cursor = vault.cursor(req.device_id);
      built = cursor > 0 ? buildDelta(vault, company, req, cursor, encode) : null;
      if (!built) {
        mode = 'initial';
        upgraded = true;
      }
    }
    if (!built) built = buildInitial(vault, company, req, encode);

    const problems = validateSequence(built.chunks);
    if (problems.length > 0) {
      logger.error('postbox', 'built sequence is invalid', { problems });
      throw new LbError('BAD_RESPONSE', 'The connector built an invalid data sequence. Try again.');
    }
    if (built.oversize > 0) logger.warn('postbox', 'rows larger than the chunk limit were sent alone', { oversize: built.oversize });
    const rows = addressChunks(built.chunks, { licenseKey: lic, deviceId: req.device_id, requestId: req.id, nowMs: now() });
    await insertAll(rows, req);

    const ttl = SYNC_DEFAULTS.chunkTtlHours * 3600_000;
    pending.set(req.id, { requestId: req.id, deviceId: req.device_id, lastSeq: built.chunks.length, upTo: built.upTo, giveUpAt: now() + ttl });
    arm();
    logger.info('postbox', 'sequence sent', { mode, upgraded, chunks: built.chunks.length, rows: built.rows, upTo: built.upTo });
    return { mode, chunks: built.chunks.length, rows: built.rows, oversize: built.oversize, upTo: built.upTo, upgraded };
  }

  /** One round of ack checks; resolves when done. Exposed for tests and for a Realtime nudge later. */
  function pollAcks(): Promise<void> {
    if (polling) return polling;
    polling = (async () => {
      try {
        const vault = d.getVault();
        if (!vault || pending.size === 0) return;
        const { client, s } = await session();
        for (const p of [...pending.values()]) {
          if (now() >= p.giveUpAt) {
            // The server removes chunks after their expiry, which looks like an ack; never move the cursor on that.
            pending.delete(p.requestId);
            logger.info('postbox', 'ack wait ended without an ack', {});
            continue;
          }
          const left = (await client.rest(s, 'GET', `sync_chunks?select=id&request_id=eq.${encodeURIComponent(p.requestId)}&seq=eq.${p.lastSeq}&limit=1`)) as unknown[];
          if (Array.isArray(left) && left.length === 0) {
            pending.delete(p.requestId);
            const at = vault.setCursor(p.deviceId, p.upTo, new Date(now()));
            logger.info('postbox', 'device applied the sequence, cursor moved', { cursor: at });
          }
        }
      } catch (e) {
        logger.warn('postbox', 'ack check failed, will retry', { err: e });
      } finally {
        polling = null;
        if (!stopped) arm();
      }
    })();
    return polling;
  }

  function arm(): void {
    if (stopped || timer !== null || pending.size === 0) return;
    timer = setT(() => {
      timer = null;
      void pollAcks();
    }, ackMs);
  }

  return {
    /** Register these with the request listener: `handlers: { ...serve.handlers }`. */
    handlers: {
      initial: async (req: SyncRequest): Promise<void> => {
        await serve(req, 'initial');
      },
      delta: async (req: SyncRequest): Promise<void> => {
        await serve(req, 'delta');
      },
    },
    serve,
    pollAcks,
    pendingAcks: (): number => pending.size,
    start(): void {
      stopped = false;
    },
    stop(): void {
      stopped = true;
      if (timer !== null) clearT(timer);
      timer = null;
    },
  };
}

export type Serve = ReturnType<typeof createServe>;
