/*
LazyBooks | src/main/entries/builders/lookup.ts
Responsibility: BuildLookup over plain table rows (vault rows or the shared fixtures)
Introduced by: Phase 25 (xml-builders)
STATUS: IMPLEMENTED (Phase 25)
*/
import type { BuildLookup, LedgerInfo, NamedInfo, RefKind, StockItemInfo, VoucherTypeInfo } from './types';

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface LookupTables {
  tm_company: Row[];
  tm_ledger: Row[];
  tm_group?: Row[];
  tm_stock_item: Row[];
  tm_stock_item_gst: Row[];
  tm_unit?: Row[];
  tm_godown: Row[];
  tm_voucher_type: Row[];
  tm_stock_group?: Row[];
  tx_voucher?: Row[];
}

const byGuid = (rows: Row[] | undefined): Map<string, Row> => new Map((rows ?? []).map((r) => [String(r.guid), r]));

/** Production passes rows read from the vault (Phase 27 does that); a guid `n:<name>` that is not in the tables becomes a name-only stand-in. */
export function lookupFromTables(t: LookupTables, quotationVoucherTypeGuid: string | null = null): BuildLookup {
  const c = t.tm_company[0] as Row;
  const ledgers = byGuid(t.tm_ledger);
  const items = byGuid(t.tm_stock_item);
  const godowns = byGuid(t.tm_godown);
  const vtypes = byGuid(t.tm_voucher_type);
  const maps: Partial<Record<RefKind, Map<string, Row>>> = {
    group: byGuid(t.tm_group),
    unit: byGuid(t.tm_unit),
    stock_group: byGuid(t.tm_stock_group),
    voucher: byGuid(t.tx_voucher),
  };
  const named = (g: string): NamedInfo | undefined => (g.startsWith('n:') ? { guid: g, name: g.slice(2) } : undefined);
  return {
    company: { guid: String(c.guid), name: String(c.name), state_name: String(c.state_name ?? ''), starting_from: String(c.starting_from), ending_at: String(c.ending_at) },
    ledger(g): LedgerInfo | undefined {
      const r = ledgers.get(g);
      if (r) return { guid: g, name: String(r.name), is_billwise_on: !!r.is_billwise_on, credit_period_days: Number(r.credit_period_days ?? 0), reserved_root: r.reserved_root ?? undefined };
      const n = named(g);
      return n ? { guid: g, name: n.name, is_billwise_on: false } : undefined;
    },
    stockItem(g): StockItemInfo | undefined {
      const r = items.get(g);
      return r ? { guid: g, name: String(r.name), base_unit: r.base_unit } : named(g);
    },
    godown(g) {
      const r = godowns.get(g);
      return r ? { guid: g, name: String(r.name) } : named(g);
    },
    voucherType(g): VoucherTypeInfo | undefined {
      const r = vtypes.get(g);
      return r ? { guid: g, name: String(r.name), base_kind: String(r.base_kind) } : undefined;
    },
    exists(kind, g) {
      return !!maps[kind]?.has(g);
    },
    itemRate(g, date) {
      const rows = t.tm_stock_item_gst.filter((r) => r.stock_item_guid === g && String(r.applicable_from) <= date).sort((a, b) => String(a.applicable_from).localeCompare(String(b.applicable_from)));
      const last = rows[rows.length - 1];
      return last ? String(last.igst_rate) : null;
    },
    quotationVoucherTypeGuid,
  };
}
