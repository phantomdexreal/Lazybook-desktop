# CONSTANTS - every cross-repo default lives in `constants.json`

Rule: a number, name or regex that two repos must agree on is defined once, in `constants.json`, and cited by dotted name (for example `polling.chunk_poll_initial_ms`). A repo may copy the values into its own constants file, but a phase never decides one. Changing a value is a `SHARED_CHANGELOG.md` entry.

| Section | Holds | Used by |
|---|---|---|
| `contract` | contract_version, schema_version, payload and envelope versions, snapshot format id, bootstrap cache age | all |
| `license_key` | key shape; strict generator regex and the loose client regex (clients validate loosely so `LB-DEMO-...` works) | admin, pwa, desktop, mobile |
| `polling` | chunk poll backoff, idle poll, request pickup and stale times, entry status poll | pwa, mobile, desktop |
| `desktop` | Tally host/port/timeout, sync intervals, heartbeat, listeners, log rotation, entry attempts | desktop |
| `device` | bootstrap refresh, delta interval default and range, history days, id formats | pwa, mobile |
| `sync` | chunk size and row limits, TTLs, retention days, lookback and history defaults, table order, gzip | desktop, pwa, mobile, admin (cleanup) |
| `snapshot` | object size limits and rebuild thresholds | desktop, pwa, admin |
| `crypto` | KDF, iterations, key/iv/tag sizes, AAD prefix, KCV label | all |
| `money` | scale 4, rounding mode, wire regex | all |
| `ageing` | bucket bounds and labels, age and overdue basis | pwa (calculators), desktop (if it computes) |
| `limits` | plan limits (devices, companies, snapshot MB), payload and text limits | admin, pwa, desktop |
| `flags` | per-plan feature flag defaults and the default for a missing flag | admin (seed), pwa, desktop |
| `themes`, `branding` | default theme, built-in slugs, chart colour count, asset keys | admin, pwa |
| `releases` | channels, apps, semver regex, default rollout | admin, desktop, pwa, mobile |
| `entries` | kinds, statuses, tolerances | pwa, desktop |
| `ui` | breakpoints, debounce, toast, page size | pwa |
| `demo` | demo licence key, company, passphrase, example emails (placeholders only) | all (mock mode, demo seed) |

Verification: `flags.plan_defaults` equals the table in `FEATURE_FLAGS.md` (checked when 1.0.3 was cut). The master seed `demo/master_seed.sql` writes these defaults into `plans`.
