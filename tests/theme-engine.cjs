// Node-level check for Phase 4: the three shared themes pass the contrast gate; bad themes are refused; CSS is well formed.
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const out = path.join(__dirname, '.tmp', 'renderer');
fs.mkdirSync(out, { recursive: true });
const js = ts.transpileModule(fs.readFileSync('src/renderer/theme/engine.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
fs.writeFileSync(path.join(out, 'engine.js'), js);
const { validateTheme, themeCss, resolveMode, contrast } = require(path.join(out, 'engine.js'));

for (const slug of ['obsidian-violet', 'graphite-iris', 'ink-lilac']) {
  const raw = JSON.parse(fs.readFileSync(`docs/shared/themes/${slug}.json`, 'utf8'));
  const r = validateTheme(raw);
  assert.ok(r.ok, slug + ' ' + (r.errors || []).join('; '));
  const css = themeCss(r.theme);
  assert.ok(css.includes(`:root[data-theme="${slug}"][data-mode="dark"]`) && css.includes('--lb-surface-raised:') && css.includes('--lb-chart-8:'));
  assert.equal((css.match(/--lb-bg:/g) || []).length, 2);
}
const base = JSON.parse(fs.readFileSync('docs/shared/themes/obsidian-violet.json', 'utf8'));
const bad = structuredClone(base); bad.modes.dark.text = '#222222';
assert.ok(!validateTheme(bad).ok, 'low contrast refused');
const missing = structuredClone(base); delete missing.modes.light.accent;
assert.ok(!validateTheme(missing).ok, 'missing token refused');
const inj = structuredClone(base); inj.shared.font_sans = 'x;} body{display:none';
assert.ok(!validateTheme(inj).ok, 'css injection refused');
const slugBad = structuredClone(base); slugBad.slug = 'a"]{}';
assert.ok(!validateTheme(slugBad).ok, 'slug refused');
assert.equal(resolveMode('system', true), 'dark');
assert.equal(resolveMode('light', true), 'light');
assert.ok(contrast('#000000', '#ffffff') > 20.9);
console.log('theme-engine OK');
