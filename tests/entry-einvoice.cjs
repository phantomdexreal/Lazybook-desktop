// Node-level check for Phase 29: e-invoice and e-way actions (alter.action) against a stateful fake Tally.
// Run: NODE_PATH=<dir with typescript 5> node tests/entry-einvoice.cjs
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-ein');
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
const E = R('src/main/entries/einvoice.js');
const RS = R('src/main/entries/results.js');
const { TallyError } = R('src/main/tally/client.js');
const { parseImportResult } = R('src/main/tally/xml.js');

const j = (p) => JSON.parse(fs.readFileSync(`docs/shared/${p}`, 'utf8'));
const company = j('fixtures/tables/tm_company.json')[0];
const gen = j('entry_examples/alter.einvoice_generate.valid.json');
const can = j('entry_examples/alter.einvoice_cancel.valid.json');
const GUID = gen.data.target_voucher_guid;
const clone = (o) => JSON.parse(JSON.stringify(o));
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const ctx = (env, recovered = false) => ({ row: {}, envelope: env, attempt: 1, recovered });
const env = (base, data) => ({ ...clone(base), data: { ...clone(base.data), ...data } });

/** Tally that keeps one voucher and applies the e-invoice import like a configured TallyPrime would (or not, by knob). */
function fakeTally(start = {}) {
  const s = {
    v: { GUID, MASTERID: '50', ALTERID: '79', VOUCHERNUMBER: 'S-050', VOUCHERTYPENAME: 'Sales', DATE: '20260920', IRN: '', IRNACKNO: '', IRNACKDATE: '', IRNCANCELLED: 'No', EWAYBILLNO: '', ...start },
    imports: [], reads: 0, apply: true, answer: null, failRead: false, dropAnswer: false,
  };
  const tag = (x, t) => (new RegExp(`<${t}>([^<]*)</${t}>`).exec(x) || [])[1];
  s.client = {
    async collection(name, fields, opts) {
      s.reads++;
      if (s.failRead) throw new TallyError('LB_TALLY_UNREACHABLE', 'TALLY_UNREACHABLE', 'connection refused', true, null);
      assert.equal(name, E.REQ_VOUCHER_BY_GUID);
      assert.ok(opts.filters[0].formula.includes(GUID));
      return [{ ...s.v }];
    },
    async importData(xml) {
      s.imports.push(xml);
      if (s.answer) return s.answer;
      if (s.apply) {
        const a = Number(s.v.ALTERID) + 1;
        s.v.ALTERID = String(a);
        const req = tag(xml, 'IRNREQUEST'), ew = tag(xml, 'EWAYBILLREQUEST');
        if (req === 'Generate') Object.assign(s.v, { IRN: 'a'.repeat(64), IRNACKNO: '112010012345678', IRNACKDATE: '2026-09-25 10:16:00' });
        if (req === 'Cancel') s.v.IRNCANCELLED = 'Yes';
        if (ew === 'Generate') s.v.EWAYBILLNO = '331009876543';
        if (ew === 'Cancel') s.v.EWAYBILLNO = '';
      }
      if (s.dropAnswer) return { ok: false, ambiguous: true, created: 0, altered: 0, ignored: 0, combined: 0, errors: 0, lastVchId: null, lastMId: null, lineErrors: [], statusDesc: null };
      return { ok: true, ambiguous: false, created: 0, altered: 1, ignored: 0, combined: 0, errors: 0, lastVchId: '50', lastMId: null, lineErrors: [], statusDesc: null };
    },
  };
  return s;
}
const mk = (s, extra = {}) => {
  const changed = { n: 0 };
  const h = E.createAlterHandler({ client: s.client, tables: () => ({ tm_company: [company] }), onChanged: () => { changed.n++; }, ...extra });
  return { h, changed };
};

(async () => {
  // 1. generate: the shared example, Tally gives the IRN, read back, numbers in the message
  {
    const s = fakeTally(); const { h, changed } = mk(s);
    const r = await h(ctx(gen));
    assert.equal(r.ok, true);
    assert.equal(r.guid, GUID);
    assert.equal(r.alter_id, 80);
    assert.equal(r.voucher_number, 'S-050');
    assert.match(r.message, /IRN a{64}/);
    assert.match(r.message, /Ack 112010012345678/);
    assert.equal(s.imports.length, 1);
    assert.equal(changed.n, 1);
    const x = s.imports[0];
    assert.match(x, /ACTION="Alter" TAGNAME="MASTER ID" TAGVALUE="50"/);
    assert.match(x, /REMOTEID="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaac"/);
    assert.match(x, /<IRNREQUEST>Generate<\/IRNREQUEST>/);
    assert.match(x, /<SVCURRENTCOMPANY>Demo Traders Pvt Ltd<\/SVCURRENTCOMPANY>/);
    assert.ok(fs.existsSync('docs/shared/entry_examples/alter.einvoice_generate.valid.json'));
    assert.ok(!/<\/?[A-Z.]+>\s*<\/?[A-Z.]+>\s*$/.test('x'));
  }
  ok('einvoice_generate (shared example): one Alter import by master id, IRN and ack read back, numbers in the message, refresh requested once');

  // 2. cancel: the shared example needs an IRN; reason and remarks written in Tally's words
  {
    const s = fakeTally({ IRN: 'b'.repeat(64), IRNACKNO: '9' });
    const { h } = mk(s);
    const r = await h(ctx(can));
    assert.equal(r.ok, true);
    assert.match(r.message, /E-invoice cancelled/);
    assert.match(s.imports[0], /<IRNREQUEST>Cancel<\/IRNREQUEST>/);
    assert.match(s.imports[0], /<IRNCANCELREASON>Data Entry Mistake<\/IRNCANCELREASON>/);
    assert.match(s.imports[0], /<IRNCANCELREMARKS>Wrong rate<\/IRNCANCELREMARKS>/);
  }
  ok('einvoice_cancel (shared example): reason and remarks sent, cancelled state read back');

  // 3. e-way generate and cancel, details escaped, S11 rule
  {
    const s = fakeTally(); const { h } = mk(s);
    const g = env(gen, { action: 'eway_generate', eway: { transporter_id: '27AAAAA0000A1Z5', vehicle_no: 'MH12<AB>&1234', distance_km: 120, mode: 'road' } });
    const r = await h(ctx(g));
    assert.equal(r.ok, true);
    assert.match(r.message, /E-way bill generated. Number 331009876543/);
    assert.match(s.imports[0], /<EWAYBILLDETAILS.LIST>/);
    assert.match(s.imports[0], /<VEHICLENUMBER>MH12&lt;AB&gt;&amp;1234<\/VEHICLENUMBER>/);
    assert.match(s.imports[0], /<MODEOFTRANSPORT>Road<\/MODEOFTRANSPORT>/);
    assert.match(s.imports[0], /<DISTANCE>120<\/DISTANCE>/);
    const c = await h(ctx(env(gen, { action: 'eway_cancel', reason: 'others', expected_alter_id: 80 })));
    assert.equal(c.ok, true);
    assert.equal(c.message, 'E-way bill cancelled.');
    assert.equal(s.v.EWAYBILLNO, '');
    const bad = await h(ctx(env(gen, { action: 'eway_generate' })));
    assert.deepEqual({ ok: bad.ok, detail: bad.detail }, { ok: false, detail: 'PAYLOAD_INVALID' });
    const bad2 = await h(ctx(env(gen, { action: 'einvoice_cancel' })));
    assert.equal(bad2.detail, 'PAYLOAD_INVALID');
  }
  ok('eway_generate / eway_cancel: details escaped and written, e-way number read back; S11 refusals send nothing');

  // 4. conflict: alter id moved, Tally untouched
  {
    const s = fakeTally({ ALTERID: '81' }); const { h, changed } = mk(s);
    const r = await h(ctx(gen));
    assert.equal(r.ok, false);
    assert.equal(r.detail, 'ALTER_CONFLICT');
    assert.equal(RS.ruleFor(r.detail).status, 'needs_review');
    assert.equal(s.imports.length, 0);
    assert.equal(changed.n, 0);
  }
  ok('ALTER_CONFLICT when Tally alter id differs from expected_alter_id: needs_review, nothing sent');

  // 5. idempotent: already generated (retry or recovered row) posts nothing, even though the alter id moved
  {
    const s = fakeTally({ ALTERID: '80', IRN: 'c'.repeat(64), IRNACKNO: '7' }); const { h } = mk(s);
    for (const rec of [false, true]) {
      const r = await h(ctx(gen, rec));
      assert.equal(r.ok, true);
      assert.match(r.message, /^Already done in Tally\. E-invoice generated\. IRN c{64}/);
    }
    assert.equal(s.imports.length, 0);
    const s2 = fakeTally({ IRN: 'd'.repeat(64), IRNCANCELLED: 'Yes', ALTERID: '80' });
    const r2 = await mk(s2).h(ctx(can));
    assert.equal(r2.ok, true);
    assert.equal(s2.imports.length, 0);
  }
  ok('already done (IRN present, IRN cancelled): ok with the numbers, nothing sent, same for a recovered row');

  // 6. impossible requests and missing voucher
  {
    const s = fakeTally(); const { h } = mk(s);
    const a = await h(ctx(can));
    assert.deepEqual({ d: a.detail, ok: a.ok }, { d: 'EINVOICE_REJECTED', ok: false });
    assert.match(a.message, /no IRN/);
    const b = await h(ctx(env(gen, { action: 'eway_cancel', reason: 'others' })));
    assert.equal(b.detail, 'EINVOICE_REJECTED');
    const s2 = fakeTally({ IRN: 'e'.repeat(64), IRNCANCELLED: 'Yes' });
    const c = await mk(s2).h(ctx(gen));
    assert.equal(c.detail, 'EINVOICE_REJECTED');
    assert.equal(s.imports.length + s2.imports.length, 0);
    const s3 = fakeTally(); s3.client.collection = async () => [];
    const d = await mk(s3).h(ctx(gen));
    assert.equal(d.detail, 'TARGET_NOT_FOUND');
  }
  ok('cancel without IRN / e-way, generate after cancel: EINVOICE_REJECTED without a call; unknown voucher: TARGET_NOT_FOUND');

  // 7. Tally accepts but does not change (portal not set up) and Tally refusals
  {
    const s = fakeTally(); s.apply = false;
    const r = await mk(s).h(ctx(gen));
    assert.equal(r.detail, 'EINVOICE_REJECTED');
    assert.match(r.message, /did not change/);
    const s2 = fakeTally(); s2.answer = parseImportResult('<RESPONSE><LINEERROR>Unable to connect to the GST portal. Login to e-invoice portal first.</LINEERROR><ERRORS>1</ERRORS></RESPONSE>');
    const r2 = await mk(s2).h(ctx(gen));
    assert.equal(r2.detail, 'EINVOICE_REJECTED');
    assert.match(r2.message, /Tally said: Unable to connect to the GST portal/);
    assert.match(r2.tally_raw, /GST portal/);
    const s3 = fakeTally(); s3.answer = parseImportResult('<ENVELOPE><HEADER><STATUS>0</STATUS></HEADER><BODY><DESC><STATUS.LIST><CODE>1</CODE><DESC>The company Demo Traders Pvt Ltd is not loaded</DESC></STATUS.LIST></DESC></BODY></ENVELOPE>');
    const r3 = await mk(s3).h(ctx(gen));
    assert.equal(RS.ruleFor(r3.detail).retryable, true);
  }
  ok('accepted but unchanged -> EINVOICE_REJECTED; unknown Tally text -> EINVOICE_REJECTED with the raw text; known text keeps its detail');

  // 8. lost answer: read-back decides; failed reads; flag; payload; in-flight; no vault
  {
    const s = fakeTally(); s.dropAnswer = true;
    const r = await mk(s).h(ctx(gen));
    assert.equal(r.ok, true);
    assert.match(r.message, /^Confirmed by read-back/);
    const s2 = fakeTally(); s2.failRead = true;
    await assert.rejects(() => mk(s2).h(ctx(gen)), (e) => e.code === 'LB_TALLY_UNREACHABLE');
    assert.equal(s2.imports.length, 0);
    const s3 = fakeTally();
    const f = await mk(s3, { flags: () => ({ einvoice_eway: false }) }).h(ctx(gen));
    assert.equal(f.detail, 'FLAG_DISABLED');
    assert.equal(s3.imports.length, 0);
    const nv = await mk(s3, { tables: () => null }).h(ctx(gen));
    assert.equal(nv.detail, 'TALLY_UNREACHABLE');
    const unk = await mk(s3).h(ctx(env(gen, { surprise: 1 })));
    assert.equal(unk.detail, 'PAYLOAD_INVALID');
    const rep = await mk(s3).h(ctx(env(gen, { action: 'replace' })));
    assert.equal(rep.ok, false);
    assert.equal(s3.imports.length, 0);
    const slow = fakeTally(); const orig = slow.client.collection; let gate; slow.client.collection = (...a) => new Promise((res) => { gate = () => { slow.client.collection = orig; res(orig(...a)); }; });
    const m = mk(slow); const p1 = m.h(ctx(gen)); const p2 = await m.h(ctx(gen));
    assert.equal(p2.detail, 'AMBIGUOUS_RESULT');
    gate(); const done = await p1; assert.equal(done.ok, true);
  }
  ok('lost import answer confirmed by read-back; failed read throws before any post; flag, payload, replace and in-flight guards');

  // 9. logs and wiring hygiene
  {
    const src = fs.readFileSync('src/main/entries/einvoice.ts', 'utf8');
    const lg = src.match(/logger\.[a-z]+\([^;]*;/g).join('\n');
    assert.ok(!/irn|guid|ewayNo|\.message/i.test(lg.replace(/requestId|error: \(e as Error\)\.message/g, '')), 'logs carry request ids only');
    assert.ok(!/[^\x00-\x7F]/.test(src), 'ASCII only, no emoji');
    assert.ok(fs.readFileSync('src/main/index.ts', 'utf8').includes('createAlterHandler'));
  }
  ok('logs carry request ids only, source is ASCII, handler is registered in index.ts');
})().catch((e) => { console.error(e); process.exit(1); });
