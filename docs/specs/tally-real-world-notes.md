# Real-world Tally notes (first real run, 2026-10-25 to 2026-10-27)

Evidence levels: OBSERVED (seen in a real run), INFERRED (follows from what was seen), ASSUMED (no proof yet). Written in our own words; no legacy code was copied. This file is the place to add every new fact learned on a real Tally.

## Observed
* O1. TallyPrime has no object type named `Employee`. The request `LBEmployees` (type Employee) made Tally show a blocking dialog "Internal Error. Contact Tally Solutions. Incorrect Object Type!". The request never completed until the dialog was dismissed, so it never reached the app log. Employees are cost-centre objects in Tally. Fixed by H4: that request is no longer sent, `tm_employee` stays empty.
* O2. A real company (6,886 ledgers, 74 groups): all other master requests succeeded. Masters took 3.3 s in total. The stock items export was about 2.1 MB in about 0.4 s. Tally's answers contain illegal XML characters (the log shows "illegal xml characters stripped" with counts such as 12,392 for stock items); stripping them works and is normal.
* O3. A voucher request for a whole financial year timed out at 60 s and was repeated twice. Tally then stopped responding and the app closed. Cause of the app closing is NOT confirmed (memory and an unhandled error are suspects). Hotfix H5 changed the request to month windows with a 3 minute timeout and no repeat. A big company still stalled afterwards, which is why Milestone 9 exists.
* O4. Windows build facts: the build machine checks files out with Windows line endings (a test had to accept `\r\n`); PowerShell splits an argument like `-c.publish.provider=generic` at the dot (the installer step now runs in bash); the strict TypeScript option `noUncheckedIndexedAccess` produced 56 errors in earlier phases and was relaxed (H1).

## Inferred
* I1. Tally handles one request at a time and keeps working on a request after the client gave up. Repeating a timed-out heavy request therefore stacks load. The client now supports a per-call `retries` override (H5).
* I2. The older, working connector read vouchers in pages of 500 with a 3 minute timeout, wrapped each fetch separately so one failure did not stop the rest, and never requested Employee. It also sent UTF-16 requests, read a light "manifest" (id, alter id, date per voucher) to find changed vouchers, and asked for GST registrations with a filter named `TaxUnitForGST`. Only paging is adopted here. UTF-16 and the manifest are NOT adopted (the owner keeps the current extraction); the UTF-16 difference is not proven to matter.

## Assumed (to verify, `TW-*` items)
* TW-PAGING-01: the running-counter paging filter works inside our current collection request and counts only vouchers that passed the date window and the `$AlterID` filter. As built in Phase 44 the request carries `<COMPUTEVAR>LBPageNo : Number : ##LBPageNo + 1</COMPUTEVAR>` and a filter `LBPageKeep` with `##LBPageNo > S AND ##LBPageNo <= S+size`; the TDL spelling is assumed. Check: page 1 and page 2 of a month return different vouchers, sizes add up to the guid-list count, and no page exceeds its size.
* TW-PAGING-02: the voucher GUID list (`LBVoucherGuids`) over a whole year answers fast enough on a big company, or per month.
* TW-PAGING-03: page order stays stable between two pages of one run.
* TW-FREEZE-01: Tally stays usable (no freeze, no crash) at the default batch size on a company with 100k or more vouchers; find the size at which it stops being true.
* TW-ALTERID-01: `$AlterID > N` as a collection filter really narrows the result. The older app's author wrote that Tally ignores or empties such a filter. If true, incremental pulls fall back to the date lookback window (the older app's approach) and the guards still decide completeness.
* TW-TAXUNIT-01: asking for all tax units (no filter) works on every company; the older app filtered to GST ones.
* TW-EMP-01: employees can be read as cost centres filtered to payroll ones. Needs a company with payroll data. Not built; owner decides whether employees matter.
* TW-CRASH-01: what closes the app. Collect: the last 30 log lines (`%APPDATA%\LazyBooks\logs\lazybooks.log`, usually), whether Tally froze first, Windows Event Viewer entry, and the process memory at that moment.

## Checklist for the owner (finalised in Phase 48)
Every `TW-*` item is still unverified: none could be run without a real Tally. Procedure for all of them: `docs/soak_test.md`, section "Real Tally, large company". "Pass" is what to see; "If it fails" is what the code already does and what the developer changes.

| Id | Needs | Pass | If it fails | Falls back to |
|---|---|---|---|---|
| TW-PAGING-01 | big company, ladder rung 1 | Two pages of one month return different vouchers; no page larger than the batch size; page sizes add up to the month total | Log says `paging ignored`; only `pagingParts()` in `paging.ts` (and the mock's matching regex) changes | Month-by-month reads (H5), sync still completes |
| TW-PAGING-02 | big company | The count before the first batch returns within seconds; the total on the Status card is close to Tally's own count | Total shows as unknown (no percent); the sync is unaffected | Progress without a total |
| TW-PAGING-03 | big company | Done count equals Tally's voucher count at the end; no `SYNC_INCOMPLETE` | The completeness guard clears the stage and retries; if it repeats, the order is unstable and paging needs a stable sort key | Month-by-month reads |
| TW-FREEZE-01 | company of 100k vouchers or more | Tally stays usable (no freeze over 10 s, no dialog) at 500 | Lower the default to the highest good rung (a one-line constant, `VOUCHER_BATCH.sizeDefault`) | Adaptive halving after a timeout already protects a run |
| TW-ALTERID-01 | after a full sync, edit 3 vouchers | The next sync reads only a few vouchers and Status shows the new count | Incremental pulls read the lookback window instead; slower but correct | Date lookback window plus the completeness guard |
| TW-TAXUNIT-01 | a company with and without GST | The tax units table fills on both | Empty table on one of them; note which | Table stays empty, nothing else depends on it |
| TW-EMP-01 | a company with payroll data | Not built. Decide first whether employees matter (open question in `PHASE_STATUS.md`) | n/a | `tm_employee` stays empty (H4) |
| TW-CRASH-01 | any run that closes the app | Evidence collected as listed in `docs/soak_test.md` | Developer reads the evidence; no code change is planned until it exists | Resume from the checkpoint on the next start |

Order to run them: TW-PAGING-01 and TW-PAGING-03 and TW-FREEZE-01 together (one ladder), then TW-ALTERID-01, then TW-PAGING-02, then TW-TAXUNIT-01. TW-EMP-01 only if the owner wants employees.
