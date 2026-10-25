# ECOSYSTEM — LazyBooks (read this first in ANY of the four repos)

LazyBooks = Tally companion platform: desktop connector reads Tally, a Supabase "postbox" carries encrypted
messages, PWA/mobile show everything offline, an admin panel issues licenses and pushes themes, logos and versions.
Everything runs on free tiers (see ZERO_COST_PLAN.md).

## The four repos (each is a separate zip / GitHub repo)

| Repo | What it is | Stack | Primary job |
|---|---|---|---|
| `lazybooks-admin` | Admin panel + the MASTER Supabase project | Next.js static export + Supabase Edge Functions | licenses, plans/flags, Supabase account/project pool, users, themes, branding, releases via GitHub, announcements, support |
| `lazybooks-desktop` | Windows tray app ("connector") | Electron + TypeScript + SQLite | read Tally, keep the SQLite vault, answer device requests, write entries back into Tally, optional cloud-copy snapshots, auto-update; optionally hosts the PWA |
| `lazybooks-pwa` | The app UI for phones, tablets, PCs | Next.js static export + local store (Dexie on web, native SQLite on Android) | every screen of the legacy app, offline-first, installable; ALSO the UI bundled in Electron/Capacitor |
| `lazybooks-mobile` | Android shell | Capacitor around the PWA build + native SQLite storage | native scanner, push, geolocation, contacts, share, in-app APK updater |

## Data flow (memorise this)

```
Tally Prime ─XML:9000─▶ DESKTOP connector ──(SQLite vault = source of truth)
                              │  ▲
        encrypted chunks      │  │ entry_queue rows (phone → Tally)
                              ▼  │
                  LICENSE Supabase project  (POSTBOX: transient rows, ack = DELETE)
                              │  ▲
                              ▼  │
              PWA / Mobile (IndexedDB = the device's database; UI reads ONLY local data)

ADMIN ──▶ MASTER Supabase project (registry): licenses, flags, project pool, themes, branding, releases
   every app ──▶ master RPC app_bootstrap(...) on start  → license status, target project, flags, theme list,
                                                         branding, update info, announcements, config
```

* **Postbox rule:** the license project holds only transient sync traffic + small per-license data. Chunks are deleted
  by the receiving device the moment they are applied. Nothing accumulates (except optional cloud-copy snapshots).
* **Device rule:** UI components read only the device's own local store (`lib/store`: Dexie on web, native SQLite on Android). They never query Supabase for data viewing.
* **Calculation rule:** reports and calculators run **on the device** from synced raw `tm_*`/`tx_*` tables
  (decision D-06). Tally's own closing balances are used, not recomputed,
  for Balance Sheet / P&L. Desktop `drv_*` tables are OPTIONAL and perf-driven only.
* **Write rule:** phones never write to Tally directly. They insert an idempotent `entry_queue` row; the connector posts
  it to Tally and reports the result.

## Auth model (no OTP — admins issue credentials manually)

One Supabase Auth user per login, created by the admin panel (Edge Function `create-user`) in the license's target project.
Roles live in **`app_metadata`** (only service_role can set it): `{license_key, role: owner|staff|connector}`.
`user_metadata` is client-writable and must NEVER be used for authorisation (it can be edited by the user).
A clean seam exists to add OTP/magic-link/self-signup later (`lib/auth/providers.*` in each app).

## Decisions already made (do not re-litigate; change only via SHARED_CHANGELOG.md)

| ID | Decision | Why |
|---|---|---|
| D-01 | Supabase = postbox only; desktop SQLite = vault; device local store = working copy | free-tier storage, privacy |
| D-02 | Optional `cloud_copy` snapshots in Storage (flag, per license), ≤ 45 MB objects, encrypted | new installs while PC is off; admin-toggleable |
| D-03 | One Supabase project per license by default; shared shards allowed (`supabase_projects.capacity`) | isolation by default, scalable later |
| D-04 | Master project = registry; `app_bootstrap` is the single start-up call | fewer calls on free tier, one contract |
| D-05 | PWA and Admin are static exports with hash routing; no Next.js server features | free hosting anywhere, Electron `file://`, Capacitor |
| D-06 | Calculations on device; desktop `drv_*` optional | one implementation, offline-capable, Supabase cannot compute (postbox only) |
| D-07 | E2E encryption (AES-256-GCM, passphrase → PBKDF2) default ON for chunks and snapshots | cousins'/free accounts must not read data |
| D-08 | Free replacements for paid vendor services: UPI QR (client), wa.me/sms:/mailto: share intents, local notifications | zero spend |
| D-09 | Android via APK on GitHub Releases + in-app updater; iOS users use the PWA | no store fees |
| D-10 | Themes are JSON with `dark` and `light` modes; user picks theme + mode; admin pushes JSON | requirement |
| D-11 | Violet-and-black sleek identity; Phosphor icons; no emoji; no burger menus | requirement + common mobile/desktop UI practice |
| D-12 | Legacy BizAnalyst code is reference only; clean-room rewrite (LEGAL_REFERENCE_ONLY.md) | legal safety |
| D-13 | Device storage sits behind one adapter interface (`lib/store`): Dexie/IndexedDB on web and Electron, native SQLite (SQLCipher-capable) on Android via `LazyHost.sqlite`; one neutral schema; one conformance suite; per-platform default confirmed by benchmarks on 200,000 vouchers | IndexedDB inside a WebView is unproven for very large companies; SQL aggregation and encryption at rest on the phone |
| D-14 | Cross-repo values are predetermined in `docs/shared`; the four repos are independent. Data model, wire mapping, sync, entry payloads, calculations, constants, fixtures and demo seeds are all defined there, so a session in one repo needs only that repo's kit plus `docs/shared` | A phase in one repo having to wait for, or author a spec for, another repo; unverifiable values are marked `assumed` and listed in `INTEGRATION_CHECKLIST.md` |

## Where to start (cross-repo build order) — see BUILD_ORDER.md

## Glossary
* **License key** `LB-XXXX-XXXX-XXXX-XXXX` identifies one customer company set. **Master** = registry project.
  **License project** = the (dedicated or shared) Supabase project that carries that license's postbox.
* **Connector** = desktop app. **Device** = a PWA/mobile/desktop install registered in `devices`.
* **Chunk** = one transient `sync_chunks` row. **Change operation (`op`)** = how a chunk is applied: `upsert`, `delete`, `clear`, `replace_scope`, `delete_children`.
* **Name-independence rule** = never match literal voucher-type/ledger names; resolve via `ref_voucher_kind` and group hierarchy.
