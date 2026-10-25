// Node-level check for Phase 27: idempotency + duplicate guard against a stateful fake Tally (REMOTEID overwrite, lost answers, crashes).
// Run: NODE_PATH=<dir with typescript 5> node tests/entry-idempotency.cjs
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.join(__dirname, '.tmp-ei');
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
const I = R('src/main/entries/idempotency.js');
const { TallyError } = R('src/main/tally/client.js');

const j = (p) => JSON.parse(fs.readFileSync(`docs/shared/${p}`, 'utf8'));
const T = {};
for (const t of ['tm_company', 'tm_ledger', 'tm_group', 'tm_stock_item', 'tm_stock_item_gst', 'tm_unit', 'tm_godown', 'tm_voucher_type', 'tm_stock_group', 'tx_voucher']) T[t] = j(`fixtures/tables/${t}.json`);
const clone = (o) => JSON.parse(JSON.stringify(o));
let n = 0;
const ok = (m) => console.log(`ok ${++n} - ${m}`);
const unreachable = () => new TallyError('LB_TALLY_UNREACHABLE', 'TALLY_UNREACHABLE', 'connection refused', true, null);

/** A Tally that keeps state: vouchers and masters keyed by REMOTEID / name; same REMOTEID overwrites. */
function fakeTally() {
  const s = { vouchers: new Map(), masters: new Map(), imports: 0, reads: 0, nextId: 1000, echo: true, failRead: false, dropAnswer: false, crashBefore: false, reply: null };
  const attr = (xml, name) => (new RegExp(`${name}="([^"]*)"`).exec(xml) || [])[1];
  s.client = {
    async collection(name, fields, opts) {
      s.reads++;
      if (s.failRead) throw unreachable();
      const f = opts.filters[0].formula;
      const val = /"((?:[^"]|"")*)"/.exec(f)[1].replace(/""/g, '"');
      if (name === I.REQ_VOUCHER_BY_REMOTE) {
        const rows = [];
        for (const [rid, v] of s.vouchers) {
          const match = f.startsWith('$RemoteID') ? rid === val : v.masterId === val;
          if (match) rows.push({ GUID: [v.guid], MASTERID: [v.masterId], ALTERID: [String(v.alter)], VOUCHERNUMBER: [v.number], ...(s.echo ? { '@REMOTEID': rid } : {}) });
        }
        return rows;
      }
      return [...s.masters.values()].filter((m) => m.name.toLowerCase() === val.toLowerCase()).map((m) => ({ '@NAME': m.name, GUID: [m.guid] }));
    },
    async importData(xml) {
      s.imports++;
      if (s.crashBefore) throw unreachable();
      if (s.reply) return s.reply;
      const rid = attr(xml, 'REMOTEID');
      const isVoucher = xml.includes('<VOUCHER ');
      let created = 1;
      let id;
      if (isVoucher) {
        const prev = s.vouchers.get(rid);
        id = prev ? prev.masterId : String(s.nextId++);
        created = prev ? 0 : 1;
        s.vouchers.set(rid, { guid: `g-${id}`, masterId: id, number: /<VOUCHERNUMBER>([^<]*)/.exec(xml)?.[1] ?? '1', alter: (prev?.alter ?? 0) + 1 });
      } else {
        const name = attr(xml, 'NAME').replace(/&amp;/g, '&');
        id = String(s.nextId++);
        s.masters.set(name.toLowerCase(), { name, guid: `m-${id}` });
      }
      if (s.dropAnswer) throw unreachable(); // Tally applied it, the answer never arrived
      return { ok: true, ambiguous: false, created, altered: created ? 0 : 1, ignored: 0, combined: 0, errors: 0, lastVchId: id, lastMId: id, lineErrors: [], statusDesc: null };
    },
  };
  return s;
}

const mk = (s, tables = T, extra = {}) => I.createEntryHandlers({ client: s.client, tables: () => tables, ...extra });
const ctx = (file, recovered = false, mut) => {
  const p = j(`entry_examples/${file}`);
  if (mut) mut(p);
  return { row: {}, envelope: p, attempt: 1, recovered };
};

(async () => {
  // 1. normal post: pre-check (miss), post, read-back
  {
    const s = fakeTally();
    const h = mk(s);
    const r = await h.invoice(ctx('invoice.valid.json'));
    assert.equal(r.ok, true);
    assert.equal(s.imports, 1);
    assert.equal(s.vouchers.size, 1);
    assert.equal(r.guid, [...s.vouchers.values()][0].guid);
    assert.ok(s.reads >= 2, 'pre-check and read-back both read');
    // 2. the same entry again: found by the pre-check, no second post
    const again = await h.invoice(ctx('invoice.valid.json'));
    assert.equal(again.ok, true);
    assert.equal(again.guid, r.guid);
    assert.match(again.message, /DUPLICATE_CLIENT_REQUEST/);
    assert.equal(s.imports, 1);
    assert.equal(s.vouchers.size, 1);
  }
  ok('a post runs pre-check, import, read-back; the same client_request_id again is answered from Tally and posts nothing');

  // 3. kill mid-post: Tally applied the voucher but the answer was lost
  {
    const s = fakeTally();
    s.dropAnswer = true;
    const h = mk(s);
    await assert.rejects(() => h.invoice(ctx('invoice.valid.json')), (e) => e.code === 'LB_TALLY_UNREACHABLE');
    assert.equal(s.vouchers.size, 1, 'Tally has it');
    s.dropAnswer = false;
    const h2 = mk(s); // a fresh process: no memory of the first
    const r = await h2.invoice(ctx('invoice.valid.json', true));
    assert.equal(r.ok, true);
    assert.equal(s.imports, 1, 'not posted again');
    assert.equal(s.vouchers.size, 1);
  }
  ok('kill mid-post (applied, answer lost): the recovered retry finds the voucher, exactly one voucher in Tally, one import');

  // 4. crash before Tally applied it: the retry posts it
  {
    const s = fakeTally();
    s.crashBefore = true;
    const h = mk(s);
    await assert.rejects(() => h.invoice(ctx('invoice.valid.json')));
    assert.equal(s.vouchers.size, 0);
    s.crashBefore = false;
    const r = await h.invoice(ctx('invoice.valid.json', true));
    assert.equal(r.ok, true);
    assert.equal(s.vouchers.size, 1);
    assert.equal(s.imports, 2);
  }
  ok('crash before Tally applied it: the retry posts it, still exactly one voucher');

  // 5. a failed pre-check read never leads to a blind post
  {
    const s = fakeTally();
    s.failRead = true;
    const h = mk(s);
    await assert.rejects(() => h.payment(ctx('payment.valid.json')), (e) => e.code === 'LB_TALLY_UNREACHABLE');
    assert.equal(s.imports, 0);
  }
  ok('pre-check read fails: the entry is not posted (the listener retries or sends it to review)');

  // 6. results: refusal, unclear answer that did create, accepted but unreadable, REMOTEID not echoed
  {
    const s = fakeTally();
    s.reply = { ok: false, ambiguous: false, created: 0, altered: 0, ignored: 0, combined: 0, errors: 1, lastVchId: null, lastMId: null, lineErrors: ['Voucher number already exists'], statusDesc: null };
    const r = await mk(s, T, { mapMessage: (m) => (/already exists/i.test(m) ? 'VOUCHER_NUMBER_EXISTS' : null) }).invoice(ctx('invoice.valid.json'));
    assert.deepEqual([r.ok, r.detail], [false, 'VOUCHER_NUMBER_EXISTS']);
    assert.ok(r.tally_raw.includes('already exists'));
    const r2 = await mk(s).invoice(ctx('invoice.valid.json'));
    assert.equal(r2.detail, 'VOUCHER_NUMBER_EXISTS'); // Phase 28: the default is the entry_rules.json table (was UNKNOWN in Phase 27)
    s.reply = { ok: false, ambiguous: true, created: 0, altered: 0, ignored: 1, combined: 0, errors: 0, lastVchId: null, lastMId: null, lineErrors: [], statusDesc: null };
    assert.equal((await mk(s).invoice(ctx('invoice.valid.json'))).detail, 'AMBIGUOUS_RESULT');
    s.reply = { ok: false, ambiguous: false, created: 0, altered: 0, ignored: 0, combined: 0, errors: 0, lastVchId: null, lastMId: null, lineErrors: [], statusDesc: 'SVCurrentCompany not loaded' };
    assert.equal((await mk(s).invoice(ctx('invoice.valid.json'))).detail, 'TALLY_COMPANY_NOT_LOADED');
    // ambiguous answer that did create: confirmed by the late read
    const s2 = fakeTally();
    const real = s2.client.importData;
    s2.client.importData = async (x) => {
      await real(x);
      return { ok: false, ambiguous: true, created: 0, altered: 0, ignored: 0, combined: 1, errors: 0, lastVchId: null, lastMId: null, lineErrors: [], statusDesc: null };
    };
    const r3 = await mk(s2).invoice(ctx('invoice.valid.json'));
    assert.equal(r3.ok, true);
    assert.equal(s2.vouchers.size, 1);
    // accepted but nothing can be read back, REMOTEID not echoed and no master id
    const s3 = fakeTally();
    s3.echo = false;
    const real3 = s3.client.importData;
    s3.client.importData = async (x) => ({ ...(await real3(x)), lastVchId: null });
    assert.equal((await mk(s3).invoice(ctx('invoice.valid.json'))).detail, 'AMBIGUOUS_RESULT');
    // REMOTEID not echoed but a single created voucher: read back by master id
    const s4 = fakeTally();
    s4.echo = false;
    const r4 = await mk(s4).invoice(ctx('invoice.valid.json'));
    assert.equal(r4.ok, true);
    assert.ok(r4.guid.startsWith('g-'));
  }
  ok('refusal keeps the Tally text, unclear answers are read back first, unreadable accepted entries are AMBIGUOUS_RESULT, LASTVCHID fallback');

  // 7. refusals before Tally: build errors and the voucher number guard
  {
    const s = fakeTally();
    const h = mk(s);
    const bad = await h.invoice(ctx('invoice.invalid.json'));
    assert.equal(bad.ok, false);
    assert.ok(bad.detail && bad.detail !== 'UNKNOWN');
    const T2 = clone(T);
    const p = j('entry_examples/invoice.valid.json');
    const num = 'INV-GUARD-1';
    T2.tx_voucher.push({ guid: 'x', number: num, voucher_type_guid: p.data.voucher_type_guid, remote_id: 'someone-else' });
    const g = await mk(s, T2).invoice(ctx('invoice.valid.json', false, (e) => (e.data.number = num)));
    assert.equal(g.detail, 'VOUCHER_NUMBER_EXISTS');
    T2.tx_voucher[T2.tx_voucher.length - 1].remote_id = p.client_request_id; // the vault already knows our own voucher: not a clash
    assert.equal((await mk(s, T2).invoice(ctx('invoice.valid.json', false, (e) => (e.data.number = num)))).ok, true);
    assert.equal((await mk(s, null).invoice(ctx('invoice.valid.json'))).detail, 'TALLY_UNREACHABLE');
    assert.equal(s.vouchers.size, 1);
  }
  ok('invalid payload and a used voucher number are refused before Tally; own number in the vault is not a clash; no vault means retry later');

  // 8. masters
  {
    const s = fakeTally();
    const h = mk(s);
    const r = await h.ledger(ctx('ledger.valid.json'));
    assert.equal(r.ok, true);
    assert.ok(r.guid.startsWith('m-'));
    assert.equal(s.imports, 1);
    // duplicate in the vault: clear error, nothing sent
    const dup = await h.ledger(ctx('ledger.valid.json', false, (e) => (e.data.name = 'cash')));
    assert.deepEqual([dup.ok, dup.detail], [false, 'MASTER_EXISTS']);
    assert.match(dup.message, /already exists/);
    assert.equal(s.imports, 1);
    // duplicate only in Tally (stale vault): found by the pre-check
    const stale = await h.ledger(ctx('ledger.valid.json'));
    assert.equal(stale.detail, 'MASTER_EXISTS');
    assert.equal(s.imports, 1);
    // the same entry recovered after a crash that did create it: ok, no second post
    const rec = await h.ledger(ctx('ledger.valid.json', true));
    assert.equal(rec.ok, true);
    assert.equal(rec.guid, r.guid);
    assert.equal(s.imports, 1);
    // kill mid-post for a master
    const s2 = fakeTally();
    s2.dropAnswer = true;
    await assert.rejects(() => mk(s2).stock_item(ctx('stock_item.valid.json')));
    s2.dropAnswer = false;
    const r2 = await mk(s2).stock_item(ctx('stock_item.valid.json', true));
    assert.equal(r2.ok, true);
    assert.equal(s2.masters.size, 1);
    assert.equal(s2.imports, 1);
    // Tally itself says the name exists
    const s3 = fakeTally();
    s3.reply = { ok: false, ambiguous: false, created: 0, altered: 0, ignored: 0, combined: 0, errors: 1, lastVchId: null, lastMId: null, lineErrors: ['Ledger Delta Traders already exists'], statusDesc: null };
    assert.equal((await mk(s3).ledger(ctx('ledger.valid.json'))).detail, 'MASTER_EXISTS');
  }
  ok('masters: created and read back; duplicate name (vault or Tally) is MASTER_EXISTS with no post; recovered own master is ok; kill mid-post gives one master');

  // 9. single flight per request id
  {
    const s = fakeTally();
    const real = s.client.importData;
    let release;
    const gate = new Promise((r) => (release = r));
    s.client.importData = async (x) => {
      await gate;
      return real(x);
    };
    const h = mk(s);
    const a = h.invoice(ctx('invoice.valid.json'));
    await new Promise((r) => setTimeout(r, 20));
    const b = await h.invoice(ctx('invoice.valid.json'));
    assert.equal(b.detail, 'AMBIGUOUS_RESULT');
    release();
    assert.equal((await a).ok, true);
    assert.equal(s.vouchers.size, 1);
  }
  ok('the same request id never runs twice at once in the process');

  // 10. every voucher example posts through the handler table
  {
    const s = fakeTally();
    const h = mk(s, T, {});
    for (const k of ['invoice', 'receipt', 'payment', 'contra', 'journal', 'inventory_voucher', 'order', 'quotation', 'ledger', 'stock_item']) assert.equal(typeof h[k], 'function', k);
    for (const k of ['alter', 'cancel', 'delete']) assert.equal(h[k], undefined, k);
    const hq = mk(s, T, { quotationVoucherTypeGuid: () => T.tm_voucher_type.find((v) => v.name === 'Sales Quotation').guid });
    const files = fs.readdirSync('docs/shared/entry_examples').filter((f) => f.endsWith('.valid.json') && !/^(alter|cancel|delete)/.test(f));
    for (const f of files) {
      const c = ctx(f);
      const r = await hq[c.envelope.kind](c);
      assert.equal(r.ok, true, `${f}: ${JSON.stringify(r)}`);
    }
    assert.equal(s.vouchers.size + s.masters.size, files.length);
  }
  ok('handlers exist for the 10 kinds (alter, cancel, delete are Phase 30) and every valid shared example posts once');

  console.log(`\nentry-idempotency: ${n} checks passed`);
  fs.rmSync(out, { recursive: true, force: true });
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
