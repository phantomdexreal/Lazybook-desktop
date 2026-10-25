# CALC_SPECS - every calculation, defined once

Original LazyBooks definitions. The golden numbers for these rules are in `fixtures/expected.json`, produced by `fixtures/tools/compute_expected.py` from `fixtures/tables/*.json` only. A calculator is correct when it reproduces `expected.json` from the same tables (see `INTEGRATION_CHECKLIST.md`, item CALC-01).

Status words: **fixed** = a LazyBooks decision, binding. **assumed** = a decision that rests on an unconfirmed Tally behaviour; verify on a real Tally and record the result in `PHASE_STATUS.md`.

## 1. Money, rounding, signs (fixed)
1. Amounts are decimal strings on the wire and integers (value x 10^4) in storage. Never use binary floating point for money. See `data_model.json` `conventions.amounts` and `constants.json` `money`.
2. Rounding is half away from zero. Round only at the points stated below; never round intermediate sums.
3. Ledger line and bill amounts keep the Tally sign: debit negative, credit positive. Quantities are stored positive; direction comes from the voucher kind (`ref_voucher_kind.stock_direction`) and `tx_batch_alloc.is_destination` for stock journals.
4. "Owed" amounts for reports are oriented per party: receivable = -(ledger closing), payable = +(ledger closing). Positive owed means the party owes us (debtor) or we owe them (creditor).
5. Closing balances in `tm_ledger.closing_balance`, `tm_group.closing_balance`, and stock closing in `tm_stock_item` are Tally's own numbers (fixed: devices never recompute them for display). The calculators below recompute only what Tally does not export (bill status, ageing, pending orders, batch closing, GST summary). The golden script asserts that recomputation from lines equals the exported closing (internal consistency check).

## 2. Name independence (fixed)
Never match literal ledger, group or voucher-type names. Use:
- `tm_group.reserved_name`, `reserved_root`, `nature`, `is_revenue` for group semantics. `tm_ledger.reserved_root` is the reserved root group of the ledger (for example `Sundry Debtors`).
- `tm_voucher_type.base_kind` and `tx_voucher.kind` (a slug in `ref_voucher_kind`).
- The fixture company renames Sundry Creditors to "Suppliers" and adds a "Key Customers" sub-group of debtors to prove this.

## 3. Voucher kinds and what they affect (fixed)
`ref_voucher_kind` (seed rows in `data_model.json`) gives for every kind: `affects_accounts`, `affects_stock`, `stock_direction` (in, out, both, set, none), `is_order`, `is_note`, `party_side`, `entry_kind`.
- A voucher counts only when `tx_voucher.counts_in_books` is true (not cancelled, not optional, not void). Child rows carry the same flag.
- Account effects apply when `affects_accounts`; stock effects when `affects_stock`. Orders and notes without `affects_accounts` never touch ledgers.
- `tx_voucher.amount` is the headline amount, always >= 0: for invoice kinds the absolute party line; for receipt and payment the absolute party lines; for others the sum of debit lines.

## 4. Bill-wise outstanding (fixed, tied to Tally data)
For a party ledger under a debtor or creditor root (`tm_ledger.reserved_root`):
1. Start from `tm_ledger_opening_bill` rows (bill name, amount, bill date, credit period).
2. Apply every `tx_bill_alloc` of that ledger where `counts_in_books`, in order (voucher_date, voucher_guid, alloc_index):
   - `New Ref` creates or adds to bill `bill_name` dated by the voucher date, credit period from the allocation or else the ledger.
   - `Agst Ref` and `Advance` add to the named bill (signed amounts keep their sign).
   - `On Account` adds to the on-account amount, not to a bill.
3. Invariant: sum of bill remainders + on-account = ledger closing balance. The golden script asserts this; if it does not hold on real data, the party has unallocated entries and the shortfall shows as "unallocated" (assumed handling; verify).
4. A bill with remainder 0 is closed. Owed = side x remainder (side -1 for debtors, +1 for creditors). Owed < 0 is an advance and is excluded from ageing buckets (label `advance`).
5. Due date = bill date + credit period days (0 when none).

## 5. Ageing (fixed)
Buckets from `constants.json` `ageing`: 0-30, 31-60, 61-90, 91+ days.
- **Age** = as-of date minus the bill date (not the due date).
- **Overdue days** = max(0, as-of minus due date). A bill is overdue when overdue days > 0.
- As-of date defaults to today in the user's timezone; the golden file uses 2026-09-30.
- Only owed > 0 bills enter buckets.

## 6. Invoice payment status (fixed)
For each sales or purchase voucher whose party line created a `New Ref` bill: outstanding = remaining owed of that bill (0 when closed or advance), paid = voucher amount minus outstanding. Status `paid` when outstanding = 0, `unpaid` when paid <= 0, else `partly`. Due date = voucher date + `tx_voucher.due_days` (else ledger credit period). `display_status` is `overdue` when outstanding > 0 and as-of > due date, else the status.

## 7. Customer last sale (fixed)
For each debtor ledger: the counting sales voucher (`kind = sales`) with the greatest (date, alter_id) whose `party_guid` is that ledger. Credit notes do not count. No sale gives null.

## 8. Stock and batch closing (fixed)
Quantity per (item, godown, batch) = opening quantity from `tm_stock_batch_opening` plus signed `tx_batch_alloc.billed_qty` of counting vouchers whose kind has `affects_stock`: sign + for `in`, - for `out`, and for `both` (stock journal) + when `is_destination` else -. Kinds with direction `none` or `set` do not move quantity here. The sum over locations per item equals `tm_stock_item.closing_qty` (asserted). Closing value comes from Tally (`closing_value`); devices never value stock themselves (fixed).

## 9. Pending orders (fixed for the matching rule; behaviour on real Tally assumed)
An order line is (order voucher, item). Ordered quantity = sum of `billed_qty` in the order's batch allocations. Delivered quantity = sum of `billed_qty` of counting fulfilment vouchers (sales order -> kinds `sales` and `delivery_note`; purchase order -> `purchase` and `receipt_note`) whose batch allocation has `order_no` = the order number, the same item, and the same party. Pending = max(0, ordered - delivered); only pending > 0 is listed; value = round2(pending x rate). Overdue when the order due date is before as-of. Cancelled and optional orders are skipped. Quotations are excluded: a voucher whose `voucher_type_guid` equals `app_settings.quotation_voucher_type_guid` is a quotation, not an order. Whether Tally fills `order_no` identically on real data is **assumed**.

## 10. GST per voucher (fixed for LazyBooks entries; Tally parity assumed)
Used when building entries (`ENTRY_PAYLOADS.md`) and for the GST summary.
1. Taxable value per line = round2(qty x rate x (1 - discount_pct/100)). Charges (freight etc.) are taxed at their own rate.
2. Mode: intra-state when place of supply equals the company state, else inter-state. Intra: CGST = SGST = rate/2; inter: IGST = rate. Cess by item cess rate.
3. Per line and head: tax = round4(taxable x head_rate / 100). Heads are summed across lines; each head total is rounded once, to currency decimals (2), per voucher.
4. Total = sum of line amounts + charges + head totals + round_off, where round_off brings the total to the nearest whole currency unit (half away from zero) when the company rounds off; |round_off| < 1.
5. Tolerance when validating someone else's numbers: 0.01 (`constants.json` `entries`).
6. `tx_tax_line` rows are derived by the connector from `RATEDETAILS.LIST` of each inventory line plus duty ledger lines (see `TALLY_WIRE.md` section 7); the GST summary groups them by direction (sales/credit note outward, purchase/debit note inward, credit and debit notes negate), head and rate and sums taxable and tax.

## 11. Trial balance, P&L, balance sheet (fixed derivation from Tally closings)
- **Trial balance:** every ledger shows closing as debit (negative closing, shown positive) or credit. Opening stock value joins the debit side. Total debits = total credits (asserted).
- **P&L:** sales = sum of closing of groups with reserved name `Sales Accounts`; purchases = minus closing of `Purchase Accounts`; gross profit = sales - purchases + closing stock - opening stock; net profit = gross profit - indirect expenses (plus indirect income if the model carries it). Primary groups flagged `is_revenue` are the P&L side.
- **Balance sheet:** liabilities = primary non-revenue groups with nature `liability` (shown as closing) plus net profit; assets = primary non-revenue groups with nature `asset` (shown as minus closing) plus closing stock. Totals equal (asserted).
Because they are derived from Tally closings, they equal Tally's own reports whenever Tally's closing numbers are consistent. Stock valuation method differences are Tally's, not ours.

## 12. Dates and periods
Voucher windows use `tx_voucher.date` inclusive. Financial year = `tm_company.starting_from` .. `ending_at`. As-of for aged reports never exceeds today. Display formats are a UI concern (`DESIGN_SYSTEM.md`).

## 13. What is assumed (verify on a real Tally)
- Bill allocations always tie to the ledger closing (section 4 item 3).
- `order_no` and `order_due_date` on batch allocations are filled as in section 9.
- Stock `both` direction for stock journals: destination flagged by `ISDEEMEDPOSITIVE` (see `TALLY_WIRE.md`).
- Rate and amount parity of GST rounding versus Tally (section 10) on invoices with discounts and cess.
Record every confirmation or correction in `PHASE_STATUS.md` (Decision log) and, if a rule changes, a `SHARED_CHANGELOG.md` entry.
