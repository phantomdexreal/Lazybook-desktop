/*
LazyBooks | src/main/devices.ts
Responsibility: Connected devices list, revoke and force resync (Pairing + devices page)
Introduced by: Phase 36 (ui-pairing)
STATUS: IMPLEMENTED (Phase 36)
*/

/**
 * Reads the license's `devices` table and lets the owner of this PC block a phone or browser (`is_revoked`) or make its
 * next sync a full one. No Electron import: every collaborator is injected, so it runs under Node tests.
 *
 * Rules:
 *  - this PC and other desktop rows are listed but can be neither revoked nor resynced from here (a PC removing itself
 *    would lock the owner out; the admin console does that);
 *  - every write is scoped to the license key and one device id (`device_id=eq.<id>&license_key=eq.<key>`) and the row
 *    is read first, so an unknown id changes nothing;
 *  - revoke also forgets the device's position in the vault (cursor) and drops chunks still waiting for it;
 *  - resync forgets the position (the next delta request is answered with an initial sequence, see serve.ts) and drops
 *    waiting chunks so the device does not apply stale data first; the device row itself is not touched.
 */
import type { DeviceActionResult, DeviceView, DevicesListResult } from '../shared/ipc';
import { LbError } from './errors';
import type { TargetClient } from './supabase';

const ONLINE_WINDOW_MS = 10 * 60 * 1000; // SHARED_CONTRACTS 4.4
const ID_PATTERN = /^[A-Za-z0-9._:@+-]{1,200}$/;

export interface DevicesDeps {
  activation: { getAccessToken(): Promise<string>; targetClient(): TargetClient | null };
  licenseKey(): string | null;
  /** this PC's device id (config) */
  thisDeviceId(): string | null;
  /** max devices from the last bootstrap, or null when unknown */
  maxDevices(): number | null;
  /** forget a device's vault cursor (the vault may be closed: then there is nothing to forget) */
  dropCursor(deviceId: string): void;
  /** called after a successful write (index.ts refreshes the status) */
  onChanged?(): void;
  log?(msg: string, data?: Record<string, unknown>): void;
  now?: () => number;
}

interface RawDevice {
  device_id?: unknown;
  device_name?: unknown;
  app?: unknown;
  platform?: unknown;
  app_version?: unknown;
  can_write?: unknown;
  is_revoked?: unknown;
  last_seen_at?: unknown;
  last_sync_at?: unknown;
  created_at?: unknown;
}

const str = (v: unknown): string | null => (typeof v === 'string' && v.length > 0 ? v : null);

/** Pure: raw table row to the page's view (null when the row has no usable id or app). */
export function toDeviceView(r: RawDevice, thisId: string | null, nowMs: number): DeviceView | null {
  const id = str(r.device_id);
  const app = r.app === 'pwa' || r.app === 'mobile' || r.app === 'desktop' ? r.app : null;
  if (!id || !app) return null;
  const revoked = r.is_revoked === true;
  const seen = str(r.last_seen_at);
  const seenMs = seen ? Date.parse(seen) : NaN;
  return {
    deviceId: id,
    name: str(r.device_name) ?? (app === 'desktop' ? 'Desktop' : app === 'mobile' ? 'Phone' : 'Browser'),
    app,
    platform: str(r.platform),
    appVersion: str(r.app_version),
    canWrite: r.can_write !== false,
    revoked,
    lastSeenAt: seen,
    lastSyncAt: str(r.last_sync_at),
    createdAt: str(r.created_at),
    online: !revoked && Number.isFinite(seenMs) && nowMs - seenMs < ONLINE_WINDOW_MS,
    thisPc: id === thisId,
  };
}

/** Pure: most recently seen first, this PC first of all, never-seen devices last. */
export function sortDevices(list: DeviceView[]): DeviceView[] {
  const t = (d: DeviceView): number => {
    const v = d.lastSeenAt ? Date.parse(d.lastSeenAt) : NaN;
    return Number.isFinite(v) ? v : -Infinity;
  };
  return [...list].sort((a, b) => {
    if (a.thisPc !== b.thisPc) return a.thisPc ? -1 : 1;
    const d = t(b) - t(a);
    if (d !== 0 && !Number.isNaN(d)) return d;
    return a.name.localeCompare(b.name);
  });
}

function fail(code: string, message: string): { ok: false; code: string; message: string } {
  return { ok: false, code, message };
}

function describe(e: unknown): { code: string; message: string } {
  if (e instanceof LbError) {
    if (e.code === 'NETWORK') return { code: 'NETWORK', message: 'No internet connection to your license project. Try again when you are online.' };
    return { code: e.code, message: e.message };
  }
  return { code: 'UNKNOWN', message: 'Something went wrong while talking to your license project. Try again.' };
}

export function createDevices(d: DevicesDeps) {
  const now = d.now ?? Date.now;
  const log = d.log ?? (() => undefined);

  async function ctx(): Promise<{ client: TargetClient; session: { accessToken: string; refreshToken: string; expiresAt: number }; lic: string }> {
    const lic = d.licenseKey();
    const client = d.activation.targetClient();
    if (!lic || !client) throw new LbError('NOT_CONFIGURED', 'This PC is not activated.');
    const token = await d.activation.getAccessToken();
    return { client, session: { accessToken: token, refreshToken: '', expiresAt: 0 }, lic };
  }

  const rowsOf = (v: unknown): RawDevice[] => (Array.isArray(v) ? (v as RawDevice[]) : []);
  const scope = (lic: string, id: string): string => `license_key=eq.${encodeURIComponent(lic)}&device_id=eq.${encodeURIComponent(id)}`;

  async function list(): Promise<DevicesListResult> {
    try {
      const { client, session, lic } = await ctx();
      const raw = rowsOf(await client.rest(session, 'GET', `devices?select=*&license_key=eq.${encodeURIComponent(lic)}&order=created_at.asc&limit=500`));
      const nowMs = now();
      const thisId = d.thisDeviceId();
      const devices = sortDevices(raw.map((r) => toDeviceView(r, thisId, nowMs)).filter((x): x is DeviceView => x !== null));
      return { ok: true, devices, maxDevices: d.maxDevices() };
    } catch (e) {
      const m = describe(e);
      log('devices list failed', { code: m.code });
      return fail(m.code, m.message);
    }
  }

  /** Shared checks for a write: valid id, not this PC, the row exists and belongs to a phone or browser. */
  async function target(deviceId: unknown): Promise<{ ok: true; c: Awaited<ReturnType<typeof ctx>>; row: DeviceView } | { ok: false; code: string; message: string }> {
    if (typeof deviceId !== 'string' || !ID_PATTERN.test(deviceId)) return fail('INVALID', 'That device id is not valid.');
    if (deviceId === d.thisDeviceId()) return fail('THIS_PC', 'This is the PC you are using. Ask your administrator to remove it, or deactivate it in Settings.');
    const c = await ctx();
    const found = rowsOf(await c.client.rest(c.session, 'GET', `devices?select=*&${scope(c.lic, deviceId)}&limit=1`));
    const view = found[0] ? toDeviceView(found[0], d.thisDeviceId(), now()) : null;
    if (!view) return fail('NOT_FOUND', 'That device is no longer listed. Refresh the list.');
    if (view.app === 'desktop') return fail('DESKTOP', 'Desktop PCs are managed by your administrator, not from here.');
    return { ok: true, c, row: view };
  }

  async function dropWaitingChunks(c: Awaited<ReturnType<typeof ctx>>, deviceId: string): Promise<void> {
    await c.client.rest(c.session, 'DELETE', `sync_chunks?license_key=eq.${encodeURIComponent(c.lic)}&device_id=eq.${encodeURIComponent(deviceId)}`);
  }

  async function revoke(deviceId: unknown): Promise<DeviceActionResult> {
    try {
      const t = await target(deviceId);
      if (!t.ok) return t;
      const id = t.row.deviceId;
      if (t.row.revoked) return { ok: true, message: `${t.row.name} was already blocked.` };
      const upd = rowsOf(await t.c.client.rest(t.c.session, 'PATCH', `devices?${scope(t.c.lic, id)}`, { is_revoked: true }, { prefer: 'return=representation' }));
      if (upd.length === 0) return fail('NOT_FOUND', 'That device is no longer listed. Refresh the list.');
      try {
        d.dropCursor(id);
      } catch {
        /* no vault yet: nothing to forget */
      }
      try {
        await dropWaitingChunks(t.c, id);
      } catch (e) {
        log('chunk cleanup after revoke failed', { code: describe(e).code });
      }
      log('device revoked', { app: t.row.app });
      d.onChanged?.();
      return { ok: true, message: `${t.row.name} is blocked. It stops receiving data and cannot post entries.` };
    } catch (e) {
      const m = describe(e);
      log('device revoke failed', { code: m.code });
      return fail(m.code, m.message);
    }
  }

  async function resync(deviceId: unknown): Promise<DeviceActionResult> {
    try {
      const t = await target(deviceId);
      if (!t.ok) return t;
      if (t.row.revoked) return fail('REVOKED', `${t.row.name} is blocked, so it cannot be synced. Ask your administrator to restore it first.`);
      try {
        d.dropCursor(t.row.deviceId);
      } catch (e) {
        log('resync: vault not available', { code: describe(e).code });
        return fail('VAULT_CLOSED', 'The local data store is not open, so nothing can be prepared yet. Try again after the next sync.');
      }
      try {
        await dropWaitingChunks(t.c, t.row.deviceId);
      } catch (e) {
        log('chunk cleanup after resync failed', { code: describe(e).code });
      }
      log('device resync prepared', { app: t.row.app });
      d.onChanged?.();
      return { ok: true, message: `${t.row.name} will get a full copy of your data the next time it syncs.` };
    } catch (e) {
      const m = describe(e);
      log('device resync failed', { code: m.code });
      return fail(m.code, m.message);
    }
  }

  return { list, revoke, resync };
}

export type Devices = ReturnType<typeof createDevices>;
