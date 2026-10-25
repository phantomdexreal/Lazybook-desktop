/*
LazyBooks | src/main/themes.ts
Responsibility: Custom theme files on disk (userData/themes), served raw to the renderer
Introduced by: Phase 4 (ui-shell)
STATUS: IMPLEMENTED (Phase 4)
*/
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { getConfig, updateConfig } from './config';
import { logger } from './logger';
import type { ThemePatch, ThemeState } from '../shared/ipc';

const MAX_FILES = 20;
const MAX_BYTES = 100 * 1024;

export const ThemePatchSchema = z.object({
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/).optional(),
  mode: z.enum(['system', 'light', 'dark']).optional(),
});

let themesDir = '';

export function initThemes(userDataDir: string): void {
  themesDir = join(userDataDir, 'themes');
  mkdirSync(themesDir, { recursive: true });
}

function readCustom(): unknown[] {
  if (!existsSync(themesDir)) return [];
  const out: unknown[] = [];
  for (const f of readdirSync(themesDir).filter((n) => n.endsWith('.json')).sort().slice(0, MAX_FILES)) {
    try {
      const full = join(themesDir, f);
      if (statSync(full).size > MAX_BYTES) {
        logger.warn('ui', 'theme file too large, skipped', { file: f });
        continue;
      }
      out.push(JSON.parse(readFileSync(full, 'utf8')));
    } catch (e) {
      logger.warn('ui', 'theme file unreadable, skipped', { file: f, err: e });
    }
  }
  return out;
}

export function getThemeState(): ThemeState {
  const { theme } = getConfig();
  return { slug: theme.slug, mode: theme.mode, custom: readCustom() };
}

export function setTheme(patch: ThemePatch): ThemeState {
  updateConfig({ theme: ThemePatchSchema.parse(patch) });
  return getThemeState();
}
