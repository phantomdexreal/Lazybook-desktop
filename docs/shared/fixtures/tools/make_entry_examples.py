"""make_entry_examples - writes entry_examples/*.json (one valid and one invalid per kind) from the fixture company.

The valid invoice and receipt are the phone-entered vouchers S-002 and R-007 of the fixture (same client_request_id as tx_voucher.remote_id),
so the example is cross-checked against the fixture numbers. Run:  python3 -I make_entry_examples.py
"""
import copy
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import validate_entries as V  # noqa: E402
from lbmodel import SHARED, dec, canon  # noqa: E402

CTX = V.Ctx()
T = CTX.T
OUT = os.path.join(SHARED, 'entry_examples')
CG = CTX.company['guid']
DEV = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
L = {r['name']: r['guid'] for r in T['tm_ledger']}
IT = {r['name']: r['guid'] for r in T['tm_stock_item']}
VT = {r['name']: r['guid'] for r in T['tm_voucher_type']}
GD = {r['name']: r['guid'] for r in T['tm_godown']}
GRP = {r['name']: r['guid'] for r in T['tm_group']}
UN = {r['name']: r['guid'] for r in T['tm_unit']}
VCH = {r['number']: r for r in T['tx_voucher']}


def env(kind, rid, data, at='2026-09-25T10:15:00Z'):
    return {'v': 1, 'kind': kind, 'client_request_id': rid, 'company_guid': CG, 'created_at': at, 'device_id': DEV, 'data': data}


def line(item, qty, rate, gst, godown='Main Location', batch=None, disc=None, order_no=None):
    amt = V.r2(dec(qty) * dec(rate) * (1 - dec(disc or 0) / 100))
    d = {'stock_item_guid': IT[item], 'godown_guid': GD[godown], 'qty': str(qty), 'unit': 'Nos', 'rate': canon(rate), 'amount': canon(amt), 'gst_rate': canon(gst)}
    if batch:
        d['batch_name'] = batch
    if disc:
        d['discount_pct'] = canon(disc)
    if order_no:
        d['order_no'] = order_no
    return d


def invoice_data(vtype, base, date, party, item_ledger, lines, intra, tax_ledgers, number=None, bills=None, round_to_rupee=True):
    clines = [(dec(l['amount']), dec(l['gst_rate']), dec(0)) for l in lines]
    tax = V.compute_tax(clines, [], intra)
    tl = []
    for h in ('cgst', 'sgst', 'igst', 'cess'):
        if h in tax:
            amt, brk = tax[h]
            tl.append({'head': h, 'ledger_guid': L[tax_ledgers[h]], 'amount': canon(amt), 'breakup': [{'rate': canon(r), 'taxable': canon(t)} for r, t in sorted(brk.items())]})
    raw = sum((dec(l['amount']) for l in lines), dec(0)) + sum((dec(t['amount']) for t in tl), dec(0))
    total = raw.quantize(dec(1)) if round_to_rupee else raw
    from decimal import ROUND_HALF_UP
    total = raw.quantize(dec(1), rounding=ROUND_HALF_UP) if round_to_rupee else raw
    ro = total - raw
    d = {'voucher_type_guid': VT[vtype], 'base_kind': base, 'date': date, 'party_ledger_guid': L[party], 'item_ledger_guid': L[item_ledger],
         'place_of_supply': 'Maharashtra' if intra else 'Karnataka', 'lines': lines, 'tax': {'mode': 'intra' if intra else 'inter', 'lines': tl}, 'total': canon(total)}
    if number:
        d['number'] = number
    if ro != 0:
        d['round_off'] = {'ledger_guid': L['Round Off'], 'amount': canon(ro)}
    if bills is not None:
        d['bills'] = bills
    return d


def write(name, payload):
    with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=1, ensure_ascii=False)
        f.write('\n')


def main():
    os.makedirs(OUT, exist_ok=True)
    index = []

    def add(name, payload, expect):
        write(name, payload)
        index.append({'file': name, 'expect': expect})

    out_tax = {'cgst': 'Output CGST', 'sgst': 'Output SGST', 'igst': 'Output IGST'}
    # ---- invoice (== fixture S-002)
    inv = env('invoice', '11111111-1111-4111-8111-111111111111', invoice_data('Sales', 'sales', '2026-09-25', 'Alpha Retail', 'Sales',
              [line('Widget A', 20, 83, 18), line('Widget B', 10, 212, 12)], True, out_tax, number='S-002',
              bills=[{'type': 'new_ref', 'name': 'S-002', 'amount': '4333.00'}]))
    s2 = VCH['S-002']
    assert inv['data']['total'] == s2['amount'], (inv['data']['total'], s2['amount'])
    assert inv['client_request_id'] == s2['remote_id']
    add('invoice.valid.json', inv, 'valid')
    bad = copy.deepcopy(inv); bad['client_request_id'] = '11111111-1111-4111-8111-111111111112'; bad['data']['total'] = '4400.00'
    add('invoice.invalid.json', bad, 'TOTAL_MISMATCH')
    bad = copy.deepcopy(inv); bad['client_request_id'] = '11111111-1111-4111-8111-111111111113'; bad['data']['tax']['lines'][0]['amount'] = '1.00'
    add('invoice.invalid_tax.json', bad, 'TAX_MISMATCH')
    inter = env('invoice', '11111111-1111-4111-8111-111111111114', invoice_data('Tax Invoice', 'sales', '2026-09-26', 'Beta Stores', 'Sales', [line('Widget A', 5, 80, 18)], False, out_tax,
                bills=[{'type': 'new_ref', 'name': 'TI-014', 'amount': '472.00'}]))
    inter['data']['einvoice'] = {'generate': True}
    inter['data']['eway'] = {'generate': True, 'vehicle_no': 'KA01AB1234', 'distance_km': 900, 'mode': 'road'}
    add('invoice.inter_state_einvoice.valid.json', inter, 'valid')
    # ---- receipt (== fixture R-007)
    rc = env('receipt', '22222222-2222-4222-8222-222222222222', {'voucher_type_guid': VT['Receipt'], 'base_kind': 'receipt', 'date': '2026-09-28', 'party_ledger_guid': L['Alpha Retail'],
             'cash_bank_ledger_guid': L['HDFC Bank'], 'amount': '3000.00', 'bills': [{'type': 'agst_ref', 'name': 'TI-004', 'amount': '3000.00'}], 'instrument': {'type': 'upi', 'number': 'UPI123456'},
             'narration': 'Entered from phone'}, at='2026-09-28T09:00:00Z')
    assert VCH['R-007']['remote_id'] == rc['client_request_id'] and VCH['R-007']['amount'] == '3000.00'
    add('receipt.valid.json', rc, 'valid')
    bad = copy.deepcopy(rc); bad['client_request_id'] = '22222222-2222-4222-8222-222222222223'; bad['data']['bills'][0]['amount'] = '2500.00'
    add('receipt.invalid.json', bad, 'UNBALANCED')
    # ---- payment (supplier, plus expense without bills)
    py = env('payment', '33333333-3333-4333-8333-333333333333', {'voucher_type_guid': VT['Payment'], 'base_kind': 'payment', 'date': '2026-09-29', 'party_ledger_guid': L['Zeta Wholesale'],
             'cash_bank_ledger_guid': L['HDFC Bank'], 'amount': '2000.00', 'bills': [{'type': 'agst_ref', 'name': 'ZW-501', 'amount': '2000.00'}]})
    add('payment.valid.json', py, 'valid')
    py2 = env('payment', '33333333-3333-4333-8333-333333333334', {'voucher_type_guid': VT['Payment'], 'base_kind': 'payment', 'date': '2026-09-29', 'party_ledger_guid': L['Rent'],
              'cash_bank_ledger_guid': L['HDFC Bank'], 'amount': '12000.00', 'narration': 'Rent'})
    add('payment.expense.valid.json', py2, 'valid')
    bad = copy.deepcopy(py2); bad['client_request_id'] = '33333333-3333-4333-8333-333333333335'; bad['data']['bills'] = [{'type': 'on_account', 'amount': '12000.00'}]
    add('payment.invalid.json', bad, 'PAYLOAD_INVALID')
    # ---- contra
    co = env('contra', '44444444-4444-4444-8444-444444444444', {'voucher_type_guid': VT['Contra'], 'base_kind': 'contra', 'date': '2026-09-20', 'from_ledger_guid': L['Cash'], 'to_ledger_guid': L['HDFC Bank'], 'amount': '5000.00'})
    add('contra.valid.json', co, 'valid')
    bad = copy.deepcopy(co); bad['client_request_id'] = '44444444-4444-4444-8444-444444444445'; bad['data']['to_ledger_guid'] = L['Cash']
    add('contra.invalid.json', bad, 'UNBALANCED')
    # ---- journal
    jr = env('journal', '55555555-5555-4555-8555-555555555555', {'voucher_type_guid': VT['Journal'], 'base_kind': 'journal', 'date': '2026-09-30', 'narration': 'Godown rent billed by supplier',
             'lines': [{'ledger_guid': L['Rent'], 'side': 'dr', 'amount': '5000.00'}, {'ledger_guid': L['Omega Supplies'], 'side': 'cr', 'amount': '5000.00', 'bills': [{'type': 'new_ref', 'name': 'RENT-OCT', 'amount': '5000.00'}]}]})
    add('journal.valid.json', jr, 'valid')
    bad = copy.deepcopy(jr); bad['client_request_id'] = '55555555-5555-4555-8555-555555555556'; bad['data']['lines'][0]['amount'] = '4000.00'
    add('journal.invalid.json', bad, 'UNBALANCED')
    # ---- inventory voucher (delivery note) and stock journal
    dn = env('inventory_voucher', '66666666-6666-4666-8666-666666666666', {'voucher_type_guid': VT['Delivery Note'], 'base_kind': 'delivery_note', 'date': '2026-09-22', 'party_ledger_guid': L['Gamma Enterprises'],
             'lines': [{'stock_item_guid': IT['Widget B'], 'godown_guid': GD['Main Location'], 'qty': '5', 'unit': 'Nos', 'rate': '205.00', 'amount': '1025.00'}]})
    add('inventory_voucher.valid.json', dn, 'valid')
    sj = env('inventory_voucher', '66666666-6666-4666-8666-666666666667', {'voucher_type_guid': VT['Stock Journal'], 'base_kind': 'stock_journal', 'date': '2026-09-22',
             'source_lines': [{'stock_item_guid': IT['Widget A'], 'godown_guid': GD['Main Location'], 'qty': '10', 'unit': 'Nos'}],
             'destination_lines': [{'stock_item_guid': IT['Widget A'], 'godown_guid': GD['Warehouse 2'], 'qty': '10', 'unit': 'Nos'}]})
    add('inventory_voucher.stock_journal.valid.json', sj, 'valid')
    bad = copy.deepcopy(dn); bad['client_request_id'] = '66666666-6666-4666-8666-666666666668'; bad['data']['lines'][0]['stock_item_guid'] = 'no-such-item'
    add('inventory_voucher.invalid.json', bad, 'STOCK_ITEM_NOT_FOUND')
    # ---- order and quotation
    od = env('order', '77777777-7777-4777-8777-777777777777', {'voucher_type_guid': VT['Sales Order'], 'base_kind': 'sales_order', 'date': '2026-09-24', 'number': 'SO-003', 'party_ledger_guid': L['Beta Stores'],
             'lines': [{'stock_item_guid': IT['Widget B'], 'godown_guid': GD['Main Location'], 'qty': '10', 'unit': 'Nos', 'rate': '208.00', 'amount': '2080.00', 'due_date': '2026-10-15'}]})
    add('order.valid.json', od, 'valid')
    bad = copy.deepcopy(od); bad['client_request_id'] = '77777777-7777-4777-8777-777777777778'; bad['data']['lines'][0]['due_date'] = '2026-09-01'
    add('order.invalid.json', bad, 'PAYLOAD_INVALID')
    qt = env('quotation', '77777777-7777-4777-8777-777777777779', {'voucher_type_guid': VT['Sales Quotation'], 'base_kind': 'sales_order', 'date': '2026-09-24', 'number': 'Q-002', 'party_ledger_guid': L['Alpha Retail'],
             'valid_till': '2026-10-24', 'lines': [{'stock_item_guid': IT['Widget A'], 'qty': '50', 'unit': 'Nos', 'rate': '79.00', 'amount': '3950.00', 'due_date': '2026-10-24'}]})
    add('quotation.valid.json', qt, 'valid')
    bad = copy.deepcopy(qt); bad['client_request_id'] = '77777777-7777-4777-8777-77777777777a'; bad['data']['voucher_type_guid'] = VT['Sales Order']
    add('quotation.invalid.json', bad, 'VOUCHER_TYPE_MISMATCH')
    # ---- masters
    ld = env('ledger', '88888888-8888-4888-8888-888888888888', {'name': 'Delta Traders', 'parent_group_guid': GRP['Sundry Debtors'], 'gstin': '27AAAPD6666F1Z6', 'gst_registration_type': 'regular',
             'state_name': 'Maharashtra', 'address': ['3 Mill Road', 'Pune'], 'pincode': '411001', 'mobile': '9820000006', 'credit_period_days': 30, 'is_billwise': True,
             'opening_balance': {'amount': '1000.00', 'side': 'dr'}})
    add('ledger.valid.json', ld, 'valid')
    bad = copy.deepcopy(ld); bad['client_request_id'] = '88888888-8888-4888-8888-888888888889'; bad['data']['parent_group_guid'] = 'no-such-group'
    add('ledger.invalid.json', bad, 'MASTER_NOT_FOUND')
    si = env('stock_item', '99999999-9999-4999-8999-999999999999', {'name': 'Widget E', 'parent_stock_group_guid': T['tm_stock_group'][0]['guid'], 'unit_guid': UN['Nos'], 'hsn': '8479', 'gst_rate': '18.00',
             'gst_taxability': 'taxable', 'opening': {'godown_guid': GD['Main Location'], 'qty': '10', 'rate': '40.00'}, 'reorder_level': '5'})
    add('stock_item.valid.json', si, 'valid')
    bad = copy.deepcopy(si); bad['client_request_id'] = '99999999-9999-4999-8999-99999999999a'; bad['data']['unit_guid'] = 'no-such-unit'
    add('stock_item.invalid.json', bad, 'MASTER_NOT_FOUND')
    # ---- alter / cancel / delete
    rep = copy.deepcopy(inv['data']); rep['lines'] = [line('Widget A', 20, 83, 18)]
    clines = [(dec(l['amount']), dec(l['gst_rate']), dec(0)) for l in rep['lines']]
    tx = V.compute_tax(clines, [], True)
    rep['tax']['lines'] = [{'head': h, 'ledger_guid': L[out_tax[h]], 'amount': canon(tx[h][0]), 'breakup': [{'rate': canon(r), 'taxable': canon(t)} for r, t in tx[h][1].items()]} for h in ('cgst', 'sgst')]
    raw = dec(1660) + sum((tx[h][0] for h in tx), dec(0))
    from decimal import ROUND_HALF_UP
    tot = raw.quantize(dec(1), rounding=ROUND_HALF_UP)
    rep['total'] = canon(tot); rep['round_off'] = {'ledger_guid': L['Round Off'], 'amount': canon(tot - raw)}
    rep['bills'] = [{'type': 'new_ref', 'name': 'S-002', 'amount': canon(tot)}]
    al = env('alter', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', {'target_voucher_guid': s2['guid'], 'expected_alter_id': s2['alter_id'], 'action': 'replace', 'target_kind': 'invoice', 'replacement': rep})
    add('alter.valid.json', al, 'valid')
    bad = copy.deepcopy(al); bad['client_request_id'] = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaab'; bad['data']['replacement']['total'] = '1.00'
    add('alter.invalid.json', bad, 'TOTAL_MISMATCH')
    ei = env('alter', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaac', {'target_voucher_guid': s2['guid'], 'expected_alter_id': s2['alter_id'], 'action': 'einvoice_generate'})
    add('alter.einvoice_generate.valid.json', ei, 'valid')
    ec = env('alter', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaad', {'target_voucher_guid': s2['guid'], 'expected_alter_id': s2['alter_id'], 'action': 'einvoice_cancel', 'reason': 'data_entry_mistake', 'remarks': 'Wrong rate'})
    add('alter.einvoice_cancel.valid.json', ec, 'valid')
    cn = env('cancel', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', {'target_voucher_guid': VCH['TI-011']['guid'], 'expected_alter_id': VCH['TI-011']['alter_id'], 'reason': 'Wrong party'})
    add('cancel.valid.json', cn, 'valid')
    bad = copy.deepcopy(cn); bad['client_request_id'] = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc'; bad['data']['target_voucher_guid'] = 'no-such-voucher'
    add('cancel.invalid.json', bad, 'TARGET_NOT_FOUND')
    dl = env('delete', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', {'target_voucher_guid': VCH['TI-010']['guid'], 'expected_alter_id': VCH['TI-010']['alter_id']})
    add('delete.valid.json', dl, 'valid')
    bad = copy.deepcopy(dl); bad['client_request_id'] = 'cccccccc-cccc-4ccc-8ccc-cccccccccccd'; bad['data']['expected_alter_id'] = -1
    add('delete.invalid.json', bad, 'PAYLOAD_INVALID')
    # results
    results = {
      'posted': {'ok': True, 'guid': 'GUID-OF-NEW-VOUCHER', 'voucher_number': 'S-002', 'alter_id': 120, 'message': 'Created in Tally'},
      'failed_ledger': {'ok': False, 'code': 'LB_TALLY_REJECTED', 'detail': 'LEDGER_NOT_FOUND', 'retryable': False, 'message': "Ledger 'Alpha Retail' does not exist in Tally", 'tally_raw': '<RESPONSE><LINEERROR>Ledger \'Alpha Retail\' does not exist!</LINEERROR><CREATED>0</CREATED><ERRORS>1</ERRORS></RESPONSE>'},
      'needs_review': {'ok': False, 'code': 'LB_ENTRY_NEEDS_REVIEW', 'detail': 'AMBIGUOUS_RESULT', 'retryable': False, 'message': 'Tally closed before answering; voucher not found on read-back'},
      'duplicate_found': {'ok': True, 'guid': 'GUID-OF-EXISTING-VOUCHER', 'voucher_number': 'S-002', 'alter_id': 120, 'message': 'Already posted (found by client_request_id)'}}
    write('results.example.json', results)
    json.dump({'description': 'Every file here is an entry_queue.payload. expect = valid or the detail code the validator must report. Validate with fixtures/tools/validate_entries.py.', 'examples': index},
              open(os.path.join(OUT, 'index.json'), 'w'), indent=1)
    open(os.path.join(OUT, 'index.json'), 'a').write('\n')
    print('wrote', len(index), 'examples')


if __name__ == '__main__':
    main()
