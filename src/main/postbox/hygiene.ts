/*
LazyBooks | src/main/postbox/hygiene.ts
Responsibility: Backpressure + cleanup
Introduced by: Phase 23 (postbox-hygiene) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 23)
*/

/**
 * Keeps the connector inside the free-tier limits of the license project (SHARED_CONTRACTS 4.1, SYNC_SPEC 6, constants `desktop`, `sync`, `polling`).
 *
 * - Backpressure: at most `desktop.max_inflight_chunks_per_device` (40) unacknowledged chunks exist for one device at a time. A longer
 *   sequence is sent in windows: the next window goes in only when the device has deleted (acknowledged) enough chunks. The wait polls
 *   2 s -> 10 s (x1.5, `polling.chunk_poll_*`), resets whenever the device made progress, and gives up after a stall (no progress), removing what it sent.
 * - Retry with backoff: `withRetry` retries network failures and 408/429/5xx answers (1 s doubling to 30 s, with jitter); everything else is final.
 * - Request-rate budget: `createRateBudget` is a sliding-window limiter every call of this module goes through (never faster than `polling.min_poll_interval_ms` apart on average).
 * - Cleanup: chunks past `expires_at` (24 h) and the leftovers of abandoned sequences are deleted by `sweep` (hourly, and after a failed send).
 *   A device acks by deleting, so a chunk that outlives its expiry was never applied; the vault cursor is NOT moved by cleanup (serve.ts only moves it on a real ack).
 * - Offline queueing: `createOutbox` keeps small outbound results (a request's final status, later an entry's result) in order, on disk, and replays them
 *   when the network is back; the same key replaces the older value so a replay never double-writes.
 * No Electron import; every collaborator is injected. Never logs names, guids or row data.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DESKTOP_DEFAULTS } from '../../shared/constants';
import { LbError } from '../errors';
import { logger } from '../logger';
import type { TargetClient } from '../supabase';

const POLL_INITIAL_MS = 2000; // constants polling.chunk_poll_initial_ms
const POLL_MAX_MS = 10_000; // polling.chunk_poll_max_ms
const POLL_FACTOR = 1.5; // polling.chunk_poll_backoff_factor
const MIN_INTERVAL_MS = 2000; // polling.min_poll_interval_ms
const STALL_MS = 5 * 60 * 1000; // assumed: a device that deleted nothing for 5 min is gone (it re-asks)
const SWEEP_MS = 60 * 60 * 1000;
const STALL_TEXT = 'The device did not receive the data in time. Ask again.';

export function sleepReal(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Delay before retry number `attempt` (1-based): base * 2^(attempt-1), capped, +-20 % jitter (`rnd` in [0,1)). */
export function backoffDelay(attempt: number, baseMs = 1000, maxMs = 30_000, rnd: () => number = Math.random): number {
  const raw = Math.min(maxMs, baseMs * 2 ** Math.max(0, attempt - 1));
  return Math.round(raw * (0.8 + 0.4 * rnd()));
}

/** Network failures and 408/429/5xx answers are worth another try; auth, contract and local errors are not. */
export function isRetryable(e: unknown): boolean {
  if (!(e instanceof LbError)) return false;
  if (e.code === 'NETWORK') return true;
  if (e.code !== 'BAD_RESPONSE') return false;
  const m = /status (\d{3})/.exec(e.message);
  if (!m) return false;
  const s = Number(m[1]);
  return s === 408 || s === 429 || s >= 500;
}

export interface RetryOptions {
  attempts?: number; // total tries, default 4
  baseMs?: number;
  maxMs?: number;
  sleep?: (ms: number) => Promise<void>;
  rnd?: () => number;
  onRetry?: (attempt: number, delayMs: number, e: unknown) => void;
}

export async function withRetry<T>(fn: () => Promise<T>, o: RetryOptions = {}): Promise<T> {
  const attempts = Math.max(1, o.attempts ?? 4);
  const sleep = o.sleep ?? sleepReal;
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i >= attempts || !isRetryable(e)) throw e;
      const ms = backoffDelay(i, o.baseMs, o.maxMs, o.rnd);
      o.onRetry?.(i, ms, e);
      await sleep(ms);
    }
  }
}

export interface RateBudget {
  /** Resolves when one more call fits in the window (waits otherwise). */
  take(): Promise<void>;
  /** calls counted in the current window */
  used(): number;
}

/** Sliding window: at most `max` calls per `windowMs`. Default 30 per 60 s = one call per `polling.min_poll_interval_ms` on average. */
export function createRateBudget(o: { max?: number; windowMs?: number; now?: () => number; sleep?: (ms: number) => Promise<void> } = {}): RateBudget {
  const max = Math.max(1, o.max ?? Math.floor(60_000 / MIN_INTERVAL_MS));
  const windowMs = o.windowMs ?? 60_000;
  const now = o.now ?? Date.now;
  const sleep = o.sleep ?? sleepReal;
  const stamps: number[] = [];
  const trim = (): void => {
    const cut = now() - windowMs;
    while (stamps.length > 0 && (stamps[0] as number) <= cut) stamps.shift();
  };
  return {
    async take(): Promise<void> {
      for (;;) {
        trim();
        if (stamps.length < max) {
          stamps.push(now());
          return;
        }
        await sleep(Math.max(50, (stamps[0] as number) + windowMs - now()));
      }
    },
    used(): number {
      trim();
      return stamps.length;
    },
  };
}

export interface OutboxOptions<T> {
  /** Writes one queued value; throw to keep it (a NETWORK error also stops the replay, any other error drops nothing either, see `flush`). */
  deliver(key: string, value: T): Promise<void>;
  /** JSON file for the queue so it survives a restart (omit for memory only). */
  file?: string;
  max?: number; // default 500 entries; the oldest is dropped beyond it
  maxAgeMs?: number; // default 24 h; older entries are dropped (their request/entry was closed by the server or the device long ago)
  now?: () => number;
}

interface OutboxEntry<T> {
  key: string;
  value: T;
  at: number;
}

export function createOutbox<T>(o: OutboxOptions<T>) {
  const now = o.now ?? Date.now;
  const max = o.max ?? 500;
  const maxAge = o.maxAgeMs ?? 24 * 3600_000;
  let q: OutboxEntry<T>[] = [];
  let flushing: Promise<{ sent: number; left: number }> | null = null;

  function save(): void {
    if (!o.file) return;
    try {
      fs.mkdirSync(path.dirname(o.file), { recursive: true });
      const tmp = o.file + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(q), 'utf8');
      fs.renameSync(tmp, o.file);
    } catch (e) {
      logger.warn('postbox', 'outbox could not be saved', { err: e });
    }
  }
  if (o.file && fs.existsSync(o.file)) {
    try {
      const raw = JSON.parse(fs.readFileSync(o.file, 'utf8')) as unknown;
      if (Array.isArray(raw)) q = raw.filter((x): x is OutboxEntry<T> => x !== null && typeof x === 'object' && typeof (x as OutboxEntry<T>).key === 'string' && typeof (x as OutboxEntry<T>).at === 'number');
    } catch {
      q = []; // a damaged queue file is not worth blocking on; the server closes stale rows itself
    }
  }

  return {
    /** Queue a value; the same key replaces the earlier one in place (keeps its position). */
    enqueue(key: string, value: T): void {
      const i = q.findIndex((e) => e.key === key);
      if (i >= 0) q[i] = { key, value, at: now() };
      else q.push({ key, value, at: now() });
      while (q.length > max) q.shift();
      save();
    },
    /** Replay in order. Stops at the first NETWORK failure (still offline). Other failures drop only that entry after logging, so one bad row never blocks the rest. Single-flight. */
    flush(): Promise<{ sent: number; left: number }> {
      if (flushing) return flushing;
      flushing = (async () => {
        let sent = 0;
        q = q.filter((e) => now() - e.at <= maxAge);
        while (q.length > 0) {
          const head = q[0] as OutboxEntry<T>;
          try {
            await o.deliver(head.key, head.value);
            sent += 1;
          } catch (e) {
            if (e instanceof LbError && e.code === 'NETWORK') break;
            if (isRetryable(e)) break;
            logger.warn('postbox', 'queued result dropped after a final error', { code: e instanceof LbError ? e.code : 'ERROR' });
          }
          if (q[0] === head) q.shift();
        }
        save();
        return { sent, left: q.length };
      })().finally(() => {
        flushing = null;
      });
      return flushing;
    },
    size: (): number => q.length,
    has: (key: string): boolean => q.some((e) => e.key === key),
  };
}

export interface HygieneDeps {
  activation: { getAccessToken(): Promise<string>; targetClient(): TargetClient | null };
  licenseKey(): string | null;
  /** default constants `desktop.max_inflight_chunks_per_device` (40) */
  maxInflight?: number;
  stallMs?: number;
  sweepMs?: number;
  retry?: RetryOptions;
  budget?: RateBudget;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (t: unknown) => void;
}

export interface SweepResult {
  expired: boolean;
  abandoned: number;
}

export function createHygiene(d: HygieneDeps) {
  const now = d.now ?? Date.now;
  const sleep = d.sleep ?? sleepReal;
  const max = Math.max(1, d.maxInflight ?? DESKTOP_DEFAULTS.maxInflightChunksPerDevice);
  const stallMs = d.stallMs ?? STALL_MS;
  const sweepMs = d.sweepMs ?? SWEEP_MS;
  const setT = d.setTimer ?? ((fn: () => void, ms: number) => setTimeout(fn, ms));
  const clearT = d.clearTimer ?? ((t: unknown) => clearTimeout(t as NodeJS.Timeout));
  const budget = d.budget ?? createRateBudget({ now, sleep });
  /** request ids whose chunks must go but could not be deleted yet (offline) */
  const toAbandon = new Set<string>();
  let timer: unknown = null;
  let stopped = true;
  let sweeping: Promise<SweepResult> | null = null;

  async function rest(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', p: string, body?: unknown, headers?: Record<string, string>): Promise<unknown> {
    const client = d.activation.targetClient();
    if (!client) throw new LbError('NOT_CONFIGURED', 'This PC is not signed in to the data project.');
    return withRetry(
      async () => {
        await budget.take();
        const session = { accessToken: await d.activation.getAccessToken(), refreshToken: '', expiresAt: now() + 3600_000 };
        return client.rest(session, method, p, body, headers);
      },
      { sleep, ...d.retry, onRetry: (n, ms) => logger.warn('postbox', 'data project call failed, retrying', { attempt: n, delayMs: ms }) },
    );
  }

  async function inflight(deviceId: string): Promise<number> {
    const rows = (await rest('GET', `sync_chunks?select=id&device_id=eq.${encodeURIComponent(deviceId)}&limit=${max + 1}`)) as unknown[];
    return Array.isArray(rows) ? rows.length : 0;
  }

  async function abandon(requestId: string): Promise<void> {
    try {
      await rest('DELETE', `sync_chunks?request_id=eq.${encodeURIComponent(requestId)}`);
      toAbandon.delete(requestId);
    } catch (e) {
      toAbandon.add(requestId); // offline: the next sweep tries again
      logger.warn('postbox', 'unfinished chunks could not be removed yet', { err: e });
    }
  }

  /**
   * Sends `rows` for one device in windows. `post` inserts one slice (the caller groups it by bytes). Resolves when everything is in;
   * on a stall or a final error the request's chunks are removed and the error is thrown (the listener tells the device).
   */
  async function sendWindowed<R>(deviceId: string, requestId: string, rows: R[], post: (slice: R[]) => Promise<void>): Promise<{ windows: number; waits: number }> {
    let i = 0;
    let windows = 0;
    let waits = 0;
    let last = -1;
    let lastProgressAt = now();
    let delay = POLL_INITIAL_MS;
    try {
      while (i < rows.length) {
        const used = await inflight(deviceId);
        const room = max - used;
        if (room > 0) {
          const slice = rows.slice(i, i + room);
          await post(slice);
          i += slice.length;
          windows += 1;
          delay = POLL_INITIAL_MS;
          lastProgressAt = now();
          last = -1;
          continue;
        }
        if (last < 0 || used < last) {
          lastProgressAt = now(); // the device acked something since the last look
          delay = POLL_INITIAL_MS;
        }
        last = used;
        if (now() - lastProgressAt >= stallMs) throw new LbError('NETWORK', STALL_TEXT);
        waits += 1;
        await sleep(delay);
        delay = Math.min(POLL_MAX_MS, Math.round(delay * POLL_FACTOR));
      }
    } catch (e) {
      logger.warn('postbox', 'sending was interrupted, removing what was sent', { sent: i, of: rows.length, code: e instanceof LbError ? e.code : 'ERROR' });
      await abandon(requestId);
      throw e;
    }
    return { windows, waits };
  }

  /** Expired chunks (24 h) and abandoned leftovers. Safe to call any time; single-flight; never throws. */
  function sweep(): Promise<SweepResult> {
    if (sweeping) return sweeping;
    sweeping = (async (): Promise<SweepResult> => {
      const out: SweepResult = { expired: false, abandoned: 0 };
      try {
        for (const id of [...toAbandon]) {
          await abandon(id);
          if (!toAbandon.has(id)) out.abandoned += 1;
        }
        const lic = d.licenseKey();
        if (lic) {
          await rest('DELETE', `sync_chunks?license_key=eq.${encodeURIComponent(lic)}&expires_at=lt.${encodeURIComponent(new Date(now()).toISOString())}`);
          out.expired = true;
        }
      } catch (e) {
        logger.warn('postbox', 'chunk cleanup failed, will retry', { err: e });
      }
      return out;
    })().finally(() => {
      sweeping = null;
    });
    return sweeping;
  }

  function arm(): void {
    if (stopped || timer !== null) return;
    timer = setT(() => {
      timer = null;
      void sweep().finally(arm);
    }, sweepMs);
    if (typeof timer === 'object' && timer !== null && 'unref' in timer) (timer as NodeJS.Timeout).unref();
  }

  return {
    rest,
    inflight,
    sendWindowed,
    abandon,
    sweep,
    pendingAbandon: (): number => toAbandon.size,
    maxInflight: max,
    start(): void {
      stopped = false;
      arm();
    },
    stop(): void {
      stopped = true;
      if (timer !== null) clearT(timer);
      timer = null;
    },
  };
}

export type Hygiene = ReturnType<typeof createHygiene>;
