/*
LazyBooks | src/main/logs.ts
Responsibility: Reads, filters and exports the rotating log files (redacted again on the way out)
Introduced by: Phase 34 (ui-logs)
STATUS: IMPLEMENTED (Phase 34)
*/

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { LogLevelName, LogLine, LogQuery, LogsTailResult } from '../shared/ipc';
import { redact } from './logger';

const FILE_RE = /^lazybooks(?:\.(\d+))?\.log$/;
const LICENSE_RE = /\bLB-([A-Z0-9]{4})(?:-[A-Z0-9]{4}){2}-([A-Z0-9]{4})\b/g;
const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const BEARER_RE = /\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/gi;
const RANK: Record<LogLevelName, number> = { info: 0, warn: 1, error: 2 };
export const DEFAULT_LIMIT = 200;
export const MAX_LIMIT = 1000;

/** Extra text-level masking on top of the logger's key-based redaction: license keys, e-mail addresses, bearer tokens. */
export function maskText(s: string): string {
  return s.replace(LICENSE_RE, 'LB-$1-****-****-$2').replace(EMAIL_RE, '[email]').replace(BEARER_RE, 'Bearer [redacted]');
}

function maskDeep(v: unknown, depth = 0): unknown {
  if (typeof v === 'string') return maskText(v);
  if (v === null || typeof v !== 'object') return v;
  if (depth > 6) return '[truncated]';
  if (Array.isArray(v)) return v.map((x) => maskDeep(x, depth + 1));
  const o: Record<string, unknown> = {};
  for (const [k, x] of Object.entries(v as Record<string, unknown>)) o[k] = maskDeep(x, depth + 1);
  return o;
}

/** Parses one JSON line; null when it is not a log line. The result is redacted (keys, JWTs) and masked (license keys, e-mails). */
export function parseLine(raw: string): LogLine | null {
  const text = raw.trim();
  if (!text) return null;
  let j: unknown;
  try {
    j = JSON.parse(text);
  } catch {
    return null;
  }
  if (!j || typeof j !== 'object') return null;
  const o = j as Record<string, unknown>;
  if (typeof o['t'] !== 'string' || typeof o['msg'] !== 'string') return null;
  const lvl = o['lvl'] === 'warn' || o['lvl'] === 'error' ? o['lvl'] : 'info';
  const line: LogLine = {
    t: o['t'],
    lvl,
    mod: typeof o['mod'] === 'string' ? o['mod'] : 'app',
    msg: maskText(String(redact(o['msg']))),
  };
  if (o['data'] && typeof o['data'] === 'object') line.data = maskDeep(redact(o['data'])) as Record<string, unknown>;
  return line;
}

export function matches(line: LogLine, q: LogQuery): boolean {
  if (q.level && RANK[line.lvl] < RANK[q.level]) return false;
  if (q.mod && line.mod !== q.mod) return false;
  const needle = q.q?.trim().toLowerCase();
  if (needle) {
    const hay = `${line.msg} ${line.mod} ${line.data ? JSON.stringify(line.data) : ''}`.toLowerCase();
    if (!hay.includes(needle)) return false;
  }
  return true;
}

/** "HH:MM:SS" style line used in the text export. */
export function formatLine(l: LogLine): string {
  return `${l.t} ${l.lvl.toUpperCase().padEnd(5)} ${l.mod.padEnd(8)} ${l.msg}${l.data ? ' ' + JSON.stringify(l.data) : ''}`;
}

export interface LogReader {
  tail(query?: LogQuery): LogsTailResult;
  /** Writes all kept files, oldest first, redacted, to `dest`. */
  exportTo(dest: string): { path: string; lines: number };
  /** Number of log files found. */
  fileCount(): number;
}

export function createLogReader(dir: string, now: () => Date = () => new Date()): LogReader {
  /** Files newest first: lazybooks.log, lazybooks.1.log, ... */
  function files(): string[] {
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .map((n) => ({ n, i: FILE_RE.exec(n) }))
      .filter((x): x is { n: string; i: RegExpExecArray } => x.i !== null)
      .sort((a, b) => Number(a.i[1] ?? 0) - Number(b.i[1] ?? 0))
      .map((x) => join(dir, x.n));
  }
  function linesOf(file: string): string[] {
    try {
      return readFileSync(file, 'utf8').split('\n');
    } catch {
      return [];
    }
  }
  return {
    fileCount: () => files().length,
    tail(query = {}) {
      const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(query.limit ?? DEFAULT_LIMIT)));
      const lines: LogLine[] = [];
      let skipped = 0;
      let truncated = false;
      outer: for (const f of files()) {
        const raw = linesOf(f);
        for (let i = raw.length - 1; i >= 0; i--) {
          const text = raw[i] as string;
          if (!text.trim()) continue;
          const l = parseLine(text);
          if (!l) {
            skipped++;
            continue;
          }
          if (!matches(l, query)) continue;
          if (lines.length >= limit) {
            truncated = true;
            break outer;
          }
          lines.push(l);
        }
      }
      return { lines, truncated, skipped };
    },
    exportTo(dest) {
      const out: string[] = [];
      for (const f of files().reverse()) {
        for (const text of linesOf(f)) {
          const l = parseLine(text);
          if (l) out.push(formatLine(l));
        }
      }
      const header = `LazyBooks log export, ${now().toISOString()}, ${out.length} lines. Secrets are redacted.\n`;
      writeFileSync(dest, header + out.join('\n') + (out.length ? '\n' : ''), 'utf8');
      return { path: dest, lines: out.length };
    },
  };
}
