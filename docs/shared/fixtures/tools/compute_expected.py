"""compute_expected - INDEPENDENT golden-number script.

Reads ONLY fixtures/tables/*.json (never fx_source.py) and writes fixtures/expected.json following CALC_SPECS.md.
Also asserts internal consistency (closing balances recomputed from lines, bills tie to ledger balances, balance sheet balances).
Run:  python3 -I compute_expected.py [--check]     (--check compares to the committed expected.json and fails on any difference)
"""
import datetime
import json
import os
import sys
from collections import defaultdict
from decimal import Decimal as D

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lbmodel import SHARED, canon, q, dec  # noqa: E402

TABLES = os.path.join(SHARED, 'fixtures', 'tables')
OUT = os.path.join(SHARED, 'fixtures', 'expected.json')
AS_OF = '2026-09-30'
BUCKETS = [(0, 30), (31, 60), (61, 90), (91, None)]
QUOTATION_TYPE_NAMES = ['Sales Quotation']


def load(t):
    with open(os.path.join(TABLES, t + '.json'), encoding='utf-8') as f:
        return json.load(f)


def days(a, b):
    return (datetime.date.fromisoformat(a) - datetime.date.fromisoformat(b)).days


def add_days(d, n):
    return (datetime.date.fromisoformat(d) + datetime.timedelta(days=n)).isoformat()


def c(v):
    return canon(v)


def bucket_label(age):
    for lo, hi in BUCKETS:
        if age >= lo and (hi is None or age <= hi):
            return '%d-%d' % (lo, hi) if hi is not None else '%d+' % lo
    return '0-30'


def main():
    check = '--check' in sys.argv
    comp = load('tm_company')[0]
    groups, ledgers = load('tm_group'), load('tm_ledger')
    items, vts = load('tm_stock_item'), load('tm_voucher_type')
    vouchers, LL, IL, BA, BL, TX = (load(t) for t in ('tx_voucher', 'tx_ledger_line', 'tx_inventory_line', 'tx_batch_alloc', 'tx_bill_alloc', 'tx_tax_line'))
    openings, obills = load('tm_stock_batch_opening'), load('tm_ledger_opening_bill')
    ref = {r['kind']: r for r in load('ref_voucher_kind')}
    gby = {g['guid']: g for g in groups}
    lby = {l['guid']: l for l in ledgers}
    vby = {v['guid']: v for v in vouchers}
    iby = {i['guid']: i for i in items}

    def primary(g):
        while g['parent_guid']:
            g = gby[g['parent_guid']]
        return g

    out = {'as_of': AS_OF, 'ageing_buckets': ['0-30', '31-60', '61-90', '91+'], 'quotation_voucher_type_names': QUOTATION_TYPE_NAMES, 'currency_decimals': comp['decimal_places']}

    # ---- ledger closing recomputed from lines
    recomputed = {l['guid']: dec(l['opening_balance']) for l in ledgers}
    for r in LL:
        if r['counts_in_books'] and ref[r['voucher_kind']]['affects_accounts']:
            recomputed[r['ledger_guid']] += dec(r['amount'])
    for l in ledgers:
        assert recomputed[l['guid']] == dec(l['closing_balance']), ('closing mismatch', l['name'], recomputed[l['guid']], l['closing_balance'])
    # ---- group closing recomputed
    gsum = defaultdict(lambda: D(0))
    for l in ledgers:
        g = gby[l['group_guid']]
        while True:
            gsum[g['guid']] += recomputed[l['guid']]
            if not g['parent_guid']:
                break
            g = gby[g['parent_guid']]
    for g in groups:
        assert gsum[g['guid']] == dec(g['closing_balance']), ('group closing mismatch', g['name'])

    os_value = sum((dec(i['opening_value']) for i in items), D(0))
    cs_value = sum((dec(i['closing_value']) for i in items), D(0))

    # ---- trial balance
    rows = []
    tot_dr = tot_cr = D(0)
    for l in sorted(ledgers, key=lambda x: x['name']):
        cb = dec(l['closing_balance'])
        dr, cr = (-cb if cb < 0 else D(0)), (cb if cb > 0 else D(0))
        tot_dr += dr; tot_cr += cr
        rows.append({'ledger': l['name'], 'group': gby[l['group_guid']]['name'], 'closing': c(cb), 'dr': c(dr), 'cr': c(cr)})
    tot_dr += os_value
    out['trial_balance'] = {'rows': rows, 'stock_in_hand_opening_dr': c(os_value), 'total_dr': c(tot_dr), 'total_cr': c(tot_cr), 'balanced': tot_dr == tot_cr}
    assert tot_dr == tot_cr, ('trial balance', tot_dr, tot_cr)

    # ---- P&L and balance sheet
    prim = defaultdict(lambda: D(0))
    for g in groups:
        if not g['parent_guid']:
            prim[g['name']] = dec(g['closing_balance'])
    prim_nature = {g['name']: (g['is_revenue'], g['nature']) for g in groups if not g['parent_guid']}
    inc_exp_net = sum((prim[n] for n, (rev, _) in prim_nature.items() if rev), D(0))
    net_profit = inc_exp_net + cs_value - os_value
    sales = sum((dec(g['closing_balance']) for g in groups if g['reserved_name'] == 'Sales Accounts'), D(0))
    purch = -sum((dec(g['closing_balance']) for g in groups if g['reserved_name'] == 'Purchase Accounts'), D(0))
    indirect = -sum((dec(g['closing_balance']) for g in groups if g['reserved_name'] == 'Indirect Expenses'), D(0))
    gross = sales - purch + cs_value - os_value
    out['profit_and_loss'] = {'sales': c(sales), 'purchases': c(purch), 'opening_stock': c(os_value), 'closing_stock': c(cs_value), 'gross_profit': c(gross),
                              'indirect_expenses': c(indirect), 'net_profit': c(gross - indirect)}
    assert gross - indirect == net_profit
    liab = {n: c(prim[n]) for n, (rev, nat) in sorted(prim_nature.items()) if not rev and nat == 'liability'}
    assets = {n: c(-prim[n]) for n, (rev, nat) in sorted(prim_nature.items()) if not rev and nat == 'asset'}
    liab_total = sum((dec(v) for v in liab.values()), D(0)) + net_profit
    asset_total = sum((dec(v) for v in assets.values()), D(0)) + cs_value
    out['balance_sheet'] = {'liabilities': liab, 'net_profit': c(net_profit), 'liabilities_total': c(liab_total), 'assets': assets, 'closing_stock': c(cs_value),
                            'assets_total': c(asset_total), 'balanced': liab_total == asset_total}
    assert liab_total == asset_total, ('balance sheet', liab_total, asset_total)

    # ---- outstanding (bill-wise)
    out_by_party, ageing_total = [], defaultdict(lambda: D(0))
    status_rows = []
    for l in sorted(ledgers, key=lambda x: x['name']):
        root = l['reserved_root']
        if root not in ('Sundry Debtors', 'Sundry Creditors'):
            continue
        side = -1 if root == 'Sundry Debtors' else 1   # orient so that "owed" is positive
        bills = {}
        for b in obills:
            if b['ledger_guid'] == l['guid']:
                bills[b['bill_name']] = dict(rem=dec(b['amount']), date=b['bill_date'], credit=b['credit_period_days'], creating=None)
        on_account = D(0)
        mine = sorted([b for b in BL if b['ledger_guid'] == l['guid'] and b['counts_in_books']], key=lambda b: (b['voucher_date'], b['voucher_guid'], b['alloc_index']))
        for b in mine:
            t, n, a = b['bill_type'], b['bill_name'], dec(b['amount'])
            if t == 'On Account':
                on_account += a
                continue
            if n not in bills:
                bills[n] = dict(rem=D(0), date=b['voucher_date'], credit=(b['credit_period_days'] or l['credit_period_days']), creating=None)
            bills[n]['rem'] += a
            if t == 'New Ref':
                bills[n]['creating'] = (b['voucher_guid'], dec(b['amount']))
        total_rem = sum((x['rem'] for x in bills.values()), D(0)) + on_account
        assert total_rem == dec(l['closing_balance']), ('bills do not tie to ledger', l['name'], total_rem, l['closing_balance'])
        open_bills, bk = [], defaultdict(lambda: D(0))
        for n, x in sorted(bills.items(), key=lambda kv: (kv[1]['date'], kv[0])):
            if x['rem'] == 0:
                continue
            owed = side * x['rem']
            age = days(AS_OF, x['date'])
            due = add_days(x['date'], x['credit'] or 0)
            od = max(0, days(AS_OF, due)) if owed > 0 else 0
            lab = bucket_label(age) if owed > 0 else 'advance'
            if owed > 0:
                bk[lab] += owed
            open_bills.append({'bill': n, 'bill_date': x['date'], 'due_date': due, 'outstanding': c(owed), 'age_days': age, 'overdue_days': od, 'bucket': lab})
        owed_total = sum((dec(b['outstanding']) for b in open_bills), D(0)) + side * on_account
        for k, v in bk.items():
            ageing_total[k] += v
        out_by_party.append({'ledger': l['name'], 'kind': 'receivable' if side == -1 else 'payable', 'net_outstanding': c(owed_total), 'on_account': c(side * on_account),
                             'buckets': {k: c(bk.get(k, D(0))) for k in ['0-30', '31-60', '61-90', '91+']}, 'bills': open_bills})
        # invoice status for vouchers whose party line created a bill
        for b in mine:
            if b['bill_type'] != 'New Ref':
                continue
            v = vby[b['voucher_guid']]
            if v['kind'] not in ('sales', 'purchase'):
                continue
            rem = bills[b['bill_name']]['rem']
            outstanding = abs(rem) if rem != 0 and (rem * side) > 0 else D(0)
            total = dec(v['amount'])
            paid = total - outstanding
            due = add_days(v['date'], v['due_days'] or l['credit_period_days'])
            status = 'paid' if outstanding == 0 else ('unpaid' if paid <= 0 else 'partly')
            overdue = outstanding > 0 and AS_OF > due
            status_rows.append({'voucher': v['number'], 'kind': v['kind'], 'party': l['name'], 'total': c(total), 'paid': c(paid), 'outstanding': c(outstanding), 'status': status,
                                'due_date': due, 'overdue': overdue, 'display_status': 'overdue' if overdue else status})
    out['outstanding'] = {'by_party': out_by_party, 'ageing_totals_owed': {k: c(ageing_total.get(k, D(0))) for k in ['0-30', '31-60', '61-90', '91+']}}
    out['invoice_payment_status'] = sorted(status_rows, key=lambda r: r['voucher'])

    # ---- customer last sale
    last = []
    for l in sorted(ledgers, key=lambda x: x['name']):
        if l['reserved_root'] != 'Sundry Debtors':
            continue
        vs = [v for v in vouchers if v['party_guid'] == l['guid'] and v['kind'] == 'sales' and v['counts_in_books']]
        if not vs:
            last.append({'ledger': l['name'], 'last_sale_date': None}); continue
        v = max(vs, key=lambda x: (x['date'], x['alter_id']))
        last.append({'ledger': l['name'], 'last_sale_date': v['date'], 'voucher': v['number'], 'amount': v['amount']})
    out['customer_last_sale'] = last

    # ---- stock closing
    qty = defaultdict(lambda: D(0))
    for o in openings:
        qty[(o['stock_item_guid'], o['godown_name'], o['batch_name'])] += dec(o['opening_qty'])
    for b in BA:
        if not b['counts_in_books']:
            continue
        k = ref[b['voucher_kind']]
        d = k['stock_direction']
        if d == 'both':
            sign = 1 if b['is_destination'] else -1
        elif d == 'in':
            sign = 1
        elif d == 'out':
            sign = -1
        else:
            continue
        if not k['affects_stock']:
            continue
        qty[(b['stock_item_guid'], b['godown_name'], b['batch_name'])] += sign * dec(b['billed_qty'])
    by_item = defaultdict(lambda: D(0))
    for (ig, gd, bt), v in qty.items():
        by_item[ig] += v
    st_rows = []
    for i in sorted(items, key=lambda x: x['name']):
        assert by_item[i['guid']] == dec(i['closing_qty']), ('stock closing mismatch', i['name'], by_item[i['guid']], i['closing_qty'])
        st_rows.append({'item': i['name'], 'unit': i['base_unit'], 'closing_qty': c(by_item[i['guid']]), 'closing_value': i['closing_value'],
                        'locations': [{'godown': gd, 'batch': bt, 'qty': c(v)} for (ig, gd, bt), v in sorted(qty.items(), key=lambda kv: kv[0][1:]) if ig == i['guid'] and v != 0]})
    out['stock_closing'] = st_rows
    out['batch_closing'] = [{'item': r['item'], 'godown': l['godown'], 'batch': l['batch'], 'qty': l['qty']} for r in st_rows if iby[[i['guid'] for i in items if i['name'] == r['item']][0]]['is_batch_wise'] for l in r['locations']]

    # ---- pending orders
    quote_guids = {v['guid'] for v in vts if v['name'] in QUOTATION_TYPE_NAMES}
    fulfil = {'sales_order': ('sales', 'delivery_note'), 'purchase_order': ('purchase', 'receipt_note')}
    pend = []
    for v in sorted(vouchers, key=lambda x: (x['date'], x['number'])):
        if not ref[v['kind']]['is_order'] or not v['counts_in_books'] or v['voucher_type_guid'] in quote_guids:
            continue
        per_item = defaultdict(lambda: [D(0), None, D(0)])
        for b in BA:
            if b['voucher_guid'] == v['guid']:
                p = per_item[b['stock_item_guid']]
                p[0] += dec(b['billed_qty']); p[1] = b['order_due_date']
        for il in IL:
            if il['voucher_guid'] == v['guid']:
                per_item[il['stock_item_guid']][2] = dec(il['rate'])
        for ig, (oq, due, rate) in per_item.items():
            delivered = D(0)
            for b in BA:
                fv = vby[b['voucher_guid']]
                if (b['counts_in_books'] and fv['kind'] in fulfil[v['kind']] and b['order_no'] == v['number'] and b['stock_item_guid'] == ig and fv['party_guid'] == v['party_guid']):
                    delivered += dec(b['billed_qty'])
            pq = max(D(0), oq - delivered)
            if pq > 0:
                pend.append({'order': v['number'], 'kind': v['kind'], 'party': lby[v['party_guid']]['name'], 'item': iby[ig]['name'], 'ordered_qty': c(oq), 'delivered_qty': c(delivered),
                             'pending_qty': c(pq), 'rate': c(rate), 'pending_value': c(q(pq * rate, 2)), 'due_date': due, 'overdue': bool(due and AS_OF > due)})
    by_party, by_item_p = defaultdict(lambda: [D(0), D(0)]), defaultdict(lambda: [D(0), D(0)])
    for p in pend:
        by_party[(p['kind'], p['party'])][0] += dec(p['pending_qty']); by_party[(p['kind'], p['party'])][1] += dec(p['pending_value'])
        by_item_p[(p['kind'], p['item'])][0] += dec(p['pending_qty']); by_item_p[(p['kind'], p['item'])][1] += dec(p['pending_value'])
    out['pending_orders'] = {'lines': pend,
                             'by_party': [{'kind': k[0], 'party': k[1], 'pending_qty': c(v[0]), 'pending_value': c(v[1])} for k, v in sorted(by_party.items())],
                             'by_item': [{'kind': k[0], 'item': k[1], 'pending_qty': c(v[0]), 'pending_value': c(v[1])} for k, v in sorted(by_item_p.items())]}

    # ---- GST summary (tax lines)
    direction = {'sales': ('outward', 1), 'credit_note': ('outward', -1), 'purchase': ('inward', 1), 'debit_note': ('inward', -1)}
    gs = defaultdict(lambda: [D(0), D(0)])
    for t in TX:
        if not t['counts_in_books']:
            continue
        dname, sg = direction[t['voucher_kind']]
        key = (dname, t['tax_head'], t['rate'])
        gs[key][0] += sg * dec(t['taxable_amount']); gs[key][1] += sg * dec(t['tax_amount'])
    out['gst_summary'] = [{'direction': k[0], 'head': k[1], 'rate': k[2], 'taxable': c(q(v[0], 2)), 'tax': c(q(v[1], 2))} for k, v in sorted(gs.items())]

    # ---- counts
    cnt = defaultdict(int)
    for v in vouchers:
        cnt[v['kind']] += 1
    out['voucher_counts_by_kind'] = dict(sorted(cnt.items()))
    out['voucher_total'] = len(vouchers)
    text = json.dumps(out, indent=1, ensure_ascii=False, sort_keys=False) + '\n'
    if check:
        with open(OUT, encoding='utf-8') as f:
            old = f.read()
        if old != text:
            print('expected.json DIFFERS from a fresh computation')
            return 1
        print('expected.json reproduced byte-for-byte')
        return 0
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(text)
    print('wrote', OUT, '| vouchers', len(vouchers), '| net profit', out['profit_and_loss']['net_profit'], '| balanced', out['balance_sheet']['balanced'])
    return 0


if __name__ == '__main__':
    sys.exit(main())
