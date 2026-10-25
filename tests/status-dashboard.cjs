// Node-level check for Phase 33: status builder (main) and dashboard view helpers (renderer), plus wiring and hygiene greps.
// Run: NODE_PATH=<dir with typescript 5> node tests/status-dashboard.cjs
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-status');
fs.rmSync(out, { recursive: true, force: true });
for (const f of ['src/main/status.ts', 'src/renderer/lib/statusView.ts']) {
  const js = ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true });
  fs.writeFileSync(path.join(out, f.replace(/\.ts$/, '.js')), js);
}
const { createStatusBuilder, COUNT_TABLES } = require(path.join(out, 'src/main/status.js'));
const V = require(path.join(out, 'src/renderer/lib/statusView.js'));

let passed = 0;
const check = (name, fn) => { fn(); passed++; console.log('ok -', name); };

const NOW = Date.parse('2026-10-25T10:00:00Z');
const act = (o = {}) => ({ stage: 'active', companyName: 'Demo Co', licenseKeyMasked: 'LB-ABCD-****-****-WXYZ', email: 'a@b.c', expiresAt: '2027-10-19T00:00:00Z', blocking: null, offline: false, lastBootstrapAt: null, secureStorage: true, masterConfigured: true, ...o });
function deps(o = {}) {
  let counted = 0;
  const d = {
    activation: () => act(),
    bootstrap: () => ({ license: { max_devices: 5, max_companies: 1 }, features: { reports: true, entries: true, cloud_copy: false, e2e_encryption: true }, update: { update_available: true, latest: '1.2.0' } }),
    tally: () => ({ ok: true, version: 'TallyPrime 5.0', company: 'Demo Co' }),
    tallyDetection: () => ({ state: 'ok', message: 'Connected.' }),
    scheduler: () => ({ running: false, lastSyncAt: '2026-10-25T09:55:00Z', lastOutcome: { ok: true }, failures: 0, nextRunAt: '2026-10-25T10:05:00Z', message: null }),
    entries: () => ({ waiting: 2, posted: 10, failed: 0, needsReview: 0, pollFailures: 0, message: null }),
    vaultCount: (t) => { counted++; return { tm_ledger: 120, tm_group: 30, tm_stock_item: 45, tm_voucher_type: 14, tx_voucher: 123456 }[t] ?? 0; },
    vaultOpen: () => true,
    devicesOnline: () => 3,
    deviceRevoked: () => false,
    paused: () => false,
    crypto: () => 'ready',
    now: () => NOW,
    ...o,
  };
  d.counted = () => counted;
  return d;
}
const build = (o) => createStatusBuilder(deps(o)).build();

check('healthy status carries every field of the phase scope', () => {
  const s = build();
  assert.equal(s.license.companyName, 'Demo Co');
  assert.equal(s.tally.ok, true);
  assert.equal(s.internet, true);
  assert.equal(s.lastSyncAt, '2026-10-25T09:55:00Z');
  assert.equal(s.counts.tx_voucher, 123456);
  assert.equal(s.devicesOnline, 3);
  assert.equal(s.pendingEntries, 2);
  assert.deepEqual(s.errors, []);
  assert.deepEqual(s.update, { available: true, version: '1.2.0' });
  assert.equal(s.detail.flags.cloud_copy, false);
  assert.deepEqual(s.detail.limits, { maxDevices: 5, maxCompanies: 1 });
  assert.equal(s.detail.sync.lastOutcome, 'ok');
  assert.deepEqual(Object.keys(s.counts).sort(), [...COUNT_TABLES].sort());
});

check('counts are cached for the ttl and refreshed after invalidate', () => {
  const d = deps();
  const b = createStatusBuilder(d);
  b.build(); b.build();
  assert.equal(d.counted(), COUNT_TABLES.length);
  b.invalidateCounts(); b.build();
  assert.equal(d.counted(), COUNT_TABLES.length * 2);
  let t = NOW; const d2 = deps({ now: () => t }); const b2 = createStatusBuilder(d2);
  b2.build(); t += 6000; b2.build();
  assert.equal(d2.counted(), COUNT_TABLES.length * 2);
});

check('not activated: no license, no counts leak, nothing throws', () => {
  const s = build({ activation: () => ({ ...act(), stage: 'needs-license' }), scheduler: () => null, entries: () => null });
  assert.equal(s.license, null);
  assert.equal(s.errors.length > 0 && s.errors.some((e) => /Tally/.test(e)), false); // not active: no Tally nag
  assert.equal(s.pendingEntries, 0);
});

check('problems become plain error lines (tally, vault, passphrase, sync, entries, blocking, revoked)', () => {
  const s = build({
    activation: () => act({ blocking: { code: 'LB_MAINTENANCE', message: 'Down for maintenance.' } }),
    tally: () => ({ ok: false, version: null, company: null }),
    tallyDetection: () => ({ state: 'unreachable', message: 'Tally did not answer. Enable the XML server (F1, Settings, Connectivity).' }),
    vaultOpen: () => false,
    crypto: () => 'locked',
    deviceRevoked: () => true,
    scheduler: () => ({ running: false, lastSyncAt: null, lastOutcome: { ok: false }, failures: 3, nextRunAt: null, message: 'Tally did not answer.' }),
    entries: () => ({ waiting: 0, posted: 0, failed: 1, needsReview: 2, pollFailures: 1, message: 'Entries are not reaching the server.' }),
  });
  const all = s.errors.join('\n');
  for (const re of [/maintenance/, /removed by the administrator/, /XML server/, /local data store/, /passphrase is locked/, /Tally did not answer\./, /1 entry failed/, /2 entries need your review/, /not reaching the server/]) assert.match(all, re);
  assert.deepEqual(s.counts, {}); // closed vault: no counts
  assert.equal(s.detail.sync.lastOutcome, 'failed');
});

check('a throwing source never throws out of build()', () => {
  const boom = () => { throw new Error('x'); };
  const s = build({ tally: boom, scheduler: boom, entries: boom, bootstrap: boom, vaultCount: boom, devicesOnline: boom });
  assert.equal(s.tally.ok, false);
  assert.equal(s.devicesOnline, 0);
  assert.equal(s.lastSyncAt, null);
});

check('no secrets or names in the status beyond the masked key and company the user already sees', () => {
  const text = JSON.stringify(build());
  assert.doesNotMatch(text, /password|passphrase"|token|anon_key|service_role/i);
});

check('ago / until / daysLeft / formatCount', () => {
  assert.equal(V.ago(null, NOW), 'never');
  assert.equal(V.ago('2026-10-25T09:59:50Z', NOW), 'just now');
  assert.equal(V.ago('2026-10-25T09:55:00Z', NOW), '5 min ago');
  assert.equal(V.ago('2026-10-25T07:00:00Z', NOW), '3 h ago');
  assert.equal(V.ago('2026-10-22T10:00:00Z', NOW), '3 days ago');
  assert.equal(V.ago('garbage', NOW), 'unknown');
  assert.equal(V.until('2026-10-25T10:05:00Z', NOW), 'in 5 min');
  assert.equal(V.until('2026-10-25T09:00:00Z', NOW), 'due now');
  assert.equal(V.until(null, NOW), '-');
  assert.equal(V.daysLeft('2026-11-04T10:00:00Z', NOW), 10);
  assert.equal(V.daysLeft('2026-10-20T10:00:00Z', NOW) < 0, true);
  assert.equal(V.formatCount(123456), '1,23,456');
  assert.equal(V.formatCount(undefined), '-');
});

check('headline picks the most urgent problem first', () => {
  const ok = build();
  assert.equal(V.headline(ok, NOW).level, 'ok');
  assert.match(V.headline(ok, NOW).text, /5 min ago/);
  assert.equal(V.headline({ ...ok, license: null }, NOW).title, 'Not activated');
  assert.equal(V.headline({ ...ok, tally: { ok: false, version: null, company: null }, detail: { ...ok.detail, tally: { state: 'unreachable', message: 'Enable the XML server.' } } }, NOW).level, 'bad');
  assert.equal(V.headline({ ...ok, detail: { ...ok.detail, deviceRevoked: true } }, NOW).title, 'Stopped');
  assert.equal(V.headline({ ...ok, detail: { ...ok.detail, crypto: 'not-set-up' } }, NOW).title, 'Passphrase needed');
  assert.equal(V.headline({ ...ok, detail: { ...ok.detail, sync: { ...ok.detail.sync, failures: 2 } } }, NOW).title, 'Sync is retrying');
  assert.equal(V.headline({ ...ok, detail: { ...ok.detail, entries: { waiting: 0, posted: 0, failed: 1, needsReview: 0 } } }, NOW).title, 'Entries need attention');
  assert.equal(V.headline({ ...ok, detail: { ...ok.detail, sync: { ...ok.detail.sync, paused: true } } }, NOW).title, 'Sync is paused');
  assert.equal(V.headline({ ...ok, internet: false }, NOW).title, 'Working offline');
  assert.equal(V.headline({ ...ok, lastSyncAt: null }, NOW).title, 'Starting up');
  // tally down beats everything below it
  assert.equal(V.headline({ ...ok, internet: false, tally: { ok: false, version: null, company: null } }, NOW).level, 'bad');
});

check('every count table and flag label is a real name; count tables exist in data_model.json', () => {
  const model = JSON.parse(fs.readFileSync('docs/shared/data_model.json', 'utf8'));
  for (const t of COUNT_TABLES) assert.ok(model.tables_order.includes(t), t);
  assert.deepEqual(V.COUNT_LABELS.map((c) => c.table), [...COUNT_TABLES]);
});

check('wiring and hygiene: index.ts builds the status with the builder; page uses tokens and Phosphor only, no emoji or legacy names', () => {
  const idx = fs.readFileSync('src/main/index.ts', 'utf8');
  assert.match(idx, /createStatusBuilder\(/);
  assert.match(idx, /if \(statusBuilder\) return statusBuilder\.build\(\)/);
  assert.match(idx, /onChange: \(\) => send\(IPC\.statusEvent, currentStatus\(\)\)/);
  const files = ['src/renderer/pages/Status.tsx', 'src/renderer/lib/statusView.ts', 'src/main/status.ts'].map((f) => fs.readFileSync(f, 'utf8'));
  for (const t of files) {
    assert.doesNotMatch(t, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(/); // no hardcoded colours
    assert.doesNotMatch(t, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u); // no emoji
    assert.doesNotMatch(t, /bizanalyst|biz analyst|khatabook|siliconveins/i);
  }
  assert.doesNotMatch(files[0], /from '(?!react|@phosphor-icons\/react|\.\.\/)/);
});

fs.rmSync(out, { recursive: true, force: true });
console.log(`\n${passed} checks passed`);
