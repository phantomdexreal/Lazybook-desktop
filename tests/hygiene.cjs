// Node-level check for Phase 23: backpressure window, retry/backoff, rate budget, cleanup, offline outbox, serve integration.
// Run: NODE_PATH=<dir with typescript, zod, qrcode-generator, better-sqlite3> node tests/hygiene.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-hy');
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
const { LbError } = R('src/main/errors.js');
const V = R('src/main/db/index.js');
const K = R('src/main/crypto/keystore.js');
const E = R('src/main/crypto/envelope.js');
const H = R('src/main/postbox/hygiene.js');
const SV = R('src/main/postbox/serve.js');

const SH = 'docs/shared';
const model = JSON.parse(fs.readFileSync(`${SH}/data_model.json`, 'utf8'));
const consts = JSON.parse(fs.readFileSync(`${SH}/constants.json`, 'utf8'));
const jsonl = (f) => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const LIC = consts.demo.license_key;
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);

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
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-hy-'));
  initLogger({ dir: path.join(tmp, 'logs'), maxBytes: 1e6, keepFiles: 2 });

  // offline switch + call counter on the real HTTP client
  let offline = 0; // number of upcoming calls to fail; Infinity = offline
  let calls = 0;
  const fetchFn = async (...a) => {
    calls += 1;
    if (offline > 0) { offline -= 1; throw new TypeError('fetch failed'); }
    return fetch(...a);
  };
  const client = new TargetClient({ url: reg.base, anonKey: mock.MOCK_ANON_KEY, fetchFn });
  const act = { getAccessToken: async () => 'mock-access-test', targetClient: () => client };
  let clock = Date.parse('2026-10-25T10:00:00Z');
  const sleeps = [];
  let onSleep = async () => {};
  const sleep = async (ms) => { sleeps.push(ms); clock += ms; await onSleep(ms); };
  const mkH = (over = {}) => H.createHygiene({ activation: act, licenseKey: () => LIC, now: () => clock, sleep, retry: { baseMs: 10, maxMs: 40, rnd: () => 0.5 }, ...over });

  // 1. backoff + retry classification
  {
    assert.equal(H.backoffDelay(1, 1000, 30000, () => 0.5), 1000);
    assert.equal(H.backoffDelay(2, 1000, 30000, () => 0.5), 2000);
    assert.equal(H.backoffDelay(9, 1000, 30000, () => 0.5), 30000);
    assert.ok(H.backoffDelay(1, 1000, 30000, () => 0) === 800 && H.backoffDelay(1, 1000, 30000, () => 0.999) <= 1200);
    assert.ok(H.isRetryable(new LbError('NETWORK', 'x')));
    assert.ok(H.isRetryable(new LbError('BAD_RESPONSE', 'The data project answered with status 503.')));
    assert.ok(H.isRetryable(new LbError('BAD_RESPONSE', 'The data project answered with status 429.')));
    assert.ok(!H.isRetryable(new LbError('BAD_RESPONSE', 'The data project answered with status 400.')));
    assert.ok(!H.isRetryable(new LbError('LB_AUTH_FAILED', 'x')));
    assert.ok(!H.isRetryable(new Error('boom')));
    let tries = 0; const waits = [];
    const v = await H.withRetry(async () => { if (++tries < 3) throw new LbError('NETWORK', 'off'); return 'fine'; }, { sleep: async (m) => { waits.push(m); }, rnd: () => 0.5 });
    assert.deepEqual([v, tries, waits], ['fine', 3, [1000, 2000]]);
    tries = 0;
    await assert.rejects(H.withRetry(async () => { tries++; throw new LbError('BAD_RESPONSE', 'status 400'); }, { sleep: async () => {} }), /400/);
    assert.equal(tries, 1);
    tries = 0;
    await assert.rejects(H.withRetry(async () => { tries++; throw new LbError('NETWORK', 'off'); }, { attempts: 3, sleep: async () => {} }), /off/);
    assert.equal(tries, 3);
    ok('backoff doubles to a cap with jitter; only network and 408/429/5xx are retried, attempts are bounded');
  }

  // 2. rate budget
  {
    let t = 0; const slept = [];
    const b = H.createRateBudget({ max: 3, windowMs: 1000, now: () => t, sleep: async (ms) => { slept.push(ms); t += ms; } });
    await b.take(); await b.take(); await b.take();
    assert.equal(b.used(), 3);
    await b.take(); // must wait until the first stamp leaves the window
    assert.ok(slept.length >= 1 && t >= 1000);
    assert.equal(b.used(), 1);
    ok('request budget: the 4th call in a 3-per-window budget waits for the window to move');
  }

  // 3. windowed send: never more than 40 unacked, ordered, no duplicates, device acks as it goes
  const mkRows = (count, rid, dev) => Array.from({ length: count }, (_, i) => ({ license_key: LIC, device_id: dev, request_id: rid, seq: i + 1, table_name: 't', op: 'upsert', payload: { i }, enc: false, is_last: i === count - 1, created_at: '', expires_at: new Date(clock + 86400000).toISOString() }));
  const post = async (slice) => { const r = await client.rest({ accessToken: 'mock-access-x' }, 'POST', 'sync_chunks', slice, { prefer: 'return=minimal' }); return r; };
  {
    const h = mkH();
    const got = []; let peak = 0;
    onSleep = async () => { // the device applies and deletes 7 chunks, oldest first, each time it is polled
      peak = Math.max(peak, st.syncChunks.length);
      const take = st.syncChunks.filter((c) => c.device_id === 'dev-w').sort((a, b) => a.seq - b.seq).slice(0, 7);
      got.push(...take.map((c) => c.seq));
      const gone = new Set(take.map((c) => c.id));
      st.syncChunks = st.syncChunks.filter((c) => !gone.has(c.id));
    };
    const rows = mkRows(130, 'rq-w', 'dev-w');
    const res = await h.sendWindowed('dev-w', 'rq-w', rows, post);
    peak = Math.max(peak, st.syncChunks.length);
    got.push(...st.syncChunks.map((c) => c.seq).sort((a, b) => a - b));
    assert.ok(peak <= 40, `peak ${peak}`);
    assert.ok(res.waits > 0 && res.windows > 3);
    assert.deepEqual(got, rows.map((r) => r.seq)); // every seq reached the device exactly once, in order
    assert.ok(sleeps.some((m) => m === 2000) && Math.max(...sleeps) <= 10000);
    st.syncChunks = []; onSleep = async () => {};
    ok(`130 chunks sent in windows: peak ${peak} unacked (limit 40), each seq exactly once and in order, waits poll 2 s up to 10 s`);
  }

  // 4. stalled device: gives up, removes what it sent, tells the caller
  {
    const h = mkH({ stallMs: 60_000 });
    await assert.rejects(h.sendWindowed('dev-s', 'rq-s', mkRows(100, 'rq-s', 'dev-s'), post), /did not receive/);
    assert.equal(st.syncChunks.filter((c) => c.request_id === 'rq-s').length, 0);
    ok('a device that never acks: the send stops after the stall time and its partial chunks are removed');
  }

  // 5. a window that slows but progresses does not trip the stall timer
  {
    const h = mkH({ stallMs: 30_000 });
    let tick = 0;
    onSleep = async () => { if (++tick % 3 === 0) { const c = st.syncChunks.find((x) => x.device_id === 'dev-p'); if (c) st.syncChunks = st.syncChunks.filter((x) => x !== c); clock += 0; } };
    await h.sendWindowed('dev-p', 'rq-p', mkRows(45, 'rq-p', 'dev-p'), post);
    assert.equal(st.syncChunks.filter((c) => c.request_id === 'rq-p').length >= 40, true);
    st.syncChunks = []; onSleep = async () => {};
    ok('slow but steady acks keep the send alive');
  }

  // 6. offline: retried with backoff and recovers without duplicates
  {
    const h = mkH();
    st.syncChunks = [];
    offline = 2; // first two calls of the send fail
    const before = calls;
    await h.sendWindowed('dev-o', 'rq-o', mkRows(10, 'rq-o', 'dev-o'), post);
    assert.ok(calls - before >= 4);
    assert.equal(st.syncChunks.filter((c) => c.request_id === 'rq-o').length, 10);
    assert.equal(new Set(st.syncChunks.map((c) => c.seq)).size, 10);
    ok('two dropped calls are retried with backoff and the send completes with no duplicate chunks');

    // fully offline mid-send: error out, cleanup deferred, later sweep removes the leftovers
    st.syncChunks = [];
    const h2 = mkH({ retry: { attempts: 2, baseMs: 1, maxMs: 2, rnd: () => 0.5 } });
    let first = true;
    const flaky = async (slice) => { await post(slice); if (first) { first = false; offline = Infinity; } };
    await assert.rejects(h2.sendWindowed('dev-o2', 'rq-o2', mkRows(60, 'rq-o2', 'dev-o2'), flaky), (e) => e instanceof LbError && e.code === 'NETWORK');
    assert.equal(h2.pendingAbandon(), 1);
    assert.ok(st.syncChunks.filter((c) => c.request_id === 'rq-o2').length > 0); // still there: could not delete offline
    offline = 0;
    const r = await h2.sweep();
    assert.equal(r.abandoned, 1);
    assert.equal(h2.pendingAbandon(), 0);
    assert.equal(st.syncChunks.filter((c) => c.request_id === 'rq-o2').length, 0);
    ok('fully offline mid-send: the leftovers are queued for removal and the next sweep deletes them once the network is back');
  }

  // 7. sweep removes only expired chunks
  {
    const h = mkH();
    st.syncChunks = [
      { id: 1, license_key: LIC, device_id: 'd', request_id: 'old', seq: 1, expires_at: new Date(clock - 1000).toISOString() },
      { id: 2, license_key: LIC, device_id: 'd', request_id: 'new', seq: 1, expires_at: new Date(clock + 1000).toISOString() },
    ];
    const r = await h.sweep();
    assert.equal(r.expired, true);
    assert.deepEqual(st.syncChunks.map((c) => c.request_id), ['new']);
    st.syncChunks = [];
    // hourly timer
    const timers = [];
    const h3 = mkH({ setTimer: (fn, ms) => { const t = { fn, ms }; timers.push(t); return t; }, clearTimer: () => {} });
    h3.start();
    assert.equal(timers.length, 1); assert.equal(timers[0].ms, 3600_000);
    h3.stop();
    ok('sweep deletes expired chunks only; the hourly timer is armed on start');
  }

  // 8. outbox: offline queueing of results, persisted, replayed in order, same key replaces
  {
    const file = path.join(tmp, 'outbox.json');
    const sent = []; let net = false;
    const mk = () => H.createOutbox({ file, now: () => clock, deliver: async (k, v) => { if (!net) throw new LbError('NETWORK', 'off'); sent.push([k, v]); } });
    let ob = mk();
    ob.enqueue('a', { status: 'done' }); ob.enqueue('b', { status: 'failed' }); ob.enqueue('a', { status: 'failed' });
    assert.equal(ob.size(), 2);
    assert.deepEqual(await ob.flush(), { sent: 0, left: 2 });
    ob = mk(); // restart: queue came back from disk
    assert.equal(ob.size(), 2);
    net = true;
    assert.deepEqual(await ob.flush(), { sent: 2, left: 0 });
    assert.deepEqual(sent, [['a', { status: 'failed' }], ['b', { status: 'failed' }]]);
    assert.equal(JSON.parse(fs.readFileSync(file, 'utf8')).length, 0);
    // a bad entry never blocks the rest; old entries expire
    const ob2 = H.createOutbox({ now: () => clock, maxAgeMs: 1000, deliver: async (k) => { if (k === 'bad') throw new LbError('BAD_RESPONSE', 'status 400'); sent.push([k]); } });
    ob2.enqueue('bad', 1); ob2.enqueue('good', 2);
    assert.deepEqual(await ob2.flush(), { sent: 1, left: 0 });
    ob2.enqueue('stale', 3); clock += 5000;
    assert.deepEqual(await ob2.flush(), { sent: 0, left: 0 });
    ok('outbox: queued while offline, survives a restart, replays in order, same key replaces, a bad row never blocks, old rows expire');
  }

  // 9. integration: serve with hygiene on a real vault; small window; device acks while the sequence goes out
  {
    const vault = V.openVault({ dir: path.join(tmp, 'vault') });
    vault.applyOps(jsonl(`${SH}/sync_examples/initial_sequence.jsonl`).map((c) => ({ table_name: c.table_name, op: c.op, payload: c.payload })));
    let stored = null;
    const ks = K.createKeystore({ dir: tmp, passphrase: { get: () => stored, set: (v) => { stored = v; }, clear: () => { stored = null; } }, licenseKey: () => LIC });
    assert.equal((await ks.setup(consts.demo.passphrase)).ok, true);
    st.syncChunks = []; sleeps.length = 0;
    const h = mkH({ maxInflight: 5 });
    const serve = SV.createServe({ getVault: () => vault, model, licenseKey: () => LIC, activation: act, encoder: () => ks.encoder(), now: () => clock, setTimer: () => ({}), clearTimer: () => {}, hygiene: h });
    const seen = []; let peak = 0;
    onSleep = async () => {
      peak = Math.max(peak, st.syncChunks.length);
      const take = st.syncChunks.sort((a, b) => a.seq - b.seq).slice(0, 3);
      seen.push(...take.map((c) => c.seq));
      const gone = new Set(take.map((c) => c.id));
      st.syncChunks = st.syncChunks.filter((c) => !gone.has(c.id));
    };
    const req = { id: '33333333-3333-4333-8333-000000000001', license_key: LIC, device_id: 'dev-i', kind: 'initial', company_guid: null, from_date: '2026-04-01', to_date: '2026-09-30', last_sync_at: null, lookback_days: null, status: 'processing', error: null, created_at: '', updated_at: '' };
    const res = await serve.serve(req, 'initial');
    peak = Math.max(peak, st.syncChunks.length);
    seen.push(...st.syncChunks.map((c) => c.seq).sort((a, b) => a - b));
    assert.ok(res.chunks > 10, 'fixture sequence is long enough to need windows');
    assert.ok(peak <= 5, `peak ${peak}`);
    assert.deepEqual(seen, Array.from({ length: res.chunks }, (_, i) => i + 1));
    // resend of the same request while some chunks still wait: replaced, not doubled
    st.syncChunks = []; onSleep = async () => {};
    const small = mkH({ maxInflight: 1000 });
    const serve2 = SV.createServe({ getVault: () => vault, model, licenseKey: () => LIC, activation: act, encoder: () => ks.encoder(), now: () => clock, setTimer: () => ({}), clearTimer: () => {}, hygiene: small });
    await serve2.serve(req, 'initial');
    const c1 = st.syncChunks.length;
    offline = 3; // a flaky link during the retry of the same request
    await serve2.serve(req, 'initial');
    assert.equal(st.syncChunks.length, c1);
    serve.stop(); serve2.stop(); vault.close();
    ok(`serve + hygiene on a real vault: ${res.chunks} chunks with a 5-chunk window, nothing lost or doubled, a flaky resend leaves exactly one copy`);
  }

  // 10. logs carry no secrets
  {
    const log = fs.readFileSync(logFilePath(0), 'utf8');
    assert.ok(log.includes('data project call failed, retrying'));
    assert.ok(!log.includes('mock-access') && !log.includes(consts.demo.passphrase));
    ok('structured log shows retries and holds no tokens or passphrase');
  }

  reg.server.close();
  fs.rmSync(out, { recursive: true, force: true });
  console.log(`\nall ${n} checks passed`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
