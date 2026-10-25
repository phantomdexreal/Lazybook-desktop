/*
LazyBooks | src/preload/index.ts
Responsibility: contextBridge IPC surface
Introduced by: Phase 1 (scaffold) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 1)
*/

import { contextBridge, ipcRenderer } from 'electron';
import { IPC, type ActivationResult, type ActivationState, type CryptoSetupResultView, type CryptoStatusView, type DeviceActionResult, type DevicesListResult, type LbApi, type LogQuery, type LogsExportResult, type LogsTailResult, type PairingView, type SettingsPatch, type SettingsResult, type SettingsView, type Status, type ToolResultView, type UpdateView, type TallyDetectionView, type ThemePatch, type ThemeState } from '../shared/ipc';

const api: LbApi = {
  status: {
    get: () => ipcRenderer.invoke(IPC.statusGet) as Promise<Status>,
    onEvent: (listener) => {
      const handler = (_e: Electron.IpcRendererEvent, partial: Partial<Status>) => listener(partial);
      ipcRenderer.on(IPC.statusEvent, handler);
      return () => ipcRenderer.removeListener(IPC.statusEvent, handler);
    },
  },
  theme: {
    get: () => ipcRenderer.invoke(IPC.themeGet) as Promise<ThemeState>,
    set: (patch: ThemePatch) => ipcRenderer.invoke(IPC.themeSet, patch) as Promise<ThemeState>,
  },
  tally: {
    get: () => ipcRenderer.invoke(IPC.tallyGet) as Promise<TallyDetectionView | null>,
    detect: () => ipcRenderer.invoke(IPC.tallyDetect) as Promise<TallyDetectionView>,
    set: (host: string, port: number) => ipcRenderer.invoke(IPC.tallySet, { host, port }) as Promise<TallyDetectionView>,
    selectCompany: (key: string) => ipcRenderer.invoke(IPC.tallySelectCompany, key) as Promise<TallyDetectionView | null>,
  },
  crypto: {
    get: () => ipcRenderer.invoke(IPC.cryptoGet) as Promise<CryptoStatusView>,
    setup: (passphrase: string) => ipcRenderer.invoke(IPC.cryptoSetup, passphrase) as Promise<CryptoSetupResultView>,
  },
  logs: {
    tail: (query?: LogQuery) => ipcRenderer.invoke(IPC.logsTail, query ?? {}) as Promise<LogsTailResult>,
    export: () => ipcRenderer.invoke(IPC.logsExport) as Promise<LogsExportResult>,
  },
  settings: {
    get: () => ipcRenderer.invoke(IPC.settingsGet) as Promise<SettingsView>,
    set: (patch: SettingsPatch) => ipcRenderer.invoke(IPC.settingsSet, patch) as Promise<SettingsResult>,
  },
  pairing: {
    get: () => ipcRenderer.invoke(IPC.pairingGet) as Promise<PairingView | null>,
  },
  pwa: {
    open: () => ipcRenderer.invoke(IPC.pwaOpen) as ReturnType<LbApi['pwa']['open']>,
  },
  update: {
    state: () => ipcRenderer.invoke(IPC.updateState) as Promise<UpdateView>,
    check: () => ipcRenderer.invoke(IPC.updateCheck) as Promise<UpdateView>,
    install: () => ipcRenderer.invoke(IPC.updateInstall) as Promise<{ ok: boolean; message?: string }>,
  },
  tools: {
    resync: () => ipcRenderer.invoke(IPC.toolsResync) as Promise<ToolResultView>,
    reset: (confirm: 'RESET') => ipcRenderer.invoke(IPC.toolsReset, { confirm }) as Promise<ToolResultView>,
    diagnostics: () => ipcRenderer.invoke(IPC.toolsDiagnostics) as Promise<ToolResultView>,
    openFolder: () => ipcRenderer.invoke(IPC.toolsOpenFolder) as Promise<ToolResultView>,
  },
  devices: {
    list: () => ipcRenderer.invoke(IPC.devicesList) as Promise<DevicesListResult>,
    revoke: (deviceId: string) => ipcRenderer.invoke(IPC.devicesRevoke, deviceId) as Promise<DeviceActionResult>,
    resync: (deviceId: string) => ipcRenderer.invoke(IPC.devicesResync, deviceId) as Promise<DeviceActionResult>,
  },
  activation: {
    get: () => ipcRenderer.invoke(IPC.activationGet) as Promise<ActivationState>,
    resolve: (licenseKey: string) => ipcRenderer.invoke(IPC.activationResolve, licenseKey) as Promise<ActivationResult>,
    login: (email: string, password: string) => ipcRenderer.invoke(IPC.activationLogin, { email, password }) as Promise<ActivationResult>,
    deactivate: () => ipcRenderer.invoke(IPC.activationDeactivate) as Promise<ActivationResult>,
    onEvent: (listener) => {
      const handler = (_e: Electron.IpcRendererEvent, s: ActivationState) => listener(s);
      ipcRenderer.on(IPC.activationEvent, handler);
      return () => ipcRenderer.removeListener(IPC.activationEvent, handler);
    },
  },
};

contextBridge.exposeInMainWorld('lb', api);
