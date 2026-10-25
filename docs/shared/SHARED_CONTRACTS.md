# SHARED_CONTRACTS — LazyBooks v1 (contract_version = 1)

Frozen. Identical in all four repos. Edit in place only via the procedure at the bottom.

## 0. Where everything cross-repo is defined (shared-docs 1.0.3)
`constants.json` (all defaults) | `data_model.json` + `DATA_MODEL.md` + `DATA_MODEL_COLUMNS.md` (tables) | `SYNC_SPEC.md` (chunks, ops, cursors, snapshots) | `ENTRY_PAYLOADS.md` + `entry_rules.json` (entry payloads, results) | `CALC_SPECS.md` (calculations) | `TALLY_WIRE.md` (Tally requests and mapping) | `fixtures/`, `sync_examples/`, `entry_examples/` (shared test material) | `INTEGRATION_CHECKLIST.md` | `demo/` (seeds, standalone run). Where a section below and one of these files differ, the file named here wins and the difference is a bug to log in `SHARED_CHANGELOG.md`.

## 1. Identifiers and keys
* `license_key`: `LB-` + 4 groups of 4 chars from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (80 bits). Generated server-side only. Clients validate with the loose regex in `constants.json` `license_key` so the reserved demo/test keys work.
* `device_id`: random UUIDv4 generated once per install, stored locally; never derived from hardware.
* `client_request_id`: UUIDv4 per user action that writes to Tally. Idempotency key.
* `company_guid`: Tally company GUID from `tm_company.guid`.

## 2. Activation sequence (identical for PWA, Mobile, Desktop UI)
1. User enters `license_key` (+ device name).
2. App calls MASTER `resolve_license(license_key)` with the master anon key (hard-coded constant, safe: RPC only).
   → `{ok, company_name, is_active, expires_at, project_url, project_anon_key}` or `{ok:false,error}`.
3. App stores target URL/anon key locally and shows the login form.
4. User signs in with the email/password the admin issued (Supabase Auth of the TARGET project).
5. App upserts `devices` row; calls `app_bootstrap(...)`; applies flags/theme/branding; starts sync.

## 3. Master RPCs (anon-callable, SECURITY DEFINER; SQL in `sql/01_master_schema.sql`)
### 3.1 `app_bootstrap(p_license_key, p_app, p_app_version, p_device_id, p_platform)`
`p_app ∈ pwa|mobile|desktop|admin`. Call on start, on foreground after ≥30 min, and every 30 min on desktop. Cache the result.
```json
{
  "ok": true, "server_time": "2026-10-19T08:00:00Z",
  "license": {"company_name":"Demo Co","expires_at":"2027-10-19T00:00:00Z","max_devices":5,"max_companies":1},
  "target":  {"url":"https://xxxx.supabase.co","anon_key":"eyJ..."},
  "features": {"reports":true,"entries":true,"cloud_copy":false,"e2e_encryption":true},
  "theme_policy": {"allowed":"all","default":"obsidian-violet","allow_user_switch":true},
  "themes": [{"slug":"obsidian-violet","version":1,"name":"Obsidian Violet"}],
  "branding": {"version":3,"assets":{"logo_light":"global/logo-light.svg","logo_dark":"global/logo-dark.svg","icon":"global/icon.png"},"app_name":"LazyBooks"},
  "update": {"latest":"1.2.0","notes":"...","download_url":"https://github.com/...","sha256":"...","min_supported":"1.0.0","update_available":true,"must_update":false},
  "announcements": [{"id":"...","title":"...","body":"...","severity":"info"}],
  "config": {"contract_version":"1","maintenance":{"on":false,"message":""}}
}
```
Failure: `{"ok":false,"error":"License expired","expired":true}`. `update` may be `null`.
Branding asset paths are in the public Storage bucket `branding` of the MASTER project:
`{master_url}/storage/v1/object/public/branding/{path}`.
**Client rules:** if `config.maintenance.on` → blocking screen. If `config.contract_version` > the app's supported contract → blocking "update required".
If `update.must_update` → blocking update screen. Offline → use the last cached bootstrap; never block on a failed refresh.

### 3.2 `resolve_license(p_license_key)` — see §2.
### 3.3 `get_themes(p_license_key)` → `[{slug, version, json}]` (only themes allowed by the license's `theme_policy`).
### 3.4 `submit_request(p_license_key, p_kind, p_payload)` → `{ok}`; kinds: `new_staff_user|password_reset|issue|feature_request|other`; max 20 KB, 10/hour/license.

## 4. License project (postbox) — tables in `sql/02_license_project_schema.sql`
Authorisation is by `app_metadata.license_key` and `app_metadata.role` (`owner|staff|connector`). Devices of one license are
not a security boundary against each other; the boundary is the license.

### 4.1 Sync request/response
1. Device inserts `sync_requests {license_key, device_id, kind: initial|delta|snapshot_refresh|ping, company_guid, from_date, to_date, last_sync_at, lookback_days}`.
   A unique partial index allows one in-flight (`pending|processing`) request per `(device_id, kind)`; on conflict, wait for the existing one.
2. Connector (role `connector`) sets `status='processing'`, computes data, inserts `sync_chunks` tagged with the device's `device_id`
   (`seq` increasing, last chunk `is_last=true`), then sets `status='done'` (or `'failed'` + `error`).
3. Device reads its chunks (`device_id = me`, ordered by `id`), applies each into the local store in one transaction, then **DELETEs the chunk row = ACK**.
4. Chunks expire after 24 h (`lb_cleanup`). A device that finds expired/missing chunks re-requests (`initial` if anything is inconsistent).
* Chunk payload ≤ 200000 bytes JSON and ≤ 500 rows (`constants.json` `sync`); upsert rows may omit default-valued columns (additive, `SYNC_SPEC.md` 3.2). Full rules: `SYNC_SPEC.md`. If `enc=true` the payload is an envelope (§7).
* Order guarantee: masters before vouchers; within a table, `seq` ascending; `delete`/`clear`/`replace_scope`/`delete_children` chunks are applied in `seq` order relative to data chunks.
* Change operations (`op`), with `table_name` always a real table (`tm_*`, `tx_*`, `ref_*`):
  `upsert` (payload = rows[]), `delete` (payload = [key,...] rows to remove), `clear` (payload = `[]` or `{company_guid}` — remove all rows of the table, or of that company, used before a full refill),
  `replace_scope` (payload = `{company_guid,from,to}` — remove all rows of `tx_voucher` and their children inside the date window; following chunks upsert the replacements),
  `delete_children` (payload = [parent_key,...] — remove child rows such as ledger/inventory lines and allocations before re-inserting a voucher).
* Delta semantics: connector computes `from = last_sync_at - lookback_days`, `to = today`, runs a real incremental Tally pull first,
  then sends only changed rows + the needed delete/clear operations for that device.
* Polling budget: after inserting a request poll chunks every 2 s (backing off to 10 s); idle devices use Realtime on `sync_requests`/`entry_queue`
  as a nudge when available, else poll every 30 s while visible, 5 min hidden. Never poll faster.

### 4.2 Entry queue (device → connector → Tally)
`entry_queue {client_request_id (unique), kind, payload, status, result, attempts}`.
Statuses: `queued → posting → posted | failed | needs_review | cancelled`.
* Device inserts with a fresh `client_request_id` once per user action (double-tap safe via unique constraint; on conflict treat as already queued).
* Connector claims (`queued→posting`), looks up Tally for an existing voucher carrying this `client_request_id` as remote id/reference BEFORE posting (crash-safe idempotency),
  posts, then writes `result` `{ok, guid?, voucher_number?, alter_id?, message?, tally_raw?}` and status.
* `needs_review` = Tally answered ambiguously; device shows it in the Review Queue; never auto-retry.
* `payload` shapes per kind are defined in `ENTRY_PAYLOADS.md` and `entry_rules.json` (examples in `entry_examples/`); the repos' `API_CONTRACTS.md` only point there.
  Changing a payload shape REQUIRES bumping `payload.v`, a `SHARED_CHANGELOG.md` entry, and regenerating the examples.

### 4.3 Snapshots (feature flag `cloud_copy`)
Storage bucket `snapshots` (private). Object path: `{license_key}/{company_guid}/{kind}/{seq}-{part}.lbs`.
`snapshots` row per logical snapshot piece set `{kind full|delta, seq, storage_path (prefix), bytes, sha256, enc, from_alter_id, to_alter_id}`.
Object format: `gzip(JSON lines of {table,row})` → AES-GCM envelope → bytes (exact layout, header line and delta lines: `SYNC_SPEC.md` section 8). Each object < 45 MB. Device restore: latest `full`, then every `delta` with higher `seq`, verifying `sha256`.
Connector prunes to: newest full + deltas since, within plan `snapshot_mb`.

### 4.4 Heartbeats
Connector and devices upsert `devices.last_seen_at/last_sync_at/app_version` every 5 min while active. Master `license_health` is updated by `app_bootstrap`.
A device treats the desktop as "online" if any `devices` row with `app='desktop'` has `last_seen_at` < 10 min ago.

## 5. Feature flags — see FEATURE_FLAGS.md. Effective flags = `plans.features || licenses.features_override`.
Flags are advisory in the UI AND enforced where data access is involved (e.g. `cloud_copy` uploads are refused by the connector when off).

## 6. Themes, branding — see THEME_SCHEMA.md and §3.1 `branding`.

## 7. Encryption envelope (v1) — test vectors in `crypto_vectors.json`
* Key: `PBKDF2-HMAC-SHA256(passphrase, salt, 210000 iterations, 32 bytes)`. `salt` (16 random bytes) is created by the desktop at passphrase setup
  and stored in `app_settings` key `crypto_salt_b64` (public, not secret) together with `crypto_kcv` (key check value).
* KCV: `base64( HMAC-SHA256(key, "LB-KCV-v1")[0:8] )`. Devices verify the typed passphrase against it before storing anything.
* Encrypt: AES-256-GCM, random 96-bit IV, AAD = `"lb1|" + license_key`. Envelope `{"v":1,"iv":b64,"ct":b64(ciphertext||tag)}`; add `"z":1` if gzip-compressed before encryption.
* Where used: `sync_chunks.payload` (when `enc=true`), snapshot objects. Flag `e2e_encryption=false` permits plaintext chunks for debugging only.
* Key storage: devices keep a non-extractable `CryptoKey` in the local key store (IndexedDB on web; Android Keystore-backed storage on Android); desktop keeps the passphrase/key via Electron `safeStorage`. Never send the key or passphrase to Supabase.
* Pairing QR payload: `lazybooks://pair?l=<license_key>&s=<salt_b64url>&c=<kcv_b64url>` — contains NO secret; user still types the passphrase.
  (Optional in-person mode `&k=<key_b64url>&exp=<unix>` is allowed only when the desktop shows a 2-minute countdown.)

## 8. Edge Functions (MASTER project; Deno; all require `Authorization: Bearer <admin JWT>` unless noted; every call writes `audit_log`)
| Function | Min role | Request → Response |
|---|---|---|
| `health` | viewer | `{}` → `{ok, role, email}` |
| `create-license` | admin | `{customer_id?, company_name, plan_id, expires_at?, max_devices?, max_companies?, features_override?}` → `{license_key}` |
| `register-project` | admin | `{name, url, anon_key, service_key, account_id?, capacity?}` → `{project_id}` (service_key stored in Vault, never returned) |
| `provision-project` | admin | `{account_id, name, region?}` → `{project_id, status}` (Management API; falls back with `{manual:true, steps:[...]}`) |
| `push-schema` | admin | `{project_ids?:[...], all?:true, file:'02_license_project_schema'\|'migrations/NNN_x', dry_run?}` → `[{project_id, ok, error?, schema_version}]` |
| `create-user` | admin | `{license_key, email, role:'owner'\|'connector'\|'staff', password?, display_name?}` → `{user_id, email, password?}` (password returned once if generated) |
| `reset-password` / `disable-user` | admin | `{license_key, user_id[, password]}` → `{ok}` |
| `project-stats` | viewer | `{project_id}` → `{db_mb, storage_mb, devices:[...], pending_chunks, queued_entries}` |
| `github-proxy` | admin | `{action:'list_releases'\|'create_release'\|'dispatch_workflow'\|'list_runs'\|'list_tags', repo, ...}` (allow-listed) |
| `ci-publish-release` | CI secret (`x-ci-secret`) | `{app, version, channel, notes, download_url, sha256, repo, tag, release_id}` → `{release_id}` (creates `draft`) |
| `keepalive` | cron secret (`x-cron-secret`) | `{}` → `[{project_id, ok, paused?}]` |
Service-role keys, PATs and CI/cron secrets live only in Vault / Edge Function secrets. Never in any client bundle, repo or `.env.local`.

## 9. Error taxonomy (use these exact codes in logs/UI mapping)
`LB_LICENSE_NOT_FOUND`, `LB_LICENSE_INACTIVE`, `LB_LICENSE_EXPIRED`, `LB_NO_PROJECT`, `LB_MAINTENANCE`, `LB_CONTRACT_TOO_OLD`, `LB_UPDATE_REQUIRED`,
`LB_AUTH_FAILED`, `LB_DEVICE_REVOKED`, `LB_FLAG_DISABLED`, `LB_DEVICE_LIMIT`, `LB_COMPANY_LIMIT`, `LB_CRYPTO_BAD_PASSPHRASE`, `LB_CRYPTO_DECRYPT_FAILED`,
`LB_CONNECTOR_OFFLINE`, `LB_TALLY_UNREACHABLE`, `LB_TALLY_REJECTED`, `LB_SYNC_EXPIRED_CHUNKS`, `LB_ENTRY_DUPLICATE`, `LB_ENTRY_NEEDS_REVIEW`.

## 10. Versioning and compatibility
* `contract_version` integer in master `app_config`. Additive changes (new optional JSON keys, new tables) do NOT bump it. Breaking changes do, and every app refuses to run against a higher contract than it supports (`LB_CONTRACT_TOO_OLD`).
* App versions are SemVer `x.y.z` (numeric only). `min_supported` enforced via bootstrap.
* Each app records `CONTRACT_SUPPORTED = 1` in a single constant file.

## 11. How to change a shared doc or SQL file
1. Edit it in the repo you are in (`str_replace`, never rewrite).
2. Add an entry to `SHARED_CHANGELOG.md` (date, what, why, which repos must mirror).
3. Bump `SHARED_VERSION`.
4. In `PHASE_STATUS.md` record "shared doc changed — mirror to: <repos>". The human mirrors it (copy the `docs/shared` folder) before the next session in another repo.
5. If tables/RPCs changed, add a numbered migration to `supabase/sql/migrations/` (never edit applied history) and bump `license_meta.schema_version` / run `push-schema`.
