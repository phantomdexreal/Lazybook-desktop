/*
LazyBooks | src/renderer/theme/boot.ts
Responsibility: Apply the last used theme synchronously before first render to avoid a flash
Introduced by: Phase 4 (ui-shell)
STATUS: IMPLEMENTED (Phase 4)
*/
import { defaultTheme } from './builtin';
import { applyTheme, resolveMode, validateTheme, type Theme } from './engine';
import type { ThemeMode } from '../../shared/ipc';

export const CACHE_KEY = 'lb.theme.cache';

export interface ThemeCache {
  theme: Theme;
  mode: ThemeMode;
}

export function writeCache(c: ThemeCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {
    /* storage unavailable: next start uses the default */
  }
}

export function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

(function boot() {
  let theme = defaultTheme();
  let mode: ThemeMode = 'system';
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const c = JSON.parse(raw) as ThemeCache;
      const v = validateTheme(c.theme);
      if (v.ok) {
        theme = v.theme;
        mode = c.mode;
      }
    }
  } catch {
    /* ignore a bad cache */
  }
  applyTheme(theme, resolveMode(mode, systemPrefersDark()));
})();
