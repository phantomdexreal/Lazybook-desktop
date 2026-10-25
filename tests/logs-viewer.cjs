// Node-level check for Phase 34: log reader (filter, search, rotation, damaged lines, redaction, export) and view helpers.
// Run: NODE_PATH=<dir with typescript 5> node tests/logs-viewer.cjs
const ts = require('typescript');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-logs');
fs.rmSync(out, { recursive: true, force: true });
for (const f of ['src/main/logger.ts', 'src/main/logs.ts', 'src/renderer/lib/logView.ts']) {
  const js = ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true });
  fs.writeFileSync(path.join(out, f.replace(/\.ts$/, '.js')), js);
}
const { initLogger, logger } = require(path.join(out, 'src/main/logger.js'));
const { createLogReader, parseLine, maskText, MAX_LIMIT } = require(path.join(out, 'src/main/logs.js'));
const V = require(path.join(out, 'src/renderer/lib/logView.js'));

let passed = 0;
const check = (name, fn) => { fn(); passed++; console.log('ok -', name); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-logs-'));
const dir = path.join(tmp, 'logs');

// small maxBytes so several files exist
initLogger({ dir, maxBytes: 4000, keepFiles: 4 });
for (let i = 0; i < 120; i++) {
  const lvl = i % 10 === 0 ? 'error' : i % 3 === 0 ? 'warn' : 'info';
  logger[lvl](i % 2 ? 'sync' : 'tally', `event number ${i}`, { n: i, token: 'SECRETTOKEN' + i, note: i === 77 ? 'needle-in-data' : 'plain' });
}
const reader = createLogReader(dir);

check('rotation made several files and the newest line comes first across them', () => {
  assert.ok(reader.fileCount() >= 3, 'files: ' + reader.fileCount());
  const r = reader.tail({ limit: 5 });
  assert.equal(r.lines.length, 5);
  assert.equal(r.lines[0].msg, 'event number 119');
  assert.equal(r.lines[4].msg, 'event number 115');
  assert.equal(r.truncated, true);
  for (let i = 1; i < r.lines.length; i++) assert.ok(r.lines[i - 1].t >= r.lines[i].t);
});

check('limit: default 200, clamped to 1..1000, truncated only when more exist', () => {
  const all = reader.tail({ limit: MAX_LIMIT + 500 });
  assert.ok(all.lines.length <= MAX_LIMIT && all.lines.length > 0);
  assert.equal(reader.tail({ limit: 0 }).lines.length, 1);
  const small = createLogReader(fs.mkdtempSync(path.join(os.tmpdir(), 'lb-empty-')));
  assert.deepEqual(small.tail(), { lines: [], truncated: false, skipped: 0 });
  assert.deepEqual(createLogReader(path.join(tmp, 'nope')).tail(), { lines: [], truncated: false, skipped: 0 });
});

check('level is a minimum severity; module and text filters combine', () => {
  const w = reader.tail({ level: 'warn', limit: 1000 });
  assert.ok(w.lines.length > 0 && w.lines.every((l) => l.lvl !== 'info'));
  const e = reader.tail({ level: 'error', limit: 1000 });
  assert.ok(e.lines.length > 0 && e.lines.every((l) => l.lvl === 'error') && e.lines.length < w.lines.length);
  const m = reader.tail({ mod: 'sync', limit: 1000 });
  assert.ok(m.lines.every((l) => l.mod === 'sync'));
  const q = reader.tail({ q: 'EVENT NUMBER 11', limit: 1000 }); // case-insensitive, matches 11, 110..119
  assert.ok(q.lines.length >= 10 && q.lines.every((l) => /event number 11/.test(l.msg)));
  const d = reader.tail({ q: 'needle-in-data', limit: 1000 }); // found inside data
  assert.equal(d.lines.length, 1);
  assert.equal(d.lines[0].data.n, 77);
  assert.equal(reader.tail({ mod: 'tally', q: 'event number 77', limit: 10 }).lines.length, 0); // 77 is odd = sync
});

check('secrets are redacted: key-based, JWT, license key, e-mail, bearer; search cannot reach the raw value', () => {
  const r = reader.tail({ limit: 1000 });
  assert.ok(r.lines.every((l) => l.data.token === '[redacted]'));
  assert.equal(reader.tail({ q: 'SECRETTOKEN', limit: 10 }).lines.length, 0);
  const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTYifQ.abcDEF123456_-xyz';
  const raw = JSON.stringify({ t: '2026-10-25T10:00:00.000Z', lvl: 'warn', mod: 'app', msg: `login for owner@example.com with LB-ABCD-EFGH-JKLM-WXYZ failed Bearer abcdefghij12345 ${jwt}`, data: { password: 'hunter2', nested: { apiKey: 'k', mail: 'a.b@c.io', lic: 'LB-AAAA-BBBB-CCCC-DDDD' } } });
  const l = parseLine(raw);
  const text = JSON.stringify(l);
  assert.doesNotMatch(text, /owner@example|hunter2|EFGH|JKLM|abcdefghij12345|eyJhbG|a\.b@c\.io|BBBB/);
  assert.match(l.msg, /LB-ABCD-\*\*\*\*-\*\*\*\*-WXYZ/);
  assert.equal(l.data.password, '[redacted]');
  assert.equal(l.data.nested.apiKey, '[redacted]');
  assert.equal(maskText('LB-AAAA-BBBB-CCCC-DDDD'), 'LB-AAAA-****-****-DDDD');
});

check('damaged, empty and foreign lines are skipped and counted; the rest still shows', () => {
  const d2 = path.join(tmp, 'logs2'); fs.mkdirSync(d2);
  fs.writeFileSync(path.join(d2, 'lazybooks.log'), ['{"t":"2026-10-25T10:00:00.000Z","lvl":"info","mod":"app","msg":"good one"}', '{"t":"2026-10-25T10:00:01.000Z","lvl":"inf', 'not json at all', '[1,2]', '{"x":1}', '', '{"t":"2026-10-25T10:00:02.000Z","lvl":"weird","msg":"odd level"}'].join('\n'));
  fs.writeFileSync(path.join(d2, 'other.txt'), 'ignored');
  fs.writeFileSync(path.join(d2, 'lazybooks.bak.log'), '{"t":"x","msg":"ignored"}');
  const r = createLogReader(d2).tail();
  assert.deepEqual(r.lines.map((l) => l.msg), ['odd level', 'good one']);
  assert.equal(r.lines[0].lvl, 'info'); // unknown level reads as info
  assert.equal(r.lines[0].mod, 'app'); // missing module reads as app
  assert.equal(r.skipped, 4);
});

check('export writes every kept file oldest first, redacted, with a header and an exact line count', () => {
  const dest = path.join(tmp, 'export.txt');
  const w = reader.exportTo(dest);
  const text = fs.readFileSync(dest, 'utf8');
  const lines = text.trimEnd().split('\n');
  assert.match(lines[0], /^LazyBooks log export, \d{4}-\d\d-\d\dT.*Z, \d+ lines\. Secrets are redacted\.$/);
  assert.equal(lines.length - 1, w.lines);
  const everything = reader.tail({ limit: MAX_LIMIT }).lines.length;
  assert.equal(w.lines >= everything, true);
  const nums = lines.slice(1).map((l) => Number(/event number (\d+)/.exec(l)[1]));
  assert.deepEqual(nums, [...nums].sort((a, b) => a - b)); // oldest first
  assert.doesNotMatch(text, /SECRETTOKEN/);
  assert.match(lines[1], /^\d{4}-\d\d-\d\dT[\d:.]+Z (INFO|WARN|ERROR) +\w+ +event number \d+/);
  const empty = createLogReader(path.join(tmp, 'nope')).exportTo(path.join(tmp, 'empty.txt'));
  assert.equal(empty.lines, 0);
  assert.equal(fs.readFileSync(path.join(tmp, 'empty.txt'), 'utf8').split('\n').length, 2);
});

check('view helpers', () => {
  assert.match(V.formatTime('2026-10-25T10:00:00Z'), /^\d\d [A-Z][a-z]{2} \d\d:\d\d:\d\d$/);
  assert.equal(V.formatTime('garbage'), 'garbage');
  const l = { t: 'x', lvl: 'info', mod: 'app', msg: 'm', data: { a: 1, b: { c: 2 } } };
  assert.equal(V.dataPreview(l), 'a 1, b {"c":2}');
  assert.equal(V.dataPreview({ ...l, data: undefined }), '');
  assert.ok(V.dataPreview({ ...l, data: { long: 'x'.repeat(300) } }).length <= 90);
  assert.equal(V.dataPretty({ ...l, data: { a: 1 } }), '{\n  "a": 1\n}');
  assert.equal(V.countText(1, false), '1 line');
  assert.match(V.countText(200, true), /200 lines \(newest shown/);
  assert.deepEqual([...V.MODULES], ['app', 'tally', 'vault', 'postbox', 'entries', 'snapshot', 'sync', 'ui']);
});

check('wiring and hygiene: IPC channels, validated input, save dialog, no emoji, hardcoded colours or legacy names', () => {
  const ipc = fs.readFileSync('src/shared/ipc.ts', 'utf8');
  assert.match(ipc, /logsTail: 'lb:logs:tail'/);
  assert.match(ipc, /logsExport: 'lb:logs:export'/);
  const idx = fs.readFileSync('src/main/index.ts', 'utf8');
  assert.match(idx, /LogQueryInput = z/);
  assert.match(idx, /ipcMain\.handle\(IPC\.logsTail/);
  assert.match(idx, /ipcMain\.handle\(IPC\.logsExport/);
  assert.match(idx, /showSaveDialog/);
  const pre = fs.readFileSync('src/preload/index.ts', 'utf8');
  assert.match(pre, /IPC\.logsTail/);
  assert.match(pre, /IPC\.logsExport/);
  // the renderer never gets a path to read: tail takes a filter only
  assert.doesNotMatch(ipc, /tail\([^)]*(path|file|dir)/i);
  for (const f of ['src/renderer/pages/Logs.tsx', 'src/renderer/lib/logView.ts', 'src/main/logs.ts']) {
    const t = fs.readFileSync(f, 'utf8');
    assert.doesNotMatch(t, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(/);
    assert.doesNotMatch(t, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
    assert.doesNotMatch(t, /bizanalyst|biz analyst|khatabook|siliconveins/i);
  }
});

fs.rmSync(out, { recursive: true, force: true });
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${passed} checks passed`);
