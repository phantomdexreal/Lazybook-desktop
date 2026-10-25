"""lbmodel - reference helpers for docs/shared/data_model.json.

Pure standard library. Used by the fixture tools; also a readable reference for the
Dexie/SQLite schema generators that the PWA and Desktop kits write.
Run tools with:  python3 -I <tool>.py   (each tool adds its own folder to sys.path).
"""
import json
import os
import re
from decimal import Decimal, ROUND_HALF_UP, InvalidOperation

HERE = os.path.dirname(os.path.abspath(__file__))
SHARED = os.path.abspath(os.path.join(HERE, '..', '..'))
SCALE = 4
WIRE_DEC_RE = re.compile(r'^-?\d+(\.\d{1,4})?$')


def load_model(path=None):
    with open(path or os.path.join(SHARED, 'data_model.json'), encoding='utf-8') as f:
        return json.load(f)


def load_constants(path=None):
    with open(path or os.path.join(SHARED, 'constants.json'), encoding='utf-8') as f:
        return json.load(f)


# ------------------------------------------------------------------ decimals ---
def dec(v):
    """Any str/int/Decimal -> Decimal. Raises on garbage."""
    if isinstance(v, Decimal):
        return v
    if v is None or v == '':
        return Decimal(0)
    try:
        return Decimal(str(v))
    except InvalidOperation:
        raise ValueError('not a decimal: %r' % (v,))


def q(v, places=SCALE):
    """Round half away from zero to `places` decimals."""
    return dec(v).quantize(Decimal(1).scaleb(-places), rounding=ROUND_HALF_UP)


def canon(v):
    """Canonical wire string: at least 2, at most 4 decimals, trailing zeros beyond the 2nd removed."""
    d = q(v, SCALE)
    s = format(d, 'f')
    if '.' not in s:
        return s + '.00'
    ip, fp = s.split('.')
    fp = fp.rstrip('0')
    if len(fp) < 2:
        fp = fp.ljust(2, '0')
    if ip == '-0' and set(fp) == {'0'}:
        ip = '0'
    return ip + '.' + fp


def to_minor(v):
    return int(q(v, SCALE).scaleb(SCALE))


def from_minor(n):
    return canon(Decimal(int(n)).scaleb(-SCALE))


# ---------------------------------------------------------------- row helpers ---
def cols(model, table):
    return model['tables'][table]['columns']


def default_row(model, table):
    row = {}
    for c in cols(model, table):
        dv = c.get('default')
        row[c['name']] = dv
    return row


def pk_tuple(model, table, row):
    return tuple(row[k] for k in model['tables'][table]['primary_key'])


def row_to_storage(model, table, row):
    """Wire row (strings) -> storage row (decimals as int minor units, bools as 0/1)."""
    out = {}
    for c in cols(model, table):
        v = row.get(c['name'], c.get('default'))
        t = c['type']
        if t == 'decimal':
            v = to_minor(v)
        elif t == 'bool':
            v = 1 if v else 0
        out[c['name']] = v
    return out


def storage_to_row(model, table, srow):
    out = {}
    for c in cols(model, table):
        v = srow[c['name']]
        t = c['type']
        if t == 'decimal':
            v = from_minor(v)
        elif t == 'bool':
            v = bool(v)
        out[c['name']] = v
    return out


def check_row(model, table, row):
    """Return a list of problems (empty list = ok)."""
    errs = []
    names = {c['name']: c for c in cols(model, table)}
    for k in row:
        if k not in names:
            errs.append('%s: unknown column %s' % (table, k))
    for n, c in names.items():
        if n not in row:
            errs.append('%s: missing column %s' % (table, n))
            continue
        v = row[n]
        t = c['type']
        if v is None:
            if not c.get('nullable'):
                errs.append('%s.%s: null not allowed' % (table, n))
            continue
        if t == 'text' and not isinstance(v, str):
            errs.append('%s.%s: expected text' % (table, n))
        elif t == 'int' and (not isinstance(v, int) or isinstance(v, bool)):
            errs.append('%s.%s: expected int' % (table, n))
        elif t == 'bool' and not isinstance(v, bool):
            errs.append('%s.%s: expected bool' % (table, n))
        elif t == 'decimal':
            if not isinstance(v, str) or not WIRE_DEC_RE.match(v):
                errs.append('%s.%s: bad decimal %r' % (table, n, v))
            elif canon(v) != v:
                errs.append('%s.%s: decimal not canonical %r (want %s)' % (table, n, v, canon(v)))
        elif t == 'date':
            if not isinstance(v, str) or not re.match(r'^\d{4}-\d{2}-\d{2}$', v):
                errs.append('%s.%s: bad date %r' % (table, n, v))
    return errs


# ---------------------------------------------------------------- SQLite DDL ---
SQL_TYPE = {'text': 'TEXT', 'int': 'INTEGER', 'decimal': 'INTEGER', 'date': 'TEXT', 'bool': 'INTEGER', 'json': 'TEXT'}


def ddl_sqlite(model):
    lines = []
    for tname in model['tables_order']:
        t = model['tables'][tname]
        parts = []
        for c in t['columns']:
            p = '"%s" %s' % (c['name'], SQL_TYPE[c['type']])
            if not c.get('nullable'):
                p += ' NOT NULL'
            parts.append(p)
        parts.append('PRIMARY KEY (%s)' % ', '.join('"%s"' % k for k in t['primary_key']))
        lines.append('CREATE TABLE IF NOT EXISTS "%s" (\n  %s\n) WITHOUT ROWID;' % (tname, ',\n  '.join(parts)))
        for i in t['indexes']:
            lines.append('CREATE %sINDEX IF NOT EXISTS "%s__%s" ON "%s" (%s);' % (
                'UNIQUE ' if i.get('unique') else '', tname, i['name'], tname, ', '.join('"%s"' % c for c in i['columns'])))
    return '\n'.join(lines) + '\n'


def sqlite_value(c, v):
    t = c['type']
    if v is None:
        return None
    if t == 'decimal':
        return to_minor(v)
    if t == 'bool':
        return 1 if v else 0
    if t == 'json':
        return json.dumps(v, ensure_ascii=False, separators=(',', ':'))
    return v


def sqlite_insert(conn, model, table, rows, replace=True):
    cs = cols(model, table)
    sql = 'INSERT %sINTO "%s" (%s) VALUES (%s)' % ('OR REPLACE ' if replace else '', table, ', '.join('"%s"' % c['name'] for c in cs), ', '.join('?' * len(cs)))
    conn.executemany(sql, [[sqlite_value(c, r.get(c['name'], c.get('default'))) for c in cs] for r in rows])


def sqlite_read(conn, model, table):
    cs = cols(model, table)
    cur = conn.execute('SELECT %s FROM "%s"' % (', '.join('"%s"' % c['name'] for c in cs), table))
    out = []
    for rec in cur:
        row = {}
        for c, v in zip(cs, rec):
            t = c['type']
            if v is None:
                row[c['name']] = None
            elif t == 'decimal':
                row[c['name']] = from_minor(v)
            elif t == 'bool':
                row[c['name']] = bool(v)
            elif t == 'json':
                row[c['name']] = json.loads(v)
            else:
                row[c['name']] = v
        out.append(row)
    return out


def dumps_canonical(obj):
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
