/*
LazyBooks | src/main/index.ts
Responsibility: Main entry
Introduced by: Phase 1 (scaffold) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 1)
*/

import { app, BrowserWindow, dialog, ipcMain, protocol, safeStorage, session, shell } from 'electron';
import { mkdtempSync, readFileSync, rmSync, statfsSync, statSync, writeFileSync } from 'node:fs';
import { writeFile as writeFileAsync } from 'node:fs/promises';
import { hostname, tmpdir } from 'node:os';
import { join } from 'node:path';
import { APP_NAME, CONTRACT_SUPPORTED, DESKTOP_DEFAULTS, ENV_MASTER_ANON_KEY, ENV_MASTER_URL } from '../shared/constants';
import { IPC, type ActivationState, type LogsExportResult, type Status, type ThemePatch } from '../shared/ipc';
import { createActivation, type Activation } from './activation';
import { createDevice, type Device } from './device';
import { getConfig, initConfig, updateConfig } from './config';
import {
  assessDisk,
  assessHealth,
  assessMemory,
  createClockWatch,
  createCrashGuard,
  crashGuardFileName,
  freeBytesOf,
  pushSample,
  type DiskLevel,
  type MemorySample,
} from './hardening';
import { getAutostart, initLifecycle, lifecycle, onShutdown, setAutostart, startedHidden } from './lifecycle';
import { initLogger, logger } from './logger';
import { z } from 'zod';
import { deleteSecret, getSecret, initSecrets, secretsAvailable, setSecret } from './secrets';
import { getThemeState, initThemes, setTheme } from './themes';
import { createTray, refreshTray } from './tray';
import { createTallyClient, type TallyClient } from './tally/client';
import { createCompanyInfo, type CompanyInfo } from './tally/company';
import { createMasters, type Masters } from './tally/masters';
import { createVouchers, type Vouchers } from './tally/vouchers';
import { createReconciler, type Reconciler } from './tally/reconcile';
import { createClosing, type Closing } from './tally/closing';
import { createScheduler, type Scheduler } from './sync/scheduler';
import { createRequestListener, type RequestListener } from './postbox/listener';
import { dataModel, deleteVaultFiles, openVault, type Vault } from './db';
import { setMeta } from './db/seq';
import { createServe, type Serve } from './postbox/serve';
import { createHygiene, type Hygiene } from './postbox/hygiene';
import { createEntryListener, type EntryListener } from './entries/listener';
import { createEntryHandlers } from './entries/idempotency';
import { createAlterHandlers } from './entries/alter';
import { ruleFor as entryRuleFor } from './entries/results';
import { createKeystore, type Keystore } from './crypto/keystore';
import { createTallyDetector, type TallyDetector } from './tally/detect';
import { createStatusBuilder, type StatusBuilder } from './status';
import { createLogReader, maskText } from './logs';
import { createTools } from './tools';
import { autoUpdater } from 'electron-updater';
import { createHostBridge, createPwaHost, isAllowedExternalUrl, isTrustedSender, resolvePwaFile, PWA_ORIGIN, PWA_SCHEME, type PwaHost } from './pwaHost';
import { createElectronUpdaterDriver, createUpdater, type Updater } from './updater';
import { createSettings } from './settings';
import { createDevices } from './devices';

// Stable data directory (%APPDATA%/LazyBooks on Windows) regardless of the package name.
app.setPath('userData', join(app.getPath('appData'), 'LazyBooks'));
// Must equal appId in electron-builder.yml so the installer's shortcuts and the running app share one taskbar identity.
app.setAppUserModelId('com.lazybooks.desktop');
// Phase 40: custom origin for the embedded PWA; must be declared before the app is ready.
protocol.registerSchemesAsPrivileged([{ scheme: PWA_SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }]);

let win: BrowserWindow | null = null;
let quitting = false;
// Phase 39: auto-update (updater.ts); null until the app is ready.
let updater: Updater | null = null;
// Phase 40: optional embedded PWA window (pwaHost.ts), opt-in by the license flag embedded_pwa_desktop.
let pwaHost: PwaHost | null = null;
let activation: Activation | null = null;
let device: Device | null = null;
let devicesOnline = 0;
let tally: TallyDetector | null = null;
let tallyClient: TallyClient | null = null;
let companyInfo: CompanyInfo | null = null;
// Phase 10: pull() is called by the sync scheduler (Phase 18); nothing triggers it yet.
let masters: Masters | null = null;
// Phase 11: pull({from,to,sinceAlterId}) is called by the sync scheduler (Phase 18); nothing triggers it yet.
let vouchers: Vouchers | null = null;
// Phase 12: checkDeleted() is called daily and on demand by the sync scheduler (Phase 18); nothing triggers it yet.
let reconciler: Reconciler | null = null;
// Phase 15: the SQLite vault. Opened (migrated, integrity-checked, backed up) at start; Phase 16 adds the tracked upsert layer, Phase 18 feeds it.
let vault: Vault | null = null;
// Phase 18: the sync scheduler pulls Tally into the vault on a timer (every intervalMin, daily deleted check and closing, Sync now, backoff).
let closing: Closing | null = null;
let scheduler: Scheduler | null = null;

/**
 * Phase 41: the entry handlers only look vouchers up by guid, type, number and remote id, so they get those four columns, not whole rows
 * (200k vouchers as full rows took about 6 s and 850 MB per entry). The slim list is reused until the voucher table changes (count and highest alter id).
 */
const ENTRY_VOUCHER_COLUMNS = ['guid', 'voucher_type_guid', 'number', 'remote_id'];
let voucherKeys: { vault: Vault; stamp: string; rows: Record<string, unknown>[] } | null = null;
function entryTables(v: Vault): Record<string, unknown[]> {
  const t: Record<string, unknown[]> = {};
  for (const n of ['tm_company', 'tm_ledger', 'tm_group', 'tm_stock_item', 'tm_stock_item_gst', 'tm_unit', 'tm_godown', 'tm_voucher_type', 'tm_stock_group']) t[n] = v.readTable(n);
  const stamp = v.stamp('tx_voucher');
  if (!voucherKeys || voucherKeys.vault !== v || voucherKeys.stamp !== stamp) voucherKeys = { vault: v, stamp, rows: v.readColumns('tx_voucher', ENTRY_VOUCHER_COLUMNS) };
  t['tx_voucher'] = voucherKeys.rows;
  return t;
}
// Phase 19: the request listener moves device requests (sync_requests) pending -> processing -> done|failed; ping is answered, the data kinds get handlers in Phases 20 to 22.
let requestListener: RequestListener | null = null;
/** Data passphrase, salt, KCV and the chunk encoder (Phase 21). Phase 22 passes keystore.encoder() to the chunker. */
let keystore: Keystore | null = null;
/** Serves initial and delta requests as encrypted chunks (Phase 22). */
let serve: Serve | null = null;
let hygiene: Hygiene | null = null;
let entryListener: EntryListener | null = null;
/** Builds the dashboard status (Phase 33); null until the app is ready. */
let statusBuilder: StatusBuilder | null = null;

const LicenseKeyInput = z.string().min(1).max(64);
const TallyTargetInput = z.object({
  host: z.string().trim().min(1).max(253).regex(/^[A-Za-z0-9.\-]+$/),
  port: z.number().int().min(1).max(65535),
});
const LogQueryInput = z
  .object({
    level: z.enum(['info', 'warn', 'error']).optional(),
    mod: z.string().max(32).optional(),
    q: z.string().max(200).optional(),
    limit: z.number().int().min(1).max(1000).optional(),
  })
  .strict();
const LoginInput = z.object({ email: z.string().min(1).max(254), password: z.string().min(1).max(256) });

function send(channel: string, payload: unknown): void {
  if (win && !win.isDestroyed()) win.webContents.send(channel, payload);
}

function licenseStatus(a: ActivationState | null): Status['license'] {
  if (!a || a.stage !== 'active') return null;
  return { licenseKey: a.licenseKeyMasked ?? '', plan: null, companyName: a.companyName, expiresAt: a.expiresAt };
}

function currentStatus(): Status {
  if (statusBuilder) return statusBuilder.build();
  const a = activation?.state() ?? null;
  const base = emptyStatus();
  const boot = activation?.getBootstrap() ?? null;
  return {
    ...base,
    license: licenseStatus(a),
    devicesOnline,
    lastSyncAt: scheduler?.lastSyncAt() ?? null,
    tally: tally?.status() ?? base.tally,
    internet: a ? !a.offline : true,
    errors: a?.blocking ? [a.blocking.message] : [],
    update: boot?.update ? { available: boot.update.update_available, version: boot.update.latest } : undefined,
  };
}

function emptyStatus(): Status {
  return {
    license: null,
    tally: { ok: false, version: null, company: null },
    internet: true,
    lastSyncAt: null,
    counts: {},
    pendingEntries: 0,
    devicesOnline: 0,
    errors: [],
  };
}

function showWindow(): void {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
}

function createWindow(): void {
  win = new BrowserWindow({
    width: 1024,
    height: 700,
    minWidth: 800,
    minHeight: 560,
    show: false,
    title: APP_NAME,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.once('ready-to-show', () => {
    if (!startedHidden()) win?.show();
  });
  // Closing the status window keeps the connector running in the tray.
  win.on('close', (e) => {
    if (!quitting) {
      e.preventDefault();
      win?.hide();
    }
  });
  if (process.env['ELECTRON_RENDERER_URL']) {
    void win.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    void win.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', showWindow);
  app.on('before-quit', () => {
    quitting = true;
    updater?.stop();
    try {
      vault?.close();
    } catch (e) {
      logger.warn('vault', 'vault close failed', { message: (e as Error).message });
    }
    vault = null;
  });
  initLogger({
    dir: join(app.getPath('userData'), 'logs'),
    maxBytes: DESKTOP_DEFAULTS.logRotateMb * 1024 * 1024,
    keepFiles: DESKTOP_DEFAULTS.logKeepFiles,
  });
  logger.info('app', 'starting', { version: app.getVersion(), hidden: startedHidden(), mock: process.env['LB_MOCK_TALLY'] === 'true' });
  initConfig(app.getPath('userData'));
  initLifecycle();
  // Phase 41: remember every start; three unclean starts in ten minutes mean a crash loop, so background work stays off (safe mode).
  const crashGuard = createCrashGuard({ file: join(app.getPath('userData'), crashGuardFileName) });
  const startVerdict = crashGuard.begin();
  const startedAt = Date.now();
  let diskLevel: DiskLevel = 'ok';
  let syncRunningSince: number | null = null;
  if (startVerdict.recentCrashes > 0) logger.warn('app', 'previous start did not shut down cleanly', { recentCrashes: startVerdict.recentCrashes, loop: startVerdict.loop, delayMs: startVerdict.delayMs });
  if (startVerdict.loop) logger.error('app', 'crash loop detected, starting in safe mode (sync, entries, serving and updates stay off)');
  onShutdown('crash-guard', () => crashGuard.markClean()); // hooks run in reverse, so this one runs last
  // Tray app: do not quit when the last window is hidden/closed.
  app.on('window-all-closed', () => undefined);

  void app.whenReady().then(() => {
    try {
      vault = openVault({ dir: join(app.getPath('userData'), 'vault') });
    } catch (e) {
      // The app stays usable (status, settings); the sync scheduler (Phase 18) will refuse to run without a vault.
      logger.error('vault', 'vault could not be opened', { message: (e as Error).message });
    }
    // safeStorage needs app ready. On Linux the 'basic_text' backend is not real encryption: treat as unavailable.
    initSecrets(app.getPath('userData'), {
      isAvailable: () =>
        safeStorage.isEncryptionAvailable() &&
        !(process.platform === 'linux' && safeStorage.getSelectedStorageBackend() === 'basic_text'),
      encrypt: (plain) => safeStorage.encryptString(plain),
      decrypt: (blob) => safeStorage.decryptString(blob),
    });
    initThemes(app.getPath('userData'));
    keystore = createKeystore({
      dir: app.getPath('userData'),
      passphrase: {
        get: () => (secretsAvailable() ? getSecret('passphrase') : null),
        set: (v) => setSecret('passphrase', v),
        clear: () => deleteSecret('passphrase'),
      },
      licenseKey: () => (secretsAvailable() ? getSecret('licenseKey') : null),
    });
    void keystore.unlock();
    // Master registry address: public values supplied via env (dev mock) or build define; empty means activation is unavailable.
    const masterUrl = process.env[ENV_MASTER_URL] || (typeof __LB_MASTER_URL__ === 'string' ? __LB_MASTER_URL__ : '');
    const masterKey = process.env[ENV_MASTER_ANON_KEY] || (typeof __LB_MASTER_ANON_KEY__ === 'string' ? __LB_MASTER_ANON_KEY__ : '');
    activation = createActivation({
      userDataDir: app.getPath('userData'),
      master: masterUrl && masterKey ? { url: masterUrl, anonKey: masterKey } : null,
      appVersion: app.getVersion(),
      platform: process.platform,
      secrets: { available: secretsAvailable, get: getSecret, set: setSecret, delete: deleteSecret },
      config: { get: getConfig, update: updateConfig },
      emit: (state) => {
        send(IPC.activationEvent, state);
        send(IPC.statusEvent, currentStatus());
        device?.onActivation(state);
        requestListener?.nudge();
        entryListener?.nudge();
      },
    });
    activation.init();
    const act = activation;
    device = createDevice({
      activation: act,
      deviceId: () => getConfig().deviceId,
      licenseKey: () => getSecret('licenseKey'),
      deviceName: hostname(),
      appVersion: app.getVersion(),
      platform: process.platform,
      getLastSyncAt: () => scheduler?.lastSyncAt() ?? null,
      getTally: () => currentStatus().tally, // Phase 7+ supplies the real value
      onChange: (p) => {
        if (p.devicesOnline !== undefined) devicesOnline = p.devicesOnline;
        send(IPC.statusEvent, currentStatus());
      },
    });
    tallyClient = createTallyClient({
      getTarget: () => getConfig().tally,
      getCompanyName: () => tally?.last()?.selected?.name ?? null,
    });
    tally = createTallyDetector({
      getTarget: () => getConfig().tally,
      post: tallyClient.queuedPost,
      getCompanyGuid: () => getConfig().companyGuid,
      setCompanyGuid: (guid) => void updateConfig({ companyGuid: guid }),
      onChange: (d) => {
        send(IPC.statusEvent, currentStatus());
        // a usable company: refresh the company record (GUID, FY dates, GSTIN, serial); failures are logged by the client
        if (d.ok) void companyInfo?.read().catch(() => undefined);
      },
    });
    companyInfo = createCompanyInfo({
      client: tallyClient,
      getCompanyName: () => tally?.last()?.selected?.name ?? null,
      getCompanyGuid: () => getConfig().companyGuid,
      cacheFile: join(app.getPath('userData'), 'company.json'),
    });
    masters = createMasters({
      client: tallyClient,
      getCompanyName: () => tally?.last()?.selected?.name ?? null,
      getCompanyGuid: () => companyInfo?.last()?.guid ?? null,
    });
    void masters;
    vouchers = createVouchers({
      client: tallyClient,
      getCompanyName: () => tally?.last()?.selected?.name ?? null,
      getCompanyGuid: () => companyInfo?.last()?.guid ?? null,
      getCompanyState: () => companyInfo?.last()?.state_name ?? '',
      getMasters: () => masters?.last()?.tables ?? null,
    });
    void vouchers;
    reconciler = createReconciler({
      client: tallyClient,
      getCompanyName: () => tally?.last()?.selected?.name ?? null,
      getCompanyGuid: () => companyInfo?.last()?.guid ?? null,
    });
    void reconciler;
    closing = createClosing({
      client: tallyClient,
      getCompanyName: () => tally?.last()?.selected?.name ?? null,
    });
    scheduler = createScheduler({
      getVault: () => vault,
      getConfig: () => {
        const c = getConfig();
        return { intervalMin: c.intervalMin, lookbackDays: c.lookbackDays, paused: c.paused };
      },
      blocked: () => {
        if (diskLevel === 'critical') return 'low disk space';
        if (device?.isRevoked()) return 'device revoked';
        const a = activation?.state();
        if (!a || a.stage !== 'active') return 'not activated';
        return a.blocking ? 'blocked: ' + a.blocking.code : null;
      },
      readCompany: () => {
        if (!companyInfo) throw new Error('No company selected');
        return companyInfo.read();
      },
      masters,
      vouchers,
      closing,
      reconciler,
      events: lifecycle,
      onState: (st) => {
        if (st.running && syncRunningSince === null) syncRunningSince = Date.now();
        else if (!st.running) syncRunningSince = null;
        statusBuilder?.invalidateCounts();
        send(IPC.statusEvent, currentStatus());
      },
    });
    hygiene = createHygiene({ activation: act, licenseKey: () => (secretsAvailable() ? getSecret('licenseKey') : null) });
    serve = createServe({
      hygiene,
      getVault: () => vault,
      model: dataModel,
      licenseKey: () => (secretsAvailable() ? getSecret('licenseKey') : null),
      companyGuid: () => getConfig().companyGuid,
      activation: act,
      encoder: () => {
        if (!keystore) throw new Error('keystore missing');
        return keystore.encoder();
      },
      refresh: () => scheduler?.syncNow() ?? Promise.resolve(),
    });
    requestListener = createRequestListener({
      activation: act,
      licenseKey: () => getSecret('licenseKey'),
      blocked: () => {
        if (device?.isRevoked()) return 'device revoked';
        const a = activation?.state();
        if (!a || a.stage !== 'active') return 'not activated';
        return a.blocking ? 'blocked: ' + a.blocking.code : null;
      },
      handlers: serve.handlers, // Phase 31 adds snapshot_refresh
    });
    entryListener = createEntryListener({
      activation: act,
      licenseKey: () => getSecret('licenseKey'),
      blocked: () => {
        if (device?.isRevoked()) return 'device revoked';
        const a = activation?.state();
        if (!a || a.stage !== 'active') return 'not activated';
        return a.blocking ? 'blocked: ' + a.blocking.code : null;
      },
      companyGuid: () => getConfig().companyGuid,
      outboxFile: join(app.getPath('userData'), 'entry-outbox.json'),
      onChange: () => send(IPC.statusEvent, currentStatus()),
      mapDetail: entryRuleFor, // Phase 28: the full detail table of entry_rules.json (status, LB_* code, retryable)
      // Phase 27: voucher + master handlers (build, Tally pre-check by REMOTEID, post, read-back); alter/cancel/delete arrive in Phase 30.
      handlers: {
        ...createEntryHandlers({
        client: {
          collection: (n, f, o) => (tallyClient as TallyClient).collection(n, f, o),
          importData: (x, o) => (tallyClient as TallyClient).importData(x, o),
        },
        tables: () => {
          return vault ? (entryTables(vault) as never) : null;
        },
      }),
        // Phase 29 + 30: alter (replace and the e-invoice / e-way actions), cancel and delete.
        ...createAlterHandlers({
          client: {
            collection: (n, f, o) => (tallyClient as TallyClient).collection(n, f, o),
            importData: (x, o) => (tallyClient as TallyClient).importData(x, o),
          },
          tables: () => {
            return vault ? (entryTables(vault) as never) : null;
          },
          onChanged: () => scheduler?.syncNow(),
        }),
      },
    });
    // Phase 33: one place builds the dashboard status from the live modules (pure builder, see status.ts).
    statusBuilder = createStatusBuilder({
      activation: () => activation?.state() ?? null,
      bootstrap: () => activation?.getBootstrap() ?? null,
      tally: () => tally?.status() ?? { ok: false, version: null, company: null },
      tallyDetection: () => {
        const l = tally?.last();
        return l ? { state: l.state, message: l.message } : null;
      },
      scheduler: () => scheduler?.state() ?? null,
      entries: () => entryListener?.state() ?? null,
      vaultCount: (t) => (vault ? vault.count(t) : null),
      vaultOpen: () => vault !== null,
      devicesOnline: () => devicesOnline,
      deviceRevoked: () => device?.isRevoked() ?? false,
      paused: () => getConfig().paused,
      crypto: () => keystore?.status().state ?? null,
    });
    ipcMain.handle(IPC.cryptoGet, () => keystore?.status());
    ipcMain.handle(IPC.cryptoSetup, (_e, v: unknown) =>
      typeof v === 'string' && keystore ? keystore.setup(v) : { ok: false, code: 'BAD_PASSPHRASE', message: 'Enter a passphrase.' },
    );
    ipcMain.handle(IPC.pairingGet, () => keystore?.pairing() ?? null);
    ipcMain.handle(IPC.tallyGet, () => tally?.last() ?? null);
    ipcMain.handle(IPC.tallyDetect, () => tally?.detect());
    ipcMain.handle(IPC.tallySet, (_e, v: unknown) => {
      const p = TallyTargetInput.safeParse(v);
      if (p.success) updateConfig({ tally: p.data });
      return tally?.detect();
    });
    ipcMain.handle(IPC.tallySelectCompany, (_e, key: unknown) =>
      typeof key === 'string' && key.length > 0 && key.length < 300 ? tally?.selectCompany(key) ?? null : tally?.last() ?? null,
    );
    ipcMain.handle(IPC.activationGet, () => activation?.state());
    ipcMain.handle(IPC.activationResolve, (_e, key: unknown) => {
      const p = LicenseKeyInput.safeParse(key);
      return p.success ? activation?.resolve(p.data) : { ok: false, code: 'BAD_RESPONSE', message: 'Enter the license key.' };
    });
    ipcMain.handle(IPC.activationLogin, (_e, v: unknown) => {
      const p = LoginInput.safeParse(v);
      return p.success ? activation?.login(p.data.email, p.data.password) : { ok: false, code: 'LB_AUTH_FAILED', message: 'Enter the connector email and password.' };
    });
    ipcMain.handle(IPC.activationDeactivate, () => activation?.deactivate());
    ipcMain.handle(IPC.themeGet, () => getThemeState());
    ipcMain.handle(IPC.themeSet, (_e, patch: unknown) => setTheme(patch as ThemePatch));
    ipcMain.handle(IPC.statusGet, (): Status => currentStatus());
    // Phase 35: settings are validated all-or-nothing in settings.ts; the OS login item is the truth for autostart.
    const settings = createSettings({
      config: () => getConfig(),
      updateConfig: (p) => void updateConfig(p),
      getAutostart,
      setAutostart,
      cloudCopyAllowed: () => activation?.getBootstrap()?.features['cloud_copy'] === true,
      company: () => {
        const s = tally?.last()?.selected;
        return s ? { name: s.name, guid: s.guid } : null;
      },
      fy: () => {
        const c = companyInfo?.last();
        return c ? { from: c.starting_from, to: c.ending_at } : null;
      },
      onTallyTargetChanged: () => void tally?.detect(),
      onSyncSettingsChanged: () => send(IPC.statusEvent, currentStatus()),
      log: (msg, data) => logger.info('ui', msg, data),
    });
    // Phase 36: devices list, revoke and force resync (devices.ts); the vault cursor is forgotten so the next sync is a full one.
    const devices = createDevices({
      activation: { getAccessToken: () => activation!.getAccessToken(), targetClient: () => activation?.targetClient() ?? null },
      licenseKey: () => (secretsAvailable() ? getSecret('licenseKey') : null),
      thisDeviceId: () => getConfig().deviceId,
      maxDevices: () => currentStatus().detail?.limits?.maxDevices ?? null,
      dropCursor: (id) => {
        if (!vault) throw new Error('Vault is not open');
        vault.dropDevice(id);
      },
      onChanged: () => send(IPC.statusEvent, currentStatus()),
      log: (msg, data) => logger.info('ui', msg, data),
    });
    ipcMain.handle(IPC.devicesList, () => devices.list());
    ipcMain.handle(IPC.devicesRevoke, (_e, id: unknown) => devices.revoke(id));
    ipcMain.handle(IPC.devicesResync, (_e, id: unknown) => devices.resync(id));
    ipcMain.handle(IPC.settingsGet, () => settings.get());
    ipcMain.handle(IPC.settingsSet, (_e, patch: unknown) => settings.set(patch));
    // Phase 34: the log viewer reads the rotating files (redacted again in main) and exports them to a file the person picks.
    const logReader = createLogReader(join(app.getPath('userData'), 'logs'));
    ipcMain.handle(IPC.logsTail, (_e, v: unknown) => {
      const p = LogQueryInput.safeParse(v ?? {});
      return logReader.tail(p.success ? p.data : {});
    });
    ipcMain.handle(IPC.logsExport, async (): Promise<LogsExportResult> => {
      try {
        const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
        const opts = {
          title: 'Export LazyBooks log',
          defaultPath: join(app.getPath('downloads'), `lazybooks-log-${stamp}.txt`),
          filters: [{ name: 'Text', extensions: ['txt'] }],
        };
        const r = win && !win.isDestroyed() ? await dialog.showSaveDialog(win, opts) : await dialog.showSaveDialog(opts);
        if (r.canceled || !r.filePath) return { ok: false, canceled: true, message: 'Export canceled.' };
        const w = logReader.exportTo(r.filePath);
        logger.info('ui', 'log exported', { lines: w.lines });
        return { ok: true, path: w.path, lines: w.lines };
      } catch (e) {
        logger.warn('ui', 'log export failed', { message: (e as Error).message });
        return { ok: false, canceled: false, message: 'The log could not be saved. Choose another folder and try again.' };
      }
    });
    // Phase 37: maintenance tools (tools.ts). The renderer sends no paths; the zip location comes from the native save dialog.
    const vaultDir = join(app.getPath('userData'), 'vault');
    const tools = createTools({
      getVault: () => vault,
      setVault: (v) => {
        vault = v;
        send(IPC.statusEvent, currentStatus());
      },
      openVault: () => openVault({ dir: vaultDir }),
      deleteVaultFiles: () => deleteVaultFiles(vaultDir, { backups: true }),
      forgetSyncMemory: (v) => setMeta(v.db as Vault['db'], 'sched.memory', 'null'),
      syncNow: () => scheduler?.syncNow() ?? Promise.resolve(),
      syncRunning: () => scheduler?.state().running ?? false,
      dataFolder: () => app.getPath('userData'),
      openPath: (p) => shell.openPath(p),
      chooseZipPath: async (name) => {
        const opts = { title: 'Export LazyBooks diagnostics', defaultPath: join(app.getPath('downloads'), name), filters: [{ name: 'Zip', extensions: ['zip'] }] };
        const r = win && !win.isDestroyed() ? await dialog.showSaveDialog(win, opts) : await dialog.showSaveDialog(opts);
        return r.canceled || !r.filePath ? null : r.filePath;
      },
      writeFile: (p, data) => writeFileSync(p, data),
      logsText: () => {
        const dir = mkdtempSync(join(tmpdir(), 'lb-diag-'));
        try {
          const f = join(dir, 'logs.txt');
          logReader.exportTo(f);
          return readFileSync(f, 'utf8');
        } finally {
          rmSync(dir, { recursive: true, force: true });
        }
      },
      summary: () => {
        const s = currentStatus();
        const c = getConfig();
        return {
          app: { name: APP_NAME, version: app.getVersion(), electron: process.versions.electron, node: process.versions.node, platform: process.platform, arch: process.arch },
          status: { tallyOk: s.tally.ok, tallyVersion: s.tally.version, internet: s.internet, lastSyncAt: s.lastSyncAt, counts: s.counts, pendingEntries: s.pendingEntries, devicesOnline: s.devicesOnline, errors: s.errors, detail: s.detail },
          settings: { intervalMin: c.intervalMin, lookbackDays: c.lookbackDays, paused: c.paused, tallyHost: c.tally.host, tallyPort: c.tally.port, autostart: c.autostart, cloudCopy: c.cloudCopy, language: c.language, theme: c.theme },
          vault: vault ? { origin: vault.info.origin, migration: vault.info.migration, schemaStale: vault.info.schemaStale } : null,
        };
      },
      mask: maskText,
      log: (msg, data) => logger.info('ui', msg, data),
    });
    ipcMain.handle(IPC.toolsResync, () => tools.fullResync());
    ipcMain.handle(IPC.toolsReset, (_e, v: unknown) => tools.resetVault(v));
    ipcMain.handle(IPC.toolsDiagnostics, () => tools.exportDiagnostics());
    ipcMain.handle(IPC.toolsOpenFolder, () => tools.openDataFolder());
    // Phase 39: auto-update from the public releases repo. Only a packaged app can update itself.
    const realDriver = app.isPackaged ? createElectronUpdaterDriver(autoUpdater) : null;
    updater = createUpdater({
      currentVersion: app.getVersion(),
      getOffer: () => activation?.getBootstrap()?.update ?? null,
      driver: realDriver
        ? {
            ...realDriver,
            // The window close handler keeps the app in the tray unless quitting is set; the installer needs a real quit.
            quitAndInstall: (silent) => {
              quitting = true;
              realDriver.quitAndInstall(silent);
            },
          }
        : null,
      log: (level, msg, data) => (level === 'warn' ? logger.warn('app', msg, data) : logger.info('app', msg, data)),
    });
    ipcMain.handle(IPC.updateState, () => updater?.state());
    ipcMain.handle(IPC.updateCheck, () => updater?.checkNow());
    // Phase 40: embedded PWA. The window shows the PWA export from resources/pwa through a read-only custom protocol and gets only window.LazyHost.
    const pwaDir = app.isPackaged ? join(process.resourcesPath, 'pwa') : join(app.getAppPath(), 'resources', 'pwa');
    const pwaSession = session.fromPartition('persist:lb-pwa');
    pwaSession.protocol.handle(PWA_SCHEME, (req) => {
      const u = new URL(req.url);
      const hit = req.method === 'GET' && u.hostname === 'app' ? resolvePwaFile(pwaDir, u.pathname) : null;
      if (!hit) return new Response('Not found', { status: 404 });
      return new Response(readFileSync(hit.file), { headers: { 'content-type': hit.mime, 'x-content-type-options': 'nosniff' } });
    });
    pwaSession.setPermissionRequestHandler((_wc, _permission, cb) => cb(false));
    const hostBridge = createHostBridge({
      nativeVersion: app.getVersion(),
      pwaDir,
      contract: CONTRACT_SUPPORTED,
      chooseSavePath: async (name) => {
        const r = await dialog.showSaveDialog({ defaultPath: name });
        return r.canceled || !r.filePath ? null : r.filePath;
      },
      writeFile: (p, data) => writeFileAsync(p, data),
      openExternal: (u) => shell.openExternal(u),
      openDataFolder: async () => ({ ok: (await tools.openDataFolder()).ok }),
      checkForUpdate: async () => (await updater?.checkNow()) ?? { phase: 'unsupported' },
      getPassphrase: () => (secretsAvailable() ? getSecret('passphrase') : null),
      log: (msg, data) => logger.info('app', msg, data),
    });
    pwaHost = createPwaHost({
      pwaDir,
      enabled: () => activation?.getBootstrap()?.features['embedded_pwa_desktop'] === true,
      openWindow: (url, onClosed) => {
        const w = new BrowserWindow({
          width: 1280,
          height: 800,
          minWidth: 900,
          minHeight: 600,
          title: APP_NAME,
          autoHideMenuBar: true,
          webPreferences: { preload: join(__dirname, '../preload/host.js'), contextIsolation: true, nodeIntegration: false, sandbox: true, partition: 'persist:lb-pwa' },
        });
        const external = (target: string): void => {
          if (isAllowedExternalUrl(target)) void shell.openExternal(target);
        };
        w.webContents.setWindowOpenHandler(({ url: target }) => {
          external(target);
          return { action: 'deny' };
        });
        w.webContents.on('will-navigate', (e, target) => {
          if (target !== PWA_ORIGIN && !target.startsWith(PWA_ORIGIN + '/')) {
            e.preventDefault();
            external(target);
          }
        });
        w.on('closed', onClosed);
        void w.loadURL(url);
        return { id: w.webContents.id, isDestroyed: () => w.isDestroyed(), focus: () => w.focus(), close: () => w.close() };
      },
      log: (msg, data) => logger.info('app', msg, data),
    });
    ipcMain.handle(IPC.hostCall, (e, method: unknown, args: unknown) =>
      isTrustedSender(e.senderFrame?.url, e.sender.id, pwaHost?.windowId() ?? null) && typeof method === 'string'
        ? hostBridge.call(method, args)
        : { ok: false, reason: 'forbidden' },
    );
    ipcMain.handle(IPC.pwaOpen, () => pwaHost?.open() ?? { ok: false, code: 'FAILED', message: 'Not ready yet.' });
    ipcMain.handle(IPC.updateInstall, () => updater?.install() ?? { ok: false, message: 'Updates are not available yet.' });
    tally?.start();
    createWindow();
    createTray(showWindow, {
      pwa: { available: () => activation?.getBootstrap()?.features['embedded_pwa_desktop'] === true, open: () => void pwaHost?.open() },
      badge: () => currentStatus().pendingEntries,
    });
    const trayTimer = setInterval(refreshTray, 60_000); // flags and the waiting count change without a tray event
    trayTimer.unref();
    onShutdown('tray-refresh', () => clearInterval(trayTimer));
    activation?.start();
    device?.start();
    // Phase 41: after a crash the background work starts later (growing delay); in a crash loop it does not start at all.
    const startBackground = () => {
      scheduler?.start();
      updater?.start();
      requestListener?.start();
      entryListener?.start();
      serve?.start();
    };
    if (!startVerdict.loop) {
      if (startVerdict.delayMs > 0) {
        const t = setTimeout(startBackground, startVerdict.delayMs);
        t.unref();
        onShutdown('background-start', () => clearTimeout(t));
      } else startBackground();
    }
    onShutdown('entry-listener', () => entryListener?.stop());
    hygiene?.start();
    onShutdown('hygiene', () => hygiene?.stop());
    onShutdown('serve', () => serve?.stop());
    onShutdown('request-listener', () => requestListener?.stop());
    onShutdown('scheduler', () => scheduler?.stop());
    onShutdown('activation', () => activation?.stop());
    onShutdown('device', () => device?.stop());
    onShutdown('tally', () => tally?.stop());

    // Phase 41: hourly health check (disk, memory, stuck or stalled sync), a minute clock watch, and forgiveness of old crashes after 10 healthy minutes.
    let memorySamples: MemorySample[] = [];
    const healthVaultDir = join(app.getPath('userData'), 'vault');
    const runHealth = () => {
      try {
        const free = freeBytesOf(healthVaultDir, (d) => statfsSync(d));
        let vaultBytes = 0;
        try {
          vaultBytes = statSync(join(healthVaultDir, 'vault.sqlite')).size;
        } catch {
          // no vault file yet
        }
        const disk = free === null ? null : assessDisk(free, vaultBytes);
        if (disk && disk.level !== diskLevel) logger.warn('app', 'disk level changed', { from: diskLevel, to: disk.level, freeMb: Math.floor(disk.freeBytes / 1048576) });
        diskLevel = disk?.level ?? 'ok';
        memorySamples = pushSample(memorySamples, { rss: process.memoryUsage().rss, at: Date.now() });
        const mem = assessMemory(memorySamples);
        const sch = scheduler?.state() ?? null;
        const report = assessHealth({
          now: Date.now(),
          paused: getConfig().paused,
          blocked: !!sch && sch.lastOutcome?.skipped === 'blocked',
          vaultOpen: !!vault,
          intervalMin: getConfig().intervalMin,
          syncRunning: sch?.running ?? false,
          syncStartedAt: syncRunningSince,
          lastSyncAt: sch?.lastSyncAt ? Date.parse(sch.lastSyncAt) : null,
          startedAt,
          tallyOnline: tally?.last()?.ok === true,
          disk: diskLevel,
          memory: mem.level,
          entryPollFailures: entryListener?.state()?.pollFailures ?? 0,
        });
        logger.info('app', 'health check', { ok: report.ok, actions: report.actions, rssMb: mem.rssMb, growthMbPerHour: mem.growthMbPerHour, disk: diskLevel });
        for (const a of report.actions) {
          if (a === 'restart_scheduler' && scheduler && !startVerdict.loop) {
            logger.warn('app', 'restarting the sync scheduler', { notes: report.notes });
            scheduler.stop();
            syncRunningSince = null;
            scheduler.start();
          } else if (a === 'restart_app') {
            logger.warn('app', 'restarting the app because of memory', { rssMb: mem.rssMb });
            app.relaunch({ args: process.argv.slice(1) });
            app.quit();
          } else if (a === 'check_integrity' && vault) {
            const r = vault.integrityCheck('quick');
            if (!r.ok) logger.error('vault', 'integrity check failed', { messages: r.messages.slice(0, 5) });
          }
        }
      } catch (e) {
        logger.error('app', 'health check failed', { message: (e as Error).message });
      }
    };
    const healthTimer = setInterval(runHealth, 60 * 60_000);
    healthTimer.unref();
    const firstHealth = setTimeout(runHealth, 30_000); // learn the disk level soon after start, not an hour later
    firstHealth.unref();
    const clockWatch = createClockWatch();
    const clockTimer = setInterval(() => {
      const j = clockWatch.tick();
      if (j) logger.warn('app', 'wall clock moved', { jumpSeconds: Math.round(j.jumpMs / 1000), likelySleep: j.likelySleep });
    }, 60_000);
    clockTimer.unref();
    const healthyTimer = setTimeout(() => crashGuard.markHealthy(), 10 * 60_000);
    healthyTimer.unref();
    onShutdown('health', () => {
      clearInterval(healthTimer);
      clearTimeout(firstHealth);
      clearInterval(clockTimer);
      clearTimeout(healthyTimer);
    });
    logger.info('app', 'ready', { safeMode: startVerdict.loop });
  });
}
