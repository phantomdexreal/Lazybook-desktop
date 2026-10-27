/*
LazyBooks | src/main/sync/stage.ts
Responsibility: Batched voucher pull - on-disk staging area (one row per voucher, all its tables) and the resume checkpoint file `sync-run.json`
Introduced by: Phase 45 (sync-batching) - docs/specs/voucher-batching.md sections 5 to 8, Option A
STATUS: IMPLEMENTED (Phase 45)
No Electron import. The staging table `_lb_stage` lives in the vault file but outside the synced model tables (like `_lb_row_state`): nothing
in it is ever served to a device, and `clearVault` does not touch it. A staged voucher is replaced when the same guid is staged again (later reads win,
the lookback read sees the same data), so a batch written twice after a crash changes nothing.
The checkpoint holds counts, dates and a one-way key of the company only: no company name, no guid, no voucher data.
*/

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import type { Database } from 'better-sqlite3';
import { getMeta, setMeta } from '../db/seq';

export type StageRow = Record<string, unknown>;
export type StageTables = Record<string, StageRow[]>;

const RUN_KEY = 'sched.stage_run';

export interface Stage {
  /** Run id the staged rows belong to, null when the stage is empty or was cleared. */
  runId(): string | null;
  /** Empty the stage and claim it for a new run. */
  begin(runId: string): void;
  /** Stage one batch of mapped voucher tables (one transaction). Rows are grouped by voucher. Returns the number of vouchers staged. */
  put(tables: StageTables): number;
  /** Distinct vouchers staged. */
  count(): number;
  /** The staged vouchers as table sets of at most `size` vouchers each, ordered by guid (keyset reads, nothing is loaded whole). */
  chunks(size: number): Generator<StageTables>;
  /** Empty the stage and release the run id. */
  clear(): void;
}

export function createStage(db: Database): Stage {
  db.exec(`CREATE TABLE IF NOT EXISTS "_lb_stage" ("guid" TEXT PRIMARY KEY, "payload" TEXT NOT NULL) WITHOUT ROWID`);
  const ins = db.prepare(`INSERT OR REPLACE INTO "_lb_stage" ("guid","payload") VALUES (?,?)`);
  const cnt = db.prepare(`SELECT COUNT(*) AS n FROM "_lb_stage"`);
  const next = db.prepare(`SELECT "guid","payload" FROM "_lb_stage" WHERE "guid" > ? ORDER BY "guid" LIMIT ?`);
  return {
    runId: () => getMeta(db, RUN_KEY) || null,
    begin(runId) {
      db.transaction(() => {
        db.exec(`DELETE FROM "_lb_stage"`);
        setMeta(db, RUN_KEY, runId);
      })();
    },
    put(tables) {
      const by = new Map<string, StageTables>();
      for (const r of tables['tx_voucher'] ?? []) {
        const g = String(r['guid'] ?? '');
        if (g === '') continue;
        by.set(g, { tx_voucher: [r] });
      }
      for (const [t, rows] of Object.entries(tables)) {
        if (t === 'tx_voucher') continue;
        for (const r of rows) {
          const e = by.get(String(r['voucher_guid'] ?? ''));
          if (e) (e[t] ??= []).push(r);
        }
      }
      db.transaction(() => {
        for (const [g, v] of by) ins.run(g, JSON.stringify(v));
      })();
      return by.size;
    },
    count: () => Number((cnt.get() as { n: number }).n),
    *chunks(size) {
      let after = '';
      for (;;) {
        const part = next.all(after, Math.max(1, Math.floor(size))) as Array<{ guid: string; payload: string }>;
        if (part.length === 0) return;
        const out: StageTables = {};
        for (const r of part) for (const [t, rows] of Object.entries(JSON.parse(r.payload) as StageTables)) (out[t] ??= []).push(...rows);
        yield out;
        after = (part[part.length - 1] as { guid: string }).guid;
      }
    },
    clear() {
      db.transaction(() => {
        db.exec(`DELETE FROM "_lb_stage"`);
        setMeta(db, RUN_KEY, '');
      })();
    },
  };
}

/** One date range of a run: `narrow` is true when the `$AlterID > cursor` filter applies (false for the lookback re-read). */
export type RunWindow = [from: string, to: string, narrow: boolean];

export interface RunCheckpoint {
  runId: string;
  startedAt: string;
  plan: 'full' | 'incremental';
  windowFrom: string;
  windowTo: string;
  /** All windows of the run, fixed at the start (a midnight in between must not change the list). */
  windows: RunWindow[];
  /** Index of the window being read; equal to `windows.length` when every window is done. */
  monthIndex: number;
  /** Position inside that window: the next page starts here. */
  nextStart: number;
  /** Page size the run started with (kept on resume, so a settings change applies to the next run only). */
  size: number;
  total: number | null;
  doneCount: number;
  cursorBefore: number;
  /** One-way key of the company guid and the company's voucher alter id at the start. */
  companyKey: string;
  alterVoucher: number;
}

export const CHECKPOINT_MAX_AGE_MS = 24 * 3600 * 1000;

export const companyKeyOf = (companyGuid: string): string => createHash('sha256').update(companyGuid).digest('hex').slice(0, 16);

export function readCheckpoint(file: string): RunCheckpoint | null {
  try {
    if (!existsSync(file)) return null;
    const v = JSON.parse(readFileSync(file, 'utf8')) as Partial<RunCheckpoint>;
    if (typeof v.runId !== 'string' || !Array.isArray(v.windows) || typeof v.monthIndex !== 'number' || typeof v.nextStart !== 'number' || typeof v.size !== 'number') return null;
    return v as RunCheckpoint;
  } catch {
    return null; // a damaged file is the same as none
  }
}

/** Atomic write: temp file, then rename, so a kill never leaves a half-written checkpoint. */
export function writeCheckpoint(file: string, cp: RunCheckpoint): void {
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, JSON.stringify(cp), 'utf8');
  renameSync(tmp, file);
}

export function deleteCheckpoint(file: string): void {
  rmSync(file, { force: true });
  rmSync(`${file}.tmp`, { force: true });
}

export interface ResumeContext {
  plan: 'full' | 'incremental';
  windowFrom: string;
  windowTo: string;
  cursorBefore: number;
  companyKey: string;
  alterVoucher: number;
  now: number;
  /** Run id the stage reports (must equal the checkpoint's). */
  stageRun: string | null;
}

/** Pure: why a checkpoint cannot be resumed, or null when it can. */
export function resumeBlocker(cp: RunCheckpoint, c: ResumeContext): string | null {
  const age = c.now - Date.parse(cp.startedAt);
  if (!Number.isFinite(age) || age < 0 || age > CHECKPOINT_MAX_AGE_MS) return 'stale';
  if (cp.companyKey !== c.companyKey) return 'company changed';
  if (cp.alterVoucher !== c.alterVoucher) return 'tally data changed';
  if (cp.plan !== c.plan || cp.windowFrom !== c.windowFrom || cp.windowTo !== c.windowTo) return 'plan changed';
  if (cp.cursorBefore !== c.cursorBefore) return 'cursor changed';
  if (c.stageRun !== cp.runId) return 'stage does not match';
  if (cp.monthIndex < 0 || cp.monthIndex > cp.windows.length || cp.nextStart < 0) return 'invalid';
  return null;
}
