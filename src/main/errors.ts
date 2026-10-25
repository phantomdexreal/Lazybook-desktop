/*
LazyBooks | src/main/errors.ts
Responsibility: LbError (error code + message) and the shared JSON-over-HTTP helper used by registry and supabase
Introduced by: Phase 5 (activation)
STATUS: IMPLEMENTED (Phase 5)
*/

/** Codes are the SHARED_CONTRACTS section 9 taxonomy plus three local ones (NETWORK, NOT_CONFIGURED, BAD_RESPONSE). */
export type LbErrorCode =
  | 'LB_LICENSE_NOT_FOUND'
  | 'LB_LICENSE_INACTIVE'
  | 'LB_LICENSE_EXPIRED'
  | 'LB_NO_PROJECT'
  | 'LB_MAINTENANCE'
  | 'LB_CONTRACT_TOO_OLD'
  | 'LB_UPDATE_REQUIRED'
  | 'LB_AUTH_FAILED'
  | 'LB_DEVICE_REVOKED'
  | 'LB_DEVICE_LIMIT'
  | 'LB_CRYPTO_BAD_PASSPHRASE'
  | 'LB_CRYPTO_DECRYPT_FAILED'
  | 'LB_TALLY_UNREACHABLE'
  | 'LB_TALLY_REJECTED'
  | 'NETWORK'
  | 'NOT_CONFIGURED'
  | 'BAD_RESPONSE';

export class LbError extends Error {
  readonly code: LbErrorCode;
  constructor(code: LbErrorCode, message: string) {
    super(message);
    this.name = 'LbError';
    this.code = code;
  }
}

export interface HttpResult {
  status: number;
  json: unknown;
}

/**
 * POST/GET JSON with a timeout. Network failure (offline, DNS, timeout) becomes LbError NETWORK.
 * Never logs bodies: they can hold passwords and tokens.
 */
export async function httpJson(
  fetchFn: typeof fetch,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  headers: Record<string, string>,
  body: unknown,
  timeoutMs: number,
): Promise<HttpResult> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetchFn(url, {
      method,
      headers: { 'content-type': 'application/json', accept: 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: ctl.signal,
    });
    const text = await res.text();
    let json: unknown = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    }
    return { status: res.status, json };
  } catch {
    throw new LbError('NETWORK', 'Could not reach the server. Check the internet connection and try again.');
  } finally {
    clearTimeout(timer);
  }
}

/** http is only accepted for loopback (mock servers in dev); everything else must be https. */
export function isAllowedBaseUrl(u: string): boolean {
  try {
    const p = new URL(u);
    if (p.protocol === 'https:') return true;
    return p.protocol === 'http:' && (p.hostname === 'localhost' || p.hostname === '127.0.0.1');
  } catch {
    return false;
  }
}

export function trimSlash(u: string): string {
  return u.replace(/\/+$/, '');
}
