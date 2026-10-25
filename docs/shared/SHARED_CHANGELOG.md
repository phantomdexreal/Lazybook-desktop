# SHARED_CHANGELOG

Append-only. Format: `## <version> — <date> — <summary>` then what changed, why, and which repos must mirror.

## 1.0.0 — 2026-10-19 — Initial planning kit
All shared docs, SQL schemas (master + license project, tested on Postgres), 3 sample themes (WCAG-checked), crypto test vectors.

## 1.0.1 — 2026-10-19 — Exact build order; independent naming
BUILD_ORDER.md rewritten as a machine-checked step list (175 phases, each once, no prerequisite violations). Removed all material and inherited naming from an earlier reference project: data model, change operations, control tables and module/function names are now LazyBooks' own; registry RPC field names changed to project_url/project_anon_key; sync_chunks.op values changed. No emoji anywhere. Mirror: copy docs/shared and re-run license/master SQL tests.

## 1.0.2 — 2026-10-19 — Native SQLite storage on Android
Added decision D-13 and the storage adapter layer (`lib/store`, neutral schema, conformance suite). HOST_BRIDGE gains `capabilities.sqlite` and the `sqlite` API (`@capacitor-community/sqlite`, SQLCipher on Android). DATA_MODEL: single neutral schema, amounts rule. BUILD_ORDER regenerated (180 phases). No contract_version change (local storage is not part of the wire protocol). Mirror: copy docs/shared.

## 1.0.3 — 2026-10-21 — Repos made independent (D-14)
Added: `constants.json`, `data_model.json` (26 tables, 400 columns) with generated `DATA_MODEL_COLUMNS.md`, `SYNC_SPEC.md`, `ENTRY_PAYLOADS.md` + `entry_rules.json`, `CALC_SPECS.md`, `TALLY_WIRE.md`, `CONSTANTS.md`, `INTEGRATION_CHECKLIST.md`, `fixtures/` (synthetic company, mock Tally XML, golden numbers, Python reference tools), `sync_examples/`, `entry_examples/`, `demo/` (seeds, env sample, standalone run). DATA_MODEL and BUILD_ORDER updated; ECOSYSTEM gains D-14. SHARED_CONTRACTS gains section 0 and states the additive wire shapes (`clear` with `{company_guid}`, `replace_scope` with `company_guid`, default omission in upserts, snapshot object layout). Phases no longer author any shared spec and no longer depend on another repo. No contract_version or schema_version change (all additions are additive). Values not confirmed on a real Tally are marked assumed (see INTEGRATION_CHECKLIST section C). Mirror: copy docs/shared into all four repos.

## 1.0.3 addendum — 2026-10-21 — Checked against Tally's public docs
TALLY_WIRE corrected: REMOTEID is a voucher attribute, collections use FILTERS, import response is IMPORTRESULT/RESPONSE, alter by master id, Cancel/Delete marked assumed; section 11 lists what is confirmed vs assumed. No contract or schema change. Mirror: copy docs/shared.

## 1.0.3 addendum 2 — 2026-10-21 — TallyPrime only
Owner decision: only TallyPrime is supported; ERP 9 removed from TALLY_WIRE, INTEGRATION_CHECKLIST and BUILD_ORDER. No contract or schema change. Mirror: copy docs/shared.
