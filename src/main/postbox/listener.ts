/*
LazyBooks | src/main/postbox/listener.ts
Responsibility: Request listener
Introduced by: Phase 19 (request-listener) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 19)
*/

/**
 * Hears what devices ask: polls the license project's `sync_requests` (SHARED_CONTRACTS 4.1, SYNC_SPEC 2) and walks each
 * request through pending -> processing -> done | failed (with a plain-language error text), one request at a time.
 * The unique in-flight index (one pending/processing row per device and kind) lives in the database; this module
 * respects it by never creating requests, only moving existing ones forward, and by closing stale ones so a device can ask again.
 *
 * What a request MEANS is not decided here. `initial`, `delta` and `snapshot_refresh` are handed to injected handlers
 * (Phases 20 to 22 and 31 plug in there); `ping` is answered here (liveness: status done, no chunks). A kind without a handler
 * is failed at once with a clear text, so a device is told immediately instead of waiting out its pickup timeout.
 *
 * Polling: every `desktop.request_listener_poll_s` (5 s), never faster than `polling.min_poll_interval_ms` (2 s);
 * errors back off (x2 up to 60 s). Realtime is an optional nudge in the contract; it is not implemented (no supabase-js
 * installed, polling already sits inside the budget). `nudge()` is the seam a Realtime subscription would call.
 * No Electron import: every collaborator is injected. Never logs company names or guids.
 */
import { DESKTOP_DEFAULTS } from '../../shared/constants';
import { LbError } from '../errors';
import { logger } from '../logger';
import type { TargetClient } from '../supabase';

export type RequestKind = 'initial' | 'delta' | 'snapshot_refresh' | 'ping';
export type RequestStatus = 'pending' | 'processing' | 'done' | 'failed';

/** A `sync_requests` row (sql/02_license_project_schema.sql). */
export interface SyncRequest {
  id: string;
  license_key: string;
  device_id: string;
  kind: RequestKind;
  company_guid: string | null;
  from_date: string | null;
  to_date: string | null;
  last_sync_at: string | null;
  lookback_days: number | null;
  status: RequestStatus;
  error: string | null;
  created_at: string;
  updated_at: string;
}

/** Resolve to finish the request as done; throw (an `LbError` carries a plain-language message) to fail it. */
export type RequestHandler = (req: SyncRequest) => Promise<void>;

export interface ListenerState {
  /** a poll or a request is being worked on right now */
  busy: boolean;
  lastPollAt: string | null;
  /** requests finished as done since start */
  done: number;
  /** requests finished as failed since start */
  failed: number;
  /** consecutive failed polls (network or server) */
  pollFailures: number;
  /** plain-language reason the last poll failed, null after a good poll */
  message: string | null;
}

export interface ListenerDeps {
  activation: {
    state(): { stage: string };
    getAccessToken(): Promise<string>;
    targetClient(): TargetClient | null;
  };
  licenseKey(): string | null;
  /** Non-null while nothing may run (device revoked, license blocked, not activated). The text is logged. */
  blocked(): string | null;
  /** `initial`, `delta` and `snapshot_refresh` handlers; absent ones fail the request at once. `ping` needs none. */
  handlers?: Partial<Record<Exclude<RequestKind, 'ping'>, RequestHandler>>;
  /** Poll interval in ms (default constants `desktop.request_listener_poll_s`; never below 2000). */
  pollMs?: number;
  /** A pending request older than this was given up on by its device (constants `polling.request_stale_after_min`, 30). */
  stalePendingMs?: number;
  /** A processing request not touched for this long is closed as failed (assumed 10 min; Phase 22 handlers may take long). */
  staleProcessingMs?: number;
  onChange?: (s: ListenerState) => void;
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (t: unknown) => void;
}

const MIN_POLL_MS = 2000; // constants polling.min_poll_interval_ms
const MAX_BACKOFF_MS = 60_000;
const ERROR_MAX = 300;
const KINDS: readonly string[] = ['initial', 'delta', 'snapshot_refresh', 'ping'];

const GENERIC_FAILURE = 'The connector could not complete this request. Try again in a moment.';
const NO_HANDLER = 'This connector cannot send data for this request yet. Update LazyBooks on this PC and try again.';
const STALE_PENDING = 'The connector did not pick this request up in time. Ask again.';
const STALE_PROCESSING = 'The connector stopped while working on this request. Ask again.';

function errorText(e: unknown): string {
  const raw = e instanceof LbError ? e.message : GENERIC_FAILURE;
  return raw.length > ERROR_MAX ? raw.slice(0, ERROR_MAX - 1) + '.' : raw;
}

function isRequest(v: unknown): v is SyncRequest {
  if (v === null || typeof v !== 'object') return false;
  const r = v as Record<string, unknown>;
  return typeof r['id'] === 'string' && typeof r['device_id'] === 'string' && typeof r['kind'] === 'string' && typeof r['status'] === 'string';
}

interface Outbox {
  status: 'done' | 'failed';
  error: string | null;
}

export function createRequestListener(d: ListenerDeps) {
  const now = d.now ?? Date.now;
  const setT = d.setTimer ?? ((fn: () => void, ms: number) => setTimeout(fn, ms));
  const clearT = d.clearTimer ?? ((t: unknown) => clearTimeout(t as NodeJS.Timeout));
  const pollMs = Math.max(MIN_POLL_MS, d.pollMs ?? DESKTOP_DEFAULTS.requestListenerPollS * 1000);
  const stalePendingMs = d.stalePendingMs ?? 30 * 60 * 1000;
  const staleProcessingMs = d.staleProcessingMs ?? 10 * 60 * 1000;

  let timer: unknown = null;
  let started = false;
  let stopped = false;
  let inflight: Promise<void> | null = null;
  let again = false;
  let lastTickAt = 0;
  let wasBlocked = false;
  /** final statuses that could not be written (offline): flushed first on the next poll, so nothing is left in processing */
  const outbox = new Map<string, Outbox>();
  const st: ListenerState = { busy: false, lastPollAt: null, done: 0, failed: 0, pollFailures: 0, message: null };

  const emit = (): void => d.onChange?.({ ...st });
  const stamp = (): string => new Date(now()).toISOString();

  function context(): { client: TargetClient; session: { accessToken: string; refreshToken: string; expiresAt: number }; lic: string } | null {
    const lic = d.licenseKey();
    const client = d.activation.targetClient();
    if (d.activation.state().stage !== 'active' || !lic || !client) return null;
    return { client, session: { accessToken: '', refreshToken: '', expiresAt: 0 }, lic };
  }

  async function patch(
    c: NonNullable<ReturnType<typeof context>>,
    id: string,
    guard: string,
    body: Record<string, unknown>,
  ): Promise<SyncRequest[]> {
    const rows = await c.client.rest(c.session, 'PATCH', `sync_requests?id=eq.${encodeURIComponent(id)}${guard}`, { ...body, updated_at: stamp() }, { prefer: 'return=representation' });
    return Array.isArray(rows) ? rows.filter(isRequest) : [];
  }

  async function writeFinal(c: NonNullable<ReturnType<typeof context>>, id: string, o: Outbox): Promise<void> {
    try {
      await patch(c, id, '', { status: o.status, error: o.error });
      outbox.delete(id);
    } catch (e) {
      outbox.set(id, o); // offline or a server hiccup: keep it and retry on the next poll
      throw e;
    }
  }

  async function runOne(c: NonNullable<ReturnType<typeof context>>, r: SyncRequest): Promise<void> {
    // claim: only the row that is still pending moves to processing (a second connector or a repeat is a no-op)
    const claimed = await patch(c, r.id, '&status=eq.pending', { status: 'processing', error: null });
    if (claimed.length === 0) return;
    const t0 = now();
    logger.info('postbox', 'request picked up', { id: r.id, kind: r.kind });
    let final: Outbox;
    try {
      if (!KINDS.includes(r.kind)) throw new LbError('BAD_RESPONSE', 'The connector does not know this kind of request.');
      if (r.kind !== 'ping') {
        const h = d.handlers?.[r.kind];
        if (!h) throw new LbError('BAD_RESPONSE', NO_HANDLER);
        await h(r);
      }
      final = { status: 'done', error: null };
    } catch (e) {
      final = { status: 'failed', error: errorText(e) };
      logger.warn('postbox', 'request failed', { id: r.id, kind: r.kind, code: e instanceof LbError ? e.code : 'ERROR', err: e instanceof LbError ? undefined : e });
    }
    await writeFinal(c, r.id, final);
    if (final.status === 'done') st.done += 1;
    else st.failed += 1;
    logger.info('postbox', final.status === 'done' ? 'request done' : 'request closed as failed', { id: r.id, kind: r.kind, ms: now() - t0 });
    emit();
  }

  async function poll(): Promise<void> {
    const block = d.blocked();
    if (block) {
      if (!wasBlocked) logger.info('postbox', 'request listener paused', { why: block });
      wasBlocked = true;
      return;
    }
    wasBlocked = false;
    const c = context();
    if (!c) return;
    c.session.accessToken = await d.activation.getAccessToken();

    // 1. results that could not be written earlier
    for (const [id, o] of [...outbox]) await writeFinal(c, id, o);

    // 2. the open requests of this license, oldest first
    const lic = encodeURIComponent(c.lic);
    const found = await c.client.rest(c.session, 'GET', `sync_requests?select=*&license_key=eq.${lic}&status=in.(pending,processing)&order=created_at.asc&limit=50`);
    const rows = (Array.isArray(found) ? found : []).filter(isRequest);
    st.lastPollAt = stamp();
    st.pollFailures = 0;
    st.message = null;

    // 3. close stale ones so the device can ask again (the unique in-flight index would otherwise block it)
    const live: SyncRequest[] = [];
    for (const r of rows) {
      const age = now() - Date.parse(r.status === 'pending' ? r.created_at : r.updated_at);
      if (r.status === 'pending' && age > stalePendingMs) {
        logger.warn('postbox', 'stale request closed', { id: r.id, kind: r.kind, status: r.status });
        await writeFinal(c, r.id, { status: 'failed', error: STALE_PENDING });
      } else if (r.status === 'processing' && age > staleProcessingMs) {
        logger.warn('postbox', 'stale request closed', { id: r.id, kind: r.kind, status: r.status });
        await writeFinal(c, r.id, { status: 'failed', error: STALE_PROCESSING });
      } else if (r.status === 'pending') live.push(r);
    }

    // 4. one at a time, in order
    for (const r of live) {
      if (stopped || d.blocked()) break;
      await runOne(c, r);
    }
  }

  async function tick(): Promise<void> {
    st.busy = true;
    emit();
    try {
      await poll();
    } catch (e) {
      st.pollFailures += 1;
      st.message = e instanceof LbError && e.code === 'NETWORK' ? 'The connector is offline. It will retry.' : 'The request check failed. It will retry.';
      if (e instanceof LbError && e.code === 'NETWORK') logger.warn('postbox', 'request poll offline, will retry', { failures: st.pollFailures });
      else logger.warn('postbox', 'request poll failed', { failures: st.pollFailures, err: e });
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

  /** Single-flight: a call while a poll runs joins it (a `nudge()` during a poll queues exactly one more). */
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
    /** First poll right away, then every poll interval. Safe before activation: polls are no-ops until active. */
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
    /** Poll as soon as the minimum interval allows (a Realtime event, a manual refresh, activation finishing). */
    nudge(): void {
      if (!started) return;
      if (inflight) {
        again = true;
        return;
      }
      schedule(Math.max(0, MIN_POLL_MS - (now() - lastTickAt)));
    },
    /** One poll now and wait for it (tests, diagnostics). */
    pollNow: run,
    state: (): ListenerState => ({ ...st }),
  };
}

export type RequestListener = ReturnType<typeof createRequestListener>;
