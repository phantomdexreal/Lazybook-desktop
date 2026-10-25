// Node-level check for Phase 11: vouchers pulled through the Tally client and mapped equal docs/shared/fixtures/tables/tx_* (WIRE-01).
// Run: NODE_PATH=<dir containing typescript> node tests/tally-vouchers.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-vouchers');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/tally', 'src/main/tally/masters', 'src/main/tally/vouchers', 'src/shared']) {
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
const V = require(path.join(out, 'src/main/tally/vouchers/index.js'));

const FX = 'docs/shared/fixtures';
const table = (t) => JSON.parse(fs.readFileSync(`${FX}/tables/${t}.json`, 'utf8'));
const company = table('tm_company')[0];
const mkClient = (port) => C.createTallyClient({ getTarget: () => ({ host: '127.0.0.1', port }), backoffMs: 1, retries: 0 });
const fake = (handler) => new Promise((resolve) => {
  const s = http.createServer((req, res) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => handler(Buffer.concat(c).toString('utf8'), res)); });
  s.listen(0, '127.0.0.1', () => resolve({ server: s, port: s.address().port }));
});
const TX = ['tx_voucher', 'tx_ledger_line', 'tx_inventory_line', 'tx_batch_alloc', 'tx_bill_alloc', 'tx_tax_line'];
const sortBy = (rows, keys) => [...rows].sort((a, b) => keys.map((k) => String(a[k]).padStart(8, '0')).join('|').localeCompare(keys.map((k) => String(b[k]).padStart(8, '0')).join('|')));

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-vo-'));
  initLogger({ dir: path.join(tmp, 'logs') });
  const masterTables = Object.fromEntries(Object.keys(M.MASTER_TABLES).map((t) => [t, table(t)]));

  // request shape
  const rq = V.buildVoucherRequest();
  assert.equal(rq.id, 'LBVouchers');
  assert.equal(rq.type, 'Voucher');
  assert.ok(['GUID', 'ALTERID', 'MASTERID', 'VOUCHERNUMBER', 'PARTYLEDGERNAME'].every((f) => rq.fields.includes(f)));
  assert.ok(!rq.fields.some((f) => f.startsWith('@') || f.includes('/') || f.endsWith('.LIST')));
  for (const l of ['ALLLEDGERENTRIES.LIST', 'ALLINVENTORYENTRIES.LIST', 'INVENTORYENTRIESIN.LIST', 'BATCHALLOCATIONS.LIST', 'BILLALLOCATIONS.LIST', 'ACCOUNTINGALLOCATIONS.LIST']) assert.ok(rq.fetch.includes(l), l);
  X.parseXml(X.buildCollectionRequest({ name: rq.id, type: rq.type, fields: rq.fields, fetch: rq.fetch, filters: [{ name: 'LBChanged', formula: '$AlterID > 5' }], company: 'C', fromDate: '20260401', toDate: '20270331' }));

  // 1. full pull over real HTTP against the mock Tally: all six tables equal the fixtures (WIRE-01)
  const mock = await import('../tools/mock-tally/server.mjs');
  const srv = mock.startMockTally(0);
  await new Promise((r) => srv.once('listening', r));
  const mk = (port) => V.createVouchers({
    client: mkClient(port), getCompanyName: () => 'Demo Traders Pvt Ltd', getCompanyGuid: () => company.guid,
    getCompanyState: () => company.state_name, getMasters: () => masterTables,
  });
  const v1 = mk(srv.address().port);
  const full = await v1.pull({ from: '2026-04-01', to: '2027-03-31' });
  assert.equal(full.mode, 'full');
  for (const t of TX) {
    const exp = table(t);
    assert.equal(full.tables[t].length, exp.length, `${t}: row count`);
    assert.deepEqual(full.tables[t], exp, `${t}: rows equal fixtures/tables/${t}.json`);
    if (exp.length) assert.deepEqual(Object.keys(full.tables[t][0]), Object.keys(exp[0]), `${t}: column order`);
  }
  assert.equal(full.counts.tx_voucher, 52);
  assert.equal(full.maxAlterId, Math.max(...table('tx_voucher').map((v) => v.alter_id)));
  assert.equal(full.guids.length, 52);
  // day-book style total: sum of headline amounts of vouchers that count in books equals the fixture's
  const total = (rows) => rows.filter((v) => v.counts_in_books).reduce((s, v) => s + Math.round(parseFloat(v.amount) * 100), 0);
  assert.equal(total(full.tables.tx_voucher), total(table('tx_voucher')));
  // window is enforced client side too
  const narrow = await v1.pull({ from: '2026-09-01', to: '2026-09-30' });
  assert.ok(narrow.tables.tx_voucher.length > 0 && narrow.tables.tx_voucher.length < 52);
  assert.ok(narrow.tables.tx_voucher.every((v) => v.date >= '2026-09-01' && v.date <= '2026-09-30'));
  assert.ok(narrow.tables.tx_ledger_line.every((l) => narrow.guids.includes(l.voucher_guid)));
  srv.close();

  // 2. incremental: a fake Tally honouring "$AlterID > N" and the date window; one voucher edited
  const xml = fs.readFileSync(`${FX}/tally_xml/vouchers.xml`, 'utf8');
  const head = xml.slice(0, xml.indexOf('<VOUCHER '));
  const tail = xml.slice(xml.lastIndexOf('</VOUCHER>') + '</VOUCHER>'.length);
  let blocks = xml.match(/<VOUCHER [\s\S]*?<\/VOUCHER>/g);
  assert.equal(blocks.length, 52);
  const alterOf = (b) => Number(/<ALTERID>(\d+)<\/ALTERID>/.exec(b)[1]);
  const guidOf = (b) => /<GUID>([^<]+)<\/GUID>/.exec(b)[1];
  const seen = [];
  const s2 = await fake((b, res) => {
    const m = /\$AlterID &gt; (\d+)|\$AlterID > (\d+)/.exec(b);
    const above = m ? Number(m[1] ?? m[2]) : -1;
    seen.push({ above, from: /<SVFROMDATE>(\d+)/.exec(b)?.[1], to: /<SVTODATE>(\d+)/.exec(b)?.[1] });
    res.end(head + blocks.filter((x) => alterOf(x) > above).join('\n') + tail);
  });
  const v2 = mk(s2.port);
  const cursor = full.maxAlterId;
  const none = await v2.pull({ from: '2026-04-01', to: '2027-03-31', sinceAlterId: cursor });
  assert.equal(none.mode, 'incremental');
  assert.equal(none.tables.tx_voucher.length, 0, 'nothing changed: nothing pulled');
  assert.equal(none.maxAlterId, cursor);
  assert.deepEqual(seen[0], { above: cursor, from: '20260401', to: '20270331' });
  // edit one voucher in Tally: its AlterID moves and its narration changes
  const target = blocks.find((b) => /<NARRATION>/.test(b) && /<ISINVOICE>Yes/.test(b)) ?? blocks[10];
  const tg = guidOf(target);
  blocks = blocks.map((b) => (b === target ? b.replace(/<ALTERID>\d+<\/ALTERID>/, `<ALTERID>${cursor + 1}</ALTERID>`).replace(/<NARRATION>[^<]*<\/NARRATION>/, '<NARRATION>edited in tally</NARRATION>') : b));
  const inc = await v2.pull({ from: '2026-04-01', to: '2027-03-31', sinceAlterId: cursor });
  assert.deepEqual(inc.guids, [tg], 'incremental pull picks exactly the edited voucher');
  assert.equal(inc.tables.tx_voucher[0].alter_id, cursor + 1);
  assert.equal(inc.maxAlterId, cursor + 1);
  assert.ok(inc.tables.tx_ledger_line.length > 0 && inc.tables.tx_ledger_line.every((l) => l.voucher_guid === tg));
  const expTarget = table('tx_ledger_line').filter((l) => l.voucher_guid === tg);
  assert.deepEqual(inc.tables.tx_ledger_line, expTarget, 'children of the edited voucher keep stable composite keys');
  // lookback: an edit that kept an old AlterID is still found by the date re-read
  const old = blocks.find((b) => guidOf(b) !== tg && /<DATE>20260929<\/DATE>|<DATE>20260930<\/DATE>/.test(b));
  assert.ok(old, 'fixture has a voucher in the last days');
  const og = guidOf(old);
  blocks = blocks.map((b) => (b === old ? b.replace(/<NARRATION>[^<]*<\/NARRATION>|(?=<\/VOUCHER>)/, '<NARRATION>quiet edit</NARRATION>') : b));
  seen.length = 0;
  const lb = await v2.pull({ from: '2026-04-01', to: '2027-03-31', sinceAlterId: cursor + 1, lookbackDays: 7, today: '2026-09-30' });
  assert.ok(lb.guids.includes(og), 'lookback re-read finds a voucher whose AlterID did not move');
  assert.deepEqual(seen.map((x) => [x.above, x.from, x.to]), [[cursor + 1, '20260401', '20270331'], [-1, '20260923', '20260930']]);
  assert.ok(lb.guids.every((g, i, a) => a.indexOf(g) === i), 'no duplicate vouchers');
  s2.server.close();

  // 3. errors: window, selection, missing record/masters; Tally error leaves no partial result
  const base = { client: mkClient(1), getCompanyState: () => '', getMasters: () => masterTables };
  await assert.rejects(V.createVouchers({ ...base, getCompanyName: () => 'C', getCompanyGuid: () => 'g' }).pull({ from: '2026-05-01', to: '2026-04-01' }), /Invalid voucher date window/);
  await assert.rejects(V.createVouchers({ ...base, getCompanyName: () => null, getCompanyGuid: () => 'g' }).pull({ from: '2026-04-01', to: '2027-03-31' }), /No company selected/);
  await assert.rejects(V.createVouchers({ ...base, getCompanyName: () => 'C', getCompanyGuid: () => null }).pull({ from: '2026-04-01', to: '2027-03-31' }), /Company record not read yet/);
  await assert.rejects(V.createVouchers({ ...base, getMasters: () => null, getCompanyName: () => 'C', getCompanyGuid: () => 'g' }).pull({ from: '2026-04-01', to: '2027-03-31' }), /Masters not pulled yet/);
  const s3 = await fake((b, res) => res.end('<RESPONSE><LINEERROR>Boom</LINEERROR></RESPONSE>'));
  const v3 = V.createVouchers({ ...base, client: mkClient(s3.port), getCompanyName: () => 'C', getCompanyGuid: () => 'g' });
  await assert.rejects(v3.pull({ from: '2026-04-01', to: '2027-03-31' }));
  assert.equal(v3.last(), null);
  s3.server.close();

  // 4. mapper edge cases: unresolved names, cancelled, intra vs inter state GST, stock journal direction, exact rounding
  const mapped = V.mapVouchers({
    rows: X.collectionRows(`<ENVELOPE><BODY><DATA><COLLECTION>
      <VOUCHER VCHTYPE="Zzz"><GUID>v1</GUID><ALTERID>9</ALTERID><VOUCHERTYPENAME>Nope</VOUCHERTYPENAME><DATE>20260915</DATE><ISCANCELLED>Yes</ISCANCELLED><PARTYLEDGERNAME>ghost</PARTYLEDGERNAME>
        <LEDGERENTRIES.LIST><LEDGERNAME>Ghost</LEDGERNAME><AMOUNT>-100</AMOUNT><ISPARTYLEDGER>Yes</ISPARTYLEDGER></LEDGERENTRIES.LIST></VOUCHER>
    </COLLECTION></DATA></BODY></ENVELOPE>`),
    companyGuid: 'cg', companyState: 'X', masters: { tm_voucher_type: [], tm_ledger: [], tm_stock_item: [], tm_godown: [], tm_stock_item_gst: [] },
  });
  const mv = mapped.tx_voucher[0];
  assert.equal(mv.kind, 'unknown');
  assert.equal(mv.voucher_type_guid, '');
  assert.equal(mv.party_guid, '');
  assert.equal(mv.amount, '0.00');
  assert.equal(mv.counts_in_books, false);
  assert.equal(mapped.tx_ledger_line[0].ledger_guid, '');
  assert.equal(mapped.tx_ledger_line[0].counts_in_books, false);
  assert.equal(mapped.tx_ledger_line[0].voucher_date, '2026-09-15');
  assert.equal(mapped.tx_tax_line.length, 0);

  // 5. logs carry counts only
  const log = fs.readFileSync(path.join(tmp, 'logs', 'lazybooks.log'), 'utf8').split('\n').filter((l) => /vouchers pulled/.test(l)).join('\n');
  assert.match(log, /vouchers pulled/);
  assert.ok(!/Alpha|Demo Traders|narration|edited in tally/i.test(log));
  console.log('tally-vouchers: all checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
