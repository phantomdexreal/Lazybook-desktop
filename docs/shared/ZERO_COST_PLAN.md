# ZERO_COST_PLAN — everything must run for ₹0

| Need | Free solution | Limits to design around |
|---|---|---|
| Database/auth/storage/realtime | Supabase Free (master + one per license, across several free accounts) | 2 free projects per account; 500 MB DB; 1 GB storage; **50 MB max file**; ~5 GB egress/mo; Realtime 200 connections, 256 KB message, 100 msg/s; **pauses after 7 days idle**; no backups |
| Hosting PWA + admin | GitHub Pages or Cloudflare Pages (static) | static only — hence static export + hash routing |
| Source control + CI | GitHub (free): Actions for build/test/release/keepalive cron | private-repo minutes capped (Windows ×2); public repos unlimited |
| Binaries distribution | GitHub Releases (public releases repo) | unsigned Windows installer shows SmartScreen warning (document the "More info → Run anyway" step) |
| Android | APK from GitHub Releases + in-app updater; self-made keystore | Play Store costs $25 — out of scope; keep the keystore safe or updates break |
| iOS | PWA "Add to Home Screen" | native iOS needs Mac + $99/yr — out of scope |
| Push | Web Push (VAPID) + FCM free tier | iOS web push needs the PWA installed to home screen |
| Maps (punch in/out) | OpenStreetMap tiles within fair-use policy (or no map, coordinates only) | no heavy tile usage |
| Messaging (WhatsApp/SMS/email) | `wa.me` links, `sms:` and `mailto:` intents + local notifications | no server-sent bulk messaging (paid) |
| Payments | UPI deep link/QR generated on the client | no gateway/settlement tracking (paid, DEFERRED) |
| E-invoice/e-way | Drive Tally Prime's own flow via the connector | no direct GSP API (paid/complex, DEFERRED) |
| Fonts/icons | `@fontsource/*`, Phosphor via npm, bundled | no CDN |

Keep-alive: the desktop connector heartbeat keeps an active customer's project awake; a GitHub Actions cron (`keepalive.yml`, every 3 days) pings
every active project and runs `lb_cleanup()`. Projects idle > 7 days may pause: the admin panel shows `paused` and resume steps (dashboard → Restore).
Budget guards: usage monitor alerts at 70/90 % of DB/storage; clients obey the polling budget in SHARED_CONTRACTS §4.1.
If a free limit is hit, the order of escape is: shorten TTLs → disable `cloud_copy` for that license → move the license to another project → (only then) paid upgrade by the owner's choice.
