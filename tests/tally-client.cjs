// Node-level check for Phase 8: XML builders/parser, serialised queue, timeouts and retries, error mapping, fixture round trip.
// Run: NODE_PATH=<dir containing typescript> node tests/tally-client.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-client');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/tally', 'src/shared']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
const { initLogger } = require(path.join(out, 'src/main/logger.js'));
const X = require(path.join(out, 'src/main/tally/xml.js'));
const C = require(path.join(out, 'src/main/tally/client.js'));
const D = require(path.join(out, 'src/main/tally/detect.js'));

const FIX = path.join('docs', 'shared', 'fixtures', 'tally_xml');
function fake(handler) {
  return new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const c = [];
      req.on('data', (d) => c.push(d));
      req.on('end', () => handler(Buffer.concat(c).toString('utf8'), res, req));
    });
    s.listen(0, '127.0.0.1', () => resolve({ server: s, port: s.address().port }));
  });
}
const mk = (port, extra = {}) =>
  C.createTallyClient({ getTarget: () => ({ host: '127.0.0.1', port }), getCompanyName: () => 'Demo Traders Pvt Ltd', backoffMs: 5, ...extra });
const rejects = async (p, detail) => {
  try { await p; } catch (e) { assert.ok(e instanceof C.TallyError, String(e)); if (detail) assert.equal(e.detail, detail); return e; }
  assert.fail('expected rejection');
};

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-cli-'));
  initLogger({ dir: path.join(tmp, 'logs') });

  // ---- 1. builders
  const req = X.buildCollectionRequest({
    name: 'LBLedgers', type: 'Ledger', fields: ['GUID', 'AlterID', 'Parent'], fetch: ['LedMailingDetails.*'],
    filters: [{ name: 'LBChanged', formula: '$AlterID > 1200 & "x"' }], company: 'A & B <Traders>', fromDate: '20260401', toDate: '20270331',
  });
  assert.match(req, /<TALLYREQUEST>Export<\/TALLYREQUEST><TYPE>Collection<\/TYPE><ID>LBLedgers<\/ID>/);
  assert.match(req, /<SVCURRENTCOMPANY>A &amp; B &lt;Traders&gt;<\/SVCURRENTCOMPANY>/);
  assert.match(req, /<SVFROMDATE>20260401<\/SVFROMDATE><SVTODATE>20270331<\/SVTODATE>/);
  assert.match(req, /<COLLECTION NAME="LBLedgers" ISMODIFY="No"><TYPE>Ledger<\/TYPE><NATIVEMETHOD>GUID<\/NATIVEMETHOD>/);
  assert.match(req, /<FETCH>LedMailingDetails\.\*<\/FETCH><FILTERS>LBChanged<\/FILTERS><\/COLLECTION>/);
  assert.match(req, /<SYSTEM TYPE="Formulae" NAME="LBChanged">\$AlterID &gt; 1200 &amp; &quot;x&quot;<\/SYSTEM>/);
  X.parseXml(req); // our own request is well-formed
  assert.throws(() => X.buildCollectionRequest({ name: 'Bad Name', type: 'Ledger', fields: [] }));
  assert.throws(() => X.buildCollectionRequest({ name: 'N', type: 'Ledger', fields: ['A</NATIVEMETHOD><x>'] }));
  assert.throws(() => X.buildFunctionRequest('$$X<y>'));
  assert.match(X.buildFunctionRequest('$$ProdInfo'), /<TYPE>Function<\/TYPE><ID>\$\$ProdInfo<\/ID>/);
  assert.equal(X.escapeXml('a\u0004b&'), 'ab&amp;');

  // ---- 2. parser edge cases
  const n = X.parseXml('<?xml version="1.0"?><!DOCTYPE x><!-- c --><A k="a&gt;b" j=\'1\'><B x="1>2"/><C><![CDATA[<raw & text>]]></C><D>&#65;&amp;&#x42;</D><E/> </A>');
  assert.equal(n.attrs.k, 'a>b');
  assert.equal(n.attrs.j, '1');
  assert.equal(n.children[0].attrs.x, '1>2');
  assert.equal(n.children[1].text, '<raw & text>');
  assert.equal(n.children[2].text, 'A&B');
  assert.throws(() => X.parseXml('<A><B></A>'), X.XmlError);
  assert.throws(() => X.parseXml('<A><B>'), X.XmlError);
  assert.throws(() => X.parseXml('plain text'), X.XmlError);
  const utf16 = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from('<A>héllo&#4;</A>', 'utf16le')]);
  assert.deepEqual(X.decodeResponse(utf16), { text: '<A>héllo</A>', stripped: 4 });
  const be = Buffer.from([0xfe, 0xff, ...Buffer.from('<A>x</A>', 'utf16le').swap16()]);
  assert.equal(X.decodeResponse(be).text, '<A>x</A>');
  assert.equal(X.stripIllegalXml('a&#9;b&#10;c&#13;d&#x1F;e&#xB;f'), 'a&#9;b&#10;c&#13;de' + 'f');

  // ---- 3. fixture round trip through the mock Tally (real HTTP, real client)
  const mock = await import('../tools/mock-tally/server.mjs');
  const srv = mock.startMockTally(0);
  await new Promise((r) => srv.once('listening', r));
  const mport = srv.address().port;
  const cl = mk(mport);
  const objName = { LBLedgers: 'LEDGER', LBGroups: 'GROUP', LBVouchers: 'VOUCHER', LBStockItems: 'STOCKITEM', LBCompany: 'COMPANY', LBUnits: 'UNIT' };
  const files = { LBLedgers: 'ledgers.xml', LBGroups: 'groups.xml', LBVouchers: 'vouchers.xml', LBStockItems: 'stock_items.xml', LBCompany: 'company.xml', LBUnits: 'units.xml' };
  for (const [id, file] of Object.entries(files)) {
    const rows = await cl.collection(id, ['GUID'], { type: 'X' });
    const direct = fs.readFileSync(path.join(FIX, file), 'utf8').match(new RegExp(`<${objName[id]}[\\s>]`, 'g'))?.length ?? 0;
    assert.ok(direct > 0, `${id}: fixture has objects`);
    assert.equal(rows.length, direct, `${id}: row count equals object count`);
  }
  const ledgers = await cl.collection('LBLedgers', ['GUID'], { type: 'Ledger' });
  const alpha = ledgers.find((r) => r['@NAME'] === 'Alpha Retail');
  assert.equal(alpha.PARENT, 'Key Customers');
  assert.equal(alpha.BILLCREDITPERIOD, '30 Days');
  assert.equal(alpha.CLOSINGBALANCE, '-20980.00');
  const vouchers = await cl.collection('LBVouchers', ['GUID'], { type: 'Voucher' });
  const nested = vouchers.find((v) => Object.values(v).some((x) => Array.isArray(x) && typeof x[0] === 'object'));
  assert.ok(nested, 'vouchers carry nested list rows');
  const listKey = Object.keys(nested).find((k) => Array.isArray(nested[k]) && typeof nested[k][0] === 'object');
  assert.ok(listKey.endsWith('.LIST'), `nested key ${listKey}`);
  // streaming gives the same rows one by one
  const gen = await cl.collectionStream('LBLedgers', ['GUID'], { type: 'Ledger' });
  assert.equal(gen.next().value['@NAME'], ledgers[0]['@NAME']);
  assert.equal(Array.from(gen).length, ledgers.length - 1);
  // ping + function + unknown request mapping
  const info = await cl.ping();
  assert.match(info.version, /^TallyPrime/);
  assert.equal(info.companies[0].name, 'Demo Traders Pvt Ltd');
  assert.match(await cl.fn('$$ProdInfo'), /^TallyPrime/);
  await rejects(cl.exportData(X.buildEnvelope('Collection', 'LBNope', {})), 'TALLY_REJECTED');
  // canned import success
  const imp = await cl.importData('<ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER><BODY/></ENVELOPE>');
  assert.equal(imp.ok, true);
  assert.equal(imp.created, 1);
  assert.equal(imp.lastVchId, '1');
  srv.close();

  // ---- 4. import result interpretation
  const ir = (inner, status = 1) => `<ENVELOPE><HEADER><VERSION>1</VERSION><STATUS>${status}</STATUS></HEADER><BODY><DATA><IMPORTRESULT>${inner}</IMPORTRESULT></DATA></BODY></ENVELOPE>`;
  let r = X.parseImportResult(ir('<CREATED>0</CREATED><ALTERED>1</ALTERED><ERRORS>0</ERRORS><LASTMID>7</LASTMID>'));
  assert.deepEqual([r.ok, r.ambiguous, r.altered, r.lastMId], [true, false, 1, '7']);
  r = X.parseImportResult(ir('<CREATED>0</CREATED><ERRORS>1</ERRORS><LINEERROR>Voucher date is missing</LINEERROR>'));
  assert.deepEqual([r.ok, r.ambiguous, r.lineErrors], [false, false, ['Voucher date is missing']]);
  r = X.parseImportResult(ir('<CREATED>0</CREATED><ALTERED>0</ALTERED><IGNORED>1</IGNORED><ERRORS>0</ERRORS>'));
  assert.deepEqual([r.ok, r.ambiguous], [false, true]);
  r = X.parseImportResult(ir('<CREATED>0</CREATED><ERRORS>2</ERRORS>'));
  assert.deepEqual([r.ok, r.ambiguous], [false, false]);
  r = X.parseImportResult('<ENVELOPE><HEADER><STATUS>0</STATUS></HEADER><BODY><STATUS.LIST><CODE>1</CODE><DESC>Bad request</DESC></STATUS.LIST></BODY></ENVELOPE>');
  assert.deepEqual([r.ok, r.ambiguous, r.statusDesc], [false, false, 'Bad request']);
  r = X.parseImportResult('<RESPONSE><CREATED>1</CREATED><ALTERED>0</ALTERED><ERRORS>0</ERRORS><LASTMID>12</LASTMID></RESPONSE>');
  assert.deepEqual([r.ok, r.lastMId], [true, '12']);

  // ---- 5. error mapping
  let s = await fake((_b, res) => res.end('<RESPONSE><LINEERROR>Could not set \'SVCurrentCompany\' to \'X\'</LINEERROR></RESPONSE>'));
  let e = await rejects(mk(s.port).exportData('<ENVELOPE><HEADER><ID>R1</ID></HEADER></ENVELOPE>'), 'TALLY_COMPANY_NOT_LOADED');
  assert.equal(e.retryable, true);
  assert.equal(e.code, 'LB_TALLY_REJECTED');
  assert.equal(e.requestId, 'R1');
  s.server.close();
  s = await fake((_b, res) => res.end('<RESPONSE><LINEERROR>Voucher type invalid</LINEERROR></RESPONSE>'));
  e = await rejects(mk(s.port).exportData('<ENVELOPE/>'), 'TALLY_REJECTED');
  assert.equal(e.retryable, false);
  assert.match(e.message, /Voucher type invalid/);
  s.server.close();
  s = await fake((_b, res) => res.end('<RESPONSE>Unknown Request, cannot be processed</RESPONSE>'));
  await rejects(mk(s.port).exportData('<ENVELOPE/>'), 'TALLY_REJECTED');
  s.server.close();

  // ---- 6. malformed and illegal characters
  s = await fake((_b, res) => res.end('<ENVELOPE><BODY><DATA><COLLECTION><LEDGER NAME="Ok"><PARENT>P&#4;x</PARENT></LEDGER><LEDGER NAME="Broken"><PARENT>P</LEDGER></COLLECTION></DATA></BODY></ENVELOPE>'));
  const bad = await mk(s.port).collectionStream('LBLedgers', ['GUID'], { type: 'Ledger' });
  const first = bad.next().value;
  assert.equal(first.PARENT, 'Px', 'illegal reference stripped before parsing');
  assert.throws(() => bad.next(), (er) => er instanceof C.TallyError && er.detail === 'TALLY_MALFORMED' && er.retryable);
  s.server.close();

  // ---- 7. response size cap
  s = await fake((_b, res) => res.end('x'.repeat(5000)));
  await rejects(mk(s.port, { maxResponseBytes: 1000 }).exportData('<ENVELOPE/>'), 'TALLY_RESPONSE_TOO_LARGE');
  s.server.close();

  // ---- 8. retries: refused connection (injected post), backoff doubles, imports follow the stricter rule
  const delays = [];
  let calls = 0;
  const flaky = (failKind, failTimes) => async () => {
    calls += 1;
    if (calls <= failTimes) throw new D.TallyTransportError(failKind, failKind);
    return Buffer.from('<ENVELOPE><BODY><DATA><COLLECTION/></DATA></BODY></ENVELOPE>');
  };
  const sleeper = async (ms) => { delays.push(ms); };
  let c2 = mk(1, { post: flaky('refused', 2), sleep: sleeper, backoffMs: 10 });
  await c2.exportData('<ENVELOPE/>');
  assert.equal(calls, 3);
  assert.deepEqual(delays, [10, 20]);
  calls = 0; delays.length = 0;
  c2 = mk(1, { post: flaky('refused', 99), sleep: sleeper, backoffMs: 10, retries: 2 });
  e = await rejects(c2.exportData('<ENVELOPE/>'), 'TALLY_UNREACHABLE');
  assert.equal(calls, 3);
  assert.equal(e.code, 'LB_TALLY_UNREACHABLE');
  assert.equal(e.retryable, true);
  calls = 0;
  c2 = mk(1, { post: flaky('timeout', 99), sleep: sleeper });
  await rejects(c2.exportData('<ENVELOPE/>'), 'TALLY_TIMEOUT');
  assert.equal(calls, 3, 'exports retry after a timeout');
  calls = 0;
  await rejects(c2.exportData('<ENVELOPE/>', { retries: 0 }), 'TALLY_TIMEOUT');
  assert.equal(calls, 1, 'a per-call retries: 0 sends a heavy export exactly once');
  const impXml = '<ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER></ENVELOPE>';
  for (const kind of ['timeout', 'reset', 'other']) {
    calls = 0;
    c2 = mk(1, { post: flaky(kind, 99), sleep: sleeper });
    await rejects(c2.importData(impXml));
    assert.equal(calls, 1, `import not repeated after ${kind}`);
  }
  calls = 0;
  c2 = mk(1, { post: flaky('refused', 1), sleep: sleeper });
  r = await c2.importData(impXml);
  assert.equal(calls, 2, 'import repeated when the connection was refused');
  assert.equal(r.ambiguous, true, 'empty answer to an import is ambiguous, never ok');
  assert.equal(r.ok, false);

  // ---- 9. real timeout, then recovery on the same client (first request hangs, later ones answer)
  let hang = 1;
  s = await fake((_b, res) => { if (hang-- > 0) return; res.end('<ENVELOPE><BODY><DATA><COLLECTION><A NAME="1"/></COLLECTION></DATA></BODY></ENVELOPE>'); });
  const rc = mk(s.port, { timeoutMs: 150, retries: 2, backoffMs: 5 });
  assert.equal((await rc.collection('LBA', ['X'], { type: 'A' })).length, 1, 'retry after a real timeout succeeds');
  assert.equal((await rc.collection('LBA', ['X'], { type: 'A' })).length, 1, 'client keeps working afterwards');
  s.server.closeAllConnections?.();
  s.server.close();
  const dead = await fake(() => {});
  const deadPort = dead.port;
  dead.server.close();
  await new Promise((r2) => setTimeout(r2, 30));
  await rejects(mk(deadPort, { retries: 1 }).exportData('<ENVELOPE/>'), 'TALLY_UNREACHABLE');

  // ---- 10. serialisation and priority: never two requests at once; entries jump ahead of syncs
  let active = 0, maxActive = 0;
  const order = [];
  s = await fake((b, res) => {
    active += 1; maxActive = Math.max(maxActive, active);
    order.push(/<ID>([^<]+)<\/ID>/.exec(b)?.[1]);
    setTimeout(() => { active -= 1; res.end('<ENVELOPE><BODY><DATA><COLLECTION/></DATA></BODY></ENVELOPE>'); }, 25);
  });
  const qc = mk(s.port);
  const body = (id) => `<ENVELOPE><HEADER><ID>${id}</ID></HEADER></ENVELOPE>`;
  const ps = [
    qc.exportData(body('S1')),
    qc.exportData(body('S2')),
    qc.exportData(body('S3')),
    qc.exportData(body('E1'), { priority: 'entry' }),
    qc.exportData(body('E2'), { priority: 'entry' }),
  ];
  assert.ok(qc.queueDepth() >= 4);
  await Promise.all(ps);
  assert.equal(maxActive, 1, 'single request in flight');
  assert.deepEqual(order, ['S1', 'E1', 'E2', 'S2', 'S3']);
  assert.equal(qc.queueDepth(), 0);
  // a failing job does not block the queue
  s.server.close();
  const q2 = mk(deadPort, { retries: 0 });
  const results = await Promise.allSettled([q2.exportData(body('A')), q2.exportData(body('B'))]);
  assert.deepEqual(results.map((x) => x.status), ['rejected', 'rejected']);
  assert.equal(q2.queueDepth(), 0);

  // ---- 10b. the detector can share the queue through queuedPost
  s = await fake((b, res) => { active += 1; maxActive = Math.max(maxActive, active); setTimeout(() => { active -= 1; res.end(/Function/.test(b) ? '<RESPONSE>v</RESPONSE>' : '<ENVELOPE><BODY><DATA><COLLECTION><COMPANY NAME="Q"/></COLLECTION></DATA></BODY></ENVELOPE>'); }, 20); });
  maxActive = 0;
  const sq = mk(s.port);
  const det = D.createTallyDetector({ getTarget: () => ({ host: '127.0.0.1', port: s.port }), getCompanyGuid: () => null, setCompanyGuid() {}, post: sq.queuedPost });
  const [dr] = await Promise.all([det.detect(), sq.exportData(body('Z1')), sq.exportData(body('Z2'))]);
  assert.equal(dr.state, 'ok');
  assert.equal(maxActive, 1, 'detector and client never overlap');
  s.server.close();

  // ---- 11. logs: request ids and sizes only, no bodies or company names
  const log = fs.readFileSync(path.join(tmp, 'logs', 'lazybooks.log'), 'utf8');
  assert.match(log, /"msg":"request"/);
  assert.match(log, /"msg":"import result"/);
  assert.match(log, /illegal xml characters stripped/);
  assert.ok(!log.includes('Demo Traders'), 'company name not logged');
  assert.ok(!log.includes('Alpha Retail'), 'no response data in logs');

  fs.rmSync(out, { recursive: true, force: true });
  console.log('tally-client: all checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
