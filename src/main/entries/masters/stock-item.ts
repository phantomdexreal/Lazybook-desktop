/*
LazyBooks | src/main/entries/masters/stock-item.ts
Responsibility: the <STOCKITEM ACTION="Create"> element of a `stock_item` entry
Introduced by: Phase 26 (master-writers)
STATUS: IMPLEMENTED (Phase 26)
*/
import { canon, dec, half, isZero, mul, qtyText, round, type Dec } from '../builders/decimal';
import type { X } from '../builders/voucher';
import { el, nameList, txt, yn } from './ledger';
import type { MasterLookup } from './types';

type Data = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Assumed Tally spellings (verify on a real Tally, PEER-02). */
const TAXABILITY: Record<string, string> = { taxable: 'Taxable', exempt: 'Exempt', nil_rated: 'Nil Rated', non_gst: 'Non-GST' };

const rateRow = (head: string, rate: Dec): X =>
  el('RATEDETAILS.LIST', [el('GSTRATEDUTYHEAD', head), el('GSTRATEVALUATIONTYPE', 'Based on Value'), el('GSTRATE', canon(rate))]);

/** GST of the item: HSN and taxability valid from the company's first date; CGST and SGST are half the total rate, IGST the whole (CALC_SPECS section 10). */
function gstBlocks(d: Data, from: string): (X | null)[] {
  const has = d.hsn || d.gst_rate !== undefined || d.gst_taxability;
  if (!has) return [];
  const f = from.replace(/-/g, '');
  const rate = d.gst_rate !== undefined ? dec(d.gst_rate) : null;
  const rows: X[] = [];
  if (rate && !isZero(rate)) rows.push(rateRow('CGST', half(rate)), rateRow('SGST/UTGST', half(rate)), rateRow('IGST', rate));
  return [
    el('GSTAPPLICABLE', 'Applicable'),
    d.hsn ? el('HSNDETAILS.LIST', [el('APPLICABLEFROM', f), el('HSNCODE', d.hsn)]) : null,
    el('GSTDETAILS.LIST', [
      el('APPLICABLEFROM', f),
      d.hsn ? el('HSNCODE', d.hsn) : null,
      el('TAXABILITY', TAXABILITY[d.gst_taxability ?? 'taxable'] ?? 'Taxable'),
      el('STATEWISEDETAILS.LIST', [el('STATENAME', 'Any'), ...rows]),
    ]),
  ];
}

export function stockItemElement(d: Data, remoteId: string, lk: MasterLookup): X {
  const unit = d.unit_guid.startsWith('n:') ? d.unit_guid.slice(2) : (lk.unitName(d.unit_guid) as string);
  const sg = d.parent_stock_group_guid;
  const parent = !sg ? null : sg.startsWith('n:') ? sg.slice(2) : (lk.stockGroupName(sg) as string);
  const op = d.opening as Data | undefined;
  let opening: (X | null)[] = [];
  if (op) {
    const qty = dec(op.qty);
    const value = round(mul(qty, dec(op.rate)), 2);
    const godown = op.godown_guid.startsWith('n:') ? op.godown_guid.slice(2) : (lk.godown(op.godown_guid)?.name as string);
    const qtyStr = `${qtyText(qty)} ${unit}`;
    // opening value is written positive, as Tally exports it (fixtures/tally_xml/stock_items.xml)
    opening = [
      el('OPENINGBALANCE', qtyStr),
      el('OPENINGVALUE', canon(value)),
      el('OPENINGRATE', `${canon(dec(op.rate))}/${unit}`),
      el('BATCHALLOCATIONS.LIST', [
        el('GODOWNNAME', godown),
        el('BATCHNAME', op.batch_name || 'Primary Batch'),
        el('OPENINGBALANCE', qtyStr),
        el('OPENINGVALUE', canon(value)),
      ]),
    ];
  }
  return el(
    'STOCKITEM',
    [
      txt('PARENT', parent),
      el('BASEUNITS', unit),
      d.is_batch_wise === undefined ? null : el('ISBATCHWISEON', yn(!!d.is_batch_wise)),
      txt('PARTNO', d.part_no),
      txt('DESCRIPTION', d.description),
      d.reorder_level ? el('REORDERBASE', `${qtyText(dec(d.reorder_level))} ${unit}`) : null,
      ...gstBlocks(d, lk.company.starting_from),
      ...opening,
      nameList(String(d.name).trim(), d.alias),
    ],
    { NAME: String(d.name).trim(), ACTION: 'Create', REMOTEID: remoteId },
  );
}

