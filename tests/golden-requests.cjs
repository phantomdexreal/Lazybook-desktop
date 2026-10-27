// Builds the map of existing Tally requests compared with tests/fixtures/xml/golden_requests.json (Phase 44 golden test).
const ts = require('typescript'); const fs = require('node:fs'); const path = require('node:path');
module.exports = function build(out) {
  for (const sub of ['src/main', 'src/main/tally', 'src/main/tally/masters', 'src/main/tally/vouchers', 'src/shared']) {
    fs.mkdirSync(path.join(out, sub), { recursive: true });
    for (const f of fs.readdirSync(sub).filter((n) => n.endsWith('.ts'))) {
      const js = ts.transpileModule(fs.readFileSync(path.join(sub, f), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
      fs.writeFileSync(path.join(out, sub, f.replace(/\.ts$/, '.js')), js);
    }
  }
  const X = require(path.join(out, 'src/main/tally/xml.js'));
  const M = require(path.join(out, 'src/main/tally/masters/index.js'));
  const V = require(path.join(out, 'src/main/tally/vouchers/index.js'));
  const Co = require(path.join(out, 'src/main/tally/company.js'));
  const g = {};
  for (const r of M.buildMasterRequests()) g['master:' + r.id] = X.buildCollectionRequest({ name: r.id, type: r.type, fields: r.fields, fetch: r.fetch, company: 'Demo Traders Pvt Ltd' });
  const v = V.buildVoucherRequest();
  const base = { name: v.id, type: v.type, fields: v.fields, fetch: v.fetch, company: 'Demo Traders Pvt Ltd', fromDate: '20260401', toDate: '20260430' };
  g['vouchers:window'] = X.buildCollectionRequest(base);
  g['vouchers:alter'] = X.buildCollectionRequest({ ...base, filters: [{ name: 'LBChanged', formula: '$AlterID > 1200' }] });
  g['vouchers:nowindow'] = X.buildCollectionRequest({ name: v.id, type: v.type, fields: v.fields, fetch: v.fetch });
  g['guids'] = X.buildCollectionRequest({ name: 'LBVoucherGuids', type: 'Voucher', fields: ['GUID', 'ALTERID'], company: 'Demo Traders Pvt Ltd', fromDate: '20260401', toDate: '20270331' });
  g['company'] = X.buildCollectionRequest({ name: Co.REQ_COMPANY, type: 'Company', fields: Co.COMPANY_FIELDS, fetch: Co.COMPANY_FETCH, company: 'Demo Traders Pvt Ltd' });
  g['function'] = X.buildFunctionRequest('$$ProdInfo');
  return g;
};
