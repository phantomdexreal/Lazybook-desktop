"""fx_source - the SOURCE MODEL of the synthetic fixture company ("Demo Traders Pvt Ltd").

Everything here is invented. build_fixtures.py turns this model into per-table JSON rows and mock Tally XML.
compute_expected.py never imports this file: it recomputes golden numbers from the generated table JSON only.
"""
import os
import sys
import uuid
from decimal import Decimal as D, ROUND_HALF_UP

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lbmodel import canon, q, dec, default_row  # noqa: E402

NS = uuid.UUID('6c1f6d0e-2b52-4f0f-9f6e-5a1d3b2c4e11')
AS_OF = '2026-09-30'
FY_START, FY_END = '2026-04-01', '2027-03-31'
M, W, PB = 'Main Location', 'Warehouse 2', 'Primary Batch'
COMPANY_NAME = 'Demo Traders Pvt Ltd'
COMPANY_STATE = 'Maharashtra'
COMPANY_GSTIN = '27AAACD1234E1Z5'

_counter = {}


def guid(kind, name):
    key = (kind, name)
    if key not in _counter:
        _counter[key] = len(_counter) + 1
    return '%s-%08x' % (uuid.uuid5(NS, kind + ':' + name), _counter[key])


COMPANY_GUID = guid('company', COMPANY_NAME)

_alter = [0]


def next_alter():
    _alter[0] += 1
    return _alter[0]


# ----------------------------------------------------------------- reference ---
KIND_BY_TALLY_NAME = {}  # filled by build from data_model seed


def r2(v):
    return q(v, 2)


def rnd0(v):
    return dec(v).quantize(D(1), rounding=ROUND_HALF_UP)


# ------------------------------------------------------------------- masters ---
# name, parent, reserved_name, is_revenue, is_deemed_positive, affects_gross_profit
GROUPS = [
    ('Capital Account', '', 'Capital Account', False, False, False),
    ('Current Assets', '', 'Current Assets', False, True, False),
    ('Current Liabilities', '', 'Current Liabilities', False, False, False),
    ('Cash-in-Hand', 'Current Assets', 'Cash-in-Hand', False, True, False),
    ('Bank Accounts', 'Current Assets', 'Bank Accounts', False, True, False),
    ('Sundry Debtors', 'Current Assets', 'Sundry Debtors', False, True, False),
    ('Key Customers', 'Sundry Debtors', '', False, True, False),
    ('Stock-in-Hand', 'Current Assets', 'Stock-in-Hand', False, True, False),
    ('Suppliers', 'Current Liabilities', 'Sundry Creditors', False, False, False),   # renamed reserved group
    ('Duties & Taxes', 'Current Liabilities', 'Duties & Taxes', False, False, False),
    ('Sales Accounts', '', 'Sales Accounts', True, False, True),
    ('Purchase Accounts', '', 'Purchase Accounts', True, True, True),
    ('Indirect Expenses', '', 'Indirect Expenses', True, True, False),
]

# name, group, opening (signed, Dr negative), state, gstin, credit_days, billwise, gst_head/rate info
LEDGERS = [
    dict(name='Cash', group='Cash-in-Hand', opening='-25000', bill=False),
    dict(name='HDFC Bank', group='Bank Accounts', opening='-150000', bill=False, bank=dict(bank_name='HDFC Bank', bank_account_no='50100012345678', bank_branch='Fort', bank_ifsc='HDFC0000001', bank_acc_holder=COMPANY_NAME)),
    dict(name='Alpha Retail', group='Key Customers', opening='-20000', bill=True, state='Maharashtra', gstin='27AAAPA1111A1Z1', credit=30, phone='02240001111', mobile='9820000001', contact='Anil Shah', email='accounts@alpha.example.invalid', addr=['12 Market Road', 'Dadar', 'Mumbai'], pin='400014', open_bills=[('INV-OPEN-01', '2026-03-15', '-20000', 30)]),
    dict(name='Beta Stores', group='Sundry Debtors', opening='-10000', bill=True, state='Karnataka', gstin='29AAAPB2222B1Z2', credit=45, phone='08040002222', mobile='9820000002', contact='Bina Rao', email='pay@beta.example.invalid', addr=['7 Brigade Lane', 'Bengaluru'], pin='560001', open_bills=[('B-OPEN-07', '2026-02-20', '-10000', 45)]),
    dict(name='Gamma Enterprises', group='Sundry Debtors', opening='0', bill=True, state='Maharashtra', gstin='27AAAPG3333C1Z3', credit=15, phone='02240003333', mobile='9820000003', contact='Gopal Iyer', email='buy@gamma.example.invalid', addr=['Plot 4', 'MIDC Andheri', 'Mumbai'], pin='400093'),
    dict(name='Omega Supplies', group='Suppliers', opening='30000', bill=True, state='Maharashtra', gstin='27AAAPO4444D1Z4', credit=30, phone='02240004444', mobile='9820000004', contact='Om Mehta', email='sales@omega.example.invalid', addr=['88 Supply Park', 'Thane'], pin='400601', open_bills=[('PUR-OPEN-03', '2026-03-20', '30000', 30)]),
    dict(name='Zeta Wholesale', group='Suppliers', opening='0', bill=True, state='Gujarat', gstin='24AAAPZ5555E1Z5', credit=45, phone='07940005555', mobile='9820000005', contact='Zara Patel', email='orders@zeta.example.invalid', addr=['5 Ring Road', 'Surat'], pin='395002'),
    dict(name='Sales', group='Sales Accounts', opening='0', bill=False),
    dict(name='Purchases', group='Purchase Accounts', opening='0', bill=False),
    dict(name='Output CGST', group='Duties & Taxes', opening='0', bill=False, tax=('Central Tax', 'Output')),
    dict(name='Output SGST', group='Duties & Taxes', opening='0', bill=False, tax=('State Tax', 'Output')),
    dict(name='Output IGST', group='Duties & Taxes', opening='0', bill=False, tax=('Integrated Tax', 'Output')),
    dict(name='Input CGST', group='Duties & Taxes', opening='0', bill=False, tax=('Central Tax', 'Input')),
    dict(name='Input SGST', group='Duties & Taxes', opening='0', bill=False, tax=('State Tax', 'Input')),
    dict(name='Input IGST', group='Duties & Taxes', opening='0', bill=False, tax=('Integrated Tax', 'Input')),
    dict(name='Rent', group='Indirect Expenses', opening='0', bill=False),
    dict(name='Salaries', group='Indirect Expenses', opening='0', bill=False),
    dict(name='Round Off', group='Indirect Expenses', opening='0', bill=False),
    dict(name='Owner Capital', group='Capital Account', opening=None, bill=False),   # balancing figure computed below
]

UNITS = [('Nos', 'NOS'), ('Kgs', 'KGS')]
GODOWNS = [M, W]
STOCK_GROUPS = [('Hardware', ''), ('Consumables', '')]

# name, group, unit, hsn, gst total rate, batch_wise, opening list [(godown, batch, qty, value)]
ITEMS = [
    dict(name='Widget A', group='Hardware', unit='Nos', hsn='8479', rate=18, batch=False, open=[(M, PB, '100', '5000')]),
    dict(name='Widget B', group='Hardware', unit='Nos', hsn='8480', rate=12, batch=False, open=[(M, PB, '40', '4800')]),
    dict(name='Gadget C', group='Hardware', unit='Nos', hsn='8543', rate=18, batch=False, open=[]),
    dict(name='Part D', group='Hardware', unit='Kgs', hsn='7318', rate=5, batch=False, open=[(W, PB, '200', '2000')]),
    dict(name='Tonic Syrup', group='Consumables', unit='Nos', hsn='2106', rate=12, batch=True, open=[(M, 'B-2601', '50', '4000')]),
    dict(name='Bolt Pack', group='Hardware', unit='Nos', hsn='7318', rate=18, batch=False, open=[(M, PB, '30', '750'), (W, PB, '30', '750')]),
]
ITEM = {i['name']: i for i in ITEMS}
LEDGER = {l['name']: l for l in LEDGERS}

OUTPUT_TAX = {'cgst': 'Output CGST', 'sgst': 'Output SGST', 'igst': 'Output IGST'}
INPUT_TAX = {'cgst': 'Input CGST', 'sgst': 'Input SGST', 'igst': 'Input IGST'}

VOUCHER_TYPES = [  # name, parent
    ('Tax Invoice', 'Sales'), ('Sales', ''), ('Purchase', ''), ('Receipt', ''), ('Payment', ''), ('Contra', ''), ('Journal', ''),
    ('Credit Note', ''), ('Debit Note', ''), ('Delivery Note', ''), ('Receipt Note', ''), ('Sales Order', ''), ('Purchase Order', ''),
    ('Sales Quotation', 'Sales Order'), ('Stock Journal', ''),
]
QUOTATION_TYPE = 'Sales Quotation'
TYPE_KIND = {'Tax Invoice': 'sales', 'Sales': 'sales', 'Purchase': 'purchase', 'Receipt': 'receipt', 'Payment': 'payment', 'Contra': 'contra', 'Journal': 'journal',
             'Credit Note': 'credit_note', 'Debit Note': 'debit_note', 'Delivery Note': 'delivery_note', 'Receipt Note': 'receipt_note', 'Sales Order': 'sales_order',
             'Purchase Order': 'purchase_order', 'Sales Quotation': 'sales_order', 'Stock Journal': 'stock_journal'}
PARTY_SIDE = {'sales': 'dr', 'purchase': 'cr', 'credit_note': 'cr', 'debit_note': 'dr', 'receipt': 'cr', 'payment': 'dr'}
STOCK_SIGN = {'sales': 1, 'debit_note': 1, 'delivery_note': 1, 'sales_order': 1, 'purchase': -1, 'credit_note': -1, 'receipt_note': -1, 'purchase_order': -1}

# ----------------------------------------------------------------- vouchers ---
VOUCHERS = []   # list of dict (source vouchers, fully computed)
BILL_TOTAL = {}  # (ledger, bill name) -> signed amount created (for settlement helpers)
VNO = {}


def party_state(name):
    return LEDGER[name].get('state', COMPANY_STATE)


def item_rate_split(item, intra):
    total = dec(ITEM[item]['rate'])
    if intra:
        return {'cgst': total / 2, 'sgst': total / 2}
    return {'igst': total}


def _alloc_lines(item_spec):
    """item_spec: dict(item, qty, rate, allocs=[(godown,batch,qty)], disc, order_no, order_due)"""
    return item_spec['allocs']


def mk_item(item, qty, rate, godown=M, batch=None, disc=0, order_no='', order_due=None, allocs=None):
    batch = batch or PB
    return dict(item=item, qty=dec(qty), rate=dec(rate), disc=dec(disc), order_no=order_no, order_due=order_due,
                allocs=allocs or [(godown, batch, dec(qty))])


def add_voucher(v):
    v['guid'] = guid('voucher', '%s|%s' % (v['vtype'], v['number']))
    v['alter_id'] = next_alter()
    v['master_id'] = 1000 + len(VOUCHERS)
    VOUCHERS.append(v)
    return v


def invoice(date, vtype, number, party, items, ref='', due=None, remote_id='', bills=None, narration='', cancelled=False, optional=False, party_gstin=None):
    kind = TYPE_KIND[vtype]
    psign = -1 if PARTY_SIDE[kind] == 'dr' else 1
    isign = -psign
    intra = party_state(party) == COMPANY_STATE
    is_sales_side = kind in ('sales', 'credit_note')
    item_ledger = 'Sales' if is_sales_side else 'Purchases'
    tax_map = OUTPUT_TAX if is_sales_side else INPUT_TAX
    lines = []
    tax_acc = {}
    taxlines = []
    for idx, it in enumerate(items):
        amt = r2(it['qty'] * it['rate'] * (1 - it['disc'] / 100))
        it['amount'] = amt
        for head, rate in item_rate_split(it['item'], intra).items():
            t4 = q(amt * rate / 100, 4)
            tax_acc[head] = tax_acc.get(head, D(0)) + t4
            taxlines.append(dict(line=idx, head=head, rate=rate, taxable=amt, tax=t4, hsn=ITEM[it['item']]['hsn']))
    taxes = {h: r2(v) for h, v in tax_acc.items()}
    raw = sum((it['amount'] for it in items), D(0)) + sum(taxes.values(), D(0))
    total = rnd0(raw)
    ro = total - raw
    v = dict(date=date, vtype=vtype, number=number, kind=kind, party=party, items=items, ref=ref, remote_id=remote_id, narration=narration,
             cancelled=cancelled, optional=optional, intra=intra, taxes=taxes, taxlines=taxlines, total=total, raw=raw, roundoff=ro, item_sign=isign,
             party_sign=psign, item_ledger=item_ledger, tax_map=tax_map, due=due, party_gstin=party_gstin)
    bill_name = ref if ref else number
    v['bills'] = bills(total, bill_name) if callable(bills) else [('New Ref', bill_name, total)]
    v['bill_default_name'] = bill_name
    add_voucher(v)
    if not cancelled and not optional:
        for typ, name, amt in v['bills']:
            if typ in ('New Ref', 'Advance'):
                BILL_TOTAL[(party, name)] = BILL_TOTAL.get((party, name), D(0)) + psign * dec(amt)
    return v


def settle_total(party, bill):
    return abs(BILL_TOTAL[(party, bill)])


def receipt_like(date, vtype, number, party, amount, bank, allocs, narration='', remote_id=''):
    """allocs: list of (type, name, amount or 'full'/'half'). Sign follows the party side."""
    kind = TYPE_KIND[vtype]
    psign = -1 if PARTY_SIDE[kind] == 'dr' else 1   # payment: party Dr (-), receipt: party Cr (+)
    resolved = []
    for typ, name, amt in allocs:
        if amt in ('full', 'half'):
            base = abs(BILL_TOTAL[(party, name)])
            amt = base if amt == 'full' else r2(base / 2)
        resolved.append((typ, name, dec(amt)))
    total = sum((a for _, _, a in resolved), D(0)) if allocs else dec(amount)
    v = dict(date=date, vtype=vtype, number=number, kind=kind, party=party, bank=bank, total=total, bills=resolved, narration=narration, remote_id=remote_id,
             cancelled=False, optional=False, party_sign=psign, items=[], ref='')
    add_voucher(v)
    for typ, name, amt in resolved:
        if typ in ('New Ref', 'Advance'):
            BILL_TOTAL[(party, name)] = BILL_TOTAL.get((party, name), D(0)) + psign * amt
    return v


def direct_voucher(date, vtype, number, lines, narration='', bills=None):
    """lines: list of (ledger, signed amount). Contra/journal/payment-without-party."""
    kind = TYPE_KIND[vtype]
    v = dict(date=date, vtype=vtype, number=number, kind=kind, party='', lines=[(l, dec(a)) for l, a in lines], narration=narration, bills=bills or {},
             cancelled=False, optional=False, items=[], ref='', remote_id='')
    add_voucher(v)
    if bills:
        for ledger, lst in bills.items():
            for typ, name, amt in lst:
                if typ in ('New Ref', 'Advance'):
                    BILL_TOTAL[(ledger, name)] = BILL_TOTAL.get((ledger, name), D(0)) + dec(amt)
    return v


def inv_only(date, vtype, number, party, items, narration='', due=None, journal=None):
    kind = TYPE_KIND[vtype]
    isign = STOCK_SIGN.get(kind, 1)
    for it in items:
        it['amount'] = r2(it['qty'] * it['rate'])
    v = dict(date=date, vtype=vtype, number=number, kind=kind, party=party, items=items, narration=narration, item_sign=isign, cancelled=False, optional=False,
             ref='', remote_id='', due=due, bills=[], journal=journal)
    add_voucher(v)
    return v


def build_vouchers():
    VOUCHERS.clear()
    BILL_TOTAL.clear()
    # open bills known to settlement helpers
    for l in LEDGERS:
        l['open_bills_map'] = {}
        for (name, dt, amt, cp) in l.get('open_bills', []):
            l['open_bills_map'][name] = abs(dec(amt))
            BILL_TOTAL[(l['name'], name)] = dec(amt)
    I = mk_item
    # ---- purchases
    invoice('2026-04-02', 'Purchase', 'P-001', 'Omega Supplies', [I('Widget A', 100, 52), I('Gadget C', 50, 150)], ref='SUP-1001')
    invoice('2026-04-10', 'Purchase', 'P-002', 'Zeta Wholesale', [I('Tonic Syrup', 100, 82, batch='T-2604'), I('Part D', 300, 11, W)], ref='ZW-501')
    invoice('2026-04-20', 'Purchase', 'P-003', 'Omega Supplies', [I('Widget B', 60, 110), I('Bolt Pack', 100, 24, allocs=[(M, PB, 50), (W, PB, 50)])], ref='SUP-1002')
    invoice('2026-05-08', 'Purchase', 'P-004', 'Omega Supplies', [I('Widget A', 80, 53, order_no='PO-001'), I('Gadget C', 30, 155)], ref='SUP-1010')
    invoice('2026-06-12', 'Purchase', 'P-005', 'Zeta Wholesale', [I('Tonic Syrup', 80, 84, batch='T-2606'), I('Widget B', 40, 115)], ref='ZW-519')
    invoice('2026-07-15', 'Purchase', 'P-006', 'Omega Supplies', [I('Widget A', 60, 54), I('Bolt Pack', 60, 26)], ref='SUP-1031')
    invoice('2026-08-20', 'Purchase', 'P-007', 'Omega Supplies', [I('Gadget C', 40, 158)], ref='SUP-1050')
    invoice('2026-09-10', 'Purchase', 'P-008', 'Zeta Wholesale', [I('Part D', 200, 12, W), I('Tonic Syrup', 50, 85, batch='T-2609')], ref='ZW-540')
    # ---- orders and quotation
    inv_only('2026-04-18', 'Sales Order', 'SO-001', 'Alpha Retail', [I('Widget A', 50, 82, order_no='SO-001', order_due='2026-06-30'), I('Gadget C', 5, 262, order_no='SO-001', order_due='2026-05-31')])
    inv_only('2026-05-02', 'Purchase Order', 'PO-001', 'Omega Supplies', [I('Widget A', 100, 53, order_no='PO-001', order_due='2026-06-15')])
    inv_only('2026-06-01', 'Sales Quotation', 'Q-001', 'Alpha Retail', [I('Widget A', 100, 79, order_no='Q-001', order_due='2026-06-30')])
    inv_only('2026-08-01', 'Sales Order', 'SO-002', 'Beta Stores', [I('Widget B', 30, 208, order_no='SO-002', order_due='2026-10-10')])
    # ---- sales
    invoice('2026-04-05', 'Tax Invoice', 'TI-001', 'Alpha Retail', [I('Widget A', 10, 80), I('Widget B', 5, 200)])
    invoice('2026-04-12', 'Tax Invoice', 'TI-002', 'Beta Stores', [I('Widget A', 20, 78), I('Bolt Pack', 20, 45)])
    invoice('2026-04-25', 'Tax Invoice', 'TI-003', 'Gamma Enterprises', [I('Gadget C', 10, 260), I('Tonic Syrup', 15, 140, batch='T-2604')])
    invoice('2026-05-10', 'Tax Invoice', 'TI-004', 'Alpha Retail', [I('Widget A', 30, 82, order_no='SO-001'), I('Gadget C', 10, 262)])
    invoice('2026-05-22', 'Tax Invoice', 'TI-005', 'Beta Stores', [I('Tonic Syrup', 30, 141, batch='T-2604'), I('Part D', 50, 25, W)])
    invoice('2026-06-03', 'Tax Invoice', 'TI-006', 'Gamma Enterprises', [I('Widget B', 20, 205), I('Bolt Pack', 25, 46, W)])
    invoice('2026-06-18', 'Tax Invoice', 'TI-007', 'Alpha Retail', [I('Widget A', 25, 80), I('Tonic Syrup', 20, 142, batch='T-2606')])
    # advance of 5,000 received on 06-10 is adjusted in TI-008 (Agst Ref) - receipt first
    receipt_like('2026-06-10', 'Receipt', 'R-003', 'Beta Stores', 5000, 'HDFC Bank', [('Advance', 'ADV-BETA-1', 5000)], narration='Advance against next order')
    def bills_ti008(total, name):
        return [('Agst Ref', 'ADV-BETA-1', D(5000)), ('New Ref', name, total - D(5000))]
    invoice('2026-07-02', 'Tax Invoice', 'TI-008', 'Beta Stores', [I('Gadget C', 20, 265), I('Widget A', 15, 81)], bills=bills_ti008)
    invoice('2026-07-20', 'Tax Invoice', 'TI-009', 'Gamma Enterprises', [I('Part D', 100, 24, W), I('Bolt Pack', 30, 47, W)])
    invoice('2026-08-05', 'Tax Invoice', 'TI-010', 'Alpha Retail', [I('Widget B', 15, 210), I('Tonic Syrup', 25, 143, batch='T-2606')])
    invoice('2026-08-28', 'Tax Invoice', 'TI-011', 'Beta Stores', [I('Widget A', 40, 82), I('Gadget C', 15, 268)])
    invoice('2026-09-12', 'Sales', 'S-001', 'Gamma Enterprises', [I('Tonic Syrup', 30, 145, batch='T-2606')])
    invoice('2026-09-25', 'Sales', 'S-002', 'Alpha Retail', [I('Widget A', 20, 83), I('Widget B', 10, 212)], remote_id='11111111-1111-4111-8111-111111111111', narration='Entered from phone')
    invoice('2026-09-26', 'Tax Invoice', 'TI-012', 'Beta Stores', [I('Widget A', 5, 80)], cancelled=True, narration='Cancelled: wrong party')
    invoice('2026-09-27', 'Tax Invoice', 'TI-013', 'Gamma Enterprises', [I('Widget B', 5, 205)], optional=True, narration='Optional: awaiting approval')
    # ---- returns
    invoice('2026-07-10', 'Credit Note', 'CN-001', 'Alpha Retail', [I('Widget A', 5, 82)], ref='', bills=lambda total, name: [('Agst Ref', 'TI-004', total)], narration='Return against TI-004')
    invoice('2026-08-02', 'Debit Note', 'DN-001', 'Omega Supplies', [I('Gadget C', 5, 155)], ref='', bills=lambda total, name: [('Agst Ref', 'SUP-1010', total)], narration='Return against SUP-1010')
    # ---- delivery / receipt notes and stock journal
    inv_only('2026-05-12', 'Receipt Note', 'RCN-001', 'Omega Supplies', [I('Bolt Pack', 20, 24)])
    inv_only('2026-06-20', 'Delivery Note', 'DLN-001', 'Gamma Enterprises', [I('Widget B', 10, 205)])
    sj = dict(date='2026-07-01', vtype='Stock Journal', number='SJ-001', kind='stock_journal', party='', items=[], narration='Move Widget A to Warehouse 2', cancelled=False,
              optional=False, ref='', remote_id='', bills=[], journal=dict(src=[I('Widget A', 20, 55, M)], dst=[I('Widget A', 20, 55, W)]))
    for it in sj['journal']['src'] + sj['journal']['dst']:
        it['amount'] = r2(it['qty'] * it['rate'])
    add_voucher(sj)
    # ---- receipts
    receipt_like('2026-04-20', 'Receipt', 'R-001', 'Alpha Retail', 0, 'HDFC Bank', [('Agst Ref', 'INV-OPEN-01', 'full')])
    receipt_like('2026-05-05', 'Receipt', 'R-002', 'Alpha Retail', 0, 'HDFC Bank', [('Agst Ref', 'TI-001', 1000)])
    receipt_like('2026-05-20', 'Receipt', 'R-006', 'Gamma Enterprises', 0, 'Cash', [('Agst Ref', 'TI-003', 'full')])
    receipt_like('2026-07-05', 'Receipt', 'R-004', 'Gamma Enterprises', 3000, 'Cash', [('On Account', '', 3000)])
    receipt_like('2026-07-25', 'Receipt', 'R-005', 'Beta Stores', 0, 'HDFC Bank', [('Agst Ref', 'TI-002', 'full'), ('Agst Ref', 'B-OPEN-07', 'full')])
    receipt_like('2026-08-30', 'Receipt', 'R-008', 'Gamma Enterprises', 0, 'HDFC Bank', [('Agst Ref', 'TI-006', 'half')])
    receipt_like('2026-09-28', 'Receipt', 'R-007', 'Alpha Retail', 3000, 'HDFC Bank', [('Agst Ref', 'TI-004', 3000)], remote_id='22222222-2222-4222-8222-222222222222', narration='Entered from phone')
    # ---- payments
    receipt_like('2026-04-15', 'Payment', 'PY-001', 'Omega Supplies', 0, 'HDFC Bank', [('Agst Ref', 'PUR-OPEN-03', 'full')])
    receipt_like('2026-05-15', 'Payment', 'PY-002', 'Zeta Wholesale', 0, 'HDFC Bank', [('Agst Ref', 'ZW-501', 'half')])
    receipt_like('2026-06-25', 'Payment', 'PY-003', 'Omega Supplies', 10000, 'HDFC Bank', [('Advance', 'ADV-OMG-1', 10000)])
    receipt_like('2026-08-10', 'Payment', 'PY-004', 'Omega Supplies', 2000, 'Cash', [('On Account', '', 2000)])
    receipt_like('2026-09-15', 'Payment', 'PY-008', 'Omega Supplies', 0, 'HDFC Bank', [('Agst Ref', 'SUP-1001', 'full')])
    direct_voucher('2026-04-30', 'Payment', 'PY-005', [('Rent', -12000), ('HDFC Bank', 12000)], narration='Rent April')
    direct_voucher('2026-07-31', 'Payment', 'PY-006', [('Rent', -12000), ('HDFC Bank', 12000)], narration='Rent July')
    direct_voucher('2026-09-29', 'Payment', 'PY-007', [('Rent', -12000), ('HDFC Bank', 12000)], narration='Rent September')
    # ---- contra, journal
    direct_voucher('2026-05-02', 'Contra', 'C-001', [('HDFC Bank', -10000), ('Cash', 10000)], narration='Cash deposited')
    direct_voucher('2026-08-15', 'Contra', 'C-002', [('Cash', -15000), ('HDFC Bank', 15000)], narration='Cash withdrawn')
    direct_voucher('2026-06-30', 'Journal', 'J-001', [('Salaries', -30000), ('HDFC Bank', 30000)], narration='Salaries June quarter')
    direct_voucher('2026-09-30', 'Journal', 'J-002', [('Rent', -5000), ('Omega Supplies', 5000)], narration='Godown rent billed by supplier',
                   bills={'Omega Supplies': [('New Ref', 'RENT-SEP', D(5000))]})
    VOUCHERS.sort(key=lambda v: (v['date'], v['number']))
    return VOUCHERS
