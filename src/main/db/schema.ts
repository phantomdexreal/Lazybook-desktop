/*
LazyBooks | src/main/db/schema.ts
Responsibility: SQLite schema + migrations - CREATE TABLE / CREATE INDEX generated from data_model.json
Introduced by: Phase 15 (sqlite-schema)
STATUS: IMPLEMENTED (Phase 15)
Pure. Mirrors `ddl_sqlite` of docs/shared/fixtures/tools/lbmodel.py statement for statement (same names, same column order, WITHOUT ROWID).
*/

import { createHash } from 'node:crypto';
import type { ColumnType, DataModel, ModelTable } from './model';

const SQL_TYPE: Record<ColumnType, string> = {
  text: 'TEXT',
  int: 'INTEGER',
  decimal: 'INTEGER',
  date: 'TEXT',
  bool: 'INTEGER',
  json: 'TEXT',
};

const q = (s: string): string => `"${s.replace(/"/g, '""')}"`;

/** One CREATE TABLE statement plus its CREATE INDEX statements. */
export function tableStatements(name: string, t: ModelTable): string[] {
  const parts = t.columns.map((c) => `${q(c.name)} ${SQL_TYPE[c.type]}${c.nullable ? '' : ' NOT NULL'}`);
  parts.push(`PRIMARY KEY (${t.primary_key.map(q).join(', ')})`);
  const out = [`CREATE TABLE IF NOT EXISTS ${q(name)} (\n  ${parts.join(',\n  ')}\n) WITHOUT ROWID;`];
  for (const i of t.indexes) {
    out.push(
      `CREATE ${i.unique ? 'UNIQUE ' : ''}INDEX IF NOT EXISTS ${q(`${name}__${i.name}`)} ON ${q(name)} (${i.columns.map(q).join(', ')});`,
    );
  }
  return out;
}

/** Every statement of the vault schema, tables in `tables_order`. */
export function schemaStatements(model: DataModel): string[] {
  const out: string[] = [];
  for (const name of model.tables_order) {
    const t = model.tables[name];
    if (!t) throw new Error(`data model lists a missing table`);
    out.push(...tableStatements(name, t));
  }
  return out;
}

/** The same text as `ddl_sqlite`. */
export function schemaSql(model: DataModel): string {
  return schemaStatements(model).join('\n') + '\n';
}

/** Fingerprint of the generated schema; stored with the vault so a changed data model is noticed on open. */
export function schemaHash(model: DataModel): string {
  return createHash('sha256').update(schemaSql(model)).digest('hex');
}

/** Insert statement of a table (all columns, in order). `replace` = INSERT OR REPLACE (rows replace by primary key). */
export function insertSql(name: string, t: ModelTable, replace = true): string {
  return `INSERT ${replace ? 'OR REPLACE ' : ''}INTO ${q(name)} (${t.columns.map((c) => q(c.name)).join(', ')}) VALUES (${t.columns.map(() => '?').join(', ')})`;
}

export function selectAllSql(name: string, t: ModelTable): string {
  const order = t.primary_key.map(q).join(', ');
  return `SELECT ${t.columns.map((c) => q(c.name)).join(', ')} FROM ${q(name)} ORDER BY ${order}`;
}

export { q as quoteIdent };
