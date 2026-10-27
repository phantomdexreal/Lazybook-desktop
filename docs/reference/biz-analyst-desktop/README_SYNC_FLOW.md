# BA Mobile Connector 8.4.41 – extracted code + how the sync works
Source: BA_Mobile_Connector_Setup_8_4_41.exe -> app-64.7z -> app.asar. Static reading only; nothing was executed or sent to any server.
Code is minified webpack output (beautified). Names are mangled; strings, URLs, log messages and logic are intact. `r(<id>)` = another module in the same bundle.

## Folder map
- electron_main_process/app_code/   main.js modules (scheduler, settings, subscription/license API, Tally license reads)
- background_worker/app_code/       hidden worker: Tally pull, local SQLite, upload to cloud
- angular_ui/app_code/              visible UI (login, company setup)
- */vendor_libs/                    third-party libraries (aws-sdk, lodash, etc.) – not needed to understand the sync
(All modules named module_<webpackId>.js)

## Timing (module_143 / module_160 / module_574 / module_650)
- Main sync loop: every **5 min** (`SYNC_INTERVAL_MINS=5`; user-overridable via stored "syncSettings"). First run fires after 1 s, then `intervalMins*60*1000`. Only starts once a logged-in user with a token exists.
- Deleted-voucher sync: every **24 h** in the main profile (module_1616 variant: 2 h), look-back 300 days, check every 60 min; can be disabled.
- Tally query retry: 2 attempts.
- Ledger closing-balance fetch: every 24 h (`LEDGER_CLOSING_BALANCE_FETCH_FREQUENCY`).
- A separate 60 s timer drains queued WebSocket "data entry" events (mobile-entered vouchers) and checks auto-reminder jobs, skipping if a sync is already running.
- Health check: 1 h timer that restarts the app (restart date stored locally).
- Guards: internet-down, Tally-not-reachable and date/time-skew intervals/alerts (module_541). Uploads refused if local and server clocks differ (RequestTimeTooSkewed).

## Pull (Tally -> local SQLite)  – background_worker/app_code/module_582.js (syncNow)
1. Check internet/time/Tally; read Tally company list and version.
2. syncMasters: groups, ledgers, stock items/categories/groups, units, godowns, cost centres, voucher types, GST/TDS data, via TDL collections ordered by alter-id (incremental: only records changed since last stored alter id).
3. handleMasterUpdates / handleVoucherUpdates: apply master renames to existing vouchers.
4. syncVouchers (or syncVouchersFirstTime / syncWithTallyByDay for first sync): fetch vouchers from last alter id, parse XML, write to local DB.
5. Ledger closing, outstanding bills, stock-item closing recomputed.
Request XML builders: curated_tally_sync_modules/01_tally_requests (module_1049.. 1094). Transport: HTTP POST to localhost:9000.

## Push (local -> cloud -> mobile)  – module_48 (upload), module_542 (zip+AES+S3)
1. Build changed-data JSON in chunks ("Getting chunks"); sizes capped (~5–6 MB encrypted).
2. zip -> AES-128-CBC (constant key, zero IV) -> either `POST /data/gets3presignedurl` then `PUT` to the S3 URL, or `POST /data/add` with base64 body + MD5 digest, desktopVersion, dataType, lastFileUploadedAtDesktop, isFirstSync.
3. Then `POST /data` records the upload; local rows are marked "up to date" and sync metadata (tallyUpdatedAt / alter id) is advanced. First sync additionally calls `GET /miscellaneous/sync/first`.
4. Mobile apps read from the cloud; mobile-created entries return via WebSocket (`wss://api-websocket.bizanalyst.in/websocket`) -> queued -> main scheduler writes them into Tally with `Import Data` XML.

## Licensing / subscription (module_49, module_59 in electron_main_process)
- Desktop reads the Tally license via TDL functions `$$LicenseInfo` (Serial Number, Account ID, IsGold, IsSilver, IsIndian, IsEducational) and `$$ProdInfo`.
- Sends it to the backend: `POST /subscription/tallylicense` (get/create subscription), `/company/subscription/tallylicense`, `/subscription/license/type`, `/subscription/label`, `/subscription/transfer`.
- Enforcement is **server-side**: the upload endpoints return "Company subscription has expired", and the client only shows the expiry state (`setSubscriptionExpiry`). The client does not decide entitlement, so nothing in these files can be changed locally to alter it, and I'm not going to help work around it.

## Not covered / uncertain
- Mobile APK code is not in this installer.
- Server behaviour (what /data does with the upload, entitlement rules) is inferred from client calls.
- Exact dataType values and TDL field lists are in module_1094/1089 etc.; some request bodies are built dynamically.
