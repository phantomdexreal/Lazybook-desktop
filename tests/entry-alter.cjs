// Node-level check for Phase 30: alter (replace), cancel and delete against a stateful fake Tally and the shared fixtures.
// Run: NODE_PATH=<dir with typescript 5> node tests/entry-alter.cjs
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-alt');
fs.rmSync(out, { recursive: true, force: true });
for (const sub of ['src/main', 'src/main/entries', 'src/main/entries/builders', 'src/main/entries/masters', 'src/main/tally', 'src/main/tally/masters', 'src/shared']) {
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
const A = R('src/main/entries/alter.js');
const RS = R('src/main/entries/results.js');
const { TallyError } = R('src/main/tally/client.js');
const { parseImportResult } = R('src/main/tally/xml.js');

const j = (p) => JSON.parse(fs.readFileSync(`docs/shared/${p}`, 'utf8'));
const T = {};
for (const t of ['tm_company', 'tm_ledger', 'tm_group', 'tm_stock_item', 'tm_stock_item_gst', 'tm_unit', 'tm_godown', 'tm_voucher_type', 'tm_stock_group', 'tx_voucher']) T[t] = j(`fixtures/tables/${t}.json`);
const company = T.tm_company[0];
const ex = (f) => j(`entry_examples/${f}.json`);
const alt = ex('alter.valid'), altBad = ex('alter.invalid'), can = ex('cancel.valid'), canBad = ex('cancel.invalid'), del = ex('delete.valid'), delBad = ex('delete.invalid');
const clone = (o) => JSON.parse(JSON.stringify(o));
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const ctx = (env, o = {}) => ({ row: {}, envelope: env, attempt: 1, recovered: false, ...o });
const withData = (base, data) => ({ ...clone(base), data: { ...clone(base.data), ...data } });
const tag = (x, t) => (new RegExp(`<${t}>([^<]*)</${t}>`).exec(x) || [])[1];
const attr = (x, a) => (new RegExp(`<VOUCHER [^>]*${a}="([^"]*)"`).exec(x) || [])[1];

/** Tally with the fixture vouchers as state; applies Alter / Cancel / Delete imports like a configured Tally would (knobs switch that off). */
function fakeTally() {
  const s = { v: new Map(), imports: [], apply: true, answer: null, dropAnswer: false, failRead: false, echoRemote: true };
  for (const r of T.tx_voucher) {
    s.v.set(r.guid, { GUID: r.guid, MASTERID: String(r.master_id), ALTERID: String(r.alter_id), VOUCHERNUMBER: r.number, VOUCHERTYPENAME: r.voucher_type_name, DATE: r.date.replace(/-/g, ''), ISCANCELLED: r.is_cancelled ? 'Yes' : 'No', REMOTEID: r.remote_id || '', IRN: '', IRNCANCELLED: 'No' });
  }
  const byMaster = (m) => [...s.v.values()].find((x) => x.MASTERID === m);
  s.client = {
    async collection(name, fields, opts) {
      if (s.failRead) throw new TallyError('LB_TALLY_UNREACHABLE', 'TALLY_UNREACHABLE', 'connection refused', true, null);
      assert.ok(name === A.REQ_VOUCHER_TARGET || name === 'LBVoucherByGuid');
      const g = /"([^"]*)"/.exec(opts.filters[0].formula)[1];
      const v = s.v.get(g);
      return v ? [{ ...v }] : [];
    },
    async importData(xml) {
      s.imports.push(xml);
      if (s.answer) return s.answer;
      const action = attr(xml, 'ACTION'), master = attr(xml, 'TAGVALUE');
      const v = byMaster(master);
      assert.ok(v, 'import targets a known master id');
      if (s.apply) {
        if (action === 'Alter') { v.ALTERID = String(Number(v.ALTERID) + 1); if (s.echoRemote) v.REMOTEID = attr(xml, 'REMOTEID'); v.VOUCHERNUMBER = tag(xml, 'VOUCHERNUMBER'); }
        if (action === 'Cancel') { v.ISCANCELLED = 'Yes'; v.ALTERID = String(Number(v.ALTERID) + 1); }
        if (action === 'Delete') s.v.delete(v.GUID);
        if (tag(xml, 'IRNREQUEST') === 'Cancel') { v.IRNCANCELLED = 'Yes'; v.ALTERID = String(Number(v.ALTERID) + 1); }
      }
      if (s.dropAnswer) return { ok: false, ambiguous: true, created: 0, altered: 0, ignored: 0, combined: 0, errors: 0, lastVchId: null, lastMId: null, lineErrors: [], statusDesc: null };
      return { ok: true, ambiguous: false, created: 0, altered: 1, ignored: 0, combined: 0, errors: 0, lastVchId: master, lastMId: null, lineErrors: [], statusDesc: null };
    },
  };
  return s;
}
const mk = (s, extra = {}) => {
  const changed = { n: 0 };
  const h = A.createAlterHandlers({ client: s.client, tables: () => clone(T), onChanged: () => { changed.n++; }, ...extra });
  return { ...h, changed };
};

(async () => {
  // 1. replace: shared example, Alter by master id, REMOTEID of the request, read back, device refresh
  {
    const s = fakeTally(); const m = mk(s);
    const r = await m.alter(ctx(alt));
    assert.equal(r.ok, true);
    assert.equal(r.alter_id, 80);
    assert.equal(r.voucher_number, 'S-002');
    assert.equal(r.guid, alt.data.target_voucher_guid);
    assert.equal(s.imports.length, 1);
    const x = s.imports[0];
    assert.equal(attr(x, 'ACTION'), 'Alter');
    assert.equal(attr(x, 'TAGNAME'), 'MASTER ID');
    assert.equal(attr(x, 'TAGVALUE'), '1025');
    assert.equal(attr(x, 'REMOTEID'), alt.client_request_id);
    assert.equal(m.changed.n, 1);
  }
  ok('replace (shared alter.valid): one Alter import by master id with the request id as REMOTEID, alter id moved, refresh requested');

  // 2. replace refusals: invalid replacement (TOTAL_MISMATCH like the shared example), unknown ref, type change, number clash, e-invoiced
  {
    const s = fakeTally(); const m = mk(s);
    const a = await m.alter(ctx(altBad));
    assert.deepEqual({ ok: a.ok, d: a.detail }, { ok: false, d: 'TOTAL_MISMATCH' });
    const b = await m.alter(ctx(withData(alt, { replacement: { ...clone(alt.data.replacement), party_ledger_guid: '00000000-0000-4000-8000-0000000000aa' } })));
    assert.equal(b.detail, 'LEDGER_NOT_FOUND');
    const other = T.tm_voucher_type.find((v) => v.base_kind === 'purchase' || v.name === 'Purchase');
    s.v.get(alt.data.target_voucher_guid).VOUCHERTYPENAME = 'Purchase';
    const c = await m.alter(ctx(alt));
    assert.equal(c.detail, 'VOUCHER_TYPE_MISMATCH');
    s.v.get(alt.data.target_voucher_guid).VOUCHERTYPENAME = 'Sales';
    const other2 = T.tx_voucher.find((v) => v.voucher_type_guid === alt.data.replacement.voucher_type_guid && v.guid !== alt.data.target_voucher_guid);
    const clash = withData(alt, { replacement: { ...clone(alt.data.replacement), number: other2.number } });
    const d = await m.alter(ctx(clash));
    assert.equal(d.detail, 'VOUCHER_NUMBER_EXISTS');
    s.v.get(alt.data.target_voucher_guid).IRN = 'x'.repeat(64);
    const e = await m.alter(ctx(alt));
    assert.equal(e.detail, 'EINVOICE_REJECTED');
    assert.equal(s.imports.length, 0);
    const f = await m.alter(ctx(withData(alt, { target_kind: undefined })));
    assert.equal(f.detail, 'PAYLOAD_INVALID');
    assert.ok(other === undefined || other);
  }
  ok('replace refusals send nothing: TOTAL_MISMATCH, LEDGER_NOT_FOUND, VOUCHER_TYPE_MISMATCH, VOUCHER_NUMBER_EXISTS, live e-invoice, missing target_kind');

  // 3. conflict and missing targets
  {
    const s = fakeTally(); const m = mk(s);
    s.v.get(alt.data.target_voucher_guid).ALTERID = '85';
    s.v.get(can.data.target_voucher_guid).ALTERID = '90';
    s.v.get(del.data.target_voucher_guid).ALTERID = '91';
    for (const [h, e] of [[m.alter, alt], [m.cancel, can], [m.delete, del]]) {
      const r = await h(ctx(e));
      assert.equal(r.detail, 'ALTER_CONFLICT');
      assert.equal(RS.ruleFor(r.detail).status, 'needs_review');
    }
    assert.equal(s.imports.length, 0);
    assert.equal(m.changed.n, 0);
    const s2 = fakeTally(); const m2 = mk(s2);
    for (const [h, e] of [[m2.cancel, canBad], [m2.delete, withData(del, { target_voucher_guid: 'not-a-voucher' })]]) {
      const r = await h(ctx(e));
      assert.equal(r.detail, 'TARGET_NOT_FOUND');
    }
    s2.v.delete(can.data.target_voucher_guid);
    assert.equal((await m2.cancel(ctx(can))).detail, 'TARGET_NOT_FOUND');
    assert.equal((await m2.alter(ctx(withData(alt, { target_voucher_guid: can.data.target_voucher_guid })))).detail, 'TARGET_NOT_FOUND');
    const bad = await m2.delete(ctx(delBad));
    assert.equal(bad.detail, 'PAYLOAD_INVALID');
    assert.equal(s2.imports.length, 0);
  }
  ok('ALTER_CONFLICT for replace, cancel and delete without touching Tally; TARGET_NOT_FOUND (shared cancel.invalid, absent in Tally); shared delete.invalid is PAYLOAD_INVALID');

  // 4. cancel and delete: shared examples
  {
    const s = fakeTally(); const m = mk(s);
    const c = await m.cancel(ctx(can));
    assert.equal(c.ok, true);
    assert.equal(c.alter_id, 78);
    assert.equal(c.message, 'Voucher cancelled in Tally.');
    assert.equal(attr(s.imports[0], 'ACTION'), 'Cancel');
    assert.equal(attr(s.imports[0], 'TAGVALUE'), '1023');
    assert.equal(tag(s.imports[0], 'NARRATION'), 'Cancelled: Wrong party');
    assert.equal(s.v.get(can.data.target_voucher_guid).ISCANCELLED, 'Yes');
    const d = await m.delete(ctx(del));
    assert.equal(d.ok, true);
    assert.equal(attr(s.imports[1], 'ACTION'), 'Delete');
    assert.equal(attr(s.imports[1], 'TAGVALUE'), '1022');
    assert.ok(!s.v.has(del.data.target_voucher_guid));
    assert.ok(!/REMOTEID/.test(s.imports[1]));
    assert.equal(m.changed.n, 2);
    // expected_alter_id is optional for cancel and delete
    const s2 = fakeTally(); const m2 = mk(s2);
    const noExp = clone(can); delete noExp.data.expected_alter_id; delete noExp.data.reason;
    assert.equal((await m2.cancel(ctx(noExp))).ok, true);
    assert.ok(!/<NARRATION>/.test(s2.imports[0]));
  }
  ok('cancel and delete (shared examples): Cancel / Delete by master id, narration carries the reason, state read back, alter id optional');

  // 5. idempotent retries
  {
    const s = fakeTally(); const m = mk(s);
    assert.equal((await m.alter(ctx(alt))).ok, true);
    const again = await m.alter(ctx(alt, { attempt: 2, recovered: true }));
    assert.equal(again.ok, true);
    assert.match(again.message, /Already changed/);
    assert.equal(s.imports.length, 1);
    assert.equal((await m.cancel(ctx(can))).ok, true);
    const c2 = await m.cancel(ctx(can, { attempt: 2 }));
    assert.equal(c2.ok, true);
    assert.match(c2.message, /Already cancelled/);
    assert.equal((await m.delete(ctx(del))).ok, true);
    assert.equal((await m.delete(ctx(del, { attempt: 2 }))).ok, true);
    assert.equal((await m.delete(ctx(del, { recovered: true }))).ok, true);
    assert.equal((await m.delete(ctx(del))).detail, 'TARGET_NOT_FOUND');
    assert.equal(s.imports.length, 3);
  }
  ok('retries and recovered rows: replace (REMOTEID seen), cancel (already cancelled) and delete (already gone) answer ok without a second import');

  // 6. Tally answers: refusal texts, accepted-but-unchanged, lost answer, failed read
  {
    const s = fakeTally(); s.answer = parseImportResult('<RESPONSE><LINEERROR>Voucher cannot be altered as it is locked by another user.</LINEERROR><ERRORS>1</ERRORS></RESPONSE>');
    const m = mk(s);
    const a = await m.cancel(ctx(can));
    assert.equal(a.detail, 'TARGET_NOT_FOUND');
    assert.match(a.tally_raw, /locked/);
    s.answer = parseImportResult('<RESPONSE><LINEERROR>Something odd happened</LINEERROR><ERRORS>1</ERRORS></RESPONSE>');
    const b = await m.delete(ctx(del));
    assert.equal(b.detail, 'UNKNOWN');
    assert.match(b.message, /Tally said: Something odd/);
    const s2 = fakeTally(); s2.apply = false; const m2 = mk(s2);
    for (const [h, e] of [[m2.alter, alt], [m2.cancel, can], [m2.delete, del]]) {
      const r = await h(ctx(e));
      assert.equal(r.detail, 'AMBIGUOUS_RESULT');
      assert.equal(RS.ruleFor(r.detail).status, 'needs_review');
    }
    assert.equal(m2.changed.n, 0);
    const s3 = fakeTally(); s3.dropAnswer = true; const m3 = mk(s3);
    assert.equal((await m3.alter(ctx(alt))).ok, true);
    assert.equal((await m3.cancel(ctx(can))).ok, true);
    assert.equal((await m3.delete(ctx(del))).ok, true);
    const s4 = fakeTally(); s4.failRead = true; const m4 = mk(s4);
    await assert.rejects(() => m4.cancel(ctx(can)), (e) => e.code === 'LB_TALLY_UNREACHABLE');
    assert.equal(s4.imports.length, 0);
    const s5 = fakeTally(); s5.echoRemote = false; const m5 = mk(s5);
    assert.equal((await m5.alter(ctx(alt))).ok, true);
  }
  ok('refusal texts map (known and unknown), accepted-but-unchanged is AMBIGUOUS_RESULT, a lost answer is settled by read-back, a failed read posts nothing, REMOTEID not echoed still confirms by alter id');

  // 7. delegation, guards, hygiene
  {
    const s = fakeTally(); const m = mk(s);
    s.v.get(alt.data.target_voucher_guid).IRN = 'z'.repeat(64);
    s.v.get(alt.data.target_voucher_guid).ALTERID = '79';
    const g = await m.alter(ctx(ex('alter.einvoice_cancel.valid')));
    assert.equal(g.ok, true); // delegated to Phase 29: IRN present, cancel works
    assert.match(g.message, /E-invoice cancelled/);
    s.v.get(can.data.target_voucher_guid).IRN = 'y'.repeat(64);
    assert.equal((await m.cancel(ctx(can))).detail, 'EINVOICE_REJECTED');
    assert.equal((await m.delete(ctx(withData(del, { target_voucher_guid: can.data.target_voucher_guid, expected_alter_id: 77 })))).detail, 'EINVOICE_REJECTED');
    const nv = A.createAlterHandlers({ client: s.client, tables: () => null });
    assert.equal((await nv.cancel(ctx(can))).detail, 'TALLY_UNREACHABLE');
    const slow = fakeTally(); const orig = slow.client.collection; let gate;
    slow.client.collection = (...a) => new Promise((res) => { gate = () => { slow.client.collection = orig; res(orig(...a)); }; });
    const ms = mk(slow); const p1 = ms.cancel(ctx(can));
    assert.equal((await ms.cancel(ctx(can))).detail, 'AMBIGUOUS_RESULT');
    gate(); assert.equal((await p1).ok, true);
    const src = fs.readFileSync('src/main/entries/alter.ts', 'utf8');
    const lg = src.match(/logger\.[a-z]+\([^;]*;/g).join('\n');
    assert.ok(!/guid|number|name/i.test(lg.replace(/requestId|error: \(e as Error\)\.message/g, '')), 'logs carry request ids only');
    assert.ok(!/[^\x00-\x7F]/.test(src), 'ASCII only');
    const idx = fs.readFileSync('src/main/index.ts', 'utf8');
    assert.ok(idx.includes('createAlterHandlers'));
  }
  ok('e-invoice actions are delegated to Phase 29, a live IRN blocks cancel and delete, no vault, in-flight guard, logs and wiring hygiene');
})().catch((e) => { console.error(e); process.exit(1); });
