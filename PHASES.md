# PHASES — LazyBooks Desktop (Connector) (48 phases: 1–42 complete, Milestone 9 = 43–48 planned)

**Edit in place** (str_replace). Never reorder or renumber a completed phase. If a phase is too big for one session, split it, renumber forward, and record the split in `PHASE_STATUS.md`.

Each phase is sized to be completed — read docs, implement, verify, update status, re-zip — in ONE Claude session. Every phase ends in a runnable state.

Format: **Goal · Depends on · In scope · Out of scope · Key files · Legacy reference · How to verify locally**

`Legacy reference` lists the legacy-app screens/packages this phase must reproduce (from `docs/shared/FEATURE_MATRIX.md`). Read them with `tools/find-legacy.sh <Name>` ONLY IF the phase has a reference folder; clean-room rules apply (`docs/shared/LEGAL_REFERENCE_ONLY.md`).

---

## MILESTONE 1 — Foundation & Activation (Phases 1–6)
*Exit: tray app runs on Windows, stores secrets safely, activates a license, logs in as the `connector` user, sends heartbeats.*

### Phase 1 — Repo scaffold (Electron + TypeScript)
**Goal:** App launches with a tray icon and a blank status window.
**Depends on:** Phase 0 (docs only)
**In scope:** Electron + TypeScript scaffold (electron-vite recommended; record the choice and exact versions in DEPENDENCY_VERSIONS.md), main/preload/renderer split, `contextIsolation:true`, `nodeIntegration:false`, single-instance lock, `tools/mock-tally` stub server, `.github/workflows/ci.yml`.
**Out of scope:** Any Tally or Supabase code.
**Key files:** `package.json`, `src/main/index.ts`, `src/preload/index.ts`, `src/renderer/*`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** `npm run dev` launches the connector against the mock Tally server (`tools/mock-tally`) and a fixture Supabase; tray icon + status window appear.

### Phase 2 — Tray, autostart, logging
**Goal:** Runs quietly in the background.
**Depends on:** Phase 1 (`scaffold`)
**In scope:** Tray menu (Open, Sync now, Pause, Quit), start-with-Windows option, structured rotating logs (`logs/`), crash handler, safe shutdown hooks, sleep/wake events.
**Out of scope:** —
**Key files:** `src/main/tray.ts`, `src/main/logger.ts`, `src/main/lifecycle.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Quit/relaunch keeps state; log files rotate.

### Phase 3 — Config + secure storage
**Goal:** Settings and secrets stored safely.
**Depends on:** Phase 2 (`tray-lifecycle`)
**In scope:** `src/main/config.ts` (JSON in userData), Electron `safeStorage` for license key + passwords, never log secrets, config schema + migrations.
**Out of scope:** —
**Key files:** `src/main/config.ts`, `src/main/secrets.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Secrets are not readable in plain text on disk.

### Phase 4 — Renderer shell + theme engine
**Goal:** Status window using the same tokens/themes as the PWA.
**Depends on:** Phase 3 (`config-secrets`)
**In scope:** React renderer, copy of `styles/tokens.css` + theme engine from docs/shared (identical JSON contract), light/dark, Phosphor icons, pages: Status, Logs, Settings (empty).
**Out of scope:** Real data.
**Key files:** `src/renderer/*`, `src/renderer/styles/tokens.css`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Switch theme JSON — window restyles; matches PWA look.

### Phase 5 — Activation + connector login
**Goal:** License key → project → login.
**Depends on:** Phase 4 (`ui-shell`)
**Shared inputs:** `SHARED_CONTRACTS.md` sections 2-4 and 7, `constants.json` `demo`, `desktop`, `demo/license_project_seed.sql` (connector login claims: `app_metadata.license_key` and `role = connector`).
**In scope:** `registryClient` (same RPCs as PWA), activation screen (license key + connector email/password issued by admin), Supabase client with persisted session, `bootstrap` on start and every 30 min (flags, update info, theme/branding, maintenance).
**Out of scope:** Device registration (next).
**Key files:** `src/main/registry.ts`, `src/main/supabase.ts`, `src/renderer/pages/Activate.tsx`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Activate against a real master+license project. Against a mock registry/auth that serves the demo license; a live master and license project is human item PEER-03.

### Phase 6 — Device registration + heartbeat
**Goal:** Appear in the admin panel and PWA device lists.
**Depends on:** Phase 5 (`activation`)
**In scope:** Upsert `devices` (app='desktop'), heartbeat every N minutes with app version/Tally status/last sync, honour `is_revoked`.
**Out of scope:** —
**Key files:** `src/main/device.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Device shows `last_seen_at` moving; revoke stops sync.

---

## MILESTONE 2 — Tally Reader (Phases 7–14)
*Exit: complete read of masters/vouchers/derived inputs from TallyPrime into memory structures, incremental via AlterID, matching the behaviour documented in the legacy reference notes.*

### Phase 7 — Tally detection + config
**Goal:** Find and validate Tally.
**Depends on:** Phase 6 (`device-heartbeat`)
**Shared inputs:** `TALLY_WIRE.md` (ping and transport), `DATA_MODEL_COLUMNS.md`, mock responses `fixtures/tally_xml/*.xml` served by the mock Tally; reference parser `fixtures/tools/tally_xml_io.py`.
**In scope:** Port (default 9000) probe, version via `$$ProdInfo`, ODBC/XML enable guidance, company list, loaded-company detection, clear user messages, mock server parity.
**Out of scope:** —
**Key files:** `src/main/tally/detect.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Mock + a real Tally both detected.

### Phase 8 — Tally XML client
**Goal:** Reliable HTTP/XML layer.
**Depends on:** Phase 7 (`tally-detect`)
**Shared inputs:** `TALLY_WIRE.md` (request templates and parsing rules), `DATA_MODEL_COLUMNS.md`, mock responses `fixtures/tally_xml/*.xml` served by the mock Tally; reference parser `fixtures/tools/tally_xml_io.py`.
**In scope:** Request builder (Export Data, Collections with `<FETCH>` field lists, Functions), XML escaping/encoding (UTF-16/UTF-8), timeouts, retries, large-response streaming, error mapping (`LINEERROR`), serialisation of concurrent calls (Tally is single-threaded).
**Out of scope:** Entity-specific requests.
**Key files:** `src/main/tally/client.ts`, `src/main/tally/xml.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Round-trip fixtures; timeouts recover.

### Phase 9 — Tally license + company info
**Goal:** Read license info and company details.
**Depends on:** Phase 8 (`tally-xml-client`)
**Shared inputs:** `TALLY_WIRE.md` (company object), `DATA_MODEL_COLUMNS.md`, mock responses `fixtures/tally_xml/*.xml` served by the mock Tally; reference parser `fixtures/tools/tally_xml_io.py`.
**In scope:** `$$LicenseInfo`, company GUID, FY dates, GSTIN, base currency, books-from date; stored for binding the LazyBooks license to the Tally serial (optional flag).
**Out of scope:** —
**Key files:** `src/main/tally/company.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Company record matches Tally.

### Phase 10 — Masters pull
**Goal:** All `tm_*` tables.
**Depends on:** Phase 9 (`tally-license-info`)
**Shared inputs:** `TALLY_WIRE.md` (masters mapping), `DATA_MODEL_COLUMNS.md`, mock responses `fixtures/tally_xml/*.xml` served by the mock Tally; reference parser `fixtures/tools/tally_xml_io.py`.
**In scope:** Groups, ledgers (+addresses, contacts, GST details), voucher types (+classes), stock items/groups/categories/units/godowns, cost centres/categories, currencies, employees, GST registrations — per DATA_MODEL.md; Name-independence rule: never match literal names.
**Out of scope:** Vouchers.
**Key files:** `src/main/tally/masters/*`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Master counts equal Tally's own report counts. Parsing `fixtures/tally_xml/*.xml` reproduces `fixtures/tables` for every master table (checklist WIRE-01).

### Phase 11 — Vouchers pull (full + incremental)
**Goal:** All `tx_*` tables.
**Depends on:** Phase 10 (`tally-masters`)
**Shared inputs:** `TALLY_WIRE.md` (voucher mapping and AlterID rules), `DATA_MODEL_COLUMNS.md`, mock responses `fixtures/tally_xml/*.xml` served by the mock Tally; reference parser `fixtures/tools/tally_xml_io.py`.
**In scope:** Voucher headers, ledger entries, inventory entries, batch allocations, bill allocations, GST rate details; windowed by date; incremental by AlterID (see `docs/reference/biz-analyst-desktop` for how the legacy connector tracks it; write your own note first); stable composite keys for every sub-row.
**Out of scope:** Deletion detection.
**Key files:** `src/main/tally/vouchers/*`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Initial pull equals Tally Day Book totals; incremental pull picks one edited voucher. Parsing `fixtures/tally_xml/vouchers.xml` reproduces the voucher tables incl. derived columns and `tx_tax_line` (WIRE-01).

### Phase 12 — Deleted vouchers + renamed masters
**Goal:** Keep history truthful.
**Depends on:** Phase 11 (`tally-vouchers`)
**Shared inputs:** `TALLY_WIRE.md` (deletions and renames), `DATA_MODEL_COLUMNS.md`, mock responses `fixtures/tally_xml/*.xml` served by the mock Tally; reference parser `fixtures/tools/tally_xml_io.py`.
**In scope:** Deleted-voucher detection (daily + on demand), voucher/ledger rename fix-ups, emits `delete` / `delete_children` change operations.
**Out of scope:** —
**Key files:** `src/main/tally/reconcile.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Delete a voucher in Tally — it disappears on devices.

### Phase 13 — Closing balances + Tally-computed reports
**Goal:** Take Tally's numbers (don't recompute).
**Depends on:** Phase 12 (`tally-deletes-renames`)
**Shared inputs:** `TALLY_WIRE.md` (closing balances), `DATA_MODEL_COLUMNS.md`, mock responses `fixtures/tally_xml/*.xml` served by the mock Tally; reference parser `fixtures/tools/tally_xml_io.py`.
**In scope:** Ledger/group closing balances (daily + after sync), stock closing, GST summary inputs, on-account balances — as Tally reports them.
**Out of scope:** —
**Key files:** `src/main/tally/closing.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Balance sheet totals equal Tally.

### Phase 14 — Tally edge cases
**Goal:** Restores, FY rollover, multi-company.
**Depends on:** Phase 13 (`tally-closing`)
**Shared inputs:** `TALLY_WIRE.md` (edge cases and error handling), `DATA_MODEL_COLUMNS.md`, mock responses `fixtures/tally_xml/*.xml` served by the mock Tally; reference parser `fixtures/tools/tally_xml_io.py`.
**In scope:** Backwards AlterID (restore) detection → forced resync, FY change, company switching, Tally closed/locked, clock skew vs server, partial responses.
**Out of scope:** —
**Key files:** `src/main/tally/guards.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Restore an older company in Tally — connector detects and resyncs.

---

## MILESTONE 3 — Local SQLite Vault & Derived Data (Phases 15–18)
*Exit: durable local database is the source of truth; derived tables computed once here.*

### Phase 15 — SQLite schema + migrations
**Goal:** The vault.
**Depends on:** Phase 14 (`tally-edge`)
**Shared inputs:** `data_model.json` is the schema: GENERATE `CREATE TABLE`/`CREATE INDEX` from it (reference `ddl_sqlite` in `fixtures/tools/lbmodel.py`), seed `ref_voucher_kind` from its `seed_rows`; `DATA_MODEL.md`.
**In scope:** SQLite (better-sqlite3 preferred; verify prebuilt binary for the chosen Electron or fall back to sql.js and record why) with DATA_MODEL.md schema, migration runner, WAL mode, integrity check, backup copy on start.
**Out of scope:** —
**Key files:** `src/main/db/*`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** DB opens, migrates, survives kill -9. Load `docs/shared/fixtures/tables/*.json` and read back: equal (checklist SCHEMA-01); voucher line sums are 0 (SCHEMA-02).

### Phase 16 — Upsert layer + change tracking
**Goal:** Know what changed.
**Depends on:** Phase 15 (`sqlite-schema`)
**Shared inputs:** `SYNC_SPEC.md` sections 4 and 7 (what an upsert/delete/delete_children must do to the vault), `TALLY_WIRE.md` section 4.
**In scope:** Idempotent upserts, row hash + `updated_seq`, per-device cursors (`device_cursors`) so each device can receive 'only what changed since X', tombstones for deletes.
**Out of scope:** Derived tables.
**Key files:** `src/main/db/upsert.ts`, `src/main/db/cursors.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Replay of the same Tally pull changes nothing.

### Phase 17 — OPTIONAL derived tables `drv_*` (perf-driven)
**Goal:** Only if device-side calculators are too slow.
**Depends on:** Phase 16 (`upsert-layer`)
**In scope:** Default: DO NOTHING — the PWA computes reports and calculators on-device from synced raw tables (decision D-06). Implement a `drv_*` table here only when the PWA kit's `perf-pass` phase records a calculator that misses its budget; formulas must be copied from the PWA's `lib/calc/*` (single source of truth) and documented in `docs/derived_formulas.md`. Candidates: outstanding+ageing, invoice payment status, customer last sale, pending orders, batch closing.
**Out of scope:** Any table not requested by a recorded perf failure.
**Key files:** `src/main/calc/*` (only on request), `docs/derived_formulas.md`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Golden fixtures equal the PWA calculator output.

### Phase 18 — Sync scheduler
**Goal:** When to pull.
**Depends on:** Phase 16 (`upsert-layer`)
**Shared inputs:** `constants.json` `desktop` (intervals), `TALLY_WIRE.md` sections 4-6.
**In scope:** Every 5 min (configurable) incremental; deleted-voucher check daily; closing balances daily; manual 'Sync now'; backoff when Tally busy; single-flight.
**Out of scope:** Uploads.
**Key files:** `src/main/sync/scheduler.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Observe cadence in logs.

---

## MILESTONE 4 — Postbox Server Side (Phases 19–23)
*Exit: connector answers device requests through the license project; E2E encrypted; compatible with the PWA kit's client.*

### Phase 19 — Request listener
**Goal:** Hear what devices ask.
**Depends on:** Phase 18 (`sync-scheduler`)
**Shared inputs:** `SYNC_SPEC.md` sections 1-2, 6; `constants.json` `desktop`, `polling`; `demo/license_project_seed.sql`. The device side is a script that inserts requests and reads chunks.
**In scope:** Poll + optional Realtime for `sync_requests`, sequential processing, status transitions (pending→processing→done/failed with error text), unique in-flight guard respected.
**Out of scope:** Chunking.
**Key files:** `src/main/postbox/listener.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Insert a request — status moves to done. Against the license project seeded from `demo/license_project_seed.sql` (or an in-memory fake postbox); a real PWA is human item PEER-01.

### Phase 20 — Chunker
**Goal:** Rows → chunks.
**Depends on:** Phase 19 (`request-listener`)
**Shared inputs:** `SYNC_SPEC.md` sections 3, 5, 6; `constants.json` `sync`; `sync_examples/`.
**In scope:** Table ordering, chunk size ≤ ~200 KB payload, `seq`/`is_last`, per-device targeting, `expires_at`.
**Out of scope:** —
**Key files:** `src/main/postbox/chunker.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Chunks reassemble to the original set. Apply the produced chunks with the reference applier (`fixtures/tools/sync_ref.py`): the store equals `fixtures/tables` (checklist SYNC-01); output for the fixture company matches `sync_examples/initial_sequence.jsonl` after normalising chunk boundaries.

### Phase 21 — Encryption
**Goal:** Match PWA crypto.
**Depends on:** Phase 20 (`chunker`)
**Shared inputs:** `SYNC_SPEC.md` section 3.3, `crypto_vectors.json`, `sync_examples/initial_sequence.enc.jsonl`, `constants.json` `crypto`.
**In scope:** AES-256-GCM + PBKDF2 per docs/shared/crypto_vectors.json, passphrase setup wizard, key check value, salt storage, QR export for pairing.
**Out of scope:** —
**Key files:** `src/main/crypto/*`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Vectors pass and `sync_examples/initial_sequence.enc.jsonl` decrypts with the demo/test key (checklist CRYPTO-01, SYNC-02); a real PWA decrypting connector output is PEER-01.

### Phase 22 — Serve initial + delta
**Goal:** Core job.
**Depends on:** Phase 21 (`encryption`)
**Shared inputs:** `SYNC_SPEC.md` sections 2, 4, 6, 7; `sync_examples/`; `TALLY_WIRE.md`; mock Tally responses.
**In scope:** Initial (date range, company), delta (`last_sync_at` + lookback), delete/clear/replace_scope emission, per-device cursor update after ack (chunk row deleted), idempotent resends.
**Out of scope:** —
**Key files:** `src/main/postbox/serve.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Mock Tally -> vault -> chunks applied by the reference applier equal `fixtures/tables`, and the delta scenario equals `sync_examples/delta_expected.json` (checklist SYNC-01, SYNC-03); the real PWA + real Tally run is PEER-01 and the TW-* items.

### Phase 23 — Backpressure + cleanup
**Goal:** Stay inside free-tier limits.
**Depends on:** Phase 22 (`serve-initial-delta`)
**Shared inputs:** `constants.json` `sync`, `desktop` (inflight limits, retention).
**In scope:** Max in-flight chunks per device, retry with backoff, cleanup of unacked chunks, request-rate budget, offline queueing of outbound results.
**Out of scope:** —
**Key files:** `src/main/postbox/hygiene.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Disconnect network — recovers without duplicates.

---

## MILESTONE 5 — Write-Back to Tally (Phases 24–30)
*Exit: every entry kind in the PWA's Milestone 7 can be posted into Tally, idempotently, with reported results.*

### Phase 24 — Entry listener
**Goal:** Receive `entry_queue` rows.
**Depends on:** Phase 23 (`postbox-hygiene`)
**Shared inputs:** `ENTRY_PAYLOADS.md` sections 1, 5, 6; `entry_rules.json`; `entry_examples/`.
**In scope:** Claim rows (queued→posting), per-kind dispatch, attempts counter, result write-back.
**Out of scope:** XML builders.
**Key files:** `src/main/entries/listener.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Queue row is claimed once.

### Phase 25 — Voucher XML builders
**Goal:** Import Data envelopes.
**Depends on:** Phase 24 (`entry-listener`)
**Shared inputs:** `ENTRY_PAYLOADS.md`, `entry_rules.json`, `TALLY_WIRE.md` section 8 (import template, sign rules), `entry_examples/*.valid.json`, `fixtures/tables`. The XML is already specified there; do not write another spec.
**In scope:** Sales/purchase invoices (inventory + accounting), receipt/payment/contra, journal, inventory vouchers, orders/quotations, following `docs/shared/TALLY_WIRE.md` section 8 and `docs/shared/ENTRY_PAYLOADS.md`; GST ledgers + round-off exactly as in the payload (`CALC_SPECS.md` section 10), re-validated with the S01-S11 checks of `entry_rules.json`.
**Out of scope:** Masters.
**Key files:** `src/main/entries/builders/*`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Golden XML fixtures compared byte-for-byte. Build XML from every `entry_examples/*.valid.json`: well formed, ledger lines sum to zero, names resolved from `fixtures/tables` (checklist ENTRY-02); posting into a real Tally is PEER-02.

### Phase 26 — Master creation
**Goal:** Ledgers + stock items.
**Depends on:** Phase 25 (`xml-builders`)
**Shared inputs:** `ENTRY_PAYLOADS.md` (ledger, stock_item), `TALLY_WIRE.md` section 8, `entry_examples/ledger*.json`, `stock_item*.json`.
**In scope:** Create ledger (groups, GST, addresses, contacts), stock item (units, GST, HSN), idempotent by name+GUID.
**Out of scope:** —
**Key files:** `src/main/entries/masters/*`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Duplicate name returns a clear error.

### Phase 27 — Idempotency + duplicate guard
**Goal:** Never post twice.
**Depends on:** Phase 26 (`master-writers`)
**Shared inputs:** `ENTRY_PAYLOADS.md` section 5 (idempotency via `client_request_id`; REMOTEID is assumed, fallback in TALLY_WIRE section 8), checklist TW-ENTRY-REMOTEID.
**In scope:** `client_request_id` ↔ Tally remote-id/reference mapping, pre-post lookup, post-crash reconciliation (read back from Tally before retry) — prevents duplicate vouchers after crashes or retries.
**Out of scope:** —
**Key files:** `src/main/entries/idempotency.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Kill the app mid-post — exactly one voucher in Tally.

### Phase 28 — Result + error mapping
**Goal:** Human-readable outcomes.
**Depends on:** Phase 27 (`idempotency`)
**Shared inputs:** `ENTRY_PAYLOADS.md` section 6, `entry_rules.json` `result` (detail mapping and `tally_message_map`), `entry_examples/results.example.json`.
**In scope:** Parse Tally import response (CREATED/ALTERED/ERRORS/LINEERROR), map to `posted/failed/needs_review`, store raw + friendly text.
**Out of scope:** —
**Key files:** `src/main/entries/results.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Force an error — PWA shows friendly reason.

### Phase 29 — E-invoice + e-way actions
**Goal:** Drive Tally's own flows.
**Depends on:** Phase 28 (`result-mapping`)
**Shared inputs:** `ENTRY_PAYLOADS.md` section 3 (alter actions), `TALLY_WIRE.md` section 8 (e-invoice/e-way assumed), `entry_examples/alter.einvoice_*.json`.
**In scope:** Trigger generate/cancel e-invoice/e-way in Tally Prime where supported, read back IRN/ack/e-way numbers, push to devices.
**Out of scope:** Direct GSP APIs.
**Key files:** `src/main/entries/einvoice.ts`
**Legacy reference:** `ChooseEWayEInvoiceCreateEntryBottomSheet`, `EInvoiceCancelledBottomSheet`, `EInvoiceEwayReportList`, `EInvoiceLoginBottomSheet`, `EWayBillDetailsBottomSheet`, `EwayBillEntryBottomSheet`, `EwayDetail`, `EwayEinvoiceCancelBottomSheet`, `GenerateEWayEInvoiceErrorBottomSheet`, `GenerateEWayEInvoiceLoadingBottomSheet`, `GenerateEWayEInvoiceSuccessBottomSheet`, `IASPartialSuccessBottomSheet`, `SelectEWayEInvoiceOptionBottomSheet`
**How to verify locally:** Mock returns IRN; real Tally flow documented as manual-verify.

### Phase 30 — Alter / cancel / delete
**Goal:** Edits on posted vouchers.
**Depends on:** Phase 29 (`einvoice-actions`)
**Shared inputs:** `ENTRY_PAYLOADS.md` (alter replace/cancel/delete, `expected_alter_id`, `ALTER_CONFLICT`), `entry_examples/alter*.json`, `cancel*.json`, `delete*.json`.
**In scope:** Alter by GUID/AlterID with conflict detection, cancel, delete, results reporting.
**Out of scope:** —
**Key files:** `src/main/entries/alter.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Edited voucher updates on devices.

---

## MILESTONE 6 — Cloud Copy (flag `cloud_copy`) (Phases 31–32)
*Exit: optional encrypted snapshots in the license project's Storage let new installs bootstrap while the PC is off.*

### Phase 31 — Snapshot builder
**Goal:** Full + delta snapshots.
**Depends on:** Phase 30 (`alter-cancel-delete`)
**Shared inputs:** `SYNC_SPEC.md` section 8 (snapshot object layout and retention math), `constants.json` `snapshot`, `crypto`.
**In scope:** Export DB state → gzip → encrypt → split into ≤ 45 MB objects, manifest rows in `snapshots`, sha256, `from/to_alter_id`.
**Out of scope:** —
**Key files:** `src/main/snapshot/build.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Snapshot decrypts and applies with the reference applier to a store equal to `fixtures/tables`; restore in a real PWA is PEER-01.

### Phase 32 — Retention + quota
**Goal:** Respect 1 GB.
**Depends on:** Phase 31 (`snapshot-builder`)
**Shared inputs:** `SYNC_SPEC.md` section 8 (peak rule), `constants.json` `snapshot`, `limits.plans`.
**In scope:** Keep latest full + recent deltas, prune old, size budget from plan `snapshot_mb`, skip when flag off.
**Out of scope:** —
**Key files:** `src/main/snapshot/retention.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Quota never exceeded in a 30-day simulation.

---

## MILESTONE 7 — Connector UI (Phases 33–37)
*Exit: a non-technical user can run and understand the connector.*

### Phase 33 — Status dashboard
**Goal:** Truth at a glance.
**Depends on:** Phase 23 (`postbox-hygiene`)
**In scope:** Tally connected?, internet?, last sync, rows counts, devices online, pending entries, errors, license/plan/flags, update available.
**Out of scope:** —
**Key files:** `src/renderer/pages/Status.tsx`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** `npm run dev` launches the connector against the mock Tally server (`tools/mock-tally`) and a fixture Supabase; tray icon + status window appear.

### Phase 34 — Logs viewer
**Goal:** Debug without a terminal.
**Depends on:** Phase 33 (`ui-status`)
**In scope:** Filter/search/export logs, redact secrets.
**Out of scope:** —
**Key files:** `src/renderer/pages/Logs.tsx`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Export works.

### Phase 35 — Settings
**Goal:** All knobs.
**Depends on:** Phase 34 (`ui-logs`)
**In scope:** Company selection, FY, lookback days, intervals, Tally host/port, autostart, cloud-copy toggle (when flag allows), passphrase change, language.
**Out of scope:** —
**Key files:** `src/renderer/pages/Settings.tsx`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Settings persist.

### Phase 36 — Pairing + devices
**Goal:** Onboard phones.
**Depends on:** Phase 35 (`ui-settings`)
**In scope:** Passphrase/QR display, connected devices list, revoke, 'force resync device'.
**Out of scope:** —
**Key files:** `src/renderer/pages/Devices.tsx`
**Legacy reference:** `ConnectWithTally`
**How to verify locally:** QR imported by PWA.

### Phase 37 — Maintenance tools
**Goal:** Self-service recovery.
**Depends on:** Phase 36 (`ui-pairing`)
**In scope:** Full resync, reset vault, export diagnostics zip, open data folder.
**Out of scope:** —
**Key files:** `src/renderer/pages/Tools.tsx`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Reset then resync works.

---

## MILESTONE 8 — Packaging, Updates, Optional Embedded PWA (Phases 38–42)
*Exit: installer built in CI, auto-updates from GitHub Releases, optional PC UI via embedded PWA.*

### Phase 38 — Installer
**Goal:** One-click Windows setup.
**Depends on:** Phase 37 (`ui-tools`)
**In scope:** electron-builder NSIS, per-user install (no admin rights), icons from branding, uninstall keeps vault unless chosen.
**Out of scope:** Code-signing (paid; documented workaround).
**Key files:** `electron-builder.yml`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Install/uninstall on a clean Windows VM.

### Phase 39 — Auto-update from GitHub Releases
**Goal:** Free updates.
**Depends on:** Phase 38 (`installer`)
**Shared inputs:** `GITHUB_RELEASE_FLOW.md`, `constants.json` `releases`, `SHARED_CONTRACTS.md` section 3 (bootstrap `update` shape). Use a mock bootstrap for the test; live Admin publishing is PEER-04.
**In scope:** electron-updater against a public releases repo, honour master `update` info (must_update/min_supported), staged rollout via bootstrap bucket, sha256 check.
**Out of scope:** —
**Key files:** `src/main/updater.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Publish a higher version — app updates.

### Phase 40 — Embedded PWA window (optional)
**Goal:** Use LazyBooks UI on the PC inside Electron.
**Depends on:** Phase 39 (`auto-update`)
**Shared inputs:** `HOST_BRIDGE.md`. Until the real PWA export exists, `resources/pwa` holds a stub page (a minimal `index.html` that calls the bridge); the real build is dropped in by a human (PEER-06).
**In scope:** Load the PWA `out/` build from `resources/pwa` via custom protocol, implement the `window.LazyHost` bridge from docs/shared (open data folder, native share/save dialogs, tray badge, passphrase handoff so the PC UI doesn't re-ask), version-pinned from the PWA release asset.
**Out of scope:** Auto-opening PWA by default (opt-in).
**Key files:** `src/main/pwaHost.ts`, `src/preload/host.ts`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** 'Open LazyBooks' shows the stub page offline and every bridge method round-trips (checklist HOST-01); with the real PWA build it shows the full app (PEER-06).

### Phase 41 — Hardening + large-company QA
**Goal:** Production readiness.
**Depends on:** Phase 40 (`embedded-pwa`)
**In scope:** 200k-voucher perf, antivirus-friendly behaviour, sleep/wake, clock skew, low-disk, crash loops, memory.
**Out of scope:** —
**Key files:** —
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Soak test 24 h.

### Phase 42 — Release pipeline
**Goal:** Ship via GitHub.
**Depends on:** Phase 41 (`hardening`)
**In scope:** Windows runner builds, uploads installer + `latest.yml` to the releases repo, calls `publish_release` hook, changelog.
**Out of scope:** —
**Key files:** `.github/workflows/release.yml`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Tag builds an installer and a draft release in the master.

---

## MILESTONE 9 — Large-Company Reliability & Controls (Phases 43–48)
*Exit: a company with 100k or more vouchers syncs without Tally freezing or the app closing, vouchers are read in user-sized batches, the Status page shows a progress bar (how many vouchers must be pulled, how many are done), and the user can switch automatic update checks on or off and check by hand.*

**Owner decisions (2026-10-27, do not reopen):** (1) the current Tally extraction stays as it is: no rewrite of request shape, FETCH lists, parsing or mappers, and no port of the older app's report-based extraction; batching is added around it; (2) the vouchers-per-batch number is a user setting; (3) progress is visible with totals; (4) automatic update checks have an on/off switch in the app.
**Read before any phase of this milestone:** `docs/specs/voucher-batching.md`, `docs/specs/sync-progress.md`, `docs/specs/update-controls.md`, `docs/specs/tally-real-world-notes.md`, and the "Hotfixes after Phase 42" entry in `PHASE_STATUS.md` (the code already contains hotfixes H1 to H5; do not undo them). The specs are DESIGN documents written before the code: check them against the code, amend in place, never rewrite.
**Rules for this milestone:** no shared doc (`docs/shared`) is changed; new constants live in `src/shared/constants.ts`; extend `API_CONTRACTS.md` before touching `ipc.ts`; every phase keeps all earlier tests passing (`node tests/<name>.cjs` for each, with `NODE_PATH=<project>/node_modules`); real-Tally behaviour that cannot be tested here is recorded as a `TW-*` item in `docs/specs/tally-real-world-notes.md` and in Known issues, never silently assumed.

### Phase 43 — Contracts, config keys, constants (no behaviour change)
**Goal:** Everything the later phases need exists, is validated and is typed; nothing observable changes.
**Depends on:** Phase 42 and hotfixes H1 to H5
**Spec:** `voucher-batching.md` (sections 5, 8), `sync-progress.md` (Event), `update-controls.md` (Settings key, IPC and types)
**In scope:** Move the "Planned (Milestone 9)" block in `API_CONTRACTS.md` to the real contract and amend it where the code forces a change. `src/main/config.ts`: `voucherBatchSize` (int 50 to 5000, default 500) and `autoUpdateCheck` (boolean, default true), both with `.default` so older config files load unchanged. `src/shared/constants.ts` (`DESKTOP_DEFAULTS` and siblings): batch size default, min, max and adaptive floor (25), `voucherTimeoutS` (180), `splitPauseS` (15), `voucherBatchPauseMs` (250), `progressThrottleMs` (1000), `manualUpdateCheckMinGapS` (30), progress stage weights. `src/shared/ipc.ts`: types `SyncProgress`, `SettingsView` and `SettingsPatch` additions (`voucherBatchSize`, `autoUpdateCheck`), `UpdateView` additions (`currentVersion`, `autoCheck`, `lastCheckedAt`, `progress`), channel `lb:sync:progress` and `LbApi.sync.onProgress`; `src/preload/index.ts` to match; `src/main/settings.ts` validation (strict, all-or-nothing, out-of-range refused with the field named). Replace the literal 180 s and 15 s in `vouchers/index.ts` with the constants (same values).
**Out of scope:** Any Tally request change, any UI, any scheduler change.
**Key files:** `src/main/config.ts`, `src/main/settings.ts`, `src/shared/constants.ts`, `src/shared/ipc.ts`, `src/preload/index.ts`, `API_CONTRACTS.md`, `tests/config-secrets.cjs`, `tests/settings.cjs`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** `config-secrets` test: an old config file without the new keys loads with the defaults; `settings` test: valid patches are saved, out-of-range and wrong-type patches are refused with nothing saved; `npm run typecheck` is clean; every earlier test still passes.

### Phase 44 — Tally paging primitives (paged read, count, mock support)
**Goal:** The Tally layer can ask for "vouchers start+1 to start+size" and for "how many vouchers", on top of the current extraction.
**Depends on:** Phase 43
**Spec:** `voucher-batching.md` (sections 3, 4, 7, 8)
**In scope:** In-place extension of `src/main/tally/xml.ts` `buildCollectionRequest` so a request can carry compute variables, compute lines and ordered filters (the paging variable and the paging filter), with output byte-identical when unused (golden test over every existing request). New `src/main/tally/vouchers/paging.ts`: `readPage(company, from, to, start, size, alterAbove)` reusing the existing voucher request, fields and fetch list unchanged; `countWindow(company, from, to)` using the existing `LBVoucherGuids` request (per month when needed); detection of "paging ignored" (page longer than the size, or equal first GUID on different pages); adaptive halving of the size on a timeout (floor 25, 15 s pause, injectable sleep). Extend `tools/mock-tally` so it honours the paging filter by slicing the voucher list in document order, with a switch that makes it ignore the filter. `src/main/tally/client.ts` is NOT changed beyond what the specs need.
**Out of scope:** The scheduler, progress, UI, persistence, replacing the extraction or the mappers.
**Key files:** `src/main/tally/xml.ts`, `src/main/tally/vouchers/paging.ts`, `tools/mock-tally/*`, `tests/tally-paging.cjs`, `tests/tally-vouchers.cjs`
**Legacy reference:** — (behaviour of the proven older connector is restated in `voucher-batching.md`; clean-room, no code copied)
**How to verify locally:** Against the mock: pages of sizes 1, 7, 500 and larger than the total return every voucher exactly once and in order; boundary cases with a date window and with an AlterID filter; the last short page ends the loop; "paging ignored" is detected and reported; the golden XML of all existing requests is unchanged; a timeout halves the size and retries the same page once. Real-Tally items `TW-PAGING-01` to `TW-PAGING-03` are added to Known issues as manual-verify.

### Phase 45 — Batched voucher pull in the sync cycle (bounded memory, resume)
**Goal:** Full and incremental voucher reads run as batches of the configured size; peak memory stays near one batch; a crash resumes instead of restarting; devices never see a half-applied pull.
**Depends on:** Phase 44, Phase 18 (scheduler), Phase 16 (upsert layer)
**Spec:** `voucher-batching.md` (sections 5 to 8)
**In scope:** First write the atomicity decision (Option A staging on disk, or Option B bounded in-memory accumulation) under the Phase 45 entry in `PHASE_STATUS.md`; Option A is recommended. `createVouchers().pull()` (or a sibling `pullBatched()`) yields batches through a callback, outer loop over month windows, inner loop over pages, the pause between batches, per-batch isolation (one failed batch aborts the cycle cleanly, nothing half-applied). Checkpoint `sync-run.json` after every batch with resume rules (discard when stale or when company or AlterID no longer match). The scheduler (`sync/scheduler.ts`, `sync/plan.ts`, `sync/store.ts`) uses the batched pull in place; the existing guards (`checkCount`, `checkDeleted`) still run before the final commit. Read `voucherBatchSize` from the config at the start of each run. Call an injected `onProgress` hook with counts (no UI yet). `tools/gen-big-company.mjs`: generates a mock company with N vouchers (50k and 200k presets) for tests.
**Out of scope:** Progress UI, Settings UI, changing mappers, columns, shared contracts, the masters pull.
**Key files:** `src/main/tally/vouchers/index.ts`, `src/main/tally/vouchers/paging.ts`, `src/main/sync/scheduler.ts`, `src/main/sync/plan.ts`, `src/main/sync/store.ts`, `tools/gen-big-company.mjs`, `tests/sync-batching.cjs`, `tests/sync-scheduler.cjs`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** The existing 19-check `sync-scheduler` test still passes; a batched full pull of the fixture company equals the shared fixtures and equals the single-request pull for batch sizes 1, 7 and 500; kill after batch k then restart resumes and the vault equals the fixtures; kill before the final commit leaves the live vault untouched; the "paging ignored" fallback finishes the sync month by month; a 50k-voucher generated company completes with peak memory well below the whole-company figure (record the numbers); a size change between runs applies to the next run only.

### Phase 46 — Progress events + Status progress bar
**Goal:** While a sync runs, the user sees how many vouchers must be pulled and how many are done, as a progress bar.
**Depends on:** Phase 45, Phase 33 (Status page)
**Spec:** `sync-progress.md`
**In scope:** `src/main/sync/progress.ts` (pure tracker: stage changes, one event per second, rate over the last 5 batches, ETA rules, resume flag), the scheduler and batcher feed it, main pushes `lb:sync:progress`, `src/renderer/lib/progressView.ts` (texts and percent), `src/renderer/components/SyncProgress.tsx` used by `Status.tsx` (headline with counts and percent, month, batch x of y, speed, time left, "Resuming from", failure line with the retry time, idle collapse, no flashing on quiet cycles, `role="progressbar"`, reduced motion, light and dark tokens), tray tooltip text, optional taskbar progress. No names anywhere.
**Out of scope:** Settings controls, a cancel button, any change to what is pulled.
**Key files:** `src/main/sync/progress.ts`, `src/renderer/lib/progressView.ts`, `src/renderer/components/SyncProgress.tsx`, `src/renderer/pages/Status.tsx`, `src/main/index.ts`, `tests/sync-progress.cjs`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** Pure tests for every stage, null totals, `done` greater than `total`, ETA hidden before 2 batches, throttle; an event-sequence test driving a generated 5k-voucher company shows monotonic done counts and ends in `done`; no company or party names in any event (grep and a fixture check); `npm run typecheck` clean. Manual on a real machine: the card renders at 1024x700 and 1366x768, light and dark.

### Phase 47 — Settings: vouchers per batch + update controls
**Goal:** The user sets the batch size and controls update checking from the Settings page.
**Depends on:** Phase 46, Phase 39 (updater), Phase 35 (settings)
**Spec:** `voucher-batching.md` (section 5), `update-controls.md`
**In scope:** `Settings.tsx` gets a "Syncing" block (vouchers per batch: number input, presets 100, 250, 500, 1000, plain-language help, reset to default, "applies from the next sync") and an "Updates" block (current version, switch "Check for updates automatically", "Check now" button, status line, release notes as plain text, download percent, "Restart and update"). `src/renderer/lib/settingsForm.ts` builds the patches. `src/main/updater.ts` honours `autoUpdateCheck` (timer off when false; forced updates still acted on; manual check refreshes the bootstrap, enforces the 30 s gap, returns the extended `UpdateView`; `download-progress` feeds `progress`). The Status update banner reads the same state.
**Out of scope:** Install-on-quit options, channels, a changelog viewer beyond plain text, any shared contract change.
**Key files:** `src/renderer/pages/Settings.tsx`, `src/renderer/lib/settingsForm.ts`, `src/main/updater.ts`, `src/main/settings.ts`, `src/main/index.ts`, `tests/settings.cjs`, `tests/updater.cjs`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** `settings` test: batch size and the switch round trip through the config and invalid values are refused; `updater` test with the fake driver: switch off means no timer, manual check works, forced update still downloads, the gap is enforced, progress passes through; `npm run typecheck` clean; all earlier tests pass. Manual: the page renders, the switch survives a restart, a published higher version is found by "Check now".

### Phase 48 — Large-company QA, tuning and release notes
**Goal:** The numbers behind the defaults are measured, the real-Tally checklist is ready for the owner, and the release notes are written.
**Depends on:** Phase 47
**In scope:** Run the generated 50k and 200k companies with batch sizes 100, 500 and 1000 and record time and peak memory in the Phase 48 entry; tune the default size and the memory cap (Option B) if needed, with the measured reason; extend `docs/soak_test.md` with a "real Tally, large company" procedure (batch size ladder, what to watch in Tally and in the Logs page, what to send back for `TW-CRASH-01`); finalise the `TW-*` checklist in `docs/specs/tally-real-world-notes.md`; update Known issues; `CHANGELOG.md` notes for the release; the release itself uses the Phase 42 pipeline (tag, workflow, installer) and is done by the owner.
**Out of scope:** New features, a rewrite of the extraction, signing.
**Key files:** `docs/soak_test.md`, `docs/specs/tally-real-world-notes.md`, `CHANGELOG.md`, `PHASE_STATUS.md`
**Legacy reference:** — (new in LazyBooks / infrastructure)
**How to verify locally:** The measured table exists in `PHASE_STATUS.md`; every test passes; `npm run typecheck` and `npm run build` pass; the soak document can be followed by someone who has not read the specs.
