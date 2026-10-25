"""check_all - runs every fixture self-check; exit code 0 only when all pass. Run: python3 -I check_all.py"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
STEPS = [('check_fixtures.py', []), ('compute_expected.py', ['--check']), ('check_sync.py', []), ('validate_entries.py', [])]
bad = 0
for name, args in STEPS:
    r = subprocess.run([sys.executable, '-I', os.path.join(HERE, name)] + args, capture_output=True, text=True, cwd=HERE)
    last = (r.stdout.strip().splitlines() or [''])[-1]
    print('%-22s %s  %s' % (name, 'ok  ' if r.returncode == 0 else 'FAIL', last))
    if r.returncode:
        print(r.stdout[-800:], r.stderr[-800:])
        bad += 1
sys.exit(1 if bad else 0)
