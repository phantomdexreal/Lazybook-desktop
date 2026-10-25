// Node-level check for Phase 13: closing balances read from Tally and applied as upserts.
// Run: NODE_PATH=<dir containing typescript> node tests/tally-closing.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-closing');
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
const CL = require(path.join(out, 'src/main/tally/closing.js'));

const FX = 'docs/shared/fixtures';
const table = (t) => JSON.parse(fs.readFileSync(`${FX}/tables/${t}.json`, 'utf8'));
const mkClient = (port) => C.createTallyClient({ getTarget: () => ({ host: '127.0.0.1', port }), backoffMs: 1, retries: 0 });
const fake = (handler) => new Promise((resolve) => {
  const s = http.createServer((req, res) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => handler(Buffer.concat(c).toString('utf8'), res)); });
  s.listen(0, '127.0.0.1', () => resolve({ server: s, port: s.address().port }));
});
const stored = () => ({ tm_group: table('tm_group'), tm_ledger: table('tm_ledger'), tm_stock_item: table('tm_stock_item') });
const AS_OF = '2026-09-30';

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-cl-'));
  initLogger({ dir: path.join(tmp, 'logs') });
  const mock = await import('../tools/mock-tally/server.mjs');
  const srv = mock.startMockTally(0);
  await new Promise((r) => srv.once('listening', r));
  const client = mkClient(srv.address().port);
  const closing = CL.createClosing({ client, getCompanyName: () => 'Demo Traders Pvt Ltd', getAsOf: () => AS_OF });

  // 1. read through the mock Tally (real HTTP): counts equal the fixtures
  const reading = await closing.read();
  const fx = stored();
  assert.equal(reading.groups.length, fx.tm_group.length);
  assert.equal(reading.ledgers.length, fx.tm_ledger.length);
  assert.equal(reading.stock.length, fx.tm_stock_item.length);
  assert.equal(reading.asOf, AS_OF);
  assert.equal(closing.last(), reading);

  // 2. applying the reading to the fixture masters changes nothing: every closing figure equals Tally's
  const same = CL.applyClosing(fx, reading);
  assert.deepEqual(same.ops, []);
  assert.deepEqual(same.changed, { tm_group: 0, tm_ledger: 0, tm_stock_item: 0 });
  assert.deepEqual(same.unmatched, { tm_group: 0, tm_ledger: 0, tm_stock_item: 0 });
  assert.deepEqual(same.tables, stored());

  // 3. stale stored closing figures are corrected by upserts equal to the fixture rows (full rows, table order)
  const stale = stored();
  stale.tm_ledger.find((l) => l.name === 'HDFC Bank').closing_balance = '-1.00';
  stale.tm_group.find((g) => g.name === 'Bank Accounts').closing_balance = '-1.00';
  stale.tm_stock_item.find((s) => s.name === 'Widget A').closing_qty = '1.00';
  stale.tm_stock_item.find((s) => s.name === 'Widget A').closing_rate = '0.00';
  const snapshot = JSON.stringify(stale);
  const fix = CL.applyClosing(stale, reading);
  assert.equal(JSON.stringify(stale), snapshot, 'input not mutated');
  assert.deepEqual(fix.ops.map((o) => [o.table_name, o.op, o.payload.length]), [['tm_group', 'upsert', 1], ['tm_ledger', 'upsert', 1], ['tm_stock_item', 'upsert', 1]]);
  assert.deepEqual(fix.ops[0].payload[0], fx.tm_group.find((g) => g.name === 'Bank Accounts'));
  assert.deepEqual(fix.ops[1].payload[0], fx.tm_ledger.find((l) => l.name === 'HDFC Bank'));
  assert.deepEqual(fix.ops[2].payload[0], fx.tm_stock_item.find((s) => s.name === 'Widget A'));
  assert.deepEqual(fix.tables, stored());
  // repeat application is idempotent
  assert.deepEqual(CL.applyClosing(fix.tables, reading).ops, []);
  // force re-sends every matched row
  const forced = CL.applyClosing(fx, reading, { force: true });
  assert.equal(forced.ops.reduce((n, o) => n + o.payload.length, 0), fx.tm_group.length + fx.tm_ledger.length + fx.tm_stock_item.length);

  // 4. shared delta example: closing_balance change of Alpha Retail / HDFC Bank / Key Customers
  const delta = fs.readFileSync('docs/shared/sync_examples/delta_sequence.jsonl', 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  const dLedger = delta.find((d) => d.seq === 5).payload;
  const dGroup = delta.find((d) => d.seq === 6).payload;
  const moved = stored();
  const upd = (rows, name, v) => { rows.find((r) => r.name === name).closing_balance = v; };
  const lookup = Object.fromEntries(dLedger.map((r) => [r.name, r.closing_balance]));
  for (const [n, v] of Object.entries(lookup)) upd(moved.tm_ledger, n, v);
  for (const g of dGroup) upd(moved.tm_group, g.name, g.closing_balance);
  const reading2 = { ...reading, ledgers: reading.ledgers.map((l) => (lookup[l.name] ? { ...l, closing_balance: lookup[l.name] } : l)), groups: reading.groups.map((g) => { const d = dGroup.find((x) => x.name === g.name); return d ? { ...g, closing_balance: d.closing_balance } : g; }) };
  const dres = CL.applyClosing(stored(), reading2);
  assert.deepEqual(dres.tables.tm_ledger, moved.tm_ledger);
  assert.deepEqual(dres.tables.tm_group, moved.tm_group);
  for (const l of dLedger) assert.equal(dres.tables.tm_ledger.find((r) => r.guid === l.guid).closing_balance, l.closing_balance);

  // 5. unmatched Tally rows are counted, not invented
  const fewer = stored();
  fewer.tm_ledger = fewer.tm_ledger.slice(1);
  assert.equal(CL.applyClosing(fewer, reading).unmatched.tm_ledger, 1);

  // 6. balance totals: root-group closing sums equal the sums of the fixture groups (Tally's own figures)
  const t = CL.groupTotalsByNature(fix.tables.tm_group);
  const t0 = CL.groupTotalsByNature(fx.tm_group);
  assert.deepEqual(t, t0);
  assert.ok(Object.keys(t.byNature).length >= 2);

  // 7. GST summary inputs come from duty ledger closings grouped by gst_duty_head (never by name)
  const gst = CL.gstSummaryInputs(fix.tables.tm_ledger);
  assert.deepEqual(Object.keys(gst.heads).sort(), ['Central Tax', 'Integrated Tax', 'State Tax']);
  assert.equal(gst.heads['Central Tax'].credit, '2740.20');
  assert.equal(gst.heads['Central Tax'].debit, '3486.15');
  assert.equal(gst.heads['Central Tax'].net, '-745.95');
  assert.equal(gst.heads['Integrated Tax'].net, '362.20');
  assert.equal(gst.heads['Central Tax'].ledgers, 2);
  assert.deepEqual(CL.gstSummaryInputs([{ gst_duty_head: '', closing_balance: '5.00' }]).heads, {});

  // 8. on-account balances: only bills Tally marks On Account, summed per ledger (assumed tag; fixtures have none)
  assert.deepEqual(reading.onAccount, []);
  const mapped = CL.mapClosing({
    groups: [], stock: [], asOf: AS_OF,
    ledgers: [{ '@NAME': 'Alpha', GUID: 'g1', CLOSINGBALANCE: '-100.00', 'BILLALLOCATIONS.LIST': [
      { BILLTYPE: 'On Account', AMOUNT: '-30.50' }, { BILLTYPE: 'On Account', CLOSINGBALANCE: '-10.00' }, { BILLTYPE: 'Agst Ref', AMOUNT: '-5.00' }] }],
  });
  assert.deepEqual(mapped.onAccount, [{ ledger_guid: 'g1', ledger_name: 'Alpha', amount: '-40.50' }]);

  // 9. schedule helper
  const H = 3600_000;
  assert.equal(CL.closingDue({ lastRefreshedAt: null, now: 1 }), true);
  assert.equal(CL.closingDue({ lastRefreshedAt: 0, now: 23 * H }), false);
  assert.equal(CL.closingDue({ lastRefreshedAt: 0, now: 24 * H }), true);
  assert.equal(CL.closingDue({ lastRefreshedAt: 0, now: 1, syncChangedVouchers: true }), true);

  // 10. request shape and one-at-a-time order; failure aborts with no partial result
  const seen = [];
  const f1 = await fake((body, res) => { seen.push(/<ID>([^<]+)<\/ID>/.exec(body)[1]); res.end('<ENVELOPE><BODY><DATA><COLLECTION></COLLECTION></DATA></BODY></ENVELOPE>'); });
  const c1 = CL.createClosing({ client: mkClient(f1.port), getCompanyName: () => 'X' });
  const empty = await c1.read();
  assert.deepEqual(seen, ['LBClosingGroups', 'LBClosingLedgers', 'LBClosingStock']);
  assert.equal(empty.groups.length + empty.ledgers.length + empty.stock.length, 0);
  f1.server.close();
  let n = 0;
  const f2 = await fake((body, res) => { n++; if (n === 2) res.end('<ENVELOPE><LINEERROR>Boom</LINEERROR></ENVELOPE>'); else res.end('<ENVELOPE><BODY><DATA><COLLECTION></COLLECTION></DATA></BODY></ENVELOPE>'); });
  const c2 = CL.createClosing({ client: mkClient(f2.port), getCompanyName: () => 'X' });
  await assert.rejects(() => c2.read());
  assert.equal(c2.last(), null);
  f2.server.close();
  await assert.rejects(() => CL.createClosing({ client, getCompanyName: () => null }).read(), /No company selected/);

  // 11. logs carry counts only (no names or guids)
  const log = fs.readdirSync(path.join(tmp, 'logs')).map((f) => fs.readFileSync(path.join(tmp, 'logs', f), 'utf8')).join('');
  assert.ok(log.includes('closing read'));
  assert.ok(!log.includes('HDFC') && !log.includes(fx.tm_ledger[0].guid));

  srv.close();
  fs.rmSync(out, { recursive: true, force: true });
  console.log('tally-closing: all checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
