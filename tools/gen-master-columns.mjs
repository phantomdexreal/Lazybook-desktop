// LazyBooks | tools/gen-master-columns.mjs
// Generates src/main/tally/masters/columns.ts from docs/shared/data_model.json (master tables only), so the
// tag-to-column map is never retyped by hand. Run: node tools/gen-master-columns.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const model = JSON.parse(readFileSync(join(root, 'docs/shared/data_model.json'), 'utf8'));
const emit = (prefix, skipTable) => {
const tables = {};
for (const t of model.tables_order) {
  if (!t.startsWith(prefix) || t === skipTable) continue;
  const spec = model.tables[t];
  tables[t] = {
    request: spec.tally?.request ?? null,
    type: spec.tally?.type ?? null,
    object: spec.tally?.object ?? null,
    columns: spec.columns.map((c) => {
      const o = { n: c.name, t: c.type, d: c.default === undefined ? null : c.default };
      if (c.tally) o.tag = c.tally;
      if (c.hint) o.h = c.hint;
      return o;
    }),
  };
}
return tables;
};
const tables = emit('tm_', 'tm_company');
const txTables = emit('tx_', null);
const kinds = model.tables.ref_voucher_kind.seed_rows.filter((r) => r.tally_name).map((r) => [r.tally_name, r.kind]);
const body =
  `/*\nLazyBooks | src/main/tally/masters/columns.ts\nResponsibility: tag-to-column map of the master tables (GENERATED from docs/shared/data_model.json; do not edit by hand)\nIntroduced by: Phase 10 (tally-masters)\nSTATUS: IMPLEMENTED (Phase 10)\nRegenerate: node tools/gen-master-columns.mjs\n*/\n\n` +
  `export interface ColumnSpec {\n  /** column name */ n: string;\n  /** column type from data_model */ t: string;\n  /** default value */ d: string | number | boolean | null;\n  /** Tally tag (\`@NAME\` = attribute, \`A/B\` = nested) */ tag?: string;\n  /** parse hint */ h?: string;\n}\n` +
  `export interface MasterTableSpec {\n  request: string | null;\n  type: string | null;\n  object: string | null;\n  columns: ColumnSpec[];\n}\n\n` +
  `export const MASTER_TABLES: Record<string, MasterTableSpec> = ${JSON.stringify(tables, null, 1)};\n\n` +
  `/** ref_voucher_kind: [Tally reserved voucher type name, kind]; used for the parent walk of voucher types. */\nexport const VOUCHER_KIND_BY_TALLY_NAME: Array<[string, string]> = ${JSON.stringify(kinds)};\n`;
writeFileSync(join(root, 'src/main/tally/masters/columns.ts'), body);
console.log('wrote columns.ts for', Object.keys(tables).length, 'tables');

const txBody =
  `/*\nLazyBooks | src/main/tally/vouchers/columns.ts\nResponsibility: tag-to-column map of the voucher tables (GENERATED from docs/shared/data_model.json; do not edit by hand)\nIntroduced by: Phase 11 (tally-vouchers)\nSTATUS: IMPLEMENTED (Phase 11)\nRegenerate: node tools/gen-master-columns.mjs\n*/\n\n` +
  `import type { MasterTableSpec } from '../masters/columns';\n\n` +
  `export const VOUCHER_TABLES: Record<string, MasterTableSpec> = ${JSON.stringify(txTables, null, 1)};\n`;
mkdirSync(join(root, 'src/main/tally/vouchers'), { recursive: true });
writeFileSync(join(root, 'src/main/tally/vouchers/columns.ts'), txBody);
console.log('wrote vouchers/columns.ts for', Object.keys(txTables).length, 'tables');
