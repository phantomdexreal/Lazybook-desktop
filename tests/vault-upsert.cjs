// Node-level check for Phase 16: idempotent upserts, row hash + seq, tombstones, delta ("changed since"), per-device cursors.
// Run: NODE_PATH=<dir with typescript and better-sqlite3> node tests/vault-upsert.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-upsert');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/db']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
fs.mkdirSync(path.join(out, 'docs/shared'), { recursive: true });
fs.copyFileSync('docs/shared/data_model.json', path.join(out, 'docs/shared/data_model.json'));
const { initLogger } = require(path.join(out, 'src/main/logger.js'));
const V = require(path.join(out, 'src/main/db/index.js'));
const model = JSON.parse(fs.readFileSync('docs/shared/data_model.json', 'utf8'));
const SE = 'docs/shared/sync_examples';
const FX = 'docs/shared/fixtures/tables';
const jsonl = (f) => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-upsert-'));
initLogger({ dir: path.join(tmp, 'logs'), maxBytes: 1e6, keepFiles: 2 });
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const syncTables = model.tables_order.filter((t) => t !== 'ref_voucher_kind');
const asOps = (seq) => seq.map((c) => ({ table_name: c.table_name, op: c.op, payload: c.payload }));
const key = (t, r) => JSON.stringify(model.tables[t].primary_key.map((k) => r[k]));
const dump = (v) => {
  const o = {};
  for (const t of syncTables) o[t] = Object.fromEntries(v.readTable(t).map((r) => [key(t, r), r]));
  return o;
};
const total = (res) => res.inserted + res.updated + res.deleted;

// 1. initial sequence (clear + upserts) builds the vault; equals the fixtures
const A = V.openVault({ dir: path.join(tmp, 'a') });
const init = jsonl(`${SE}/initial_sequence.jsonl`);
const r1 = A.applyOps(asOps(init));
assert.equal(r1.seq, 1);
for (const t of syncTables) {
  const fx = JSON.parse(fs.readFileSync(`${FX}/${t}.json`, 'utf8'));
  const back = A.readTable(t);
  assert.equal(back.length, fx.length, t);
  const m = new Map(back.map((r) => [key(t, r), r]));
  for (const r of fx) assert.deepEqual(m.get(key(t, r)), r, t);
}
ok(`initial sequence applied in one transaction (seq 1, ${r1.inserted} rows), equals the fixtures`);

// 2. replay of the same pull changes nothing: no rows, no seq, no state change
const stateBefore = A.db.prepare('SELECT COUNT(*) c, SUM(updated_seq) s FROM _lb_row_state').get();
const r2 = A.applyOps(asOps(init.filter((c) => c.op === 'upsert')));
assert.equal(r2.seq, null);
assert.equal(r2.inserted + r2.updated + r2.deleted, 0);
assert.equal(r2.unchanged, r1.inserted);
assert.equal(A.headSeq(), 1);
assert.deepEqual(A.db.prepare('SELECT COUNT(*) c, SUM(updated_seq) s FROM _lb_row_state').get(), stateBefore);
for (const t of syncTables) A.upsert(t, JSON.parse(fs.readFileSync(`${FX}/${t}.json`, 'utf8')));
assert.equal(A.headSeq(), 1);
const cs = A.changedSince(1);
assert.equal([...cs.batches].length, 0);
ok('replaying the same pull: 0 changes, seq unchanged, changedSince(head) is empty');

// 3. a single changed row bumps exactly that row
const led = A.readTable('tm_ledger')[0];
const r3 = A.upsert('tm_ledger', [{ ...led, name: led.name + ' X' }]);
assert.deepEqual([r3.inserted, r3.updated, r3.unchanged, r3.seq], [0, 1, 0, 2]);
const d3 = [...A.changedSince(1).batches];
assert.equal(d3.length, 1);
assert.equal(d3[0].table_name, 'tm_ledger');
assert.equal(d3[0].op, 'upsert');
assert.equal(d3[0].payload.length, 1);
assert.equal(d3[0].payload[0].name, led.name + ' X');
assert.equal(A.upsert('tm_ledger', [{ ...led, name: led.name + ' X' }]).seq, null);
ok('one edited row: updated 1, seq 2, delta holds exactly that row, same edit again is a no-op');

// 4. delete -> tombstone in the delta; re-upsert flips it live
const gone = { company_guid: led.company_guid, guid: led.guid };
const r4 = A.deleteRows('tm_ledger', [gone]);
assert.equal(r4.deleted, 1);
assert.equal(A.deleteRows('tm_ledger', [gone]).seq, null);
const d4 = [...A.changedSince(2).batches];
assert.deepEqual(d4.map((b) => [b.table_name, b.op, b.payload.length]), [['tm_ledger', 'delete', 1]]);
assert.deepEqual(d4[0].payload[0], gone);
const d4b = [...A.changedSince(1).batches];
assert.deepEqual(d4b.map((b) => [b.op, b.payload.length]), [['delete', 1]]); // the earlier edit of the same row is superseded
A.upsert('tm_ledger', [led]);
const d4c = [...A.changedSince(2).batches];
assert.deepEqual(d4c.map((b) => [b.op, b.payload.length]), [['upsert', 1]]);
ok('delete leaves a tombstone, supersedes the earlier edit, re-upsert turns it live again');

// 5. the shared delta example: counts equal delta_expected, and the connector's own delta equals what a second device would build
const B = V.openVault({ dir: path.join(tmp, 'b') });
B.applyOps(asOps(init));
const cursorAtInitial = A.headSeq();
const delta = jsonl(`${SE}/delta_sequence.jsonl`);
for (const c of delta) A.applyOps([{ table_name: c.table_name, op: c.op, payload: c.payload }]);
const exp = JSON.parse(fs.readFileSync(`${SE}/delta_expected.json`, 'utf8'));
for (const [t, c] of Object.entries(exp.row_counts)) assert.equal(A.count(t), c, `${t} count`);
ok('shared delta example applied chunk by chunk: row counts equal delta_expected');
const after = dump(A);
// device B had the initial vault; bring it level with step 4 first (initial + the edit/delete/restore), then the delta
const devB = V.openVault({ dir: path.join(tmp, 'c') });
devB.applyOps(asOps(init));
const toB = A.changedSince(cursorAtInitial);
assert.equal(toB.needsFull, false);
devB.applyOps([...toB.batches].map((b) => ({ table_name: b.table_name, op: b.op, payload: b.payload })));
assert.deepEqual(dump(devB), after);
ok(`"changed since" ${cursorAtInitial} applied to a device holding the initial data reproduces the vault exactly (upTo ${toB.upTo})`);
// the voucher whose lines were replaced in the delta lost its old children (delete_children then upsert)
const delOps = delta.filter((c) => c.op === 'delete_children' || c.op === 'delete');
assert.ok(delOps.length >= 2);
const dd = [...A.changedSince(cursorAtInitial).batches].filter((b) => b.op === 'delete');
assert.ok(dd.some((b) => b.table_name === 'tx_voucher'));
ok('deleted voucher and its dropped child rows appear as deletes in the delta');

// 6. batching and table filter
const big = [...A.changedSince(0, { batch: 7, tables: ['tx_ledger_line'] }).batches];
assert.ok(big.length > 1 && big.every((b) => b.payload.length <= 7 && b.table_name === 'tx_ledger_line'));
assert.equal(big.filter((b) => b.op === 'upsert').reduce((s, b) => s + b.payload.length, 0), A.count('tx_ledger_line'));
ok('changedSince batches by size and filters by table');

// 7. cursors
assert.equal(A.cursor('dev1'), 0);
const head = A.headSeq();
assert.equal(A.setCursor('dev1', head), head);
assert.equal(A.setCursor('dev1', 1), head); // never back
assert.throws(() => A.setCursor('dev1', head + 1), /ahead/);
assert.throws(() => A.setCursor('', 1));
assert.throws(() => A.setCursor('dev1', -1));
A.setCursor('dev2', cursorAtInitial);
assert.equal(A.minCursor(), cursorAtInitial);
assert.equal(A.pruneTombstones(), 0); // delta tombstones are newer than the slowest device
A.setCursor('dev2', head);
assert.equal(A.minCursor(), head);
const tomb = A.db.prepare('SELECT COUNT(*) c FROM _lb_row_state WHERE deleted = 1').get().c;
assert.ok(tomb > 0);
const pruned = A.pruneTombstones();
assert.ok(pruned > 0 && pruned <= tomb);
assert.equal(A.changedSince(1).needsFull, true); // dev behind the floor must resync
assert.equal(A.changedSince(head).needsFull, false);
A.dropDevice('dev2');
assert.equal(A.minCursor(), head);
ok(`cursors: monotonic, bounded by head, tombstones older than the slowest device pruned (${pruned}), a cursor behind the floor needs a full sync`);

// 8. replace_scope, clear by company, delete_children keeps the parent
{
  const v = V.openVault({ dir: path.join(tmp, 'd') });
  v.applyOps(asOps(init));
  const cg = v.readTable('tm_company')[0].guid;
  const vs = v.readTable('tx_voucher');
  const withLines = new Set(v.readTable('tx_ledger_line').map((r) => r.voucher_guid));
  const one = vs.find((x) => withLines.has(x.guid));
  const k = [{ company_guid: cg, guid: one.guid }];
  const kids = v.readTable('tx_ledger_line').filter((r) => r.voucher_guid === one.guid).length;
  assert.ok(kids > 0);
  const rc = v.deleteChildren(k);
  assert.ok(rc.deleted >= kids);
  assert.equal(v.readTable('tx_voucher').length, vs.length);
  assert.equal(v.readTable('tx_ledger_line').filter((r) => r.voucher_guid === one.guid).length, 0);
  const dates = vs.map((x) => x.date).sort();
  const rs = v.replaceScope(cg, dates[0], dates[dates.length - 1]);
  assert.ok(rs.deleted > 0);
  assert.equal(v.count('tx_voucher'), 0);
  assert.equal(v.count('tx_ledger_line'), 0);
  assert.equal(v.count('tm_ledger') > 0, true);
  const rcl = v.clear('tm_ledger', cg);
  assert.ok(rcl.deleted > 0);
  assert.equal(v.count('tm_ledger'), 0);
  assert.throws(() => v.applyOps([{ table_name: 'tm_ledger', op: 'replace_scope', payload: { company_guid: cg, from: '2026-04-01', to: '2026-04-30' } }]));
  ok('delete_children keeps the parent, replace_scope removes vouchers and children by date, clear by company');

  // atomicity: a bad op rolls the whole call back and the seq stays
  const h = v.headSeq();
  const c0 = v.count('tm_currency');
  assert.throws(() => v.applyOps([
    { table_name: 'tm_currency', op: 'upsert', payload: [{ company_guid: cg, guid: 'zz1', name: 'ZZ1' }] },
    { table_name: 'tm_currency', op: 'upsert', payload: [{ company_guid: null, guid: 'zz2' }] },
  ]));
  assert.equal(v.count('tm_currency'), c0);
  assert.equal(v.headSeq(), h);
  assert.equal(v.db.prepare("SELECT COUNT(*) c FROM _lb_row_state WHERE pk LIKE '%zz1%'").get().c, 0);
  ok('a failing op rolls back the whole call, rows, state and seq');

  // rejections
  assert.throws(() => v.upsert('ref_voucher_kind', []), /not a synced/);
  assert.throws(() => v.upsert('nope', []), /not a synced/);
  assert.throws(() => v.deleteRows('tm_ledger', [{ guid: 'x' }]), /Missing key/);
  assert.throws(() => v.applyOps([{ table_name: 'tm_ledger', op: 'bogus', payload: [] }]));
  ok('ref_voucher_kind, unknown tables, missing keys and unknown ops are rejected');

  // clearVault: devices must resync
  v.setCursor('devX', v.headSeq());
  v.clearVault();
  for (const t of syncTables) assert.equal(v.count(t), 0);
  assert.equal(v.count('ref_voucher_kind') > 0, true);
  assert.equal(v.changedSince(v.cursor('devX')).needsFull, true);
  ok('clearVault empties the data, keeps the reference seed and sends every device to a full sync');
  v.close();
}

// 9. persistence: reopen keeps state; replay is still a no-op; a row bulk-loaded without state is picked up
{
  const dir = path.join(tmp, 'p');
  let v = V.openVault({ dir });
  v.applyOps(asOps(init));
  const h = v.headSeq();
  v.close();
  v = V.openVault({ dir });
  assert.equal(v.headSeq(), h);
  assert.equal(v.applyOps(asOps(init.filter((c) => c.op === 'upsert'))).seq, null);
  const cur = v.readTable('tm_currency')[0];
  v.db.exec('DELETE FROM _lb_row_state');
  const r = v.upsert('tm_currency', [cur]);
  assert.deepEqual([r.inserted, r.updated, r.unchanged], [0, 1, 0]);
  ok('state survives reopen; a replay after reopen is a no-op; a row without state is re-tracked');
  v.close();
}
A.close(); B.close(); devB.close();
fs.rmSync(out, { recursive: true, force: true });
console.log('all passed');
