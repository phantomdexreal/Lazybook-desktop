// Phase 38/39 check: updater logic with a fake electron-updater driver, a real sha256 on a temp file, wiring greps.
// Run: NODE_PATH=<dir with typescript 5> node tests/updater.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-upd-'));
const js = ts.transpileModule(fs.readFileSync('src/main/updater.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
fs.writeFileSync(path.join(out, 'updater.js'), js);
const U = require(path.join(out, 'updater.js'));
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);

const HEX = createHash('sha256').update('installer-bytes').digest('hex');
const URL_OK = 'https://github.com/acme/lazybooks-releases/releases/download/v1.2.0/LazyBooks-Setup-1.2.0.exe';
const offer = (o = {}) => ({ latest: '1.2.0', notes: 'n', download_url: URL_OK, sha256: HEX, min_supported: '1.0.0', update_available: true, must_update: false, ...o });

function rig(o = {}, d = {}) {
  const st = { offer: offer(), calls: [], removed: [], logs: [], t: 1_000_000, feedVersion: '1.2.0', fileHash: HEX, ...o };
  const driver = {
    setFeed: (u) => st.calls.push(['feed', u]),
    check: async () => { st.calls.push(['check']); return st.feedVersion ? { version: st.feedVersion } : null; },
    download: async () => { st.calls.push(['download']); if (st.dlError) throw new Error('boom'); return '/tmp/x/LazyBooks-Setup-1.2.0.exe'; },
    setInstallOnQuit: (on) => st.calls.push(['onquit', on]),
    quitAndInstall: (s) => st.calls.push(['install', s]),
  };
  const u = U.createUpdater({
    currentVersion: '1.1.0', getOffer: () => st.offer, driver: d.noDriver ? null : driver,
    sha256File: async () => st.fileHash, removeFile: async (p) => { st.removed.push(p); },
    log: (l, m, x) => st.logs.push([l, m, x]), now: () => st.t, ...d.deps,
  });
  return { st, u };
}
const names = (st) => st.calls.map((c) => c[0]);

(async () => {
  // semver + feed url
  assert.equal(U.compareVersions('1.2.0', '1.10.0'), -1);
  assert.equal(U.compareVersions('v2.0.0', '2.0.0'), 0);
  assert.equal(U.compareVersions('1.2.0-beta.1', '1.2.0'), null);
  assert.equal(U.feedUrlFromDownloadUrl(URL_OK), 'https://github.com/acme/lazybooks-releases/releases/download/v1.2.0');
  for (const bad of ['http://github.com/a/b/releases/download/v1/x.exe', 'https://evil.com/a/b/releases/download/v1/x.exe', 'https://github.com/a/b/raw/main/x.exe', 'https://u:p@github.com/a/b/releases/download/v1/x.exe', 'nope', undefined]) assert.equal(U.feedUrlFromDownloadUrl(bad), null);
  ok('semver compare and feed url allow-list (https, github.com, release download path only)');

  // real sha256
  const f = path.join(out, 'inst.bin'); fs.writeFileSync(f, 'installer-bytes');
  assert.equal(await U.sha256OfFile(f), HEX);
  ok('sha256OfFile streams a real file');

  // no offer / stale / not newer / not in rollout bucket
  let r = rig({ offer: null }); assert.equal((await r.u.checkNow()).phase, 'idle'); assert.deepEqual(r.st.calls, []);
  r = rig({ offer: offer({ latest: '1.1.0' }) }); assert.equal((await r.u.checkNow()).phase, 'idle'); assert.deepEqual(r.st.calls, []);
  r = rig({ offer: offer({ latest: '1.0.0', update_available: true }) }); assert.equal((await r.u.checkNow()).phase, 'idle');
  r = rig({ offer: offer({ update_available: false }) }); assert.equal((await r.u.checkNow()).phase, 'idle'); assert.deepEqual(r.st.calls, []);
  ok('no offer, not newer, or outside the rollout bucket (update_available false): nothing is touched');

  // happy path, optional update
  r = rig(); let v = await r.u.checkNow();
  assert.equal(v.phase, 'ready'); assert.equal(v.version, '1.2.0'); assert.equal(v.forced, false);
  assert.deepEqual(r.st.calls, [['feed', 'https://github.com/acme/lazybooks-releases/releases/download/v1.2.0'], ['check'], ['download'], ['onquit', true]]);
  assert.ok(!names(r.st).includes('install'));
  ok('optional update: feed from download_url, version cross-check, download, checksum, install-on-quit armed, no forced install');

  // install()
  assert.deepEqual(r.u.install(), { ok: true }); assert.deepEqual(r.st.calls.at(-1), ['install', false]);
  r = rig(); assert.equal(r.u.install().ok, false); assert.equal(r.u.install().code, 'NOT_READY');
  ok('install only after a verified download');

  // ready again does not re-download
  r = rig(); await r.u.checkNow(); const k = r.st.calls.length; await r.u.checkNow(); assert.equal(r.st.calls.length, k);
  ok('a verified version is not downloaded twice');

  // forced: must_update and below min_supported
  r = rig({ offer: offer({ must_update: true }) }); v = await r.u.checkNow();
  assert.equal(v.forced, true); assert.deepEqual(r.st.calls.at(-1), ['install', true]);
  r = rig({ offer: offer({ min_supported: '1.1.5', update_available: false }) }); v = await r.u.checkNow();
  assert.equal(v.phase, 'ready'); assert.equal(v.forced, true); assert.deepEqual(r.st.calls.at(-1), ['install', true]);
  ok('must_update and running below min_supported install silently after verification (even outside the rollout bucket)');

  // checksum mismatch
  r = rig({ fileHash: 'a'.repeat(64), offer: offer({ must_update: true }) }); v = await r.u.checkNow();
  assert.equal(v.phase, 'error'); assert.deepEqual(r.st.removed, ['/tmp/x/LazyBooks-Setup-1.2.0.exe']);
  assert.ok(!names(r.st).includes('install') && !r.st.calls.some((c) => c[0] === 'onquit'));
  assert.ok(r.st.logs.some((l) => l[1] === 'update failed' && l[2].code === 'CHECKSUM_MISMATCH'));
  ok('checksum mismatch: file deleted, never installed, not armed, even when forced');
  const before = r.st.calls.length; v = await r.u.checkNow(); assert.equal(r.st.calls.length, before); assert.equal(v.phase, 'error');
  r.st.t += 7 * 3600 * 1000; r.st.fileHash = HEX; v = await r.u.checkNow(); assert.equal(v.phase, 'ready');
  ok('a failed version is retried only after the back-off, then succeeds');

  // refusals
  r = rig({ offer: offer({ sha256: undefined }) }); v = await r.u.checkNow(); assert.equal(v.phase, 'error'); assert.deepEqual(r.st.calls, []);
  r = rig({ offer: offer({ sha256: 'xyz' }) }); v = await r.u.checkNow(); assert.equal(v.phase, 'error');
  r = rig({ offer: offer({ download_url: 'https://evil.com/a/b/releases/download/v1/x.exe' }) }); v = await r.u.checkNow(); assert.equal(v.phase, 'error'); assert.deepEqual(r.st.calls, []);
  r = rig({ feedVersion: '1.1.9' }); v = await r.u.checkNow(); assert.equal(v.phase, 'error'); assert.ok(!names(r.st).includes('download'));
  r = rig({ feedVersion: null }); v = await r.u.checkNow(); assert.equal(v.phase, 'error');
  r = rig({ dlError: true }); v = await r.u.checkNow(); assert.equal(v.phase, 'error'); assert.ok(!JSON.stringify(v).includes('boom'));
  ok('refused: missing or bad checksum, non-GitHub url, feed version mismatch, empty feed, download error (error text not shown to the page)');

  // unsupported (dev run)
  r = rig({}, { noDriver: true }); v = await r.u.checkNow(); assert.equal(v.phase, 'unsupported'); assert.equal(r.u.install().ok, false);
  ok('unpackaged app: unsupported, nothing runs');

  // single flight
  r = rig(); const [a, b] = await Promise.all([r.u.checkNow(), r.u.checkNow()]);
  assert.equal(names(r.st).filter((x) => x === 'download').length, 1); assert.equal(a, b);
  ok('single flight');

  // timer
  const timers = []; r = rig({}, { deps: { setTimer: (fn, ms) => { timers.push({ fn, ms }); return timers.length; }, clearTimer: () => {}, firstDelayMs: 5, intervalMs: 9 } });
  r.u.start(); r.u.start(); assert.equal(timers.length, 1); assert.equal(timers[0].ms, 5);
  timers[0].fn(); await new Promise((res) => setImmediate(res)); assert.equal(timers.length, 2); assert.equal(timers[1].ms, 9);
  r.u.stop(); timers[1].fn(); await new Promise((res) => setImmediate(res)); assert.equal(timers.length, 2);
  ok('timer: first delay, then interval, stop is final');

  // electron-updater wrapper
  const au = { autoDownload: true, autoInstallOnAppQuit: true, allowDowngrade: true, allowPrerelease: true, calls: [], setFeedURL(o) { this.calls.push(o); }, async checkForUpdates() { return { updateInfo: { version: '1.2.0' } }; }, async downloadUpdate() { return ['/p/a.exe']; }, quitAndInstall(s, f) { this.calls.push([s, f]); } };
  const dr = U.createElectronUpdaterDriver(au);
  assert.equal(au.autoDownload, false); assert.equal(au.autoInstallOnAppQuit, false); assert.equal(au.allowDowngrade, false); assert.equal(au.allowPrerelease, false);
  dr.setFeed('https://github.com/a/b/releases/download/v1'); assert.deepEqual(au.calls[0], { provider: 'generic', url: 'https://github.com/a/b/releases/download/v1' });
  assert.deepEqual(await dr.check(), { version: '1.2.0' }); assert.equal(await dr.download(), '/p/a.exe');
  dr.setInstallOnQuit(true); assert.equal(au.autoInstallOnAppQuit, true); dr.quitAndInstall(true); assert.deepEqual(au.calls[1], [true, true]);
  ok('electron-updater wrapper: no auto download, no downgrade, no prerelease, generic feed');

  // wiring
  const idx = fs.readFileSync('src/main/index.ts', 'utf8');
  assert.match(idx, /createUpdater\(\{/); assert.match(idx, /app\.isPackaged \? createElectronUpdaterDriver/); assert.match(idx, /updater\?\.start\(\)/);
  assert.match(idx, /quitting = true;\s+realDriver\.quitAndInstall/);
  for (const c of ['updateState', 'updateCheck', 'updateInstall']) { assert.match(idx, new RegExp(`IPC\\.${c}`)); assert.match(fs.readFileSync('src/preload/index.ts', 'utf8'), new RegExp(`IPC\\.${c}`)); }
  assert.ok(!/[\u{1F300}-\u{1FAFF}]/u.test(fs.readFileSync('src/main/updater.ts', 'utf8')));
  ok('wiring: packaged-only driver, real quit before install, three IPC channels in main and preload');
  console.log(`PASS ${n} checks`);
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
