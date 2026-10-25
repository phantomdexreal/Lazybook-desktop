/*
LazyBooks | src/renderer/pages/Devices.tsx
Responsibility: Pairing + devices
Introduced by: Phase 36 (ui-pairing) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 36)
*/

import { ArrowsClockwise, DeviceMobile, Prohibit, QrCode } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import type { CryptoStatusView, DeviceView, DevicesListResult, PairingView } from '../../shared/ipc';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/Shell';
import { STATE_TEXT, actionsFor, confirmText, detailText, deviceState, limitText, seenText, syncedText } from '../lib/devicesView';

const btn =
  'lb-seg flex items-center gap-2 rounded-lb-md border border-lb-border bg-lb-surface px-3 py-2 text-sm text-lb-text hover:bg-lb-sunken disabled:opacity-50';
const STATE_CLASS: Record<string, string> = {
  'this-pc': 'bg-lb-accent-soft text-lb-accent',
  online: 'bg-lb-sunken text-lb-success',
  offline: 'bg-lb-sunken text-lb-muted',
  blocked: 'bg-lb-sunken text-lb-danger',
  'never-seen': 'bg-lb-sunken text-lb-muted',
};

function PairingCard({ onGoSettings }: { onGoSettings(): void }) {
  const [crypto, setCrypto] = useState<CryptoStatusView | null>(null);
  const [pair, setPair] = useState<PairingView | null>(null);
  useEffect(() => {
    void window.lb.crypto.get().then(setCrypto);
    void window.lb.pairing.get().then(setPair);
  }, []);
  return (
    <section className="mb-6 rounded-lb-lg border border-lb-border bg-lb-surface p-5" aria-labelledby="pairing-title">
      <h2 id="pairing-title" className="m-0 mb-2 flex items-center gap-2 text-base font-semibold text-lb-text">
        <QrCode size={18} weight="duotone" className="text-lb-accent" aria-hidden="true" />
        Pair a phone or browser
      </h2>
      {pair ? (
        <div className="flex flex-wrap items-start gap-4">
          <div className="h-44 w-44 shrink-0 rounded-lb-md border border-lb-border bg-lb-sunken p-2 text-lb-text" role="img" aria-label="Pairing code" dangerouslySetInnerHTML={{ __html: pair.qrSvg }} />
          <ol className="m-0 min-w-0 flex-1 list-decimal pl-5 text-sm text-lb-muted">
            <li>Open LazyBooks on the phone or in the browser and choose Connect to desktop.</li>
            <li>Scan this code, or paste the link below.</li>
            <li>Type your data passphrase on that device. The code does not contain it.</li>
            <li>The device appears in the list below after its first sync.</li>
            <li className="list-none pl-0 pt-2">
              <label className="block text-xs text-lb-muted" htmlFor="pair-link">Pairing link (no secret in it)</label>
              <input id="pair-link" readOnly value={pair.qrUri} onFocus={(e) => e.currentTarget.select()} className="lb-field mt-1 w-full rounded-lb-md border border-lb-border bg-lb-sunken px-3 py-2 font-mono text-xs text-lb-text" />
            </li>
          </ol>
        </div>
      ) : (
        <div>
          <p className="m-0 text-sm text-lb-muted">
            {crypto?.state === 'locked'
              ? 'A passphrase is set, but this PC could not unlock it. Set it again in Settings before pairing a device.'
              : 'Pairing needs a data passphrase. Set one in Settings first; it is typed on each device and never sent anywhere.'}
          </p>
          <button type="button" className={`${btn} mt-3`} onClick={onGoSettings}>Open Settings</button>
        </div>
      )}
    </section>
  );
}

function DeviceRow({ d, nowMs, busy, onRevoke, onResync }: { d: DeviceView; nowMs: number; busy: boolean; onRevoke(): void; onResync(): void }) {
  const st = deviceState(d);
  const act = actionsFor(d);
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-lb-border px-4 py-3 last:border-b-0">
      <DeviceMobile size={22} weight="light" className="shrink-0 text-lb-muted" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-lb-text">{d.name}</span>
          <span className={`rounded-lb-sm px-2 py-0.5 text-xs ${STATE_CLASS[st]}`}>{STATE_TEXT[st]}</span>
          {!d.canWrite ? <span className="text-xs text-lb-muted">Read only</span> : null}
        </div>
        <div className="truncate text-xs text-lb-muted">{detailText(d)}</div>
        <div className="text-xs text-lb-muted">Last seen {seenText(d, nowMs)}, last sync {syncedText(d, nowMs)}</div>
      </div>
      {act.resync || act.revoke ? (
        <div className="flex gap-2">
          {act.resync ? (
            <button type="button" className={btn} disabled={busy} onClick={onResync} aria-label={`Force resync ${d.name}`}>
              <ArrowsClockwise size={16} weight="light" aria-hidden="true" />
              Force resync
            </button>
          ) : null}
          {act.revoke ? (
            <button type="button" className={btn} disabled={busy} onClick={onRevoke} aria-label={`Revoke ${d.name}`}>
              <Prohibit size={16} weight="light" aria-hidden="true" />
              Revoke
            </button>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

export function DevicesPage({ onNavigateSettings }: { onNavigateSettings(): void }) {
  const [res, setRes] = useState<DevicesListResult | null>(null);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<{ kind: 'revoke' | 'resync'; d: DeviceView } | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());

  const load = useCallback(async () => {
    const r = await window.lb.devices.list();
    setRes(r);
    setNowMs(Date.now());
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 30_000);
    return () => clearInterval(t);
  }, [load]);

  async function run(kind: 'revoke' | 'resync', d: DeviceView) {
    setConfirm(null);
    setBusy(true);
    try {
      const r = kind === 'revoke' ? await window.lb.devices.revoke(d.deviceId) : await window.lb.devices.resync(d.deviceId);
      setNote({ ok: r.ok, text: r.message });
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Devices" subtitle="Pair phones and browsers, see what is connected, block a lost device or send it a fresh copy." />
      <PairingCard onGoSettings={onNavigateSettings} />
      <section aria-labelledby="devices-title" className="rounded-lb-lg border border-lb-border bg-lb-surface">
        <div className="flex items-center justify-between gap-3 border-b border-lb-border px-4 py-3">
          <h2 id="devices-title" className="m-0 text-base font-semibold text-lb-text">Connected devices</h2>
          <div className="flex items-center gap-3">
            {res?.ok ? <span className="text-xs text-lb-muted">{limitText(res.devices, res.maxDevices)}</span> : null}
            <button type="button" className={btn} onClick={() => void load()}>Refresh</button>
          </div>
        </div>
        {note ? (
          <p role="status" className={`m-0 border-b border-lb-border px-4 py-2 text-sm ${note.ok ? 'text-lb-text' : 'text-lb-danger'}`}>{note.text}</p>
        ) : null}
        {confirm ? (
          <div role="alertdialog" aria-label="Confirm" className="flex flex-wrap items-center gap-3 border-b border-lb-border bg-lb-sunken px-4 py-3">
            <p className="m-0 min-w-0 flex-1 text-sm text-lb-text">{confirmText(confirm.kind, confirm.d)}</p>
            <button type="button" className={btn} onClick={() => setConfirm(null)}>Cancel</button>
            <button type="button" className="rounded-lb-md bg-lb-accent px-4 py-2 text-sm text-lb-accent-contrast" onClick={() => void run(confirm.kind, confirm.d)}>
              {confirm.kind === 'revoke' ? 'Revoke device' : 'Force resync'}
            </button>
          </div>
        ) : null}
        {!res ? (
          <p className="m-0 px-4 py-6 text-sm text-lb-muted">Loading devices</p>
        ) : !res.ok ? (
          <p className="m-0 px-4 py-6 text-sm text-lb-danger">{res.message}</p>
        ) : res.devices.length === 0 ? (
          <EmptyState icon={DeviceMobile} title="No devices yet">Pair a phone or browser with the code above. It shows up here after its first sync.</EmptyState>
        ) : (
          <ul className="m-0 list-none p-0">
            {res.devices.map((d) => (
              <DeviceRow key={d.deviceId} d={d} nowMs={nowMs} busy={busy} onRevoke={() => setConfirm({ kind: 'revoke', d })} onResync={() => setConfirm({ kind: 'resync', d })} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
