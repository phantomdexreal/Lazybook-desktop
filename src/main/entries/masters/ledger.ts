/*
LazyBooks | src/main/entries/masters/ledger.ts
Responsibility: the <LEDGER ACTION="Create"> element of a `ledger` entry
Introduced by: Phase 26 (master-writers)
STATUS: IMPLEMENTED (Phase 26)
*/
import { canon, dec, neg } from '../builders/decimal';
import type { X } from '../builders/voucher';
import type { MasterLookup } from './types';

type Data = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const el = (n: string, c?: (X | null)[] | string, a?: Record<string, string>): X => ({ n, a, c });
export const txt = (n: string, v: string | number | undefined | null): X | null => (v === undefined || v === null || v === '' ? null : el(n, String(v)));
export const yn = (b: boolean): string => (b ? 'Yes' : 'No');

/** Assumed Tally spellings of the registration types (verify on a real Tally, PEER-02). */
const REG_TYPE: Record<string, string> = {
  regular: 'Regular',
  composition: 'Composition',
  unregistered: 'Unregistered',
  consumer: 'Consumer',
  overseas: 'Overseas',
  sez: 'Regular - SEZ',
};

/** Language-name list: the name first, then nothing else (aliases are not part of the payload except `alias`). */
export function nameList(name: string, alias?: string): X {
  return el('LANGUAGENAME.LIST', [el('NAME.LIST', [el('NAME', name), alias ? el('NAME', alias) : null], { TYPE: 'String' })]);
}

/** Debit is negative (TALLY_WIRE section 8, same sign rule as vouchers): opening 1000 dr is written -1000.00. */
export function openingText(amount: string, side: 'dr' | 'cr'): string {
  const a = dec(amount);
  return canon(side === 'dr' ? neg(a) : a);
}

export function ledgerElement(d: Data, remoteId: string, lk: MasterLookup): X {
  const parent = d.parent_group_guid.startsWith('n:') ? d.parent_group_guid.slice(2) : (lk.groupName(d.parent_group_guid) as string);
  const bank = d.bank as Data | undefined;
  const hasGst = !!(d.gstin || d.gst_registration_type);
  return el(
    'LEDGER',
    [
      el('PARENT', parent),
      d.is_billwise === undefined ? null : el('ISBILLWISEON', yn(!!d.is_billwise)),
      d.credit_period_days !== undefined && d.credit_period_days > 0 ? el('BILLCREDITPERIOD', `${d.credit_period_days} Days`) : null,
      txt('CREDITLIMIT', d.credit_limit ? canon(dec(d.credit_limit)) : undefined),
      d.opening_balance ? el('OPENINGBALANCE', openingText(d.opening_balance.amount, d.opening_balance.side)) : null,
      hasGst ? el('GSTREGISTRATIONTYPE', REG_TYPE[d.gst_registration_type ?? 'regular'] ?? 'Regular') : null,
      txt('PARTYGSTIN', d.gstin),
      txt('LEDSTATENAME', d.state_name),
      d.state_name ? el('COUNTRYNAME', 'India') : null,
      txt('PINCODE', d.pincode),
      txt('EMAIL', d.email),
      txt('LEDGERPHONE', d.phone),
      txt('LEDGERMOBILE', d.mobile),
      txt('LEDGERCONTACT', d.contact_person),
      txt('INCOMETAXNUMBER', d.pan),
      bank ? txt('BANKINGCONFIGBANK', bank.bank_name) : null,
      bank ? txt('BANKDETAILS', bank.account_no) : null,
      bank ? txt('BANKBRANCHNAME', bank.branch) : null,
      bank ? txt('IFSCODE', bank.ifsc) : null,
      bank ? txt('BANKACCHOLDERNAME', bank.holder) : null,
      d.address && d.address.length ? el('ADDRESS.LIST', (d.address as string[]).map((l) => el('ADDRESS', l)), { TYPE: 'String' }) : null,
      nameList(String(d.name).trim(), d.alias),
    ],
    { NAME: String(d.name).trim(), ACTION: 'Create', REMOTEID: remoteId },
  );
}
