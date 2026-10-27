# Voucher batching (Milestone 9, Phases 43 to 46)

Clean-room behaviour note, written in our own words. Status: DESIGN (written 2026-10-27, before any code). Phases 43 to 45 must check this against the code and amend it in place (never rewrite) when reality differs. Real-world evidence behind it is in `docs/specs/tally-real-world-notes.md`.

## 1. Problem (observed on a real company)
A company with 6,886 ledgers pulled its masters in 3.3 s, but the vouchers request for a whole financial year timed out (60 s, then two repeats). Tally stopped answering and the app then closed. Hotfix H5 (see `PHASE_STATUS.md`) already cut the window into calendar months, raised the timeout to 180 s and stopped repeating a timed-out request. That only bounds the work by date. One busy month can still be huge, and the user cannot tune it. This milestone bounds the work by record count, and lets the user set that count.

## 2. Owner decisions (2026-10-27, do not reopen)
1. The current extraction stays. Request shape, `<FETCH>` lists, XML parsing, mappers and column maps are NOT rewritten and NOT replaced with the older app's report-based extraction. Batching is added around and on top of it.
2. The number of vouchers per batch is a user setting (Settings page), like in the older app.
3. Progress is visible: how many vouchers must be pulled in total and how many are done so far (`docs/specs/sync-progress.md`).
4. Automatic update checks get an on/off switch in the app (`docs/specs/update-controls.md`).

## 3. How paging works
Behaviour of the proven older connector, restated: the voucher collection carries one numeric variable that is incremented for every voucher the collection looks at, and one filter that keeps a voucher only when that running number lies in `(start, start + size]`. Page 1 is `(0, size]`, page 2 is `(size, 2*size]`, and so on. A page that returns fewer than `size` vouchers is the last one. Each request therefore returns at most `size` vouchers, whatever the company holds.

Rules for our version:
* The paging variable and filter are added to the existing collection request through `src/main/tally/xml.ts` (small in-place extension: optional compute variables, compute lines and ordered filters). With paging off, every request must stay byte-identical to today (golden test).
* The counter must count only vouchers that already passed the date window and, for incremental pulls, the `$AlterID > cursor` filter. Filter order matters. This is `TW-PAGING-01`: verify on a real Tally. Until verified, the fallback in section 7 protects the sync.
* All pages of one run use the same company, window and filters, so the numbering is stable. A voucher created or deleted in Tally between two pages can shift the numbering. Rows are merged by GUID (already the rule), and the existing completeness guard (`checkCount` against `LBVoucherGuids`, Phase 14 and 18) catches a miss, aborts the cycle with `SYNC_INCOMPLETE` and the scheduler retries.
* Month windows (H5) stay as the outer loop. Tally walks the collection once per page, and a one-month window makes that walk cheaper. Inside a month: pages of `size`.

Phase 44 amendment (2026-10-27): the recipe is implemented in `paging.ts` as variable `LBPageNo` (`Number : ##LBPageNo + 1`) and filter `LBPageKeep` (`##LBPageNo > S AND ##LBPageNo <= S+size`), emitted through the new `computeVars` of `buildCollectionRequest`, filter listed after `LBChanged`. The exact TDL spelling is ASSUMED (`TW-PAGING-01`); if a real Tally rejects or ignores it, only `pagingParts()` needs to change (the mock parses the filter formula, so update its regex with it). The loop ends on a page whose RAW row count is below the size (an exact multiple costs one extra empty request). The date window check still runs on the rows, but never decides whether a page was the last.

## 4. Counting (for progress and for planning)
The total must be known before pulling so the progress bar can show it.
* Preferred: reuse the voucher GUID list the Phase 14 guard already requests for the window (`LBVoucherGuids`, `src/main/tally/reconcile.ts`). It is light (GUIDs only) and its length is the total. If that list for a whole year is itself too heavy, ask it per month (same request, month window) and add the numbers.
* If a single-number count request works better on a real Tally, add it as `countWindow()` next to `readPage()`. `TW-PAGING-02`.
* A total can be wrong by the time the run ends (vouchers added meanwhile). The bar must tolerate `done > total` (show 99 percent until the run really finishes).

## 5. The batch size setting
* Config key `voucherBatchSize`: integer, default 500 (the older app's proven value, `assumed`), allowed range 50 to 5000 (`assumed`, tunable constants in `src/shared/constants.ts`). Anything outside the range is refused by settings validation, nothing is saved (same rule as the other settings).
* Plain-language help in the UI: "Lower this if Tally freezes or times out. Higher is faster for small companies."
* A change applies from the next sync run. A run already in progress keeps the size stored in its checkpoint (section 6) so resume stays consistent.
* Effective size can be lower than the setting for one run (adaptive backoff, section 8). The UI shows the setting; the log and the progress card show the effective size when it differs.

## 6. Atomicity, memory and resume (Phase 45 decides and records)
Invariant (must hold, test it): devices never observe a half-applied pull. After a crash at any point the next start either resumes from a checkpoint or does a full resync. A partial vault is never believed to be complete. This is the existing Phase 18 rule ("one cycle = one transaction = one seq", memory nulled before a clear) and it must not weaken.

Memory goal: peak memory proportional to one batch, not to the company. The HTTP body for one request is still buffered whole (known since Phase 8), so a batch is also what bounds that buffer.

Recommended design (Option A): parse each batch, map it to rows, write the rows into a staging area on disk (SQLite, outside the live tables), release the raw XML, persist a checkpoint after every batch. After the last batch and the guards, one final transaction feeds the staged rows through the existing upsert layer (same code as today, one seq). A crash before that leaves the live vault untouched and a checkpoint to resume from.
Option B (simple, memory grows with the company): accumulate mapped rows in memory and commit once, as today. Acceptable only below a cap that Phase 48 measures; record the cap.
The Phase 45 session picks A or B, writes the decision under its entry in `PHASE_STATUS.md`, and proves the invariant with a kill-and-resume test.

Phase 45 amendment (2026-10-27): Option A is built. Staging is one SQLite table `_lb_stage` in the vault file (one row per voucher, all its tables as JSON, replaced by guid), written per batch; the checkpoint additionally holds `windows` (the window list is fixed at the start, so midnight cannot change it), `companyKey` (a one-way hash of the company guid, never the guid) and `alterVoucher` (the company's voucher alter id at the start). `monthIndex` is the index into `windows` (months, then lookback months) and equals `windows.length` when every window was read, so a crash during the guards or the commit resumes straight to them without reading again. The final transaction streams the stage through `planVouchers` in chunks of 500 vouchers into one `applyOps` call (one seq). After the commit the checkpoint is deleted first, then the stage. A failed completeness guard (`SYNC_INCOMPLETE`) clears both, so the retry reads afresh instead of reproducing the same short read. The total for progress is one `countWindow` before the first batch (null when counting fails; kept in the checkpoint on resume).

Checkpoint file `sync-run.json` in userData (no company names and no GUIDs; counts and dates only): `{ runId, startedAt, plan: 'full'|'incremental', windowFrom, windowTo, monthIndex, nextStart, size, total, doneCount, cursorBefore }`. Deleted at commit. A checkpoint older than 24 h, or one whose company or AlterID no longer matches Tally, is discarded (guards from Phase 14 decide) and the run starts over.

## 7. Fallback when Tally ignores the paging filter
Detect it, do not trust it. If a page returns more vouchers than `size`, or two different pages return the same first GUID, treat paging as ignored: log a warning `paging ignored`, stop paging for this run, and continue in plain month-window mode (the H5 behaviour). The status shows a plain sentence ("This Tally does not support batching; reading month by month."). A test with a mock that ignores paging proves it.

## 8. Timeouts and adaptive size
* Per-request timeout 180 s (`VOUCHER_TIMEOUT_MS`), no repeat of a timed-out request in place (client `retries: 0`), as in H5.
* On a timeout: wait 15 s (Tally keeps working on the abandoned request), halve the batch size for the rest of this run (floor 25), and read the same page again with the smaller size. Two timeouts in a row at the floor abort the cycle; the scheduler's backoff takes over (30 s doubling to 15 min).
* A non-timeout failure (refused, unreachable, malformed answer) is not split and not repeated in place.
* Pause between batches: `voucherBatchPauseMs`, constant, default 250 ms (`assumed`), so Tally can serve its own user between our requests.

## 9. What does not change
Masters pull (apart from H4), closing balances, deleted-voucher check, mappers, tables, shared contracts, the device sync protocol. No new shared doc is authored here.

## 10. Verification plan
Mock Tally honours the paging filter (Phase 44) and has a mode that ignores it. Generated large companies (`tools/gen-big-company.mjs`, Phase 45, 50k and 200k vouchers). Real Tally items are `TW-PAGING-01`, `TW-PAGING-02`, `TW-PAGING-03` (page order stable between pages), `TW-FREEZE-01` (Tally stays usable at the default size), listed in `tally-real-world-notes.md`.

Phase 48 amendment (2026-10-27): measured on generated companies of 50k and 200k vouchers at batch sizes 100, 500 and 1000 (table in the Phase 48 entry of `PHASE_STATUS.md`): the live heap held by the connector stays at about zero above its baseline after every batch for every size, so memory does not depend on the company or on the batch size. Option B and its cap are therefore moot (Option A is built); the default 500 and the range 50 to 5000 are kept. Whether Tally itself stays usable at a size is only answerable on a real Tally (`TW-FREEZE-01`); the procedure is in `docs/soak_test.md`.
