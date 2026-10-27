// Node-level check for Phase 45: batched voucher pull in the sync cycle (equality with the single request, staging, kill and resume,
// kill before the final commit, paging ignored, size setting per run, a generated 50k company with memory numbers).
// Real mock Tally over HTTP + real SQLite vault. Run: NODE_PATH=<dir with typescript and better-sqlite3> node [--expose-gc] tests/sync-batching.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');

const out = path.join(__dirname, '.tmp-batching');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/db', 'src/main/tally', 'src/main/tally/masters', 'src/main/tally/vouchers', 'src/main/sync', 'src/shared']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } }).outputText;
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
const { createScheduler } = req('src/main/sync/scheduler.js');
const { createStage, readCheckpoint, resumeBlocker, companyKeyOf } = req('src/main/sync/stage.js');
const model = JSON.parse(fs.readFileSync('docs/shared/data_model.json', 'utf8'));

const FX = 'docs/shared/fixtures/tables';
const table = (t) => JSON.parse(fs.readFileSync(`${FX}/${t}.json`, 'utf8'));
const syncTables = model.tables_order.filter((t) => t !== 'ref_voucher_kind');
const key = (t, r) => JSON.stringify(model.tables[t].primary_key.map((k) => String(r[k])));
const dump = (v) => Object.fromEntries(syncTables.map((t) => [t, Object.fromEntries(v.readTable(t).map((r) => [key(t, r), r]))]));
const NAME = 'Demo Traders Pvt Ltd';
const listening = (srv) => new Promise((r) => (srv.listening ? r() : srv.on('listening', r)));
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const mb = (b) => Math.round(b / 1048576);

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-batch-'));
  initLogger({ dir: path.join(tmp, 'logs'), maxBytes: 1e7, keepFiles: 2 });
  const M = await import(pathToFileURL(path.resolve('tools/mock-tally/server.mjs')).href);
  const G = await import(pathToFileURL(path.resolve('tools/gen-big-company.mjs')).href);
  const noSleep = async () => {};

  async function startMock(opts) {
    const log = [];
    const srv = M.startMockTally(0, { ...opts, onRequest: (id, body) => { log.push({ id, body }); } });
    await listening(srv);
    return { srv, log, port: srv.address().port, close: () => new Promise((r) => srv.close(r)) };
  }

  /** A full connector stack against one mock, sharing `vault` and `runFile` so a second stack can resume the first. */
  function stack({ port, vault, runFile, cfg, hooks = {} }) {
    const client = C.createTallyClient({ getTarget: () => ({ host: '127.0.0.1', port }), backoffMs: 1, retries: 0, getCompanyName: () => NAME });
    const info = createCompanyInfo({ client, getCompanyName: () => NAME, getCompanyGuid: () => table('tm_company')[0].guid });
    const masters = createMasters({ client, getCompanyName: () => NAME, getCompanyGuid: () => info.last()?.guid ?? null, getAsOf: () => '2026-09-30' });
    const vouchers = createVouchers({ client, sleep: noSleep, pauseMs: 0, getCompanyName: () => NAME, getCompanyGuid: () => info.last()?.guid ?? null, getCompanyState: () => info.last()?.state_name ?? '', getMasters: () => masters.last()?.tables ?? null });
    const reconciler = createReconciler({ client, getCompanyName: () => NAME, getCompanyGuid: () => info.last()?.guid ?? null });
    const closing = createClosing({ client, getCompanyName: () => NAME, getAsOf: () => '2026-09-30' });
    const calls = { pull: [], results: [] };
    const sched = createScheduler({
      getVault: () => vault, getConfig: () => cfg, blocked: () => null, readCompany: () => info.read(),
      masters, closing, reconciler: { checkDeleted: async (i) => { if (hooks.beforeCheck) hooks.beforeCheck(); return reconciler.checkDeleted(i); } },
      vouchers: {
        pullBatched: async (o) => {
          calls.pull.push(o);
          const r = await vouchers.pullBatched({ ...o, onBatch: async (t, i) => { await o.onBatch(t, i); if (hooks.afterBatch) hooks.afterBatch(i); } });
          calls.results.push(r);
          return r;
        },
      },
      getRunFile: () => runFile, now: () => Date.UTC(2026, 9, 25, 10, 0, 0), setTimer: () => ({}), clearTimer: () => {},
    });
    return { client, info, masters, vouchers, sched, calls };
  }
  const newVault = (name) => openVault({ dir: path.join(tmp, name) });
  const reqCount = (log, id) => log.filter((l) => l.id === id).length;
  const equalsFixtures = (vault) => {
    const got = dump(vault);
    for (const t of syncTables) {
      const want = Object.fromEntries((t === 'tm_employee' ? [] : table(t)).map((r) => [key(t, r), r]));
      assert.deepEqual(Object.keys(got[t]).sort(), Object.keys(want).sort(), `${t} keys`);
      for (const k of Object.keys(want)) assert.deepEqual(got[t][k], want[k], `${t} row ${k}`);
    }
  };

  const fxMock = await startMock({});

  // 1. batched pull equals the single-request pull for sizes 1, 7 and 500
  {
    const s = stack({ port: fxMock.port, vault: newVault('v-eq'), runFile: null, cfg: { intervalMin: 5, lookbackDays: 7, paused: false } });
    await s.info.read();
    await s.masters.pull();
    const win = { from: '2026-04-01', to: '2027-03-31' };
    const plain = await s.vouchers.pull(win);
    const norm = (tables) => Object.fromEntries(Object.entries(tables).map(([t, rows]) => [t, rows.map((r) => JSON.stringify(r)).sort()]));
    assert.ok(plain.tables.tx_voucher.length > 5);
    for (const size of [1, 7, 500]) {
      const acc = {};
      let batches = 0;
      const r = await s.vouchers.pullBatched({ ...win, size, onBatch: (t) => { batches++; for (const [k, rows] of Object.entries(t)) (acc[k] ??= []).push(...rows); } });
      assert.deepEqual(norm(acc), norm(plain.tables), `size ${size}`);
      assert.equal(r.done, plain.tables.tx_voucher.length);
      assert.equal(r.total, plain.tables.tx_voucher.length, 'the count equals the pull');
      if (size === 1) assert.ok(batches >= plain.tables.tx_voucher.length);
    }
    ok('batched full pull of the fixture company equals the single-request pull for batch sizes 1, 7 and 500 (rows and total)');
  }

  // 2. scheduler: batched full sync equals the fixtures, stage and checkpoint are gone afterwards
  const runFile = path.join(tmp, 'sync-run.json');
  let freshRequests;
  {
    const vault = newVault('v-full');
    const cfg = { intervalMin: 5, lookbackDays: 7, paused: false, voucherBatchSize: 7 };
    const before = fxMock.log.length;
    const s = stack({ port: fxMock.port, vault, runFile, cfg });
    const o = await s.sched.syncNow();
    assert.equal(o.ok, true);
    equalsFixtures(vault);
    freshRequests = reqCount(fxMock.log.slice(before), 'LBVouchers');
    assert.equal(s.calls.pull[0].size, 7);
    assert.equal(createStage(vault.db).count(), 0);
    assert.equal(createStage(vault.db).runId(), null);
    assert.equal(fs.existsSync(runFile), false);
    assert.ok(freshRequests > 12, `many small requests (${freshRequests})`);
    ok(`scheduler full sync in batches of 7 equals the fixtures (${freshRequests} voucher requests); stage and sync-run.json cleaned after the commit`);

    // 3. a size change between runs applies to the next run only
    cfg.voucherBatchSize = 11;
    vault.db.prepare(`UPDATE "_lb_vault_meta" SET "value"='null' WHERE "key"='sched.memory'`).run();
    await s.sched.syncNow();
    assert.equal(s.calls.pull.at(-1).size, 11);
    equalsFixtures(vault);
    ok('the batch size setting is read at the start of each run (7, then 11)');
  }

  // 4. kill after batch k, then restart: resumes, the vault equals the fixtures, size stays that of the checkpoint
  {
    const vault = newVault('v-kill');
    const cfg = { intervalMin: 5, lookbackDays: 7, paused: false, voucherBatchSize: 7 };
    let k = 0;
    const first = stack({ port: fxMock.port, vault, runFile, cfg, hooks: { afterBatch: () => { if (++k === 3) throw new Error('simulated kill'); } } });
    const o1 = await first.sched.syncNow().catch((e) => ({ ok: false, thrown: e }));
    assert.equal(o1.ok, false);
    assert.equal(vault.readTable('tx_voucher').length, 0, 'the live vault is untouched');
    const cp = readCheckpoint(runFile);
    assert.ok(cp && cp.doneCount > 0 && cp.size === 7 && cp.windows.length === 12);
    assert.ok(createStage(vault.db).count() > 0, 'staged vouchers survive');
    assert.equal(JSON.stringify(cp).includes(table('tm_company')[0].guid), false, 'no company guid in the checkpoint');
    assert.equal(JSON.stringify(cp).includes(NAME), false, 'no company name in the checkpoint');
    cfg.voucherBatchSize = 500; // changed meanwhile: must not apply to the run being resumed
    const before = fxMock.log.length;
    const second = stack({ port: fxMock.port, vault, runFile, cfg });
    const o2 = await second.sched.syncNow();
    assert.equal(o2.ok, true);
    assert.equal(second.calls.pull[0].size, 7);
    assert.ok(second.calls.pull[0].resume, 'resumed');
    const resumed = reqCount(fxMock.log.slice(before), 'LBVouchers');
    assert.ok(resumed < freshRequests, `fewer requests than a fresh run (${resumed} < ${freshRequests})`);
    equalsFixtures(vault);
    assert.equal(fs.existsSync(runFile), false);
    ok(`kill after batch 3: restart resumed (${resumed} of ${freshRequests} requests), kept size 7 although the setting is now 500, vault equals the fixtures`);
  }

  // 5. kill before the final commit leaves the live vault untouched; the retry needs no voucher request at all
  {
    const vault = newVault('v-precommit');
    const cfg = { intervalMin: 5, lookbackDays: 7, paused: false, voucherBatchSize: 500 };
    const first = stack({ port: fxMock.port, vault, runFile, cfg, hooks: { beforeCheck: () => { throw new Error('simulated kill before commit'); } } });
    const o1 = await first.sched.syncNow().catch((e) => ({ ok: false }));
    assert.equal(o1.ok, false);
    for (const t of syncTables) assert.equal(vault.readTable(t).length, 0, `${t} untouched`);
    assert.equal(vault.db.prepare(`SELECT "value" FROM "_lb_vault_meta" WHERE "key"='sched.memory'`).get()?.value ?? 'null', 'null');
    const cp = readCheckpoint(runFile);
    assert.equal(cp.monthIndex, cp.windows.length, 'every window was read');
    const before = fxMock.log.length;
    const second = stack({ port: fxMock.port, vault, runFile, cfg });
    const o2 = await second.sched.syncNow();
    assert.equal(o2.ok, true);
    assert.equal(reqCount(fxMock.log.slice(before), 'LBVouchers'), 0, 'no voucher read again');
    equalsFixtures(vault);
    ok('kill before the final commit: live vault and memory untouched; the retry commits from the stage without reading vouchers again');
  }

  // 6. resume rules: stale, other company, Tally data changed, other stage
  {
    const base = { runId: 'r1', startedAt: new Date(Date.UTC(2026, 9, 25, 9, 0, 0)).toISOString(), plan: 'full', windowFrom: '2026-04-01', windowTo: '2027-03-31', windows: [['2026-04-01', '2026-04-30', false], ['2026-05-01', '2026-05-31', false]], monthIndex: 1, nextStart: 0, size: 50, total: null, doneCount: 0, cursorBefore: 0, companyKey: companyKeyOf('c1'), alterVoucher: 10 };
    const ctx = { plan: 'full', windowFrom: '2026-04-01', windowTo: '2027-03-31', cursorBefore: 0, companyKey: companyKeyOf('c1'), alterVoucher: 10, now: Date.UTC(2026, 9, 25, 10, 0, 0), stageRun: 'r1' };
    assert.equal(resumeBlocker(base, ctx), null);
    assert.equal(resumeBlocker(base, { ...ctx, now: ctx.now + 25 * 3600e3 }), 'stale');
    assert.equal(resumeBlocker(base, { ...ctx, companyKey: companyKeyOf('c2') }), 'company changed');
    assert.equal(resumeBlocker(base, { ...ctx, alterVoucher: 11 }), 'tally data changed');
    assert.equal(resumeBlocker(base, { ...ctx, cursorBefore: 5 }), 'cursor changed');
    assert.equal(resumeBlocker(base, { ...ctx, plan: 'incremental' }), 'plan changed');
    assert.equal(resumeBlocker(base, { ...ctx, stageRun: 'other' }), 'stage does not match');
    ok('a checkpoint is discarded when stale (24 h), other company, changed Tally data, other cursor, other plan or other stage');
  }

  // 7. a Tally that ignores the paging filter: the sync still finishes, month by month
  {
    const ign = await startMock({ ignorePaging: true });
    const vault = newVault('v-ignore');
    const s = stack({ port: ign.port, vault, runFile: path.join(tmp, 'ign-run.json'), cfg: { intervalMin: 5, lookbackDays: 7, paused: false, voucherBatchSize: 7 } });
    const o = await s.sched.syncNow();
    assert.equal(o.ok, true);
    assert.equal(s.calls.results[0].pagingIgnored, true);
    equalsFixtures(vault);
    await ign.close();
    ok('paging ignored by Tally: detected, the sync finishes month by month and the vault equals the fixtures');
  }

  // 8. a failed batch (Tally refuses) aborts the cycle with the live vault untouched
  {
    const bad = await startMock({});
    const vault = newVault('v-refuse');
    let seen = 0;
    const s = stack({ port: bad.port, vault, runFile: path.join(tmp, 'bad-run.json'), cfg: { intervalMin: 5, lookbackDays: 7, paused: false, voucherBatchSize: 7 }, hooks: { afterBatch: () => { if (++seen === 2) { bad.srv.close(); bad.srv.closeAllConnections?.(); } } } });
    const o = await s.sched.syncNow();
    assert.equal(o.ok, false);
    assert.equal(vault.readTable('tx_voucher').length, 0);
    assert.ok(o.error && o.error.message);
    ok('a batch that fails (Tally gone) aborts the cycle cleanly: nothing applied, error reported for the scheduler backoff');
  }
  await fxMock.close();

  // 9. generated company: 50k vouchers, bounded memory
  {
    const size = Number(process.env.LB_BIG || 50000);
    const big = G.bigCompany(size);
    const mock = await startMock({ vouchers: big.vouchers });
    const vault = newVault('v-big');
    const cfg = { intervalMin: 5, lookbackDays: 7, paused: false, voucherBatchSize: Number(process.env.LB_BATCH || 1000) };
    const s = stack({ port: mock.port, vault, runFile: path.join(tmp, 'big-run.json'), cfg, hooks: {} });
    await s.info.read();
    await s.masters.pull();
    const gc = () => { if (global.gc) global.gc(); };
    gc();
    const base = process.memoryUsage().heapUsed;
    // whole-company figure: everything of the plain pull held at once
    const skipWhole = process.env.LB_SKIP_WHOLE === '1'; // Phase 48: the measuring runs skip the whole-company pull so peak RSS reflects the batched run only
    let whole = 0;
    if (!skipWhole) {
      const plain = await s.vouchers.pull({ from: '2026-04-01', to: '2027-03-31' });
      whole = process.memoryUsage().heapUsed - base;
      assert.equal(plain.tables.tx_voucher.length, size);
      plain.tables = null;
    }
    gc();
    const base2 = process.memoryUsage().heapUsed;
    let peak = 0; // sampled after a collection: the live heap the run really holds
    const s2 = stack({ port: mock.port, vault, runFile: path.join(tmp, 'big-run.json'), cfg, hooks: { afterBatch: () => { gc(); peak = Math.max(peak, process.memoryUsage().heapUsed - base2); } } });
    let peakRss = 0; // Phase 48: process RSS sampled every 50 ms (includes the in-process mock Tally and the generated XML it serves)
    const rssTimer = setInterval(() => { peakRss = Math.max(peakRss, process.memoryUsage().rss); }, 50);
    const t0 = Date.now();
    const o = await s2.sched.syncNow();
    clearInterval(rssTimer);
    assert.equal(o.ok, true, JSON.stringify(o.error));
    const rows = vault.readTable('tx_voucher').length;
    assert.equal(rows, size);
    assert.equal(createStage(vault.db).count(), 0);
    console.log(`   RESULT size=${size} batch=${cfg.voucherBatchSize} ms=${Date.now() - t0} peakHeapOverBaseMB=${mb(peak)} peakRssMB=${mb(peakRss)}`);
    console.log(`   50k run: ${Date.now() - t0} ms, vouchers ${rows}, ledger lines ${vault.readTable('tx_ledger_line').length}; heap: whole-company pull ${mb(whole)} MB, batched peak during pull ${mb(peak)} MB (gc ${global.gc ? 'on' : 'off'})`);
    if (!skipWhole) assert.ok(peak < whole, `batched peak (${mb(peak)} MB) below the whole-company figure (${mb(whole)} MB)`);
    await mock.close();
    ok(`generated company of ${size} vouchers completes; peak heap during the pull ${mb(peak)} MB vs ${mb(whole)} MB held at once`);
  }
  console.log('all passed');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
