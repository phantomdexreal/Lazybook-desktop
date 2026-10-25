# DEPENDENCY_VERSIONS — LazyBooks Desktop (Connector)

**Locked manifest. Every session installs exactly these. Do not upgrade without updating this file and `PHASE_STATUS.md`.**
Nothing is pinned yet. At Phase 1 resolve exact versions with `npm view`, verify they work together, and record them here.

## Runtime
| Tool | Version | Notes |
|---|---|---|
| Node.js | `>=20.0.0 <23.0.0` (`.nvmrc` = `22`) | Not 18, not 23+ |
| npm | `>=10.0.0` | no yarn/pnpm unless a phase migrates |

## Pinned now (also in package.json)
| Package | Exact version | Install | Kind |
|---|---|---|---|
| electron | 45.0.0 | `npm i -D -E` | dev |
| electron-vite | 6.0.0 | `npm i -D -E` | dev (build/dev tooling; main/preload/renderer split) |
| vite | 8.3.5 | `npm i -D -E` | dev (peer of electron-vite 6) |
| typescript | 5.9.3 | `npm i -D -E` | dev (5.x chosen on purpose; 7.x native compiler not used with electron-vite) |
| @vitejs/plugin-react | 6.1.2 | `npm i -D -E` | dev |
| @types/node | 22.20.5 | `npm i -D -E` | dev (matches Node 22 in `.nvmrc`) |
| @types/react / @types/react-dom | 19.3.0 | `npm i -D -E` | dev |
| react / react-dom | 19.3.1 | `npm i -E` | renderer |
| @phosphor-icons/react | 2.1.10 | `npm i -E` | renderer (only icon set) |
| @fontsource/inter, @fontsource/jetbrains-mono | 5.3.0 | `npm i -E` | renderer (bundled fonts, no CDN) |
| tailwindcss | 3.4.19 | `npm i -D -E` | dev (Tailwind 3, not 4; colours mapped to `--lb-*` only) |
| postcss / autoprefixer | 8.5.31 / 10.6.1 | `npm i -D -E` | dev (configured inline in `electron.vite.config.ts`) |
| zod | 4.6.7 | `npm i -E` | main (config schema; IPC validation later) |
| qrcode-generator | 2.0.4 | `npm i -E` | main (pairing QR as SVG, Phase 21; MIT, offline, no deps) |

* Pin everything; commit the lockfile.

### Resolved at `scaffold` (Phase 1, 2026-10-24) - versions found with `npm view`; only the packages Phase 1 needs are installed
Installed now: the table above. Resolved but NOT yet installed (install in the phase that first uses them, pin exactly, move the row into the table): `@supabase/supabase-js` 2.118.0 (Phase 5), `better-sqlite3` 13.0.3 (Phase 15, verify a prebuilt binary for Electron 45 first, else `sql.js`), `electron-builder` 26.18.0 (Phase 38), `electron-updater` 6.8.11 (Phase 39), `fast-xml-parser` 5.11.2 (Phase 8), `vitest` 5.0.5 (first phase that adds tests). Tailwind 3 is installed (Phase 4); do not use Tailwind 4.
**Phase 5 note (2026-10-24):** `@supabase/supabase-js` 2.118.0 was NOT installed: the sandbox had no network. `src/main/supabase.ts` is a small fetch-based client (GoTrue password/refresh + PostgREST) behind the `TargetClient` seam. Install supabase-js (pinned, `npm i -E`) in the first phase that needs Realtime (Phase 19/24) or earlier if preferred, and swap the internals of `TargetClient` only.
Installs in sandboxes: use `ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install` when the Electron binary is not needed.

**Phase 15 note (2026-10-25):** `better-sqlite3` 13.0.3 (dependency) and `@types/better-sqlite3` 9.6.0 (dev) are now pinned in `package.json` and the lockfile. Chosen over `sql.js` because the prebuilt binary loads under Node 22 and it gives synchronous WAL, `VACUUM INTO` and 64-bit integers. Not yet confirmed: a prebuilt/rebuilt binary for Electron 45 (Phase 38: `electron-builder install-app-deps`, `asarUnpack: better-sqlite3`; fallback `sql.js`).

**Phase 38 note (2026-10-25):** `electron-builder` 26.18.0 is now pinned in `package.json` (dev, `npm i -D -E`) and the lockfile. `electron-updater` 6.8.11 is still not installed (Phase 39).

**Phase 39 note (2026-10-25):** `electron-updater` 6.8.11 is now pinned in `package.json` (dependency, `npm i -E`) and the lockfile. It is imported only by `src/main/index.ts`; the logic in `updater.ts` is tested with a fake.

### Original resolve list (kept for reference)
Electron (current stable at that time), electron-vite (or equivalent), TypeScript, React + the same Tailwind 3 stack as the PWA for the renderer, `@supabase/supabase-js` 2.x,
SQLite binding (`better-sqlite3` preferred — verify a prebuilt binary exists for the chosen Electron; otherwise `sql.js` and record the trade-off), `electron-builder`, `electron-updater`, `fast-xml-parser` (or `xml2js`), `zod` (IPC/config validation), Vitest.
### Rules
Native modules must be rebuilt for Electron's ABI in CI (`electron-builder install-app-deps`). Windows code-signing is NOT available at zero cost — document the SmartScreen workaround in README.

## Packages that must NOT be installed
Anything that needs a server in the static kits (`@supabase/ssr`, `next-auth`, server-only SDKs), any second icon library, `moment` (use `Intl`/`date-fns` only if a phase justifies it), any analytics/tracking SDK, any CDN-loaded script/font.

## `.nvmrc`
```
22
```
