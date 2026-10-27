// LazyBooks | tools/gen-big-company.mjs | Phase 45
// Generates a big mock Tally company (many vouchers, each with two ledger lines) for batching, memory and resume tests.
// Library:  import { bigCompany, PRESETS } from './tools/gen-big-company.mjs';  const c = bigCompany(50000);  startMockTally(0, { vouchers: c.vouchers })
// CLI:      node tools/gen-big-company.mjs 50k [--serve [port]]    (presets: 50k, 200k, or any integer; --serve starts the mock Tally on it)
// No names of real people or companies anywhere: ledger names are fixed placeholders. Nothing here touches the network except --serve on localhost.
import { pathToFileURL } from 'node:url';

export const PRESETS = { '50k': 50_000, '200k': 200_000 };

/**
 * `count` vouchers, one per day cycling over `days` days from `startDate` (YYYYMMDD), GUID `gen-<i>`, AlterID `alterStart + i`,
 * each with a debit and a credit ledger line so child rows exist (the vault gets about 3 rows per voucher).
 */
export function bigCompany(count, { startDate = '20260401', days = 365, alterStart = 1 } = {}) {
  if (!Number.isInteger(count) || count < 0) throw new Error('count must be a non-negative integer');
  const base = Date.UTC(+startDate.slice(0, 4), +startDate.slice(4, 6) - 1, +startDate.slice(6, 8));
  const vouchers = new Array(count);
  for (let i = 0; i < count; i += 1) {
    const d = new Date(base + (i % days) * 86400000).toISOString().slice(0, 10).replace(/-/g, '');
    const amt = ((i % 997) + 1) * 10;
    vouchers[i] =
      `<VOUCHER VCHTYPE="Journal" ACTION="Create"><GUID>gen-${i}</GUID><ALTERID>${alterStart + i}</ALTERID><MASTERID>${i + 1}</MASTERID><DATE>${d}</DATE>` +
      `<VOUCHERNUMBER>J-${i}</VOUCHERNUMBER><NARRATION>generated ${i}</NARRATION>` +
      `<ALLLEDGERENTRIES.LIST><LEDGERNAME>Generated Debit</LEDGERNAME><ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE><AMOUNT>-${amt}.00</AMOUNT></ALLLEDGERENTRIES.LIST>` +
      `<ALLLEDGERENTRIES.LIST><LEDGERNAME>Generated Credit</LEDGERNAME><ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE><AMOUNT>${amt}.00</AMOUNT></ALLLEDGERENTRIES.LIST></VOUCHER>`;
  }
  const dateOf = (i) => new Date(base + (i % days) * 86400000).toISOString().slice(0, 10);
  return { count, vouchers, dateOf, firstDate: dateOf(0), lastDate: dateOf(Math.min(count, days) - 1) };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const arg = process.argv[2] ?? '50k';
  const n = PRESETS[arg] ?? Number(arg);
  if (!Number.isInteger(n) || n < 0) {
    console.error('usage: node tools/gen-big-company.mjs <50k|200k|N> [--serve [port]]');
    process.exit(2);
  }
  const c = bigCompany(n);
  console.log(`generated ${c.count} vouchers, dates ${c.firstDate} to ${c.lastDate}`);
  const i = process.argv.indexOf('--serve');
  if (i > 0) {
    const { startMockTally } = await import('./mock-tally/server.mjs');
    startMockTally(Number(process.argv[i + 1]) || 9000, { vouchers: c.vouchers });
  }
}
