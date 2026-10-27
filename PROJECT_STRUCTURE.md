# PROJECT_STRUCTURE — LazyBooks Desktop (Connector)

**Edit in place as structure is legitimately introduced. Do not regenerate wholesale.** This is the target layout; `PHASE_STATUS.md` says what actually exists. Files marked `STUB` in their first line are placeholders created by the planning kit — implement them in the phase named here.

Repo root: `lazybooks-desktop/`

| Path | Responsibility | Introduced by |
|---|---|---|
| `.github/workflows/ci.yml` | CI | Phase 1 (`scaffold`) |
| `.github/workflows/release.yml` | Release pipeline: tag, Windows build, installer + latest.yml to the releases repo, draft registered in the master | Phase 42 (`release-desktop`) |
| `tools/release-meta.mjs` | Tag parsing, changelog notes, sha256, `ci-publish-release` payload, latest.yml cross-check, register call (CLI `meta`, `version`, `register`) | Phase 42 (`release-desktop`) |
| `tests/release.cjs` | Node test of the release helpers, the CLI against a local server, and the workflow greps | Phase 42 (`release-desktop`) |
| `CHANGELOG.md` | Release notes, one `## <version>` section per release, copied into the GitHub release and the draft | Phase 42 (`release-desktop`) |
| `src/main/buildEnv.d.ts` | Types for the build-time registry constants | Phase 42 (`release-desktop`) |
| `docs/derived_formulas.md` | OPTIONAL derived tables `drv_*` (perf-driven) | Phase 17 (`derived-tables`) |
| `docs/specs/` | Clean-room behaviour notes | Phase 1 (`scaffold`) |
| `docs/shared/` | Shared contracts, constants, data model, sync/entry/calc/Tally specs, fixtures, demo seeds; byte-identical in all four repos. Reference tools in `docs/shared/fixtures/tools/` (Python), run with `python3 -I` | shared-docs 1.0.3 |
| `electron-builder.yml` | Installer: NSIS one-click per-user, asarUnpack better-sqlite3 | Phase 38 (`installer`) |
| `src/main/updater.ts` | Auto-update: bootstrap offer, GitHub feed from download_url, sha256 check, forced update, electron-updater wrapper (no Electron import) | Phase 39 (`auto-update`) |
| `tests/updater.cjs` | Node-level updater check with a fake driver and real sha256 (`NODE_PATH` must reach typescript 5) | Phase 39 (`auto-update`) |
| `build/installer.nsh` | NSIS hook: uninstall keeps `%APPDATA%\LazyBooks` unless the person says Yes | Phase 38 (`installer`) |
| `build/icon.ico`, `build/icon.png` | Placeholder installer icons (owner replaces) | Phase 38 (`installer`) |
| `tools/gen-icons.mjs` | Generates the placeholder icons | Phase 38 (`installer`) |
| `tests/installer.cjs` | Node-level installer config check (yml, NSIS hook, icons, scripts, electron-builder schema) | Phase 38 (`installer`) |
| `package.json` | Repo scaffold (Electron + TypeScript) | Phase 1 (`scaffold`) |
| `electron.vite.config.ts` | electron-vite config (main, preload, renderer) | Phase 1 (`scaffold`) |
| `tsconfig.json`, `tsconfig.node.json`, `tsconfig.web.json` | TypeScript projects (main/preload/shared; renderer/shared) | Phase 1 (`scaffold`) |
| `tools/dev.mjs` | `npm run dev`: mock Tally + electron-vite dev | Phase 1 (`scaffold`) |
| `tools/mock-tally/server.mjs` | Mock Tally HTTP server | Phase 1 (`scaffold`) |
| `tools/mock-registry/server.mjs` | Mock master registry + connector auth (demo license), started by `npm run dev` | Phase 5 (`activation`) |
| `src/renderer/index.html`, `main.tsx`, `App.tsx`, `env.d.ts` | Renderer entry, blank status page, `window.lb` typing | Phase 1 (`scaffold`) |
| `src/renderer/styles/base.css` | Phase 1 placeholder styles (system colours); replaced by tokens in Phase 4 | Phase 1 (`scaffold`) |
| `tailwind.config.cjs` | Tailwind 3 config; colours/radii map to `--lb-*` variables only | Phase 4 (`ui-shell`) |
| `src/main/themes.ts` | Custom theme files in userData/themes, theme IPC helpers | Phase 4 (`ui-shell`) |
| `src/renderer/theme/{engine,builtin,boot,ThemeProvider}.ts(x)` | Theme engine: validation + contrast gate, CSS variables, built-ins from docs/shared/themes, pre-paint boot, React provider | Phase 4 (`ui-shell`) |
| `src/renderer/components/{Shell,EmptyState}.tsx` | Side rail frame, page header, empty state | Phase 4 (`ui-shell`) |
| `tests/tools.cjs` | Node-level tools check on a real SQLite vault: full resync, reset, diagnostics zip (read back by python and unzip), open folder, zip writer, wiring greps (`NODE_PATH` must reach typescript 5, zod, better-sqlite3) | Phase 37 (`ui-tools`) |
| `tests/devices.cjs` | Node-level devices check: list scoping and order, revoke, force resync, refusals, offline, view helpers, wiring greps (`NODE_PATH` must reach typescript 5) | Phase 36 (`ui-pairing`) |
| `tests/snapshot-retention.cjs` | Node-level snapshot retention check: plan rules, flag and plan gates, repair, orphans, 30-day simulations with a byte-budget-enforcing storage port (`NODE_PATH` must reach typescript 5, zod, better-sqlite3) | Phase 32 (`snapshot-retention`) |
| `tests/snapshot-build.cjs` | Node-level snapshot builder check on a real SQLite vault: LBS1 layout, encryption, parts, manifest, delta, failures; shared reference applier restores the fixtures (`NODE_PATH` must reach typescript 5, zod, better-sqlite3) | Phase 31 (`snapshot-builder`) |
| `tests/tally-company.cjs` | Node-level check: company record via the client equals the shared `tm_company` fixture row; serial paths; sparse and error cases | Phase 9 (`tally-license-info`) |
| `tests/tally-client.cjs` | Node-level check of the Tally XML client: builders, parser, queue/priority, retries, timeouts, error mapping, fixture round trip through the mock Tally | Phase 8 (`tally-xml-client`) |
| `tests/tally-detect.cjs` | Node-level Tally detection check against the mock Tally and fake servers (`NODE_PATH` must reach `typescript`) | Phase 7 (`tally-detect`) |
| `tests/device.cjs` | Node-level device registration/heartbeat/revoke check against the mock registry | Phase 6 (`device-heartbeat`) |
| `tests/activation.cjs` | Node-level activation check against the mock registry (`NODE_PATH` must reach `typescript`) | Phase 5 (`activation`) |
| `tests/theme-engine.cjs` | Node-level theme engine check (shared themes pass, bad themes refused) | Phase 4 (`ui-shell`) |
| `tests/config-secrets.cjs` | Node-level config/migration/secrets check (writes `tests/.tmp`, git-ignored) | Phase 3 (`config-secrets`) |
| `tests/logger-rotation.mjs` | Node-level logger rotation/redaction check (`node tests/logger-rotation.mjs`) | Phase 2 (`tray-lifecycle`) |
| `docs/specs/README.md` | Explains the clean-room notes folder | Phase 1 (`scaffold`) |
| `src/main/calc/*` | OPTIONAL derived tables `drv_*` (perf-driven); NOT created in Phase 17 (D-06, no recorded perf failure), add only on request | Phase 17 (`derived-tables`) |
| `src/main/config.ts` | Config + secure storage | Phase 3 (`config-secrets`) |
| `src/main/crypto/` | E2E crypto (vectors in docs/shared) | Phase 21 (`encryption`) |
| `src/main/crypto/envelope.ts` | Wire crypto: PBKDF2 key, KCV, AES-256-GCM envelope encrypt/decrypt (pure) | Phase 21 (`encryption`) |
| `src/main/crypto/keystore.ts` | Passphrase setup, `crypto.json` salt+KCV, unlock, pairing info, chunker `PayloadEncoder` | Phase 21 (`encryption`) |
| `src/main/crypto/pairing.ts` | Pairing link and SVG QR (no secret) | Phase 21 (`encryption`) |
| `tests/crypto.cjs` | Node test: vectors, encrypted shared sequence, keystore, pairing, chunker integration, python interop | Phase 21 (`encryption`) |
| `src/main/db/` | SQLite vault | Phase 15 (`sqlite-schema`) |
| `src/main/db/*` | SQLite schema + migrations | Phase 15 (`sqlite-schema`) |
| `src/main/db/model.ts` | Typed import of `docs/shared/data_model.json` | Phase 15 (`sqlite-schema`) |
| `src/main/db/schema.ts` | CREATE TABLE/INDEX generated from the data model, schema hash, insert/select SQL | Phase 15 (`sqlite-schema`) |
| `src/main/db/codec.ts` | Wire row to stored row conversion (decimal x10^4, bool, json) | Phase 15 (`sqlite-schema`) |
| `src/main/db/migrate.ts` | Migration runner, migration 1, reference seed | Phase 15 (`sqlite-schema`) |
| `src/main/db/vault.ts` | Open/close, WAL, integrity check, rolling backup, recovery, reset helper | Phase 15 (`sqlite-schema`) |
| `src/main/db/index.ts` | Public surface of the vault module | Phase 15 (`sqlite-schema`) |
| `src/main/db/seq.ts` | Change counter and meta helpers | Phase 16 (`upsert-layer`) |
| `tests/vault-upsert.cjs` | Node test of upsert, tombstones, delta, cursors | Phase 16 (`upsert-layer`) |
| `tests/sqlite-vault.cjs` | Node test of the vault (SCHEMA-01/02, kill -9, recovery) | Phase 15 (`sqlite-schema`) |
| `src/main/db/cursors.ts` | Upsert layer + change tracking | Phase 16 (`upsert-layer`) |
| `src/main/db/upsert.ts` | Upsert layer + change tracking | Phase 16 (`upsert-layer`) |
| `src/main/device.ts` | Device registration + heartbeat | Phase 6 (`device-heartbeat`) |
| `src/main/entries/` | Write-back | Phase 24 (`entry-listener`) |
| `src/main/entries/alter.ts` | Alter (replace) / cancel / delete handlers; delegates the e-invoice and e-way actions to `einvoice.ts` | Phase 30 (`alter-cancel-delete`) |
| `src/main/entries/builders/*` | Voucher XML builders: `decimal.ts` (exact BigInt decimals), `types.ts` (BuildLookup, BuildError, BuildResult), `validate.ts` (schema from `entry_rules.json` + S01-S11), `voucher.ts` (XML writer and per-kind builders), `lookup.ts` (BuildLookup over table rows), `index.ts` | Phase 25 (`xml-builders`) |
| `src/main/entries/einvoice.ts` | E-invoice + e-way actions (`alter.action` einvoice_generate / einvoice_cancel / eway_generate / eway_cancel), also the `alter` handler registration seam | Phase 29 (`einvoice-actions`) |
| `src/main/entries/idempotency.ts` | Idempotency + duplicate guard: `createEntryHandlers` (pre-check by REMOTEID / master name, post, read-back, voucher number guard, single-flight), `findVoucherByRemoteId`, `findMasterByName` | Phase 27 (`idempotency`) |
| `src/main/entries/listener.ts` | Entry listener | Phase 24 (`entry-listener`) |
| `src/main/entries/masters/*` | Master creation: `types.ts` (MasterLookup, MasterResult), `lookup.ts` (`masterLookupFromTables`, duplicate-name maps incl. aliases), `validate.ts` (schema, refs, flag, MASTER_EXISTS), `ledger.ts` and `stock-item.ts` (the `<LEDGER>` / `<STOCKITEM>` elements), `build.ts` (`buildMasterImport`), `index.ts` | Phase 26 (`master-writers`) |
| `src/main/entries/results.ts` | Result + error mapping: `RESULT_DETAILS` / `ruleFor` (entry_rules.json detail table), `matchTallyMessage` / `mapTallyMessage` (`tally_message_map` + local patterns), `friendlyMessage`, `mapImportFailure`, `rawOf`, `checkResultShape` | Phase 28 (`result-mapping`) |
| `src/main/index.ts` | Main entry | Phase 1 (`scaffold`) |
| `src/main/errors.ts` | LbError + JSON-over-HTTP helper | Phase 5 (`activation`) |
| `src/main/activation.ts` | Activation orchestration + 30-min bootstrap loop | Phase 5 (`activation`) |
| `src/main/lifecycle.ts` | Tray, autostart, logging | Phase 2 (`tray-lifecycle`) |
| `src/main/logger.ts` | Tray, autostart, logging | Phase 2 (`tray-lifecycle`) |
| `src/main/postbox/` | Postbox server side | Phase 19 (`request-listener`) |
| `src/main/postbox/chunker.ts` | Chunker (pure: rows/ops to chunk drafts, addressing, sequence checks) | Phase 20 (`chunker`) |
| `src/main/postbox/hygiene.ts` | Backpressure + cleanup | Phase 23 (`postbox-hygiene`) |
| `src/main/postbox/listener.ts` | Request listener | Phase 19 (`request-listener`) |
| `src/main/postbox/serve.ts` | Serve initial + delta: vault to encrypted `sync_chunks`, ack watcher moves the device cursor | Phase 22 (`serve-initial-delta`) |
| `src/main/postbox/hygiene.ts` | Backpressure (40 unacked chunks per device), retry/backoff, request budget, expired-chunk sweep, persisted outbox | Phase 23 (`postbox-hygiene`) |
| `tests/entry-alter.cjs` | Node test: replace, cancel and delete against a stateful fake Tally and the shared alter, cancel, delete examples (conflict, retries, refusals, lost answer, e-invoice delegation; `NODE_PATH` needs typescript 5) | Phase 30 (`alter-cancel-delete`) |
| `tests/entry-einvoice.cjs` | Node test: e-invoice and e-way actions against a stateful fake Tally (generate, cancel, e-way, conflict, idempotent shortcuts, rejections, lost answer, guards; `NODE_PATH` needs typescript 5) | Phase 29 (`einvoice-actions`) |
| `tests/entry-results.cjs` | Node test: detail table equals `entry_rules.json`, every `tally_message_map` pattern, shared results example through the real import parser, raw text and shape rules (`NODE_PATH` needs typescript 5) | Phase 28 (`result-mapping`) |
| `tests/entry-idempotency.cjs` | Node test: stateful fake Tally (REMOTEID overwrite, lost answers, crashes): pre-check, kill mid-post, failed pre-check, result handling, number guard, masters, single flight, every valid shared example (`NODE_PATH` needs typescript 5) | Phase 27 (`idempotency`) |
| `tests/entry-masters.cjs` | Node test: master example validation parity, golden XML of ledger and stock item, sign and GST detail, duplicate-name errors, same-request retry, refusals (`NODE_PATH` needs typescript 5; `UPDATE_GOLDEN=1` rewrites the goldens) | Phase 26 (`master-writers`) |
| `tests/entry-builders.cjs` | Node test: validation parity with `entry_examples/index.json`, XML of every valid voucher example (well formed, zero sum, names from `fixtures/tables`, byte-equal to the golden files), sign rules, Alter seam, escaping (`NODE_PATH` needs typescript 5; `UPDATE_GOLDEN=1` rewrites the goldens) | Phase 25 (`xml-builders`) |
| `tests/entry-listener.cjs` | Node test: entry listener claim, dispatch, attempts, crash recovery, offline write-back vs the mock license project (`NODE_PATH` needs typescript) | Phase 24 (`entry-listener`) |
| `tests/hygiene.cjs` | Node test: windowed send, retry, budget, sweep, outbox, serve integration (`NODE_PATH` as for serve.cjs) | Phase 23 (`postbox-hygiene`) |
| `tests/serve.cjs` | Node test: serve initial/delta from a real SQLite vault to the mock license project, reference applier, ack and cursor rules (`NODE_PATH` needs typescript, zod, qrcode-generator, better-sqlite3) | Phase 22 (`serve-initial-delta`) |
| `src/main/pwaHost.ts` | Embedded PWA window: custom-protocol file resolver, LazyHost bridge logic, opt-in window host (no Electron import) | Phase 40 (`embedded-pwa`) |
| `resources/pwa/index.html`, `resources/pwa/pwa-version.json` | Offline stub app that calls every bridge method; replaced by the real PWA export (PEER-06) | Phase 40 (`embedded-pwa`) |
| `tests/pwa-host.cjs` | Node-level bridge round trip (HOST-01), resolver safety, sender trust, opt-in, wiring greps | Phase 40 (`embedded-pwa`) |
| `src/main/hardening.ts` | Production hardening rules (pure): crash-loop guard, low-disk and memory assessment, wall-clock jump watch, hourly health check, load estimate | Phase 41 (`hardening`) |
| `tests/hardening.cjs` | Node test: hardening rules plus the 200k-voucher lookup path on a real SQLite vault, antivirus source audit, wiring greps (`NODE_PATH` with typescript and better-sqlite3; `LB_PERF_N` sets the voucher count) | Phase 41 (`hardening`) |
| `docs/soak_test.md` | The manual 24 hour soak test and its pass rules | Phase 41 (`hardening`) |
| `src/main/registry.ts` | Activation + connector login | Phase 5 (`activation`) |
| `src/main/secrets.ts` | Config + secure storage | Phase 3 (`config-secrets`) |
| `src/main/snapshot/` | Cloud copy | Phase 31 (`snapshot-builder`) |
| `src/main/snapshot/build.ts` | Snapshot builder | Phase 31 (`snapshot-builder`) |
| `src/main/snapshot/retention.ts` | Retention + quota | Phase 32 (`snapshot-retention`) |
| `src/main/settings.ts` | Validates and applies the user-editable settings (all-or-nothing) | Phase 35 (`ui-settings`) |
| `src/main/tools.ts` | Maintenance tools: full resync, reset vault, diagnostics zip, open data folder (no Electron import) | Phase 37 (`ui-tools`) |
| `src/main/zip.ts` | Minimal dependency-free ZIP writer (deflate) for the diagnostics bundle | Phase 37 (`ui-tools`) |
| `src/main/devices.ts` | Connected devices: list, revoke, force resync (no Electron import) | Phase 36 (`ui-pairing`) |
| `src/renderer/lib/devicesView.ts` | Devices page helpers (state words, allowed actions, texts; pure) | Phase 36 (`ui-pairing`) |
| `src/renderer/lib/settingsForm.ts` | Settings form helpers (text to patch, validation, dirty; pure) | Phase 35 (`ui-settings`) |
| `tests/settings.cjs` | Node test of settings validation, flag gate, autostart, config language | Phase 35 (`ui-settings`) |
| `src/main/logs.ts` | Reads, filters and exports the rotating log files, redacted | Phase 34 (`ui-logs`) |
| `src/renderer/lib/logView.ts` | Log viewer helpers (time, preview, labels; pure) | Phase 34 (`ui-logs`) |
| `tests/logs-viewer.cjs` | Node test of the log reader and view helpers | Phase 34 (`ui-logs`) |
| `src/main/status.ts` | Builds the dashboard `Status` from the live modules (pure) | Phase 33 (`ui-status`) |
| `src/renderer/lib/statusView.ts` | Dashboard headline, relative times, labels (pure) | Phase 33 (`ui-status`) |
| `tests/status-dashboard.cjs` | Node test of the status builder and view helpers | Phase 33 (`ui-status`) |
| `src/main/supabase.ts` | Activation + connector login | Phase 5 (`activation`) |
| `src/main/sync/` | Scheduler | Phase 18 (`sync-scheduler`) |
| `src/main/sync/scheduler.ts` | Sync scheduler (timer, single-flight, backoff, cycle commit) | Phase 18 (`sync-scheduler`) |
| `src/main/sync/plan.ts` | Pure planners: pull to vault ops | Phase 18 (`sync-scheduler`) |
| `src/main/sync/progress.ts` | Progress tracker: throttle, rate over 5 batches, ETA rules | Phase 46 (`sync-progress`) |
| `src/shared/syncProgress.ts` | Pure overall percent and count text shared by main and renderer | Phase 46 (`sync-progress`) |
| `src/renderer/lib/progressView.ts` | Pure card texts, percent and visibility rules | Phase 46 (`sync-progress`) |
| `src/renderer/lib/updateView.ts` | Pure status line, Check now gap, banner text and plain-text release notes for the Updates block and the Status banner | Phase 47 (`settings-update-controls`) |
| `src/renderer/components/SyncProgress.tsx` | Progress card on the Status page | Phase 46 (`sync-progress`) |
| `tests/sync-progress.cjs` | Node-level check: tracker, view texts, event sequence of a 5k-voucher sync, no names, wiring | Phase 46 (`sync-progress`) |
| `src/main/sync/stage.ts` | On-disk staging of batched voucher pulls (`_lb_stage`), the `sync-run.json` checkpoint and the resume rules | Phase 45 (`sync-batching`) |
| `tools/gen-big-company.mjs` | Generates a big mock Tally company (50k, 200k presets) for batching, memory and resume tests | Phase 45 (`sync-batching`) |
| `tests/sync-batching.cjs` | Node-level check: batched equals single pull, kill and resume, kill before commit, paging ignored, size per run, 50k memory | Phase 45 (`sync-batching`) |
| `src/main/sync/store.ts` | Read-only vault helpers (stored keys, cursors) | Phase 18 (`sync-scheduler`) |
| `tests/sync-scheduler.cjs` | Node test: scheduler vs mock Tally and real SQLite vault | Phase 18 (`sync-scheduler`) |
| `tests/chunker.cjs` | Node test: chunk limits, order, default omission, addressing; equality with the shared initial and delta examples; reference applier run (`NODE_PATH` must reach `typescript`; needs python3) | Phase 20 (`chunker`) |
| `tests/chunker-apply.py` | Helper for `chunker.cjs`: applies chunk files with the shared reference applier and compares with `fixtures/tables` | Phase 20 (`chunker`) |
| `tests/request-listener.cjs` | Node test: request listener vs the mock license project (real HTTP), fake clock and timers (`NODE_PATH` must reach `typescript`) | Phase 19 (`request-listener`) |
| `src/main/tally/` | Tally client + entity readers | Phase 8 (`tally-xml-client`) |
| `src/main/tally/client.ts` | Tally XML client | Phase 8 (`tally-xml-client`) |
| `src/main/tally/closing.ts` | Closing balances + Tally-computed reports | Phase 13 (`tally-closing`) |
| `src/main/tally/company.ts` | Tally license + company info | Phase 9 (`tally-license-info`) |
| `src/main/tally/detect.ts` | Tally detection + config | Phase 7 (`tally-detect`) |
| `src/main/tally/guards.ts` | Tally edge cases | Phase 14 (`tally-edge`) |
| `src/main/tally/masters/*` | Masters pull | Phase 10 (`tally-masters`) |
| `src/main/tally/masters/index.ts` | Request plan + `createMasters().pull()` | Phase 10 (`tally-masters`) |
| `src/main/tally/masters/map.ts` | Pure mapping of Tally master objects to `tm_*` rows with derived columns | Phase 10 (`tally-masters`) |
| `src/main/tally/masters/columns.ts` | GENERATED tag-to-column map of the master tables | Phase 10 (`tally-masters`) |
| `tools/gen-master-columns.mjs` | Regenerates `masters/columns.ts` from `data_model.json` | Phase 10 (`tally-masters`) |
| `tests/tally-masters.cjs` | Node-level check: masters via the client + mock Tally equal every shared `tm_*` fixture (WIRE-01); mapping edge cases | Phase 10 (`tally-masters`) |
| `src/main/tally/reconcile.ts` | Deleted vouchers + renamed masters | Phase 12 (`tally-deletes-renames`) |
| `tests/tally-reconcile.cjs` | Node-level check: deletion detection vs mock Tally (ops equal the shared delta example), safety guards, rename fix-ups | Phase 12 (`tally-deletes-renames`) |
| `tests/tally-closing.cjs` | Node-level check: closing read vs mock Tally, upserts equal fixture rows and the shared delta example, GST inputs, on-account, schedule helper | Phase 13 (`tally-closing`) |
| `tests/tally-guards.cjs` | Node-level check: restore/FY/company-switch assessment, Tally closed/busy classification, retry delays, clock skew, partial-answer guards | Phase 14 (`tally-edge`) |
| `src/main/tally/vouchers/*` | Vouchers pull (full + incremental) | Phase 11 (`tally-vouchers`) |
| `src/main/tally/vouchers/index.ts` | Request + `createVouchers().pull()` (full, AlterID cursor, lookback) | Phase 11 (`tally-vouchers`) |
| `src/main/tally/vouchers/map.ts` | Pure mapping of VOUCHER objects to `tx_*` rows, derived columns, `tx_tax_line` | Phase 11 (`tally-vouchers`) |
| `src/main/tally/vouchers/columns.ts` | GENERATED tag-to-column map of the voucher tables | Phase 11 (`tally-vouchers`) |
| `tests/tally-vouchers.cjs` | Node-level check: vouchers via the client + mock Tally equal every shared `tx_*` fixture (WIRE-01); incremental, lookback, edge cases | Phase 11 (`tally-vouchers`) |
| `src/main/tally/vouchers/paging.ts` | Paged voucher read (running-counter filter), window count, paging-ignored detection, adaptive batch size; not called by the scheduler until Phase 45 | Phase 44 (`tally-paging`) |
| `tests/tally-paging.cjs` | Node-level check: paging against the mock Tally (sizes 1, 7, 500, above total; window, AlterID, resume, ignored paging, timeouts, count) and the golden request test | Phase 44 (`tally-paging`) |
| `tests/golden-requests.cjs` | Helper: builds every existing Tally request for the golden comparison | Phase 44 (`tally-paging`) |
| `tests/fixtures/xml/golden_requests.json` | Golden XML of every existing request (masters, vouchers, guid list, company, function) captured before the Phase 44 builder change | Phase 44 (`tally-paging`) |
| `tests/tally-paging.cjs` | Node-level check: pages cover every voucher once, golden XML unchanged when paging is off, fallback and halving (PLANNED) | Phase 44 (`tally-paging`) |
| `tools/gen-big-company.mjs` | Generates a mock company with N vouchers (50k, 200k presets) for batching and memory tests (PLANNED) | Phase 45 (`sync-batching`) |
| `tests/sync-batching.cjs` | Node-level check: batched pull equals the single pull, kill and resume, memory on a generated company (PLANNED) | Phase 45 (`sync-batching`) |
| `src/main/sync/progress.ts` | Pure sync progress tracker: stages, throttle, rate, ETA (PLANNED) | Phase 46 (`sync-progress`) |
| `src/renderer/lib/progressView.ts` | Pure texts and percent from a `SyncProgress` (PLANNED) | Phase 46 (`sync-progress`) |
| `src/renderer/components/SyncProgress.tsx` | Progress bar card used by the Status page (PLANNED) | Phase 46 (`sync-progress`) |
| `tests/sync-progress.cjs` | Node-level check: tracker, view texts, event sequence on a generated company (PLANNED) | Phase 46 (`sync-progress`) |
| `docs/specs/voucher-batching.md`, `sync-progress.md`, `update-controls.md`, `tally-real-world-notes.md` | Milestone 9 design notes and real-Tally evidence (written 2026-10-27) | Milestone 9 planning |
| `src/main/tally/xml.ts` | Tally XML client | Phase 8 (`tally-xml-client`) |
| `src/main/tray.ts` | Tray, autostart, logging | Phase 2 (`tray-lifecycle`) |
| `src/main/updater.ts` | Auto-update from GitHub Releases | Phase 39 (`auto-update`) |
| `src/preload/host.ts` | Sandboxed preload of the embedded PWA window: exposes only `window.LazyHost` | Phase 40 (`embedded-pwa`) |
| `src/preload/index.ts` | contextBridge IPC surface | Phase 1 (`scaffold`) |
| `src/renderer/` | React status UI | Phase 4 (`ui-shell`) |
| `src/renderer/*` | Repo scaffold (Electron + TypeScript) | Phase 1 (`scaffold`) |
| `src/renderer/pages/Activate.tsx` | Activation + connector login | Phase 5 (`activation`) |
| `src/renderer/pages/Devices.tsx` | Pairing + devices | Phase 36 (`ui-pairing`) |
| `src/renderer/pages/Logs.tsx` | Logs viewer | Phase 34 (`ui-logs`) |
| `src/renderer/pages/Settings.tsx` | Settings | Phase 35 (`ui-settings`) |
| `src/renderer/pages/Status.tsx` | Status dashboard | Phase 33 (`ui-status`) |
| `src/renderer/pages/Tools.tsx` | Maintenance tools | Phase 37 (`ui-tools`) |
| `src/renderer/styles/tokens.css` | Shared tokens | Phase 4 (`ui-shell`) |
| `src/shared/constants.ts` | CONTRACT_SUPPORTED=1, defaults | Phase 1 (`scaffold`) |
| `src/shared/ipc.ts` | IPC channel names + payload types (single source of truth) | Phase 1 (`scaffold`) |
| `tests/` | Unit + integration | Phase 41 (`hardening`) |
| `tests/fixtures/xml/` | Golden Tally XML (`entry_<example>.xml`, 11 voucher imports built from the shared valid entry examples; `master_ledger.valid.xml`, `master_stock_item.valid.xml`) | Phase 25 (`xml-builders`), Phase 26 (`master-writers`) |
| `tools/fixture-device/` | Fake PWA device for E2E | Phase 19 (`request-listener`) |
| `tools/fixture-device/device.mjs` | Inserts one `sync_requests` row as the owner and polls it to done/failed (exit codes 0/1/2/3) | Phase 19 (`request-listener`) |
| `tools/mock-tally/` | Mock Tally HTTP server + fixtures | Phase 1 (`scaffold`) |

## Always-present root files
`CLAUDE_MUST_READ.md, PHASES.md, PHASE_STATUS.md, MASTERPLAN.md, PROJECT_STRUCTURE.md, API_CONTRACTS.md, DEPENDENCY_VERSIONS.md, README.md, package.json, .nvmrc, .gitignore, .env.local.example`, `docs/shared/` (identical in all repos), `docs/reference/` (read-only reference), `tools/find-legacy.sh`.

## Conventions
* Globs in `Key files` (e.g. `views/Income*.js`) mean 'several files of that pattern' — add concrete rows here as they are created.
* Never create files outside this layout without adding them here.
