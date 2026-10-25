/*
LazyBooks | src/renderer/theme/engine.ts
Responsibility: Theme engine (THEME_SCHEMA.md): validation, contrast gate, CSS variable generation, apply
Introduced by: Phase 4 (ui-shell)
STATUS: IMPLEMENTED (Phase 4)
*/
import type { ThemeMode } from '../../shared/ipc';

export const TOKEN_KEYS = [
  'bg', 'surface', 'surface_raised', 'surface_sunken', 'border', 'border_strong', 'text', 'text_muted', 'text_faint',
  'accent', 'accent_hover', 'accent_active', 'accent_contrast', 'accent_soft', 'focus_ring', 'success', 'warning',
  'danger', 'info', 'overlay', 'shadow_color',
] as const;
export type TokenKey = (typeof TOKEN_KEYS)[number];

export type ModeTokens = Record<TokenKey, string> & { chart: string[] };

export interface Theme {
  schema_version: 1;
  slug: string;
  name: string;
  version: number;
  author?: string;
  description?: string;
  shared: {
    radius: { sm: string; md: string; lg: string; xl: string };
    font_sans: string;
    font_mono: string;
    motion: { fast: string; base: string; slow: string };
    density_default: string;
  };
  modes: { dark: ModeTokens; light: ModeTokens };
}

export type ValidationResult = { ok: true; theme: Theme } | { ok: false; errors: string[] };

const HEX = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGBA = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\)$/;
const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;
// Values are written into a <style> element, so anything that could break out of a declaration is refused.
const SAFE_CSS_VALUE = /^[^;{}<>\\]*$/;

const isColour = (v: unknown): v is string => typeof v === 'string' && (HEX.test(v) || RGBA.test(v));

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1, 7), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const RULES: Array<[TokenKey, TokenKey, number]> = [
  ['text', 'bg', 7], ['text', 'surface', 7], ['text_muted', 'surface', 4.5], ['text_muted', 'bg', 4.5],
  ['text_faint', 'surface', 3], ['accent_contrast', 'accent', 4.5], ['accent', 'bg', 3], ['accent', 'surface', 3],
  ['danger', 'surface', 3], ['success', 'surface', 3], ['warning', 'surface', 3],
];

export function validateTheme(raw: unknown): ValidationResult {
  const errors: string[] = [];
  const t = raw as Partial<Theme> | null;
  if (!t || typeof t !== 'object') return { ok: false, errors: ['theme is not an object'] };
  if (t.schema_version !== 1) errors.push('schema_version must be 1');
  if (typeof t.slug !== 'string' || !SLUG.test(t.slug)) errors.push('slug invalid');
  if (typeof t.name !== 'string' || !t.name) errors.push('name missing');
  if (typeof t.version !== 'number') errors.push('version missing');
  const s = t.shared;
  if (!s || typeof s !== 'object') errors.push('shared missing');
  else {
    for (const k of ['sm', 'md', 'lg', 'xl'] as const) {
      if (typeof s.radius?.[k] !== 'string' || !SAFE_CSS_VALUE.test(s.radius[k])) errors.push(`shared.radius.${k} invalid`);
    }
    for (const k of ['fast', 'base', 'slow'] as const) {
      if (typeof s.motion?.[k] !== 'string' || !SAFE_CSS_VALUE.test(s.motion[k])) errors.push(`shared.motion.${k} invalid`);
    }
    for (const k of ['font_sans', 'font_mono'] as const) {
      if (typeof s[k] !== 'string' || !SAFE_CSS_VALUE.test(s[k])) errors.push(`shared.${k} invalid`);
    }
  }
  for (const mode of ['dark', 'light'] as const) {
    const m = t.modes?.[mode] as Partial<ModeTokens> | undefined;
    if (!m) {
      errors.push(`modes.${mode} missing`);
      continue;
    }
    for (const k of TOKEN_KEYS) if (!isColour(m[k])) errors.push(`modes.${mode}.${k} missing or not a colour`);
    if (!Array.isArray(m.chart) || m.chart.length !== 8 || !m.chart.every(isColour)) errors.push(`modes.${mode}.chart must be 8 colours`);
    for (const [fg, bg, min] of RULES) {
      const a = m[fg];
      const b = m[bg];
      if (typeof a === 'string' && typeof b === 'string' && HEX.test(a) && HEX.test(b) && contrast(a, b) < min) {
        errors.push(`modes.${mode}: ${fg} on ${bg} contrast below ${min}`);
      }
    }
  }
  return errors.length ? { ok: false, errors } : { ok: true, theme: t as Theme };
}

const cssName = (k: string): string => k.replace(/_/g, '-');

/** CSS text for one theme: shared variables plus one rule per mode. */
export function themeCss(t: Theme): string {
  const shared = [
    ...(['sm', 'md', 'lg', 'xl'] as const).map((k) => `--lb-radius-${k}:${t.shared.radius[k]}`),
    `--lb-font-sans:${t.shared.font_sans}`,
    `--lb-font-mono:${t.shared.font_mono}`,
    ...(['fast', 'base', 'slow'] as const).map((k) => `--lb-motion-${k}:${t.shared.motion[k]}`),
  ];
  return (['dark', 'light'] as const)
    .map((mode) => {
      const m = t.modes[mode];
      const vars = [
        ...shared,
        ...TOKEN_KEYS.map((k) => `--lb-${cssName(k)}:${m[k]}`),
        ...m.chart.map((c, i) => `--lb-chart-${i + 1}:${c}`),
        `color-scheme:${mode}`,
      ];
      return `:root[data-theme="${t.slug}"][data-mode="${mode}"]{${vars.join(';')}}`;
    })
    .join('\n');
}

export function resolveMode(pref: ThemeMode, systemPrefersDark: boolean): 'light' | 'dark' {
  return pref === 'system' ? (systemPrefersDark ? 'dark' : 'light') : pref;
}

const STYLE_ID = 'lb-theme-style';

/** Install the theme's CSS and select it on the root element. DOM only; never called from Node tests. */
export function applyTheme(t: Theme, mode: 'light' | 'dark'): void {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = themeCss(t);
  document.documentElement.dataset['theme'] = t.slug;
  document.documentElement.dataset['mode'] = mode;
}
