/*
LazyBooks | src/renderer/lib/settingsForm.ts
Responsibility: Pure helpers for the Settings form (text fields to a patch, local validation, dirty check)
Introduced by: Phase 35 (ui-settings)
STATUS: IMPLEMENTED (Phase 35)
*/

import { VOUCHER_BATCH } from '../../shared/constants';
import type { SettingsPatch, SettingsView } from '../../shared/ipc';

/** The form keeps numbers as text so a half-typed value does not jump around. */
export interface FormState {
  lookbackDays: string;
  intervalMin: string;
  tallyHost: string;
  tallyPort: string;
  autostart: boolean;
  cloudCopy: boolean;
  language: SettingsView['language'];
}

export function toForm(s: SettingsView): FormState {
  return {
    lookbackDays: String(s.lookbackDays),
    intervalMin: String(s.intervalMin),
    tallyHost: s.tallyHost,
    tallyPort: String(s.tallyPort),
    autostart: s.autostart,
    cloudCopy: s.cloudCopy,
    language: s.language,
  };
}

const INT_RE = /^\d{1,6}$/;

/** First problem per field, in plain words; empty object when the form can be saved. */
export function validate(f: FormState, s: SettingsView): Partial<Record<keyof FormState, string>> {
  const e: Partial<Record<keyof FormState, string>> = {};
  const inRange = (v: string, min: number, max: number): boolean => INT_RE.test(v.trim()) && Number(v) >= min && Number(v) <= max;
  const i = s.limits.intervalMin;
  const l = s.limits.lookbackDays;
  if (!inRange(f.intervalMin, i.min, i.max)) e.intervalMin = `Enter whole minutes from ${i.min} to ${i.max}.`;
  if (!inRange(f.lookbackDays, l.min, l.max)) e.lookbackDays = `Enter whole days from ${l.min} to ${l.max}.`;
  if (!/^[A-Za-z0-9.-]{1,253}$/.test(f.tallyHost.trim())) e.tallyHost = 'Enter a host name or address (letters, digits, dots and dashes).';
  if (!inRange(f.tallyPort, 1, 65535)) e.tallyPort = 'Enter a port from 1 to 65535.';
  if (f.cloudCopy && !s.cloudCopyAllowed && !s.cloudCopy) e.cloudCopy = 'Not part of your plan.';
  return e;
}

/** Only the fields that differ from what is stored (an unchanged form gives an empty patch). Call after `validate` found no problem. */
export function toPatch(f: FormState, s: SettingsView): SettingsPatch {
  const p: SettingsPatch = {};
  if (Number(f.lookbackDays) !== s.lookbackDays) p.lookbackDays = Number(f.lookbackDays);
  if (Number(f.intervalMin) !== s.intervalMin) p.intervalMin = Number(f.intervalMin);
  if (f.tallyHost.trim() !== s.tallyHost) p.tallyHost = f.tallyHost.trim();
  if (Number(f.tallyPort) !== s.tallyPort) p.tallyPort = Number(f.tallyPort);
  if (f.autostart !== s.autostart) p.autostart = f.autostart;
  if (f.cloudCopy !== s.cloudCopy) p.cloudCopy = f.cloudCopy;
  if (f.language !== s.language) p.language = f.language;
  return p;
}

export function isDirty(f: FormState, s: SettingsView): boolean {
  return Object.keys(toPatch(f, s)).length > 0;
}

/** "01 Apr 2026 to 31 Mar 2027"; '-' when unknown. Input is Tally's ISO date (YYYY-MM-DD). */
export function fyText(fy: SettingsView['fy']): string {
  if (!fy || !fy.from || !fy.to) return '-';
  const f = (iso: string): string => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return iso;
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(m[2]) - 1] ?? m[2];
    return `${m[3]} ${mon} ${m[1]}`;
  };
  return `${f(fy.from)} to ${f(fy.to)}`;
}

/** Phase 47: presets offered next to the vouchers-per-batch input. */
export const BATCH_PRESETS: readonly number[] = [100, 250, 500, 1000];

/** First problem with the typed batch size, in plain words; null when it can be saved. */
export function batchSizeError(text: string, s: SettingsView): string | null {
  const { min, max } = s.limits.voucherBatchSize;
  const t = text.trim();
  if (!INT_RE.test(t) || Number(t) < min || Number(t) > max) return `Enter a whole number of vouchers from ${min} to ${max}.`;
  return null;
}

/** Empty patch when the typed value equals the stored one. Call after `batchSizeError` returned null. */
export function batchSizePatch(text: string, s: SettingsView): SettingsPatch {
  const n = Number(text.trim());
  return n !== s.voucherBatchSize ? { voucherBatchSize: n } : {};
}

/** The value the "Reset to default" button puts back (the default is a constant, never typed twice). */
export function batchSizeDefaultText(): string {
  return String(VOUCHER_BATCH.sizeDefault);
}

/** Plain help text for the setting; mentions the default and that a change applies from the next sync. */
export function batchSizeHelp(s: SettingsView): string {
  return `Lower this if Tally freezes or times out. Higher is faster for small companies. This is how many vouchers LazyBooks asks Tally for at a time (${s.limits.voucherBatchSize.min} to ${s.limits.voucherBatchSize.max}); the default is ${VOUCHER_BATCH.sizeDefault}. A change applies from the next sync.`;
}

/** Patch for the automatic update switch (saved at once, not with the form). */
export function autoUpdatePatch(on: boolean): SettingsPatch {
  return { autoUpdateCheck: on };
}
