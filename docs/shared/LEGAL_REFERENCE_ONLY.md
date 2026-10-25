# LEGAL_REFERENCE_ONLY — read before touching anything under `docs/reference/`

The folder `docs/reference/biz-analyst-*` contains decompiled/extracted code of a third-party commercial product (BizAnalyst).
It is provided ONLY so a session can understand **behaviour**: what Tally requests are sent, which fields exist, how sync decides what changed,
what each screen shows, and which calculators exist.

Rules (non-negotiable):
1. **Clean-room.** Read the reference, write a short behaviour note in your own words (in `docs/specs/`), then implement from that note. Never copy or translate legacy code, comments, strings, layouts, images, colours or copy text.
2. LazyBooks must never contain legacy product names, branding, icons, text, or API hosts (`bizanalyst`, `Biz Analyst`, `khatabook`, `siliconveins`) outside `docs/reference/`. CI greps for them.
3. Tally's XML/TDL interface is Tally's public protocol; field and request names that Tally defines are fine to use. How LazyBooks batches, caches, encrypts and schedules is our own design.
4. Do not replicate the vendor's subscription checks or licensing mechanics; LazyBooks uses its own license system (admin-issued).
5. Do not call, impersonate or interoperate with the vendor's servers or apps.
6. Secrets in the reference were redacted; do not try to recover them.
