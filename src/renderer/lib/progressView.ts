/*
LazyBooks | src/renderer/lib/progressView.ts
Responsibility: Sync progress card - plain texts, percent and visibility from a `SyncProgress` (pure, no React)
Introduced by: Phase 46 (sync-progress) - docs/specs/sync-progress.md
STATUS: IMPLEMENTED (Phase 46)
Counts and dates only. The card never shows a company, ledger or party name.
*/

import type { SyncProgress } from '../../shared/ipc';
import { PROGRESS_DEFAULTS } from '../../shared/constants';
import { countText, overallPercent } from '../../shared/syncProgress';

export type ProgressTone = 'active' | 'ok' | 'bad';

export interface ProgressCard {
  tone: ProgressTone;
  headline: string;
  /** Second line parts, in order; empty parts are left out. */
  details: string[];
  /** 0 to 100, or null for an indeterminate bar. */
  percent: number | null;
  /** Accessible text of the bar. */
  label: string;
}

/** A stage must last this long (ms) before a card appears for a quiet cycle. */
export const QUIET_STAGE_MS = 2000;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** `2026-04-01` to `Apr 2026`; the input is returned unchanged when it is not an ISO date. */
export function monthText(iso: string): string {
  const m = /^(\d{4})-(\d{2})-\d{2}$/.exec(iso);
  const name = m ? MONTHS[Number(m[2]) - 1] : undefined;
  return m && name ? `${name} ${m[1]}` : iso;
}

/** "about 40 s left" or "about 6 min left"; null when unknown. */
export function etaText(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return null;
  if (seconds <= 120) return `about ${Math.max(10, Math.round(seconds / 10) * 10)} s left`;
  return `about ${Math.round(seconds / 60)} min left`;
}

/** Percent shown in the headline: never 100 before the run is really done, even when `done` exceeds `total`. */
export function voucherPercent(done: number, total: number | null): number | null {
  if (total === null || total <= 0) return null;
  return Math.min(99, Math.max(0, Math.floor((done / total) * 100)));
}

/**
 * Should the card be on screen at all? Quiet cycles must not flash a bar: show it only when the vouchers total is larger than one batch,
 * or when the same stage has lasted longer than QUIET_STAGE_MS. Failures always show.
 */
export function cardVisible(p: SyncProgress | null, stageForMs: number): boolean {
  if (!p) return false;
  if (p.stage === 'idle' || p.stage === 'done') return false;
  if (p.stage === 'failed') return true;
  if (p.vouchers && p.vouchers.total !== null && p.vouchers.total > p.vouchers.batchSize) return true;
  if (p.resumed) return true;
  return stageForMs > QUIET_STAGE_MS;
}

/** Texts of the card for a running or failed event. Not meant for idle or done (the page shows the "up to date" line for those). */
export function progressCard(p: SyncProgress): ProgressCard {
  const pct = overallPercent(p);
  const base = { tone: 'active' as ProgressTone };
  switch (p.stage) {
    case 'failed':
      return { tone: 'bad', headline: p.message ?? 'The last sync did not finish.', details: [], percent: null, label: 'Sync failed' };
    case 'starting':
      return { ...base, headline: 'Starting sync...', details: [], percent: null, label: 'Starting sync' };
    case 'masters': {
      const m = p.masters;
      const text = m && m.total > 1 ? `Reading masters ${countText(m.done)} of ${countText(m.total)}` : 'Reading masters...';
      return { ...base, headline: text, details: [], percent: m && m.total > 1 ? pct : null, label: text };
    }
    case 'counting':
      return { ...base, headline: 'Counting vouchers...', details: [], percent: null, label: 'Counting vouchers' };
    case 'checking-deleted':
      return { ...base, headline: 'Checking for deleted vouchers...', details: [], percent: null, label: 'Checking for deleted vouchers' };
    case 'applying':
      return { ...base, headline: 'Saving to your computer...', details: [], percent: null, label: 'Saving to your computer' };
    case 'closing':
      return { ...base, headline: 'Updating closing balances...', details: [], percent: null, label: 'Updating closing balances' };
    case 'vouchers': {
      const v = p.vouchers;
      if (!v) return { ...base, headline: 'Reading vouchers...', details: [], percent: null, label: 'Reading vouchers' };
      const vp = voucherPercent(v.done, v.total);
      const headline = v.total === null ? `Reading vouchers: ${countText(v.done)} so far` : `Reading vouchers: ${countText(v.done)} of ${countText(v.total)} (${vp}%)`;
      const details: string[] = [];
      if (p.resumed && p.message) details.push(p.message);
      if (v.windowFrom) details.push(monthText(v.windowFrom));
      if (v.batchIndex > 0) details.push(v.batchCount !== null ? `batch ${countText(v.batchIndex)} of ${countText(Math.max(v.batchCount, v.batchIndex))}` : `batch ${countText(v.batchIndex)}`);
      details.push(v.effectiveSize < v.batchSize ? `batch size reduced to ${countText(v.effectiveSize)}` : `batch size ${countText(v.batchSize)}`);
      if (p.ratePerMin !== null) details.push(`${countText(p.ratePerMin)} per min`);
      const eta = v.total !== null && v.done >= v.total ? null : etaText(p.etaSeconds);
      details.push(eta ?? (v.total !== null && v.done < v.total && v.batchIndex < 2 ? 'estimating...' : ''));
      return { ...base, headline, details: details.filter((d) => d !== ''), percent: vp, label: headline };
    }
    default:
      return { ...base, headline: 'Syncing...', details: [], percent: pct, label: 'Syncing' };
  }
}

export const PROGRESS_THROTTLE_MS = PROGRESS_DEFAULTS.progressThrottleMs;
