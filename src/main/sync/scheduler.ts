/*
LazyBooks | src/main/sync/scheduler.ts
Responsibility: Sync scheduler - when to pull from Tally into the vault (incremental every N minutes, daily deleted check, daily closing, manual, backoff, single-flight)
Introduced by: Phase 18 (sync-scheduler)
STATUS: IMPLEMENTED (Phase 18)
No Electron import: everything it touches is injected (readers, vault, clock, timers, events), so it is testable from Node.
One cycle = read the company record (one cheap Tally call), decide with `assessCompany` what is needed, pull only that, then commit the whole result
to the vault in ONE transaction (one change seq). Cursors move only after that commit. Uploads (postbox) are out of scope.
Phase 45: vouchers are read in batches (`voucherBatchSize` per request). Each batch is staged on disk (`stage.ts`, outside the live tables) and a checkpoint
`sync-run.json` is written after it; the final transaction streams the staged vouchers through the upsert layer in chunks, so memory stays near one batch
and the live vault is untouched until then. A crash resumes from the checkpoint (or restarts); devices never see a half-applied pull.
*/

import type { EventEmitter } from 'node:events';
import type { Vault } from '../db/vault';
import { createUpsertLayer, type UpsertLayer, type VaultOp } from '../db/upsert';
import { dataModel } from '../db/model';
import { getMeta, setMeta } from '../db/seq';
import { logger } from '../logger';
import type { CompanyRecord } from '../tally/company';
import type { Masters } from '../tally/masters';
import type { Vouchers } from '../tally/vouchers';
import type { Reconciler } from '../tally/reconcile';
import { applyRenames, deletedCheckDue, detectRenames, type ChangeOp } from '../tally/reconcile';
import { applyClosing, closingDue, type Closing } from '../tally/closing';
import { assessCompany, checkCount, createTallyHealth, memoryAfterSync, type Assessment, type GuardAction, type SyncMemory, type TallyState } from '../tally/guards';
import { createStore, type Store } from './store';
import { VOUCHER_BATCH } from '../../shared/constants';
import type { SyncProgress, SyncStage } from '../../shared/ipc';
import { companyKeyOf, createStage, deleteCheckpoint, readCheckpoint, resumeBlocker, writeCheckpoint, type RunCheckpoint, type Stage } from './stage';
import { randomUUID } from 'node:crypto';
import { planMasters, planVouchers } from './plan';

export type SyncReason = 'startup' | 'timer' | 'manual' | 'resume' | 'unpaused';
export type SkipReason = 'paused' | 'blocked' | 'no_vault';

export interface SyncOutcome {
  reason: SyncReason;
  ok: boolean;
  skipped?: SkipReason;
  action: GuardAction | null;
  /** counts of what the cycle wrote: rows inserted/updated/deleted in the vault, and seq of the commit (null: nothing changed) */
  written: { inserted: number; updated: number; deleted: number; seq: number | null };
  pulled: { masters: number; vouchers: number };
  deletedVouchers: number;
  closingChanged: number | null;
  ms: number;
  error?: { state: TallyState; message: string; retryable: boolean };
}

export interface SchedulerState {
  running: boolean;
  lastSyncAt: string | null;
  lastOutcome: SyncOutcome | null;
  failures: number;
  tallyState: TallyState;
  nextRunAt: string | null;
  message: string | null;
}

export interface SchedulerConfig {
  intervalMin: number;
  lookbackDays: number;
  paused: boolean;
  /** Vouchers per Tally request; read at the start of every run (Phase 45). Default `VOUCHER_BATCH.sizeDefault`. */
  voucherBatchSize?: number;
}

export interface SchedulerDeps {
  getVault: () => Vault | null;
  getConfig: () => SchedulerConfig;
  /** Non-null while sync must not run (device revoked, license blocked, not activated). The text is logged. */
  blocked: () => string | null;
  /** Read the selected company from Tally (throws a TallyError or Error('No company selected')). */
  readCompany: () => Promise<CompanyRecord>;
  masters: Pick<Masters, 'pull' | 'last'>;
  vouchers: Pick<Vouchers, 'pullBatched'>;
  /** Where the resume checkpoint lives (userData `sync-run.json`). Null or omitted: no checkpoint file, a stopped run restarts. */
  getRunFile?: () => string | null;
  /** Progress hook (counts only, no names). Phase 46 puts a throttling tracker and the IPC push behind it. */
  onProgress?: (p: SyncProgress) => void;
  /** Vouchers per chunk when the staged vouchers are committed (default 500). */
  commitChunk?: number;
  closing: Pick<Closing, 'read'>;
  reconciler: Pick<Reconciler, 'checkDeleted'>;
  /** The lifecycle emitter: 'sync-now', 'pause-changed' (boolean), 'resume'. */
  events?: Pick<EventEmitter, 'on' | 'off'>;
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (h: unknown) => void;
  onState?: (s: SchedulerState) => void;
  /** First run after start (default 5 s). */
  initialDelayMs?: number;
  /** Delay after a resume from sleep or after unpausing (default 10 s / 2 s). */
  resumeDelayMs?: number;
}

export interface Scheduler {
  start(): void;
  stop(): void;
  /** Run one cycle now (manual). Joins a running cycle (single-flight). Manual runs ignore pause and backoff and always run the deleted check. */
  syncNow(): Promise<SyncOutcome>;
  state(): SchedulerState;
  lastSyncAt(): string | null;
}

const MIN_INTERVAL_MS = 60_000;
const emptyWritten = () => ({ inserted: 0, updated: 0, deleted: 0, seq: null as number | null });

const isoToday = (ms: number): string => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const addDays = (iso: string, days: number): string => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

const RENAMEABLE = ['tm_group', 'tm_ledger', 'tm_voucher_type', 'tm_stock_group', 'tm_stock_category', 'tm_unit', 'tm_godown', 'tm_stock_item', 'tm_cost_centre', 'tm_currency', 'tm_employee', 'tm_gst_registration'];
const VOUCHER_TABLES = ['tx_voucher', 'tx_ledger_line', 'tx_inventory_line', 'tx_batch_alloc', 'tx_bill_alloc', 'tx_tax_line'];

class SyncIncomplete extends Error {
  code = 'SYNC_INCOMPLETE';
}

export function createScheduler(deps: SchedulerDeps): Scheduler {
  const now = deps.now ?? (() => Date.now());
  const setT = deps.setTimer ?? ((fn: () => void, ms: number) => setTimeout(fn, ms));
  const clearT = deps.clearTimer ?? ((h: unknown) => clearTimeout(h as ReturnType<typeof setTimeout>));
  const health = createTallyHealth();
  let handle: unknown = null;
  let started = false;
  let inflight: Promise<SyncOutcome> | null = null;
  let followUp = false;
  let nextRunAt: number | null = null;
  let layerFor: Vault | null = null;
  let layer: UpsertLayer | null = null;
  let stageFor: Vault | null = null;
  let stage: Stage | null = null;
  let storeFor: Vault | null = null;
  let store: Store | null = null;
  let lastOutcome: SyncOutcome | null = null;
  let tallyState: TallyState = 'online';
  let message: string | null = null;
  let lastSyncMem: string | null = null;
  const listeners: Array<[string, (...a: never[]) => void]> = [];
  /** Progress identity of the cycle running now (counts only, never names). */
  let curRun: { runId: string; startedAt: string; resumed: boolean; note: string | null } | null = null;
  const progress = (stage: SyncStage, extra: Partial<SyncProgress> = {}): void => {
    if (!deps.onProgress || !curRun) return;
    deps.onProgress({ runId: curRun.runId, stage, startedAt: curRun.startedAt, updatedAt: new Date(now()).toISOString(), ratePerMin: null, etaSeconds: null, resumed: curRun.resumed, message: curRun.note, ...extra });
  };

  const layerOf = (v: Vault): UpsertLayer => {
    if (layerFor !== v || !layer) {
      layer = createUpsertLayer(v.db, dataModel);
      layerFor = v;
    }
    return layer;
  };
  const stageOf = (v: Vault): Stage => {
    if (stageFor !== v || !stage) {
      stage = createStage(v.db);
      stageFor = v;
    }
    return stage;
  };
  const storeOf = (v: Vault): Store => {
    if (storeFor !== v || !store) {
      store = createStore(v.db, dataModel);
      storeFor = v;
    }
    return store;
  };

  const snapshot = (): SchedulerState => ({
    running: inflight !== null,
    lastSyncAt: lastSyncMem ?? readLastSync(),
    lastOutcome,
    failures: health.snapshot().failures,
    tallyState,
    nextRunAt: nextRunAt === null ? null : new Date(nextRunAt).toISOString(),
    message,
  });
  const emit = (): void => deps.onState?.(snapshot());

  function readLastSync(): string | null {
    const v = deps.getVault();
    if (!v) return null;
    try {
      return getMeta(v.db, 'sched.last_sync_at');
    } catch {
      return null;
    }
  }

  const metaNum = (v: Vault, key: string): number | null => {
    const s = getMeta(v.db, key);
    return s === null || s === '' ? null : Number(s);
  };

  function loadMemory(v: Vault): SyncMemory | null {
    const s = getMeta(v.db, 'sched.memory');
    if (!s || s === 'null') return null;
    try {
      return JSON.parse(s) as SyncMemory;
    } catch {
      return null;
    }
  }

  function intervalMs(): number {
    return Math.max(MIN_INTERVAL_MS, Math.floor(deps.getConfig().intervalMin * 60_000));
  }

  function schedule(delayMs: number, why: string): void {
    if (!started) return;
    if (handle !== null) clearT(handle);
    const d = Math.max(0, Math.floor(delayMs));
    nextRunAt = now() + d;
    logger.info('sync', 'sync scheduled', { inMs: d, why });
    handle = setT(() => {
      handle = null;
      nextRunAt = null;
      void run('timer');
    }, d);
    emit();
  }

  function windowOf(c: CompanyRecord): { from: string; to: string } {
    const today = isoToday(now());
    const to = c.ending_at ?? today;
    const from = c.starting_from ?? addDays(to, -365);
    return { from, to: to >= from ? to : from };
  }

  async function cycle(reason: SyncReason): Promise<SyncOutcome> {
    const started0 = now();
    const out: SyncOutcome = { reason, ok: false, action: null, written: emptyWritten(), pulled: { masters: 0, vouchers: 0 }, deletedVouchers: 0, closingChanged: null, ms: 0 };
    const finish = (patch: Partial<SyncOutcome>): SyncOutcome => {
      Object.assign(out, patch);
      out.ms = now() - started0;
      return out;
    };
    const manual = reason === 'manual';
    const cfg = deps.getConfig();
    const block = deps.blocked();
    if (block) {
      logger.info('sync', 'sync skipped', { reason, why: 'blocked', detail: block });
      return finish({ skipped: 'blocked', ok: true });
    }
    if (cfg.paused && !manual) {
      logger.info('sync', 'sync skipped', { reason, why: 'paused' });
      return finish({ skipped: 'paused', ok: true });
    }
    const vault = deps.getVault();
    if (!vault) {
      logger.warn('sync', 'sync skipped: vault is not open', { reason });
      return finish({ skipped: 'no_vault', ok: false });
    }
    const up = layerOf(vault);
    const st = storeOf(vault);
    logger.info('sync', 'sync cycle start', { reason });
    curRun = { runId: randomUUID(), startedAt: new Date(now()).toISOString(), resumed: false, note: null };
    progress('starting');

    // 1. one cheap Tally call decides everything
    const company = await deps.readCompany();
    const cg = company.guid;
    const memory = loadMemory(vault);
    const assess: Assessment = assessCompany(memory, company);
    out.action = assess.action;
    const needMasters = assess.pullMasters || deps.masters.last() === null && assess.pullVouchers !== 'none';
    const win = windowOf(company);

    // 2. pull (nothing is written yet)
    if (needMasters) progress('masters', { masters: { done: 0, total: 1 } });
    let masterOps: VaultOp[] = [];
    let renameOps: VaultOp[] = [];
    if (needMasters) {
      const oldMasters: Record<string, Array<Record<string, unknown>>> = {};
      if (!assess.clearVault && memory) for (const t of RENAMEABLE) oldMasters[t] = vault.readTable(t).filter((r) => r['company_guid'] === cg);
      const m = await deps.masters.pull();
      out.pulled.masters = Object.values(m.counts).reduce((a, b) => a + b, 0);
      const stored = assess.clearVault ? { keyRows: () => [] } : st;
      masterOps = planMasters(dataModel, company as unknown as Record<string, unknown>, cg, m.tables as Record<string, Array<Record<string, unknown>>>, stored);
      const renames = detectRenames(oldMasters as never, m.tables);
      if (renames.length > 0) {
        const storedV: Record<string, Array<Record<string, unknown>>> = {};
        for (const t of VOUCHER_TABLES) storedV[t] = vault.readTable(t).filter((r) => r['company_guid'] === cg);
        const fix = applyRenames(storedV as never, renames);
        renameOps = fix.ops as VaultOp[];
        logger.info('sync', 'masters renamed', { renamed: renames.length, vouchersAffected: fix.affectedVouchers.length });
      }
    }
    let maxVoucherAlter = 0;
    let deleteOps: VaultOp[] = [];
    let checkedDeleted = false;
    let voucherOps: Iterable<VaultOp> = [];
    const runFile = deps.getRunFile?.() ?? null;
    const stg = stageOf(vault);
    if (assess.pullVouchers !== 'none') {
      const cursor = assess.pullVouchers === 'incremental' && !assess.clearVault ? st.maxVoucherAlterId(cg) : 0;
      const incremental = assess.pullVouchers === 'incremental' && cursor > 0;
      const size = cfg.voucherBatchSize ?? VOUCHER_BATCH.sizeDefault; // read now: a change applies to the next run only
      const plan = incremental ? 'incremental' : 'full';
      const alterVoucher = Number((company as unknown as { alter_id_voucher?: number }).alter_id_voucher ?? 0);
      const ckKey = companyKeyOf(cg);
      // resume rules (voucher-batching.md section 6): the checkpoint must still describe this company, window, cursor and Tally state
      let resume: RunCheckpoint | null = null;
      const prior = runFile ? readCheckpoint(runFile) : null;
      if (prior) {
        const why = resumeBlocker(prior, { plan, windowFrom: win.from, windowTo: win.to, cursorBefore: incremental ? cursor : 0, companyKey: ckKey, alterVoucher, now: now(), stageRun: stg.runId() });
        if (why === null) resume = prior;
        else logger.info('sync', 'sync checkpoint discarded', { why });
      }
      if (!resume) {
        if (runFile) deleteCheckpoint(runFile);
        stg.begin(randomUUID());
      }
      const cp: RunCheckpoint = resume ?? {
        runId: stg.runId() as string, startedAt: new Date(now()).toISOString(), plan, windowFrom: win.from, windowTo: win.to, windows: [], monthIndex: 0, nextStart: 0,
        size, total: null, doneCount: 0, cursorBefore: incremental ? cursor : 0, companyKey: ckKey, alterVoucher,
      };
      if (curRun) {
        curRun.resumed = resume !== null;
        if (resume) curRun.note = `Resuming from ${cp.doneCount.toLocaleString('en-US')}`;
      }
      if (resume) logger.info('sync', 'sync resumes from checkpoint', { windowIndex: cp.monthIndex, windows: cp.windows.length, nextStart: cp.nextStart, done: cp.doneCount });
      const save = (): void => {
        if (runFile) writeCheckpoint(runFile, cp);
      };
      const vp = (done: number, index: number, eff: number, wf: string = win.from, wt: string = win.to): Partial<SyncProgress> => ({
        vouchers: { done, total: cp.total, batchIndex: index, batchCount: cp.total === null ? null : Math.max(1, Math.ceil(cp.total / cp.size)), windowFrom: wf, windowTo: wt, batchSize: cp.size, effectiveSize: eff },
      });
      progress('counting');
      let batches = 0;
      const res = await deps.vouchers.pullBatched({
        from: win.from, to: win.to, sinceAlterId: incremental ? cursor : null, lookbackDays: incremental ? cfg.lookbackDays : 0, today: isoToday(now()),
        size: cp.size,
        resume: resume ? { windows: cp.windows, windowIndex: cp.monthIndex, nextStart: cp.nextStart, done: cp.doneCount, total: cp.total } : undefined,
        onStart: ({ windows, total }) => {
          if (!resume) {
            cp.windows = windows;
            cp.total = total;
            save();
          }
          progress('vouchers', vp(cp.doneCount, 0, cp.size));
        },
        onBatch: (tables, info) => {
          stg.put(tables as never); // staged first, checkpoint second: a kill in between re-reads this page and replaces the same vouchers
          cp.monthIndex = info.windowIndex;
          cp.nextStart = info.nextStart;
          cp.doneCount = info.done;
          save();
          batches += 1;
          progress('vouchers', vp(info.done, batches, info.effectiveSize, info.windowFrom, info.windowTo));
        },
        onWindowDone: (info) => {
          cp.monthIndex = info.windowIndex + 1;
          cp.nextStart = 0;
          cp.doneCount = info.done;
          save();
        },
      });
      if (res.pagingIgnored) logger.warn('sync', 'this Tally does not support batching; read month by month');
      const staged = stg.count();
      out.pulled.vouchers = staged;
      const chunk = deps.commitChunk ?? 500;
      voucherOps = (function* (): Generator<VaultOp> {
        for (const t of stg.chunks(chunk)) yield* planVouchers(dataModel, cg, t as Record<string, Array<Record<string, unknown>>>, st);
      })();
      if (!incremental) {
        // a full window pull must equal Tally's own guid list for the window, otherwise the cursor must not advance (guards.checkCount);
        // the same answer yields the vouchers Tally no longer has
        progress('checking-deleted');
        const chk = await deps.reconciler.checkDeleted({ from: win.from, to: win.to, stored: assess.clearVault ? [] : st.vouchers(cg), allowEmpty: true });
        const c = checkCount(chk.tallyCount, staged);
        if (!c.complete) {
          // retrying a resume would only reproduce the same short read: start over next time
          stg.clear();
          if (runFile) deleteCheckpoint(runFile);
          throw new SyncIncomplete(`Tally listed ${chk.tallyCount} vouchers for the window but ${staged} were read`);
        }
        deleteOps = chk.ops as VaultOp[];
        checkedDeleted = true;
        out.deletedVouchers = chk.deleted.length;
      }
    }
    if (!checkedDeleted && vault) {
      const last = metaNum(vault, 'sched.deleted_at');
      if (deletedCheckDue({ lastCheckedAt: last, now: now(), manual })) {
        progress('checking-deleted');
        const chk = await deps.reconciler.checkDeleted({ from: win.from, to: win.to, stored: st.vouchers(cg) });
        deleteOps = (chk.ops as ChangeOp[]) as VaultOp[];
        checkedDeleted = true;
        out.deletedVouchers = chk.deleted.length;
      }
    }

    // 3. commit: one transaction, one seq; the memory is dropped first when the vault is cleared, so a crash in between forces a full resync
    if (assess.clearVault) {
      setMeta(vault.db, 'sched.memory', 'null');
      up.clearVault();
    }
    progress('applying');
    const all = (function* (): Generator<VaultOp> {
      yield* masterOps;
      yield* renameOps;
      yield* voucherOps; // streamed from the stage in chunks: nothing of the whole company is held in memory
      yield* deleteOps;
    })();
    const r = up.applyOps(all);
    if (r.seq !== null || r.inserted + r.updated + r.deleted > 0) out.written = { inserted: r.inserted, updated: r.updated, deleted: r.deleted, seq: r.seq };
    void maxVoucherAlter; // the cursor is the highest stored alter_id, derived from the committed rows
    setMeta(vault.db, 'sched.memory', JSON.stringify(memoryAfterSync(company)));
    if (assess.pullVouchers !== 'none') {
      // the pull is committed: the checkpoint first (a kill after this point must not resume a finished run), then the stage
      if (runFile) deleteCheckpoint(runFile);
      stg.clear();
    }
    if (checkedDeleted) setMeta(vault.db, 'sched.deleted_at', String(now()));

    // 4. closing balances: daily, and after any sync that changed vouchers. A failure here never fails the cycle.
    const changedVouchers = out.written.seq !== null && (out.pulled.vouchers > 0 || out.deletedVouchers > 0);
    if (closingDue({ lastRefreshedAt: metaNum(vault, 'sched.closing_at'), now: now(), syncChangedVouchers: changedVouchers })) {
      progress('closing');
      try {
        const reading = await deps.closing.read();
        const stored = {
          tm_group: vault.readTable('tm_group').filter((r) => r['company_guid'] === cg),
          tm_ledger: vault.readTable('tm_ledger').filter((r) => r['company_guid'] === cg),
          tm_stock_item: vault.readTable('tm_stock_item').filter((r) => r['company_guid'] === cg),
        };
        const applied = applyClosing(stored as never, reading);
        if (applied.ops.length > 0) {
          const r = up.applyOps(applied.ops as VaultOp[]);
          out.written.inserted += r.inserted;
          out.written.updated += r.updated;
          out.written.deleted += r.deleted;
          out.written.seq = r.seq ?? out.written.seq;
        }
        out.closingChanged = applied.ops.reduce((n, o) => n + (Array.isArray(o.payload) ? o.payload.length : 0), 0);
        setMeta(vault.db, 'sched.closing_at', String(now()));
      } catch (e) {
        logger.warn('sync', 'closing refresh failed; will retry next cycle', { message: (e as Error).message });
      }
    }
    const stamp = new Date(now()).toISOString();
    setMeta(vault.db, 'sched.last_sync_at', stamp);
    lastSyncMem = stamp;
    progress('done');
    curRun = null;
    return finish({ ok: true });
  }

  async function run(reason: SyncReason): Promise<SyncOutcome> {
    if (inflight) {
      if (reason === 'manual') followUp = true;
      logger.info('sync', 'sync joined running cycle', { reason });
      return inflight;
    }
    const p = (async (): Promise<SyncOutcome> => {
      let outcome: SyncOutcome;
      let nextDelay = intervalMs();
      let why = 'interval';
      try {
        outcome = await cycle(reason);
        if (outcome.skipped === 'paused' || outcome.skipped === 'blocked' || outcome.skipped === 'no_vault') {
          // idle: look again at the normal cadence (unpause and resume events wake it earlier)
        } else if (outcome.ok) {
          health.ok();
          tallyState = 'online';
          message = null;
        }
      } catch (e) {
        const f = health.record(e);
        const raw = e as Error & { code?: string };
        const state: TallyState = raw.message === 'No company selected' ? 'no_company' : f.state;
        tallyState = state;
        message = raw.message === 'No company selected' ? 'Choose a company in Settings so LazyBooks knows what to sync.' : f.message;
        outcome = {
          reason, ok: false, action: null, written: emptyWritten(), pulled: { masters: 0, vouchers: 0 }, deletedVouchers: 0, closingChanged: null, ms: 0,
          error: { state, message: message ?? f.message, retryable: f.retryable },
        };
        if (f.retryable && f.waitMs > 0) {
          nextDelay = f.waitMs;
          why = 'backoff';
        }
        progress('failed', { message: message ?? f.message });
        curRun = null;
        logger.warn('sync', 'sync cycle failed', { reason, state, retryable: f.retryable, failures: health.snapshot().failures, nextInMs: nextDelay, code: raw.code ?? null });
      }
      lastOutcome = outcome;
      if (outcome.ok && !outcome.skipped) {
        logger.info('sync', 'sync cycle done', {
          reason, action: outcome.action, ms: outcome.ms, mastersPulled: outcome.pulled.masters, vouchersPulled: outcome.pulled.vouchers,
          inserted: outcome.written.inserted, updated: outcome.written.updated, deleted: outcome.written.deleted, seq: outcome.written.seq,
          deletedVouchers: outcome.deletedVouchers, closingChanged: outcome.closingChanged,
        });
      }
      inflight = null;
      schedule(nextDelay, why);
      if (followUp) {
        followUp = false;
        void run('manual');
      }
      return outcome;
    })();
    inflight = p;
    emit();
    return p;
  }

  const onSyncNow = (): void => void run('manual');
  const onPause = (paused: boolean): void => {
    if (!paused && started) {
      logger.info('sync', 'sync unpaused');
      schedule(deps.resumeDelayMs ?? 2000, 'unpaused');
    } else if (paused) logger.info('sync', 'sync paused');
  };
  const onResume = (): void => {
    if (started) schedule(deps.resumeDelayMs ?? 10_000, 'resume');
  };

  return {
    start() {
      if (started) return;
      started = true;
      const sub = (ev: string, fn: (...a: never[]) => void): void => {
        deps.events?.on(ev, fn as never);
        listeners.push([ev, fn]);
      };
      sub('sync-now', onSyncNow);
      sub('pause-changed', onPause as never);
      sub('resume', onResume);
      schedule(deps.initialDelayMs ?? 5000, 'startup');
    },
    stop() {
      started = false;
      if (handle !== null) clearT(handle);
      handle = null;
      nextRunAt = null;
      for (const [ev, fn] of listeners) deps.events?.off(ev, fn as never);
      listeners.length = 0;
    },
    syncNow: () => run('manual'),
    state: snapshot,
    lastSyncAt: () => lastSyncMem ?? readLastSync(),
  };
}
