/*
LazyBooks | src/main/status.ts
Responsibility: Builds the Status object the dashboard shows (pure, no Electron, no I/O except the injected vault count)
Introduced by: Phase 33 (ui-status)
STATUS: IMPLEMENTED (Phase 33)
*/

import type { ActivationState, EntriesDetail, Status, StatusDetail, SyncDetail } from '../shared/ipc';

/** Tables whose row counts are shown (data_model.json names). The renderer maps them to labels. */
export const COUNT_TABLES = ['tm_ledger', 'tm_group', 'tm_stock_item', 'tm_voucher_type', 'tx_voucher'] as const;

export interface StatusDeps {
  activation: () => ActivationState | null;
  bootstrap: () => {
    license: { max_devices: number; max_companies: number };
    features: Record<string, boolean>;
    update: { update_available: boolean; latest: string } | null;
  } | null;
  tally: () => { ok: boolean; version: string | null; company: string | null };
  tallyDetection: () => { state: string; message: string } | null;
  scheduler: () => {
    running: boolean;
    lastSyncAt: string | null;
    lastOutcome: { ok: boolean; skipped?: string } | null;
    failures: number;
    nextRunAt: string | null;
    message: string | null;
  } | null;
  entries: () => (EntriesDetail & { pollFailures: number; message: string | null }) | null;
  /** row count of one vault table; null when no vault is open */
  vaultCount: (table: string) => number | null;
  vaultOpen: () => boolean;
  devicesOnline: () => number;
  deviceRevoked: () => boolean;
  paused: () => boolean;
  crypto: () => 'not-set-up' | 'ready' | 'locked' | null;
  /** milliseconds; test seam */
  now?: () => number;
  /** how long counts are reused (default 5 s) */
  countTtlMs?: number;
}

export interface StatusBuilder {
  /** Builds the full status. Never throws: a failing source is left out and noted as an error line. */
  build(): Status;
  /** Forget the cached counts (call after a sync cycle). */
  invalidateCounts(): void;
}

export function createStatusBuilder(d: StatusDeps): StatusBuilder {
  const now = d.now ?? Date.now;
  const ttl = d.countTtlMs ?? 5000;
  let counts: Record<string, number> = {};
  let countsAt = -Infinity;

  function readCounts(): Record<string, number> {
    if (now() - countsAt < ttl) return counts;
    const next: Record<string, number> = {};
    for (const t of COUNT_TABLES) {
      try {
        const n = d.vaultCount(t);
        if (n !== null) next[t] = n;
      } catch {
        // a table that cannot be counted is simply not shown
      }
    }
    counts = next;
    countsAt = now();
    return counts;
  }

  function safe<T>(fn: () => T, fallback: T): T {
    try {
      return fn();
    } catch {
      return fallback;
    }
  }

  return {
    invalidateCounts() {
      countsAt = -Infinity;
    },
    build(): Status {
      const act = safe(d.activation, null);
      const boot = safe(d.bootstrap, null);
      const tally = safe(d.tally, { ok: false, version: null, company: null });
      const det = safe(d.tallyDetection, null);
      const sch = safe(d.scheduler, null);
      const ent = safe(d.entries, null);
      const vaultOpen = safe(d.vaultOpen, false);
      const revoked = safe(d.deviceRevoked, false);
      const paused = safe(d.paused, false);
      const crypto = safe(d.crypto, null);
      const active = !!act && act.stage === 'active';

      const errors: string[] = [];
      if (act?.blocking) errors.push(act.blocking.message);
      if (revoked) errors.push('This PC was removed by the administrator. Contact support to use it again.');
      if (active && !tally.ok) errors.push(det?.message || 'Tally is not reachable. Open Tally and enable its XML server.');
      if (!vaultOpen) errors.push('The local data store could not be opened. Restart LazyBooks; if it persists, reset the vault in Tools.');
      if (act && !act.secureStorage) errors.push('This PC cannot encrypt saved secrets, so activation is refused.');
      if (active && crypto === 'not-set-up') errors.push('The data passphrase is not set. Devices cannot read your data until you set it.');
      if (active && crypto === 'locked') errors.push('The data passphrase is locked. Enter it again in Settings.');
      if (active && sch && sch.failures > 0 && sch.message) errors.push(sch.message);
      if (ent && ent.failed > 0) errors.push(`${ent.failed} entr${ent.failed === 1 ? 'y' : 'ies'} failed to post to Tally.`);
      if (ent && ent.needsReview > 0) errors.push(`${ent.needsReview} entr${ent.needsReview === 1 ? 'y needs' : 'ies need'} your review.`);
      if (ent && ent.pollFailures > 0 && ent.message) errors.push(ent.message);

      const sync: SyncDetail | undefined = sch
        ? {
            running: sch.running,
            paused,
            failures: sch.failures,
            nextRunAt: sch.nextRunAt,
            message: sch.message,
            lastOutcome: sch.lastOutcome ? (sch.lastOutcome.skipped ? 'skipped' : sch.lastOutcome.ok ? 'ok' : 'failed') : null,
          }
        : undefined;

      const detail: StatusDetail = {
        vaultOpen,
        builtAt: new Date(now()).toISOString(),
        ...(sync ? { sync } : {}),
        ...(ent ? { entries: { waiting: ent.waiting, posted: ent.posted, failed: ent.failed, needsReview: ent.needsReview } } : {}),
        ...(det ? { tally: { state: det.state, message: det.message } } : {}),
        ...(boot ? { flags: { ...boot.features }, limits: { maxDevices: boot.license.max_devices, maxCompanies: boot.license.max_companies } } : {}),
        ...(crypto ? { crypto } : {}),
        deviceRevoked: revoked,
      };

      const status: Status = {
        license: active
          ? { licenseKey: act.licenseKeyMasked ?? '', plan: null, companyName: act.companyName, expiresAt: act.expiresAt }
          : null,
        tally,
        // offline = the registry was unreachable at the last bootstrap and cached data is in use
        internet: act ? !act.offline : true,
        lastSyncAt: sch?.lastSyncAt ?? null,
        counts: vaultOpen ? readCounts() : {},
        pendingEntries: ent?.waiting ?? 0,
        devicesOnline: safe(d.devicesOnline, 0),
        errors,
        detail,
      };
      if (boot?.update) status.update = { available: boot.update.update_available, version: boot.update.latest };
      return status;
    },
  };
}
