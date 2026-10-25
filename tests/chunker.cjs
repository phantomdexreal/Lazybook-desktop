// Node-level check for Phase 20: chunker (limits, order, default omission, addressing) and the shared reference applier.
// Run: NODE_PATH=<dir containing typescript> node tests/chunker.cjs      (needs python3 for the reference applier)
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const out = path.join(__dirname, '.tmp-ck');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main/postbox', 'src/shared']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
const C = require(path.join(out, 'src/main/postbox/chunker.js'));
const SH = 'docs/shared';
const model = JSON.parse(fs.readFileSync(`${SH}/data_model.json`, 'utf8'));
const consts = JSON.parse(fs.readFileSync(`${SH}/constants.json`, 'utf8'));
const readJsonl = (p) => fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const fixtures = {};
for (const t of model.tables_order) fixtures[t] = JSON.parse(fs.readFileSync(`${SH}/fixtures/tables/${t}.json`, 'utf8'));
const cg = fixtures.tm_company[0].guid;

let n = 0;
const ok = (m) => { n += 1; console.log('ok', n, m); };
const sizeOf = (v) => Buffer.byteLength(JSON.stringify(v), 'utf8');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-ck-'));
const writeJsonl = (name, chunks) => { const p = path.join(tmp, name); fs.writeFileSync(p, chunks.map((c) => JSON.stringify(c)).join('\n') + '\n'); return p; };

// 0. shared constants match the shared constants.json
{
  const S = require(path.join(out, 'src/shared/constants.js')).SYNC_DEFAULTS;
  assert.equal(S.chunkMaxPayloadBytes, consts.sync.chunk_max_payload_bytes);
  assert.equal(S.chunkMaxRows, consts.sync.chunk_max_rows);
  assert.equal(S.chunkTtlHours, consts.sync.chunk_ttl_hours);
  assert.deepEqual([...S.tableOrder], consts.sync.table_order);
  ok('SYNC_DEFAULTS equal docs/shared/constants.json');
}

// 1. initial sequence for the fixture company equals the shared example, chunk for chunk
const win = { from: '2026-04-01', to: '2026-09-30' };
const init = C.initialSequence({ model, tables: fixtures, companyGuid: cg, ...win });
{
  const ex = readJsonl(`${SH}/sync_examples/initial_sequence.jsonl`);
  assert.equal(init.chunks.length, ex.length);
  assert.deepEqual(init.chunks, ex);
  assert.deepEqual(C.validateSequence(init.chunks), []);
  ok(`initial sequence equals sync_examples/initial_sequence.jsonl (${ex.length} chunks, exact)`);
}

// 2. the reference applier rebuilds the fixtures from our chunks (SYNC-01, initial) ----------------------------------------------
const initFile = writeJsonl('initial.jsonl', init.chunks);

// 3. delta: ops of the shared delta example -> our chunks equal the example; reference applier agrees (SYNC-01, delta)
let deltaFile;
{
  const ex = readJsonl(`${SH}/sync_examples/delta_sequence.jsonl`);
  const ops = ex.map((c) => ({ table_name: c.table_name, op: c.op, payload: c.payload }));
  const d = C.opsSequence(model, ops);
  assert.deepEqual(d.chunks, ex);
  deltaFile = writeJsonl('delta.jsonl', d.chunks);
  ok('delta ops chunk to exactly sync_examples/delta_sequence.jsonl (compaction is idempotent)');
}
{
  const r = spawnSync('python3', ['-I', 'tests/chunker-apply.py', initFile, deltaFile], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /OK initial applies to the fixtures/);
  assert.match(r.stdout, /OK delta equals the shared delta example result/);
  ok('reference applier: our initial chunks (over a stale voucher) equal fixtures/tables; our delta equals the shared delta result');
}

// 4. limits: bytes, rows, UTF-8, order, reassembly --------------------------------------------------------------------------------
const bigLedger = (i) => ({ company_guid: cg, guid: `g-${String(i).padStart(6, '0')}`, name: `Ledger ${i} ` + 'x'.repeat(900) + ' \u20b9\u0905', name_lc: 'l' + i, alter_id: i });
{
  const rows = Array.from({ length: 3000 }, (_, i) => bigLedger(i));
  const tables = { ...fixtures, tm_ledger: rows };
  const r = C.initialSequence({ model, tables, companyGuid: cg, ...win });
  const led = r.chunks.filter((c) => c.table_name === 'tm_ledger' && c.op === 'upsert');
  assert.ok(led.length > 10, 'split into many chunks');
  for (const c of led) {
    assert.ok(sizeOf(c.payload) <= 200000, 'bytes ' + sizeOf(c.payload));
    assert.ok(c.payload.length <= 500);
  }
  // chunks are reasonably full (greedy): all but the last are within 1 row of the byte limit
  for (const c of led.slice(0, -1)) assert.ok(sizeOf(c.payload) > 200000 - 1500);
  // reassemble in order: same rows, same order
  const back = led.flatMap((c) => c.payload).map((x) => x.guid);
  assert.deepEqual(back, rows.map((x) => x.guid));
  assert.deepEqual(C.validateSequence(r.chunks), []);
  assert.equal(r.stats.oversize, 0);
  ok(`3000 wide rows (UTF-8) split into ${led.length} chunks, each <= 200000 bytes and <= 500 rows, greedy, order kept`);
}
{
  const rows = Array.from({ length: 1201 }, (_, i) => ({ company_guid: cg, guid: 'u' + i, name: 'n' }));
  const { parts } = C.splitRows(rows);
  assert.deepEqual(parts.map((p) => p.length), [500, 500, 201]);
  ok('row limit: 1201 small rows -> 500, 500, 201');
}
{
  const { parts, oversize } = C.splitRows([{ a: 'x'.repeat(10) }, { a: 'y'.repeat(300000) }, { a: 'z' }]);
  assert.equal(oversize, 1);
  assert.deepEqual(parts.map((p) => p.length), [1, 1, 1]);
  const exactly = C.splitRows([{ k: 'a'.repeat(199000) }, { k: 'b'.repeat(1000) }], { maxPayloadBytes: 200000, maxRows: 500 });
  assert.equal(exactly.parts.length, 2); // 199009 + 1009 + comma + brackets > 200000
  ok('a row over the limit is sent alone and counted; boundary splits');
}
{
  // the size rule is exact: a payload of exactly the limit stays in one chunk, one byte more splits
  const mk = (len) => ({ k: 'a'.repeat(len) });
  const base = sizeOf([mk(0)]);
  const fit = C.splitRows([mk(200000 - base)]);
  assert.equal(sizeOf(fit.parts[0]), 200000);
  assert.equal(fit.oversize, 0);
  const two = [mk(1000), mk(2000)];
  const lim = sizeOf(two);
  assert.equal(C.splitRows(two, { maxPayloadBytes: lim, maxRows: 500 }).parts.length, 1);
  assert.equal(C.splitRows(two, { maxPayloadBytes: lim - 1, maxRows: 500 }).parts.length, 2);
  ok('byte accounting is exact to the byte (limit and limit - 1)');
}

// 5. default omission ---------------------------------------------------------------------------------------------------------------
{
  const full = fixtures.tm_unit[0];
  const c = C.compactRow(model, 'tm_unit', { ...full, base_unit: '', additional_unit: '' });
  assert.equal(c.guid, full.guid);
  assert.equal(c.company_guid, full.company_guid);
  assert.ok(!('base_unit' in c) && !('additional_unit' in c));
  const bare = C.compactRow(model, 'tm_unit', { company_guid: 'c', guid: 'g' });
  assert.deepEqual(bare, { company_guid: 'c', guid: 'g' });
  const keep = C.compactRow(model, 'tm_unit', { company_guid: 'c', guid: 'g', name: 'Box', decimal_places: 2 });
  assert.equal(keep.name, 'Box');
  assert.equal(keep.decimal_places, 2);
  // json column default is null: null or missing is omitted, an empty list is a real value and kept (as in the shared examples)
  assert.ok(!('aliases' in C.compactRow(model, 'tm_ledger', { company_guid: 'c', guid: 'g', aliases: null })));
  assert.ok(!('aliases' in C.compactRow(model, 'tm_ledger', { company_guid: 'c', guid: 'g' })));
  assert.deepEqual(C.compactRow(model, 'tm_ledger', { company_guid: 'c', guid: 'g', aliases: [] }).aliases, []);
  assert.deepEqual(C.compactRow(model, 'tm_ledger', { company_guid: 'c', guid: 'g', aliases: ['A'] }).aliases, ['A']);
  assert.throws(() => C.compactRow(model, 'nope', {}), /Unknown table/);
  ok('default omission: pk kept, defaults dropped, non-defaults and empty json lists kept, unknown table refused');
}

// 6. empty and edge sequences -------------------------------------------------------------------------------------------------------
{
  const e = C.opsSequence(model, []);
  assert.deepEqual(e.chunks, [{ seq: 1, table_name: 'tm_company', op: 'upsert', enc: false, is_last: true, payload: [] }]);
  const e2 = C.opsSequence(model, [{ table_name: 'tm_ledger', op: 'upsert', payload: [] }]);
  assert.equal(e2.chunks.length, 1);
  assert.equal(e2.chunks[0].table_name, 'tm_company');
  const none = C.initialSequence({ model, tables: { ...fixtures, tm_company: [] }, companyGuid: 'missing', ...win });
  assert.equal(none.chunks.at(-1).is_last, true);
  assert.deepEqual(C.validateSequence(none.chunks), []);
  // another company's rows are never sent
  const other = C.initialSequence({ model, tables: { ...fixtures, tm_unit: [...fixtures.tm_unit, { company_guid: 'other', guid: 'x', name: 'Z' }] }, companyGuid: cg, ...win });
  assert.ok(!JSON.stringify(other.chunks).includes('"other"'));
  // vouchers outside the window and their children are not sent
  const narrow = C.initialSequence({ model, tables: fixtures, companyGuid: cg, from: '2026-09-25', to: '2026-09-30' });
  const sent = new Set(narrow.chunks.filter((c) => c.table_name === 'tx_voucher' && c.op === 'upsert').flatMap((c) => c.payload.map((v) => v.guid)));
  assert.ok(sent.size > 0 && sent.size < fixtures.tx_voucher.length);
  for (const c of narrow.chunks.filter((c) => c.table_name === 'tx_ledger_line' && c.op === 'upsert')) for (const r of c.payload) assert.ok(sent.has(r.voucher_guid));
  ok('empty sequence = one empty tm_company upsert; other companies and out-of-window vouchers (and their children) excluded');
}

// 7. delete / delete_children lists split, clear and replace_scope pass through, ops order kept ----------------------------------------
{
  const keys = Array.from({ length: 1100 }, (_, i) => ({ company_guid: cg, guid: 'v' + i }));
  const ops = [
    { table_name: 'tx_voucher', op: 'delete_children', payload: keys },
    { table_name: 'tx_voucher', op: 'delete', payload: keys },
    { table_name: 'tm_ledger', op: 'clear', payload: { company_guid: cg } },
    { table_name: 'tx_voucher', op: 'replace_scope', payload: { company_guid: cg, from: 'a', to: 'b' } },
  ];
  const r = C.opsSequence(model, ops);
  assert.deepEqual(r.chunks.map((c) => `${c.op}:${Array.isArray(c.payload) ? c.payload.length : 'o'}`), ['delete_children:500', 'delete_children:500', 'delete_children:100', 'delete:500', 'delete:500', 'delete:100', 'clear:o', 'replace_scope:o']);
  assert.deepEqual(C.validateSequence(r.chunks), []);
  assert.deepEqual(C.chunksToOps(r.chunks).filter((o) => o.op === 'delete').flatMap((o) => o.payload), keys);
  ok('long key lists split by the same limits; clear and replace_scope pass through; order kept');
}

// 8. encode seam: limit measured on plaintext, enc flag carried ----------------------------------------------------------------------
{
  const seen = [];
  const encode = (p) => { seen.push(sizeOf(p)); return { enc: true, payload: { v: 1, iv: 'x', ct: 'y'.repeat(10), z: 1 } }; };
  const rows = Array.from({ length: 2000 }, (_, i) => bigLedger(i));
  const r = C.initialSequence({ model, tables: { ...fixtures, tm_ledger: rows }, companyGuid: cg, ...win }, { encode });
  assert.ok(r.chunks.every((c) => c.enc === true));
  assert.ok(seen.every((s) => s <= 200000 || s < 260));
  assert.ok(seen.length === r.chunks.length);
  assert.throws(() => C.chunksToOps(r.chunks), /Encrypted/);
  ok('encode hook receives each plaintext payload (<= 200000 bytes) and its enc flag is stored');
}

// 9. addressing: per device, ttl, contiguity checks ----------------------------------------------------------------------------------
{
  const now = Date.parse('2026-10-25T10:00:00.000Z');
  const rowsA = C.addressChunks(init.chunks, { licenseKey: 'LB-X', deviceId: 'dev-a', requestId: 'req-a', nowMs: now });
  const rowsB = C.addressChunks(init.chunks, { licenseKey: 'LB-X', deviceId: 'dev-b', requestId: 'req-b', nowMs: now, ttlHours: 1 });
  assert.equal(rowsA.length, init.chunks.length);
  assert.ok(rowsA.every((r) => r.device_id === 'dev-a' && r.request_id === 'req-a' && r.license_key === 'LB-X'));
  assert.equal(rowsA[0].created_at, '2026-10-25T10:00:00.000Z');
  assert.equal(rowsA[0].expires_at, '2026-10-26T10:00:00.000Z');
  assert.equal(rowsB[0].expires_at, '2026-10-25T11:00:00.000Z');
  assert.ok(rowsB.every((r) => r.device_id === 'dev-b'));
  assert.deepEqual(Object.keys(rowsA[0]).sort(), ['created_at', 'device_id', 'enc', 'expires_at', 'is_last', 'license_key', 'op', 'payload', 'request_id', 'seq', 'table_name']);
  assert.equal(rowsA.filter((r) => r.is_last).length, 1);
  assert.ok(C.validateSequence([{ seq: 1, is_last: false }, { seq: 3, is_last: true }]).length > 0);
  assert.ok(C.validateSequence([{ seq: 1, is_last: true }, { seq: 2, is_last: true }]).length > 0);
  assert.ok(C.validateSequence([]).length > 0);
  ok('chunks addressed per device with 24 h (or given) expiry; gaps and a wrong is_last are detected');
}

// 10. throughput on a large company ---------------------------------------------------------------------------------------------------
{
  const rows = Array.from({ length: 150000 }, (_, i) => ({ company_guid: cg, guid: 'g' + i, name: 'Ledger ' + i, name_lc: 'ledger ' + i, alter_id: i }));
  const t0 = Date.now();
  const r = C.initialSequence({ model, tables: { ...fixtures, tm_ledger: rows }, companyGuid: cg, ...win });
  const ms = Date.now() - t0;
  const led = r.chunks.filter((c) => c.table_name === 'tm_ledger' && c.op === 'upsert');
  assert.equal(led.reduce((a, c) => a + c.payload.length, 0), 150000);
  assert.ok(led.every((c) => c.payload.length <= 500));
  assert.ok(ms < 20000, 'took ' + ms);
  console.log(`   150000 ledger rows -> ${led.length} chunks in ${ms} ms`);
  ok('150000 rows chunk in one pass');
}

fs.rmSync(out, { recursive: true, force: true });
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${n} checks passed`);
