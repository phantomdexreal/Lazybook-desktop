/*
LazyBooks | src/main/settings.ts
Responsibility: Reads and validates the user-editable settings (all-or-nothing), no Electron import
Introduced by: Phase 35 (ui-settings)
STATUS: IMPLEMENTED (Phase 35)
*/

import { z } from 'zod';
import { DESKTOP_DEFAULTS, VOUCHER_BATCH } from '../shared/constants';
import type { SettingsPatch, SettingsResult, SettingsView } from '../shared/ipc';

export const INTERVAL_LIMITS = { min: DESKTOP_DEFAULTS.syncIntervalMinAllowed, max: 1440 } as const;
export const LOOKBACK_LIMITS = { min: 0, max: 3650 } as const;
export const VOUCHER_BATCH_LIMITS = { min: VOUCHER_BATCH.sizeMin, max: VOUCHER_BATCH.sizeMax } as const;
export const LANGUAGES: SettingsView['languages'] = [{ id: 'en', label: 'English' }];

const HOST_RE = /^[A-Za-z0-9.-]+$/;

/** Strict: an unknown key or a wrong type is rejected, never ignored. */
const PatchSchema = z
  .object({
    lookbackDays: z.number().int().min(LOOKBACK_LIMITS.min).max(LOOKBACK_LIMITS.max),
    intervalMin: z.number().int().min(INTERVAL_LIMITS.min).max(INTERVAL_LIMITS.max),
    tallyHost: z.string().trim().min(1).max(253).regex(HOST_RE),
    tallyPort: z.number().int().min(1).max(65535),
    autostart: z.boolean(),
    cloudCopy: z.boolean(),
    language: z.enum(['en']),
    voucherBatchSize: z.number().int().min(VOUCHER_BATCH_LIMITS.min).max(VOUCHER_BATCH_LIMITS.max),
    autoUpdateCheck: z.boolean(),
  })
  .partial()
  .strict();

const MESSAGES: Record<string, string> = {
  lookbackDays: 'Enter a number of days from 0 to 3650.',
  intervalMin: `Enter a number of minutes from ${INTERVAL_LIMITS.min} to ${INTERVAL_LIMITS.max}.`,
  tallyHost: 'Enter a host name or address (letters, digits, dots and dashes).',
  tallyPort: 'Enter a port from 1 to 65535.',
  autostart: 'Choose on or off.',
  cloudCopy: 'Choose on or off.',
  language: 'Choose one of the listed languages.',
  voucherBatchSize: `Enter a whole number of vouchers from ${VOUCHER_BATCH_LIMITS.min} to ${VOUCHER_BATCH_LIMITS.max}.`,
  autoUpdateCheck: 'Choose on or off.',
};

export interface SettingsDeps {
  config: () => {
    lookbackDays: number;
    intervalMin: number;
    tally: { host: string; port: number };
    autostart: boolean;
    cloudCopy: boolean;
    language: 'en';
    voucherBatchSize: number;
    autoUpdateCheck: boolean;
  };
  updateConfig: (p: {
    lookbackDays?: number;
    intervalMin?: number;
    tally?: { host?: string; port?: number };
    autostart?: boolean;
    cloudCopy?: boolean;
    language?: 'en';
    voucherBatchSize?: number;
    autoUpdateCheck?: boolean;
  }) => void;
  /** the OS login item (the truth for autostart) */
  getAutostart: () => boolean;
  setAutostart: (on: boolean) => void;
  /** the license's cloud_copy flag from the last bootstrap */
  cloudCopyAllowed: () => boolean;
  company: () => { name: string; guid: string | null } | null;
  fy: () => { from: string | null; to: string | null } | null;
  /** called after the Tally address changed (the caller probes again) */
  onTallyTargetChanged?: () => void;
  /** called after interval or lookback changed (the caller may nudge the scheduler) */
  onSyncSettingsChanged?: () => void;
  /** called after the automatic update check switch changed (Phase 47: the updater starts or stops its timer) */
  onAutoUpdateChanged?: (on: boolean) => void;
  log?: (msg: string, data: Record<string, unknown>) => void;
}

export interface Settings {
  get(): SettingsView;
  set(patch: unknown): SettingsResult;
}

export function createSettings(d: SettingsDeps): Settings {
  function get(): SettingsView {
    const c = d.config();
    let autostart = c.autostart;
    try {
      autostart = d.getAutostart(); // the OS entry is the truth; the config value only mirrors it
    } catch {
      // keep the stored value
    }
    return {
      company: d.company(),
      fy: d.fy(),
      lookbackDays: c.lookbackDays,
      intervalMin: c.intervalMin,
      tallyHost: c.tally.host,
      tallyPort: c.tally.port,
      autostart,
      cloudCopy: c.cloudCopy,
      cloudCopyAllowed: d.cloudCopyAllowed(),
      language: c.language,
      languages: LANGUAGES,
      voucherBatchSize: c.voucherBatchSize,
      autoUpdateCheck: c.autoUpdateCheck,
      limits: { intervalMin: { ...INTERVAL_LIMITS }, lookbackDays: { ...LOOKBACK_LIMITS }, voucherBatchSize: { ...VOUCHER_BATCH_LIMITS } },
    };
  }

  function reject(code: 'INVALID' | 'FLAG_OFF', field: string, message: string): SettingsResult {
    return { ok: false, code, field, message, settings: get() };
  }

  return {
    get,
    set(raw: unknown): SettingsResult {
      const parsed = PatchSchema.safeParse(raw);
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        const key = issue ? (issue.code === 'unrecognized_keys' ? String((issue as { keys?: string[] }).keys?.[0] ?? 'unknown') : String(issue.path[0] ?? 'unknown')) : 'unknown';
        return reject('INVALID', key, MESSAGES[key] ?? 'This setting is not known.');
      }
      const p: SettingsPatch = parsed.data;
      // turning cloud copy on needs the license feature; turning it off is always allowed
      if (p.cloudCopy === true && !d.cloudCopyAllowed()) {
        return reject('FLAG_OFF', 'cloudCopy', 'The encrypted cloud copy is not part of your plan. Ask your administrator to enable it.');
      }
      const before = d.config();
      const cfg: Parameters<SettingsDeps['updateConfig']>[0] = {};
      if (p.lookbackDays !== undefined) cfg.lookbackDays = p.lookbackDays;
      if (p.intervalMin !== undefined) cfg.intervalMin = p.intervalMin;
      if (p.tallyHost !== undefined || p.tallyPort !== undefined) {
        cfg.tally = { ...(p.tallyHost !== undefined ? { host: p.tallyHost } : {}), ...(p.tallyPort !== undefined ? { port: p.tallyPort } : {}) };
      }
      if (p.autostart !== undefined) cfg.autostart = p.autostart;
      if (p.cloudCopy !== undefined) cfg.cloudCopy = p.cloudCopy;
      if (p.language !== undefined) cfg.language = p.language;
      if (p.voucherBatchSize !== undefined) cfg.voucherBatchSize = p.voucherBatchSize;
      if (p.autoUpdateCheck !== undefined) cfg.autoUpdateCheck = p.autoUpdateCheck;

      // OS login item first: if the OS refuses, nothing else has been written
      if (p.autostart !== undefined && p.autostart !== get().autostart) {
        try {
          d.setAutostart(p.autostart);
        } catch {
          return reject('INVALID', 'autostart', 'Windows did not allow changing start at login. Try again, or change it in Windows Settings.');
        }
      }
      try {
        d.updateConfig(cfg);
      } catch {
        // undo the login item so the call stays all-or-nothing
        if (p.autostart !== undefined && p.autostart !== before.autostart) {
          try {
            d.setAutostart(before.autostart);
          } catch {
            // nothing more can be done
          }
        }
        return reject('INVALID', 'config', 'The settings could not be saved. Try again.');
      }
      const after = d.config();
      if (after.tally.host !== before.tally.host || after.tally.port !== before.tally.port) d.onTallyTargetChanged?.();
      if (after.intervalMin !== before.intervalMin || after.lookbackDays !== before.lookbackDays) d.onSyncSettingsChanged?.();
      if (after.autoUpdateCheck !== before.autoUpdateCheck) d.onAutoUpdateChanged?.(after.autoUpdateCheck);
      d.log?.('settings changed', { keys: Object.keys(p) });
      return { ok: true, settings: get() };
    },
  };
}
