// LazyBooks | tools/release-meta.mjs
// Phase 42: everything the release workflow needs to compute, as plain tested functions (no GitHub, no secrets in this file).
//   node tools/release-meta.mjs meta     --tag v1.2.0 --repo owner/lazybooks-releases --installer release/LazyBooks-Setup-1.2.0.exe --out release/meta.json
//   node tools/release-meta.mjs register --meta release/meta.json --release-id 123      (env: MASTER_FN_URL, CI_SECRET; the secret is never printed)
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const TAG = /^v(\d+\.\d+\.\d+)(?:-beta\.(\d+))?$/;

/** `vX.Y.Z` is stable, `vX.Y.Z-beta.N` is the beta channel. The app compares plain x.y.z only, so the built version is the numeric part. */
export function parseTag(tag) {
  const m = TAG.exec(String(tag ?? '').trim());
  if (!m) return null;
  return { tag: tag.trim(), version: m[1], channel: m[2] ? 'beta' : 'stable', prerelease: !!m[2] };
}

/** The `## <version>` section of CHANGELOG.md (tag name, with or without the v and beta suffix); falls back to a one line note. */
export function notesFor(changelog, tag) {
  const t = parseTag(tag);
  if (!t) return '';
  const names = [tag.replace(/^v/, ''), t.version];
  const lines = String(changelog ?? '').split(/\r?\n/);
  for (const name of names) {
    const start = lines.findIndex((l) => new RegExp(`^##\\s+\\[?v?${name.replace(/[.+]/g, '\\$&')}\\]?(\\s|$)`).test(l));
    if (start < 0) continue;
    let end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
    if (end < 0) end = lines.length;
    const body = lines.slice(start + 1, end).join('\n').trim();
    if (body) return body;
  }
  return `LazyBooks Desktop ${t.version}`;
}

export function sha256Hex(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

/** Public download address the updater accepts: https://github.com/<owner>/<repo>/releases/download/<tag>/<file>. */
export function downloadUrl(repo, tag, file) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo ?? '')) throw new Error('repo must be owner/name');
  if (!/^[A-Za-z0-9_.-]+$/.test(file ?? '')) throw new Error('bad file name');
  return `https://github.com/${repo}/releases/download/${tag}/${file}`;
}

/** The `ci-publish-release` body (SHARED_CONTRACTS): `app, version, channel, notes, download_url, sha256, repo, tag, release_id`. */
export function buildPayload({ tag, repo, installerName, installerBytes, notes, releaseId }) {
  const t = parseTag(tag);
  if (!t) throw new Error(`tag "${tag}" is not vX.Y.Z or vX.Y.Z-beta.N`);
  if (installerName !== `LazyBooks-Setup-${t.version}.exe`) throw new Error(`installer name ${installerName} does not match version ${t.version}`);
  return {
    app: 'desktop',
    version: t.version,
    channel: t.channel,
    notes,
    download_url: downloadUrl(repo, t.tag, installerName),
    sha256: sha256Hex(installerBytes),
    repo,
    tag: t.tag,
    release_id: releaseId ?? 0,
  };
}

/** latest.yml must announce the same version and file as the payload, or the app refuses the update (FEED_MISMATCH). */
export function checkLatestYml(text, version, fileName) {
  const v = /^version:\s*['"]?([^'"\r\n]+?)['"]?\s*$/m.exec(text)?.[1];
  const p = /^path:\s*['"]?([^'"\r\n]+?)['"]?\s*$/m.exec(text)?.[1];
  const problems = [];
  if (v !== version) problems.push(`latest.yml version ${v ?? 'missing'} is not ${version}`);
  if (p !== fileName) problems.push(`latest.yml path ${p ?? 'missing'} is not ${fileName}`);
  if (!/^sha512:\s*\S+/m.test(text)) problems.push('latest.yml has no sha512');
  return problems;
}

/** POSTs the payload. The secret goes only in the header and never into an error text. */
export async function register({ payload, functionUrl, secret, fetchImpl = fetch }) {
  if (!functionUrl || !/^https?:\/\//.test(functionUrl)) throw new Error('MASTER_FN_URL is missing or not a URL');
  if (!secret) throw new Error('CI_SECRET is missing');
  const res = await fetchImpl(`${functionUrl.replace(/\/+$/, '')}/ci-publish-release`, {
    method: 'POST',
    headers: { 'x-ci-secret': secret, 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`ci-publish-release answered ${res.status}: ${text.slice(0, 300).split(secret).join('***')}`);
  return JSON.parse(text);
}

function args(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i += 2) o[argv[i].replace(/^--/, '')] = argv[i + 1];
  return o;
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const a = args(rest);
  if (cmd === 'meta') {
    const t = parseTag(a.tag);
    if (!t) throw new Error(`tag "${a.tag}" is not vX.Y.Z or vX.Y.Z-beta.N`);
    const installerBytes = readFileSync(a.installer);
    const notes = notesFor(readFileSync('CHANGELOG.md', 'utf8'), a.tag);
    const payload = buildPayload({ tag: a.tag, repo: a.repo, installerName: basename(a.installer), installerBytes, notes, releaseId: 0 });
    const yml = readFileSync(a.installer.replace(/[^/\\]+$/, 'latest.yml'), 'utf8');
    const problems = checkLatestYml(yml, payload.version, payload.download_url.split('/').pop());
    if (problems.length) throw new Error(problems.join('; '));
    writeFileSync(a.out, JSON.stringify(payload, null, 2));
    writeFileSync(a.out.replace(/meta\.json$/, 'notes.md'), notes + '\n');
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `version=${t.version}\nchannel=${t.channel}\nprerelease=${t.prerelease}\nsha256=${payload.sha256}\n`);
    console.log(`meta ok: ${payload.version} ${payload.channel} sha256 ${payload.sha256}`);
  } else if (cmd === 'version') {
    const t = parseTag(a.tag);
    if (!t) throw new Error(`tag "${a.tag}" is not vX.Y.Z or vX.Y.Z-beta.N`);
    console.log(t.version);
  } else if (cmd === 'register') {
    const payload = JSON.parse(readFileSync(a.meta, 'utf8'));
    payload.release_id = Number(a['release-id']);
    if (!Number.isInteger(payload.release_id) || payload.release_id <= 0) throw new Error('--release-id must be the GitHub release id');
    const r = await register({ payload, functionUrl: process.env.MASTER_FN_URL, secret: process.env.CI_SECRET });
    console.log(`registered as draft: ${JSON.stringify(r)}`);
  } else {
    throw new Error('usage: release-meta.mjs meta|version|register ...');
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(`release-meta: ${e.message}`);
    process.exit(1);
  });
}
