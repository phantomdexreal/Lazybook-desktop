# CLAUDE MUST READ — LazyBooks Desktop (Connector) — Start Here, Every Session, No Exceptions

You are one of many Claude sessions building **LazyBooks** incrementally (42 phases in this repo, one phase per session). You have no memory of other sessions. Everything you need is in this zip. If something you need is not in the zip, **stop and say so** — do not guess, invent or assume.

---

## NEVER REWRITE FILES
Do not rewrite any existing file in full — no `cat > file << EOF` over an existing file, no regenerating `PHASE_STATUS.md`, `API_CONTRACTS.md`, `PROJECT_STRUCTURE.md` or source files. Use `str_replace` for every doc/source edit; append new log rows by `str_replace` on the last unique line. `create_file` is for brand-new files only. A full rewrite is allowed only if a previous `PHASE_STATUS.md` entry explicitly anticipated it (justify it there first). Stub files (`STATUS: STUB` in the first lines) are the exception: replace the stub header with real code (that is implementing, not rewriting).

## LEGAL — clean-room rule (read `docs/shared/LEGAL_REFERENCE_ONLY.md`)
`docs/reference/biz-analyst-*` is third-party decompiled code kept only to understand behaviour. Never copy/translate its code, strings, layouts, images or colours. Write a short behaviour note in `docs/specs/<topic>.md` in your own words, then implement from the note. No legacy names/branding in LazyBooks code or UI. There is no other reference code in this repo; everything else is written fresh from specs.

## ZERO-COST rule (`docs/shared/ZERO_COST_PLAN.md`)
Never introduce a paid service, paid tier, paid SDK, CDN, analytics tracker or store fee. If a feature seems to need one, implement the documented free alternative or stop and record an Open question.

## SESSION EFFICIENCY PROTOCOL
You operate under a rolling session limit. Do not waste it.
* **Extract only what you need:** `unzip archive.zip "path/to/file"` or `unzip -p archive.zip path` to read without extracting. Do not unzip everything, do not list the archive (structure is in `PROJECT_STRUCTURE.md`).
* **Read the minimum:** this file, `PHASE_STATUS.md`, your phase entry, `DEPENDENCY_VERSIONS.md`; the rest only by section. Never read reference folders cover-to-cover; use `tools/find-legacy.sh` and grep. Do not read any skill `.md` files.
* **Install once:** `npm install` once after extracting; add packages individually thereafter. Don't run builds/lint/audit unless your phase says so.
* **Verify the minimum that proves it works:** exactly the phase's "How to verify locally". If something fails after two attempts, record it under *Known issues* in `PHASE_STATUS.md` and move on.
* **Re-zip early** if time is short; mark the phase In progress with exact notes on what remains.

### Precedence
A phase's own narrower verification wording beats the generic checklist below. `PHASE_STATUS.md` beats `PHASES.md`. `docs/shared/SHARED_CONTRACTS.md` beats everything else for cross-repo behaviour.

### The prompt to give the next Claude session
> Read `CLAUDE_MUST_READ.md` inside the zip first, then `PHASE_STATUS.md`, then Phase NN in `PHASES.md`, then `DEPENDENCY_VERSIONS.md`. Don't extract the entire zip — extract only what this phase needs. Don't list the archive. Read the minimum, write from understanding, verify as the phase says. Respect the clean-room and zero-cost rules. Re-zip early if time is short. Do not read any skill .md files.

---

## 0. Who you are in this session
The human decides which repo/phase is next using `docs/shared/BUILD_ORDER.md` (phase numbers are identifiers, not the order). 1. Work out the next phase (from `PHASE_STATUS.md`). 2. Do **only** that phase. 3. Leave the repo runnable. 4. Update `PHASE_STATUS.md`. 5. Re-zip (Section 8).

## 1. Mandatory reading order
1. **`CLAUDE_MUST_READ.md`** (this file).
2. **`PHASE_STATUS.md`** — ground truth of what is done; wins over `PHASES.md` if they disagree (flag the disagreement).
3. **`PHASES.md`** — find the next incomplete phase; read ONLY its entry (goal, depends, scope, out of scope, files, legacy reference, verify).
4. **`DEPENDENCY_VERSIONS.md`** — exact versions before installing anything.
5. **`docs/shared/ECOSYSTEM.md`** once per session (5 min) and only the **relevant sections** of `docs/shared/SHARED_CONTRACTS.md`, `FEATURE_FLAGS.md`, `THEME_SCHEMA.md`, `DESIGN_SYSTEM.md`, `SECURITY.md`, `DATA_MODEL.md` (use grep), plus every file listed under **Shared inputs** in your phase entry (`CONSTANTS.md` and `constants.json`, `data_model.json`, `SYNC_SPEC.md`, `ENTRY_PAYLOADS.md`, `CALC_SPECS.md`, `TALLY_WIRE.md`, `fixtures/`, `demo/`, `INTEGRATION_CHECKLIST.md`). Everything cross-repo is already decided there.
6. `MASTERPLAN.md` and `PROJECT_STRUCTURE.md` — only the parts your phase touches.
7. `API_CONTRACTS.md` — frozen contract; extend the doc FIRST if you find a gap.
8. Reference material for your phase only: `docs/reference/biz-analyst-desktop/` (legacy connector — behaviour only; clean-room). Legacy rows for your phase: `grep` its keys in `docs/shared/FEATURE_MATRIX.md`.
9. Anything the phase entry explicitly points to.

## 2. Architecture you must understand
Electron + TypeScript. **Main process** does everything real (Tally XML client, SQLite vault, Supabase, crypto, scheduler); the **renderer** (React, same tokens/themes as the PWA) only shows status and settings through a narrow, typed IPC surface; `contextIsolation:true`, `nodeIntegration:false`.
Loop: scheduler pulls Tally incrementally (AlterID) → vault → `sync_requests` from devices are served as encrypted chunks → `entry_queue` rows are posted into Tally with idempotency → optional encrypted snapshots when flag `cloud_copy` is on → heartbeats keep the admin/PWA informed.
Reference for Tally behaviour: `docs/reference/biz-analyst-desktop/` (what is requested/parsed — clean-room only) plus Tally's own documented XML/TDL interface. No other code is provided: write specs first.

Cross-repo: the four repos share `docs/shared/` byte-for-byte. The frozen protocol is `SHARED_CONTRACTS.md`. To change anything shared follow §11 there (changelog + version bump + mirror log in `PHASE_STATUS.md`) and tell the human which repos need the mirror.

**Repos are independent (D-14).** Every cross-repo value is predefined in `docs/shared`. Never wait for, read, or assume another repo. A phase never authors a shared spec. If a value you need is missing from `docs/shared`, record it under Open questions in `PHASE_STATUS.md`, use the nearest documented default and mark it `assumed`. Where a peer is needed to prove something, use the shared fixtures or a mock peer and cite the `INTEGRATION_CHECKLIST.md` item id; items marked human there are not yours to run.

## 3. Auth model (summary — details in SHARED_CONTRACTS §2, §4 and SECURITY.md)
One Supabase Auth user per login, **issued manually by the admin** (no OTP for now; keep the seam for OTP/self-signup later). Authorisation uses `app_metadata.license_key` + `app_metadata.role` (`owner|staff|connector`). **Never use `user_metadata` for authorisation.** No service_role key, PAT or GitHub token ever appears in client code, `.env*` that is committed, logs or docs.

## 4. Non-negotiable build rules
### 4.1 Edit and upsert first
Modify existing files in place with the smallest correct change; never delete-and-recreate.
### 4.2 Scope discipline
Only the next phase. If you find a bug from an earlier phase, note it in `PHASE_STATUS.md → Known issues` and fix it only if it blocks your phase (say so).
### 4.3 Layer separation
* All Tally I/O goes through `src/main/tally/client.ts` (serialised: Tally is single-threaded). Never match literal voucher-type/ledger names (Name-independence rule).
* The renderer never gets Node, Supabase keys, passphrase or file paths beyond what an IPC method returns.
* Secrets only via `safeStorage`; never logged. Logs are JSON lines with redaction.
* Every Supabase interaction respects the polling/rate budget in SHARED_CONTRACTS §4.1.
* Never post a voucher without the idempotency pre-check (SHARED_CONTRACTS §4.2).
### 4.4 The Name-independence rule (Tally)
Never match custom/literal names (voucher types, ledgers); resolve via `ref_voucher_kind` and the `tm_group` hierarchy walk (`docs/shared/DATA_MODEL.md`). The software must work unmodified for any company's Tally setup.
### 4.5 No secrets in clients (see SECURITY.md); CI greps enforce it.
### 4.6 Contracts
Never invent a shape that differs from `API_CONTRACTS.md` or `SHARED_CONTRACTS.md`. Extend the doc first, then implement to match.

## 5. UI/UX rules (`docs/shared/DESIGN_SYSTEM.md`, `THEME_SCHEMA.md`)
Violet-and-black, sleek, non-generic. All colours/radii/fonts come from theme tokens (`--lb-*`); no hardcoded colours in components. Every theme has **light and dark**; the user picks theme + mode; admin-pushed themes/branding must apply without redeploy. Phosphor icons only, **no emoji anywhere (UI, docs, code comments, commit messages, logs)**, no burger menus (bottom tabs on mobile / side rail on desktop + More launcher + command palette). Verify at the status window at 1024×700 and 1366×768, each in light AND dark mode.

## 6. Local testability
* `tools/mock-tally/` = a small HTTP server speaking Tally's XML subset that serves `docs/shared/fixtures/tally_xml/*.xml` by request id and answers voucher imports with a canned success (`TALLY_WIRE.md` section 10; built in Phase `scaffold`, extended per Tally phase). Real Tally verification is recorded as 'manual-verify' in PHASE_STATUS when no Tally is available.
* `tools/fixture-device/` (build in `request-listener`) = a script acting like a PWA device for end-to-end tests against a real license project.
* Golden XML fixtures for builders live in `tests/fixtures/xml/`.

## 7. If you run out of session before finishing
Re-zip immediately, mark the phase In progress in `PHASE_STATUS.md` with exactly what is left and what you verified, and stop.

## 8. Re-zipping — exact command
From the repo's parent directory:
```bash
zip -r lazybooks-desktop_phaseNN.zip lazybooks-desktop \
  -x "lazybooks-desktop/node_modules/*" -x "lazybooks-desktop/.next/*" -x "lazybooks-desktop/out/*" -x "lazybooks-desktop/dist/*" \
  -x "lazybooks-desktop/android/build/*" -x "lazybooks-desktop/android/app/build/*" -x "lazybooks-desktop/.git/*" -x "lazybooks-desktop/.env.local"
```
`NN` = phase just completed (`NN-partial` if stopped mid-phase). Never zip `node_modules` or build output; always zip the lockfile. Present the zip.

## 9. Dependency versions
Check `DEPENDENCY_VERSIONS.md` before installing; record any change there and in `PHASE_STATUS.md`.

## 10. Diagnostics requirement
The Logs page (Phase `ui-logs`) and `tools/export-diagnostics` must work from the first phase that logs anything; every phase adds structured log events for its actions.

## 11. Wiping local data
Vault reset: Tools → Reset vault (Phase `ui-tools`). Escape hatch: quit the app, delete `%APPDATA%/LazyBooks/vault/` (keep `config.json` to retain activation), relaunch → full resync.

## 12. Verification — every phase
Run exactly the phase's verify step; for UI phases check the status window at 1024×700 and 1366×768, each in light AND dark mode. Note any step you could not perform (e.g. no real Tally, no real Supabase) in `PHASE_STATUS.md` as *unverified*, never as done.

## 13. Before you finish — checklist
- [ ] Only this phase's scope was touched
- [ ] Existing files edited in place; any full rewrite justified in `PHASE_STATUS.md`
- [ ] The phase's local-verify steps actually pass (or are recorded as unverified with reason)
- [ ] `PHASE_STATUS.md` updated (phase row, date, decisions, deviations, known issues, next phase)
- [ ] New files are in `PROJECT_STRUCTURE.md`; new/changed functions are in `API_CONTRACTS.md`
- [ ] If `docs/shared/` changed: changelog + `SHARED_VERSION` bump + mirror note
- [ ] No hardcoded colours, no second icon library, no emoji anywhere (docs, code, UI, commit messages); no secrets; no legacy branding (`grep -riE "bizanalyst|biz analyst|khatabook|siliconveins" app views components hooks lib src native scripts styles public` is empty — docs and `docs/reference` are exempt)
- [ ] Re-zipped per Section 8

Then hand the zip back. That is your whole job.
