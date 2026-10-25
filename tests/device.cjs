// Node-level check for Phase 6: device registration, heartbeat, revoke/un-revoke, row deletion, device limit, online count.
// Run: NODE_PATH=<dir containing typescript> node tests/device.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-dev');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/shared']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
const { initLogger } = require(path.join(out, 'src/main/logger.js'));
const { createActivation } = require(path.join(out, 'src/main/activation.js'));
const { createDevice } = require(path.join(out, 'src/main/device.js'));

(async () => {
  const mock = await import('../tools/mock-registry/server.mjs');
  const probe = mock.startMockRegistry(0);
  await new Promise((r) => probe.server.once('listening', r));
  const port = probe.server.address().port;
  probe.server.close();
  await new Promise((r) => setTimeout(r, 50));
  const reg = mock.startMockRegistry(port);
  await new Promise((r) => reg.server.once('listening', r));
  const st = reg.state;
  const base = reg.base;

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-dev-'));
  initLogger({ dir: path.join(tmp, 'logs') });
  const demo = JSON.parse(fs.readFileSync('docs/shared/constants.json', 'utf8')).demo;

  const secrets = new Map();
  let cfg = { deviceId: null, target: null };
  let clock = Date.parse('2026-10-24T10:00:00Z');
  const act = createActivation({
    userDataDir: tmp, master: { url: base, anonKey: mock.MOCK_ANON_KEY }, appVersion: '1.2.3', platform: 'win32',
    secrets: { available: () => true, get: (n) => secrets.get(n) ?? null, set: (n, v) => secrets.set(n, v), delete: (n) => secrets.delete(n) },
    config: { get: () => cfg, update: (p) => { cfg = { ...cfg, ...p }; } },
    emit: (s) => dev && dev.onActivation(s),
    now: () => clock,
  });
  act.init();

  const changes = [];
  let lastSync = null;
  const dev = createDevice({
    activation: act, deviceId: () => cfg.deviceId, licenseKey: () => secrets.get('licenseKey') ?? null,
    deviceName: 'TEST-PC', appVersion: '1.2.3', platform: 'win32',
    getLastSyncAt: () => lastSync, getTally: () => ({ ok: false, version: null, company: null }),
    onChange: (p) => changes.push(p), now: () => clock,
  });

  // before activation: no calls, no rows
  await dev.tick();
  assert.equal(st.devices.size, 0);

  // register right after sign-in (activation.emit -> onActivation)
  await act.resolve(demo.license_key);
  const r = await act.login(demo.connector_email, mock.MOCK_CONNECTOR_PASSWORD);
  assert.equal(r.ok, true);
  await dev.tick(); // joins or follows the kick started by onActivation
  assert.equal(st.devices.size, 1);
  const row = st.devices.get(cfg.deviceId);
  assert.equal(row.app, 'desktop'); assert.equal(row.license_key, demo.license_key);
  assert.equal(row.device_name, 'TEST-PC'); assert.equal(row.app_version, '1.2.3'); assert.equal(row.platform, 'win32');
  assert.equal(row.last_seen_at, new Date(clock).toISOString());
  assert.equal('tally' in row, false); // only schema columns are written

  // heartbeat moves last_seen_at and carries last_sync_at once known; name is not overwritten
  row.device_name = 'Renamed by admin';
  clock += 5 * 60 * 1000; lastSync = '2026-10-24T10:04:00.000Z';
  await dev.tick();
  assert.equal(row.last_seen_at, new Date(clock).toISOString());
  assert.equal(row.last_sync_at, lastSync);
  assert.equal(row.device_name, 'Renamed by admin');
  assert.equal(st.devices.size, 1);

  // devicesOnline counts recent non-desktop devices only
  st.devices.set('pwa-1', { device_id: 'pwa-1', app: 'pwa', is_revoked: false, last_seen_at: new Date(clock - 60_000).toISOString() });
  st.devices.set('pwa-old', { device_id: 'pwa-old', app: 'pwa', is_revoked: false, last_seen_at: new Date(clock - 30 * 60_000).toISOString() });
  st.devices.set('pwa-rev', { device_id: 'pwa-rev', app: 'pwa', is_revoked: true, last_seen_at: new Date(clock).toISOString() });
  clock += 5 * 60 * 1000;
  await dev.tick();
  assert.equal(changes.filter((c) => c.devicesOnline !== undefined).pop().devicesOnline, 1);

  // revoke: blocking screen, heartbeat stops, un-revoke recovers
  row.is_revoked = true;
  clock += 5 * 60 * 1000;
  await dev.tick(); // the heartbeat PATCH discovers the revoke
  const seenBefore = row.last_seen_at;
  assert.equal(dev.isRevoked(), true);
  assert.equal(act.state().blocking.code, 'LB_DEVICE_REVOKED');
  assert.equal(changes.filter((c) => c.revoked !== undefined).pop().revoked, true);
  clock += 5 * 60 * 1000;
  await dev.tick();
  assert.equal(row.last_seen_at, seenBefore); // no heartbeat while revoked
  row.is_revoked = false;
  await dev.tick();
  assert.equal(dev.isRevoked(), false); assert.equal(act.state().blocking, null);
  await dev.tick();
  assert.equal(row.last_seen_at, new Date(clock).toISOString());

  // row deleted by admin -> re-registered
  st.devices.delete(cfg.deviceId);
  clock += 5 * 60 * 1000;
  await dev.tick(); // PATCH finds nothing
  await dev.tick(); // registers again
  assert.ok(st.devices.has(cfg.deviceId));

  // revoked at registration time
  st.devices.delete(cfg.deviceId);
  st.devices.set(cfg.deviceId, { device_id: cfg.deviceId, app: 'desktop', is_revoked: true, last_seen_at: null });
  dev.onActivation({ stage: 'needs-login' }); // reset local knowledge
  dev.onActivation(act.state());
  await dev.tick();
  assert.equal(dev.isRevoked(), true);
  st.devices.get(cfg.deviceId).is_revoked = false;
  await dev.tick();
  assert.equal(dev.isRevoked(), false);

  // offline tick does not throw and does not revoke
  const realFetch = global.fetch; // (activation uses global fetch by default)
  global.fetch = async () => { throw new TypeError('fetch failed'); };
  await dev.tick();
  global.fetch = realFetch;
  assert.equal(dev.isRevoked(), false);

  // device limit shows a blocking screen with the right code, clears after success
  st.devices.delete(cfg.deviceId); st.deviceLimit = true;
  dev.onActivation({ stage: 'needs-login' }); dev.onActivation(act.state());
  await dev.tick();
  assert.equal(act.state().blocking.code, 'LB_DEVICE_LIMIT');
  st.deviceLimit = false;
  await dev.tick();
  assert.equal(act.state().blocking, null); assert.ok(st.devices.has(cfg.deviceId));

  // deactivate resets local state
  act.deactivate();
  dev.onActivation(act.state());
  const n = st.calls.length;
  await dev.tick();
  assert.equal(st.calls.length, n);

  dev.start(); dev.stop(); // timer is unref'd and stoppable
  reg.close();
  fs.rmSync(out, { recursive: true, force: true });
  console.log('device tests passed');
})().catch((e) => { console.error(e); process.exit(1); });
