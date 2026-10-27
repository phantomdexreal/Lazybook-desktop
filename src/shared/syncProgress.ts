/*
LazyBooks | src/shared/syncProgress.ts
Responsibility: Pure helpers on a `SyncProgress` shared by main (tray, taskbar) and renderer (card): overall percent and plain count text
Introduced by: Phase 46 (sync-progress) - docs/specs/sync-progress.md
STATUS: IMPLEMENTED (Phase 46)
No Electron, no I/O, no names: counts and dates only.
*/

import { PROGRESS_DEFAULTS } from './constants';
import type { SyncProgress } from './ipc';

const W = PROGRESS_DEFAULTS.stageWeights;
const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

/** Fraction of the voucher stage done, 0 to 1; 0 when the total is unknown. While the run is not finished it never reaches 1 (done may exceed total). */
export function voucherFraction(p: SyncProgress): number {
  const v = p.vouchers;
  if (!v || v.total === null || v.total <= 0) return 0;
  return Math.min(0.99, Math.max(0, v.done / v.total));
}

/**
 * Overall percent 0 to 100 (integer), weighted by stage (masters 10, counting 5, vouchers 75, applying 8, closing and checks 2).
 * null when the stage has no meaningful percent (idle, failed, starting): callers show an indeterminate bar or nothing.
 */
export function overallPercent(p: SyncProgress): number | null {
  const m = W.masters;
  const c = W.counting;
  const v = W.vouchers;
  const a = W.applying;
  switch (p.stage) {
    case 'done':
      return 100;
    case 'masters': {
      const t = p.masters?.total ?? 0;
      return t > 1 ? Math.round(m * clamp((p.masters?.done ?? 0) / t, 0, 1)) : 0;
    }
    case 'counting':
      return m;
    case 'vouchers':
      return Math.round(m + c + v * voucherFraction(p));
    case 'checking-deleted':
      return m + c + v;
    case 'applying':
      return m + c + v + Math.round(a / 2);
    case 'closing':
      return m + c + v + a;
    default:
      return null;
  }
}

/** Whole number with thousands separators, fixed locale so text does not depend on the PC. */
export const countText = (n: number): string => Math.max(0, Math.round(n)).toLocaleString('en-US');
