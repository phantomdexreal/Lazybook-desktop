# STANDALONE_RUN - run each repo alone with the demo company

Every repo can be built and checked without any other repo. Shared material: `../fixtures/`, `../sync_examples/`, `../entry_examples/`, `../constants.json`, `demo/`. Demo values (fictional): license `LB-DEMO-0000-0000-0001`, company "Demo Traders Pvt Ltd", passphrase `correct horse battery staple`. Emails are `@example.invalid` placeholders.

## Self-check first (any repo)
`python3 -I docs/shared/fixtures/tools/check_all.py` must print four `ok` lines (needs Python 3 and the `cryptography` package).

## Admin
1. Create the master Supabase project (free tier). Run `sql/01_master_schema.sql`, then `demo/master_seed.sql` (idempotent). Plans get full flag sets from `constants.json`.
2. Create the admin user in Supabase Auth with the email in `constants.json` `demo.admin_email` replaced by yours (edit the email in the seed before running, or insert into `admins` by hand). Re-run section 5 of the seed.
3. The demo license points at a placeholder project; replace `url` and `anon_key` in `supabase_projects` once you have a license project. Admin UI phases verify against this data.

## Desktop
Run against the mock Tally: serve `fixtures/tally_xml/*.xml` by request id (`TALLY_WIRE.md` section 10). Run against a license project created with `sql/02_license_project_schema.sql` and `demo/license_project_seed.sql`, or against a local fake postbox that replays `sync_examples/`. Entries: feed `entry_examples/*.valid.json` and compare the built XML (checklist ENTRY-02).

## PWA
Set `NEXT_PUBLIC_MOCK_MODE=true`: the mock store loads `fixtures/tables`, bootstrap returns canned success for the demo license, and the in-memory fake postbox replays `sync_examples/` and accepts `entry_examples/`. Calculators are tested against `fixtures/expected.json`.

## Mobile
Wrap a stub page in the Capacitor shell; test `LazyHost.sqlite` with the shared conformance fixtures through the debug route (checklist SCHEMA-01, HOST-01). Drop in the real PWA export later (PEER-05).

## Real services
Everything marked human in `INTEGRATION_CHECKLIST.md` sections B-D needs a real Supabase project, Tally or device and is not part of the standalone run.
