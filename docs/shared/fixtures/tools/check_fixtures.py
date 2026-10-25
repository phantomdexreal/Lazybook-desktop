"""check_fixtures - rebuild fixtures, write mock Tally XML, and prove the wire mapping round-trips.

1) fixture rows (build_fixtures)  2) emit mock Tally XML (tally_xml_io.emit)  3) parse the XML back (tally_xml_io.parse)
4) compare every table row-for-row  5) load all tables into SQLite built from data_model.json (PK and index sanity).
Run:  python3 -I check_fixtures.py
"""
import os
import sqlite3
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_fixtures as BF  # noqa: E402
import tally_xml_io as X  # noqa: E402
import fx_source as S  # noqa: E402
from lbmodel import SHARED, ddl_sqlite, sqlite_insert, sqlite_read, pk_tuple, dumps_canonical  # noqa: E402

MODEL = BF.MODEL


def main():
    T = BF.build()
    errs = BF.write(T)
    if errs:
        print('row errors:', errs[:10])
        return 1
    files = X.emit(T)
    xd = os.path.join(SHARED, 'fixtures', 'tally_xml')
    os.makedirs(xd, exist_ok=True)
    for name, text in files.items():
        with open(os.path.join(xd, name), 'w', encoding='utf-8') as f:
            f.write(text)
    P = X.parse(files, S.AS_OF)
    bad = 0
    for t in MODEL['tables_order']:
        a = sorted(T[t], key=lambda r: pk_tuple(MODEL, t, r) if t != 'ref_voucher_kind' else (r['kind'],))
        b = sorted(P[t], key=lambda r: pk_tuple(MODEL, t, r) if t != 'ref_voucher_kind' else (r['kind'],))
        if len(a) != len(b):
            print('COUNT MISMATCH', t, len(a), len(b))
            bad += 1
            continue
        for ra, rb in zip(a, b):
            if dumps_canonical(ra) != dumps_canonical(rb):
                diff = {k: (ra.get(k), rb.get(k)) for k in set(ra) | set(rb) if ra.get(k) != rb.get(k)}
                print('ROW MISMATCH', t, pk_tuple(MODEL, t, ra) if t != 'ref_voucher_kind' else ra['kind'], diff)
                bad += 1
                break
    # sqlite load
    conn = sqlite3.connect(':memory:')
    conn.executescript(ddl_sqlite(MODEL))
    for t in MODEL['tables_order']:
        sqlite_insert(conn, MODEL, t, T[t], replace=False)
    for t in MODEL['tables_order']:
        n = conn.execute('select count(*) from "%s"' % t).fetchone()[0]
        if n != len(T[t]):
            print('SQLITE COUNT MISMATCH', t, n, len(T[t]))
            bad += 1
        back = sqlite_read(conn, MODEL, t)
        if sorted(dumps_canonical(r) for r in back) != sorted(dumps_canonical(r) for r in T[t]):
            print('SQLITE ROUNDTRIP MISMATCH', t)
            bad += 1
    print('tables checked:', len(MODEL['tables_order']), 'problems:', bad)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
