/*
LazyBooks | src/main/tally/masters/map.ts
Responsibility: pure mapping of parsed Tally master objects to the tm_* tables (TALLY_WIRE sections 2 and 7), incl. derived columns
Introduced by: Phase 10 (tally-masters)
STATUS: IMPLEMENTED (Phase 10)
No I/O, no Electron import. Name-independence: names are only used as lookup keys (case-insensitive exact match,
never fuzzy, never compared with literal voucher type or ledger names); semantics come from reserved_name / ref_voucher_kind.
*/

import type { Row } from '../xml';
import { MASTER_TABLES, VOUCHER_KIND_BY_TALLY_NAME, type ColumnSpec } from './columns';

export type TableRow = Record<string, unknown>;
export type MasterTables = Record<string, TableRow[]>;

// ------------------------------------------------------------------ decimals (string arithmetic, no floats)
const SCALE = 4;

/** Round half away from zero to `places` decimals; returns [negative, digits as bigint scaled by 10^places]. */
function parseDec(text: string, places: number): { neg: boolean; v: bigint } | null {
  const m = /^([+-]?)(\d*)(?:\.(\d*))?$/.exec(text.trim().replace(/,/g, ''));
  if (!m || (m[2] === '' && (m[3] ?? '') === '')) return null;
  const frac = m[3] ?? '';
  const keep = frac.slice(0, places).padEnd(places, '0');
  let v = BigInt((m[2] || '0') + keep);
  if (frac.length > places && frac.charCodeAt(places) >= 53) v += 1n; // '5'
  return { neg: m[1] === '-', v };
}

function fmt(neg: boolean, v: bigint, places: number): string {
  const s = v.toString().padStart(places + 1, '0');
  const ip = s.slice(0, s.length - places);
  let fp = places > 0 ? s.slice(s.length - places) : '';
  fp = fp.replace(/0+$/, '');
  if (fp.length < 2) fp = fp.padEnd(2, '0');
  const zero = /^0+$/.test(ip) && /^0+$/.test(fp);
  return `${neg && !zero ? '-' : ''}${ip}.${fp}`;
}

/** Canonical wire string: at least 2 and at most 4 decimals (lbmodel.canon). Returns null when `text` is not a number. */
export function canon(text: string): string | null {
  const p = parseDec(text, SCALE);
  return p ? fmt(p.neg, p.v, SCALE) : null;
}

/** canon(round(value / qty, 2)) with half away from zero; used for stock `closing_rate`. */
export function ratio2(valueText: string, qtyText: string): string {
  const a = parseDec(valueText, SCALE);
  const b = parseDec(qtyText, SCALE);
  if (!a || !b || b.v === 0n) return '0.00';
  // a/b scaled by 100, rounded half up on magnitude
  const num = a.v * 100n;
  let q = num / b.v;
  if ((num % b.v) * 2n >= b.v) q += 1n;
  return fmt(a.neg !== b.neg, q, 2);
}

// ------------------------------------------------------------------ scalar access
type Node = string | string[] | Row[] | undefined;

/** First text of a possibly repeated simple tag. */
export function textOf(v: Node): string {
  if (typeof v === 'string') return v.trim();
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'string') return (v as string[])[0].trim();
  return '';
}

/** Value at a tag path (`A/B/C`, `@ATTR`); list tags descend into their first element. */
export function pathText(row: Row, tag: string): string {
  const parts = tag.split('/');
  let cur: Row = row;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const v = cur[p] as Node;
    if (i === parts.length - 1) return textOf(v);
    if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object') cur = (v as Row[])[0];
    else return '';
  }
  return '';
}

export function listRows(row: Row, tag: string): Row[] {
  const v = row[tag];
  return Array.isArray(v) && (v.length === 0 || typeof v[0] === 'object') ? (v as Row[]) : [];
}

export function listText(row: Row, tag: string): string[] | null {
  const lists = listRows(row, tag);
  if (lists.length === 0) return null;
  const child = tag.replace(/\.LIST$/, '');
  const out: string[] = [];
  for (const item of lists) {
    const v = item[child];
    if (typeof v === 'string') out.push(v.trim());
    else if (Array.isArray(v)) for (const l of v) if (typeof l === 'string') out.push(l.trim());
  }
  const clean = out.filter((l) => l !== '');
  return clean.length > 0 ? clean : null;
}

/** Texts of `LANGUAGENAME.LIST/NAME.LIST/NAME`, in order (first = the name itself, rest = aliases). */
function languageNames(row: Row): string[] {
  const out: string[] = [];
  for (const ln of listRows(row, 'LANGUAGENAME.LIST'))
    for (const nl of listRows(ln, 'NAME.LIST')) {
      const v = nl['NAME'];
      if (typeof v === 'string') out.push(v.trim());
      else if (Array.isArray(v)) for (const x of v) if (typeof x === 'string') out.push(x.trim());
    }
  return out;
}

function simpleValue(c: ColumnSpec, text: string): unknown {
  if (text === '') return c.d;
  switch (c.h) {
    case 'text':
      return text;
    case 'int': {
      return /^-?\d+$/.test(text) ? parseInt(text, 10) : c.d;
    }
    case 'yesno':
      return text.toLowerCase() === 'yes';
    case 'yesno_applicable':
      return text.toLowerCase() === 'applicable';
    case 'tally_date':
      return /^\d{8}/.test(text) ? `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}` : c.d;
    case 'amount':
      return canon(text.split(/\s+/)[0]) ?? c.d;
    case 'days': {
      const n = parseInt(text.split(/\s+/)[0], 10);
      return Number.isFinite(n) ? n : c.d;
    }
    case 'qty':
      return canon(text.split(/\s+/)[0]) ?? c.d;
    case 'rate':
      return canon(text.split('/')[0]) ?? c.d;
    default:
      return c.d;
  }
}

export const SCALAR_HINTS = new Set(['text', 'int', 'yesno', 'yesno_applicable', 'tally_date', 'amount', 'days', 'qty', 'rate']);

/** Read every simple column of `table` (those with a Tally tag and a scalar hint) from one object; `skip` columns keep their default. */
function readSimple(table: string, row: Row, skip: ReadonlySet<string> = new Set()): TableRow {
  return readColumns(MASTER_TABLES[table].columns, row, skip);
}

export function readColumns(columns: ColumnSpec[], row: Row, skip: ReadonlySet<string> = new Set()): TableRow {
  const out: TableRow = {};
  for (const c of columns) {
    if (skip.has(c.n) || !c.tag || !c.h || !SCALAR_HINTS.has(c.h)) {
      out[c.n] = c.d;
      continue;
    }
    out[c.n] = simpleValue(c, pathText(row, c.tag));
  }
  return out;
}

/** A row of `table` with every column at its default, in data_model column order. */
function defaults(table: string): TableRow {
  return defaultsOf(MASTER_TABLES[table].columns);
}

export function defaultsOf(columns: ColumnSpec[]): TableRow {
  const r: TableRow = {};
  for (const c of columns) r[c.n] = c.d;
  return r;
}

/** Signed decimal text to an integer scaled by 10^4 (exact); null when not a number. */
export function toScaled(text: string): bigint | null {
  const p = parseDec(text, SCALE);
  return p ? (p.neg ? -p.v : p.v) : null;
}

/** Scaled integer (10^4) to the canonical wire string. */
export function fromScaled(v: bigint): string {
  return fmt(v < 0n, v < 0n ? -v : v, SCALE);
}

/** canon(round(taxable * rate / 100, 4)) with half away from zero, on scaled integers. */
export function percentOf(taxable: bigint, rate: bigint): bigint {
  const num = taxable * rate; // scale 10^8
  const neg = num < 0n;
  const a = neg ? -num : num;
  const d = 10n ** 6n; // /100 and back to scale 10^4
  let q = a / d;
  if ((a % d) * 2n >= d) q += 1n;
  return neg ? -q : q;
}

export function jsonList(row: Row, tag: string): unknown[] | null {
  const items = listRows(row, tag);
  return items.length > 0 ? items.map((i) => JSON.parse(JSON.stringify(i))) : null;
}

// ------------------------------------------------------------------ resolver
const key = (name: string): string => name.trim().toLowerCase();

/** Case-insensitive exact name match within one table; '' when not found (SHARED derivation rule, never fuzzy). */
class Index {
  private m = new Map<string, TableRow>();
  constructor(rows: TableRow[]) {
    for (const r of rows) {
      const k = key(String(r.name));
      if (!this.m.has(k)) this.m.set(k, r);
    }
  }
  get(name: unknown): TableRow | undefined {
    return typeof name === 'string' && name.trim() !== '' ? this.m.get(key(name)) : undefined;
  }
  guid(name: unknown): string {
    return String(this.get(name)?.guid ?? '');
  }
}

export interface MapInput {
  /** Parsed objects per request id (`LBGroups`, `LBLedgers`, ...). A missing request is treated as empty. */
  rows: Record<string, Row[]>;
  companyGuid: string;
  /** ISO date the closing figures were read (`closing_as_of`). */
  asOf: string;
}

const HEAD_NAMES: Record<string, string> = { 'Central Tax': 'cgst', 'State Tax': 'sgst', 'Integrated Tax': 'igst', Cess: 'cess' };

function readMaster(table: string, objs: Row[], companyGuid: string, extra?: (o: Row, r: TableRow) => void, skip: ReadonlySet<string> = new Set()): TableRow[] {
  const out: TableRow[] = [];
  const skipAll = new Set([...skip, 'name']);
  for (const o of objs) {
    const r = defaults(table);
    Object.assign(r, readSimple(table, o, skipAll));
    r.company_guid = companyGuid;
    const name = typeof o['@NAME'] === 'string' ? (o['@NAME'] as string) : '';
    r.name = name;
    if ('name_lc' in r) r.name_lc = key(name);
    if ('guid' in r && !r.guid) r.guid = `n:${name}`; // GUID fallback (TALLY_WIRE section 7)
    extra?.(o, r);
    out.push(r);
  }
  return out;
}

/** Map every master request answer to its tables. Pure; the result is deterministic for the same input. */
export function mapMasters(input: MapInput): MasterTables {
  const { rows, companyGuid, asOf } = input;
  const T: MasterTables = {};
  for (const t of Object.keys(MASTER_TABLES)) T[t] = [];
  const objs = (id: string): Row[] => rows[id] ?? [];
  const child = (table: string, parentCol: string, parentGuid: unknown, o: Row): TableRow => {
    const r = defaults(table);
    Object.assign(r, readSimple(table, o));
    r.company_guid = companyGuid;
    r[parentCol] = parentGuid;
    return r;
  };

  // groups: reserved root and nature come from the parent chain, never from names
  const groups = readMaster('tm_group', objs('LBGroups'), companyGuid);
  const gIdx = new Index(groups);
  const rootOf = (g: TableRow): string => {
    const seen = new Set<TableRow>();
    let cur: TableRow | undefined = g;
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      if (cur.reserved_name) return String(cur.reserved_name);
      cur = gIdx.get(cur.parent_name);
    }
    return '';
  };
  for (const g of groups) {
    g.parent_guid = gIdx.guid(g.parent_name);
    g.reserved_root = rootOf(g);
    g.nature = g.is_revenue ? (g.is_deemed_positive ? 'expense' : 'income') : g.is_deemed_positive ? 'asset' : 'liability';
    g.closing_as_of = asOf;
  }
  T.tm_group = groups;

  // ledgers (+ addresses, GST registrations, opening bills, primary contact)
  T.tm_ledger = readMaster('tm_ledger', objs('LBLedgers'), companyGuid, (o, r) => {
    r.aliases = [];
    r.address = listText(o, 'ADDRESS.LIST');
    const g = gIdx.get(r.parent_name);
    r.group_guid = String(g?.guid ?? '');
    r.reserved_root = g ? rootOf(g) : '';
    r.closing_as_of = asOf;
    listRows(o, 'LEDMAILINGDETAILS.LIST').forEach((m, i) => {
      const a = child('tm_ledger_address', 'ledger_guid', r.guid, m);
      a.addr_index = i;
      a.lines = listText(m, 'ADDRESS.LIST');
      T.tm_ledger_address.push(a);
    });
    for (const m of listRows(o, 'LEDGSTREGDETAILS.LIST')) T.tm_ledger_gst.push(child('tm_ledger_gst', 'ledger_guid', r.guid, m));
    listRows(o, 'BILLALLOCATIONS.LIST').forEach((m, i) => {
      const b = child('tm_ledger_opening_bill', 'ledger_guid', r.guid, m);
      b.bill_index = i;
      T.tm_ledger_opening_bill.push(b);
    });
    if (r.contact_person || r.phone || r.mobile || r.email) {
      const c = defaults('tm_ledger_contact');
      Object.assign(c, { company_guid: companyGuid, ledger_guid: r.guid, contact_index: 0, name: r.contact_person, phone: r.phone, mobile: r.mobile, email: r.email, is_primary: true });
      T.tm_ledger_contact.push(c);
    }
  });

  // voucher types: base_kind by walking parents up to a reserved Tally name (ref_voucher_kind)
  const kindOf = new Map(VOUCHER_KIND_BY_TALLY_NAME.map(([n, k]) => [key(n), k]));
  const vts = readMaster('tm_voucher_type', objs('LBVoucherTypes'), companyGuid, (o, r) => {
    r.classes = jsonList(o, 'VOUCHERCLASSLIST.LIST');
    r.number_series = jsonList(o, 'VOUCHERNUMBERSERIES.LIST');
  });
  const vtIdx = new Index(vts);
  for (const v of vts) {
    const seen = new Set<string>();
    let name = String(v.name);
    let kind = 'unknown';
    while (name && !seen.has(key(name))) {
      seen.add(key(name));
      const k = kindOf.get(key(name));
      if (k) {
        kind = k;
        break;
      }
      name = String(vtIdx.get(name)?.parent_name ?? '');
    }
    v.base_kind = kind;
  }
  T.tm_voucher_type = vts;

  // stock side
  const sgs = readMaster('tm_stock_group', objs('LBStockGroups'), companyGuid);
  const sgIdx = new Index(sgs);
  for (const g of sgs) g.parent_guid = sgIdx.guid(g.parent_name);
  T.tm_stock_group = sgs;
  const cats = readMaster('tm_stock_category', objs('LBStockCategories'), companyGuid);
  const catIdx = new Index(cats);
  for (const c of cats) c.parent_guid = catIdx.guid(c.parent_name);
  T.tm_stock_category = cats;
  T.tm_unit = readMaster('tm_unit', objs('LBUnits'), companyGuid);
  const gds = readMaster('tm_godown', objs('LBGodowns'), companyGuid, (o, r) => {
    r.address = listText(o, 'ADDRESS.LIST');
  });
  const gdIdx = new Index(gds);
  for (const g of gds) g.parent_guid = gdIdx.guid(g.parent_name);
  T.tm_godown = gds;

  T.tm_stock_item = readMaster('tm_stock_item', objs('LBStockItems'), companyGuid, (o, r) => {
    const names = languageNames(o);
    r.aliases = names.slice(1);
    r.parent_guid = sgIdx.guid(r.parent_name);
    r.category_guid = catIdx.guid(r.category_name);
    r.closing_as_of = asOf;
    r.closing_rate = ratio2(String(r.closing_value), String(r.closing_qty));
    r.mrp = jsonList(o, 'MRPDETAILS.LIST');
    r.price_lists = jsonList(o, 'FULLPRICELIST.LIST');
    r.standard_cost = jsonList(o, 'STANDARDCOSTLIST.LIST');
    for (const gd of listRows(o, 'GSTDETAILS.LIST')) {
      const g = child('tm_stock_item_gst', 'stock_item_guid', r.guid, gd);
      g.hsn_code = textOf(gd['HSNCODE']);
      for (const sw of listRows(gd, 'STATEWISEDETAILS.LIST'))
        for (const rd of listRows(sw, 'RATEDETAILS.LIST')) {
          const head = HEAD_NAMES[textOf(rd['GSTRATEDUTYHEAD'])];
          const rate = canon(textOf(rd['GSTRATE']));
          if (head && rate) g[`${head}_rate`] = rate;
        }
      T.tm_stock_item_gst.push(g);
    }
    for (const ba of listRows(o, 'BATCHALLOCATIONS.LIST')) {
      const b = child('tm_stock_batch_opening', 'stock_item_guid', r.guid, ba);
      b.godown_guid = gdIdx.guid(b.godown_name);
      T.tm_stock_batch_opening.push(b);
    }
  });

  T.tm_cost_centre = readMaster('tm_cost_centre', objs('LBCostCentres'), companyGuid);
  T.tm_currency = readMaster('tm_currency', objs('LBCurrencies'), companyGuid);
  T.tm_employee = readMaster('tm_employee', objs('LBEmployees'), companyGuid);
  T.tm_gst_registration = readMaster('tm_gst_registration', objs('LBTaxUnits'), companyGuid);
  return T;
}
