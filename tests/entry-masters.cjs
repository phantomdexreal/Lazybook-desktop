// Node-level check for Phase 26: ledger and stock item creation XML + re-validation against the shared entry examples and fixtures tables.
// Run: NODE_PATH=<dir with typescript 5> node tests/entry-masters.cjs        (UPDATE_GOLDEN=1 rewrites tests/fixtures/xml/master_*.xml)
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-em');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main/entries/masters', 'src/main/entries/builders', 'src/main/tally']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts') && (!sub.endsWith('tally') || n === 'xml.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
fs.mkdirSync(path.join(out, 'docs/shared'), { recursive: true });
fs.copyFileSync('docs/shared/entry_rules.json', path.join(out, 'docs/shared/entry_rules.json'));
const R = (p) => require(path.join(out, p));
const M = R('src/main/entries/masters/index.js');
const { BuildError } = R('src/main/entries/builders/index.js');
const { parseXml } = R('src/main/tally/xml.js');

const SH = 'docs/shared';
const j = (p) => JSON.parse(fs.readFileSync(`${SH}/${p}`, 'utf8'));
const T = {};
for (const t of ['tm_company', 'tm_ledger', 'tm_group', 'tm_stock_item', 'tm_stock_item_gst', 'tm_unit', 'tm_godown', 'tm_voucher_type', 'tm_stock_group', 'tx_voucher']) T[t] = j(`fixtures/tables/${t}.json`);
const lk = M.masterLookupFromTables(T, null);
const FLAGS = { entries: true, orders: true, einvoice_eway: true };
const GOLD = 'tests/fixtures/xml';
let n = 0;
const ok = (m) => console.log(`ok ${++n} ${m}`);
const clone = (o) => JSON.parse(JSON.stringify(o));
const kids = (x, name) => x.children.filter((c) => c.name === name);
const first = (x, name) => kids(x, name)[0];
function masterOf(xml, tag) {
  const root = parseXml(xml);
  const m = root.children[1].children[0].children[1].children[0].children[0];
  assert.equal(m.name, tag);
  return m;
}

// 1. validation parity with the shared index
const idx = j('entry_examples/index.json').examples.filter((e) => ['ledger', 'stock_item'].includes(j(`entry_examples/${e.file}`).kind));
assert.equal(idx.length, 4);
for (const e of idx) {
  const p = j(`entry_examples/${e.file}`);
  const r = M.validateMasterEntry({ kind: p.kind, company_guid: p.company_guid, data: p.data }, lk, FLAGS);
  if (e.expect === 'valid') assert.deepEqual(r.issues, [], e.file);
  else assert.ok(r.issues.some((i) => i.detail === e.expect), `${e.file}: expected ${e.expect}, got ${JSON.stringify(r.issues)}`);
}
ok('validation matches index.json for the 4 master examples (2 valid, 2 MASTER_NOT_FOUND)');

// 2. golden XML, well formed, names resolved from the fixture tables
const gold = {};
for (const f of ['ledger.valid', 'stock_item.valid']) {
  const p = j(`entry_examples/${f}.json`);
  const r = M.buildMasterImport(p, lk, FLAGS);
  gold[f] = r;
  assert.equal(r.duplicateOf, null);
  const g = `${GOLD}/master_${f}.xml`;
  if (process.env.UPDATE_GOLDEN) fs.writeFileSync(g, r.xml);
  assert.equal(r.xml, fs.readFileSync(g, 'utf8'), `${f}: golden`);
  assert.ok(!/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}/.test(r.xml.replace(p.client_request_id, '')), `${f}: no guid leaks into the XML`);
  assert.equal(M.buildMasterImport(p, lk, FLAGS).xml, r.xml, `${f}: pure`);
}
ok('both valid examples build well-formed XML equal to the golden files, deterministic, no guid in the output');

// 3. ledger detail
{
  const r = gold['ledger.valid'];
  const l = masterOf(r.xml, 'LEDGER');
  assert.equal(l.attrs.NAME, 'Delta Traders');
  assert.equal(l.attrs.ACTION, 'Create');
  assert.equal(l.attrs.REMOTEID, '88888888-8888-4888-8888-888888888888');
  const parentGuid = 'e9501d4a-6956-5830-ae47-f5260a9ddac3-00000007';
  assert.equal(first(l, 'PARENT').text, T.tm_group.find((g) => g.guid === parentGuid).name);
  assert.equal(r.parentName, first(l, 'PARENT').text);
  assert.equal(first(l, 'OPENINGBALANCE').text, '-1000.00');
  assert.equal(first(l, 'ISBILLWISEON').text, 'Yes');
  assert.equal(first(l, 'BILLCREDITPERIOD').text, '30 Days');
  assert.equal(first(l, 'PARTYGSTIN').text, '27AAAPD6666F1Z6');
  assert.equal(first(l, 'GSTREGISTRATIONTYPE').text, 'Regular');
  assert.deepEqual(kids(first(l, 'ADDRESS.LIST'), 'ADDRESS').map((a) => a.text), ['3 Mill Road', 'Pune']);
  assert.equal(first(l, 'LEDGERMOBILE').text, '9820000006');
  const p = j('entry_examples/ledger.valid.json');
  const cr = clone(p);
  cr.data.opening_balance.side = 'cr';
  assert.equal(first(masterOf(M.buildMasterImport(cr, lk, FLAGS).xml, 'LEDGER'), 'OPENINGBALANCE').text, '1000.00');
  const bare = clone(p);
  bare.data = { name: 'Plain & Co <1>', parent_group_guid: 'n:Indirect Expenses' };
  const b = M.buildMasterImport(bare, lk, FLAGS);
  const bl = masterOf(b.xml, 'LEDGER');
  assert.equal(bl.attrs.NAME, 'Plain & Co <1>');
  assert.equal(first(bl, 'PARENT').text, 'Indirect Expenses');
  assert.equal(first(bl, 'OPENINGBALANCE'), undefined);
  assert.ok(b.xml.includes('Plain &amp; Co &lt;1&gt;'));
  const bank = clone(p);
  bank.data.name = 'Delta Bank';
  bank.data.bank = { bank_name: 'HDFC', account_no: '123456', ifsc: 'HDFC0000001', branch: 'Pune', holder: 'Delta' };
  const bk = masterOf(M.buildMasterImport(bank, lk, FLAGS).xml, 'LEDGER');
  assert.equal(first(bk, 'IFSCODE').text, 'HDFC0000001');
  assert.equal(first(bk, 'BANKDETAILS').text, '123456');
}
ok('ledger: parent from the group table, debit negative / credit positive, GST, address, bank, escaping, name-only parent');

// 4. stock item detail
{
  const r = gold['stock_item.valid'];
  const s = masterOf(r.xml, 'STOCKITEM');
  assert.equal(s.attrs.NAME, 'Widget E');
  assert.equal(first(s, 'BASEUNITS').text, 'Nos');
  assert.equal(first(s, 'PARENT').text, 'Hardware');
  assert.equal(first(s, 'OPENINGBALANCE').text, '10 Nos');
  assert.equal(first(s, 'OPENINGVALUE').text, '400.00');
  assert.equal(first(s, 'OPENINGRATE').text, '40.00/Nos');
  assert.equal(first(s, 'REORDERBASE').text, '5 Nos');
  const ba = first(s, 'BATCHALLOCATIONS.LIST');
  assert.equal(first(ba, 'GODOWNNAME').text, 'Main Location');
  assert.equal(first(ba, 'BATCHNAME').text, 'Primary Batch');
  assert.equal(first(first(s, 'HSNDETAILS.LIST'), 'HSNCODE').text, '8479');
  const gd = first(s, 'GSTDETAILS.LIST');
  assert.equal(first(gd, 'TAXABILITY').text, 'Taxable');
  const rates = Object.fromEntries(kids(first(gd, 'STATEWISEDETAILS.LIST'), 'RATEDETAILS.LIST').map((x) => [first(x, 'GSTRATEDUTYHEAD').text, first(x, 'GSTRATE').text]));
  assert.deepEqual(rates, { CGST: '9.00', 'SGST/UTGST': '9.00', IGST: '18.00' });
  const p = j('entry_examples/stock_item.valid.json');
  const m = clone(p);
  m.data = { name: 'Loose Item', unit_guid: 'n:Kg', gst_taxability: 'exempt' };
  const x = M.buildMasterImport(m, lk, FLAGS);
  const xs = masterOf(x.xml, 'STOCKITEM');
  assert.equal(x.parentName, null);
  assert.equal(first(xs, 'PARENT'), undefined);
  assert.equal(first(xs, 'BASEUNITS').text, 'Kg');
  assert.equal(first(xs, 'OPENINGBALANCE'), undefined);
  assert.equal(first(first(xs, 'GSTDETAILS.LIST'), 'TAXABILITY').text, 'Exempt');
  assert.equal(kids(first(first(xs, 'GSTDETAILS.LIST'), 'STATEWISEDETAILS.LIST'), 'RATEDETAILS.LIST').length, 0);
  const f = clone(p);
  f.data.opening = { godown_guid: 'n:Main Location', qty: '2.5', rate: '33.333', batch_name: 'B1' };
  const fx = masterOf(M.buildMasterImport(f, lk, FLAGS).xml, 'STOCKITEM');
  assert.equal(first(fx, 'OPENINGVALUE').text, '83.33');
  assert.equal(first(fx, 'OPENINGBALANCE').text, '2.5 Nos');
  assert.equal(first(first(fx, 'BATCHALLOCATIONS.LIST'), 'BATCHNAME').text, 'B1');
}
ok('stock item: unit and group names, opening qty/value/rate with batch+godown, HSN, CGST/SGST half and IGST full, optional parts omitted');

// 5. duplicate name: clear error (the phase verify step)
{
  const p = j('entry_examples/ledger.valid.json');
  const tries = [['Cash', 'ledger'], ['  hdfc   BANK ', 'ledger'], ['Sundry Debtors', 'group'], ['Key Customers', 'group']];
  for (const [name, what] of tries) {
    const d = clone(p);
    d.data.name = name;
    assert.throws(
      () => M.buildMasterImport(d, lk, FLAGS),
      (e) => e instanceof BuildError && e.detail === 'MASTER_EXISTS' && e.path === '$.data.name' && e.message.includes(`a ${what} named`) && e.message.includes('already exists') && e.message.includes('choose another name'),
      name,
    );
  }
  const s = clone(j('entry_examples/stock_item.valid.json'));
  for (const [name, what] of [['widget a', 'stock item'], ['Hardware', 'stock group']]) {
    s.data.name = name;
    assert.throws(() => M.buildMasterImport(s, lk, FLAGS), (e) => e.detail === 'MASTER_EXISTS' && e.message.includes(`a ${what} named`), name);
  }
  // an alias counts as a name
  const T2 = clone(T);
  T2.tm_ledger[0].aliases = JSON.stringify(['Petty Cash']);
  const lk2 = M.masterLookupFromTables(T2, null);
  const a = clone(p);
  a.data.name = 'petty cash';
  const r = M.validateMasterEntry({ kind: 'ledger', company_guid: a.company_guid, data: a.data }, lk2, FLAGS);
  assert.equal(r.issues[0].detail, 'MASTER_EXISTS');
  assert.ok(r.issues[0].message.includes('alias'));
  // a stock item name does not clash with a ledger of the same name (separate namespaces)
  s.data.name = 'Cash';
  assert.deepEqual(M.validateMasterEntry({ kind: 'stock_item', company_guid: s.company_guid, data: s.data }, lk, FLAGS).issues, []);
}
ok('duplicate name (any case, spacing, alias, group or stock group of the same namespace) throws MASTER_EXISTS with a clear message');

// 6. idempotent retry by request id
{
  const p = clone(j('entry_examples/ledger.valid.json'));
  const T3 = clone(T);
  T3.tm_ledger.push({ guid: 'created-earlier-0001', name: 'Delta Traders', remote_id: p.client_request_id, aliases: '[]' });
  const lk3 = M.masterLookupFromTables(T3, null);
  const r = M.buildMasterImport(p, lk3, FLAGS);
  assert.equal(r.xml, '');
  assert.deepEqual(r.duplicateOf, { guid: 'created-earlier-0001' });
  const other = clone(p);
  other.client_request_id = '88888888-8888-4888-8888-88888888888a';
  assert.throws(() => M.buildMasterImport(other, lk3, FLAGS), (e) => e.detail === 'MASTER_EXISTS');
}
ok('same client_request_id found on the existing master returns duplicateOf (no post); another request id is MASTER_EXISTS');

// 7. refusals
{
  const p = j('entry_examples/ledger.valid.json');
  const chk = (mut, detail, flags = FLAGS) => {
    const d = clone(p);
    mut(d);
    assert.throws(() => M.buildMasterImport(d, lk, flags), (e) => e instanceof BuildError && e.detail === detail, detail);
  };
  chk((d) => (d.company_guid = 'other'), 'COMPANY_MISMATCH');
  chk((d) => (d.data.surprise = 1), 'PAYLOAD_INVALID');
  chk((d) => delete d.data.name, 'PAYLOAD_INVALID');
  chk((d) => (d.data.credit_period_days = 999), 'PAYLOAD_INVALID');
  chk((d) => (d.data.opening_balance.amount = '0'), 'PAYLOAD_INVALID');
  chk((d) => (d.v = 2), 'UNSUPPORTED_VERSION');
  chk(() => {}, 'FLAG_DISABLED', { entries: false });
  chk((d) => (d.kind = 'journal'), 'PAYLOAD_INVALID');
  const s = clone(j('entry_examples/stock_item.valid.json'));
  s.data.opening.godown_guid = 'no-such-godown';
  assert.throws(() => M.buildMasterImport(s, lk, FLAGS), (e) => e.detail === 'GODOWN_NOT_FOUND');
  const s2 = clone(j('entry_examples/stock_item.valid.json'));
  s2.data.parent_stock_group_guid = 'no-such-sg';
  assert.throws(() => M.buildMasterImport(s2, lk, FLAGS), (e) => e.detail === 'MASTER_NOT_FOUND');
}
ok('refusals: company, unknown/missing/out-of-range fields, version, flag, wrong kind, missing godown and stock group');

console.log(`\nentry-masters: ${n} checks passed`);
fs.rmSync(out, { recursive: true, force: true });
