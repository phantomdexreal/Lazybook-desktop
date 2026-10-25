"""check_sync - generate and verify docs/shared/sync_examples/* with the reference chunker/applier.

Verifies: crypto vectors; initial sequence (plain and encrypted) rebuilds the fixture company exactly (including replace_scope over stale rows);
per-op examples; a delta sequence (new voucher, deleted voucher, edited header, renamed ledger, changed closings).
Run:  python3 -I check_sync.py
"""
import base64
import copy
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sync_ref as R  # noqa: E402
from lbmodel import SHARED, dumps_canonical, load_model, sqlite_insert, canon, dec  # noqa: E402

MODEL = R.MODEL
EX = os.path.join(SHARED, 'sync_examples')
FIXT = os.path.join(SHARED, 'fixtures', 'tables')
LICENSE = 'LB-TEST-0000-0000-0001'
VEC = json.load(open(os.path.join(SHARED, 'crypto_vectors.json')))


def load_tables():
    return {t: json.load(open(os.path.join(FIXT, t + '.json'), encoding='utf-8')) for t in MODEL['tables_order']}


def write_jsonl(path, items):
    with open(path, 'w', encoding='utf-8') as f:
        for it in items:
            f.write(json.dumps(it, ensure_ascii=False, separators=(',', ':')) + '\n')


def same(a, b, tables=None):
    bad = 0
    for t in tables or MODEL['tables_order']:
        x = sorted(dumps_canonical(r) for r in a[t])
        y = sorted(dumps_canonical(r) for r in b[t])
        if x != y:
            print('STATE MISMATCH', t, len(x), len(y))
            bad += 1
    return bad


def main():
    os.makedirs(EX, exist_ok=True)
    bad = 0
    # ---- crypto vectors
    key = R.derive_key(VEC['kdf']['passphrase'], VEC['kdf']['salt_b64'])
    assert key.hex() == VEC['kdf']['key_hex'], 'KDF vector'
    assert R.kcv(key) == VEC['kcv']['value'], 'KCV vector'
    pt = R.decrypt_envelope(VEC['aead']['envelope'], key, VEC['aead']['license_key'])
    assert json.dumps(pt, separators=(',', ':')) == VEC['aead']['plaintext_utf8'], 'AEAD vector'
    env = R.encrypt_json(pt, key, VEC['aead']['license_key'], iv=base64.b64decode(VEC['aead']['iv_b64']))
    assert env == VEC['aead']['envelope'], 'AEAD encrypt reproduces the vector'
    print('crypto vectors: ok')

    T = load_tables()
    cg = T['tm_company'][0]['guid']
    d_from, d_to = '2026-04-01', '2026-09-30'

    # ---- initial, plaintext, over a database that holds a stale voucher inside the window
    chunks = R.initial_sequence(T, cg, d_from, d_to)
    conn = R.new_db()
    stale = copy.deepcopy(T['tx_voucher'][0]); stale['guid'] = 'stale-voucher'; stale['number'] = 'STALE'
    sqlite_insert(conn, MODEL, 'tx_voucher', [stale])
    R.apply_all(conn, chunks)
    state = R.dump_db(conn)
    bad += same(state, T)
    print('initial plaintext: %d chunks, %d bytes' % (len(chunks), sum(len(json.dumps(c)) for c in chunks)))
    write_jsonl(os.path.join(EX, 'initial_sequence.jsonl'), chunks)

    # ---- initial, encrypted (test key + deterministic IVs, examples only)
    echunks = R.initial_sequence(T, cg, d_from, d_to, key=key, license_key=LICENSE)
    conn2 = R.new_db()
    R.apply_all(conn2, echunks, key, LICENSE)
    bad += same(R.dump_db(conn2), T)
    write_jsonl(os.path.join(EX, 'initial_sequence.enc.jsonl'), echunks)
    print('initial encrypted: %d chunks, %d bytes' % (len(echunks), sum(len(json.dumps(c)) for c in echunks)))

    # ---- one example per op (tiny)
    cash = next(r for r in T['tm_ledger'] if r['name'] == 'Cash')
    v_ti013 = next(r for r in T['tx_voucher'] if r['number'] == 'TI-013')
    ex = []
    s = R.Seq()
    s.add('tm_ledger', 'clear', {'company_guid': cg})
    s.add('tm_ledger', 'upsert', [R.compact('tm_ledger', cash)])
    s.add('tx_voucher', 'replace_scope', {'company_guid': cg, 'from': '2026-09-01', 'to': '2026-09-30'})
    s.add('tx_voucher', 'delete_children', [{'company_guid': cg, 'guid': v_ti013['guid']}])
    s.add('tx_voucher', 'delete', [{'company_guid': cg, 'guid': v_ti013['guid']}])
    ex.extend(s.chunks)
    es = R.Seq(key, LICENSE, iv_prefix=b'lbex01')
    es.add('tm_ledger', 'upsert', [R.compact('tm_ledger', cash)])
    es.chunks[-1]['is_last'] = True
    ex.extend(es.chunks)
    write_jsonl(os.path.join(EX, 'chunks.jsonl'), ex)
    # decrypt check of the shipped encrypted example
    back = R.decrypt_envelope(es.chunks[0]['payload'], key, LICENSE)
    assert back[0]['name'] == 'Cash'

    # ---- delta scenario on top of the initial state
    D = copy.deepcopy(T)
    ds = R.Seq()
    byname = lambda t, n: next(r for r in D[t] if r['name'] == n)
    # (a) new receipt R-009: Alpha pays 1000 against TI-010
    ref = next(r for r in D['tx_voucher'] if r['number'] == 'R-007')
    max_alter = max(r['alter_id'] for r in D['tx_voucher'])
    nv = copy.deepcopy(ref)
    nv.update(guid='fx-delta-r009-00000001', number='R-009', date='2026-09-29', alter_id=max_alter + 1, master_id=max(r['master_id'] for r in D['tx_voucher']) + 1,
              remote_id='', narration='Delta example receipt', amount='1000.00')
    alpha, bank = byname('tm_ledger', 'Alpha Retail'), byname('tm_ledger', 'HDFC Bank')
    vd = dict(voucher_date='2026-09-29', voucher_kind='receipt', counts_in_books=True)
    l0 = dict(copy.deepcopy(next(r for r in D['tx_ledger_line'] if r['voucher_guid'] == ref['guid'] and r['line_index'] == 0)), voucher_guid=nv['guid'], amount='1000.00', **vd)
    l1 = dict(copy.deepcopy(next(r for r in D['tx_ledger_line'] if r['voucher_guid'] == ref['guid'] and r['line_index'] == 1)), voucher_guid=nv['guid'], amount='-1000.00', **vd)
    b0 = dict(copy.deepcopy(next(r for r in D['tx_bill_alloc'] if r['voucher_guid'] == ref['guid'])), voucher_guid=nv['guid'], bill_name='TI-010', amount='1000.00', **vd)
    d_hdr = [nv]
    alpha_new = dict(alpha, closing_balance=canon(dec(alpha['closing_balance']) + 1000), alter_id=alpha['alter_id'] + 0)
    bank_new = dict(bank, closing_balance=canon(dec(bank['closing_balance']) - 1000))
    grp = {g['name']: g for g in D['tm_group']}
    gnew = [dict(grp['Key Customers'], closing_balance=canon(dec(grp['Key Customers']['closing_balance']) + 1000)),
            dict(grp['Sundry Debtors'], closing_balance=canon(dec(grp['Sundry Debtors']['closing_balance']) + 1000)),
            dict(grp['Bank Accounts'], closing_balance=canon(dec(grp['Bank Accounts']['closing_balance']) - 1000))]
    ds.add('tx_voucher', 'delete_children', [{'company_guid': cg, 'guid': nv['guid']}])
    ds.add('tx_voucher', 'upsert', [R.compact('tx_voucher', nv)])
    ds.add('tx_ledger_line', 'upsert', [R.compact('tx_ledger_line', l0), R.compact('tx_ledger_line', l1)])
    ds.add('tx_bill_alloc', 'upsert', [R.compact('tx_bill_alloc', b0)])
    ds.add('tm_ledger', 'upsert', [R.compact('tm_ledger', alpha_new), R.compact('tm_ledger', bank_new)])
    ds.add('tm_group', 'upsert', [R.compact('tm_group', g) for g in gnew])
    # (b) delete optional voucher TI-013
    ds.add('tx_voucher', 'delete_children', [{'company_guid': cg, 'guid': v_ti013['guid']}])
    ds.add('tx_voucher', 'delete', [{'company_guid': cg, 'guid': v_ti013['guid']}])
    # (c) header-only edit of S-002 (narration), new alter_id
    s2 = next(r for r in D['tx_voucher'] if r['number'] == 'S-002')
    s2n = dict(s2, narration='Entered from phone (edited)', alter_id=max_alter + 2)
    ds.add('tx_voucher', 'upsert', [R.compact('tx_voucher', s2n)])
    # (d) ledger rename (guid unchanged)
    gam = byname('tm_ledger', 'Gamma Enterprises')
    gam_n = dict(gam, name='Gamma Enterprises Ltd', name_lc='gamma enterprises ltd', alter_id=max(r['alter_id'] for r in D['tm_ledger']) + 100)
    ds.add('tm_ledger', 'upsert', [R.compact('tm_ledger', gam_n)])
    dchunks = ds.finish()
    # expected state
    E = copy.deepcopy(D)
    E['tx_voucher'] = [r for r in E['tx_voucher'] if r['guid'] != v_ti013['guid']] + [nv]
    E['tx_voucher'] = [s2n if r['guid'] == s2['guid'] else r for r in E['tx_voucher']]
    for t in ('tx_ledger_line', 'tx_inventory_line', 'tx_batch_alloc', 'tx_bill_alloc', 'tx_tax_line'):
        E[t] = [r for r in E[t] if r['voucher_guid'] != v_ti013['guid']]
    E['tx_ledger_line'] += [l0, l1]; E['tx_bill_alloc'] += [b0]
    rep = {alpha['guid']: alpha_new, bank['guid']: bank_new, gam['guid']: gam_n}
    E['tm_ledger'] = [rep.get(r['guid'], r) for r in E['tm_ledger']]
    grep = {g['guid']: g for g in gnew}
    E['tm_group'] = [grep.get(r['guid'], r) for r in E['tm_group']]
    R.apply_all(conn, dchunks)
    bad += same(R.dump_db(conn), E)
    # facts
    st = R.dump_db(conn)
    per = {}
    for l in st['tx_ledger_line']:
        per[l['voucher_guid']] = per.get(l['voucher_guid'], 0) + int(dec(l['amount']) * 10000)
    assert all(v == 0 for v in per.values()), 'every voucher still balances after delta'
    assert not any(v['number'] == 'TI-013' for v in st['tx_voucher'])
    assert any(l['name'] == 'Gamma Enterprises Ltd' for l in st['tm_ledger'])
    write_jsonl(os.path.join(EX, 'delta_sequence.jsonl'), dchunks)
    json.dump({'applies_on_top_of': 'initial_sequence.jsonl', 'row_counts': {t: len(st[t]) for t in MODEL['tables_order']},
               'facts': ['voucher R-009 exists with 2 ledger lines and 1 bill allocation (Agst Ref TI-010, 1000.00)', 'voucher TI-013 and all its child rows are gone',
                         'S-002 narration is "Entered from phone (edited)"', 'ledger guid of Gamma Enterprises now has name "Gamma Enterprises Ltd"',
                         'Alpha Retail closing_balance -19980.00, HDFC Bank -63567.00', 'every voucher still sums to zero']},
              open(os.path.join(EX, 'delta_expected.json'), 'w'), indent=1)
    open(os.path.join(EX, 'delta_expected.json'), 'a').write('\n')
    print('delta: %d chunks; problems so far: %d' % (len(dchunks), bad))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
