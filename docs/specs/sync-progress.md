# Sync progress (Milestone 9, Phase 46)

Clean-room behaviour note, own words. Status: DESIGN (2026-10-27). Amend in place when code differs.

## Goal
The user can see, while a sync runs, how much has to be pulled and how much is already pulled, as a progress bar with plain numbers. Today the Status page only shows the last and next sync time.

## Event
Main process pushes `lb:sync:progress` (M to R, added to `API_CONTRACTS.md` first). Payload `SyncProgress`:
```
{
  runId: string,
  stage: 'idle'|'starting'|'masters'|'counting'|'vouchers'|'applying'|'closing'|'checking-deleted'|'done'|'failed',
  masters?:  { done: number, total: number },            // requests finished of requests planned
  vouchers?: { done: number, total: number | null,        // total null until counting ends
               batchIndex: number, batchCount: number | null,
               windowFrom: string, windowTo: string,       // ISO dates, no names
               batchSize: number, effectiveSize: number },
  startedAt: string, updatedAt: string,
  ratePerMin: number | null, etaSeconds: number | null,
  resumed: boolean,                                        // true when continuing from a checkpoint
  message: string | null                                   // plain language, also used for failures
}
```
No company, ledger or party names, ever. Counts and dates only (same rule as the logs).

## What the page shows (Status page, new card at the top)
* A progress bar (`role="progressbar"`, `aria-valuemin/max/now`, text alternative) with the headline "Reading vouchers: 12,500 of 48,200 (26%)".
* A second line: month being read, batch "5 of 97", batch size (and "reduced to 250" when adaptive backoff applied), speed in vouchers per minute, "about 6 min left" (or "estimating..." until two batches are done).
* Masters stage: "Reading masters 7 of 13". Counting stage: "Counting vouchers..." (indeterminate bar). Applying stage: "Saving to your computer..." (indeterminate).
* After a restart that resumes: "Resuming from 12,500".
* Failure: the plain message and "Will retry in 2 minutes" (the scheduler already knows the backoff).
* Idle: the card collapses to "Up to date. Last sync 3 min ago".
* Quiet cycles must not flash a bar: show the card only when the vouchers total is larger than one batch, or when a stage lasts longer than 2 s.
* Reduced-motion users get no animation (stripes and transitions off). Light and dark themes use the existing tokens.

## Overall percent
Weighted so the bar moves steadily: masters 10, counting 5, vouchers 75, applying 8, closing and checks 2 (`assumed`, constants). The headline always uses the vouchers numbers during the vouchers stage, not the weighted percent.

## ETA
Moving average of the vouchers-per-minute rate over the last 5 batches. Hidden until 2 batches are done. Rounded to the minute above 2 minutes, to 10 s below. Never negative, never shown when done is greater than total.

## Throttle
At most one event per second, plus immediately on every stage change and on completion. The renderer never polls.

## Other surfaces (free, no new dependencies)
* Tray tooltip: "LazyBooks - syncing 26%".
* Windows taskbar progress through `BrowserWindow.setProgressBar` (indeterminate during counting and applying). Optional, only when the window exists.

## Code layout
Pure logic in `src/main/sync/progress.ts` (tracker: stages, throttle, rate, ETA) and `src/renderer/lib/progressView.ts` (text and percent from a `SyncProgress`). The scheduler and the voucher batcher call an injected `onProgress` (Phase 45 adds the hook, Phase 46 wires and shows it). Component `src/renderer/components/SyncProgress.tsx` used by `Status.tsx`.

## Phase 46 amendments (2026-10-27)
* Percent mapping (`src/shared/syncProgress.ts`): masters 0 to 10, counting 10, vouchers 15 to 90 (fraction capped at 99 percent of its share until done), checking-deleted 90, applying 94, closing 98, done 100; starting and failed have no percent.
* Added channel `lb:sync:progress:get` (`LbApi.sync.current()`): a page opened mid-run needs the newest event, and the renderer never polls.
* The masters stage reports `{done: 0, total: 1}` (the masters pull has no per-request hook), so the card says "Reading masters..." without "7 of 13". `batchCount` is `ceil(total / size)`; `batchIndex` is the number of batches finished. The resume line is carried in `message` ("Resuming from 12,500") for the whole resumed run.
* Failure line: the plain message plus "Will retry in N min" from the scheduler's `nextRunAt` (already in the status event). Idle: "Up to date. Last sync 3 min ago".
* Tray tooltip `syncing N%` and the taskbar bar are shown only for runs whose total exceeds one batch (the taskbar bar is indeterminate in the other busy stages).

## Verification
Pure tests for the tracker and the view text (all stages, null totals, `done > total`, ETA rules, throttle). An event-sequence test driving the scheduler against a generated 5k-voucher mock company. Rendering is a manual check on a real machine (1024x700 and 1366x768, light and dark).
