// Node-level check for Phase 46: progress tracker (throttle, rate, ETA), view texts and percent, event sequence of a real batched sync
// of a generated 5k-voucher company, no names in any event, wiring greps.
// Run: NODE_PATH=<dir with typescript and better-sqlite3> node tests/sync-progress.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');

const out = path.join(__dirname, '.tmp-progress');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/db', 'src/main/tally', 'src/main/tally/masters', 'src/main/tally/vouchers', 'src/main/sync', 'src/shared', 'src/renderer/lib']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
fs.mkdirSync(path.join(out, 'docs/shared'), { recursive: true });
fs.copyFileSync('docs/shared/data_model.json', path.join(out, 'docs/shared/data_model.json'));
const req = (p) => require(path.join(out, p));
const { createProgressTracker, roundEta } = req('src/main/sync/progress.js');
const SP = req('src/shared/syncProgress.js');
const V = req('src/renderer/lib/progressView.js');
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);

const ev = (stage, o = {}) => ({ runId: 'r1', stage, startedAt: '2026-10-27T10:00:00.000Z', updatedAt: '2026-10-27T10:00:00.000Z', ratePerMin: null, etaSeconds: null, resumed: false, message: null, ...o });
const vv = (done, total, idx, extra = {}) => ({ vouchers: { done, total, batchIndex: idx, batchCount: total ? Math.ceil(total / 500) : null, windowFrom: '2026-04-01', windowTo: '2026-04-30', batchSize: 500, effectiveSize: 500, ...extra } });

(async () => {
  // 1. throttle: one per second, stage changes and done/failed at once, newest held event flushed on demand
  {
    let t = 1000;
    const got = [];
    const tr = createProgressTracker({ now: () => t, emit: (p) => got.push(p), throttleMs: 1000 });
    tr.push(ev('starting'));
    tr.push(ev('vouchers', vv(0, 2000, 0)));
    assert.equal(got.length, 2, 'stage changes emit at once');
    t += 200; tr.push(ev('vouchers', vv(500, 2000, 1)));
    t += 200; tr.push(ev('vouchers', vv(1000, 2000, 2)));
    assert.equal(got.length, 2, 'throttled within one second');
    t += 700; tr.push(ev('vouchers', vv(1500, 2000, 3)));
    assert.equal(got.length, 3);
    t += 10; tr.push(ev('vouchers', vv(2000, 2000, 4)));
    tr.flush();
    assert.equal(got.at(-1).vouchers.done, 2000, 'flush emits the held event');
    tr.push(ev('done'));
    assert.equal(got.at(-1).stage, 'done');
    tr.push(ev('failed', { message: 'x' }));
    assert.equal(got.at(-1).stage, 'failed');
    ok('throttle: one event per second, immediate on stage change, done and failed; flush emits the newest held event');
  }

  // 2. rate over the last 5 batches, ETA hidden before 2 batches, hidden when done > total, rounding
  {
    let t = 0;
    const got = [];
    const tr = createProgressTracker({ now: () => t, emit: (p) => got.push(p), throttleMs: 0 });
    tr.push(ev('vouchers', vv(0, 5000, 0)));
    t += 6000; tr.push(ev('vouchers', vv(500, 5000, 1)));
    assert.equal(got.at(-1).etaSeconds, null, 'hidden after 1 batch');
    t += 6000; tr.push(ev('vouchers', vv(1000, 5000, 2)));
    const e = got.at(-1);
    assert.equal(e.ratePerMin, 5000);
    assert.equal(e.etaSeconds, 50, 'ETA visible after 2 batches');
    for (let i = 3; i <= 9; i++) { t += 6000; tr.push(ev('vouchers', vv(i * 500, 5000, i))); }
    assert.equal(got.at(-1).etaSeconds, 10, 'last batch: 500 left at 5000 per min is 6 s, rounded up to 10 s');
    t += 6000; tr.push(ev('vouchers', vv(5200, 5000, 10)));
    assert.equal(got.at(-1).etaSeconds, null, 'never shown when done exceeds total');
    t += 6000; tr.push(ev('vouchers', vv(300, null, 11)));
    assert.equal(got.at(-1).etaSeconds, null, 'null total: no ETA');
    assert.equal(roundEta(130), 180); assert.equal(roundEta(121), 180); assert.equal(roundEta(47), 50); assert.equal(roundEta(-3), 0);
    // rate follows the last five batches, not the whole run: the speed halves, the rate follows within five batches
    t = 0; got.length = 0;
    const tr2 = createProgressTracker({ now: () => t, emit: (p) => got.push(p), throttleMs: 0 });
    tr2.push(ev('vouchers', vv(0, 100000, 0), { runId: 'r2' }));
    let done = 0;
    for (let i = 1; i <= 6; i++) { t += 6000; done += 500; tr2.push({ ...ev('vouchers', vv(done, 100000, i)), runId: 'r2' }); }
    const fast = got.at(-1).ratePerMin;
    for (let i = 7; i <= 12; i++) { t += 12000; done += 500; tr2.push({ ...ev('vouchers', vv(done, 100000, i)), runId: 'r2' }); }
    const slow = got.at(-1).ratePerMin;
    assert.equal(fast, 5000); assert.equal(slow, 2500);
    ok('rate over the last 5 batches follows speed changes; ETA hidden before 2 batches, with null total and when done exceeds total; rounding 10 s / 1 min');
  }

  // 3. percent (weights, 99 cap) and view texts for every stage
  {
    assert.equal(SP.overallPercent(ev('starting')), null);
    assert.equal(SP.overallPercent(ev('counting')), 10);
    assert.equal(SP.overallPercent(ev('vouchers', vv(0, 1000, 0))), 15);
    assert.equal(SP.overallPercent(ev('vouchers', vv(500, 1000, 1))), 53);
    assert.equal(SP.overallPercent(ev('vouchers', vv(1200, 1000, 3))), 89, 'done above total stays below the vouchers share');
    assert.equal(SP.overallPercent(ev('vouchers', vv(10, null, 1))), 15);
    assert.equal(SP.overallPercent(ev('applying')), 94);
    assert.equal(SP.overallPercent(ev('closing')), 98);
    assert.equal(SP.overallPercent(ev('done')), 100);
    assert.equal(SP.overallPercent(ev('failed')), null);
    const t = (p) => V.progressCard(p);
    assert.equal(t(ev('vouchers', vv(12500, 48200, 25))).headline, 'Reading vouchers: 12,500 of 48,200 (25%)');
    assert.equal(t(ev('vouchers', vv(48500, 48200, 97))).headline, 'Reading vouchers: 48,500 of 48,200 (99%)');
    assert.equal(t(ev('vouchers', vv(300, null, 1))).headline, 'Reading vouchers: 300 so far');
    assert.equal(t(ev('vouchers', vv(300, null, 1))).percent, null);
    const d = t({ ...ev('vouchers', vv(2500, 48200, 5, { effectiveSize: 250 })), ratePerMin: 3000, etaSeconds: 900 }).details.join(' | ');
    assert.match(d, /Apr 2026/); assert.match(d, /batch 5 of 97/); assert.match(d, /reduced to 250/); assert.match(d, /3,000 per min/); assert.match(d, /about 15 min left/);
    assert.match(t(ev('vouchers', vv(500, 48200, 1))).details.join(' | '), /estimating/);
    assert.doesNotMatch(t({ ...ev('vouchers', vv(48200, 48200, 97)), etaSeconds: 30 }).details.join(' | '), /left/, 'no ETA at the end');
    assert.match(t({ ...ev('vouchers', vv(12500, 48200, 25)), resumed: true, message: 'Resuming from 12,500' }).details[0], /Resuming from 12,500/);
    assert.equal(t(ev('counting')).headline, 'Counting vouchers...'); assert.equal(t(ev('counting')).percent, null);
    assert.equal(t(ev('applying')).headline, 'Saving to your computer...');
    assert.equal(t(ev('masters', { masters: { done: 7, total: 13 } })).headline, 'Reading masters 7 of 13');
    assert.equal(t(ev('masters', { masters: { done: 0, total: 1 } })).headline, 'Reading masters...');
    assert.equal(t(ev('failed', { message: 'Tally is not answering.' })).tone, 'bad');
    assert.equal(V.etaText(40), 'about 40 s left'); assert.equal(V.etaText(null), null); assert.equal(V.etaText(-5), null); assert.equal(V.etaText(361), 'about 6 min left');
    ok('percent weights and the 99 cap, headline and detail texts for every stage, null totals, done above total, reduced size, resume line');
  }

  // 4. quiet cycles do not flash a card
  {
    assert.equal(V.cardVisible(null, 9999), false);
    assert.equal(V.cardVisible(ev('done'), 9999), false);
    assert.equal(V.cardVisible(ev('failed', { message: 'x' }), 0), true);
    assert.equal(V.cardVisible(ev('starting'), 100), false);
    assert.equal(V.cardVisible(ev('vouchers', vv(0, 300, 0)), 100), false, 'total within one batch');
    assert.equal(V.cardVisible(ev('vouchers', vv(0, 3000, 0)), 100), true, 'total above one batch');
    assert.equal(V.cardVisible(ev('applying'), 2500), true, 'a stage longer than 2 s');
    ok('card hidden for quiet cycles (total within one batch, stage under 2 s), shown for big runs, long stages and failures');
  }

  // 5. event sequence of a real batched sync of a generated 5k company; no names in any event
  {
    const { initLogger } = req('src/main/logger.js');
    const C = req('src/main/tally/client.js');
    const { createCompanyInfo } = req('src/main/tally/company.js');
    const { createMasters } = req('src/main/tally/masters/index.js');
    const { createVouchers } = req('src/main/tally/vouchers/index.js');
    const { createReconciler } = req('src/main/tally/reconcile.js');
    const { createClosing } = req('src/main/tally/closing.js');
    const { openVault } = req('src/main/db/index.js');
    const { createScheduler } = req('src/main/sync/scheduler.js');
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-prog-'));
    initLogger({ dir: path.join(tmp, 'logs'), maxBytes: 1e7, keepFiles: 2 });
    const M = await import(pathToFileURL(path.resolve('tools/mock-tally/server.mjs')).href);
    const G = await import(pathToFileURL(path.resolve('tools/gen-big-company.mjs')).href);
    const srv = M.startMockTally(0, { vouchers: G.bigCompany(5000).vouchers });
    await new Promise((r) => (srv.listening ? r() : srv.on('listening', r)));
    const port = srv.address().port;
    const NAME = 'Demo Traders Pvt Ltd';
    const fxCompany = JSON.parse(fs.readFileSync('docs/shared/fixtures/tables/tm_company.json', 'utf8'))[0];
    const client = C.createTallyClient({ getTarget: () => ({ host: '127.0.0.1', port }), backoffMs: 1, retries: 0, getCompanyName: () => NAME });
    const info = createCompanyInfo({ client, getCompanyName: () => NAME, getCompanyGuid: () => fxCompany.guid });
    const masters = createMasters({ client, getCompanyName: () => NAME, getCompanyGuid: () => info.last()?.guid ?? null, getAsOf: () => '2026-09-30' });
    const vouchers = createVouchers({ client, sleep: async () => {}, pauseMs: 0, getCompanyName: () => NAME, getCompanyGuid: () => info.last()?.guid ?? null, getCompanyState: () => info.last()?.state_name ?? '', getMasters: () => masters.last()?.tables ?? null });
    const reconciler = createReconciler({ client, getCompanyName: () => NAME, getCompanyGuid: () => info.last()?.guid ?? null });
    const closing = createClosing({ client, getCompanyName: () => NAME, getAsOf: () => '2026-09-30' });
    const raw = [];
    const shown = [];
    const tracker = createProgressTracker({ emit: (p) => shown.push(p) });
    const sched = createScheduler({
      getVault: () => openVaultOnce, getConfig: () => ({ intervalMin: 5, lookbackDays: 7, paused: false, voucherBatchSize: 500 }), blocked: () => null,
      readCompany: () => info.read(), masters, vouchers, closing, reconciler, getRunFile: () => path.join(tmp, 'sync-run.json'),
      onProgress: (p) => { raw.push(p); tracker.push(p); },
      setTimer: () => ({}), clearTimer: () => {},
    });
    const openVaultOnce = openVault({ dir: path.join(tmp, 'vault') });
    const o = await sched.syncNow();
    assert.equal(o.ok, true);
    const stages = raw.map((p) => p.stage);
    for (const s of ['starting', 'masters', 'counting', 'vouchers', 'checking-deleted', 'applying', 'closing', 'done']) assert.ok(stages.includes(s), `stage ${s}`);
    assert.equal(stages.at(-1), 'done');
    assert.ok(new Set(raw.map((p) => p.runId)).size === 1, 'one run id');
    const order = ['starting', 'masters', 'counting', 'vouchers', 'checking-deleted', 'applying', 'closing', 'done'];
    const idx = stages.map((s) => order.indexOf(s));
    assert.deepEqual(idx, [...idx].sort((a, b) => a - b), 'stages never go backwards');
    const dones = raw.filter((p) => p.vouchers).map((p) => p.vouchers.done);
    assert.ok(dones.length >= 10, `batch events (${dones.length})`);
    assert.deepEqual(dones, [...dones].sort((a, b) => a - b), 'monotonic done');
    assert.equal(dones.at(-1), 5000);
    assert.equal(raw.find((p) => p.vouchers).vouchers.total, 5000);
    const pcts = raw.map((p) => SP.overallPercent(p)).filter((x) => x !== null);
    assert.deepEqual(pcts, [...pcts].sort((a, b) => a - b), 'percent never goes down');
    assert.equal(shown.at(-1).stage, 'done');
    assert.ok(shown.length < raw.length, 'the tracker throttled the burst');
    assert.ok(shown.some((p) => p.stage === 'vouchers'));
    // no names anywhere
    const text = JSON.stringify(raw) + JSON.stringify(shown);
    for (const bad of [NAME, 'Generated Debit', 'Generated Credit', fxCompany.guid]) assert.equal(text.includes(bad), false, `no "${bad}" in events`);
    for (const t of ['tm_ledger', 'tm_stock_item']) for (const r of JSON.parse(fs.readFileSync(`docs/shared/fixtures/tables/${t}.json`, 'utf8')).slice(0, 40)) assert.equal(text.includes(JSON.stringify(r.name).slice(1, -1)) && String(r.name).length > 4, false, `no master name ${r.name}`);
    // a failure emits `failed` with the message
    srv.close(); srv.closeAllConnections?.();
    openVaultOnce.db.prepare(`UPDATE "_lb_vault_meta" SET "value"='null' WHERE "key"='sched.memory'`).run();
    raw.length = 0;
    const o2 = await sched.syncNow();
    assert.equal(o2.ok, false);
    assert.equal(raw.at(-1).stage, 'failed');
    assert.ok(raw.at(-1).message);
    ok(`event sequence of a batched sync of 5k vouchers: ${stages.length} raw events (${shown.length} after the throttle), monotonic, ends in done, no names; a failure ends in failed with a message`);
    process.exitCode = 0;
  }

  // 6. wiring greps
  {
    const idx = fs.readFileSync('src/main/index.ts', 'utf8');
    const pre = fs.readFileSync('src/preload/index.ts', 'utf8');
    const st = fs.readFileSync('src/renderer/pages/Status.tsx', 'utf8');
    const comp = fs.readFileSync('src/renderer/components/SyncProgress.tsx', 'utf8');
    assert.match(idx, /onProgress: \(p\) => progressTracker\.push\(p\)/);
    assert.match(idx, /send\(IPC\.syncProgress, p\)/);
    assert.match(idx, /ipcMain\.handle\(IPC\.syncProgressGet/);
    assert.match(idx, /setProgressBar/);
    assert.match(idx, /syncText: syncTrayText/);
    assert.match(pre, /IPC\.syncProgressGet/);
    assert.match(st, /<SyncProgress /);
    assert.match(comp, /role="progressbar"/);
    assert.match(comp, /aria-valuemin=\{0\}/);
    assert.equal(/#[0-9a-fA-F]{3,8}\b/.test(comp), false, 'no hardcoded colours');
    assert.equal(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(comp + fs.readFileSync('src/renderer/lib/progressView.ts', 'utf8')), false, 'no emoji');
    assert.match(fs.readFileSync('src/renderer/styles/base.css', 'utf8'), /prefers-reduced-motion: reduce\) \{\s*\.lb-indeterminate/);
    ok('wiring: tracker behind the scheduler hook, push channel, getter, taskbar and tray text, card on Status, progressbar roles, reduced motion, no colours or emoji');
  }
  console.log('all passed');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
