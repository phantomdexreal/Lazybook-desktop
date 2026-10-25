"""gen_bench_data - scales the fixture company to N vouchers for STORAGE benchmarks. Output is a chunk sequence (JSONL, same shape as sync_examples) so a bench
can load it with the normal applier. Cloned vouchers get new guids/numbers; accounting totals are NOT consistent (storage speed only).
Run: python3 -I gen_bench_data.py [N=200000] [out=<path>]    Not run in check_all (large)."""
import copy
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sync_ref as R  # noqa: E402
from lbmodel import SHARED  # noqa: E402

N = int(sys.argv[1]) if len(sys.argv) > 1 else 200000
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.getcwd(), 'bench_chunks.jsonl')
FIX = os.path.join(SHARED, 'fixtures', 'tables')
T = {t: json.load(open(os.path.join(FIX, t + '.json'), encoding='utf-8')) for t in R.MODEL['tables_order']}
vs = T['tx_voucher']
kids = ('tx_ledger_line', 'tx_inventory_line', 'tx_batch_alloc', 'tx_bill_alloc', 'tx_tax_line')
by = {t: {} for t in kids}
for t in kids:
    for r in T[t]:
        by[t].setdefault(r['voucher_guid'], []).append(r)
cg = T['tm_company'][0]['guid']
base_alter = max(v['alter_id'] for v in vs)
vouchers, children = [], {t: [] for t in kids}
for i in range(N):
    src = vs[i % len(vs)]
    v = copy.deepcopy(src)
    v['guid'] = '%s-b%d' % (src['guid'], i)
    v['number'] = '%s/%d' % (src['number'], i)
    v['alter_id'] = base_alter + i + 1
    vouchers.append(v)
    for t in kids:
        for r in by[t].get(src['guid'], []):
            c = copy.deepcopy(r)
            c['voucher_guid'] = v['guid']
            children[t].append(c)
T2 = copy.deepcopy(T)
T2['tx_voucher'] = vouchers
for t in kids:
    T2[t] = children[t]
lo = min(v['date'] for v in vouchers); hi = max(v['date'] for v in vouchers)
chunks = R.initial_sequence(T2, cg, lo, hi)
with open(OUT, 'w', encoding='utf-8') as f:
    for c in chunks:
        f.write(json.dumps(c, ensure_ascii=False, separators=(',', ':')) + '\n')
print('wrote', OUT, 'chunks', len(chunks), 'vouchers', N)
