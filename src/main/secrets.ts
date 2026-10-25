/*
LazyBooks | src/main/secrets.ts
Responsibility: Config + secure storage
Introduced by: Phase 3 (config-secrets) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 3)
*/

/**
 * Secret store: one encrypted blob (secrets.bin) holding a JSON map of named secrets.
 * Encryption is delegated to a backend (Electron safeStorage in production, injected in tests), so no
 * secret is ever written in plain text. If encryption is unavailable we refuse to store; there is no plain fallback.
 * Secret values are never logged; only secret names are.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from './logger';

export type SecretName = 'licenseKey' | 'connectorPassword' | 'passphrase' | 'connectorEmail' | 'session';

export interface SecretBackend {
  isAvailable(): boolean;
  encrypt(plain: string): Buffer;
  decrypt(blob: Buffer): string;
}

export class SecretsUnavailableError extends Error {
  constructor() {
    super('Secure storage is not available on this system; secrets cannot be saved.');
    this.name = 'SecretsUnavailableError';
  }
}

let dir = '';
let backend: SecretBackend | null = null;
let cache: Partial<Record<SecretName, string>> | null = null;

const file = (): string => join(dir, 'secrets.bin');

export function initSecrets(userDataDir: string, b: SecretBackend): void {
  dir = userDataDir;
  backend = b;
  cache = null;
  mkdirSync(dir, { recursive: true });
  logger.info('app', 'secure storage', { available: b.isAvailable() });
}

export function secretsAvailable(): boolean {
  return !!backend && backend.isAvailable();
}

function load(): Partial<Record<SecretName, string>> {
  if (cache) return cache;
  if (!backend || !backend.isAvailable()) throw new SecretsUnavailableError();
  if (!existsSync(file())) return (cache = {});
  try {
    cache = JSON.parse(backend.decrypt(readFileSync(file()))) as Partial<Record<SecretName, string>>;
  } catch (e) {
    // Undecryptable (different OS user or machine): keep the old file aside, start empty, user re-activates.
    const bad = `${file()}.unreadable-${Date.now()}`;
    try {
      renameSync(file(), bad);
    } catch {
      /* ignore */
    }
    logger.error('app', 'secrets unreadable, reset', { err: e });
    cache = {};
  }
  return cache;
}

function save(map: Partial<Record<SecretName, string>>): void {
  if (!backend || !backend.isAvailable()) throw new SecretsUnavailableError();
  const tmp = file() + '.tmp';
  writeFileSync(tmp, backend.encrypt(JSON.stringify(map)));
  renameSync(tmp, file());
  cache = map;
}

export function getSecret(name: SecretName): string | null {
  return load()[name] ?? null;
}

export function hasSecret(name: SecretName): boolean {
  return getSecret(name) !== null;
}

export function setSecret(name: SecretName, value: string): void {
  save({ ...load(), [name]: value });
  logger.info('app', 'secret stored', { name });
}

export function deleteSecret(name: SecretName): void {
  const map = { ...load() };
  if (!(name in map)) return;
  delete map[name];
  if (Object.keys(map).length === 0) {
    rmSync(file(), { force: true });
    cache = {};
  } else {
    save(map);
  }
  logger.info('app', 'secret deleted', { name });
}
