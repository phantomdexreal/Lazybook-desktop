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

const lineError = (msg) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<RESPONSE><LINEERROR>${msg}</LINEERROR></RESPONSE>`;

export function startMockTally(port = Number(process.env.LB_TALLY_PORT) || 9000) {
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
