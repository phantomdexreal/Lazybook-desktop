/*
LazyBooks | src/main/registry.ts
Responsibility: Activation + connector login (master registry RPCs, same ones the PWA uses)
Introduced by: Phase 5 (activation) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 5)
*/

/**
 * Calls the MASTER project's anon-callable RPCs (SHARED_CONTRACTS section 3): resolve_license, app_bootstrap, get_themes.
 * The master anon key is public by design (RPC only). No Electron import: runs under plain Node tests.
 */
import { httpJson, isAllowedBaseUrl, LbError, trimSlash } from './errors';

export interface RegistryOptions {
  url: string;
  anonKey: string;
  fetchFn?: typeof fetch;
  timeoutMs?: number;
}

export interface ResolvedLicense {
  companyName: string;
  expiresAt: string | null;
  projectUrl: string;
  projectAnonKey: string;
}

export interface BootstrapUpdate {
  latest: string;
  notes?: string;
  download_url?: string;
  sha256?: string;
  min_supported?: string;
  update_available: boolean;
  must_update: boolean;
}

/** Shape from SHARED_CONTRACTS 3.1 (only the fields the connector reads). */
export interface BootstrapResult {
  ok: true;
  server_time: string;
  license: { company_name: string; expires_at: string | null; max_devices: number; max_companies: number };
  target: { url: string; anon_key: string };
  features: Record<string, boolean>;
  theme_policy: { allowed: unknown; default: string; allow_user_switch: boolean };
  themes: Array<{ slug: string; version: number; name?: string }>;
  branding: { version: number; assets?: Record<string, string>; app_name?: string } | null;
  update: BootstrapUpdate | null;
  announcements: Array<{ id: string; title: string; body: string; severity: string }>;
  config: { contract_version: string | number; maintenance: { on: boolean; message: string } };
}

export interface RemoteTheme {
  slug: string;
  version: number;
  json: unknown;
}

const LICENSE_RE = /^LB-[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$/; // constants.json license_key.client_validation_regex

export function normalizeLicenseKey(raw: string): string {
  return raw.trim().toUpperCase();
}

export function isValidLicenseKey(key: string): boolean {
  return LICENSE_RE.test(key);
}

/** Maps a server error string (resolve_license / app_bootstrap `error`) to a taxonomy code. Wording of the server is assumed. */
export function mapRegistryError(serverMsg: string, expired?: boolean): LbError {
  const m = serverMsg.toLowerCase();
  if (expired || m.includes('expired')) return new LbError('LB_LICENSE_EXPIRED', 'This license has expired. Contact your administrator to renew it.');
  if (m.includes('not found') || m.includes('invalid')) return new LbError('LB_LICENSE_NOT_FOUND', 'That license key was not found. Check it and try again.');
  if (m.includes('inactive') || m.includes('suspend') || m.includes('disabled') || m.includes('revoked'))
    return new LbError('LB_LICENSE_INACTIVE', 'This license is not active. Contact your administrator.');
  if (m.includes('project')) return new LbError('LB_NO_PROJECT', 'No data project has been assigned to this license yet. Contact your administrator.');
  return new LbError('BAD_RESPONSE', serverMsg ? `The registry refused the request: ${serverMsg}` : 'The registry refused the request.');
}

function obj(v: unknown): Record<string, unknown> | null {
  return v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

async function rpc(o: RegistryOptions, name: string, args: Record<string, unknown>): Promise<unknown> {
  if (!o.url || !o.anonKey) throw new LbError('NOT_CONFIGURED', 'This build has no registry address configured.');
  if (!isAllowedBaseUrl(o.url)) throw new LbError('NOT_CONFIGURED', 'The registry address is not a valid https address.');
  const res = await httpJson(
    o.fetchFn ?? fetch,
    'POST',
    `${trimSlash(o.url)}/rest/v1/rpc/${name}`,
    { apikey: o.anonKey, authorization: `Bearer ${o.anonKey}` },
    args,
    o.timeoutMs ?? 15000,
  );
  if (res.status === 429) throw new LbError('BAD_RESPONSE', 'Too many requests. Wait a minute and try again.');
  if (res.status < 200 || res.status >= 300) throw new LbError('BAD_RESPONSE', `The registry answered with status ${res.status}.`);
  return res.json;
}

export async function resolveLicense(o: RegistryOptions, licenseKey: string): Promise<ResolvedLicense> {
  const body = obj(await rpc(o, 'resolve_license', { p_license_key: licenseKey }));
  if (!body) throw new LbError('BAD_RESPONSE', 'The registry sent an unreadable answer.');
  if (body['ok'] !== true) throw mapRegistryError(String(body['error'] ?? ''), body['expired'] === true);
  if (body['is_active'] === false) throw new LbError('LB_LICENSE_INACTIVE', 'This license is not active. Contact your administrator.');
  const exp = typeof body['expires_at'] === 'string' ? body['expires_at'] : null;
  if (exp && Date.parse(exp) < Date.now()) throw mapRegistryError('', true);
  const projectUrl = typeof body['project_url'] === 'string' ? body['project_url'] : '';
  const projectAnonKey = typeof body['project_anon_key'] === 'string' ? body['project_anon_key'] : '';
  if (!projectUrl || !projectAnonKey) throw new LbError('LB_NO_PROJECT', 'No data project has been assigned to this license yet. Contact your administrator.');
  if (!isAllowedBaseUrl(projectUrl)) throw new LbError('BAD_RESPONSE', 'The registry returned an invalid project address.');
  return { companyName: String(body['company_name'] ?? ''), expiresAt: exp, projectUrl: trimSlash(projectUrl), projectAnonKey };
}

export async function appBootstrap(
  o: RegistryOptions,
  p: { licenseKey: string; appVersion: string; deviceId: string; platform: string },
): Promise<BootstrapResult> {
  const body = obj(
    await rpc(o, 'app_bootstrap', {
      p_license_key: p.licenseKey,
      p_app: 'desktop',
      p_app_version: p.appVersion,
      p_device_id: p.deviceId,
      p_platform: p.platform,
    }),
  );
  if (!body) throw new LbError('BAD_RESPONSE', 'The registry sent an unreadable answer.');
  if (body['ok'] !== true) throw mapRegistryError(String(body['error'] ?? ''), body['expired'] === true);
  const cfg = obj(body['config']);
  const license = obj(body['license']);
  const target = obj(body['target']);
  if (!cfg || !license || !target) throw new LbError('BAD_RESPONSE', 'The registry sent an incomplete bootstrap answer.');
  const maint = obj(cfg['maintenance']);
  return {
    ok: true,
    server_time: String(body['server_time'] ?? ''),
    license: {
      company_name: String(license['company_name'] ?? ''),
      expires_at: typeof license['expires_at'] === 'string' ? license['expires_at'] : null,
      max_devices: Number(license['max_devices'] ?? 0),
      max_companies: Number(license['max_companies'] ?? 0),
    },
    target: { url: String(target['url'] ?? ''), anon_key: String(target['anon_key'] ?? '') },
    features: (obj(body['features']) ?? {}) as Record<string, boolean>,
    theme_policy: (obj(body['theme_policy']) ?? { allowed: 'all', default: 'obsidian-violet', allow_user_switch: true }) as BootstrapResult['theme_policy'],
    themes: Array.isArray(body['themes']) ? (body['themes'] as BootstrapResult['themes']) : [],
    branding: obj(body['branding']) as BootstrapResult['branding'],
    update: obj(body['update']) as BootstrapUpdate | null,
    announcements: Array.isArray(body['announcements']) ? (body['announcements'] as BootstrapResult['announcements']) : [],
    config: {
      contract_version: (cfg['contract_version'] as string | number | undefined) ?? 1,
      maintenance: { on: maint?.['on'] === true, message: String(maint?.['message'] ?? '') },
    },
  };
}

export async function getThemes(o: RegistryOptions, licenseKey: string): Promise<RemoteTheme[]> {
  const v = await rpc(o, 'get_themes', { p_license_key: licenseKey });
  if (!Array.isArray(v)) return [];
  return v.filter((t): t is RemoteTheme => !!obj(t) && typeof (t as RemoteTheme).slug === 'string' && typeof (t as RemoteTheme).version === 'number');
}
