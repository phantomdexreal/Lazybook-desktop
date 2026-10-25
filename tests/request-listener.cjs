// Node-level check for Phase 19: request listener against the mock license project (real HTTP), fake clock and timers.
// Run: NODE_PATH=<dir containing typescript> node tests/request-listener.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-rl');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/postbox', 'src/shared']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
const { initLogger, logFilePath } = require(path.join(out, 'src/main/logger.js'));
const { TargetClient } = require(path.join(out, 'src/main/supabase.js'));
const { LbError } = require(path.join(out, 'src/main/errors.js'));
const { createRequestListener } = require(path.join(out, 'src/main/postbox/listener.js'));

let passed = 0;
const ok = (name) => { passed += 1; console.log('ok', passed, name); };

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
  const demo = JSON.parse(fs.readFileSync('docs/shared/constants.json', 'utf8')).demo;
  const LIC = demo.license_key;

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-rl-'));
  initLogger({ dir: path.join(tmp, 'logs') });

  // --- harness -------------------------------------------------------------------------------------------------------
  let clock = Date.now();
  let offline = false;
  let hook = null; // (url, init) => void, runs before a request goes out
  const fetchFn = async (url, init) => {
    if (offline) throw new TypeError('fetch failed');
    if (hook) hook(String(url), init);
    return fetch(url, init);
  };
  const client = new TargetClient({ url: reg.base, anonKey: mock.MOCK_ANON_KEY, fetchFn });
  let stage = 'active';
  let blockedText = null;
  let lic = LIC;
  const act = { state: () => ({ stage }), getAccessToken: async () => 'mock-access-test', targetClient: () => (stage === 'active' ? client : null) };

  let timers = [];
  const setTimer = (fn, ms) => { const t = { fn, ms, cleared: false }; timers.push(t); return t; };
  const clearTimer = (t) => { t.cleared = true; };
  const live = () => timers.filter((t) => !t.cleared);
  const lastDelay = () => live().at(-1)?.ms;
  const changes = [];

  const calls = { initial: [], delta: [] };
  let running = 0, maxRunning = 0;
  const handlers = {
    initial: async (r) => {
      running += 1; maxRunning = Math.max(maxRunning, running);
      calls.initial.push({ id: r.id, statusAtCall: st.syncRequests.get(r.id).status });
      await new Promise((res) => setTimeout(res, 15));
      running -= 1;
    },
    delta: async (r) => {
      calls.delta.push(r.id);
      if (r.lookback_days === 99) throw new LbError('LB_TALLY_UNREACHABLE', 'Tally is not running. Open TallyPrime and try again.');
      if (r.lookback_days === 98) throw new Error('boom: secret-token-eyJhbGciOiJIUzI1NiJ9.abcdefghij.klmnopqrstu');
    },
  };
  const mk = (over = {}) => createRequestListener({
    activation: act, licenseKey: () => lic, blocked: () => blockedText, handlers, now: () => clock, setTimer, clearTimer,
    onChange: (s) => changes.push(s), ...over,
  });
  const post = async (body) => {
    const res = await fetch(`${reg.base}/rest/v1/sync_requests`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: mock.MOCK_ANON_KEY, authorization: 'Bearer mock-access-dev', prefer: 'return=representation' },
      body: JSON.stringify({ license_key: LIC, ...body }),
    });
    return { status: res.status, row: (await res.json())[0] };
  };
  const row = (id) => st.syncRequests.get(id);
  const reset = () => { st.syncRequests.clear(); calls.initial.length = 0; calls.delta.length = 0; timers = []; changes.length = 0; running = 0; maxRunning = 0; };

  // 1. ping: pending -> done, no handler needed ------------------------------------------------------------------------
  {
    const l = mk();
    const { row: r } = await post({ device_id: 'dev-a', kind: 'ping' });
    assert.equal(r.status, 'pending');
    await l.pollNow();
    assert.equal(row(r.id).status, 'done');
    assert.equal(row(r.id).error, null);
    assert.equal(l.state().done, 1);
    assert.ok(l.state().lastPollAt);
    ok('ping moves pending -> done');
  }

  // 2. no handler for a data kind: failed at once with a plain text ------------------------------------------------------
  {
    reset();
    const l = mk({ handlers: {} });
    const { row: r } = await post({ device_id: 'dev-a', kind: 'initial' });
    await l.pollNow();
    assert.equal(row(r.id).status, 'failed');
    assert.match(row(r.id).error, /cannot send data/);
    assert.equal(l.state().failed, 1);
    ok('a kind without a handler fails immediately with text');
  }

  // 3. handler path: processing while it runs, done after; delta/initial/snapshot_refresh ----------------------------------
  {
    reset();
    const l = mk();
    const a = (await post({ device_id: 'dev-a', kind: 'initial', company_guid: 'g1' })).row;
    const b = (await post({ device_id: 'dev-a', kind: 'delta', last_sync_at: '2026-10-24T00:00:00Z', lookback_days: 7 })).row;
    await l.pollNow();
    assert.equal(calls.initial[0].statusAtCall, 'processing');
    assert.equal(row(a.id).status, 'done');
    assert.equal(row(b.id).status, 'done');
    ok('handler sees processing, request ends done');
  }

  // 4. sequential and oldest first ---------------------------------------------------------------------------------------
  {
    reset();
    const l = mk();
    const ids = [];
    for (let i = 0; i < 4; i += 1) {
      const r = (await post({ device_id: `dev-${i}`, kind: 'initial', created_at: new Date(clock - (10 - i) * 1000).toISOString() })).row;
      ids.push(r.id);
    }
    // insert one older than all, last
    const oldest = (await post({ device_id: 'dev-old', kind: 'initial', created_at: new Date(clock - 60000).toISOString() })).row;
    await l.pollNow();
    assert.equal(maxRunning, 1);
    assert.deepEqual(calls.initial.map((c) => c.id), [oldest.id, ...ids]);
    ok('sequential, oldest first, never two at once');
  }

  // 5. failures: LbError text kept, other errors become a generic text without the raw message ---------------------------
  {
    reset();
    const l = mk();
    const e1 = (await post({ device_id: 'dev-a', kind: 'delta', lookback_days: 99 })).row;
    const e2 = (await post({ device_id: 'dev-b', kind: 'delta', lookback_days: 98 })).row;
    await l.pollNow();
    assert.equal(row(e1.id).status, 'failed');
    assert.equal(row(e1.id).error, 'Tally is not running. Open TallyPrime and try again.');
    assert.equal(row(e2.id).status, 'failed');
    assert.doesNotMatch(row(e2.id).error, /boom|secret|eyJ/);
    assert.match(row(e2.id).error, /could not complete/);
    // failure of one does not stop the next
    const e3 = (await post({ device_id: 'dev-c', kind: 'initial' })).row;
    await l.pollNow();
    assert.equal(row(e3.id).status, 'done');
    ok('failed with error text; raw errors never reach the device; next request still served');
  }

  // 6. unique in-flight guard (database side) and ask-again after done -----------------------------------------------------
  {
    reset();
    const l = mk();
    const first = await post({ device_id: 'dev-a', kind: 'delta' });
    const dup = await post({ device_id: 'dev-a', kind: 'delta' });
    assert.equal(first.status, 201);
    assert.equal(dup.status, 409);
    await l.pollNow();
    const again = await post({ device_id: 'dev-a', kind: 'delta' });
    assert.equal(again.status, 201);
    await l.pollNow();
    assert.equal(row(again.row.id).status, 'done');
    assert.equal(calls.delta.length, 2);
    ok('one in-flight request per device and kind; asking again after done works');
  }

  // 7. claim race: another connector took it between read and claim -> handler not called ---------------------------------
  {
    reset();
    const l = mk();
    const r = (await post({ device_id: 'dev-a', kind: 'initial' })).row;
    hook = (url, init) => {
      if (init?.method === 'PATCH' && url.includes('status=eq.pending')) { row(r.id).status = 'processing'; hook = null; }
    };
    await l.pollNow();
    assert.equal(calls.initial.length, 0);
    assert.equal(row(r.id).status, 'processing');
    ok('a request already claimed elsewhere is left alone');
  }

  // 8. stale requests are closed so the device can ask again; fresh processing untouched --------------------------------------
  {
    reset();
    const l = mk();
    const oldP = (await post({ device_id: 'dev-a', kind: 'initial', created_at: new Date(clock - 31 * 60000).toISOString() })).row;
    const stuck = (await post({ device_id: 'dev-b', kind: 'initial', status: 'processing', updated_at: new Date(clock - 11 * 60000).toISOString() })).row;
    const fresh = (await post({ device_id: 'dev-c', kind: 'initial', status: 'processing', updated_at: new Date(clock - 60000).toISOString() })).row;
    await l.pollNow();
    assert.equal(row(oldP.id).status, 'failed');
    assert.match(row(oldP.id).error, /did not pick this request up/);
    assert.equal(row(stuck.id).status, 'failed');
    assert.match(row(stuck.id).error, /stopped while working/);
    assert.equal(row(fresh.id).status, 'processing');
    assert.equal(calls.initial.length, 0);
    const again = await post({ device_id: 'dev-a', kind: 'initial' });
    assert.equal(again.status, 201);
    ok('stale pending (30 min) and stuck processing (10 min) closed as failed; fresh processing untouched');
  }

  // 9. other licenses and unknown kinds ---------------------------------------------------------------------------------------
  {
    reset();
    const l = mk();
    const other = (await post({ license_key: 'LB-OTHER-0000-0000-0001', device_id: 'dev-x', kind: 'ping' })).row;
    const weird = (await post({ device_id: 'dev-w', kind: 'weird' })).row;
    await l.pollNow();
    assert.equal(row(other.id).status, 'pending');
    assert.equal(row(weird.id).status, 'failed');
    ok('rows of another license ignored; unknown kind failed');
  }

  // 10. blocked and not activated: no request leaves the PC ------------------------------------------------------------------
  {
    reset();
    const l = mk();
    const r = (await post({ device_id: 'dev-a', kind: 'ping' })).row;
    st.calls.length = 0;
    blockedText = 'device revoked';
    await l.pollNow();
    assert.equal(st.calls.filter((c) => c.includes('sync_requests')).length, 0);
    assert.equal(row(r.id).status, 'pending');
    blockedText = null;
    stage = 'signed_out';
    await l.pollNow();
    assert.equal(st.calls.filter((c) => c.includes('sync_requests')).length, 0);
    stage = 'active';
    lic = null;
    await l.pollNow();
    assert.equal(st.calls.filter((c) => c.includes('sync_requests')).length, 0);
    lic = LIC;
    await l.pollNow();
    assert.equal(row(r.id).status, 'done');
    ok('revoked, blocked, signed out or no key: nothing is sent; recovers when cleared');
  }

  // 11. cadence: 5 s between polls, floor 2 s, backoff while offline, reset after success ---------------------------------------
  {
    reset();
    const l = mk();
    l.start();
    await l.pollNow();
    assert.equal(lastDelay(), 5000);
    l.stop();
    assert.equal(live().length, 0);
    reset();
    const f = mk({ pollMs: 100 });
    f.start();
    await f.pollNow();
    assert.equal(lastDelay(), 2000);
    f.stop();
    reset();
    const b = mk();
    offline = true;
    b.start();
    await b.pollNow();
    assert.equal(b.state().pollFailures, 1);
    assert.match(b.state().message, /offline/);
    const delays = [lastDelay()];
    for (let i = 0; i < 5; i += 1) {
      live().at(-1).fn();
      await b.pollNow();
      delays.push(lastDelay());
    }
    assert.deepEqual(delays, [10000, 20000, 40000, 60000, 60000, 60000]);
    offline = false;
    live().at(-1).fn();
    await b.pollNow();
    assert.equal(b.state().pollFailures, 0);
    assert.equal(b.state().message, null);
    assert.equal(lastDelay(), 5000);
    b.stop();
    ok('5 s cadence, 2 s floor, backoff 10/20/40/60 s while offline, reset on recovery');
  }

  // 12. nudge and single-flight ----------------------------------------------------------------------------------------------
  {
    reset();
    const l = mk();
    l.start();
    await l.pollNow();
    const before = live().length;
    clock += 10000;
    l.nudge();
    assert.equal(lastDelay(), 0);
    assert.ok(live().length >= 1 && live().length <= before);
    // two joined polls run the handler once
    const r = (await post({ device_id: 'dev-a', kind: 'initial' })).row;
    await Promise.all([l.pollNow(), l.pollNow()]);
    assert.equal(calls.initial.length, 1);
    assert.equal(row(r.id).status, 'done');
    // nudge during a poll queues exactly one more
    await post({ device_id: 'dev-b', kind: 'initial' });
    const p = l.pollNow();
    l.nudge();
    l.nudge();
    await p;
    assert.ok(lastDelay() <= 2000);
    l.stop();
    ok('single-flight; nudge polls early without stacking');
  }

  // 13. a result that could not be written is flushed later; the handler runs once ---------------------------------------------
  {
    reset();
    const l = mk();
    const r = (await post({ device_id: 'dev-a', kind: 'initial' })).row;
    let cut = false;
    hook = (url, init) => { if (init?.method === 'PATCH' && cut) { throw new TypeError('fetch failed'); } };
    const sawProcessing = new Promise((res) => {
      const h = handlers.initial;
      handlers.initial = async (req) => { await h(req); cut = true; res(); };
    });
    await l.pollNow();
    await sawProcessing;
    assert.equal(row(r.id).status, 'processing');
    assert.equal(l.state().pollFailures, 1);
    cut = false; hook = null;
    await l.pollNow();
    assert.equal(row(r.id).status, 'done');
    assert.equal(calls.initial.length, 1);
    ok('a final status lost to a network cut is written on the next poll; no second run');
  }

  // 14. logs: events present, no secrets, no company guid ----------------------------------------------------------------------
  {
    const text = fs.readFileSync(logFilePath(0), 'utf8');
    const lines = text.trim().split('\n').map((x) => JSON.parse(x)).filter((x) => x.mod === 'postbox');
    const msgs = new Set(lines.map((x) => x.msg));
    for (const m of ['request picked up', 'request done', 'request closed as failed', 'request poll offline, will retry', 'stale request closed', 'request listener paused']) assert.ok(msgs.has(m), m);
    assert.doesNotMatch(text, /eyJhbGci|mock-access|"g1"|company_guid/);
    ok('structured postbox logs without tokens or company guids');
  }

  reg.close();
  fs.rmSync(out, { recursive: true, force: true });
  console.log(`\n${passed} checks passed`);
})().catch((e) => { console.error(e); process.exit(1); });
