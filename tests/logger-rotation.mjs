// Node-level check for Phase 2: rotation, retention cap, redaction. Run: node tests/logger-rotation.mjs
import ts from 'typescript';
import { readFileSync, writeFileSync, mkdtempSync, readdirSync, readFileSync as rf } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const tmp = mkdtempSync(join(tmpdir(), 'lb-log-'));
const js = ts.transpileModule(readFileSync('src/main/logger.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const mod = join(tmp, 'logger.mjs');
writeFileSync(mod, js);
const { initLogger, logger } = await import(mod);

const dir = join(tmp, 'logs');
initLogger({ dir, maxBytes: 2000, keepFiles: 3 });
for (let i = 0; i < 200; i++) logger.info('app', 'line ' + i, { n: i, password: 'hunter2', nested: { apiKey: 'k', ok: 1 }, jwt: 'eyJhbGciOiJIUzI1.eyJzdWIiOiIxMjM0NTY3.abcdefghijkl' });
const files = readdirSync(dir).sort();
assert.deepEqual(files, ['lazybooks.1.log', 'lazybooks.2.log', 'lazybooks.log'], 'keeps exactly 3 files');
const all = files.map((f) => rf(join(dir, f), 'utf8')).join('');
assert.ok(!all.includes('hunter2') && !all.includes('eyJhbGci'), 'secrets redacted');
const first = JSON.parse(rf(join(dir, 'lazybooks.log'), 'utf8').split('\n')[0]);
assert.deepEqual(Object.keys(first).slice(0, 4), ['t', 'lvl', 'mod', 'msg']);
assert.equal(first.data.nested.apiKey, '[redacted]');
assert.equal(first.data.nested.ok, 1);
console.log('logger-rotation OK', files);
