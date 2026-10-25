/*
LazyBooks | src/main/entries/results.ts
Responsibility: Result + error mapping (Tally import answer -> detail code -> status, code, retryable -> friendly text; raw text kept)
Introduced by: Phase 28 (result-mapping)
STATUS: IMPLEMENTED (Phase 28)
*/

/**
 * Pure module (no Electron import, no I/O, no logging). Source of truth is `docs/shared/entry_rules.json` `result`:
 *   - `details`: detail code -> { code (LB_*), status, retryable }  -> `ruleFor`, `RESULT_DETAILS`
 *   - `tally_message_map`: ordered regular expressions over Tally's own error text -> detail  -> `mapTallyMessage`
 * The patterns are ASSUMED from public Tally behaviour (ENTRY_PAYLOADS section 6) and must be confirmed on a real Tally (PEER-02).
 * A short list of local extra patterns (`LOCAL_PATTERNS`, flagged) is tried after the shared list; anything unmatched is `UNKNOWN`
 * (failed) with the raw Tally text kept in `tally_raw` (truncated to 2000 characters) so a pattern can be added later.
 * Every failure also gets a plain sentence for the person using the PWA (`friendlyMessage`); the raw text is never the only thing stored.
 */
import rulesJson from '../../../docs/shared/entry_rules.json';
import type { ImportResult } from '../tally/xml';
import type { DetailRule, EntryOutcome } from './listener';

export const RAW_MAX = 2000;
export const MESSAGE_MAX = 300;

type Rules = {
  result: {
    details: Record<string, { code: string; status: string; retryable: boolean }>;
    tally_message_map: { match: string; detail: string }[];
  };
};
const RULES = rulesJson as unknown as Rules;

/** detail -> { code, status, retryable } exactly as in `entry_rules.json`. */
export const RESULT_DETAILS: Readonly<Record<string, DetailRule>> = Object.freeze(
  Object.fromEntries(Object.entries(RULES.result.details).map(([k, v]) => [k, { code: v.code, status: v.status as DetailRule['status'], retryable: v.retryable }])),
);

/** Table lookup for the listener's `mapDetail` seam; undefined for a detail the shared table does not know (the listener then uses `UNKNOWN`). */
export function ruleFor(detail: string): DetailRule | undefined {
  return Object.prototype.hasOwnProperty.call(RESULT_DETAILS, detail) ? RESULT_DETAILS[detail] : undefined;
}

export const isKnownDetail = (detail: string): boolean => ruleFor(detail) !== undefined;

/** `(?i)` inline flags of the shared patterns are not valid in JS: strip the prefix and use the `i` flag. */
function compile(src: string): RegExp {
  const m = /^\(\?([a-z]+)\)/.exec(src);
  const flags = m ? (m[1] as string).replace(/[^imsu]/g, '') : '';
  return new RegExp(m ? src.slice(m[0].length) : src, flags);
}

interface Pattern {
  re: RegExp;
  detail: string;
}

const SHARED_PATTERNS: Pattern[] = RULES.result.tally_message_map.map((p) => ({ re: compile(p.match), detail: p.detail }));

/**
 * Local additions (decision, flagged, assumed like the shared ones): masters that a master or voucher refers to but Tally does not have.
 * Tried only after every shared pattern failed, so the shared order always wins.
 */
/**
 * Local patterns tried BEFORE the shared list (decision, flagged): the shared voucher-number pattern needs text between "number" and
 * "already", so the plain sentence "Voucher number already exists" would fall through to the generic master-exists pattern.
 */
export const EARLY_PATTERNS: Pattern[] = [{ re: /voucher (no\.?|number)\b.*\b(already|duplicate)|duplicate voucher/i, detail: 'VOUCHER_NUMBER_EXISTS' }];

export const LOCAL_PATTERNS: Pattern[] = [
  { re: /(group|unit|stock group|category|cost cent(?:re|er)|currency) '?.+?'? (does not exist|not found)/i, detail: 'MASTER_NOT_FOUND' },
  { re: /(voucher|entry) .*(cannot be altered|not found)/i, detail: 'TARGET_NOT_FOUND' },
];

/** Details whose first capture group is the name of the missing master (shared patterns 1 to 4). */
const NAMED: ReadonlySet<string> = new Set(['LEDGER_NOT_FOUND', 'STOCK_ITEM_NOT_FOUND', 'GODOWN_NOT_FOUND', 'VOUCHER_TYPE_NOT_FOUND']);
const NAME_MAX = 80;

export interface MessageMatch {
  detail: string;
  /** Name of the missing master when Tally's text carried one (ledger, stock item, godown, voucher type). */
  name?: string;
}

/** First pattern (early local list, shared list, then local list) that matches Tally's text; null when none does. */
export function matchTallyMessage(text: string): MessageMatch | null {
  if (typeof text !== 'string' || text.length === 0) return null;
  const t = text.length > 4000 ? text.slice(0, 4000) : text;
  for (const list of [EARLY_PATTERNS, SHARED_PATTERNS, LOCAL_PATTERNS]) {
    for (const p of list) {
      const m = p.re.exec(t);
      if (!m) continue;
      const out: MessageMatch = { detail: p.detail };
      const g = m[1];
      if (NAMED.has(p.detail) && typeof g === 'string' && g.trim().length > 0) out.name = g.trim().slice(0, NAME_MAX);
      return out;
    }
  }
  return null;
}

/** Same as `matchTallyMessage` but only the detail: the shape the Phase 27 handlers take as `mapMessage`. */
export function mapTallyMessage(text: string): string | null {
  return matchTallyMessage(text)?.detail ?? null;
}

const FRIENDLY: Readonly<Record<string, string>> = {
  PAYLOAD_INVALID: 'The entry is not in the expected format. Create it again from the app.',
  UNSUPPORTED_VERSION: 'This entry was made by a newer app version. Update LazyBooks on the PC.',
  COMPANY_MISMATCH: 'The entry belongs to a different company than the one this PC syncs.',
  TOTAL_MISMATCH: 'The totals of the entry do not add up. Check the amounts and create it again.',
  TAX_MISMATCH: 'The tax on the entry does not match the rates. Check the tax and create it again.',
  UNBALANCED: 'The debits and credits of the entry do not balance. Check the amounts and create it again.',
  LEDGER_NOT_FOUND: 'A ledger used in this entry does not exist in Tally.',
  STOCK_ITEM_NOT_FOUND: 'A stock item used in this entry does not exist in Tally.',
  GODOWN_NOT_FOUND: 'A godown used in this entry does not exist in Tally.',
  VOUCHER_TYPE_NOT_FOUND: 'The voucher type of this entry does not exist in Tally.',
  VOUCHER_TYPE_MISMATCH: 'The voucher type does not suit this kind of entry. Pick the right voucher type and create it again.',
  VOUCHER_NUMBER_EXISTS: 'This voucher number is already used for this voucher type. Use another number.',
  DATE_OUT_OF_PERIOD: 'The date is outside the financial year that is open in Tally.',
  NEGATIVE_STOCK: 'Posting this would make the stock negative in Tally. Check the quantities.',
  BILL_REF_NOT_FOUND: 'The bill this entry settles was not found in Tally.',
  MASTER_EXISTS: 'A master with this name already exists in Tally. Choose another name.',
  MASTER_NOT_FOUND: 'A group, unit or stock group used here does not exist in Tally.',
  TARGET_NOT_FOUND: 'The voucher to change was not found in Tally.',
  ALTER_CONFLICT: 'The voucher was changed in Tally after it was opened here. Check it in Tally, then act in the review queue.',
  EINVOICE_REJECTED: 'The e-invoice or e-way bill step was rejected. Check the details in Tally.',
  TALLY_COMPANY_NOT_LOADED: 'The company is not open in Tally. Open it; the entry will be tried again.',
  TALLY_UNREACHABLE: 'Tally is not reachable on the PC. The entry will be tried again.',
  FLAG_DISABLED: 'Entries are not enabled for this license.',
  DEVICE_REVOKED: 'This device was removed from the license and can no longer post entries.',
  DUPLICATE_CLIENT_REQUEST: 'This entry is already in Tally.',
  AMBIGUOUS_RESULT: 'The connector cannot tell whether Tally has this entry. Check Tally, then act in the review queue.',
  UNKNOWN: 'Tally did not accept this entry.',
};

const NAMED_TEXT: Readonly<Record<string, (n: string) => string>> = {
  LEDGER_NOT_FOUND: (n) => `Ledger '${n}' does not exist in Tally.`,
  STOCK_ITEM_NOT_FOUND: (n) => `Stock item '${n}' does not exist in Tally.`,
  GODOWN_NOT_FOUND: (n) => `Godown '${n}' does not exist in Tally.`,
  VOUCHER_TYPE_NOT_FOUND: (n) => `Voucher type '${n}' does not exist in Tally.`,
};

const clip = (s: string, n = MESSAGE_MAX): string => (s.length > n ? s.slice(0, n - 1) + '.' : s);
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Raw Tally text kept for diagnosis: control characters removed, at most 2000 characters. */
export function rawOf(text: string): string {
  return text.replace(CONTROL, ' ').slice(0, RAW_MAX);
}

/** The plain sentence shown to the person for a detail code; `name` fills the four "not found" texts. Unknown details read as `UNKNOWN`. */
export function friendlyMessage(detail: string, name?: string): string {
  const named = NAMED_TEXT[detail];
  if (named && name) return clip(named(name));
  return FRIENDLY[detail] ?? (FRIENDLY['UNKNOWN'] as string);
}

type Failure = Extract<EntryOutcome, { ok: false }>;

/** A SVCurrentCompany-style request answer: the company the request names is not open in Tally. */
const COMPANY_STATUS = /SVCurrentCompany|company.*(not|isn't|is not).*(loaded|open|found|selected)|no company/i;

/**
 * Turns an unsuccessful Tally import answer (`ImportResult`: LINEERROR lines, ERRORS counter, STATUS 0 + DESC, or an unclear answer)
 * into a failed outcome: the first line error (in order) that maps to a detail decides (an injected `mapMessage` first, then the table), the friendly sentence is the message, and the
 * raw text (all line errors and the status text) is kept in `tally_raw`. Nothing here posts, reads or retries.
 */
export function mapImportFailure(res: ImportResult, mapMessage?: (t: string) => string | null): Failure {
  const parts = [...res.lineErrors, res.statusDesc ?? ''].filter(Boolean);
  const raw = rawOf(parts.join(' | '));
  if (res.statusDesc && COMPANY_STATUS.test(res.statusDesc)) {
    return { ok: false, detail: 'TALLY_COMPANY_NOT_LOADED', message: friendlyMessage('TALLY_COMPANY_NOT_LOADED'), tally_raw: raw };
  }
  if (res.lineErrors.length > 0 || res.errors > 0 || res.statusDesc) {
    for (const m of [...res.lineErrors, ...(res.statusDesc ? [res.statusDesc] : [])]) {
      const hit = matchTallyMessage(m);
      const detail = (mapMessage ? mapMessage(m) : null) ?? hit?.detail ?? null;
      if (detail) return { ok: false, detail, message: friendlyMessage(detail, hit?.detail === detail ? hit.name : undefined), tally_raw: raw };
    }
    const first = res.lineErrors[0] ?? res.statusDesc ?? '';
    const base = friendlyMessage('UNKNOWN');
    return { ok: false, detail: 'UNKNOWN', message: first ? clip(`${base} Tally said: ${first.replace(CONTROL, ' ').trim()}`) : base, tally_raw: raw };
  }
  return { ok: false, detail: 'AMBIGUOUS_RESULT', message: 'Tally answered but did not say whether it created the entry. Check Tally, then act in the review queue.', tally_raw: raw };
}

export interface ResultShapeIssue {
  path: string;
  message: string;
}

const RESULT_KEYS = ['ok', 'guid', 'voucher_number', 'alter_id', 'message', 'tally_raw', 'code', 'detail', 'retryable'];

/** Checks an `entry_queue.result` object against `entry_rules.json` `result.shape` and `details` (empty list = valid). */
export function checkResultShape(r: unknown): ResultShapeIssue[] {
  const out: ResultShapeIssue[] = [];
  const bad = (path: string, message: string): void => void out.push({ path, message });
  if (r === null || typeof r !== 'object' || Array.isArray(r)) return [{ path: '', message: 'result must be an object' }];
  const o = r as Record<string, unknown>;
  for (const k of Object.keys(o)) if (!RESULT_KEYS.includes(k)) bad(k, 'unknown key');
  if (typeof o['ok'] !== 'boolean') bad('ok', 'must be a boolean');
  for (const k of ['guid', 'voucher_number', 'message', 'code', 'detail']) if (k in o && typeof o[k] !== 'string') bad(k, 'must be a string');
  if ('tally_raw' in o && (typeof o['tally_raw'] !== 'string' || (o['tally_raw'] as string).length > RAW_MAX)) bad('tally_raw', `must be a string of at most ${RAW_MAX} characters`);
  if ('alter_id' in o && !Number.isInteger(o['alter_id'])) bad('alter_id', 'must be an integer');
  if ('retryable' in o && typeof o['retryable'] !== 'boolean') bad('retryable', 'must be a boolean');
  if (o['ok'] === false) {
    const d = o['detail'];
    if (typeof d !== 'string' || !isKnownDetail(d)) bad('detail', 'must be a detail code of entry_rules.json');
    else {
      const rule = ruleFor(d) as DetailRule;
      if (o['code'] !== rule.code) bad('code', `must be ${rule.code} for ${d}`);
      if ('retryable' in o && o['retryable'] !== rule.retryable) bad('retryable', `must be ${String(rule.retryable)} for ${d}`);
    }
  }
  return out;
}
