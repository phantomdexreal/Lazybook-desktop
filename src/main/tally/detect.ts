/*
LazyBooks | src/main/tally/detect.ts
Responsibility: Tally detection + config (reachability, version, loaded companies, user-facing guidance)
Introduced by: Phase 7 (tally-detect)
STATUS: IMPLEMENTED (Phase 7)
No Electron import: testable from Node. Phase 8 (client.ts) owns the general request layer; detection keeps its own
tiny transport (`post`) because it must classify connection failures itself. Phase 8 may inject its serialised
transport through `deps.post` without changing this module's contract.
*/

import { request } from 'node:http';
import { DESKTOP_DEFAULTS } from '../../shared/constants';
import { logger } from '../logger';
import { decodeResponse } from './xml';

export { decodeResponse };

/** Request ids of the two probes. Both are `assumed` until TW-PING / TW-PRODINFO run against a real TallyPrime. */
export const REQ_COMPANY_NAMES = 'LBCompanyNames';
export const REQ_PROD_INFO = '$$ProdInfo';

export type TallyState =
  | 'ok' // reachable, at least one company loaded, one selected
  | 'choose_company' // reachable, several companies loaded, none selected (or the saved one is not loaded)
  | 'no_company' // reachable, nothing loaded (TALLY_COMPANY_NOT_LOADED)
  | 'unreachable' // LB_TALLY_UNREACHABLE: nothing answers on host:port
  | 'rejected' // LB_TALLY_REJECTED: Tally answered with LINEERROR
  | 'not_tally'; // something answers but it is not Tally XML

export interface TallyCompanyInfo {
  name: string;
  guid: string | null;
  startingFrom: string | null; // ISO date
  endingAt: string | null; // ISO date
}

export interface TallyDetection {
  state: TallyState;
  ok: boolean;
  /** LB_TALLY_UNREACHABLE | LB_TALLY_REJECTED | TALLY_COMPANY_NOT_LOADED | null */
  code: string | null;
  host: string;
  port: number;
  version: string | null;
  companies: TallyCompanyInfo[];
  /** The company the connector will use; null until one is selected or the single loaded one is auto-picked. */
  selected: TallyCompanyInfo | null;
  /** Plain-language message for the person at the PC, with the fix. */
  message: string;
  checkedAt: string;
}

export interface TallyTarget {
  host: string;
  port: number;
}

export type PostFn = (target: TallyTarget, xml: string, timeoutMs: number, maxBytes?: number) => Promise<Buffer>;

/** Largest response accepted from Tally (a very large company export can be tens of MB). */
export const MAX_RESPONSE_BYTES = 512 * 1024 * 1024;

/** Thrown by the transport; carries what kind of failure it was. */
export class TallyTransportError extends Error {
  /** refused: no connection was made (safe to retry anything). reset/timeout/other: a request may have reached Tally. */
  readonly kind: 'refused' | 'reset' | 'timeout' | 'other';
  constructor(kind: 'refused' | 'reset' | 'timeout' | 'other', message: string) {
    super(message);
    this.name = 'TallyTransportError';
    this.kind = kind;
  }
}

/** One HTTP POST of an XML body (TALLY_WIRE section 1). Always UTF-8, text/xml. */
export const httpPost: PostFn = (target, xml, timeoutMs, maxBytes = MAX_RESPONSE_BYTES) =>
  new Promise((resolve, reject) => {
    const body = Buffer.from(xml, 'utf8');
    const req = request(
      {
        host: target.host,
        port: target.port,
        method: 'POST',
        path: '/',
        headers: { 'content-type': 'text/xml; charset=utf-8', 'content-length': body.length },
        timeout: timeoutMs,
      },
      (res) => {
        const chunks: Buffer[] = [];
        let size = 0;
        res.on('data', (c: Buffer) => {
          size += c.length;
          if (size > maxBytes) {
            req.destroy();
            reject(new TallyTransportError('other', 'response too large'));
            return;
          }
          chunks.push(c);
        });
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', (e) => reject(new TallyTransportError('other', e.message)));
      },
    );
    req.on('timeout', () => {
      req.destroy();
      reject(new TallyTransportError('timeout', 'Tally did not answer in time'));
    });
    req.on('error', (e: NodeJS.ErrnoException) => {
      const refused = e.code === 'ECONNREFUSED' || e.code === 'ENOTFOUND' || e.code === 'EHOSTUNREACH';
      const reset = e.code === 'ECONNRESET' || e.code === 'EPIPE';
      reject(new TallyTransportError(refused ? 'refused' : reset ? 'reset' : 'other', e.code ?? e.message));
    });
    req.end(body);
  });

// ---------------------------------------------------------------- request builders

function envelope(type: 'Collection' | 'Function', id: string, inner: string): string {
  return (
    `<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>${type}</TYPE><ID>${id}</ID></HEADER>` +
    `<BODY><DESC><STATICVARIABLES><SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT></STATICVARIABLES>${inner}</DESC></BODY></ENVELOPE>`
  );
}

/** Company name list: the Company collection holds only the companies currently loaded in Tally. */
export function buildCompanyListRequest(): string {
  return envelope(
    'Collection',
    REQ_COMPANY_NAMES,
    `<TDL><TDLMESSAGE><COLLECTION NAME="${REQ_COMPANY_NAMES}" ISMODIFY="No"><TYPE>Company</TYPE>` +
      '<NATIVEMETHOD>Name</NATIVEMETHOD><NATIVEMETHOD>GUID</NATIVEMETHOD><NATIVEMETHOD>StartingFrom</NATIVEMETHOD>' +
      '<NATIVEMETHOD>EndingAt</NATIVEMETHOD></COLLECTION></TDLMESSAGE></TDL>',
  );
}

/** Product info function call (assumed shape; the answer is a short text such as "TallyPrime Release 5.1"). */
export function buildProdInfoRequest(): string {
  return envelope('Function', REQ_PROD_INFO, '');
}

// ---------------------------------------------------------------- parsing (small, dependency-free)

function unescapeXml(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_m, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, '&');
}

function tag(block: string, name: string): string | null {
  const m = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i').exec(block);
  const v = m ? unescapeXml(m[1].trim()) : '';
  return v === '' ? null : v;
}

function isoDate(v: string | null): string | null {
  return v && /^\d{8}$/.test(v) ? `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}` : null;
}

export function parseLineError(xml: string): string | null {
  return tag(xml, 'LINEERROR');
}

/** Loaded companies from a Company collection answer: `<COMPANY NAME="..."><GUID>..</GUID>...</COMPANY>`. */
export function parseCompanies(xml: string): TallyCompanyInfo[] {
  const out: TallyCompanyInfo[] = [];
  const re = /<COMPANY\b([^>]*?)(?:\/>|>([\s\S]*?)<\/COMPANY>)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const attrName = /\bNAME\s*=\s*"([^"]*)"/i.exec(m[1])?.[1];
    const body = m[2] ?? '';
    const name = attrName !== undefined ? unescapeXml(attrName) : tag(body, 'NAME');
    if (!name) continue;
    out.push({
      name,
      guid: tag(body, 'GUID'),
      startingFrom: isoDate(tag(body, 'STARTINGFROM')),
      endingAt: isoDate(tag(body, 'ENDINGAT')),
    });
  }
  return out;
}

/** Version text from the function answer: `<RESPONSE>TallyPrime Release 5.1</RESPONSE>` (or bare text). */
export function parseProdInfo(xml: string): string | null {
  const v = tag(xml, 'RESPONSE') ?? tag(xml, 'RESULT');
  return v && v.length <= 120 ? v : null;
}

function looksLikeTallyXml(xml: string): boolean {
  return /<(ENVELOPE|RESPONSE)\b/i.test(xml);
}

// ---------------------------------------------------------------- user messages

export const MSG = {
  unreachable: (t: TallyTarget) =>
    `LazyBooks cannot reach TallyPrime at ${t.host}:${t.port}. Open TallyPrime, then turn on its XML server: press F1 (Help), ` +
    `choose Settings, Connectivity, Client/Server configuration, set "TallyPrime acts as" to Server (or Both), enable ODBC/XML, ` +
    `and set the port to ${t.port}. Then press Test again.`,
  timeout: (t: TallyTarget) =>
    `TallyPrime at ${t.host}:${t.port} did not answer in time. It may be busy (importing, backing up or showing a dialog). ` +
    'Close any open Tally dialog and try again.',
  notTally: (t: TallyTarget) =>
    `Something is listening on ${t.host}:${t.port}, but it is not answering like TallyPrime. Check the port in Tally ` +
    '(F1, Settings, Connectivity, Client/Server configuration) and in LazyBooks, and make sure no other program uses it.',
  rejected: (detail: string) =>
    `TallyPrime refused the request: ${detail}. Make sure a company is open and no dialog is waiting for input, then try again.`,
  noCompany:
    'TallyPrime is running but no company is open. In TallyPrime press Alt+F3 (Select Company) or open a company, then press Test again.',
  choose: (n: number) =>
    `${n} companies are open in TallyPrime. Choose the company LazyBooks should sync.`,
  savedNotLoaded: (name: string | null) =>
    `The company LazyBooks was using${name ? ` (${name})` : ''} is not open in TallyPrime. Open it in Tally or choose another company.`,
  ok: (name: string) => `Connected to TallyPrime. Company: ${name}.`,
} as const;

// ---------------------------------------------------------------- detector

export interface DetectDeps {
  getTarget: () => TallyTarget;
  getCompanyGuid: () => string | null;
  setCompanyGuid: (guid: string | null) => void;
  post?: PostFn;
  timeoutMs?: number;
  /** Called whenever the detection result changes (status event). */
  onChange?: (d: TallyDetection) => void;
}

export interface TallyDetector {
  /** Probe now (never throws). Concurrent calls share one probe: Tally is single-threaded. */
  detect(): Promise<TallyDetection>;
  last(): TallyDetection | null;
  /** Pick the company to sync by GUID (or name when Tally gave no GUID). Re-evaluates the last detection. */
  selectCompany(key: string): TallyDetection | null;
  /** Re-probe on an interval (default 60 s). */
  start(intervalMs?: number): void;
  stop(): void;
  /** Simple view for Status.tally. */
  status(): { ok: boolean; version: string | null; company: string | null };
}

export function createTallyDetector(deps: DetectDeps): TallyDetector {
  const post = deps.post ?? httpPost;
  const timeoutMs = deps.timeoutMs ?? Math.min(DESKTOP_DEFAULTS.tallyTimeoutS * 1000, 10_000);
  let lastResult: TallyDetection | null = null;
  let inflight: Promise<TallyDetection> | null = null;
  let timer: NodeJS.Timeout | null = null;

  const keyOf = (c: TallyCompanyInfo): string => c.guid ?? c.name;

  function evaluate(
    base: Pick<TallyDetection, 'host' | 'port' | 'version' | 'companies'>,
  ): Pick<TallyDetection, 'state' | 'ok' | 'code' | 'selected' | 'message'> {
    const { companies } = base;
    if (companies.length === 0) {
      return { state: 'no_company', ok: false, code: 'TALLY_COMPANY_NOT_LOADED', selected: null, message: MSG.noCompany };
    }
    const saved = deps.getCompanyGuid();
    const match = saved ? companies.find((c) => keyOf(c) === saved) : undefined;
    if (match) return { state: 'ok', ok: true, code: null, selected: match, message: MSG.ok(match.name) };
    if (!saved && companies.length === 1) {
      deps.setCompanyGuid(keyOf(companies[0])); // the only loaded company: pick it
      return { state: 'ok', ok: true, code: null, selected: companies[0], message: MSG.ok(companies[0].name) };
    }
    return {
      state: 'choose_company',
      ok: false,
      code: null,
      selected: null,
      message: saved ? MSG.savedNotLoaded(null) : MSG.choose(companies.length),
    };
  }

  async function probe(): Promise<TallyDetection> {
    const target = deps.getTarget();
    const now = new Date().toISOString();
    const fail = (state: TallyState, code: string | null, message: string): TallyDetection => ({
      state, ok: false, code, host: target.host, port: target.port, version: null, companies: [], selected: null, message, checkedAt: now,
    });

    let listXml: string;
    try {
      const raw = await post(target, buildCompanyListRequest(), timeoutMs);
      const dec = decodeResponse(raw);
      if (dec.stripped > 0) logger.warn('tally', 'illegal xml characters stripped', { stripped: dec.stripped, request: REQ_COMPANY_NAMES });
      listXml = dec.text;
    } catch (err) {
      const e = err as TallyTransportError;
      if (e.kind === 'timeout') return fail('unreachable', 'LB_TALLY_UNREACHABLE', MSG.timeout(target));
      return fail('unreachable', 'LB_TALLY_UNREACHABLE', MSG.unreachable(target));
    }

    const lineError = parseLineError(listXml);
    if (lineError) return fail('rejected', 'LB_TALLY_REJECTED', MSG.rejected(lineError));
    if (!looksLikeTallyXml(listXml)) return fail('not_tally', 'LB_TALLY_REJECTED', MSG.notTally(target));

    const companies = parseCompanies(listXml);

    // Version is best effort: a failure here never turns a working connection into an error.
    let version: string | null = null;
    try {
      const dec = decodeResponse(await post(target, buildProdInfoRequest(), timeoutMs));
      if (!parseLineError(dec.text)) version = parseProdInfo(dec.text);
    } catch {
      version = null;
    }

    const base = { host: target.host, port: target.port, version, companies };
    return { ...base, ...evaluate(base), checkedAt: now };
  }

  function publish(next: TallyDetection): void {
    const prev = lastResult;
    lastResult = next;
    const changed = !prev || prev.state !== next.state || prev.version !== next.version || prev.selected?.name !== next.selected?.name;
    if (changed) {
      logger.info('tally', 'detection', {
        state: next.state, code: next.code, host: next.host, port: next.port, version: next.version,
        companies: next.companies.length, selected: next.selected?.name ?? null,
      });
      deps.onChange?.(next);
    }
  }

  return {
    detect() {
      if (!inflight) {
        inflight = probe()
          .catch((err): TallyDetection => {
            const t = deps.getTarget();
            logger.error('tally', 'detection failed unexpectedly', { error: String((err as Error)?.message ?? err) });
            return {
              state: 'unreachable', ok: false, code: 'LB_TALLY_UNREACHABLE', host: t.host, port: t.port, version: null,
              companies: [], selected: null, message: MSG.unreachable(t), checkedAt: new Date().toISOString(),
            };
          })
          .then((r) => {
            publish(r);
            return r;
          })
          .finally(() => {
            inflight = null;
          });
      }
      return inflight;
    },
    last: () => lastResult,
    selectCompany(key) {
      if (!lastResult || !lastResult.companies.some((c) => keyOf(c) === key)) return lastResult;
      deps.setCompanyGuid(key);
      const base = { host: lastResult.host, port: lastResult.port, version: lastResult.version, companies: lastResult.companies };
      publish({ ...lastResult, ...evaluate(base), checkedAt: new Date().toISOString() });
      return lastResult;
    },
    start(intervalMs = 60_000) {
      if (timer) return;
      void this.detect();
      timer = setInterval(() => void this.detect(), intervalMs);
      timer.unref?.();
    },
    stop() {
      if (timer) clearInterval(timer);
      timer = null;
    },
    status() {
      const l = lastResult;
      return { ok: !!l?.ok, version: l?.version ?? null, company: l?.selected?.name ?? null };
    },
  };
}
