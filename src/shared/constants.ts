/*
LazyBooks | src/shared/constants.ts
Responsibility: CONTRACT_SUPPORTED=1, defaults
Introduced by: Phase 1 (scaffold) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 1)
*/

/** Cross-repo values copied from docs/shared/constants.json (a phase never decides these). */
export const CONTRACT_SUPPORTED = 1;

export const APP_NAME = 'LazyBooks';

export const DESKTOP_DEFAULTS = {
  tallyHost: 'localhost',
  tallyPort: 9000,
  tallyTimeoutS: 60,
  tallyRetries: 2,
  syncIntervalMin: 5,
  syncIntervalMinAllowed: 1,
  heartbeatMin: 5,
  requestListenerPollS: 5,
  entryListenerPollS: 5,
  entryMaxAttempts: 3,
  maxInflightChunksPerDevice: 40,
  logRotateMb: 5,
  logKeepFiles: 7,
} as const;

/**
 * Milestone 9 (Phase 43): voucher batching, progress and update controls. Design: docs/specs/voucher-batching.md,
 * sync-progress.md, update-controls.md. Values marked `assumed` there are tunable here and nowhere else.
 */
export const VOUCHER_BATCH = {
  /** Vouchers per request when the user changed nothing (the proven predecessor's value, assumed). */
  sizeDefault: 500,
  /** Allowed range of the user setting `voucherBatchSize` (assumed). */
  sizeMin: 50,
  sizeMax: 5000,
  /** Adaptive backoff never goes below this many vouchers per request. */
  adaptiveFloor: 25,
  /** Per-request timeout for a voucher read, in seconds (H5 value, 180 s). */
  voucherTimeoutS: 180,
  /** Wait after a timed-out request so Tally can finish the abandoned work, in seconds (H5 value). */
  splitPauseS: 15,
  /** Pause between two batches so Tally can serve its own user (assumed). */
  voucherBatchPauseMs: 250,
} as const;

/** Progress events (docs/specs/sync-progress.md). */
export const PROGRESS_DEFAULTS = {
  /** At most one `lb:sync:progress` event per this many ms, plus one on every stage change and on completion. */
  progressThrottleMs: 1000,
  /** Weights of the overall percent, summing to 100 (assumed). */
  stageWeights: { masters: 10, counting: 5, vouchers: 75, applying: 8, closing: 2 },
} as const;

/** Update controls (docs/specs/update-controls.md). */
export const UPDATE_CONTROLS = {
  /** Minimum gap between two manual update checks, in seconds (registry polling budget, SHARED_CONTRACTS 4.1). */
  manualUpdateCheckMinGapS: 30,
  autoUpdateCheckDefault: true,
} as const;

/** docs/shared/constants.json `sync` (chunk limits, ttl, fixed table order; SYNC_SPEC sections 3 and 5). */
export const SYNC_DEFAULTS = {
  chunkMaxPayloadBytes: 200000,
  chunkMaxRows: 500,
  chunkTtlHours: 24,
  gzipChunks: true,
  tableOrder: ['tm_company', 'tm_group', 'tm_ledger', 'tm_ledger_address', 'tm_ledger_contact', 'tm_ledger_gst', 'tm_ledger_opening_bill', 'tm_voucher_type', 'tm_stock_group', 'tm_stock_category', 'tm_unit', 'tm_godown', 'tm_stock_item', 'tm_stock_item_gst', 'tm_stock_batch_opening', 'tm_cost_centre', 'tm_currency', 'tm_employee', 'tm_gst_registration', 'tx_voucher', 'tx_ledger_line', 'tx_inventory_line', 'tx_batch_alloc', 'tx_bill_alloc', 'tx_tax_line'],
} as const;

/** docs/shared/constants.json `snapshot` (SYNC_SPEC section 8). */
export const SNAPSHOT_DEFAULTS = {
  objectMaxBytes: 47185920,
  bucketObjectLimitBytes: 52428800,
  fullRebuildDeltaRatio: 0.5,
  fullRebuildMaxDeltas: 14,
  fullRebuildMaxAgeDays: 7,
  deltaMinIntervalMin: 60,
  quotaHeadroomRatio: 1.0,
} as const;

/** Defaults from API_CONTRACTS.md (config file). */
export const CONFIG_DEFAULTS = {
  intervalMin: 5,
  lookbackDays: 7,
} as const;

/** Mock mode: tools/dev.mjs starts tools/mock-tally and sets these env vars. */
export const ENV_MOCK_TALLY = 'LB_MOCK_TALLY';
export const ENV_TALLY_PORT = 'LB_TALLY_PORT';

/** Master registry address: public values (RPC-only anon key). Supplied at build/run time; never a secret. */
export const ENV_MASTER_URL = 'LB_MASTER_URL';
export const ENV_MASTER_ANON_KEY = 'LB_MASTER_ANON_KEY';
/** Dev only: tools/dev.mjs starts tools/mock-registry and sets the two vars above to it. */
export const ENV_MOCK_REGISTRY = 'LB_MOCK_REGISTRY';

/** SHARED_CONTRACTS 3.1: desktop calls app_bootstrap on start and every 30 minutes. */
export const BOOTSTRAP_INTERVAL_MS = 30 * 60 * 1000;
