"""Phase 20 helper: apply chunk JSONL files with the shared reference applier and compare with the shared fixtures.
Usage: python3 -I tests/chunker-apply.py <initial.jsonl> [<delta.jsonl>]
Prints OK lines; exits 1 on any mismatch. The reference lives in docs/shared/fixtures/tools (read-only reference)."""
import copy, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.join(HERE, '..', 'docs', 'shared', 'fixtures', 'tools')
sys.path.insert(0, TOOLS)
sys.dont_write_bytecode = True
import sync_ref as R  # noqa: E402
from lbmodel import SHARED, dumps_canonical, sqlite_insert  # noqa: E402

def load(p):
    return [json.loads(l) for l in open(p, encoding='utf-8') if l.strip()]

def tables(path_dir):
    return {t: json.load(open(os.path.join(path_dir, t + '.json'), encoding='utf-8')) for t in R.MODEL['tables_order']}

def same(a, b):
    bad = 0
    for t in R.MODEL['tables_order']:
        if sorted(dumps_canonical(r) for r in a[t]) != sorted(dumps_canonical(r) for r in b[t]):
            print('STATE MISMATCH', t); bad += 1
    return bad

T = tables(os.path.join(SHARED, 'fixtures', 'tables'))
conn = R.new_db()
stale = copy.deepcopy(T['tx_voucher'][0]); stale['guid'] = 'stale-voucher'; stale['number'] = 'STALE'
sqlite_insert(conn, R.MODEL, 'tx_voucher', [stale])
R.apply_all(conn, load(sys.argv[1]))
bad = same(R.dump_db(conn), T)
print('OK initial applies to the fixtures' if not bad else 'FAIL initial')
if len(sys.argv) > 2:
    # the shared delta example applied on top of the initial state gives the same result as our delta chunks do
    ref = R.new_db(); R.apply_all(ref, load(os.path.join(SHARED, 'sync_examples', 'initial_sequence.jsonl')))
    R.apply_all(ref, load(os.path.join(SHARED, 'sync_examples', 'delta_sequence.jsonl')))
    R.apply_all(conn, load(sys.argv[2]))
    b2 = same(R.dump_db(conn), R.dump_db(ref))
    print('OK delta equals the shared delta example result' if not b2 else 'FAIL delta')
    bad += b2
sys.exit(1 if bad else 0)
