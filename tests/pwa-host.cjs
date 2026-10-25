// Phase 40 check (HOST-01 locally): the LazyHost bridge round-trips every contract method, the custom-protocol file resolver
// cannot leave resources/pwa, sender trust, opt-in gating, stub page and wiring greps.
// Run: NODE_PATH=<dir with typescript 5> node tests/pwa-host.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-pwa-'));
fs.writeFileSync(path.join(tmp, 'pwaHost.js'), ts.transpileModule(fs.readFileSync('src/main/pwaHost.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText);
const H = require(path.join(tmp, 'pwaHost.js'));
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const read = (p) => fs.readFileSync(p, 'utf8');

// a fake PWA folder
const root = path.join(tmp, 'pwa');
fs.mkdirSync(path.join(root, '_next', 'static'), { recursive: true });
fs.mkdirSync(path.join(root, 'sub'));
fs.writeFileSync(path.join(root, 'index.html'), '<html></html>');
fs.writeFileSync(path.join(root, 'sub', 'index.html'), '<html>sub</html>');
fs.writeFileSync(path.join(root, '_next', 'static', 'a.js'), 'x');
fs.writeFileSync(path.join(root, 'pwa-version.json'), JSON.stringify({ version: '1.4.2', contract: 1 }));
fs.writeFileSync(path.join(tmp, 'secret.txt'), 'nope');

(async () => {
  // file resolver
  const rf = (p) => H.resolvePwaFile(root, p);
  assert.equal(rf('/').file, path.join(root, 'index.html'));
  assert.equal(rf('/_next/static/a.js').mime, 'text/javascript; charset=utf-8');
  assert.equal(rf('/sub').file, path.join(root, 'sub', 'index.html'));
  assert.equal(rf('/customers/42').file, path.join(root, 'index.html')); // client route falls back
  assert.equal(rf('/missing.js'), null); // a missing asset is a 404, not index.html
  for (const bad of ['/../secret.txt', '/%2e%2e/secret.txt', '/..%2fsecret.txt', '/a/../../secret.txt', '/..\\secret.txt', '/a%00.js', '/%5c..%5csecret.txt', '/%E0%A4%A', '//..//secret.txt']) assert.equal(rf(bad), null, bad);
  assert.equal(rf('/index.html?x=1#y').file, path.join(root, 'index.html'));
  ok('resolver: index, assets, dir index, route fallback, missing asset 404, 9 traversal and malformed forms refused');

  // manifest pin
  assert.deepEqual(H.readPwaManifest(root), { version: '1.4.2', contract: 1, present: true });
  assert.equal(H.readPwaManifest(tmp).present, false);
  fs.writeFileSync(path.join(tmp, 'pwa-version.json'), '{"version":"x"}');
  assert.equal(H.readPwaManifest(tmp).version, 'unknown');
  ok('version pin from pwa-version.json (bad or missing gives unknown)');

  // sender trust, urls, names
  assert.equal(H.isTrustedSender('lazybooks-pwa://app/index.html', 7, 7), true);
  assert.equal(H.isTrustedSender('lazybooks-pwa://app', 7, 7), true);
  for (const [u, id, exp] of [['lazybooks-pwa://app/x', 8, 7], ['lazybooks-pwa://app/x', 7, null], ['https://evil.com/', 7, 7], ['lazybooks-pwa://appx/y', 7, 7], ['lazybooks-pwa://evil/x', 7, 7], [undefined, 7, 7], ['file:///c:/x.html', 7, 7]]) assert.equal(H.isTrustedSender(u, id, exp), false, String(u));
  for (const good of ['https://wa.me/919999999999?text=hi', 'mailto:a@b.com', 'sms:+91999', 'tel:+91999']) assert.equal(H.isAllowedExternalUrl(good), true, good);
  for (const bad of ['javascript:alert(1)', 'file:///c:/windows/system32/calc.exe', 'http://example.com', 'https://u:p@example.com/', 'data:text/html,x', '', 'x'.repeat(3000), 5, null]) assert.equal(H.isAllowedExternalUrl(bad), false, String(bad));
  assert.equal(H.safeFileName('..\\..\\evil<>.txt'), 'evil__.txt');
  assert.equal(H.safeFileName('a/b/report.pdf'), 'report.pdf');
  assert.equal(H.safeFileName(''), null); assert.equal(H.safeFileName(5), null);
  ok('sender must be the embedded window on the custom origin; external urls and file names filtered');

  // bridge round trip: every method of the contract
  const st = { saved: [], opened: [], logs: [], pass: 'correct horse battery', cancel: false, upd: 'idle' };
  const bridge = H.createHostBridge({
    nativeVersion: '0.9.0', pwaDir: root, contract: 1,
    chooseSavePath: async (name) => (st.cancel ? null : path.join(tmp, name)),
    writeFile: async (p, d) => { st.saved.push([p, d.toString()]); fs.writeFileSync(p, d); },
    openExternal: async (u) => { st.opened.push(u); },
    openDataFolder: async () => ({ ok: true }),
    checkForUpdate: async () => ({ phase: st.upd }),
    getPassphrase: () => st.pass, log: (m, d) => st.logs.push([m, d]),
  });
  fs.writeFileSync(path.join(root, 'pwa-version.json'), JSON.stringify({ version: '1.4.2', contract: 1 }));
  assert.deepEqual(await bridge.call('appInfo'), { nativeVersion: '0.9.0', pwaVersion: '1.4.2', contract: 1 });
  assert.deepEqual(await bridge.call('saveFile', { name: 'a.txt', mime: 'text/plain', dataBase64: Buffer.from('hello').toString('base64') }), { ok: true });
  assert.deepEqual(st.saved[0], [path.join(tmp, 'a.txt'), 'hello']);
  assert.deepEqual(await bridge.call('openUrl', { url: 'https://wa.me/1' }), { ok: true }); assert.deepEqual(st.opened, ['https://wa.me/1']);
  assert.deepEqual(await bridge.call('checkForUpdate'), { ok: true });
  assert.deepEqual(await bridge.call('desktop.openDataFolder'), { ok: true });
  assert.deepEqual(await bridge.call('desktop.getPassphraseHandoff'), { ok: true, passphrase: 'correct horse battery' });
  for (const m of ['shareFile', 'scanBarcode', 'getLocation', 'pickContact', 'biometricAuth', 'getPushToken', 'scheduleNotification', 'cancelNotification']) assert.deepEqual(await bridge.call(m, {}), { ok: false, reason: 'unsupported' }, m);
  for (const m of H.HOST_METHODS) { const r = await bridge.call(m, {}); assert.equal(typeof r, 'object'); if (m === 'appInfo') assert.equal(typeof r.nativeVersion, 'string'); else assert.equal(typeof r.ok, 'boolean', m); } // every method resolves a Result-shaped value
  ok('HOST-01: all 14 contract methods resolve a Result (6 live, 8 unsupported by capability), nothing throws');

  // failures
  assert.deepEqual(await bridge.call('openUrl', { url: 'javascript:alert(1)' }), { ok: false, reason: 'blocked' });
  assert.deepEqual(await bridge.call('openUrl', 'https://wa.me/1'), { ok: true });
  assert.deepEqual(await bridge.call('saveFile', { name: '', mime: 'x', dataBase64: 'AA==' }), { ok: false, reason: 'invalid' });
  assert.deepEqual(await bridge.call('saveFile', { name: 'a', mime: 'x', dataBase64: '***' }), { ok: false, reason: 'invalid' });
  assert.deepEqual(await bridge.call('saveFile', { name: 'a', mime: 'x', dataBase64: 'A'.repeat(H.MAX_SAVE_BYTES * 2) }), { ok: false, reason: 'too_large' });
  st.cancel = true; assert.deepEqual(await bridge.call('saveFile', { name: 'a', mime: 'x', dataBase64: 'AA==' }), { ok: false, reason: 'canceled' }); st.cancel = false;
  assert.deepEqual(await bridge.call('nope'), { ok: false, reason: 'unknown_method' });
  assert.deepEqual(await bridge.call('constructor'), { ok: false, reason: 'unknown_method' });
  assert.deepEqual(await bridge.call('__proto__'), { ok: false, reason: 'unknown_method' });
  st.upd = 'unsupported'; assert.deepEqual(await bridge.call('checkForUpdate'), { ok: false, reason: 'unsupported' });
  st.pass = null; assert.deepEqual(await bridge.call('desktop.getPassphraseHandoff'), { ok: false, reason: 'no_passphrase' });
  const bad = H.createHostBridge({ nativeVersion: '1', pwaDir: root, contract: 1, chooseSavePath: async () => { throw new Error('dlg'); }, writeFile: async () => { throw new Error('disk'); }, openExternal: async () => { throw new Error('x'); }, openDataFolder: async () => { throw new Error('x'); }, checkForUpdate: async () => ({ phase: 'idle' }), getPassphrase: () => 'p', log: () => {} });
  assert.deepEqual(await bad.call('saveFile', { name: 'a', mime: 'x', dataBase64: 'AA==' }), { ok: false, reason: 'error' });
  assert.deepEqual(await bad.call('desktop.openDataFolder'), { ok: false, reason: 'error' });
  assert.deepEqual(await bad.call('openUrl', { url: 'https://a.com' }), { ok: false, reason: 'open_failed' });
  ok('failures: blocked url, invalid/oversize/cancelled save, unknown method (incl. prototype names), no passphrase, thrown errors become results');
  assert.ok(!JSON.stringify(st.logs).includes('correct horse'), 'no passphrase in logs');
  ok('the passphrase never reaches a log line');

  // opt-in host
  let flag = false, created = 0, closedCb = null, focused = 0;
  const handle = { id: 42, destroyed: false, isDestroyed() { return this.destroyed; }, focus() { focused++; }, close() { this.destroyed = true; closedCb?.(); } };
  const host = H.createPwaHost({ pwaDir: root, enabled: () => flag, openWindow: (url, cb) => { created++; closedCb = cb; assert.equal(url, 'lazybooks-pwa://app/index.html'); return handle; }, log: () => {} });
  assert.equal(host.open().code, 'NOT_ENABLED'); assert.equal(created, 0); assert.equal(host.windowId(), null);
  flag = true; assert.deepEqual(host.open(), { ok: true }); assert.equal(host.windowId(), 42);
  host.open(); assert.equal(created, 1); assert.equal(focused, 1);
  host.close(); assert.equal(host.windowId(), null); host.open(); assert.equal(created, 2);
  const empty = H.createPwaHost({ pwaDir: path.join(tmp, 'nowhere'), enabled: () => true, openWindow: () => handle, log: () => {} });
  assert.equal(empty.open().code, 'NO_PWA');
  const boom = H.createPwaHost({ pwaDir: root, enabled: () => true, openWindow: () => { throw new Error('x'); }, log: () => {} });
  assert.equal(boom.open().code, 'FAILED'); assert.equal(boom.windowId(), null);
  ok('opt-in: off by default, one window (second open focuses), missing files and window errors reported');

  // stub page, preload, wiring
  const stub = read('resources/pwa/index.html');
  for (const m of ['appInfo', 'shareFile', 'saveFile', 'openUrl', 'scanBarcode', 'getLocation', 'pickContact', 'biometricAuth', 'getPushToken', 'scheduleNotification', 'cancelNotification', 'checkForUpdate', 'openDataFolder', 'getPassphraseHandoff']) assert.match(stub, new RegExp(m), `stub calls ${m}`);
  assert.ok(!/https?:\/\/[^'" )]+\.(js|css)/.test(stub) && !/<script[^>]+src=/.test(stub), 'stub is self-contained (offline)');
  assert.ok(!/[\u{1F300}-\u{1FAFF}]/u.test(stub + read('src/main/pwaHost.ts') + read('src/preload/host.ts')), 'no emoji');
  assert.equal(JSON.parse(read('resources/pwa/pwa-version.json')).version, '0.0.0');
  const pre = read('src/preload/host.ts');
  for (const m of ['appInfo', 'shareFile', 'saveFile', 'openUrl', 'scanBarcode', 'getLocation', 'pickContact', 'biometricAuth', 'getPushToken', 'scheduleNotification', 'cancelNotification', 'checkForUpdate', 'openDataFolder', 'getPassphraseHandoff']) assert.match(pre, new RegExp(`\\b${m}\\b`), `preload exposes ${m}`);
  assert.match(pre, /exposeInMainWorld\('LazyHost'/); assert.match(pre, /platform: 'electron'/); assert.ok(!/sqlite:\s*\{/.test(pre));
  for (const [k, v] of Object.entries(H.HOST_CAPABILITIES)) assert.match(pre, new RegExp(`\\b${k}: ${v}\\b`), `capability ${k} matches in preload`);
  assert.match(pre, /'lb:host:call'/); assert.match(read('src/shared/ipc.ts'), /hostCall: 'lb:host:call'/);
  const idx = read('src/main/index.ts');
  assert.match(idx, /registerSchemesAsPrivileged/); assert.match(idx, /isTrustedSender\(e\.senderFrame\?\.url/); assert.match(idx, /embedded_pwa_desktop'\] === true/);
  assert.match(idx, /sandbox: true, partition: 'persist:lb-pwa'/); assert.match(idx, /setPermissionRequestHandler/); assert.match(idx, /will-navigate/);
  assert.match(read('electron.vite.config.ts'), /host: resolve\(process\.cwd\(\), 'src\/preload\/host\.ts'\)/);
  assert.match(read('electron-builder.yml'), /from: resources\/pwa\n\s+to: pwa/);
  ok('stub page calls every method and is offline-safe; preload exposes the contract with matching capabilities; main, vite and builder wiring');
  console.log(`PASS ${n} checks`);
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
