// Node-level check for Phase 5: resolve -> login -> bootstrap against tools/mock-registry, with a real HTTP round trip.
// Run: NODE_PATH=<global node_modules> node tests/activation.cjs   (needs the `typescript` package; no zod/electron needed)
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-act');
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
const { createActivation, maskLicenseKey } = require(path.join(out, 'src/main/activation.js'));

(async () => {
  const mock = await import('../tools/mock-registry/server.mjs');
  const reg = mock.startMockRegistry(0);
  await new Promise((r) => reg.server.once('listening', r));
  const port = reg.server.address().port;
  const base = `http://127.0.0.1:${port}`;
  reg.base = base; // the server computed its base with port 0; patch via state-independent override below
  reg.server.close();
  // restart on a known free port so the mock's own base URL is correct
  const real = mock.startMockRegistry(port);
  await new Promise((r) => real.server.once('listening', r));
  const st = real.state;

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-act-'));
  initLogger({ dir: path.join(tmp, 'logs') });
  const demo = JSON.parse(fs.readFileSync('docs/shared/constants.json', 'utf8')).demo;

  const secrets = new Map();
  let secretsOk = true;
  let cfg = { deviceId: null, target: null };
  let clock = Date.now();
  const events = [];
  let fetchFn;
  const make = (over = {}) =>
    createActivation({
      userDataDir: tmp,
      master: { url: base, anonKey: mock.MOCK_ANON_KEY },
      appVersion: '0.0.0',
      platform: 'win32',
      secrets: { available: () => secretsOk, get: (n) => secrets.get(n) ?? null, set: (n, v) => secrets.set(n, v), delete: (n) => secrets.delete(n) },
      config: { get: () => cfg, update: (p) => { cfg = { ...cfg, ...p }; } },
      emit: (s) => events.push(s),
      fetchFn: (...a) => (fetchFn ?? fetch)(...a),
      now: () => clock,
      ...over,
    });

  let a = make();
  a.init();
  assert.equal(a.state().stage, 'needs-license');

  // --- resolve
  let r = await a.resolve('not a key');
  assert.equal(r.ok, false); assert.equal(r.code, 'LB_LICENSE_NOT_FOUND');
  r = await a.resolve('LB-ZZZZ-ZZZZ-ZZZZ-ZZZZ');
  assert.equal(r.code, 'LB_LICENSE_NOT_FOUND');
  secretsOk = false;
  r = await a.resolve(demo.license_key);
  assert.equal(r.code, 'NOT_CONFIGURED'); assert.equal(secrets.size, 0);
  secretsOk = true;
  st.expired = true;
  r = await a.resolve(demo.license_key);
  assert.equal(r.code, 'LB_LICENSE_EXPIRED'); assert.equal(secrets.size, 0);
  st.expired = false;
  const noMaster = make({ master: null });
  assert.equal((await noMaster.resolve(demo.license_key)).code, 'NOT_CONFIGURED');
  r = await a.resolve(`  ${demo.license_key.toLowerCase()} `);
  assert.equal(r.ok, true);
  assert.equal(r.state.stage, 'needs-login');
  assert.equal(secrets.get('licenseKey'), demo.license_key);
  assert.equal(cfg.target.url, base);
  assert.match(cfg.deviceId, /^[0-9a-f-]{36}$/);
  assert.equal(r.state.companyName, demo.company_name);
  assert.equal(r.state.licenseKeyMasked, maskLicenseKey(demo.license_key));

  // --- login refusals
  r = await a.login(demo.connector_email, 'wrong');
  assert.equal(r.code, 'LB_AUTH_FAILED');
  r = await a.login(demo.owner_email, mock.MOCK_OWNER_PASSWORD);
  assert.equal(r.code, 'LB_AUTH_FAILED'); assert.match(r.message, /not a connector/);
  r = await a.login('wrong-license@example.invalid', mock.MOCK_CONNECTOR_PASSWORD);
  assert.equal(r.code, 'LB_AUTH_FAILED'); assert.match(r.message, /does not belong/);
  assert.equal(a.state().stage, 'needs-login');
  assert.equal(secrets.has('session'), false); assert.equal(secrets.has('connectorPassword'), false);

  // --- login ok + bootstrap
  r = await a.login(demo.connector_email, mock.MOCK_CONNECTOR_PASSWORD);
  assert.equal(r.ok, true); assert.equal(r.state.stage, 'active');
  assert.equal(r.state.blocking, null); assert.equal(r.state.offline, false);
  assert.ok(r.state.lastBootstrapAt);
  const boot = st.rpcBodies.find((b) => b.rpc === 'app_bootstrap');
  assert.equal(boot.p_app, 'desktop'); assert.equal(boot.p_device_id, cfg.deviceId); assert.equal(boot.p_license_key, demo.license_key);
  assert.ok(fs.existsSync(path.join(tmp, 'themes', 'mock-graphite.json')));
  assert.equal(JSON.parse(fs.readFileSync(path.join(tmp, 'themes', 'mock-graphite.json'), 'utf8')).slug, 'mock-graphite');
  assert.ok(a.getBootstrap().features.reports);

  // state to the renderer never carries secrets
  const wire = JSON.stringify(a.state()) + JSON.stringify(events);
  for (const bad of [mock.MOCK_CONNECTOR_PASSWORD, 'mock-access', 'mock-refresh', demo.license_key]) assert.ok(!wire.includes(bad), `leaked ${bad}`);

  // themes are re-fetched only when the version rises
  const gt = () => st.rpcBodies.filter((b) => b.rpc === 'get_themes').length;
  const g0 = gt();
  await a.bootstrapNow();
  assert.equal(gt(), g0);
  st.themeVersion = 2;
  await a.bootstrapNow();
  assert.equal(gt(), g0 + 1);
  assert.equal(JSON.parse(fs.readFileSync(path.join(tmp, 'themes', 'mock-graphite.json'), 'utf8')).version, 2);

  // --- blocking states and recovery
  st.maintenance = true; await a.bootstrapNow();
  assert.equal(a.state().blocking.code, 'LB_MAINTENANCE'); assert.match(a.state().blocking.message, /ten minutes/);
  st.maintenance = false; st.contractVersion = '2'; await a.bootstrapNow();
  assert.equal(a.state().blocking.code, 'LB_CONTRACT_TOO_OLD');
  st.contractVersion = '1'; st.mustUpdate = true; await a.bootstrapNow();
  assert.equal(a.state().blocking.code, 'LB_UPDATE_REQUIRED');
  st.mustUpdate = false; st.expired = true; await a.bootstrapNow();
  assert.equal(a.state().blocking.code, 'LB_LICENSE_EXPIRED');
  st.expired = false; await a.bootstrapNow();
  assert.equal(a.state().blocking, null);

  // --- offline never blocks, cache survives
  fetchFn = async () => { throw new TypeError('fetch failed'); };
  await a.bootstrapNow();
  assert.equal(a.state().offline, true); assert.equal(a.state().stage, 'active'); assert.equal(a.state().blocking, null);
  assert.ok(a.getBootstrap());
  fetchFn = undefined;
  await a.bootstrapNow();
  assert.equal(a.state().offline, false);

  // --- token refresh chain
  const t1 = await a.getAccessToken();
  assert.equal(await a.getAccessToken(), t1); // still valid
  clock += 3600 * 1000; // expired
  const calls0 = st.calls.length;
  const t2 = await a.getAccessToken();
  assert.notEqual(t2, t1);
  assert.ok(st.calls.slice(calls0).some((c) => c.includes('grant_type=refresh_token')));
  // refresh token revoked -> falls back to the stored password
  st.refreshTokens.clear(); clock += 3600 * 1000;
  const t3 = await a.getAccessToken();
  assert.notEqual(t3, t2);
  // password also gone -> session dropped, login required
  st.refreshTokens.clear(); secrets.delete('connectorPassword'); clock += 3600 * 1000;
  await assert.rejects(a.getAccessToken(), (e) => e.code === 'LB_AUTH_FAILED');
  assert.equal(a.state().stage, 'needs-login'); assert.equal(secrets.has('session'), false);
  // refresh while offline keeps the session
  r = await a.login(demo.connector_email, mock.MOCK_CONNECTOR_PASSWORD);
  assert.equal(r.ok, true);
  clock += 3600 * 1000; fetchFn = async () => { throw new TypeError('fetch failed'); };
  await assert.rejects(a.getAccessToken(), (e) => e.code === 'NETWORK');
  assert.equal(a.state().stage, 'active');
  fetchFn = undefined;

  // --- restart: state comes back from secrets + config + cache
  const b = make(); b.init();
  assert.equal(b.state().stage, 'active'); assert.equal(b.state().companyName, demo.company_name);

  // --- a different license wipes the previous login
  secrets.set('licenseKey', 'LB-TEST-0000-0000-0001');
  // (mock only knows the demo key, so simulate by resolving demo again: previous differs -> login cleared)
  r = await b.resolve(demo.license_key);
  assert.equal(r.ok, true); assert.equal(r.state.stage, 'needs-login'); assert.equal(secrets.has('connectorPassword'), false);

  // --- deactivate
  await b.login(demo.connector_email, mock.MOCK_CONNECTOR_PASSWORD);
  r = b.deactivate();
  assert.equal(r.state.stage, 'needs-license'); assert.equal(cfg.target, null); assert.equal(secrets.size, 0);
  assert.equal(fs.existsSync(path.join(tmp, 'bootstrap.json')), false);

  // --- timer start/stop does not hang the process
  const c = make(); c.init(); c.start(); c.stop();

  real.close();
  fs.rmSync(out, { recursive: true, force: true });
  console.log('activation tests passed');
})().catch((e) => { console.error(e); process.exit(1); });
