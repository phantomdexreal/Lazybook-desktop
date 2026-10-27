/*
LazyBooks | src/main/sync/progress.ts
Responsibility: Sync progress tracker - throttle (one event per second plus every stage change), rate over the last 5 batches, ETA rules
Introduced by: Phase 46 (sync-progress) - docs/specs/sync-progress.md
STATUS: IMPLEMENTED (Phase 46)
Pure: the clock and the emitter are injected. The scheduler hands every raw event to `push`; only throttled, decorated events reach `emit`.
Counts and ISO dates only; nothing here sees a company, ledger or party name.
*/

import { PROGRESS_DEFAULTS } from '../../shared/constants';
import type { SyncProgress } from '../../shared/ipc';

export const RATE_BATCHES = 5;
export const ETA_MIN_BATCHES = 2;

/** Seconds, rounded for display: to the minute above 2 minutes, to 10 s below; never negative. */
export function roundEta(seconds: number): number {
  const s = Math.max(0, seconds);
  return s > 120 ? Math.ceil(s / 60) * 60 : Math.ceil(s / 10) * 10;
}

export interface ProgressTracker {
  /** Offer a raw event. It is emitted at once on a stage change, on done and on failed; otherwise at most once per throttle interval. */
  push(p: SyncProgress): void;
  /** Emit the newest held event now (used before the process pauses or the window opens). */
  flush(): void;
  /** The last event that was emitted, or null. */
  last(): SyncProgress | null;
}

export function createProgressTracker(opts: { emit: (p: SyncProgress) => void; now?: () => number; throttleMs?: number }): ProgressTracker {
  const now = opts.now ?? (() => Date.now());
  const throttleMs = opts.throttleMs ?? PROGRESS_DEFAULTS.progressThrottleMs;
  let run: string | null = null;
  let stage: SyncProgress['stage'] | null = null;
  let lastEmitAt = -Infinity;
  let held: SyncProgress | null = null;
  let last: SyncProgress | null = null;
  /** Points (time, done) taken when the batch index changes; the rate spans the last RATE_BATCHES batches. */
  let samples: Array<{ t: number; done: number; batch: number }> = [];

  function decorate(p: SyncProgress): SyncProgress {
    const v = p.vouchers;
    if (p.stage !== 'vouchers' || !v) return { ...p, ratePerMin: null, etaSeconds: null };
    const t = now();
    const prev = samples[samples.length - 1];
    if (!prev || prev.batch !== v.batchIndex) samples.push({ t, done: v.done, batch: v.batchIndex });
    if (samples.length > RATE_BATCHES + 1) samples = samples.slice(-(RATE_BATCHES + 1));
    const first = samples[0];
    const end = samples[samples.length - 1];
    let rate: number | null = null;
    // batch 0 is the starting point, so two finished batches means three samples
    if (first && end && samples.length >= ETA_MIN_BATCHES + 1 && end.t > first.t && end.done > first.done) rate = Math.round(((end.done - first.done) / (end.t - first.t)) * 60000);
    let eta: number | null = null;
    if (rate !== null && rate > 0 && v.total !== null && v.done < v.total) eta = roundEta(((v.total - v.done) / rate) * 60);
    return { ...p, ratePerMin: rate, etaSeconds: eta };
  }

  function out(p: SyncProgress): void {
    held = null;
    lastEmitAt = now();
    last = p;
    opts.emit(p);
  }

  return {
    push(raw) {
      if (raw.runId !== run) {
        run = raw.runId;
        stage = null;
        samples = [];
      }
      const p = decorate(raw);
      const changed = raw.stage !== stage;
      stage = raw.stage;
      if (changed || raw.stage === 'done' || raw.stage === 'failed' || now() - lastEmitAt >= throttleMs) out(p);
      else held = p;
    },
    flush() {
      if (held) out(held);
    },
    last: () => last,
  };
}
