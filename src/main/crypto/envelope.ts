/*
LazyBooks | src/main/crypto/envelope.ts
Responsibility: Encryption (pure primitives)
Introduced by: Phase 21 (encryption) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 21)
*/

/**
 * Wire crypto shared with the PWA (SHARED_CONTRACTS section 7, SYNC_SPEC 3.3, crypto_vectors.json):
 * key = PBKDF2-HMAC-SHA256(passphrase, salt, 210000, 32); KCV = base64(HMAC-SHA256(key, "LB-KCV-v1")[0:8]);
 * envelope = {v:1, iv, ct, z?} with AES-256-GCM, 12-byte IV, AAD "lb1|" + license_key, ct = ciphertext || 16-byte tag.
 * No Electron and no I/O here. Keys and passphrases are never logged.
 */
import { createCipheriv, createDecipheriv, createHmac, pbkdf2, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';
import { gunzipSync, gzipSync } from 'node:zlib';
import { LbError } from '../errors';

export const CRYPTO = {
  iterations: 210000,
  saltBytes: 16,
  keyBytes: 32,
  ivBytes: 12,
  tagBytes: 16,
  aadPrefix: 'lb1|',
  kcvLabel: 'LB-KCV-v1',
  kcvBytes: 8,
  envelopeVersion: 1,
} as const;

/** Shortest passphrase the setup accepts (`assumed`: not fixed by the shared docs). */
export const MIN_PASSPHRASE_LENGTH = 8;

export interface Envelope {
  v: 1;
  iv: string;
  ct: string;
  z?: 1;
}

const b64 = (b: Buffer): string => b.toString('base64');

export function toB64Url(b: Buffer): string {
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromB64Url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

export function newSalt(): Buffer {
  return randomBytes(CRYPTO.saltBytes);
}

/** The passphrase is used exactly as typed (UTF-8, no trimming or normalisation), like the PWA. */
export function deriveKey(passphrase: string, salt: Buffer): Buffer {
  return pbkdf2Sync(Buffer.from(passphrase, 'utf8'), salt, CRYPTO.iterations, CRYPTO.keyBytes, 'sha256');
}

/** Same as deriveKey without blocking the main process for the ~100 ms the KDF takes. */
export function deriveKeyAsync(passphrase: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    pbkdf2(Buffer.from(passphrase, 'utf8'), salt, CRYPTO.iterations, CRYPTO.keyBytes, 'sha256', (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export function computeKcv(key: Buffer): string {
  return b64(createHmac('sha256', key).update(CRYPTO.kcvLabel, 'utf8').digest().subarray(0, CRYPTO.kcvBytes));
}

export function verifyKcv(key: Buffer, kcv: string): boolean {
  const a = Buffer.from(computeKcv(key), 'utf8');
  const b = Buffer.from(kcv, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

export interface EncryptOptions {
  /** gzip the plaintext first and set z:1 (SYNC_SPEC 3.3: when constants sync.gzip_chunks is true). */
  gzip?: boolean;
  /** Fixed IV for tests only. Real senders use a random IV per chunk; never reuse an IV with one key. */
  iv?: Buffer;
}

/** Encrypt raw plaintext bytes into an envelope. */
export function encryptBytes(key: Buffer, licenseKey: string, plain: Buffer, o: EncryptOptions = {}): Envelope {
  const iv = o.iv ?? randomBytes(CRYPTO.ivBytes);
  if (iv.length !== CRYPTO.ivBytes) throw new Error('IV must be 12 bytes');
  const body = o.gzip ? gzipSync(plain) : plain;
  const c = createCipheriv('aes-256-gcm', key, iv, { authTagLength: CRYPTO.tagBytes });
  c.setAAD(Buffer.from(CRYPTO.aadPrefix + licenseKey, 'utf8'));
  const ct = Buffer.concat([c.update(body), c.final(), c.getAuthTag()]);
  const env: Envelope = { v: CRYPTO.envelopeVersion, iv: b64(iv), ct: b64(ct) };
  if (o.gzip) env.z = 1;
  return env;
}

/** Encrypt a JSON-serialisable payload (compact JSON, UTF-8). */
export function encryptPayload(key: Buffer, licenseKey: string, payload: unknown, o: EncryptOptions = {}): Envelope {
  return encryptBytes(key, licenseKey, Buffer.from(JSON.stringify(payload), 'utf8'), o);
}

function isEnvelope(v: unknown): v is Envelope {
  const e = v as Partial<Envelope> | null;
  return !!e && typeof e === 'object' && e.v === CRYPTO.envelopeVersion && typeof e.iv === 'string' && typeof e.ct === 'string';
}

/** Decrypt an envelope to bytes. Throws LB_CRYPTO_DECRYPT_FAILED for a bad key, wrong license, damaged or unknown envelope. */
export function decryptBytes(key: Buffer, licenseKey: string, envelope: unknown): Buffer {
  const fail = (why: string): never => {
    throw new LbError('LB_CRYPTO_DECRYPT_FAILED', `Could not decrypt the data (${why}).`);
  };
  if (!isEnvelope(envelope)) return fail('unknown envelope');
  const iv = Buffer.from(envelope.iv, 'base64');
  const ct = Buffer.from(envelope.ct, 'base64');
  if (iv.length !== CRYPTO.ivBytes || ct.length < CRYPTO.tagBytes) return fail('malformed envelope');
  try {
    const d = createDecipheriv('aes-256-gcm', key, iv, { authTagLength: CRYPTO.tagBytes });
    d.setAAD(Buffer.from(CRYPTO.aadPrefix + licenseKey, 'utf8'));
    d.setAuthTag(ct.subarray(ct.length - CRYPTO.tagBytes));
    const plain = Buffer.concat([d.update(ct.subarray(0, ct.length - CRYPTO.tagBytes)), d.final()]);
    return envelope.z === 1 ? gunzipSync(plain) : plain;
  } catch {
    return fail('wrong key or damaged data');
  }
}

export function decryptPayload<T = unknown>(key: Buffer, licenseKey: string, envelope: unknown): T {
  const text = decryptBytes(key, licenseKey, envelope).toString('utf8');
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new LbError('LB_CRYPTO_DECRYPT_FAILED', 'Could not decrypt the data (not valid JSON).');
  }
}

/** Typed-passphrase check against the stored KCV, before anything is stored or applied. */
export async function keyFromPassphrase(passphrase: string, saltB64: string, kcv: string): Promise<Buffer> {
  const key = await deriveKeyAsync(passphrase, Buffer.from(saltB64, 'base64'));
  if (!verifyKcv(key, kcv)) throw new LbError('LB_CRYPTO_BAD_PASSPHRASE', 'That passphrase does not match the one set up for this license.');
  return key;
}
