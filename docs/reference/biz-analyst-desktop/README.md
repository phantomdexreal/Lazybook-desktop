# biz-analyst-desktop (REFERENCE ONLY — clean-room)
Extraction of the legacy Electron connector 8.4.41: `curated_tally_sync_modules/` (Tally requests, parsers, sync orchestration, cloud upload, auth) — start here;
`README_SYNC_FLOW.md` — the flow in words; `readable_split/*/app_code` — every first-party webpack module, pretty-printed (names are mangled);
`raw_from_installer/` — package.json + webpack configs + dependency manifest. Third-party libs, signing certificate and binaries are NOT included.
Learn behaviour (Tally XML requests, fields, AlterID incremental logic, timers, write-back); never copy code. Rules: `docs/shared/LEGAL_REFERENCE_ONLY.md`.
