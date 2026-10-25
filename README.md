# LazyBooks Desktop (Connector)

Windows tray app that reads Tally, keeps the SQLite vault, answers device requests through the postbox, writes entries back into Tally, and can host the PWA.

Part of **LazyBooks** (4 repos): `lazybooks-admin`, `lazybooks-desktop`, `lazybooks-pwa`, `lazybooks-mobile`. Start with `docs/shared/ECOSYSTEM.md`.

## Status
Planning kit plus phased implementation. Progress is tracked in `PHASE_STATUS.md` (Phase 1 scaffold done).

## Develop
```
npm install
npm run dev        # starts tools/mock-tally on 127.0.0.1:9000, then the Electron app (tray + status window)
npm run typecheck
npm run build
```
### Windows installer
```
npm install
npm run dist        # on Windows: builds release/LazyBooks-Setup-<version>.exe (one-click, per-user, no admin rights)
npm run pack        # unpacked app in release/win-unpacked for a quick look
npm run icons       # regenerate the placeholder icons; replace build/icon.ico and build/icon.png with real artwork
```
The installer is unsigned (no zero-cost code signing). On first run Windows SmartScreen may say "Windows protected your PC": click "More info", then "Run anyway". The uninstaller asks whether to also delete your data (`%APPDATA%\LazyBooks`); the default is No, so a reinstall continues where you left off.

## How to work (human)
1. Give the zip to a fresh Claude session with the prompt below (replace NN).
2. It does exactly one phase, updates `PHASE_STATUS.md`, re-zips (`lazybooks-desktop_phaseNN.zip`) and hands it back.
3. Repeat. Commit each phase to GitHub (`phase NN: <what>`).

### Prompt for each session
> Read `CLAUDE_MUST_READ.md` inside the zip first, then `PHASE_STATUS.md`, then Phase NN in `PHASES.md`, then `DEPENDENCY_VERSIONS.md`. Don't extract the entire zip — extract only what this phase needs. Don't list the archive. Read the minimum, write from understanding, verify as the phase says. Respect `docs/shared/LEGAL_REFERENCE_ONLY.md` (clean-room) and `docs/shared/ZERO_COST_PLAN.md` (no paid services). Re-zip early if time is short. Do not read any skill .md files.

## Wipe local data (escape hatches)
Vault reset: Tools → Reset vault (Phase `ui-tools`). Escape hatch: quit the app, delete `%APPDATA%/LazyBooks/vault/` (keep `config.json` to retain activation), relaunch → full resync.
