"""tally_xml_io - reference implementation of TALLY_WIRE.md.

emit(tables)  : fixture rows -> mock Tally collection responses (what the desktop mock server serves)
parse(files)  : mock Tally responses -> normalised rows (what the desktop connector must produce)
Both are driven by data_model.json column `tally` / `hint` fields plus the special cases below.
"""
import os
import sys
import xml.etree.ElementTree as ET
from decimal import Decimal as D

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lbmodel import load_model, default_row, canon, q, dec  # noqa: E402

MODEL = load_model()
SEED = {r['kind']: r for r in MODEL['tables']['ref_voucher_kind']['seed_rows']}
TALLY_KIND = {r['tally_name'].lower(): r['kind'] for r in SEED.values() if r['tally_name']}
SIMPLE = {'text', 'int', 'yesno', 'tally_date', 'amount', 'days', 'yesno_applicable'}
HEAD_NAMES = {'Central Tax': 'cgst', 'State Tax': 'sgst', 'Integrated Tax': 'igst', 'Cess': 'cess'}

COLLECTIONS = {  # file -> (table, object tag)
    'company.xml': 'tm_company', 'groups.xml': 'tm_group', 'ledgers.xml': 'tm_ledger', 'voucher_types.xml': 'tm_voucher_type',
    'stock_groups.xml': 'tm_stock_group', 'stock_categories.xml': 'tm_stock_category', 'units.xml': 'tm_unit', 'godowns.xml': 'tm_godown',
    'stock_items.xml': 'tm_stock_item', 'cost_centres.xml': 'tm_cost_centre', 'currencies.xml': 'tm_currency', 'employees.xml': 'tm_employee',
    'gst_registrations.xml': 'tm_gst_registration', 'vouchers.xml': 'tx_voucher',
}


def cols(table):
    return MODEL['tables'][table]['columns']


# ------------------------------------------------------------------ scalar codec ---
def enc_scalar(c, v, unit=''):
    h = c.get('hint')
    if v is None:
        return None
    if h in ('text',):
        return v if v != '' else None
    if h == 'int':
        return str(v) if v else None
    if h == 'yesno':
        return 'Yes' if v else None
    if h == 'yesno_applicable':
        return 'Applicable' if v else 'Not Applicable'
    if h == 'tally_date':
        return v.replace('-', '')
    if h == 'amount':
        return v if dec(v) != 0 else None
    if h == 'days':
        return '%d Days' % v if v else None
    if h == 'qty':
        return (format(dec(v).normalize(), 'f') + ((' ' + unit) if unit else '')) if dec(v) != 0 else None
    if h == 'rate':
        return (canon(v) + ('/' + unit if unit else '')) if dec(v) != 0 else None
    raise KeyError(h)


def dec_scalar(c, text):
    h = c.get('hint')
    t = c['type']
    if text is None or text.strip() == '':
        return c.get('default')
    text = text.strip()
    if h == 'text':
        return text
    if h == 'int':
        return int(text)
    if h == 'yesno':
        return text.lower() == 'yes'
    if h == 'yesno_applicable':
        return text.lower() == 'applicable'
    if h == 'tally_date':
        return '%s-%s-%s' % (text[:4], text[4:6], text[6:8])
    if h == 'amount':
        return canon(text)
    if h == 'days':
        return int(text.split()[0])
    if h == 'qty':
        return canon(text.split()[0])
    if h == 'rate':
        return canon(text.split('/')[0])
    raise KeyError(h)


def qty_unit(text):
    parts = (text or '').strip().split(' ', 1)
    return parts[1].split('=')[0].strip() if len(parts) > 1 else ''


def rate_unit(text):
    parts = (text or '').strip().split('/', 1)
    return parts[1].strip() if len(parts) > 1 else ''


# ------------------------------------------------------------------- xml helpers ---
def sub(parent, path, text):
    cur = parent
    parts = path.split('/')
    for p in parts[:-1]:
        nxt = cur.find(p)
        if nxt is None:
            nxt = ET.SubElement(cur, p)
        cur = nxt
    e = ET.SubElement(cur, parts[-1])
    e.text = text
    return e


def get_path(el, path):
    cur = el
    for p in path.split('/'):
        if cur is None:
            return None
        if p.startswith('@'):
            return cur.get(p[1:])
        cur = cur.find(p)
    return cur.text if cur is not None else None


def list_lines(el, tag):
    """<ADDRESS.LIST><ADDRESS>l1</ADDRESS>..</ADDRESS.LIST> -> ['l1', ...] or None"""
    node = el.find(tag)
    if node is None:
        return None
    return [(c.text or '') for c in node]


def put_list(el, tag, lines):
    if not lines:
        return
    node = ET.SubElement(el, tag, {'TYPE': 'String'})
    child = tag.replace('.LIST', '')
    for l in lines:
        ET.SubElement(node, child).text = l


def finish(root):
    ET.indent(root)
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(root, encoding='unicode') + '\n'


def envelope(objects):
    env = ET.Element('ENVELOPE')
    hdr = ET.SubElement(env, 'HEADER')
    ET.SubElement(hdr, 'VERSION').text = '1'
    ET.SubElement(hdr, 'STATUS').text = '1'
    body = ET.SubElement(env, 'BODY')
    data = ET.SubElement(body, 'DATA')
    coll = ET.SubElement(data, 'COLLECTION')
    for o in objects:
        coll.append(o)
    return env


# ---------------------------------------------------------------- generic object ---
def is_simple(c):
    return 'tally' in c and c.get('hint') in SIMPLE


def emit_simple(el, table, row, skip=()):
    for c in cols(table):
        if c['name'] in skip or not is_simple(c):
            continue
        t = c['tally']
        v = row[c['name']]
        if t.startswith('@'):
            s = enc_scalar(c, v)
            if s is not None:
                el.set(t[1:], s)
            continue
        s = enc_scalar(c, v)
        if s is not None:
            sub(el, t, s)


def parse_simple(el, table, skip=()):
    r = {}
    for c in cols(table):
        if c['name'] in skip or not is_simple(c):
            continue
        r[c['name']] = dec_scalar(c, get_path(el, c['tally']))
    return r


# =================================================================== EMIT ======
def emit(T):
    files = {}
    byname = lambda t, n: next(r for r in T[t] if r['name'] == n)
    unit_of_item = {r['guid']: r['base_unit'] for r in T['tm_stock_item']}

    def make(table, tag, special=None, skip=(), nameattr=True):
        objs = []
        for r in T[table]:
            e = ET.Element(tag)
            e.set('NAME', r.get('name', ''))
            emit_simple(e, table, r, skip=set(skip) | {'name'})
            if special:
                special(e, r)
            objs.append(e)
        return finish(envelope(objs))

    # company
    def sp_company(e, r):
        put_list(e, 'ADDRESS.LIST', r['address'])
        ET.SubElement(e, 'FNRESULT', {'NAME': '$$LicenseInfo:SerialNumber'}).text = r['tally_serial']
    # alter_id column is derived for the company
    files['company.xml'] = make('tm_company', 'COMPANY', sp_company, skip=('alter_id',))
    files['groups.xml'] = make('tm_group', 'GROUP')
    # ledger
    ledger_extra = {}
    for tname, key in (('tm_ledger_address', 'ledger_guid'), ('tm_ledger_gst', 'ledger_guid'), ('tm_ledger_opening_bill', 'ledger_guid'), ('tm_ledger_contact', 'ledger_guid')):
        for r in T[tname]:
            ledger_extra.setdefault((tname, r[key]), []).append(r)

    def sp_ledger(e, r):
        put_list(e, 'ADDRESS.LIST', r['address'])
        for a in ledger_extra.get(('tm_ledger_address', r['guid']), []):
            m = ET.SubElement(e, 'LEDMAILINGDETAILS.LIST')
            emit_simple(m, 'tm_ledger_address', a, skip={'lines'})
            put_list(m, 'ADDRESS.LIST', a['lines'])
        for g in ledger_extra.get(('tm_ledger_gst', r['guid']), []):
            m = ET.SubElement(e, 'LEDGSTREGDETAILS.LIST')
            emit_simple(m, 'tm_ledger_gst', g)
        for b in ledger_extra.get(('tm_ledger_opening_bill', r['guid']), []):
            m = ET.SubElement(e, 'BILLALLOCATIONS.LIST')
            emit_simple(m, 'tm_ledger_opening_bill', b)
        # ledger-level contact fields come from the ledger row itself (LEDGERCONTACT etc. are simple columns of tm_ledger)
    files['ledgers.xml'] = make('tm_ledger', 'LEDGER', sp_ledger)
    files['voucher_types.xml'] = make('tm_voucher_type', 'VOUCHERTYPE')
    files['stock_groups.xml'] = make('tm_stock_group', 'STOCKGROUP')
    files['stock_categories.xml'] = make('tm_stock_category', 'STOCKCATEGORY')
    files['units.xml'] = make('tm_unit', 'UNIT')

    def sp_godown(e, r):
        if not r['guid'].startswith('n:'):
            ET.SubElement(e, 'GUID').text = r['guid']
    files['godowns.xml'] = make('tm_godown', 'GODOWN', sp_godown, skip=('guid',))
    files['cost_centres.xml'] = make('tm_cost_centre', 'COSTCENTRE')
    files['currencies.xml'] = make('tm_currency', 'CURRENCY')
    files['employees.xml'] = make('tm_employee', 'EMPLOYEE')
    files['gst_registrations.xml'] = make('tm_gst_registration', 'TAXUNIT', skip=('state_name', 'registration_type', 'applicable_from'),
                                          special=lambda e, r: _sp_taxunit(e, r))
    gst_by_item = {}
    for g in T['tm_stock_item_gst']:
        gst_by_item.setdefault(g['stock_item_guid'], []).append(g)
    bo_by_item = {}
    for b in T['tm_stock_batch_opening']:
        bo_by_item.setdefault(b['stock_item_guid'], []).append(b)

    def sp_item(e, r):
        unit = r['base_unit']
        for cn, tg in (('opening_qty', 'OPENINGBALANCE'), ('closing_qty', 'CLOSINGBALANCE')):
            s = enc_scalar({'hint': 'qty'}, r[cn], unit)
            if s:
                sub(e, tg, s)
        if r['aliases'] is not None:
            nl = ET.SubElement(ET.SubElement(e, 'LANGUAGENAME.LIST'), 'NAME.LIST', {'TYPE': 'String'})
            ET.SubElement(nl, 'NAME').text = r['name']
            for a in r['aliases']:
                ET.SubElement(nl, 'NAME').text = a
        for g in gst_by_item.get(r['guid'], []):
            gd = ET.SubElement(e, 'GSTDETAILS.LIST')
            emit_simple(gd, 'tm_stock_item_gst', g, skip={'hsn_code'})
            sub(gd, 'HSNCODE', g['hsn_code'])
            sw = ET.SubElement(gd, 'STATEWISEDETAILS.LIST')
            ET.SubElement(sw, 'STATENAME').text = 'Any'
            for hn, hk in (('Central Tax', 'cgst_rate'), ('State Tax', 'sgst_rate'), ('Integrated Tax', 'igst_rate'), ('Cess', 'cess_rate')):
                rd = ET.SubElement(sw, 'RATEDETAILS.LIST')
                ET.SubElement(rd, 'GSTRATEDUTYHEAD').text = hn
                ET.SubElement(rd, 'GSTRATE').text = g[hk]
        for b in bo_by_item.get(r['guid'], []):
            ba = ET.SubElement(e, 'BATCHALLOCATIONS.LIST')
            emit_simple(ba, 'tm_stock_batch_opening', b, skip={'opening_qty'})
            s = enc_scalar({'hint': 'qty'}, b['opening_qty'], unit)
            if s:
                sub(ba, 'OPENINGBALANCE', s)
    files['stock_items.xml'] = make('tm_stock_item', 'STOCKITEM', sp_item, skip=('opening_qty', 'closing_qty'))

    # vouchers
    inv_by_v, led_by_v, bat_by_v, bill_by_v = {}, {}, {}, {}
    for r in T['tx_inventory_line']:
        inv_by_v.setdefault(r['voucher_guid'], []).append(r)
    for r in T['tx_ledger_line']:
        led_by_v.setdefault(r['voucher_guid'], []).append(r)
    for r in T['tx_batch_alloc']:
        bat_by_v.setdefault((r['voucher_guid'], r['line_index']), []).append(r)
    for r in T['tx_bill_alloc']:
        bill_by_v.setdefault((r['voucher_guid'], r['line_index']), []).append(r)
    objs = []
    for v in T['tx_voucher']:
        e = ET.Element('VOUCHER')
        if v['remote_id']:
            e.set('REMOTEID', v['remote_id'])
        e.set('VCHTYPE', v['voucher_type_name'])
        e.set('ACTION', 'Create')
        emit_simple(e, 'tx_voucher', v, skip={'remote_id'})
        put_list(e, 'ADDRESS.LIST', v['address'])
        invoice_like = v['is_invoice']
        ltag = 'ALLLEDGERENTRIES.LIST' if invoice_like else 'LEDGERENTRIES.LIST'
        lines = led_by_v.get(v['guid'], [])
        for l in [x for x in lines if x['source'] == 'ledger']:
            le = ET.SubElement(e, ltag)
            emit_simple(le, 'tx_ledger_line', l)
            for b in bill_by_v.get((v['guid'], l['line_index']), []):
                be = ET.SubElement(le, 'BILLALLOCATIONS.LIST')
                emit_simple(be, 'tx_bill_alloc', b)
        invs = inv_by_v.get(v['guid'], [])
        for il in invs:
            if v['kind'] == 'stock_journal':
                itag = 'INVENTORYENTRIESIN.LIST' if bat_by_v[(v['guid'], il['line_index'])][0]['is_destination'] else 'INVENTORYENTRIESOUT.LIST'
            else:
                itag = 'ALLINVENTORYENTRIES.LIST' if invoice_like else 'INVENTORYENTRIES.LIST'
            ie = ET.SubElement(e, itag)
            emit_simple(ie, 'tx_inventory_line', il, skip={'godown_name'})
            for cn, tg in (('billed_qty', 'BILLEDQTY'), ('actual_qty', 'ACTUALQTY')):
                sub(ie, tg, enc_scalar({'hint': 'qty'}, il[cn], il['unit']))
            sub(ie, 'RATE', enc_scalar({'hint': 'rate'}, il['rate'], il['rate_unit']) or '')
            for b in bat_by_v.get((v['guid'], il['line_index']), []):
                be = ET.SubElement(ie, 'BATCHALLOCATIONS.LIST')
                emit_simple(be, 'tx_batch_alloc', b, skip={'billed_qty', 'actual_qty'})
                for cn, tg in (('billed_qty', 'BILLEDQTY'), ('actual_qty', 'ACTUALQTY')):
                    sub(be, tg, enc_scalar({'hint': 'qty'}, b[cn], il['unit']))
            for l in [x for x in lines if x['source'] == 'inv_alloc' and x['inv_line_index'] == il['line_index']]:
                ae = ET.SubElement(ie, 'ACCOUNTINGALLOCATIONS.LIST')
                emit_simple(ae, 'tx_ledger_line', l)
        objs.append(e)
    files['vouchers.xml'] = finish(envelope(objs))
    guid_list = []
    for v in T['tx_voucher']:
        e = ET.Element('VOUCHER')
        ET.SubElement(e, 'GUID').text = v['guid']
        ET.SubElement(e, 'ALTERID').text = str(v['alter_id'])
        guid_list.append(e)
    files['voucher_guid_list.xml'] = finish(envelope(guid_list))
    return files


def _sp_taxunit(e, r):
    gd = ET.SubElement(e, 'GSTDETAILS.LIST')
    ET.SubElement(gd, 'STATENAME').text = r['state_name']
    ET.SubElement(gd, 'GSTREGISTRATIONTYPE').text = r['registration_type']
    ET.SubElement(gd, 'APPLICABLEFROM').text = r['applicable_from'].replace('-', '')


# =================================================================== PARSE =====
def objects(xml_text, tag):
    root = ET.fromstring(xml_text)
    return root.findall('./BODY/DATA/COLLECTION/' + tag)


def parse(files, as_of):
    T = {t: [] for t in MODEL['tables_order']}
    T['ref_voucher_kind'] = [dict(r) for r in MODEL['tables']['ref_voucher_kind']['seed_rows']]

    # company
    ce = objects(files['company.xml'], 'COMPANY')[0]
    comp = default_row(MODEL, 'tm_company')
    comp.update(parse_simple(ce, 'tm_company', skip={'alter_id'}))
    comp['name'] = ce.get('NAME')
    comp['address'] = list_lines(ce, 'ADDRESS.LIST')
    comp['tally_serial'] = ce.find("FNRESULT[@NAME='$$LicenseInfo:SerialNumber']").text
    comp['alter_id'] = max(comp['alter_id_master'], comp['alter_id_voucher'])
    T['tm_company'].append(comp)
    cg = comp['guid']

    def base(table):
        r = default_row(MODEL, table)
        r['company_guid'] = cg
        return r

    def master(table, fname, tag, extra=None, skip=()):
        out = []
        for e in objects(files[fname], tag):
            r = base(table)
            r.update(parse_simple(e, table, skip=set(skip) | {'name'}))
            r['name'] = e.get('NAME')
            if 'name_lc' in r:
                r['name_lc'] = r['name'].strip().lower()
            if 'guid' in r and not r['guid']:
                r['guid'] = 'n:' + r['name']
            if extra:
                extra(e, r)
            out.append(r)
        T[table] = out
        return out

    groups = master('tm_group', 'groups.xml', 'GROUP')
    gby = {g['name']: g for g in groups}
    def groot(g):
        cur = g
        while cur:
            if cur['reserved_name']:
                return cur['reserved_name']
            cur = gby.get(cur['parent_name'])
        return ''
    for g in groups:
        g['parent_guid'] = gby[g['parent_name']]['guid'] if g['parent_name'] else ''
        g['reserved_root'] = groot(g)
        g['nature'] = {(False, True): 'asset', (False, False): 'liability', (True, True): 'expense', (True, False): 'income'}[(g['is_revenue'], g['is_deemed_positive'])]
        g['closing_as_of'] = as_of

    # ledgers
    def x_ledger(e, r):
        r['aliases'] = []
        r['address'] = list_lines(e, 'ADDRESS.LIST')
        g = gby[r['parent_name']]
        r['group_guid'] = g['guid']
        r['reserved_root'] = groot(g)
        r['closing_as_of'] = as_of
        for m in e.findall('LEDMAILINGDETAILS.LIST'):
            a = base('tm_ledger_address')
            a.update(parse_simple(m, 'tm_ledger_address', skip={'lines'}))
            a['ledger_guid'] = r['guid']; a['addr_index'] = len([x for x in T['tm_ledger_address'] if x['ledger_guid'] == r['guid']])
            a['lines'] = list_lines(m, 'ADDRESS.LIST')
            T['tm_ledger_address'].append(a)
        for m in e.findall('LEDGSTREGDETAILS.LIST'):
            a = base('tm_ledger_gst')
            a.update(parse_simple(m, 'tm_ledger_gst'))
            a['ledger_guid'] = r['guid']
            T['tm_ledger_gst'].append(a)
        for j, m in enumerate(e.findall('BILLALLOCATIONS.LIST')):
            a = base('tm_ledger_opening_bill')
            a.update(parse_simple(m, 'tm_ledger_opening_bill'))
            a['ledger_guid'] = r['guid']; a['bill_index'] = j
            T['tm_ledger_opening_bill'].append(a)
        if r['contact_person'] or r['phone'] or r['mobile'] or r['email']:
            a = base('tm_ledger_contact')
            a.update(ledger_guid=r['guid'], contact_index=0, name=r['contact_person'], phone=r['phone'], mobile=r['mobile'], email=r['email'], is_primary=True)
            T['tm_ledger_contact'].append(a)
    master('tm_ledger', 'ledgers.xml', 'LEDGER', x_ledger)
    ledby = {l['name']: l for l in T['tm_ledger']}

    # voucher types
    vts = master('tm_voucher_type', 'voucher_types.xml', 'VOUCHERTYPE')
    vtby = {v['name'].lower(): v for v in vts}
    for v in vts:
        name, seen, kind = v['name'], set(), 'unknown'
        while name and name.lower() not in seen:
            seen.add(name.lower())
            if name.lower() in TALLY_KIND:
                kind = TALLY_KIND[name.lower()]
                break
            p = vtby.get(name.lower())
            name = p['parent_name'] if p else ''
        v['base_kind'] = kind

    sgs = master('tm_stock_group', 'stock_groups.xml', 'STOCKGROUP')
    sgby = {g['name']: g for g in sgs}
    for g in sgs:
        g['parent_guid'] = sgby[g['parent_name']]['guid'] if g['parent_name'] else ''
    cats = master('tm_stock_category', 'stock_categories.xml', 'STOCKCATEGORY')
    master('tm_unit', 'units.xml', 'UNIT')
    gds = master('tm_godown', 'godowns.xml', 'GODOWN')
    gdby = {g['name']: g for g in gds}
    master('tm_cost_centre', 'cost_centres.xml', 'COSTCENTRE')
    master('tm_currency', 'currencies.xml', 'CURRENCY')
    master('tm_employee', 'employees.xml', 'EMPLOYEE')

    def x_tu(e, r):
        gd = e.find('GSTDETAILS.LIST')
        r['state_name'] = gd.findtext('STATENAME'); r['registration_type'] = gd.findtext('GSTREGISTRATIONTYPE')
        s = gd.findtext('APPLICABLEFROM'); r['applicable_from'] = '%s-%s-%s' % (s[:4], s[4:6], s[6:8])
    master('tm_gst_registration', 'gst_registrations.xml', 'TAXUNIT', x_tu)

    def x_item(e, r):
        unit = r['base_unit']
        for cn, tg in (('opening_qty', 'OPENINGBALANCE'), ('closing_qty', 'CLOSINGBALANCE')):
            t = e.findtext(tg)
            r[cn] = canon(t.split()[0]) if t else '0.00'
        names = [n.text for n in e.findall('LANGUAGENAME.LIST/NAME.LIST/NAME')]
        r['aliases'] = names[1:]
        r['parent_guid'] = sgby[r['parent_name']]['guid'] if r['parent_name'] else ''
        r['closing_as_of'] = as_of
        cq, cv = dec(r['closing_qty']), dec(r['closing_value'])
        r['closing_rate'] = canon(q(cv / cq, 2)) if cq > 0 else '0.00'
        for gd in e.findall('GSTDETAILS.LIST'):
            g = base('tm_stock_item_gst')
            g.update(parse_simple(gd, 'tm_stock_item_gst', skip={'hsn_code'}))
            g['hsn_code'] = gd.findtext('HSNCODE') or ''
            g['stock_item_guid'] = r['guid']
            for rd in gd.findall('STATEWISEDETAILS.LIST/RATEDETAILS.LIST'):
                head = HEAD_NAMES[rd.findtext('GSTRATEDUTYHEAD')]
                g[head + '_rate'] = canon(rd.findtext('GSTRATE'))
            T['tm_stock_item_gst'].append(g)
        for ba in e.findall('BATCHALLOCATIONS.LIST'):
            b = base('tm_stock_batch_opening')
            b.update(parse_simple(ba, 'tm_stock_batch_opening', skip={'opening_qty'}))
            t = ba.findtext('OPENINGBALANCE')
            b['opening_qty'] = canon(t.split()[0]) if t else '0.00'
            b['stock_item_guid'] = r['guid']; b['godown_guid'] = gdby[b['godown_name']]['guid']
            T['tm_stock_batch_opening'].append(b)
    items = master('tm_stock_item', 'stock_items.xml', 'STOCKITEM', x_item, skip=('opening_qty', 'closing_qty'))
    itby = {i['name']: i for i in items}
    gst_for = {}
    for g in T['tm_stock_item_gst']:
        gst_for.setdefault(g['stock_item_guid'], []).append(g)

    # vouchers
    vouchers, LL, IL, BA, BL, TX = [], [], [], [], [], []
    for e in objects(files['vouchers.xml'], 'VOUCHER'):
        v = base('tx_voucher')
        v.update(parse_simple(e, 'tx_voucher', skip={'remote_id'}))
        v['remote_id'] = e.get('REMOTEID') or ''
        v['address'] = list_lines(e, 'ADDRESS.LIST')
        vt = vtby[v['voucher_type_name'].lower()]
        v['voucher_type_guid'] = vt['guid']
        v['kind'] = vt['base_kind']
        v['party_guid'] = ledby[v['party_name']]['guid'] if v['party_name'] else ''
        v['counts_in_books'] = not (v['is_cancelled'] or v['is_optional'] or v['is_void'])
        vd = dict(voucher_date=v['date'], voucher_kind=v['kind'], counts_in_books=v['counts_in_books'])
        idx = 0
        ledger_entries = [c for c in e if c.tag in ('ALLLEDGERENTRIES.LIST', 'LEDGERENTRIES.LIST')]
        inv_entries = [c for c in e if c.tag in ('ALLINVENTORYENTRIES.LIST', 'INVENTORYENTRIES.LIST', 'INVENTORYENTRIESOUT.LIST', 'INVENTORYENTRIESIN.LIST')]
        v_lines = []
        for le in ledger_entries:
            l = base('tx_ledger_line')
            l.update(parse_simple(le, 'tx_ledger_line'))
            l.update(voucher_guid=v['guid'], line_index=idx, source='ledger', inv_line_index=-1, ledger_guid=ledby[l['ledger_name']]['guid'], **vd)
            v_lines.append(l)
            for j, be in enumerate(le.findall('BILLALLOCATIONS.LIST')):
                b = base('tx_bill_alloc')
                b.update(parse_simple(be, 'tx_bill_alloc'))
                b.update(voucher_guid=v['guid'], line_index=idx, alloc_index=j, ledger_guid=l['ledger_guid'], ledger_name=l['ledger_name'], **vd)
                BL.append(b)
            idx += 1
        v_inv = []
        for i, ie in enumerate(inv_entries):
            il = base('tx_inventory_line')
            il.update(parse_simple(ie, 'tx_inventory_line', skip={'godown_name'}))
            il['stock_item_guid'] = itby[il['stock_item_name']]['guid']
            for cn, tg in (('billed_qty', 'BILLEDQTY'), ('actual_qty', 'ACTUALQTY')):
                il[cn] = canon(ie.findtext(tg).split()[0])
            il['unit'] = qty_unit(ie.findtext('BILLEDQTY'))
            rt = ie.findtext('RATE')
            il['rate'] = canon(rt.split('/')[0]) if rt else '0.00'
            il['rate_unit'] = rate_unit(rt)
            bes = ie.findall('BATCHALLOCATIONS.LIST')
            il['godown_name'] = bes[0].findtext('GODOWNNAME') if bes else ''
            il['godown_guid'] = gdby[il['godown_name']]['guid'] if il['godown_name'] else ''
            il.update(voucher_guid=v['guid'], line_index=i, **vd)
            v_inv.append(il)
            dest = ie.tag == 'INVENTORYENTRIESIN.LIST'
            for j, be in enumerate(bes):
                b = base('tx_batch_alloc')
                b.update(parse_simple(be, 'tx_batch_alloc', skip={'billed_qty', 'actual_qty'}))
                for cn, tg in (('billed_qty', 'BILLEDQTY'), ('actual_qty', 'ACTUALQTY')):
                    b[cn] = canon(be.findtext(tg).split()[0])
                b.update(voucher_guid=v['guid'], line_index=i, alloc_index=j, stock_item_guid=il['stock_item_guid'], godown_guid=gdby[b['godown_name']]['guid'], is_destination=dest, **vd)
                BA.append(b)
            for ae in ie.findall('ACCOUNTINGALLOCATIONS.LIST'):
                l = base('tx_ledger_line')
                l.update(parse_simple(ae, 'tx_ledger_line'))
                l.update(voucher_guid=v['guid'], line_index=idx, source='inv_alloc', inv_line_index=i, ledger_guid=ledby[l['ledger_name']]['guid'], **vd)
                v_lines.append(l)
                idx += 1
        # headline amount
        if v['is_cancelled']:
            v['amount'] = '0.00'
        elif v['kind'] in ('sales', 'purchase', 'credit_note', 'debit_note', 'receipt', 'payment') and v['party_name']:
            v['amount'] = canon(abs(dec(next(l['amount'] for l in v_lines if l['is_party_ledger']))))
        elif v_lines:
            v['amount'] = canon(sum((-dec(l['amount']) for l in v_lines if dec(l['amount']) < 0), D(0)))
        else:
            dest = {x['line_index'] for x in BA if x['voucher_guid'] == v['guid'] and x['is_destination']}
            v['amount'] = canon(sum((abs(dec(i['amount'])) for i in v_inv if i['line_index'] not in dest), D(0)))
        # tax lines (derived)
        if v['is_invoice'] and not v['is_cancelled']:
            intra = v['place_of_supply'] == comp['state_name']
            for il in v_inv:
                slabs = sorted([g for g in gst_for[il['stock_item_guid']] if g['applicable_from'] <= v['date']], key=lambda g: g['applicable_from'])
                g = slabs[-1]
                heads = (('cgst', g['cgst_rate']), ('sgst', g['sgst_rate'])) if intra else (('igst', g['igst_rate']),)
                taxable = abs(dec(il['amount']))
                for head, rate in heads:
                    if dec(rate) == 0:
                        continue
                    TX.append(dict(base('tx_tax_line'), voucher_guid=v['guid'], source='inventory', line_index=il['line_index'], tax_head=head, rate=canon(rate),
                                   taxable_amount=canon(taxable), tax_amount=canon(q(taxable * dec(rate) / 100, 4)), hsn_code=il['hsn_code'], **vd))
        vouchers.append(v); LL.extend(v_lines); IL.extend(v_inv)
    T['tx_voucher'], T['tx_ledger_line'], T['tx_inventory_line'], T['tx_batch_alloc'], T['tx_bill_alloc'], T['tx_tax_line'] = vouchers, LL, IL, BA, BL, TX
    # last_sale_date is a stock-item field Tally supplies; keep as exported
    return T
