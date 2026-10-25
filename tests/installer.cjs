// Phase 38 installer check (Node only, no build, no Windows needed).
// Run: node tests/installer.cjs   (schema check runs when node_modules/app-builder-lib exists)
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const rd = (p) => fs.readFileSync(path.join(root, p), 'utf8');
let n = 0;
const ok = (c, m) => { if (!c) { console.error('FAIL', m); process.exit(1); } n++; console.log('ok', m); };

const yml = rd('electron-builder.yml');
const pkg = JSON.parse(rd('package.json'));
ok(!/STATUS: STUB/.test(yml), 'yml is no longer a stub');
ok(/^nsis:/m.test(yml) && /oneClick: true/.test(yml), 'NSIS one-click');
ok(/perMachine: false/.test(yml) && /allowElevation: false/.test(yml) && /requestedExecutionLevel: asInvoker/.test(yml), 'per-user, no admin rights');
ok(/deleteAppDataOnUninstall: false/.test(yml) && /include: build\/installer\.nsh/.test(yml), 'uninstall keeps data by default, custom hook included');
ok(/better-sqlite3/.test(yml) && /asarUnpack/.test(yml), 'native module unpacked');

const appId = (yml.match(/^appId: (.+)$/m) || [])[1];
ok(appId && rd('src/main/index.ts').includes(`setAppUserModelId('${appId}')`), 'AppUserModelId equals appId');

const nsh = rd('build/installer.nsh');
ok(/!macro customUnInstall/.test(nsh) && /!macroend/.test(nsh), 'customUnInstall macro');
ok(/\$\{ifNot\} \$\{isUpdated\}/.test(nsh) && /\$\{ifNot\} \$\{Silent\}/.test(nsh), 'updates and silent uninstall never delete data');
ok(/RMDir \/r "\$APPDATA\\LazyBooks"/.test(nsh) && /IDNO lbKeepData/.test(nsh), 'delete only on Yes; No keeps');
const opens = (nsh.match(/\$\{ifNot\}/g) || []).length, closes = (nsh.match(/\$\{endIf\}/g) || []).length;
ok(opens === closes, 'balanced LogicLib blocks');

const ico = fs.readFileSync(path.join(root, 'build/icon.ico'));
ok(ico.readUInt16LE(2) === 1 && ico.readUInt16LE(4) >= 6, 'ico header and sizes');
let has256 = false;
for (let i = 0; i < ico.readUInt16LE(4); i++) {
  const e = 6 + 16 * i;
  if (ico[e] === 0 && ico[e + 1] === 0) has256 = true;
  const off = ico.readUInt32LE(e + 12);
  if (ico.readUInt32BE(off) !== 0x89504e47) { ok(false, 'ico entry is PNG'); }
}
ok(has256, 'ico has a 256 px image (required by electron-builder)');
const png = fs.readFileSync(path.join(root, 'build/icon.png'));
ok(png.readUInt32BE(16) === 512 && png.readUInt32BE(20) === 512, 'icon.png is 512x512');

ok(pkg.devDependencies['electron-builder'] === '26.18.0', 'electron-builder pinned exactly');
ok(pkg.scripts.dist && pkg.scripts.pack && pkg.scripts['rebuild:native'], 'dist, pack, rebuild:native scripts');
const all = yml + nsh + rd('tools/gen-icons.mjs');
ok(!/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u.test(all), 'no emoji');

try {
  const m = require(path.join(root, 'node_modules/app-builder-lib/out/util/config/config'));
  const { Lazy } = require(path.join(root, 'node_modules/lazy-val'));
  const { DebugLogger } = require(path.join(root, 'node_modules/builder-util'));
  m.getConfig(root, 'electron-builder.yml', {}, new Lazy(() => Promise.resolve(pkg))).then(async (c) => {
    await m.validateConfiguration(c, new DebugLogger(false));
    ok(true, 'electron-builder schema validation');
    console.log(`PASS ${n} checks`);
  }).catch((e) => { console.error('FAIL schema', e.message); process.exit(1); });
} catch { console.log(`PASS ${n} checks (schema check skipped: electron-builder not installed)`); }
