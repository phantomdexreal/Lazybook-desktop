// Node-level check for Phase 36: device list, revoke, force resync, scoping, refusals, view helpers, wiring.
// Run: NODE_PATH=<dir with typescript 5> node tests/devices.cjs
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-devices');
fs.rmSync(out, { recursive: true, force: true });
for (const f of ['src/main/devices.ts', 'src/main/errors.ts', 'src/renderer/lib/devicesView.ts', 'src/renderer/lib/statusView.ts']) {
  const js = ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true });
  fs.writeFileSync(path.join(out, f.replace(/\.ts$/, '.js')), js);
}
const { createDevices, toDeviceView, sortDevices } = require(path.join(out, 'src/main/devices.js'));
const { LbError } = require(path.join(out, 'src/main/errors.js'));
const V = require(path.join(out, 'src/renderer/lib/devicesView.js'));

let passed = 0;
const check = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };

const NOW = Date.parse('2026-10-25T10:00:00Z');
const iso = (minAgo) => new Date(NOW - minAgo * 60000).toISOString();
const LIC = 'LB-AAAA-BBBB-CCCC-DDDD';

function rig(o = {}) {
  const st = {
    devices: [
      { device_id: 'pc-1', license_key: LIC, device_name: 'Office PC', app: 'desktop', platform: 'win32', app_version: '1.0.0', can_write: true, is_revoked: false, last_seen_at: iso(1), last_sync_at: iso(2), created_at: '2026-10-01T00:00:00Z' },
      { device_id: 'ph-1', license_key: LIC, device_name: 'Asha phone', app: 'mobile', platform: 'android', app_version: '2.1.0', can_write: true, is_revoked: false, last_seen_at: iso(3), last_sync_at: iso(4), created_at: '2026-10-02T00:00:00Z' },
      { device_id: 'br-1', license_key: LIC, device_name: null, app: 'pwa', platform: 'web', app_version: null, can_write: false, is_revoked: false, last_seen_at: iso(90), last_sync_at: null, created_at: '2026-10-03T00:00:00Z' },
      { device_id: 'ph-2', license_key: LIC, device_name: 'Old phone', app: 'mobile', platform: null, app_version: null, can_write: true, is_revoked: true, last_seen_at: iso(5), last_sync_at: null, created_at: '2026-10-04T00:00:00Z' },
      { device_id: 'new-1', license_key: LIC, device_name: 'Never synced', app: 'pwa', platform: null, app_version: null, can_write: true, is_revoked: false, last_seen_at: null, last_sync_at: null, created_at: '2026-10-05T00:00:00Z' },
      { device_id: 'other-1', license_key: 'LB-OTHER', device_name: 'Other license', app: 'mobile', platform: null, app_version: null, can_write: true, is_revoked: false, last_seen_at: iso(1), last_sync_at: null, created_at: '2026-10-05T00:00:00Z' },
    ],
    chunks: [{ id: 1, license_key: LIC, device_id: 'ph-1' }, { id: 2, license_key: LIC, device_id: 'br-1' }, { id: 3, license_key: 'LB-OTHER', device_id: 'ph-1' }],
    calls: [], cursors: new Set(['ph-1', 'br-1', 'ph-2']), changed: 0, logs: [], online: true, ...o,
  };
  const matches = (row, q) => q.split('&').filter((x) => x.includes('=eq.')).every((x) => { const [k, v] = x.split('=eq.'); return String(row[k]) === decodeURIComponent(v); });
  const client = {
    async rest(_s, method, p, body) {
      st.calls.push([method, p, body]);
      if (!st.online) throw new LbError('NETWORK', 'offline');
      const [table, q = ''] = p.split('?');
      const rows = table === 'devices' ? st.devices : st.chunks;
      if (method === 'GET') return rows.filter((r) => matches(r, q));
      if (method === 'PATCH') { const hit = rows.filter((r) => matches(r, q)); hit.forEach((r) => Object.assign(r, body)); return hit; }
      if (method === 'DELETE') { const keep = rows.filter((r) => !matches(r, q)); const n = rows.length - keep.length; rows.length = 0; rows.push(...keep); return n; }
      throw new Error('unexpected ' + method);
    },
  };
  const d = createDevices({
    activation: { getAccessToken: async () => 'tok', targetClient: () => client },
    licenseKey: () => st.lic ?? LIC,
    thisDeviceId: () => 'pc-1',
    maxDevices: () => 5,
    dropCursor: (id) => { if (st.noVault) throw new Error('closed'); st.cursors.delete(id); },
    onChanged: () => { st.changed++; },
    log: (m, x) => st.logs.push([m, x]),
    now: () => NOW,
  });
  return { d, st };
}

(async () => {
  await check('list is scoped to the license, flags online/blocked/this PC, sorts this PC first then latest seen', async () => {
    const { d, st } = rig();
    const r = await d.list();
    assert.equal(r.ok, true);
    assert.deepEqual(r.devices.map((x) => x.deviceId), ['pc-1', 'ph-1', 'ph-2', 'br-1', 'new-1']);
    assert.equal(r.maxDevices, 5);
    const by = Object.fromEntries(r.devices.map((x) => [x.deviceId, x]));
    assert.equal(by['pc-1'].thisPc, true);
    assert.equal(by['ph-1'].online, true);
    assert.equal(by['br-1'].online, false, '90 min ago is offline');
    assert.equal(by['ph-2'].online, false, 'blocked is never online');
    assert.equal(by['br-1'].name, 'Browser');
    assert.equal(by['br-1'].canWrite, false);
    assert.ok(st.calls[0][1].includes('license_key=eq.'));
    assert.ok(!JSON.stringify(r).includes(LIC), 'license key is not in the view');
  });

  await check('rows without a usable id or app are dropped; sort is pure and stable', async () => {
    assert.equal(toDeviceView({ device_id: '', app: 'pwa' }, null, NOW), null);
    assert.equal(toDeviceView({ device_id: 'x', app: 'toaster' }, null, NOW), null);
    const a = toDeviceView({ device_id: 'a', app: 'pwa', device_name: 'B', last_seen_at: null }, null, NOW);
    const b = toDeviceView({ device_id: 'b', app: 'pwa', device_name: 'A', last_seen_at: null }, null, NOW);
    assert.deepEqual(sortDevices([a, b]).map((x) => x.name), ['A', 'B']);
  });

  await check('revoke blocks a phone, forgets its position, drops its waiting chunks only', async () => {
    const { d, st } = rig();
    const r = await d.revoke('ph-1');
    assert.equal(r.ok, true);
    assert.equal(st.devices.find((x) => x.device_id === 'ph-1').is_revoked, true);
    assert.equal(st.cursors.has('ph-1'), false);
    assert.deepEqual(st.chunks.map((c) => c.id), [2, 3], 'only this license and device chunks removed');
    assert.equal(st.devices.find((x) => x.device_id === 'other-1').is_revoked, false);
    const patch = st.calls.find((c) => c[0] === 'PATCH');
    assert.ok(patch[1].includes('license_key=eq.') && patch[1].includes('device_id=eq.ph-1'), 'write is scoped to license and device');
    assert.deepEqual(patch[2], { is_revoked: true });
    assert.equal(st.changed, 1);
    assert.equal(st.logs.some(([, x]) => JSON.stringify(x || {}).includes('ph-1')), false, 'ids never logged');
  });

  await check('revoke twice is harmless and writes nothing the second time', async () => {
    const { d, st } = rig();
    await d.revoke('ph-1');
    const before = st.calls.length;
    const r = await d.revoke('ph-1');
    assert.equal(r.ok, true);
    assert.match(r.message, /already blocked/);
    assert.equal(st.calls.slice(before).filter((c) => c[0] !== 'GET').length, 0);
  });

  await check('refusals: this PC, other desktops, unknown, other license, bad ids; nothing is written', async () => {
    const { d, st } = rig();
    st.devices.push({ device_id: 'pc-2', license_key: LIC, device_name: 'Second PC', app: 'desktop', is_revoked: false, last_seen_at: iso(1) });
    for (const [id, code] of [['pc-1', 'THIS_PC'], ['pc-2', 'DESKTOP'], ['nope', 'NOT_FOUND'], ['other-1', 'NOT_FOUND'], ['a/b', 'INVALID'], ['', 'INVALID'], [42, 'INVALID'], [null, 'INVALID']]) {
      for (const fn of ['revoke', 'resync']) {
        const r = await d[fn](id);
        assert.equal(r.ok, false, `${fn} ${id}`);
        assert.equal(r.code, code, `${fn} ${id}`);
      }
    }
    assert.equal(st.calls.filter((c) => c[0] !== 'GET').length, 0);
    assert.equal(st.devices.length, 7);
    assert.equal(st.changed, 0);
  });

  await check('force resync forgets the cursor, drops waiting chunks, leaves the device row alone', async () => {
    const { d, st } = rig();
    const before = JSON.stringify(st.devices);
    const r = await d.resync('ph-1');
    assert.equal(r.ok, true);
    assert.match(r.message, /full copy/);
    assert.equal(st.cursors.has('ph-1'), false);
    assert.equal(st.cursors.has('br-1'), true, 'other devices keep their position');
    assert.deepEqual(st.chunks.map((c) => c.id), [2, 3]);
    assert.equal(JSON.stringify(st.devices), before);
    assert.equal(st.changed, 1);
  });

  await check('resync of a blocked device is refused; a closed vault is reported, nothing deleted', async () => {
    const a = rig();
    const r1 = await a.d.resync('ph-2');
    assert.equal(r1.code, 'REVOKED');
    const b = rig({ noVault: true });
    const r2 = await b.d.resync('ph-1');
    assert.equal(r2.code, 'VAULT_CLOSED');
    assert.equal(b.st.chunks.length, 3, 'chunks stay when the cursor could not be reset');
    const r3 = await b.d.revoke('ph-1');
    assert.equal(r3.ok, true, 'revoke still works without a vault');
  });

  await check('offline, not activated and thrown server errors give plain messages, never throw', async () => {
    const a = rig({ online: false });
    for (const r of [await a.d.list(), await a.d.revoke('ph-1'), await a.d.resync('ph-1')]) {
      assert.equal(r.ok, false);
      assert.equal(r.code, 'NETWORK');
      assert.match(r.message, /internet/);
    }
    const b = rig();
    b.st.lic = '';
    const l = await b.d.list();
    assert.equal(l.ok, false);
    assert.equal(l.code, 'NOT_CONFIGURED');
    const c = rig();
    c.st.devices = null;
    const r = await c.d.list();
    assert.equal(r.ok, false);
  });

  await check('view helpers: state words, allowed actions, texts, limit hint', async () => {
    const mk = (o) => toDeviceView({ device_id: 'x', app: 'mobile', device_name: 'P', ...o }, 'pc-1', NOW);
    assert.equal(V.deviceState(mk({ is_revoked: true, last_seen_at: iso(1) })), 'blocked');
    assert.equal(V.deviceState(mk({ last_seen_at: iso(1) })), 'online');
    assert.equal(V.deviceState(mk({ last_seen_at: iso(60) })), 'offline');
    assert.equal(V.deviceState(mk({})), 'never-seen');
    assert.equal(V.deviceState(mk({ device_id: 'pc-1', app: 'desktop', last_seen_at: iso(1) })), 'this-pc');
    assert.deepEqual(V.actionsFor(mk({})), { revoke: true, resync: true });
    assert.deepEqual(V.actionsFor(mk({ is_revoked: true })), { revoke: false, resync: false });
    assert.deepEqual(V.actionsFor(mk({ app: 'desktop' })), { revoke: false, resync: false });
    assert.deepEqual(V.actionsFor(mk({ device_id: 'pc-1' })), { revoke: false, resync: false });
    assert.equal(V.detailText(mk({ platform: 'android', app_version: '2.1.0' })), 'Phone app, android, v2.1.0');
    assert.equal(V.seenText(mk({}), NOW), 'never');
    assert.equal(V.seenText(mk({ last_seen_at: iso(3) }), NOW), '3 min ago');
    const l = (await rig().d.list()).devices;
    assert.equal(V.limitText(l, 5), '4 of 5 devices used');
    assert.equal(V.limitText(l, null), '4 devices');
    assert.match(V.confirmText('revoke', l[1]), /^Block /);
    assert.match(V.confirmText('resync', l[1]), /full copy/);
  });

  await check('wiring and hygiene: channels, preload, handlers, page, no emoji, no hex colours, no secrets in the view', async () => {
    const ipc = fs.readFileSync('src/shared/ipc.ts', 'utf8');
    for (const c of ["devicesList: 'lb:devices:list'", "devicesRevoke: 'lb:devices:revoke'", "devicesResync: 'lb:devices:resync'"]) assert.ok(ipc.includes(c), c);
    const pre = fs.readFileSync('src/preload/index.ts', 'utf8');
    assert.ok(pre.includes('IPC.devicesList') && pre.includes('IPC.devicesRevoke') && pre.includes('IPC.devicesResync'));
    const idx = fs.readFileSync('src/main/index.ts', 'utf8');
    assert.ok(idx.includes('createDevices(') && idx.includes('IPC.devicesList') && idx.includes('vault.dropDevice'));
    assert.ok(fs.readFileSync('src/renderer/components/Shell.tsx', 'utf8').includes("id: 'devices'"));
    assert.ok(fs.readFileSync('src/renderer/App.tsx', 'utf8').includes('<DevicesPage'));
    const page = fs.readFileSync('src/renderer/pages/Devices.tsx', 'utf8');
    assert.ok(!page.includes('STATUS: STUB'));
    for (const f of ['src/main/devices.ts', 'src/renderer/lib/devicesView.ts', 'src/renderer/pages/Devices.tsx']) {
      const t = fs.readFileSync(f, 'utf8');
      assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(t), 'no emoji in ' + f);
      assert.ok(!/#[0-9a-fA-F]{3,8}\b/.test(t), 'no hex colour in ' + f);
    }
    const iface = fs.readFileSync('src/shared/ipc.ts', 'utf8').match(/export interface DeviceView \{[\s\S]*?\n\}/)[0];
    assert.ok(!/license|token|key/i.test(iface.replace(/\/\*\*[\s\S]*?\*\//g, '')), 'DeviceView has no secret fields');
  });

  fs.rmSync(out, { recursive: true, force: true });
  console.log(`\n${passed} checks passed`);
})().catch((e) => { console.error(e); process.exit(1); });
