// Node-level check for Phase 12: deleted-voucher detection and rename fix-ups.
// Run: NODE_PATH=<dir containing typescript> node tests/tally-reconcile.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-reconcile');
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
const R = require(path.join(out, 'src/main/tally/reconcile.js'));
const M = require(path.join(out, 'src/main/tally/masters/index.js'));

const FX = 'docs/shared/fixtures';
const table = (t) => JSON.parse(fs.readFileSync(`${FX}/tables/${t}.json`, 'utf8'));
const company = table('tm_company')[0];
const mkClient = (port) => C.createTallyClient({ getTarget: () => ({ host: '127.0.0.1', port }), backoffMs: 1, retries: 0 });
const fake = (handler) => new Promise((resolve) => {
  const s = http.createServer((req, res) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => handler(Buffer.concat(c).toString('utf8'), res)); });
  s.listen(0, '127.0.0.1', () => resolve({ server: s, port: s.address().port }));
});
const TX = ['tx_voucher', 'tx_ledger_line', 'tx_inventory_line', 'tx_batch_alloc', 'tx_bill_alloc', 'tx_tax_line'];
const stored = () => Object.fromEntries(TX.map((t) => [t, table(t)]));
const refs = (v) => v.map((x) => ({ guid: x.guid, date: x.date }));

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-rc-'));
  initLogger({ dir: path.join(tmp, 'logs') });
  const W = { from: '2026-04-01', to: '2027-03-31' };

  // 1. nothing deleted: stored vouchers equal Tally's guid list (mock Tally over real HTTP)
  const mock = await import('../tools/mock-tally/server.mjs');
  const srv = mock.startMockTally(0);
  await new Promise((r) => srv.once('listening', r));
  const rc = R.createReconciler({ client: mkClient(srv.address().port), getCompanyName: () => 'Demo Traders Pvt Ltd', getCompanyGuid: () => company.guid });
  const vouchers = table('tx_voucher');
  const same = await rc.checkDeleted({ ...W, stored: refs(vouchers) });
  assert.deepEqual(same.deleted, []);
  assert.deepEqual(same.ops, []);
  assert.equal(same.tallyCount, 52);
  assert.equal(same.comparedCount, 52);

  // 2. a voucher that is in the vault but not in Tally is detected; cancelled/optional ones are still listed by Tally so stay
  const ghost = { guid: 'ghost-0001', date: '2026-08-15' };
  const one = await rc.checkDeleted({ ...W, stored: [...refs(vouchers), ghost] });
  assert.deepEqual(one.deleted, ['ghost-0001']);
  assert.deepEqual(one.ops.map((o) => [o.table_name, o.op]), [['tx_voucher', 'delete_children'], ['tx_voucher', 'delete']]);
  assert.deepEqual(one.ops[0].payload, [{ company_guid: company.guid, guid: 'ghost-0001' }]);
  assert.ok(vouchers.some((v) => v.is_cancelled) && !one.deleted.some((g) => vouchers.find((v) => v.guid === g)));
  // a stored voucher dated outside the window is not compared (moved out of the window is not "deleted")
  const out2 = await rc.checkDeleted({ from: '2026-09-01', to: '2026-09-30', stored: [{ guid: 'old-1', date: '2026-04-05' }, ...refs(vouchers)] });
  assert.ok(!out2.deleted.includes('old-1'));
  srv.close();

  // 3. delete a voucher in "Tally": ops equal the shared delta example (seq 7 and 8) and applying them removes the voucher and its children
  const delta = fs.readFileSync('docs/shared/sync_examples/delta_sequence.jsonl', 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  const gone = delta.find((d) => d.op === 'delete').payload[0].guid;
  const xml = fs.readFileSync(`${FX}/tally_xml/voucher_guid_list.xml`, 'utf8');
  const without = xml.replace(new RegExp(`\\s*<VOUCHER>\\s*<GUID>${gone}</GUID>[\\s\\S]*?</VOUCHER>`), '');
  assert.notEqual(without, xml);
  const s3 = await fake((b, res) => { assert.match(b, /<ID>LBVoucherGuids<\/ID>/); assert.match(b, /<SVFROMDATE>20260401/); res.end(without); });
  const rc3 = R.createReconciler({ client: mkClient(s3.port), getCompanyName: () => 'C', getCompanyGuid: () => company.guid });
  const del = await rc3.checkDeleted({ ...W, stored: refs(vouchers) });
  assert.deepEqual(del.deleted, [gone]);
  assert.deepEqual(del.ops.map((o) => o.payload), [delta.find((d) => d.op === 'delete_children' && d.payload[0].guid === gone).payload, delta.find((d) => d.op === 'delete').payload]);
  const after = R.removeVouchers(stored(), del.deleted);
  assert.equal(after.tx_voucher.length, 51);
  assert.ok(TX.slice(1).every((t) => after[t].every((r) => r.voucher_guid !== gone)));
  assert.ok(stored().tx_ledger_line.some((r) => r.voucher_guid === gone), 'the voucher had children');
  assert.equal(after.tx_ledger_line.length, table('tx_ledger_line').filter((r) => r.voucher_guid !== gone).length);

  s3.server.close();

  // 4. safety: empty answer is not "delete everything"; Tally errors delete nothing
  const sEmpty = await fake((b, res) => res.end('<ENVELOPE><BODY><DATA><COLLECTION /></DATA></BODY></ENVELOPE>'));
  const rcE = R.createReconciler({ client: mkClient(sEmpty.port), getCompanyName: () => 'C', getCompanyGuid: () => 'g' });
  await assert.rejects(rcE.checkDeleted({ ...W, stored: refs(vouchers) }), (e) => e.code === 'RECONCILE_EMPTY_ANSWER');
  assert.deepEqual((await rcE.checkDeleted({ ...W, stored: [] })).deleted, []);
  assert.equal((await rcE.checkDeleted({ ...W, stored: refs(vouchers), allowEmpty: true })).deleted.length, 52);
  sEmpty.server.close();
  const sErr = await fake((b, res) => res.end('<RESPONSE><LINEERROR>Boom</LINEERROR></RESPONSE>'));
  await assert.rejects(R.createReconciler({ client: mkClient(sErr.port), getCompanyName: () => 'C', getCompanyGuid: () => 'g' }).checkDeleted({ ...W, stored: refs(vouchers) }));
  sErr.server.close();
  const bad = { client: mkClient(1), getCompanyName: () => 'C', getCompanyGuid: () => 'g' };
  await assert.rejects(R.createReconciler(bad).checkDeleted({ from: '2027-01-01', to: '2026-01-01', stored: [] }), /Invalid voucher date window/);
  await assert.rejects(R.createReconciler({ ...bad, getCompanyName: () => null }).checkDeleted({ ...W, stored: [] }), /No company selected/);
  await assert.rejects(R.createReconciler({ ...bad, getCompanyGuid: () => null }).checkDeleted({ ...W, stored: [] }), /Company record not read yet/);

  // 5. schedule helper
  const H = 3600_000;
  assert.equal(R.deletedCheckDue({ lastCheckedAt: null, now: 1 }), true);
  assert.equal(R.deletedCheckDue({ lastCheckedAt: 0, now: 23 * H }), false);
  assert.equal(R.deletedCheckDue({ lastCheckedAt: 0, now: 24 * H }), true);
  assert.equal(R.deletedCheckDue({ lastCheckedAt: 0, now: 1, manual: true }), true);

  // 6. renames: Gamma ledger renamed (the shared delta example), guid unchanged
  const oldM = Object.fromEntries(Object.keys(M.MASTER_TABLES).map((t) => [t, table(t)]));
  const newM = JSON.parse(JSON.stringify(oldM));
  const gammaGuid = delta.find((d) => d.table_name === 'tm_ledger' && d.payload.length === 1).payload[0].guid;
  const gl = newM.tm_ledger.find((l) => l.guid === gammaGuid);
  const oldName = gl.name;
  gl.name = 'Gamma Enterprises Ltd';
  gl.name_lc = 'gamma enterprises ltd';
  const gd = newM.tm_stock_item[0];
  const gdOld = gd.name;
  gd.name = 'Item Renamed';
  newM.tm_godown[0].name = 'Renamed Godown'; // fallback-guid (n:) master: identity changes, so it is not reported as a rename
  newM.tm_unit.push({ ...newM.tm_unit[0], guid: 'n:new', name: 'Box' }); // new master is not a rename
  const fallback = newM.tm_employee[0]; // fallback guid rows are skipped
  const renames = R.detectRenames(oldM, newM);
  assert.deepEqual(renames.map((r) => [r.table, r.oldName, r.newName]), [['tm_ledger', oldName, 'Gamma Enterprises Ltd'], ['tm_stock_item', gdOld, 'Item Renamed']]);
  void fallback;
  assert.deepEqual(R.detectRenames(oldM, oldM), []);
  const st = stored();
  const fix = R.applyRenames(st, renames);
  const usesGamma = (rows, col) => rows.filter((r) => r[col] === gammaGuid).length;
  assert.ok(usesGamma(st.tx_voucher, 'party_guid') > 0 && usesGamma(st.tx_ledger_line, 'ledger_guid') > 0);
  assert.ok(fix.tables.tx_voucher.filter((r) => r.party_guid === gammaGuid).every((r) => r.party_name === 'Gamma Enterprises Ltd'));
  assert.ok(fix.tables.tx_ledger_line.filter((r) => r.ledger_guid === gammaGuid).every((r) => r.ledger_name === 'Gamma Enterprises Ltd'));
  assert.ok(fix.tables.tx_bill_alloc.filter((r) => r.ledger_guid === gammaGuid).every((r) => r.ledger_name === 'Gamma Enterprises Ltd'));
  assert.ok(st.tx_inventory_line.some((r) => r.stock_item_guid === gd.guid));
  assert.ok(fix.tables.tx_inventory_line.filter((r) => r.stock_item_guid === gd.guid).every((r) => r.stock_item_name === 'Item Renamed'));
  assert.equal(st.tx_voucher.find((v) => v.party_guid === gammaGuid).party_name, oldName, 'input not mutated');
  // only name columns change; nothing else differs
  for (const t of TX) fix.tables[t].forEach((r, i) => { const a = { ...r }, b = { ...st[t][i] }; for (const k of ['party_name', 'ledger_name', 'stock_item_name']) { delete a[k]; delete b[k]; } assert.deepEqual(a, b); });
  assert.ok(fix.ops.every((o) => o.op === 'upsert'));
  assert.deepEqual(fix.ops.map((o) => o.table_name), TX.filter((t) => fix.ops.some((o) => o.table_name === t)));
  const changedCount = fix.ops.reduce((n, o) => n + o.payload.length, 0);
  assert.ok(changedCount > 0);
  assert.ok(fix.affectedVouchers.length > 0 && fix.affectedVouchers.every((g) => st.tx_voucher.some((v) => v.guid === g)));
  assert.deepEqual(R.applyRenames(st, []).ops, []);
  assert.deepEqual(R.applyRenames(fix.tables, renames).ops, [], 'idempotent');

  // 7. logs: counts only
  const log = fs.readFileSync(path.join(tmp, 'logs', 'lazybooks.log'), 'utf8').split('\n').filter((l) => /deleted check/.test(l)).join('\n');
  assert.match(log, /deleted check/);
  assert.ok(!/ghost-0001|Gamma|Demo Traders/.test(log));
  console.log('tally-reconcile: all checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
