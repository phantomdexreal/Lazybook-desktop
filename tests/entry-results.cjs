// Node-level check for Phase 28: result + error mapping (entry_rules.json result table, tally_message_map, friendly texts, import answer mapping).
// Run: NODE_PATH=<dir with typescript 5> node tests/entry-results.cjs
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-er');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main/entries', 'src/main/tally']) {
  fs.mkdirSync(path.join(out, sub), { recursive: true });
  for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
    const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
    }).outputText;
    fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
  }
}
fs.mkdirSync(path.join(out, 'docs/shared'), { recursive: true });
fs.copyFileSync('docs/shared/entry_rules.json', path.join(out, 'docs/shared/entry_rules.json'));
const R = (p) => require(path.join(out, p));
const RS = R('src/main/entries/results.js');
const { parseImportResult } = R('src/main/tally/xml.js');

const rules = JSON.parse(fs.readFileSync('docs/shared/entry_rules.json', 'utf8')).result;
const examples = JSON.parse(fs.readFileSync('docs/shared/entry_examples/results.example.json', 'utf8'));
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const imp = (o) => ({ ok: false, ambiguous: false, created: 0, altered: 0, ignored: 0, combined: 0, errors: 0, lastVchId: null, lastMId: null, lineErrors: [], statusDesc: null, ...o });

// 1. the table is entry_rules.json, every code is an LB_* code of SHARED_CONTRACTS section 9
{
  const contracts = fs.readFileSync('docs/shared/SHARED_CONTRACTS.md', 'utf8');
  const lb = new Set(contracts.match(/`LB_[A-Z_]+`/g).map((x) => x.slice(1, -1)));
  const details = Object.keys(rules.details);
  assert.equal(details.length, 27);
  for (const d of details) {
    assert.deepEqual({ ...RS.ruleFor(d) }, rules.details[d], d);
    assert.ok(lb.has(rules.details[d].code), `${d} -> ${rules.details[d].code} is in SHARED_CONTRACTS section 9`);
    if (d !== 'UNKNOWN') assert.notEqual(RS.friendlyMessage(d), RS.friendlyMessage('UNKNOWN'), `${d} has its own text`);
    assert.ok(RS.friendlyMessage(d).length > 10 && /^[\x20-\x7E]+$/.test(RS.friendlyMessage(d)), `friendly text for ${d}`);
  }
  for (const m of rules.tally_message_map) assert.ok(RS.ruleFor(m.detail), `map target ${m.detail} exists`);
  assert.equal(RS.ruleFor('NOPE'), undefined);
  assert.equal(RS.ruleFor('toString'), undefined);
  assert.equal(RS.isKnownDetail('UNBALANCED'), true);
  assert.equal(RS.friendlyMessage('NOPE'), RS.friendlyMessage('UNKNOWN'));
}
ok('details table equals entry_rules.json (27 details, status/code/retryable), every code is a SHARED_CONTRACTS LB_* code, every detail has a plain ASCII text');

// 2. status classes from ENTRY_PAYLOADS section 6
{
  for (const d of ['PAYLOAD_INVALID', 'TOTAL_MISMATCH', 'TAX_MISMATCH', 'UNBALANCED', 'LEDGER_NOT_FOUND', 'VOUCHER_TYPE_MISMATCH', 'DATE_OUT_OF_PERIOD', 'COMPANY_MISMATCH', 'VOUCHER_NUMBER_EXISTS', 'NEGATIVE_STOCK', 'BILL_REF_NOT_FOUND'])
    assert.deepEqual([RS.ruleFor(d).code, RS.ruleFor(d).status, RS.ruleFor(d).retryable], ['LB_TALLY_REJECTED', 'failed', false], d);
  assert.deepEqual({ ...RS.ruleFor('MASTER_EXISTS') }, { code: 'LB_ENTRY_DUPLICATE', status: 'failed', retryable: false });
  for (const d of ['TALLY_UNREACHABLE', 'TALLY_COMPANY_NOT_LOADED']) assert.deepEqual({ ...RS.ruleFor(d) }, { code: 'LB_TALLY_UNREACHABLE', status: 'queued', retryable: true });
  for (const d of ['ALTER_CONFLICT', 'AMBIGUOUS_RESULT']) assert.deepEqual([RS.ruleFor(d).code, RS.ruleFor(d).status], ['LB_ENTRY_NEEDS_REVIEW', 'needs_review']);
  assert.equal(RS.ruleFor('DUPLICATE_CLIENT_REQUEST').status, 'posted');
  assert.equal(RS.ruleFor('UNKNOWN').status, 'failed');
}
ok('validation failures are failed + LB_TALLY_REJECTED, Tally down is queued + retryable, conflicts are needs_review, duplicate request closes as posted');

// 3. every shared pattern compiles and matches a realistic sample, first match wins
{
  const samples = {
    LEDGER_NOT_FOUND: ["Ledger 'Alpha Retail' does not exist!", 'Ledger Beta Stores not found'],
    STOCK_ITEM_NOT_FOUND: ["Stock Item 'Widget A' does not exist!"],
    GODOWN_NOT_FOUND: ["Godown 'Main Store' does not exist"],
    VOUCHER_TYPE_NOT_FOUND: ["Voucher Type 'Sales GST' does not exist"],
    VOUCHER_NUMBER_EXISTS: ["Voucher Number 'S-002' already exists", 'Voucher number already exists', 'Duplicate voucher number'],
    DATE_OUT_OF_PERIOD: ['Date is out of range', 'The date is outside the financial year'],
    UNBALANCED: ['Debit and Credit totals do not match', 'Difference in Voucher Totals'],
    NEGATIVE_STOCK: ['Negative stock is not allowed', 'Negative closing balance'],
    BILL_REF_NOT_FOUND: ["Bill 'INV-9' not found", 'Reference does not exist'],
    MASTER_EXISTS: ['Ledger Delta Traders already exists', 'Duplicate name'],
    TALLY_COMPANY_NOT_LOADED: ['Company is not open', 'No company loaded'],
    EINVOICE_REJECTED: ['IRN generation failed', 'E-way bill rejected', 'e-invoice error'],
    MASTER_NOT_FOUND: ["Group 'Sundry X' does not exist", "Unit 'Nos' not found", "Stock Group 'Raw' does not exist"],
  };
  for (const [d, list] of Object.entries(samples)) for (const t of list) assert.equal(RS.mapTallyMessage(t), d, `${d}: ${t}`);
  assert.deepEqual({ ...RS.matchTallyMessage("Ledger 'Alpha Retail' does not exist!") }, { detail: 'LEDGER_NOT_FOUND', name: 'Alpha Retail' });
  assert.equal(RS.matchTallyMessage("Stock Item 'Widget A' does not exist!").name, 'Widget A');
  assert.equal(RS.matchTallyMessage('Voucher number already exists').name, undefined);
  assert.equal(RS.mapTallyMessage('something nobody has seen'), null);
  assert.equal(RS.mapTallyMessage(''), null);
  assert.equal(RS.mapTallyMessage(undefined), null);
  assert.equal(RS.mapTallyMessage('x'.repeat(100000)), null); // long text does not hang
}
ok('all shared tally_message_map patterns compile and map realistic Tally texts; names captured; relaxed voucher-number and master-not-found extras; unmatched is null');

// 4. the shared results example: real parser -> mapping equals the example result
{
  const raw = examples.failed_ledger.tally_raw;
  const res = parseImportResult(raw);
  assert.equal(res.ok, false);
  const f = RS.mapImportFailure(res);
  assert.equal(f.detail, 'LEDGER_NOT_FOUND');
  assert.equal(f.message.replace(/\.$/, ''), examples.failed_ledger.message);
  assert.ok(f.tally_raw.includes('Alpha Retail'));
  const rule = RS.ruleFor(f.detail);
  const stored = { ok: false, code: rule.code, detail: f.detail, retryable: rule.retryable, message: f.message, tally_raw: f.tally_raw };
  assert.equal(stored.code, examples.failed_ledger.code);
  assert.equal(stored.retryable, examples.failed_ledger.retryable);
  for (const [k, v] of Object.entries(examples)) assert.deepEqual(RS.checkResultShape(v), [], k);
  assert.deepEqual(RS.checkResultShape(stored), []);
  assert.equal(RS.ruleFor(examples.needs_review.detail).status, 'needs_review');
  assert.equal(RS.ruleFor('DUPLICATE_CLIENT_REQUEST').status, 'posted');
}
ok('CREATED/ERRORS/LINEERROR answer of the shared failed_ledger example maps to the example result (detail, code, retryable, friendly text, raw kept); all 4 shared examples pass the shape check');

// 5. import answers
{
  const two = RS.mapImportFailure(imp({ errors: 2, lineErrors: ['Something odd', "Ledger 'Q' does not exist!", 'Voucher number already exists'] }));
  assert.equal(two.detail, 'LEDGER_NOT_FOUND'); // first line error that maps decides
  assert.ok(two.tally_raw.includes('Something odd') && two.tally_raw.includes(' | '));
  const unk = RS.mapImportFailure(imp({ errors: 1, lineErrors: ['Totally new Tally text'] }));
  assert.equal(unk.detail, 'UNKNOWN');
  assert.ok(unk.message.includes('Tally said: Totally new Tally text'));
  assert.equal(unk.tally_raw, 'Totally new Tally text');
  const none = RS.mapImportFailure(imp({ errors: 1 }));
  assert.deepEqual([none.detail, none.message], ['UNKNOWN', RS.friendlyMessage('UNKNOWN')]);
  assert.equal(RS.mapImportFailure(imp({ statusDesc: 'SVCurrentCompany not loaded' })).detail, 'TALLY_COMPANY_NOT_LOADED');
  assert.equal(RS.mapImportFailure(imp({ statusDesc: 'Company is not open' })).detail, 'TALLY_COMPANY_NOT_LOADED');
  assert.equal(RS.mapImportFailure(imp({ statusDesc: 'Unknown Request, cannot be processed' })).detail, 'UNKNOWN');
  const amb = RS.mapImportFailure(imp({ ambiguous: true, ignored: 1 }));
  assert.equal(amb.detail, 'AMBIGUOUS_RESULT');
  assert.equal(RS.ruleFor(amb.detail).status, 'needs_review');
  assert.equal(RS.mapImportFailure(imp({ errors: 1, lineErrors: ['Voucher number already exists'] })).detail, 'VOUCHER_NUMBER_EXISTS');
  assert.equal(RS.mapImportFailure(imp({ errors: 1, lineErrors: ['Ledger Delta already exists'] })).detail, 'MASTER_EXISTS');
  // an injected mapper wins, the table is the fallback
  assert.equal(RS.mapImportFailure(imp({ errors: 1, lineErrors: ["Ledger 'Q' does not exist!"] }), () => 'TAX_MISMATCH').detail, 'TAX_MISMATCH');
  assert.equal(RS.mapImportFailure(imp({ errors: 1, lineErrors: ["Ledger 'Q' does not exist!"] }), () => null).detail, 'LEDGER_NOT_FOUND');
  // the name only fills the text of the detail it belongs to
  assert.equal(RS.mapImportFailure(imp({ errors: 1, lineErrors: ["Ledger 'Q' does not exist!"] }), () => 'UNBALANCED').message, RS.friendlyMessage('UNBALANCED'));
  assert.equal(RS.mapImportFailure(imp({ errors: 1, lineErrors: ["Ledger 'Q' does not exist!"] })).message, "Ledger 'Q' does not exist in Tally.");
}
ok('first mapped line error decides, unmapped is UNKNOWN with Tally text kept, company status is retryable, unclear answer is needs_review, injected mapper wins');

// 6. raw text rules and the shape check
{
  const long = 'A'.repeat(5000);
  const r = RS.mapImportFailure(imp({ errors: 1, lineErrors: [`bad \u0001\u0007 text ${long}`] }));
  assert.equal(r.tally_raw.length, 2000);
  assert.ok(!/[\u0000-\u0008]/.test(r.tally_raw));
  assert.ok(r.message.length <= 300);
  assert.equal(RS.rawOf('a\tb\nc').length, 5); // tab and newline stay
  const base = { ok: false, code: 'LB_TALLY_REJECTED', detail: 'UNBALANCED', retryable: false };
  assert.deepEqual(RS.checkResultShape(base), []);
  const paths = (o) => RS.checkResultShape(o).map((i) => i.path).sort();
  assert.deepEqual(paths({ ...base, code: 'LB_TALLY_UNREACHABLE' }), ['code']);
  assert.deepEqual(paths({ ...base, retryable: true }), ['retryable']);
  assert.deepEqual(paths({ ...base, detail: 'MADE_UP' }), ['detail']);
  assert.deepEqual(paths({ ...base, extra: 1 }), ['extra']);
  assert.deepEqual(paths({ ...base, tally_raw: 'x'.repeat(2001) }), ['tally_raw']);
  assert.deepEqual(paths({ ok: 'yes' }), ['ok']);
  assert.deepEqual(paths({ ok: true, alter_id: 1.5 }), ['alter_id']);
  assert.equal(RS.checkResultShape(null).length, 1);
  assert.equal(RS.checkResultShape([]).length, 1);
}
ok('raw Tally text is stripped of control characters and capped at 2000, messages at 300; the shape check rejects wrong code, retryable, unknown detail or key, long raw, non-integer alter_id');

// 7. hygiene of the new source (no emoji, no legacy branding)
{
  const src = fs.readFileSync('src/main/entries/results.ts', 'utf8');
  assert.ok(/^[\x09\x0A\x20-\x7E]*$/.test(src), 'ASCII only');
  assert.ok(!/bizanalyst|biz analyst|khatabook|siliconveins/i.test(src));
  assert.ok(!/logger|console\./.test(src), 'pure module, logs nothing');
}
ok('results.ts is ASCII only, has no legacy names and logs nothing');

console.log(`\nentry-results: ${n} checks passed`);
