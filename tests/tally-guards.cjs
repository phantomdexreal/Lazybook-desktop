// Node-level check for Phase 14: restore/FY/company-switch detection, Tally closed or busy, clock skew, partial answers.
// Run: NODE_PATH=<dir containing typescript> node tests/tally-guards.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const net = require('node:net');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-guards');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/tally', 'src/main/tally/masters', 'src/main/tally/vouchers', 'src/shared']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
const { initLogger } = require(path.join(out, 'src/main/logger.js'));
const C = require(path.join(out, 'src/main/tally/client.js'));
const CO = require(path.join(out, 'src/main/tally/company.js'));
const G = require(path.join(out, 'src/main/tally/guards.js'));

const FX = 'docs/shared/fixtures';
const mkClient = (port, timeoutMs) => C.createTallyClient({ getTarget: () => ({ host: '127.0.0.1', port }), backoffMs: 1, retries: 0, ...(timeoutMs ? { timeoutMs } : {}) });
const fake = (handler) => new Promise((resolve) => {
  const s = http.createServer((req, res) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => handler(Buffer.concat(c).toString('utf8'), res)); });
  s.listen(0, '127.0.0.1', () => resolve({ server: s, port: s.address().port }));
});

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-gd-'));
  initLogger({ dir: path.join(tmp, 'logs') });

  // 1. restore: the company read through the mock Tally (real HTTP) has lower AlterIDs than the vault remembers
  const mock = await import('../tools/mock-tally/server.mjs');
  const srv = mock.startMockTally(0);
  await new Promise((r) => srv.once('listening', r));
  const info = CO.createCompanyInfo({ client: mkClient(srv.address().port), getCompanyName: () => 'Demo Traders Pvt Ltd' });
  const now = await info.read();
  assert.equal(now.alter_id_master, 115);
  assert.equal(now.alter_id_voucher, 105);
  const mem = G.memoryAfterSync(now);

  const same = G.assessCompany(mem, now);
  assert.equal(same.action, 'none');
  assert.deepEqual([same.pullMasters, same.pullVouchers, same.clearVault], [false, 'none', false]);

  const restored = G.assessCompany({ ...mem, alterIdVoucher: 180, alterIdMaster: 200 }, now);
  assert.equal(restored.action, 'full_resync');
  assert.deepEqual(restored.reasons, ['alterid_backwards_master', 'alterid_backwards_voucher']);
  assert.deepEqual([restored.clearVault, restored.resetCursors, restored.pullMasters, restored.pullVouchers], [true, true, true, 'full']);
  // only the voucher counter went back
  const r2 = G.assessCompany({ ...mem, alterIdVoucher: 106 }, now);
  assert.deepEqual([r2.action, r2.reasons, r2.clearVault], ['full_resync', ['alterid_backwards_voucher'], true]);
  srv.close();

  // 2. normal growth, first sync, company switch, FY change
  assert.deepEqual([G.assessCompany(null, now).action, G.assessCompany(null, now).reasons], ['full_resync', ['first_sync']]);
  assert.equal(G.assessCompany(null, now).clearVault, false);
  const grow = G.assessCompany({ ...mem, alterIdVoucher: 100 }, now);
  assert.deepEqual([grow.action, grow.pullMasters, grow.pullVouchers, grow.clearVault], ['incremental', false, 'incremental', false]);
  const mgrow = G.assessCompany({ ...mem, alterIdMaster: 110 }, now);
  assert.deepEqual([mgrow.action, mgrow.pullMasters, mgrow.pullVouchers], ['masters', true, 'incremental']);
  const sw = G.assessCompany({ ...mem, companyGuid: 'other' }, now);
  assert.deepEqual([sw.action, sw.reasons, sw.clearVault, sw.resetCursors], ['full_resync', ['company_switched'], true, true]);
  const fy = G.assessCompany({ ...mem, startingFrom: '2025-04-01', endingAt: '2026-03-31' }, now);
  assert.deepEqual([fy.action, fy.reasons, fy.clearVault, fy.pullMasters, fy.pullVouchers], ['window_resync', ['fy_changed'], false, true, 'full']);
  // restore wins over FY change; reasons accumulate
  const both = G.assessCompany({ ...mem, alterIdVoucher: 999, startingFrom: '2025-04-01' }, now);
  assert.equal(both.action, 'full_resync');
  assert.ok(both.reasons.includes('fy_changed') && both.reasons.includes('alterid_backwards_voucher'));
  // null period on both sides is "unchanged"
  assert.equal(G.assessCompany({ ...mem, startingFrom: null, endingAt: null }, { ...now, starting_from: null, ending_at: null }).action, 'none');

  // 3. Tally closed (refused), busy (timeout), no company, rejected, damaged: classification from real client errors
  const dead = net.createServer().listen(0, '127.0.0.1');
  await new Promise((r) => dead.once('listening', r));
  const deadPort = dead.address().port;
  dead.close();
  await new Promise((r) => setTimeout(r, 20));
  const errOf = async (p) => { try { await p(); } catch (e) { return e; } throw new Error('no error'); };
  const closed = G.classifyTallyError(await errOf(() => mkClient(deadPort).collection('LBX', ['GUID'], { type: 'Ledger', company: 'X' })));
  assert.deepEqual([closed.state, closed.retryable], ['closed', true]);
  const hang = await fake(() => {});
  const busy = G.classifyTallyError(await errOf(() => mkClient(hang.port, 150).collection('LBX', ['GUID'], { type: 'Ledger', company: 'X' })));
  assert.deepEqual([busy.state, busy.retryable], ['busy', true]);
  hang.server.close();
  const nc = await fake((b, res) => res.end('<ENVELOPE><LINEERROR>Could not set SVCurrentCompany to Demo</LINEERROR></ENVELOPE>'));
  assert.equal(G.classifyTallyError(await errOf(() => mkClient(nc.port).collection('LBX', ['GUID'], { type: 'Ledger', company: 'X' }))).state, 'no_company');
  nc.server.close();
  const rj = await fake((b, res) => res.end('<ENVELOPE><LINEERROR>Bad thing</LINEERROR></ENVELOPE>'));
  const rejected = G.classifyTallyError(await errOf(() => mkClient(rj.port).collection('LBX', ['GUID'], { type: 'Ledger', company: 'X' })));
  assert.deepEqual([rejected.state, rejected.retryable], ['rejected', false]);
  rj.server.close();
  assert.equal(G.classifyTallyError(new Error('x')).state, 'unknown');
  assert.ok(!/[\u{1F300}-\u{1FAFF}]/u.test(closed.message + busy.message));

  // 4. retry delays and the health tracker
  assert.deepEqual([0, 1, 2, 3, 4, 8, 30].map((n) => G.nextRetryDelayMs(n)), [0, 30000, 60000, 120000, 240000, 900000, 900000]);
  const h = G.createTallyHealth();
  const e1 = await errOf(() => mkClient(deadPort).collection('LBX', ['GUID'], { type: 'Ledger', company: 'X' }));
  assert.equal(h.record(e1).waitMs, 30000);
  assert.equal(h.record(e1).waitMs, 60000);
  assert.deepEqual([h.snapshot().failures, h.snapshot().lastState], [2, 'closed']);
  h.ok();
  assert.deepEqual([h.snapshot().failures, h.snapshot().lastState], [0, 'online']);
  const h2 = G.createTallyHealth();
  const big = new C.TallyError('LB_TALLY_REJECTED', 'TALLY_RESPONSE_TOO_LARGE', 'x', false, 'r');
  assert.deepEqual([h2.record(big).waitMs, h2.snapshot().failures], [0, 0]);

  // 5. clock skew
  const t0 = Date.parse('2026-10-19T08:00:00Z');
  assert.equal(G.clockSkew('2026-10-19T08:00:00Z', t0).level, 'ok');
  const warn = G.clockSkew('2026-10-19T08:03:00Z', t0);
  assert.deepEqual([warn.skewMs, warn.level], [180000, 'warn']);
  const hard = G.clockSkew('2026-10-19T08:30:00Z', t0);
  assert.equal(hard.level, 'hard');
  assert.equal(G.clockSkew('2026-10-19T07:40:00Z', t0).skewMs, -1200000);
  assert.equal(G.clockSkew('2026-10-19T08:00:10Z', t0, 4000).skewMs, 12000);
  assert.equal(G.clockSkew('not a date', t0), null);
  assert.equal(G.serverNow(t0, hard), t0 + 1800000);
  assert.equal(G.serverNow(t0, null), t0);
  // near midnight a hard skew changes the corrected date; a warn skew does not
  const late = new Date(2026, 9, 19, 23, 50).getTime();
  const ahead = { skewMs: 30 * 60000, level: 'hard' };
  assert.equal(G.correctedToday(late, ahead), '2026-10-20');
  assert.equal(G.correctedToday(late, { skewMs: 30 * 60000, level: 'warn' }), '2026-10-19');
  assert.equal(G.correctedToday(late, null), '2026-10-19');

  // 6. partial answers: guid list vs pulled guids, counts, and damaged-answer retries
  const listed = ['a', 'b', 'c'];
  assert.deepEqual(G.checkCompleteness(listed, ['c', 'b', 'a']), { complete: true, missing: [], extra: [] });
  assert.deepEqual(G.checkCompleteness(listed, ['a', 'z']), { complete: false, missing: ['b', 'c'], extra: ['z'] });
  assert.deepEqual(G.checkCount(10, 7), { complete: false, shortBy: 3 });
  assert.deepEqual(G.checkCount(10, 10), { complete: true, shortBy: 0 });
  const dmg = new C.TallyError('LB_TALLY_REJECTED', 'TALLY_MALFORMED', 'd', true, 'r');
  let calls = 0;
  const sleeps = [];
  const ok = await G.retryDamaged(async () => { if (++calls < 3) throw dmg; return 'fine'; }, { sleep: async (ms) => { sleeps.push(ms); } });
  assert.deepEqual([ok, calls, sleeps], ['fine', 3, [2000, 4000]]);
  calls = 0;
  await assert.rejects(() => G.retryDamaged(async () => { calls++; throw dmg; }, { sleep: async () => {} }), (e) => e === dmg);
  assert.equal(calls, 3);
  calls = 0;
  await assert.rejects(() => G.retryDamaged(async () => { calls++; throw new Error('other'); }, { sleep: async () => {} }), /other/);
  assert.equal(calls, 1);
  // a real client against a cut-off answer is classified damaged and retried, then succeeds
  let n = 0;
  const cut = await fake((b, res) => { n++; res.end(n < 2 ? '<ENVELOPE><BODY><DATA><COLLECTION><OBJECT NAME="A"><GUID>g' : '<ENVELOPE><BODY><DATA><COLLECTION><OBJECT NAME="A"><GUID>g1</GUID></OBJECT></COLLECTION></DATA></BODY></ENVELOPE>'); });
  const rows = await G.retryDamaged(() => mkClient(cut.port).collection('LBX', ['GUID'], { type: 'Ledger', company: 'X' }), { sleep: async () => {} });
  assert.equal(rows.length, 1);
  assert.equal(n, 2);
  cut.server.close();

  fs.rmSync(out, { recursive: true, force: true });
  console.log('tally-guards: all checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
