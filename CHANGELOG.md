# Changelog

One section per release, newest first. The heading is the version (`## 1.2.0`); a beta may have its own (`## 1.2.0-beta.1`). The release workflow copies the matching section into the GitHub release and the admin Release manager. A release with no section gets a one line note.

## Unreleased

* New: big companies sync in batches. Vouchers are asked from TallyPrime a few hundred at a time (default 500, set in Settings, Syncing) instead of a whole month at once, so Tally stays usable and memory stays flat. If a batch times out, LazyBooks waits, halves the batch size for that run and reads the batch again.
* New: the Status window shows a progress card while a sync runs: vouchers done of the total, the month being read, batch number, speed and time left, and a clear message with the retry time if a sync fails.
* New: a sync that is interrupted (app closed, PC restarted, crash) continues from the last finished batch instead of starting again. Devices never see a half-finished sync.
* Changed: if a TallyPrime does not honour batching, LazyBooks notices, says so, and reads month by month as before.
* Known, needs a real TallyPrime to confirm: batching with a very large company (see the checklist in docs/specs/tally-real-world-notes.md), and what closes the app on a real company (TW-CRASH-01). Employees are not synced (TallyPrime has no employee object).
* New: Settings has a Syncing block (vouchers per Tally request, 50 to 5000, presets and reset) and an Updates block (current version, a switch for automatic update checks, Check now, download progress, release notes, Restart and update). With automatic checks off, an update that is required to keep using LazyBooks is still installed.
* First public build of LazyBooks Desktop: Tally sync, encrypted serving to devices, entries into Tally, status window, installer and updates.
* Fixed: the master sync no longer asks TallyPrime for an `Employee` object type (it does not exist; employees are cost centres), which made Tally show a blocking "Incorrect Object Type" dialog and stall.
* Fixed: vouchers are read one calendar month at a time with a 3 minute timeout and no repeat of a timed-out request; a month that still times out is read in halves. A whole year in one request could time out and pile up behind itself in Tally.
* Fixed: the build and its checks now run on a Windows build machine (line-ending tolerant test, bash shell for the installer step, TypeScript strictness relaxed for indexed access).
