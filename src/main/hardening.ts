/*
LazyBooks | src/main/hardening.ts
Responsibility: Production hardening rules (pure, no Electron): crash-loop guard, low-disk and memory assessment, wall-clock jump watch, hourly health check, load estimate
Introduced by: Phase 41 (hardening)
STATUS: IMPLEMENTED (Phase 41)
*/

import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const MB = 1024 * 1024;

// ------------------------------------------------------------------------------------------ crash-loop guard

export interface StartRecord {
  /** epoch ms of the start */
  at: number;
  /** false until a clean shutdown marks it */
  clean: boolean;
}

export interface CrashGuardState {
  starts: StartRecord[];
}

export interface CrashGuardOptions {
  /** JSON file (in the app data folder) that remembers the last starts */
  file: string;
  now?: () => number;
  /** this many unclean starts inside the window count as a loop (default 3 in 10 minutes) */
  limit?: number;
  windowMs?: number;
}

export interface CrashVerdict {
  /** true when the app keeps dying at start: run in safe mode (no sync, no entries, no update, no embedded PWA) and tell the person */
  loop: boolean;
  /** unclean starts inside the window, this one excluded */
  recentCrashes: number;
  /** how long to wait before starting the background work (grows with each crash, capped at 5 minutes) */
  delayMs: number;
}

export function createCrashGuard(o: CrashGuardOptions) {
  const now = o.now ?? Date.now;
  const limit = o.limit ?? 3;
  const windowMs = o.windowMs ?? 10 * 60_000;
  const keep = 20;

  function load(): CrashGuardState {
    try {
      const j = JSON.parse(readFileSync(o.file, 'utf8')) as CrashGuardState;
      if (j && Array.isArray(j.starts)) {
        return { starts: j.starts.filter((s) => s && Number.isFinite(s.at) && typeof s.clean === 'boolean').slice(-keep) };
      }
    } catch {
      // missing or damaged file: treat as a first run, never block the app because of it
    }
    return { starts: [] };
  }

  function save(s: CrashGuardState): void {
    try {
      mkdirSync(dirname(o.file), { recursive: true });
      const tmp = `${o.file}.tmp`;
      writeFileSync(tmp, JSON.stringify(s));
      renameSync(tmp, o.file);
    } catch {
      // a full disk must not stop the app from starting
    }
  }

  return {
    /** Call once at start. Records this start as unclean until `markClean()`. */
    begin(): CrashVerdict {
      const s = load();
      const t = now();
      const recent = s.starts.filter((r) => !r.clean && t - r.at >= 0 && t - r.at <= windowMs).length;
      s.starts.push({ at: t, clean: false });
      save({ starts: s.starts.slice(-keep) });
      return { loop: recent >= limit, recentCrashes: recent, delayMs: recent === 0 ? 0 : Math.min(5 * 60_000, 5_000 * 2 ** Math.min(recent, 6)) };
    },
    /** Call from the last shutdown hook (and after a long healthy run, see `markHealthy`). */
    markClean(): void {
      const s = load();
      const last = s.starts[s.starts.length - 1];
      if (last) last.clean = true;
      save(s);
    },
    /** After the app has run well for a while, forgive older crashes so one bad day does not count forever. */
    markHealthy(): void {
      const s = load();
      for (const r of s.starts) r.clean = true;
      save(s);
    },
    read: load,
  };
}

// ------------------------------------------------------------------------------------------ low disk

export type DiskLevel = 'ok' | 'low' | 'critical';

export interface DiskAssessment {
  level: DiskLevel;
  freeBytes: number;
  /** bytes the vault, its backups and a snapshot may still need */
  neededBytes: number;
  message: string | null;
}

/** Floors: critical below 100 MB, low below the larger of 500 MB and 1.5 times the vault (backup copy + WAL + a temp file). */
export function assessDisk(freeBytes: number, vaultBytes: number): DiskAssessment {
  const critical = 100 * MB;
  const needed = Math.max(500 * MB, Math.round(vaultBytes * 1.5));
  if (!Number.isFinite(freeBytes) || freeBytes < 0) return { level: 'ok', freeBytes: 0, neededBytes: needed, message: null }; // unknown: never block on a guess
  if (freeBytes < critical) {
    return { level: 'critical', freeBytes, neededBytes: needed, message: `Only ${Math.floor(freeBytes / MB)} MB of disk space is left. Syncing is paused until space is freed.` };
  }
  if (freeBytes < needed) {
    return { level: 'low', freeBytes, neededBytes: needed, message: `Disk space is low (${Math.floor(freeBytes / MB)} MB free). Backups and snapshots are skipped until more space is free.` };
  }
  return { level: 'ok', freeBytes, neededBytes: needed, message: null };
}

/** Reads free bytes of the drive that holds `dir` through an injected statfs (production: `fs.statfsSync`). null when it cannot be read. */
export function freeBytesOf(dir: string, statfs: (p: string) => { bavail: number | bigint; bsize: number | bigint }): number | null {
  try {
    const s = statfs(dir);
    return Number(s.bavail) * Number(s.bsize);
  } catch {
    return null;
  }
}

/** True for the errors a full disk raises; the caller keeps the work for the next cycle instead of failing it for good. */
export function isDiskFullError(e: unknown): boolean {
  const code = (e as { code?: unknown } | null)?.code;
  if (code === 'ENOSPC' || code === 'EDQUOT') return true;
  if (typeof code === 'string' && /^SQLITE_FULL|SQLITE_IOERR_WRITE/.test(code)) return true;
  return /no space left|disk is full|database or disk is full/i.test(String((e as { message?: unknown } | null)?.message ?? ''));
}

// ------------------------------------------------------------------------------------------ memory

export interface MemorySample {
  /** resident set size of the main process in bytes */
  rss: number;
  at: number;
}

export interface MemoryVerdict {
  level: 'ok' | 'high' | 'restart';
  rssMb: number;
  /** growth in MB per hour over the samples, null with fewer than 2 samples or less than 10 minutes of them */
  growthMbPerHour: number | null;
}

export const MEMORY_WARN_BYTES = 1200 * MB;
export const MEMORY_RESTART_BYTES = 2000 * MB;

/**
 * `high` above the warn line; `restart` when the last 3 samples are all above the restart line, or when memory grew by more than
 * 150 MB per hour for 6 hours and is above the warn line (a leak). A restart only ever happens when nothing is syncing (the caller checks).
 */
export function assessMemory(samples: MemorySample[], o: { warnBytes?: number; restartBytes?: number } = {}): MemoryVerdict {
  const warn = o.warnBytes ?? MEMORY_WARN_BYTES;
  const hard = o.restartBytes ?? MEMORY_RESTART_BYTES;
  const last = samples[samples.length - 1];
  if (!last) return { level: 'ok', rssMb: 0, growthMbPerHour: null };
  const first = samples[0] as MemorySample;
  const span = last.at - first.at;
  const growth = samples.length >= 2 && span >= 10 * 60_000 ? ((last.rss - first.rss) / MB) / (span / 3_600_000) : null;
  const rssMb = Math.round(last.rss / MB);
  const tail = samples.slice(-3);
  if (tail.length === 3 && tail.every((s) => s.rss >= hard)) return { level: 'restart', rssMb, growthMbPerHour: growth };
  if (growth !== null && growth > 150 && span >= 6 * 3_600_000 && last.rss >= warn) return { level: 'restart', rssMb, growthMbPerHour: growth };
  return { level: last.rss >= warn ? 'high' : 'ok', rssMb, growthMbPerHour: growth };
}

/** Keeps the last `max` samples (default 48, two days of hourly samples). */
export function pushSample(samples: MemorySample[], s: MemorySample, max = 48): MemorySample[] {
  const next = [...samples, s];
  return next.length > max ? next.slice(next.length - max) : next;
}

/**
 * Rough peak memory of loading one company wholesale (`readTable` of every table, used by the full snapshot and the initial serve).
 * Constants are measured on a real SQLite vault with 200k vouchers and 400k ledger lines: 4.3 KB per voucher row, 0.75 KB per line row.
 */
export function estimateLoadBytes(c: { vouchers: number; lines: number }): number {
  return Math.round(c.vouchers * 4.3 * 1024 + c.lines * 0.75 * 1024);
}

// ------------------------------------------------------------------------------------------ wall clock

export interface ClockJump {
  /** how far the wall clock moved beyond the time that really passed, milliseconds (positive = clock went forward) */
  jumpMs: number;
  /** the process was probably asleep (a forward jump that matches a long gap between ticks) */
  likelySleep: boolean;
}

/**
 * Compares the wall clock with a monotonic clock between two ticks. A system sleep stops the monotonic clock on some systems and not on
 * others, so only the difference matters: a change of more than `thresholdMs` (default 2 minutes) is reported. `perf` is `performance.now`.
 */
export function createClockWatch(o: { wall?: () => number; mono?: () => number; thresholdMs?: number } = {}) {
  const wall = o.wall ?? Date.now;
  const mono = o.mono ?? (() => performance.now());
  const threshold = o.thresholdMs ?? 120_000;
  let w0 = wall();
  let m0 = mono();
  return {
    /** Call on a timer (about once a minute) and after a resume. Returns null while the clock behaves. */
    tick(): ClockJump | null {
      const w = wall();
      const m = mono();
      const jump = w - w0 - (m - m0);
      const gap = w - w0;
      w0 = w;
      m0 = m;
      if (Math.abs(jump) < threshold) return null;
      return { jumpMs: Math.round(jump), likelySleep: jump > 0 && gap > threshold };
    },
  };
}

// ------------------------------------------------------------------------------------------ hourly health check

export interface HealthInput {
  now: number;
  paused: boolean;
  blocked: boolean;
  vaultOpen: boolean;
  /** configured sync interval in minutes */
  intervalMin: number;
  syncRunning: boolean;
  /** epoch ms the current cycle started, when one is running */
  syncStartedAt: number | null;
  lastSyncAt: number | null;
  /** epoch ms the app started */
  startedAt: number;
  tallyOnline: boolean;
  disk: DiskLevel;
  memory: MemoryVerdict['level'];
  /** consecutive failed polls of the entry queue */
  entryPollFailures: number;
}

export type HealthAction = 'restart_scheduler' | 'restart_app' | 'warn_stalled' | 'warn_tally' | 'warn_disk' | 'warn_memory' | 'check_integrity';

export interface HealthReport {
  ok: boolean;
  actions: HealthAction[];
  /** short plain reasons for the log, one per action */
  notes: string[];
}

export const STUCK_CYCLE_MS = 30 * 60_000;

/**
 * The hourly check (legacy "health check and restart", rebuilt): decides what to do, does nothing itself. A sync cycle that has run for
 * more than 30 minutes is stuck; a PC that is allowed to sync but has not for 6 intervals (and at least 60 minutes) is stalled.
 */
export function assessHealth(h: HealthInput): HealthReport {
  const actions: HealthAction[] = [];
  const notes: string[] = [];
  const add = (a: HealthAction, n: string) => {
    if (!actions.includes(a)) actions.push(a);
    notes.push(n);
  };
  const interval = Math.max(1, h.intervalMin) * 60_000;

  if (h.syncRunning && h.syncStartedAt !== null && h.now - h.syncStartedAt > STUCK_CYCLE_MS) {
    add('restart_scheduler', 'a sync cycle has been running for over 30 minutes');
  } else if (!h.paused && !h.blocked && h.vaultOpen && !h.syncRunning && h.tallyOnline && h.disk !== 'critical') {
    const since = h.lastSyncAt ?? h.startedAt;
    const limit = Math.max(60 * 60_000, 6 * interval);
    if (h.now - since > limit) add('warn_stalled', 'no sync for over 6 intervals although Tally is online');
    if (h.now - since > 2 * limit) add('restart_scheduler', 'no sync for over 12 intervals although Tally is online');
  }
  if (!h.tallyOnline && !h.paused && !h.blocked) add('warn_tally', 'Tally has not been reachable');
  if (h.disk !== 'ok') add('warn_disk', `disk space ${h.disk}`);
  if (h.memory === 'high') add('warn_memory', 'memory use is high');
  if (h.memory === 'restart' && !h.syncRunning) add('restart_app', 'memory stayed above the limit, restarting between cycles');
  if (h.entryPollFailures >= 10) add('warn_stalled', 'the entry queue could not be polled for 10 tries');
  if (h.vaultOpen && h.disk === 'ok' && h.now - h.startedAt > 20 * 3_600_000 && h.now - h.startedAt < 21 * 3_600_000) add('check_integrity', 'daily quick integrity check');
  return { ok: actions.length === 0, actions, notes };
}

export const crashGuardFileName = 'start-history.json';
