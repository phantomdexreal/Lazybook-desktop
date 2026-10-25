# FEATURE_FLAGS — LazyBooks

Effective flags = `plans.features || licenses.features_override` (JSON merge, override wins). Delivered in `app_bootstrap().features`.
Limits come from `licenses.max_*` and `plans.limits`. Unknown flags must be treated as `false`. Missing flags default per the table.

| Flag | Default basic | Default pro | Gates | Enforced by |
|---|---|---|---|---|
| `reports` | true | true | all read-only reports, day book, ledgers | UI |
| `outstanding` | true | true | outstanding, ageing, bills, collections | UI |
| `inventory` | true | true | stock, godown/batch, item screens, barcode | UI |
| `orders` | false | true | orders, pending orders, quotations (read) | UI |
| `entries` | false | true | ALL write-back (invoice, receipt/payment, journal, inventory vouchers, masters, orders) | UI + connector refuses `entry_queue` rows when false |
| `einvoice_eway` | false | true | e-invoice / e-way screens + connector actions | UI + connector |
| `reminders` | false | true | reminders, auto-reminders, follow-ups, greetings | UI |
| `auto_share` | false | true | invoice auto-share prompts | UI |
| `punch_in_out` | false | true | punch in/out, meetings, field reports | UI |
| `team_users` | false | true | team users, permissions, salespersons | UI + RLS (`team_users`) |
| `multi_company` | false | true | company switcher beyond one | UI + connector |
| `cloud_copy` | false | true | encrypted snapshots in Storage, restore with PC off | connector refuses uploads when false; storage policy denies |
| `e2e_encryption` | true | true | encrypted chunks/snapshots (false = debug only) | connector + devices |
| `upi_qr` | false | true | UPI QR + bank accounts | UI |
| `export_pdf` | true | true | PDF export/share | UI |
| `export_xlsx` | false | true | CSV/XLSX export | UI |
| `web_push` | false | true | push notifications | UI + push function |
| `themes_user_switch` | true | true | user may change theme/mode (mode switch is always allowed) | UI (also `theme_policy.allow_user_switch`) |
| `embedded_pwa_desktop` | false | true | PWA window inside the desktop app | desktop |
| `beta_channel` | false | false | receive beta releases | bootstrap (future) |

Limits (plans.limits / license columns): `max_devices` (default 3 basic / 10 pro), `max_companies` (1 / 3), `snapshot_mb` (0 / 200), `lookback_days_max` (31), `history_days_max` (1095).

UI rule: gated modules show a neutral "Not enabled for your license" card — no upsell, no payment prompts. The admin panel is the only place flags change.
Adding a flag: add it here, add the default to the `plans` seed (new migration), implement UI gate + any enforcement, mention in `SHARED_CHANGELOG.md`.
