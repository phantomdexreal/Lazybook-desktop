/*
LazyBooks | src/renderer/lib/statusView.ts
Responsibility: Pure helpers that turn a Status into what the dashboard shows (headline, relative times, labels)
Introduced by: Phase 33 (ui-status)
STATUS: IMPLEMENTED (Phase 33)
*/

import type { Status } from '../../shared/ipc';

export type Level = 'ok' | 'warn' | 'bad' | 'idle';

export interface Headline {
  level: Level;
  title: string;
  text: string;
}

export const COUNT_LABELS: Array<{ table: string; label: string }> = [
  { table: 'tm_ledger', label: 'Ledgers' },
  { table: 'tm_group', label: 'Groups' },
  { table: 'tm_stock_item', label: 'Stock items' },
  { table: 'tm_voucher_type', label: 'Voucher types' },
  { table: 'tx_voucher', label: 'Vouchers' },
];

export const FLAG_LABELS: Record<string, string> = {
  reports: 'Reports on devices',
  entries: 'Entries from devices',
  cloud_copy: 'Encrypted cloud copy',
  e2e_encryption: 'End-to-end encryption',
};

/** "just now", "5 min ago", "3 h ago", "2 days ago"; "never" for null; a future time reads "in a moment". */
export function ago(iso: string | null | undefined, nowMs: number): string {
  if (!iso) return 'never';
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return 'unknown';
  const sec = Math.round((nowMs - t) / 1000);
  if (sec < -5) return 'in a moment';
  if (sec < 45) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} days ago`;
}

/** "in 5 min" for a future time, "due now" when passed, "-" for null. */
export function until(iso: string | null | undefined, nowMs: number): string {
  if (!iso) return '-';
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '-';
  const sec = Math.round((t - nowMs) / 1000);
  if (sec <= 5) return 'due now';
  const min = Math.round(sec / 60);
  if (min < 1) return 'in under a minute';
  if (min < 60) return `in ${min} min`;
  return `in ${Math.round(min / 60)} h`;
}

export function formatCount(n: number | undefined): string {
  return n === undefined ? '-' : n.toLocaleString('en-IN');
}

/** Days from now to an ISO date (negative = past); null when no date. */
export function daysLeft(iso: string | null | undefined, nowMs: number): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : Math.floor((t - nowMs) / 86_400_000);
}

/** One sentence answer to "is everything fine?" Ordered by what the person must fix first. */
export function headline(s: Status, nowMs: number): Headline {
  if (!s.license) return { level: 'idle', title: 'Not activated', text: 'Activate this PC with your license key to start syncing.' };
  const d = s.detail;
  if (d?.deviceRevoked) return { level: 'bad', title: 'Stopped', text: 'This PC was removed by the administrator.' };
  if (!s.tally.ok) return { level: 'bad', title: 'Tally is not connected', text: d?.tally?.message || 'Open Tally and enable its XML server.' };
  if (d && d.vaultOpen === false) return { level: 'bad', title: 'Data store unavailable', text: 'The local data store could not be opened.' };
  if (d?.crypto === 'not-set-up' || d?.crypto === 'locked') {
    return { level: 'warn', title: 'Passphrase needed', text: 'Devices cannot read your data until the data passphrase is set and unlocked.' };
  }
  if (d?.sync?.lastOutcome === 'failed' || (d?.sync?.failures ?? 0) > 0) {
    return { level: 'warn', title: 'Sync is retrying', text: d?.sync?.message || 'The last sync did not finish. LazyBooks will try again.' };
  }
  if ((d?.entries?.failed ?? 0) > 0 || (d?.entries?.needsReview ?? 0) > 0) {
    return { level: 'warn', title: 'Entries need attention', text: 'Some entries from devices could not be posted to Tally.' };
  }
  if (d?.sync?.paused) return { level: 'warn', title: 'Sync is paused', text: 'Resume sync from the tray menu to send new data to your devices.' };
  if (!s.internet) return { level: 'warn', title: 'Working offline', text: 'The internet is not reachable. Data keeps syncing from Tally to this PC; devices will catch up later.' };
  if (!s.lastSyncAt) return { level: 'idle', title: 'Starting up', text: 'The first sync has not finished yet. Large companies can take a while.' };
  return { level: 'ok', title: 'All good', text: `Tally is connected and the last sync was ${ago(s.lastSyncAt, nowMs)}.` };
}
