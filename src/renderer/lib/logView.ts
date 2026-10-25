/*
LazyBooks | src/renderer/lib/logView.ts
Responsibility: Pure helpers for the log viewer (time format, level tone, data summary)
Introduced by: Phase 34 (ui-logs)
STATUS: IMPLEMENTED (Phase 34)
*/

import type { LogLevelName, LogLine } from '../../shared/ipc';

export const MODULES = ['app', 'tally', 'vault', 'postbox', 'entries', 'snapshot', 'sync', 'ui'] as const;
export const LEVELS: Array<{ id: LogLevelName | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'warn', label: 'Warnings and errors' },
  { id: 'error', label: 'Errors' },
];
export const LEVEL_WORD: Record<LogLevelName, string> = { info: 'Info', warn: 'Warning', error: 'Error' };
export const LEVEL_TEXT: Record<LogLevelName, string> = { info: 'text-lb-muted', warn: 'text-lb-warning', error: 'text-lb-danger' };

const pad = (n: number): string => String(n).padStart(2, '0');

/** Local "25 Oct 14:03:07"; the raw text when unparseable. */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] as string;
  return `${pad(d.getDate())} ${mon} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Short one-line "key value, key value" preview of a line's data; '' without data. */
export function dataPreview(l: LogLine, max = 90): string {
  if (!l.data) return '';
  const parts = Object.entries(l.data).map(([k, v]) => `${k} ${typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)}`);
  const s = parts.join(', ');
  return s.length > max ? s.slice(0, max - 3) + '...' : s;
}

export function dataPretty(l: LogLine): string {
  return l.data ? JSON.stringify(l.data, null, 2) : '';
}

/** "12 lines", "200 lines (more available, narrow the filter)". */
export function countText(shown: number, truncated: boolean): string {
  const base = `${shown} line${shown === 1 ? '' : 's'}`;
  return truncated ? `${base} (newest shown, narrow the filter to see older ones)` : base;
}
