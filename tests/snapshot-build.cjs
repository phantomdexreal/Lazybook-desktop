// Node-level check for Phase 31: snapshot builder (LBS1 objects, manifest row, upload port, full and delta) on a real SQLite vault.
// Run: NODE_PATH=<dir with typescript 5, zod, better-sqlite3> node tests/snapshot-build.cjs   (python3 for the shared reference applier)
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const out = path.join(__dirname, '.tmp-snap');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/db', 'src/main/crypto', 'src/main/postbox', 'src/main/snapshot', 'src/shared']) {
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
const R = (p) => require(path.join(out, p));
const { initLogger, logFilePath } = R('src/main/logger.js');
const V = R('src/main/db/index.js');
const E = R('src/main/crypto/envelope.js');
const S = R('src/main/snapshot/build.js');
const C = R('src/shared/constants.js');

const SH = 'docs/shared';
const model = JSON.parse(fs.readFileSync(`${SH}/data_model.json`, 'utf8'));
const consts = JSON.parse(fs.readFileSync(`${SH}/constants.json`, 'utf8'));
const jsonl = (f) => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const LIC = consts.demo.license_key;
const asOps = (seq) => seq.map((c) => ({ table_name: c.table_name, op: c.op, payload: c.payload }));
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-snap-'));
initLogger({ dir: path.join(tmp, 'logs'), maxBytes: 1e6, keepFiles: 2 });
const key = E.deriveKey(consts.demo.passphrase, E.newSalt());

/** Snapshot objects -> chunk file for the shared reference applier ("as if they were chunks"). */
function toChunks(objectsInOrder, k) {
  const ops = [];
  for (const o of objectsInOrder) ops.push(...S.snapshotLinesToOps(S.decodeSnapshotObject(o, k, LIC).lines));
  return ops.map((o, i) => ({ seq: i + 1, table_name: o.table_name, op: o.op, enc: false, is_last: i === ops.length - 1, payload: o.payload }));
}
const writeJsonl = (name, chunks) => { const p = path.join(tmp, name); fs.writeFileSync(p, chunks.map((c) => JSON.stringify(c)).join('\n') + '\n'); return p; };
const applier = (...files) => spawnSync('python3', ['-I', 'tests/chunker-apply.py', ...files], { encoding: 'utf8' });

/** In-memory storage + manifest port with failure switches. */
function fakeStore() {
  const s = { objects: new Map(), manifest: [], puts: [], failPutAt: null, failManifest: false, removed: [] };
  s.port = {
    listManifest: async () => s.manifest.slice(),
    putObject: async (p, b) => { if (s.failPutAt !== null && s.puts.length === s.failPutAt) throw new Error('offline'); s.puts.push(p); s.objects.set(p, b); },
    removeObject: async (p) => { s.removed.push(p); s.objects.delete(p); },
    insertManifest: async (r) => { if (s.failManifest) throw new Error('db down'); s.manifest.push({ ...r, created_at: '2026-10-25T10:00:00Z' }); },
  };
  return s;
}

(async () => {
  // 0. constants
  {
    const D = C.SNAPSHOT_DEFAULTS, c = consts.snapshot;
    assert.equal(D.objectMaxBytes, c.object_max_bytes);
    assert.equal(D.bucketObjectLimitBytes, c.bucket_object_limit_bytes);
    assert.equal(D.fullRebuildDeltaRatio, c.full_rebuild_delta_ratio);
    assert.equal(D.fullRebuildMaxDeltas, c.full_rebuild_max_deltas);
    assert.equal(D.fullRebuildMaxAgeDays, c.full_rebuild_max_age_days);
    assert.equal(D.deltaMinIntervalMin, c.delta_min_interval_min);
    assert.equal(D.quotaHeadroomRatio, c.quota_headroom_ratio);
    ok('SNAPSHOT_DEFAULTS equal docs/shared/constants.json');
  }

  const vault = V.openVault({ dir: path.join(tmp, 'vault') });
  vault.applyOps(asOps(jsonl(`${SH}/sync_examples/initial_sequence.jsonl`)));
  const company = vault.readTable('tm_company')[0];
  const cg = company.guid;
  const store = fakeStore();
  let clock = Date.parse('2026-10-25T10:00:00Z');
  const mk = (over = {}) => S.createSnapshotBuilder({ getVault: () => vault, model, licenseKey: () => LIC, getKey: () => key, store: store.port, now: () => clock, ...over });
  const builder = mk();

  // 1. full snapshot: layout, header, order, only upserts and clears
  const r1 = await builder.build('full');
  assert.equal(r1.ok, true);
  assert.equal(r1.kind, 'full');
  assert.equal(r1.upgraded, false);
  assert.equal(r1.row.seq, 1);
  assert.equal(r1.row.storage_path, `${LIC}/${cg}/full/1-`);
  assert.equal(r1.row.enc, true);
  assert.equal(r1.row.from_alter_id, 0);
  assert.equal(r1.row.to_alter_id, Number(company.alter_id_voucher));
  const p1 = [...store.objects.keys()];
  assert.deepEqual(p1, [`${LIC}/${cg}/full/1-1.lbs`]);
  const o1 = store.objects.get(p1[0]);
  const d1 = S.decodeSnapshotObject(o1, key, LIC);
  assert.deepEqual(d1.header, { lbs: 1, company_guid: cg, kind: 'full', seq: 1, part: 1, parts: 1, as_of: '2026-10-25', schema_version: 1, from_alter_id: 0, to_alter_id: Number(company.alter_id_voucher) });
  assert.ok(d1.lines.every((l) => 'row' in l || 'clear' in l), 'only upserts and clears');
  const order = consts.sync.table_order;
  const seen = [...new Set(d1.lines.map((l) => l.table))];
  assert.deepEqual(seen, order.filter((t) => seen.includes(t)));
  assert.equal(d1.lines[0].table, 'tm_company');
  assert.ok('row' in d1.lines[0]);
  assert.deepEqual(d1.lines.filter((l) => 'clear' in l).map((l) => l.table), order.filter((t) => t !== 'tm_company'));
  assert.ok(d1.lines.filter((l) => 'clear' in l).every((l) => l.clear.company_guid === cg));
  ok('full snapshot: LBS1 header, table order, one clear per table (not tm_company), upserts only');

  // 2. manifest: bytes and sha256 over the stored bytes
  assert.equal(r1.row.bytes, o1.length);
  assert.equal(r1.row.sha256, crypto.createHash('sha256').update(o1).digest('hex'));
  assert.deepEqual(store.manifest[0].kind, 'full');
  ok('manifest row: storage prefix, bytes and sha256 over the stored object');

  // 3. restore equals the shared fixtures (reference applier), stale voucher cleared
  {
    const f = writeJsonl('full.jsonl', toChunks([o1], key));
    const r = applier(f);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    ok('SNAPSHOT apply: reference applier rebuilds fixtures/tables from the full snapshot (python: ' + r.stdout.trim() + ')');
  }

  // 4. encryption: wrong key, wrong license, tampering, no plaintext on disk
  {
    assert.throws(() => S.decodeSnapshotObject(o1, E.deriveKey('another passphrase', E.newSalt()), LIC), (e) => e.code === 'LB_CRYPTO_DECRYPT_FAILED');
    assert.throws(() => S.decodeSnapshotObject(o1, key, 'LB-OTHER-LICENSE'), (e) => e.code === 'LB_CRYPTO_DECRYPT_FAILED');
    const bad = Buffer.from(o1); bad[40] ^= 1;
    assert.throws(() => S.decodeSnapshotObject(bad, key, LIC), (e) => e.code === 'LB_CRYPTO_DECRYPT_FAILED');
    assert.throws(() => S.decodeSnapshotObject(o1.subarray(0, 20), key, LIC), (e) => e.code === 'LB_CRYPTO_DECRYPT_FAILED');
    assert.ok(!o1.includes(Buffer.from(company.name)) && !o1.includes(Buffer.from('lbs')));
    assert.equal(o1.length > 28, true);
    // the format on the wire: iv(12) || ciphertext+tag, decrypt by hand with AAD lb1|license
    const d = crypto.createDecipheriv('aes-256-gcm', key, o1.subarray(0, 12), { authTagLength: 16 });
    d.setAAD(Buffer.from('lb1|' + LIC)); d.setAuthTag(o1.subarray(o1.length - 16));
    const gz = Buffer.concat([d.update(o1.subarray(12, o1.length - 16)), d.final()]);
    assert.ok(zlib.gunzipSync(gz).toString('utf8').startsWith('{"lbs":1,'));
    ok('encryption: iv||ct+tag with AAD lb1|license, wrong key / license / tampered / truncated all refused, no plaintext in the object');
  }

  // 5. plaintext mode only when the e2e flag is off
  {
    const st2 = fakeStore();
    const b2 = mk({ store: st2.port, e2eEnabled: () => false, getKey: () => null });
    const r = await b2.build('full');
    assert.equal(r.row.enc, false);
    const o = [...st2.objects.values()][0];
    assert.ok(zlib.gunzipSync(o).toString('utf8').startsWith('{"lbs":1,'));
    assert.deepEqual(S.decodeSnapshotObject(o, null, LIC).lines, d1.lines);
    const locked = mk({ store: fakeStore().port, getKey: () => null });
    await assert.rejects(() => locked.build('full'), (e) => e.code === 'LB_CRYPTO_BAD_PASSPHRASE');
    ok('plaintext objects only with the flag off; a locked key refuses instead of sending plaintext');
  }

  // 6. splitting into parts below the object limit
  {
    const tables = {};
    for (const t of consts.sync.table_order) tables[t] = vault.readTable(t);
    const lines = S.fullLines(model, tables, cg);
    const base = { licenseKey: LIC, companyGuid: cg, kind: 'full', seq: 7, asOf: '2026-10-25', fromAlterId: 0, toAlterId: 9, lines, key };
    const whole = S.encodeSnapshot(base);
    assert.equal(whole.objects.length, 1);
    const limit = 2500;
    const split = S.encodeSnapshot({ ...base, maxObjectBytes: limit });
    assert.ok(split.objects.length > 1, 'needs parts: ' + split.objects.length);
    assert.ok(split.objects.every((o) => o.bytes.length <= limit));
    const decoded = split.objects.map((o) => S.decodeSnapshotObject(o.bytes, key, LIC));
    decoded.forEach((x, i) => { assert.equal(x.header.part, i + 1); assert.equal(x.header.parts, split.objects.length); assert.equal(x.header.seq, 7); });
    assert.deepEqual(decoded.flatMap((x) => x.lines), S.decodeSnapshotObject(whole.objects[0].bytes, key, LIC).lines);
    assert.deepEqual(split.objects.map((o) => o.path), split.objects.map((o, i) => `${LIC}/${cg}/full/7-${i + 1}.lbs`));
    const h = crypto.createHash('sha256'); split.objects.forEach((o) => h.update(o.bytes));
    assert.equal(split.manifest.sha256, h.digest('hex'));
    assert.equal(split.manifest.bytes, split.objects.reduce((a, o) => a + o.bytes.length, 0));
    // parts applied in order restore the fixtures too
    const f = writeJsonl('parts.jsonl', toChunks(split.objects.map((o) => o.bytes), key));
    assert.equal(applier(f).status, 0);
    // a single line above the limit cannot be split
    assert.throws(() => S.encodeSnapshot({ ...base, lines: ['{"table":"tm_ledger","row":{"x":"' + crypto.randomBytes(4000).toString('hex') + '"}}'], maxObjectBytes: 1500 }), /larger than the snapshot object limit/);
    ok(`parts: ${split.objects.length} objects each <= ${limit} bytes, headers part/parts, lines equal the unsplit snapshot, sha256 over all parts, restore from parts equals fixtures`);
  }

  // 7. delta: shared delta ops, applied on top of the full snapshot with the reference applier
  const cursorBefore = vault.cursor('__snapshot__:' + cg);
  assert.equal(cursorBefore, vault.headSeq(), 'cursor moved to the head after the full snapshot');
  const q = await builder.build('delta');
  assert.deepEqual(q, { ok: false, reason: 'unchanged' });
  assert.equal(store.manifest.length, 1);
  ok('delta with no vault change publishes nothing (unchanged)');

  vault.applyOps(asOps(jsonl(`${SH}/sync_examples/delta_sequence.jsonl`)));
  const r2 = await builder.build('delta');
  assert.equal(r2.ok, true);
  assert.equal(r2.kind, 'delta');
  assert.equal(r2.upgraded, false);
  assert.equal(r2.row.seq, 2);
  const company2 = vault.readTable('tm_company')[0];
  assert.equal(r2.row.from_alter_id, r1.row.to_alter_id);
  assert.equal(r2.row.to_alter_id, Number(company2.alter_id_voucher));
  assert.ok(r2.row.to_alter_id >= r2.row.from_alter_id);
  const od = store.objects.get(`${LIC}/${cg}/delta/2-1.lbs`);
  const dd = S.decodeSnapshotObject(od, key, LIC);
  assert.equal(dd.header.kind, 'delta');
  assert.equal(dd.lines[0].table, 'tm_company');
  assert.ok(!dd.lines.some((l) => 'clear' in l));
  const dels = dd.lines.filter((l) => 'delete' in l);
  assert.ok(dels.length > 0, 'the delta carries deletes');
  assert.ok(dd.lines.length < d1.lines.length, 'a delta is much smaller than the full snapshot');
  {
    const f1 = writeJsonl('full2.jsonl', toChunks([o1], key));
    const f2 = writeJsonl('delta2.jsonl', toChunks([od], key));
    const r = applier(f1, f2);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    ok('delta: from/to alter ids, only changes + company row, full snapshot + delta equals the shared delta result (reference applier)');
  }
  assert.equal(vault.cursor('__snapshot__:' + cg), vault.headSeq());

  // 8. seq numbering across kinds; sha of the delta
  assert.equal(r2.row.sha256, crypto.createHash('sha256').update(od).digest('hex'));
  // a pull that moved the company alter id: the next delta spans from the previous to_alter_id to the new one
  vault.upsert('tm_company', [{ ...vault.readTable('tm_company')[0], alter_id_voucher: Number(company2.alter_id_voucher) + 1 }]);
  assert.deepEqual(await builder.build('delta'), { ok: false, reason: 'unchanged' }, 'a company row change alone is not a change');
  const led = vault.readTable('tm_ledger')[0];
  vault.upsert('tm_ledger', [{ ...led, name: led.name + ' X' }]);
  const rb = await builder.build('delta');
  assert.equal(rb.row.seq, 3);
  assert.equal(rb.row.from_alter_id, r2.row.to_alter_id);
  assert.equal(rb.row.to_alter_id, r2.row.to_alter_id + 1);
  const r3 = await builder.build('full');
  assert.equal(r3.row.seq, 4);
  assert.equal(r3.row.to_alter_id, rb.row.to_alter_id);
  ok('seq is one counter per company across kinds (full 1, delta 2, delta 3, full 4); alter id range follows the company row');

  // 9. delta with no full snapshot, or a stale cursor, becomes a full one
  {
    const st3 = fakeStore();
    const b3 = mk({ store: st3.port });
    vault.setCursor('__snapshot__:' + cg, vault.headSeq());
    const r = await b3.build('delta');
    assert.equal(r.ok, true); assert.equal(r.kind, 'full'); assert.equal(r.upgraded, true);
    const st4 = fakeStore();
    st4.manifest.push({ ...r3.row, created_at: 'x' });
    vault.dropDevice('__snapshot__:' + cg);
    const r4 = await mk({ store: st4.port }).build('delta');
    assert.equal(r4.kind, 'full'); assert.equal(r4.upgraded, true); assert.equal(r4.row.seq, 5);
    ok('a delta that cannot be built (no full yet, no cursor) is upgraded to a full snapshot');
  }

  // 10. failures publish nothing and leave the cursor
  {
    const st5 = fakeStore();
    const b5 = mk({ store: st5.port, maxObjectBytes: 2500 });
    st5.failPutAt = 1;
    const c0 = vault.cursor('__snapshot__:' + cg);
    await assert.rejects(() => b5.build('full'), /offline/);
    assert.equal(st5.manifest.length, 0);
    assert.equal(st5.objects.size, 0, 'already uploaded parts removed');
    assert.equal(st5.removed.length, 1);
    st5.failPutAt = null; st5.failManifest = true;
    await assert.rejects(() => b5.build('full'), /db down/);
    assert.equal(st5.objects.size, 0);
    assert.equal(st5.manifest.length, 0);
    assert.equal(vault.cursor('__snapshot__:' + cg), c0);
    st5.failManifest = false;
    const ok5 = await b5.build('full');
    assert.equal(ok5.ok, true); assert.equal(ok5.row.seq, 1); assert.ok(ok5.parts > 1);
    assert.equal(st5.objects.size, ok5.parts);
    ok('upload or manifest failure: nothing published, uploaded parts removed, cursor unmoved; a retry succeeds with the same seq');
  }

  // 11. single-flight, empty vault, bad path segments
  {
    const st6 = fakeStore();
    const b6 = mk({ store: st6.port });
    const [a, b] = await Promise.all([b6.build('full'), b6.build('full')]);
    assert.equal(a, b);
    assert.equal(st6.manifest.length, 1);
    const empty = V.openVault({ dir: path.join(tmp, 'vault-empty') });
    await assert.rejects(() => mk({ getVault: () => empty, store: fakeStore().port }).build('full'), /not read the company/);
    await assert.rejects(() => mk({ licenseKey: () => null }).build('full'), /No license/);
    assert.throws(() => S.snapshotPrefix('a/b', 'g', 'full', 1), /storage path/);
    assert.throws(() => S.snapshotPrefix(LIC, '..', 'full', 1), /storage path/);
    empty.close();
    ok('single-flight (two calls, one snapshot), empty vault and missing license refused, unsafe path segments refused');
  }

  // 12. log hygiene and wiring hygiene
  {
    const log = fs.readFileSync(logFilePath(0), 'utf8');
    assert.ok(log.includes('snapshot published'));
    assert.ok(!log.includes(company.name) && !log.includes(cg) && !log.includes(LIC));
    assert.ok(!/[\u{1F300}-\u{1FAFF}]/u.test(fs.readFileSync('src/main/snapshot/build.ts', 'utf8')));
    ok('log has sizes and counts only (no company name, guid or license key); no emoji in the module');
  }

  vault.close();
  fs.rmSync(out, { recursive: true, force: true });
  console.log(`\nall ${n} checks passed`);
})().catch((e) => { console.error(e); process.exit(1); });
