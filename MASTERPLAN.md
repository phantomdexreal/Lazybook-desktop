# MASTERPLAN — LazyBooks Desktop (Connector)

Windows tray app that reads Tally, keeps the SQLite vault, answers device requests through the postbox, writes entries back into Tally, and can host the PWA.

Read first: `docs/shared/ECOSYSTEM.md` (how the four repos fit) and `docs/shared/SHARED_CONTRACTS.md` (frozen cross-repo protocol). This file adds what is specific to **lazybooks-desktop**.

## Architecture
Electron + TypeScript. **Main process** does everything real (Tally XML client, SQLite vault, Supabase, crypto, scheduler); the **renderer** (React, same tokens/themes as the PWA) only shows status and settings through a narrow, typed IPC surface; `contextIsolation:true`, `nodeIntegration:false`.
Loop: scheduler pulls Tally incrementally (AlterID) → vault → `sync_requests` from devices are served as encrypted chunks → `entry_queue` rows are posted into Tally with idempotency → optional encrypted snapshots when flag `cloud_copy` is on → heartbeats keep the admin/PWA informed.
Reference for Tally behaviour: `docs/reference/biz-analyst-desktop/` (what is requested/parsed — clean-room only) plus Tally's own documented XML/TDL interface. No other code is provided: write specs first.

## Layer / boundary rules
* All Tally I/O goes through `src/main/tally/client.ts` (serialised: Tally is single-threaded). Never match literal voucher-type/ledger names (Name-independence rule).
* The renderer never gets Node, Supabase keys, passphrase or file paths beyond what an IPC method returns.
* Secrets only via `safeStorage`; never logged. Logs are JSON lines with redaction.
* Every Supabase interaction respects the polling/rate budget in SHARED_CONTRACTS §4.1.
* Never post a voucher without the idempotency pre-check (SHARED_CONTRACTS §4.2).

## Module map
tally (client, masters, vouchers, closing, reconcile, guards) · db (schema, upsert, cursors) · sync (scheduler) · postbox (listener, chunker, serve, hygiene) · crypto · entries (listener, builders, masters, idempotency, results, einvoice, alter) · snapshot · renderer UI · updater · pwaHost.

## Data
SQLite vault per `docs/shared/DATA_MODEL.md` (columns, types and indexes are fixed in `docs/shared/data_model.json`; phase `sqlite-schema` generates the DDL from it, and `TALLY_WIRE.md` gives the Tally mapping). Per-device cursors let each device receive only what changed. Deletions are tombstones turned into `delete` change operations.

## Tally facts (from the legacy reference — verify on a real Tally)
XML over HTTP on port 9000; requests: Export Data, Collections with `<FETCH>`, Functions (`$$LicenseInfo`, `$$ProdInfo`), Import Data envelopes; incremental by AlterID; deleted vouchers are not announced (daily reconciliation); renames require fixing references; Tally may block while a user works — serialise calls and back off.

Real-run facts (2026-10-27, details in `docs/specs/tally-real-world-notes.md`): TallyPrime has no `Employee` object type (employees are cost centres; asking for it raises a blocking dialog); Tally keeps working on a request after the client gives up, so never repeat a timed-out heavy request in place; one huge voucher request per year is not survivable on a big company, so vouchers are read in bounded pieces (months today, record-count batches in Milestone 9).

## Security
`docs/shared/SECURITY.md`; Electron hardening; secrets via `safeStorage`.


## Phase overview
* **MILESTONE 1 — Foundation & Activation** — Phases 1–6: Exit: tray app runs on Windows, stores secrets safely, activates a license, logs in as the `connector` user, sends heartbeats.
* **MILESTONE 2 — Tally Reader** — Phases 7–14: Exit: complete read of masters/vouchers/derived inputs from TallyPrime into memory structures, incremental via AlterID, matching the behaviour documented in the legacy reference notes.
* **MILESTONE 3 — Local SQLite Vault & Derived Data** — Phases 15–18: Exit: durable local database is the source of truth; derived tables computed once here.
* **MILESTONE 4 — Postbox Server Side** — Phases 19–23: Exit: connector answers device requests through the license project; E2E encrypted; compatible with the PWA kit's client.
* **MILESTONE 5 — Write-Back to Tally** — Phases 24–30: Exit: every entry kind in the PWA's Milestone 7 can be posted into Tally, idempotently, with reported results.
* **MILESTONE 6 — Cloud Copy (flag `cloud_copy`)** — Phases 31–32: Exit: optional encrypted snapshots in the license project's Storage let new installs bootstrap while the PC is off.
* **MILESTONE 7 — Connector UI** — Phases 33–37: Exit: a non-technical user can run and understand the connector.
* **MILESTONE 8 — Packaging, Updates, Optional Embedded PWA** — Phases 38–42: Exit: installer built in CI, auto-updates from GitHub Releases, optional PC UI via embedded PWA.
* **MILESTONE 9 — Large-Company Reliability & Controls** — Phases 43–48 (planned 2026-10-27): Exit: 100k+ voucher companies sync without Tally freezing or the app closing, vouchers are read in user-sized batches (setting), the Status page shows a progress bar with totals, and automatic update checks have an on/off switch. The current Tally extraction is kept; batching is added around it. See `docs/specs/voucher-batching.md`, `sync-progress.md`, `update-controls.md`, `tally-real-world-notes.md`.

## Cross-repo dependencies
See `docs/shared/BUILD_ORDER.md` and each phase's `Depends on` line.

## Non-goals (zero-cost, clean-room)
No paid services (`docs/shared/ZERO_COST_PLAN.md`), no vendor code/branding (`docs/shared/LEGAL_REFERENCE_ONLY.md`), no secrets in clients (`docs/shared/SECURITY.md`).
