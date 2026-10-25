/*
LazyBooks | src/main/lifecycle.ts
Responsibility: Tray, autostart, logging
Introduced by: Phase 2 (tray-lifecycle) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 2)
*/

import { app, powerMonitor } from 'electron';
import { EventEmitter } from 'node:events';
import { getConfig, updateConfig } from './config';
import { logger } from './logger';

/**
 * App lifecycle: crash handlers, ordered shutdown hooks, sleep/wake events, pause state, autostart.
 * Later phases subscribe to `lifecycle.events` ('sync-now', 'pause-changed', 'suspend', 'resume')
 * and register shutdown hooks. Pause state is persisted in config.json.
 */
export const lifecycle = new EventEmitter();

type ShutdownHook = { name: string; fn: () => void | Promise<void> };
const hooks: ShutdownHook[] = [];
let paused = false;
let shuttingDown = false;
let quitRequested = false;

export function onShutdown(name: string, fn: ShutdownHook['fn']): void {
  hooks.push({ name, fn });
}

export function isPaused(): boolean {
  return paused;
}

export function setPaused(value: boolean): void {
  if (paused === value) return;
  paused = value;
  updateConfig({ paused });
  logger.info('app', value ? 'sync paused' : 'sync resumed');
  lifecycle.emit('pause-changed', value);
}

export function requestSyncNow(): void {
  logger.info('app', 'sync now requested', { paused });
  lifecycle.emit('sync-now');
}

/** Autostart is stored by the OS login-item entry itself, so it survives relaunch without config. */
export function getAutostart(): boolean {
  return app.getLoginItemSettings().openAtLogin;
}

export function setAutostart(enabled: boolean): void {
  // Packaged and dev builds differ; the setting is only meaningful on Windows and macOS.
  app.setLoginItemSettings({ openAtLogin: enabled, args: ['--hidden'] });
  logger.info('app', 'autostart changed', { enabled });
}

/** True when started by the OS at login (no window should pop up). */
export function startedHidden(): boolean {
  return process.argv.includes('--hidden');
}

export function isQuitting(): boolean {
  return quitRequested;
}

async function runShutdownHooks(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info('app', 'shutdown started', { hooks: hooks.length });
  for (const h of [...hooks].reverse()) {
    try {
      await Promise.race([Promise.resolve(h.fn()), new Promise((r) => setTimeout(r, 5000))]);
    } catch (e) {
      logger.error('app', 'shutdown hook failed', { hook: h.name, err: e });
    }
  }
  logger.info('app', 'shutdown complete');
}

export function initLifecycle(): void {
  paused = getConfig().paused; // config must be initialised first (see index.ts)

  process.on('uncaughtException', (err) => {
    logger.error('app', 'uncaughtException', { err });
  });
  process.on('unhandledRejection', (reason) => {
    logger.error('app', 'unhandledRejection', { err: reason });
  });
  app.on('render-process-gone', (_e, _wc, details) => {
    logger.error('ui', 'renderer process gone', { reason: details.reason, exitCode: details.exitCode });
  });
  app.on('child-process-gone', (_e, details) => {
    logger.error('app', 'child process gone', { type: details.type, reason: details.reason });
  });

  // Run hooks once, then really quit.
  app.on('before-quit', (e) => {
    quitRequested = true;
    if (shuttingDown) return;
    e.preventDefault();
    void runShutdownHooks().finally(() => app.quit());
  });

  powerMonitor.on('suspend', () => {
    logger.info('app', 'system suspend');
    lifecycle.emit('suspend');
  });
  powerMonitor.on('resume', () => {
    logger.info('app', 'system resume');
    lifecycle.emit('resume');
  });
  powerMonitor.on('lock-screen', () => logger.info('app', 'screen locked'));
  powerMonitor.on('unlock-screen', () => logger.info('app', 'screen unlocked'));
  powerMonitor.on('shutdown', () => {
    logger.info('app', 'os shutdown');
  });

  logger.info('app', 'lifecycle ready', { paused, autostart: getAutostart(), version: app.getVersion() });
}
