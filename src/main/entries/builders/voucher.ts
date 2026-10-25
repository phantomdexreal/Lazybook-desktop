/*
LazyBooks | src/main/entries/builders/voucher.ts
Responsibility: build the Tally "Import Data" XML of a voucher entry (TALLY_WIRE section 8)
Introduced by: Phase 25 (xml-builders)
STATUS: IMPLEMENTED (Phase 25)
*/

/**
 * `buildVoucherImport(envelope, lookup)` re-validates the payload (validate.ts, S01-S11), resolves every guid to its Tally name through the lookup,
 * and renders one `<VOUCHER>` inside the import envelope. Pure: no I/O, no clock, no random; the same input gives the same bytes (golden files in
 * tests/fixtures/xml/).
 *
 * Sign rule (TALLY_WIRE section 8, CALC_SPECS 3): a debit line has a negative AMOUNT and ISDEEMEDPOSITIVE Yes, a credit line a positive AMOUNT and No.
 * Invoice: the party takes the side of the voucher kind (sales and debit note debit it, purchase and credit note credit it); every other line (item
 * ledger, charges, tax, round-off) is on the opposite side, and a negative round-off flips to the party side. The built voucher is asserted to sum to
 * zero (ENTRY-02) and a mismatch throws instead of producing XML.
 *
 * Assumed (verify on a real Tally, listed in PHASE_STATUS): RATEDETAILS.LIST per inventory line, BANKALLOCATIONS.LIST transaction type names, the
 * OBJVIEW values of non-invoice vouchers, the order voucher shape (party line plus inventory lines), stock journal lines both in ALLINVENTORYENTRIES.LIST
 * with ISDEEMEDPOSITIVE marking the destination (TALLY_WIRE section 7), and `valid_till` of a quotation appended to the narration.
 * Never logs. Masters and the alter/cancel/delete actions are other phases; `opts.action = 'Alter'` is the seam Phase 30 uses.
 */
import { escapeXml, stripIllegalXml } from '../../tally/xml';
import { canon, dec, half, isZero, mul, neg, qtyText, round, sum, ZERO, type Dec } from './decimal';
import { BuildError, type BuildLookup, type BuildOptions, type BuildResult, type FlagMap, type LedgerInfo, type RefKind } from './types';
import { validateVoucherEntry } from './validate';

// ---------------------------------------------------------------------------------------------------------------------------------- xml writer
export interface X {
  n: string;
  a?: Record<string, string>;
  c?: (X | null)[] | string;
}
const el = (n: string, c?: (X | null)[] | string, a?: Record<string, string>): X => ({ n, a, c });
const txt = (n: string, v: string | undefined | null): X | null => (v === undefined || v === null || v === '' ? null : el(n, v));
const esc = (s: string): string => escapeXml(stripIllegalXml(s));

export function render(x: X, depth = 0): string {
  const pad = ' '.repeat(depth);
  const attrs = x.a ? Object.entries(x.a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('') : '';
  if (x.c === undefined || x.c === '') return `${pad}<${x.n}${attrs}/>`;
  if (typeof x.c === 'string') return `${pad}<${x.n}${attrs}>${esc(x.c)}</${x.n}>`;
  const kids = x.c.filter((k): k is X => k !== null);
  if (!kids.length) return `${pad}<${x.n}${attrs}/>`;
  return `${pad}<${x.n}${attrs}>\n${kids.map((k) => render(k, depth + 1)).join('\n')}\n${pad}</${x.n}>`;
}

// ---------------------------------------------------------------------------------------------------------------------------------- helpers
const tallyDate = (iso: string): string => iso.replace(/-/g, '');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const longDate = (iso: string): string => `${Number(iso.slice(8, 10))}-${MONTHS[Number(iso.slice(5, 7)) - 1]}-${iso.slice(0, 4)}`;
const yn = (b: boolean): string => (b ? 'Yes' : 'No');
const BILL_TYPE: Record<string, string> = { new_ref: 'New Ref', agst_ref: 'Agst Ref', advance: 'Advance', on_account: 'On Account' };
const TXN_TYPE: Record<string, string> = { cheque: 'Cheque', neft: 'e-Fund Transfer', rtgs: 'e-Fund Transfer', upi: 'e-Fund Transfer', card: 'Card', cash: 'Cash', other: 'Others' };
const REF_DETAIL: Record<string, 'LEDGER_NOT_FOUND' | 'STOCK_ITEM_NOT_FOUND' | 'GODOWN_NOT_FOUND' | 'VOUCHER_TYPE_NOT_FOUND'> = {
  ledger: 'LEDGER_NOT_FOUND',
  stock_item: 'STOCK_ITEM_NOT_FOUND',
  godown: 'GODOWN_NOT_FOUND',
  voucher_type: 'VOUCHER_TYPE_NOT_FOUND',
};

type Data = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

class Ctx {
  /** Every ledger and inventory-vs-party amount that counts for the zero-sum assertion. */
  readonly balance: Dec[] = [];
  constructor(readonly lk: BuildLookup) {}

  name(kind: RefKind, guid: string): string {
    if (guid.startsWith('n:')) {
      const hit = kind === 'ledger' ? this.lk.ledger(guid) : kind === 'stock_item' ? this.lk.stockItem(guid) : kind === 'godown' ? this.lk.godown(guid) : this.lk.voucherType(guid);
      return hit ? hit.name : guid.slice(2);
    }
    const hit = kind === 'ledger' ? this.lk.ledger(guid) : kind === 'stock_item' ? this.lk.stockItem(guid) : kind === 'godown' ? this.lk.godown(guid) : this.lk.voucherType(guid);
    if (!hit) throw new BuildError(REF_DETAIL[kind] ?? 'PAYLOAD_INVALID', guid, `unknown ${kind}`);
    return hit.name;
  }
  ledger(guid: string): LedgerInfo | undefined {
    return this.lk.ledger(guid);
  }
}

/** A ledger line: `value` is signed in Tally terms (debit negative). Counted in the balance. */
function ledgerLine(cx: Ctx, name: string, value: Dec, opts: { party?: boolean; bills?: X[]; bank?: X | null } = {}): X {
  cx.balance.push(value);
  return el('LEDGERENTRIES.LIST', [
    el('LEDGERNAME', name),
    el('ISDEEMEDPOSITIVE', yn(value.n < 0n)),
    opts.party ? el('ISPARTYLEDGER', 'Yes') : null,
    el('AMOUNT', canon(value)),
    ...(opts.bills ?? []),
    opts.bank ?? null,
  ]);
}
const allLedger = (x: X): X => ({ ...x, n: 'ALLLEDGERENTRIES.LIST' });

function billAllocations(cx: Ctx, bills: Data[] | undefined, sign: 1 | -1, fallbackName: string | undefined, creditDays: number | undefined): X[] {
  return (bills ?? []).map((b) =>
    el('BILLALLOCATIONS.LIST', [
      el('NAME', b.type === 'on_account' ? (b.name ?? '') : (b.name ?? fallbackName ?? '')),
      el('BILLTYPE', BILL_TYPE[b.type] as string),
      b.type === 'new_ref' && creditDays && creditDays > 0 ? el('BILLCREDITPERIOD', `${creditDays} Days`) : null,
      el('AMOUNT', canon(sign === 1 ? dec(b.amount) : neg(dec(b.amount)))),
    ]),
  );
}

function bankAllocation(inst: Data | undefined, date: string, value: Dec): X | null {
  if (!inst) return null;
  return el('BANKALLOCATIONS.LIST', [
    el('DATE', tallyDate(date)),
    inst.date ? el('INSTRUMENTDATE', tallyDate(inst.date)) : null,
    el('TRANSACTIONTYPE', TXN_TYPE[inst.type ?? 'other'] as string),
    txt('INSTRUMENTNUMBER', inst.number),
    txt('BANKNAME', inst.bank),
    el('AMOUNT', canon(value)),
  ]);
}

interface Line {
  stock_item_guid: string;
  godown_guid?: string;
  batch_name?: string;
  qty: string;
  unit: string;
  rate?: string;
  discount_pct?: string;
  amount?: string;
  order_no?: string;
  due_date?: string;
  description?: string;
  gst_rate?: string;
  cess_rate?: string;
}

/** One ALLINVENTORYENTRIES.LIST item. `value` is signed like ledger lines (outward/credit positive); `inward` states the direction when the amount is zero. Not counted in the balance by itself. */
function inventoryLine(cx: Ctx, ln: Line, value: Dec, extra: { alloc?: X; rates?: X[]; orderNo?: string; inward?: boolean } = {}): X {
  const unit = ln.unit;
  const qty = `${qtyText(dec(ln.qty))} ${unit}`;
  const batch = el('BATCHALLOCATIONS.LIST', [
    ln.godown_guid ? el('GODOWNNAME', cx.name('godown', ln.godown_guid)) : null,
    el('BATCHNAME', ln.batch_name || 'Primary Batch'),
    ln.order_no || extra.orderNo ? el('ORDERNO', (ln.order_no ?? extra.orderNo) as string) : null,
    ln.due_date ? el('ORDERDUEDATE', longDate(ln.due_date), { JOBDATE: tallyDate(ln.due_date) }) : null,
    el('AMOUNT', canon(value)),
    el('ACTUALQTY', qty),
    el('BILLEDQTY', qty),
  ]);
  return el('ALLINVENTORYENTRIES.LIST', [
    el('STOCKITEMNAME', cx.name('stock_item', ln.stock_item_guid)),
    ln.description ? el('BASICUSERDESCRIPTION.LIST', [el('BASICUSERDESCRIPTION', ln.description)]) : null,
    el('ISDEEMEDPOSITIVE', yn(extra.inward ?? value.n < 0n)),
    ...(extra.rates ?? []),
    ln.rate ? el('RATE', `${canon(dec(ln.rate))}/${unit}`) : null,
    ln.discount_pct && !isZero(dec(ln.discount_pct)) ? el('DISCOUNT', canon(dec(ln.discount_pct))) : null,
    el('AMOUNT', canon(value)),
    el('ACTUALQTY', qty),
    el('BILLEDQTY', qty),
    batch,
    extra.alloc ?? null,
  ]);
}

function rateDetails(mode: string, ln: Line): X[] {
  if (mode === 'none') return [];
  const g = dec(ln.gst_rate ?? '0');
  const heads: [string, Dec][] = mode === 'intra' ? [['CGST', half(g)], ['SGST/UTGST', half(g)]] : [['IGST', g]];
  const cess = dec(ln.cess_rate ?? '0');
  if (!isZero(cess)) heads.push(['Cess', cess]);
  return heads.map(([h, r]) =>
    el('RATEDETAILS.LIST', [el('GSTRATEDUTYHEAD', h), el('GSTRATEVALUATIONTYPE', 'Based on Value'), el('GSTRATE', canon(r))]),
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------- per kind
interface Body {
  objview: string;
  children: (X | null)[];
  ownNarration?: string;
}

function invoiceBody(cx: Ctx, d: Data): Body {
  const partyDebit = d.base_kind === 'sales' || d.base_kind === 'debit_note';
  const dir = partyDebit ? 1n : -1n; // sign of every non-party line
  const signed = (m: Dec): Dec => ({ n: m.n * dir, s: m.s });
  const total = dec(d.total);
  const party = cx.ledger(d.party_ledger_guid);
  const partyName = cx.name('ledger', d.party_ledger_guid);
  const creditDays = d.due_days ?? (party?.credit_period_days || undefined);
  const partyLine = allLedger(
    ledgerLine(cx, partyName, { n: -dir * total.n, s: total.s }, { party: true, bills: billAllocations(cx, d.bills, partyDebit ? -1 : 1, d.number, creditDays) }),
  );
  const itemLedger = cx.name('ledger', d.item_ledger_guid);
  const inv = (d.lines as Line[]).map((ln) => {
    const v = signed(dec(ln.amount));
    cx.balance.push(v); // the item-ledger allocation below carries the same amount
    return inventoryLine(cx, ln, v, {
      rates: rateDetails(d.tax.mode, ln),
      alloc: el('ACCOUNTINGALLOCATIONS.LIST', [el('LEDGERNAME', itemLedger), el('ISDEEMEDPOSITIVE', yn(v.n < 0n)), el('AMOUNT', canon(v))]),
    });
  });
  // inventory amounts were pushed once as the allocation; ledgerLine() pushes the rest
  const rest: X[] = [];
  for (const c of (d.charges ?? []) as Data[]) rest.push(ledgerLine(cx, cx.name('ledger', c.ledger_guid), signed(dec(c.amount))));
  for (const t of (d.tax.lines ?? []) as Data[]) rest.push(ledgerLine(cx, cx.name('ledger', t.ledger_guid), signed(dec(t.amount))));
  if (d.round_off && !isZero(dec(d.round_off.amount))) rest.push(ledgerLine(cx, cx.name('ledger', d.round_off.ledger_guid), signed(dec(d.round_off.amount))));
  return {
    objview: 'Invoice Voucher View',
    children: [
      txt('PARTYGSTIN', d.party_gstin),
      txt('PLACEOFSUPPLY', d.place_of_supply),
      el('PARTYLEDGERNAME', partyName),
      el('ISINVOICE', 'Yes'),
      partyLine,
      ...inv,
      ...rest,
    ],
  };
}

function recPayBody(cx: Ctx, kind: 'receipt' | 'payment', d: Data): Body {
  const partyDebit = kind === 'payment';
  const amt = dec(d.amount);
  const pv = partyDebit ? neg(amt) : amt;
  const bv = partyDebit ? amt : neg(amt);
  const partyName = cx.name('ledger', d.party_ledger_guid);
  const party = allLedger(ledgerLine(cx, partyName, pv, { party: true, bills: billAllocations(cx, d.bills, partyDebit ? -1 : 1, undefined, undefined) }));
  const bank = allLedger(ledgerLine(cx, cx.name('ledger', d.cash_bank_ledger_guid), bv, { bank: bankAllocation(d.instrument, d.date, bv) }));
  return { objview: 'Accounting Voucher View', children: [el('PARTYLEDGERNAME', partyName), party, bank] };
}

function contraBody(cx: Ctx, d: Data): Body {
  const amt = dec(d.amount);
  const fromBank = cx.ledger(d.from_ledger_guid)?.reserved_root === 'Bank Accounts';
  const toBank = cx.ledger(d.to_ledger_guid)?.reserved_root === 'Bank Accounts';
  const instOnTo = toBank && !fromBank;
  const to = allLedger(ledgerLine(cx, cx.name('ledger', d.to_ledger_guid), neg(amt), { bank: instOnTo ? bankAllocation(d.instrument, d.date, neg(amt)) : null }));
  const from = allLedger(ledgerLine(cx, cx.name('ledger', d.from_ledger_guid), amt, { bank: instOnTo ? null : bankAllocation(d.instrument, d.date, amt) }));
  return { objview: 'Accounting Voucher View', children: [to, from] };
}

function journalBody(cx: Ctx, d: Data): Body {
  const lines = (d.lines as Data[]).map((l) => {
    const v = l.side === 'dr' ? neg(dec(l.amount)) : dec(l.amount);
    return allLedger(ledgerLine(cx, cx.name('ledger', l.ledger_guid), v, { bills: billAllocations(cx, l.bills, l.side === 'dr' ? -1 : 1, undefined, undefined) }));
  });
  return { objview: 'Accounting Voucher View', children: lines };
}

function lineValue(ln: Line): Dec {
  if (ln.amount !== undefined) return dec(ln.amount);
  if (ln.rate !== undefined) return round(mul(dec(ln.qty), dec(ln.rate)), 2);
  return ZERO;
}

function inventoryBody(cx: Ctx, d: Data): Body {
  if (d.base_kind === 'stock_journal') {
    const src = (d.source_lines as Line[]).map((ln) => inventoryLine(cx, ln, lineValue(ln), { inward: false }));
    const dst = (d.destination_lines as Line[]).map((ln) => inventoryLine(cx, ln, neg(lineValue(ln)), { inward: true }));
    return { objview: 'Consumption Voucher View', children: [...src, ...dst] };
  }
  const outward = d.base_kind === 'delivery_note' || d.base_kind === 'rejections_out';
  const partyName = cx.name('ledger', d.party_ledger_guid);
  const items = (d.lines as Line[]).map((ln) => inventoryLine(cx, ln, outward ? lineValue(ln) : neg(lineValue(ln)), { inward: !outward }));
  return { objview: 'Invoice Voucher View', children: [el('PARTYLEDGERNAME', partyName), ...items] };
}

function orderBody(cx: Ctx, kind: 'order' | 'quotation', d: Data): Body {
  const partyDebit = d.base_kind === 'sales_order';
  const lines = d.lines as Line[];
  const total = sum(lines.map((l) => dec(l.amount as string)));
  const partyName = cx.name('ledger', d.party_ledger_guid);
  const pv = partyDebit ? neg(total) : total;
  cx.balance.push(pv);
  const partyLine = allLedger(
    el('LEDGERENTRIES.LIST', [el('LEDGERNAME', partyName), el('ISDEEMEDPOSITIVE', yn(pv.n < 0n)), el('ISPARTYLEDGER', 'Yes'), el('AMOUNT', canon(pv))]),
  );
  const items = lines.map((ln) => {
    const v = partyDebit ? dec(ln.amount as string) : neg(dec(ln.amount as string));
    cx.balance.push(v);
    return inventoryLine(cx, ln, v, { orderNo: d.number });
  });
  const own = kind === 'quotation' && d.valid_till ? `${d.narration ? d.narration + ' ' : ''}[Valid till ${d.valid_till}]` : undefined;
  return { objview: 'Order Voucher View', children: [el('PARTYLEDGERNAME', partyName), el('ISINVOICE', 'No'), partyLine, ...items], ownNarration: own };
}

// ---------------------------------------------------------------------------------------------------------------------------------- entry point
export interface VoucherEnvelope {
  kind: string;
  client_request_id: string;
  company_guid: string;
  data: unknown;
}

/** Throws BuildError (first issue of the re-validation, or UNBALANCED if the built voucher does not sum to zero). */
export function buildVoucherImport(env: VoucherEnvelope, lk: BuildLookup, opts: BuildOptions = {}, flags?: FlagMap): BuildResult {
  const issues = validateVoucherEntry({ kind: env.kind, company_guid: env.company_guid, data: env.data }, lk, flags);
  if (issues.length) {
    const i = issues[0] as (typeof issues)[number];
    throw new BuildError(i.detail, i.path, i.message);
  }
  const d = env.data as Data;
  const cx = new Ctx(lk);
  const vtName = cx.name('voucher_type', d.voucher_type_guid);
  let body: Body;
  switch (env.kind) {
    case 'invoice':
      body = invoiceBody(cx, d);
      break;
    case 'receipt':
    case 'payment':
      body = recPayBody(cx, env.kind, d);
      break;
    case 'contra':
      body = contraBody(cx, d);
      break;
    case 'journal':
      body = journalBody(cx, d);
      break;
    case 'inventory_voucher':
      body = inventoryBody(cx, d);
      break;
    default:
      body = orderBody(cx, env.kind as 'order' | 'quotation', d);
  }
  const bal = sum(cx.balance);
  const hasAccounting = env.kind !== 'inventory_voucher';
  if (hasAccounting && !isZero(bal)) throw new BuildError('UNBALANCED', '$.data', `voucher lines sum to ${canon(bal)}, not zero`);

  const action = opts.action ?? 'Create';
  if (action === 'Alter' && !opts.masterId) throw new BuildError('PAYLOAD_INVALID', '$.data', 'Alter needs the master id of the target voucher');
  const attrs: Record<string, string> = { REMOTEID: env.client_request_id, VCHTYPE: vtName, ACTION: action, OBJVIEW: body.objview };
  if (action === 'Alter') {
    attrs.TAGNAME = 'MASTER ID';
    attrs.TAGVALUE = opts.masterId as string;
  }
  const narration = body.ownNarration ?? d.narration;
  const voucher = el(
    'VOUCHER',
    [
      el('DATE', tallyDate(d.date)),
      el('VOUCHERTYPENAME', vtName),
      txt('VOUCHERNUMBER', d.number),
      el('REFERENCE', d.reference ?? ''),
      txt('REFERENCEDATE', d.reference_date ? tallyDate(d.reference_date) : undefined),
      el('NARRATION', narration ?? ''),
      ...body.children,
    ],
    attrs,
  );
  const xml = render(
    el('ENVELOPE', [
      el('HEADER', [el('TALLYREQUEST', 'Import Data')]),
      el('BODY', [
        el('IMPORTDATA', [
          el('REQUESTDESC', [el('REPORTNAME', 'Vouchers'), el('STATICVARIABLES', [el('SVCURRENTCOMPANY', lk.company.name)])]),
          el('REQUESTDATA', [el('TALLYMESSAGE', [voucher], { 'xmlns:UDF': 'TallyUDF' })]),
        ]),
      ]),
    ]),
  );
  const eway = d.eway?.generate ? { transporter_id: d.eway.transporter_id, vehicle_no: d.eway.vehicle_no, distance_km: d.eway.distance_km, mode: d.eway.mode } : null;
  return {
    xml,
    remoteId: env.client_request_id,
    voucherTypeName: vtName,
    voucherNumber: d.number ?? null,
    balance: canon(bal),
    followUp: { einvoice: !!d.einvoice?.generate, eway },
  };
}

