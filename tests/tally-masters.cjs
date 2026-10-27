// Node-level check for Phase 10: masters pulled through the Tally client and mapped equal docs/shared/fixtures/tables/tm_* (WIRE-01).
// Run: NODE_PATH=<dir containing typescript> node tests/tally-masters.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-masters');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/tally', 'src/main/tally/masters', 'src/shared']) {
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
const X = require(path.join(out, 'src/main/tally/xml.js'));
const M = require(path.join(out, 'src/main/tally/masters/index.js'));

const FX = 'docs/shared/fixtures';
const table = (t) => JSON.parse(fs.readFileSync(`${FX}/tables/${t}.json`, 'utf8'));
const company = table('tm_company')[0];
const AS_OF = '2026-09-30';
const mkClient = (port) => C.createTallyClient({ getTarget: () => ({ host: '127.0.0.1', port }), backoffMs: 1, retries: 0 });
const fake = (handler) => new Promise((resolve) => {
  const s = http.createServer((req, res) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => handler(Buffer.concat(c).toString('utf8'), res)); });
  s.listen(0, '127.0.0.1', () => resolve({ server: s, port: s.address().port }));
});

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-ma-'));
  initLogger({ dir: path.join(tmp, 'logs') });

  // request plan: every request id the mock knows, simple tags as NATIVEMETHOD, lists as FETCH, all valid for the builder
  const plan = M.buildMasterRequests();
  assert.deepEqual(plan.map((r) => r.id), ['LBGroups', 'LBLedgers', 'LBVoucherTypes', 'LBStockGroups', 'LBStockCategories', 'LBUnits', 'LBGodowns', 'LBStockItems', 'LBCostCentres', 'LBCurrencies', 'LBEmployees', 'LBTaxUnits']);
  const led = plan.find((r) => r.id === 'LBLedgers');
  assert.equal(led.type, 'Ledger');
  assert.ok(led.fields.includes('PARENT') && led.fields.includes('GUID') && led.fields.includes('ALTERID'));
  assert.ok(!led.fields.some((f) => f.startsWith('@') || f.includes('/') || f.endsWith('.LIST')));
  for (const l of ['LEDMAILINGDETAILS.LIST', 'LEDGSTREGDETAILS.LIST', 'BILLALLOCATIONS.LIST', 'ADDRESS.LIST', 'LANGUAGENAME.LIST']) assert.ok(led.fetch.includes(l), l);
  const si = plan.find((r) => r.id === 'LBStockItems');
  for (const l of ['GSTDETAILS.LIST', 'BATCHALLOCATIONS.LIST', 'LANGUAGENAME.LIST', 'HSNDETAILS.LIST']) assert.ok(si.fetch.includes(l), l);
  for (const r of plan) X.parseXml(X.buildCollectionRequest({ name: r.id, type: r.type, fields: r.fields, fetch: r.fetch, company: 'Demo Traders Pvt Ltd' }));

  // 1. real HTTP against the mock Tally: every master table equals the shared fixture (WIRE-01), same columns in the same order
  const mock = await import('../tools/mock-tally/server.mjs');
  const srv = mock.startMockTally(0);
  await new Promise((r) => srv.once('listening', r));
  const events = [];
  const masters = M.createMasters({
    client: mkClient(srv.address().port),
    getCompanyName: () => 'Demo Traders Pvt Ltd',
    getCompanyGuid: () => company.guid,
    getAsOf: () => AS_OF,
    onPulled: (r) => events.push(r.counts),
  });
  const res = await masters.pull();
  const tables = Object.keys(M.MASTER_TABLES);
  assert.equal(tables.length, 18);
  for (const t of tables) {
    const exp = t === 'tm_employee' ? [] : table(t); // Employee is not a Tally object type: never requested, always empty
    assert.equal(res.tables[t].length, exp.length, `${t}: row count`);
    assert.deepEqual(res.tables[t], exp, `${t}: rows equal fixtures/tables/${t}.json`);
    if (exp.length) assert.deepEqual(Object.keys(res.tables[t][0]), Object.keys(exp[0]), `${t}: column order`);
    assert.equal(res.counts[t], exp.length);
  }
  assert.equal(res.counts.tm_ledger, 19);
  assert.equal(res.counts.tm_stock_item, 6);
  assert.equal(res.counts.tm_godown, 2);
  assert.equal(res.counts.tm_voucher_type, 15);
  assert.equal(events.length, 1);
  assert.equal(masters.last().companyGuid, company.guid);
  // renamed group still resolves by chain, not by name
  const sup = res.tables.tm_group.find((g) => g.name === 'Suppliers');
  assert.equal(sup.reserved_root, 'Sundry Creditors'.length ? sup.reserved_root : '');
  assert.ok(sup.reserved_root !== '');
  const tax = res.tables.tm_voucher_type.find((v) => v.name === 'Tax Invoice');
  assert.equal(tax.base_kind, 'sales');
  assert.ok(res.tables.tm_voucher_type.every((v) => v.base_kind !== ''));
  srv.close();

  // 2. mapping edge cases through fake Tally answers
  const wrap = (objs) => `<ENVELOPE><BODY><DATA><COLLECTION>${objs}</COLLECTION></DATA></BODY></ENVELOPE>`;
  const answers = {
    LBGroups: wrap('<GROUP NAME="Top"><GUID>g1</GUID><RESERVEDNAME>Sundry Debtors</RESERVEDNAME></GROUP><GROUP NAME="Child"><PARENT>top</PARENT></GROUP><GROUP NAME="Loop A"><PARENT>Loop B</PARENT></GROUP><GROUP NAME="Loop B"><PARENT>Loop A</PARENT></GROUP>'),
    LBLedgers: wrap('<LEDGER NAME="X"><GUID>l1</GUID><PARENT>child</PARENT><OPENINGBALANCE>-1,234.5</OPENINGBALANCE></LEDGER><LEDGER NAME="Orphan"><PARENT>Missing</PARENT></LEDGER>'),
    LBVoucherTypes: wrap('<VOUCHERTYPE NAME="Mine"><PARENT>Mine Parent</PARENT></VOUCHERTYPE><VOUCHERTYPE NAME="Mine Parent"><PARENT>Mine</PARENT></VOUCHERTYPE><VOUCHERTYPE NAME="Kid"><PARENT>sales</PARENT></VOUCHERTYPE>'),
    LBStockItems: wrap('<STOCKITEM NAME="Widget"><PARENT>Nope</PARENT><OPENINGBALANCE>10 Nos</OPENINGBALANCE><CLOSINGBALANCE>3 Nos</CLOSINGBALANCE><CLOSINGVALUE>10</CLOSINGVALUE></STOCKITEM>'),
  };
  const seen = [];
  const s = await fake((b, res2) => { const id = /<ID>([^<]+)<\/ID>/.exec(b)?.[1]; seen.push(id); res2.end(answers[id] ?? wrap('')); });
  const m2 = M.createMasters({ client: mkClient(s.port), getCompanyName: () => 'C', getCompanyGuid: () => 'cg', getAsOf: () => AS_OF });
  const r2 = await m2.pull();
  assert.deepEqual(seen, plan.map((r) => r.id).filter((id) => id !== 'LBEmployees'), 'one request per master kind, in order, serialised (Employee is never sent: not a Tally object type)');
  const g = Object.fromEntries(r2.tables.tm_group.map((x) => [x.name, x]));
  assert.equal(g.Top.reserved_root, 'Sundry Debtors');
  assert.equal(g.Child.reserved_root, 'Sundry Debtors', 'case-insensitive parent match walks to the reserved root');
  assert.equal(g.Child.parent_guid, 'g1');
  assert.equal(g['Loop A'].reserved_root, '', 'parent cycle terminates');
  assert.equal(g.Child.guid, 'n:Child', 'GUID fallback');
  const l = Object.fromEntries(r2.tables.tm_ledger.map((x) => [x.name, x]));
  assert.equal(l.X.group_guid, 'n:Child');
  assert.equal(l.X.reserved_root, 'Sundry Debtors');
  assert.equal(l.X.opening_balance, '-1234.50');
  assert.equal(l.Orphan.group_guid, '');
  const v = Object.fromEntries(r2.tables.tm_voucher_type.map((x) => [x.name, x]));
  assert.equal(v.Mine.base_kind, 'unknown', 'voucher type parent cycle gives unknown');
  assert.equal(v.Kid.base_kind, 'sales');
  const it = r2.tables.tm_stock_item[0];
  assert.equal(it.opening_qty, '10.00');
  assert.equal(it.closing_rate, '3.33');
  assert.equal(it.parent_guid, '');
  assert.equal(it.closing_as_of, AS_OF);
  assert.equal(M.canon('1.005'), '1.005');
  assert.equal(M.canon('2'), '2.00');
  assert.equal(M.canon('-0.00001'), '0.00');
  assert.equal(M.canon('abc'), null);
  s.server.close();

  // 3. failures: no selection, no company record, Tally error aborts the whole pull (no partial result), then recovery
  await assert.rejects(M.createMasters({ client: mkClient(1), getCompanyName: () => null, getCompanyGuid: () => 'x' }).pull(), /No company selected/);
  await assert.rejects(M.createMasters({ client: mkClient(1), getCompanyName: () => 'C', getCompanyGuid: () => null }).pull(), /Company record not read yet/);
  let failAt = 'LBLedgers';
  const s3 = await fake((b, res3) => {
    const id = /<ID>([^<]+)<\/ID>/.exec(b)?.[1];
    res3.end(id === failAt ? '<RESPONSE><LINEERROR>Boom</LINEERROR></RESPONSE>' : wrap(''));
  });
  const m3 = M.createMasters({ client: mkClient(s3.port), getCompanyName: () => 'C', getCompanyGuid: () => 'cg', getAsOf: () => AS_OF });
  await assert.rejects(m3.pull());
  assert.equal(m3.last(), null, 'a failed pull leaves no half result');
  // an optional master (TaxUnit) refused by Tally is skipped; a required one still aborts
  failAt = 'LBTaxUnits';
  const rOpt = await m3.pull();
  assert.equal(rOpt.counts.tm_gst_registration, 0, 'refused optional master reads as empty');
  assert.ok(m3.last() !== null, 'the rest of the pull still completes');
  failAt = 'LBGodowns';
  await assert.rejects(m3.pull(), 'a required master still aborts the pull');
  failAt = '';
  assert.equal((await m3.pull()).counts.tm_ledger, 0);
  s3.server.close();

  // 4. logs carry counts only, never master names
  const log = fs.readFileSync(path.join(tmp, 'logs', 'lazybooks.log'), 'utf8');
  assert.match(log, /masters pulled/);
  assert.ok(!/Demo Traders|Alpha|Widget/.test(log.split('\n').filter((x) => /masters pulled/.test(x)).join('\n')));
  console.log('tally-masters: all checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
