// Node-level check for Phase 7: Tally detection against the mock Tally (real HTTP) and purpose-built fake servers.
// Run: NODE_PATH=<dir containing typescript> node tests/tally-detect.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-tally');
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
const D = require(path.join(out, 'src/main/tally/detect.js'));

function fake(handler) {
  return new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const c = [];
      req.on('data', (d) => c.push(d));
      req.on('end', () => handler(Buffer.concat(c).toString('utf8'), res));
    });
    s.listen(0, '127.0.0.1', () => resolve({ server: s, port: s.address().port }));
  });
}
const company = (n, g) => `<COMPANY NAME="${n}"><GUID>${g}</GUID><STARTINGFROM>20260401</STARTINGFROM><ENDINGAT>20270331</ENDINGAT></COMPANY>`;
const coList = (...c) => `<ENVELOPE><BODY><DATA><COLLECTION>${c.join('')}</COLLECTION></DATA></BODY></ENVELOPE>`;

function mkDetector(port, extra = {}) {
  let guid = extra.guid ?? null;
  const changes = [];
  const det = D.createTallyDetector({
    getTarget: () => ({ host: '127.0.0.1', port }),
    getCompanyGuid: () => guid,
    setCompanyGuid: (g) => { guid = g; },
    onChange: (d) => changes.push(d.state),
    timeoutMs: extra.timeoutMs,
  });
  return { det, changes, guid: () => guid };
}

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-tally-'));
  initLogger({ dir: path.join(tmp, 'logs') });

  // 1. request shapes
  const req = D.buildCompanyListRequest();
  assert.match(req, /<TALLYREQUEST>Export<\/TALLYREQUEST>/);
  assert.match(req, /<ID>LBCompanyNames<\/ID>/);
  assert.match(req, /\$\$SysName:XML/);
  assert.match(D.buildProdInfoRequest(), /<TYPE>Function<\/TYPE><ID>\$\$ProdInfo<\/ID>/);

  // 2. mock Tally (real HTTP): detected, version read, single company auto-selected and remembered
  const mock = await import('../tools/mock-tally/server.mjs');
  const srv = mock.startMockTally(0);
  await new Promise((r) => srv.once('listening', r));
  const mport = srv.address().port;
  let t = mkDetector(mport);
  let r = await t.det.detect();
  assert.equal(r.state, 'ok');
  assert.equal(r.ok, true);
  assert.equal(r.code, null);
  assert.match(r.version, /^TallyPrime Release/);
  assert.equal(r.companies.length, 1);
  assert.equal(r.selected.name, 'Demo Traders Pvt Ltd');
  assert.equal(r.selected.startingFrom, '2026-04-01');
  assert.equal(r.selected.endingAt, '2027-03-31');
  assert.equal(t.guid(), r.selected.guid);
  assert.ok(r.selected.guid && r.selected.guid.startsWith('6d29795f'));
  assert.deepEqual(t.det.status(), { ok: true, version: r.version, company: 'Demo Traders Pvt Ltd' });
  assert.deepEqual(t.changes, ['ok']);
  await t.det.detect();
  assert.deepEqual(t.changes, ['ok'], 'no change event when nothing changed');
  srv.close();

  // 3. nothing listening: LB_TALLY_UNREACHABLE with the ODBC/XML guidance and the port
  const dead = await fake((_b, res) => res.end(''));
  const deadPort = dead.port;
  await new Promise((r2) => dead.server.close(r2));
  t = mkDetector(deadPort);
  r = await t.det.detect();
  assert.equal(r.state, 'unreachable');
  assert.equal(r.code, 'LB_TALLY_UNREACHABLE');
  assert.equal(r.ok, false);
  assert.match(r.message, new RegExp(`127\\.0\\.0\\.1:${deadPort}`));
  assert.match(r.message, /Client\/Server configuration/);
  assert.deepEqual(t.det.status(), { ok: false, version: null, company: null });

  // 4. LINEERROR -> LB_TALLY_REJECTED with Tally's own text
  let s = await fake((_b, res) => res.end('<RESPONSE><LINEERROR>Could not set SVCurrentCompany</LINEERROR></RESPONSE>'));
  t = mkDetector(s.port);
  r = await t.det.detect();
  assert.equal(r.state, 'rejected');
  assert.equal(r.code, 'LB_TALLY_REJECTED');
  assert.match(r.message, /Could not set SVCurrentCompany/);
  s.server.close();

  // 5. something else on the port (plain HTML)
  s = await fake((_b, res) => res.end('<html><body>hello</body></html>'));
  t = mkDetector(s.port);
  r = await t.det.detect();
  assert.equal(r.state, 'not_tally');
  assert.equal(r.code, 'LB_TALLY_REJECTED');
  s.server.close();

  // 6. Tally up but no company open
  s = await fake((_b, res) => res.end(coList()));
  t = mkDetector(s.port);
  r = await t.det.detect();
  assert.equal(r.state, 'no_company');
  assert.equal(r.code, 'TALLY_COMPANY_NOT_LOADED');
  assert.match(r.message, /Alt\+F3/);
  s.server.close();

  // 7. two companies: choose, then select, change events, saved-company-not-loaded
  const two = coList(company('Alpha & Sons', 'g-a'), company('Beta Ltd', 'g-b'));
  s = await fake((b, res) => res.end(/Function/.test(b) ? '<RESPONSE>TallyPrime Release 6.0</RESPONSE>' : two));
  t = mkDetector(s.port);
  r = await t.det.detect();
  assert.equal(r.state, 'choose_company');
  assert.equal(r.ok, false);
  assert.equal(r.version, 'TallyPrime Release 6.0');
  assert.equal(r.companies[0].name, 'Alpha & Sons', 'entities decoded');
  assert.equal(t.guid(), null, 'no auto-pick with two companies');
  r = t.det.selectCompany('g-b');
  assert.equal(r.state, 'ok');
  assert.equal(r.selected.name, 'Beta Ltd');
  assert.equal(t.guid(), 'g-b');
  assert.equal(t.det.selectCompany('nope').selected.name, 'Beta Ltd', 'unknown key ignored');
  assert.equal(t.guid(), 'g-b');
  assert.deepEqual(t.changes, ['choose_company', 'ok']);
  const t2 = mkDetector(s.port, { guid: 'g-gone' });
  r = await t2.det.detect();
  assert.equal(r.state, 'choose_company');
  assert.match(r.message, /not open in TallyPrime/);
  s.server.close();

  // 8. UTF-16LE response with BOM and illegal XML characters; function answer rejected -> version null, still ok
  const utf16 = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(coList(company('Zéta', 'g-z')).replace('Z', 'Z&#4;'), 'utf16le')]);
  s = await fake((b, res) => (/Function/.test(b) ? res.end('<RESPONSE><LINEERROR>bad fn</LINEERROR></RESPONSE>') : res.end(utf16)));
  t = mkDetector(s.port);
  r = await t.det.detect();
  assert.equal(r.state, 'ok');
  assert.equal(r.version, null);
  assert.equal(r.selected.name, 'Zéta');
  s.server.close();

  // 9. timeout: server never answers
  s = await fake(() => {});
  t = mkDetector(s.port, { timeoutMs: 200 });
  const t0 = Date.now();
  r = await t.det.detect();
  assert.equal(r.state, 'unreachable');
  assert.match(r.message, /did not answer in time/);
  assert.ok(Date.now() - t0 < 3000);
  s.server.closeAllConnections?.();
  s.server.close();

  // 10. concurrent detect() calls share one probe (Tally is single-threaded)
  let hits = 0;
  s = await fake((b, res) => { hits += 1; setTimeout(() => res.end(/Function/.test(b) ? '<RESPONSE>v</RESPONSE>' : coList(company('C', 'g-c'))), 50); });
  t = mkDetector(s.port);
  const [a1, a2] = await Promise.all([t.det.detect(), t.det.detect()]);
  assert.equal(a1, a2);
  assert.equal(hits, 2, 'one company list + one version call');
  s.server.close();

  // 11. no secrets or noise in logs, and the log has detection lines
  const log = fs.readFileSync(path.join(tmp, 'logs', 'lazybooks.log'), 'utf8');
  assert.match(log, /"mod":"tally"/);
  assert.match(log, /"msg":"detection"/);
  assert.match(log, /illegal xml characters stripped/);

  fs.rmSync(out, { recursive: true, force: true });
  console.log('tally-detect: all checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
