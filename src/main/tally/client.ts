/*
LazyBooks | src/main/tally/client.ts
Responsibility: Tally XML client: one serialised queue, timeouts, retries, LINEERROR mapping, collection and function helpers
Introduced by: Phase 8 (tally-xml-client)
STATUS: IMPLEMENTED (Phase 8)
All Tally I/O goes through this module (CLAUDE_MUST_READ 4.3). Tally is single-threaded: exactly one request is in flight;
entry (voucher posting) jobs run before sync jobs. No Electron import: testable from Node.
Entity-specific requests (masters, vouchers, ...) are built by later phases on top of `collection`, `fn`, `exportData`, `importData`.
*/

import { DESKTOP_DEFAULTS } from '../../shared/constants';
import { LbError } from '../errors';
import { logger } from '../logger';
import {
  buildCollectionRequest,
  buildFunctionRequest,
  decodeResponse,
  iterateCollection,
  lineErrors,
  nodeToRow,
  parseImportResult,
  responseText,
  XmlError,
  type CollectionSpec,
  type ImportResult,
  type RequestScope,
  type Row,
} from './xml';
import {
  buildCompanyListRequest,
  buildProdInfoRequest,
  httpPost,
  MAX_RESPONSE_BYTES,
  parseCompanies,
  parseProdInfo,
  TallyTransportError,
  type PostFn,
  type TallyCompanyInfo,
  type TallyTarget,
} from './detect';

export type TallyPriority = 'entry' | 'sync';

/** What went wrong, for callers that need to branch (the code is the SHARED_CONTRACTS taxonomy). */
export type TallyErrorDetail =
  | 'TALLY_UNREACHABLE' // connection refused / host not found
  | 'TALLY_TIMEOUT' // no answer in time
  | 'TALLY_COMPANY_NOT_LOADED' // retryable: open the company in Tally
  | 'TALLY_REJECTED' // LINEERROR or unknown request
  | 'TALLY_MALFORMED' // answer is not parseable XML even after cleaning
  | 'TALLY_RESPONSE_TOO_LARGE';

export class TallyError extends LbError {
  readonly detail: TallyErrorDetail;
  /** true when trying the same request again later can succeed (Tally closed, busy, company not open) */
  readonly retryable: boolean;
  /** the request that failed (id only, never the body) */
  readonly requestId: string | null;
  constructor(code: 'LB_TALLY_UNREACHABLE' | 'LB_TALLY_REJECTED', detail: TallyErrorDetail, message: string, retryable: boolean, requestId: string | null) {
    super(code, message);
    this.name = 'TallyError';
    this.detail = detail;
    this.retryable = retryable;
    this.requestId = requestId;
  }
}

export interface TallyInfo {
  version: string | null;
  companies: TallyCompanyInfo[];
}

export interface TallyClientDeps {
  getTarget: () => TallyTarget;
  /** Exact company name sent as SVCURRENTCOMPANY when a request does not name one. */
  getCompanyName?: () => string | null;
  post?: PostFn;
  /** Default desktop.tally_timeout_s * 1000. */
  timeoutMs?: number;
  /** Extra attempts after the first, connection errors only. Default desktop.tally_retries. */
  retries?: number;
  /** First backoff; doubles per attempt. Default 500 ms. */
  backoffMs?: number;
  sleep?: (ms: number) => Promise<void>;
  maxResponseBytes?: number;
}

export interface CallOptions {
  priority?: TallyPriority;
  /** Per-call timeout override (large exports). */
  timeoutMs?: number;
  /** Per-call retry override. Use 0 for heavy exports: Tally keeps working on an abandoned request, so repeating it only stacks the load. */
  retries?: number;
}

export interface CollectionOptions extends CallOptions, Omit<CollectionSpec, 'name' | 'type' | 'fields'> {
  /** Tally object type, e.g. `Ledger` (required). */
  type: string;
}

export interface TallyClient {
  /** Reachability + version + loaded companies. Throws TallyError when Tally cannot be used. */
  ping(opts?: CallOptions): Promise<TallyInfo>;
  /** Send an Export request; returns the decoded XML text (LINEERROR already mapped to an error). */
  exportData(xml: string, opts?: CallOptions): Promise<string>;
  /** Send an Import Data request. Never retried after a response; Tally-level failures come back in the result, transport failures throw. */
  importData(xml: string, opts?: CallOptions): Promise<ImportResult>;
  /** Collection export parsed into rows. */
  collection(name: string, fields: string[], options: CollectionOptions): Promise<Row[]>;
  /** Same, one object at a time (large companies); the generator throws TallyError(TALLY_MALFORMED) if the text breaks midway. */
  collectionStream(name: string, fields: string[], options: CollectionOptions): Promise<Generator<Row>>;
  /** Function export (`$$Something`); returns the text of `<RESPONSE>`. */
  fn(expr: string, scope?: RequestScope, opts?: CallOptions): Promise<string>;
  /** The raw transport behind the same serialised queue (priority `sync`), for the detector (Phase 7). */
  queuedPost: PostFn;
  /** Jobs waiting plus the one running. */
  queueDepth(): number;
}

interface Job {
  priority: TallyPriority;
  run: () => Promise<void>;
}

/** Strings in Tally answers that mean the company is not selected/open (assumed wording, TW-ERRTEXT). */
const COMPANY_NOT_LOADED = /SVCurrentCompany|company.*(not|isn't|is not).*(loaded|open|found|selected)|no company/i;
const UNKNOWN_REQUEST = /unknown request/i;

export function createTallyClient(deps: TallyClientDeps): TallyClient {
  const post = deps.post ?? httpPost;
  const defaultTimeout = deps.timeoutMs ?? DESKTOP_DEFAULTS.tallyTimeoutS * 1000;
  const retries = deps.retries ?? DESKTOP_DEFAULTS.tallyRetries;
  const backoff = deps.backoffMs ?? 500;
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  const maxBytes = deps.maxResponseBytes ?? MAX_RESPONSE_BYTES;

  // ---- serialised priority queue: entries before syncs, FIFO within a class
  const entryQ: Job[] = [];
  const syncQ: Job[] = [];
  let running = false;

  async function pump(): Promise<void> {
    if (running) return;
    running = true;
    try {
      for (;;) {
        const job = entryQ.shift() ?? syncQ.shift();
        if (!job) break;
        await job.run();
      }
    } finally {
      running = false;
    }
  }

  function enqueue<T>(priority: TallyPriority, fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const job: Job = {
        priority,
        run: async () => {
          try {
            resolve(await fn());
          } catch (e) {
            reject(e);
          }
        },
      };
      (priority === 'entry' ? entryQ : syncQ).push(job);
      void pump();
    });
  }

  function requestIdOf(xml: string): string {
    return /<ID>\s*([^<\s][^<]{0,80}?)\s*<\/ID>/.exec(xml)?.[1] ?? (/<TALLYREQUEST>\s*Import Data/i.test(xml) ? 'ImportData' : 'unknown');
  }

  /** One HTTP exchange with retries. `isImport`: only retry when no connection was made at all. */
  async function exchange(xml: string, isImport: boolean, timeoutMs: number, retriesOverride?: number): Promise<{ text: string; id: string }> {
    const id = requestIdOf(xml);
    const total = 1 + Math.max(0, retriesOverride ?? retries);
    let lastErr: TallyTransportError | null = null;
    for (let attempt = 1; attempt <= total; attempt++) {
      const target = deps.getTarget();
      const t0 = Date.now();
      try {
        const buf = await post(target, xml, timeoutMs, maxBytes);
        const dec = decodeResponse(buf);
        if (dec.stripped > 0) logger.warn('tally', 'illegal xml characters stripped', { stripped: dec.stripped, request: id });
        logger.info('tally', 'request', { id, ms: Date.now() - t0, bytes: buf.length, attempt });
        return { text: dec.text, id };
      } catch (err) {
        const e = err instanceof TallyTransportError ? err : new TallyTransportError('other', String((err as Error)?.message ?? err));
        lastErr = e;
        if (e.message === 'response too large') {
          throw new TallyError('LB_TALLY_REJECTED', 'TALLY_RESPONSE_TOO_LARGE', 'TallyPrime returned more data than LazyBooks accepts for one request. Narrow the date range.', false, id);
        }
        // Imports: a request that reached Tally might have been applied, so only a refused connection is safe to repeat.
        const retryable = isImport ? e.kind === 'refused' : true;
        logger.warn('tally', 'request failed', { id, attempt, kind: e.kind, will_retry: retryable && attempt < total });
        if (!retryable || attempt >= total) break;
        await sleep(backoff * 2 ** (attempt - 1));
      }
    }
    const t = deps.getTarget();
    if (lastErr?.kind === 'timeout') {
      throw new TallyError('LB_TALLY_UNREACHABLE', 'TALLY_TIMEOUT', `TallyPrime at ${t.host}:${t.port} did not answer in time. It may be busy; LazyBooks will try again.`, true, id);
    }
    throw new TallyError('LB_TALLY_UNREACHABLE', 'TALLY_UNREACHABLE', `LazyBooks cannot reach TallyPrime at ${t.host}:${t.port}. Is Tally open with the XML server enabled?`, true, id);
  }

  /** Map LINEERROR and unknown-request answers to TallyError. */
  function assertExportOk(text: string, id: string): void {
    const errs = lineErrors(text);
    if (errs.length > 0) {
      const joined = errs.join('; ');
      if (COMPANY_NOT_LOADED.test(joined)) {
        throw new TallyError('LB_TALLY_REJECTED', 'TALLY_COMPANY_NOT_LOADED', 'The company is not open in TallyPrime. Open it and LazyBooks will continue.', true, id);
      }
      throw new TallyError('LB_TALLY_REJECTED', 'TALLY_REJECTED', `TallyPrime refused the request: ${joined}`, false, id);
    }
    const bare = responseText(text);
    if (bare !== null && UNKNOWN_REQUEST.test(bare)) {
      throw new TallyError('LB_TALLY_REJECTED', 'TALLY_REJECTED', `TallyPrime did not understand the request (${bare}).`, false, id);
    }
  }

  const scopeOf = (o: RequestScope): RequestScope => ({
    company: o.company ?? deps.getCompanyName?.() ?? null,
    fromDate: o.fromDate,
    toDate: o.toDate,
  });

  const client: TallyClient = {
    exportData(xml, opts = {}) {
      return enqueue(opts.priority ?? 'sync', async () => {
        const { text, id } = await exchange(xml, false, opts.timeoutMs ?? defaultTimeout, opts.retries);
        assertExportOk(text, id);
        return text;
      });
    },

    importData(xml, opts = {}) {
      return enqueue(opts.priority ?? 'entry', async () => {
        const { text, id } = await exchange(xml, true, opts.timeoutMs ?? defaultTimeout);
        const result = parseImportResult(text);
        if (!/<(ENVELOPE|RESPONSE|IMPORTRESULT)\b/i.test(text)) {
          logger.warn('tally', 'import answer not recognised', { id });
          return { ...result, ok: false, ambiguous: true };
        }
        logger.info('tally', 'import result', {
          id, ok: result.ok, ambiguous: result.ambiguous, created: result.created, altered: result.altered, errors: result.errors, lineErrors: result.lineErrors.length,
        });
        return result;
      });
    },

    async collection(name, fields, options) {
      const gen = await client.collectionStream(name, fields, options);
      return Array.from(gen);
    },

    async collectionStream(name, fields, options) {
      const { priority, timeoutMs, retries: callRetries, type, ...rest } = options;
      const xml = buildCollectionRequest({ ...scopeOf(rest), ...rest, company: scopeOf(rest).company, name, type, fields });
      const text = await client.exportData(xml, { priority, timeoutMs, retries: callRetries });
      const id = name;
      function* rows(): Generator<Row> {
        try {
          for (const n of iterateCollection(text)) yield nodeToRow(n);
        } catch (e) {
          if (e instanceof XmlError) {
            logger.warn('tally', 'malformed xml', { id, reason: e.message });
            throw new TallyError('LB_TALLY_REJECTED', 'TALLY_MALFORMED', `TallyPrime sent a damaged answer for ${id}. It will be retried on the next sync.`, true, id);
          }
          throw e;
        }
      }
      return rows();
    },

    async fn(expr, scope = {}, opts = {}) {
      const text = await client.exportData(buildFunctionRequest(expr, scopeOf(scope)), opts);
      return responseText(text) ?? '';
    },

    async ping(opts = {}) {
      const list = await client.exportData(buildCompanyListRequest(), opts);
      const companies = parseCompanies(list);
      let version: string | null = null;
      try {
        version = parseProdInfo(await client.exportData(buildProdInfoRequest(), opts));
      } catch (e) {
        if (e instanceof TallyError && e.detail !== 'TALLY_REJECTED') throw e; // unreachable stays an error; an unsupported function does not
      }
      return { version, companies };
    },

    queuedPost: (target, xml, timeoutMs, max) => enqueue('sync', () => post(target, xml, timeoutMs, max ?? maxBytes)),

    queueDepth: () => entryQ.length + syncQ.length + (running ? 1 : 0),
  };
  return client;
}
