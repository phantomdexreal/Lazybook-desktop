/*
LazyBooks | src/main/pwaHost.ts
Responsibility: Embedded PWA window (optional) (Phase 40)
No Electron import: everything native is injected. Implements the `window.LazyHost` contract of docs/shared/HOST_BRIDGE.md for platform 'electron'.

* The PWA build lives in `resources/pwa` (stub until a human drops the real export there, PEER-06) and is served by a custom,
  read-only protocol (`lazybooks-pwa://app/...`); nothing outside that folder can be reached.
* The bridge is the only native surface. Every call arrives on one IPC channel, only from the embedded window and only from the
  custom origin, and only for a method in the contract. Unsupported methods resolve `{ok:false, reason:'unsupported'}`; nothing throws.
* The page-opening feature is opt-in: the license flag `embedded_pwa_desktop` must be true (default false) and a person must choose it.
*/
import { existsSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, normalize, resolve, sep } from 'node:path';

export const PWA_SCHEME = 'lazybooks-pwa';
export const PWA_ORIGIN = `${PWA_SCHEME}://app`;

export type HostResult = { ok: true } | { ok: false; reason: string };

/** Methods the page may call (HOST_BRIDGE.md). `sqlite` is absent on Electron by contract. */
export const HOST_METHODS = [
  'appInfo',
  'shareFile',
  'saveFile',
  'openUrl',
  'scanBarcode',
  'getLocation',
  'pickContact',
  'biometricAuth',
  'getPushToken',
  'scheduleNotification',
  'cancelNotification',
  'checkForUpdate',
  'desktop.openDataFolder',
  'desktop.getPassphraseHandoff',
] as const;
export type HostMethod = (typeof HOST_METHODS)[number];

export const HOST_CAPABILITIES = {
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
} as const;

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
};

/**
 * Map a request path to a file inside `root`. Returns null for anything outside the folder, anything odd (null bytes,
 * backslashes, encoded separators, `..`), and for missing files with an extension. Extension-less misses fall back to
 * `index.html` (client-side routes of a static export).
 */
export function resolvePwaFile(root: string, urlPath: string): { file: string; mime: string } | null {
  let p: string;
  try {
    p = decodeURIComponent(urlPath.split('?')[0]?.split('#')[0] ?? '/');
  } catch {
    return null;
  }
  if (p.includes('\0') || p.includes('\\')) return null;
  if (p.split('/').some((seg) => seg === '..')) return null;
  const base = resolve(root);
  let rel = normalize(p).replace(/^[/\\]+/, '');
  if (rel === '' || rel === '.') rel = 'index.html';
  let file = resolve(base, rel);
  if (file !== base && !file.startsWith(base + sep)) return null;
  try {
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  } catch {
    return null;
  }
  if (!existsSync(file) || !statSync(file).isFile()) {
    if (extname(rel) !== '') return null;
    file = join(base, 'index.html');
    if (!existsSync(file)) return null;
  }
  return { file, mime: MIME[extname(file).toLowerCase()] ?? 'application/octet-stream' };
}

/** Version pin: `pwa-version.json` next to index.html: `{version, contract?}`; missing or broken gives 'unknown'. */
export function readPwaManifest(root: string): { version: string; contract: number | null; present: boolean } {
  const present = existsSync(join(root, 'index.html'));
  try {
    const j = JSON.parse(readFileSync(join(root, 'pwa-version.json'), 'utf8')) as { version?: unknown; contract?: unknown };
    const version = typeof j.version === 'string' && /^\d+\.\d+\.\d+$/.test(j.version) ? j.version : 'unknown';
    const contract = typeof j.contract === 'number' ? j.contract : null;
    return { version, contract, present };
  } catch {
    return { version: 'unknown', contract: null, present };
  }
}

/** Only the embedded window, showing a page of the custom origin, may use the bridge. */
export function isTrustedSender(frameUrl: string | undefined | null, senderId: number, expectedId: number | null): boolean {
  if (expectedId === null || senderId !== expectedId) return false;
  return typeof frameUrl === 'string' && (frameUrl === PWA_ORIGIN || frameUrl.startsWith(PWA_ORIGIN + '/'));
}

const OPEN_URL_SCHEMES = new Set(['https:', 'mailto:', 'sms:', 'tel:']);
export function isAllowedExternalUrl(url: unknown): url is string {
  if (typeof url !== 'string' || url.length === 0 || url.length > 2048) return false;
  try {
    const u = new URL(url);
    if (u.username || u.password) return false;
    return OPEN_URL_SCHEMES.has(u.protocol);
  } catch {
    return false;
  }
}

export function safeFileName(name: unknown): string | null {
  if (typeof name !== 'string') return null;
  // eslint-disable-next-line no-control-regex
  const n = basename(name.replace(/\\/g, '/')).replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').trim().replace(/^\.+/, '');
  return n.length > 0 && n.length <= 150 ? n : null;
}

export const MAX_SAVE_BYTES = 50 * 1024 * 1024;

export interface HostBridgeDeps {
  nativeVersion: string;
  pwaDir: string;
  contract: number;
  /** Native save dialog; null when the person cancels. */
  chooseSavePath: (defaultName: string) => Promise<string | null>;
  writeFile: (path: string, data: Buffer) => Promise<void>;
  openExternal: (url: string) => Promise<void>;
  openDataFolder: () => Promise<{ ok: boolean }>;
  checkForUpdate: () => Promise<{ phase: string }>;
  /** Stored passphrase or null (no passphrase set, or secure storage unavailable). */
  getPassphrase: () => string | null;
  log: (message: string, data?: Record<string, unknown>) => void;
}

export interface HostBridge {
  /** Runs one contract method. Never throws; unknown or malformed calls resolve to a failure result. */
  call(method: string, args: unknown): Promise<unknown>;
}

const UNSUPPORTED: HostResult = { ok: false, reason: 'unsupported' };

export function createHostBridge(d: HostBridgeDeps): HostBridge {
  const rec = (v: unknown): Record<string, unknown> => (v !== null && typeof v === 'object' ? (v as Record<string, unknown>) : {});

  async function run(method: HostMethod, args: unknown): Promise<unknown> {
    switch (method) {
      case 'appInfo': {
        const m = readPwaManifest(d.pwaDir);
        return { nativeVersion: d.nativeVersion, pwaVersion: m.version, contract: d.contract };
      }
      case 'saveFile': {
        const a = rec(args);
        const name = safeFileName(a['name']);
        const b64 = a['dataBase64'];
        if (!name || typeof a['mime'] !== 'string' || typeof b64 !== 'string') return { ok: false, reason: 'invalid' };
        if (b64.length > Math.ceil((MAX_SAVE_BYTES * 4) / 3) + 4) return { ok: false, reason: 'too_large' };
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(b64)) return { ok: false, reason: 'invalid' };
        const target = await d.chooseSavePath(name);
        if (!target) return { ok: false, reason: 'canceled' };
        const data = Buffer.from(b64, 'base64');
        try {
          await d.writeFile(target, data);
        } catch {
          return { ok: false, reason: 'write_failed' };
        }
        d.log('host saveFile', { bytes: data.length });
        return { ok: true };
      }
      case 'openUrl': {
        const url = rec(args)['url'] ?? (typeof args === 'string' ? args : undefined);
        if (!isAllowedExternalUrl(url)) return { ok: false, reason: 'blocked' };
        try {
          await d.openExternal(url);
          return { ok: true };
        } catch {
          return { ok: false, reason: 'open_failed' };
        }
      }
      case 'checkForUpdate': {
        const v = await d.checkForUpdate();
        return v.phase === 'unsupported' ? UNSUPPORTED : { ok: true };
      }
      case 'desktop.openDataFolder': {
        const r = await d.openDataFolder();
        return r.ok ? { ok: true } : { ok: false, reason: 'failed' };
      }
      case 'desktop.getPassphraseHandoff': {
        const p = d.getPassphrase();
        if (!p) return { ok: false, reason: 'no_passphrase' };
        d.log('host passphrase handoff', {});
        return { ok: true, passphrase: p };
      }
      default:
        // shareFile, scanBarcode, getLocation, pickContact, biometricAuth, getPushToken, scheduleNotification, cancelNotification
        return UNSUPPORTED;
    }
  }

  return {
    async call(method, args) {
      if (!(HOST_METHODS as readonly string[]).includes(method)) return { ok: false, reason: 'unknown_method' };
      try {
        return await run(method as HostMethod, args);
      } catch (e) {
        d.log('host call failed', { method, message: (e as Error).message });
        return { ok: false, reason: 'error' };
      }
    },
  };
}

export type OpenResult = { ok: true } | { ok: false; code: 'NOT_ENABLED' | 'NO_PWA' | 'FAILED'; message: string };

export interface PwaWindowHandle {
  id: number;
  isDestroyed(): boolean;
  focus(): void;
  close(): void;
}

export interface PwaHostDeps {
  pwaDir: string;
  /** License flag `embedded_pwa_desktop` (default false). */
  enabled: () => boolean;
  /** Creates the sandboxed window on the custom origin and returns a handle; `onClosed` fires once when it is gone. */
  openWindow: (url: string, onClosed: () => void) => PwaWindowHandle;
  log: (message: string, data?: Record<string, unknown>) => void;
}

export interface PwaHost {
  open(): OpenResult;
  /** Id of the open embedded window or null (used for the sender check). */
  windowId(): number | null;
  close(): void;
}

export function createPwaHost(d: PwaHostDeps): PwaHost {
  let win: PwaWindowHandle | null = null;
  return {
    open() {
      if (!d.enabled()) return { ok: false, code: 'NOT_ENABLED', message: 'The PC app window is not enabled for your license.' };
      if (win && !win.isDestroyed()) {
        win.focus();
        return { ok: true };
      }
      if (!readPwaManifest(d.pwaDir).present) return { ok: false, code: 'NO_PWA', message: 'The app files are missing from this installation.' };
      try {
        win = d.openWindow(`${PWA_ORIGIN}/index.html`, () => {
          win = null;
          d.log('pwa window closed');
        });
        d.log('pwa window opened', { version: readPwaManifest(d.pwaDir).version });
        return { ok: true };
      } catch (e) {
        d.log('pwa window failed', { message: (e as Error).message });
        win = null;
        return { ok: false, code: 'FAILED', message: 'The window could not be opened.' };
      }
    },
    windowId: () => (win && !win.isDestroyed() ? win.id : null),
    close() {
      if (win && !win.isDestroyed()) win.close();
    },
  };
}
