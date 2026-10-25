# SECURITY — LazyBooks

## Secrets: where they may live
| Secret | Allowed location | Never |
|---|---|---|
| Master anon key, license-project anon keys | client code / config (public by design) | — |
| Supabase **service_role** keys, PATs, GitHub PAT, CI/cron secrets | Supabase Vault / Edge Function secrets only | repo, `.env*` committed, client bundle, logs, chat |
| License passphrase / data key | device non-extractable CryptoKey; desktop `safeStorage` | Supabase, logs, QR (unless in-person timed mode) |
| Customer passwords | shown once at creation in the admin panel, never stored | DB (Supabase Auth stores hashes) |
Grep gates (CI): no `service_role`, no `sbp_`, no `ghp_`/`github_pat_` in any bundle or repo.

## Authorisation
* RLS everywhere. License project policies use `auth.jwt()->'app_metadata'->>'license_key'` and `->>'role'`. **Never `user_metadata`.**
* Master: anon can only call the four RPCs; tables are admin-only through `is_admin(min_role)`.
* Roles: admin panel `owner > admin > support > viewer`; license logins `owner | staff | connector`; `connector` is the only role that can insert `sync_chunks`/`snapshots`.
* License keys have 80 bits of entropy; RPCs return generic errors; Supabase's own rate limits apply. Add Cloudflare Turnstile (free) later if abused.

## Data protection
* Chunks and snapshots are AES-256-GCM encrypted (SHARED_CONTRACTS §7); the postbox (free/cousin accounts) cannot read accounting data.
* Postbox data is transient (24 h TTL); ack = delete. Vault (SQLite) never leaves the PC unencrypted except via encrypted chunks/snapshots.
* IndexedDB is not encrypted at rest by the browser; the app lock (PIN/WebAuthn) protects UI access; offer "wipe after N failed attempts".
* Electron: `contextIsolation:true`, `nodeIntegration:false`, sandboxed renderers, strict CSP, no remote content, `safeStorage` for secrets, signed update metadata verified by sha256.
* Web: strict CSP (no inline scripts except the single hashed theme bootstrap), SRI not needed (no CDNs), `connect-src` limited to master + target Supabase hosts + GitHub API (admin only).

## Operational
* Every admin action writes `audit_log`. Admin accounts: strong passwords + Supabase TOTP MFA (free).
* Backups: weekly export of master tables (Backup phase). The vault has a rolling local backup. License projects hold nothing irreplaceable.
* Incident levers: suspend license, revoke device, maintenance mode, force minimum version, rotate project keys (runbooks in admin Help).
