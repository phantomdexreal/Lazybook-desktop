"""build_fixtures - turns fx_source.py into fixtures/tables/*.json (and tally_xml via tally_xml_io).

Run:  python3 -I build_fixtures.py        (from anywhere)
"""
import json
import os
import sys
from decimal import Decimal as D

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import fx_source as S  # noqa: E402
from lbmodel import SHARED, load_model, default_row, canon, q, dec, check_row  # noqa: E402

FIX = os.path.join(SHARED, 'fixtures')
MODEL = load_model()
SEED = {r['kind']: r for r in MODEL['tables']['ref_voucher_kind']['seed_rows']}


def row(table, **kw):
    r = default_row(MODEL, table)
    for k, v in kw.items():
        r[k] = v
    for c in MODEL['tables'][table]['columns']:
        if c['type'] == 'decimal':
            r[c['name']] = canon(r[c['name']])
    return r


def pct(v):
    return canon(v)


def build():
    S._alter[0] = 0
    S._counter.clear()
    cg = S.guid('company', S.COMPANY_NAME)
    S.COMPANY_GUID = cg
    T = {t: [] for t in MODEL['tables_order']}

    # ---- groups
    gname = {}
    for (name, parent, reserved, rev, dp, agp) in S.GROUPS:
        gname[name] = dict(name=name, parent=parent, reserved=reserved, rev=rev, dp=dp, agp=agp, guid=S.guid('group', name), alter=S.next_alter())
    def root(name):
        g = gname[name]
        if g['reserved']:
            return g['reserved']
        return root(g['parent']) if g['parent'] else ''
    def nature(g):
        return {(False, True): 'asset', (False, False): 'liability', (True, True): 'expense', (True, False): 'income'}[(g['rev'], g['dp'])]
    # ---- ledgers
    ledgers = {}
    for l in S.LEDGERS:
        ledgers[l['name']] = dict(l, guid=S.guid('ledger', l['name']), alter=S.next_alter())
    # ---- items
    for it in S.ITEMS:
        it['guid'] = S.guid('stockitem', it['name'])
        it['alter'] = S.next_alter()
    vts = {}
    for (name, parent) in S.VOUCHER_TYPES:
        vts[name] = dict(name=name, parent=parent, guid=S.guid('vtype', name), alter=S.next_alter())
    vouchers = S.build_vouchers()

    # ---- opening stock value and capital
    os_total = sum((dec(v) for it in S.ITEMS for (_, _, _, v) in it['open']), D(0))
    dr_open = sum((dec(l['opening']) for l in S.LEDGERS if l['opening'] not in (None,)), D(0))
    ledgers['Owner Capital']['opening'] = canon(os_total - dr_open)   # keeps sum(openings) = opening stock value

    # ---- voucher children
    LL, IL, BA, BL, TX, VH = [], [], [], [], [], []
    for v in vouchers:
        kind = v['kind']
        cancelled, optional = v['cancelled'], v['optional']
        active = not (cancelled or optional)
        vt = vts[v['vtype']]
        party = v.get('party', '')
        lines = []      # (ledger, amount, is_party, source, inv_index)
        inv = []        # dicts
        bills_for_line = {}   # ledger line index -> [(type,name,signed amount, credit_days)]
        if cancelled:
            pass
        elif kind in ('sales', 'purchase', 'credit_note', 'debit_note'):
            ps, isg = v['party_sign'], v['item_sign']
            lines.append((party, ps * v['total'], True, 'ledger', -1))
            order = [h for h in ('cgst', 'sgst', 'igst') if h in v['taxes']]
            for h in order:
                lines.append((v['tax_map'][h], isg * v['taxes'][h], False, 'ledger', -1))
            if v['roundoff'] != 0:
                lines.append(('Round Off', isg * v['roundoff'], False, 'ledger', -1))
            for i, it in enumerate(v['items']):
                inv.append(dict(it=it, sign=isg, amount=it['amount']))
            for i, it in enumerate(v['items']):
                lines.append((v['item_ledger'], isg * it['amount'], False, 'inv_alloc', i))
            cp = ledgers[party].get('credit', 0)
            bills_for_line[0] = [(t, n, ps * dec(a), (cp if t == 'New Ref' else 0)) for (t, n, a) in v['bills']]
        elif kind in ('receipt', 'payment') and party:
            ps = v['party_sign']
            lines.append((party, ps * v['total'], True, 'ledger', -1))
            lines.append((v['bank'], -ps * v['total'], False, 'ledger', -1))
            bills_for_line[0] = [(t, n, ps * dec(a), 0) for (t, n, a) in v['bills']]
        elif kind in ('contra', 'journal', 'payment', 'receipt'):
            for (l, a) in v['lines']:
                lines.append((l, a, False, 'ledger', -1))
            for l, lst in (v.get('bills') or {}).items():
                idx = [i for i, x in enumerate(lines) if x[0] == l][0]
                bills_for_line[idx] = [(t, n, dec(a), 0) for (t, n, a) in lst]
        elif kind in ('delivery_note', 'receipt_note', 'sales_order', 'purchase_order'):
            if not cancelled:
                for it in v['items']:
                    inv.append(dict(it=it, sign=v['item_sign'], amount=it['amount']))
        elif kind == 'stock_journal':
            for it in v['journal']['src']:
                inv.append(dict(it=it, sign=1, amount=it['amount'], dest=False))
            for it in v['journal']['dst']:
                inv.append(dict(it=it, sign=-1, amount=it['amount'], dest=True))
        # header amount
        if cancelled:
            amount = D(0)
        elif kind in ('sales', 'purchase', 'credit_note', 'debit_note', 'receipt', 'payment') and party:
            amount = v['total']
        elif lines:
            amount = sum((-a for (_, a, _, _, _) in lines if a < 0), D(0))
        else:
            amount = sum((x['amount'] for x in inv if not x.get('dest')), D(0))
        pledger = ledgers.get(party)
        gst_kinds = kind in ('sales', 'purchase', 'credit_note', 'debit_note')
        VH.append(row('tx_voucher', company_guid=cg, guid=v['guid'], alter_id=v['alter_id'], master_id=v['master_id'], voucher_type_name=v['vtype'],
                      voucher_type_guid=vt['guid'], kind=kind, date=v['date'], number=v['number'], reference=v.get('ref', ''), narration=v.get('narration', ''),
                      party_name=party, party_guid=(pledger['guid'] if pledger else ''), party_gstin=(pledger.get('gstin', '') if pledger else ''),
                      company_gstin=S.COMPANY_GSTIN if gst_kinds else '', place_of_supply=(pledger.get('state', '') if pledger and gst_kinds else ''),
                      state_name=(pledger.get('state', '') if pledger and gst_kinds else ''), address=(pledger.get('addr') if pledger and gst_kinds else None),
                      is_invoice=gst_kinds, is_optional=optional, is_cancelled=cancelled, counts_in_books=active, amount=amount,
                      due_days=(pledger.get('credit', 0) if pledger and gst_kinds else 0), order_ref='', remote_id=v.get('remote_id', ''), entered_by='admin',
                      gst_registration_type=('Regular' if gst_kinds else '')))
        vd = dict(voucher_date=v['date'], voucher_kind=kind, counts_in_books=active)
        lidx = {}
        for i, (l, a, isp, src, ii) in enumerate(lines):
            led = ledgers[l]
            LL.append(row('tx_ledger_line', company_guid=cg, voucher_guid=v['guid'], line_index=i, source=src, inv_line_index=ii, ledger_name=l, ledger_guid=led['guid'],
                          amount=a, is_deemed_positive=(a < 0), is_party_ledger=isp, **vd))
        for i, x in enumerate(inv):
            it = x['it']
            item = S.ITEM[it['item']]
            firstg = it['allocs'][0][0]
            gst = ''
            IL.append(row('tx_inventory_line', company_guid=cg, voucher_guid=v['guid'], line_index=i, stock_item_name=it['item'], stock_item_guid=item['guid'],
                          billed_qty=it['qty'], actual_qty=it['qty'], unit=item['unit'], rate=it['rate'], rate_unit=item['unit'], discount_pct=it['disc'],
                          amount=x['sign'] * x['amount'], is_deemed_positive=(x['sign'] < 0), hsn_code=item['hsn'], godown_name=firstg,
                          godown_guid='n:' + firstg, **vd))
            tot = D(0)
            for j, (gd, bt, qty) in enumerate(it['allocs']):
                if j == len(it['allocs']) - 1:
                    am = x['amount'] - tot
                else:
                    am = S.r2(dec(qty) * it['rate'] * (1 - it['disc'] / 100))
                tot += am
                BA.append(row('tx_batch_alloc', company_guid=cg, voucher_guid=v['guid'], line_index=i, alloc_index=j, stock_item_guid=item['guid'],
                              godown_name=gd, godown_guid='n:' + gd, batch_name=bt, billed_qty=dec(qty), actual_qty=dec(qty), amount=x['sign'] * am,
                              order_no=it.get('order_no', ''), order_due_date=it.get('order_due'), tracking_no='', is_destination=bool(x.get('dest')), **vd))
        for li, lst in bills_for_line.items():
            l = lines[li]
            for j, (t, n, a, cpd) in enumerate(lst):
                BL.append(row('tx_bill_alloc', company_guid=cg, voucher_guid=v['guid'], line_index=li, alloc_index=j, ledger_guid=ledgers[l[0]]['guid'], ledger_name=l[0],
                              bill_name=n, bill_type=t, amount=a, credit_period_days=cpd, **vd))
        if gst_kinds and not cancelled:
            for tl in v['taxlines']:
                TX.append(row('tx_tax_line', company_guid=cg, voucher_guid=v['guid'], source='inventory', line_index=tl['line'], tax_head=tl['head'], rate=pct(tl['rate']),
                              taxable_amount=tl['taxable'], tax_amount=tl['tax'], hsn_code=tl['hsn'], **vd))
    T['tx_voucher'], T['tx_ledger_line'], T['tx_inventory_line'], T['tx_batch_alloc'], T['tx_bill_alloc'], T['tx_tax_line'] = VH, LL, IL, BA, BL, TX

    # ---- closing balances
    closing = {n: dec(l['opening']) for n, l in ledgers.items()}
    for r in LL:
        if r['counts_in_books']:
            closing[r['ledger_name']] += dec(r['amount'])
    gclose = {n: D(0) for n in gname}
    def ancestors(n):
        while n:
            yield n
            n = gname[n]['parent']
    gopen = {n: D(0) for n in gname}
    for n, l in ledgers.items():
        for g in ancestors(l['group']):
            gclose[g] += closing[n]
            gopen[g] += dec(l['opening'])

    # ---- stock valuation (weighted average, perpetual, item level) - fixture synthetic
    sstate = {}
    for it in S.ITEMS:
        qty = sum((dec(x[2]) for x in it['open']), D(0))
        val = sum((dec(x[3]) for x in it['open']), D(0))
        sstate[it['name']] = [qty, val, (val / qty if qty else D(0))]
    sold_last = {}
    hdr = {r['guid']: r for r in VH}
    for v in vouchers:
        if v['cancelled'] or v['optional']:
            continue
        k = v['kind']
        if k in ('purchase', 'receipt_note'):
            for it in v['items']:
                st = sstate[it['item']]
                st[0] += it['qty']; st[1] += it['amount']; st[2] = st[1] / st[0]
        elif k == 'credit_note':
            for it in v['items']:
                st = sstate[it['item']]
                st[0] += it['qty']; st[1] += it['qty'] * st[2]
        elif k in ('sales', 'debit_note', 'delivery_note'):
            for it in v['items']:
                st = sstate[it['item']]
                st[0] -= it['qty']; st[1] -= it['qty'] * st[2]
                if k == 'sales':
                    sold_last[it['item']] = v['date']
    # ---- master rows
    comp_alter_m = S._alter[0]
    for n, g in gname.items():
        T['tm_group'].append(row('tm_group', company_guid=cg, guid=g['guid'], name=n, name_lc=n.lower(), parent_name=g['parent'], parent_guid=gname[g['parent']]['guid'] if g['parent'] else '',
                                 reserved_name=g['reserved'], reserved_root=root(n), is_revenue=g['rev'], is_deemed_positive=g['dp'], affects_gross_profit=g['agp'],
                                 is_billwise_on=n in ('Sundry Debtors', 'Key Customers', 'Suppliers'), nature=nature(g), closing_balance=gclose[n], opening_balance=gopen[n],
                                 closing_as_of=S.AS_OF, alter_id=g['alter']))
    for n, l in ledgers.items():
        g = gname[l['group']]
        r = row('tm_ledger', company_guid=cg, guid=l['guid'], name=n, name_lc=n.lower(), aliases=[], parent_name=l['group'], group_guid=g['guid'], reserved_root=root(l['group']),
                opening_balance=l['opening'], closing_balance=closing[n], closing_as_of=S.AS_OF, is_billwise_on=l['bill'], credit_period_days=l.get('credit', 0),
                gst_registration_type='Regular' if l.get('gstin') else '', gstin=l.get('gstin', ''), state_name=l.get('state', ''), country='India' if l.get('state') else '',
                pincode=l.get('pin', ''), email=l.get('email', ''), phone=l.get('phone', ''), mobile=l.get('mobile', ''), contact_person=l.get('contact', ''),
                address=l.get('addr'), alter_id=l['alter'])
        if l.get('bank'):
            r.update(l['bank'])
        if l.get('tax'):
            r['tax_type'] = 'GST'; r['gst_duty_head'] = l['tax'][0]
        if n == 'Round Off':
            r['rounding_method'] = 'Normal Rounding'; r['rounding_limit'] = '1.00'
        T['tm_ledger'].append(r)
        if l.get('addr'):
            T['tm_ledger_address'].append(row('tm_ledger_address', company_guid=cg, ledger_guid=l['guid'], addr_index=0, applicable_from=S.FY_START, mailing_name=n, lines=l['addr'],
                                              state_name=l.get('state', ''), country='India', pincode=l.get('pin', '')))
        if l.get('contact') or l.get('phone') or l.get('mobile') or l.get('email'):
            T['tm_ledger_contact'].append(row('tm_ledger_contact', company_guid=cg, ledger_guid=l['guid'], contact_index=0, name=l.get('contact', ''), phone=l.get('phone', ''),
                                              mobile=l.get('mobile', ''), email=l.get('email', ''), is_primary=True))
        if l.get('gstin'):
            T['tm_ledger_gst'].append(row('tm_ledger_gst', company_guid=cg, ledger_guid=l['guid'], applicable_from='2017-07-01', gst_registration_type='Regular', gstin=l['gstin'],
                                          place_of_supply=l.get('state', '')))
        for j, (bn, bd, ba, cp) in enumerate(l.get('open_bills', [])):
            T['tm_ledger_opening_bill'].append(row('tm_ledger_opening_bill', company_guid=cg, ledger_guid=l['guid'], bill_index=j, bill_name=bn, bill_date=bd, credit_period_days=cp, amount=ba))
    for n, vt in vts.items():
        T['tm_voucher_type'].append(row('tm_voucher_type', company_guid=cg, guid=vt['guid'], name=n, name_lc=n.lower(), parent_name=vt['parent'], base_kind=S.TYPE_KIND[n],
                                        numbering_method='Automatic', alter_id=vt['alter']))
    sg = {}
    for (n, p) in S.STOCK_GROUPS:
        sg[n] = S.guid('stockgroup', n)
        T['tm_stock_group'].append(row('tm_stock_group', company_guid=cg, guid=sg[n], name=n, name_lc=n.lower(), parent_name=p, base_units='', alter_id=S.next_alter()))
    for (n, code) in S.UNITS:
        T['tm_unit'].append(row('tm_unit', company_guid=cg, guid=S.guid('unit', n), name=n, is_simple_unit=True, gst_uqc=code, decimal_places=0 if n == 'Nos' else 3, alter_id=S.next_alter()))
    for n in S.GODOWNS:
        T['tm_godown'].append(row('tm_godown', company_guid=cg, guid='n:' + n, name=n, name_lc=n.lower(), alter_id=S.next_alter()))
    for it in S.ITEMS:
        oq = sum((dec(x[2]) for x in it['open']), D(0))
        ov = sum((dec(x[3]) for x in it['open']), D(0))
        cq, cv, _ = sstate[it['name']]
        cv = S.r2(cv) if cq > 0 else D(0)
        T['tm_stock_item'].append(row('tm_stock_item', company_guid=cg, guid=it['guid'], name=it['name'], name_lc=it['name'].lower(), aliases=[], parent_name=it['group'],
                                      parent_guid=sg[it['group']], base_unit=it['unit'], opening_qty=oq, opening_value=ov, closing_qty=cq, closing_value=cv,
                                      closing_rate=(S.r2(cv / cq) if cq > 0 else D(0)), closing_as_of=S.AS_OF, last_sale_date=sold_last.get(it['name']), gst_applicable=True,
                                      gst_type_of_supply='Goods', hsn_code=it['hsn'], is_batch_wise=it['batch'], costing_method='Avg. Cost', valuation_method='Avg. Cost',
                                      alter_id=it['alter']))
        rt = dec(it['rate'])
        T['tm_stock_item_gst'].append(row('tm_stock_item_gst', company_guid=cg, stock_item_guid=it['guid'], applicable_from='2017-07-01', hsn_code=it['hsn'], taxability='Taxable',
                                          igst_rate=pct(rt), cgst_rate=pct(rt / 2), sgst_rate=pct(rt / 2), cess_rate='0.00'))
        for (gd, bt, qq, vv) in it['open']:
            T['tm_stock_batch_opening'].append(row('tm_stock_batch_opening', company_guid=cg, stock_item_guid=it['guid'], godown_name=gd, godown_guid='n:' + gd, batch_name=bt,
                                                   opening_qty=qq, opening_value=vv))
    T['tm_currency'].append(row('tm_currency', company_guid=cg, guid=S.guid('currency', 'INR'), name='INR', formal_name='Indian Rupee', symbol='INR', decimal_places=2, alter_id=S.next_alter()))
    for (n, des) in [('Ravi Kumar', 'Sales Executive'), ('Sunita Joshi', 'Accountant')]:
        T['tm_employee'].append(row('tm_employee', company_guid=cg, guid=S.guid('employee', n), name=n, name_lc=n.lower(), employee_number='E-%d' % (len(T['tm_employee']) + 1),
                                    designation=des, date_of_joining='2024-04-01', alter_id=S.next_alter()))
    T['tm_gst_registration'].append(row('tm_gst_registration', company_guid=cg, guid=S.guid('taxunit', 'Maharashtra'), name='Maharashtra Registration', gstin=S.COMPANY_GSTIN,
                                        state_name='Maharashtra', registration_type='Regular', applicable_from='2017-07-01', alter_id=S.next_alter()))
    max_alter = S._alter[0]
    T['tm_company'].append(row('tm_company', guid=cg, name=S.COMPANY_NAME, basic_formal_name=S.COMPANY_NAME, starting_from=S.FY_START, books_from=S.FY_START, ending_at=S.FY_END,
                               last_voucher_date=max(v['date'] for v in vouchers), alter_id_master=max(r['alter_id'] for t in T if t.startswith('tm_') and t != 'tm_company' for r in T[t] if 'alter_id' in r),
                               alter_id_voucher=max(v['alter_id'] for v in vouchers), state_name=S.COMPANY_STATE, country='India', pincode='400001',
                               address=['1 Trade Centre', 'Fort', 'Mumbai'], email='info@demotraders.example.invalid', phone='02240000000', mobile='9820000000',
                               gstin=S.COMPANY_GSTIN, gst_registration_type='Regular', gst_applicable_date='2017-07-01', pan='AAACD1234E', base_currency_symbol='INR',
                               decimal_places=2, tally_serial='700012345', alter_id=0))
    c = T['tm_company'][0]
    c['alter_id'] = max(c['alter_id_master'], c['alter_id_voucher'])
    T['ref_voucher_kind'] = [dict(r) for r in MODEL['tables']['ref_voucher_kind']['seed_rows']]
    return T


def write(T):
    d = os.path.join(FIX, 'tables')
    os.makedirs(d, exist_ok=True)
    errs = []
    for t in MODEL['tables_order']:
        rows = T[t]
        if t != 'ref_voucher_kind':
            for r in rows:
                errs += check_row(MODEL, t, r)
        with open(os.path.join(d, t + '.json'), 'w', encoding='utf-8') as f:
            json.dump(rows, f, indent=1, ensure_ascii=False)
            f.write('\n')
    return errs


if __name__ == '__main__':
    T = build()
    errs = write(T)
    print('rows:', {t: len(r) for t, r in T.items()})
    print('errors:', len(errs))
    for e in errs[:30]:
        print(' ', e)
    if errs:
        sys.exit(1)
