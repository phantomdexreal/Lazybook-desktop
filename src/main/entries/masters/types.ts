/*
LazyBooks | src/main/entries/masters/types.ts
Responsibility: types of the master writers (ledger and stock item creation)
Introduced by: Phase 26 (master-writers)
STATUS: IMPLEMENTED (Phase 26)
*/
import type { BuildLookup } from '../builders/types';

export type MasterKind = 'ledger' | 'stock_item';
export const MASTER_KINDS: readonly MasterKind[] = ['ledger', 'stock_item'];

/** A master already in the company with the same name (or alias) as the one being created. */
export interface ExistingMaster {
  guid: string;
  name: string;
  /** What the existing row is: a ledger or group clash with a ledger name; a stock item or stock group clash with a stock item name. */
  what: 'ledger' | 'group' | 'stock_item' | 'stock_group';
  /** `remote_id` of the existing row when the vault stores it; equal to the entry's client_request_id when this very entry already created it. */
  remoteId?: string | null;
}

/**
 * What the master writers need beyond the voucher lookup: names of the referenced groups/units and the duplicate check.
 * Production fills it from the vault (Phase 27 wires it); tests fill it from the shared fixtures.
 */
export interface MasterLookup extends BuildLookup {
  groupName(guid: string): string | undefined;
  unitName(guid: string): string | undefined;
  stockGroupName(guid: string): string | undefined;
  /** Case-insensitive; also matches aliases. Ledgers share one namespace with groups, stock items with stock groups (Tally). */
  findLedgerName(name: string): ExistingMaster | undefined;
  findStockItemName(name: string): ExistingMaster | undefined;
}

export interface MasterResult {
  /** Import Data XML; empty string when `duplicateOf` is set (nothing to post). */
  xml: string;
  remoteId: string;
  kind: MasterKind;
  masterName: string;
  parentName: string | null;
  /** Set when the same entry (same client_request_id) already created this master: Phase 27 answers `ok:true` with this guid, no post. */
  duplicateOf: { guid: string } | null;
}
