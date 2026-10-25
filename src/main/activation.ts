/*
LazyBooks | src/main/activation.ts
Responsibility: Activation + connector login (orchestration: license -> target -> login -> bootstrap loop)
Introduced by: Phase 5 (activation)
STATUS: IMPLEMENTED (Phase 5)
*/

/**
 * Implements SHARED_CONTRACTS section 2 for the desktop connector and the section 3.1 bootstrap loop (start + every 30 min).
 * Everything the module touches is injected (config, secrets, fetch, clock), so it runs under plain Node tests.
 * Offline never blocks: the last cached bootstrap is used. Renderer-facing state never carries secrets.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { BOOTSTRAP_INTERVAL_MS, CONTRACT_SUPPORTED } from '../shared/constants';
import type { ActivationResult, ActivationState, ActivationStage, BlockingState } from '../shared/ipc';
import type { ConfigPatch } from './config';
import { isAllowedBaseUrl, LbError, trimSlash } from './errors';
import { logger } from './logger';
import { appBootstrap, getThemes, isValidLicenseKey, normalizeLicenseKey, resolveLicense, type BootstrapResult, type RegistryOptions } from './registry';
import type { SecretName } from './secrets';
import { assertConnectorClaims, sessionNeedsRefresh, TargetClient, type Session } from './supabase';

export interface ActivationDeps {
  userDataDir: string;
  /** null when this build has no master registry address configured */
  master: { url: string; anonKey: string } | null;
  appVersion: string;
  platform: string;
  secrets: {
    available(): boolean;
    get(n: SecretName): string | null;
    set(n: SecretName, v: string): void;
    delete(n: SecretName): void;
  };
  config: {
    get(): { deviceId: string | null; target: { url: string; anonKey: string } | null };
    update(patch: ConfigPatch): void;
  };
  emit(state: ActivationState): void;
  fetchFn?: typeof fetch;
  now?: () => number;
}

interface CacheFile {
  at: string;
  resolved: { companyName: string; expiresAt: string | null } | null;
  result: BootstrapResult | null;
  themeVersions: Record<string, number>;
}

const THEME_SLUG_RE = /^[a-z0-9][a-z0-9-]{0,39}$/;
const MAX_THEME_BYTES = 100 * 1024;
const LICENSE_BLOCK_CODES = new Set(['LB_LICENSE_EXPIRED', 'LB_LICENSE_INACTIVE', 'LB_LICENSE_NOT_FOUND', 'LB_NO_PROJECT']);

export function maskLicenseKey(k: string): string {
  const g = k.split('-');
  return g.length === 5 ? `${g[0]}-${g[1]}-****-****-${g[4]}` : '****';
}

export function deriveBlocking(r: BootstrapResult | null): BlockingState | null {
  if (!r) return null;
  if (r.config.maintenance.on) {
    return { code: 'LB_MAINTENANCE', message: r.config.maintenance.message || 'LazyBooks is under maintenance. Please try again shortly.' };
  }
  if (Number(r.config.contract_version) > CONTRACT_SUPPORTED) {
    return { code: 'LB_CONTRACT_TOO_OLD', message: 'This version of LazyBooks is too old to talk to your service. Please update the app.' };
  }
  if (r.update?.must_update) {
    return { code: 'LB_UPDATE_REQUIRED', message: `LazyBooks ${r.update.latest} is required. Please update the app.` };
  }
  return null;
}

export function createActivation(d: ActivationDeps) {
  const now = d.now ?? Date.now;
  const cacheFile = join(d.userDataDir, 'bootstrap.json');
  const themesDir = join(d.userDataDir, 'themes');

  let cache: CacheFile | null = null;
  let licenseBlock: BlockingState | null = null;
  let deviceBlock: BlockingState | null = null;
  let offline = false;
  let timer: NodeJS.Timeout | null = null;
  let bootstrapping: Promise<void> | null = null;
  let refreshing: Promise<Session> | null = null;

  const reg = (): RegistryOptions => {
    if (!d.master) throw new LbError('NOT_CONFIGURED', 'This build has no registry address configured.');
    return { url: d.master.url, anonKey: d.master.anonKey, fetchFn: d.fetchFn };
  };

  function readCache(): void {
    try {
      if (existsSync(cacheFile)) cache = JSON.parse(readFileSync(cacheFile, 'utf8')) as CacheFile;
    } catch (e) {
      logger.warn('app', 'bootstrap cache unreadable, ignored', { err: e });
      cache = null;
    }
  }

  function writeCache(): void {
    if (!cache) return;
    mkdirSync(d.userDataDir, { recursive: true });
    const tmp = `${cacheFile}.tmp`;
    writeFileSync(tmp, JSON.stringify(cache));
    renameSync(tmp, cacheFile);
  }

  function safeGet(n: SecretName): string | null {
    try {
      return d.secrets.get(n);
    } catch {
      return null;
    }
  }

  function loadSession(): Session | null {
    const raw = safeGet('session');
    if (!raw) return null;
    try {
      const s = JSON.parse(raw) as Session;
      return typeof s.accessToken === 'string' && typeof s.refreshToken === 'string' && typeof s.expiresAt === 'number' ? s : null;
    } catch {
      return null;
    }
  }

  function stage(): ActivationStage {
    if (!safeGet('licenseKey') || !d.config.get().target) return 'needs-license';
    return loadSession() ? 'active' : 'needs-login';
  }

  function state(): ActivationState {
    const lic = safeGet('licenseKey');
    const st = stage();
    return {
      stage: st,
      companyName: cache?.result?.license.company_name ?? cache?.resolved?.companyName ?? null,
      licenseKeyMasked: lic ? maskLicenseKey(lic) : null,
      email: safeGet('connectorEmail'),
      expiresAt: cache?.result?.license.expires_at ?? cache?.resolved?.expiresAt ?? null,
      blocking: st === 'needs-license' ? null : (licenseBlock ?? deviceBlock ?? deriveBlocking(cache?.result ?? null)),
      offline,
      lastBootstrapAt: cache?.result ? cache.at : null,
      secureStorage: d.secrets.available(),
      masterConfigured: d.master !== null,
    };
  }

  const publish = (): ActivationState => {
    const s = state();
    d.emit(s);
    return s;
  };

  function fail(e: unknown): ActivationResult {
    if (e instanceof LbError) return { ok: false, code: e.code, message: e.message };
    logger.error('app', 'activation failed unexpectedly', { err: e });
    return { ok: false, code: 'BAD_RESPONSE', message: 'Something went wrong. Please try again.' };
  }

  function clearLogin(): void {
    for (const n of ['connectorEmail', 'connectorPassword', 'session'] as const) d.secrets.delete(n);
  }

  async function syncThemes(r: BootstrapResult): Promise<void> {
    if (!cache) return;
    const lic = safeGet('licenseKey');
    if (!lic) return;
    const wanted = r.themes.filter(
      (t) => THEME_SLUG_RE.test(t.slug) && (!existsSync(join(themesDir, `${t.slug}.json`)) || t.version > (cache?.themeVersions[t.slug] ?? 0)),
    );
    if (wanted.length === 0) return;
    const remote = await getThemes(reg(), lic);
    mkdirSync(themesDir, { recursive: true });
    for (const t of remote) {
      if (!wanted.some((w) => w.slug === t.slug)) continue;
      const text = JSON.stringify(t.json);
      if (!t.json || typeof t.json !== 'object' || text.length > MAX_THEME_BYTES) {
        logger.warn('app', 'remote theme skipped', { slug: t.slug });
        continue;
      }
      const target = join(themesDir, `${t.slug}.json`);
      writeFileSync(`${target}.tmp`, text);
      renameSync(`${target}.tmp`, target);
      cache.themeVersions[t.slug] = t.version;
      logger.info('app', 'theme stored', { slug: t.slug, version: t.version });
    }
    writeCache();
  }

  async function runBootstrap(): Promise<void> {
    const lic = safeGet('licenseKey');
    const deviceId = d.config.get().deviceId;
    if (!lic || !deviceId || !d.master) return;
    try {
      const r = await appBootstrap(reg(), { licenseKey: lic, appVersion: d.appVersion, deviceId, platform: d.platform });
      offline = false;
      licenseBlock = null;
      cache = { at: new Date(now()).toISOString(), resolved: cache?.resolved ?? null, result: r, themeVersions: cache?.themeVersions ?? {} };
      writeCache();
      const cur = d.config.get().target;
      if (r.target.url && r.target.anon_key && isAllowedBaseUrl(r.target.url) && (cur?.url !== trimSlash(r.target.url) || cur?.anonKey !== r.target.anon_key)) {
        d.config.update({ target: { url: trimSlash(r.target.url), anonKey: r.target.anon_key } });
        logger.info('app', 'target project changed by registry');
      }
      logger.info('app', 'bootstrap ok', { update: r.update?.update_available ?? false, maintenance: r.config.maintenance.on });
      try {
        await syncThemes(r);
      } catch (e) {
        logger.warn('app', 'theme sync failed', { err: e });
      }
    } catch (e) {
      if (e instanceof LbError && e.code === 'NETWORK') {
        offline = true;
        logger.warn('app', 'bootstrap offline, using cache', { haveCache: cache?.result != null });
      } else if (e instanceof LbError && LICENSE_BLOCK_CODES.has(e.code)) {
        licenseBlock = { code: e.code, message: e.message };
        logger.warn('app', 'bootstrap blocked by license', { code: e.code });
      } else {
        logger.warn('app', 'bootstrap failed', { err: e });
      }
    }
    publish();
  }

  function bootstrapNow(): Promise<void> {
    bootstrapping ??= runBootstrap().finally(() => {
      bootstrapping = null;
    });
    return bootstrapping;
  }

  function ensureTimer(): void {
    if (timer) return;
    timer = setInterval(() => {
      if (stage() !== 'needs-license') void bootstrapNow();
    }, BOOTSTRAP_INTERVAL_MS);
    timer.unref();
  }

  function target(): TargetClient {
    const t = d.config.get().target;
    if (!t) throw new LbError('NOT_CONFIGURED', 'Enter the license key first.');
    return new TargetClient({ url: t.url, anonKey: t.anonKey, fetchFn: d.fetchFn, now });
  }

  function persistSession(s: Session): void {
    d.secrets.set('session', JSON.stringify(s));
  }

  return {
    init(): void {
      readCache();
    },

    state,

    /** Device module reports revoked / over-limit here; null clears it. Shown through the normal blocking screen. */
    setDeviceBlock(b: BlockingState | null): void {
      if (deviceBlock?.code === b?.code) return;
      deviceBlock = b;
      publish();
    },

    /** Client for the activated customer project (null before step 3). */
    targetClient(): TargetClient | null {
      return d.config.get().target ? target() : null;
    },

    /** Start the 30-minute bootstrap loop and run one now (no-op until a license is stored). */
    start(): void {
      ensureTimer();
      if (stage() !== 'needs-license') void bootstrapNow();
    },

    stop(): void {
      if (timer) clearInterval(timer);
      timer = null;
    },

    bootstrapNow,

    /** Cached bootstrap (flags, update info, branding, announcements); null before the first success. */
    getBootstrap(): BootstrapResult | null {
      return cache?.result ?? null;
    },

    /** Steps 1-3: validate the key against the master registry and store the target. */
    async resolve(rawKey: string): Promise<ActivationResult> {
      try {
        if (!d.secrets.available()) throw new LbError('NOT_CONFIGURED', 'Secure storage is not available on this system, so a license cannot be saved.');
        const key = normalizeLicenseKey(rawKey);
        if (!isValidLicenseKey(key)) throw new LbError('LB_LICENSE_NOT_FOUND', 'That does not look like a license key. It starts with LB- followed by four groups of four characters.');
        const r = await resolveLicense(reg(), key);
        const previous = safeGet('licenseKey');
        if (previous && previous !== key) {
          clearLogin();
          cache = null;
          rmSync(cacheFile, { force: true });
        }
        d.secrets.set('licenseKey', key);
        d.config.update({ target: { url: r.projectUrl, anonKey: r.projectAnonKey }, ...(d.config.get().deviceId ? {} : { deviceId: randomUUID() }) });
        cache = { at: new Date(now()).toISOString(), resolved: { companyName: r.companyName, expiresAt: r.expiresAt }, result: cache?.result ?? null, themeVersions: cache?.themeVersions ?? {} };
        writeCache();
        licenseBlock = null;
        logger.info('app', 'license resolved', { company: r.companyName });
        return { ok: true, state: publish() };
      } catch (e) {
        return fail(e);
      }
    },

    /** Steps 4-5: connector sign-in, claim check, then bootstrap. Device row upsert is Phase 6. */
    async login(email: string, password: string): Promise<ActivationResult> {
      try {
        const lic = safeGet('licenseKey');
        if (!lic) throw new LbError('NOT_CONFIGURED', 'Enter the license key first.');
        const em = email.trim();
        if (!em || !password) throw new LbError('LB_AUTH_FAILED', 'Enter the connector email and password.');
        const r = await target().signIn(em, password);
        assertConnectorClaims(r.appMetadata, lic);
        d.secrets.set('connectorEmail', em);
        d.secrets.set('connectorPassword', password);
        persistSession(r.session);
        logger.info('app', 'connector signed in');
        ensureTimer();
        publish();
        await bootstrapNow();
        return { ok: true, state: state() };
      } catch (e) {
        if (e instanceof LbError && e.code === 'LB_AUTH_FAILED') logger.warn('app', 'connector sign-in refused', { reason: e.message });
        return fail(e);
      }
    },

    /** Valid access token for later phases; refreshes, then falls back to the stored password. */
    async getAccessToken(): Promise<string> {
      const s = loadSession();
      if (!s) throw new LbError('LB_AUTH_FAILED', 'The connector is signed out.');
      if (!sessionNeedsRefresh(s, now())) return s.accessToken;
      refreshing ??= (async () => {
        const lic = safeGet('licenseKey') ?? '';
        const client = target();
        try {
          let r;
          try {
            r = await client.refresh(s.refreshToken);
          } catch (e) {
            if (!(e instanceof LbError) || e.code !== 'LB_AUTH_FAILED') throw e;
            const em = safeGet('connectorEmail');
            const pw = safeGet('connectorPassword');
            if (!em || !pw) throw e;
            r = await client.signIn(em, pw);
          }
          assertConnectorClaims(r.appMetadata, lic);
          persistSession(r.session);
          return r.session;
        } catch (e) {
          if (e instanceof LbError && e.code === 'LB_AUTH_FAILED') {
            d.secrets.delete('session');
            logger.warn('app', 'connector session lost, login required');
            publish();
          }
          throw e;
        }
      })().finally(() => {
        refreshing = null;
      });
      return (await refreshing).accessToken;
    },

    /** Forget license, login and session. The passphrase and the vault are kept. */
    deactivate(): ActivationResult {
      try {
        clearLogin();
        d.secrets.delete('licenseKey');
        d.config.update({ target: null });
        cache = null;
        licenseBlock = null;
        deviceBlock = null;
        offline = false;
        rmSync(cacheFile, { force: true });
        logger.info('app', 'deactivated');
        return { ok: true, state: publish() };
      } catch (e) {
        return fail(e);
      }
    },
  };
}

export type Activation = ReturnType<typeof createActivation>;
