# ENTRY_PAYLOADS - what a device writes into `entry_queue.payload`, and what comes back

Original LazyBooks design. Machine-readable rules: `entry_rules.json` (field names, types, limits, allowed base kinds, semantic checks S01-S11, result mapping). Examples that validate against it: `entry_examples/` (index in `entry_examples/index.json`). Reference validator: `fixtures/tools/validate_entries.py` (run it; it checks every example and reports the detail code). Amount and rounding rules: `CALC_SPECS.md` section 10. Limits: `constants.json` `limits`, `entries`.

The PWA builds and validates payloads before queueing (same rules). The desktop re-validates, builds the Tally XML (`TALLY_WIRE.md` section 8) and writes the result. A payload that passes the reference validator must be accepted by both.

## 1. Envelope (one per `entry_queue` row)
```
{ "v": 1, "kind": "<kind>", "client_request_id": "<uuid v4>", "company_guid": "<tm_company.guid>",
  "created_at": "<ISO UTC>", "device_id": "<uuid v4>", "data": { ... per kind ... } }
```
`entry_queue.client_request_id` and `entry_queue.kind` repeat the envelope values; the full envelope is the `payload` column. Unknown extra keys are rejected (`PAYLOAD_INVALID`). `v` other than 1 gives `UNSUPPORTED_VERSION`. Payload size is at most `limits.entry_payload_max_bytes`.

## 2. Conventions inside `data`
- Every reference is a `*_guid` from the synced tables; never names. Tally names are resolved by the connector from the guid at post time. A guid of the form `n:<name>` is a name-only master (data_model.json conventions).
- Amounts: decimal strings (`^-?\d+(\.\d{1,4})?$`). In payloads, amounts are unsigned magnitudes except `round_off.amount` which is signed (positive adds to the total). Direction comes from the kind and the field names (`side` on journal lines).
- Dates ISO `YYYY-MM-DD`. `base_kind` repeats `tm_voucher_type.base_kind` and must match it (check S03); this guards against a device with stale masters.
- Numbers (`qty`, `rate`) are strings too. `gst_rate` is the item's total GST rate in percent (check S06).

## 3. Kinds
| kind | data (see `entry_rules.json` for every field) | allowed base kinds | flag |
|---|---|---|---|
| `invoice` | party, item_ledger, lines[], charges[], tax{mode,lines[]}, round_off, total, bills[], einvoice, eway | sales, purchase, credit_note, debit_note | `entries`; `einvoice`/`eway` blocks need `einvoice_eway` |
| `receipt`, `payment` | party, cash_bank ledger, amount, bills[], instrument | receipt / payment | `entries` |
| `contra` | from_ledger, to_ledger, amount, instrument | contra | `entries` |
| `journal` | lines[{ledger, side dr/cr, amount, bills?}] | journal | `entries` |
| `inventory_voucher` | delivery/receipt notes and rejections: party + lines[]; stock journal: source_lines[] + destination_lines[] | delivery_note, receipt_note, rejections_in, rejections_out, stock_journal | `entries` |
| `order` | party, lines[] with due_date | sales_order, purchase_order | `orders` |
| `quotation` | like order plus valid_till; voucher type must equal `app_settings.quotation_voucher_type_guid` | sales_order | `orders` |
| `ledger` | name, parent_group_guid, opening_balance, gstin, address[], credit_period_days, is_billwise, bank... | none | `entries` |
| `stock_item` | name, parent_stock_group_guid, unit_guid, hsn, gst_rate, gst_taxability, opening{godown,qty,rate}, reorder_level... | none | `entries` |
| `alter` | target_voucher_guid, expected_alter_id, action (`replace`, `einvoice_generate`, `einvoice_cancel`, `eway_generate`, `eway_cancel`), replacement (the full new `data` of the target kind), reason, remarks, eway{} | none | `entries` (e-invoice / e-way actions: `einvoice_eway`) |
| `cancel` | target_voucher_guid, expected_alter_id, reason | none | `entries` |
| `delete` | target_voucher_guid, expected_alter_id | none | `entries` |
Flag names refer to `FEATURE_FLAGS.md`; the connector refuses with `FLAG_DISABLED` when the effective flag is off.

Decisions (all **fixed** unless marked):
- There are no separate e-invoice or e-way kinds; they are `alter.action` values. `einvoice_generate` and `eway_generate` run Tally's own flow on an existing voucher; Tally's responses (IRN, ack number, e-way bill number) come back in `result.message` (assumed, depends on the Tally release and its configuration).
- `alter` with `replace` carries the entire replacement; the connector alters the voucher in place by guid. `expected_alter_id` is the alter_id the device saw; when Tally's current alter_id differs the connector refuses with `ALTER_CONFLICT` (status `needs_review`) and does not touch Tally.
- Quotations are ordinary orders posted under a company voucher type that the owner designates (`app_settings.quotation_voucher_type_guid`); they are excluded from pending orders (CALC_SPECS 9).
- Bill allocation types: `new_ref` (party line creates the bill; name defaults to the voucher number), `agst_ref` (settles an existing bill by name), `advance`, `on_account`. A bill-wise ledger (`tm_ledger.is_billwise_on`) must have bills that sum to the party amount (S07); a non-bill-wise ledger must not carry bills (S08). `due_days` on an invoice sets the credit period for the new bill (else the ledger credit period).
- GST: the device computes tax lines with CALC_SPECS section 10 and sends them; the connector recomputes and refuses on mismatch beyond `entries.gst_tolerance` (S05). Line `gst_rate` must equal the item master rate valid on the voucher date (S06).

## 4. Semantic checks (all must pass; `detail` is what the result carries)
S01 company match; S02 date inside the financial year; S03 voucher type vs base kind; S04 total arithmetic; S05 tax recomputation and mode; S06 item rates; S07 bills and balance; S08 bill-wise rules; S09 references exist; S10 inventory voucher shape; S11 alter actions. Full text in `entry_rules.json` `semantic_checks`. The reference validator implements them; example files named `*.invalid*.json` are expected to fail with the listed detail code (`entry_examples/index.json` `expect`).

## 5. Lifecycle and idempotency
1. Device inserts the row with status `queued`. The unique `client_request_id` makes a retry safe; a conflict means "already queued".
2. Connector claims it (`queued` to `posting`, `attempts` + 1), validates, and before posting looks in Tally for a voucher whose remote id is the `client_request_id` (stored in the `REMOTEID` attribute of the voucher when posting; Tally's help confirms the attribute and that equal REMOTEIDs overwrite each other; that it is exported back unchanged is **assumed** - verify, fallback is searching `REFERENCE`/narration marker, see `TALLY_WIRE.md` section 8). If found, it returns `DUPLICATE_CLIENT_REQUEST` semantics: `ok:true` with the existing guid, status `posted`.
3. It posts, reads the voucher back by `client_request_id`, and writes `result` and status. After at most `desktop.entry_max_attempts` attempts for retryable errors the entry becomes `failed`.
4. `needs_review` is final until a human acts: the device shows it in the Review Queue and never auto-retries. Cancelling a queued entry (status `cancelled`) is allowed only from `queued`.
5. The device learns the result by polling `entry_queue` (`polling.entry_status_poll_*`) or Realtime. After a `posted` result the next delta brings the voucher back with its `remote_id` (`tx_voucher.remote_id`), which is how a device confirms it.

## 6. Result (`entry_queue.result`)
Shape (see `entry_examples/results.example.json`):
`{ ok, guid?, voucher_number?, alter_id?, message?, tally_raw?, code?, detail?, retryable? }`.
When `ok` is false, `code` is an `LB_*` code from `SHARED_CONTRACTS.md` section 9 and `detail` is one of the detail codes in `entry_rules.json` `result.details`, each mapped to `code`, final `status` and `retryable`:
- Validation failures (`PAYLOAD_INVALID`, `TOTAL_MISMATCH`, `TAX_MISMATCH`, `UNBALANCED`, `*_NOT_FOUND`, `VOUCHER_TYPE_MISMATCH`, `DATE_OUT_OF_PERIOD`, `COMPANY_MISMATCH`, `VOUCHER_NUMBER_EXISTS`, `NEGATIVE_STOCK`, `BILL_REF_NOT_FOUND`, `MASTER_EXISTS`): `LB_TALLY_REJECTED`, status `failed`, not retryable (the user fixes the entry and creates a new one).
- `TALLY_UNREACHABLE`, `TALLY_COMPANY_NOT_LOADED`: `LB_TALLY_UNREACHABLE`, stays `queued`, retryable.
- `ALTER_CONFLICT`, `AMBIGUOUS_RESULT`: `LB_ENTRY_NEEDS_REVIEW`, status `needs_review`.
- `FLAG_DISABLED`, `DEVICE_REVOKED`, `UNSUPPORTED_VERSION`: the matching `LB_*` codes, `failed`.
- Messages from Tally are mapped to detail codes with the regular expressions in `entry_rules.json` `result.tally_message_map`. These patterns are **assumed** from public Tally behaviour and must be confirmed against real Tally error text; unmatched text maps to `UNKNOWN` (failed, with `tally_raw` kept so the pattern can be added).
- `tally_raw` is the raw Tally response, truncated to 2000 characters; it never contains secrets.

## 7. Building the Tally XML
Follow `TALLY_WIRE.md` section 8 (voucher import template, sign and `ISDEEMEDPOSITIVE` rules, bill allocation tags, GST detail tags, master imports, alter and cancel actions).
