"""sync_ref - reference chunker, applier and crypto for SYNC_SPEC.md (readable reference, not production code)."""
import base64
import gzip
import hashlib
import hmac
import json
import os
import sqlite3
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lbmodel import SHARED, load_model, load_constants, default_row, ddl_sqlite, sqlite_insert, sqlite_read  # noqa: E402

MODEL = load_model()
CONST = load_constants()
SYNC = CONST['sync']
CRYPTO = CONST['crypto']


# ------------------------------------------------------------------ crypto ---
def derive_key(passphrase, salt_b64):
    return hashlib.pbkdf2_hmac('sha256', passphrase.encode('utf-8'), base64.b64decode(salt_b64), CRYPTO['iterations'], CRYPTO['key_bytes'])


def kcv(key):
    return base64.b64encode(hmac.new(key, CRYPTO['kcv_label'].encode(), hashlib.sha256).digest()[:CRYPTO['kcv_bytes']]).decode()


def encrypt_json(obj, key, license_key, iv=None, gz=False):
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    raw = json.dumps(obj, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    if gz:
        raw = gzip.compress(raw, mtime=0)
    iv = iv or os.urandom(CRYPTO['iv_bytes'])
    ct = AESGCM(key).encrypt(iv, raw, (CRYPTO['aad_prefix'] + license_key).encode())
    env = {'v': 1, 'iv': base64.b64encode(iv).decode(), 'ct': base64.b64encode(ct).decode()}
    if gz:
        env['z'] = 1
    return env


def decrypt_envelope(env, key, license_key):
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    raw = AESGCM(key).decrypt(base64.b64decode(env['iv']), base64.b64decode(env['ct']), (CRYPTO['aad_prefix'] + license_key).encode())
    if env.get('z'):
        raw = gzip.decompress(raw)
    return json.loads(raw.decode('utf-8'))


# ----------------------------------------------------------------- chunker ---
def compact(table, row):
    """Omit columns equal to their default (SYNC_SPEC section 3.2)."""
    out = {}
    for c in MODEL['tables'][table]['columns']:
        v = row.get(c['name'], c.get('default'))
        if v != c.get('default') or c['name'] in MODEL['tables'][table]['primary_key']:
            out[c['name']] = v
    return out


def _size(obj):
    return len(json.dumps(obj, ensure_ascii=False, separators=(',', ':')).encode('utf-8'))


def split_rows(rows, make_payload):
    """Greedy split so that each payload stays within chunk_max_payload_bytes and chunk_max_rows."""
    limit = SYNC['chunk_max_payload_bytes']
    out, cur = [], []
    for r in rows:
        trial = cur + [r]
        if cur and (len(trial) > SYNC['chunk_max_rows'] or _size(make_payload(trial)) > limit):
            out.append(cur)
            cur = [r]
        else:
            cur = trial
    if cur:
        out.append(cur)
    return out


class Seq:
    def __init__(self, key=None, license_key=None, iv_prefix=b'lbtest'):
        self.n = 0
        self.chunks = []
        self.key, self.license_key, self.iv_prefix = key, license_key, iv_prefix

    def add(self, table, op, payload):
        self.n += 1
        enc = self.key is not None
        if enc:
            iv = self.iv_prefix + self.n.to_bytes(6, 'big')    # deterministic ONLY for the shipped test examples
            body = encrypt_json(payload, self.key, self.license_key, iv=iv, gz=SYNC['gzip_chunks'])
        else:
            body = payload
        self.chunks.append({'seq': self.n, 'table_name': table, 'op': op, 'enc': enc, 'is_last': False, 'payload': body})

    def finish(self):
        if not self.chunks:
            self.add('tm_company', 'upsert', [])
        self.chunks[-1]['is_last'] = True
        return self.chunks


def initial_sequence(T, company_guid, date_from, date_to, key=None, license_key=None):
    s = Seq(key, license_key)
    order = SYNC['table_order']
    for t in order:
        meta = MODEL['tables'][t]
        if meta['scope'] == 'follows_parent' and meta['parent']['table'] == 'tx_voucher':
            continue
        if meta['scope'] == 'date_windowed':
            continue
        rows = [r for r in T[t] if t == 'tm_company' and r['guid'] == company_guid or t != 'tm_company' and r['company_guid'] == company_guid]
        if t != 'tm_company':
            s.add(t, 'clear', {'company_guid': company_guid})
        for part in split_rows([compact(t, r) for r in rows], lambda x: x):
            s.add(t, 'upsert', part)
    s.add('tx_voucher', 'replace_scope', {'company_guid': company_guid, 'from': date_from, 'to': date_to})
    vs = sorted([r for r in T['tx_voucher'] if r['company_guid'] == company_guid and date_from <= r['date'] <= date_to], key=lambda r: (r['date'], r['guid']))
    guids = {v['guid'] for v in vs}
    for part in split_rows([compact('tx_voucher', r) for r in vs], lambda x: x):
        s.add('tx_voucher', 'upsert', part)
    for t in ('tx_ledger_line', 'tx_inventory_line', 'tx_batch_alloc', 'tx_bill_alloc', 'tx_tax_line'):
        rows = sorted([r for r in T[t] if r['voucher_guid'] in guids], key=lambda r: tuple(str(r[k]).zfill(8) for k in MODEL['tables'][t]['primary_key']))
        for part in split_rows([compact(t, r) for r in rows], lambda x: x):
            s.add(t, 'upsert', part)
    return s.finish()


# ----------------------------------------------------------------- applier ---
def new_db():
    conn = sqlite3.connect(':memory:')
    conn.executescript(ddl_sqlite(MODEL))
    sqlite_insert(conn, MODEL, 'ref_voucher_kind', MODEL['tables']['ref_voucher_kind']['seed_rows'])
    return conn


def apply_chunk(conn, chunk, key=None, license_key=None):
    payload = chunk['payload']
    if chunk.get('enc'):
        payload = decrypt_envelope(payload, key, license_key)
    t, op = chunk['table_name'], chunk['op']
    meta = MODEL['tables'][t]
    pk = meta['primary_key']
    if op == 'upsert':
        rows = []
        for r in payload:
            full = default_row(MODEL, t)
            full.update(r)
            rows.append(full)
        sqlite_insert(conn, MODEL, t, rows, replace=True)
    elif op == 'delete':
        for k in payload:
            conn.execute('DELETE FROM "%s" WHERE %s' % (t, ' AND '.join('"%s"=?' % c for c in pk)), [k[c] for c in pk])
    elif op == 'clear':
        if isinstance(payload, dict) and payload.get('company_guid'):
            conn.execute('DELETE FROM "%s" WHERE company_guid=?' % t, [payload['company_guid']])
        else:
            conn.execute('DELETE FROM "%s"' % t)
    elif op == 'replace_scope':
        assert t == 'tx_voucher'
        args = [payload['company_guid'], payload['from'], payload['to']]
        conn.execute('DELETE FROM tx_voucher WHERE company_guid=? AND date BETWEEN ? AND ?', args)
        for ch in meta['children']:
            conn.execute('DELETE FROM "%s" WHERE company_guid=? AND voucher_date BETWEEN ? AND ?' % ch['table'], args)
    elif op == 'delete_children':
        for k in payload:
            for ch in meta['children']:
                cond = ' AND '.join('"%s"=?' % cc for cc in ['company_guid'] + list(ch['fk'].keys()))
                conn.execute('DELETE FROM "%s" WHERE %s' % (ch['table'], cond), [k['company_guid']] + [k[pc] for pc in ch['fk'].values()])
    else:
        raise ValueError(op)


def apply_all(conn, chunks, key=None, license_key=None):
    """Apply in order inside ONE transaction per chunk; also verifies seq contiguity and is_last."""
    last = 0
    for ch in chunks:
        assert ch['seq'] == last + 1, ('seq gap', last, ch['seq'])
        last = ch['seq']
        with conn:
            apply_chunk(conn, ch, key, license_key)
    assert chunks[-1]['is_last'] and not any(c['is_last'] for c in chunks[:-1]), 'is_last must be set only on the final chunk'


def dump_db(conn):
    return {t: sqlite_read(conn, MODEL, t) for t in MODEL['tables_order']}
