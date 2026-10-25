/*
LazyBooks | src/main/entries/builders/decimal.ts
Responsibility: exact decimal arithmetic for entry amounts (no floats)
Introduced by: Phase 25 (xml-builders)
STATUS: IMPLEMENTED (Phase 25)
*/

/** A decimal as an integer count of 10^-scale. Used only for payload amounts (strings with at most 4 decimals) and their products. */
export interface Dec {
  n: bigint;
  s: number;
}

const MONEY_RE = /^-?\d+(\.\d{1,4})?$/;

export function isMoney(v: unknown): v is string {
  return typeof v === 'string' && MONEY_RE.test(v);
}

export function dec(v: string | number | undefined | null): Dec {
  if (v === undefined || v === null || v === '') return { n: 0n, s: 0 };
  const t = String(v).trim();
  const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(t);
  if (!m) throw new Error('not a decimal');
  const frac = m[3] ?? '';
  const n = BigInt((m[2] ?? '0') + frac);
  return { n: m[1] === '-' ? -n : n, s: frac.length };
}

function pow10(k: number): bigint {
  return 10n ** BigInt(k);
}

function align(a: Dec, b: Dec): [bigint, bigint, number] {
  const s = Math.max(a.s, b.s);
  return [a.n * pow10(s - a.s), b.n * pow10(s - b.s), s];
}

export const add = (a: Dec, b: Dec): Dec => {
  const [x, y, s] = align(a, b);
  return { n: x + y, s };
};
export const sub = (a: Dec, b: Dec): Dec => {
  const [x, y, s] = align(a, b);
  return { n: x - y, s };
};
export const mul = (a: Dec, b: Dec): Dec => ({ n: a.n * b.n, s: a.s + b.s });
export const neg = (a: Dec): Dec => ({ n: -a.n, s: a.s });
export const cmp = (a: Dec, b: Dec): number => {
  const [x, y] = align(a, b);
  return x < y ? -1 : x > y ? 1 : 0;
};
export const eq = (a: Dec, b: Dec): boolean => cmp(a, b) === 0;
export const isZero = (a: Dec): boolean => a.n === 0n;
export const abs = (a: Dec): Dec => (a.n < 0n ? neg(a) : a);
export const ZERO: Dec = { n: 0n, s: 0 };

/** Divide by an integer constant exactly into `extra` more decimals (used for /100 and /2). */
export function divInt(a: Dec, d: bigint, extra: number): Dec {
  return { n: (a.n * pow10(extra)) / d, s: a.s + extra };
}

/** Round half away from zero to `places` decimals (CALC_SPECS section 10). */
export function round(a: Dec, places: number): Dec {
  if (a.s <= places) return { n: a.n * pow10(places - a.s), s: places };
  const f = pow10(a.s - places);
  const neg_ = a.n < 0n;
  const x = neg_ ? -a.n : a.n;
  let q = x / f;
  if ((x % f) * 2n >= f) q += 1n;
  return { n: neg_ ? -q : q, s: places };
}

/** Fixed places string, e.g. 83 -> "83.00". */
export function fixed(a: Dec, places: number): string {
  const r = round(a, places);
  const neg_ = r.n < 0n;
  let digits = (neg_ ? -r.n : r.n).toString();
  if (places > 0) {
    digits = digits.padStart(places + 1, '0');
    digits = digits.slice(0, digits.length - places) + '.' + digits.slice(digits.length - places);
  }
  return (neg_ && r.n !== 0n ? '-' : '') + digits;
}

/** Wire form (same as `canon` of the reference tools): at least 2, at most 4 decimals, trailing zeros beyond the 2nd removed. */
export function canon(a: Dec): string {
  let t = fixed(a, 4);
  while (t.endsWith('0') && /\.\d{3,}$/.test(t)) t = t.slice(0, -1);
  return t;
}

/** Quantity form: no trailing zeros, no trailing point ("20", "2.5"). */
export function qtyText(a: Dec): string {
  let t = fixed(a, 4);
  if (t.includes('.')) t = t.replace(/0+$/, '').replace(/\.$/, '');
  return t;
}

export const sum = (xs: Dec[]): Dec => xs.reduce(add, ZERO);

/** Exact x / 100 (moves the point, no rounding). */
export const div100 = (a: Dec): Dec => ({ n: a.n, s: a.s + 2 });
/** Exact x / 2 (one more decimal). */
export const half = (a: Dec): Dec => ({ n: a.n * 5n, s: a.s + 1 });
