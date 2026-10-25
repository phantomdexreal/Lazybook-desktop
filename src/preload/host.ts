/*
LazyBooks | src/preload/host.ts
Responsibility: Embedded PWA window (optional) (Phase 40)
Exposes `window.LazyHost` (docs/shared/HOST_BRIDGE.md, platform 'electron') to the embedded PWA only. The page gets nothing else:
no ipcRenderer, no Node. Every method forwards its name and arguments over one channel; the main process checks sender and method.
*/
import { contextBridge, ipcRenderer } from 'electron';

const CHANNEL = 'lb:host:call';
const call = (method: string, args?: unknown): Promise<unknown> => ipcRenderer.invoke(CHANNEL, method, args);

const host = {
  platform: 'electron' as const,
  capabilities: {
    sqlite: false,
    share: false,
    saveFile: true,
    scanBarcode: false,
    location: false,
    contacts: false,
    biometric: false,
    pushToken: false,
    localNotifications: false,
    openData: true,
    update: true,
    passphraseHandoff: true,
  },
  appInfo: () => call('appInfo'),
  shareFile: (o: unknown) => call('shareFile', o),
  saveFile: (o: unknown) => call('saveFile', o),
  openUrl: (url: string) => call('openUrl', { url }),
  scanBarcode: () => call('scanBarcode'),
  getLocation: (o?: unknown) => call('getLocation', o),
  pickContact: () => call('pickContact'),
  biometricAuth: (reason: string) => call('biometricAuth', { reason }),
  getPushToken: () => call('getPushToken'),
  scheduleNotification: (n: unknown) => call('scheduleNotification', n),
  cancelNotification: (id: string) => call('cancelNotification', { id }),
  checkForUpdate: () => call('checkForUpdate'),
  desktop: {
    openDataFolder: () => call('desktop.openDataFolder'),
    getPassphraseHandoff: () => call('desktop.getPassphraseHandoff'),
  },
};

contextBridge.exposeInMainWorld('LazyHost', host);
