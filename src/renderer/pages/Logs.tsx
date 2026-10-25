/*
LazyBooks | src/renderer/pages/Logs.tsx
Responsibility: Logs viewer
Introduced by: Phase 34 (ui-logs) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 34)
*/

import { ArrowClockwise, DownloadSimple, ListMagnifyingGlass, MagnifyingGlass } from '@phosphor-icons/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LogLevelName, LogsExportResult, LogsTailResult } from '../../shared/ipc';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/Shell';
import { LEVELS, LEVEL_TEXT, LEVEL_WORD, MODULES, countText, dataPretty, dataPreview, formatTime } from '../lib/logView';

const field = 'lb-field rounded-lb-md border border-lb-border bg-lb-surface px-3 py-2 text-sm text-lb-text';
const btn =
  'lb-seg flex items-center gap-2 rounded-lb-md border border-lb-border bg-lb-surface px-3 py-2 text-sm text-lb-text hover:bg-lb-sunken';

export function LogsPage() {
  const [level, setLevel] = useState<LogLevelName | 'all'>('all');
  const [mod, setMod] = useState('');
  const [q, setQ] = useState('');
  const [auto, setAuto] = useState(true);
  const [res, setRes] = useState<LogsTailResult | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [exp, setExp] = useState<LogsExportResult | null>(null);
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);

  const load = useCallback(async () => {
    const my = ++seq.current;
    const r = await window.lb.logs.tail({
      ...(level !== 'all' ? { level } : {}),
      ...(mod ? { mod } : {}),
      ...(q.trim() ? { q: q.trim() } : {}),
      limit: 200,
    });
    if (my === seq.current) setRes(r); // ignore an answer that a newer filter has overtaken
  }, [level, mod, q]);

  // typing in the search box waits a moment so each key does not read the files
  useEffect(() => {
    const t = window.setTimeout(() => void load(), 250);
    return () => window.clearTimeout(t);
  }, [load]);
  useEffect(() => {
    if (!auto) return;
    const t = window.setInterval(() => void load(), 5000);
    return () => window.clearInterval(t);
  }, [auto, load]);

  async function doExport() {
    setBusy(true);
    try {
      setExp(await window.lb.logs.export());
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Logs" subtitle="What the connector has been doing. Passwords, tokens and keys are removed." />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-lb-muted">
          Show
          <select className={field} value={level} onChange={(e) => setLevel(e.target.value as LogLevelName | 'all')} aria-label="Level">
            {LEVELS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-lb-muted">
          Area
          <select className={field} value={mod} onChange={(e) => setMod(e.target.value)} aria-label="Area">
            <option value="">All</option>
            {MODULES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-48 flex-1 items-center gap-2 rounded-lb-md border border-lb-border bg-lb-surface px-3 text-sm text-lb-text">
          <MagnifyingGlass size={16} className="text-lb-muted" aria-hidden="true" />
          <input
            className="lb-field w-full border-0 bg-transparent py-2 text-lb-text outline-none"
            placeholder="Search messages and details"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-lb-muted">
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
          Live
        </label>
        <button type="button" className={btn} onClick={() => void load()}>
          <ArrowClockwise size={16} aria-hidden="true" />
          Refresh
        </button>
        <button type="button" className={btn} onClick={() => void doExport()} disabled={busy}>
          <DownloadSimple size={16} aria-hidden="true" />
          Export
        </button>
      </div>

      {exp ? (
        <p role="status" className={`m-0 mb-3 text-sm ${exp.ok ? 'text-lb-success' : exp.canceled ? 'text-lb-muted' : 'text-lb-danger'}`}>
          {exp.ok ? `Saved ${exp.lines} lines to ${exp.path}` : exp.message}
        </p>
      ) : null}

      {!res ? (
        <p className="text-sm text-lb-muted">Loading.</p>
      ) : res.lines.length === 0 ? (
        <EmptyState icon={ListMagnifyingGlass} title="No log lines match">
          {level !== 'all' || mod || q ? 'Try a wider filter.' : 'Nothing has been logged yet.'}
        </EmptyState>
      ) : (
        <>
          <p className="m-0 mb-2 text-xs text-lb-muted">
            {countText(res.lines.length, res.truncated)}
            {res.skipped > 0 ? `. ${res.skipped} damaged line${res.skipped === 1 ? '' : 's'} left out.` : ''}
          </p>
          <ul className="m-0 flex list-none flex-col divide-y divide-lb-border overflow-hidden rounded-lb-lg border border-lb-border bg-lb-surface p-0">
            {res.lines.map((l, i) => {
              const key = `${l.t}-${i}`;
              const preview = dataPreview(l);
              const isOpen = open === key;
              return (
                <li key={key}>
                  <button
                    type="button"
                    className="lb-seg block w-full bg-transparent px-3 py-2 text-left text-sm text-lb-text hover:bg-lb-sunken"
                    onClick={() => setOpen(isOpen ? null : key)}
                    aria-expanded={l.data ? isOpen : undefined}
                  >
                    <span className="mr-3 text-xs text-lb-muted">{formatTime(l.t)}</span>
                    <span className={`mr-3 text-xs font-semibold ${LEVEL_TEXT[l.lvl]}`}>{LEVEL_WORD[l.lvl]}</span>
                    <span className="mr-3 text-xs text-lb-accent">{l.mod}</span>
                    <span>{l.msg}</span>
                    {preview && !isOpen ? <span className="ml-3 text-xs text-lb-faint">{preview}</span> : null}
                  </button>
                  {isOpen && l.data ? (
                    <pre className="m-0 overflow-auto bg-lb-sunken px-3 py-2 text-xs text-lb-text">{dataPretty(l)}</pre>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
