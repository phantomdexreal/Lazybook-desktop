// Node-level check for Phase 18: sync scheduler (cadence, single-flight, backoff, pause, incremental commit, deleted check, closing, restore).
// Real mock Tally over HTTP + real SQLite vault; clock and timers are fake so cadence is exact.
// Run: NODE_PATH=<dir with typescript and better-sqlite3> node tests/sync-scheduler.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { EventEmitter } = require('node:events');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-sched');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/db', 'src/main/tally', 'src/main/tally/masters', 'src/main/tally/vouchers', 'src/main/sync', 'src/shared']) {
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
const req = (p) => require(path.join(out, p));
const { initLogger } = req('src/main/logger.js');
const C = req('src/main/tally/client.js');
const { createCompanyInfo } = req('src/main/tally/company.js');
const { createMasters } = req('src/main/tally/masters/index.js');
const { createVouchers } = req('src/main/tally/vouchers/index.js');
const { createReconciler } = req('src/main/tally/reconcile.js');
const { createClosing } = req('src/main/tally/closing.js');
const { openVault } = req('src/main/db/index.js');
const { createUpsertLayer } = req('src/main/db/upsert.js');
const { createScheduler } = req('src/main/sync/scheduler.js');
const { planMasters, planVouchers } = req('src/main/sync/plan.js');
const model = JSON.parse(fs.readFileSync('docs/shared/data_model.json', 'utf8'));

const FX = 'docs/shared/fixtures/tables';
const table = (t) => JSON.parse(fs.readFileSync(`${FX}/${t}.json`, 'utf8'));
const syncTables = model.tables_order.filter((t) => t !== 'ref_voucher_kind');
const key = (t, r) => JSON.stringify(model.tables[t].primary_key.map((k) => String(r[k])));
const dump = (v, ts_ = syncTables) => Object.fromEntries(ts_.map((t) => [t, Object.fromEntries(v.readTable(t).map((r) => [key(t, r), r]))]));
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-sched-'));
  const logDir = path.join(tmp, 'logs');
  initLogger({ dir: logDir, maxBytes: 1e7, keepFiles: 2 });
  const mock = await import('../tools/mock-tally/server.mjs');
  const srv = mock.startMockTally(0);
  await new Promise((r) => srv.once('listening', r));
  const livePort = srv.address().port;
  // a port nobody listens on
  const dead = require('node:net').createServer();
  await new Promise((r) => dead.listen(0, '127.0.0.1', r));
  const deadPort = dead.address().port;
  await new Promise((r) => dead.close(r));
  let port = livePort;
  const client = C.createTallyClient({ getTarget: () => ({ host: '127.0.0.1', port }), backoffMs: 1, retries: 0, getCompanyName: () => 'Demo Traders Pvt Ltd' });
  const fxCompany = table('tm_company')[0];
  const asOf = '2026-09-30';
  const info = createCompanyInfo({ client, getCompanyName: () => 'Demo Traders Pvt Ltd', getCompanyGuid: () => fxCompany.guid });
  const masters = createMasters({ client, getCompanyName: () => 'Demo Traders Pvt Ltd', getCompanyGuid: () => info.last()?.guid ?? null, getAsOf: () => asOf });
  const realVouchers = createVouchers({ client, getCompanyName: () => 'Demo Traders Pvt Ltd', getCompanyGuid: () => info.last()?.guid ?? null, getCompanyState: () => info.last()?.state_name ?? '', getMasters: () => masters.last()?.tables ?? null });
  const realReconciler = createReconciler({ client, getCompanyName: () => 'Demo Traders Pvt Ltd', getCompanyGuid: () => info.last()?.guid ?? null });
  const realClosing = createClosing({ client, getCompanyName: () => 'Demo Traders Pvt Ltd', getAsOf: () => asOf });

  const vault = openVault({ dir: path.join(tmp, 'vault') });
  const layer = createUpsertLayer(vault.db, model);

  // controllable seams
  let clock = Date.UTC(2026, 9, 25, 10, 0, 0);
  const timers = [];
  let cfg = { intervalMin: 5, lookbackDays: 7, paused: false };
  let blocked = null;
  let companyPatch = null; // mutate the company record the scheduler sees
  const calls = { company: 0, mastersPull: 0, vouchersPull: [], closing: 0, deleted: 0 };
  let voucherHook = null;
  let guidHook = null;
  let closingHook = null;
  const events = new EventEmitter();
  const deps = {
    getVault: () => vault,
    getConfig: () => cfg,
    blocked: () => blocked,
    readCompany: async () => {
      calls.company++;
      const c = await info.read();
      return companyPatch ? { ...c, ...companyPatch } : c;
    },
    masters: { last: () => masters.last(), pull: async () => { calls.mastersPull++; return masters.pull(); } },
    vouchers: { pull: async (o) => { calls.vouchersPull.push(o); const r = await realVouchers.pull(o); return voucherHook ? voucherHook(r) : r; } },
    reconciler: { checkDeleted: async (i) => { calls.deleted++; const r = await realReconciler.checkDeleted(i); return guidHook ? guidHook(r, i) : r; } },
    closing: { read: async () => { calls.closing++; const r = await realClosing.read(); return closingHook ? closingHook(r) : r; } },
    events,
    now: () => clock,
    setTimer: (fn, ms) => { const h = { fn, ms, cancelled: false }; timers.push(h); return h; },
    clearTimer: (h) => { h.cancelled = true; },
  };
  const sched = createScheduler(deps);
  const pending = () => timers.filter((t) => !t.cancelled && !t.fired);
  const nextTimer = () => pending().at(-1);
  const idle = async () => { for (let i = 0; i < 4000 && sched.state().running; i++) await new Promise((r) => setTimeout(r, 5)); assert.ok(!sched.state().running, 'cycle finished'); };
  const fire = async () => { const t = nextTimer(); assert.ok(t, 'a timer is pending'); t.fired = true; t.fn(); await new Promise((r) => setImmediate(r)); await idle(); return sched.state().lastOutcome; };

  // 1. start schedules the first run after 5 s; nothing happens before the timer fires
  sched.start();
  assert.equal(nextTimer().ms, 5000);
  assert.equal(calls.company, 0);
  ok('start schedules the first run (5 s), nothing runs early');

  // 2. first cycle = full sync; the vault equals the shared fixtures
  let o = await fire();
  assert.equal(o.ok, true);
  assert.equal(o.action, 'full_resync');
  assert.ok(o.written.seq !== null && o.written.inserted > 500);
  const got = dump(vault);
  for (const t of syncTables) {
    const want = Object.fromEntries(table(t).map((r) => [key(t, r), r]));
    assert.deepEqual(Object.keys(got[t]).sort(), Object.keys(want).sort(), `${t} keys`);
    for (const k of Object.keys(want)) assert.deepEqual(got[t][k], want[k], `${t} row ${k}`);
  }
  assert.equal(nextTimer().ms, 300000);
  assert.equal(calls.vouchersPull[0].sinceAlterId, null);
  assert.ok(sched.lastSyncAt());
  assert.equal(calls.closing, 1);
  ok('first cycle is a full resync; all 25 vault tables equal the shared fixtures; next run in 5 min; closing read once');

  // 3. nothing changed in Tally: next timed cycle writes nothing (no seq), one company call, no other Tally calls
  const head = layer.headSeq();
  const before = { ...calls, vouchersPull: calls.vouchersPull.length };
  clock += 300000;
  o = await fire();
  assert.equal(o.action, 'none');
  assert.equal(o.written.seq, null);
  assert.equal(layer.headSeq(), head);
  assert.equal(calls.company, before.company + 1);
  assert.equal(calls.mastersPull, before.mastersPull);
  assert.equal(calls.vouchersPull.length, before.vouchersPull);
  assert.equal(calls.deleted, before.deleted);
  assert.equal(calls.closing, before.closing);
  assert.equal(nextTimer().ms, 300000);
  ok('quiet cycle: one cheap company call, no pulls, no seq, cadence stays 5 min');

  // 4. configurable interval, clamped to 1 minute
  cfg = { ...cfg, intervalMin: 2 };
  clock += 120000;
  await fire();
  assert.equal(nextTimer().ms, 120000);
  cfg = { ...cfg, intervalMin: 0 };
  clock += 60000;
  await fire();
  assert.equal(nextTimer().ms, 60000);
  cfg = { ...cfg, intervalMin: 5 };
  clock += 60000;
  await fire();
  assert.equal(nextTimer().ms, 300000);
  ok('interval follows config and never goes below one minute');

  // 5. an edit in Tally: incremental pull with the stored cursor, lookback, one commit, lost child row deleted
  const vtab = table('tx_voucher');
  const edited = vtab.find((v) => table('tx_ledger_line').filter((l) => l.voucher_guid === v.guid).length >= 3 && !v.is_cancelled);
  const lostLine = table('tx_ledger_line').filter((l) => l.voucher_guid === edited.guid).at(-1);
  voucherHook = (r) => {
    const tables = JSON.parse(JSON.stringify(r.tables));
    tables.tx_voucher = tables.tx_voucher.map((v) => (v.guid === edited.guid ? { ...v, narration: 'edited in tally', alter_id: 106 } : v));
    tables.tx_ledger_line = tables.tx_ledger_line.filter((l) => !(l.voucher_guid === edited.guid && l.line_index === lostLine.line_index));
    return { ...r, tables, guids: r.guids };
  };
  companyPatch = { alter_id_voucher: 106 };
  const h1 = layer.headSeq();
  clock += 300000;
  o = await fire();
  voucherHook = null;
  assert.equal(o.action, 'incremental');
  const last = calls.vouchersPull.at(-1);
  assert.equal(last.sinceAlterId, 105);
  assert.equal(last.lookbackDays, 7);
  assert.equal(layer.headSeq(), h1 + 1, 'exactly one seq for the whole cycle');
  const v = vault.readTable('tx_voucher').find((x) => x.guid === edited.guid);
  assert.equal(v.narration, 'edited in tally');
  assert.ok(!vault.readTable('tx_ledger_line').some((l) => l.voucher_guid === edited.guid && l.line_index === lostLine.line_index));
  const d = layer.changedSince(h1);
  const batches = [...d.batches];
  assert.ok(batches.some((b) => b.table_name === 'tx_ledger_line' && b.op === 'delete' && b.payload.length === 1));
  assert.deepEqual(batches.filter((b) => b.op === 'upsert' && b.table_name === 'tx_voucher').flatMap((b) => b.payload.map((p) => p.guid)), [edited.guid]);
  ok('incremental cycle: cursor 105 + lookback, one seq, edited voucher updated, lost child row tombstoned, unchanged vouchers not re-sent');
  companyPatch = null;

  // 6. replaying the full pull is a no-op (memory dropped on purpose)
  vault.db.prepare(`UPDATE "_lb_vault_meta" SET "value"='null' WHERE "key"='sched.memory'`).run();
  const h2 = layer.headSeq();
  clock += 300000;
  o = await fire();
  assert.equal(o.action, 'full_resync');
  assert.equal(o.written.inserted + o.written.updated + o.written.deleted > 0, true, 'edited voucher restored to Tally truth');
  const h3 = layer.headSeq();
  vault.db.prepare(`UPDATE "_lb_vault_meta" SET "value"='null' WHERE "key"='sched.memory'`).run();
  clock += 300000;
  o = await fire();
  assert.equal(layer.headSeq(), h3);
  assert.equal(o.written.seq, null);
  assert.ok(h2 < h3);
  ok('replaying a full pull changes nothing (no seq)');

  // 7. single-flight: two manual syncs at once share one cycle
  const c0 = calls.company;
  const [a, b] = await Promise.all([sched.syncNow(), sched.syncNow()]);
  await idle();
  assert.ok(a && b);
  assert.ok(calls.company - c0 <= 2, `joined (${calls.company - c0} company reads)`);
  const runningDuring = (() => { const p = sched.syncNow(); const r = sched.state().running; return p.then(() => r); })();
  assert.equal(await runningDuring, true);
  await idle();
  ok('single-flight: concurrent manual syncs join the running cycle (at most one follow-up)');

  // 8. manual sync runs the deleted check; a voucher gone from Tally is removed with its children and tombstoned
  const gone = vtab.find((x) => !x.is_cancelled && x.guid !== edited.guid);
  const goneChildren = table('tx_ledger_line').filter((l) => l.voucher_guid === gone.guid).length;
  assert.ok(goneChildren > 0);
  const dBefore = calls.deleted;
  const h4 = layer.headSeq();
  // a Tally that no longer lists the voucher: the real answer, minus that guid
  const deleteOps = req('src/main/tally/reconcile.js').deleteOps;
  guidHook = (r) => ({ ...r, deleted: [gone.guid], tallyCount: r.tallyCount - 1, ops: deleteOps(fxCompany.guid, [gone.guid]) });
  o = await sched.syncNow();
  await idle();
  assert.ok(calls.deleted > dBefore, 'manual sync runs the deleted check');
  assert.ok(!vault.readTable('tx_voucher').some((x) => x.guid === gone.guid));
  assert.ok(!vault.readTable('tx_ledger_line').some((l) => l.voucher_guid === gone.guid));
  assert.ok(layer.headSeq() > h4);
  const tomb = [...layer.changedSince(h4).batches].filter((x) => x.op === 'delete' && x.table_name === 'tx_voucher').flatMap((x) => x.payload.map((p) => p.guid));
  assert.deepEqual(tomb, [gone.guid]);
  guidHook = null;
  ok('manual sync runs the deleted check; the deleted voucher and its children are removed and tombstoned');

  // restore the voucher for the following checks (full resync brings it back)
  vault.db.prepare(`UPDATE "_lb_vault_meta" SET "value"='null' WHERE "key"='sched.memory'`).run();
  await sched.syncNow();
  await idle();
  assert.ok(vault.readTable('tx_voucher').some((x) => x.guid === gone.guid));

  // 9. daily deleted check: not due right after, due after 24 h on the timer
  const dn = calls.deleted;
  clock += 300000;
  await fire();
  assert.equal(calls.deleted, dn, 'not due again within 24 h');
  clock += 24 * 3600_000;
  await fire();
  assert.equal(calls.deleted, dn + 1, 'due after 24 h');
  ok('deleted check runs daily on the timer, not every cycle');

  // 10. closing balances: refreshed daily; only changed rows are sent
  const cn = calls.closing;
  clock += 300000;
  await fire();
  assert.equal(calls.closing, cn, 'not due');
  const alpha = table('tm_ledger').find((l) => l.name === 'Alpha Retail');
  closingHook = (r) => ({ ...r, ledgers: r.ledgers.map((l) => (l.guid === alpha.guid ? { ...l, closing_balance: '12345.00' } : l)) });
  clock += 24 * 3600_000;
  const h5 = layer.headSeq();
  o = await fire();
  closingHook = null;
  assert.equal(calls.closing, cn + 1);
  assert.equal(o.closingChanged, 1);
  assert.equal(layer.headSeq(), h5 + 1);
  assert.equal(vault.readTable('tm_ledger').find((l) => l.guid === alpha.guid).closing_balance, '12345.00');
  ok('closing refresh after 24 h changes exactly the changed ledger (one upsert)');
  // put the original back so later full resyncs compare equal
  vault.db.prepare(`UPDATE "_lb_vault_meta" SET "value"='null' WHERE "key"='sched.memory'`).run();

  // 11. incomplete full pull: nothing committed, memory not advanced, retry with backoff
  voucherHook = (r) => ({ ...r, guids: r.guids.slice(1) });
  await sched.syncNow();
  await idle();
  assert.equal(sched.state().lastOutcome.ok, false);
  assert.equal(sched.state().lastOutcome.error.retryable, true);
  voucherHook = null;
  assert.equal(vault.db.prepare(`SELECT "value" FROM "_lb_vault_meta" WHERE "key"='sched.memory'`).get().value, 'null');
  ok('a short Tally answer is refused (count mismatch); memory not advanced');
  await sched.syncNow();
  await idle();
  assert.equal(sched.state().lastOutcome.ok, true);

  // 12. restore: voucher AlterID lower than stored -> full resync, vault cleared and refilled, devices told to resync
  vault.db.prepare(`INSERT OR REPLACE INTO "_lb_device_cursors" ("device_id","cursor","updated_at") VALUES ('dev-x', ?, 'x')`).run(layer.headSeq());
  companyPatch = { alter_id_voucher: 50 };
  vault.db.prepare(`UPDATE "_lb_vault_meta" SET "value"=? WHERE "key"='sched.memory'`).run(JSON.stringify({ companyGuid: fxCompany.guid, alterIdMaster: 115, alterIdVoucher: 105, startingFrom: '2026-04-01', endingAt: '2027-03-31' }));
  const hBefore = layer.headSeq();
  o = await sched.syncNow();
  await idle();
  companyPatch = null;
  assert.equal(sched.state().lastOutcome.action, 'full_resync');
  assert.equal(layer.changedSince(0).needsFull, true, 'old cursors are behind the floor');
  assert.equal(vault.count('tx_voucher'), 52);
  ok('restored Tally (AlterID went back): vault cleared and fully resynced, old device cursors need a full sync');

  // 13. failure leaves vault untouched; backoff 30 s, 60 s, 120 s; recovery returns to the interval
  const h6 = layer.headSeq();
  port = deadPort;
  const delays = [];
  for (let i = 0; i < 3; i++) {
    clock += 1000;
    o = await fire();
    assert.equal(o.ok, false);
    assert.equal(o.error.state, 'closed');
    delays.push(nextTimer().ms);
  }
  assert.deepEqual(delays, [30000, 60000, 120000]);
  assert.equal(layer.headSeq(), h6);
  assert.equal(sched.state().tallyState, 'closed');
  assert.equal(sched.state().failures, 3);
  // manual sync is not held back by backoff and also fails cleanly
  o = await sched.syncNow();
  await idle();
  assert.equal(sched.state().lastOutcome.ok, false);
  port = livePort;
  clock += 1000;
  o = await fire();
  assert.equal(o.ok, true);
  assert.equal(nextTimer().ms, 300000);
  assert.equal(sched.state().failures, 0);
  assert.equal(sched.state().tallyState, 'online');
  ok('Tally closed: backoff 30 s, 60 s, 120 s with the vault untouched; recovery returns to the 5 min cadence');

  // 14. busy Tally (no company chosen) is reported, not retried aggressively
  const realRead = deps.readCompany;
  deps.readCompany = async () => { throw new Error('No company selected'); };
  o = await fire();
  assert.equal(o.error.state, 'no_company');
  deps.readCompany = realRead;
  clock += 1000;
  await fire();
  ok('no company selected is reported as such');

  // 15. pause, block, no vault
  cfg = { ...cfg, paused: true };
  const cp = calls.company;
  o = await fire();
  assert.equal(o.skipped, 'paused');
  assert.equal(calls.company, cp);
  o = await sched.syncNow();
  await idle();
  assert.equal(sched.state().lastOutcome.skipped, undefined, 'manual sync runs even while paused');
  assert.ok(calls.company > cp);
  cfg = { ...cfg, paused: false };
  blocked = 'revoked';
  const cb = calls.company;
  o = await fire();
  assert.equal(o.skipped, 'blocked');
  assert.equal(calls.company, cb);
  blocked = null;
  ok('paused and blocked (revoked) skip timed runs; manual Sync now still works when merely paused');

  // 16. events: sync-now runs a cycle; unpause schedules a quick run; resume schedules a run
  const ce = calls.company;
  events.emit('sync-now');
  await new Promise((r) => setTimeout(r, 30));
  await idle();
  assert.ok(calls.company > ce);
  events.emit('pause-changed', false);
  assert.equal(nextTimer().ms, 2000);
  events.emit('resume');
  assert.equal(nextTimer().ms, 10000);
  ok('lifecycle events: sync-now runs, unpause waits 2 s, resume waits 10 s');

  // 17. stop cancels the timer and unsubscribes
  sched.stop();
  assert.equal(pending().length, 0);
  assert.equal(events.listenerCount('sync-now'), 0);
  ok('stop cancels the timer and unsubscribes');

  // 18. planners are pure and size-honest: unchanged master pull produces upserts only for rows, deletes for vanished masters
  const store = { keyRows: (t) => (t === 'tm_ledger' ? [{ company_guid: fxCompany.guid, guid: 'old-ledger' }, ...table('tm_ledger').map((l) => ({ company_guid: l.company_guid, guid: l.guid }))] : []) };
  const mops = planMasters(model, fxCompany, fxCompany.guid, { tm_ledger: table('tm_ledger') }, store);
  assert.deepEqual(mops.filter((x) => x.op === 'delete').map((x) => [x.table_name, x.payload.map((p) => p.guid)]), [['tm_ledger', ['old-ledger']]]);
  assert.equal(mops[0].table_name, 'tm_company');
  const vops = planVouchers(model, fxCompany.guid, { tx_voucher: [], tx_ledger_line: [] }, { childKeys: () => [] });
  assert.deepEqual(vops, []);
  ok('planners: vanished master becomes a delete; untouched tables are never emptied; empty pull plans nothing');

  // 19. logs: cadence is observable, no secrets or names
  const log = fs.readFileSync(path.join(logDir, 'lazybooks.log'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const sync = log.filter((l) => l.mod === 'sync' || l.module === 'sync');
  assert.ok(sync.some((l) => l.msg === 'sync scheduled'), 'scheduled lines');
  assert.ok(sync.some((l) => l.msg === 'sync cycle done'), 'done lines');
  assert.ok(sync.some((l) => l.msg === 'sync cycle failed'), 'failed lines');
  assert.ok(!JSON.stringify(sync).includes('Demo Traders'), 'no company name in sync logs');
  ok(`logs show the cadence (${sync.filter((l) => l.msg === 'sync scheduled').length} scheduled lines) with no company names`);

  vault.close();
  srv.close();
  fs.rmSync(out, { recursive: true, force: true });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('all passed');
})().catch((e) => { console.error(e); process.exit(1); });
