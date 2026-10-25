// Phase 42 check (Node only, no GitHub, no Windows): tag and notes rules, payload shape and updater compatibility, latest.yml cross-check,
// registration against a local HTTP server (secret only in the header), workflow and build-injection greps.
// Run: NODE_PATH=<dir with typescript 5> node tests/release.cjs
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const root = path.join(__dirname, '..');
const rd = (p) => fs.readFileSync(path.join(root, p), 'utf8');
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);

(async () => {
  const R = await import(pathToFileURL(path.join(root, 'tools/release-meta.mjs')).href);

  // 1. tags
  assert.deepEqual(R.parseTag('v1.2.3'), { tag: 'v1.2.3', version: '1.2.3', channel: 'stable', prerelease: false });
  assert.deepEqual(R.parseTag('v1.2.3-beta.4'), { tag: 'v1.2.3-beta.4', version: '1.2.3', channel: 'beta', prerelease: true });
  for (const bad of ['1.2.3', 'v1.2', 'v1.2.3-rc.1', 'v1.2.3-beta', 'v1.2.3.4', 'v1.2.3-beta.1; rm -rf /', '', null, undefined]) assert.equal(R.parseTag(bad), null, String(bad));
  ok('tags: vX.Y.Z is stable, vX.Y.Z-beta.N is beta (built as x.y.z), everything else refused');

  // 2. notes
  const log = '# Changelog\n\n## Unreleased\n* later\n\n## 1.3.0-beta.1\n* beta note\n\n## 1.2.0\n* one\n* two\n\n## 1.1.0\n* old\n';
  assert.equal(R.notesFor(log, 'v1.2.0'), '* one\n* two');
  assert.equal(R.notesFor(log, 'v1.3.0-beta.1'), '* beta note');
  assert.equal(R.notesFor(log, 'v1.3.0-beta.2'), 'LazyBooks Desktop 1.3.0'); // no section: one line, never empty
  assert.equal(R.notesFor('', 'v9.9.9'), 'LazyBooks Desktop 9.9.9');
  assert.match(R.notesFor(rd('CHANGELOG.md'), 'v0.0.1'), /LazyBooks Desktop 0\.0\.1/);
  ok('notes: the section of the tag, beta section first, one-line fallback');

  // 3. payload vs the updater's own rules
  const bytes = Buffer.from('installer bytes');
  const sha = require('node:crypto').createHash('sha256').update(bytes).digest('hex');
  const p = R.buildPayload({ tag: 'v1.2.0', repo: 'acme/lazybooks-releases', installerName: 'LazyBooks-Setup-1.2.0.exe', installerBytes: bytes, notes: 'n', releaseId: 77 });
  assert.deepEqual(Object.keys(p), ['app', 'version', 'channel', 'notes', 'download_url', 'sha256', 'repo', 'tag', 'release_id']); // SHARED_CONTRACTS ci-publish-release
  assert.equal(p.app, 'desktop'); assert.equal(p.sha256, sha); assert.equal(p.release_id, 77);
  assert.equal(p.download_url, 'https://github.com/acme/lazybooks-releases/releases/download/v1.2.0/LazyBooks-Setup-1.2.0.exe');
  assert.throws(() => R.buildPayload({ tag: 'v1.2.0', repo: 'acme/r', installerName: 'LazyBooks-Setup-1.2.1.exe', installerBytes: bytes, notes: '' }), /does not match/);
  assert.throws(() => R.buildPayload({ tag: 'v1.2', repo: 'acme/r', installerName: 'x', installerBytes: bytes, notes: '' }), /not vX/);
  assert.throws(() => R.downloadUrl('not a repo', 'v1.0.0', 'a.exe'), /owner\/name/);
  assert.throws(() => R.downloadUrl('a/b', 'v1.0.0', '../a.exe'), /bad file/);
  // the updater accepts exactly this address and derives the folder that holds latest.yml
  const ts = require('typescript');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-rel-'));
  fs.writeFileSync(path.join(tmp, 'updater.js'), ts.transpileModule(rd('src/main/updater.ts'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText);
  let U = null;
  try { U = require(path.join(tmp, 'updater.js')); } catch (e) { console.log('skip - updater.ts needs its imports to load:', e.message.split('\n')[0]); }
  if (U) {
    assert.equal(U.feedUrlFromDownloadUrl(p.download_url), 'https://github.com/acme/lazybooks-releases/releases/download/v1.2.0');
    assert.equal(U.compareVersions(p.version, '1.1.9'), 1);
    assert.match(p.sha256, /^[0-9a-f]{64}$/);
  }
  ok('payload: contract keys, sha256 of the installer, name must match the version, address accepted by the updater' + (U ? '' : ' (updater import skipped)'));

  // 4. latest.yml cross-check
  const yml = "version: 1.2.0\nfiles:\n  - url: LazyBooks-Setup-1.2.0.exe\n    sha512: abc==\n    size: 10\npath: LazyBooks-Setup-1.2.0.exe\nsha512: abc==\nreleaseDate: '2026-10-25T00:00:00.000Z'\n";
  assert.deepEqual(R.checkLatestYml(yml, '1.2.0', 'LazyBooks-Setup-1.2.0.exe'), []);
  assert.equal(R.checkLatestYml(yml, '1.2.1', 'LazyBooks-Setup-1.2.0.exe').length, 1);
  assert.equal(R.checkLatestYml(yml, '1.2.0', 'Other.exe').length, 1);
  assert.equal(R.checkLatestYml('version: 1.2.0\npath: LazyBooks-Setup-1.2.0.exe\n', '1.2.0', 'LazyBooks-Setup-1.2.0.exe').length, 1);
  ok('latest.yml: version, path and sha512 must agree with the payload (else the app would answer FEED_MISMATCH)');

  // 5. CLI end to end: meta from a fake release folder, then register against a local server
  const rel = path.join(tmp, 'release'); fs.mkdirSync(rel);
  fs.writeFileSync(path.join(rel, 'LazyBooks-Setup-1.2.0.exe'), bytes);
  fs.writeFileSync(path.join(rel, 'latest.yml'), yml);
  const cli = (args, env = {}, cwd = root) => spawnSync(process.execPath, [path.join(root, 'tools/release-meta.mjs'), ...args], { cwd, encoding: 'utf8', env: { ...process.env, ...env } });
  let r = cli(['version', '--tag', 'v1.2.0-beta.3']); assert.equal(r.stdout.trim(), '1.2.0');
  r = cli(['version', '--tag', 'main']); assert.notEqual(r.status, 0);
  const cwd = path.join(tmp, 'repo'); fs.mkdirSync(cwd); fs.writeFileSync(path.join(cwd, 'CHANGELOG.md'), log);
  const gho = path.join(tmp, 'gho.txt');
  r = cli(['meta', '--tag', 'v1.2.0', '--repo', 'acme/lazybooks-releases', '--installer', path.join(rel, 'LazyBooks-Setup-1.2.0.exe'), '--out', path.join(rel, 'meta.json')], { GITHUB_OUTPUT: gho }, cwd);
  assert.equal(r.status, 0, r.stderr);
  const meta = JSON.parse(fs.readFileSync(path.join(rel, 'meta.json'), 'utf8'));
  assert.equal(meta.notes, '* one\n* two'); assert.equal(meta.sha256, sha);
  assert.equal(fs.readFileSync(path.join(rel, 'notes.md'), 'utf8'), '* one\n* two\n');
  assert.match(fs.readFileSync(gho, 'utf8'), /version=1\.2\.0\nchannel=stable\nprerelease=false/);
  fs.writeFileSync(path.join(rel, 'latest.yml'), yml.replace('version: 1.2.0', 'version: 1.2.1'));
  r = cli(['meta', '--tag', 'v1.2.0', '--repo', 'acme/lazybooks-releases', '--installer', path.join(rel, 'LazyBooks-Setup-1.2.0.exe'), '--out', path.join(rel, 'meta2.json')], {}, cwd);
  assert.notEqual(r.status, 0); assert.match(r.stderr, /latest\.yml version/);

  let seen = null;
  const server = http.createServer((q, s) => {
    let b = ''; q.on('data', (c) => (b += c)); q.on('end', () => {
      seen = { url: q.url, secret: q.headers['x-ci-secret'], body: JSON.parse(b) };
      if (seen.secret !== 'topsecret') { s.statusCode = 401; return s.end('bad secret topsecret'); }
      s.end(JSON.stringify({ release_id: 'abc' }));
    });
  });
  await new Promise((res) => server.listen(0, '127.0.0.1', res));
  const url = `http://127.0.0.1:${server.address().port}/functions/v1/`;
  r = await new Promise((res) => require('node:child_process').execFile(process.execPath, [path.join(root, 'tools/release-meta.mjs'), 'register', '--meta', path.join(rel, 'meta.json'), '--release-id', '4242'], { env: { ...process.env, MASTER_FN_URL: url, CI_SECRET: 'topsecret' } }, (e, so, se) => res({ status: e ? e.code : 0, stdout: so, stderr: se })));
  assert.equal(r.status, 0, r.stderr);
  assert.equal(seen.url, '/functions/v1/ci-publish-release'); assert.equal(seen.body.release_id, 4242); assert.equal(seen.body.app, 'desktop');
  assert.ok(!r.stdout.includes('topsecret'));
  r = await new Promise((res) => require('node:child_process').execFile(process.execPath, [path.join(root, 'tools/release-meta.mjs'), 'register', '--meta', path.join(rel, 'meta.json'), '--release-id', '1'], { env: { ...process.env, MASTER_FN_URL: url, CI_SECRET: 'wrong' } }, (e, so, se) => res({ status: e ? e.code : 0, stdout: so, stderr: se })));
  assert.notEqual(r.status, 0); assert.match(r.stderr, /401/);
  r = cli(['register', '--meta', path.join(rel, 'meta.json'), '--release-id', '0'], { MASTER_FN_URL: url, CI_SECRET: 'x' });
  assert.notEqual(r.status, 0);
  const noSecret = await R.register({ payload: p, functionUrl: url, secret: 'topsecret' });
  assert.equal(noSecret.release_id, 'abc');
  await assert.rejects(R.register({ payload: p, functionUrl: url, secret: 'nottopsecret-but-leaks' }), (e) => !e.message.includes('nottopsecret-but-leaks'));
  server.close();
  ok('cli: meta writes payload, notes and step outputs and stops on a mismatching latest.yml; register posts with the header secret, a wrong secret fails without echoing it, bad release id refused');

  // 6. workflow and build injection greps
  const wf = rd('.github/workflows/release.yml');
  assert.ok(!/STATUS: STUB/.test(wf));
  assert.match(wf, /runs-on: windows-latest/);
  assert.match(wf, /tags:\s*\n\s*- 'v\[0-9\]\+\.\[0-9\]\+\.\[0-9\]\+'\s*\n\s*- 'v\[0-9\]\+\.\[0-9\]\+\.\[0-9\]\+-beta\.\[0-9\]\+'/);
  assert.match(wf, /--publish never -c\.publish\.provider=generic/);
  assert.match(wf, /releases\/download\/\$\{\{ env\.TAG \}\}/);
  assert.match(wf, /secrets\.LB_RELEASES_TOKEN/); assert.match(wf, /secrets\.LB_CI_SECRET/);
  assert.ok(!/(ghp_|github_pat_)[A-Za-z0-9]/.test(wf) && !/eyJ[A-Za-z0-9_-]{10,}/.test(wf), 'no literal credentials');
  assert.ok(!/echo .*\$\{\{ secrets\./.test(wf));
  assert.match(wf, /release-meta\.mjs register/);
  assert.match(wf, /--prerelease/);
  assert.match(wf, /^permissions:\s*\n\s*contents: read/m);
  const order = ['name: Set the version', 'name: Tests that need', 'name: Build', 'name: Installer and latest.yml', 'name: Publish to the releases repo', 'name: Register release'].map((k) => wf.indexOf(k));
  assert.ok(order.every((v, k) => v > 0 && (k === 0 || v > order[k - 1])), 'step order: ' + order);
  const vite = rd('electron.vite.config.ts');
  assert.match(vite, /__LB_MASTER_URL__/); assert.match(vite, /__LB_MASTER_ANON_KEY__/);
  const idx = rd('src/main/index.ts');
  assert.match(idx, /process\.env\[ENV_MASTER_URL\] \|\| \(typeof __LB_MASTER_URL__/);
  assert.match(rd('src/main/buildEnv.d.ts'), /__LB_MASTER_ANON_KEY__/);
  ok('workflow: tag triggers, windows runner, order (version, tests, build, installer, publish, register), generic feed for latest.yml, secrets only by reference, least permissions; registry values baked in at build with env still winning');
  console.log(`all ${n} checks passed`);
})().catch((e) => { console.error(e); process.exit(1); });
