// Node-level check for Phase 35: settings validation (all-or-nothing), flag gate, autostart truth, config language default, form helpers.
// Run: NODE_PATH=<dir with typescript 5 and zod 4> node tests/settings.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-settings');
fs.rmSync(out, { recursive: true, force: true });
for (const f of ['src/main/settings.ts', 'src/main/config.ts', 'src/main/logger.ts', 'src/shared/constants.ts', 'src/renderer/lib/settingsForm.ts', 'src/renderer/lib/updateView.ts']) {
  const js = ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, resolveJsonModule: true, esModuleInterop: true } }).outputText;
  fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true });
  fs.writeFileSync(path.join(out, f.replace(/\.ts$/, '.js')), js);
}
const { createSettings } = require(path.join(out, 'src/main/settings.js'));
const C = require(path.join(out, 'src/main/config.js'));
const F = require(path.join(out, 'src/renderer/lib/settingsForm.js'));
const UV = require(path.join(out, 'src/renderer/lib/updateView.js'));

let passed = 0;
const check = (name, fn) => { fn(); passed++; console.log('ok -', name); };

function rig(o = {}) {
  const st = { cfg: { lookbackDays: 7, intervalMin: 5, tally: { host: 'localhost', port: 9000 }, autostart: false, cloudCopy: false, language: 'en', voucherBatchSize: 500, autoUpdateCheck: true }, os: false, flag: true, calls: [], ...o };
  const s = createSettings({
    config: () => structuredClone(st.cfg),
    updateConfig: (p) => {
      if (st.failWrite) throw new Error('disk');
      st.calls.push(['update', p]);
      const { tally, ...rest } = p;
      Object.assign(st.cfg, rest);
      if (tally) st.cfg.tally = { ...st.cfg.tally, ...tally };
    },
    getAutostart: () => st.os,
    setAutostart: (on) => { if (st.osRefuses) throw new Error('refused'); st.calls.push(['autostart', on]); st.os = on; },
    cloudCopyAllowed: () => st.flag,
    company: () => ({ name: 'Demo Co', guid: 'g-1' }),
    fy: () => ({ from: '2026-04-01', to: '2027-03-31' }),
    onTallyTargetChanged: () => st.calls.push(['probe']),
    onSyncSettingsChanged: () => st.calls.push(['sync-changed']),
    onAutoUpdateChanged: (on) => st.calls.push(['auto-update', on]),
    log: (m, d) => st.calls.push(['log', m, d]),
  });
  return { s, st };
}

check('get returns every field of the contract, with limits and read-only company and fy', () => {
  const { s } = rig();
  const v = s.get();
  assert.deepEqual(v.company, { name: 'Demo Co', guid: 'g-1' });
  assert.deepEqual(v.fy, { from: '2026-04-01', to: '2027-03-31' });
  assert.equal(v.lookbackDays, 7); assert.equal(v.intervalMin, 5);
  assert.equal(v.tallyHost, 'localhost'); assert.equal(v.tallyPort, 9000);
  assert.equal(v.autostart, false); assert.equal(v.cloudCopy, false); assert.equal(v.cloudCopyAllowed, true);
  assert.equal(v.language, 'en');
  assert.equal(v.voucherBatchSize, 500); assert.equal(v.autoUpdateCheck, true);
  assert.deepEqual(v.limits, { intervalMin: { min: 1, max: 1440 }, lookbackDays: { min: 0, max: 3650 }, voucherBatchSize: { min: 50, max: 5000 } });
});

check('Phase 43: voucherBatchSize and autoUpdateCheck are saved when valid, bounds included', () => {
  for (const n of [50, 500, 5000]) {
    const { s, st } = rig();
    const r = s.set({ voucherBatchSize: n });
    assert.equal(r.ok, true, String(n));
    assert.equal(r.settings.voucherBatchSize, n);
    assert.equal(st.cfg.voucherBatchSize, n);
  }
  const { s, st } = rig();
  const r = s.set({ autoUpdateCheck: false, voucherBatchSize: 250 });
  assert.equal(r.ok, true);
  assert.equal(st.cfg.autoUpdateCheck, false); assert.equal(r.settings.autoUpdateCheck, false); assert.equal(st.cfg.voucherBatchSize, 250);
});

check('Phase 43: out-of-range and wrong-type values are refused with the field named and nothing saved', () => {
  const bad = [
    [{ voucherBatchSize: 49 }, 'voucherBatchSize'], [{ voucherBatchSize: 5001 }, 'voucherBatchSize'], [{ voucherBatchSize: 0 }, 'voucherBatchSize'],
    [{ voucherBatchSize: -5 }, 'voucherBatchSize'], [{ voucherBatchSize: 500.5 }, 'voucherBatchSize'], [{ voucherBatchSize: '500' }, 'voucherBatchSize'],
    [{ voucherBatchSize: NaN }, 'voucherBatchSize'], [{ voucherBatchSize: null }, 'voucherBatchSize'],
    [{ autoUpdateCheck: 'yes' }, 'autoUpdateCheck'], [{ autoUpdateCheck: 0 }, 'autoUpdateCheck'],
    [{ intervalMin: 10, voucherBatchSize: 10 }, 'voucherBatchSize'],
  ];
  for (const [patch, field] of bad) {
    const { s, st } = rig();
    const r = s.set(patch);
    assert.equal(r.ok, false, JSON.stringify(patch));
    assert.equal(r.code, 'INVALID'); assert.equal(r.field, field, JSON.stringify(patch));
    assert.equal(st.calls.length, 0, 'nothing written: ' + JSON.stringify(patch));
    assert.equal(st.cfg.voucherBatchSize, 500); assert.equal(st.cfg.intervalMin, 5);
  }
});

check('Phase 43: config defaults, an older file without the new keys loads unchanged, bad values are rejected', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-cfg43-'));
  const d = C.defaultConfig();
  assert.equal(d.voucherBatchSize, 500); assert.equal(d.autoUpdateCheck, true);
  const old = C.defaultConfig(); delete old.voucherBatchSize; delete old.autoUpdateCheck;
  fs.writeFileSync(path.join(dir, 'config.json'), JSON.stringify({ ...old, intervalMin: 12 }));
  const c = C.initConfig(dir);
  assert.equal(c.intervalMin, 12); assert.equal(c.voucherBatchSize, 500); assert.equal(c.autoUpdateCheck, true);
  assert.equal(fs.readdirSync(dir).some((n) => n.includes('corrupt')), false);
  assert.throws(() => C.updateConfig({ voucherBatchSize: 49 }));
  assert.throws(() => C.updateConfig({ voucherBatchSize: 5001 }));
  assert.throws(() => C.updateConfig({ autoUpdateCheck: 'no' }));
  const u = C.updateConfig({ voucherBatchSize: 1000, autoUpdateCheck: false });
  assert.equal(u.voucherBatchSize, 1000); assert.equal(u.autoUpdateCheck, false);
  fs.rmSync(dir, { recursive: true, force: true });
});

check('Phase 43: constants (defaults, bounds, floor, timeouts, weights) and the vouchers module uses them', () => {
  const K = require(path.join(out, 'src/shared/constants.js'));
  assert.deepEqual({ ...K.VOUCHER_BATCH }, { sizeDefault: 500, sizeMin: 50, sizeMax: 5000, adaptiveFloor: 25, voucherTimeoutS: 180, splitPauseS: 15, voucherBatchPauseMs: 250 });
  assert.equal(K.PROGRESS_DEFAULTS.progressThrottleMs, 1000);
  assert.equal(Object.values(K.PROGRESS_DEFAULTS.stageWeights).reduce((a, b) => a + b, 0), 100);
  assert.equal(K.UPDATE_CONTROLS.manualUpdateCheckMinGapS, 30);
  const src = fs.readFileSync('src/main/tally/vouchers/index.ts', 'utf8');
  assert.match(src, /VOUCHER_BATCH\.voucherTimeoutS \* 1000/); assert.match(src, /VOUCHER_BATCH\.splitPauseS \* 1000/);
  assert.doesNotMatch(src, /180_000|15_000/);
});

check('valid patch is saved and hooks fire only for what changed', () => {
  const { s, st } = rig();
  const r = s.set({ intervalMin: 10, lookbackDays: 30 });
  assert.equal(r.ok, true);
  assert.equal(r.settings.intervalMin, 10);
  assert.equal(st.cfg.lookbackDays, 30);
  assert.ok(st.calls.some((c) => c[0] === 'sync-changed'));
  assert.ok(!st.calls.some((c) => c[0] === 'probe'));
  st.calls.length = 0;
  assert.equal(s.set({ tallyHost: ' 127.0.0.1 ', tallyPort: 9001 }).ok, true);
  assert.deepEqual(st.cfg.tally, { host: '127.0.0.1', port: 9001 });
  assert.ok(st.calls.some((c) => c[0] === 'probe'));
  assert.ok(!st.calls.some((c) => c[0] === 'sync-changed'));
  st.calls.length = 0;
  assert.equal(s.set({ intervalMin: 10 }).ok, true); // same value: no hook
  assert.ok(!st.calls.some((c) => c[0] === 'sync-changed' || c[0] === 'probe'));
});

check('every bad value is refused with its field and nothing is written (all-or-nothing)', () => {
  const bad = [
    [{ intervalMin: 0 }, 'intervalMin'], [{ intervalMin: 1441 }, 'intervalMin'], [{ intervalMin: 2.5 }, 'intervalMin'], [{ intervalMin: '5' }, 'intervalMin'],
    [{ lookbackDays: -1 }, 'lookbackDays'], [{ lookbackDays: 3651 }, 'lookbackDays'], [{ lookbackDays: NaN }, 'lookbackDays'],
    [{ tallyHost: '' }, 'tallyHost'], [{ tallyHost: 'a b' }, 'tallyHost'], [{ tallyHost: 'x;rm' }, 'tallyHost'], [{ tallyHost: 'a'.repeat(254) }, 'tallyHost'],
    [{ tallyPort: 0 }, 'tallyPort'], [{ tallyPort: 65536 }, 'tallyPort'], [{ tallyPort: 90.5 }, 'tallyPort'],
    [{ autostart: 'yes' }, 'autostart'], [{ cloudCopy: 1 }, 'cloudCopy'], [{ language: 'fr' }, 'language'],
    [{ paused: true }, 'paused'], [{ companyGuid: 'x' }, 'companyGuid'], [{ intervalMin: 10, nope: 1 }, 'nope'],
  ];
  for (const [patch, field] of bad) {
    const { s, st } = rig();
    const r = s.set(patch);
    assert.equal(r.ok, false, JSON.stringify(patch));
    assert.equal(r.code, 'INVALID');
    assert.equal(r.field, field, JSON.stringify(patch));
    assert.ok(r.message.length > 5);
    assert.equal(st.calls.filter((c) => c[0] !== 'log').length, 0, 'no write for ' + JSON.stringify(patch));
    assert.deepEqual(r.settings, s.get());
  }
  const { s, st } = rig();
  const r = s.set({ intervalMin: 10, tallyPort: 0 }); // one good, one bad: the good one is not applied either
  assert.equal(r.ok, false);
  assert.equal(st.cfg.intervalMin, 5);
  for (const junk of [null, undefined, 'x', 5, []]) assert.equal(s.set(junk).ok, false);
});

check('cloud copy: cannot be turned on without the license flag, can always be turned off', () => {
  const { s, st } = rig({ flag: false });
  const r = s.set({ cloudCopy: true });
  assert.equal(r.ok, false); assert.equal(r.code, 'FLAG_OFF'); assert.equal(r.field, 'cloudCopy');
  assert.equal(st.cfg.cloudCopy, false);
  assert.equal(r.settings.cloudCopyAllowed, false);
  st.cfg.cloudCopy = true; // stored on, flag later withdrawn
  assert.equal(s.set({ cloudCopy: false }).ok, true);
  assert.equal(st.cfg.cloudCopy, false);
  const on = rig({ flag: true });
  assert.equal(on.s.set({ cloudCopy: true }).ok, true);
  assert.equal(on.st.cfg.cloudCopy, true);
  const mixed = rig({ flag: false }).s.set({ intervalMin: 9, cloudCopy: true });
  assert.equal(mixed.ok, false); // nothing partial
});

check('autostart: the OS login item is the truth, a refusal changes nothing, a failed save undoes it', () => {
  const a = rig({ os: true }); // config says false, the OS says true
  assert.equal(a.s.get().autostart, true);
  const b = rig();
  assert.equal(b.s.set({ autostart: true }).ok, true);
  assert.equal(b.st.os, true); assert.equal(b.st.cfg.autostart, true);
  const c = rig({ osRefuses: true });
  const r = c.s.set({ autostart: true, intervalMin: 9 });
  assert.equal(r.ok, false); assert.equal(r.field, 'autostart');
  assert.equal(c.st.cfg.intervalMin, 5);
  const d = rig({ failWrite: true });
  const r2 = d.s.set({ autostart: true });
  assert.equal(r2.ok, false); assert.equal(r2.field, 'config');
  assert.equal(d.st.os, false, 'login item restored');
  const e = rig({ os: true });
  e.s.set({ autostart: true }); // already on in the OS: no OS call
  assert.equal(e.st.calls.filter((c) => c[0] === 'autostart').length, 0);
});

check('log carries key names only, never values', () => {
  const { s, st } = rig();
  s.set({ tallyHost: 'secret-host.example', intervalMin: 9 });
  const l = st.calls.find((c) => c[0] === 'log');
  assert.deepEqual([...l[2].keys].sort(), ['intervalMin', 'tallyHost']);
  assert.doesNotMatch(JSON.stringify(l), /secret-host/);
});

check('config: language defaults to en, an older file without it still loads, an unknown language is rejected', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-cfg-'));
  assert.equal(C.defaultConfig().language, 'en');
  const old = C.defaultConfig(); delete old.language;
  fs.writeFileSync(path.join(dir, 'config.json'), JSON.stringify({ ...old, intervalMin: 12 }));
  const c = C.initConfig(dir);
  assert.equal(c.intervalMin, 12); assert.equal(c.language, 'en');
  assert.equal(fs.readdirSync(dir).some((n) => n.includes('corrupt')), false);
  assert.throws(() => C.updateConfig({ language: 'fr' }));
  assert.equal(C.updateConfig({ language: 'en' }).language, 'en');
  fs.rmSync(dir, { recursive: true, force: true });
});

check('form helpers: text to patch, local validation mirrors the server, dirty and discard', () => {
  const { s } = rig();
  const v = s.get();
  const f = F.toForm(v);
  assert.equal(F.isDirty(f, v), false);
  assert.deepEqual(F.toPatch(f, v), {});
  assert.deepEqual(F.validate(f, v), {});
  const g = { ...f, intervalMin: '15', lookbackDays: '0', autostart: true };
  assert.deepEqual(F.toPatch(g, v), { intervalMin: 15, lookbackDays: 0, autostart: true });
  assert.equal(F.isDirty(g, v), true);
  for (const [k, val] of [['intervalMin', ''], ['intervalMin', '0'], ['intervalMin', '5.5'], ['intervalMin', '1441'], ['lookbackDays', '-1'], ['lookbackDays', 'abc'], ['lookbackDays', '3651'], ['tallyHost', 'a b'], ['tallyPort', '70000']]) {
    assert.ok(F.validate({ ...f, [k]: val }, v)[k], k + '=' + val);
  }
  assert.equal(F.validate({ ...f, intervalMin: ' 7 ' }, v).intervalMin, undefined);
  // a patch the form builds always passes the real validation
  const r = s.set(F.toPatch({ ...f, intervalMin: '60', lookbackDays: '14', tallyPort: '9100' }, v));
  assert.equal(r.ok, true);
  assert.equal(F.fyText(v.fy), '01 Apr 2026 to 31 Mar 2027');
  assert.equal(F.fyText(null), '-');
  assert.equal(F.fyText({ from: null, to: '2027-03-31' }), '-');
  const off = { ...v, cloudCopyAllowed: false, cloudCopy: false };
  assert.ok(F.validate({ ...F.toForm(off), cloudCopy: true }, off).cloudCopy);
});

check('Phase 47 batch size: form helpers, presets, default, help text; the patch they build passes the real validation', () => {
  const { s } = rig();
  const v = s.get();
  assert.deepEqual([...F.BATCH_PRESETS], [100, 250, 500, 1000]);
  assert.equal(F.batchSizeDefaultText(), '500');
  assert.equal(F.batchSizeError('500', v), null); assert.equal(F.batchSizeError(' 50 ', v), null); assert.equal(F.batchSizeError('5000', v), null);
  for (const bad of ['', '49', '5001', '12.5', 'abc', '-100', '1e3']) assert.ok(F.batchSizeError(bad, v), bad);
  assert.deepEqual(F.batchSizePatch('500', v), {}); // unchanged: empty patch
  assert.deepEqual(F.batchSizePatch(' 1000 ', v), { voucherBatchSize: 1000 });
  assert.match(F.batchSizeHelp(v), /next sync/); assert.match(F.batchSizeHelp(v), /500/);
  for (const n of F.BATCH_PRESETS) assert.equal(s.set(F.batchSizePatch(String(n), s.get())).ok, true);
  assert.equal(s.get().voucherBatchSize, 1000);
  const r = s.set(F.batchSizePatch(F.batchSizeDefaultText(), s.get())); assert.equal(r.ok, true); assert.equal(s.get().voucherBatchSize, 500);
});

check('Phase 47 update switch: patch round trips, the updater hook fires only on a real change, invalid values refused with nothing written', () => {
  const { s, st } = rig();
  assert.deepEqual(F.autoUpdatePatch(false), { autoUpdateCheck: false });
  let r = s.set(F.autoUpdatePatch(false)); assert.equal(r.ok, true); assert.equal(r.settings.autoUpdateCheck, false);
  assert.deepEqual(st.calls.filter((c) => c[0] === 'auto-update'), [['auto-update', false]]);
  r = s.set(F.autoUpdatePatch(false)); assert.equal(st.calls.filter((c) => c[0] === 'auto-update').length, 1); // same value: no hook
  r = s.set(F.autoUpdatePatch(true)); assert.deepEqual(st.calls.filter((c) => c[0] === 'auto-update').at(-1), ['auto-update', true]);
  const n = st.calls.length;
  for (const bad of [{ autoUpdateCheck: 'yes' }, { autoUpdateCheck: 1 }, { voucherBatchSize: 49 }, { voucherBatchSize: 5001 }, { voucherBatchSize: 500.5 }, { autoUpdateCheck: false, voucherBatchSize: 'x' }]) {
    const x = s.set(bad); assert.equal(x.ok, false); assert.ok(['autoUpdateCheck', 'voucherBatchSize'].includes(x.field));
  }
  assert.equal(st.calls.length, n); assert.equal(st.cfg.autoUpdateCheck, true);
});

check('Phase 47 update view helpers: gap, status lines, banner, plain-text notes', () => {
  const base = { phase: 'idle', version: null, forced: false, notes: null, message: null, currentVersion: '1.0.5', autoCheck: true, lastCheckedAt: null, progress: null };
  const t0 = Date.parse('2026-10-27T10:00:00Z');
  assert.equal(UV.checkWaitSeconds(base, t0), 0); assert.equal(UV.canCheckNow(base, t0, false), true);
  const done = { ...base, lastCheckedAt: '2026-10-27T10:00:00Z' };
  assert.equal(UV.checkWaitSeconds(done, t0 + 10_000), 20); assert.equal(UV.canCheckNow(done, t0 + 10_000, false), false);
  assert.equal(UV.checkWaitSeconds(done, t0 + 30_000), 0); assert.equal(UV.canCheckNow(done, t0 + 31_000, false), true);
  assert.equal(UV.canCheckNow(base, t0, true), false); // busy
  assert.equal(UV.canCheckNow({ ...base, phase: 'unsupported' }, t0, false), false);
  assert.equal(UV.canCheckNow({ ...base, phase: 'downloading', progress: { percent: 5 } }, t0, false), false);
  assert.equal(UV.checkedAgoText(null, t0), ''); assert.equal(UV.checkedAgoText('2026-10-27T09:55:00Z', t0), '5 min ago'); assert.equal(UV.checkedAgoText('2026-10-27T10:00:00Z', t0 + 5000), 'just now');
  assert.match(UV.statusLine({ ...base, phase: 'unsupported' }, t0), /development run/);
  assert.match(UV.statusLine({ ...base, phase: 'downloading', version: '1.2.0', progress: { percent: 37 } }, t0), /1\.2\.0 37%/);
  assert.match(UV.statusLine({ ...base, phase: 'ready', version: '1.2.0' }, t0), /Restart to install/);
  assert.match(UV.statusLine({ ...base, phase: 'error', message: 'The update could not be downloaded.' }, t0), /could not be downloaded/);
  assert.match(UV.statusLine(done, t0 + 300_000), /latest version available to you \(1\.0\.5\)\. Last checked 5 min ago/);
  assert.match(UV.statusLine({ ...base, autoCheck: false }, t0), /Automatic checks are off/);
  assert.equal(UV.statusLine(base, t0, true), 'Checking for updates.');
  assert.equal(UV.bannerText(null, null), null); assert.equal(UV.bannerText(base, null), null);
  assert.equal(UV.bannerText(base, '1.2.0'), 'Version 1.2.0 is available.');
  assert.match(UV.bannerText({ ...base, autoCheck: false }, '1.2.0'), /Automatic checks are off/);
  assert.match(UV.bannerText({ ...base, phase: 'downloading', version: '1.2.0', progress: { percent: 9 } }, '1.2.0'), /\(9%\)/);
  assert.equal(UV.notesText(null), null); assert.equal(UV.notesText('  \u0000\u0007  '), null);
  assert.equal(UV.notesText('Fixes\u0000 a bug <b>x</b>'), 'Fixes a bug <b>x</b>'); // text only, tags stay inert text
  assert.equal(UV.notesText('x'.repeat(2100)).length, 2003);
});

check('wiring and hygiene: channels, handlers, preload, sync block in the page; no emoji, hardcoded colours or legacy names', () => {
  const ipc = fs.readFileSync('src/shared/ipc.ts', 'utf8');
  assert.match(ipc, /settingsGet: 'lb:settings:get'/); assert.match(ipc, /settingsSet: 'lb:settings:set'/);
  const idx = fs.readFileSync('src/main/index.ts', 'utf8');
  assert.match(idx, /createSettings\(/); assert.match(idx, /ipcMain\.handle\(IPC\.settingsGet/); assert.match(idx, /ipcMain\.handle\(IPC\.settingsSet/);
  assert.match(idx, /cloud_copy/);
  const pre = fs.readFileSync('src/preload/index.ts', 'utf8');
  assert.match(pre, /IPC\.settingsGet/); assert.match(pre, /IPC\.settingsSet/);
  const page = fs.readFileSync('src/renderer/pages/Settings.tsx', 'utf8');
  assert.match(page, /<PreferencesBlock \/>/);
  assert.match(page, /<SyncingBlock \/>/); assert.match(page, /<UpdatesBlock \/>/);
  assert.match(page, /Vouchers per batch/); assert.match(page, /Reset to default/); assert.match(page, /Check for updates automatically/); assert.match(page, /Check now/); assert.match(page, /Restart and update/);
  assert.doesNotMatch(page.slice(page.indexOf('function SyncingBlock'), page.indexOf('export function SettingsPage')), /dangerouslySetInnerHTML/); // release notes are plain text
  assert.match(idx, /onAutoUpdateChanged/);
  assert.match(fs.readFileSync('src/renderer/pages/Status.tsx', 'utf8'), /bannerText\(upd/);
  assert.doesNotMatch(page, /set-host|set-port/); // host and port stay in the Tally block
  for (const f of ['src/renderer/pages/Settings.tsx', 'src/renderer/lib/settingsForm.ts', 'src/renderer/lib/updateView.ts', 'src/main/settings.ts']) {
    const t = fs.readFileSync(f, 'utf8');
    assert.doesNotMatch(t, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(/);
    assert.doesNotMatch(t, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
    assert.doesNotMatch(t, /bizanalyst|biz analyst|khatabook|siliconveins/i);
  }
});

fs.rmSync(out, { recursive: true, force: true });
console.log(`\n${passed} checks passed`);
