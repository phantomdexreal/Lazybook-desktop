/*
LazyBooks | src/main/tally/guards.ts
Responsibility: Tally edge cases: restore (backwards AlterID), FY change, company switch, Tally closed/busy, clock skew, partial answers
Introduced by: Phase 14 (tally-edge)
STATUS: IMPLEMENTED (Phase 14)
Pure decision helpers (no Electron, no I/O, no Tally calls). The scheduler (Phase 18) feeds them the stored cursors and the fresh
company record and acts on the answer; the vault (Phase 15/16) performs any clear. Nothing here deletes or writes anything.
*/

import { TallyError } from './client';

// ---------------------------------------------------------------- company change assessment

/** What the connector remembers per synced company (stored by the caller in the vault/config). */
export interface SyncMemory {
  companyGuid: string;
  alterIdMaster: number;
  alterIdVoucher: number;
  /** ISO books period of the company at the last successful sync (`starting_from`, `ending_at`). */
  startingFrom: string | null;
  endingAt: string | null;
}

/** The fields of the fresh `tm_company` row this module needs. */
export interface CompanyNow {
  guid: string;
  alter_id_master: number;
  alter_id_voucher: number;
  starting_from: string | null;
  ending_at: string | null;
}

export type GuardAction = 'none' | 'incremental' | 'masters' | 'window_resync' | 'full_resync';
export type GuardReason =
  | 'first_sync'
  | 'company_switched'
  | 'alterid_backwards_master'
  | 'alterid_backwards_voucher'
  | 'fy_changed'
  | 'masters_changed'
  | 'vouchers_changed';

export interface Assessment {
  /** Strongest action required (order: none < incremental < masters < window_resync < full_resync). */
  action: GuardAction;
  reasons: GuardReason[];
  /** true when the vault rows of the company must be cleared before the resync (restore or another company). */
  clearVault: boolean;
  /** true when the stored cursors must be dropped (they no longer describe Tally). */
  resetCursors: boolean;
  /** Pull masters in full. */
  pullMasters: boolean;
  /** Pull vouchers: 'none', 'incremental' (AlterID cursor) or 'full' (whole books window, no cursor). */
  pullVouchers: 'none' | 'incremental' | 'full';
}

const RANK: Record<GuardAction, number> = { none: 0, incremental: 1, masters: 2, window_resync: 3, full_resync: 4 };

/**
 * Decide what a fresh company record means for the stored state (TALLY_WIRE section 4).
 * - no memory, or another company guid: full resync (the vault is cleared for a different company);
 * - an AlterID lower than stored: a backup was restored (or the data was rebuilt): the cursors are worthless, so clear and resync fully;
 * - the books period changed (financial year rolled over or the period was edited): re-pull the whole window, masters included, keep the vault;
 * - otherwise a higher master AlterID pulls masters, a higher voucher AlterID pulls vouchers incrementally.
 * Equal AlterIDs and an unchanged period mean nothing to do.
 */
export function assessCompany(memory: SyncMemory | null, now: CompanyNow): Assessment {
  const reasons: GuardReason[] = [];
  let action = 'none' as GuardAction; // assigned inside `raise`, so keep the wide type
  const raise = (a: GuardAction, r: GuardReason) => {
    reasons.push(r);
    if (RANK[a] > RANK[action]) action = a;
  };
  let clearVault = false;
  let resetCursors = false;

  if (!memory) {
    raise('full_resync', 'first_sync');
    resetCursors = true;
  } else if (memory.companyGuid !== now.guid) {
    raise('full_resync', 'company_switched');
    clearVault = true;
    resetCursors = true;
  } else {
    if (now.alter_id_master < memory.alterIdMaster) { raise('full_resync', 'alterid_backwards_master'); clearVault = true; resetCursors = true; }
    if (now.alter_id_voucher < memory.alterIdVoucher) { raise('full_resync', 'alterid_backwards_voucher'); clearVault = true; resetCursors = true; }
    if (memory.startingFrom !== now.starting_from || memory.endingAt !== now.ending_at) raise('window_resync', 'fy_changed');
    if (now.alter_id_master > memory.alterIdMaster) raise('masters', 'masters_changed');
    if (now.alter_id_voucher > memory.alterIdVoucher) raise('incremental', 'vouchers_changed');
  }

  const full = action === 'full_resync' || action === 'window_resync';
  return {
    action,
    reasons,
    clearVault,
    resetCursors,
    pullMasters: full || action === 'masters',
    pullVouchers: full ? 'full' : action === 'incremental' || action === 'masters' ? 'incremental' : 'none',
  };
}

/** The memory to store after the assessed pull was committed to the vault. */
export function memoryAfterSync(now: CompanyNow): SyncMemory {
  return {
    companyGuid: now.guid,
    alterIdMaster: now.alter_id_master,
    alterIdVoucher: now.alter_id_voucher,
    startingFrom: now.starting_from,
    endingAt: now.ending_at,
  };
}

// ---------------------------------------------------------------- Tally closed / busy / locked

export type TallyState = 'online' | 'closed' | 'no_company' | 'busy' | 'rejected' | 'damaged' | 'too_large' | 'unknown';

export interface TallyFailure {
  state: TallyState;
  /** A later attempt can succeed with no change by the user. */
  retryable: boolean;
  /** Plain-language line for the status page. */
  message: string;
}

/**
 * Classify an error thrown by the Tally client. Closed (refused/reset), no company open, busy or locked
 * (no answer in time: Tally is in a modal dialog, importing, or being used), a refusal, a damaged answer, too much data.
 */
export function classifyTallyError(e: unknown): TallyFailure {
  if (!(e instanceof TallyError)) return { state: 'unknown', retryable: true, message: 'Something unexpected stopped the Tally read. LazyBooks will try again.' };
  switch (e.detail) {
    case 'TALLY_UNREACHABLE':
      return { state: 'closed', retryable: true, message: 'TallyPrime is closed or its XML server is off. Open TallyPrime and LazyBooks will continue.' };
    case 'TALLY_TIMEOUT':
      return { state: 'busy', retryable: true, message: 'TallyPrime is busy or waiting on a dialog. Finish what you are doing in Tally and LazyBooks will continue.' };
    case 'TALLY_COMPANY_NOT_LOADED':
      return { state: 'no_company', retryable: true, message: 'The company is not open in TallyPrime. Open it and LazyBooks will continue.' };
    case 'TALLY_MALFORMED':
      return { state: 'damaged', retryable: true, message: 'TallyPrime sent a damaged answer. It will be retried on the next sync.' };
    case 'TALLY_RESPONSE_TOO_LARGE':
      return { state: 'too_large', retryable: false, message: 'TallyPrime returned more data than LazyBooks accepts for one request. Narrow the date range.' };
    case 'TALLY_REJECTED':
      return { state: 'rejected', retryable: e.retryable, message: e.message };
    default:
      return { state: 'unknown', retryable: e.retryable, message: e.message };
  }
}

/** Delay before the next attempt after `failures` consecutive failures: 30 s doubling to a 15 min cap. */
export function nextRetryDelayMs(failures: number, opts: { baseMs?: number; capMs?: number } = {}): number {
  const base = opts.baseMs ?? 30_000;
  const cap = opts.capMs ?? 15 * 60_000;
  if (failures <= 0) return 0;
  return Math.min(cap, base * 2 ** Math.min(failures - 1, 20));
}

export interface TallyHealth {
  failures: number;
  lastState: TallyState;
  /** true while the next attempt should wait */
  waitMs: number;
}

/** Tiny consecutive-failure tracker. `record(e)` on a failure, `ok()` on success; a non-retryable failure does not escalate. */
export function createTallyHealth(opts: { baseMs?: number; capMs?: number } = {}) {
  let failures = 0;
  let lastState: TallyState = 'online';
  return {
    record(e: unknown): TallyFailure & { waitMs: number } {
      const f = classifyTallyError(e);
      lastState = f.state;
      if (f.retryable) failures++;
      return { ...f, waitMs: f.retryable ? nextRetryDelayMs(failures, opts) : 0 };
    },
    ok(): void {
      failures = 0;
      lastState = 'online';
    },
    snapshot(): TallyHealth {
      return { failures, lastState, waitMs: nextRetryDelayMs(failures, opts) };
    },
  };
}

// ---------------------------------------------------------------- clock skew against the server

/** Skew above this is reported; above the hard limit date-based decisions use server time. */
export const CLOCK_SKEW_WARN_MS = 2 * 60_000;
export const CLOCK_SKEW_HARD_MS = 10 * 60_000;

export interface ClockSkew {
  /** server minus local, milliseconds (positive: this PC is behind). */
  skewMs: number;
  level: 'ok' | 'warn' | 'hard';
}

/**
 * `serverTime` is the ISO `server_time` from a bootstrap answer; `localAtReceive` the local epoch ms when it arrived.
 * Half the round trip is removed when `rttMs` is given. Unparseable server time gives null (no judgement).
 */
export function clockSkew(serverTime: string, localAtReceive: number, rttMs = 0): ClockSkew | null {
  const s = Date.parse(serverTime);
  if (!Number.isFinite(s)) return null;
  const skewMs = Math.round(s + rttMs / 2 - localAtReceive);
  const a = Math.abs(skewMs);
  return { skewMs, level: a >= CLOCK_SKEW_HARD_MS ? 'hard' : a >= CLOCK_SKEW_WARN_MS ? 'warn' : 'ok' };
}

/** Epoch ms corrected to server time. */
export const serverNow = (localNow: number, skew: ClockSkew | null): number => localNow + (skew?.skewMs ?? 0);

/** Local calendar date (`YYYY-MM-DD`) of the corrected time; used for windows and `closing_as_of` when the skew is hard. */
export function correctedToday(localNow: number, skew: ClockSkew | null): string {
  const d = new Date(skew && skew.level === 'hard' ? serverNow(localNow, skew) : localNow);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ---------------------------------------------------------------- partial responses

export interface Completeness {
  complete: boolean;
  /** listed by Tally but not present in what was pulled */
  missing: string[];
  /** pulled but not listed (deleted meanwhile, or listed answer was itself cut) */
  extra: string[];
}

/**
 * A well-formed answer can still be incomplete (Tally closed a company mid-answer, a window cut short).
 * Compare the guid list Tally gave for the window (`LBVoucherGuids`) with the guids a pull returned. A missing guid means the
 * pull must not advance the cursor; extras are informational.
 */
export function checkCompleteness(listed: Iterable<string>, pulled: Iterable<string>): Completeness {
  const L = new Set(listed);
  const P = new Set(pulled);
  const missing = [...L].filter((g) => !P.has(g));
  const extra = [...P].filter((g) => !L.has(g));
  return { complete: missing.length === 0, missing, extra };
}

/** Count-based variant for answers that have an expected size (for example a company's own count). */
export function checkCount(expected: number, received: number): { complete: boolean; shortBy: number } {
  return { complete: received >= expected, shortBy: Math.max(0, expected - received) };
}

/**
 * Run `read` and retry when Tally sent a damaged answer (a partial answer cut mid-way): up to `attempts` tries in total.
 * Other errors propagate at once. `sleep` is injectable for tests.
 */
export async function retryDamaged<T>(read: () => Promise<T>, opts: { attempts?: number; sleep?: (ms: number) => Promise<void>; delayMs?: number } = {}): Promise<T> {
  const attempts = Math.max(1, opts.attempts ?? 3);
  const sleep = opts.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  let last: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await read();
    } catch (e) {
      last = e;
      if (!(e instanceof TallyError) || e.detail !== 'TALLY_MALFORMED' || i === attempts) throw e;
      await sleep((opts.delayMs ?? 2000) * i);
    }
  }
  throw last;
}
