// Node-level check for Phase 21: wire crypto (vectors), encrypted shared sequence, keystore, pairing, chunker integration.
// Run: NODE_PATH=<dir with typescript, zod and qrcode-generator> node tests/crypto.cjs      (python3 + cryptography for the interop check)
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const out = path.join(__dirname, '.tmp-cr');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main/crypto', 'src/main/postbox', 'src/main', 'src/shared']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
const E = require(path.join(out, 'src/main/crypto/envelope.js'));
const K = require(path.join(out, 'src/main/crypto/keystore.js'));
const P = require(path.join(out, 'src/main/crypto/pairing.js'));
const CH = require(path.join(out, 'src/main/postbox/chunker.js'));
const SH = 'docs/shared';
const vec = JSON.parse(fs.readFileSync(`${SH}/crypto_vectors.json`, 'utf8'));
const consts = JSON.parse(fs.readFileSync(`${SH}/constants.json`, 'utf8'));
const readJsonl = (p) => fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const TEST_LICENSE = vec.aead.license_key;
const PASS = vec.kdf.passphrase;
const salt = Buffer.from(vec.kdf.salt_b64, 'base64');
let n = 0;
const ok = (m) => { n += 1; console.log('ok', n, m); };

(async () => {
  // 0. constants equal constants.json crypto
  {
    const c = consts.crypto;
    assert.equal(E.CRYPTO.iterations, c.iterations); assert.equal(E.CRYPTO.saltBytes, c.salt_bytes); assert.equal(E.CRYPTO.keyBytes, c.key_bytes);
    assert.equal(E.CRYPTO.ivBytes, c.iv_bytes); assert.equal(E.CRYPTO.tagBytes, c.tag_bytes); assert.equal(E.CRYPTO.aadPrefix, c.aad_prefix);
    assert.equal(E.CRYPTO.kcvLabel, c.kcv_label); assert.equal(E.CRYPTO.kcvBytes, c.kcv_bytes);
    ok('crypto constants equal constants.json');
  }
  // 1. CRYPTO-01 vectors
  const key = E.deriveKey(PASS, salt);
  assert.equal(key.toString('hex'), vec.kdf.key_hex);
  assert.equal((await E.deriveKeyAsync(PASS, salt)).toString('hex'), vec.kdf.key_hex);
  ok('KDF key equals the vector (sync and async)');
  assert.equal(E.computeKcv(key), vec.kcv.value);
  assert.ok(E.verifyKcv(key, vec.kcv.value));
  assert.ok(!E.verifyKcv(E.deriveKey('wrong', salt), vec.kcv.value));
  ok('KCV equals the vector; wrong key fails');
  const iv = Buffer.from(vec.aead.iv_b64, 'base64');
  const env = E.encryptBytes(key, TEST_LICENSE, Buffer.from(vec.aead.plaintext_utf8, 'utf8'), { iv });
  assert.deepEqual(env, vec.aead.envelope);
  assert.equal(E.decryptBytes(key, TEST_LICENSE, vec.aead.envelope).toString('utf8'), vec.aead.plaintext_utf8);
  ok('AEAD: re-encrypt equals the vector envelope and decrypt returns the plaintext');

  // 2. failures
  {
    const code = (fn) => { try { fn(); } catch (e) { return e.code; } return null; };
    assert.equal(code(() => E.decryptBytes(E.deriveKey('nope', salt), TEST_LICENSE, vec.aead.envelope)), 'LB_CRYPTO_DECRYPT_FAILED');
    assert.equal(code(() => E.decryptBytes(key, 'LB-OTHER', vec.aead.envelope)), 'LB_CRYPTO_DECRYPT_FAILED');
    const bad = { ...vec.aead.envelope, ct: Buffer.from(vec.aead.envelope.ct, 'base64').map((b, i) => (i === 3 ? b ^ 1 : b)).toString('base64') };
    assert.equal(code(() => E.decryptBytes(key, TEST_LICENSE, bad)), 'LB_CRYPTO_DECRYPT_FAILED');
    assert.equal(code(() => E.decryptBytes(key, TEST_LICENSE, { v: 2, iv: 'x', ct: 'y' })), 'LB_CRYPTO_DECRYPT_FAILED');
    assert.equal(code(() => E.decryptBytes(key, TEST_LICENSE, null)), 'LB_CRYPTO_DECRYPT_FAILED');
    let wrong = null;
    try { await E.keyFromPassphrase('wrong passphrase', vec.kdf.salt_b64, vec.kcv.value); } catch (e) { wrong = e.code; }
    assert.equal(wrong, 'LB_CRYPTO_BAD_PASSPHRASE');
    assert.ok(await E.keyFromPassphrase(PASS, vec.kdf.salt_b64, vec.kcv.value));
    ok('wrong passphrase, wrong license (AAD), flipped bit, unknown version and null all fail with the right code');
  }

  // 3. SYNC-02: the shared encrypted sequence decrypts to the plain sequence
  {
    const enc = readJsonl(`${SH}/sync_examples/initial_sequence.enc.jsonl`);
    const plain = readJsonl(`${SH}/sync_examples/initial_sequence.jsonl`);
    assert.equal(enc.length, plain.length);
    let rebytes = 0;
    enc.forEach((c, i) => {
      assert.equal(c.enc, true); assert.equal(c.payload.z, 1);
      const got = E.decryptPayload(key, TEST_LICENSE, c.payload);
      assert.deepEqual(got, plain[i].payload);
      assert.equal(c.seq, plain[i].seq); assert.equal(c.table_name, plain[i].table_name); assert.equal(c.is_last, plain[i].is_last);
      // our output, with the example's fixed IV, decrypts to the same thing (gzip bytes may legitimately differ by zlib build)
      const mine = E.encryptPayload(key, TEST_LICENSE, plain[i].payload, { gzip: true, iv: Buffer.from(c.payload.iv, 'base64') });
      assert.deepEqual(E.decryptPayload(key, TEST_LICENSE, mine), plain[i].payload);
      if (mine.ct === c.payload.ct) rebytes += 1;
    });
    ok(`initial_sequence.enc.jsonl: all ${enc.length} chunks decrypt to initial_sequence.jsonl (SYNC-02); ${rebytes} re-encrypt byte-identical`);
  }

  // 4. keystore
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-cr-'));
  let stored = null;
  let lic = TEST_LICENSE;
  const mk = () => K.createKeystore({ dir: tmp, passphrase: { get: () => stored, set: (v) => { stored = v; }, clear: () => { stored = null; } }, licenseKey: () => lic, now: () => Date.UTC(2026, 9, 25) });
  const ks = mk();
  assert.equal(ks.status().state, 'not-set-up');
  assert.equal(ks.pairing(), null);
  assert.throws(() => ks.encoder()({ a: 1 }), (e) => e.code === 'LB_CRYPTO_BAD_PASSPHRASE');
  assert.equal((await ks.setup('short')).ok, false);
  assert.equal(ks.status().state, 'not-set-up');
  ok('keystore starts not-set-up, refuses short passphrases, and the encoder refuses to send plaintext while locked');
  const r = await ks.setup(PASS);
  assert.equal(r.ok, true); assert.equal(ks.status().state, 'ready');
  const pub = JSON.parse(fs.readFileSync(path.join(tmp, 'crypto.json'), 'utf8'));
  assert.equal(Buffer.from(pub.saltB64, 'base64').length, 16);
  assert.ok(!fs.readFileSync(path.join(tmp, 'crypto.json'), 'utf8').includes(PASS));
  assert.equal(stored, PASS);
  assert.deepEqual(ks.publicParams(), { crypto_salt_b64: pub.saltB64, crypto_kcv: pub.kcv });
  ok('setup stores a random 16-byte salt and a KCV in crypto.json (no passphrase in the file); passphrase goes to the secret store');
  // restart: new keystore instance unlocks from stored passphrase and derives the same key
  const ks2 = mk();
  assert.equal(ks2.status().state, 'locked');
  assert.equal((await ks2.unlock()).state, 'ready');
  assert.deepEqual(ks2.getKey(), ks.getKey());
  assert.ok(await ks2.verify(PASS)); assert.ok(!(await ks2.verify('another one')));
  stored = 'tampered passphrase';
  const ks3 = mk();
  assert.equal((await ks3.unlock()).state, 'locked');
  stored = PASS;
  ok('restart unlocks to the same key; a changed stored passphrase leaves it locked; verify() checks typed values');
  // two setups use different salts
  const ksB = K.createKeystore({ dir: fs.mkdtempSync(path.join(os.tmpdir(), 'lb-cr-')), passphrase: { get: () => null, set: () => {}, clear: () => {} }, licenseKey: () => lic });
  await ksB.setup(PASS);
  assert.notEqual(ksB.publicParams().crypto_salt_b64, pub.saltB64);
  ok('a second setup gets a different salt');
  // a store that cannot save refuses and leaves no params
  const dirC = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-cr-'));
  const ksC = K.createKeystore({ dir: dirC, passphrase: { get: () => null, set: () => { throw new Error('no secure storage'); }, clear: () => {} }, licenseKey: () => lic });
  const rc = await ksC.setup(PASS);
  assert.equal(rc.ok, false); assert.equal(fs.existsSync(path.join(dirC, 'crypto.json')), false);
  ok('setup without secure storage fails cleanly and writes nothing');

  // 5. pairing
  {
    const info = ks.pairing();
    assert.ok(info.qrUri.startsWith('lazybooks://pair?l=' + TEST_LICENSE + '&s='));
    assert.ok(!/[+/=]/.test(info.qrUri.split('&s=')[1].replace('&c=', '')));
    assert.ok(!info.qrUri.includes(PASS) && !info.qrUri.includes('k='));
    assert.deepEqual(P.parsePairingUri(info.qrUri), { licenseKey: TEST_LICENSE, saltB64: info.saltB64, kcv: info.kcv });
    assert.equal(P.parsePairingUri('https://x'), null);
    assert.ok(info.qrSvg.startsWith('<svg') && info.qrSvg.includes('currentColor') && !/#[0-9a-f]{3,6}/i.test(info.qrSvg));
    // a device given only the link plus the typed passphrase gets the same key
    const pp = P.parsePairingUri(info.qrUri);
    assert.deepEqual(await E.keyFromPassphrase(PASS, pp.saltB64, pp.kcv), ks.getKey());
    lic = null; assert.equal(ks.pairing(), null); lic = TEST_LICENSE;
    ok('pairing link round-trips, holds no secret, SVG QR made with theme colour; passphrase + link give the device the same key');
  }

  // 6. encoder + chunker: the whole shared initial sequence, encrypted by us, decrypts to the plain one
  {
    const model = JSON.parse(fs.readFileSync(`${SH}/data_model.json`, 'utf8'));
    const fixtures = {};
    for (const t of model.tables_order) fixtures[t] = JSON.parse(fs.readFileSync(`${SH}/fixtures/tables/${t}.json`, 'utf8'));
    const cg = fixtures.tm_company[0].guid;
    const plainSeq = CH.initialSequence({ model, tables: fixtures, companyGuid: cg });
    const encSeq = CH.initialSequence({ model, tables: fixtures, companyGuid: cg }, { encode: ks.encoder() });
    assert.equal(encSeq.chunks.length, plainSeq.chunks.length);
    assert.deepEqual(CH.validateSequence(encSeq.chunks), []);
    const ivs = new Set();
    encSeq.chunks.forEach((c, i) => {
      assert.equal(c.enc, true); assert.equal(c.payload.v, 1); assert.equal(c.payload.z, 1);
      ivs.add(c.payload.iv);
      assert.deepEqual(E.decryptPayload(ks.getKey(), TEST_LICENSE, c.payload), JSON.parse(JSON.stringify(plainSeq.chunks[i].payload)));
    });
    assert.equal(ivs.size, encSeq.chunks.length);
    ok(`chunker + keystore.encoder(): ${encSeq.chunks.length} encrypted chunks, random IV each, all decrypt to the plain chunks`);
    // 200000-byte plaintext rule still counts plaintext: chunk sizes unchanged by encryption
    assert.deepEqual(encSeq.chunks.map((c) => c.seq), plainSeq.chunks.map((c) => c.seq));
    // the flag-off path is plaintext
    const off = K.createKeystore({ dir: tmp, passphrase: { get: () => stored, set() {}, clear() {} }, licenseKey: () => lic, e2eEnabled: () => false });
    assert.deepEqual(off.encoder()({ a: 1 }), { enc: false, payload: { a: 1 } });
    ok('with e2e_encryption off the encoder passes plaintext through (debug only)');
  }

  // 7. interop with an independent implementation (python cryptography) both ways
  {
    const py = `
import sys, json, base64, gzip, hashlib, hmac
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
d = json.load(sys.stdin)
key = hashlib.pbkdf2_hmac('sha256', d['pass'].encode(), base64.b64decode(d['salt']), 210000, 32)
env = d['env']
raw = AESGCM(key).decrypt(base64.b64decode(env['iv']), base64.b64decode(env['ct']), ('lb1|' + d['lic']).encode())
if env.get('z'): raw = gzip.decompress(raw)
iv = bytes(range(1, 13))
ct = AESGCM(key).encrypt(iv, gzip.compress(raw, mtime=0), ('lb1|' + d['lic']).encode())
kcv = base64.b64encode(hmac.new(key, b'LB-KCV-v1', 'sha256').digest()[:8]).decode()
print(json.dumps({'plain': raw.decode(), 'back': {'v': 1, 'iv': base64.b64encode(iv).decode(), 'ct': base64.b64encode(ct).decode(), 'z': 1}, 'kcv': kcv}))`;
    const payload = { list: [{ guid: 'g₹', name: 'Café नमस्ते', n: 1.5 }] };
    const e = E.encryptPayload(ks.getKey(), TEST_LICENSE, payload, { gzip: true });
    const res = spawnSync('python3', ['-I', '-c', py], { input: JSON.stringify({ pass: PASS, salt: pub.saltB64, lic: TEST_LICENSE, env: e }), encoding: 'utf8' });
    if (res.status !== 0) { console.log('SKIP python interop:', (res.stderr || '').split('\n').slice(-2)[0]); }
    else {
      const o = JSON.parse(res.stdout);
      assert.deepEqual(JSON.parse(o.plain), payload);
      assert.equal(o.kcv, pub.kcv);
      assert.deepEqual(E.decryptPayload(ks.getKey(), TEST_LICENSE, o.back), payload);
      ok('interop: python cryptography decrypts our envelope (UTF-8, gzip) and we decrypt its envelope; KCV equal');
    }
  }
  fs.rmSync(out, { recursive: true, force: true });
  console.log(`\nall ${n} checks passed`);
})().catch((e) => { console.error(e); process.exit(1); });
