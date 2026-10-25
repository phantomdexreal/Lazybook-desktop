/*
LazyBooks | src/main/entries/masters/build.ts
Responsibility: build the "Import Data" XML that creates a ledger or a stock item (TALLY_WIRE section 8, Masters)
Introduced by: Phase 26 (master-writers)
STATUS: IMPLEMENTED (Phase 26)
*/

/**
 * `buildMasterImport(envelope, lookup, flags?)` re-validates (validate.ts), resolves group/unit/stock group/godown guids to Tally names and
 * renders one `<LEDGER>` or `<STOCKITEM>` with ACTION="Create". Pure: no I/O. Idempotent by name + request: a name that already exists throws
 * MASTER_EXISTS (final, not retryable, LB_ENTRY_DUPLICATE), except when the existing master carries this entry's own client_request_id as its
 * remote id: that is a retry after a crash and returns `duplicateOf` with the existing guid and an empty `xml` (nothing to post).
 * Never logs. Assumed on a real Tally (PEER-02): REMOTEID on masters, the GSTDETAILS.LIST / HSNDETAILS.LIST layout, registration type and
 * taxability spellings, ledger address as ADDRESS.LIST, no opening bill allocation for a bill-wise ledger.
 */
import { render, type X } from '../builders/voucher';
import { BuildError, type FlagMap } from '../builders/types';
import { el, ledgerElement } from './ledger';
import { stockItemElement } from './stock-item';
import type { MasterKind, MasterLookup, MasterResult } from './types';
import { validateMasterEntry } from './validate';

type Data = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface MasterEnvelope {
  v?: number;
  kind: string;
  client_request_id: string;
  company_guid: string;
  data: unknown;
}

export function buildMasterImport(env: MasterEnvelope, lk: MasterLookup, flags?: FlagMap): MasterResult {
  if (env.v !== undefined && env.v !== 1) throw new BuildError('UNSUPPORTED_VERSION', '$.v', 'only version 1 is supported');
  const res = validateMasterEntry({ kind: env.kind, company_guid: env.company_guid, data: env.data }, lk, flags);
  const kind = env.kind as MasterKind;
  const d = env.data as Data;
  const first = res.issues[0];
  if (first) {
    if (first.detail === 'MASTER_EXISTS' && res.existing && res.existing.remoteId && res.existing.remoteId === env.client_request_id) {
      return { xml: '', remoteId: env.client_request_id, kind, masterName: String(d.name).trim(), parentName: null, duplicateOf: { guid: res.existing.guid } };
    }
    throw new BuildError(first.detail, first.path, first.message);
  }
  const node: X = kind === 'ledger' ? ledgerElement(d, env.client_request_id, lk) : stockItemElement(d, env.client_request_id, lk);
  const parentName = ((node.c as (X | null)[]).find((k) => k?.n === 'PARENT')?.c as string | undefined) ?? null;
  const xml = render(
    el('ENVELOPE', [
      el('HEADER', [el('TALLYREQUEST', 'Import Data')]),
      el('BODY', [
        el('IMPORTDATA', [
          el('REQUESTDESC', [el('REPORTNAME', 'All Masters'), el('STATICVARIABLES', [el('SVCURRENTCOMPANY', lk.company.name)])]),
          el('REQUESTDATA', [el('TALLYMESSAGE', [node], { 'xmlns:UDF': 'TallyUDF' })]),
        ]),
      ]),
    ]),
  );
  return { xml, remoteId: env.client_request_id, kind, masterName: String(d.name).trim(), parentName, duplicateOf: null };
}
