// LazyBooks | tools/mock-tally/server.mjs
// Mock Tally HTTP server (TALLY_WIRE.md section 10). Serves docs/shared/fixtures/tally_xml/*.xml by request <ID>,
// answers voucher/master imports with a canned success, rejects everything else with a LINEERROR.
// Usage: node tools/mock-tally/server.mjs   (env LB_TALLY_PORT, default 9000)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(here, '..', '..', 'docs', 'shared', 'fixtures', 'tally_xml');

// Request id -> fixture file. LBVoucherGuids is assumed (TALLY_WIRE.md names the file but not the request id).
export const REQUEST_FIXTURES = {
  LBCompany: 'company.xml',
  LBCompanyNames: 'company.xml', // Phase 7 detection probe (assumed request id); the demo company is the only one loaded
  LBGroups: 'groups.xml',
  LBLedgers: 'ledgers.xml',
  LBVoucherTypes: 'voucher_types.xml',
  LBStockGroups: 'stock_groups.xml',
  LBStockCategories: 'stock_categories.xml',
  LBUnits: 'units.xml',
  LBGodowns: 'godowns.xml',
  LBStockItems: 'stock_items.xml',
  LBCostCentres: 'cost_centres.xml',
  LBCurrencies: 'currencies.xml',
  LBEmployees: 'employees.xml',
  LBTaxUnits: 'gst_registrations.xml',
  LBVouchers: 'vouchers.xml',
  LBVoucherGuids: 'voucher_guid_list.xml',
  // Phase 13 closing refresh (assumed request ids): same fixtures, the connector reads only the closing fields
  LBClosingGroups: 'groups.xml',
  LBClosingLedgers: 'ledgers.xml',
  LBClosingStock: 'stock_items.xml',
};

const IMPORT_OK =
  '<?xml version="1.0" encoding="UTF-8"?>\n<ENVELOPE><HEADER><VERSION>1</VERSION><STATUS>1</STATUS></HEADER>' +
  '<BODY><DATA><IMPORTRESULT><CREATED>1</CREATED><ALTERED>0</ALTERED><LASTVCHID>1</LASTVCHID><LASTMID>0</LASTMID>' +
  '<COMBINED>0</COMBINED><IGNORED>0</IGNORED><ERRORS>0</ERRORS></IMPORTRESULT></DATA></BODY></ENVELOPE>';

// Phase 7: answer to the product-info function call (assumed shape, TW-PRODINFO).
const PROD_INFO = process.env.LB_MOCK_TALLY_VERSION || 'TallyPrime Release 5.1 (mock)';
const prodInfoReply = () =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<RESPONSE>${PROD_INFO}</RESPONSE>`;

// Phase 9: serial number function (assumed shape, TW-LICENSEINFO).
const SERIAL = process.env.LB_MOCK_TALLY_SERIAL || '700012345';
const serialReply = () => `<?xml version="1.0" encoding="UTF-8"?>\n<RESPONSE>${SERIAL}</RESPONSE>`;

// Phase 44: paging support (voucher-batching.md section 3). A request that carries the paging filter `LBPageKeep` (formula
// `##LBPageNo > S AND ##LBPageNo <= E`) is answered with vouchers S+1..E of the vouchers that passed the date window and the
// `$AlterID > N` filter, in document order. `ignorePaging` (or env LB_MOCK_IGNORE_PAGING=1) answers every page with the whole list.
const ENVELOPE_HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n<ENVELOPE><HEADER><VERSION>1</VERSION><STATUS>1</STATUS></HEADER><BODY><DATA><COLLECTION>';
const ENVELOPE_TAIL = '</COLLECTION></DATA></BODY></ENVELOPE>';
const tag = (block, name) => new RegExp(`<${name}>([^<]*)</${name}>`).exec(block)?.[1] ?? '';

/** Split an export into its voucher blocks (document order). */
export function voucherBlocks(xml) {
  return xml.match(/<VOUCHER\b[^>]*>[\s\S]*?<\/VOUCHER>/g) ?? [];
}

/** `n` small generated vouchers: GUID `gen-<i>`, ALTERID `alterStart + i`, one per day from `startDate` (YYYYMMDD) cycling over `days` days. */
export function generateVouchers(n, { startDate = '20260401', days = 365, alterStart = 1 } = {}) {
  const base = Date.UTC(+startDate.slice(0, 4), +startDate.slice(4, 6) - 1, +startDate.slice(6, 8));
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const d = new Date(base + (i % days) * 86400000).toISOString().slice(0, 10).replace(/-/g, '');
    out.push(`<VOUCHER VCHTYPE="Journal" ACTION="Create"><GUID>gen-${i}</GUID><ALTERID>${alterStart + i}</ALTERID><MASTERID>${i + 1}</MASTERID><DATE>${d}</DATE><VOUCHERNUMBER>J-${i}</VOUCHERNUMBER></VOUCHER>`);
  }
  return out;
}

const lineError = (msg) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<RESPONSE><LINEERROR>${msg}</LINEERROR></RESPONSE>`;

function answerVouchers(body, id, all, opts) {
  body = body.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&'); // formulas arrive XML-escaped
  const win = { from: /<SVFROMDATE>(\d{8})</.exec(body)?.[1], to: /<SVTODATE>(\d{8})</.exec(body)?.[1] };
  const alter = /\$AlterID\s*>\s*(\d+)/.exec(body)?.[1];
  const page = /##LBPageNo\s*>\s*(\d+)\s+AND\s+##LBPageNo\s*<=\s*(\d+)/i.exec(body);
  let list = all.filter((b) => {
    const d = tag(b, 'DATE');
    if (win.from && d && d < win.from) return false;
    if (win.to && d && d > win.to) return false;
    if (alter !== undefined && !(Number(tag(b, 'ALTERID')) > Number(alter))) return false;
    return true;
  });
  const total = list.length;
  if (page && !opts.ignorePaging) list = list.slice(Number(page[1]), Number(page[2]));
  if (id === 'LBVoucherGuids') list = list.map((b) => `<VOUCHER><GUID>${tag(b, 'GUID')}</GUID><ALTERID>${tag(b, 'ALTERID')}</ALTERID></VOUCHER>`);
  return { xml: ENVELOPE_HEAD + list.join('') + ENVELOPE_TAIL, total, paged: Boolean(page) };
}

/**
 * opts.vouchers: array of voucher XML blocks served for LBVouchers and LBVoucherGuids (date window, AlterID filter and paging applied).
 * opts.ignorePaging: answer every paged request with the whole filtered list (a Tally that does not honour the filter).
 * opts.onRequest(id, body): called for every collection request (tests count and inspect them); it may return a Promise to delay the answer.
 * Without opts.vouchers, the fixture is served unchanged unless the request carries the paging filter.
 */
export function startMockTally(port = Number(process.env.LB_TALLY_PORT) || 9000, opts = {}) {
  opts = { ignorePaging: process.env.LB_MOCK_IGNORE_PAGING === '1', ...opts };
  const server = createServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', async () => {
      const body = Buffer.concat(chunks).toString('utf8');
      res.setHeader('Content-Type', 'text/xml; charset=utf-8');
      try {
        if (/<TALLYREQUEST>\s*Import Data\s*<\/TALLYREQUEST>/i.test(body)) {
          res.end(IMPORT_OK);
          return;
        }
        if (/<TYPE>\s*Function\s*<\/TYPE>/i.test(body) && /<ID>\s*\$\$ProdInfo/i.test(body)) {
          res.end(prodInfoReply());
          return;
        }
        if (/<TYPE>\s*Function\s*<\/TYPE>/i.test(body) && /<ID>\s*\$\$LicenseInfo:SerialNumber/i.test(body)) {
          res.end(serialReply());
          return;
        }
        const id = /<ID>\s*([^<\s]+)\s*<\/ID>/.exec(body)?.[1];
        const file = id ? REQUEST_FIXTURES[id] : undefined;
        if (!file) {
          res.end(lineError(`Unknown request ${id ?? '(none)'}`));
          return;
        }
        if (opts.onRequest) await opts.onRequest(id, body);
        if ((id === 'LBVouchers' || id === 'LBVoucherGuids') && (opts.vouchers || /LBPageKeep/.test(body))) {
          const all = opts.vouchers ?? voucherBlocks(await readFile(join(FIXTURES, 'vouchers.xml'), 'utf8'));
          res.end(answerVouchers(body, id, all, opts).xml);
          return;
        }
        res.end(await readFile(join(FIXTURES, file), 'utf8'));
      } catch (err) {
        res.statusCode = 500;
        res.end(lineError(String(err && err.message ? err.message : err)));
      }
    });
  });
  server.listen(port, '127.0.0.1', () => console.log(`[mock-tally] listening on 127.0.0.1:${port}`));
  return server;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) startMockTally();
