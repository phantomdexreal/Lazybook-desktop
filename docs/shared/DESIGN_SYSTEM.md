# DESIGN_SYSTEM — LazyBooks

**Identity:** violet and black. Sleek, calm, precise — an accounting tool, not a landing page. It must not look like generic AI output.

## Look
* Dark is the hero (near-black surfaces `#0A0910…`), light is a first-class equal. Accent = restrained violet used sparingly: primary actions, selection, focus, key numbers.
* Elevation by **surface tone and 1px borders**, not neumorphism, not glassmorphism, not heavy shadows. Shadows only for floating layers (sheets, menus, toasts).
* 4px spacing grid. Radius from the theme (`--lb-radius-*`). Dense-but-breathable tables; comfortable and compact densities.
* Type: Inter (UI), JetBrains Mono (figures in tables, voucher numbers). Bundle fonts with `@fontsource/*` (no remote font CDNs; offline-first). Tabular numerals for all amounts.
* Motion: 120–200 ms ease-out for state changes; no bouncing, no parallax; honour `prefers-reduced-motion`.

## "Not AI-looking" checklist (reviewers reject UI that fails any item)
No gradient blobs/orbs, no sparkle/magic-wand icons, no emoji anywhere, no default Tailwind blue/indigo, no rainbow gradients on text, no giant glass cards,
no centered hero blocks inside the app, no placeholder lorem, no 'Welcome back!' fluff. Real labels, real empty states with a next action, consistent alignment.

## Navigation (no hamburger menus)
* Mobile: bottom tab bar (5): Home, Parties, Reports, Stock, More. Desktop/tablet ≥ `md`: left side rail with the same destinations.
* **More** = full-screen launcher grid grouped exactly like `FEATURE_MATRIX.md` (every module reachable in ≤ 2 taps) + **command palette** (Ctrl/⌘+K; on mobile a search field at top of More).
* Back stack and breadcrumbs on detail pages. Sheets (bottom on mobile, side on desktop) for pickers/settings, not full navigations.

## Components & rules
* Icons: **Phosphor only** (`light` default, `bold` for active, `duotone` for empty states). No other icon set, no custom SVG icons.
* **No emoji anywhere** — not in the UI, docs, code comments, commit messages, logs or notifications. Status is shown with words and Phosphor icons.
* Amounts: `AmountText` — Indian digit grouping (12,34,567.00), ₹ symbol where applicable, Dr/Cr suffix for ledger balances, negative in `--lb-danger` only where meaning is loss/overdue.
* Tables: virtualised; sticky header; row height 44 (comfortable) / 36 (compact); keyboard navigation on desktop.
* States: Skeleton (loading), EmptyState (with action), ErrorState (with retry + error code from SHARED_CONTRACTS §9). Never a blank screen.
* Touch targets ≥ 44 px. Focus ring = `--lb-focus-ring`, 2px, always visible on keyboard focus.
* Dark and light must both be verified for every screen. Charts use `--lb-chart-1..8` only.
* Offline is normal: show data freshness ("As of 10:42, desktop offline"), never hide data because of it.

## Accessibility
WCAG AA minimum (themes are contrast-gated), labelled controls, screen-reader names for icon buttons, focus management in sheets, no colour-only meaning.
