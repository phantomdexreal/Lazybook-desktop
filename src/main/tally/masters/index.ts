/*
LazyBooks | src/main/tally/masters/index.ts
Responsibility: Masters pull: one collection request per master kind through the Tally client, mapped to the tm_* tables
Introduced by: Phase 10 (tally-masters)
STATUS: IMPLEMENTED (Phase 10)
Reads through the Phase 8 client only (serialised queue, 'sync' priority). No Electron import: testable from Node.
Storing the result is Phase 15/16 (vault); scheduling is Phase 18. This module only pulls and maps.
*/

import { logger } from '../../logger';
import { TallyError, type TallyClient } from '../client';
import type { Row } from '../xml';
import { MASTER_TABLES } from './columns';
import { mapMasters, type MasterTables } from './map';

export { mapMasters, canon, type MasterTables, type TableRow } from './map';
export { MASTER_TABLES } from './columns';

/**
 * Requests that are never sent to Tally. TallyPrime has no object type named Employee: employees are Cost Centre objects
 * (the proven LazyBooks predecessor models Employee as a CostCentre variant and never pulled it), so asking for TYPE Employee
 * makes Tally show a blocking "Internal Error ... Incorrect Object Type!" dialog and stall the XML server until someone clicks OK.
 * tm_employee therefore stays empty until a Cost-Centre based pull is built and verified against a live Tally.
 */
const NOT_SENT_REQUESTS = new Set(['LBEmployees']);

/**
 * Masters that exist only when the company uses the feature (TaxUnit needs a registered tax unit).
 * When TallyPrime refuses one of these cleanly, it is skipped with a warning and read as empty instead of aborting the whole pull.
 */
const OPTIONAL_REQUESTS = new Set(['LBTaxUnits']);

export interface MasterRequest {
  /** Request id and collection name (`LBLedgers`). */
  id: string;
  /** Tally object type (`Ledger`). */
  type: string;
  /** Object element name in the answer (`LEDGER`). */
  object: string;
  /** NATIVEMETHOD fields: every simple tag of the table and its follows_parent tables. */
  fields: string[];
  /** FETCH: nested lists and list-valued columns. */
  fetch: string[];
  /** Tables produced by this request (parent first). */
  tables: string[];
}

/** Request plan derived from data_model.json (generated columns.ts). Order = pull order. */
export function buildMasterRequests(): MasterRequest[] {
  const byId = new Map<string, MasterRequest>();
  for (const [table, spec] of Object.entries(MASTER_TABLES)) {
    if (!spec.request || !spec.type || !spec.object) continue;
    let req = byId.get(spec.request);
    if (!req) {
      req = { id: spec.request, type: spec.type, object: spec.object, fields: [], fetch: [], tables: [] };
      byId.set(spec.request, req);
    }
    req.tables.push(table);
    for (const c of spec.columns) {
      if (!c.tag || c.tag.startsWith('@')) continue;
      const first = c.tag.split('/')[0];
      const nested = c.tag.includes('/') || c.tag.endsWith('.LIST');
      const target = nested ? req.fetch : req.fields;
      const tag = nested ? first : c.tag;
      if (!target.includes(tag)) target.push(tag);
    }
  }
  // list-rows child tables (`rows: list:X`): their list is fetched; their own tags live inside the list
  for (const list of ['LEDMAILINGDETAILS.LIST', 'LEDGSTREGDETAILS.LIST', 'BILLALLOCATIONS.LIST']) {
    const r = byId.get('LBLedgers');
    if (r && !r.fetch.includes(list)) r.fetch.push(list);
  }
  for (const list of ['GSTDETAILS.LIST', 'BATCHALLOCATIONS.LIST', 'LANGUAGENAME.LIST']) {
    const r = byId.get('LBStockItems');
    if (r && !r.fetch.includes(list)) r.fetch.push(list);
  }
  return [...byId.values()];
}

export interface MastersDeps {
  client: TallyClient;
  /** Exact name of the selected company. */
  getCompanyName: () => string | null;
  /** GUID of the selected company (from the Phase 9 record); required to stamp `company_guid`. */
  getCompanyGuid: () => string | null;
  /** ISO date the closing figures are read as of; default today (local date). */
  getAsOf?: () => string;
  onPulled?: (r: MastersResult) => void;
}

export interface MastersResult {
  companyGuid: string;
  asOf: string;
  tables: MasterTables;
  /** row count per table */
  counts: Record<string, number>;
}

export interface Masters {
  /** Pull every master from Tally and map it. Throws TallyError or Error('No company selected'). */
  pull(): Promise<MastersResult>;
  last(): MastersResult | null;
}

const isoToday = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function createMasters(deps: MastersDeps): Masters {
  let lastResult: MastersResult | null = null;
  const requests = buildMasterRequests();
  return {
    async pull() {
      const company = deps.getCompanyName();
      if (!company) throw new Error('No company selected');
      const companyGuid = deps.getCompanyGuid();
      if (!companyGuid) throw new Error('Company record not read yet');
      const started = Date.now();
      const rows: Record<string, Row[]> = {};
      for (const req of requests) {
        // one request at a time; a failure aborts the pull so a half-read master set is never returned (optional masters excepted)
        if (NOT_SENT_REQUESTS.has(req.id)) {
          logger.info('tally', 'master not requested: no such Tally object type', { id: req.id, type: req.type });
          continue;
        }
        try {
          const all = await deps.client.collection(req.id, req.fields, { type: req.type, fetch: req.fetch, company });
          rows[req.id] = all.filter((r) => typeof r['@NAME'] === 'string');
        } catch (e) {
          const skippable = e instanceof TallyError && (e.detail === 'TALLY_REJECTED' || e.detail === 'TALLY_MALFORMED');
          if (!OPTIONAL_REQUESTS.has(req.id) || !skippable) throw e;
          logger.warn('tally', 'optional master skipped', { id: req.id, type: req.type });
        }
      }
      const asOf = deps.getAsOf?.() ?? isoToday();
      const tables = mapMasters({ rows, companyGuid, asOf });
      const counts: Record<string, number> = {};
      for (const [t, r] of Object.entries(tables)) counts[t] = r.length;
      lastResult = { companyGuid, asOf, tables, counts };
      logger.info('tally', 'masters pulled', { ms: Date.now() - started, counts });
      deps.onPulled?.(lastResult);
      return lastResult;
    },
    last: () => lastResult,
  };
}
