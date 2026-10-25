# SYNC_SPEC - chunks, order, operations, cursors, snapshots

Original LazyBooks design. Verified by `fixtures/tools/check_sync.py` (reference chunker/applier in `fixtures/tools/sync_ref.py`) and the example files in `sync_examples/`. Table and column names come from `data_model.json`; numeric limits from `constants.json` `sync`, `snapshot`, `crypto`, `polling`.

## 1. Flow recap
Device writes a `sync_requests` row. Connector pulls from Tally into the vault, then writes `sync_chunks` rows into the license project. The device reads chunks in `seq` order, applies each in one transaction, and acknowledges by deleting them. Entries go the other way through `entry_queue` (`ENTRY_PAYLOADS.md`). Table definitions: `sql/02_license_project_schema.sql`.

## 2. Request kinds and scope
`sync_requests.kind` (SQL check constraint): `initial`, `delta`, `snapshot_refresh`, `ping`. Columns that carry scope: `company_guid`, `from_date`, `to_date`, `last_sync_at`, `lookback_days`. Status `pending`, `processing`, `done`, `failed`. At most one in-flight request per (device, kind).
- `initial`: all masters (full refresh each) and vouchers in [from_date, to_date]; when null the connector uses today minus `sync.history_days_default` (max `history_days_max`) .. today, clipped to the financial year.
- `delta`: masters and vouchers whose `alter_id` is above the cursor the connector holds for that device (derived from `last_sync_at` and the device cursor in `_lb_sync_state` sent as part of the request through `lookback_days`; the connector re-reads `lookback_days` (default `sync.lookback_days_default`, max `lookback_days_max`) back from `last_sync_at` to catch edits inside the window), plus deletions via the guid list (`TALLY_WIRE.md` section 5) and refreshed closing balances.
- `snapshot_refresh` (pro): connector rebuilds the snapshot objects (section 8); no chunks are produced.
- `ping`: connector answers by updating the request status to `done` (liveness check); no chunks.
- The device does not care which kind produced a chunk stream; the shape is the same.

## 3. Chunk row
`sync_chunks` columns: `id` (bigserial), `license_key`, `device_id`, `request_id`, `seq` (int, contiguous from 1 per request, no gaps), `table_name`, `op`, `enc` (bool), `is_last` (true only on the final chunk), `payload` (jsonb), `created_at`, `expires_at` (created + `chunk_ttl_hours`). The device reads its own rows ordered by `id` and applies by `seq`.

### 3.1 Size limits
A payload serialises to at most `chunk_max_payload_bytes` (200000) of compact JSON (UTF-8) and at most `chunk_max_rows` (500) rows. Split greedily in primary-key order. Child tables are chunked separately, after the parent. When `enc` is true the limit applies to the plaintext JSON before compression and encryption.

### 3.2 Default omission (additive wire shape)
An `upsert` row may omit any column whose value equals the column default in `data_model.json`, except primary-key columns. The applier fills defaults before writing. This is the wire shape used in `sync_examples/`.

### 3.3 Encryption (pro/enc mode)
`enc = true`: `payload` is the envelope `{v:1, iv, ct, z?}` from `SHARED_CONTRACTS.md` / `crypto_vectors.json`: AES-256-GCM, 12-byte IV, AAD `lb1|<license_key>`. Plaintext = the JSON of the payload, gzip-compressed when `constants.json` `sync.gzip_chunks` is true (then `z:1`). Key = PBKDF2-HMAC-SHA256(passphrase, salt, 210000 iterations, 32 bytes). Real senders use a random IV per chunk; `sync_examples/initial_sequence.enc.jsonl` uses deterministic IVs and the test license key so a receiver can be tested byte-for-byte. A wrong passphrase fails the KCV check before any chunk is applied.

## 4. Operations
| op | payload | effect |
|---|---|---|
| `upsert` | array of rows | insert or replace by primary key |
| `delete` | array of primary-key objects (all pk columns) | delete those rows |
| `clear` | `[]` or `{company_guid}` | delete all rows of the table (for the company when given) |
| `replace_scope` | `{company_guid, from, to}` (only for `tx_voucher`) | delete vouchers with date in [from, to] and all their child rows (children matched by `voucher_date`) |
| `delete_children` | array of parent keys `{company_guid, guid}` | delete child rows of those vouchers in every child table listed in `data_model.json` `tables.tx_voucher.children`; the parent row stays |
Rules: send `delete_children` for a voucher before re-sending its children (an edited voucher can lose lines). Never send `delete_children` and rely on it for masters. `clear` is used before a full master refresh. Each chunk is applied atomically; a failure stops the sequence and the device logs the failure in its sync log and re-requests an `initial` sync.

## 5. Table order (fixed)
`constants.json` `sync.table_order`: masters first (parents before children, referenced before referencing), then `tx_voucher`, then its children `tx_ledger_line, tx_inventory_line, tx_batch_alloc, tx_bill_alloc, tx_tax_line`. Initial sequence per table: `clear` (except `tm_company`), then `upsert` parts; for vouchers `replace_scope` then upserts. `ref_voucher_kind` is a seed table shipped inside the app and never synced.

## 6. Sequence shape
1. Any number of chunks in table order, `seq` 1..N.
2. The last chunk has `is_last = true` (an empty `tm_company` upsert `[]` when there is nothing else).
3. The device applies chunks in `seq` order as they arrive, records `last_applied_seq`, deletes applied chunks (ack = delete), and when `is_last` is applied marks the request complete and advances cursors.
4. A device that sees a gap waits (poll backoff `polling.chunk_poll_*`); chunks older than `expires_at` are removed by the server and the request is restarted as `initial`.

## 7. Cursors
Device stores per company in `_lb_sync_state`: `master_alter_id`, `voucher_alter_id` (max alter ids applied; equal to `tm_company.alter_id_master` and `alter_id_voucher` of the last applied company row), `last_full_sync_at`, `last_delta_at`, `window_from`, `window_to`. The connector keeps its own per-device cursor in its vault (`TALLY_WIRE.md` section 4) and uses `last_sync_at` and `lookback_days` of the request. Cursors move only after `is_last` is applied. `tm_company` is upserted at the start of every sequence so the cursors are always available.

## 8. Snapshots (pro, optional)
A snapshot is a pre-built, device-readable copy of the vault stored in Supabase Storage so a new device can bootstrap without a connector round trip.
- Object format `LBS1` (`constants.json` `contract.snapshot_format`; extends SHARED_CONTRACTS section 4.3 and is **fixed** here). The object at `{license_key}/{company_guid}/{kind}/{seq}-{part}.lbs` is: gzip( UTF-8 text lines ), then, when `snapshots.enc` is true, `iv (12 bytes) || AES-256-GCM ciphertext+tag` of those gzip bytes with AAD `lb1|<license_key>` (same key as chunks). Line 1 is the header `{"lbs":1,"company_guid":"..","kind":"full|delta","seq":N,"part":P,"parts":M,"as_of":"YYYY-MM-DD","schema_version":1,"from_alter_id":0,"to_alter_id":0}`. Every following line is `{"table":"tm_ledger","row":{...}}` (an upsert, default-omission allowed as in section 3.2), `{"table":"tx_voucher","delete":{pk...}}`, or `{"table":"tm_ledger","clear":{"company_guid":".."}}`. Lines appear in table order (section 5). A full snapshot has only upserts and clears. `sha256` in the `snapshots` row is over the stored bytes. Restore = apply the lines of the latest full, then every delta with a higher `seq`, as if they were chunks.
- Types (`snapshots.kind`): `full` and `delta` with `seq`, `storage_path`, `bytes`, `sha256`, `from_alter_id`, `to_alter_id` (a delta lists only changes since the previous snapshot; apply in order). Objects live in bucket `snapshots` under `{license_key}/{company_guid}/`.
- Retention math (`constants.json` `snapshot`): peak storage during a rebuild = 2 x full bytes + sum of delta bytes and must fit the plan `snapshot_mb` (`limits.plans`). Rebuild a full snapshot when delta bytes exceed `full_rebuild_delta_ratio` x full bytes, or deltas exceed `full_rebuild_max_deltas`, or the full is older than `full_rebuild_max_age_days`. Minimum interval between deltas `delta_min_interval_min`. Each object stays under `object_max_bytes` (below the 50 MB bucket limit); split into parts when larger. Older full snapshots are deleted after the new one is verified.
- A snapshot never replaces the postbox; the device still runs a delta after applying it. The format is **fixed** here; the size numbers are fixed defaults; performance on real data is **assumed**.

## 9. Examples (all machine-verified)
- `sync_examples/initial_sequence.jsonl`: 42 plain chunks building the fixture company, including `replace_scope` over a stale voucher.
- `sync_examples/initial_sequence.enc.jsonl`: the same, encrypted with the test key.
- `sync_examples/chunks.jsonl`: one example of each op.
- `sync_examples/delta_sequence.jsonl` + `delta_expected.json`: a delta (new receipt, deleted optional voucher, edited header, ledger rename, changed closings) applied on top of the initial state.
Applier and chunker reference: `fixtures/tools/sync_ref.py`. Conformance means: apply the sequences to an empty store and compare to `fixtures/tables`.
