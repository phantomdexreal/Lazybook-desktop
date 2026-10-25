/*
LazyBooks | src/main/device.ts
Responsibility: Device registration + heartbeat
Introduced by: Phase 6 (device-heartbeat)
STATUS: IMPLEMENTED (Phase 6)
*/

/**
 * Registers this PC in the license project's `devices` table (app='desktop') and keeps `last_seen_at` moving
 * every heartbeat interval (SHARED_CONTRACTS 4.4). Honours `is_revoked`: a revoked connector stops heartbeating
 * (it only re-reads its own row so an un-revoke recovers), shows the blocking screen and reports `isRevoked()`
 * for the schedulers added in later phases. Only existing `devices` columns are written (02_license_project_schema.sql).
 * No Electron import: all collaborators are injected.
 */
import { DESKTOP_DEFAULTS } from '../shared/constants';
import type { ActivationState, BlockingState } from '../shared/ipc';
import { LbError } from './errors';
import { logger } from './logger';
import type { TargetClient } from './supabase';

const ONLINE_WINDOW_MS = 10 * 60 * 1000; // SHARED_CONTRACTS 4.4

export interface DeviceDeps {
  activation: {
    state(): ActivationState;
    getAccessToken(): Promise<string>;
    targetClient(): TargetClient | null;
    setDeviceBlock(b: BlockingState | null): void;
  };
  deviceId(): string | null;
  licenseKey(): string | null;
  deviceName: string;
  appVersion: string;
  platform: string;
  /** null until the sync scheduler (Phase 18) exists */
  getLastSyncAt(): string | null;
  getTally(): { ok: boolean; version: string | null; company: string | null };
  onChange(p: { devicesOnline?: number; revoked?: boolean }): void;
  intervalMs?: number;
  now?: () => number;
}

interface DeviceRow {
  device_id?: string;
  is_revoked?: boolean;
  app?: string;
  last_seen_at?: string | null;
}

const REVOKED: BlockingState = {
  code: 'LB_DEVICE_REVOKED',
  message: 'This PC was removed by your administrator. Syncing is stopped. Contact your administrator to restore access.',
};

export function createDevice(d: DeviceDeps) {
  const now = d.now ?? Date.now;
  const intervalMs = d.intervalMs ?? DESKTOP_DEFAULTS.heartbeatMin * 60 * 1000;
  let timer: NodeJS.Timeout | null = null;
  let inflight: Promise<void> | null = null;
  let known = false;
  let revoked = false;
  let lastBeatAt: string | null = null;

  const rows = (v: unknown): DeviceRow[] => (Array.isArray(v) ? (v as DeviceRow[]) : []);

  function setRevoked(flag: boolean): void {
    if (flag === revoked) return;
    revoked = flag;
    logger.warn('app', flag ? 'device revoked by admin, sync stopped' : 'device access restored');
    d.activation.setDeviceBlock(flag ? REVOKED : null);
    d.onChange({ revoked: flag });
  }

  async function run(): Promise<void> {
    const st = d.activation.state();
    const id = d.deviceId();
    const lic = d.licenseKey();
    const client = d.activation.targetClient();
    if (st.stage !== 'active' || !id || !lic || !client) {
      known = false;
      return;
    }
    try {
      const token = await d.activation.getAccessToken();
      const session = { accessToken: token, refreshToken: '', expiresAt: 0 };
      const idq = `device_id=eq.${encodeURIComponent(id)}`;
      const stamp = new Date(now()).toISOString();

      if (!known) {
        const found = rows(await client.rest(session, 'GET', `devices?select=device_id,is_revoked&${idq}`));
        if (found.length === 0) {
          const ins = rows(
            await client.rest(
              session,
              'POST',
              'devices',
              { device_id: id, license_key: lic, device_name: d.deviceName, app: 'desktop', platform: d.platform, app_version: d.appVersion, last_seen_at: stamp, last_sync_at: d.getLastSyncAt() },
              { prefer: 'return=representation' },
            ),
          );
          logger.info('app', 'device registered', { deviceId: id });
          setRevoked(ins[0]?.is_revoked === true);
          lastBeatAt = stamp;
        } else {
          setRevoked(found[0]?.is_revoked === true);
        }
        known = true;
        if (d.activation.state().blocking?.code === 'LB_DEVICE_LIMIT') d.activation.setDeviceBlock(null);
      }

      if (revoked) {
        // Do not heartbeat while revoked; only re-read the row so an un-revoke is noticed.
        const cur = rows(await client.rest(session, 'GET', `devices?select=device_id,is_revoked&${idq}`));
        if (cur.length === 0) known = false;
        else setRevoked(cur[0]?.is_revoked === true);
        return;
      }

      if (lastBeatAt !== stamp) {
        const upd = rows(
          await client.rest(
            session,
            'PATCH',
            `devices?${idq}`,
            { last_seen_at: stamp, app_version: d.appVersion, ...(d.getLastSyncAt() ? { last_sync_at: d.getLastSyncAt() } : {}) },
            { prefer: 'return=representation' },
          ),
        );
        if (upd.length === 0) {
          known = false; // row was deleted by the admin: register again next tick
          logger.warn('app', 'device row missing, will re-register');
          return;
        }
        lastBeatAt = stamp;
        setRevoked(upd[0]?.is_revoked === true);
        if (revoked) return;
      }

      const all = rows(await client.rest(session, 'GET', 'devices?select=device_id,app,last_seen_at&is_revoked=eq.false'));
      const online = all.filter((r) => r.app !== 'desktop' && r.last_seen_at && now() - Date.parse(r.last_seen_at) < ONLINE_WINDOW_MS).length;
      d.onChange({ devicesOnline: online });
      const tally = d.getTally();
      logger.info('app', 'heartbeat', { devicesOnline: online, tallyOk: tally.ok, tallyVersion: tally.version });
    } catch (e) {
      if (e instanceof LbError && e.code === 'LB_DEVICE_LIMIT') {
        d.activation.setDeviceBlock({ code: e.code, message: e.message });
        logger.warn('app', 'device limit reached');
      } else if (e instanceof LbError && e.code === 'NETWORK') {
        logger.warn('app', 'heartbeat offline, will retry');
      } else {
        known = false;
        logger.warn('app', 'heartbeat failed', { err: e });
      }
    }
  }

  function tick(): Promise<void> {
    inflight ??= run().finally(() => {
      inflight = null;
    });
    return inflight;
  }

  return {
    /** Heartbeat now and every interval. Safe before activation: ticks are no-ops until the stage is active. */
    start(): void {
      if (!timer) {
        timer = setInterval(() => void tick(), intervalMs);
        timer.unref();
      }
      void tick();
    },
    stop(): void {
      if (timer) clearInterval(timer);
      timer = null;
    },
    tick,
    /** Call on every activation state change: registers right after sign-in, forgets state on deactivate. */
    onActivation(s: ActivationState): void {
      if (s.stage !== 'active') {
        known = false;
        revoked = false;
        lastBeatAt = null;
        return;
      }
      if (!known && !inflight) void tick();
    },
    isRevoked: (): boolean => revoked,
  };
}

export type Device = ReturnType<typeof createDevice>;
