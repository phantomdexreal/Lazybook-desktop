// Node-level check for Phase 9: the company record read through the Tally client equals the shared fixture row (tm_company).
// Run: NODE_PATH=<dir containing typescript> node tests/tally-company.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-company');
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
const C = require(path.join(out, 'src/main/tally/client.js'));
const K = require(path.join(out, 'src/main/tally/company.js'));
const X = require(path.join(out, 'src/main/tally/xml.js'));

const expected = JSON.parse(fs.readFileSync('docs/shared/fixtures/tables/tm_company.json', 'utf8'))[0];
const fake = (handler) => new Promise((resolve) => {
  const s = http.createServer((req, res) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => handler(Buffer.concat(c).toString('utf8'), res)); });
  s.listen(0, '127.0.0.1', () => resolve({ server: s, port: s.address().port }));
});
const mkClient = (port) => C.createTallyClient({ getTarget: () => ({ host: '127.0.0.1', port }), backoffMs: 1, retries: 0 });

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-co-'));
  initLogger({ dir: path.join(tmp, 'logs') });

  // request shape
  const req = X.buildCollectionRequest({ name: K.REQ_COMPANY, type: 'Company', fields: K.COMPANY_FIELDS, fetch: K.COMPANY_FETCH, company: 'Demo Traders Pvt Ltd' });
  assert.match(req, /<NATIVEMETHOD>CMPGSTIN<\/NATIVEMETHOD>/);
  assert.match(req, /<FETCH>ADDRESS\.LIST<\/FETCH>/);
  assert.ok(!/<NATIVEMETHOD>@NAME/.test(req), 'attribute columns are not requested as fields');
  X.parseXml(req);

  // 1. against the mock Tally (real HTTP): serial arrives as FNRESULT in the company row
  const mock = await import('../tools/mock-tally/server.mjs');
  const srv = mock.startMockTally(0);
  await new Promise((r) => srv.once('listening', r));
  const cache = path.join(tmp, 'company.json');
  const changes = [];
  const info = K.createCompanyInfo({
    client: mkClient(srv.address().port),
    getCompanyName: () => 'Demo Traders Pvt Ltd',
    getCompanyGuid: () => expected.guid,
    cacheFile: cache,
    onChange: (c) => changes.push(c.name),
  });
  const rec = await info.read();
  assert.deepEqual(rec, expected, 'record equals fixtures/tables/tm_company.json');
  assert.deepEqual(Object.keys(rec), Object.keys(expected), 'same columns in the same order');
  assert.equal(rec.alter_id, 115);
  assert.deepEqual(JSON.parse(fs.readFileSync(cache, 'utf8')), expected);
  await info.read();
  assert.deepEqual(changes, ['Demo Traders Pvt Ltd'], 'onChange only when the record changed');
  assert.equal(info.last().tally_serial, '700012345');

  // 2. serial through the $$LicenseInfo function when the row has no FNRESULT; mock answers the function too
  assert.equal((await mkClient(srv.address().port).fn(K.FN_SERIAL)), '700012345');
  const noFn = fs.readFileSync('docs/shared/fixtures/tally_xml/company.xml', 'utf8').replace(/<FNRESULT[\s\S]*?<\/FNRESULT>/, '');
  const seen = [];
  let s = await fake((b, res) => { seen.push(/<ID>([^<]+)<\/ID>/.exec(b)?.[1]); res.end(/Function/.test(b) ? '<RESPONSE>SN-42</RESPONSE>' : noFn); });
  let rec2 = await K.createCompanyInfo({ client: mkClient(s.port), getCompanyName: () => 'Demo Traders Pvt Ltd' }).read();
  assert.equal(rec2.tally_serial, 'SN-42');
  assert.deepEqual(seen, ['LBCompany', '$$LicenseInfo:SerialNumber']);
  assert.deepEqual({ ...rec2, tally_serial: '700012345' }, expected);
  s.server.close();

  // 3. serial function unsupported: record still returned, serial empty, not an error
  s = await fake((b, res) => res.end(/Function/.test(b) ? '<RESPONSE><LINEERROR>Unknown function</LINEERROR></RESPONSE>' : noFn));
  rec2 = await K.createCompanyInfo({ client: mkClient(s.port), getCompanyName: () => 'Demo Traders Pvt Ltd' }).read();
  assert.equal(rec2.tally_serial, '');
  assert.equal(rec2.gstin, '27AAACD1234E1Z5');
  s.server.close();

  // 4. sparse company (no GST, no address, odd values): defaults, nulls, no crash
  const sparse = '<ENVELOPE><BODY><DATA><COLLECTION><COMPANY NAME="Tiny &amp; Co"><GUID>g-1</GUID><STARTINGFROM>20250401</STARTINGFROM><ENDINGAT>bad</ENDINGAT><ALTMSTID>7</ALTMSTID><ALTVCHID>9</ALTVCHID><DECIMALPLACES>x</DECIMALPLACES></COMPANY></COLLECTION></DATA></BODY></ENVELOPE>';
  s = await fake((_b, res) => res.end(sparse));
  const tiny = await K.createCompanyInfo({ client: mkClient(s.port), getCompanyName: () => 'Tiny & Co' }).read();
  assert.equal(tiny.name, 'Tiny & Co');
  assert.equal(tiny.starting_from, '2025-04-01');
  assert.equal(tiny.ending_at, null);
  assert.equal(tiny.books_from, null);
  assert.equal(tiny.address, null);
  assert.equal(tiny.gstin, '');
  assert.equal(tiny.decimal_places, 2);
  assert.equal(tiny.alter_id, 9);
  assert.equal(tiny.tally_serial, '');
  s.server.close();

  // 5. wrong company / none selected / not loaded
  await assert.rejects(K.createCompanyInfo({ client: mkClient(srv.address().port), getCompanyName: () => null }).read(), /No company selected/);
  await assert.rejects(K.createCompanyInfo({ client: mkClient(srv.address().port), getCompanyName: () => 'Other Co' }).read(), (e) => e instanceof C.TallyError && e.detail === 'TALLY_COMPANY_NOT_LOADED' && e.retryable);
  s = await fake((_b, res) => res.end('<RESPONSE><LINEERROR>Could not set \'SVCurrentCompany\'</LINEERROR></RESPONSE>'));
  await assert.rejects(K.createCompanyInfo({ client: mkClient(s.port), getCompanyName: () => 'X' }).read(), (e) => e.detail === 'TALLY_COMPANY_NOT_LOADED');
  s.server.close();
  srv.close();

  // 6. binding helper
  assert.equal(K.checkBinding(null, '1'), 'unbound');
  assert.equal(K.checkBinding('1', '1'), 'match');
  assert.equal(K.checkBinding('1', '2'), 'mismatch');
  assert.equal(K.checkBinding('1', ''), 'unknown');

  // 7. logs carry no company data
  const log = fs.readFileSync(path.join(tmp, 'logs', 'lazybooks.log'), 'utf8');
  assert.match(log, /"msg":"company info"/);
  assert.ok(!log.includes('27AAACD1234E1Z5'), 'GSTIN not logged');
  assert.ok(!log.includes('700012345'), 'serial not logged');

  fs.rmSync(out, { recursive: true, force: true });
  console.log('tally-company: all checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
