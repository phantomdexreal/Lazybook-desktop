# docs/derived_formulas.md

> LazyBooks | docs/derived_formulas.md
> Responsibility: OPTIONAL derived tables `drv_*` (perf-driven)
> Introduced by: Phase 17 (derived-tables) — see PHASES.md before editing.
> STATUS: DECIDED — no derived tables are implemented (decision D-06, default).

## Decision (Phase 17, 2026-10-25)

No `drv_*` table exists in the vault and no `src/main/calc/` code exists. The PWA computes reports and calculators on the device from the synced raw tables (D-06). A `drv_*` table may be added only when the PWA kit's `perf-pass` phase records a calculator that misses its budget. No such record exists in this repo or in `docs/shared`, so nothing is built.

## Perf-failure register

| Date | Calculator (PWA `lib/calc/*`) | Budget | Measured | Table requested | Status |
|---|---|---|---|---|---|
| (none recorded) | | | | | |

## How to add a derived table later

1. Get the recorded perf failure from the PWA kit (calculator, budget, measurement) and add a row above.
2. Copy the formula from the PWA's `lib/calc/*` (single source of truth); do not invent a variant. Write it below under the table name, with inputs (synced `tm_*` / `tx_*` columns), output columns and rounding.
3. Add the table through a new vault migration (migration 3 or later; never edit migrations 1 or 2) and register it in `docs/shared/data_model.json` via the SHARED_CONTRACTS section 11 process (changelog, version bump, mirror to the other repos).
4. Fill it from `src/main/calc/<name>.ts` inside the same write transaction as the raw upsert, so the change tracking of `src/main/db/upsert.ts` carries it to devices.
5. Verify: golden fixtures equal the PWA calculator output.

## Candidates (all unbuilt)

`drv_outstanding` (outstanding and ageing), `drv_invoice_payment_status`, `drv_customer_last_sale`, `drv_pending_orders`, `drv_batch_closing`.

## Formulas

None yet.
