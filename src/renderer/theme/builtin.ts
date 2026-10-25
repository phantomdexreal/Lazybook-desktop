/*
LazyBooks | src/renderer/theme/builtin.ts
Responsibility: Built-in themes, imported straight from docs/shared/themes (single source, byte-identical across repos)
Introduced by: Phase 4 (ui-shell)
STATUS: IMPLEMENTED (Phase 4)
*/
import obsidianViolet from '../../../docs/shared/themes/obsidian-violet.json';
import graphiteIris from '../../../docs/shared/themes/graphite-iris.json';
import inkLilac from '../../../docs/shared/themes/ink-lilac.json';
import { validateTheme, type Theme } from './engine';

export const DEFAULT_SLUG = 'obsidian-violet';

export const BUILTIN_THEMES: Theme[] = [obsidianViolet, graphiteIris, inkLilac].flatMap((raw) => {
  const r = validateTheme(raw);
  return r.ok ? [r.theme] : [];
});

export function defaultTheme(): Theme {
  const t = BUILTIN_THEMES.find((x) => x.slug === DEFAULT_SLUG) ?? BUILTIN_THEMES[0];
  if (!t) throw new Error('no valid built-in theme');
  return t;
}
