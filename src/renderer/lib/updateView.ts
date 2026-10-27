/*
LazyBooks | src/renderer/lib/updateView.ts
Responsibility: Pure text and state helpers for the Updates block and the Status update banner
Introduced by: Phase 47 (settings-update-controls)
STATUS: IMPLEMENTED (Phase 47)
*/

import { UPDATE_CONTROLS } from '../../shared/constants';
import type { UpdateView } from '../../shared/ipc';

/** "5 min ago" style text for the last finished check; '' when none ran yet. */
export function checkedAgoText(iso: string | null, nowMs: number): string {
  if (!iso) return '';
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  const s = Math.max(0, Math.round((nowMs - t) / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} days ago`;
}

/** Seconds the "Check now" button stays disabled after a finished check (0 when it may be pressed). */
export function checkWaitSeconds(v: UpdateView, nowMs: number): number {
  if (!v.lastCheckedAt) return 0;
  const t = Date.parse(v.lastCheckedAt);
  if (Number.isNaN(t)) return 0;
  const left = UPDATE_CONTROLS.manualUpdateCheckMinGapS - (nowMs - t) / 1000;
  return left > 0 ? Math.ceil(left) : 0;
}

/** The button works unless the app is a development run, a download is running, or the gap has not passed. */
export function canCheckNow(v: UpdateView, nowMs: number, busy: boolean): boolean {
  return !busy && v.phase !== 'unsupported' && v.phase !== 'downloading' && checkWaitSeconds(v, nowMs) === 0;
}

/** One plain line for the status of the updater (never a path or an address). */
export function statusLine(v: UpdateView, nowMs: number, busy = false): string {
  if (v.phase === 'unsupported') return 'Updates are not available in a development run.';
  if (busy) return 'Checking for updates.';
  if (v.phase === 'downloading') {
    const pct = v.progress ? ` ${v.progress.percent}%` : '';
    return `Downloading version ${v.version ?? 'newer'}${pct}.`;
  }
  if (v.phase === 'ready') return v.forced ? `Version ${v.version ?? 'newer'} is ready and will be installed now.` : `Version ${v.version ?? 'newer'} is downloaded and checked. Restart to install it.`;
  if (v.phase === 'error') return v.message ?? 'The update could not be installed.';
  const ago = checkedAgoText(v.lastCheckedAt, nowMs);
  const base = v.message ?? (v.lastCheckedAt ? `You have the latest version available to you (${v.currentVersion}).` : v.autoCheck ? 'No check has finished yet.' : 'Automatic checks are off. Use Check now when you want to look.');
  return ago ? `${base} Last checked ${ago}.` : base;
}

/** Banner text for the Status page; null when nothing is worth showing. */
export function bannerText(v: UpdateView | null, announcedVersion: string | null): string | null {
  if (!v) return announcedVersion ? `Version ${announcedVersion} is available.` : null;
  if (v.phase === 'ready') return `Version ${v.version ?? announcedVersion ?? 'newer'} is downloaded and checked.`;
  if (v.phase === 'downloading') return `Downloading version ${v.version ?? announcedVersion ?? 'newer'}${v.progress ? ` (${v.progress.percent}%)` : ''}.`;
  if (v.phase === 'error') return v.message ?? 'The update could not be installed.';
  if (v.phase === 'unsupported') return announcedVersion ? `Version ${announcedVersion} is available. Updates install from the installed app.` : null;
  if (!announcedVersion) return null;
  return v.autoCheck ? `Version ${announcedVersion} is available.` : `Version ${announcedVersion} is available. Automatic checks are off: use Check now in Settings.`;
}

/** Release notes are plain text only: control characters removed, length capped. The page renders them as text, never as HTML. */
export function notesText(notes: string | null, max = 2000): string | null {
  if (!notes) return null;
  // eslint-disable-next-line no-control-regex
  const t = notes.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();
  if (!t) return null;
  return t.length > max ? `${t.slice(0, max)}...` : t;
}
