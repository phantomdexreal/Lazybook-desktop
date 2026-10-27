/*
LazyBooks | src/renderer/pages/Status.tsx
Responsibility: Status dashboard
Introduced by: Phase 33 (ui-status) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 33)
*/

import {
  ArrowCircleUp,
  CheckCircle,
  ToggleLeft,
  DeviceMobile,
  Database,
  KeyReturn,
  PlugsConnected,
  Prohibit,
  Tray,
  WarningCircle,
  type Icon,
} from '@phosphor-icons/react';
import { useEffect, useState, type ReactNode } from 'react';
import type { Status as StatusT, UpdateView } from '../../shared/ipc';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/Shell';
import { SyncProgress } from '../components/SyncProgress';
import { bannerText } from '../lib/updateView';
import { COUNT_LABELS, FLAG_LABELS, ago, daysLeft, formatCount, headline, until, type Level } from '../lib/statusView';

const LEVEL_TEXT: Record<Level, string> = {
  ok: 'text-lb-success',
  warn: 'text-lb-warning',
  bad: 'text-lb-danger',
  idle: 'text-lb-muted',
};
const LEVEL_ICON: Record<Level, Icon> = { ok: CheckCircle, warn: WarningCircle, bad: Prohibit, idle: PlugsConnected };

function Card({ title, icon: IconC, children }: { title: string; icon: Icon; children: ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-lb-lg border border-lb-border bg-lb-surface p-4">
      <h2 className="m-0 flex items-center gap-2 text-sm font-semibold text-lb-text">
        <IconC size={18} weight="duotone" className="text-lb-accent" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, value, tone }: { label: string; value: ReactNode; tone?: Level }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-lb-muted">{label}</span>
      <span className={`min-w-0 truncate text-right font-medium ${tone ? LEVEL_TEXT[tone] : 'text-lb-text'}`}>{value}</span>
    </div>
  );
}

export function StatusPage() {
  const [status, setStatus] = useState<StatusT | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [upd, setUpd] = useState<UpdateView | null>(null);
  useEffect(() => {
    void window.lb.status.get().then(setStatus);
    void window.lb.update.state().then(setUpd);
    const off = window.lb.status.onEvent((p) => setStatus((s) => (s ? { ...s, ...p } : s)));
    // "5 min ago" must keep moving, and a missed event must not leave the page stale
    const tick = window.setInterval(() => setNowMs(Date.now()), 15_000);
    const poll = window.setInterval(() => {
      void window.lb.status.get().then(setStatus);
      void window.lb.update.state().then(setUpd);
    }, 30_000);
    return () => {
      off();
      window.clearInterval(tick);
      window.clearInterval(poll);
    };
  }, []);

  if (!status) return <PageHeader title="Status" subtitle="Loading." />;
  if (!status.license) {
    return (
      <>
        <PageHeader title="Status" subtitle="Connector health, Tally connection and sync progress." />
        <EmptyState icon={PlugsConnected} title="Not activated">
          This connector has no license yet. Until it is activated nothing is read from Tally.
        </EmptyState>
      </>
    );
  }

  const h = headline(status, nowMs);
  const HIcon = LEVEL_ICON[h.level];
  const d = status.detail;
  const left = daysLeft(status.license.expiresAt, nowMs);
  const flags = Object.entries(d?.flags ?? {});

  return (
    <>
      <PageHeader title="Status" subtitle={status.license.companyName ?? 'Connector health, Tally connection and sync progress.'} />

      <div role="status" className="mb-4 flex items-start gap-3 rounded-lb-lg border border-lb-border bg-lb-surface p-4">
        <HIcon size={28} weight="duotone" className={LEVEL_TEXT[h.level]} aria-hidden="true" />
        <div className="min-w-0">
          <p className={`m-0 text-base font-semibold ${LEVEL_TEXT[h.level]}`}>{h.title}</p>
          <p className="m-0 mt-1 text-sm text-lb-muted">{h.text}</p>
        </div>
      </div>

      <SyncProgress lastSyncAt={status.lastSyncAt} nextRunAt={d?.sync?.nextRunAt} nowMs={nowMs} />

      {status.update?.available ? (
        <div className="mb-4 flex items-center gap-3 rounded-lb-lg border border-lb-border bg-lb-accent-soft p-3 text-sm text-lb-accent">
          <ArrowCircleUp size={20} weight="duotone" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            {bannerText(upd, status.update.version ?? null)}
          </span>
          {upd?.phase === 'ready' ? (
            <button type="button" className={'lb-seg flex shrink-0 items-center gap-2 rounded-lb-md border border-lb-border bg-lb-surface px-3 py-2 text-sm text-lb-text hover:bg-lb-sunken disabled:opacity-50'} onClick={() => void window.lb.update.install()}>Restart and update</button>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <Card title="Tally" icon={PlugsConnected}>
          <Row label="Connection" value={status.tally.ok ? 'Connected' : 'Not connected'} tone={status.tally.ok ? 'ok' : 'bad'} />
          <Row label="Company" value={status.tally.company ?? '-'} />
          <Row label="Version" value={status.tally.version ?? '-'} />
        </Card>

        <Card title="Sync" icon={Database}>
          <Row label="Last sync" value={ago(status.lastSyncAt, nowMs)} />
          <Row label="Next sync" value={d?.sync?.paused ? 'Paused' : d?.sync?.running ? 'Running now' : until(d?.sync?.nextRunAt, nowMs)} />
          <Row label="Internet" value={status.internet ? 'Online' : 'Offline'} tone={status.internet ? 'ok' : 'warn'} />
        </Card>

        <Card title="Devices and entries" icon={DeviceMobile}>
          <Row label="Devices online" value={formatCount(status.devicesOnline)} />
          <Row label="Entries waiting" value={formatCount(status.pendingEntries)} />
          <Row label="Entries failed" value={formatCount(d?.entries ? d.entries.failed + d.entries.needsReview : undefined)} tone={d?.entries && d.entries.failed + d.entries.needsReview > 0 ? 'warn' : undefined} />
        </Card>

        <Card title="Data on this PC" icon={Tray}>
          {Object.keys(status.counts).length === 0 ? (
            <p className="m-0 text-sm text-lb-muted">No data yet. Counts appear after the first sync.</p>
          ) : (
            COUNT_LABELS.map(({ table, label }) => <Row key={table} label={label} value={formatCount(status.counts[table])} />)
          )}
        </Card>

        <Card title="License" icon={KeyReturn}>
          <Row label="Key" value={status.license.licenseKey || '-'} />
          <Row label="Plan" value={status.license.plan ?? 'Not reported'} />
          <Row
            label="Valid until"
            value={status.license.expiresAt ? `${status.license.expiresAt.slice(0, 10)}${left !== null && left >= 0 && left <= 30 ? ` (${left} days)` : ''}` : 'No end date'}
            tone={left !== null && left < 0 ? 'bad' : left !== null && left <= 30 ? 'warn' : undefined}
          />
          {d?.limits ? <Row label="Devices / companies" value={`${d.limits.maxDevices} / ${d.limits.maxCompanies}`} /> : null}
        </Card>

        <Card title="Features" icon={ToggleLeft}>
          {flags.length === 0 ? (
            <p className="m-0 text-sm text-lb-muted">Not known yet.</p>
          ) : (
            flags.map(([k, v]) => <Row key={k} label={FLAG_LABELS[k] ?? k.replace(/_/g, ' ')} value={v ? 'On' : 'Off'} tone={v ? 'ok' : 'idle'} />)
          )}
        </Card>
      </div>

      {status.errors.length > 0 ? (
        <section className="mt-4 rounded-lb-lg border border-lb-border bg-lb-surface p-4" aria-label="Problems">
          <h2 className="m-0 mb-2 flex items-center gap-2 text-sm font-semibold text-lb-danger">
            <WarningCircle size={18} weight="duotone" aria-hidden="true" />
            Problems ({status.errors.length})
          </h2>
          <ul className="m-0 flex list-none flex-col gap-1 p-0 text-sm text-lb-text">
            {status.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
