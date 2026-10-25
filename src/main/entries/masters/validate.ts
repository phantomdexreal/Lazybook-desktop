/*
LazyBooks | src/main/entries/masters/validate.ts
Responsibility: re-validation of ledger and stock_item payloads (schema from entry_rules.json, references, flag, duplicate name)
Introduced by: Phase 26 (master-writers)
STATUS: IMPLEMENTED (Phase 26)
*/
import rulesJson from '../../../../docs/shared/entry_rules.json';
import { checkFields } from '../builders/validate';
import type { FlagMap, Issue } from '../builders/types';
import type { ExistingMaster, MasterKind, MasterLookup } from './types';

type Data = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RULES = rulesJson as any;

export interface MasterInput {
  kind: string;
  company_guid: string;
  data: unknown;
}

export interface MasterValidation {
  issues: Issue[];
  /** The clashing master when the only problem is a duplicate name (MASTER_EXISTS). */
  existing?: ExistingMaster;
}

const WHAT: Record<ExistingMaster['what'], string> = { ledger: 'ledger', group: 'group', stock_item: 'stock item', stock_group: 'stock group' };

export function duplicateOf(kind: MasterKind, name: string, lk: MasterLookup): ExistingMaster | undefined {
  return kind === 'ledger' ? lk.findLedgerName(name) : lk.findStockItemName(name);
}

/**
 * Schema (S-free: masters have no S01-S11), company match, references (MASTER_NOT_FOUND for group, unit and stock group;
 * GODOWN_NOT_FOUND for a godown; a guid `n:<name>` is a name-only master and always accepted), flag `entries`, then the duplicate-name check.
 * A duplicate is reported last, so a payload with a missing reference reports that first (as the shared examples expect).
 */
export function validateMasterEntry(input: MasterInput, lk: MasterLookup, flags?: FlagMap): MasterValidation {
  const kind = input.kind as MasterKind;
  const krule = RULES.kinds[kind];
  if ((kind !== 'ledger' && kind !== 'stock_item') || !krule || !input.data || typeof input.data !== 'object' || Array.isArray(input.data)) {
    return { issues: [{ detail: 'PAYLOAD_INVALID', path: '$.kind', message: 'unsupported kind' }] };
  }
  const d = input.data as Data;
  const errs: Issue[] = [];
  checkFields(krule.fields, d, '$.data', errs);
  if (errs.length) return { issues: errs };
  if (input.company_guid !== lk.company.guid) errs.push({ detail: 'COMPANY_MISMATCH', path: '$.company_guid', message: 'not the connected company' });
  const miss = (path: string, what: string): void => {
    errs.push({ detail: 'MASTER_NOT_FOUND', path, message: `unknown ${what}` });
  };
  if (kind === 'ledger') {
    if (!d.parent_group_guid.startsWith('n:') && !lk.groupName(d.parent_group_guid)) miss('$.data.parent_group_guid', 'group');
  } else {
    if (!d.unit_guid.startsWith('n:') && !lk.unitName(d.unit_guid)) miss('$.data.unit_guid', 'unit');
    const sg = d.parent_stock_group_guid;
    if (sg && !sg.startsWith('n:') && !lk.stockGroupName(sg)) miss('$.data.parent_stock_group_guid', 'stock group');
    const gd = d.opening?.godown_guid;
    if (gd && !gd.startsWith('n:') && !lk.godown(gd)) errs.push({ detail: 'GODOWN_NOT_FOUND', path: '$.data.opening.godown_guid', message: 'unknown godown' });
  }
  if (errs.length) return { issues: errs };
  if (flags && !flags.entries) errs.push({ detail: 'FLAG_DISABLED', path: '$.kind', message: 'feature flag entries is off' });
  if (errs.length) return { issues: errs };
  const hit = duplicateOf(kind, d.name, lk);
  if (hit) {
    const msg = `a ${WHAT[hit.what]} named "${hit.name}" already exists in this company${hit.name.toLowerCase() !== String(d.name).trim().toLowerCase() ? ` (matches by alias "${d.name}")` : ''}; choose another name`;
    return { issues: [{ detail: 'MASTER_EXISTS', path: '$.data.name', message: msg }], existing: hit };
  }
  return { issues: [] };
}
