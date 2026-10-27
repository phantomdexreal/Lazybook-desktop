/*
LazyBooks | src/main/tally/xml.ts
Responsibility: Tally XML building (Export requests, collections, functions), escaping, decoding and a dependency-free parser
Introduced by: Phase 8 (tally-xml-client)
STATUS: IMPLEMENTED (Phase 8)
Generic only: no entity (ledger, voucher, ...) knowledge. Column mapping arrives in Phases 9-14 on top of `collectionRows`.
No Electron import: testable from Node.
*/

// ---------------------------------------------------------------- escaping and decoding

export function escapeXml(s: string): string {
  return stripIllegalXml(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function unescapeXml(s: string): string {
  if (s.indexOf('&') < 0) return s;
  return s.replace(/&(#x[0-9a-fA-F]+|#\d+|lt|gt|amp|quot|apos);/g, (_m, e: string) => {
    switch (e) {
      case 'lt': return '<';
      case 'gt': return '>';
      case 'amp': return '&';
      case 'quot': return '"';
      case 'apos': return "'";
      default: {
        const cp = e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(cp) && cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : '';
      }
    }
  });
}

/** Remove characters (and numeric references to them) that are illegal in XML 1.0, such as C0 controls. */
export function stripIllegalXml(text: string): string {
  return text
    .replace(/&#(?:x0*(?:[0-8bcef]|1[0-9a-f])|0*(?:[0-8]|11|12|1[4-9]|2\d|3[01]));/gi, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}

/** Decode UTF-8 / UTF-16 (BOM) bytes and strip illegal XML characters. `stripped` is for the log counter. */
export function decodeResponse(buf: Buffer): { text: string; stripped: number } {
  let text: string;
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) text = buf.subarray(2).toString('utf16le');
  else if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) text = Buffer.from(buf.subarray(2)).swap16().toString('utf16le');
  else text = buf.toString('utf8').replace(/^﻿/, '');
  const before = text.length;
  text = stripIllegalXml(text);
  return { text, stripped: before - text.length };
}

// ---------------------------------------------------------------- request builders

const NAME_RE = /^[A-Za-z][A-Za-z0-9_]*$/;
const FIELD_RE = /^[A-Za-z_][A-Za-z0-9_.$]*$/;

function assertName(kind: string, v: string, re: RegExp): void {
  if (!re.test(v)) throw new Error(`Invalid ${kind} for a Tally request: ${JSON.stringify(v)}`);
}

export interface RequestScope {
  /** Exact company name (SVCURRENTCOMPANY). Omit to use whatever Tally has selected. */
  company?: string | null;
  /** YYYYMMDD */
  fromDate?: string;
  toDate?: string;
}

function staticVars(scope: RequestScope): string {
  let v = '<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>';
  if (scope.company) v += `<SVCURRENTCOMPANY>${escapeXml(scope.company)}</SVCURRENTCOMPANY>`;
  if (scope.fromDate) {
    assertName('date', scope.fromDate, /^\d{8}$/);
    v += `<SVFROMDATE>${scope.fromDate}</SVFROMDATE>`;
  }
  if (scope.toDate) {
    assertName('date', scope.toDate, /^\d{8}$/);
    v += `<SVTODATE>${scope.toDate}</SVTODATE>`;
  }
  return `<STATICVARIABLES>${v}</STATICVARIABLES>`;
}

export function buildEnvelope(type: 'Collection' | 'Function' | 'Data' | 'Object', id: string, scope: RequestScope, tdl = ''): string {
  return (
    `<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>${type}</TYPE><ID>${escapeXml(id)}</ID></HEADER>` +
    `<BODY><DESC>${staticVars(scope)}${tdl}</DESC></BODY></ENVELOPE>`
  );
}

export interface CollectionSpec extends RequestScope {
  /** Request id and collection name, e.g. `LBLedgers`. */
  name: string;
  /** Tally object type, e.g. `Ledger`. */
  type: string;
  /** Simple fields: one NATIVEMETHOD each. */
  fields: string[];
  /** Nested sub-objects (for example `LedMailingDetails.*`, `LEDMAILINGDETAILS.LIST`): one FETCH each. */
  fetch?: string[];
  /** Filters: a formula name plus its expression, e.g. `{name:'LBChanged', formula:'$AlterID > 1200'}`. */
  filters?: Array<{ name: string; formula: string }>;
  /**
   * Phase 44: collection variables (`<COMPUTEVAR>name : definition</COMPUTEVAR>`, e.g. a running number). Emitted before the
   * FILTERS tag, in the given order. Omit for the unchanged request.
   */
  computeVars?: Array<{ name: string; formula: string }>;
  /** Phase 44: per-object computed values (`<COMPUTE>name : formula</COMPUTE>`), emitted after the compute variables, in order. */
  computeLines?: Array<{ name: string; formula: string }>;
}

/** Collection export (TALLY_WIRE section 2): TYPE + NATIVEMETHOD fields + FETCH + FILTERS (plural) + SYSTEM formulae. */
export function buildCollectionRequest(spec: CollectionSpec): string {
  assertName('collection name', spec.name, NAME_RE);
  assertName('object type', spec.type, NAME_RE);
  let c = `<COLLECTION NAME="${spec.name}" ISMODIFY="No"><TYPE>${spec.type}</TYPE>`;
  for (const f of spec.fields) {
    assertName('field', f, FIELD_RE);
    c += `<NATIVEMETHOD>${f}</NATIVEMETHOD>`;
  }
  for (const f of spec.fetch ?? []) {
    assertName('fetch field', f, /^[A-Za-z_][A-Za-z0-9_.$*]*$/);
    c += `<FETCH>${f}</FETCH>`;
  }
  for (const [tag, list] of [['COMPUTEVAR', spec.computeVars], ['COMPUTE', spec.computeLines]] as const) {
    for (const v of list ?? []) {
      assertName('compute name', v.name, NAME_RE);
      c += `<${tag}>${v.name} : ${escapeXml(v.formula)}</${tag}>`;
    }
  }
  // filters stay in the given order: Tally applies them one after the other (the paging filter must come after the narrowing ones)
  const filters = spec.filters ?? [];
  if (filters.length > 0) {
    for (const f of filters) assertName('filter name', f.name, NAME_RE);
    c += `<FILTERS>${filters.map((f) => f.name).join(',')}</FILTERS>`;
  }
  c += '</COLLECTION>';
  const systems = filters.map((f) => `<SYSTEM TYPE="Formulae" NAME="${f.name}">${escapeXml(f.formula)}</SYSTEM>`).join('');
  return buildEnvelope('Collection', spec.name, spec, `<TDL><TDLMESSAGE>${c}${systems}</TDLMESSAGE></TDL>`);
}

/** Function export: `expr` is a TDL function such as `$$ProdInfo`; the answer arrives in `<RESPONSE>`. */
export function buildFunctionRequest(expr: string, scope: RequestScope = {}): string {
  if (!/^[\x20-\x7E]{1,200}$/.test(expr) || /[<>]/.test(expr)) throw new Error('Invalid Tally function expression');
  return buildEnvelope('Function', expr, scope);
}

// ---------------------------------------------------------------- parser

export class XmlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'XmlError';
  }
}

export interface XNode {
  name: string;
  attrs: Record<string, string>;
  /** Direct text, trimmed, entities decoded (empty for container elements). */
  text: string;
  children: XNode[];
}

const MAX_DEPTH = 64;
const ATTR_RE = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

/** Pull parser over one string: `next()` returns the next complete element starting at `pos`. */
class Reader {
  pos = 0;
  constructor(readonly s: string) {}

  /** Skip whitespace, comments, processing instructions and DOCTYPE; returns true when positioned on an element start. */
  private skipMisc(): boolean {
    const s = this.s;
    for (;;) {
      const lt = s.indexOf('<', this.pos);
      if (lt < 0) { this.pos = s.length; return false; }
      this.pos = lt;
      if (s.startsWith('<?', lt)) {
        const e = s.indexOf('?>', lt);
        if (e < 0) throw new XmlError('Unterminated processing instruction');
        this.pos = e + 2;
      } else if (s.startsWith('<!--', lt)) {
        const e = s.indexOf('-->', lt);
        if (e < 0) throw new XmlError('Unterminated comment');
        this.pos = e + 3;
      } else if (s.startsWith('<!DOCTYPE', lt)) {
        const e = s.indexOf('>', lt);
        if (e < 0) throw new XmlError('Unterminated DOCTYPE');
        this.pos = e + 1;
      } else return !s.startsWith('</', lt);
    }
  }

  /** Next element at the current level, or null at end of input or at a closing tag. */
  next(): XNode | null {
    if (!this.skipMisc()) return null;
    return this.element(0);
  }

  /** Peek whether the next markup is a closing tag; consumes it when `name` matches. */
  closeIf(name: string): boolean {
    const s = this.s;
    for (;;) {
      const lt = s.indexOf('<', this.pos);
      if (lt < 0) return false;
      if (s.startsWith('<!--', lt)) {
        const e = s.indexOf('-->', lt);
        if (e < 0) throw new XmlError('Unterminated comment');
        this.pos = e + 3;
        continue;
      }
      if (!s.startsWith('</', lt)) { this.pos = lt; return false; }
      const gt = s.indexOf('>', lt);
      if (gt < 0) throw new XmlError('Unterminated closing tag');
      if (s.slice(lt + 2, gt).trim() !== name) throw new XmlError(`Mismatched closing tag for ${name}`);
      this.pos = gt + 1;
      return true;
    }
  }

  private element(depth: number): XNode {
    if (depth > MAX_DEPTH) throw new XmlError('XML nested too deeply');
    const s = this.s;
    const start = this.pos; // at '<'
    let i = start + 1;
    // find the end of the open tag, honouring quoted attribute values
    let quote = '';
    let end = -1;
    for (; i < s.length; i++) {
      const ch = s[i];
      if (quote) { if (ch === quote) quote = ''; }
      else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '>') { end = i; break; }
    }
    if (end < 0) throw new XmlError('Unterminated tag');
    const selfClosing = s[end - 1] === '/';
    const inner = s.slice(start + 1, selfClosing ? end - 1 : end);
    const m = /^([^\s/>]+)/.exec(inner);
    if (!m) throw new XmlError('Element without a name');
    const name = m[1];
    const attrs: Record<string, string> = {};
    if (inner.length > name.length) {
      const rest = inner.slice(name.length);
      ATTR_RE.lastIndex = 0;
      let a: RegExpExecArray | null;
      while ((a = ATTR_RE.exec(rest))) attrs[a[1]] = unescapeXml(a[2] ?? a[3] ?? '');
    }
    this.pos = end + 1;
    const node: XNode = { name, attrs, text: '', children: [] };
    if (selfClosing) return node;

    let text = '';
    for (;;) {
      const lt = s.indexOf('<', this.pos);
      if (lt < 0) throw new XmlError(`Unexpected end of data inside <${name}>`);
      if (lt > this.pos) text += unescapeXml(s.slice(this.pos, lt));
      this.pos = lt;
      if (s.startsWith('</', lt)) {
        const gt = s.indexOf('>', lt);
        if (gt < 0) throw new XmlError('Unterminated closing tag');
        const closing = s.slice(lt + 2, gt).trim();
        if (closing !== name) throw new XmlError(`Expected </${name}> but found </${closing}>`);
        this.pos = gt + 1;
        break;
      }
      if (s.startsWith('<![CDATA[', lt)) {
        const e = s.indexOf(']]>', lt);
        if (e < 0) throw new XmlError('Unterminated CDATA');
        text += s.slice(lt + 9, e);
        this.pos = e + 3;
      } else if (s.startsWith('<!--', lt)) {
        const e = s.indexOf('-->', lt);
        if (e < 0) throw new XmlError('Unterminated comment');
        this.pos = e + 3;
      } else if (s.startsWith('<?', lt)) {
        const e = s.indexOf('?>', lt);
        if (e < 0) throw new XmlError('Unterminated processing instruction');
        this.pos = e + 2;
      } else {
        node.children.push(this.element(depth + 1));
      }
    }
    node.text = text.trim();
    return node;
  }
}

/** Parse a whole document; returns the root element. Throws XmlError when malformed. */
export function parseXml(text: string): XNode {
  const r = new Reader(text);
  const root = r.next();
  if (!root) throw new XmlError('No XML element found');
  return root;
}

export function findChild(n: XNode, name: string): XNode | undefined {
  return n.children.find((c) => c.name.toUpperCase() === name.toUpperCase());
}

/** First descendant (depth first) with this name. */
export function findDescendant(n: XNode, name: string): XNode | undefined {
  const up = name.toUpperCase();
  for (const c of n.children) {
    if (c.name.toUpperCase() === up) return c;
    const d = findDescendant(c, name);
    if (d) return d;
  }
  return undefined;
}

// ---------------------------------------------------------------- rows

/** A parsed object. Attributes become `@NAME`; simple tags give text (repeats give string[]); tags with children give Row[]. */
export type Row = { [key: string]: string | string[] | Row[] };

export function nodeToRow(n: XNode): Row {
  const row: Row = {};
  for (const [k, v] of Object.entries(n.attrs)) row[`@${k}`] = v;
  for (const c of n.children) {
    const prev = row[c.name];
    if (c.children.length > 0) {
      if (Array.isArray(prev) && (prev.length === 0 || typeof prev[0] === 'object')) (prev as Row[]).push(nodeToRow(c));
      else row[c.name] = [nodeToRow(c)];
    } else {
      if (prev === undefined) row[c.name] = c.text;
      else if (Array.isArray(prev)) (prev as string[]).push(c.text);
      else row[c.name] = [prev as string, c.text];
    }
  }
  return row;
}

/**
 * Stream the objects of the first COLLECTION element one at a time. Only one object tree exists at once, so a very
 * large company does not build a whole-document tree. `objectName` restricts to one element name (default: all).
 * Throws XmlError on malformed input (after yielding the objects that were complete).
 */
export function* iterateCollection(text: string, objectName?: string): Generator<XNode> {
  const m = /<COLLECTION(?:\s[^>]*?)?(\/?)>/i.exec(text);
  if (m && m[1] === '/') return; // `<COLLECTION />`: an empty collection (for example no cost centres)
  if (!m) {
    if (!/<ENVELOPE\b/i.test(text)) throw new XmlError('Not a Tally response');
    return; // an envelope with no collection: nothing matched
  }
  const r = new Reader(text);
  r.pos = m.index + m[0].length;
  const want = objectName?.toUpperCase();
  for (;;) {
    if (r.closeIf('COLLECTION')) return;
    const n = r.next();
    if (!n) throw new XmlError('Unexpected end of data inside <COLLECTION>');
    if (!want || n.name.toUpperCase() === want) yield n;
  }
}

export function collectionRows(text: string, objectName?: string): Row[] {
  const out: Row[] = [];
  for (const n of iterateCollection(text, objectName)) out.push(nodeToRow(n));
  return out;
}

// ---------------------------------------------------------------- response inspection

export function lineErrors(text: string): string[] {
  const out: string[] = [];
  const re = /<LINEERROR(?:\s[^>]*)?>([\s\S]*?)<\/LINEERROR>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push(unescapeXml(m[1].trim()));
  return out;
}

/** Text of a Function answer (`<RESPONSE>value</RESPONSE>`), or null. */
export function responseText(text: string): string | null {
  const m = /<RESPONSE(?:\s[^>]*)?>([\s\S]*?)<\/RESPONSE>/i.exec(text);
  return m ? unescapeXml(m[1].trim()) : null;
}

export interface ImportResult {
  /** No LINEERROR, ERRORS = 0 and CREATED + ALTERED > 0 (TALLY_WIRE section 8). */
  ok: boolean;
  /** Tally answered but the outcome is unclear (nothing created, IGNORED/COMBINED > 0, or unreadable): never retry blindly. */
  ambiguous: boolean;
  created: number;
  altered: number;
  ignored: number;
  combined: number;
  errors: number;
  lastVchId: string | null;
  lastMId: string | null;
  lineErrors: string[];
  /** Request-level failure: STATUS 0 with STATUS.LIST DESC. */
  statusDesc: string | null;
}

function num(text: string, tag: string): number {
  const m = new RegExp(`<${tag}>\\s*(-?\\d+)\\s*</${tag}>`, 'i').exec(text);
  return m ? parseInt(m[1], 10) : 0;
}
function str(text: string, tag: string): string | null {
  const m = new RegExp(`<${tag}>\\s*([^<]*?)\\s*</${tag}>`, 'i').exec(text);
  return m && m[1] !== '' ? unescapeXml(m[1]) : null;
}

/** Interpret a voucher (IMPORTRESULT) or master (RESPONSE) import answer. */
export function parseImportResult(text: string): ImportResult {
  const errs = lineErrors(text);
  const created = num(text, 'CREATED');
  const altered = num(text, 'ALTERED');
  const ignored = num(text, 'IGNORED');
  const combined = num(text, 'COMBINED');
  const errors = num(text, 'ERRORS');
  const hasCounters = /<(CREATED|ALTERED|ERRORS)>/i.test(text);
  const headerStatus = /<HEADER>[\s\S]*?<STATUS>\s*(\d+)\s*<\/STATUS>/i.exec(text)?.[1];
  const statusDesc = headerStatus === '0' ? (str(text, 'DESC') ?? 'Tally rejected the request') : null;
  const ok = errs.length === 0 && statusDesc === null && errors === 0 && created + altered > 0;
  const ambiguous = !ok && errs.length === 0 && statusDesc === null && errors === 0 && (!hasCounters || ignored > 0 || combined > 0 || created + altered === 0);
  return {
    ok, ambiguous, created, altered, ignored, combined, errors,
    lastVchId: str(text, 'LASTVCHID'), lastMId: str(text, 'LASTMID'), lineErrors: errs, statusDesc,
  };
}
