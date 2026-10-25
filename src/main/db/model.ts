/*
LazyBooks | src/main/db/model.ts
Responsibility: SQLite schema + migrations - typed view of the shared data model
Introduced by: Phase 15 (sqlite-schema)
STATUS: IMPLEMENTED (Phase 15)
The single source of the vault schema is docs/shared/data_model.json (bundled at build time). Nothing here is hand-copied from it.
*/

import modelJson from '../../../docs/shared/data_model.json';

export type ColumnType = 'text' | 'int' | 'decimal' | 'date' | 'bool' | 'json';

export interface ModelColumn {
  name: string;
  type: ColumnType;
  nullable?: boolean;
  default?: unknown;
}

export interface ModelIndex {
  name: string;
  columns: string[];
  unique?: boolean;
}

export interface ModelTable {
  group: string;
  primary_key: string[];
  columns: ModelColumn[];
  indexes: ModelIndex[];
  /** `date_windowed` (tx_voucher), `follows_parent` (child tables), `full_refresh`, `static`, ... */
  scope?: string;
  parent?: { table: string; fk: Record<string, string> };
  children?: { table: string; fk: Record<string, string> }[];
  date_column?: string;
  seed_rows?: Record<string, unknown>[];
}

export interface DataModel {
  data_model_version: string | number;
  tables_order: string[];
  tables: Record<string, ModelTable>;
}

export const dataModel = modelJson as unknown as DataModel;
