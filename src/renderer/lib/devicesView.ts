/*
LazyBooks | src/renderer/lib/devicesView.ts
Responsibility: Devices page helpers (labels, status words, allowed actions, limit text; pure)
Introduced by: Phase 36 (ui-pairing)
STATUS: IMPLEMENTED (Phase 36)
*/
import type { DeviceView } from '../../shared/ipc';
import { ago } from './statusView';

export type DeviceState = 'this-pc' | 'online' | 'offline' | 'blocked' | 'never-seen';

export const APP_LABEL: Record<DeviceView['app'], string> = { pwa: 'Browser app', mobile: 'Phone app', desktop: 'Desktop connector' };

/** One state word per device, most important first. */
export function deviceState(d: DeviceView): DeviceState {
  if (d.revoked) return 'blocked';
  if (d.thisPc) return 'this-pc';
  if (d.online) return 'online';
  return d.lastSeenAt ? 'offline' : 'never-seen';
}

export const STATE_TEXT: Record<DeviceState, string> = {
  'this-pc': 'This PC',
  online: 'Online',
  offline: 'Offline',
  blocked: 'Blocked',
  'never-seen': 'Not seen yet',
};

/** Revoke and resync are offered only for phones and browsers that are not this PC; resync also needs the device not to be blocked. */
export function actionsFor(d: DeviceView): { revoke: boolean; resync: boolean } {
  const managed = !d.thisPc && d.app !== 'desktop';
  return { revoke: managed && !d.revoked, resync: managed && !d.revoked };
}

export function seenText(d: DeviceView, nowMs: number): string {
  return d.lastSeenAt ? ago(d.lastSeenAt, nowMs) : 'never';
}

export function syncedText(d: DeviceView, nowMs: number): string {
  return d.lastSyncAt ? ago(d.lastSyncAt, nowMs) : 'never';
}

/** Short detail line: app kind, platform, version. */
export function detailText(d: DeviceView): string {
  return [APP_LABEL[d.app], d.platform, d.appVersion ? `v${d.appVersion}` : null].filter((x): x is string => !!x).join(', ');
}

/** "3 of 5 devices used" (blocked devices do not count against the limit here: the server decides, this is only a hint). */
export function limitText(devices: DeviceView[], maxDevices: number | null): string {
  const used = devices.filter((d) => !d.revoked).length;
  return maxDevices && maxDevices > 0 ? `${used} of ${maxDevices} devices used` : `${used} device${used === 1 ? '' : 's'}`;
}

export function confirmText(kind: 'revoke' | 'resync', d: DeviceView): string {
  return kind === 'revoke'
    ? `Block ${d.name}? It will stop receiving data and cannot post entries. Only your administrator can restore it.`
    : `Send ${d.name} a full copy of your data the next time it syncs? Data waiting for it is dropped.`;
}
