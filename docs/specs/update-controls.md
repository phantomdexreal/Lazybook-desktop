# Update controls in the app (Milestone 9, Phase 47)

Clean-room behaviour note, own words. Status: DESIGN (2026-10-27). Builds on Phase 39 (`src/main/updater.ts`, which already checks every 30 minutes, downloads, verifies sha256 and offers "Restart and update") and Phase 35 (settings). Amend in place when code differs.

## Goal
The user decides whether LazyBooks looks for updates by itself, and can check by hand at any time, from the Settings page.

## Settings key
`autoUpdateCheck`: boolean, default true. Old config files without it load as true (`.default`, like `language`). Changed through the existing `lb:settings:set` (strict schema, all-or-nothing).

## Behaviour
* On: as today, first check 60 s after start, then every 30 minutes.
* Off: no timer and nothing downloaded on its own. The Status banner and the Settings block show "Automatic checks are off".
* Forced updates (`must_update`, or running below `min_supported` from the bootstrap) are still acted on when the switch is off. Reason: the blocking screen (Phase 5) would otherwise leave the user with no way forward. Flagged as an owner decision (`assumed`).
* "Check for updates now" works in both modes. It refreshes the bootstrap first (reusing the existing bootstrap refresh path, no new endpoint), then evaluates the offer exactly like the timer. Minimum gap between manual checks: 30 s (constant), so the registry polling budget (`SHARED_CONTRACTS` section 4.1) is respected. Inside the gap the button shows the last result and stays disabled.
* Staged rollout stays the server's decision. When none is offered the message is "No update available for this device yet", never "you are up to date" when a newer version merely is not rolled out to the user yet. The honest line is "You have the latest version available to you (1.0.5)".
* Dev runs (not packaged) show "Updates are not available in a development run".

## What the Settings "Updates" block shows
Current version, the on/off switch, the button, a status line (checking, up to date and when last checked, update found and downloading with a percent, ready with a "Restart and update" button, failed with the plain reason), and the release notes text of the offered version (plain text only, never rendered as HTML).

## IPC and types
No new channel for the switch (it is a setting). `lb:update:check` (exists, Phase 39) gains the gap rule and returns the new `UpdateView`. `UpdateView` additions: `currentVersion`, `autoCheck: boolean`, `lastCheckedAt: string | null`, `progress: { percent: number } | null`. electron-updater's `download-progress` event feeds `progress`. Contract text goes into `API_CONTRACTS.md` first.

## Verification
Node tests with the existing fake electron-updater driver: switch off means no timer; manual check works when off; forced update still downloads when off; gap enforced; progress passes through; settings patch round trips and is validated. Rendering and a real update are manual checks (publish a higher version to the releases repo, Phase 39 verify line).

## Phase 47 amendments (implementation notes, 2026-10-27)
* Off mode has no timer at all. Forced updates are noticed through `offerChanged()`, which `index.ts` calls after every activation emit (each bootstrap, every 30 minutes and on state changes); it runs the normal evaluation but returns at once unless the offer is forced. It does not set `lastCheckedAt`.
* The 30 s gap is measured from the last finished check of any kind (timer or manual), not only manual ones, so the registry budget holds and the page can compute the disabled state from `lastCheckedAt` alone (no extra field in `UpdateView`). The page re-reads `lb:update:state` every 5 s (every 1 s while downloading); there is no push channel for updates.
* A failed bootstrap refresh during a manual check is logged (`update check: bootstrap refresh failed, using the last known offer`) and the cached offer is evaluated.
* Dev runs: the message is `Updates are not available in a development run.` and the button is disabled.
* Release notes are shown only while an update is offered, as text inside a `pre` (control characters removed, 2000 characters). Tags stay inert text.
* Unverified: the page has never rendered; `download-progress` has never fired from a real electron-updater; `bootstrapNow` against a real master.
