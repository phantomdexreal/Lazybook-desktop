/*
LazyBooks | src/main/config.ts
Responsibility: Config + secure storage
Introduced by: Phase 3 (config-secrets) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 3)
*/

/**
 * Non-secret settings: JSON file in userData with a zod schema and versioned migrations.
 * Secrets (license key, connector password, passphrase) never live here; see secrets.ts.
 * No Electron import: the directory is injected so this runs under plain Node tests.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { CONFIG_DEFAULTS, DESKTOP_DEFAULTS } from '../shared/constants';
import { logger } from './logger';

export const CONFIG_VERSION = 1;

const ConfigSchema = z.object({
  version: z.literal(CONFIG_VERSION),
  deviceId: z.string().nullable(),
  /** Customer's own Supabase project; the anon key is public by design. Set by activation (Phase 5). */
  target: z.object({ url: z.string(), anonKey: z.string() }).nullable(),
  companyGuid: z.string().nullable(),
  intervalMin: z.number().int().min(DESKTOP_DEFAULTS.syncIntervalMinAllowed).max(1440),
  lookbackDays: z.number().int().min(0).max(3650),
  tally: z.object({
    host: z.string().min(1),
    port: z.number().int().min(1).max(65535),
  }),
  autostart: z.boolean(),
  cloudCopy: z.boolean(),
  paused: z.boolean(),
  /** Interface language (Phase 35). Only English exists today; `.default` lets older files without the key load unchanged. */
  language: z.enum(['en']).default('en'),
  theme: z.object({
    slug: z.string(),
    mode: z.enum(['system', 'light', 'dark']),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;
export type ConfigPatch = Partial<Omit<Config, 'version' | 'tally' | 'theme'>> & {
  tally?: Partial<Config['tally']>;
  theme?: Partial<Config['theme']>;
};

export function defaultConfig(): Config {
  return {
    version: CONFIG_VERSION,
    deviceId: null,
    target: null,
    companyGuid: null,
    intervalMin: CONFIG_DEFAULTS.intervalMin,
    lookbackDays: CONFIG_DEFAULTS.lookbackDays,
    tally: { host: DESKTOP_DEFAULTS.tallyHost, port: DESKTOP_DEFAULTS.tallyPort },
    autostart: false,
    cloudCopy: false,
    paused: false,
    language: 'en',
    theme: { slug: 'obsidian-violet', mode: 'system' },
  };
}

/**
 * Migrations: key N upgrades a raw object from version N to N+1. Add one per schema change and bump
 * CONFIG_VERSION. Version 0 means "no version field" (legacy or hand-made file).
 */
const migrations: Record<number, (raw: Record<string, unknown>) => Record<string, unknown>> = {
  0: (raw) => ({ ...defaultConfig(), ...raw, version: 1 }),
};

export function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  let v = typeof raw['version'] === 'number' ? (raw['version'] as number) : 0;
  let cur = raw;
  while (v < CONFIG_VERSION) {
    const step = migrations[v];
    if (!step) throw new Error(`no migration from config version ${v}`);
    cur = step(cur);
    v += 1;
  }
  return cur;
}

let dir = '';
let current: Config = defaultConfig();
const listeners = new Set<(c: Config, changed: string[]) => void>();

const file = (): string => join(dir, 'config.json');

function writeAtomic(c: Config): void {
  mkdirSync(dir, { recursive: true });
  const tmp = file() + '.tmp';
  writeFileSync(tmp, JSON.stringify(c, null, 2), 'utf8');
  renameSync(tmp, file());
}

export function initConfig(userDataDir: string): Config {
  dir = userDataDir;
  mkdirSync(dir, { recursive: true });
  const legacyState = join(dir, 'state.json');
  let legacyPaused: boolean | null = null;
  if (existsSync(legacyState)) {
    try {
      legacyPaused = JSON.parse(readFileSync(legacyState, 'utf8')).paused === true;
    } catch {
      legacyPaused = null;
    }
  }

  if (existsSync(file())) {
    try {
      const raw = JSON.parse(readFileSync(file(), 'utf8')) as Record<string, unknown>;
      const fromVersion = raw['version'];
      const migrated = migrate(raw);
      current = ConfigSchema.parse(migrated);
      if (fromVersion !== CONFIG_VERSION) {
        writeAtomic(current);
        logger.info('app', 'config migrated', { from: fromVersion ?? 0, to: CONFIG_VERSION });
      }
    } catch (e) {
      const bad = `${file()}.corrupt-${Date.now()}`;
      try {
        renameSync(file(), bad);
      } catch {
        /* ignore */
      }
      logger.error('app', 'config invalid, using defaults', { err: e, backup: bad });
      current = defaultConfig();
      writeAtomic(current);
    }
  } else {
    current = defaultConfig();
    if (legacyPaused !== null) current.paused = legacyPaused;
    writeAtomic(current);
    logger.info('app', 'config created');
  }
  if (legacyPaused !== null) rmSync(legacyState, { force: true });
  return getConfig();
}

export function getConfig(): Config {
  return structuredClone(current);
}

/** Merge a patch (one level deep for tally/theme), validate, persist, notify. Logs key names only. */
export function updateConfig(patch: ConfigPatch): Config {
  const next = {
    ...current,
    ...patch,
    tally: { ...current.tally, ...patch.tally },
    theme: { ...current.theme, ...patch.theme },
  };
  const parsed = ConfigSchema.parse(next);
  const changed = Object.keys(patch).filter(
    (k) => JSON.stringify((parsed as Record<string, unknown>)[k]) !== JSON.stringify((current as Record<string, unknown>)[k]),
  );
  if (changed.length === 0) return getConfig();
  current = parsed;
  writeAtomic(current);
  logger.info('app', 'config updated', { keys: changed });
  for (const l of listeners) l(getConfig(), changed);
  return getConfig();
}

export function onConfigChange(fn: (c: Config, changed: string[]) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
