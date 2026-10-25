/*
LazyBooks | src/main/entries/builders/validate.ts
Responsibility: re-validation of voucher payloads before building (schema of entry_rules.json + semantic checks S01-S11)
Introduced by: Phase 25 (xml-builders)
STATUS: IMPLEMENTED (Phase 25)
*/

/**
 * Port of `docs/shared/fixtures/tools/validate_entries.py` for the eight voucher kinds (invoice, receipt, payment, contra, journal, inventory_voucher,
 * order, quotation). A payload the reference validator accepts must pass here, and the other way round (tests/entry-builders.cjs runs both lists of
 * `entry_examples/index.json`). Masters (Phase 26) and alter/cancel/delete (Phase 30) reuse `checkFields` and `validateVoucherData`.
 *
 * Money is exact (BigInt decimals) and compared exactly like the reference (tolerance 0; `entries.gst_tolerance` 0.01 only matters for numbers
 * computed elsewhere). Nothing here logs or touches Tally.
 */
import rulesJson from '../../../../docs/shared/entry_rules.json';
import { abs, add, canon, cmp, dec, div100, eq, half, isMoney, isZero, mul, round, sub, sum, ZERO, type Dec } from './decimal';
import type { BuildLookup, EntryDetail, FlagMap, Issue, RefKind, VoucherKind } from './types';

interface Spec {
  t: string;
  req?: boolean;
  ref?: RefKind;
  max?: number | null;
  min?: number;
  values?: string[];
  fields?: Record<string, Spec>;
  item?: Spec;
}
interface KindRule {
  allowed_base_kinds?: string[];
  fields: Record<string, Spec>;
  flags?: { _kind?: string };
}
const RULES = rulesJson as unknown as { kinds: Record<string, KindRule> };
const REF_DETAIL: Record<RefKind, EntryDetail> = {
  ledger: 'LEDGER_NOT_FOUND',
  stock_item: 'STOCK_ITEM_NOT_FOUND',
  godown: 'GODOWN_NOT_FOUND',
  voucher_type: 'VOUCHER_TYPE_NOT_FOUND',
  voucher: 'TARGET_NOT_FOUND',
  group: 'MASTER_NOT_FOUND',
  unit: 'MASTER_NOT_FOUND',
  stock_group: 'MASTER_NOT_FOUND',
};

type Data = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function validDate(v: unknown): v is string {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

function chk(spec: Spec, val: unknown, path: string, errs: Issue[]): void {
  const bad = (m: string) => errs.push({ detail: 'PAYLOAD_INVALID', path, message: m });
  if (val === null || val === undefined) {
    bad('null not allowed');
    return;
  }
  switch (spec.t) {
    case 'str':
      if (typeof val !== 'string' || val.length > (spec.max ?? 1e6) || val.length < (spec.min ?? 0)) bad('bad string');
      break;
    case 'uuid':
      if (typeof val !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)) bad('not a uuid');
      break;
    case 'guid':
      if (typeof val !== 'string' || !val) bad('guid must be a non-empty string');
      break;
    case 'date':
      if (!validDate(val)) bad('date must be YYYY-MM-DD');
      break;
    case 'datetime':
      if (typeof val !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(val)) bad('datetime must be ISO-8601 UTC with Z');
      break;
    case 'money':
    case 'money_pos':
    case 'pct':
      if (!isMoney(val)) bad('decimal must be a string like 1180.00');
      else {
        const d = dec(val);
        if (spec.t === 'money_pos' && d.n <= 0n) bad('must be > 0');
        if (spec.t === 'pct' && (d.n < 0n || cmp(d, dec('100')) > 0)) bad('must be 0..100');
      }
      break;
    case 'int':
      if (typeof val !== 'number' || !Number.isInteger(val) || val < (spec.min ?? -1e12) || (spec.max != null && val > spec.max)) bad('bad integer');
      break;
    case 'bool':
      if (typeof val !== 'boolean') bad('bool expected');
      break;
    case 'enum':
      if (!(spec.values ?? []).includes(val as string)) bad('one of ' + (spec.values ?? []).join(','));
      break;
    case 'array':
      if (!Array.isArray(val) || val.length < (spec.min ?? 0) || (spec.max != null && val.length > spec.max)) bad('bad array length');
      else if (spec.item) val.forEach((it, i) => chk(spec.item as Spec, it, `${path}[${i}]`, errs));
      break;
    case 'object':
      if (typeof val !== 'object' || Array.isArray(val)) bad('object expected');
      else if (spec.fields) checkFields(spec.fields, val as Data, path, errs);
      break;
    default:
      break;
  }
}

/** Unknown keys, required keys and per-field types (shared by the master and alter builders later). */
export function checkFields(fields: Record<string, Spec>, data: Data, path: string, errs: Issue[]): void {
  for (const k of Object.keys(data)) if (!(k in fields)) errs.push({ detail: 'PAYLOAD_INVALID', path: `${path}.${k}`, message: 'unknown field' });
  for (const [k, spec] of Object.entries(fields)) {
    if (!(k in data)) {
      if (spec.req) errs.push({ detail: 'PAYLOAD_INVALID', path: `${path}.${k}`, message: 'required' });
      continue;
    }
    chk(spec, data[k], `${path}.${k}`, errs);
  }
}

function collectRefs(fields: Record<string, Spec>, data: Data, path: string, out: [RefKind, string, string][]): void {
  for (const [k, spec] of Object.entries(fields)) {
    const v = data[k];
    if (v === undefined || v === null) continue;
    if (spec.t === 'guid' && spec.ref) out.push([spec.ref, v as string, `${path}.${k}`]);
    else if (spec.t === 'object' && spec.fields && typeof v === 'object') collectRefs(spec.fields, v as Data, `${path}.${k}`, out);
    else if (spec.t === 'array' && Array.isArray(v) && spec.item) {
      v.forEach((it, i) => {
        if (spec.item?.t === 'object' && spec.item.fields && it && typeof it === 'object') collectRefs(spec.item.fields, it as Data, `${path}.${k}[${i}]`, out);
        else if (spec.item?.t === 'guid' && spec.item.ref) out.push([spec.item.ref, it as string, `${path}.${k}[${i}]`]);
      });
    }
  }
}

function refExists(lk: BuildLookup, kind: RefKind, guid: string): boolean {
  if (guid.startsWith('n:')) return true; // name-only master: the name is used as is, Tally is the judge
  switch (kind) {
    case 'ledger':
      return !!lk.ledger(guid);
    case 'stock_item':
      return !!lk.stockItem(guid);
    case 'godown':
      return !!lk.godown(guid);
    case 'voucher_type':
      return !!lk.voucherType(guid);
    default:
      return lk.exists(kind, guid);
  }
}

/** CALC_SPECS section 10 / entry_rules S05: head -> [amount, rate -> taxable]. */
export function computeTax(
  lines: { taxable: Dec; gst: Dec; cess: Dec }[],
  charges: { taxable: Dec; gst: Dec }[],
  intra: boolean,
): Record<string, { amount: Dec; breakup: Map<string, Dec> }> {
  const acc = new Map<string, Dec>();
  const brk = new Map<string, Map<string, Dec>>();
  const addHead = (head: string, taxable: Dec, rate: Dec) => {
    if (isZero(rate)) return;
    acc.set(head, add(acc.get(head) ?? ZERO, round(div100(mul(taxable, rate)), 4)));
    const m = brk.get(head) ?? new Map<string, Dec>();
    brk.set(head, m);
    const key = canon(rate);
    m.set(key, add(m.get(key) ?? ZERO, taxable));
  };
  for (const l of [...lines, ...charges.map((c) => ({ taxable: c.taxable, gst: c.gst, cess: ZERO }))]) {
    if (intra) {
      addHead('cgst', l.taxable, half(l.gst));
      addHead('sgst', l.taxable, half(l.gst));
    } else addHead('igst', l.taxable, l.gst);
    addHead('cess', l.taxable, l.cess);
  }
  const out: Record<string, { amount: Dec; breakup: Map<string, Dec> }> = {};
  for (const [h, v] of acc) out[h] = { amount: round(v, 2), breakup: brk.get(h) ?? new Map() };
  return out;
}

/** round2(qty * rate * (1 - discount_pct/100)) (S04). */
export function lineAmount(qty: string, rate: string, discountPct?: string): Dec {
  const factor = sub(dec('100'), dec(discountPct ?? '0'));
  return round(div100(mul(mul(dec(qty), dec(rate)), factor)), 2);
}

export interface ValidateInput {
  kind: string;
  company_guid: string;
  data: unknown;
}

/** Full check of one voucher entry. Returns every issue found (empty = valid). Schema failures stop further checks, like the reference. */
export function validateVoucherEntry(input: ValidateInput, lk: BuildLookup, flags?: FlagMap): Issue[] {
  const errs: Issue[] = [];
  const kind = input.kind as VoucherKind;
  const krule = RULES.kinds[kind];
  if (!krule || !input.data || typeof input.data !== 'object') return [{ detail: 'PAYLOAD_INVALID', path: '$.kind', message: 'unsupported kind' }];
  const data = input.data as Data;
  checkFields(krule.fields, data, '$.data', errs);
  if (errs.length) return errs;
  if (input.company_guid !== lk.company.guid) errs.push({ detail: 'COMPANY_MISMATCH', path: '$.company_guid', message: 'not the connected company' });
  const refs: [RefKind, string, string][] = [];
  collectRefs(krule.fields, data, '$.data', refs);
  for (const [rk, g, p] of refs) if (!refExists(lk, rk, g)) errs.push({ detail: REF_DETAIL[rk], path: p, message: `unknown ${rk}` });
  if (errs.length) return errs;
  const flagKind = krule.flags?._kind;
  if (flagKind && flags && !(flags as Record<string, boolean | undefined>)[flagKind]) errs.push({ detail: 'FLAG_DISABLED', path: '$.kind', message: `feature flag ${flagKind} is off` });
  for (const k of ['einvoice', 'eway'] as const) {
    if (data[k]?.generate && flags && !flags.einvoice_eway) errs.push({ detail: 'FLAG_DISABLED', path: `$.data.${k}`, message: 'einvoice_eway is off' });
  }
  vCommon(kind, krule, data, lk, errs);
  if (errs.length) return errs;
  const fn = { invoice: vInvoice, receipt: vRecPay, payment: vRecPay, contra: vContra, journal: vJournal, inventory_voucher: vInvV, order: vOrder, quotation: vOrder }[kind];
  fn(data, lk, errs);
  return errs;
}

function vtOf(lk: BuildLookup, guid: string) {
  const vt = lk.voucherType(guid);
  // a name-only voucher type has no base kind in the tables; the payload's base_kind is trusted then
  return vt;
}

function vCommon(kind: VoucherKind, krule: KindRule, d: Data, lk: BuildLookup, errs: Issue[]): void {
  const c = lk.company;
  if (!(c.starting_from <= d.date && d.date <= c.ending_at)) errs.push({ detail: 'DATE_OUT_OF_PERIOD', path: '$.data.date', message: 'outside the financial year' });
  const vt = vtOf(lk, d.voucher_type_guid);
  const vtBase = vt?.base_kind ?? d.base_kind;
  if (d.base_kind !== vtBase || !(krule.allowed_base_kinds ?? []).includes(d.base_kind))
    errs.push({ detail: 'VOUCHER_TYPE_MISMATCH', path: '$.data.base_kind', message: `base_kind ${d.base_kind} vs type ${vtBase}` });
  if (kind === 'quotation' && d.voucher_type_guid !== lk.quotationVoucherTypeGuid)
    errs.push({ detail: 'VOUCHER_TYPE_MISMATCH', path: '$.data.voucher_type_guid', message: 'quotation must use the configured quotation voucher type' });
  if (kind === 'order' && lk.quotationVoucherTypeGuid && d.voucher_type_guid === lk.quotationVoucherTypeGuid)
    errs.push({ detail: 'VOUCHER_TYPE_MISMATCH', path: '$.data.voucher_type_guid', message: 'quotation type used for an order' });
}

function billsCheck(party: { is_billwise_on: boolean } | undefined, bills: Data[] | undefined, amount: string, errs: Issue[], path = '$.data.bills'): void {
  if (bills === undefined) return;
  if (!party) return; // name-only ledger: Tally decides
  if (!party.is_billwise_on) {
    errs.push({ detail: 'PAYLOAD_INVALID', path, message: 'party ledger is not bill-wise; omit bills' });
    return;
  }
  if (!eq(sum(bills.map((b) => dec(b.amount))), dec(amount))) errs.push({ detail: 'UNBALANCED', path, message: `bill amounts must add up to ${amount}` });
  bills.forEach((b, i) => {
    if (['new_ref', 'agst_ref', 'advance'].includes(b.type) && !b.name) errs.push({ detail: 'PAYLOAD_INVALID', path: `${path}[${i}].name`, message: `name required for ${b.type}` });
  });
}

function vInvoice(d: Data, lk: BuildLookup, errs: Issue[]): void {
  const c = lk.company;
  const place = d.place_of_supply || c.state_name;
  const intra = place === c.state_name;
  const mode: string = d.tax.mode;
  if (mode !== 'none' && mode !== (intra ? 'intra' : 'inter')) {
    errs.push({ detail: 'TAX_MISMATCH', path: '$.data.tax.mode', message: `expected ${intra ? 'intra' : 'inter'} for place of supply ${place}` });
    return;
  }
  let lsum = ZERO;
  const clines: { taxable: Dec; gst: Dec; cess: Dec }[] = [];
  (d.lines as Data[]).forEach((ln, i) => {
    const exp = lineAmount(ln.qty, ln.rate, ln.discount_pct);
    if (!eq(dec(ln.amount), exp)) errs.push({ detail: 'TOTAL_MISMATCH', path: `$.data.lines[${i}].amount`, message: `expected ${canon(exp)}` });
    const master = lk.itemRate(ln.stock_item_guid, d.date);
    if (master !== null && !eq(dec(ln.gst_rate), dec(master))) errs.push({ detail: 'TAX_MISMATCH', path: `$.data.lines[${i}].gst_rate`, message: `item master rate is ${canon(dec(master))}` });
    lsum = add(lsum, dec(ln.amount));
    clines.push({ taxable: dec(ln.amount), gst: dec(ln.gst_rate), cess: dec(ln.cess_rate ?? '0') });
  });
  const chg = ((d.charges ?? []) as Data[]).map((x) => ({ taxable: dec(x.amount), gst: dec(x.gst_rate ?? '0') }));
  const csum = sum(chg.map((x) => x.taxable));
  const expTax = mode !== 'none' ? computeTax(clines, chg, intra) : {};
  const got = new Map<string, Dec>();
  for (const t of (d.tax.lines ?? []) as Data[]) got.set(t.head, dec(t.amount));
  const expHeads = Object.keys(expTax);
  if (got.size !== expHeads.length || expHeads.some((h) => !got.has(h)) || [...got].some(([h, v]) => !(expTax[h] && eq(v, (expTax[h] as { amount: Dec }).amount))))
    errs.push({ detail: 'TAX_MISMATCH', path: '$.data.tax.lines', message: 'tax lines differ from the recomputed amounts' });
  for (const t of (d.tax.lines ?? []) as Data[]) {
    const e = expTax[t.head];
    if (t.breakup && e) {
      const gb = new Map<string, Dec>((t.breakup as Data[]).map((b) => [canon(dec(b.rate)), dec(b.taxable)]));
      const same = gb.size === e.breakup.size && [...e.breakup].every(([r, v]) => gb.has(r) && eq(gb.get(r) as Dec, v));
      if (!same) errs.push({ detail: 'TAX_MISMATCH', path: '$.data.tax.lines.breakup', message: 'breakup differs' });
    }
  }
  const ro = d.round_off ? dec(d.round_off.amount) : ZERO;
  if (cmp(abs(ro), dec('1')) >= 0) errs.push({ detail: 'TOTAL_MISMATCH', path: '$.data.round_off.amount', message: 'must be below 1' });
  const raw = add(add(lsum, csum), sum([...got.values()]));
  if (!eq(dec(d.total), add(raw, ro))) errs.push({ detail: 'TOTAL_MISMATCH', path: '$.data.total', message: `expected ${canon(add(raw, ro))}` });
  if (errs.length) return;
  billsCheck(lk.ledger(d.party_ledger_guid), d.bills, d.total, errs);
}

function vRecPay(d: Data, lk: BuildLookup, errs: Issue[]): void {
  if (d.party_ledger_guid === d.cash_bank_ledger_guid) errs.push({ detail: 'UNBALANCED', path: '$.data', message: 'party and cash/bank ledger are the same' });
  billsCheck(lk.ledger(d.party_ledger_guid), d.bills, d.amount, errs);
}

function vContra(d: Data, _lk: BuildLookup, errs: Issue[]): void {
  if (d.from_ledger_guid === d.to_ledger_guid) errs.push({ detail: 'UNBALANCED', path: '$.data', message: 'from and to ledger are the same' });
}

function vJournal(d: Data, lk: BuildLookup, errs: Issue[]): void {
  const lines = d.lines as Data[];
  const dr = sum(lines.filter((l) => l.side === 'dr').map((l) => dec(l.amount)));
  const cr = sum(lines.filter((l) => l.side === 'cr').map((l) => dec(l.amount)));
  if (!eq(dr, cr)) errs.push({ detail: 'UNBALANCED', path: '$.data.lines', message: `debit ${canon(dr)} credit ${canon(cr)}` });
  lines.forEach((l, i) => {
    if (l.bills !== undefined) billsCheck(lk.ledger(l.ledger_guid), l.bills, l.amount, errs, `$.data.lines[${i}].bills`);
  });
}

function vInvV(d: Data, _lk: BuildLookup, errs: Issue[]): void {
  const has = (k: string) => Array.isArray(d[k]) && d[k].length > 0;
  if (d.base_kind === 'stock_journal') {
    if (has('lines') || d.party_ledger_guid || !has('source_lines') || !has('destination_lines')) errs.push({ detail: 'PAYLOAD_INVALID', path: '$.data', message: 'stock_journal needs source_lines and destination_lines only' });
  } else if (!has('lines') || !d.party_ledger_guid || has('source_lines') || has('destination_lines')) {
    errs.push({ detail: 'PAYLOAD_INVALID', path: '$.data', message: 'notes need lines and party_ledger_guid only' });
  }
}

function vOrder(d: Data, _lk: BuildLookup, errs: Issue[]): void {
  (d.lines as Data[]).forEach((ln, i) => {
    const exp = lineAmount(ln.qty, ln.rate, ln.discount_pct);
    if (!eq(dec(ln.amount), exp)) errs.push({ detail: 'TOTAL_MISMATCH', path: `$.data.lines[${i}].amount`, message: `expected ${canon(exp)}` });
    if (ln.due_date < d.date) errs.push({ detail: 'PAYLOAD_INVALID', path: `$.data.lines[${i}].due_date`, message: 'due date before order date' });
  });
}
