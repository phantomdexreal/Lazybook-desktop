/*
LazyBooks | src/main/logger.ts
Responsibility: Tray, autostart, logging
Introduced by: Phase 2 (tray-lifecycle) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 2)
*/

/**
 * Structured JSON-lines logger with redaction and size-based rotation.
 * Line shape (API_CONTRACTS.md): {"t":ISO,"lvl":"info|warn|error","mod":"...","msg":"...","data":{...}}
 * No Electron imports here so it can be exercised from plain Node.
 */
import { appendFileSync, existsSync, mkdirSync, renameSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

export type LogLevel = 'info' | 'warn' | 'error';
export type LogModule = 'app' | 'tally' | 'vault' | 'postbox' | 'entries' | 'snapshot' | 'sync' | 'ui';

export interface LoggerOptions {
  dir: string;
  /** Rotate when the active file would exceed this many bytes (default 5 MB, constants desktop.log_rotate_mb). */
  maxBytes?: number;
  /** Total files kept, active included (default 7, constants desktop.log_keep_files). */
  keepFiles?: number;
}

const BASE = 'lazybooks';
const SENSITIVE_KEY = /pass(word|phrase)?|secret|token|authorization|api[-_]?key|anon[-_]?key|service[-_]?role|cookie|salt/i;
const JWT = /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g;

let opts: Required<LoggerOptions> | null = null;

export function initLogger(o: LoggerOptions): void {
  opts = { maxBytes: 5 * 1024 * 1024, keepFiles: 7, ...o };
  mkdirSync(opts.dir, { recursive: true });
}

export function logFilePath(index = 0): string {
  if (!opts) throw new Error('logger not initialised');
  return join(opts.dir, index === 0 ? `${BASE}.log` : `${BASE}.${index}.log`);
}

export function redact(value: unknown, depth = 0): unknown {
  if (typeof value === 'string') return value.replace(JWT, '[redacted]');
  if (value === null || typeof value !== 'object') return value;
  if (depth > 6) return '[truncated]';
  if (value instanceof Error) return { name: value.name, message: String(redact(value.message)), stack: value.stack ? String(redact(value.stack)) : undefined };
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = SENSITIVE_KEY.test(k) ? '[redacted]' : redact(v, depth + 1);
  }
  return out;
}

function rotate(): void {
  if (!opts) return;
  const last = opts.keepFiles - 1;
  if (last < 1) {
    rmSync(logFilePath(0), { force: true });
    return;
  }
  rmSync(logFilePath(last), { force: true });
  for (let i = last - 1; i >= 0; i--) {
    if (existsSync(logFilePath(i))) renameSync(logFilePath(i), logFilePath(i + 1));
  }
}

export function log(lvl: LogLevel, mod: LogModule, msg: string, data?: Record<string, unknown>): void {
  if (!opts) return;
  const line =
    JSON.stringify({ t: new Date().toISOString(), lvl, mod, msg: redact(msg), ...(data ? { data: redact(data) } : {}) }) + '\n';
  try {
    const f = logFilePath(0);
    const size = existsSync(f) ? statSync(f).size : 0;
    if (size > 0 && size + Buffer.byteLength(line) > opts.maxBytes) rotate();
    appendFileSync(f, line, 'utf8');
  } catch {
    // Logging must never crash the app.
  }
}

export const logger = {
  info: (mod: LogModule, msg: string, data?: Record<string, unknown>) => log('info', mod, msg, data),
  warn: (mod: LogModule, msg: string, data?: Record<string, unknown>) => log('warn', mod, msg, data),
  error: (mod: LogModule, msg: string, data?: Record<string, unknown>) => log('error', mod, msg, data),
};
