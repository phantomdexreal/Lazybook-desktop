// LazyBooks | tools/mock-registry/server.mjs
// Mock MASTER registry + TARGET auth in one HTTP server, for Phase 5 activation without any Supabase project.
// Speaks the subset the connector uses: POST /rest/v1/rpc/{resolve_license,app_bootstrap,get_themes} (anon key required)
// and POST /auth/v1/token?grant_type=password|refresh_token. Serves the demo license from docs/shared/constants.json.
// Usage: node tools/mock-registry/server.mjs   (env LB_MOCK_REGISTRY_PORT, default 54321)
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SHARED = join(here, '..', '..', 'docs', 'shared');
const demo = JSON.parse(readFileSync(join(SHARED, 'constants.json'), 'utf8')).demo;
const THEME = JSON.parse(readFileSync(join(SHARED, 'themes', 'graphite-iris.json'), 'utf8'));

export const MOCK_ANON_KEY = 'mock-anon-key';
export const MOCK_CONNECTOR_PASSWORD = process.env.LB_MOCK_CONNECTOR_PASSWORD || 'mock-connector-pass';
export const MOCK_OWNER_PASSWORD = 'mock-owner-pass';

/** Returns { server, state, close() }. `state` can be mutated by tests: maintenance, expired, mustUpdate, contractVersion, expiresIn, themeVersion, calls. */
export function startMockRegistry(port = 54321, host = '127.0.0.1') {
  const base = `http://${host}:${port}`;
  const state = {
    maintenance: false,
    expired: false,
    mustUpdate: false,
    contractVersion: '1',
    expiresIn: 3600,
    themeVersion: 1,
    refreshTokens: new Map(),
    calls: [],
    rpcBodies: [],
    devices: new Map(), // device_id -> row (the mock license project's `devices` table)
    deviceLimit: false,
    entryQueue: new Map(), // the mock license project's `entry_queue` table (Phase 24)
    syncChunks: [], // the mock license project's `sync_chunks` table (Phase 22); a device acks by deleting
    chunkId: 0,
    chunkInsertFail: false,
    syncRequests: new Map(), // id -> row (the mock license project's `sync_requests` table; Phase 19)
    seq: 0,
  };

  const users = {
    [demo.connector_email]: { id: 'u-connector', password: MOCK_CONNECTOR_PASSWORD, role: 'connector' },
    [demo.owner_email]: { id: 'u-owner', password: MOCK_OWNER_PASSWORD, role: 'owner' },
    'wrong-license@example.invalid': { id: 'u-other', password: MOCK_CONNECTOR_PASSWORD, role: 'connector', license: 'LB-TEST-0000-0000-0001' },
  };

  const send = (res, code, body) => {
    res.writeHead(code, { 'content-type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  const issue = (email) => {
    const u = users[email];
    const n = ++state.seq;
    const refresh = `mock-refresh-${n}`;
    state.refreshTokens.set(refresh, email);
    return {
      access_token: `mock-access-${n}`,
      refresh_token: refresh,
      expires_in: state.expiresIn,
      token_type: 'bearer',
      user: { id: u.id, email, app_metadata: { license_key: u.license || demo.license_key, role: u.role }, user_metadata: {} },
    };
  };

  const server = createServer((req, res) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      let body = {};
      try {
        body = raw ? JSON.parse(raw) : {};
      } catch {
        return send(res, 400, { message: 'bad json' });
      }
      const url = new URL(req.url, base);
      state.calls.push(`${req.method} ${url.pathname}${url.search}`);
      if (req.headers['apikey'] !== MOCK_ANON_KEY) return send(res, 401, { message: 'No API key found in request' });

      if (req.method === 'POST' && url.pathname === '/auth/v1/token') {
        const grant = url.searchParams.get('grant_type');
        if (grant === 'password') {
          const u = users[body.email];
          if (!u || u.password !== body.password) return send(res, 400, { error_code: 'invalid_credentials', msg: 'Invalid login credentials' });
          return send(res, 200, issue(body.email));
        }
        if (grant === 'refresh_token') {
          const email = state.refreshTokens.get(body.refresh_token);
          if (!email) return send(res, 400, { error_code: 'refresh_token_not_found', msg: 'Invalid Refresh Token' });
          state.refreshTokens.delete(body.refresh_token);
          return send(res, 200, issue(email));
        }
        return send(res, 400, { msg: 'unsupported grant' });
      }

      if (url.pathname === '/rest/v1/devices') {
        if (!String(req.headers['authorization'] || '').startsWith('Bearer mock-access-')) return send(res, 401, { message: 'JWT required' });
        const q = (k) => { const v = url.searchParams.get(k); return v && v.startsWith('eq.') ? v.slice(3) : null; };
        const pick = () => [...state.devices.values()].filter((r) => (q('device_id') === null || r.device_id === q('device_id')) && (q('is_revoked') === null || String(r.is_revoked) === q('is_revoked')));
        if (req.method === 'GET') return send(res, 200, pick());
        if (req.method === 'POST') {
          if (state.deviceLimit) return send(res, 403, { message: 'device limit reached for license' });
          if (state.devices.has(body.device_id)) return send(res, 409, { message: 'duplicate key' });
          const row = { can_write: true, is_revoked: false, last_sync_at: null, created_at: new Date().toISOString(), ...body };
          state.devices.set(row.device_id, row);
          return send(res, 201, [row]);
        }
        if (req.method === 'PATCH') {
          const hit = pick();
          for (const r of hit) Object.assign(r, body);
          return send(res, 200, hit);
        }
      }

      if (url.pathname === '/rest/v1/sync_chunks') {
        if (!String(req.headers['authorization'] || '').startsWith('Bearer mock-access-')) return send(res, 401, { message: 'JWT required' });
        // PostgREST subset (Phase 22): eq filters on request_id, device_id, seq, license_key, id; order=id.asc; limit; POST arrays; DELETE.
        const keep = (row) => {
          for (const k of ['id', 'request_id', 'device_id', 'seq', 'license_key']) {
            const v = url.searchParams.get(k);
            if (v === null) continue;
            if (!v.startsWith('eq.') || String(row[k]) !== v.slice(3)) return false;
          }
          const exp = url.searchParams.get('expires_at'); // Phase 23: lt.<iso> for the expiry sweep
          if (exp !== null && !(exp.startsWith('lt.') && String(row.expires_at) < exp.slice(3))) return false;
          return true;
        };
        const pick = () => {
          const hit = state.syncChunks.filter(keep);
          const lim = Number(url.searchParams.get('limit'));
          return lim > 0 ? hit.slice(0, lim) : hit;
        };
        if (req.method === 'GET') return send(res, 200, pick().map((r) => (url.searchParams.get('select') === 'id' ? { id: r.id } : r)));
        if (req.method === 'POST') {
          if (state.chunkInsertFail) return send(res, 500, { message: 'boom' });
          const rows = Array.isArray(body) ? body : [body];
          for (const r of rows) state.syncChunks.push({ id: ++state.chunkId, ...r });
          return send(res, 201, []);
        }
        if (req.method === 'DELETE') {
          const gone = new Set(pick().map((r) => r.id));
          state.syncChunks = state.syncChunks.filter((r) => !gone.has(r.id));
          return send(res, 200, []);
        }
      }

      if (url.pathname === '/rest/v1/entry_queue') {
        if (!String(req.headers['authorization'] || '').startsWith('Bearer mock-access-')) return send(res, 401, { message: 'JWT required' });
        // PostgREST subset (Phase 24): eq.<v> and in.(a,b) filters on id, status, device_id, kind, license_key, attempts; order=created_at.asc; limit; PATCH; POST (tests).
        const match = (row) => {
          for (const k of ['id', 'status', 'device_id', 'kind', 'license_key', 'attempts', 'client_request_id']) {
            const v = url.searchParams.get(k);
            if (v === null) continue;
            if (v.startsWith('eq.')) {
              if (String(row[k]) !== v.slice(3)) return false;
            } else if (v.startsWith('in.(') && v.endsWith(')')) {
              if (!v.slice(4, -1).split(',').includes(String(row[k]))) return false;
            } else return false;
          }
          return true;
        };
        const pick = () => {
          let hit = [...state.entryQueue.values()].filter(match);
          if (url.searchParams.get('order') === 'created_at.asc') hit = hit.sort((x, y) => (x.created_at < y.created_at ? -1 : x.created_at > y.created_at ? 1 : 0));
          const lim = Number(url.searchParams.get('limit'));
          return lim > 0 ? hit.slice(0, lim) : hit;
        };
        if (req.method === 'GET') return send(res, 200, pick());
        if (req.method === 'POST') {
          const rows = Array.isArray(body) ? body : [body];
          for (const r of rows) {
            if ([...state.entryQueue.values()].some((x) => x.client_request_id === r.client_request_id)) return send(res, 409, { message: 'duplicate key value violates unique constraint' });
          }
          const out = rows.map((r) => {
            const id = `00000000-0000-4000-9000-${String(++state.seq).padStart(12, '0')}`;
            const stamp = new Date().toISOString();
            const row = { id, status: 'queued', result: null, attempts: 0, created_at: stamp, updated_at: stamp, posted_at: null, ...r };
            state.entryQueue.set(id, row);
            return row;
          });
          return send(res, 201, out);
        }
        if (req.method === 'PATCH') {
          if (state.entryPatchFail) return send(res, 500, { message: 'boom' });
          const hit = pick();
          for (const r of hit) Object.assign(r, body);
          return send(res, 200, hit);
        }
      }

      if (url.pathname === '/rest/v1/sync_requests') {
        if (!String(req.headers['authorization'] || '').startsWith('Bearer mock-access-')) return send(res, 401, { message: 'JWT required' });
        // PostgREST subset: eq.<v> and in.(a,b) filters on id, status, device_id, kind, license_key; order=created_at.asc; limit.
        const match = (row) => {
          for (const k of ['id', 'status', 'device_id', 'kind', 'license_key']) {
            const v = url.searchParams.get(k);
            if (v === null) continue;
            if (v.startsWith('eq.')) {
              if (String(row[k]) !== v.slice(3)) return false;
            } else if (v.startsWith('in.(') && v.endsWith(')')) {
              if (!v.slice(4, -1).split(',').includes(String(row[k]))) return false;
            } else return false;
          }
          return true;
        };
        const pick = () => {
          let hit = [...state.syncRequests.values()].filter(match);
          if (url.searchParams.get('order') === 'created_at.asc') hit = hit.sort((x, y) => (x.created_at < y.created_at ? -1 : x.created_at > y.created_at ? 1 : 0));
          const lim = Number(url.searchParams.get('limit'));
          return lim > 0 ? hit.slice(0, lim) : hit;
        };
        if (req.method === 'GET') return send(res, 200, pick());
        if (req.method === 'POST') {
          const inflight = [...state.syncRequests.values()].some((r) => r.device_id === body.device_id && r.kind === body.kind && (r.status === 'pending' || r.status === 'processing'));
          if (inflight) return send(res, 409, { message: 'duplicate key value violates unique constraint "uq_sync_requests_inflight"' });
          const id = `00000000-0000-4000-8000-${String(++state.seq).padStart(12, '0')}`;
          const stamp = new Date().toISOString();
          const row = { id, status: 'pending', error: null, company_guid: null, from_date: null, to_date: null, last_sync_at: null, lookback_days: null, created_at: stamp, updated_at: stamp, ...body };
          state.syncRequests.set(id, row);
          return send(res, 201, [row]);
        }
        if (req.method === 'PATCH') {
          const hit = pick();
          for (const r of hit) Object.assign(r, body);
          return send(res, 200, hit);
        }
      }

      const m = url.pathname.match(/^\/rest\/v1\/rpc\/(\w+)$/);
      if (req.method === 'POST' && m) {
        state.rpcBodies.push({ rpc: m[1], ...body });
        const key = body.p_license_key;
        const known = key === demo.license_key;
        if (m[1] === 'resolve_license') {
          if (!known) return send(res, 200, { ok: false, error: 'License not found' });
          if (state.expired) return send(res, 200, { ok: false, error: 'License expired', expired: true });
          return send(res, 200, { ok: true, company_name: demo.company_name, is_active: true, expires_at: '2099-01-01T00:00:00Z', project_url: base, project_anon_key: MOCK_ANON_KEY });
        }
        if (m[1] === 'app_bootstrap') {
          if (!known) return send(res, 200, { ok: false, error: 'License not found' });
          if (state.expired) return send(res, 200, { ok: false, error: 'License expired', expired: true });
          return send(res, 200, {
            ok: true,
            server_time: new Date().toISOString(),
            license: { company_name: demo.company_name, expires_at: '2099-01-01T00:00:00Z', max_devices: 5, max_companies: 1 },
            target: { url: base, anon_key: MOCK_ANON_KEY },
            features: { reports: true, entries: true, cloud_copy: false, e2e_encryption: true },
            theme_policy: { allowed: 'all', default: 'obsidian-violet', allow_user_switch: true },
            themes: [{ slug: 'mock-graphite', version: state.themeVersion, name: 'Mock Graphite' }],
            branding: { version: 1, assets: {}, app_name: 'LazyBooks' },
            update: { latest: '9.9.9', update_available: state.mustUpdate, must_update: state.mustUpdate, min_supported: '0.0.0' },
            announcements: [],
            config: { contract_version: state.contractVersion, maintenance: { on: state.maintenance, message: state.maintenance ? 'Back in ten minutes.' : '' } },
          });
        }
        if (m[1] === 'get_themes') {
          if (!known) return send(res, 200, []);
          return send(res, 200, [{ slug: 'mock-graphite', version: state.themeVersion, json: { ...THEME, slug: 'mock-graphite', name: 'Mock Graphite', version: state.themeVersion } }]);
        }
      }
      send(res, 404, { message: 'not found' });
    });
  });

  server.listen(port, host);
  return { server, state, base, close: () => server.close() };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const port = Number(process.env.LB_MOCK_REGISTRY_PORT) || 54321;
  startMockRegistry(port);
  console.log(`mock registry on http://127.0.0.1:${port} (anon key ${MOCK_ANON_KEY}, demo connector ${demo.connector_email})`);
}
