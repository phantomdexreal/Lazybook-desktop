# BUILD_ORDER (shared-docs 1.0.3)

**Each repo is independent (D-14).** Every cross-repo value is predefined in `docs/shared`, so a Claude session in one repo can finish all of that repo's phases using only that repo's kit plus `docs/shared`; a peer repo is never needed and a mock peer (shared fixtures, `INTEGRATION_CHECKLIST.md` section A) stands in. The simplest plan is to build the repos one after another in this order: **Admin, Desktop, PWA, Mobile**, each from its own first phase to its last, then run the human integration items (section B of the checklist). The table below is an OPTIONAL interleaved order (useful when one person wants a working end-to-end slice early); the independent order above is always valid.

Phase **numbers are identifiers, not the order**. Follow the steps below top to bottom, one phase per Claude session. When a step lists several repos, do them in the sequence written (left to right). This order was machine-checked: all 180 phases appear exactly once and no phase precedes anything it depends on (`Depends on` lines in each repo's `PHASES.md` name only phases of that same repo and files in `docs/shared`).

Notation: `Repo n-m` = phases n to m of that repo (see its PHASES.md). Arrow = do next. Phases marked deferred are intentionally later than their number suggests.

| Step | Do (in this order) | After this step you have |
|---|---|---|
| 1. Master project + first license | **Admin** 1–8 | Live master Supabase project, admin sign-in, license keys can be issued. |
| 2. First license project + logins | **Admin** 11, 13, 15 | A license project with the schema applied and owner + connector logins (manual SQL in docs/shared/SUPABASE_MIGRATIONS.md is the fallback if you skip these). |
| 3. Foundations (independent, run in parallel if you like) | **PWA** 1–8 → **Desktop** 1–4 | PWA shell with themes, the storage layer (Dexie adapter, shared conformance suite, SQLite adapter proven against a test host) and a desktop tray app with its UI shell. Neither needs the backend yet. |
| 4. Activation and devices | **PWA** 9–12 → **Desktop** 5–6 | A device can activate with a license key, log in, and register; the connector can log in and send heartbeats. |
| 5. Tally reader + vault | **Desktop** 7–16, 18 | Connector reads masters/vouchers from Tally (mock or real) into SQLite on a schedule. (Phase 17 derived-tables stays conditional: do it only when a calculator is recorded as missing its budget.) |
| 6. Sync pair (optional interleave; each side can instead finish alone against the shared sync examples) | **PWA** 16 → **Desktop** 19–20 → **PWA** 17 → **Desktop** 21–22 → **PWA** 18–20 → **Desktop** 23 | End-to-end initial + delta sync, encrypted, from Tally to the PWA's IndexedDB. The shared `sync_examples/` and the PWA mock mode let the PWA run without Desktop. |
| 7. Offline core | **PWA** 22–26 | Sync status/debug, DB viewer, multi-company, search, and the on-device read/calculator layer. |
| 8. Reports, money, stock, orders (read-only app complete) | **PWA** 27–58 → **Desktop** 33–37 → **Admin** 16–19 | Every read-only screen. Connector UI and fleet dashboards fit alongside. |
| 9. Push features (themes, branding, releases) | **Admin** 20–24 → **PWA** 13–15 | Admin can push themes, logos and versions; the PWA's remote theme/branding/update phases use `THEME_SCHEMA.md` and the shared themes, and need no live Admin. |
| 10. Write-back to Tally | **Desktop** 24 → **PWA** 59–60 → **Desktop** 25–28 → **PWA** 61–68 → **Desktop** 29 → **PWA** 69 → **Desktop** 30 → **PWA** 70–72 | Phone creates entries and they appear in Tally. Interleave is optional: queue + builders first, then each voucher kind, then e-invoice and alter/cancel. Both sides follow `ENTRY_PAYLOADS.md` and `entry_examples/`. |
| 11. Team, field force, payroll | **PWA** 73–77 | Staff users, permissions, salespersons, punch in/out, payroll. |
| 12. Settings, lock, push, accessibility, performance | **PWA** 78–82 → **Desktop** 17 | Settings parity, app lock, web push, i18n/a11y, perf pass. Desktop 17 (derived tables) is CONDITIONAL: do it only if the perf pass records a calculator missing its budget; otherwise mark it skipped in PHASE_STATUS. |
| 13. Cloud copy (last functional feature) | **Desktop** 31–32 → **PWA** 21 | New installs can restore while the PC is off (per-license toggle). |
| 14. Admin operations | **Admin** 25–29, 9–10, 12, 14 | Announcements, maintenance, support queue, audit, team; license detail, account pool, provisioning, assignment. |
| 15. Release the PWA | **PWA** 83–85 → **Admin** 30–33 | Electron-ready, QA, GitHub Pages deploy + publish hook. |
| 16. Ship the desktop installer | **Desktop** 38–42 | Installer, auto-update, optional embedded PWA, hardening, release. |
| 17. Android app | **Mobile** 1–20 | Capacitor shell, native SQLite storage (encrypted), native capabilities, on-device benchmark, signed APK, in-app updater. |

## Deferred / conditional phases (why their number is early or late)
* **PWA 13–15** (remote branding/themes, update flow, appearance settings) are built against `THEME_SCHEMA.md`, `themes/` and `constants.json` `branding`/`releases`; live pushing from Admin is a human integration item (PEER-04), not a prerequisite.
* **PWA 21** (cloud-copy restore) is built against `SYNC_SPEC.md` section 8 and verified with a stub snapshot; the real pair is checked by the human items.
* **Desktop 17** (derived tables) is conditional: only if the PWA performance phase (PWA 82) records a slow calculator; otherwise mark it skipped.
* **Admin 9, Admin 10, Admin 12, Admin 14** are conveniences; the manual path in `SUPABASE_MIGRATIONS.md` covers the first license project until they exist.
* **Mobile** does not need the PWA or Admin to be finished: it wraps a stub PWA page until the real build is dropped in (PEER-05), and follows `HOST_BRIDGE.md`, `constants.json` and `THEME_SCHEMA.md`.
* **Storage layer:** the adapter interface, conformance suite and SQLite adapter (PWA 6–8) come first so every later phase writes against `lib/store`; native SQLite on the phone is Mobile 4, encrypted in Mobile 5, and benchmarked on real devices in Mobile 15.

## Pairs that used to be "co-developed"
None remain. The former pairs (PWA 16-20 with Desktop 19-23, PWA 59-72 with Desktop 24-30) share these files instead: `SYNC_SPEC.md`, `crypto_vectors.json`, `sync_examples/`, `ENTRY_PAYLOADS.md`, `entry_examples/`, `TALLY_WIRE.md`, `fixtures/`. Each side proves itself against them; `INTEGRATION_CHECKLIST.md` lists what a human verifies with both sides running.

## Hard external prerequisites (not phases)
A free Supabase account for the master project (Step 1) and one for the first license project (Step 2); a GitHub account (release steps); TallyPrime (ERP 9 is out of scope) with XML/ODBC enabled for real-Tally verification (from the Tally reader step; the mock Tally covers development); an Android phone (ideally a low-end one) for the mobile steps.

## Where each repo first appears
Admin: Step 1. Desktop and PWA: Step 3. Mobile: last step. Do not start a repo's later phases early because they look more interesting.
