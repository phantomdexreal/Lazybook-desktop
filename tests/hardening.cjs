// Phase 41 check: crash-loop guard, low disk, memory, wall-clock jumps, hourly health check, the 200k-voucher lookup path on a real SQLite vault,
// the antivirus-friendliness audit of the sources, and the wiring greps.
// Run: NODE_PATH=<dir with typescript 5 and better-sqlite3> [LB_PERF_N=200000] node tests/hardening.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-hard-'));
const compile = (rel) => {
  const out = path.join(tmp, rel.replace(/\.ts$/, '.js'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, ts.transpileModule(fs.readFileSync(rel, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } }).outputText);
  return out;
};
const H = require(compile('src/main/hardening.ts'));
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const MB = 1048576;

// 1. crash-loop guard
{
  const file = path.join(tmp, 'g', 'start-history.json');
  let t = 1_000_000;
  const g = H.createCrashGuard({ file, now: () => t });
  let v = g.begin();
  assert.deepEqual(v, { loop: false, recentCrashes: 0, delayMs: 0 });
  g.markClean();
  t += 1000;
  v = g.begin(); // previous was clean
  assert.equal(v.recentCrashes, 0);
  // three starts that never shut down cleanly
  t += 1000; v = g.begin(); assert.equal(v.recentCrashes, 1); assert.equal(v.loop, false); assert.equal(v.delayMs, 10_000);
  t += 1000; v = g.begin(); assert.equal(v.recentCrashes, 2); assert.equal(v.delayMs, 20_000);
  t += 1000; v = g.begin(); assert.equal(v.recentCrashes, 3); assert.equal(v.loop, true);
  // old crashes age out of the window
  t += 11 * 60_000; v = g.begin(); assert.equal(v.recentCrashes, 0); assert.equal(v.loop, false);
  // a healthy run forgives
  g.markHealthy();
  t += 1000; v = g.begin(); assert.equal(v.recentCrashes, 0);
  // delay is capped
  for (let i = 0; i < 12; i++) { t += 100; v = g.begin(); }
  assert.ok(v.delayMs <= 5 * 60_000);
  // damaged file and unwritable location never throw
  fs.writeFileSync(file, '{not json');
  assert.deepEqual(H.createCrashGuard({ file, now: () => t }).begin(), { loop: false, recentCrashes: 0, delayMs: 0 });
  const blocker = path.join(tmp, 'blocker');
  fs.writeFileSync(blocker, 'x');
  const g2 = H.createCrashGuard({ file: path.join(blocker, 'sub', 'h.json'), now: () => t });
  g2.begin(); g2.markClean(); g2.markHealthy();
  ok('crash guard: loop after 3 unclean starts in 10 min, growing then capped delay, window ageing, clean and healthy marks, damaged or unwritable file never throws');
}

// 2. disk
{
  assert.equal(H.assessDisk(50 * MB, 10 * MB).level, 'critical');
  assert.equal(H.assessDisk(300 * MB, 10 * MB).level, 'low');
  assert.equal(H.assessDisk(900 * MB, 10 * MB).level, 'ok');
  assert.equal(H.assessDisk(1500 * MB, 2000 * MB).level, 'low'); // a 2 GB vault needs 3 GB free
  assert.equal(H.assessDisk(3500 * MB, 2000 * MB).level, 'ok');
  assert.equal(H.assessDisk(-1, 0).level, 'ok'); // unknown never blocks
  assert.match(H.assessDisk(50 * MB, 0).message, /paused/);
  assert.equal(H.freeBytesOf('x', () => ({ bavail: 100n, bsize: 4096n })), 409600);
  assert.equal(H.freeBytesOf('x', () => { throw new Error('nope'); }), null);
  for (const e of [{ code: 'ENOSPC' }, { code: 'SQLITE_FULL' }, new Error('database or disk is full'), new Error('No space left on device')]) assert.equal(H.isDiskFullError(e), true);
  for (const e of [{ code: 'EACCES' }, new Error('boom'), null, undefined]) assert.equal(H.isDiskFullError(e), false);
  ok('disk: critical, low and ok thresholds scale with the vault, unknown is ok, statfs seam, disk-full error detection');
}

// 3. memory
{
  const h = 3_600_000;
  const s = (mb, i) => ({ rss: mb * MB, at: i * h });
  assert.equal(H.assessMemory([]).level, 'ok');
  assert.equal(H.assessMemory([s(300, 0), s(320, 1)]).level, 'ok');
  assert.equal(H.assessMemory([s(300, 0), s(1300, 1)]).level, 'high');
  assert.equal(H.assessMemory([s(2100, 0), s(2200, 1)]).level, 'high'); // two samples are not enough to restart
  assert.equal(H.assessMemory([s(2100, 0), s(2200, 1), s(2300, 2)]).level, 'restart');
  assert.equal(H.assessMemory([s(2100, 0), s(900, 1), s(2300, 2)]).level, 'high');
  // slow leak: +200 MB per hour for 7 hours ends above the warn line
  const leak = Array.from({ length: 8 }, (_, i) => s(300 + 200 * i, i));
  const r = H.assessMemory(leak);
  assert.equal(r.level, 'restart'); assert.ok(r.growthMbPerHour > 190 && r.growthMbPerHour < 210);
  // a fast rise that is short is not a leak verdict
  assert.equal(H.assessMemory([s(300, 0), { rss: 1300 * MB, at: 20 * 60_000 }]).level, 'high');
  const many = Array.from({ length: 60 }, (_, i) => s(100, i)).reduce((a, x) => H.pushSample(a, x), []);
  assert.equal(many.length, 48);
  // measured constants: 200k vouchers and 400k lines is about 1.1 GB wholesale
  const est = H.estimateLoadBytes({ vouchers: 200000, lines: 400000 });
  assert.ok(est > 1000 * MB && est < 1300 * MB, String(est / MB));
  ok('memory: ok, high, restart on 3 high samples, leak rule needs 6 h of growth, ring of 48 samples, load estimate near the measured 1.1 GB');
}

// 4. wall clock
{
  let wall = 1_000_000, mono = 0;
  const w = H.createClockWatch({ wall: () => wall, mono: () => mono });
  wall += 60_000; mono += 60_000;
  assert.equal(w.tick(), null);
  wall += 3_600_000; mono += 5_000; // slept an hour, monotonic barely moved
  const j = w.tick();
  assert.ok(j && j.likelySleep && Math.abs(j.jumpMs - 3_595_000) < 10);
  wall -= 600_000; mono += 60_000; // user set the clock back 10 minutes
  const b = w.tick();
  assert.ok(b && !b.likelySleep && b.jumpMs < -600_000);
  wall += 61_000; mono += 60_000;
  assert.equal(w.tick(), null);
  ok('clock watch: quiet while steady, reports a sleep-sized forward jump and a clock set back, small drift ignored');
}

// 5. health check
{
  const now = 100 * 3_600_000;
  const base = { now, paused: false, blocked: false, vaultOpen: true, intervalMin: 5, syncRunning: false, syncStartedAt: null, lastSyncAt: now - 600_000, startedAt: now - 5 * 3_600_000, tallyOnline: true, disk: 'ok', memory: 'ok', entryPollFailures: 0 };
  const run = (o) => H.assessHealth({ ...base, ...o });
  assert.deepEqual(run({}), { ok: true, actions: [], notes: [] });
  assert.deepEqual(run({ syncRunning: true, syncStartedAt: now - 31 * 60_000 }).actions, ['restart_scheduler']);
  assert.deepEqual(run({ syncRunning: true, syncStartedAt: now - 10 * 60_000 }).actions, []);
  assert.deepEqual(run({ lastSyncAt: now - 90 * 60_000 }).actions, ['warn_stalled']);
  assert.deepEqual(run({ lastSyncAt: now - 150 * 60_000 }).actions, ['warn_stalled', 'restart_scheduler']);
  assert.deepEqual(run({ lastSyncAt: null, startedAt: now - 100 * 60_000 }).actions, ['warn_stalled']); // never synced since start
  for (const o of [{ paused: true }, { blocked: true }, { tallyOnline: false }, { vaultOpen: false }, { disk: 'critical' }]) assert.ok(!run({ ...o, lastSyncAt: now - 10 * 3_600_000 }).actions.includes('restart_scheduler'), JSON.stringify(o));
  assert.deepEqual(run({ tallyOnline: false }).actions, ['warn_tally']);
  assert.deepEqual(run({ disk: 'low' }).actions, ['warn_disk']);
  assert.deepEqual(run({ memory: 'high' }).actions, ['warn_memory']);
  assert.deepEqual(run({ memory: 'restart' }).actions, ['restart_app']);
  assert.deepEqual(run({ memory: 'restart', syncRunning: true, syncStartedAt: now - 60_000 }).actions, []); // never restart mid-cycle
  assert.deepEqual(run({ entryPollFailures: 12 }).actions, ['warn_stalled']);
  assert.deepEqual(run({ startedAt: now - 20.5 * 3_600_000 }).actions, ['check_integrity']);
  ok('health check: stuck cycle, stalled sync, quiet when paused / blocked / offline / disk critical, restart only between cycles, daily integrity check');
}

// 6. 200k vouchers on a real SQLite vault
let perf = null;
try {
  require('better-sqlite3');
  perf = true;
} catch {
  console.log('skip - better-sqlite3 is not available, 200k perf check not run');
}
if (perf) {
  const N = Number(process.env.LB_PERF_N || 200000);
  for (const sub of ['src/main', 'src/main/db']) for (const f of fs.readdirSync(sub).filter((x) => x.endsWith('.ts') && x !== 'hardening.ts')) { if (sub === 'src/main' && !['logger.ts', 'errors.ts'].includes(f)) continue; compile(path.join(sub, f)); }
  fs.mkdirSync(path.join(tmp, 'docs/shared'), { recursive: true });
  fs.copyFileSync('docs/shared/data_model.json', path.join(tmp, 'docs/shared/data_model.json'));
  require(path.join(tmp, 'src/main/logger.js')).initLogger({ dir: path.join(tmp, 'logs') });
  const V = require(path.join(tmp, 'src/main/db/index.js'));
  const fx = (t) => JSON.parse(fs.readFileSync(`docs/shared/fixtures/tables/${t}.json`, 'utf8'));
  const v0 = fx('tx_voucher')[0];
  const l0 = fx('tx_ledger_line').filter((r) => r.voucher_guid === v0.guid).slice(0, 2);
  const vault = V.openVault({ dir: path.join(tmp, 'vault') });
  let vs = [], ls = [];
  const flush = () => { vault.bulkLoad('tx_voucher', vs); vault.bulkLoad('tx_ledger_line', ls); vs = []; ls = []; };
  for (let i = 0; i < N; i++) {
    const g = 'g' + String(i).padStart(8, '0');
    const d = new Date(Date.UTC(2024, 0, 1) + (i % 900) * 864e5).toISOString().slice(0, 10);
    vs.push({ ...v0, guid: g, date: d, number: 'N' + i, alter_id: i + 1, master_id: i + 1, remote_id: i % 10 === 0 ? 'r' + i : '' });
    l0.forEach((l, k) => ls.push({ ...l, voucher_guid: g, line_index: k, voucher_date: d }));
    if (vs.length === 20000) flush();
  }
  if (vs.length) flush();
  assert.equal(vault.count('tx_voucher'), N);
  if (global.gc) global.gc();
  const rss0 = process.memoryUsage().rss;
  let t0 = Date.now();
  const keys = vault.readColumns('tx_voucher', ['guid', 'voucher_type_guid', 'number', 'remote_id']);
  const slimMs = Date.now() - t0;
  const rssSlim = process.memoryUsage().rss - rss0;
  assert.equal(keys.length, N);
  assert.deepEqual(Object.keys(keys[0]), ['guid', 'voucher_type_guid', 'number', 'remote_id']);
  t0 = Date.now();
  const s1 = vault.stamp('tx_voucher');
  const stampMs = Date.now() - t0;
  assert.equal(s1, `${N}:${N}`);
  assert.ok(stampMs < 200, `stamp took ${stampMs} ms`);
  assert.ok(slimMs < 5000, `slim read took ${slimMs} ms`);
  assert.ok(rssSlim < 200 * MB, `slim read grew memory by ${Math.round(rssSlim / MB)} MB`);
  // the stamp moves when a voucher is added or changed
  vault.bulkLoad('tx_voucher', [{ ...v0, guid: 'gnew', number: 'NEW', alter_id: N + 5, master_id: N + 5 }]);
  assert.notEqual(vault.stamp('tx_voucher'), s1);
  assert.match(vault.stamp('tx_ledger_line'), /^\d+$/); // child tables have no alter id: the count only
  assert.throws(() => vault.readColumns('tx_voucher', ['guid', 'no_such_column']), /Unknown vault column/);
  assert.throws(() => vault.readColumns('no_such_table', ['guid']), /Unknown vault table/);
  assert.throws(() => vault.readColumns('tx_voucher', ['guid"; DROP TABLE tx_voucher; --']), /Unknown vault column/);
  assert.equal(vault.count('tx_voucher'), N + 1);
  t0 = Date.now();
  const q = vault.integrityCheck('quick');
  const quickMs = Date.now() - t0;
  assert.ok(q.ok);
  ok(`200k vouchers: slim lookup read ${slimMs} ms (+${Math.round(rssSlim / MB)} MB) instead of about 6 s and 850 MB, change stamp ${stampMs} ms, quick integrity check ${quickMs} ms, unknown columns refused (N=${N})`);
  vault.close();
}

// 7. antivirus-friendliness audit of the sources (things scanners dislike in an unsigned app)
{
  const files = [];
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(e.name)) files.push(p); } })('src');
  const bad = /child_process|\beval\(|new Function\(|powershell|cmd\.exe|schtasks|reg(\.exe)?\s+add|\.vbs\b|\.bat\b|VirtualAlloc|WriteProcessMemory|keylog/i;
  const hits = files.filter((f) => !f.endsWith('hardening.ts') && bad.test(fs.readFileSync(f, 'utf8')));
  assert.deepEqual(hits, []);
  const ex = fs.readFileSync('electron-builder.yml', 'utf8');
  assert.match(ex, /allowElevation:\s*false/);
  assert.match(ex, /requestedExecutionLevel:\s*asInvoker/);
  ok(`antivirus audit: no process spawning, eval, scripts, registry or injection calls in ${files.length} source files; installer runs without elevation`);
}

// 8. wiring
{
  const idx = fs.readFileSync('src/main/index.ts', 'utf8');
  for (const needle of ["createCrashGuard", "crashGuard.markClean()", "startVerdict.loop", "diskLevel === 'critical'", "assessHealth(", "createClockWatch()", "entryTables(vault)", "v.readColumns('tx_voucher'", "v.stamp('tx_voucher')"]) assert.ok(idx.includes(needle), needle);
  assert.ok(!/readTable\(n\)[^\n]*'tx_voucher'/.test(idx), 'entry handlers must not read whole voucher rows');
  assert.ok(!/'tx_stock_group', 'tx_voucher'\]\) t\[n\]/.test(idx));
  ok('wiring: crash guard, safe mode, disk gate on the scheduler, hourly health check, clock watch, slim voucher lookups');
}
console.log(`all ${n} checks passed`);
