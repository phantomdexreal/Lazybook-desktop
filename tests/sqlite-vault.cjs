// Node-level check for Phase 15: SQLite vault schema, migrations, WAL, integrity, backup/recovery, kill -9, SCHEMA-01 and SCHEMA-02.
// Run: NODE_PATH=<dir with typescript and better-sqlite3> node tests/sqlite-vault.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-vault');
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
const codec = require(path.join(out, 'src/main/db/codec.js'));
const schema = require(path.join(out, 'src/main/db/schema.js'));
const model = JSON.parse(fs.readFileSync('docs/shared/data_model.json', 'utf8'));
const FX = 'docs/shared/fixtures/tables';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-vault-'));
initLogger({ dir: path.join(tmp, 'logs'), maxBytes: 1e6, keepFiles: 2 });
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const dir = (name) => path.join(tmp, name);

// 1. generated DDL equals the shared reference generator (lbmodel.py ddl_sqlite), when python is available
{
  const py = spawnSync('python3', ['-c', "import sys,json;sys.path.insert(0,'docs/shared/fixtures/tools');import lbmodel;m=json.load(open('docs/shared/data_model.json'));sys.stdout.write(lbmodel.ddl_sqlite(m))"], { encoding: 'utf8' });
  if (py.status === 0) {
    assert.equal(schema.schemaSql(model), py.stdout);
    ok('generated DDL is byte-equal to lbmodel.ddl_sqlite');
  } else console.log('skip - python3 reference generator unavailable');
}

// 2. fresh open: migrate, WAL, seed
const d1 = dir('v1');
let v = V.openVault({ dir: d1, now: () => new Date('2026-10-25T10:00:00Z') });
assert.equal(v.info.origin, 'fresh');
assert.equal(v.info.migration.from, 0);
assert.equal(v.info.migration.to, 2);
assert.equal(v.info.schemaStale, false);
assert.equal(v.db.pragma('journal_mode', { simple: true }), 'wal');
assert.equal(v.db.pragma('user_version', { simple: true }), 2);
assert.equal(v.integrityCheck('full').ok, true);
const tables = v.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '\\_lb\\_%' ESCAPE '\\'").all().map((r) => r.name).sort();
assert.deepEqual(tables, [...model.tables_order].sort());
const idx = v.db.prepare("SELECT COUNT(*) c FROM sqlite_master WHERE type='index' AND name LIKE '%\\_\\_%' ESCAPE '\\' AND name NOT LIKE '\\_lb\\_%' ESCAPE '\\'").get().c;
assert.equal(idx, model.tables_order.reduce((a, t) => a + model.tables[t].indexes.length, 0));
ok('fresh vault: tables, indexes, WAL, user_version 2, integrity ok');
const seed = JSON.parse(fs.readFileSync(`${FX}/ref_voucher_kind.json`, 'utf8'));
assert.deepEqual([...v.readTable('ref_voucher_kind')].sort((a, b) => a.kind.localeCompare(b.kind)), [...seed].sort((a, b) => a.kind.localeCompare(b.kind)));
ok('ref_voucher_kind seeded and equal to the shared fixture');

// 3. SCHEMA-01: load every fixture table, read back equal
const byPk = (t, rows) => {
  const pk = model.tables[t].primary_key;
  return new Map(rows.map((r) => [JSON.stringify(pk.map((k) => r[k])), r]));
};
let total = 0;
for (const t of model.tables_order) {
  const f = `${FX}/${t}.json`;
  if (!fs.existsSync(f)) continue;
  const rows = JSON.parse(fs.readFileSync(f, 'utf8'));
  v.bulkLoad(t, rows);
  const back = v.readTable(t);
  assert.equal(back.length, rows.length, t);
  const a = byPk(t, rows);
  const b = byPk(t, back);
  assert.equal(a.size, rows.length, `${t} duplicate keys in fixture`);
  for (const [k, r] of a) assert.deepEqual(b.get(k), r, `${t} row ${k}`);
  total += rows.length;
}
ok(`SCHEMA-01: ${total} fixture rows round-trip equal across all tables`);

// replaying the same load changes nothing (idempotent replace)
const before = v.count('tx_ledger_line');
v.bulkLoad('tx_ledger_line', JSON.parse(fs.readFileSync(`${FX}/tx_ledger_line.json`, 'utf8')));
assert.equal(v.count('tx_ledger_line'), before);
ok('bulkLoad replay is idempotent');

// 4. SCHEMA-02: every voucher's ledger lines sum to zero in integers
{
  const rows = v.db.prepare('SELECT voucher_guid, SUM(amount) s, COUNT(*) c FROM tx_ledger_line GROUP BY company_guid, voucher_guid').all();
  assert.ok(rows.length > 0);
  for (const r of rows) assert.equal(r.s, 0, `voucher ${r.voucher_guid}`);
  ok(`SCHEMA-02: ${rows.length} vouchers sum to 0 (integer x10^4)`);
  const raw = v.db.prepare("SELECT amount FROM tx_ledger_line WHERE amount != 0 LIMIT 1").get().amount;
  assert.ok(Number.isInteger(raw));
  ok('money is stored as INTEGER');
}

// 5. codec edge cases
{
  assert.equal(codec.toMinor('1180.00'), 11800000n);
  assert.equal(codec.toMinor('-0.5'), -5000n);
  assert.equal(codec.toMinor('12.34565'), 123457n); // half away from zero
  assert.equal(codec.toMinor('-12.34565'), -123457n);
  assert.equal(codec.toMinor('12.34564'), 123456n);
  assert.equal(codec.fromMinor(11800000n), '1180.00');
  assert.equal(codec.fromMinor(123456n), '12.3456');
  assert.equal(codec.fromMinor(-5000n), '-0.50');
  assert.equal(codec.fromMinor(0n), '0.00');
  assert.equal(codec.fromMinor(123450n), '12.345');
  assert.throws(() => codec.toMinor('abc'));
  assert.throws(() => codec.toMinor('1,000'));
  // beyond 2^53: exact through SQLite
  const big = '900000000000000.1234';
  v.db.exec('CREATE TEMP TABLE t(x INTEGER)');
  v.db.prepare('INSERT INTO t VALUES (?)').run(codec.toMinor(big));
  const st = v.db.prepare('SELECT x FROM t');
  st.safeIntegers(true);
  assert.equal(codec.fromMinor(st.get().x), big);
  // null in a not-null column is rejected, nullable date accepts null
  assert.throws(() => v.bulkLoad('tm_company', [{ guid: null }]));
  v.bulkLoad('tm_company', [{ guid: 'g-null-dates', name: 'X', starting_from: null }]);
  assert.equal(v.readTable('tm_company').find((r) => r.guid === 'g-null-dates').starting_from, null);
  assert.throws(() => v.bulkLoad('no_such_table', []));
  ok('codec: rounding, canonical output, 64-bit exactness, null and unknown-table rejection');
}

// 6. a failed bulkLoad rolls back whole
{
  const c = v.count('tm_currency');
  const bad = [{ company_guid: 'g1', guid: 'new-1', name: 'AAA' }, { company_guid: null }];
  assert.throws(() => v.bulkLoad('tm_currency', bad));
  assert.equal(v.count('tm_currency'), c);
  ok('failed load rolls back (no partial rows)');
}
v.close();
v.close();
ok('close is idempotent');

// 7. reopen: no migration, backup made, rolling prune, data kept
let t0 = Date.parse('2026-10-25T11:00:00Z');
const ticks = [];
for (let i = 0; i < 5; i += 1) {
  v = V.openVault({ dir: d1, now: () => new Date(t0 + i * 60_000), minBackupIntervalMs: 0, backupsKeep: 3 });
  assert.equal(v.info.origin, 'existing');
  assert.equal(v.info.migration.applied.length, 0);
  assert.ok(v.info.backupPath);
  ticks.push(v.info.backupPath);
  assert.equal(v.count('tx_voucher'), JSON.parse(fs.readFileSync(`${FX}/tx_voucher.json`, 'utf8')).length);
  v.close();
}
const kept = fs.readdirSync(path.join(d1, 'backups'));
assert.equal(kept.length, 3);
ok('reopen keeps data, runs no migration, writes a backup per start and prunes to 3');
v = V.openVault({ dir: d1, now: () => new Date(t0 + 6 * 60_000), minBackupIntervalMs: 3_600_000 });
assert.equal(v.info.backupPath, null);
v.close();
ok('backup skipped when the newest is younger than the interval');

// 8. kill -9 during writes: committed batches survive, database stays healthy
{
  const d = dir('kill');
  const child = path.join(tmp, 'writer.cjs');
  fs.writeFileSync(child, `
    const V = require(${JSON.stringify(path.join(out, 'src/main/db/index.js'))});
    const v = V.openVault({ dir: ${JSON.stringify(d)} });
    let b = 0;
    const mk = (b, i) => ({ company_guid: 'ck', guid: 'g' + b + '-' + i, name: 'N' + b + '-' + i });
    (function loop() {
      v.bulkLoad('tm_currency', Array.from({ length: 200 }, (_, i) => mk(b, i)));
      b += 1;
      process.stdout.write('c' + b + '\\n');
      setImmediate(loop);
    })();
  `);
  const p = spawn(process.execPath, [child], { env: process.env, stdio: ['ignore', 'pipe', 'inherit'] });
  let last = 0;
  let killed = false;
  const await_ = new Promise((resolve) => {
    p.stdout.on('data', (b) => {
      for (const l of String(b).split('\n')) if (/^c\d+$/.test(l)) last = Number(l.slice(1));
      if (last >= 20 && !killed) { killed = true; p.kill('SIGKILL'); }
    });
    p.on('exit', resolve);
  });
  (async () => {
    await await_;
    const v2 = V.openVault({ dir: d });
    assert.equal(v2.integrityCheck('full').ok, true);
    const c = v2.count('tm_currency');
    assert.ok(c >= last * 200, `committed ${last * 200}, found ${c}`);
    assert.equal(c % 200, 0, 'only whole batches (each batch is one transaction)');
    v2.close();
    ok(`kill -9 after ${last} batches: integrity ok, ${c} rows, whole batches only`);
    await rest();
  })().catch((e) => { console.error(e); process.exit(1); });
}

async function rest() {
  // 9. corruption: restore from the newest healthy backup
  {
    const d = dir('corrupt');
    let x = V.openVault({ dir: d, now: () => new Date('2026-10-25T12:00:00Z'), minBackupIntervalMs: 0 });
    x.bulkLoad('tm_currency', [{ company_guid: 'c', guid: 'k1', name: 'KEEP' }]);
    x.close();
    x = V.openVault({ dir: d, now: () => new Date('2026-10-25T12:05:00Z'), minBackupIntervalMs: 0 }); // makes a backup holding KEEP
    assert.ok(x.info.backupPath);
    x.close();
    const f = V.vaultPath(d);
    fs.rmSync(f + '-wal', { force: true });
    fs.rmSync(f + '-shm', { force: true });
    const buf = fs.readFileSync(f);
    for (let i = 100; i < buf.length && i < 4000; i += 7) buf[i] = 0xff; // damage pages, keep the header readable
    fs.writeFileSync(f, buf);
    x = V.openVault({ dir: d, now: () => new Date('2026-10-25T12:10:00Z'), minBackupIntervalMs: 0 });
    assert.equal(x.info.origin, 'backup');
    assert.ok(x.info.quarantinedPath && fs.existsSync(x.info.quarantinedPath));
    assert.equal(x.readTable('tm_currency').some((r) => r.name === 'KEEP'), true);
    assert.equal(x.integrityCheck('full').ok, true);
    x.close();
    ok('damaged vault is quarantined and the newest healthy backup restored');

    // not a database at all, no backups: starts empty, reports origin
    const d2 = dir('garbage');
    fs.mkdirSync(d2, { recursive: true });
    fs.writeFileSync(V.vaultPath(d2), Buffer.from('this is not a sqlite file '.repeat(200)));
    x = V.openVault({ dir: d2 });
    assert.equal(x.info.origin, 'empty');
    assert.equal(x.count('tx_voucher'), 0);
    assert.equal(x.count('ref_voucher_kind'), seed.length);
    x.close();
    ok('unreadable file with no backup: quarantined, empty vault created (full resync)');
  }

  // 10. newer vault refused, failed migration rolled back, stale model flagged, reset helper
  {
    const d = dir('newer');
    let x = V.openVault({ dir: d });
    x.db.pragma('user_version = 99');
    x.close();
    assert.throws(() => V.openVault({ dir: d }), (e) => e.code === 'VAULT_NEWER');
    ok('vault written by a newer version is refused (VAULT_NEWER)');

    const d2 = dir('mig');
    const Db = require('better-sqlite3');
    const db = new Db(path.join(tmp, 'm.sqlite'));
    const M = require(path.join(out, 'src/main/db/migrate.js'));
    const bad = [
      { id: 1, name: 'ok', up: (q) => q.exec('CREATE TABLE a(x)') },
      { id: 2, name: 'boom', up: (q) => { q.exec('CREATE TABLE b(x)'); throw new Error('fail'); } },
    ];
    assert.throws(() => M.migrate(db, model, bad), /fail/);
    assert.equal(M.currentVersion(db), 1);
    assert.equal(db.prepare("SELECT COUNT(*) c FROM sqlite_master WHERE name='b'").get().c, 0);
    assert.throws(() => M.migrate(db, model, [{ id: 2, name: 'gap', up() {} }]), /gaps/);
    db.close();
    ok('failing migration rolls back and leaves the previous version; id gaps rejected');

    const m2 = JSON.parse(JSON.stringify(model));
    m2.tables.tm_currency.columns.push({ name: 'extra', type: 'text', default: '' });
    const d3 = dir('stale');
    x = V.openVault({ dir: d3 });
    x.close();
    x = V.openVault({ dir: d3, model: m2 });
    assert.equal(x.info.schemaStale, true);
    x.close();
    ok('a changed data model is flagged as schemaStale on open');

    const d4 = dir('reset');
    x = V.openVault({ dir: d4, minBackupIntervalMs: 0 });
    x.close();
    V.deleteVaultFiles(d4);
    assert.equal(fs.existsSync(V.vaultPath(d4)), false);
    x = V.openVault({ dir: d4 });
    assert.equal(x.info.origin, 'fresh');
    x.close();
    ok('deleteVaultFiles resets to a fresh vault');
    fs.rmSync(out, { recursive: true, force: true });
    console.log('all passed');
  }
}
