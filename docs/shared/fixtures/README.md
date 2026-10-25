# fixtures - one synthetic company, used by every repo

Company "Demo Traders Pvt Ltd" (fictional): FY 2026-04-01..2027-03-31, as-of 2026-09-30, Maharashtra, 19 ledgers, 6 stock items, 2 godowns, 15 voucher types (custom "Tax Invoice" and "Sales Quotation", renamed "Suppliers" group), 52 vouchers covering every voucher kind, including one cancelled, one optional and two vouchers entered from a phone.

| Folder | What | Use |
|---|---|---|
| `tables/*.json` | the 26 tables as rows, exactly as stored (decimal strings, ISO dates) | seed a mock store; compare calculators; compare sync results |
| `tally_xml/*.xml` | the same company as Tally collection responses | mock Tally server; parser tests (`TALLY_WIRE.md`) |
| `expected.json` | golden numbers: trial balance, P&L, balance sheet, outstanding and ageing, payment status, last sale, stock and batch closing, pending orders, GST summary | calculator tests (`CALC_SPECS.md`) |
| `../sync_examples/` | chunk sequences (plain, encrypted, delta) | sync and applier tests (`SYNC_SPEC.md`) |
| `../entry_examples/` | valid and invalid entry payloads | entry builders and validators (`ENTRY_PAYLOADS.md`) |
| `tools/` | Python reference tools (standard library plus `cryptography` for sync only) | regenerate and self-check |

Tools (run with `python3 -I <tool>.py` from `fixtures/tools`): `check_all.py` runs everything below in order. `build_fixtures.py` regenerates `tables/` from `fx_source.py`. `check_fixtures.py` writes `tally_xml/`, parses it back and loads SQLite (must report 0 problems). `compute_expected.py [--check]` writes or verifies `expected.json`. `check_sync.py` verifies crypto vectors and rewrites `sync_examples/`. `make_entry_examples.py` rewrites `entry_examples/`; `validate_entries.py` checks them. `gen_column_docs.py` rewrites `../DATA_MODEL_COLUMNS.md`. `gen_bench_data.py [N] [out]` scales the company to N vouchers as a chunk sequence for storage benchmarks (not run by `check_all`; data is not accounting-consistent). `gen_demo_seeds.py` rewrites `../demo/*.sql`. `lbmodel.py` holds the model loader, money helpers and DDL generation; `sync_ref.py` the chunker and applier; `tally_xml_io.py` the mock-XML emitter and reference parser.

The fixtures are fictional. Nothing here comes from a real company. Values that depend on real Tally behaviour are still `assumed` (see `TALLY_WIRE.md`, `INTEGRATION_CHECKLIST.md`).
