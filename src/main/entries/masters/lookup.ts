/*
LazyBooks | src/main/entries/masters/lookup.ts
Responsibility: MasterLookup over plain table rows (vault rows or the shared fixtures)
Introduced by: Phase 26 (master-writers)
STATUS: IMPLEMENTED (Phase 26)
*/
import { lookupFromTables, type LookupTables } from '../builders/lookup';
import type { ExistingMaster, MasterLookup } from './types';

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const norm = (s: string): string => s.trim().replace(/\s+/g, ' ').toLowerCase();

/** `aliases` is stored as a JSON array text, a real array, or a delimited string depending on the table writer; accept all. */
function aliasList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v !== 'string' || !v.trim()) return [];
  try {
    const j = JSON.parse(v);
    if (Array.isArray(j)) return j.map(String);
  } catch {
    /* not JSON */
  }
  return v.split(/[;\n]/).map((x) => x.trim()).filter(Boolean);
}

function finder(rows: Row[] | undefined, what: ExistingMaster['what']): Map<string, ExistingMaster> {
  const m = new Map<string, ExistingMaster>();
  for (const r of rows ?? []) {
    const hit: ExistingMaster = { guid: String(r.guid), name: String(r.name), what, remoteId: r.remote_id ?? null };
    m.set(norm(String(r.name)), hit);
    for (const a of aliasList(r.aliases)) if (!m.has(norm(a))) m.set(norm(a), hit);
  }
  return m;
}

export function masterLookupFromTables(t: LookupTables, quotationVoucherTypeGuid: string | null = null): MasterLookup {
  const base = lookupFromTables(t, quotationVoucherTypeGuid);
  const nameOf = (rows: Row[] | undefined): Map<string, string> => new Map((rows ?? []).map((r) => [String(r.guid), String(r.name)]));
  const groups = nameOf(t.tm_group);
  const units = nameOf(t.tm_unit);
  const sgroups = nameOf(t.tm_stock_group);
  const ledgers = finder(t.tm_ledger, 'ledger');
  const lgroups = finder(t.tm_group, 'group');
  const items = finder(t.tm_stock_item, 'stock_item');
  const igroups = finder(t.tm_stock_group, 'stock_group');
  return {
    ...base,
    groupName: (g) => groups.get(g),
    unitName: (g) => units.get(g),
    stockGroupName: (g) => sgroups.get(g),
    findLedgerName: (n) => ledgers.get(norm(n)) ?? lgroups.get(norm(n)),
    findStockItemName: (n) => items.get(norm(n)) ?? igroups.get(norm(n)),
  };
}
