# INTEGRATION_CHECKLIST - what is proven where

Repos are built independently against the shared fixtures (D-14). This list says, for every cross-repo behaviour, which repo proves it with shared material (**self**), and which items need a real peer, a real Tally or a real device (**human**, after the kits are built). A phase `verify` line cites an item id instead of requiring another repo. "Mock" means the shared fixture or reference tool stands in for the peer.

Result column: record `pass`/`fail`/`not run` and the date in the repo's `PHASE_STATUS.md` under Decision log. Items marked `assumed` stay assumed until a human runs them.

## A. Proven inside one repo with shared material
| Id | Behaviour | Repo(s) that prove it | How (mock) | Pass criterion |
|---|---|---|---|---|
| FX-01 | Fixtures self-consistent | any | `fixtures/tools/check_all.py` | all four steps ok |
| SCHEMA-01 | Local schema matches `data_model.json` | pwa (Dexie), desktop (SQLite), mobile (SQLite via host) | generate from `data_model.json`; load `fixtures/tables`; read back | rows equal after canonical dump (`lbmodel.dumps_canonical`) |
| SCHEMA-02 | Money stored as integer x10^4, sums exact | pwa, desktop | sum `tx_ledger_line.amount` per voucher | every voucher sums to 0 |
| WIRE-01 | Tally XML parses to the tables | desktop | parse `fixtures/tally_xml/*.xml` | equals `fixtures/tables` |
| WIRE-02 | Request templates well formed | desktop | unit test on built XML (`TALLY_WIRE.md` section 2 and 8) | XML parses; tags match `data_model.json` |
| SYNC-01 | Chunk sequence builds the store | pwa, mobile (applier); desktop (sender) | apply `sync_examples/initial_sequence.jsonl`; sender output equals it modulo chunk boundaries | store equals `fixtures/tables` |
| SYNC-02 | Encrypted sequence | pwa, mobile, desktop | decrypt `initial_sequence.enc.jsonl` with demo passphrase and test license key | store equals fixtures |
| SYNC-03 | Delta applies | pwa, mobile | apply `delta_sequence.jsonl` after initial | matches `delta_expected.json` facts |
| SYNC-04 | Every op | pwa, mobile, desktop | `sync_examples/chunks.jsonl` | upsert, delete, clear, replace_scope, delete_children behave per `SYNC_SPEC.md` |
| CRYPTO-01 | Crypto vectors | all four | `crypto_vectors.json` | KDF key, KCV, AEAD decrypt and re-encrypt equal |
| CALC-01 | Calculators match golden numbers | pwa (all), desktop (only if it computes) | run on `fixtures/tables` | every section of `fixtures/expected.json` equal |
| CALC-02 | GST computation | pwa | `entry_examples` valid invoices | recomputed tax lines equal payload |
| ENTRY-01 | Payload builders + validators | pwa (build/validate), desktop (validate) | `entry_examples/index.json` | valid files accepted; invalid files fail with the `expect` detail |
| ENTRY-02 | XML builders | desktop | build XML from every valid example | well formed; ledger lines sum to zero; names resolved from fixtures |
| ENTRY-03 | Result mapping | desktop (writer), pwa (reader) | `entry_examples/results.example.json` and `entry_rules.json` | detail to code/status per mapping |
| FLAG-01 | Flag evaluation | pwa, desktop, admin | `constants.json` `flags` | missing flag uses `missing_flag_default`; plan defaults as table |
| THEME-01 | Theme validity | admin (validate), pwa (apply) | `themes/*.json` against `THEME_SCHEMA.md` | all builtin themes valid |
| ADMIN-01 | Demo seed applies | admin | `demo/master_seed.sql` on a scratch Postgres or the real master project | license `LB-DEMO-0000-0000-0001` resolves through `app_bootstrap` |
| HOST-01 | Host bridge contract | mobile (host), pwa (adapter) | `HOST_BRIDGE.md` with a stub on the other side | every method round-trips |
| UI-01 | Standalone PWA in mock mode | pwa | demo values from `constants.json` `demo` | app runs against fixtures with no network |

## B. Needs a real peer or hardware (human, after build)
| Id | Behaviour | Who runs | Pass criterion |
|---|---|---|---|
| PEER-01 | Desktop and PWA exchange a real initial sync through one Supabase license project | human with a license project | PWA shows the same totals as the desktop vault |
| PEER-02 | Entry posted from the PWA reaches Tally and returns `posted` | human with Tally | voucher in Tally; PWA shows it after delta with `remote_id` |
| PEER-03 | Master project reachable from all three clients through `app_bootstrap` | human | activation succeeds with a real license |
| PEER-04 | Admin Edge Functions create a license that the clients accept | human | key activates on a PWA |
| PEER-05 | Mobile shell loads the real PWA build and syncs | human with an Android device | sync completes offline-first |
| PEER-06 | Desktop embedded PWA runs from the real PWA build | human | app opens inside Electron and syncs |

## C. Needs a real Tally (assumed values; update the docs when confirmed)
| Id | Question | Where assumed |
|---|---|---|
| TW-TAGS | The `tally` tags marked `A` or `L` in `DATA_MODEL_COLUMNS.md` exist and carry the expected values on real data | `data_model.json` |
| TW-FETCH | Collection requests with `NATIVEMETHOD`, nested `FETCH` and an `$AlterID` formula under `FILTERS` work on the target Tally Prime releases (TallyPrime only; Tally ERP 9 is out of scope, owner decision 2026-10-21) | `TALLY_WIRE.md` 2, 4 |
| TW-ENCODING | UTF-8 vs UTF-16 responses and illegal-character handling | `TALLY_WIRE.md` 1 |
| TW-DELETE | Guid-list diff finds deleted vouchers; cancelled stay | `TALLY_WIRE.md` 5 |
| TW-CLOSING | Closing balances equal Tally's reports | `CALC_SPECS.md` 1, 11 |
| TW-BILLS | Bill allocations tie to ledger closing | `CALC_SPECS.md` 4 |
| TW-ORDERS | `order_no`, due dates and fulfilment matching | `CALC_SPECS.md` 9 |
| TW-STOCKJ | Stock journal destination flag | `CALC_SPECS.md` 8 |
| TW-GST | Tax line derivation and rounding parity | `CALC_SPECS.md` 10, `TALLY_WIRE.md` 7 |
| TW-ENTRY-REMOTEID | `REMOTEID` attribute on import is kept and exported back; overwrite setting behaviour | `ENTRY_PAYLOADS.md` 5 |
| TW-ENTRY-ERRORS | Tally error texts match `result.tally_message_map` | `entry_rules.json` |
| TW-EINV | E-invoice and e-way actions via XML | `ENTRY_PAYLOADS.md` 3 |
| TW-QUOTE | Quotation voucher type behaves as an order type | `CALC_SPECS.md` 9 |

## D. Needs a real device or browser
| Id | Question |
|---|---|
| DEV-SQLITE | Native SQLite adapter meets the performance budget on a mid-range Android phone |
| DEV-OFFLINE | Service worker and Dexie behave offline on iOS Safari and Android Chrome |
| DEV-BIO | Biometric and secure storage behaviour (mobile) |
| DEV-PERF | Calculator budgets on the largest realistic company (add a `drv_*` table only if missed; `DATA_MODEL.md`) |
