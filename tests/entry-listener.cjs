// Node-level check for Phase 24: the entry listener against the mock license project (real HTTP), fake clock and timers.
// Run: NODE_PATH=<dir with typescript> node tests/entry-listener.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-el');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/entries', 'src/main/postbox', 'src/shared']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
// Phase 28: the listener now imports results.ts, which reads entry_rules.json
fs.mkdirSync(path.join(out, 'docs/shared'), { recursive: true });
fs.copyFileSync('docs/shared/entry_rules.json', path.join(out, 'docs/shared/entry_rules.json'));
const R = (p) => require(path.join(out, p));
const { initLogger, logFilePath } = R('src/main/logger.js');
const { TargetClient } = R('src/main/supabase.js');
const { LbError } = R('src/main/errors.js');
const EL = R('src/main/entries/listener.js');

const EX = 'docs/shared/entry_examples';
const ex = (f) => JSON.parse(fs.readFileSync(`${EX}/${f}`, 'utf8'));
const consts = JSON.parse(fs.readFileSync('docs/shared/constants.json', 'utf8'));
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
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-el-'));
  initLogger({ dir: path.join(tmp, 'logs'), maxBytes: 1e6, keepFiles: 2 });

  let offline = false;
  const fetchFn = async (...a) => { if (offline) throw new TypeError('fetch failed'); return fetch(...a); };
  const client = new TargetClient({ url: reg.base, anonKey: mock.MOCK_ANON_KEY, fetchFn });
  const act = { state: () => ({ stage: 'active' }), getAccessToken: async () => 'mock-access-test', targetClient: () => client };
  let clock = Date.parse('2026-10-25T10:00:00Z');
  const timers = [];
  const setTimer = (fn, ms) => { const t = { fn, ms }; timers.push(t); return t; };
  const COMPANY = ex('invoice.valid.json').company_guid;
  let blockedWhy = null;
  const calls = [];
  let handler = async () => ({ ok: true, guid: 'G-1', voucher_number: 'S-1', alter_id: 5, message: 'Created in Tally' });
  const mk = (over = {}) => EL.createEntryListener({
    activation: act, licenseKey: () => LIC, blocked: () => blockedWhy, companyGuid: () => COMPANY,
    handlers: Object.fromEntries(EL.ENTRY_KINDS.filter((k) => k !== 'journal').map((k) => [k, async (c) => { calls.push({ kind: k, attempt: c.attempt, recovered: c.recovered, id: c.row.id }); return handler(c); }])),
    now: () => clock, setTimer, clearTimer: () => {}, retryBaseMs: 60_000, ...over,
  });
  let listener = mk();
  let seq = 0;
  const queue = async (payload, over = {}) => {
    const row = { client_request_id: payload.client_request_id, license_key: LIC, device_id: payload.device_id, kind: payload.kind, payload, ...over };
    const res = await client.rest({ accessToken: 'mock-access-x' }, 'POST', 'entry_queue', row);
    clock += 1000; // distinct created_at ordering is by insert order in the mock
    return res[0].id;
  };
  const fresh = (name, crid) => { const p = JSON.parse(JSON.stringify(ex(name))); p.client_request_id = crid ?? `aaaaaaaa-aaaa-4aaa-8aaa-${String(++seq).padStart(12, '0')}`; return p; };
  const row = (id) => st.entryQueue.get(id);

  // 1. valid entry: claimed once, handler called with the envelope, posted with the result written back
  {
    const id = await queue(fresh('invoice.valid.json'));
    await listener.pollNow();
    const r = row(id);
    assert.equal(r.status, 'posted');
    assert.equal(r.attempts, 1);
    assert.deepEqual(r.result, { ok: true, guid: 'G-1', voucher_number: 'S-1', alter_id: 5, message: 'Created in Tally' });
    assert.ok(r.posted_at);
    assert.deepEqual(calls.map((c) => [c.kind, c.attempt, c.recovered]), [['invoice', 1, false]]);
    await listener.pollNow();
    assert.equal(calls.length, 1); // posted rows are never touched again
    ok('a queued invoice is claimed (attempts 1), dispatched by kind, written back as posted with its result, and not seen again');
  }

  // 2. claimed exactly once: a second connector holding a stale "queued" view cannot run the same row
  {
    calls.length = 0;
    const id = await queue(fresh('receipt.valid.json'));
    let release; const gate = new Promise((r) => { release = r; });
    const staleClient = new TargetClient({ url: reg.base, anonKey: mock.MOCK_ANON_KEY, fetchFn: async (u, o) => {
      const res = await fetch(u, o);
      if ((o?.method ?? 'GET') === 'GET' && String(u).includes('entry_queue')) await gate; // keeps its snapshot, answers late
      return res;
    } });
    const slow = mk({ activation: { ...act, targetClient: () => staleClient } });
    const b = slow.pollNow();
    await new Promise((r) => setTimeout(r, 150));
    await listener.pollNow(); // the first connector takes it and finishes
    release();
    await b;
    assert.equal(calls.filter((c) => c.id === id).length, 1);
    assert.equal(row(id).status, 'posted');
    assert.equal(row(id).attempts, 1);
    ok('a row seen as queued by two connectors is claimed and handled exactly once (claim is guarded by status and attempts)');
  }

  // 3. envelope checks: nothing reaches a handler, the device gets a plain text and a detail code
  {
    calls.length = 0;
    const bad = async (mut, detail, re) => {
      const p = fresh('invoice.valid.json'); mut(p);
      const id = await queue(p, { kind: 'invoice' });
      await listener.pollNow();
      const r = row(id);
      assert.equal(r.status, 'failed', detail);
      assert.equal(r.result.ok, false); assert.equal(r.result.detail, detail); assert.equal(r.result.retryable, false);
      assert.match(r.result.message, re);
      return r;
    };
    await bad((p) => { p.v = 2; }, 'UNSUPPORTED_VERSION', /newer app/);
    await bad((p) => { p.extra = 1; }, 'PAYLOAD_INVALID', /format/);
    await bad((p) => { p.kind = 'receipt'; }, 'PAYLOAD_INVALID', /format/); // row.kind stays invoice
    await bad((p) => { delete p.data; }, 'PAYLOAD_INVALID', /format/);
    await bad((p) => { p.company_guid = 'someone-else'; }, 'COMPANY_MISMATCH', /different company/);
    await bad((p) => { p.data.blob = 'x'.repeat(100_500); }, 'PAYLOAD_INVALID', /too large/);
    const r = await bad((p) => { p.client_request_id = 'not-a-uuid'; }, 'PAYLOAD_INVALID', /format/);
    assert.equal(r.result.code, 'LB_TALLY_REJECTED');
    assert.equal(calls.length, 0);
    ok('bad version, unknown key, kind mismatch, missing data, other company, oversize and bad id are failed with detail codes and never dispatched');
  }

  // 4. a kind without a handler fails at once
  {
    const id = await queue(fresh('journal.valid.json'));
    await listener.pollNow();
    assert.equal(row(id).status, 'failed');
    assert.match(row(id).result.message, /cannot post this kind of entry yet/);
    ok('a kind with no handler is failed immediately with a plain text');
  }

  // 5. retryable: back to queued with growing pause, third attempt ends failed
  {
    calls.length = 0;
    handler = async () => ({ ok: false, detail: 'TALLY_UNREACHABLE' });
    const id = await queue(fresh('payment.valid.json'));
    await listener.pollNow();
    assert.deepEqual([row(id).status, row(id).attempts, row(id).result.detail, row(id).result.retryable], ['queued', 1, 'TALLY_UNREACHABLE', true]);
    await listener.pollNow();
    assert.equal(calls.length, 1); // not before the pause
    clock += 61_000;
    await listener.pollNow();
    assert.deepEqual([row(id).status, row(id).attempts], ['queued', 2]);
    clock += 119_000;
    await listener.pollNow();
    assert.equal(calls.length, 2);
    clock += 2_000;
    await listener.pollNow();
    assert.deepEqual([row(id).status, row(id).attempts, row(id).result.detail], ['failed', 3, 'TALLY_UNREACHABLE']);
    assert.match(row(id).result.message, /several tries/);
    assert.deepEqual(calls.map((c) => c.attempt), [1, 2, 3]);
    ok('Tally down: the entry returns to queued after each try, waits 60 s then 120 s, and fails after 3 attempts');
  }

  // 6. handler throws
  {
    handler = async () => { throw new Error('socket hang up'); };
    const id = await queue(fresh('contra.valid.json'));
    await listener.pollNow();
    assert.deepEqual([row(id).status, row(id).result.detail, row(id).result.code], ['needs_review', 'AMBIGUOUS_RESULT', 'LB_ENTRY_NEEDS_REVIEW']);
    handler = async () => { throw new LbError('LB_TALLY_UNREACHABLE', 'refused'); };
    const id2 = await queue(fresh('contra.valid.json'));
    await listener.pollNow();
    assert.deepEqual([row(id2).status, row(id2).attempts], ['queued', 1]);
    st.entryQueue.get(id2).status = 'cancelled'; // clean up
    handler = async () => ({ ok: true, guid: 'G-1', voucher_number: 'S-1', alter_id: 5, message: 'Created in Tally' });
    ok('an unexpected throw goes to needs_review (never auto-retried); a Tally-unreachable throw is retried');
  }

  // 7. outcomes: duplicate found = posted, review and failure details
  {
    handler = async () => ({ ok: false, detail: 'DUPLICATE_CLIENT_REQUEST', message: 'Already posted (found by client_request_id)' });
    const id = await queue(fresh('journal.valid.json'.replace('journal', 'receipt')));
    await listener.pollNow();
    assert.equal(row(id).status, 'posted');
    handler = async () => ({ ok: false, detail: 'ALTER_CONFLICT', message: 'x' });
    const id2 = await queue(fresh('receipt.valid.json'));
    await listener.pollNow();
    // ALTER_CONFLICT is not in this module's own table: unknown details are final failures until Phase 28 supplies the full table
    assert.equal(row(id2).status, 'failed');
    const listener2 = mk({ mapDetail: (dd) => (dd === 'ALTER_CONFLICT' ? { code: 'LB_ENTRY_NEEDS_REVIEW', status: 'needs_review', retryable: false } : undefined) });
    const id3 = await queue(fresh('receipt.valid.json'));
    await listener2.pollNow();
    assert.deepEqual([row(id3).status, row(id3).result.code], ['needs_review', 'LB_ENTRY_NEEDS_REVIEW']);
    handler = async () => ({ ok: true, guid: 'G-1', voucher_number: 'S-1', alter_id: 5, message: 'Created in Tally' });
    ok('DUPLICATE_CLIENT_REQUEST closes as posted; unmapped details fail; a Phase 28 table can map details to needs_review');
  }

  // 8. crash recovery: an orphan posting row is re-claimed with recovered=true; past the attempts limit it needs review
  {
    calls.length = 0;
    const p = fresh('invoice.valid.json');
    const id = await queue(p, { status: 'posting', attempts: 1 });
    await listener.pollNow();
    assert.deepEqual(calls.map((c) => [c.attempt, c.recovered]), [[2, true]]);
    assert.equal(row(id).status, 'posted');
    const id2 = await queue(fresh('invoice.valid.json'), { status: 'posting', attempts: 3 });
    await listener.pollNow();
    assert.equal(calls.length, 1);
    assert.deepEqual([row(id2).status, row(id2).result.detail, row(id2).attempts], ['needs_review', 'AMBIGUOUS_RESULT', 4]);
    ok('a row left in posting by a crash is re-run once with recovered=true; after 3 attempts it goes to needs_review without posting');
  }

  // 9. offline write-back: result kept, replayed without running the handler again, also after a restart
  {
    calls.length = 0;
    const file = path.join(tmp, 'entry-outbox.json');
    const l = mk({ outboxFile: file });
    handler = async () => { offline = true; return { ok: true, guid: 'G-9', voucher_number: 'S-9', alter_id: 9 }; };
    const id = await queue(fresh('payment.valid.json'));
    await l.pollNow(); // claim ok, post ok, write fails (offline)
    assert.equal(row(id).status, 'posting');
    assert.equal(l.pendingResults(), 1);
    assert.ok(fs.existsSync(file));
    await l.pollNow(); // still offline
    assert.equal(calls.length, 1);
    offline = false;
    const l2 = mk({ outboxFile: file }); // restart
    assert.equal(l2.pendingResults(), 1);
    await l2.pollNow();
    assert.equal(calls.length, 1, 'handler must not run again');
    assert.deepEqual([row(id).status, row(id).result.guid, l2.pendingResults()], ['posted', 'G-9', 0]);
    handler = async () => ({ ok: true, guid: 'G-1', voucher_number: 'S-1', alter_id: 5, message: 'Created in Tally' });
    ok('offline after posting: the result is kept on disk, survives a restart, is written once online, and the entry is not posted twice');
  }

  // 10. guarded write: a row a human cancelled while posting is not overwritten; order is oldest first; block pauses
  {
    calls.length = 0;
    const idA = await queue(fresh('invoice.valid.json'));
    const idB = await queue(fresh('receipt.valid.json'));
    handler = async (c) => { if (c.row.id === idA) st.entryQueue.get(idA).status = 'cancelled'; return { ok: true, guid: 'G' }; };
    blockedWhy = 'device revoked';
    await listener.pollNow();
    assert.equal(calls.length, 0);
    blockedWhy = null;
    await listener.pollNow();
    assert.deepEqual(calls.map((c) => c.id), [idA, idB]);
    assert.equal(row(idA).status, 'cancelled');
    assert.equal(row(idA).result, null);
    assert.equal(row(idB).status, 'posted');
    handler = async () => ({ ok: true, guid: 'G-1', voucher_number: 'S-1', alter_id: 5, message: 'Created in Tally' });
    ok('blocked listener does nothing; entries run oldest first; a row cancelled meanwhile is not overwritten');
  }

  // 11. timers, state, logs
  {
    const l = mk();
    l.start();
    await l.pollNow();
    assert.ok(timers.length > 0);
    assert.equal(timers[timers.length - 1].ms, 5000);
    l.stop();
    const s = l.state();
    assert.equal(s.pollFailures, 0);
    const log = fs.readFileSync(logFilePath(0), 'utf8');
    assert.ok(log.includes('entry claimed') && log.includes('entry handled'));
    assert.ok(!log.includes(COMPANY) && !log.includes('G-9') && !log.includes('Alpha'));
    ok('polls every 5 s; the log has claim and result lines and no company guid, voucher guid or party name');
  }

  reg.server.close();
  fs.rmSync(out, { recursive: true, force: true });
  console.log(`\nall ${n} checks passed`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
