/*
LazyBooks | src/main/entries/builders/types.ts
Responsibility: shared types of the voucher XML builders (lookup of names by guid, issues, build result)
Introduced by: Phase 25 (xml-builders)
STATUS: IMPLEMENTED (Phase 25)
*/

export type VoucherKind = 'invoice' | 'receipt' | 'payment' | 'contra' | 'journal' | 'inventory_voucher' | 'order' | 'quotation';
export const VOUCHER_KINDS: readonly VoucherKind[] = ['invoice', 'receipt', 'payment', 'contra', 'journal', 'inventory_voucher', 'order', 'quotation'];

/** Detail codes of `entry_rules.json` `result.details` that the builders and validator produce. */
export type EntryDetail =
  | 'PAYLOAD_INVALID'
  | 'TOTAL_MISMATCH'
  | 'TAX_MISMATCH'
  | 'UNBALANCED'
  | 'COMPANY_MISMATCH'
  | 'DATE_OUT_OF_PERIOD'
  | 'VOUCHER_TYPE_MISMATCH'
  | 'LEDGER_NOT_FOUND'
  | 'STOCK_ITEM_NOT_FOUND'
  | 'GODOWN_NOT_FOUND'
  | 'VOUCHER_TYPE_NOT_FOUND'
  | 'TARGET_NOT_FOUND'
  | 'MASTER_NOT_FOUND'
  | 'MASTER_EXISTS'
  | 'UNSUPPORTED_VERSION'
  | 'ALTER_CONFLICT'
  | 'EINVOICE_REJECTED'
  | 'FLAG_DISABLED';

export interface Issue {
  detail: EntryDetail;
  path: string;
  message: string;
}

/** Thrown by a builder when the payload cannot be turned into a balanced voucher. Carries the first issue. */
export class BuildError extends Error {
  readonly detail: EntryDetail;
  readonly path: string;
  constructor(detail: EntryDetail, path: string, message: string) {
    super(message);
    this.name = 'BuildError';
    this.detail = detail;
    this.path = path;
  }
}

export interface CompanyInfo {
  guid: string;
  name: string;
  state_name: string;
  starting_from: string;
  ending_at: string;
}
export interface LedgerInfo {
  guid: string;
  name: string;
  is_billwise_on: boolean;
  credit_period_days?: number;
  reserved_root?: string;
}
export interface StockItemInfo {
  guid: string;
  name: string;
  base_unit?: string;
}
export interface NamedInfo {
  guid: string;
  name: string;
}
export interface VoucherTypeInfo {
  guid: string;
  name: string;
  base_kind: string;
}

export type RefKind = 'ledger' | 'stock_item' | 'godown' | 'voucher_type' | 'voucher' | 'group' | 'unit' | 'stock_group';

/**
 * What the builders need to know about the company. Production fills it from the vault (Phase 27 wires it); tests fill it from the shared fixtures.
 * A `*_guid` of the form `n:<name>` is a name-only master (DATA_MODEL conventions): the lookups return a stand-in whose name is the text after `n:`
 * when the guid is not in the tables.
 */
export interface BuildLookup {
  company: CompanyInfo;
  ledger(guid: string): LedgerInfo | undefined;
  stockItem(guid: string): StockItemInfo | undefined;
  godown(guid: string): NamedInfo | undefined;
  voucherType(guid: string): VoucherTypeInfo | undefined;
  /** True when the guid exists for a reference kind that has no builder-side data (groups, units, vouchers). */
  exists(kind: RefKind, guid: string): boolean;
  /** Total GST rate (igst_rate) of the item valid on `date` (latest applicable_from <= date), or null when the item has none. */
  itemRate(stockItemGuid: string, date: string): string | null;
  /** `app_settings.quotation_voucher_type_guid`, or null. */
  quotationVoucherTypeGuid: string | null;
}

export type FlagMap = { entries?: boolean; orders?: boolean; einvoice_eway?: boolean };

export interface BuildOptions {
  /** `Create` (default) or `Alter` (Phase 30). */
  action?: 'Create' | 'Alter';
  /** `tx_voucher.master_id`, required for `Alter`: written as TAGNAME="MASTER ID" TAGVALUE (TALLY_WIRE section 8). */
  masterId?: string;
}

export interface BuildResult {
  xml: string;
  remoteId: string;
  voucherTypeName: string;
  voucherNumber: string | null;
  /** Sum of every ledger/inventory amount in the voucher; always "0.00" for a built voucher (checklist ENTRY-02). */
  balance: string;
  /** Invoice only: what Phase 29 must do after the post (Tally's own flow). */
  followUp: { einvoice: boolean; eway: { transporter_id?: string; vehicle_no?: string; distance_km?: number; mode?: string } | null };
}
