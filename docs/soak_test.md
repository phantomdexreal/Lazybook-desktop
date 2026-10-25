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
