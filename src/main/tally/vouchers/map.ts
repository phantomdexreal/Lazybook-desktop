/*
LazyBooks | src/main/tally/vouchers/map.ts
Responsibility: pure mapping of parsed Tally VOUCHER objects to the tx_* tables incl. derived columns and tx_tax_line (TALLY_WIRE sections 2 and 7)
Introduced by: Phase 11 (tally-vouchers)
STATUS: IMPLEMENTED (Phase 11)
No I/O, no Electron import. Name-independence: a voucher's kind comes from its voucher type's base_kind (resolved by the master
walk), never from a literal type name. Names are only lookup keys (case-insensitive exact, '' when not found).
*/

import type { Row } from '../xml';
import {
  defaultsOf, fromScaled, jsonList, listRows, listText, percentOf, readColumns, textOf, toScaled, canon,
  type MasterTables, type TableRow,
} from '../masters/map';
import { VOUCHER_TABLES } from './columns';

export type VoucherTables = Record<string, TableRow[]>;

const COLS = (t: string) => VOUCHER_TABLES[t].columns;
const key = (s: unknown): string => String(s ?? '').trim().toLowerCase();

const LEDGER_TAGS = ['ALLLEDGERENTRIES.LIST', 'LEDGERENTRIES.LIST'];
/** out first, then in (data_model: "in/out lists concatenated: out first then in"). */
const INVENTORY_TAGS = ['ALLINVENTORYENTRIES.LIST', 'INVENTORYENTRIES.LIST', 'INVENTORYENTRIESOUT.LIST', 'INVENTORYENTRIESIN.LIST'];
const HEAD_COL: Record<string, string> = { cgst: 'cgst_rate', sgst: 'sgst_rate', igst: 'igst_rate', cess: 'cess_rate' };
const INVOICE_KINDS = new Set(['sales', 'purchase', 'credit_note', 'debit_note', 'receipt', 'payment']);

function qtyUnit(text: string): string {
  const parts = text.trim().split(' ');
  return parts.length > 1 ? parts.slice(1).join(' ').split('=')[0].trim() : '';
}
function rateUnit(text: string): string {
  const i = text.indexOf('/');
  return i >= 0 ? text.slice(i + 1).trim() : '';
}

class ByName {
  private m = new Map<string, TableRow>();
  constructor(rows: TableRow[]) {
    for (const r of rows) if (!this.m.has(key(r.name))) this.m.set(key(r.name), r);
  }
  get(name: unknown): TableRow | undefined {
    return typeof name === 'string' && name.trim() !== '' ? this.m.get(key(name)) : undefined;
  }
  guid(name: unknown): string {
    return String(this.get(name)?.guid ?? '');
  }
}

export interface VoucherMapInput {
  /** Parsed VOUCHER objects (answer of LBVouchers). */
  rows: Row[];
  companyGuid: string;
  /** Company state name (intra-state test for GST heads). */
  companyState: string;
  /** Masters of the same company (Phase 10): used to resolve names and GST slabs. */
  masters: MasterTables;
}

export function emptyVoucherTables(): VoucherTables {
  const t: VoucherTables = {};
  for (const n of Object.keys(VOUCHER_TABLES)) t[n] = [];
  return t;
}

/** Map voucher objects to the six tx_* tables. Pure and deterministic. */
export function mapVouchers(input: VoucherMapInput): VoucherTables {
  const { rows, companyGuid, companyState, masters } = input;
  const T = emptyVoucherTables();
  const types = new ByName(masters.tm_voucher_type ?? []);
  const ledgers = new ByName(masters.tm_ledger ?? []);
  const items = new ByName(masters.tm_stock_item ?? []);
  const godowns = new ByName(masters.tm_godown ?? []);
  const slabs = new Map<string, TableRow[]>();
  for (const g of masters.tm_stock_item_gst ?? []) {
    const l = slabs.get(String(g.stock_item_guid)) ?? [];
    l.push(g);
    slabs.set(String(g.stock_item_guid), l);
  }
  for (const l of slabs.values()) l.sort((a, b) => String(a.applicable_from ?? '').localeCompare(String(b.applicable_from ?? '')));
  const readLedgerEntry = (e: Row): TableRow => readColumns(COLS('tx_ledger_line'), e);

  for (const o of rows) {
    const v = defaultsOf(COLS('tx_voucher'));
    Object.assign(v, readColumns(COLS('tx_voucher'), o));
    v.company_guid = companyGuid;
    v.address = listText(o, 'ADDRESS.LIST');
    v.eway = jsonList(o, 'EWAYBILLDETAILS.LIST');
    const vt = types.get(v.voucher_type_name);
    v.voucher_type_guid = String(vt?.guid ?? '');
    v.kind = String(vt?.base_kind ?? 'unknown') || 'unknown';
    v.party_guid = ledgers.guid(v.party_name);
    v.counts_in_books = !(v.is_cancelled || v.is_optional || v.is_void);
    const vd = { voucher_date: v.date, voucher_kind: v.kind, counts_in_books: v.counts_in_books };
    const vg = v.guid;

    // accounting lines: ledger entries first, then accounting allocations of inventory entries
    let idx = 0;
    const lines: TableRow[] = [];
    for (const tag of LEDGER_TAGS)
      for (const le of listRows(o, tag)) {
        const l = defaultsOf(COLS('tx_ledger_line'));
        Object.assign(l, readLedgerEntry(le));
        Object.assign(l, { company_guid: companyGuid, voucher_guid: vg, line_index: idx, source: 'ledger', inv_line_index: -1, ledger_guid: ledgers.guid(l.ledger_name), ...vd });
        lines.push(l);
        listRows(le, 'BILLALLOCATIONS.LIST').forEach((be, j) => {
          const b = defaultsOf(COLS('tx_bill_alloc'));
          Object.assign(b, readColumns(COLS('tx_bill_alloc'), be));
          Object.assign(b, { company_guid: companyGuid, voucher_guid: vg, line_index: idx, alloc_index: j, ledger_guid: l.ledger_guid, ledger_name: l.ledger_name, ...vd });
          T.tx_bill_alloc.push(b);
        });
        idx++;
      }

    // inventory lines
    const invs: TableRow[] = [];
    const destLines = new Set<number>();
    let i = 0;
    for (const tag of INVENTORY_TAGS)
      for (const ie of listRows(o, tag)) {
        const il = defaultsOf(COLS('tx_inventory_line'));
        Object.assign(il, readColumns(COLS('tx_inventory_line'), ie));
        const billed = textOf(ie['BILLEDQTY']);
        il.unit = qtyUnit(billed);
        il.rate_unit = rateUnit(textOf(ie['RATE']));
        const desc = listText(ie, 'BASICUSERDESCRIPTION.LIST');
        il.description = desc ? desc.join('\n') : '';
        il.stock_item_guid = items.guid(il.stock_item_name);
        const bes = listRows(ie, 'BATCHALLOCATIONS.LIST');
        il.godown_name = bes.length > 0 ? textOf(bes[0]['GODOWNNAME']) : '';
        il.godown_guid = godowns.guid(il.godown_name);
        Object.assign(il, { company_guid: companyGuid, voucher_guid: vg, line_index: i, ...vd });
        invs.push(il);
        const dest = tag === 'INVENTORYENTRIESIN.LIST';
        if (dest) destLines.add(i);
        bes.forEach((be, j) => {
          const b = defaultsOf(COLS('tx_batch_alloc'));
          Object.assign(b, readColumns(COLS('tx_batch_alloc'), be));
          Object.assign(b, { company_guid: companyGuid, voucher_guid: vg, line_index: i, alloc_index: j, stock_item_guid: il.stock_item_guid, godown_guid: godowns.guid(b.godown_name), is_destination: dest, ...vd });
          T.tx_batch_alloc.push(b);
        });
        for (const ae of listRows(ie, 'ACCOUNTINGALLOCATIONS.LIST')) {
          const l = defaultsOf(COLS('tx_ledger_line'));
          Object.assign(l, readLedgerEntry(ae));
          Object.assign(l, { company_guid: companyGuid, voucher_guid: vg, line_index: idx, source: 'inv_alloc', inv_line_index: i, ledger_guid: ledgers.guid(l.ledger_name), ...vd });
          lines.push(l);
          idx++;
        }
        i++;
      }

    // headline amount (CALC_SPECS section 3), exact decimal arithmetic
    const amt = (r: TableRow): bigint => toScaled(String(r.amount)) ?? 0n;
    const abs = (n: bigint): bigint => (n < 0n ? -n : n);
    let amount: bigint;
    const party = lines.find((l) => l.is_party_ledger);
    if (v.is_cancelled) amount = 0n;
    else if (INVOICE_KINDS.has(String(v.kind)) && v.party_name && party) amount = abs(amt(party));
    else if (lines.length > 0) amount = lines.reduce((s, l) => (amt(l) < 0n ? s - amt(l) : s), 0n);
    else amount = invs.reduce((s, x, n) => (destLines.has(n) ? s : s + abs(amt(x))), 0n);
    v.amount = fromScaled(amount);

    // GST lines per inventory line (TALLY_WIRE section 7): slab in force on the voucher date
    if (v.is_invoice && !v.is_cancelled) {
      const intra = key(v.place_of_supply) === key(companyState);
      for (const il of invs) {
        const ss = (slabs.get(String(il.stock_item_guid)) ?? []).filter((g) => String(g.applicable_from ?? '') <= String(v.date));
        const g = ss[ss.length - 1];
        if (!g) continue;
        const heads = intra ? ['cgst', 'sgst', 'cess'] : ['igst', 'cess'];
        const taxable = abs(amt(il));
        for (const head of heads) {
          const rate = String(g[HEAD_COL[head]] ?? '0.00');
          const r = toScaled(rate) ?? 0n;
          if (r === 0n) continue;
          const t = defaultsOf(COLS('tx_tax_line'));
          Object.assign(t, {
            company_guid: companyGuid, voucher_guid: vg, source: 'inventory', line_index: il.line_index, tax_head: head, rate: canon(rate) ?? rate,
            taxable_amount: fromScaled(taxable), tax_amount: fromScaled(percentOf(taxable, r)), hsn_code: il.hsn_code, ...vd,
          });
          T.tx_tax_line.push(t);
        }
      }
    }
    T.tx_voucher.push(v);
    T.tx_ledger_line.push(...lines);
    T.tx_inventory_line.push(...invs);
  }
  return T;
}
