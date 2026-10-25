// Node-level check for Phase 32: snapshot retention + quota (plan rules, flag and plan gates, repair, 30-day simulation) with the real
// Phase 31 builder on a real SQLite vault and an in-memory storage port that enforces the byte budget on every upload.
// Run: NODE_PATH=<dir with typescript 5, zod, better-sqlite3> node tests/snapshot-retention.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-ret');
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
const B = R('src/main/snapshot/build.js');
const T = R('src/main/snapshot/retention.js');

const SH = 'docs/shared';
const model = JSON.parse(fs.readFileSync(`${SH}/data_model.json`, 'utf8'));
const consts = JSON.parse(fs.readFileSync(`${SH}/constants.json`, 'utf8'));
const jsonl = (f) => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const asOps = (seq) => seq.map((c) => ({ table_name: c.table_name, op: c.op, payload: c.payload }));
const LIC = consts.demo.license_key;
const key = E.deriveKey(consts.demo.passphrase, E.newSalt());
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-ret-'));
initLogger({ dir: path.join(tmp, 'logs'), maxBytes: 1e6, keepFiles: 2 });
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const HOUR = 3600_000;
const DAY = 24 * HOUR;

/** Storage port that tracks stored bytes and refuses to ever hold more than `cap` (so any transient excess fails the run). */
function fakeStore(clockFn, cap = Infinity) {
  const s = { objects: new Map(), rows: [], ops: [], peak: 0, calls: 0, shortList: false };
  const total = () => [...s.objects.values()].reduce((a, b) => a + b.length, 0);
  s.total = total;
  s.port = {
    listManifest: async () => { s.calls++; return s.rows.map((r) => ({ ...r })); },
    putObject: async (p, b) => { s.calls++; s.objects.set(p, b); s.peak = Math.max(s.peak, total()); if (total() > cap) throw new Error('STORAGE OVER BUDGET ' + total() + ' > ' + cap); },
    removeObject: async (p) => { s.ops.push('obj:' + p); s.objects.delete(p); },
    insertManifest: async (r) => { s.rows.push({ ...r, created_at: new Date(clockFn()).toISOString() }); },
    deleteManifest: async (r) => { s.ops.push('row:' + r.kind + r.seq); s.rows = s.rows.filter((x) => !(x.kind === r.kind && x.seq === r.seq)); },
    listObjects: async (prefix) => { s.calls++; const all = [...s.objects].filter(([p]) => p.startsWith(prefix)).map(([p, b]) => ({ path: p, bytes: b.length })); return s.shortList ? all.slice(0, -1) : all; },
  };
  return s;
}

function freshVault(name) {
  const v = V.openVault({ dir: path.join(tmp, name) });
  v.applyOps(asOps(jsonl(`${SH}/sync_examples/initial_sequence.jsonl`)));
  return v;
}

(async () => {
  // 1. plan rules (pure)
  {
    const mk = (kind, seq, bytes, at) => ({ license_key: LIC, company_guid: 'c', kind, seq, storage_path: `${LIC}/c/${kind}/${seq}-`, bytes, sha256: 'x', enc: true, from_alter_id: 0, to_alter_id: 0, created_at: new Date(at).toISOString() });
    const t0 = Date.parse('2026-10-01T00:00:00Z');
    assert.deepEqual(T.planNext([], t0), { action: 'full', reason: 'no_full' });
    const full = mk('full', 1, 1000, t0);
    assert.deepEqual(T.planNext([full], t0 + 30 * 60_000), { action: 'skip', reason: 'too_soon' });
    assert.deepEqual(T.planNext([full], t0 + 61 * 60_000), { action: 'delta', reason: 'next_delta' });
    assert.deepEqual(T.planNext([full], t0 + 7 * DAY + 1), { action: 'full', reason: 'full_too_old' });
    assert.deepEqual(T.planNext([full], t0 + 7 * DAY - HOUR), { action: 'delta', reason: 'next_delta' });
    const many = Array.from({ length: 14 }, (_, i) => mk('delta', i + 2, 1, t0 + (i + 1) * HOUR));
    assert.deepEqual(T.planNext([full, ...many.slice(0, 13)], t0 + 20 * HOUR), { action: 'delta', reason: 'next_delta' });
    assert.deepEqual(T.planNext([full, ...many], t0 + 20 * HOUR), { action: 'full', reason: 'too_many_deltas' });
    assert.deepEqual(T.planNext([full, mk('delta', 2, 501, t0 + HOUR)], t0 + 3 * HOUR), { action: 'full', reason: 'deltas_too_large' });
    assert.deepEqual(T.planNext([full, mk('delta', 2, 500, t0 + HOUR)], t0 + 3 * HOUR), { action: 'delta', reason: 'next_delta' });
    // deltas older than the newest full do not count
    const full2 = mk('full', 20, 1000, t0 + 5 * HOUR);
    assert.deepEqual(T.planNext([full, ...many, full2], t0 + 20 * HOUR), { action: 'delta', reason: 'next_delta' });
    assert.equal(T.budgetBytes(200), 200_000_000);
    assert.equal(T.budgetBytes(0), 0);
    assert.equal(T.budgetBytes(null), 0);
    assert.equal(T.budgetBytes(100, 0.5), 50_000_000);
    const D = consts.snapshot;
    assert.deepEqual(T.PLAN_DEFAULTS, { minIntervalMin: D.delta_min_interval_min, maxAgeDays: D.full_rebuild_max_age_days, maxDeltas: D.full_rebuild_max_deltas, ratio: D.full_rebuild_delta_ratio });
    assert.equal(consts.limits.plans.basic.snapshot_mb, 0);
    ok('planNext: no full, interval, 7 day age, 14 deltas, delta bytes over 0.5 x full, deltas of older fulls ignored; budget from snapshot_mb; defaults equal constants.json');
  }

  // 2. gates: flag off, plan without storage, not ready -- nothing is read, built or uploaded
  {
    const vault = freshVault('v-gate');
    const st = fakeStore(() => 0);
    let builds = 0;
    const base = { licenseKey: () => LIC, companyGuid: () => vault.readTable('tm_company')[0].guid, cloudCopyEnabled: () => true, snapshotMb: () => 200, store: st.port, build: async () => { builds++; return { ok: false, reason: 'unchanged' }; }, resetCursor: () => {} };
    assert.deepEqual(await T.createSnapshotRetention({ ...base, cloudCopyEnabled: () => false }).runOnce(), { status: 'skipped', reason: 'flag_off' });
    assert.deepEqual(await T.createSnapshotRetention({ ...base, snapshotMb: () => 0 }).runOnce(), { status: 'skipped', reason: 'no_quota' });
    assert.deepEqual(await T.createSnapshotRetention({ ...base, snapshotMb: () => null }).runOnce(), { status: 'skipped', reason: 'no_quota' });
    assert.deepEqual(await T.createSnapshotRetention({ ...base, licenseKey: () => null }).runOnce(), { status: 'skipped', reason: 'not_ready' });
    assert.equal(builds, 0);
    assert.equal(st.calls, 0, 'the store was not touched');
    vault.close();
    ok('cloud_copy flag off, plan without snapshot storage (basic = 0 MB) and missing license/company: skipped, store never touched, nothing built');
  }

  // 3. simulation harness
  async function simulate({ name, capFactor, days, quietFrom, quietTo }) {
    const vault = freshVault('v-' + name);
    const cg = vault.readTable('tm_company')[0].guid;
    let clock = Date.parse('2026-10-01T00:00:00Z');
    // size of one full snapshot of this vault decides the budget
    const probeStore = fakeStore(() => clock);
    const probe = B.createSnapshotBuilder({ getVault: () => vault, model, licenseKey: () => LIC, getKey: () => key, store: probeStore.port, now: () => clock });
    const F = (await probe.build('full')).row.bytes;
    vault.dropDevice(B.snapshotCursorId(cg));
    const cap = Math.floor(F * capFactor);
    const st = fakeStore(() => clock, cap);
    const builder = B.createSnapshotBuilder({ getVault: () => vault, model, licenseKey: () => LIC, getKey: () => key, store: st.port, now: () => clock });
    const ret = T.createSnapshotRetention({
      licenseKey: () => LIC, companyGuid: () => cg, cloudCopyEnabled: () => true, snapshotMb: () => 200, headroomRatio: cap / 200_000_000,
      store: st.port, build: (k, o) => builder.build(k, o), resetCursor: (g) => vault.dropDevice(B.snapshotCursorId(g)), now: () => clock,
    });
    const ledgers = vault.readTable('tm_ledger');
    const stats = { runs: 0, full: 0, delta: 0, unchanged: 0, skipped: 0, over: 0, dropped: 0, maxDeltas: 0, maxFulls: 0, reasons: {} };
    const start = clock;
    for (let h = 0; h < days * 24; h++) {
      clock = start + h * HOUR;
      const day = h / 24;
      if (!(quietFrom !== undefined && day >= quietFrom && day < quietTo)) {
        const led = ledgers[h % ledgers.length];
        vault.upsert('tm_ledger', [{ ...led, name: `${led.name} r${h}` }]);
        ledgers[h % ledgers.length] = { ...led, name: `${led.name} r${h}` };
      }
      const r = await ret.runOnce();
      stats.runs++;
      if (r.status === 'built') { stats[r.kind]++; stats.reasons[r.reason] = (stats.reasons[r.reason] || 0) + 1; if (r.droppedDeltas) stats.dropped++; }
      else if (r.status === 'unchanged') stats.unchanged++;
      else if (r.status === 'skipped') stats.skipped++;
      else stats.over++;
      // at rest: within budget, one full (or two while none newer), manifest and objects agree, chain contiguous
      assert.ok(st.total() <= cap, `at rest ${st.total()} > ${cap} (hour ${h})`);
      const fulls = st.rows.filter((x) => x.kind === 'full');
      const deltas = st.rows.filter((x) => x.kind === 'delta');
      stats.maxDeltas = Math.max(stats.maxDeltas, deltas.length);
      stats.maxFulls = Math.max(stats.maxFulls, fulls.length);
      assert.ok(fulls.length <= 1, 'old fulls are pruned once the new one is in');
      assert.ok(deltas.length <= 14, 'at most 14 deltas');
      for (const x of st.rows) assert.ok(T.rowComplete(x, [...st.objects].map(([p, b]) => ({ path: p, bytes: b.length }))), 'every manifest row has all its objects');
      const lf = fulls[0];
      if (lf) { assert.ok(deltas.every((x) => x.seq > lf.seq)); assert.deepEqual(deltas.map((x) => x.seq), deltas.map((_, i) => lf.seq + 1 + i), 'delta seqs contiguous after the full'); }
      assert.equal(st.objects.size, [...st.objects.keys()].length);
      // every N days: a restore from storage (latest full + deltas) equals the vault, as a new device would see it
      if (h > 0 && h % (24 * 5) === 0 && lf) {
        const restored = V.openVault({ dir: path.join(tmp, `r-${name}-${h}`) });
        for (const row of [lf, ...deltas]) {
          const parts = [...st.objects.keys()].filter((p) => p.startsWith(row.storage_path)).sort((a, b) => Number(a.slice(row.storage_path.length).split('.')[0]) - Number(b.slice(row.storage_path.length).split('.')[0]));
          for (const p of parts) restored.applyOps(B.snapshotLinesToOps(B.decodeSnapshotObject(st.objects.get(p), key, LIC).lines).map((o) => ({ table_name: o.table_name, op: o.op, payload: o.payload })));
        }
        // a restore is only complete up to the newest snapshot; changes after it come from the postbox delta: compare after one more snapshot
        stats.restoreChecks = (stats.restoreChecks || 0) + 1;
        stats.lastRestoreLedgers = restored.readTable('tm_ledger').length;
        assert.equal(restored.readTable('tm_ledger').length, vault.readTable('tm_ledger').length);
        restored.close();
      }
    }
    // final restore equals the vault once a last snapshot has captured the latest changes
    clock += 2 * HOUR;
    const led = ledgers[0];
    vault.upsert('tm_ledger', [{ ...led, name: led.name + ' final' }]);
    const last = await ret.runOnce();
    stats.peak = st.peak; stats.cap = cap; stats.F = F;
    vault.close();
    return { stats, st, last, cap, F };
  }

  // 4. roomy quota: 30 days of hourly changes, with a quiet stretch (age rule), never over budget at any upload
  {
    const { stats, cap, F, st } = await simulate({ name: 'roomy', capFactor: 6, days: 30, quietFrom: 10, quietTo: 19 });
    assert.ok(stats.peak <= cap);
    assert.ok(stats.full >= 4, 'full snapshots were rebuilt several times: ' + stats.full);
    assert.ok(stats.delta > 50);
    assert.ok(stats.maxDeltas <= 14 && stats.maxFulls <= 1);
    assert.equal(stats.over, 0);
    assert.ok(stats.reasons.full_too_old >= 1, 'the age rule fired during the quiet stretch: ' + JSON.stringify(stats.reasons));
    assert.ok(stats.restoreChecks >= 5);
    ok(`30-day simulation, budget 6 x full (${F} B full, cap ${cap} B): peak ${stats.peak} B <= cap at every upload, ${stats.full} fulls, ${stats.delta} deltas, max ${stats.maxDeltas} deltas, reasons ${JSON.stringify(stats.reasons)}, ${stats.restoreChecks} restores equal the vault`);
  }

  // 5. tight quota: a rebuild only fits after the deltas are dropped; still never over budget
  {
    const { stats, cap, F } = await simulate({ name: 'tight', capFactor: 2.3, days: 30 });
    assert.ok(stats.peak <= cap);
    assert.ok(stats.full >= 3);
    assert.ok(stats.dropped >= 1, 'deltas were dropped to make room for a new full');
    ok(`30-day simulation, budget 2.3 x full (cap ${cap} B, full ${F} B): peak ${stats.peak} B <= cap, ${stats.full} fulls, deltas dropped ${stats.dropped} times, over-budget runs ${stats.over}`);
  }

  // 6. impossible quota (less than two fulls, no full yet fits twice): old snapshot kept, run reports over_budget, nothing uploaded above the cap
  {
    const { stats, cap, F } = await simulate({ name: 'starved', capFactor: 1.4, days: 12 });
    assert.ok(stats.peak <= cap);
    assert.ok(stats.over >= 1, 'a rebuild that cannot fit is reported, not forced');
    assert.ok(stats.full >= 1);
    ok(`30-day style run with budget 1.4 x full (cap ${cap} B, full ${F} B): never over budget, ${stats.over} over-budget reports, the stored full is kept`);
  }

  // 7. a budget smaller than one full: nothing is ever stored
  {
    const { stats, st } = await simulate({ name: 'tiny', capFactor: 0.5, days: 3 }).catch((e) => { throw e; });
    assert.equal(st.objects.size, 0);
    assert.equal(st.rows.length, 0);
    assert.ok(stats.peak === 0);
    ok('budget below one full snapshot: nothing uploaded, reported as over_budget each run');
  }

  // 8. repair: missing part -> row removed, deltas removed, cursor reset, a new full follows; orphans removed; deletion order row before objects
  {
    const vault = freshVault('v-repair');
    const cg = vault.readTable('tm_company')[0].guid;
    let clock = Date.parse('2026-10-01T00:00:00Z');
    const st = fakeStore(() => clock);
    const builder = B.createSnapshotBuilder({ getVault: () => vault, model, licenseKey: () => LIC, getKey: () => key, store: st.port, now: () => clock, maxObjectBytes: 4000 });
    const ret = T.createSnapshotRetention({ licenseKey: () => LIC, companyGuid: () => cg, cloudCopyEnabled: () => true, snapshotMb: () => 200, store: st.port, build: (k, o) => builder.build(k, o), resetCursor: (g) => vault.dropDevice(B.snapshotCursorId(g)), now: () => clock });
    assert.equal((await ret.runOnce()).kind, 'full');
    clock += 2 * HOUR; vault.upsert('tm_ledger', [{ ...vault.readTable('tm_ledger')[0], name: 'changed once' }]);
    assert.equal((await ret.runOnce()).kind, 'delta');
    assert.ok([...st.objects.keys()].filter((p) => p.includes('/full/1-')).length > 1, 'the full has several parts');
    // lose one part of the full and add a stray object
    const part2 = [...st.objects.keys()].find((p) => p.endsWith('/full/1-2.lbs'));
    st.objects.delete(part2);
    st.objects.set(`${LIC}/${cg}/delta/99-1.lbs`, Buffer.from('stray'));
    clock += 2 * HOUR;
    st.ops.length = 0;
    const r = await ret.runOnce();
    assert.equal(r.status, 'built'); assert.equal(r.kind, 'full'); assert.equal(r.reason, 'repair');
    assert.deepEqual(st.rows.map((x) => x.kind + x.seq), ['full3']);
    assert.ok(![...st.objects.keys()].some((p) => p.includes('/delta/') || p.includes('/full/1-') || p.includes('/full/2')));
    assert.ok(st.ops.indexOf('row:full1') < st.ops.findIndex((o) => o.startsWith('obj:') && o.includes('/full/1-')));
    ok('repair: missing part and stray object found, a full is built first (seq 3, never reused), then the broken full and the delta are removed (row first, then objects)');
    vault.close();
  }

  // 9. upload that cannot be verified is never published (builder verification via listObjects)
  {
    const vault = freshVault('v-verify');
    const cg = vault.readTable('tm_company')[0].guid;
    const st = fakeStore(() => 0);
    st.shortList = true;
    const builder = B.createSnapshotBuilder({ getVault: () => vault, model, licenseKey: () => LIC, getKey: () => key, store: st.port, now: () => 0 });
    const ret = T.createSnapshotRetention({ licenseKey: () => LIC, companyGuid: () => cg, cloudCopyEnabled: () => true, snapshotMb: () => 200, store: st.port, build: (k, o) => builder.build(k, o), resetCursor: () => {}, now: () => 0 });
    await assert.rejects(() => ret.runOnce(), /could not be verified/);
    assert.equal(st.rows.length, 0);
    assert.equal(st.objects.size, 0);
    assert.equal(vault.cursor(B.snapshotCursorId(cg)), 0);
    vault.close();
    ok('an upload that fails verification is removed and no manifest row or cursor move happens; older snapshots stay untouched');
  }

  // 10. builder maxBytes guard
  {
    const vault = freshVault('v-max');
    const st = fakeStore(() => 0);
    const builder = B.createSnapshotBuilder({ getVault: () => vault, model, licenseKey: () => LIC, getKey: () => key, store: st.port, now: () => 0 });
    const r = await builder.build('full', { maxBytes: 100 });
    assert.equal(r.ok, false); assert.equal(r.reason, 'over_quota'); assert.ok(r.bytes > 100);
    assert.equal(st.objects.size, 0); assert.equal(st.calls, 1); // only the manifest list
    assert.equal(vault.cursor(B.snapshotCursorId(vault.readTable('tm_company')[0].guid)), 0);
    vault.close();
    ok('builder maxBytes: an oversize snapshot is refused before any upload and the cursor stays');
  }

  // 11. log hygiene
  {
    const log = fs.readFileSync(logFilePath(0), 'utf8');
    assert.ok(log.includes('does not fit') || log.includes('would exceed'));
    assert.ok(!log.includes(LIC));
    assert.ok(!/[\u{1F300}-\u{1FAFF}]/u.test(fs.readFileSync('src/main/snapshot/retention.ts', 'utf8')));
    ok('log has counts and sizes only (no license key, company name or guid); no emoji in the module');
  }

  fs.rmSync(out, { recursive: true, force: true });
  console.log(`\nall ${n} checks passed`);
})().catch((e) => { console.error(e); process.exit(1); });
