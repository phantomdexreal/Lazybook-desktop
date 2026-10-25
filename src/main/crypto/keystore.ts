/*
LazyBooks | src/main/crypto/keystore.ts
Responsibility: Passphrase setup, key check value, salt storage, payload encoder
Introduced by: Phase 21 (encryption) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 21)
*/

/**
 * Owns the data key for this PC. The salt and KCV are public and live in `crypto.json` next to config.json
 * (SHARED_CONTRACTS section 7 names app_settings crypto_salt_b64 / crypto_kcv; the Supabase copy is written by the
 * sync phases from `publicParams()`). The passphrase is kept only in the secret store (safeStorage); the derived key
 * only in memory. Nothing here logs a passphrase or key.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { z } from 'zod';
import { LbError } from '../errors';
import { logger } from '../logger';
import type { PayloadEncoder } from '../postbox/chunker';
import { SYNC_DEFAULTS } from '../../shared/constants';
import { MIN_PASSPHRASE_LENGTH, computeKcv, deriveKeyAsync, encryptPayload, keyFromPassphrase, newSalt } from './envelope';
import { pairingQrSvg, pairingUri } from './pairing';

const ParamsSchema = z.object({ version: z.literal(1), saltB64: z.string().min(1), kcv: z.string().min(1), createdAt: z.string() });
export type CryptoParams = z.infer<typeof ParamsSchema>;

/** Secret store surface (src/main/secrets.ts satisfies it; tests inject a map). */
export interface PassphraseStore {
  get(): string | null;
  set(passphrase: string): void;
  clear(): void;
}

export interface KeystoreDeps {
  /** Folder for crypto.json (userData). */
  dir: string;
  passphrase: PassphraseStore;
  licenseKey: () => string | null;
  /** Feature flag e2e_encryption; false permits plaintext chunks (debugging only). Default true. */
  e2eEnabled?: () => boolean;
  gzip?: boolean;
  now?: () => number;
}

export type CryptoState = 'not-set-up' | 'ready' | 'locked';

export interface CryptoStatus {
  state: CryptoState;
  /** True when salt + KCV exist. */
  configured: boolean;
  createdAt: string | null;
  minLength: number;
}

export interface PairingInfo {
  licenseKey: string;
  saltB64: string;
  kcv: string;
  qrUri: string;
  qrSvg: string;
}

export type CryptoSetupResult = { ok: true; status: CryptoStatus } | { ok: false; code: string; message: string };

export function createKeystore(d: KeystoreDeps) {
  const file = join(d.dir, 'crypto.json');
  let params: CryptoParams | null = null;
  let key: Buffer | null = null;

  function load(): CryptoParams | null {
    if (params) return params;
    if (!existsSync(file)) return null;
    try {
      params = ParamsSchema.parse(JSON.parse(readFileSync(file, 'utf8')));
    } catch (e) {
      logger.error('app', 'crypto.json unreadable', { err: e });
      params = null;
    }
    return params;
  }

  function writeParams(p: CryptoParams): void {
    mkdirSync(dirname(file), { recursive: true });
    const tmp = file + '.tmp';
    writeFileSync(tmp, JSON.stringify(p, null, 2));
    renameSync(tmp, file);
    params = p;
  }

  function status(): CryptoStatus {
    const p = load();
    return { state: !p ? 'not-set-up' : key ? 'ready' : 'locked', configured: !!p, createdAt: p?.createdAt ?? null, minLength: MIN_PASSPHRASE_LENGTH };
  }

  /**
   * First-time setup. A new salt and KCV are made and the passphrase is stored. Setting up again REPLACES the
   * passphrase: every paired device must re-pair, so the caller (wizard) must have confirmed that with the user.
   */
  async function setup(passphrase: string): Promise<CryptoSetupResult> {
    if (typeof passphrase !== 'string' || passphrase.length < MIN_PASSPHRASE_LENGTH) {
      return { ok: false, code: 'BAD_PASSPHRASE', message: `Use at least ${MIN_PASSPHRASE_LENGTH} characters.` };
    }
    try {
      const salt = newSalt();
      const k = await deriveKeyAsync(passphrase, salt);
      const p: CryptoParams = { version: 1, saltB64: salt.toString('base64'), kcv: computeKcv(k), createdAt: new Date((d.now ?? Date.now)()).toISOString() };
      d.passphrase.set(passphrase); // fails (throws) when secure storage is unavailable; nothing is written then
      writeParams(p);
      key = k;
      logger.info('app', 'passphrase set up', {});
      return { ok: true, status: status() };
    } catch (e) {
      logger.error('app', 'setup failed', { err: e });
      return { ok: false, code: 'SETUP_FAILED', message: 'The passphrase could not be saved. Secure storage may be unavailable on this PC.' };
    }
  }

  /** Re-derive the key from the stored passphrase (app start). Leaves the state `locked` when it cannot. */
  async function unlock(): Promise<CryptoStatus> {
    const p = load();
    if (!p) return status();
    try {
      const pass = d.passphrase.get();
      if (pass) key = await keyFromPassphrase(pass, p.saltB64, p.kcv);
    } catch (e) {
      key = null;
      logger.warn('app', 'unlock failed', { err: e });
    }
    return status();
  }

  /** Check a typed passphrase against the stored KCV without changing anything. */
  async function verify(passphrase: string): Promise<boolean> {
    const p = load();
    if (!p) return false;
    try {
      await keyFromPassphrase(passphrase, p.saltB64, p.kcv);
      return true;
    } catch {
      return false;
    }
  }

  function reset(): void {
    key = null;
    params = null;
    d.passphrase.clear();
    try {
      renameSync(file, `${file}.removed-${(d.now ?? Date.now)()}`);
    } catch {
      /* nothing to move */
    }
    logger.info('app', 'passphrase removed', {});
  }

  /** Public values devices need: salt, KCV, license key, and the pairing link + QR (never the passphrase). */
  function pairing(): PairingInfo | null {
    const p = load();
    const lic = d.licenseKey();
    if (!p || !lic) return null;
    const qrUri = pairingUri(lic, p.saltB64, p.kcv);
    return { licenseKey: lic, saltB64: p.saltB64, kcv: p.kcv, qrUri, qrSvg: pairingQrSvg(qrUri) };
  }

  /** Public params for the Supabase app_settings rows `crypto_salt_b64` and `crypto_kcv` (written by the serve phases). */
  function publicParams(): { crypto_salt_b64: string; crypto_kcv: string } | null {
    const p = load();
    return p ? { crypto_salt_b64: p.saltB64, crypto_kcv: p.kcv } : null;
  }

  /**
   * The encoder the chunker takes (Phase 20 `PayloadEncoder`): plaintext payload in, `{enc, payload}` out.
   * Encrypted chunks use a random IV each. Throws when locked, so a chunk is never sent in plaintext by accident;
   * plaintext only when the e2e_encryption flag is explicitly off.
   */
  function encoder(): PayloadEncoder {
    return (payload) => {
      if (d.e2eEnabled && !d.e2eEnabled()) return { enc: false, payload };
      const lic = d.licenseKey();
      if (!lic) throw new LbError('NOT_CONFIGURED', 'No license is active, so data cannot be encrypted.');
      if (!key) throw new LbError('LB_CRYPTO_BAD_PASSPHRASE', 'Set up the data passphrase first (Settings, Security).');
      return { enc: true, payload: encryptPayload(key, lic, payload, { gzip: d.gzip ?? SYNC_DEFAULTS.gzipChunks }) };
    };
  }

  /** Raw key for the snapshot and chunk readers in later phases (memory only). */
  function getKey(): Buffer | null {
    return key;
  }

  return { status, setup, unlock, verify, reset, pairing, publicParams, encoder, getKey };
}

export type Keystore = ReturnType<typeof createKeystore>;
