// Node-level check for Phase 44: paging primitives against the mock Tally (real HTTP) and fakes.
// Run: NODE_PATH=<dir with typescript> node tests/tally-paging.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');

const out = path.join(__dirname, '.tmp-paging');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/tally', 'src/main/tally/masters', 'src/main/tally/vouchers', 'src/shared']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
const { initLogger } = require(path.join(out, 'src/main/logger.js'));
const C = require(path.join(out, 'src/main/tally/client.js'));
const X = require(path.join(out, 'src/main/tally/xml.js'));
const P = require(path.join(out, 'src/main/tally/vouchers/paging.js'));
const gold = require('./fixtures/xml/golden_requests.json');
const buildGolden = require('./golden-requests.cjs');

let passed = 0;
const check = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };
const mkClient = (port) => C.createTallyClient({ getTarget: () => ({ host: '127.0.0.1', port }), backoffMs: 1, retries: 0 });
const listening = (srv) => new Promise((r) => (srv.listening ? r() : srv.on('listening', r)));
const guids = (rows) => rows.map((r) => String(r.GUID?.text ?? r.GUID ?? ''));

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-pg-'));
  initLogger({ dir: path.join(tmp, 'logs') });
  const M = await import(pathToFileURL(path.resolve('tools/mock-tally/server.mjs')).href);
  const noSleep = async () => {};
  async function mock(opts) {
    const log = [];
    const server = M.startMockTally(0, { ...opts, onRequest: (id, body) => { log.push({ id, body }); return opts?.onRequest?.(id, body); } });
    await listening(server);
    return { server, log, port: server.address().port, close: () => new Promise((r) => server.close(r)) };
  }
  const N = 53;
  const all = M.generateVouchers(N, { startDate: '20260401', days: 60 }); // dates 2026-04-01 .. 2026-05-30
  const expectedGuids = (pred = () => true) => all.filter(pred).map((b) => /<GUID>([^<]*)/.exec(b)[1]);
  const W = ['2026-04-01', '2027-03-31'];
  const readAll = async (m, size, extra = {}) => {
    const pg = P.createPaging({ client: mkClient(m.port), sleep: noSleep });
    return { pg, res: await pg.readWindow({ company: 'Demo', from: W[0], to: W[1], alterAbove: null, size, ...extra }) };
  };

  await check('golden: every existing request is byte-identical (masters, vouchers with and without filter and window, guid list, company, function)', async () => {
    const now = buildGolden(path.join(out, 'golden'));
    assert.deepEqual(Object.keys(now).sort(), Object.keys(gold).sort());
    for (const k of Object.keys(gold)) assert.equal(now[k], gold[k], k);
  });

  await check('xml: compute variables, compute lines and ordered filters are emitted in order, validated and escaped', async () => {
    const x = X.buildCollectionRequest({
      name: 'LBX', type: 'Voucher', fields: ['GUID'], filters: [{ name: 'F1', formula: '$A > 1' }, { name: 'F2', formula: '$B > 2' }],
      computeVars: [{ name: 'V1', formula: 'Number : ##V1 + 1' }], computeLines: [{ name: 'L1', formula: '##V1 * 2' }],
    });
    assert.match(x, /<NATIVEMETHOD>GUID<\/NATIVEMETHOD><COMPUTEVAR>V1 : Number : ##V1 \+ 1<\/COMPUTEVAR><COMPUTE>L1 : ##V1 \* 2<\/COMPUTE><FILTERS>F1,F2<\/FILTERS>/);
    assert.ok(x.indexOf('NAME="F1"') < x.indexOf('NAME="F2"'));
    assert.match(x, /\$A &gt; 1/);
    X.parseXml(x);
    assert.throws(() => X.buildCollectionRequest({ name: 'LBX', type: 'Voucher', fields: [], computeVars: [{ name: 'bad name', formula: '1' }] }));
    assert.equal(X.buildCollectionRequest({ name: 'LBX', type: 'Voucher', fields: ['GUID'], computeVars: [], computeLines: [] }), X.buildCollectionRequest({ name: 'LBX', type: 'Voucher', fields: ['GUID'] }));
  });

  await check('pagingParts: formula bounds, validation', async () => {
    const p = P.pagingParts(500, 250);
    assert.equal(p.pageFilter.formula, '##LBPageNo > 500 AND ##LBPageNo <= 750');
    assert.equal(p.pageFilter.name, 'LBPageKeep');
    for (const [s, z] of [[-1, 5], [1.5, 5], [0, 0], [0, 2.5]]) assert.throws(() => P.pagingParts(s, z));
  });

  await check('pages of 1, 7, 500 and larger than the total return every voucher exactly once and in order', async () => {
    for (const size of [1, 7, 500, 5000]) {
      const m = await mock({ vouchers: all });
      const { res, pg } = await readAll(m, size);
      const g = guids(res.rows);
      assert.deepEqual(g, expectedGuids(), `size ${size}`);
      assert.equal(res.count, N);
      assert.equal(res.pages, Math.floor(N / size) + 1, `pages for size ${size}`); // full pages plus the short (or empty) last one
      assert.equal(res.pagingIgnored, false); assert.equal(pg.state().pagingIgnored, false);
      assert.equal(res.nextStart, N);
      await m.close();
    }
  });

  await check('exact multiple: the empty page after the last full one ends the loop', async () => {
    const m = await mock({ vouchers: all.slice(0, 50) });
    const { res } = await readAll(m, 10);
    assert.equal(res.count, 50); assert.equal(res.pages, 6); // 5 full pages and one empty
    assert.equal(m.log.filter((r) => r.id === 'LBVouchers').length, 6);
    await m.close();
  });

  await check('empty window: one request, no rows', async () => {
    const m = await mock({ vouchers: all });
    const pg = P.createPaging({ client: mkClient(m.port), sleep: noSleep });
    const r = await pg.readWindow({ company: 'Demo', from: '2026-08-01', to: '2026-08-31', alterAbove: null, size: 10 });
    assert.equal(r.count, 0); assert.equal(r.pages, 1);
    await m.close();
  });

  await check('date window: only vouchers inside the window, paged', async () => {
    const m = await mock({ vouchers: all });
    const pg = P.createPaging({ client: mkClient(m.port), sleep: noSleep });
    const r = await pg.readWindow({ company: 'Demo', from: '2026-04-10', to: '2026-04-30', alterAbove: null, size: 4 });
    const want = expectedGuids((b) => { const d = /<DATE>(\d+)/.exec(b)[1]; return d >= '20260410' && d <= '20260430'; });
    assert.ok(want.length > 8);
    assert.deepEqual(guids(r.rows), want);
    await m.close();
  });

  await check('AlterID filter comes before the paging filter and the counter counts only passed vouchers', async () => {
    const m = await mock({ vouchers: all });
    const pg = P.createPaging({ client: mkClient(m.port), sleep: noSleep });
    const r = await pg.readWindow({ company: 'Demo', from: W[0], to: W[1], alterAbove: 30, size: 5 }); // alter ids are 1..53, so 31..53 pass
    assert.deepEqual(guids(r.rows), expectedGuids((b) => Number(/<ALTERID>(\d+)/.exec(b)[1]) > 30));
    assert.equal(r.count, 23);
    const body = m.log.find((x) => x.id === 'LBVouchers').body;
    assert.match(body, /<FILTERS>LBChanged,LBPageKeep<\/FILTERS>/);
    assert.match(body, /<COMPUTEVAR>LBPageNo : Number : ##LBPageNo \+ 1<\/COMPUTEVAR>/);
    await m.close();
  });

  await check('the fixture company pages too (no custom list): 52 vouchers in pages of 20', async () => {
    const m = await mock({});
    const pg = P.createPaging({ client: mkClient(m.port), sleep: noSleep });
    const r = await pg.readWindow({ company: 'Demo', from: '2026-04-01', to: '2027-03-31', alterAbove: null, size: 20 });
    const fx = fs.readFileSync('docs/shared/fixtures/tally_xml/vouchers.xml', 'utf8').match(/<GUID>[^<]*/g).length;
    assert.equal(r.count, fx); assert.equal(r.pages, 3);
    assert.equal(new Set(guids(r.rows)).size, fx);
    await m.close();
  });

  await check('onPage: rows are handed over page by page and not kept; resume with startAt', async () => {
    const m = await mock({ vouchers: all });
    const seen = [];
    const pg = P.createPaging({ client: mkClient(m.port), sleep: noSleep });
    const r = await pg.readWindow({ company: 'Demo', from: W[0], to: W[1], alterAbove: null, size: 20, onPage: (rows, info) => { seen.push([info.start, rows.length]); } });
    assert.deepEqual(seen, [[0, 20], [20, 20], [40, 13]]);
    assert.equal(r.rows.length, 0); assert.equal(r.count, N);
    const pg2 = P.createPaging({ client: mkClient(m.port), sleep: noSleep });
    const r2 = await pg2.readWindow({ company: 'Demo', from: W[0], to: W[1], alterAbove: null, size: 20, startAt: 40 });
    assert.deepEqual(guids(r2.rows), expectedGuids().slice(40));
    await m.close();
  });

  await check('paging ignored: detected, reported, the whole window is returned once, later windows read plainly', async () => {
    const m = await mock({ vouchers: all, ignorePaging: true });
    const pg = P.createPaging({ client: mkClient(m.port), sleep: noSleep });
    const r = await pg.readWindow({ company: 'Demo', from: W[0], to: W[1], alterAbove: null, size: 10 });
    assert.equal(r.pagingIgnored, true);
    assert.deepEqual(guids(r.rows), expectedGuids()); // all 53 once, not 53 per page
    assert.equal(pg.state().pagingIgnored, true);
    const n = m.log.length;
    const r2 = await pg.readWindow({ company: 'Demo', from: '2026-04-01', to: '2026-04-30', alterAbove: null, size: 10 });
    assert.equal(m.log.length, n + 1); // one plain request
    assert.doesNotMatch(m.log[n].body, /LBPageKeep|COMPUTEVAR/);
    assert.ok(r2.count > 0 && r2.pagingIgnored);
    await m.close();
  });

  await check('paging ignored: the same first voucher on two pages is detected (no double delivery)', async () => {
    // fake Tally: always the same 5 vouchers, whatever the page, size 5 so no page looks oversize
    const five = all.slice(0, 5);
    const m = await mock({ vouchers: five, ignorePaging: true });
    const pg = P.createPaging({ client: mkClient(m.port), sleep: noSleep });
    const r = await pg.readWindow({ company: 'Demo', from: W[0], to: W[1], alterAbove: null, size: 5 });
    assert.equal(r.pagingIgnored, true);
    assert.deepEqual(guids(r.rows), expectedGuids().slice(0, 5)); // delivered once
    assert.equal(r.pages, 1); // first page delivered; the repeat is dropped
    assert.equal(r.count, 5);
    await m.close();
  });

  // fake client for timeouts: client.collection(name, fields, opts)
  const timeoutErr = () => new C.TallyError('LB_TALLY_UNREACHABLE', 'TALLY_TIMEOUT', 'timeout', true, 'LBVouchers');
  const fakeClient = (script) => {
    const calls = [];
    return { calls, collection: async (name, fields, opts) => { calls.push({ name, opts }); return script(calls.length, name, opts); } };
  };
  const rowsOf = (from, to) => Array.from({ length: to - from }, (_, i) => ({ GUID: `g${from + i}`, DATE: '20260402' }));

  await check('timeout: waits, halves the size (floor 25), reads the same page again; the size sticks for the run', async () => {
    const sleeps = [];
    const sizes = [];
    const c = fakeClient((n, name, opts) => {
      const f = /> (\d+) AND ##LBPageNo <= (\d+)/.exec(opts.filters.at(-1).formula);
      const s = Number(f[1]); const e = Number(f[2]);
      sizes.push([s, e - s]);
      if (e - s === 400) throw timeoutErr();
      return rowsOf(s, Math.min(e, 450));
    });
    const pg = P.createPaging({ client: c, sleep: async (ms) => { sleeps.push(ms); }, pauseMs: 7, timeoutPauseMs: 15000 });
    const r = await pg.readWindow({ company: 'Demo', from: W[0], to: W[1], alterAbove: null, size: 400 });
    assert.deepEqual(sizes.slice(0, 3), [[0, 400], [0, 200], [200, 200]]);
    assert.equal(r.count, 450); assert.equal(r.effectiveSize, 200); assert.equal(pg.state().effectiveSize, 200);
    assert.equal(sleeps[0], 15000); assert.ok(sleeps.slice(1).every((x) => x === 7));
    // a following window of the same run starts at the reduced size
    const first = c.calls.length;
    await pg.readWindow({ company: 'Demo', from: W[0], to: W[1], alterAbove: null, size: 400 });
    assert.match(c.calls[first].opts.filters.at(-1).formula, /<= 200$/);
    assert.equal(c.calls[0].opts.retries, 0);
  });

  await check('timeout: the size never goes below the floor; two timeouts in a row at the floor abort', async () => {
    const sleeps = [];
    const sizes = [];
    const c = fakeClient((n, name, opts) => { const m = /<= (\d+)/.exec(opts.filters.at(-1).formula); sizes.push(Number(m[1])); throw timeoutErr(); });
    const pg = P.createPaging({ client: c, sleep: async (ms) => { sleeps.push(ms); }, timeoutPauseMs: 15000 });
    await assert.rejects(pg.readWindow({ company: 'Demo', from: W[0], to: W[1], alterAbove: null, size: 100 }), (e) => e.detail === 'TALLY_TIMEOUT');
    assert.deepEqual(sizes, [100, 50, 25, 25]);
    assert.ok(sleeps.every((x) => x === 15000));
    assert.ok(Math.min(...sizes) === 25);
  });

  await check('a non-timeout failure is neither halved nor repeated', async () => {
    const c = fakeClient(() => { throw new C.TallyError('LB_TALLY_UNREACHABLE', 'TALLY_UNREACHABLE', 'refused', true, 'LBVouchers'); });
    const pg = P.createPaging({ client: c, sleep: noSleep });
    await assert.rejects(pg.readWindow({ company: 'Demo', from: W[0], to: W[1], alterAbove: null, size: 100 }), (e) => e.detail === 'TALLY_UNREACHABLE');
    assert.equal(c.calls.length, 1);
  });

  await check('the date window is still enforced on pages, and the last-page decision uses the raw count', async () => {
    const c = fakeClient((n, name, opts) => {
      const s = Number(/> (\d+) AND/.exec(opts.filters.at(-1).formula)[1]);
      if (s === 0) return [{ GUID: 'a', DATE: '20260402' }, { GUID: 'b', DATE: '20250101' }]; // one leaked row from another period
      return [];
    });
    const pg = P.createPaging({ client: c, sleep: noSleep });
    const r = await pg.readWindow({ company: 'Demo', from: '2026-04-01', to: '2026-04-30', alterAbove: null, size: 2 });
    assert.deepEqual(guids(r.rows), ['a']);
    assert.equal(r.pages, 2); // the full raw page was not mistaken for the last one
  });

  await check('countWindow: guid count (deduplicated), AlterID narrowing, and month by month when the whole window times out', async () => {
    const m = await mock({ vouchers: all });
    const pg = P.createPaging({ client: mkClient(m.port), sleep: noSleep });
    assert.equal(await pg.countWindow('Demo', W[0], W[1]), N);
    assert.equal(await pg.countWindow('Demo', W[0], W[1], 30), 23);
    assert.equal(await pg.countWindow('Demo', '2026-05-01', '2026-05-31'), expectedGuids((b) => /<DATE>202605/.test(b)).length);
    const body = m.log.at(0).body;
    assert.match(body, /<ID>LBVoucherGuids<\/ID>/); assert.doesNotMatch(body, /LBPageKeep/);
    await m.close();
    const calls = [];
    const c = fakeClient((n, name, opts) => {
      calls.push([opts.fromDate, opts.toDate]);
      if (opts.fromDate === '20260401' && opts.toDate === '20260630') throw timeoutErr();
      return [{ GUID: `${opts.fromDate}-1`, ALTERID: '5' }, { GUID: `${opts.fromDate}-2`, ALTERID: '6' }, { GUID: `${opts.fromDate}-1`, ALTERID: '5' }];
    });
    const p2 = P.createPaging({ client: c, sleep: noSleep });
    assert.equal(await p2.countWindow('Demo', '2026-04-01', '2026-06-30'), 6);
    assert.deepEqual(calls, [['20260401', '20260630'], ['20260401', '20260430'], ['20260501', '20260531'], ['20260601', '20260630']]);
    // a single-month window that times out is an error, not a retry
    const c3 = fakeClient(() => { throw timeoutErr(); });
    await assert.rejects(P.createPaging({ client: c3, sleep: noSleep }).countWindow('Demo', '2026-04-01', '2026-04-30'), (e) => e.detail === 'TALLY_TIMEOUT');
  });

  await check('bad input: invalid windows and sizes are refused before any request', async () => {
    const c = fakeClient(() => []);
    const pg = P.createPaging({ client: c, sleep: noSleep });
    await assert.rejects(pg.readPage('Demo', '2026-05-01', '2026-04-01', 0, 10, null));
    await assert.rejects(pg.readWindow({ company: 'Demo', from: W[0], to: W[1], alterAbove: null, size: 0 }));
    await assert.rejects(pg.countWindow('Demo', 'x', W[1]));
    assert.equal(c.calls.length, 0);
  });

  console.log(`tally-paging: ${passed} checks passed`);
  fs.rmSync(out, { recursive: true, force: true });
})().catch((e) => { console.error(e); process.exit(1); });
