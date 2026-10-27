/*
LazyBooks | src/main/tray.ts
Responsibility: Tray, autostart, logging
Introduced by: Phase 2 (tray-lifecycle) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 2)
*/

import { app, Menu, nativeImage, Tray } from 'electron';
import { getAutostart, isPaused, lifecycle, requestSyncNow, setAutostart, setPaused } from './lifecycle';
import { APP_NAME } from '../shared/constants';

let tray: Tray | null = null;
let refreshFn: (() => void) | null = null;

/** Phase 40: optional entries the tray reads each time it refreshes (embedded PWA window, waiting-entries badge). */
export interface TrayExtras {
  pwa?: { available: () => boolean; open: () => void };
  /** Number of entries waiting for Tally; shown in the tooltip (the HOST_BRIDGE contract has no badge method). */
  badge?: () => number;
  /** Phase 46: text such as `syncing 26%` while a sync runs, null otherwise; shown in the tooltip. */
  syncText?: () => string | null;
}
let extras: TrayExtras = {};

/** Rebuild menu and tooltip now (call after the license flags or the waiting count change). */
export function refreshTray(): void {
  refreshFn?.();
}

/**
 * Neutral placeholder tray icon generated in code (owner supplies real artwork in the installer phase):
 * a violet rounded square with a pixel "LB". 
 */
function placeholderIcon(): Electron.NativeImage {
  const size = 32;
  const buf = Buffer.alloc(size * size * 4, 0);
  const put = (x: number, y: number, r: number, g: number, b: number): void => {
    const i = (y * size + x) * 4;
    buf[i] = b; buf[i + 1] = g; buf[i + 2] = r; buf[i + 3] = 255; // BGRA
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = Math.min(x, size - 1 - x);
      const cy = Math.min(y, size - 1 - y);
      if (cx + cy >= 3 || (cx >= 2 && cy >= 2)) put(x, y, 109, 40, 217);
    }
  }
  const L = ['10000', '10000', '10000', '10000', '10000', '10000', '11111'];
  const B = ['11110', '10001', '10001', '11110', '10001', '10001', '11110'];
  const glyph = (rows: string[], ox: number): void => {
    rows.forEach((row, ry) => {
      [...row].forEach((c, rx) => {
        if (c !== '1') return;
        for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) put(ox + rx * 2 + dx, 9 + ry * 2 + dy, 255, 255, 255);
      });
    });
  };
  glyph(L, 3);
  glyph(B, 17);
  return nativeImage.createFromBitmap(buf, { width: size, height: size });
}

function buildMenu(showWindow: () => void): Menu {
  return Menu.buildFromTemplate([
    { label: 'Open', click: showWindow },
    ...(extras.pwa?.available() ? [{ label: 'Open LazyBooks', click: () => extras.pwa?.open() }] : []),
    { label: 'Sync now', enabled: !isPaused(), click: () => requestSyncNow() },
    { label: 'Pause sync', type: 'checkbox', checked: isPaused(), click: (item) => setPaused(item.checked) },
    { type: 'separator' },
    { label: 'Start with Windows', type: 'checkbox', checked: getAutostart(), click: (item) => setAutostart(item.checked) },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);
}

export function createTray(showWindow: () => void, opts: TrayExtras = {}): void {
  extras = opts;
  tray = new Tray(placeholderIcon());
  const refresh = (): void => {
    const waiting = extras.badge?.() ?? 0;
    const base = isPaused() ? `${APP_NAME} (paused)` : APP_NAME;
    const sync = extras.syncText?.() ?? null;
    const tip = waiting > 0 ? `${base} - ${waiting} waiting` : base;
    tray?.setToolTip(sync ? `${tip} - ${sync}` : tip);
    tray?.setContextMenu(buildMenu(showWindow));
  };
  refreshFn = refresh;
  refresh();
  lifecycle.on('pause-changed', refresh);
  tray.on('click', showWindow);
}
