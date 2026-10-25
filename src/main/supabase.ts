/*
LazyBooks | src/main/supabase.ts
Responsibility: Activation + connector login (customer project auth and authenticated REST access)
Introduced by: Phase 5 (activation) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 5)
*/

/**
 * Minimal client for the customer's (TARGET) Supabase project: GoTrue password login + refresh, a persisted session,
 * and an authenticated PostgREST helper for later phases. Implemented over fetch because @supabase/supabase-js could not
 * be installed in the Phase 5 sandbox (no network); see PHASE_STATUS Decision log. The seam (`TargetClient`) is the
 * only thing other modules use, so swapping in supabase-js later does not touch callers.
 * Authorisation uses app_metadata only (never user_metadata). No Electron import.
 */
import { httpJson, isAllowedBaseUrl, LbError, trimSlash } from './errors';

export interface Session {
  accessToken: string;
  refreshToken: string;
  /** epoch ms */
  expiresAt: number;
}

export interface TargetOptions {
  url: string;
  anonKey: string;
  fetchFn?: typeof fetch;
  timeoutMs?: number;
  now?: () => number;
}

export interface SignInResult {
  session: Session;
  appMetadata: Record<string, unknown>;
  userId: string;
}

function obj(v: unknown): Record<string, unknown> | null {
  return v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function authFailure(status: number, json: unknown): LbError {
  const b = obj(json);
  const code = String(b?.['error_code'] ?? b?.['error'] ?? '');
  if (status === 429) return new LbError('BAD_RESPONSE', 'Too many sign-in attempts. Wait a minute and try again.');
  if (status === 400 || status === 401 || status === 422 || code.includes('invalid') || code.includes('credentials'))
    return new LbError('LB_AUTH_FAILED', 'Email or password is incorrect.');
  return new LbError('BAD_RESPONSE', `The sign-in service answered with status ${status}.`);
}

export class TargetClient {
  private readonly o: Required<Omit<TargetOptions, 'fetchFn' | 'now'>> & { fetchFn: typeof fetch; now: () => number };

  constructor(o: TargetOptions) {
    if (!isAllowedBaseUrl(o.url)) throw new LbError('NOT_CONFIGURED', 'The project address is not a valid https address.');
    this.o = { url: trimSlash(o.url), anonKey: o.anonKey, timeoutMs: o.timeoutMs ?? 15000, fetchFn: o.fetchFn ?? fetch, now: o.now ?? Date.now };
  }

  private async token(grant: 'password' | 'refresh_token', body: Record<string, unknown>): Promise<SignInResult> {
    const res = await httpJson(
      this.o.fetchFn,
      'POST',
      `${this.o.url}/auth/v1/token?grant_type=${grant}`,
      { apikey: this.o.anonKey, authorization: `Bearer ${this.o.anonKey}` },
      body,
      this.o.timeoutMs,
    );
    if (res.status < 200 || res.status >= 300) throw authFailure(res.status, res.json);
    const j = obj(res.json);
    const user = obj(j?.['user']);
    const access = j?.['access_token'];
    const refresh = j?.['refresh_token'];
    if (typeof access !== 'string' || typeof refresh !== 'string' || !user) throw new LbError('BAD_RESPONSE', 'The sign-in service sent an unreadable answer.');
    const expiresIn = Number(j?.['expires_in'] ?? 3600);
    return {
      session: { accessToken: access, refreshToken: refresh, expiresAt: this.o.now() + expiresIn * 1000 },
      appMetadata: obj(user['app_metadata']) ?? {},
      userId: String(user['id'] ?? ''),
    };
  }

  signIn(email: string, password: string): Promise<SignInResult> {
    return this.token('password', { email, password });
  }

  refresh(refreshToken: string): Promise<SignInResult> {
    return this.token('refresh_token', { refresh_token: refreshToken });
  }

  /** Authenticated PostgREST call for later phases (`path` like `devices?select=*`). */
  async rest(session: Session, method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown, extraHeaders: Record<string, string> = {}): Promise<unknown> {
    const res = await httpJson(
      this.o.fetchFn,
      method,
      `${this.o.url}/rest/v1/${path.replace(/^\/+/, '')}`,
      { apikey: this.o.anonKey, authorization: `Bearer ${session.accessToken}`, ...extraHeaders },
      body,
      this.o.timeoutMs,
    );
    if (res.status === 401) throw new LbError('LB_AUTH_FAILED', 'The connector session is no longer valid.');
    if (res.status === 403 || res.status === 409) {
      const msg = JSON.stringify(res.json ?? '').toLowerCase();
      if (msg.includes('device limit') || msg.includes('max_devices')) throw new LbError('LB_DEVICE_LIMIT', 'This license has reached its device limit. Ask your administrator to free a slot.');
    }
    if (res.status < 200 || res.status >= 300) throw new LbError('BAD_RESPONSE', `The data project answered with status ${res.status}.`);
    return res.json;
  }
}

/**
 * The login must be the connector account of THIS license: app_metadata.role === 'connector' and
 * app_metadata.license_key === the activated key (SHARED_CONTRACTS section 2; SECURITY.md).
 */
export function assertConnectorClaims(appMetadata: Record<string, unknown>, licenseKey: string): void {
  if (appMetadata['license_key'] !== licenseKey) {
    throw new LbError('LB_AUTH_FAILED', 'This login does not belong to this license.');
  }
  if (appMetadata['role'] !== 'connector') {
    throw new LbError('LB_AUTH_FAILED', 'This login is not a connector account. Ask your administrator for the connector email and password.');
  }
}

export function sessionNeedsRefresh(s: Session, now: number, marginMs = 60_000): boolean {
  return s.expiresAt - now <= marginMs;
}
