/*
LazyBooks | src/renderer/theme/ThemeProvider.tsx
Responsibility: Theme state: IPC preference, built-in plus validated custom themes, system mode tracking
Introduced by: Phase 4 (ui-shell)
STATUS: IMPLEMENTED (Phase 4)
*/
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ThemeMode, ThemeState } from '../../shared/ipc';
import { BUILTIN_THEMES, DEFAULT_SLUG, defaultTheme } from './builtin';
import { systemPrefersDark, writeCache } from './boot';
import { applyTheme, resolveMode, validateTheme, type Theme } from './engine';

interface ThemeContextValue {
  themes: Theme[];
  theme: Theme;
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  invalidCustom: number;
  setTheme(slug: string): void;
  setMode(mode: ThemeMode): void;
}

const Ctx = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme outside ThemeProvider');
  return v;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>({ slug: DEFAULT_SLUG, mode: 'system', custom: [] });
  const [dark, setDark] = useState<boolean>(systemPrefersDark());

  const refresh = useCallback(() => {
    void window.lb.theme.get().then(setState);
  }, []);

  useEffect(() => {
    refresh();
    // Picks up theme JSON files dropped into the themes folder while the window was in the background.
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, [refresh]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = (e: MediaQueryListEvent): void => setDark(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const { themes, invalidCustom } = useMemo(() => {
    const bySlug = new Map<string, Theme>(BUILTIN_THEMES.map((t) => [t.slug, t]));
    let bad = 0;
    for (const raw of state.custom) {
      const v = validateTheme(raw);
      if (!v.ok) {
        bad += 1;
        continue;
      }
      const prev = bySlug.get(v.theme.slug);
      // A higher version replaces the cached/built-in one; an equal or lower one is ignored.
      if (!prev || v.theme.version > prev.version) bySlug.set(v.theme.slug, v.theme);
    }
    return { themes: [...bySlug.values()], invalidCustom: bad };
  }, [state.custom]);

  const theme = themes.find((t) => t.slug === state.slug) ?? defaultTheme();
  const resolvedMode = resolveMode(state.mode, dark);

  useEffect(() => {
    applyTheme(theme, resolvedMode);
    writeCache({ theme, mode: state.mode });
  }, [theme, resolvedMode, state.mode]);

  const value: ThemeContextValue = {
    themes,
    theme,
    mode: state.mode,
    resolvedMode,
    invalidCustom,
    setTheme: (slug) => void window.lb.theme.set({ slug }).then(setState),
    setMode: (mode) => void window.lb.theme.set({ mode }).then(setState),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
