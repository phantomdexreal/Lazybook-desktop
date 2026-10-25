/*
LazyBooks | src/main/snapshot/retention.ts
Responsibility: Retention + quota
Introduced by: Phase 32 (snapshot-retention)
STATUS: IMPLEMENTED (Phase 32)
*/

/**
 * Which snapshot to build next, and how much storage may be used (SYNC_SPEC section 8, `constants.json` `snapshot`, `limits.plans`).
 * Pure part: `budgetBytes`, `planNext`, `findOrphans`, `rowComplete`. Effectful part: `createSnapshotRetention` (one `runOnce()` =
 * check the flag and the plan, tidy, build through the Phase 31 builder, prune what the new snapshot supersedes).
 *
 * Storage rule, enforced as a hard cap: at rest the stored snapshots never exceed the budget, and a new object is refused BEFORE upload
 * when stored + new would exceed it (the builder's `maxBytes`). That is stricter than the spec's peak rule (2 x full + sum(deltas) <= budget):
 * a rebuild only goes ahead when old full + new full fit together, or after the deltas, which the new full supersedes anyway, were dropped.
 * Order of deletion is always manifest row first, objects second, so a device never sees a row whose objects are gone.
 */
import { SNAPSHOT_DEFAULTS } from '../../shared/constants';
import { logger } from '../logger';
import { objectsComplete, type BuildOptions, type BuildResult, type SnapshotKind, type SnapshotManifestRow, type SnapshotStore } from './build';

/** Plan snapshot size is in MB; 1 MB = 1,000,000 bytes (the smaller reading, so the budget is never over-estimated: `assumed`). */
export const BYTES_PER_MB = 1_000_000;

export type ManifestRow = SnapshotManifestRow & { created_at?: string };

export interface RetentionStore extends SnapshotStore {
  listObjects(prefix: string): Promise<{ path: string; bytes: number }[]>;
  /** Deletes the manifest row identified by (license_key, company_guid, kind, seq). */
  deleteManifest(row: SnapshotManifestRow): Promise<void>;
}

export interface PlanOptions {
  minIntervalMin: number;
  maxAgeDays: number;
  maxDeltas: number;
  ratio: number;
}

export const PLAN_DEFAULTS: PlanOptions = {
  minIntervalMin: SNAPSHOT_DEFAULTS.deltaMinIntervalMin,
  maxAgeDays: SNAPSHOT_DEFAULTS.fullRebuildMaxAgeDays,
  maxDeltas: SNAPSHOT_DEFAULTS.fullRebuildMaxDeltas,
  ratio: SNAPSHOT_DEFAULTS.fullRebuildDeltaRatio,
};

export type PlanReason = 'no_full' | 'full_too_old' | 'too_many_deltas' | 'deltas_too_large' | 'next_delta' | 'too_soon';
export type Plan = { action: 'full' | 'delta'; reason: PlanReason } | { action: 'skip'; reason: 'too_soon' };

/** Budget in bytes from the plan's `snapshot_mb` (0 or missing means no cloud copy) and the headroom ratio. */
export function budgetBytes(snapshotMb: number | null | undefined, headroomRatio: number = SNAPSHOT_DEFAULTS.quotaHeadroomRatio): number {
  if (!snapshotMb || !(snapshotMb > 0)) return 0;
  return Math.floor(snapshotMb * BYTES_PER_MB * headroomRatio);
}

const ms = (iso: string | undefined): number | null => {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
};

export function latestFull(rows: ManifestRow[]): ManifestRow | null {
  return rows.filter((r) => r.kind === 'full').sort((a, b) => Number(b.seq) - Number(a.seq))[0] ?? null;
}

/** The deltas that follow the newest full snapshot (the ones a restore applies). */
export function deltasAfter(rows: ManifestRow[], full: ManifestRow | null): ManifestRow[] {
  return rows.filter((r) => r.kind === 'delta' && (!full || Number(r.seq) > Number(full.seq))).sort((a, b) => Number(a.seq) - Number(b.seq));
}

const sum = (rows: ManifestRow[]): number => rows.reduce((a, r) => a + Number(r.bytes), 0);

/**
 * Rebuild rules of SYNC_SPEC section 8: a new full when there is none, when the full is older than `maxAgeDays`, when the deltas reached
 * `maxDeltas` (so there are never more than that many), or when their bytes exceed `ratio` x the full. Otherwise a delta, but not sooner than
 * `minIntervalMin` after the newest snapshot. Forced rebuilds ignore the interval.
 */
export function planNext(rows: ManifestRow[], nowMs: number, o: PlanOptions = PLAN_DEFAULTS): Plan {
  const full = latestFull(rows);
  if (!full) return { action: 'full', reason: 'no_full' };
  const deltas = deltasAfter(rows, full);
  const fullAt = ms(full.created_at);
  if (fullAt !== null && nowMs - fullAt > o.maxAgeDays * 86_400_000) return { action: 'full', reason: 'full_too_old' };
  if (deltas.length >= o.maxDeltas) return { action: 'full', reason: 'too_many_deltas' };
  if (sum(deltas) > o.ratio * Number(full.bytes)) return { action: 'full', reason: 'deltas_too_large' };
  const newest = rows.reduce<number | null>((m, r) => {
    const t = ms(r.created_at);
    return t !== null && (m === null || t > m) ? t : m;
  }, null);
  if (newest !== null && nowMs - newest < o.minIntervalMin * 60_000) return { action: 'skip', reason: 'too_soon' };
  return { action: 'delta', reason: 'next_delta' };
}

/** A manifest row whose objects are all present (parts 1..N, sizes add up). */
export function rowComplete(row: SnapshotManifestRow, objects: { path: string; bytes: number }[]): boolean {
  return objectsComplete(row.storage_path, Number(row.bytes), objects);
}

/** Objects under the company prefix that no manifest row points to (a failed or interrupted upload). */
export function findOrphans(rows: SnapshotManifestRow[], objects: { path: string; bytes: number }[]): string[] {
  const prefixes = rows.map((r) => r.storage_path);
  return objects.filter((o) => !prefixes.some((p) => o.path.startsWith(p))).map((o) => o.path);
}

// ---------------------------------------------------------------------------------------------------------------------------------

export interface RetentionDeps {
  licenseKey(): string | null;
  companyGuid(): string | null;
  /** Feature flag `cloud_copy`; false = nothing is uploaded and nothing is built. */
  cloudCopyEnabled(): boolean;
  /** Plan limit `snapshot_mb` for this license (0 or null = no cloud copy). */
  snapshotMb(): number | null;
  store: RetentionStore;
  build(kind: SnapshotKind, opts?: BuildOptions): Promise<BuildResult>;
  /** Forget what the last snapshot contained, so the next build is a full one. Called whenever deltas were removed without a verified new full. */
  resetCursor(companyGuid: string): void;
  now?: () => number;
  plan?: Partial<PlanOptions>;
  headroomRatio?: number;
}

export type RunOutcome =
  | { status: 'skipped'; reason: 'flag_off' | 'no_quota' | 'not_ready' | 'too_soon' }
  | { status: 'unchanged' }
  | { status: 'built'; kind: SnapshotKind; reason: PlanReason | 'delta_over_budget' | 'repair'; seq: number; bytes: number; pruned: number; droppedDeltas: boolean }
  | { status: 'over_budget'; need: number; budget: number; droppedDeltas: boolean };

export function createSnapshotRetention(d: RetentionDeps) {
  const now = d.now ?? Date.now;
  const opts: PlanOptions = { ...PLAN_DEFAULTS, ...(d.plan ?? {}) };
  let running: Promise<RunOutcome> | null = null;
  let lastNote = '';

  const note = (key: string, msg: string, data: Record<string, unknown>): void => {
    if (key === lastNote) return;
    lastNote = key;
    logger.info('snapshot', msg, data);
  };

  /** Deletes rows (manifest first) and then every object under their prefixes. */
  async function removeRows(rows: ManifestRow[], objects: { path: string; bytes: number }[]): Promise<void> {
    for (const r of rows) await d.store.deleteManifest(r);
    for (const r of rows) {
      for (const o of objects.filter((x) => x.path.startsWith(r.storage_path))) {
        try {
          await d.store.removeObject(o.path);
        } catch {
          /* an object left behind is an orphan; the next run removes it */
        }
      }
    }
  }

  async function run(): Promise<RunOutcome> {
    if (!d.cloudCopyEnabled()) {
      note('flag_off', 'cloud copy is off, no snapshots are built', {});
      return { status: 'skipped', reason: 'flag_off' };
    }
    const budget = budgetBytes(d.snapshotMb(), d.headroomRatio);
    if (budget <= 0) {
      note('no_quota', 'the plan has no snapshot storage, no snapshots are built', {});
      return { status: 'skipped', reason: 'no_quota' };
    }
    const lic = d.licenseKey();
    const cg = d.companyGuid();
    if (!lic || !cg) return { status: 'skipped', reason: 'not_ready' };
    lastNote = '';

    let rows = await d.store.listManifest(cg);
    let objects = await d.store.listObjects(`${lic}/${cg}/`);

    // Tidy: objects without a manifest row are leftovers of an interrupted upload.
    const orphans = findOrphans(rows, objects);
    for (const p of orphans) {
      try {
        await d.store.removeObject(p);
      } catch {
        /* retried next run */
      }
    }
    if (orphans.length > 0) {
      objects = objects.filter((o) => !orphans.includes(o.path));
      logger.info('snapshot', 'orphan snapshot objects removed', { count: orphans.length });
    }

    // Repair: a row whose objects are missing or short breaks the chain. It is not patched: the delta cursor is reset so the next build is a full one,
    // and the broken rows stay until that full is in (they are pruned with everything older), which also keeps `seq` from ever being reused.
    const broken = rows.filter((r) => !rowComplete(r, objects));
    const repair = broken.length > 0;
    if (repair) {
      logger.warn('snapshot', 'incomplete snapshots found, rebuilding a full snapshot', { count: broken.length });
      d.resetCursor(cg);
    }

    const plan: Plan = repair ? { action: 'full', reason: 'no_full' } : planNext(rows, now(), opts);
    if (plan.action === 'skip') return { status: 'skipped', reason: plan.reason };

    const stored = (): number => sum(rows);
    let kind: SnapshotKind = plan.action;
    let reason: PlanReason | 'delta_over_budget' | 'repair' = repair ? 'repair' : plan.reason;
    let droppedDeltas = false;
    let result: BuildResult | null = null;

    if (kind === 'delta') {
      const room = budget - stored();
      result = room > 0 ? await d.build('delta', { maxBytes: room }) : { ok: false, reason: 'over_quota', kind: 'delta', bytes: 0 };
      if (!result.ok && result.reason === 'unchanged') return { status: 'unchanged' };
      if (!result.ok) {
        kind = 'full';
        reason = 'delta_over_budget';
        result = null;
      }
    }

    if (result === null) {
      // Full rebuild: first try to keep everything until the new full is verified, then (if it does not fit) drop the deltas it supersedes.
      const room = budget - stored();
      if (room > 0) result = await d.build('full', { maxBytes: room });
      if (result === null || (!result.ok && result.reason === 'over_quota')) {
        const deltas = rows.filter((r) => r.kind === 'delta');
        if (deltas.length > 0) {
          await removeRows(deltas, objects);
          d.resetCursor(cg);
          rows = rows.filter((r) => r.kind !== 'delta');
          objects = objects.filter((o) => !deltas.some((r) => o.path.startsWith(r.storage_path)));
          droppedDeltas = true;
        }
        const room2 = budget - stored();
        if (room2 > 0 && droppedDeltas) result = await d.build('full', { maxBytes: room2 });
        if (result === null || (!result.ok && result.reason === 'over_quota')) {
          const need = result && !result.ok && result.reason === 'over_quota' ? result.bytes : 0;
          logger.warn('snapshot', 'snapshot does not fit in the plan storage, keeping what is stored', { need, budget, stored: stored(), droppedDeltas });
          return { status: 'over_budget', need, budget, droppedDeltas };
        }
      }
    }
    if (!result.ok) return { status: 'unchanged' };

    // A full snapshot (also one a delta was upgraded to) supersedes everything older; the builder verified the upload before the manifest row existed.
    let pruned = 0;
    if (result.kind === 'full') {
      const old = rows.filter((r) => Number(r.seq) < result.row.seq);
      await removeRows(old, objects);
      pruned = old.length;
    }
    return { status: 'built', kind: result.kind, reason, seq: result.row.seq, bytes: result.row.bytes, pruned, droppedDeltas };
  }

  return {
    /** One pass: flag and quota gates, tidy, plan, build, prune. Single-flight; errors from the store or the builder propagate (the caller retries on its schedule). */
    runOnce(): Promise<RunOutcome> {
      if (!running) {
        running = run().finally(() => {
          running = null;
        });
      }
      return running;
    },
  };
}

export type SnapshotRetention = ReturnType<typeof createSnapshotRetention>;
