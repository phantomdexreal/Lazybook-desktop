/*
LazyBooks | src/main/db/codec.ts
Responsibility: SQLite schema + migrations - value conversion between wire rows and stored rows
Introduced by: Phase 15 (sqlite-schema)
STATUS: IMPLEMENTED (Phase 15)
Pure, no I/O. Storage rules come from data_model.json conventions: decimal = INTEGER x 10^4, bool = 0|1, json = TEXT, date = ISO text or NULL.
Reads use SQLite 64-bit integers (bigint) so a large decimal never loses precision on its way back to the canonical string.
*/

import type { ColumnType, ModelColumn, ModelTable } from './model';

export type Row = Record<string, unknown>;
export type SqlValue = string | number | bigint | null;

const SCALE = 4;
const WIRE = /^(-?)(\d+)(?:\.(\d+))?$/;

/** Decimal wire string (or number) to integer minor units x 10^4, half away from zero beyond 4 decimals. Exact (BigInt). */
export function toMinor(v: unknown): bigint {
  const s = typeof v === 'number' ? numberToPlain(v) : String(v ?? '').trim();
  const m = WIRE.exec(s);
  if (!m) throw new Error(`Invalid decimal value`);
  const neg = m[1] === '-';
  const whole = m[2] ?? '0';
  const frac = m[3] ?? '';
  let n = BigInt(whole + frac.slice(0, SCALE).padEnd(SCALE, '0'));
  if (frac.length > SCALE && frac.charCodeAt(SCALE) >= 53) n += 1n; // next digit >= '5'
  return neg ? -n : n;
}

function numberToPlain(v: number): string {
  if (!Number.isFinite(v)) throw new Error('Invalid decimal value');
  const s = String(v);
  if (!/e/i.test(s)) return s;
  return v.toFixed(SCALE + 2);
}

/** Integer minor units to the canonical wire string: at least 2, at most 4 decimals, trailing zeros beyond the 2nd removed. */
export function fromMinor(n: bigint | number): string {
  let b = typeof n === 'bigint' ? n : BigInt(n);
  const neg = b < 0n;
  if (neg) b = -b;
  const digits = b.toString().padStart(SCALE + 1, '0');
  const whole = digits.slice(0, -SCALE);
  let frac = digits.slice(-SCALE);
  while (frac.length > 2 && frac.endsWith('0')) frac = frac.slice(0, -1);
  return `${neg && b !== 0n ? '-' : ''}${whole}.${frac}`;
}

/** Wire value to the value bound into SQLite. */
export function toSql(type: ColumnType, v: unknown, nullable: boolean): SqlValue {
  if (v === null || v === undefined) {
    if (nullable) return null;
    throw new Error('Null value in a column that does not allow null');
  }
  switch (type) {
    case 'decimal':
      return toMinor(v);
    case 'bool':
      return v === true || v === 1 || v === '1' || v === 'true' ? 1 : 0;
    case 'int': {
      const n = typeof v === 'bigint' ? v : BigInt(Math.trunc(Number(v)));
      return n;
    }
    case 'json':
      return typeof v === 'string' ? v : JSON.stringify(v);
    case 'date':
    case 'text':
      return String(v);
  }
}

/** Stored value back to the wire value. */
export function fromSql(type: ColumnType, v: unknown): unknown {
  if (v === null || v === undefined) return null;
  switch (type) {
    case 'decimal':
      return fromMinor(v as bigint | number);
    case 'bool':
      return Number(v) !== 0;
    case 'int':
      return Number(v);
    case 'json':
      return JSON.parse(String(v));
    case 'date':
    case 'text':
      return String(v);
  }
}

/** Column default for a missing key (data_model `default`). */
export function defaultFor(c: ModelColumn): unknown {
  return c.default === undefined ? null : c.default;
}

/** A wire row to the ordered parameter list of the table's INSERT (missing keys take the column default). */
export function rowToParams(table: ModelTable, row: Row): SqlValue[] {
  return table.columns.map((c) => {
    const v = Object.prototype.hasOwnProperty.call(row, c.name) ? row[c.name] : defaultFor(c);
    try {
      return toSql(c.type, v, c.nullable === true);
    } catch (e) {
      throw new Error(`column ${c.name}: ${(e as Error).message}`);
    }
  });
}

/** A stored row (object keyed by column, as read with safe integers) back to a wire row in column order. */
export function storedToRow(table: ModelTable, stored: Row): Row {
  const out: Row = {};
  for (const c of table.columns) out[c.name] = fromSql(c.type, stored[c.name]);
  return out;
}
