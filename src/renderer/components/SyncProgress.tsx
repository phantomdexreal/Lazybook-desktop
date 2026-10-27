/*
LazyBooks | src/renderer/components/SyncProgress.tsx
Responsibility: Sync progress card for the Status page (bar, counts, speed, time left, retry line, idle line)
Introduced by: Phase 46 (sync-progress) - docs/specs/sync-progress.md
STATUS: IMPLEMENTED (Phase 46)
Subscribes to `lb:sync:progress` (never polls). Shown only when a run is large enough or lasts longer than 2 s; otherwise it collapses to one line.
*/

import { ArrowsClockwise, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import type { SyncProgress as SyncProgressT } from '../../shared/ipc';
import { ago, until } from '../lib/statusView';
import { cardVisible, progressCard } from '../lib/progressView';

interface Props {
  lastSyncAt: string | null;
  nextRunAt: string | null | undefined;
  nowMs: number;
}

export function SyncProgress({ lastSyncAt, nextRunAt, nowMs }: Props) {
  const [p, setP] = useState<SyncProgressT | null>(null);
  const [stageForMs, setStageForMs] = useState(0);
  const stage = useRef<{ key: string; since: number } | null>(null);

  useEffect(() => {
    void window.lb.sync.current().then((c) => c && setP((x) => x ?? c));
    return window.lb.sync.onProgress(setP);
  }, []);

  // how long the current stage of the current run has lasted (the card stays hidden for quiet cycles until 2 s)
  useEffect(() => {
    if (!p) return;
    const key = `${p.runId}:${p.stage}`;
    if (stage.current?.key !== key) stage.current = { key, since: Date.now() };
    setStageForMs(Date.now() - stage.current.since);
    const t = window.setTimeout(() => setStageForMs(Date.now() - (stage.current?.since ?? Date.now())), 2100);
    return () => window.clearTimeout(t);
  }, [p]);

  const visible = cardVisible(p, stageForMs);
  if (!p || !visible) {
    if (p && p.stage !== 'idle' && p.stage !== 'done' && p.stage !== 'failed') return null; // a quiet cycle in progress: nothing, no flashing
    return (
      <div className="mb-4 flex items-center gap-2 px-1 text-sm text-lb-muted" role="status">
        <CheckCircle size={18} weight="duotone" className="text-lb-success" aria-hidden="true" />
        <span>Up to date. Last sync {ago(lastSyncAt, nowMs)}.</span>
      </div>
    );
  }
  const c = progressCard(p);
  const bad = c.tone === 'bad';
  const Icon = bad ? WarningCircle : ArrowsClockwise;
  return (
    <section className="mb-4 flex flex-col gap-3 rounded-lb-lg border border-lb-border bg-lb-surface p-4" aria-live="polite">
      <div className="flex items-start gap-3">
        <Icon size={24} weight="duotone" className={bad ? 'text-lb-danger' : 'text-lb-accent'} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className={`m-0 text-base font-semibold ${bad ? 'text-lb-danger' : 'text-lb-text'}`}>{c.headline}</p>
          {bad ? (
            <p className="m-0 mt-1 text-sm text-lb-muted">{nextRunAt ? `Will retry ${until(nextRunAt, nowMs)}.` : 'Will retry soon.'}</p>
          ) : c.details.length > 0 ? (
            <p className="m-0 mt-1 text-sm text-lb-muted">{c.details.join(' · ')}</p>
          ) : null}
        </div>
      </div>
      {bad ? null : (
        <div
          role="progressbar"
          aria-label={c.label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={c.percent ?? undefined}
          aria-valuetext={c.percent === null ? c.label : `${c.label}`}
          className="h-2 w-full overflow-hidden rounded-full bg-lb-sunken"
        >
          <div
            className={c.percent === null ? 'lb-indeterminate h-full w-1/3 rounded-full bg-lb-accent' : 'h-full rounded-full bg-lb-accent transition-[width] duration-500 ease-out'}
            style={c.percent === null ? undefined : { width: `${c.percent}%` }}
          />
        </div>
      )}
    </section>
  );
}
