/*
LazyBooks | src/shared/ipc.ts
Responsibility: IPC channel names + payload types (single source of truth)
Introduced by: Phase 1 (scaffold) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 1)
*/

/**
 * IPC channel names and payload types: the single source of truth for main, preload and renderer.
 * Keep in sync with API_CONTRACTS.md. Only channels implemented so far have handlers.
 */
export const IPC = {
  statusGet: 'lb:status:get',
  statusEvent: 'lb:status:event',
  themeGet: 'lb:theme:get',
  themeSet: 'lb:theme:set',
  activationGet: 'lb:activation:get',
  activationResolve: 'lb:activation:resolve',
  activationLogin: 'lb:activation:login',
  activationDeactivate: 'lb:activation:deactivate',
  activationEvent: 'lb:activation:event',
  tallyGet: 'lb:tally:get',
  tallyDetect: 'lb:tally:detect',
  tallySet: 'lb:tally:set',
  tallySelectCompany: 'lb:tally:selectCompany',
  cryptoGet: 'lb:crypto:get',
  cryptoSetup: 'lb:crypto:setup',
  pairingGet: 'lb:pairing:get',
  toolsResync: 'lb:tools:resync',
  toolsReset: 'lb:tools:reset',
  toolsDiagnostics: 'lb:tools:diagnostics',
  toolsOpenFolder: 'lb:tools:openFolder',
  updateState: 'lb:update:state',
  updateCheck: 'lb:update:check',
  updateInstall: 'lb:update:install',
  hostCall: 'lb:host:call',
  pwaOpen: 'lb:pwa:open',
  devicesList: 'lb:devices:list',
  devicesRevoke: 'lb:devices:revoke',
  devicesResync: 'lb:devices:resync',
  logsTail: 'lb:logs:tail',
  logsExport: 'lb:logs:export',
  settingsGet: 'lb:settings:get',
  settingsSet: 'lb:settings:set',
} as const;

export type IpcChannel = (typeof IPC)[keyof typeof IPC];

export interface LicenseStatus {
  licenseKey: string;
  plan: string | null;
  companyName?: string | null;
  expiresAt?: string | null;
}

export interface UpdateStatus {
  available: boolean;
  version: string | null;
}

/** Shape from API_CONTRACTS.md. Phase 1 returns the empty/default value. */
export interface Status {
  license: LicenseStatus | null;
  tally: { ok: boolean; version: string | null; company: string | null };
  internet: boolean;
  lastSyncAt: string | null;
  counts: Record<string, number>;
  pendingEntries: number;
  devicesOnline: number;
  errors: string[];
  update?: UpdateStatus;
  /** Phase 33 detail for the dashboard; every field is optional so older partial events stay valid. */
  detail?: StatusDetail;
}

/** Sync progress shown on the dashboard (Phase 33). Plain values only: no names, guids or paths. */
export interface SyncDetail {
  running: boolean;
  paused: boolean;
  failures: number;
  nextRunAt: string | null;
  message: string | null;
  /** 'ok' after a good cycle, 'failed' after a failed one, 'skipped' when nothing ran (blocked), null before the first. */
  lastOutcome: 'ok' | 'failed' | 'skipped' | null;
}

/** Entry (post to Tally) counters from the entry listener's last poll. */
export interface EntriesDetail {
  waiting: number;
  posted: number;
  failed: number;
  needsReview: number;
}

export interface StatusDetail {
  sync?: SyncDetail;
  entries?: EntriesDetail;
  /** Tally state word (ok, choose_company, ...) and the plain-language message with the fix. */
  tally?: { state: string; message: string };
  /** Effective feature flags from the last bootstrap (name -> on). */
  flags?: Record<string, boolean>;
  limits?: { maxDevices: number; maxCompanies: number };
  /** false when the SQLite vault could not be opened. */
  vaultOpen?: boolean;
  /** Data passphrase state (never the passphrase). */
  crypto?: 'not-set-up' | 'ready' | 'locked';
  deviceRevoked?: boolean;
  /** ISO time the status was built (renderer shows relative times against its own clock). */
  builtAt?: string;
}

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeState {
  slug: string;
  mode: ThemeMode;
  /** Raw JSON of custom theme files from userData/themes; validated in the renderer. */
  custom: unknown[];
}

export interface ThemePatch {
  slug?: string;
  mode?: ThemeMode;
}

export type ActivationStage = 'needs-license' | 'needs-login' | 'active';

/** A blocking screen the renderer must show instead of the app (maintenance, contract too old, update required, license expired/inactive). */
export interface BlockingState {
  code: string;
  message: string;
}

/** What the renderer may know about activation. Never contains the full license key, password or tokens. */
export interface ActivationState {
  stage: ActivationStage;
  companyName: string | null;
  licenseKeyMasked: string | null;
  email: string | null;
  expiresAt: string | null;
  blocking: BlockingState | null;
  /** true when the last bootstrap could not reach the registry and cached data is in use */
  offline: boolean;
  lastBootstrapAt: string | null;
  /** false when the OS cannot encrypt secrets (activation is refused) */
  secureStorage: boolean;
  /** false when this build/environment has no master registry address */
  masterConfigured: boolean;
}

export type ActivationResult = { ok: true; state: ActivationState } | { ok: false; code: string; message: string };

export type TallyState = 'ok' | 'choose_company' | 'no_company' | 'unreachable' | 'rejected' | 'not_tally';

export interface TallyCompany {
  name: string;
  guid: string | null;
  startingFrom: string | null;
  endingAt: string | null;
}

/** Result of a Tally probe (Phase 7). `message` is plain language including the fix. */
export interface TallyDetectionView {
  state: TallyState;
  ok: boolean;
  code: string | null;
  host: string;
  port: number;
  version: string | null;
  companies: TallyCompany[];
  selected: TallyCompany | null;
  message: string;
  checkedAt: string;
}

export type CryptoState = 'not-set-up' | 'ready' | 'locked';

/** Data passphrase status (Phase 21). Never contains the passphrase, key, salt or KCV. */
export interface CryptoStatusView {
  state: CryptoState;
  configured: boolean;
  createdAt: string | null;
  minLength: number;
}

export type CryptoSetupResultView = { ok: true; status: CryptoStatusView } | { ok: false; code: string; message: string };

/** Public pairing values for a new device; contains no secret (SHARED_CONTRACTS section 7). */
export interface PairingView {
  licenseKey: string;
  saltB64: string;
  kcv: string;
  qrUri: string;
  /** SVG markup made in main from qrUri (colour = currentColor). */
  qrSvg: string;
}

/** One row of the license's `devices` table as the Devices page shows it (Phase 36). No keys, tokens or license key. */
export interface DeviceView {
  deviceId: string;
  name: string;
  app: 'pwa' | 'mobile' | 'desktop';
  platform: string | null;
  appVersion: string | null;
  canWrite: boolean;
  revoked: boolean;
  lastSeenAt: string | null;
  lastSyncAt: string | null;
  createdAt: string | null;
  /** seen within the last 10 minutes and not revoked (SHARED_CONTRACTS 4.4) */
  online: boolean;
  /** the row of this PC: it can be neither revoked nor resynced from here */
  thisPc: boolean;
}

export type DevicesListResult =
  | { ok: true; devices: DeviceView[]; maxDevices: number | null }
  | { ok: false; code: string; message: string };

export type DeviceActionResult = { ok: true; message: string } | { ok: false; code: string; message: string };

/** Result of a maintenance action (Phase 37). Plain-language message; `path` only for the diagnostics zip the person chose. */
export type UpdatePhase = 'idle' | 'downloading' | 'ready' | 'error' | 'unsupported';

/** Phase 39: what the page may know about an update. No paths and no URLs. */
export interface UpdateView {
  phase: UpdatePhase;
  version: string | null;
  /** True when the old version can no longer be used (must_update or below min_supported). */
  forced: boolean;
  notes: string | null;
  message: string | null;
}

export type ToolResultView =
  | { ok: true; message: string; path?: string }
  | { ok: false; code: string; message: string; canceled?: boolean };

export type LogLevelName = 'info' | 'warn' | 'error';

/** One structured log line as the viewer receives it (already redacted in main). */
export interface LogLine {
  t: string;
  lvl: LogLevelName;
  mod: string;
  msg: string;
  data?: Record<string, unknown>;
}

/** Log filter (Phase 34). `level` is the minimum severity (warn shows warn and error); `q` matches message, module and data text, case-insensitive. */
export interface LogQuery {
  level?: LogLevelName;
  mod?: string;
  q?: string;
  /** newest first, 1 to 1000 (default 200) */
  limit?: number;
}

export interface LogsTailResult {
  lines: LogLine[];
  /** true when more matching lines exist than `limit` */
  truncated: boolean;
  /** log lines that could not be read (damaged) and were left out */
  skipped: number;
}

export type LogsExportResult = { ok: true; path: string; lines: number } | { ok: false; canceled: boolean; message: string };

export type SettingsLanguage = 'en';

/** What the Settings page shows and edits (Phase 35). Company and financial year are read-only here: Tally decides the year and the company is chosen with `tally.selectCompany`. */
export interface SettingsView {
  company: { name: string; guid: string | null } | null;
  /** The selected company's financial year as Tally reports it (the sync window follows it); null before the first read. */
  fy: { from: string | null; to: string | null } | null;
  lookbackDays: number;
  intervalMin: number;
  tallyHost: string;
  tallyPort: number;
  autostart: boolean;
  /** The stored choice; effective only while `cloudCopyAllowed`. */
  cloudCopy: boolean;
  /** The license's `cloud_copy` feature flag (false until the first bootstrap). */
  cloudCopyAllowed: boolean;
  language: SettingsLanguage;
  languages: Array<{ id: SettingsLanguage; label: string }>;
  limits: { intervalMin: { min: number; max: number }; lookbackDays: { min: number; max: number } };
}

export interface SettingsPatch {
  lookbackDays?: number;
  intervalMin?: number;
  tallyHost?: string;
  tallyPort?: number;
  autostart?: boolean;
  cloudCopy?: boolean;
  language?: SettingsLanguage;
}

export type SettingsResult =
  | { ok: true; settings: SettingsView }
  /** Nothing was changed when ok is false. `field` names the first rejected field. */
  | { ok: false; code: 'INVALID' | 'FLAG_OFF'; field: string; message: string; settings: SettingsView };

/** Surface exposed to the renderer as window.lb by the preload script. */
export interface LbApi {
  status: {
    get(): Promise<Status>;
    onEvent(listener: (partial: Partial<Status>) => void): () => void;
  };
  theme: {
    get(): Promise<ThemeState>;
    set(patch: ThemePatch): Promise<ThemeState>;
  };
  tally: {
    /** Last detection (null before the first probe). */
    get(): Promise<TallyDetectionView | null>;
    /** Probe Tally now. */
    detect(): Promise<TallyDetectionView>;
    /** Save host/port (validated in main) and probe again. */
    set(host: string, port: number): Promise<TallyDetectionView>;
    /** Choose which loaded company to sync (guid, or name when Tally gave no guid). */
    selectCompany(key: string): Promise<TallyDetectionView | null>;
  };
  crypto: {
    get(): Promise<CryptoStatusView>;
    /** First-time setup, or replace (devices must re-pair). The passphrase goes to main once and is never returned. */
    setup(passphrase: string): Promise<CryptoSetupResultView>;
  };
  logs: {
    /** Newest-first filtered lines, secrets redacted. */
    tail(query?: LogQuery): Promise<LogsTailResult>;
    /** Asks where to save, then writes every kept log file (oldest first, redacted) as one text file. */
    export(): Promise<LogsExportResult>;
  };
  settings: {
    get(): Promise<SettingsView>;
    /** All-or-nothing: every field is validated first; Tally host/port changes trigger a new probe. */
    set(patch: SettingsPatch): Promise<SettingsResult>;
  };
  pairing: {
    /** null until the passphrase is set up and a license is active. */
    get(): Promise<PairingView | null>;
  };
  pwa: {
    /** Open the embedded app window (needs the license flag embedded_pwa_desktop). */
    open(): Promise<{ ok: true } | { ok: false; code: 'NOT_ENABLED' | 'NO_PWA' | 'FAILED'; message: string }>;
  };
  update: {
    /** Current update state (no network). */
    state(): Promise<UpdateView>;
    /** Look at the latest announced update now; downloads and verifies it when one is offered. */
    check(): Promise<UpdateView>;
    /** Install a verified update now; the app restarts. */
    install(): Promise<{ ok: boolean; message?: string }>;
  };
  tools: {
    /** Forget the sync memory and read everything from Tally again (vault kept). */
    resync(): Promise<ToolResultView>;
    /** Delete the local data store and sync from scratch. Needs the literal confirmation word; license, login and passphrase are kept. */
    reset(confirm: 'RESET'): Promise<ToolResultView>;
    /** Asks where to save, then writes a redacted diagnostics zip (summary and logs, no vault, no secrets). */
    diagnostics(): Promise<ToolResultView>;
    /** Opens the LazyBooks data folder in the file manager (no path is accepted from the page). */
    openFolder(): Promise<ToolResultView>;
  };
  devices: {
    /** Every device of the license (phones, browsers and PCs), newest activity first. */
    list(): Promise<DevicesListResult>;
    /** Block a phone or browser: it stops receiving data and cannot write entries. Refused for this PC. */
    revoke(deviceId: string): Promise<DeviceActionResult>;
    /** Make the next sync for that device a full one (its position here is forgotten, waiting data is dropped). */
    resync(deviceId: string): Promise<DeviceActionResult>;
  };
  activation: {
    get(): Promise<ActivationState>;
    /** Step 1-3 of the activation sequence: validate the key against the master registry and store the target. */
    resolve(licenseKey: string): Promise<ActivationResult>;
    /** Step 4-5: sign in as the connector user, then bootstrap. */
    login(email: string, password: string): Promise<ActivationResult>;
    /** Forget the license, login and session on this PC (does not touch Tally or the vault). */
    deactivate(): Promise<ActivationResult>;
    onEvent(listener: (state: ActivationState) => void): () => void;
  };
}
