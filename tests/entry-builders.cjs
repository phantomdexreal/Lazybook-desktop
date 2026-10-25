// Node-level check for Phase 25: voucher XML builders + re-validation against the shared entry examples and fixtures tables.
// Run: NODE_PATH=<dir with typescript> node tests/entry-builders.cjs        (UPDATE_GOLDEN=1 rewrites tests/fixtures/xml/entry_*.xml)
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-eb');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main/entries/builders', 'src/main/tally']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts') && (sub.endsWith('builders') || n === 'xml.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
fs.mkdirSync(path.join(out, 'docs/shared'), { recursive: true });
fs.copyFileSync('docs/shared/entry_rules.json', path.join(out, 'docs/shared/entry_rules.json'));
const R = (p) => require(path.join(out, p));
const B = R('src/main/entries/builders/index.js');
const { parseXml } = R('src/main/tally/xml.js');

const SH = 'docs/shared';
const j = (p) => JSON.parse(fs.readFileSync(`${SH}/${p}`, 'utf8'));
const T = {};
for (const t of ['tm_company', 'tm_ledger', 'tm_group', 'tm_stock_item', 'tm_stock_item_gst', 'tm_unit', 'tm_godown', 'tm_voucher_type', 'tm_stock_group', 'tx_voucher']) T[t] = j(`fixtures/tables/${t}.json`);
const quotGuid = T.tm_voucher_type.find((v) => v.name === 'Sales Quotation').guid;
const lk = B.lookupFromTables(T, quotGuid);
const FLAGS = { entries: true, orders: true, einvoice_eway: true };
const VOUCHER = new Set(B.VOUCHER_KINDS);
const idx = j('entry_examples/index.json').examples.filter((e) => VOUCHER.has(j(`entry_examples/${e.file}`).kind));
const GOLD = 'tests/fixtures/xml';
let n = 0;
const ok = (m) => console.log(`ok ${++n} ${m}`);

// 1. validation parity with the reference validator expectations
for (const e of idx) {
  const p = j(`entry_examples/${e.file}`);
  const issues = B.validateVoucherEntry({ kind: p.kind, company_guid: p.company_guid, data: p.data }, lk, FLAGS);
  if (e.expect === 'valid') assert.deepEqual(issues, [], e.file);
  else assert.ok(issues.some((i) => i.detail === e.expect), `${e.file}: expected ${e.expect}, got ${JSON.stringify(issues)}`);
}
ok(`validation matches index.json for ${idx.length} voucher examples`);

// helpers over the parsed tree
const kids = (x, name) => x.children.filter((c) => c.name === name);
const first = (x, name) => kids(x, name)[0];
function voucherOf(xml) {
  const root = parseXml(xml);
  const v = root.children[1].children[0].children[1].children[0].children[0];
  assert.equal(v.name, 'VOUCHER');
  return v;
}
const D = (s) => BigInt(s.replace('.', '')) * 1n; // amounts have 2 decimals in these fixtures
function ledgerSum(v) {
  let s = 0n;
  for (const l of [...kids(v, 'ALLLEDGERENTRIES.LIST'), ...kids(v, 'LEDGERENTRIES.LIST')]) s += D(first(l, 'AMOUNT').text);
  for (const i of kids(v, 'ALLINVENTORYENTRIES.LIST')) for (const a of kids(i, 'ACCOUNTINGALLOCATIONS.LIST')) s += D(first(a, 'AMOUNT').text);
  return s;
}

// 2. every valid voucher example: well formed, sums to zero, names resolved, golden bytes equal
const built = {};
const ledgerNames = new Set(T.tm_ledger.map((l) => l.name));
for (const e of idx.filter((x) => x.expect === 'valid')) {
  const p = j(`entry_examples/${e.file}`);
  const r = B.buildVoucherImport(p, lk, {}, FLAGS);
  built[e.file] = r;
  const v = voucherOf(r.xml);
  assert.equal(v.attrs.REMOTEID, p.client_request_id, e.file);
  assert.equal(v.attrs.ACTION, 'Create');
  assert.equal(r.balance, '0.00');
  if (!['inventory_voucher', 'order', 'quotation'].includes(p.kind)) assert.equal(ledgerSum(v), 0n, `${e.file} ledger lines must sum to zero`);
  for (const l of [...kids(v, 'ALLLEDGERENTRIES.LIST'), ...kids(v, 'LEDGERENTRIES.LIST')]) assert.ok(ledgerNames.has(first(l, 'LEDGERNAME').text), `${e.file}: ledger name from fixtures`);
  assert.ok(!/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}/.test(r.xml.replace(p.client_request_id, '')), `${e.file}: no guid leaks into the XML`);
  const g = `${GOLD}/entry_${e.file.replace(/\.json$/, '')}.xml`;
  if (process.env.UPDATE_GOLDEN) fs.writeFileSync(g, r.xml);
  assert.equal(r.xml, fs.readFileSync(g, 'utf8'), `${e.file}: golden`);
}
ok(`${Object.keys(built).length} valid examples: well formed, zero sum, names from fixtures, byte-equal to golden XML`);

// 3. invoice detail: signs, bills, tax lines, round-off
{
  const r = built['invoice.valid.json'];
  const v = voucherOf(r.xml);
  assert.equal(v.attrs.VCHTYPE, 'Sales');
  assert.equal(first(v, 'DATE').text, '20260925');
  const party = first(v, 'ALLLEDGERENTRIES.LIST');
  assert.equal(first(party, 'LEDGERNAME').text, 'Alpha Retail');
  assert.equal(first(party, 'ISDEEMEDPOSITIVE').text, 'Yes');
  assert.equal(first(party, 'AMOUNT').text, '-4333.00');
  assert.equal(first(first(party, 'BILLALLOCATIONS.LIST'), 'BILLTYPE').text, 'New Ref');
  assert.equal(first(first(party, 'BILLALLOCATIONS.LIST'), 'AMOUNT').text, '-4333.00');
  const inv = kids(v, 'ALLINVENTORYENTRIES.LIST');
  assert.equal(inv.length, 2);
  assert.equal(first(inv[0], 'BILLEDQTY').text, '20 Nos');
  assert.equal(first(inv[0], 'RATE').text, '83.00/Nos');
  assert.equal(first(inv[0], 'AMOUNT').text, '1660.00');
  const led = kids(v, 'LEDGERENTRIES.LIST');
  assert.deepEqual(led.map((l) => first(l, 'AMOUNT').text), ['276.60', '276.60', '-0.20']);
  assert.equal(first(led[2], 'ISDEEMEDPOSITIVE').text, 'Yes');
  assert.equal(r.voucherNumber, 'S-002');
}
ok('sales invoice: party debit negative with bill, items and tax credit, negative round-off flips to debit');

// 4. mirror kinds built from the same payload: purchase and credit note, debit note
{
  const base = j('entry_examples/invoice.valid.json');
  const typeOf = (name) => T.tm_voucher_type.find((x) => x.name === name);
  for (const [name, partySign, partyDeemed] of [['Purchase', 1, 'No'], ['Credit Note', 1, 'No'], ['Debit Note', -1, 'Yes']]) {
    const vt = typeOf(name);
    const p = JSON.parse(JSON.stringify(base));
    p.data.voucher_type_guid = vt.guid;
    p.data.base_kind = vt.base_kind;
    const r = B.buildVoucherImport(p, lk, {}, FLAGS);
    const v = voucherOf(r.xml);
    const party = first(v, 'ALLLEDGERENTRIES.LIST');
    assert.equal(first(party, 'AMOUNT').text, partySign > 0 ? '4333.00' : '-4333.00', name);
    assert.equal(first(party, 'ISDEEMEDPOSITIVE').text, partyDeemed, name);
    assert.equal(ledgerSum(v), 0n, name);
    assert.equal(first(kids(v, 'LEDGERENTRIES.LIST')[2], 'AMOUNT').text, partySign > 0 ? '0.20' : '-0.20', name + ' round-off mirrors');
  }
}
ok('purchase, credit note and debit note mirror the sign rule and still sum to zero');

// 5. receipt / payment / contra / journal / notes / orders
{
  const rc = voucherOf(built['receipt.valid.json'].xml);
  const [rp, rb] = kids(rc, 'ALLLEDGERENTRIES.LIST');
  assert.equal(first(rp, 'AMOUNT').text, '3000.00'); // party credited
  assert.equal(first(rb, 'AMOUNT').text, '-3000.00'); // bank debited
  assert.equal(first(first(rp, 'BILLALLOCATIONS.LIST'), 'BILLTYPE').text, 'Agst Ref');
  const bank = first(rb, 'BANKALLOCATIONS.LIST');
  assert.equal(first(bank, 'TRANSACTIONTYPE').text, 'e-Fund Transfer');
  assert.equal(first(bank, 'INSTRUMENTNUMBER').text, 'UPI123456');
  const py = voucherOf(built['payment.expense.valid.json'].xml);
  const [pp, pb] = kids(py, 'ALLLEDGERENTRIES.LIST');
  assert.equal(first(pp, 'AMOUNT').text, '-12000.00');
  assert.equal(first(pb, 'AMOUNT').text, '12000.00');
  assert.equal(kids(pp, 'BILLALLOCATIONS.LIST').length, 0);
  const ct = voucherOf(built['contra.valid.json'].xml);
  const [to, from] = kids(ct, 'ALLLEDGERENTRIES.LIST');
  assert.equal(first(to, 'LEDGERNAME').text, 'HDFC Bank');
  assert.equal(first(to, 'AMOUNT').text, '-5000.00');
  assert.equal(first(from, 'AMOUNT').text, '5000.00');
  const jr = voucherOf(built['journal.valid.json'].xml);
  const jl = kids(jr, 'ALLLEDGERENTRIES.LIST');
  assert.deepEqual(jl.map((l) => first(l, 'AMOUNT').text), ['-5000.00', '5000.00']);
  assert.equal(first(first(jl[1], 'BILLALLOCATIONS.LIST'), 'NAME').text, 'RENT-OCT');
  assert.equal(first(first(jl[1], 'BILLALLOCATIONS.LIST'), 'AMOUNT').text, '5000.00');
}
ok('receipt, payment, contra and journal: sides, bills, instrument');

{
  const dn = voucherOf(built['inventory_voucher.valid.json'].xml);
  const it = first(dn, 'ALLINVENTORYENTRIES.LIST');
  assert.equal(first(it, 'ISDEEMEDPOSITIVE').text, 'No');
  assert.equal(first(it, 'AMOUNT').text, '1025.00');
  assert.equal(kids(dn, 'ALLLEDGERENTRIES.LIST').length, 0);
  const sj = voucherOf(built['inventory_voucher.stock_journal.valid.json'].xml);
  const [src, dst] = kids(sj, 'ALLINVENTORYENTRIES.LIST');
  assert.equal(first(src, 'ISDEEMEDPOSITIVE').text, 'No');
  assert.equal(first(dst, 'ISDEEMEDPOSITIVE').text, 'Yes');
  assert.equal(first(first(src, 'BATCHALLOCATIONS.LIST'), 'GODOWNNAME').text, 'Main Location');
  assert.equal(first(first(dst, 'BATCHALLOCATIONS.LIST'), 'GODOWNNAME').text, 'Warehouse 2');
  const so = voucherOf(built['order.valid.json'].xml);
  const ba = first(first(so, 'ALLINVENTORYENTRIES.LIST'), 'BATCHALLOCATIONS.LIST');
  assert.equal(first(ba, 'ORDERNO').text, 'SO-003');
  assert.equal(first(ba, 'ORDERDUEDATE').text, '15-Oct-2026');
  assert.equal(first(ba, 'ORDERDUEDATE').attrs.JOBDATE, '20261015');
  const q = voucherOf(built['quotation.valid.json'].xml);
  assert.equal(first(q, 'NARRATION').text, '[Valid till 2026-10-24]');
  assert.equal(q.attrs.VCHTYPE, 'Sales Quotation');
}
ok('delivery note, stock journal (destination flagged), order (order no and due date), quotation (valid till kept)');

// 6. follow-up hints for Phase 29, alter seam, determinism, escaping, flags
{
  const r = built['invoice.inter_state_einvoice.valid.json'];
  assert.equal(r.followUp.einvoice, true);
  assert.deepEqual(r.followUp.eway, { transporter_id: undefined, vehicle_no: 'KA01AB1234', distance_km: 900, mode: 'road' });
  assert.equal(built['invoice.valid.json'].followUp.eway, null);
  const p = j('entry_examples/receipt.valid.json');
  assert.throws(() => B.buildVoucherImport(p, lk, { action: 'Alter' }), (e) => e.detail === 'PAYLOAD_INVALID');
  const a = voucherOf(B.buildVoucherImport(p, lk, { action: 'Alter', masterId: '777' }).xml);
  assert.equal(a.attrs.ACTION, 'Alter');
  assert.equal(a.attrs.TAGNAME, 'MASTER ID');
  assert.equal(a.attrs.TAGVALUE, '777');
  assert.equal(B.buildVoucherImport(p, lk).xml, B.buildVoucherImport(JSON.parse(JSON.stringify(p)), lk).xml);
  const e = JSON.parse(JSON.stringify(p));
  e.data.narration = 'A & B <x> "q" \u0001end';
  const x = B.buildVoucherImport(e, lk).xml;
  assert.ok(x.includes('A &amp; B &lt;x&gt;'));
  assert.ok(!x.includes('\u0001'));
  assert.equal(voucherOf(x).children.find((c) => c.name === 'NARRATION').text.startsWith('A & B <x>'), true);
  assert.throws(() => B.buildVoucherImport(j('entry_examples/invoice.valid.json'), lk, {}, { entries: false }), (er) => er.detail === 'FLAG_DISABLED');
  assert.throws(() => B.buildVoucherImport(j('entry_examples/invoice.inter_state_einvoice.valid.json'), lk, {}, { entries: true }), (er) => er.detail === 'FLAG_DISABLED');
}
ok('followUp hints, Alter attributes, deterministic bytes, escaping and illegal characters, flags');

// 7. invalid payloads never produce XML and carry the expected detail
{
  for (const e of idx.filter((x) => x.expect !== 'valid')) {
    const p = j(`entry_examples/${e.file}`);
    assert.throws(() => B.buildVoucherImport(p, lk, {}, FLAGS), (er) => er.name === 'BuildError' && er.detail === e.expect, e.file);
  }
  const p = j('entry_examples/invoice.valid.json');
  const w = JSON.parse(JSON.stringify(p));
  w.company_guid = 'someone-else';
  assert.throws(() => B.buildVoucherImport(w, lk), (er) => er.detail === 'COMPANY_MISMATCH');
  const d = JSON.parse(JSON.stringify(p));
  d.data.date = '2028-01-01';
  assert.throws(() => B.buildVoucherImport(d, lk), (er) => er.detail === 'DATE_OUT_OF_PERIOD');
  const m = JSON.parse(JSON.stringify(p));
  m.data.lines[0].stock_item_guid = 'nope';
  assert.throws(() => B.buildVoucherImport(m, lk), (er) => er.detail === 'STOCK_ITEM_NOT_FOUND');
  const u = JSON.parse(JSON.stringify(p));
  u.data.surprise = 1;
  assert.throws(() => B.buildVoucherImport(u, lk), (er) => er.detail === 'PAYLOAD_INVALID');
  const b = JSON.parse(JSON.stringify(p));
  b.data.base_kind = 'purchase';
  assert.throws(() => B.buildVoucherImport(b, lk), (er) => er.detail === 'VOUCHER_TYPE_MISMATCH');
}
ok('invalid examples and mutated payloads throw BuildError with the expected detail (company, period, missing item, unknown key, base kind)');

// 8. exact decimal rules (CALC_SPECS section 10)
{
  const D2 = R('src/main/entries/builders/decimal.js');
  assert.equal(D2.canon(D2.round(D2.dec('2.345'), 2)), '2.35');
  assert.equal(D2.canon(D2.round(D2.dec('-2.345'), 2)), '-2.35');
  assert.equal(D2.canon(D2.round(D2.dec('0.005'), 2)), '0.01');
  assert.equal(D2.canon(B.lineAmount('3', '33.333', '10')), '90.00');
  assert.equal(D2.canon(B.lineAmount('20', '83.00')), '1660.00');
  assert.equal(D2.qtyText(D2.dec('2.5000')), '2.5');
  assert.equal(D2.qtyText(D2.dec('20')), '20');
  const t = B.computeTax([{ taxable: D2.dec('2120.00'), gst: D2.dec('12.00'), cess: D2.dec('0') }, { taxable: D2.dec('1660.00'), gst: D2.dec('18.00'), cess: D2.dec('0') }], [], true);
  assert.equal(D2.canon(t.cgst.amount), '276.60');
  assert.equal(D2.canon(t.sgst.amount), '276.60');
}
ok('decimal rounding half away from zero, line amount, intra-state tax recomputation');

console.log(`\nentry-builders: ${n} checks passed`);
fs.rmSync(out, { recursive: true, force: true });
