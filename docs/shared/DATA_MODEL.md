# DATA_MODEL — canonical Tally-derived tables (device IndexedDB and desktop SQLite)

Original LazyBooks design. **The columns, types, defaults, indexes, Tally tags and derivations are fixed in `data_model.json`** (rendered for reading in `DATA_MODEL_COLUMNS.md`). No phase invents or changes columns; a change is a `SHARED_CHANGELOG.md` entry that regenerates both files. Sample data for every table: `fixtures/tables/`.

## Master tables (`tm_*`)
`tm_company, tm_group, tm_ledger, tm_ledger_address, tm_ledger_contact, tm_ledger_gst, tm_voucher_type, tm_stock_item, tm_stock_item_gst, tm_stock_group, tm_stock_category, tm_unit, tm_godown, tm_cost_centre, tm_currency, tm_employee, tm_gst_registration`
## Transaction tables (`tx_*`)
`tx_voucher, tx_ledger_line, tx_inventory_line, tx_batch_alloc, tx_bill_alloc, tx_tax_line`
## Reference
`ref_voucher_kind` — maps every company-defined voucher type (via its parent type in Tally) to a base kind (sales, purchase, receipt, payment, contra, journal, credit note, debit note, delivery note, receipt note, stock journal, order kinds…).
## Control tables (device only, prefix `_lb_`)
`_lb_config, _lb_prefs, _lb_sync_state, _lb_sync_log, _lb_lb_entry_drafts, _lb_lb_calc_cache, _lb_recent, _lb_kv`
## LazyBooks small tables (license project; mirrored on device where useful)
`followups, reminder_jobs, reminder_log, punch_logs, team_users, app_settings` — defined in `sql/02_license_project_schema.sql`.
## Optional (perf-driven, desktop-computed) `drv_*`
`drv_outstanding, drv_invoice_payment_status, drv_customer_last_sale, drv_pending_orders, drv_batch_closing` — create ONLY when the PWA `perf-pass` phase records a calculator missing its budget.

## Storage
`data_model.json` is the single definition. The PWA `dexie-schema` phase and the Desktop `sqlite-schema` phase GENERATE their schema from it (Dexie stores/indexes; SQLite `CREATE TABLE`/`CREATE INDEX`); the reference generator is `ddl_sqlite` in `fixtures/tools/lbmodel.py`. Column types: `text`, `int`, `bool` (stored 0/1), `date` (ISO text), `json` (object in Dexie, TEXT in SQLite), `decimal` (stored as integer x10^4). Every table has the primary key and indexes listed in the file; every index starts with `company_guid` except on `tm_company` and `ref_voucher_kind`. `ref_voucher_kind` rows are the `seed_rows` in the file and ship inside each app. Mobile uses the PWA adapter on top of native SQLite and the same generated DDL.

## Hard rules
1. **Name independence:** never match literal voucher-type or ledger names (companies rename them). Resolve via `ref_voucher_kind` and the `tm_group` parent chain.
2. **Stable identity:** every `tx_*` row has a deterministic composite key (e.g. `voucher_guid + line_index`), never an auto-increment, so replays are idempotent and never duplicate.
3. Tally exports many references by NAME, not GUID — store what Tally gives, and keep one shared resolver module for name→GUID lookups.
4. Deletion/rewrite only through the change operations in SHARED_CONTRACTS §4.1. Re-inserting a voucher first sends `delete_children` for it.
5. Amount sign conventions are fixed in `CALC_SPECS.md` section 1 (Tally sign kept: debit negative, credit positive); every report follows it. Confirmation against Tally's own reports is checklist item TW-CLOSING.
6. **Amounts:** no binary floating point in stored or summed money. The representation is fixed: decimal string on the wire, integer x10^4 in storage, half-away-from-zero rounding (`constants.json` `money`). Both adapters must produce identical sums (checklist SCHEMA-02).
7. Dates are Tally `YYYYMMDD` on the wire; store ISO `YYYY-MM-DD`; keep the conversion in one module.
