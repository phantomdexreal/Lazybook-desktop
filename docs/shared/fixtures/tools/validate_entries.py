"""validate_entries - reference validator for entry_queue payloads (ENTRY_PAYLOADS.md + entry_rules.json).

Usage:  python3 -I validate_entries.py            validates every file listed in entry_examples/index.json against its expectation
        python3 -I validate_entries.py file.json  prints the problems of one payload
The same checks must run in the PWA before enqueue and in the desktop connector before posting.
"""
import datetime
import json
import os
import re
import sys
import uuid
from decimal import Decimal as D

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lbmodel import SHARED, q, dec, canon  # noqa: E402

RULES = json.load(open(os.path.join(SHARED, 'entry_rules.json')))
FIXT = os.path.join(SHARED, 'fixtures', 'tables')
MONEY_RE = re.compile(r'^-?\d+(\.\d{1,4})?$')
REF_DETAIL = {'ledger': 'LEDGER_NOT_FOUND', 'stock_item': 'STOCK_ITEM_NOT_FOUND', 'godown': 'GODOWN_NOT_FOUND', 'voucher_type': 'VOUCHER_TYPE_NOT_FOUND',
              'voucher': 'TARGET_NOT_FOUND', 'group': 'MASTER_NOT_FOUND', 'unit': 'MASTER_NOT_FOUND', 'stock_group': 'MASTER_NOT_FOUND'}


class Ctx:
    """Lookup data. In production this is the device local store (PWA) or the vault (connector)."""

    def __init__(self, tables=None, quotation_type_name='Sales Quotation'):
        T = tables or {t: json.load(open(os.path.join(FIXT, t + '.json'), encoding='utf-8')) for t in
                       ['tm_company', 'tm_ledger', 'tm_group', 'tm_stock_item', 'tm_stock_item_gst', 'tm_unit', 'tm_godown', 'tm_voucher_type', 'tm_stock_group', 'tx_voucher']}
        self.T = T
        self.company = T['tm_company'][0]
        self.maps = {'ledger': {r['guid']: r for r in T['tm_ledger']}, 'group': {r['guid']: r for r in T['tm_group']}, 'stock_item': {r['guid']: r for r in T['tm_stock_item']},
                     'unit': {r['guid']: r for r in T['tm_unit']}, 'godown': {r['guid']: r for r in T['tm_godown']}, 'voucher_type': {r['guid']: r for r in T['tm_voucher_type']},
                     'stock_group': {r['guid']: r for r in T['tm_stock_group']}, 'voucher': {r['guid']: r for r in T['tx_voucher']}}
        self.quotation_type_guid = next((v['guid'] for v in T['tm_voucher_type'] if v['name'] == quotation_type_name), None)

    def item_rate(self, item_guid, date):
        rows = sorted([g for g in self.T['tm_stock_item_gst'] if g['stock_item_guid'] == item_guid and g['applicable_from'] <= date], key=lambda g: g['applicable_from'])
        return dec(rows[-1]['igst_rate']) if rows else None


# --------------------------------------------------------------- calculators ---
def r2(v):
    return q(v, 2)


def compute_tax(lines, charges, intra):
    """lines: [(taxable, gst_rate, cess_rate)], charges: [(taxable, gst_rate)] -> {head: (amount, {rate: taxable})}  (CALC_SPECS section 5)."""
    acc, brk = {}, {}
    def add(head, taxable, rate):
        if rate == 0:
            return
        acc[head] = acc.get(head, D(0)) + q(taxable * rate / 100, 4)
        brk.setdefault(head, {})
        brk[head][rate] = brk[head].get(rate, D(0)) + taxable
    for (t, g, c) in lines + [(t, g, D(0)) for (t, g) in charges]:
        if intra:
            add('cgst', t, g / 2); add('sgst', t, g / 2)
        else:
            add('igst', t, g)
        add('cess', t, c)
    return {h: (r2(v), brk[h]) for h, v in acc.items()}


# --------------------------------------------------------------- schema pass ---
def chk(spec, val, path, errs):
    t = spec['t']
    if val is None:
        errs.append(('PAYLOAD_INVALID', path, 'null not allowed'))
        return
    if t == 'str':
        if not isinstance(val, str) or len(val) > spec.get('max', 10 ** 6) or len(val) < spec.get('min', 0):
            errs.append(('PAYLOAD_INVALID', path, 'bad string'))
    elif t == 'uuid':
        try:
            uuid.UUID(val)
        except Exception:
            errs.append(('PAYLOAD_INVALID', path, 'not a uuid'))
    elif t == 'guid':
        if not isinstance(val, str) or not val:
            errs.append(('PAYLOAD_INVALID', path, 'guid must be a non-empty string'))
    elif t == 'date':
        try:
            datetime.date.fromisoformat(val)
            assert re.match(r'^\d{4}-\d{2}-\d{2}$', val)
        except Exception:
            errs.append(('PAYLOAD_INVALID', path, 'date must be YYYY-MM-DD'))
    elif t == 'datetime':
        if not isinstance(val, str) or not re.match(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$', val):
            errs.append(('PAYLOAD_INVALID', path, 'datetime must be ISO-8601 UTC with Z'))
    elif t in ('money', 'money_pos', 'pct'):
        if not isinstance(val, str) or not MONEY_RE.match(val):
            errs.append(('PAYLOAD_INVALID', path, 'decimal must be a string like 1180.00'))
        else:
            d = dec(val)
            if t == 'money_pos' and d <= 0:
                errs.append(('PAYLOAD_INVALID', path, 'must be > 0'))
            if t == 'pct' and not (0 <= d <= 100):
                errs.append(('PAYLOAD_INVALID', path, 'must be 0..100'))
    elif t == 'int':
        if not isinstance(val, int) or isinstance(val, bool) or val < spec.get('min', -10 ** 12) or (spec.get('max') is not None and val > spec['max']):
            errs.append(('PAYLOAD_INVALID', path, 'bad integer'))
    elif t == 'bool':
        if not isinstance(val, bool):
            errs.append(('PAYLOAD_INVALID', path, 'bool expected'))
    elif t == 'enum':
        if val not in spec['values']:
            errs.append(('PAYLOAD_INVALID', path, 'one of %s' % spec['values']))
    elif t == 'array':
        if not isinstance(val, list) or len(val) < spec.get('min', 0) or (spec.get('max') is not None and len(val) > spec['max']):
            errs.append(('PAYLOAD_INVALID', path, 'bad array length'))
        else:
            for i, it in enumerate(val):
                chk(spec['item'], it, '%s[%d]' % (path, i), errs)
    elif t == 'object':
        if not isinstance(val, dict):
            errs.append(('PAYLOAD_INVALID', path, 'object expected'))
        elif 'fields' in spec:
            check_fields(spec['fields'], val, path, errs)
    elif t == 'any':
        pass


def check_fields(fields, data, path, errs):
    for k in data:
        if k not in fields:
            errs.append(('PAYLOAD_INVALID', path + '.' + k, 'unknown field'))
    for k, spec in fields.items():
        if k not in data:
            if spec.get('req'):
                errs.append(('PAYLOAD_INVALID', path + '.' + k, 'required'))
            continue
        chk(spec, data[k], path + '.' + k, errs)


def collect_refs(fields, data, path, out):
    for k, spec in fields.items():
        if k not in data or data[k] is None:
            continue
        v = data[k]
        if spec['t'] == 'guid':
            out.append((spec['ref'], v, path + '.' + k))
        elif spec['t'] == 'object' and 'fields' in spec and isinstance(v, dict):
            collect_refs(spec['fields'], v, path + '.' + k, out)
        elif spec['t'] == 'array' and spec['item']['t'] == 'object' and 'fields' in spec['item'] and isinstance(v, list):
            for i, it in enumerate(v):
                if isinstance(it, dict):
                    collect_refs(spec['item']['fields'], it, '%s.%s[%d]' % (path, k, i), out)
        elif spec['t'] == 'array' and spec['item']['t'] == 'guid' and isinstance(v, list):
            for i, it in enumerate(v):
                out.append((spec['item']['ref'], it, '%s.%s[%d]' % (path, k, i)))


# ------------------------------------------------------------------ validate ---
def validate(payload, ctx, flags=None):
    errs = []
    env = RULES['envelope']
    if not isinstance(payload, dict):
        return [('PAYLOAD_INVALID', '$', 'object expected')]
    check_fields(env, payload, '$', errs)
    if errs:
        return errs
    if payload['v'] != RULES['entry_payload_v']:
        return [('UNSUPPORTED_VERSION', '$.v', 'unsupported payload version')]
    kind = payload['kind']
    krule = RULES['kinds'][kind]
    data = payload['data']
    check_fields(krule['fields'], data, '$.data', errs)
    if errs:
        return errs
    if payload['company_guid'] != ctx.company['guid']:
        errs.append(('COMPANY_MISMATCH', '$.company_guid', 'not the connected company'))
    refs = []
    collect_refs(krule['fields'], data, '$.data', refs)
    for rkind, g, p in refs:
        if g not in ctx.maps[rkind]:
            errs.append((REF_DETAIL[rkind], p, 'unknown %s %s' % (rkind, g)))
    if errs:
        return errs
    flags = flags or {}
    if krule['flags'].get('_kind') and flags and not flags.get(krule['flags']['_kind'], False):
        errs.append(('FLAG_DISABLED', '$.kind', 'feature flag %s is off' % krule['flags']['_kind']))
    for k in ('einvoice', 'eway'):
        if k in data and data[k].get('generate') and flags and not flags.get('einvoice_eway', False):
            errs.append(('FLAG_DISABLED', '$.data.' + k, 'einvoice_eway is off'))
    fn = {'invoice': v_invoice, 'receipt': v_recpay, 'payment': v_recpay, 'contra': v_contra, 'journal': v_journal, 'inventory_voucher': v_invv, 'order': v_order, 'quotation': v_order,
          'alter': v_alter}.get(kind)
    if 'base_kind' in krule['fields'] or 'voucher_type_guid' in krule['fields']:
        v_common(kind, krule, data, ctx, errs)
    if fn and not errs:
        fn(kind, data, ctx, errs)
    return errs


def v_common(kind, krule, data, ctx, errs):
    c = ctx.company
    if not (c['starting_from'] <= data['date'] <= c['ending_at']):
        errs.append(('DATE_OUT_OF_PERIOD', '$.data.date', 'outside the financial year'))
    vt = ctx.maps['voucher_type'][data['voucher_type_guid']]
    if data['base_kind'] != vt['base_kind'] or data['base_kind'] not in krule['allowed_base_kinds']:
        errs.append(('VOUCHER_TYPE_MISMATCH', '$.data.base_kind', 'base_kind %s vs type %s' % (data['base_kind'], vt['base_kind'])))
    if kind == 'quotation' and data['voucher_type_guid'] != ctx.quotation_type_guid:
        errs.append(('VOUCHER_TYPE_MISMATCH', '$.data.voucher_type_guid', 'quotation must use the configured quotation voucher type'))
    if kind == 'order' and data['voucher_type_guid'] == ctx.quotation_type_guid:
        errs.append(('VOUCHER_TYPE_MISMATCH', '$.data.voucher_type_guid', 'quotation type used for an order'))


def bills_check(party, bills, amount, errs, path='$.data.bills'):
    if bills is None:
        return
    if not party['is_billwise_on']:
        errs.append(('PAYLOAD_INVALID', path, 'party ledger is not bill-wise; omit bills'))
        return
    if sum((dec(b['amount']) for b in bills), D(0)) != dec(amount):
        errs.append(('UNBALANCED', path, 'bill amounts must add up to %s' % amount))
    for i, b in enumerate(bills):
        if b['type'] in ('new_ref', 'agst_ref', 'advance') and not b.get('name'):
            errs.append(('PAYLOAD_INVALID', '%s[%d].name' % (path, i), 'name required for %s' % b['type']))


def v_invoice(kind, d, ctx, errs):
    c = ctx.company
    place = d.get('place_of_supply') or c['state_name']
    intra = place == c['state_name']
    mode = d['tax']['mode']
    if mode != 'none' and mode != ('intra' if intra else 'inter'):
        errs.append(('TAX_MISMATCH', '$.data.tax.mode', 'expected %s for place of supply %s' % ('intra' if intra else 'inter', place)))
        return
    lsum = D(0)
    clines = []
    for i, ln in enumerate(d['lines']):
        exp = r2(dec(ln['qty']) * dec(ln['rate']) * (1 - dec(ln.get('discount_pct', '0')) / 100))
        if dec(ln['amount']) != exp:
            errs.append(('TOTAL_MISMATCH', '$.data.lines[%d].amount' % i, 'expected %s' % canon(exp)))
        master = ctx.item_rate(ln['stock_item_guid'], d['date'])
        if master is not None and dec(ln['gst_rate']) != master:
            errs.append(('TAX_MISMATCH', '$.data.lines[%d].gst_rate' % i, 'item master rate is %s' % canon(master)))
        lsum += dec(ln['amount'])
        clines.append((dec(ln['amount']), dec(ln['gst_rate']), dec(ln.get('cess_rate', '0'))))
    chg = [(dec(x['amount']), dec(x.get('gst_rate', '0'))) for x in d.get('charges', [])]
    csum = sum((a for a, _ in chg), D(0))
    exp_tax = compute_tax(clines, chg, intra) if mode != 'none' else {}
    got = {t['head']: dec(t['amount']) for t in d['tax']['lines']}
    if set(got) != set(exp_tax) or any(got[h] != exp_tax[h][0] for h in exp_tax if h in got):
        errs.append(('TAX_MISMATCH', '$.data.tax.lines', 'expected %s' % {h: canon(v[0]) for h, v in exp_tax.items()}))
    for t in d['tax']['lines']:
        if 'breakup' in t and t['head'] in exp_tax:
            gb = {canon(b['rate']): dec(b['taxable']) for b in t['breakup']}
            eb = {canon(r): v for r, v in exp_tax[t['head']][1].items()}
            if gb != eb:
                errs.append(('TAX_MISMATCH', '$.data.tax.lines.breakup', 'breakup differs'))
    ro = dec(d['round_off']['amount']) if 'round_off' in d else D(0)
    if abs(ro) >= 1:
        errs.append(('TOTAL_MISMATCH', '$.data.round_off.amount', 'must be below 1'))
    raw = lsum + csum + sum(got.values(), D(0))
    if dec(d['total']) != raw + ro:
        errs.append(('TOTAL_MISMATCH', '$.data.total', 'expected %s' % canon(raw + ro)))
    if errs:
        return
    party = ctx.maps['ledger'][d['party_ledger_guid']]
    bills_check(party, d.get('bills'), d['total'], errs)


def v_recpay(kind, d, ctx, errs):
    party = ctx.maps['ledger'][d['party_ledger_guid']]
    if d['party_ledger_guid'] == d['cash_bank_ledger_guid']:
        errs.append(('UNBALANCED', '$.data', 'party and cash/bank ledger are the same'))
    bills_check(party, d.get('bills'), d['amount'], errs)


def v_contra(kind, d, ctx, errs):
    if d['from_ledger_guid'] == d['to_ledger_guid']:
        errs.append(('UNBALANCED', '$.data', 'from and to ledger are the same'))


def v_journal(kind, d, ctx, errs):
    dr = sum((dec(l['amount']) for l in d['lines'] if l['side'] == 'dr'), D(0))
    cr = sum((dec(l['amount']) for l in d['lines'] if l['side'] == 'cr'), D(0))
    if dr != cr:
        errs.append(('UNBALANCED', '$.data.lines', 'debit %s credit %s' % (canon(dr), canon(cr))))
    for i, l in enumerate(d['lines']):
        if 'bills' in l:
            bills_check(ctx.maps['ledger'][l['ledger_guid']], l['bills'], l['amount'], errs, '$.data.lines[%d].bills' % i)


def v_invv(kind, d, ctx, errs):
    if d['base_kind'] == 'stock_journal':
        if d.get('lines') or d.get('party_ledger_guid') or not d.get('source_lines') or not d.get('destination_lines'):
            errs.append(('PAYLOAD_INVALID', '$.data', 'stock_journal needs source_lines and destination_lines only'))
    else:
        if not d.get('lines') or not d.get('party_ledger_guid') or d.get('source_lines') or d.get('destination_lines'):
            errs.append(('PAYLOAD_INVALID', '$.data', 'notes need lines and party_ledger_guid only'))


def v_order(kind, d, ctx, errs):
    for i, ln in enumerate(d['lines']):
        exp = r2(dec(ln['qty']) * dec(ln['rate']) * (1 - dec(ln.get('discount_pct', '0')) / 100))
        if dec(ln['amount']) != exp:
            errs.append(('TOTAL_MISMATCH', '$.data.lines[%d].amount' % i, 'expected %s' % canon(exp)))
        if ln['due_date'] < d['date']:
            errs.append(('PAYLOAD_INVALID', '$.data.lines[%d].due_date' % i, 'due date before order date'))


def v_alter(kind, d, ctx, errs):
    a = d['action']
    if a == 'replace' and not (d.get('target_kind') and d.get('replacement')):
        errs.append(('PAYLOAD_INVALID', '$.data', 'replace needs target_kind and replacement'))
    if a == 'einvoice_cancel' and not d.get('reason'):
        errs.append(('PAYLOAD_INVALID', '$.data.reason', 'required for einvoice_cancel'))
    if a == 'eway_generate' and not (d.get('eway', {}).get('transporter_id') or d.get('eway', {}).get('vehicle_no')):
        errs.append(('PAYLOAD_INVALID', '$.data.eway', 'transporter_id or vehicle_no required'))
    if a == 'replace' and d.get('replacement') is not None:
        inner = {'v': 1, 'kind': d['target_kind'], 'client_request_id': '00000000-0000-4000-8000-000000000000', 'company_guid': ctx.company['guid'],
                 'created_at': '2026-01-01T00:00:00Z', 'device_id': '00000000-0000-4000-8000-000000000001', 'data': d['replacement']}
        errs.extend(validate(inner, ctx))


def main():
    ctx = Ctx()
    base = os.path.join(SHARED, 'entry_examples')
    if len(sys.argv) > 1:
        p = json.load(open(sys.argv[1]))
        for e in validate(p, ctx):
            print(e)
        return 0
    idx = json.load(open(os.path.join(base, 'index.json')))
    bad = 0
    for item in idx['examples']:
        p = json.load(open(os.path.join(base, item['file'])))
        errs = validate(p, ctx, flags={'entries': True, 'orders': True, 'einvoice_eway': True})
        details = {e[0] for e in errs}
        if item['expect'] == 'valid':
            ok = not errs
        else:
            ok = item['expect'] in details
        if not ok:
            bad += 1
            print('FAIL', item['file'], 'expected', item['expect'], 'got', errs[:3])
    print('entry examples checked:', len(idx['examples']), 'failures:', bad)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
