/*
LazyBooks | src/main/updater.ts
Responsibility: Auto-update from GitHub Releases (Phase 39)
No Electron import: the real electron-updater object is injected through `createElectronUpdaterDriver`, everything else is injected too.

Rules (SHARED_CONTRACTS 3.1, GITHUB_RELEASE_FLOW):
* The admin panel decides who gets what: `app_bootstrap().update` already applies the staged rollout bucket
  (`abs(hashtext(device_id)) % 100 < rollout_pct`) and the yank. The connector only acts on `update_available`,
  `must_update` and `min_supported`; it never decides a rollout itself.
* The feed folder is taken from the bootstrap `download_url` (public GitHub release, no token), so a yanked or
  not-yet-published release is never offered.
* The downloaded installer must match the bootstrap `sha256` or it is deleted and never installed.
* A forced update (`must_update`, or the running version below `min_supported`) installs silently once verified.
*/
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { rm } from 'node:fs/promises';

import { UPDATE_CONTROLS } from '../shared/constants';
import type { UpdatePhase, UpdateView } from '../shared/ipc';

export type { UpdatePhase, UpdateView };

export interface UpdateOffer {
  latest: string;
  notes?: string;
  download_url?: string;
  sha256?: string;
  min_supported?: string;
  update_available: boolean;
  must_update: boolean;
}

/** The small surface of electron-updater the logic needs (lets tests use a fake). */
export interface UpdaterDriver {
  setFeed(url: string): void;
  /** Version listed in the feed's latest.yml, or null when the feed has none. */
  check(): Promise<{ version: string } | null>;
  /** Downloads the installer and returns its local path. */
  download(): Promise<string>;
  /** Install when the app quits normally (only switched on after the checksum matched). */
  setInstallOnQuit(on: boolean): void;
  quitAndInstall(silent: boolean): void;
  /** Phase 47: download percent (0 to 100) while `download()` runs. Optional so older fakes keep working. */
  onProgress?(listener: (percent: number) => void): void;
}

export interface UpdaterDeps {
  currentVersion: string;
  getOffer: () => UpdateOffer | null;
  /** Phase 47: the `autoUpdateCheck` setting (default true). */
  getAutoCheck?: () => boolean;
  /** Phase 47: refresh the cached bootstrap before a manual check (the existing bootstrap path, no new endpoint). A failure keeps the cached offer. */
  refreshOffer?: () => Promise<void>;
  /** Phase 47: minimum gap between two checks started by the person (default 30 s). */
  manualGapMs?: number;
  /** null when the app is not packaged (dev run): updating is unsupported there. */
  driver: UpdaterDriver | null;
  sha256File?: (path: string) => Promise<string>;
  removeFile?: (path: string) => Promise<void>;
  log: (level: 'info' | 'warn', message: string, data?: Record<string, unknown>) => void;
  now?: () => number;
  /** Delay before the first check and between checks. */
  firstDelayMs?: number;
  intervalMs?: number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (h: unknown) => void;
  /** After a failed verification the same version is not tried again for this long. */
  retryAfterFailureMs?: number;
}

export interface Updater {
  state(): UpdateView;
  /** Looks at the cached bootstrap and, when an update is offered, downloads and verifies it. Single flight. */
  checkNow(): Promise<UpdateView>;
  /** Phase 47: the person's "Check now": refreshes the bootstrap first, enforces the gap, works with automatic checks off. */
  checkManual(): Promise<UpdateView>;
  /** Phase 47: the setting changed. On starts the timer, off stops it (forced updates are still acted on, see `offerChanged`). */
  setAutoCheck(on: boolean): void;
  /** Phase 47: the cached offer may have changed (after a bootstrap). With automatic checks off only a forced update is acted on. */
  offerChanged(): void;
  /** Installs a verified update now (quits the app). */
  install(): { ok: true } | { ok: false; code: 'NOT_READY'; message: string };
  start(): void;
  stop(): void;
}

const SEMVER = /^\d+\.\d+\.\d+$/;
const SHA256 = /^[0-9a-f]{64}$/i;

export function parseVersion(v: string | undefined | null): [number, number, number] | null {
  const s = (v ?? '').trim().replace(/^v/i, '');
  if (!SEMVER.test(s)) return null;
  const p = s.split('.').map((x) => Number(x));
  return [p[0] ?? 0, p[1] ?? 0, p[2] ?? 0];
}

/** -1, 0, 1; null when either side is not x.y.z. */
export function compareVersions(a: string, b: string): number | null {
  const x = parseVersion(a);
  const y = parseVersion(b);
  if (!x || !y) return null;
  for (let i = 0; i < 3; i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return 0;
}

/**
 * Feed folder for the generic provider: the `download_url` without its file name.
 * Only https on github.com release download paths is accepted (public repo, no token).
 */
export function feedUrlFromDownloadUrl(downloadUrl: string | undefined): string | null {
  if (!downloadUrl) return null;
  let u: URL;
  try {
    u = new URL(downloadUrl);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' || u.hostname !== 'github.com' || u.username || u.password || u.port) return null;
  if (!/^\/[^/]+\/[^/]+\/releases\/download\/[^/]+\/[^/]+$/.test(u.pathname)) return null;
  return `https://github.com${u.pathname.slice(0, u.pathname.lastIndexOf('/'))}`;
}

export function sha256OfFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const h = createHash('sha256');
    const s = createReadStream(path);
    s.on('error', reject);
    s.on('data', (c) => h.update(c));
    s.on('end', () => resolve(h.digest('hex')));
  });
}

/** Wraps the real `autoUpdater` from electron-updater. Call only for a packaged app. */
export interface AutoUpdaterLike {
  autoDownload: boolean;
  autoInstallOnAppQuit: boolean;
  allowDowngrade: boolean;
  allowPrerelease: boolean;
  setFeedURL(o: { provider: 'generic'; url: string }): void;
  checkForUpdates(): Promise<{ updateInfo: { version: string } } | null>;
  downloadUpdate(): Promise<string[]>;
  quitAndInstall(isSilent?: boolean, isForceRunAfter?: boolean): void;
  on(event: 'download-progress', listener: (info: { percent: number }) => void): unknown;
}

export function createElectronUpdaterDriver(au: AutoUpdaterLike): UpdaterDriver {
  au.autoDownload = false;
  au.autoInstallOnAppQuit = false;
  au.allowDowngrade = false;
  au.allowPrerelease = false;
  return {
    setFeed: (url) => au.setFeedURL({ provider: 'generic', url }),
    check: async () => {
      const r = await au.checkForUpdates();
      return r ? { version: r.updateInfo.version } : null;
    },
    download: async () => {
      const files = await au.downloadUpdate();
      const f = files[0];
      if (!f) throw new Error('no installer file was downloaded');
      return f;
    },
    setInstallOnQuit: (on) => {
      au.autoInstallOnAppQuit = on;
    },
    quitAndInstall: (silent) => au.quitAndInstall(silent, true),
    onProgress: (listener) => {
      au.on('download-progress', (info) => listener(info.percent));
    },
  };
}

export function createUpdater(d: UpdaterDeps): Updater {
  const sha = d.sha256File ?? sha256OfFile;
  const rmFile = d.removeFile ?? ((p: string) => rm(p, { force: true }));
  const now = d.now ?? (() => Date.now());
  const setTimer = d.setTimer ?? ((fn: () => void, ms: number) => {
    const h = setTimeout(fn, ms);
    (h as { unref?: () => void }).unref?.();
    return h;
  });
  const clearTimer = d.clearTimer ?? ((h: unknown) => clearTimeout(h as ReturnType<typeof setTimeout>));
  const retryMs = d.retryAfterFailureMs ?? 6 * 60 * 60 * 1000;

  let view: UpdateView = { phase: d.driver ? 'idle' : 'unsupported', version: null, forced: false, notes: null, message: d.driver ? null : 'Updates are not available in a development run.', currentVersion: d.currentVersion, autoCheck: d.getAutoCheck ? d.getAutoCheck() : UPDATE_CONTROLS.autoUpdateCheckDefault, lastCheckedAt: null, progress: null };
  const gapMs = d.manualGapMs ?? UPDATE_CONTROLS.manualUpdateCheckMinGapS * 1000;
  let lastCheckedMs: number | null = null;
  let verified: string | null = null; // version whose installer matched the checksum
  let failed: { version: string; until: number } | null = null;
  let running: Promise<UpdateView> | null = null;
  let timer: unknown = null;
  let stopped = true;

  const set = (v: Partial<UpdateView>): void => {
    view = { ...view, ...v };
    // progress only exists while downloading
    if (v.phase !== undefined) view = { ...view, progress: v.phase === 'downloading' ? (v.progress ?? { percent: 0 }) : null };
  };
  const latestText = (): string => `You have the latest version available to you (${d.currentVersion}).`;
  const idle = (message: string | null = null): UpdateView => {
    if (view.phase !== 'unsupported') set({ phase: 'idle', version: null, forced: false, notes: null, message });
    return view;
  };
  d.driver?.onProgress?.((percent) => {
    if (view.phase !== 'downloading') return;
    const p = Number.isFinite(percent) ? Math.max(0, Math.min(100, Math.round(percent))) : 0;
    view = { ...view, progress: { percent: p } };
  });
  const fail = (version: string, forced: boolean, notes: string | null, message: string, code: string, extra?: Record<string, unknown>): UpdateView => {
    set({ phase: 'error', version, forced, notes, message });
    d.log('warn', 'update failed', { code, version, ...extra });
    return view;
  };

  async function run(forcedOnly = false): Promise<UpdateView> {
    if (!d.driver) return view;
    const o = d.getOffer();
    if (!o) return forcedOnly ? view : idle(latestText());

    const newer = compareVersions(o.latest, d.currentVersion);
    if (newer === null) {
      d.log('warn', 'update offer ignored: not x.y.z', { latest: o.latest });
      return forcedOnly ? view : idle(latestText());
    }
    if (newer <= 0) return forcedOnly ? view : idle(latestText()); // nothing newer than what runs (also covers a stale flag)

    const belowMin = o.min_supported ? (compareVersions(d.currentVersion, o.min_supported) ?? 0) < 0 : false;
    const forced = o.must_update === true || belowMin;
    // Automatic checks off: only a forced update is acted on (the blocking screen needs a way forward).
    if (forcedOnly && !forced) return view;
    // Staged rollout is decided by the server: a device outside its bucket gets update_available=false.
    if (!o.update_available && !forced) return idle('No update available for this device yet.');

    const notes = o.notes ?? null;
    if (verified === o.latest) {
      set({ phase: 'ready', version: o.latest, forced, notes, message: null });
      if (forced) d.driver.quitAndInstall(true);
      return view;
    }
    if (failed && failed.version === o.latest && now() < failed.until) {
      return fail(o.latest, forced, notes, 'The update could not be verified. It will be tried again later.', 'RETRY_LATER');
    }

    const feed = feedUrlFromDownloadUrl(o.download_url);
    if (!feed) return fail(o.latest, forced, notes, 'The update address is not a public GitHub release.', 'BAD_DOWNLOAD_URL');
    if (!o.sha256 || !SHA256.test(o.sha256)) return fail(o.latest, forced, notes, 'The update has no checksum, so it is not installed.', 'NO_CHECKSUM');

    set({ phase: 'downloading', version: o.latest, forced, notes, message: null });
    let file: string | null = null;
    try {
      d.driver.setFeed(feed);
      const info = await d.driver.check();
      if (!info || info.version !== o.latest) {
        return fail(o.latest, forced, notes, 'The published files do not match the announced version.', 'FEED_MISMATCH', { feed: info?.version ?? null });
      }
      file = await d.driver.download();
      const actual = (await sha(file)).toLowerCase();
      if (actual !== o.sha256.toLowerCase()) {
        await rmFile(file).catch(() => undefined);
        failed = { version: o.latest, until: now() + retryMs };
        return fail(o.latest, forced, notes, 'The downloaded update did not match its checksum and was deleted.', 'CHECKSUM_MISMATCH');
      }
    } catch (e) {
      return fail(o.latest, forced, notes, 'The update could not be downloaded. It will be tried again later.', 'DOWNLOAD_FAILED', { err: (e as Error).message });
    }

    verified = o.latest;
    d.driver.setInstallOnQuit(true);
    set({ phase: 'ready', version: o.latest, forced, notes, message: null });
    d.log('info', 'update ready', { version: o.latest, forced });
    if (forced) d.driver.quitAndInstall(true);
    return view;
  }

  const go = (forcedOnly: boolean): Promise<UpdateView> => {
    running ??= run(forcedOnly)
      .then((v) => {
        if (!forcedOnly && d.driver) {
          lastCheckedMs = now();
          set({ lastCheckedAt: new Date(lastCheckedMs).toISOString() });
          return view;
        }
        return v;
      })
      .finally(() => {
        running = null;
      });
    return running;
  };
  const autoOn = (): boolean => view.autoCheck;
  const schedule = (ms: number): void => {
    timer = setTimer(() => {
      if (stopped || !autoOn()) return;
      void self.checkNow().finally(() => {
        if (!stopped && autoOn()) schedule(d.intervalMs ?? 30 * 60 * 1000);
      });
    }, ms);
  };

  const self: Updater = {
    state: () => view,
    checkNow() {
      return go(false);
    },
    async checkManual() {
      if (!d.driver) return view;
      const fresh = (): boolean => lastCheckedMs !== null && now() - lastCheckedMs < gapMs;
      if (fresh()) return view; // inside the gap: show the last result, send nothing
      if (running) {
        await running.catch(() => undefined);
        if (fresh()) return view;
      }
      if (d.refreshOffer) {
        try {
          await d.refreshOffer();
        } catch (e) {
          d.log('warn', 'update check: bootstrap refresh failed, using the last known offer', { err: (e as Error).message });
        }
      }
      return go(false);
    },
    setAutoCheck(on) {
      if (view.autoCheck === on) return;
      set({ autoCheck: on });
      if (stopped) return;
      if (timer !== null) clearTimer(timer);
      timer = null;
      if (on) schedule(d.firstDelayMs ?? 60_000);
    },
    offerChanged() {
      if (stopped || autoOn() || !d.driver) return;
      void go(true);
    },
    install() {
      if (!d.driver || view.phase !== 'ready' || verified === null || verified !== view.version) {
        return { ok: false, code: 'NOT_READY', message: 'No verified update is ready to install.' };
      }
      d.log('info', 'update install requested', { version: verified });
      d.driver.quitAndInstall(false);
      return { ok: true };
    },
    start() {
      if (!stopped) return;
      stopped = false;
      if (d.getAutoCheck) set({ autoCheck: d.getAutoCheck() });
      if (autoOn()) schedule(d.firstDelayMs ?? 60_000);
      else d.log('info', 'automatic update checks are off');
    },
    stop() {
      stopped = true;
      if (timer !== null) clearTimer(timer);
      timer = null;
    },
  };
  return self;
}
