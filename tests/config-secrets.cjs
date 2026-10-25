// Node-level check for Phase 3: config schema/migration/atomic write and secrets-not-in-plain-text.
// Run: node tests/config-secrets.cjs   (transpiles src/main + src/shared to tests/.tmp as CommonJS)
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const out = path.join(__dirname, '.tmp');
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
const cfg = require(path.join(out, 'src/main/config.js'));
const sec = require(path.join(out, 'src/main/secrets.js'));

const tmp = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'lb-cfg-'));
initLogger({ dir: path.join(tmp, 'logs') });

// legacy state.json (Phase 2) is absorbed, then removed
fs.writeFileSync(path.join(tmp, 'state.json'), JSON.stringify({ paused: true }));
let c = cfg.initConfig(tmp);
assert.equal(c.paused, true);
assert.ok(!fs.existsSync(path.join(tmp, 'state.json')));
assert.equal(c.tally.port, 9000);

// update merges nested, validates, persists, notifies
let seen = null;
cfg.onConfigChange((_c, changed) => (seen = changed));
c = cfg.updateConfig({ tally: { port: 9001 }, cloudCopy: true, theme: { mode: 'dark' } });
assert.deepEqual(seen.sort(), ['cloudCopy', 'tally', 'theme']);
assert.equal(JSON.parse(fs.readFileSync(path.join(tmp, 'config.json'), 'utf8')).tally.host, 'localhost');
assert.throws(() => cfg.updateConfig({ intervalMin: 0 }), 'rejects invalid');
assert.equal(cfg.getConfig().intervalMin, 5, 'invalid update not applied');

// migration from an unversioned file
fs.writeFileSync(path.join(tmp, 'config.json'), JSON.stringify({ intervalMin: 10 }));
c = cfg.initConfig(tmp);
assert.equal(c.version, 1);
assert.equal(c.intervalMin, 10);
assert.equal(c.lookbackDays, 7);

// corrupt file: backed up, defaults used
fs.writeFileSync(path.join(tmp, 'config.json'), '{not json');
c = cfg.initConfig(tmp);
assert.equal(c.intervalMin, 5);
assert.ok(fs.readdirSync(tmp).some((n) => n.startsWith('config.json.corrupt-')));

// secrets: fake backend = AES-GCM (stands in for safeStorage); nothing readable on disk
const key = crypto.randomBytes(32);
const backend = {
  isAvailable: () => true,
  encrypt: (p) => { const iv = crypto.randomBytes(12); const ci = crypto.createCipheriv('aes-256-gcm', key, iv); const e = Buffer.concat([ci.update(p, 'utf8'), ci.final()]); return Buffer.concat([iv, ci.getAuthTag(), e]); },
  decrypt: (b) => { const d = crypto.createDecipheriv('aes-256-gcm', key, b.subarray(0, 12)); d.setAuthTag(b.subarray(12, 28)); return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8'); },
};
sec.initSecrets(tmp, backend);
sec.setSecret('licenseKey', 'LB-DEMO-0000-0000-0001');
sec.setSecret('connectorPassword', 'hunter2-very-secret');
const disk = fs.readFileSync(path.join(tmp, 'secrets.bin'));
assert.ok(!disk.includes('hunter2') && !disk.includes('LB-DEMO'), 'no plain text in secrets.bin');
sec.initSecrets(tmp, backend); // fresh cache
assert.equal(sec.getSecret('connectorPassword'), 'hunter2-very-secret');
sec.deleteSecret('connectorPassword');
assert.equal(sec.hasSecret('connectorPassword'), false);
assert.equal(sec.getSecret('licenseKey'), 'LB-DEMO-0000-0000-0001');
for (const f of fs.readdirSync(tmp)) if (f.endsWith('.json')) assert.ok(!fs.readFileSync(path.join(tmp, f), 'utf8').includes('hunter2'));
// logs never contain secret values
const logs = fs.readdirSync(path.join(tmp, 'logs')).map((f) => fs.readFileSync(path.join(tmp, 'logs', f), 'utf8')).join('');
assert.ok(!logs.includes('hunter2') && !logs.includes('LB-DEMO-0000'), 'secrets not logged');
// unavailable backend refuses (no plain fallback)
sec.initSecrets(tmp, { ...backend, isAvailable: () => false });
assert.throws(() => sec.setSecret('passphrase', 'x'), /not available/);
// tampered blob: reset, not crash
sec.initSecrets(tmp, backend);
fs.writeFileSync(path.join(tmp, 'secrets.bin'), Buffer.from('garbage-garbage-garbage-garbage-garbage'));
assert.equal(sec.getSecret('licenseKey'), null);
console.log('config-secrets OK');
