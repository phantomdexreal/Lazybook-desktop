// Node-level check for Phase 35: settings validation (all-or-nothing), flag gate, autostart truth, config language default, form helpers.
// Run: NODE_PATH=<dir with typescript 5 and zod 4> node tests/settings.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-settings');
fs.rmSync(out, { recursive: true, force: true });
for (const f of ['src/main/settings.ts', 'src/main/config.ts', 'src/main/logger.ts', 'src/shared/constants.ts', 'src/renderer/lib/settingsForm.ts']) {
  const js = ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, resolveJsonModule: true, esModuleInterop: true } }).outputText;
  fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true });
  fs.writeFileSync(path.join(out, f.replace(/\.ts$/, '.js')), js);
}
const { createSettings } = require(path.join(out, 'src/main/settings.js'));
const C = require(path.join(out, 'src/main/config.js'));
const F = require(path.join(out, 'src/renderer/lib/settingsForm.js'));

let passed = 0;
const check = (name, fn) => { fn(); passed++; console.log('ok -', name); };

function rig(o = {}) {
  const st = { cfg: { lookbackDays: 7, intervalMin: 5, tally: { host: 'localhost', port: 9000 }, autostart: false, cloudCopy: false, language: 'en' }, os: false, flag: true, calls: [], ...o };
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
  assert.deepEqual(v.limits, { intervalMin: { min: 1, max: 1440 }, lookbackDays: { min: 0, max: 3650 } });
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
  assert.doesNotMatch(page, /set-host|set-port/); // host and port stay in the Tally block
  for (const f of ['src/renderer/pages/Settings.tsx', 'src/renderer/lib/settingsForm.ts', 'src/main/settings.ts']) {
    const t = fs.readFileSync(f, 'utf8');
    assert.doesNotMatch(t, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(/);
    assert.doesNotMatch(t, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
    assert.doesNotMatch(t, /bizanalyst|biz analyst|khatabook|siliconveins/i);
  }
});

fs.rmSync(out, { recursive: true, force: true });
console.log(`\n${passed} checks passed`);
