# Soak test (Phase 41) — 24 hours on a real Windows PC

Run once per release candidate, on a PC with real Tally and a company of at least 100k vouchers (or the mock Tally with a large fixture set). Nothing here can run in the build sandbox.

## Setup
1. Install the release candidate, activate, and let the first sync finish.
2. Settings: sync interval 5 minutes. Leave the status window closed (tray only).
3. Note the start time, the vault size (`%APPDATA%\LazyBooks\vault\vault.sqlite`) and the process memory (Task Manager, "LazyBooks").

## During the 24 hours
* Post one entry from a device every hour; each must reach Tally exactly once.
* Put the PC to sleep for 30 minutes, then wake it. Expect one sync about 10 seconds after wake.
* Close Tally for 20 minutes, then reopen it. Expect "Tally is closed" in Status and recovery without a restart.
* Change the Windows clock forward 10 minutes, then back. Expect a `wall clock moved` log line and no wrong voucher dates.
* Fill the drive to under 400 MB free. Expect a `disk level changed` warning (low) and no snapshot or backup; under 100 MB free expect syncing to pause (`low disk space`) and to resume after space is freed within an hour.
* Kill the app three times within ten minutes (Task Manager, End task). Expect the third start in safe mode (`crash loop detected` in the log, no sync) and a normal start ten minutes later.

## Pass rules
* Memory (working set) at hour 24 is no more than 600 MB above hour 1, and never above 1.2 GB.
* The hourly `health check` line appears 24 times; none says `restarting the app because of memory`.
* No `uncaughtException`, no `vault could not be opened`, `integrity check failed` never appears.
* Every posted entry exists once in Tally. The vault equals a fresh full resync (Tools, Full resync, compare voucher counts).
* Antivirus: Windows Defender reports nothing during install, run or update (SmartScreen on the unsigned installer is expected, see README).

Record the result in `PHASE_STATUS.md` under Known issues until it has been done.

---

# Real Tally, large company (Phase 48) — batch size ladder

Purpose: find out, on a real TallyPrime with a big company, which "vouchers per batch" value keeps Tally usable, and collect evidence if anything freezes or the app closes. You do not need to have read the specs. Takes about 2 to 3 hours. Everything here needs the real Tally; the build sandbox could not run it.

## Before you start
1. Use a company with at least 100,000 vouchers if you have one (the more, the better). Work on a copy of the data folder, not your live books.
2. Install the release candidate, activate it, and keep Settings, Syncing at the default (500) for now.
3. Open Tally, load only that company, and leave it on the Gateway of Tally screen. Do not type in Tally during a run unless a step says so.
4. Open the LazyBooks status window (progress card) and, in a second window, Task Manager (Details tab, find "LazyBooks" and "TallyPrime").
5. Note the log file: `%APPDATA%\LazyBooks\logs\lazybooks.log` (the Logs page in the app shows the same lines).

## The ladder
Do the rungs in this order. For each rung: Settings, Syncing, set the number, Save; then Tools, Full resync; then watch until Status says the sync finished or failed. Write down the numbers in the table at the end.

| Rung | Vouchers per batch |
|---|---|
| 1 | 500 (default) |
| 2 | 250 |
| 3 | 1000 |
| 4 | 100 |
| 5 | 2000 (only if rung 3 was fine) |

Stop climbing (do not try a bigger number) as soon as a rung fails. Rung 4 is the safe fallback to test if rung 1 fails.

## What to watch, per rung
* In LazyBooks (Status card): the total and done counts rise steadily; "batch x of y" advances; the speed and time-left lines appear after the second batch. A sentence saying Tally does not support batching means paging was ignored (see below).
* In Tally: can you still open a report and move between screens while the sync runs? A pause of a second or two between batches is fine. Note any freeze of more than 10 seconds, "Not responding" in the title bar, or any dialog box (copy its exact words; a dialog stops Tally until you click it).
* In Task Manager: the peak "Memory (active private working set)" of LazyBooks and of TallyPrime.
* In the Logs page, search for these words and note whether they appear: `paging ignored`, `timed out` (look for "voucher page timed out, reading it again with a smaller size"), `sync checkpoint discarded`, `SYNC_INCOMPLETE`, `illegal xml characters stripped` (normal, harmless), `sync resumes from checkpoint`.

## Tests to run once, at the best rung
1. Resume: during a full resync, end the LazyBooks task in Task Manager after about half the batches. Start LazyBooks again. Expect the log line `sync resumes from checkpoint` and the done count to continue from where it stopped, not from zero.
2. Incremental: after the full resync finishes, change or add three vouchers in Tally, wait for the next sync (or use Sync now). Expect a short sync and the new voucher count in Status. This also answers `TW-ALTERID-01`.
3. Totals: the final done count equals the voucher count Tally itself shows for the year (Display, Day Book, count of entries, or the Statistics screen).

## Reading the result
* All rungs fine: keep 500 and send the table.
* Rung 1 freezes Tally or times out, a smaller rung is fine: tell the developer the highest good number; the default will be lowered to it.
* Even 100 fails: send the evidence below; do not change anything else.
* The log says `paging ignored`: the paging filter is not honoured by this Tally (`TW-PAGING-01`). The sync still works month by month; send the first 30 log lines after `paging ignored`.

## What to send back
For every rung: number tried, total time, peak memory of LazyBooks and TallyPrime, whether Tally stayed usable (yes, slow, froze), and any dialog text. Plus, once:
* The last 30 lines of `lazybooks.log` from the run (use Tools, Export diagnostics; it removes secrets).
* Company size: ledgers, vouchers in the year, TallyPrime version and whether it is Silver or Gold.

## If the app closes by itself (`TW-CRASH-01`)
Do not restart it yet. Collect, in this order:
1. Did Tally freeze or show a dialog just before? Copy the dialog text.
2. The last 30 lines of `lazybooks.log` (the last line tells where it stopped).
3. Windows Event Viewer, Windows Logs, Application: the newest "Error" or "Application Error" entry with source "LazyBooks" (or "Application Hang" for Tally): copy the General tab text.
4. The memory of LazyBooks and TallyPrime in Task Manager at that moment (if still visible), or from the last `health check` log line.
5. The batch size, the voucher count of the company and the rung number.
Then start LazyBooks again: it must resume (`sync resumes from checkpoint` in the log). If it starts over from zero, say so.

## Result table (copy, fill in, send)
| Rung | Batch | Total time | LazyBooks peak MB | Tally peak MB | Tally usable? | Notes |
|---|---|---|---|---|---|---|
