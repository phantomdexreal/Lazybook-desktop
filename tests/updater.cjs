// Phase 38/39 check: updater logic with a fake electron-updater driver, a real sha256 on a temp file, wiring greps.
// Run: NODE_PATH=<dir with typescript 5> node tests/updater.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-upd-'));
const tr = (f) => ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
fs.mkdirSync(path.join(out, 'main'), { recursive: true });
fs.mkdirSync(path.join(out, 'shared'), { recursive: true });
fs.writeFileSync(path.join(out, 'shared', 'constants.js'), tr('src/shared/constants.ts')); // updater.ts reads UPDATE_CONTROLS (Phase 47)
fs.writeFileSync(path.join(out, 'main', 'updater.js'), tr('src/main/updater.ts'));
const U = require(path.join(out, 'main', 'updater.js'));
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

  // Phase 47: automatic switch, manual check, gap, progress
  {
    const mk = (auto, o = {}, deps = {}) => {
      const timers = [];
      const st = { auto, offer: offer(), calls: [], t: 5_000_000, refreshed: 0, refreshFail: false, progressCb: null, ...o };
      const driver = {
        setFeed: (u) => st.calls.push(['feed', u]), check: async () => ({ version: '1.2.0' }),
        download: async () => { st.calls.push(['download']); if (st.progressCb) { st.progressCb(10.4); st.pctAtDownload = st.u.state().progress; st.progressCb(250); } return '/tmp/x/a.exe'; },
        setInstallOnQuit: (on) => st.calls.push(['onquit', on]), quitAndInstall: (x) => st.calls.push(['install', x]),
        onProgress: (cb) => { st.progressCb = cb; },
      };
      const u = U.createUpdater({
        currentVersion: '1.1.0', getOffer: () => st.offer, driver, sha256File: async () => HEX, removeFile: async () => {}, log: () => {}, now: () => st.t,
        getAutoCheck: () => st.auto, refreshOffer: async () => { st.refreshed++; if (st.refreshFail) throw new Error('offline'); },
        setTimer: (fn, ms) => { timers.push({ fn, ms }); return timers.length; }, clearTimer: () => {}, firstDelayMs: 5, intervalMs: 9, ...deps,
      });
      st.u = u;
      return { st, u, timers };
    };
    const tick = () => new Promise((res) => setImmediate(res));

    // switch off: no timer, nothing downloaded on its own
    let q = mk(false); q.u.start(); assert.equal(q.timers.length, 0); assert.equal(q.u.state().autoCheck, false);
    q.u.offerChanged(); await tick(); assert.deepEqual(q.st.calls, []); // optional update: not acted on
    ok('automatic checks off: no timer and an optional update is not downloaded by itself');

    // forced update still acted on when off
    q = mk(false, { offer: offer({ must_update: true }) }); q.u.start(); q.u.offerChanged(); await tick(); await tick();
    assert.deepEqual(q.st.calls.at(-1), ['install', true]); assert.ok(q.st.calls.some((c) => c[0] === 'download'));
    q = mk(false, { offer: offer({ min_supported: '1.1.5', update_available: false }) }); q.u.start(); q.u.offerChanged(); await tick(); await tick();
    assert.equal(q.u.state().phase, 'ready'); assert.equal(q.u.state().forced, true);
    ok('automatic checks off: a forced update (must_update or below min_supported) still downloads and installs');

    // switch toggled at run time starts and stops the timer
    q = mk(true); q.u.start(); assert.equal(q.timers.length, 1); assert.equal(q.timers[0].ms, 5);
    q.u.setAutoCheck(false); assert.equal(q.u.state().autoCheck, false); q.timers[0].fn(); await tick(); assert.deepEqual(q.st.calls, []);
    q.u.setAutoCheck(true); assert.equal(q.timers.length, 2); assert.equal(q.u.state().autoCheck, true);
    ok('switch changed while running: off stops the timer, on starts it again');

    // manual check works when off, refreshes the bootstrap first, sets lastCheckedAt
    q = mk(false); q.u.start(); let v = await q.u.checkManual();
    assert.equal(q.st.refreshed, 1); assert.equal(v.phase, 'ready'); assert.equal(v.autoCheck, false); assert.equal(v.lastCheckedAt, new Date(q.st.t).toISOString());
    ok('manual check works with automatic checks off: bootstrap refreshed first, extended view returned');

    // gap enforced: second press inside 30 s sends nothing; after the gap it runs
    q = mk(true, { offer: null }); v = await q.u.checkManual(); assert.equal(q.st.refreshed, 1);
    assert.equal(v.message, 'You have the latest version available to you (1.1.0).'); assert.equal(v.phase, 'idle');
    q.st.t += 29_000; await q.u.checkManual(); assert.equal(q.st.refreshed, 1);
    q.st.t += 2_000; await q.u.checkManual(); assert.equal(q.st.refreshed, 2);
    ok('manual gap: 29 s later nothing is sent, 31 s later it runs; honest "latest available to you" line');

    // refresh failure keeps the cached offer
    q = mk(true, { refreshFail: true }); v = await q.u.checkManual(); assert.equal(v.phase, 'ready');
    ok('failed bootstrap refresh: the cached offer is still evaluated');

    // not rolled out yet
    q = mk(true, { offer: offer({ update_available: false }) }); v = await q.u.checkManual();
    assert.equal(v.phase, 'idle'); assert.equal(v.message, 'No update available for this device yet.');
    ok('newer version not rolled out to this device: "No update available for this device yet"');

    // dev run: manual check does nothing
    const dev = U.createUpdater({ currentVersion: '1.1.0', getOffer: () => offer(), driver: null, log: () => {}, refreshOffer: async () => { throw new Error('must not be called'); } });
    v = await dev.checkManual(); assert.equal(v.phase, 'unsupported'); assert.match(v.message, /development run/);
    ok('development run: manual check does nothing and says so');

    // progress passes through while downloading, clamped, cleared afterwards
    q = mk(true); await q.u.checkNow();
    assert.deepEqual(q.st.pctAtDownload, { percent: 10 }); assert.equal(q.u.state().progress, null); assert.equal(q.u.state().phase, 'ready');
    ok('download progress: percent passes through while downloading (rounded), cleared when done');

    // electron-updater wrapper forwards download-progress
    const au2 = { autoDownload: true, autoInstallOnAppQuit: true, allowDowngrade: true, allowPrerelease: true, setFeedURL() {}, async checkForUpdates() { return null; }, async downloadUpdate() { return ['/p']; }, quitAndInstall() {}, on(ev, fn) { this.ev = ev; this.fn = fn; } };
    const got = []; U.createElectronUpdaterDriver(au2).onProgress((p) => got.push(p)); au2.fn({ percent: 42 });
    assert.equal(au2.ev, 'download-progress'); assert.deepEqual(got, [42]);
    ok('electron-updater wrapper forwards download-progress percent');

    // single flight with manual
    q = mk(true); const [x, y] = await Promise.all([q.u.checkNow(), q.u.checkManual()]);
    assert.equal(q.st.calls.filter((c) => c[0] === 'download').length, 1);
    ok('a manual check during a running check does not download twice');
  }

  // wiring
  const idx = fs.readFileSync('src/main/index.ts', 'utf8');
  assert.match(idx, /createUpdater\(\{/); assert.match(idx, /app\.isPackaged \? createElectronUpdaterDriver/); assert.match(idx, /updater\?\.start\(\)/);
  assert.match(idx, /quitting = true;\s+realDriver\.quitAndInstall/);
  assert.match(idx, /getAutoCheck: \(\) => getConfig\(\)\.autoUpdateCheck/); assert.match(idx, /updater\?\.setAutoCheck\(on\)/); assert.match(idx, /updater\?\.offerChanged\(\)/);
  assert.match(idx, /IPC\.updateCheck, \(\) => updater\?\.checkManual\(\)/);
  for (const c of ['updateState', 'updateCheck', 'updateInstall']) { assert.match(idx, new RegExp(`IPC\\.${c}`)); assert.match(fs.readFileSync('src/preload/index.ts', 'utf8'), new RegExp(`IPC\\.${c}`)); }
  assert.ok(!/[\u{1F300}-\u{1FAFF}]/u.test(fs.readFileSync('src/main/updater.ts', 'utf8')));
  ok('wiring: packaged-only driver, real quit before install, three IPC channels in main and preload');
  console.log(`PASS ${n} checks`);
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
