/*
LazyBooks | src/main/entries/listener.ts
Responsibility: Entry listener
Introduced by: Phase 24 (entry-listener) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 24)
*/

/**
 * Receives `entry_queue` rows from devices and walks each one through queued -> posting -> posted | failed | needs_review | queued (retry)
 * (SHARED_CONTRACTS 4.2, ENTRY_PAYLOADS 1, 5, 6), one entry at a time, oldest first.
 *
 * What an entry MEANS is not decided here. After the envelope check (version, kind, ids, size, unknown keys, company) the entry is handed to the
 * handler registered for its kind (Phases 25 to 30 plug in; `postEntry` of Phase 27 does the idempotency pre-check). A kind without a handler is
 * failed at once with a plain text, so the device sees it instead of waiting.
 *
 * - Claim: `PATCH entry_queue?id=eq.<id>&status=eq.queued&attempts=eq.<n>` sets status posting and attempts n+1 and returns the row; an empty answer means
 *   someone else (or a repeat) got it first and nothing is posted. A row can therefore be claimed only once.
 * - Crash recovery: a `posting` row seen at poll time is an orphan (this listener works single-flight, so none of its own is in progress). It is
 *   re-claimed (attempts + 1) and handed over with `recovered: true`; the Tally idempotency pre-check (Phase 27) is mandatory for it. Past
 *   `desktop.entry_max_attempts` it becomes `needs_review` (never auto-retried again).
 * - Attempts: a retryable failure (Tally closed) puts the row back to `queued` with the failure in `result`, retried after a growing pause, until
 *   `entry_max_attempts` (3), then `failed`. Non-retryable outcomes are final at once. `needs_review` is final until a human acts.
 * - Write-back: every final write goes through the offline outbox (hygiene.ts): a dropped link keeps it and the next poll replays it before anything new starts.
 *   Writes are guarded by `status=eq.posting`, so a row a human cancelled or reset meanwhile is never overwritten.
 * Polling: every `desktop.entry_listener_poll_s` (5 s), never faster than `polling.min_poll_interval_ms` (2 s); errors back off x2 up to 60 s; `nudge()` is the Realtime seam.
 * The full semantic checks S01-S11 and the detail-to-status table of `entry_rules.json` belong to the builders (25) and result mapping (28); here only the
 * few details the listener itself produces are mapped (`DETAILS`). No Electron import; never logs payloads, names or guids.
 */
import { DESKTOP_DEFAULTS } from '../../shared/constants';
import { LbError } from '../errors';
import { logger } from '../logger';
import type { TargetClient } from '../supabase';
import { createOutbox } from '../postbox/hygiene';
import { friendlyMessage } from './results';

export type EntryKind = 'invoice' | 'receipt' | 'payment' | 'contra' | 'journal' | 'inventory_voucher' | 'order' | 'quotation' | 'ledger' | 'stock_item' | 'alter' | 'cancel' | 'delete';
export const ENTRY_KINDS: readonly EntryKind[] = ['invoice', 'receipt', 'payment', 'contra', 'journal', 'inventory_voucher', 'order', 'quotation', 'ledger', 'stock_item', 'alter', 'cancel', 'delete'];
export type EntryStatus = 'queued' | 'posting' | 'posted' | 'failed' | 'needs_review' | 'cancelled';

/** An `entry_queue` row (sql/02_license_project_schema.sql). */
export interface EntryRow {
  id: string;
  client_request_id: string;
  license_key: string;
  device_id: string;
  kind: string;
  payload: unknown;
  status: EntryStatus;
  result: unknown;
  attempts: number;
  created_at: string;
  updated_at: string;
  posted_at: string | null;
}

/** The validated envelope of a payload (ENTRY_PAYLOADS section 1). `data` is checked per kind by the builders. */
export interface Envelope {
  v: 1;
  kind: EntryKind;
  client_request_id: string;
  company_guid: string;
  created_at: string;
  device_id: string;
  data: Record<string, unknown>;
}

export interface EntryContext {
  row: EntryRow;
  envelope: Envelope;
  /** 1-based attempt number this run is (the row's `attempts` after the claim) */
  attempt: number;
  /** the row was left in `posting` by an earlier run: the Tally pre-check for an existing voucher is mandatory */
  recovered: boolean;
}

/** What a handler returns. A thrown `LbError('LB_TALLY_UNREACHABLE')` counts as a retryable TALLY_UNREACHABLE, any other throw as AMBIGUOUS_RESULT (needs_review). */
export type EntryOutcome =
  | { ok: true; guid?: string; voucher_number?: string; alter_id?: number; message?: string }
  | { ok: false; detail: string; message?: string; tally_raw?: string };

export type EntryHandler = (ctx: EntryContext) => Promise<EntryOutcome>;

export interface DetailRule {
  code: string;
  status: EntryStatus;
  retryable: boolean;
}

/** The detail codes this module itself produces (entry_rules.json `result.details`; Phase 28 supplies the full table through `mapDetail`). */
export const DETAILS: Readonly<Record<string, DetailRule>> = {
  PAYLOAD_INVALID: { code: 'LB_TALLY_REJECTED', status: 'failed', retryable: false },
  UNSUPPORTED_VERSION: { code: 'LB_CONTRACT_TOO_OLD', status: 'failed', retryable: false },
  COMPANY_MISMATCH: { code: 'LB_TALLY_REJECTED', status: 'failed', retryable: false },
  TALLY_UNREACHABLE: { code: 'LB_TALLY_UNREACHABLE', status: 'queued', retryable: true },
  TALLY_COMPANY_NOT_LOADED: { code: 'LB_TALLY_UNREACHABLE', status: 'queued', retryable: true },
  FLAG_DISABLED: { code: 'LB_FLAG_DISABLED', status: 'failed', retryable: false },
  DUPLICATE_CLIENT_REQUEST: { code: 'LB_ENTRY_DUPLICATE', status: 'posted', retryable: false },
  AMBIGUOUS_RESULT: { code: 'LB_ENTRY_NEEDS_REVIEW', status: 'needs_review', retryable: false },
  UNKNOWN: { code: 'LB_TALLY_REJECTED', status: 'failed', retryable: false },
};

export interface EntryListenerState {
  busy: boolean;
  lastPollAt: string | null;
  /** entries waiting (queued) at the last poll */
  waiting: number;
  posted: number;
  failed: number;
  needsReview: number;
  /** retryable failures put back to queued */
  retried: number;
  pollFailures: number;
  message: string | null;
}

export interface EntryListenerDeps {
  activation: {
    state(): { stage: string };
    getAccessToken(): Promise<string>;
    targetClient(): TargetClient | null;
  };
  licenseKey(): string | null;
  /** Non-null while nothing may run (device revoked, license blocked, not activated). The text is logged. */
  blocked(): string | null;
  handlers?: Partial<Record<EntryKind, EntryHandler>>;
  /** The company this connector serves; an entry for another company fails with COMPANY_MISMATCH (S01). Omit to skip the check. */
  companyGuid?: () => string | null;
  /** False when the license has the `entries` feature off: entries fail with FLAG_DISABLED. Default: enabled. */
  entriesEnabled?: () => boolean;
  /** Replace the detail table (Phase 28). Unknown details fall back to `UNKNOWN`. */
  mapDetail?: (detail: string) => DetailRule | undefined;
  /** JSON file for the offline outbox so unwritten results survive a restart. */
  outboxFile?: string;
  pollMs?: number;
  maxAttempts?: number;
  /** pause before a retryable entry is tried again: base * attempt (default 60 s) */
  retryBaseMs?: number;
  maxPayloadBytes?: number;
  onChange?: (s: EntryListenerState) => void;
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (t: unknown) => void;
}

const MIN_POLL_MS = 2000; // constants polling.min_poll_interval_ms
const MAX_BACKOFF_MS = 60_000;
const MAX_PAYLOAD_BYTES = 100_000; // constants limits.entry_payload_max_bytes
const MESSAGE_MAX = 300;
const ENVELOPE_KEYS = ['v', 'kind', 'client_request_id', 'company_guid', 'created_at', 'device_id', 'data'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const TEXT = {
  noHandler: 'This connector cannot post this kind of entry yet. Update LazyBooks on this PC and create the entry again.',
  disabled: 'Entries are not enabled for this license.',
  tallyDown: 'Tally is not reachable on the PC. The entry will be tried again.',
  tallyDownFinal: 'Tally could not be reached after several tries. Open Tally on the PC and create the entry again.',
  ambiguous: 'The connector stopped while posting this entry, so it cannot tell whether Tally has it. Check Tally, then act in the review queue.',
  unexpected: 'The connector could not tell whether Tally accepted this entry. Check Tally, then act in the review queue.',
  version: 'This entry was made by a newer app version. Update LazyBooks on the PC.',
  invalid: 'The entry is not in the expected format.',
  company: 'The entry belongs to a different company than the one this PC syncs.',
};

function isRow(v: unknown): v is EntryRow {
  if (v === null || typeof v !== 'object') return false;
  const r = v as Record<string, unknown>;
  return typeof r['id'] === 'string' && typeof r['kind'] === 'string' && typeof r['status'] === 'string' && typeof r['client_request_id'] === 'string';
}

function clip(s: string | undefined): string | undefined {
  if (s === undefined) return undefined;
  return s.length > MESSAGE_MAX ? s.slice(0, MESSAGE_MAX - 1) + '.' : s;
}

interface Write {
  status: EntryStatus;
  result: Record<string, unknown>;
  posted_at: string | null;
  /** the attempts value to keep (a retry write must not change it) */
  attempts: number;
}

export function createEntryListener(d: EntryListenerDeps) {
  const now = d.now ?? Date.now;
  const setT = d.setTimer ?? ((fn: () => void, ms: number) => setTimeout(fn, ms));
  const clearT = d.clearTimer ?? ((t: unknown) => clearTimeout(t as NodeJS.Timeout));
  const pollMs = Math.max(MIN_POLL_MS, d.pollMs ?? DESKTOP_DEFAULTS.entryListenerPollS * 1000);
  const maxAttempts = d.maxAttempts ?? DESKTOP_DEFAULTS.entryMaxAttempts;
  const retryBase = d.retryBaseMs ?? 60_000;
  const maxBytes = d.maxPayloadBytes ?? MAX_PAYLOAD_BYTES;
  const rule = (detail: string): DetailRule => d.mapDetail?.(detail) ?? DETAILS[detail] ?? (d.mapDetail?.('UNKNOWN') ?? DETAILS['UNKNOWN'] as DetailRule);

  let timer: unknown = null;
  let started = false;
  let stopped = false;
  let inflight: Promise<void> | null = null;
  let again = false;
  let lastTickAt = 0;
  let wasBlocked = false;
  let ctx: { client: TargetClient; session: { accessToken: string; refreshToken: string; expiresAt: number }; lic: string } | null = null;
  /** retryable entries wait here until their time (id -> epoch ms); memory only: after a restart they are simply tried again */
  const notBefore = new Map<string, number>();
  const st: EntryListenerState = { busy: false, lastPollAt: null, waiting: 0, posted: 0, failed: 0, needsReview: 0, retried: 0, pollFailures: 0, message: null };
  const emit = (): void => d.onChange?.({ ...st });
  const stamp = (): string => new Date(now()).toISOString();

  const outbox = createOutbox<Write>({
    file: d.outboxFile,
    now,
    deliver: async (id, w) => {
      const c = ctx;
      if (!c) throw new LbError('NETWORK', 'not ready');
      c.session.accessToken = await d.activation.getAccessToken();
      const body: Record<string, unknown> = { status: w.status, result: w.result, updated_at: stamp() };
      if (w.posted_at) body['posted_at'] = w.posted_at;
      // guarded: only a row still in posting is written (a cancelled or reset row is left alone)
      const rows = await c.client.rest(c.session, 'PATCH', `entry_queue?id=eq.${encodeURIComponent(id)}&status=eq.posting`, body, { prefer: 'return=representation' });
      if (!Array.isArray(rows) || rows.length === 0) logger.warn('postbox', 'entry result not written: row is no longer posting', {});
    },
  });

  function context(): NonNullable<typeof ctx> | null {
    const lic = d.licenseKey();
    const client = d.activation.targetClient();
    if (d.activation.state().stage !== 'active' || !lic || !client) return null;
    ctx = { client, session: { accessToken: '', refreshToken: '', expiresAt: 0 }, lic };
    return ctx;
  }

  /** Envelope checks. Returns the envelope, or the detail and a plain text. */
  function check(row: EntryRow): { env: Envelope } | { detail: string; message: string } {
    const bad = (detail: string, message: string): { detail: string; message: string } => ({ detail, message });
    const p = row.payload;
    if (p === null || typeof p !== 'object' || Array.isArray(p)) return bad('PAYLOAD_INVALID', TEXT.invalid);
    let size = 0;
    try {
      size = Buffer.byteLength(JSON.stringify(p), 'utf8');
    } catch {
      return bad('PAYLOAD_INVALID', TEXT.invalid);
    }
    if (size > maxBytes) return bad('PAYLOAD_INVALID', 'The entry is too large.');
    const o = p as Record<string, unknown>;
    if (o['v'] !== 1) return bad(typeof o['v'] === 'number' && o['v'] > 1 ? 'UNSUPPORTED_VERSION' : 'PAYLOAD_INVALID', typeof o['v'] === 'number' && o['v'] > 1 ? TEXT.version : TEXT.invalid);
    for (const k of Object.keys(o)) if (!ENVELOPE_KEYS.includes(k)) return bad('PAYLOAD_INVALID', TEXT.invalid);
    for (const k of ENVELOPE_KEYS) if (!(k in o)) return bad('PAYLOAD_INVALID', TEXT.invalid);
    const kind = o['kind'];
    if (typeof kind !== 'string' || !ENTRY_KINDS.includes(kind as EntryKind) || kind !== row.kind) return bad('PAYLOAD_INVALID', TEXT.invalid);
    if (typeof o['client_request_id'] !== 'string' || !UUID.test(o['client_request_id']) || o['client_request_id'] !== row.client_request_id) return bad('PAYLOAD_INVALID', TEXT.invalid);
    if (typeof o['device_id'] !== 'string' || !UUID.test(o['device_id'])) return bad('PAYLOAD_INVALID', TEXT.invalid);
    if (typeof o['company_guid'] !== 'string' || o['company_guid'].length < 1 || o['company_guid'].length > 80) return bad('PAYLOAD_INVALID', TEXT.invalid);
    if (typeof o['created_at'] !== 'string' || Number.isNaN(Date.parse(o['created_at']))) return bad('PAYLOAD_INVALID', TEXT.invalid);
    if (o['data'] === null || typeof o['data'] !== 'object' || Array.isArray(o['data'])) return bad('PAYLOAD_INVALID', TEXT.invalid);
    const mine = d.companyGuid?.() ?? null;
    if (mine && o['company_guid'] !== mine) return bad('COMPANY_MISMATCH', TEXT.company);
    return { env: o as unknown as Envelope };
  }

  function failResult(detail: string, message?: string, tallyRaw?: string): Record<string, unknown> {
    const r = rule(detail);
    const out: Record<string, unknown> = { ok: false, code: r.code, detail, retryable: r.retryable };
    // Phase 28: a failure always carries a plain sentence for the person; the handler's own text wins, else the table text of the detail
    out['message'] = clip(message ?? friendlyMessage(detail));
    if (tallyRaw) out['tally_raw'] = tallyRaw.slice(0, 2000);
    return out;
  }

  /** Turns an outcome into the row write, applying the attempts rule for retryable failures. */
  function toWrite(o: EntryOutcome, attempt: number): { w: Write; kind: 'posted' | 'failed' | 'needs_review' | 'retry' } {
    if (o.ok) {
      const result: Record<string, unknown> = { ok: true };
      if (o.guid !== undefined) result['guid'] = o.guid;
      if (o.voucher_number !== undefined) result['voucher_number'] = o.voucher_number;
      if (o.alter_id !== undefined) result['alter_id'] = o.alter_id;
      if (o.message !== undefined) result['message'] = clip(o.message);
      return { w: { status: 'posted', result, posted_at: stamp(), attempts: attempt }, kind: 'posted' };
    }
    const r = rule(o.detail);
    if (r.status === 'posted') {
      // e.g. DUPLICATE_CLIENT_REQUEST: ok:true semantics with the existing voucher (the handler supplies the guid through `ok:true`; a bare detail still closes the entry)
      return { w: { status: 'posted', result: { ok: true, message: clip(o.message) ?? 'Already posted', detail: o.detail }, posted_at: stamp(), attempts: attempt }, kind: 'posted' };
    }
    if (r.retryable && r.status === 'queued') {
      if (attempt >= maxAttempts) {
        return { w: { status: 'failed', result: failResult(o.detail, TEXT.tallyDownFinal, o.tally_raw), posted_at: null, attempts: attempt }, kind: 'failed' };
      }
      return { w: { status: 'queued', result: failResult(o.detail, o.message ?? TEXT.tallyDown, o.tally_raw), posted_at: null, attempts: attempt }, kind: 'retry' };
    }
    const status: EntryStatus = r.status === 'needs_review' ? 'needs_review' : 'failed';
    return { w: { status, result: failResult(o.detail, o.message, o.tally_raw), posted_at: null, attempts: attempt }, kind: status === 'needs_review' ? 'needs_review' : 'failed' };
  }

  async function finish(c: NonNullable<typeof ctx>, row: EntryRow, w: Write, kind: 'posted' | 'failed' | 'needs_review' | 'retry', t0: number): Promise<void> {
    if (kind === 'retry') notBefore.set(row.id, now() + retryBase * w.attempts);
    else notBefore.delete(row.id);
    outbox.enqueue(row.id, w);
    if (kind === 'posted') st.posted += 1;
    else if (kind === 'failed') st.failed += 1;
    else if (kind === 'needs_review') st.needsReview += 1;
    else st.retried += 1;
    logger.info('postbox', 'entry handled', { id: row.id, kind: row.kind, result: kind, attempt: w.attempts, ms: now() - t0 });
    emit();
    try {
      await outbox.flush(); // a failure keeps the write queued for the next poll
    } catch (e) {
      logger.warn('postbox', 'entry result kept for later', { err: e });
    }
    void c;
  }

  async function runOne(c: NonNullable<typeof ctx>, row: EntryRow, recovered: boolean): Promise<void> {
    // claim: only the row still in the state and attempts we read moves to posting (a repeat or a second connector gets an empty answer)
    const attempt = (Number.isFinite(row.attempts) ? row.attempts : 0) + 1;
    const guard = `&status=eq.${row.status}&attempts=eq.${row.attempts}`;
    const claimed = await c.client.rest(c.session, 'PATCH', `entry_queue?id=eq.${encodeURIComponent(row.id)}${guard}`, { status: 'posting', attempts: attempt, updated_at: stamp() }, { prefer: 'return=representation' });
    if (!Array.isArray(claimed) || claimed.filter(isRow).length === 0) return;
    const t0 = now();
    logger.info('postbox', 'entry claimed', { id: row.id, kind: row.kind, attempt, recovered });
    const mine: EntryRow = { ...row, status: 'posting', attempts: attempt };

    let outcome: EntryOutcome;
    const checked = check(mine);
    if (d.entriesEnabled && !d.entriesEnabled()) {
      outcome = { ok: false, detail: 'FLAG_DISABLED', message: TEXT.disabled };
    } else if ('detail' in checked) {
      outcome = { ok: false, detail: checked.detail, message: checked.message };
    } else if (recovered && attempt > maxAttempts) {
      outcome = { ok: false, detail: 'AMBIGUOUS_RESULT', message: TEXT.ambiguous };
    } else {
      const h = d.handlers?.[checked.env.kind];
      if (!h) {
        outcome = { ok: false, detail: 'UNKNOWN', message: TEXT.noHandler };
      } else {
        try {
          outcome = await h({ row: mine, envelope: checked.env, attempt, recovered });
        } catch (e) {
          if (e instanceof LbError && e.code === 'LB_TALLY_UNREACHABLE') {
            outcome = { ok: false, detail: 'TALLY_UNREACHABLE', message: TEXT.tallyDown };
          } else {
            logger.warn('postbox', 'entry handler threw', { id: row.id, kind: row.kind, code: e instanceof LbError ? e.code : 'ERROR', err: e instanceof LbError ? undefined : e });
            outcome = { ok: false, detail: 'AMBIGUOUS_RESULT', message: TEXT.unexpected };
          }
        }
      }
    }
    const { w, kind } = toWrite(outcome, attempt);
    await finish(c, mine, w, kind, t0);
  }

  async function poll(): Promise<void> {
    const block = d.blocked();
    if (block) {
      if (!wasBlocked) logger.info('postbox', 'entry listener paused', { why: block });
      wasBlocked = true;
      return;
    }
    wasBlocked = false;
    const c = context();
    if (!c) return;
    c.session.accessToken = await d.activation.getAccessToken();

    // 1. results that could not be written earlier
    await outbox.flush();

    // 2. open entries of this license, oldest first
    const lic = encodeURIComponent(c.lic);
    const found = await c.client.rest(c.session, 'GET', `entry_queue?select=*&license_key=eq.${lic}&status=in.(queued,posting)&order=created_at.asc&limit=50`);
    const rows = (Array.isArray(found) ? found : []).filter(isRow);
    st.lastPollAt = stamp();
    st.pollFailures = 0;
    st.message = null;
    st.waiting = rows.filter((r) => r.status === 'queued').length;

    // 3. one at a time, in order. A posting row whose result is still in the outbox is not an orphan.
    for (const r of rows) {
      if (stopped || d.blocked()) break;
      if (outbox.has(r.id)) continue;
      if (r.status === 'queued' && (notBefore.get(r.id) ?? 0) > now()) continue;
      await runOne(c, r, r.status === 'posting');
    }
  }

  async function tick(): Promise<void> {
    st.busy = true;
    emit();
    try {
      await poll();
    } catch (e) {
      st.pollFailures += 1;
      st.message = e instanceof LbError && e.code === 'NETWORK' ? 'The connector is offline. It will retry.' : 'The entry check failed. It will retry.';
      if (e instanceof LbError && e.code === 'NETWORK') logger.warn('postbox', 'entry poll offline, will retry', { failures: st.pollFailures });
      else logger.warn('postbox', 'entry poll failed', { failures: st.pollFailures, err: e });
    } finally {
      st.busy = false;
      emit();
    }
  }

  function schedule(ms: number): void {
    if (!started) return;
    if (timer !== null) clearT(timer);
    timer = setT(() => {
      timer = null;
      void run();
    }, ms);
    if (typeof timer === 'object' && timer !== null && 'unref' in timer) (timer as NodeJS.Timeout).unref();
  }

  function nextDelay(): number {
    if (st.pollFailures === 0) return pollMs;
    return Math.min(MAX_BACKOFF_MS, pollMs * 2 ** Math.min(st.pollFailures, 6));
  }

  function run(): Promise<void> {
    if (inflight) return inflight;
    lastTickAt = now();
    inflight = tick().finally(() => {
      inflight = null;
      if (again && started) {
        again = false;
        schedule(Math.max(0, MIN_POLL_MS - (now() - lastTickAt)));
      } else {
        schedule(nextDelay());
      }
    });
    return inflight;
  }

  return {
    start(): void {
      if (started) return;
      started = true;
      stopped = false;
      void run();
    },
    stop(): void {
      started = false;
      stopped = true;
      if (timer !== null) clearT(timer);
      timer = null;
    },
    nudge(): void {
      if (!started) return;
      if (inflight) {
        again = true;
        return;
      }
      schedule(Math.max(0, MIN_POLL_MS - (now() - lastTickAt)));
    },
    pollNow: run,
    state: (): EntryListenerState => ({ ...st }),
    pendingResults: (): number => outbox.size(),
  };
}

export type EntryListener = ReturnType<typeof createEntryListener>;
