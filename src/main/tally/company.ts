/*
LazyBooks | src/main/tally/company.ts
Responsibility: Tally license + company info: the tm_company record (GUID, FY dates, GSTIN, currency, books-from, alter ids) and the Tally serial
Introduced by: Phase 9 (tally-license-info)
STATUS: IMPLEMENTED (Phase 9)
Reads through the Phase 8 client only. No Electron import: testable from Node.
*/

import { mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { logger } from '../logger';
import { TallyError, type TallyClient } from './client';
import type { Row } from './xml';

export const REQ_COMPANY = 'LBCompany';
export const FN_SERIAL = '$$LicenseInfo:SerialNumber';

/** Column of `tm_company` (docs/shared/data_model.json). Order is the table order. */
export interface CompanyRecord {
  guid: string;
  name: string;
  basic_formal_name: string;
  starting_from: string | null;
  books_from: string | null;
  ending_at: string | null;
  last_voucher_date: string | null;
  alter_id_master: number;
  alter_id_voucher: number;
  state_name: string;
  country: string;
  pincode: string;
  address: string[] | null;
  email: string;
  phone: string;
  mobile: string;
  website: string;
  gstin: string;
  gst_registration_type: string;
  gst_applicable_date: string | null;
  pan: string;
  tan: string;
  cin: string;
  base_currency_symbol: string;
  decimal_places: number;
  tally_serial: string;
  /** derived: max(alter_id_master, alter_id_voucher) */
  alter_id: number;
}

type Hint = 'text' | 'int' | 'tally_date';
/** [column, tally tag (`@NAME` = attribute), hint, default]; mirrors data_model.json `tm_company`. */
const COLUMNS: Array<[keyof CompanyRecord, string, Hint, string | number | null]> = [
  ['guid', 'GUID', 'text', ''],
  ['name', '@NAME', 'text', ''],
  ['basic_formal_name', 'BASICCOMPANYFORMALNAME', 'text', ''],
  ['starting_from', 'STARTINGFROM', 'tally_date', null],
  ['books_from', 'BOOKSFROM', 'tally_date', null],
  ['ending_at', 'ENDINGAT', 'tally_date', null],
  ['last_voucher_date', 'LASTVOUCHERDATE', 'tally_date', null],
  ['alter_id_master', 'ALTMSTID', 'int', 0],
  ['alter_id_voucher', 'ALTVCHID', 'int', 0],
  ['state_name', 'STATENAME', 'text', ''],
  ['country', 'COUNTRYNAME', 'text', ''],
  ['pincode', 'PINCODE', 'text', ''],
  ['email', 'EMAIL', 'text', ''],
  ['phone', 'PHONENUMBER', 'text', ''],
  ['mobile', 'MOBILENO', 'text', ''],
  ['website', 'WEBSITE', 'text', ''],
  ['gstin', 'CMPGSTIN', 'text', ''],
  ['gst_registration_type', 'GSTREGISTRATIONTYPE', 'text', ''],
  ['gst_applicable_date', 'GSTAPPLICABLEDATE', 'tally_date', null],
  ['pan', 'INCOMETAXNUMBER', 'text', ''],
  ['tan', 'TANUMBER', 'text', ''],
  ['cin', 'CORPORATEIDENTITYNO', 'text', ''],
  ['base_currency_symbol', 'BASECURRENCYSYMBOL', 'text', ''],
  ['decimal_places', 'DECIMALPLACES', 'int', 2],
];

/** Simple (non-list) tags requested as NATIVEMETHOD. */
export const COMPANY_FIELDS: string[] = COLUMNS.map((c) => c[1]).filter((t) => !t.startsWith('@'));
export const COMPANY_FETCH = ['ADDRESS.LIST'];

function scalar(row: Row, tag: string): string {
  const v = row[tag];
  if (typeof v === 'string') return v.trim();
  if (Array.isArray(v) && typeof v[0] === 'string') return (v as string[])[0].trim();
  return '';
}

function tallyDate(text: string): string | null {
  return /^\d{8}$/.test(text) ? `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}` : null;
}

/** list_text: the text children of every `ADDRESS.LIST` element, in order. */
function addressLines(row: Row): string[] | null {
  const lists = row['ADDRESS.LIST'];
  if (!Array.isArray(lists)) return null;
  const out: string[] = [];
  for (const item of lists as Row[]) {
    const lines = item['ADDRESS'];
    if (typeof lines === 'string') out.push(lines.trim());
    else if (Array.isArray(lines)) for (const l of lines as string[]) out.push(String(l).trim());
  }
  const clean = out.filter((l) => l !== '');
  return clean.length > 0 ? clean : null;
}

/** Map one parsed COMPANY object to the tm_company record. `serial` overrides what the row carries. */
export function companyFromRow(row: Row, serial?: string | null): CompanyRecord {
  const rec: Record<string, unknown> = {};
  for (const [col, tag, hint, def] of COLUMNS) {
    const text = tag.startsWith('@') ? (typeof row[tag] === 'string' ? (row[tag] as string).trim() : '') : scalar(row, tag);
    if (text === '') rec[col] = def;
    else if (hint === 'int') rec[col] = /^-?\d+$/.test(text) ? parseInt(text, 10) : def;
    else if (hint === 'tally_date') rec[col] = tallyDate(text);
    else rec[col] = text;
  }
  const fromRow = (() => {
    const f = row['FNRESULT'];
    return typeof f === 'string' ? f.trim() : '';
  })();
  const full: Record<string, unknown> = {};
  // keep the data_model column order
  for (const k of ['guid', 'name', 'basic_formal_name', 'starting_from', 'books_from', 'ending_at', 'last_voucher_date', 'alter_id_master', 'alter_id_voucher', 'state_name', 'country', 'pincode']) full[k] = rec[k];
  full.address = addressLines(row);
  for (const k of ['email', 'phone', 'mobile', 'website', 'gstin', 'gst_registration_type', 'gst_applicable_date', 'pan', 'tan', 'cin', 'base_currency_symbol', 'decimal_places']) full[k] = rec[k];
  full.tally_serial = (serial ?? fromRow) || '';
  full.alter_id = Math.max(rec.alter_id_master as number, rec.alter_id_voucher as number);
  return full as unknown as CompanyRecord;
}

export type BindingState = 'unbound' | 'match' | 'mismatch' | 'unknown';

/**
 * Optional license-to-Tally binding check (no enforcement here: nothing in the shared docs says where the bound
 * serial is stored or what a mismatch does; see PHASE_STATUS Open questions).
 */
export function checkBinding(boundSerial: string | null | undefined, currentSerial: string): BindingState {
  if (!boundSerial) return 'unbound';
  if (!currentSerial) return 'unknown';
  return boundSerial === currentSerial ? 'match' : 'mismatch';
}

export interface CompanyInfoDeps {
  client: TallyClient;
  /** Exact name of the selected company (the detector's selection). */
  getCompanyName: () => string | null;
  /** Optional guid that must match (the saved config.companyGuid); a different GUID with the same name is refused. */
  getCompanyGuid?: () => string | null;
  /** Optional cache file (userData/company.json); written atomically, never read back as truth. */
  cacheFile?: string;
  onChange?: (c: CompanyRecord) => void;
}

export interface CompanyInfo {
  /** Read the selected company from Tally now. Throws TallyError (e.g. TALLY_COMPANY_NOT_LOADED) or Error('No company selected'). */
  read(): Promise<CompanyRecord>;
  last(): CompanyRecord | null;
}

export function createCompanyInfo(deps: CompanyInfoDeps): CompanyInfo {
  let lastRec: CompanyRecord | null = null;

  async function readSerial(): Promise<string | null> {
    try {
      const v = (await deps.client.fn(FN_SERIAL)).trim();
      return v === '' ? null : v;
    } catch (e) {
      // best effort: an unsupported function must not stop the company read; connection problems surface on the main request
      logger.warn('tally', 'serial number not available', { code: (e as { code?: string }).code ?? 'unknown' });
      return null;
    }
  }

  return {
    async read() {
      const name = deps.getCompanyName();
      if (!name) throw new Error('No company selected');
      const rows = await deps.client.collection(REQ_COMPANY, COMPANY_FIELDS, { type: 'Company', fetch: COMPANY_FETCH, company: name });
      const guid = deps.getCompanyGuid?.() ?? null;
      const row =
        rows.find((r) => r['@NAME'] === name && (!guid || guid === name || scalar(r, 'GUID') === guid)) ??
        rows.find((r) => r['@NAME'] === name);
      if (!row) {
        throw new TallyError('LB_TALLY_REJECTED', 'TALLY_COMPANY_NOT_LOADED', 'The company is not open in TallyPrime. Open it and LazyBooks will continue.', true, REQ_COMPANY);
      }
      const rowSerial = typeof row['FNRESULT'] === 'string' ? (row['FNRESULT'] as string).trim() : '';
      const serial = rowSerial !== '' ? rowSerial : await readSerial();
      const rec = companyFromRow(row, serial);
      const changed = !lastRec || JSON.stringify(lastRec) !== JSON.stringify(rec);
      lastRec = rec;
      if (changed) {
        logger.info('tally', 'company info', {
          name: rec.name, alter_master: rec.alter_id_master, alter_voucher: rec.alter_id_voucher, has_gstin: rec.gstin !== '', has_serial: rec.tally_serial !== '',
        });
        if (deps.cacheFile) {
          try {
            mkdirSync(dirname(deps.cacheFile), { recursive: true });
            const tmp = `${deps.cacheFile}.tmp`;
            writeFileSync(tmp, JSON.stringify(rec, null, 2), 'utf8');
            renameSync(tmp, deps.cacheFile);
          } catch (e) {
            logger.warn('tally', 'company cache not written', { error: String((e as Error).message) });
          }
        }
        deps.onChange?.(rec);
      }
      return rec;
    },
    last: () => lastRec,
  };
}
