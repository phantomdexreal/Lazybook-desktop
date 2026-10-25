// Node-level check for Phase 22: serve initial + delta from a real SQLite vault to the mock license project (real HTTP), encrypted.
// Run: NODE_PATH=<dir with typescript, zod, qrcode-generator and better-sqlite3> node tests/serve.cjs   (python3 + cryptography for the reference applier)
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const out = path.join(__dirname, '.tmp-sv');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/db', 'src/main/crypto', 'src/main/postbox', 'src/shared']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
fs.mkdirSync(path.join(out, 'docs/shared'), { recursive: true });
fs.copyFileSync('docs/shared/data_model.json', path.join(out, 'docs/shared/data_model.json'));
const R = (p) => require(path.join(out, p));
const { initLogger, logFilePath } = R('src/main/logger.js');
const { TargetClient } = R('src/main/supabase.js');
const V = R('src/main/db/index.js');
const E = R('src/main/crypto/envelope.js');
const K = R('src/main/crypto/keystore.js');
const CH = R('src/main/postbox/chunker.js');
const SV = R('src/main/postbox/serve.js');
const { createRequestListener } = R('src/main/postbox/listener.js');

const SH = 'docs/shared';
const SE = `${SH}/sync_examples`;
const model = JSON.parse(fs.readFileSync(`${SH}/data_model.json`, 'utf8'));
const consts = JSON.parse(fs.readFileSync(`${SH}/constants.json`, 'utf8'));
const jsonl = (f) => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const LIC = consts.demo.license_key;
const PASS = consts.demo.passphrase;
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const asOps = (seq) => seq.map((c) => ({ table_name: c.table_name, op: c.op, payload: c.payload }));
const WIN = { from: '2026-04-01', to: '2026-09-30' };

(async () => {
  const mock = await import('../tools/mock-registry/server.mjs');
  const probe = mock.startMockRegistry(0);
  await new Promise((r) => probe.server.once('listening', r));
  const port = probe.server.address().port;
  probe.server.close();
  await new Promise((r) => setTimeout(r, 50));
  const reg = mock.startMockRegistry(port);
  await new Promise((r) => reg.server.once('listening', r));
  const st = reg.state;

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-sv-'));
  initLogger({ dir: path.join(tmp, 'logs'), maxBytes: 1e6, keepFiles: 2 });
  const client = new TargetClient({ url: reg.base, anonKey: mock.MOCK_ANON_KEY });
  const act = { getAccessToken: async () => 'mock-access-test', targetClient: () => client };

  // vault with the fixture company (the shared initial sequence applied the way the scheduler would have)
  const vault = V.openVault({ dir: path.join(tmp, 'vault') });
  const initSeq = jsonl(`${SE}/initial_sequence.jsonl`);
  vault.applyOps(asOps(initSeq));
  const company = vault.readTable('tm_company')[0];
  assert.equal(vault.headSeq(), 1);

  // keystore with the demo passphrase
  let stored = null;
  const ks = K.createKeystore({ dir: tmp, passphrase: { get: () => stored, set: (v) => { stored = v; }, clear: () => { stored = null; } }, licenseKey: () => LIC });
  assert.equal((await ks.setup(PASS)).ok, true);

  // fake clock and timers
  let clock = Date.parse('2026-10-25T10:00:00Z');
  const timers = [];
  const setTimer = (fn, ms) => { const t = { fn, ms, cleared: false }; timers.push(t); return t; };
  const clearTimer = (t) => { t.cleared = true; };
  let refreshes = 0;
  let refreshFail = false;
  let theVault = vault;
  const mk = (over = {}) => SV.createServe({
    getVault: () => theVault,
    model,
    licenseKey: () => LIC,
    activation: act,
    encoder: () => ks.encoder(),
    refresh: async () => { refreshes += 1; if (refreshFail) throw new Error('tally down'); },
    now: () => clock,
    setTimer,
    clearTimer,
    ...over,
  });
  let serve = mk();
  let reqN = 0;
  const request = (kind, device, extra = {}) => ({ id: `11111111-1111-4111-8111-${String(++reqN).padStart(12, '0')}`, license_key: LIC, device_id: device, kind, company_guid: null, from_date: null, to_date: null, last_sync_at: null, lookback_days: null, status: 'processing', error: null, created_at: '', updated_at: '', ...extra });
  const rowsOf = (req) => st.syncChunks.filter((c) => c.request_id === req.id).sort((a, b) => a.seq - b.seq);
  const decode = (rows) => rows.map((c) => ({ seq: c.seq, table_name: c.table_name, op: c.op, enc: false, is_last: c.is_last, payload: E.decryptPayload(ks.getKey(), LIC, c.payload) }));
  const ackAll = (req) => { st.syncChunks = st.syncChunks.filter((c) => c.request_id !== req.id); };
  const norm = (v) => JSON.parse(JSON.stringify(v));

  // 1. window rules
  {
    const w = (r, c) => SV.resolveWindow(r, c, Date.parse('2026-10-25T10:00:00'));
    assert.deepEqual(w({ from_date: null, to_date: null }, undefined), { from: '2025-10-25', to: '2026-10-25' });
    assert.deepEqual(w({ from_date: '2020-01-01', to_date: null }, undefined), { from: '2023-10-26', to: '2026-10-25' });
    assert.deepEqual(w({ from_date: null, to_date: null }, { starting_from: '2026-04-01', ending_at: '2027-03-31' }), { from: '2026-04-01', to: '2026-10-25' });
    assert.deepEqual(w({ from_date: null, to_date: '2030-01-01' }, { starting_from: '2026-04-01', ending_at: '2027-03-31' }), { from: '2026-04-01', to: '2027-03-31' });
    assert.deepEqual(w({ from_date: 'junk', to_date: '2026-06-30' }, undefined), { from: '2025-06-30', to: '2026-06-30' });
    ok('initial window: default 365 days, max 1095, clipped to the books, junk dates ignored');
  }

  // 2. initial: encrypted chunks equal the chunker's plain sequence; the reference applier rebuilds the fixtures (SYNC-01)
  const devA = 'dev-a';
  const r1 = request('initial', devA, { from_date: WIN.from, to_date: WIN.to });
  await serve.handlers.initial(r1);
  assert.equal(refreshes, 1);
  const rows1 = rowsOf(r1);
  const plain = CH.initialSequence({ model, tables: Object.fromEntries(model.tables_order.map((t) => [t, vault.readTable(t)])), companyGuid: company.guid, ...WIN }).chunks;
  assert.equal(rows1.length, plain.length);
  assert.deepEqual(rows1.map((c) => c.seq), plain.map((c) => c.seq));
  rows1.forEach((c) => {
    assert.equal(c.enc, true); assert.equal(c.payload.v, 1); assert.equal(c.payload.z, 1);
    assert.equal(c.device_id, devA); assert.equal(c.license_key, LIC); assert.equal(c.request_id, r1.id);
    assert.equal(c.expires_at, new Date(clock + 24 * 3600_000).toISOString());
  });
  assert.equal(rows1.at(-1).is_last, true);
  assert.equal(rows1.filter((c) => c.is_last).length, 1);
  assert.deepEqual(rows1.map((c) => c.id), [...rows1.map((c) => c.id)].sort((a, b) => a - b));
  assert.deepEqual(norm(decode(rows1)), norm(plain.map((c) => ({ ...c, enc: false }))));
  assert.equal(new Set(rows1.map((c) => c.payload.iv)).size, rows1.length);
  const initFile = path.join(tmp, 'init.jsonl');
  fs.writeFileSync(initFile, decode(rows1).map((c) => JSON.stringify(c)).join('\n') + '\n');
  const py = spawnSync('python3', ['-I', 'tests/chunker-apply.py', initFile], { encoding: 'utf8' });
  assert.equal(py.status, 0, py.stdout + py.stderr);
  ok(`initial: ${rows1.length} encrypted chunks for the device equal the chunker output; reference applier rebuilds fixtures/tables (SYNC-01, SYNC-02)`);
  // same as the shared example too, up to row order inside a chunk: the vault reads rows in primary-key order while the shared
  // fixtures list some tables in source order (equal state either way; every fixture table fits one chunk)
  {
    const canon = (cs) => cs.map((c) => ({ seq: c.seq, table_name: c.table_name, op: c.op, is_last: c.is_last, payload: Array.isArray(c.payload) ? c.payload.map((r) => JSON.stringify(r)).sort() : c.payload }));
    assert.deepEqual(canon(norm(decode(rows1))), canon(norm(jsonl(`${SE}/initial_sequence.jsonl`))));
    ok('initial: decrypted stream equals sync_examples/initial_sequence.jsonl (same chunks, same rows; row order within a chunk may differ)');
  }

  // 3. cursor only after the ack
  assert.equal(vault.cursor(devA), 0);
  assert.equal(serve.pendingAcks(), 1);
  assert.equal(timers.filter((t) => !t.cleared).length >= 1, true);
  await serve.pollAcks();
  assert.equal(vault.cursor(devA), 0);
  st.syncChunks = st.syncChunks.filter((c) => !(c.request_id === r1.id && c.seq < rows1.length)); // all but the last applied
  await serve.pollAcks();
  assert.equal(vault.cursor(devA), 0);
  assert.equal(serve.pendingAcks(), 1);
  ackAll(r1);
  await serve.pollAcks();
  assert.equal(vault.cursor(devA), 1);
  assert.equal(serve.pendingAcks(), 0);
  ok('cursor stays put while the last chunk is still there (also with earlier ones acked) and moves to the head seq once it is gone');

  // 4. delta: shared delta ops go into the vault (seq 2); device A gets only what changed since its cursor (SYNC-03)
  const deltaSeq = jsonl(`${SE}/delta_sequence.jsonl`);
  const ar = vault.applyOps(asOps(deltaSeq));
  assert.equal(ar.seq, 2);
  const r2 = request('delta', devA);
  await serve.handlers.delta(r2);
  const rows2 = rowsOf(r2);
  const d2 = decode(rows2);
  assert.equal(d2[0].table_name, 'tm_company'); assert.equal(d2[0].op, 'upsert');
  assert.equal(d2.at(-1).is_last, true);
  assert.deepEqual(CH.validateSequence(d2), []);
  const deltaFile = path.join(tmp, 'delta.jsonl');
  fs.writeFileSync(deltaFile, d2.map((c) => JSON.stringify(c)).join('\n') + '\n');
  const py2 = spawnSync('python3', ['-I', 'tests/chunker-apply.py', initFile, deltaFile], { encoding: 'utf8' });
  assert.equal(py2.status, 0, py2.stdout + py2.stderr);
  const exp = JSON.parse(fs.readFileSync(`${SE}/delta_expected.json`, 'utf8'));
  for (const [t, c] of Object.entries(exp.row_counts)) assert.equal(vault.count(t), c, t);
  assert.ok(d2.length < rows1.length / 2);
  ok(`delta: ${d2.length} chunks (vs ${rows1.length} initial) applied on the initial state equal the shared delta result; vault counts equal delta_expected.json (SYNC-03)`);
  ackAll(r2);
  await serve.pollAcks();
  assert.equal(vault.cursor(devA), 2);
  ok('delta ack moves the cursor to seq 2');

  // 5. nothing changed: just the company row, last
  const r3 = request('delta', devA);
  await serve.handlers.delta(r3);
  const d3 = decode(rowsOf(r3));
  assert.equal(d3.length, 1); assert.equal(d3[0].table_name, 'tm_company'); assert.equal(d3[0].is_last, true);
  ackAll(r3); await serve.pollAcks();
  assert.equal(vault.cursor(devA), 2);
  ok('quiet delta is one tm_company chunk marked last; cursor unchanged at the head');

  // 6. a device without a cursor asking for a delta gets the full sequence
  const r4 = request('delta', 'dev-new', { from_date: WIN.from, to_date: WIN.to });
  const res4 = await serve.serve(r4, 'delta');
  assert.equal(res4.upgraded, true); assert.equal(res4.mode, 'initial');
  const d4 = decode(rowsOf(r4));
  assert.ok(d4.some((c) => c.op === 'replace_scope') && d4.some((c) => c.op === 'clear'));
  ackAll(r4); await serve.pollAcks();
  assert.equal(vault.cursor('dev-new'), 2);
  ok('delta from a device with no cursor is answered with an initial sequence and then moves its cursor to the head');

  // 7. idempotent resend of the same request id
  const r5 = request('initial', 'dev-b', { from_date: WIN.from, to_date: WIN.to });
  await serve.handlers.initial(r5);
  const first = rowsOf(r5).length;
  await serve.handlers.initial(r5);
  const second = rowsOf(r5);
  assert.equal(second.length, first);
  assert.deepEqual(second.map((c) => c.seq), Array.from({ length: first }, (_, i) => i + 1));
  ackAll(r5);
  await serve.pollAcks();
  ok('serving the same request twice leaves exactly one sequence (old rows removed first)');

  // 8. an unfinished earlier sequence cannot move the cursor after the device asked again
  const r6 = request('initial', 'dev-c', { from_date: WIN.from, to_date: WIN.to });
  await serve.handlers.initial(r6);
  const r7 = request('initial', 'dev-c', { from_date: WIN.from, to_date: WIN.to });
  await serve.handlers.initial(r7);
  assert.equal(serve.pendingAcks(), 1);
  ackAll(r6);
  await serve.pollAcks();
  assert.equal(vault.cursor('dev-c'), 0);
  ackAll(r7);
  await serve.pollAcks();
  assert.equal(vault.cursor('dev-c'), 2);
  ok('a superseded request never moves the cursor; the newest one does');

  // 9. chunks that vanish by expiry do not count as an ack
  const r8 = request('initial', 'dev-d', { from_date: WIN.from, to_date: WIN.to });
  await serve.handlers.initial(r8);
  clock += 25 * 3600_000;
  ackAll(r8);
  await serve.pollAcks();
  assert.equal(vault.cursor('dev-d'), 0);
  assert.equal(serve.pendingAcks(), 0);
  ok('past expires_at the wait ends without moving the cursor');

  // 10. failures leave nothing behind and carry plain texts
  {
    const code = async (fn) => { try { await fn(); } catch (e) { return e; } return null; };
    const before = st.syncChunks.length;
    ks.reset(); // locked / not set up
    let e = await code(() => serve.handlers.initial(request('initial', 'dev-e')));
    assert.equal(e.code, 'LB_CRYPTO_BAD_PASSPHRASE');
    await ks.setup(PASS);
    theVault = null;
    e = await code(() => serve.handlers.initial(request('initial', 'dev-e')));
    assert.equal(e.code, 'NOT_CONFIGURED');
    theVault = vault;
    e = await code(() => serve.handlers.initial(request('initial', 'dev-e', { company_guid: 'nope' })));
    assert.equal(e.code, 'NOT_CONFIGURED'); assert.match(e.message, /not the one/);
    st.chunkInsertFail = true;
    e = await code(() => serve.handlers.initial(request('initial', 'dev-e', { from_date: WIN.from, to_date: WIN.to })));
    st.chunkInsertFail = false;
    assert.equal(e.code, 'BAD_RESPONSE');
    assert.equal(serve.pendingAcks(), 0);
    assert.equal(vault.cursor('dev-e'), 0);
    assert.equal(st.syncChunks.length, before);
    const empty = V.openVault({ dir: path.join(tmp, 'empty') });
    theVault = empty;
    e = await code(() => serve.handlers.initial(request('initial', 'dev-e')));
    assert.match(e.message, /not read the company/);
    theVault = vault;
    ok('locked key, no vault, unknown company, failed insert and an empty vault each fail with a plain text, no ack pending, cursor and chunk table untouched');
  }

  // 11. refresh failure is not fatal
  {
    refreshFail = true;
    const r = request('initial', 'dev-f', { from_date: WIN.from, to_date: WIN.to });
    await serve.handlers.initial(r);
    refreshFail = false;
    assert.ok(rowsOf(r).length > 0);
    ackAll(r); await serve.pollAcks();
    ok('a failing refresh (Tally closed) still serves the vault as it is');
  }

  // 12. delta window filter: out-of-window voucher upserts and their children are dropped
  {
    const v2 = V.openVault({ dir: path.join(tmp, 'v2') });
    v2.applyOps(asOps(initSeq));
    v2.setCursor('dev-w', 1);
    const vs = v2.readTable('tx_voucher').sort((a, b) => (a.date < b.date ? -1 : 1));
    const early = vs[0]; const late = vs.at(-1);
    assert.notEqual(early.date, late.date);
    v2.upsert('tx_voucher', [{ ...early, narration: 'edited early' }, { ...late, narration: 'edited late' }]);
    theVault = v2;
    const r = request('delta', 'dev-w', { from_date: late.date, to_date: late.date });
    await serve.handlers.delta(r);
    const dv = decode(rowsOf(r)).filter((c) => c.table_name === 'tx_voucher');
    const guids = dv.flatMap((c) => c.payload.map((x) => x.guid));
    assert.deepEqual(guids, [late.guid]);
    const r9 = request('delta', 'dev-w');
    await serve.handlers.delta(r9);
    const all = decode(rowsOf(r9)).filter((c) => c.table_name === 'tx_voucher').flatMap((c) => c.payload.map((x) => x.guid));
    assert.deepEqual(all.sort(), [early.guid, late.guid].sort());
    theVault = vault;
    ok('delta with a date window sends only vouchers inside it; without a window sends all changed ones');
  }

  // 13. through the real listener: request row in, chunks out, status done
  {
    const fixed = Date.now();
    const lt = [];
    const listener = createRequestListener({
      activation: { state: () => ({ stage: 'active' }), getAccessToken: act.getAccessToken, targetClient: act.targetClient },
      licenseKey: () => LIC,
      blocked: () => null,
      handlers: serve.handlers,
      now: () => fixed,
      setTimer: (fn, ms) => { const t = { fn, ms }; lt.push(t); return t; },
      clearTimer: () => {},
    });
    const id = '22222222-2222-4222-8222-000000000001';
    st.syncRequests.set(id, { id, license_key: LIC, device_id: 'dev-l', kind: 'initial', status: 'pending', error: null, company_guid: null, from_date: WIN.from, to_date: WIN.to, last_sync_at: null, lookback_days: null, created_at: new Date(fixed).toISOString(), updated_at: new Date(fixed).toISOString() });
    await listener.pollNow();
    assert.equal(st.syncRequests.get(id).status, 'done');
    assert.ok(st.syncChunks.filter((c) => c.request_id === id).length > 0);
    ackAll({ id });
    await serve.pollAcks();
    assert.equal(vault.cursor('dev-l'), 2);
    ok('request listener + serve: a pending initial request ends done with its chunks inserted, then the ack moves the cursor');
    // a failing serve (locked key) is reported to the device as failed with the plain text
    ks.reset();
    const id2 = '22222222-2222-4222-8222-000000000002';
    st.syncRequests.set(id2, { ...st.syncRequests.get(id), id: id2, device_id: 'dev-m', status: 'pending' });
    await listener.pollNow();
    assert.equal(st.syncRequests.get(id2).status, 'failed');
    assert.match(st.syncRequests.get(id2).error, /passphrase/);
    await ks.setup(PASS);
    ok('a locked key fails the request with a plain-language text for the device');
  }

  // 14. logs carry no names, guids or row data
  {
    const log = fs.readFileSync(logFilePath(0), 'utf8');
    assert.ok(log.includes('sequence sent'));
    assert.ok(!log.includes(company.name) && !log.includes(company.guid) && !log.includes(PASS));
    ok('structured log has "sequence sent" lines and no company name, guid or passphrase');
  }

  serve.stop();
  vault.close();
  reg.server.close();
  fs.rmSync(out, { recursive: true, force: true });
  console.log(`\nall ${n} checks passed`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
