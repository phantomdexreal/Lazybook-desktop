// Node-level check for Phase 37: full resync, reset vault (real SQLite), diagnostics zip, open folder, zip writer, wiring.
// Run: NODE_PATH=<dir with typescript 5, zod, better-sqlite3> node tests/tools.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');

const out = path.join(__dirname, '.tmp-tools');
fs.rmSync(out, { recursive: true, force: true });
const compile = (dir, only) => {
  fs.mkdirSync(path.join(out, dir), { recursive: true });
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.ts') && (!only || only.includes(n)))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(dir, f), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } }).outputText;
    fs.writeFileSync(path.join(out, dir, f.replace(/\.ts$/, '.js')), js);
  }
};
compile('src/main'); compile('src/main/db'); compile('src/shared');
fs.mkdirSync(path.join(out, 'docs/shared'), { recursive: true });
fs.copyFileSync('docs/shared/data_model.json', path.join(out, 'docs/shared/data_model.json'));
const { initLogger } = require(path.join(out, 'src/main/logger.js'));
const V = require(path.join(out, 'src/main/db/index.js'));
const { setMeta, getMeta } = require(path.join(out, 'src/main/db/seq.js'));
const { createTools } = require(path.join(out, 'src/main/tools.js'));
const Z = require(path.join(out, 'src/main/zip.js'));
const { maskText } = require(path.join(out, 'src/main/logs.js'));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-tools-'));
initLogger({ dir: path.join(tmp, 'logs'), maxBytes: 1e6, keepFiles: 2 });
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const FX = 'docs/shared/fixtures/tables';
const fx = (t) => JSON.parse(fs.readFileSync(path.join(FX, t + '.json'), 'utf8'));

function rig(o = {}) {
  const dir = fs.mkdtempSync(path.join(tmp, 'case-'));
  const vdir = path.join(dir, 'vault');
  const st = { vault: V.openVault({ dir: vdir }), calls: [], logs: [], running: false, ...o };
  const rows = fx('tm_ledger');
  st.vault.bulkLoad('tm_ledger', rows);
  setMeta(st.vault.db, 'sched.memory', JSON.stringify({ companyGuid: 'x' }));
  st.vault.setCursor?.('ph-1', 0);
  const d = {
    getVault: () => st.vault,
    setVault: (v) => { st.calls.push(['setVault', v ? 'vault' : null]); st.vault = v; },
    openVault: () => { if (st.reopenFails) throw new Error('boom'); return V.openVault({ dir: vdir }); },
    deleteVaultFiles: () => { if (st.deleteFails) throw new Error('locked'); V.deleteVaultFiles(vdir, { backups: true }); },
    forgetSyncMemory: (v) => setMeta(v.db, 'sched.memory', 'null'),
    syncNow: async () => { st.calls.push(['syncNow']); if (st.running) { st.running = false; } },
    syncRunning: () => st.running,
    dataFolder: () => dir,
    openPath: async (p) => { st.calls.push(['open', p]); return st.openErr ?? ''; },
    chooseZipPath: async () => (st.cancel ? null : path.join(dir, 'diag.zip')),
    writeFile: (p, b) => { if (st.writeFails) throw new Error('disk'); fs.writeFileSync(p, b); },
    logsText: () => 'LazyBooks log export\n{"t":"x","msg":"login a.b@example.com key LB-ABCD-1234-5678-WXYZ"}\n',
    summary: () => ({ app: { version: '1.0.0' }, status: { errors: [], note: 'owner a.b@example.com' } }),
    mask: maskText,
    log: (m, x) => st.logs.push([m, x]),
  };
  return { t: createTools(d), st, dir, vdir, rows };
}

(async () => {
  {
    const { t, st, rows } = rig();
    const v = st.vault;
    const r = await t.fullResync();
    assert.equal(r.ok, true);
    assert.equal(getMeta(v.db, 'sched.memory'), 'null', 'memory forgotten so the next cycle is a first_sync full pull');
    assert.equal(st.vault, v, 'same vault, not replaced');
    assert.equal(v.count('tm_ledger'), rows.length, 'data kept');
    assert.deepEqual(st.calls.filter((c) => c[0] === 'syncNow').length, 1);
    st.vault = null;
    const r2 = await t.fullResync();
    assert.equal(r2.ok, false); assert.equal(r2.code, 'VAULT_CLOSED');
    v.close();
    ok('full resync forgets the sync memory, keeps the data and starts a sync; closed vault is reported');
  }
  {
    const { t, st, vdir, rows } = rig();
    const old = st.vault;
    st.vault.upsert?.('tm_ledger', []);
    fs.mkdirSync(path.join(vdir, 'backups'), { recursive: true });
    fs.writeFileSync(path.join(vdir, 'backups', 'vault-20260101T000000Z.sqlite'), 'x');
    for (const bad of [undefined, null, {}, { confirm: 'reset' }, { confirm: true }, 'RESET']) {
      const r = await t.resetVault(bad);
      assert.equal(r.ok, false); assert.equal(r.code, 'NOT_CONFIRMED');
    }
    assert.equal(st.vault, old);
    assert.equal(old.count('tm_ledger'), rows.length, 'nothing touched without the confirmation');
    assert.equal(st.calls.length, 0);
    const r = await t.resetVault({ confirm: 'RESET' });
    assert.equal(r.ok, true);
    assert.notEqual(st.vault, old);
    assert.throws(() => old.count('tm_ledger'), 'old vault was closed');
    assert.equal(st.vault.count('tm_ledger'), 0, 'fresh empty vault');
    assert.equal(st.vault.info.origin, 'fresh');
    assert.equal(getMeta(st.vault.db, 'sched.memory'), null, 'no sync memory: the scheduler does a first_sync');
    assert.equal(fs.existsSync(path.join(vdir, 'backups')), false, 'backups removed');
    assert.deepEqual(st.calls.map((c) => c[0]), ['setVault', 'setVault', 'syncNow']);
    assert.equal(st.calls[0][1], null, 'vault is null while being replaced');
    st.vault.close();
    ok('reset (real SQLite): needs the exact confirmation, closes and deletes the old files and backups, opens a fresh vault, then syncs');
  }
  {
    const { t, st } = rig();
    st.running = true;
    const r = await t.resetVault({ confirm: 'RESET' });
    assert.equal(r.ok, true);
    assert.ok(st.calls.findIndex((c) => c[0] === 'syncNow') < st.calls.findIndex((c) => c[0] === 'setVault'), 'waited for the running cycle before touching the vault');
    st.vault.close();
    const b = rig();
    b.st.running = true;
    b.st.vault.close();
    const d2 = createTools({ ...{}, getVault: () => null, setVault() {}, openVault() { throw new Error('x'); }, deleteVaultFiles() {}, forgetSyncMemory() {}, syncNow: async () => {}, syncRunning: () => true, dataFolder: () => '', openPath: async () => '', chooseZipPath: async () => null, writeFile() {}, logsText: () => '', summary: () => ({}), mask: (s) => s });
    const r3 = await d2.resetVault({ confirm: 'RESET' });
    assert.equal(r3.ok, false); assert.equal(r3.code, 'SYNC_RUNNING');
    ok('reset waits for a running cycle, and refuses (touching nothing) if one never ends');
  }
  {
    const a = rig({ deleteFails: true });
    const r = await a.t.resetVault({ confirm: 'RESET' });
    assert.equal(r.ok, false); assert.equal(r.code, 'DELETE_FAILED');
    assert.ok(a.st.vault, 'vault reopened after a failed delete');
    assert.equal(a.st.vault.count('tm_ledger'), a.rows.length, 'data intact');
    assert.equal(a.st.calls.filter((c) => c[0] === 'syncNow').length, 0);
    a.st.vault.close();
    const b = rig({ reopenFails: true });
    const r2 = await b.t.resetVault({ confirm: 'RESET' });
    assert.equal(r2.ok, false); assert.equal(r2.code, 'REOPEN_FAILED');
    assert.equal(b.st.vault, null);
    ok('failed delete keeps everything and reopens; failed reopen is reported and leaves no half vault');
  }
  {
    const { t, st, dir } = rig();
    const r = await t.exportDiagnostics();
    assert.equal(r.ok, true);
    const zipPath = path.join(dir, 'diag.zip');
    assert.equal(r.path, zipPath);
    execFileSync('python3', ['-c', `import zipfile,sys\nz=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None;print(",".join(sorted(z.namelist())))`, zipPath], { encoding: 'utf8' });
    const names = execFileSync('python3', ['-c', `import zipfile,sys\nprint(",".join(sorted(zipfile.ZipFile(sys.argv[1]).namelist())))`, zipPath], { encoding: 'utf8' }).trim();
    assert.equal(names, 'README.txt,diagnostics.json,logs.txt');
    const read = (nm) => execFileSync('python3', ['-c', `import zipfile,sys\nsys.stdout.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]).decode())`, zipPath, nm], { encoding: 'utf8' });
    const all = read('diagnostics.json') + read('logs.txt');
    assert.ok(!all.includes('a.b@example.com'), 'e-mail masked');
    assert.ok(!all.includes('LB-ABCD-1234-5678-WXYZ'), 'license key masked');
    assert.ok(all.includes('LB-ABCD-****-****-WXYZ'));
    assert.ok(JSON.parse(read('diagnostics.json')).generatedAt);
    assert.ok(!/sqlite|vault\.sqlite/i.test(names), 'no vault in the bundle');
    st.vault.close();
    ok('diagnostics: a valid zip (python zipfile) with README, summary and logs, secrets masked, no vault');
  }
  {
    const a = rig({ cancel: true });
    const r = await a.t.exportDiagnostics();
    assert.equal(r.ok, false); assert.equal(r.canceled, true);
    assert.equal(fs.existsSync(path.join(a.dir, 'diag.zip')), false);
    const b = rig({ writeFails: true });
    const r2 = await b.t.exportDiagnostics();
    assert.equal(r2.ok, false); assert.equal(r2.code, 'FAILED');
    a.st.vault.close(); b.st.vault.close();
    ok('diagnostics: canceled dialog writes nothing; write failure gives a plain message');
  }
  {
    const a = rig();
    const o = await a.t.openDataFolder();
    assert.equal(o.ok, true);
    assert.deepEqual(a.st.calls.find((c) => c[0] === 'open'), ['open', a.dir]);
    a.st.openErr = 'nope';
    assert.equal((await a.t.openDataFolder()).ok, false);
    let release; const gate = new Promise((r) => { release = r; });
    a.st.running = false;
    const slow = createTools({ getVault: () => a.st.vault, setVault() {}, openVault() {}, deleteVaultFiles() {}, forgetSyncMemory() {}, syncNow: async () => {}, syncRunning: () => false, dataFolder: () => '', openPath: async () => '', chooseZipPath: () => gate.then(() => null), writeFile() {}, logsText: () => '', summary: () => ({}), mask: (s) => s });
    const p1 = slow.exportDiagnostics();
    const p2 = await slow.fullResync();
    assert.equal(p2.ok, false); assert.equal(p2.code, 'BUSY');
    release(); await p1;
    assert.equal((await slow.fullResync()).ok, true);
    a.st.vault.close();
    ok('open folder uses only the injected folder; two maintenance actions never overlap');
  }
  {
    const crc = Z.crc32(Buffer.from('123456789'));
    assert.equal(crc, 0xcbf43926);
    assert.throws(() => Z.createZip([{ name: '../x', data: 'a' }]));
    assert.throws(() => Z.createZip([{ name: '/x', data: 'a' }]));
    assert.throws(() => Z.createZip([{ name: 'C:/x', data: 'a' }]));
    assert.throws(() => Z.createZip([{ name: 'a', data: 'a' }, { name: 'a', data: 'b' }]));
    const rnd = require('node:crypto').randomBytes(5000);
    const z = Z.createZip([{ name: 'empty.txt', data: '' }, { name: 'big.txt', data: 'abc'.repeat(10000) }, { name: 'rand.bin', data: rnd }, { name: 'dir/ü.txt', data: 'é' }]);
    const p = path.join(tmp, 'z.zip'); fs.writeFileSync(p, z);
    const res = execFileSync('python3', ['-c', `import zipfile,sys,hashlib\nz=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None\nprint(len(z.read("big.txt")),len(z.read("empty.txt")),hashlib.sha256(z.read("rand.bin")).hexdigest(),z.read("dir/\\u00fc.txt").decode())`, p], { encoding: 'utf8' }).trim().split(' ');
    assert.equal(res[0], '30000'); assert.equal(res[1], '0');
    assert.equal(res[2], require('node:crypto').createHash('sha256').update(rnd).digest('hex'));
    assert.equal(res[3], 'é');
    assert.ok(z.length < 12000, 'repetitive data is deflated');
    execFileSync('unzip', ['-tq', p]);
    ok('zip writer: CRC vector, unsafe and duplicate names refused, empty, compressible, random and unicode entries read back by python and unzip');
  }
  {
    const ipc = fs.readFileSync('src/shared/ipc.ts', 'utf8');
    for (const c of ["toolsResync: 'lb:tools:resync'", "toolsReset: 'lb:tools:reset'", "toolsDiagnostics: 'lb:tools:diagnostics'", "toolsOpenFolder: 'lb:tools:openFolder'"]) assert.ok(ipc.includes(c), c);
    const pre = fs.readFileSync('src/preload/index.ts', 'utf8');
    assert.ok(pre.includes('IPC.toolsReset, { confirm }'));
    const idx = fs.readFileSync('src/main/index.ts', 'utf8');
    for (const s of ['createTools(', 'IPC.toolsResync', 'IPC.toolsReset', 'IPC.toolsDiagnostics', 'IPC.toolsOpenFolder', "backups: true", 'shell.openPath(p)']) assert.ok(idx.includes(s), s);
    assert.ok(!/ipcMain\.handle\(IPC\.tools\w+, \(_e, \w+: string/.test(idx), 'no path argument from the renderer');
    assert.ok(fs.readFileSync('src/renderer/components/Shell.tsx', 'utf8').includes("id: 'tools'"));
    assert.ok(fs.readFileSync('src/renderer/App.tsx', 'utf8').includes('<ToolsPage'));
    const page = fs.readFileSync('src/renderer/pages/Tools.tsx', 'utf8');
    assert.ok(!page.includes('STATUS: STUB') && page.includes("window.lb.tools.reset('RESET')"));
    for (const f of ['src/main/tools.ts', 'src/main/zip.ts', 'src/renderer/pages/Tools.tsx']) {
      const t = fs.readFileSync(f, 'utf8');
      assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(t), 'no emoji in ' + f);
      assert.ok(!/#[0-9a-fA-F]{3,8}\b/.test(t), 'no hex colour in ' + f);
    }
    ok('wiring and hygiene: channels, preload confirm word, handlers take no path, route, no emoji, no hex colours');
  }
  fs.rmSync(out, { recursive: true, force: true });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`\n${n} checks passed`);
})().catch((e) => { console.error(e); process.exit(1); });
