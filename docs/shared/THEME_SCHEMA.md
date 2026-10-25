# THEME_SCHEMA — LazyBooks themes (schema_version 1)

A theme is one JSON document with BOTH a `dark` and a `light` mode. The user picks a theme and a mode (`system|light|dark`).
Admin pushes themes (master table `themes`); apps receive the list via `app_bootstrap().themes` and fetch full JSON via `get_themes()`.
Samples: `themes/obsidian-violet.json` (default), `graphite-iris.json`, `ink-lilac.json` — all pass the contrast rules below.

```json
{
  "schema_version": 1, "slug": "obsidian-violet", "name": "Obsidian Violet", "version": 1,
  "author": "LazyBooks", "description": "...",
  "shared": {
    "radius": {"sm":"6px","md":"10px","lg":"14px","xl":"20px"},
    "font_sans": "Inter, system-ui, ...", "font_mono": "'JetBrains Mono', ui-monospace, ...",
    "motion": {"fast":"120ms","base":"200ms","slow":"320ms"}, "density_default": "comfortable"
  },
  "modes": { "dark": { ...tokens... }, "light": { ...tokens... } }
}
```
## Mode tokens (all required, hex or rgba)
`bg, surface, surface_raised, surface_sunken, border, border_strong, text, text_muted, text_faint, accent, accent_hover, accent_active,
accent_contrast, accent_soft, focus_ring, success, warning, danger, info, overlay, shadow_color` and `chart` (array of exactly 8 colours).

## CSS variable mapping
Each token becomes `--lb-<token with _ → ->` on `:root[data-theme="<slug>"][data-mode="dark|light"]`, e.g. `--lb-surface-raised`.
Shared: `--lb-radius-sm|md|lg|xl`, `--lb-font-sans`, `--lb-font-mono`, `--lb-motion-fast|base|slow`. Chart: `--lb-chart-1..8`.
Components use ONLY these variables (no hex literals anywhere outside theme JSON and `styles/tokens.css` fallbacks).
Shadows are derived: `0 1px 2px rgb(from var(--lb-shadow-color) / .25)` style via color-mix, defined once in `tokens.css`.

## Resolution
1. `mode` = user pref (`system|light|dark`) → resolved via `prefers-color-scheme` when `system`.
2. `theme` = user pref if allowed by `theme_policy` and `allow_user_switch`, else `theme_policy.default`, else built-in `obsidian-violet`.
3. Apply before first paint (inline script reads `localStorage` mirror of the pref) to avoid flashes.
4. A theme with a higher `version` than the cached one replaces it; an invalid theme is ignored and the previous valid one stays.

## Validation (engine, admin publish gate — same code in `lib/theme/contrast.*`)
* All tokens present, valid colours, `chart.length == 8`.
* WCAG contrast per mode: `text/bg ≥ 7`, `text/surface ≥ 7`, `text_muted/surface ≥ 4.5`, `text_muted/bg ≥ 4.5`, `text_faint/surface ≥ 3`,
  `accent_contrast/accent ≥ 4.5`, `accent/bg ≥ 3`, `accent/surface ≥ 3`, `danger|success|warning / surface ≥ 3`.
* Admin refuses to publish a failing theme; the apps defensively re-check and fall back.

## Branding vs theme
Theme = colours/shape/type. Branding = logo/icon/app name (`branding_sets`, Storage bucket `branding`). They are pushed independently and versioned independently.
Logo variants: `logo_light` (for light surfaces), `logo_dark` (for dark surfaces), `icon` (square ≥ 512), `favicon`, `splash`. The admin panel generates
192/512/maskable PNGs, Android adaptive foreground/background and favicon sizes in the browser before upload.
