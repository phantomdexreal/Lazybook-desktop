/*
LazyBooks | src/renderer/pages/Tools.tsx
Responsibility: Maintenance tools
Introduced by: Phase 37 (ui-tools) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 37)
*/

import { ArrowsClockwise, DownloadSimple, FolderOpen, Trash, Wrench } from '@phosphor-icons/react';
import { useState, type ReactNode } from 'react';
import type { ToolResultView } from '../../shared/ipc';
import { PageHeader } from '../components/Shell';

type ToolId = 'resync' | 'reset' | 'diagnostics' | 'folder';

const btn =
  'lb-seg flex shrink-0 items-center gap-2 rounded-lb-md border border-lb-border bg-lb-surface px-3 py-2 text-sm text-lb-text hover:bg-lb-sunken disabled:opacity-50';

function Tool({ icon: IconC, title, text, action, children }: { icon: typeof Wrench; title: string; text: string; action: ReactNode; children?: ReactNode }) {
  return (
    <li className="border-b border-lb-border px-4 py-4 last:border-b-0">
      <div className="flex flex-wrap items-center gap-3">
        <IconC size={22} weight="light" className="shrink-0 text-lb-accent" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-lb-text">{title}</div>
          <p className="m-0 mt-1 text-sm text-lb-muted">{text}</p>
        </div>
        {action}
      </div>
      {children}
    </li>
  );
}

export function ToolsPage() {
  const [busy, setBusy] = useState<ToolId | null>(null);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [word, setWord] = useState('');

  async function run(id: ToolId, call: () => Promise<ToolResultView>) {
    setBusy(id);
    setNote(null);
    try {
      const r = await call();
      if (r.ok) setNote({ ok: true, text: r.path ? `${r.message} Saved to ${r.path}` : r.message });
      else if (!('canceled' in r && r.canceled)) setNote({ ok: false, text: r.message });
    } finally {
      setBusy(null);
    }
  }

  const locked = busy !== null;
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Tools" subtitle="Fix sync problems yourself and collect what support needs." />
      {note ? (
        <p role="status" className={`mb-4 rounded-lb-md border border-lb-border bg-lb-surface px-4 py-3 text-sm ${note.ok ? 'text-lb-text' : 'text-lb-danger'}`}>{note.text}</p>
      ) : null}
      <ul className="m-0 list-none rounded-lb-lg border border-lb-border bg-lb-surface p-0">
        <Tool
          icon={ArrowsClockwise}
          title="Full resync"
          text="Read every master and the whole financial year from Tally again. Your data stays in place while it runs. Use this when numbers on a phone look wrong."
          action={<button type="button" className={btn} disabled={locked} onClick={() => void run('resync', () => window.lb.tools.resync())}>{busy === 'resync' ? 'Starting' : 'Start full resync'}</button>}
        />
        <Tool
          icon={Trash}
          title="Reset vault"
          text="Delete the local data store and build it again from Tally. Your license, login and passphrase are kept. Paired phones receive a full copy on their next sync. Use this only if a full resync did not help."
          action={<button type="button" className={btn} disabled={locked} onClick={() => { setConfirmReset(true); setWord(''); }}>Reset vault</button>}
        >
          {confirmReset ? (
            <div role="alertdialog" aria-label="Confirm reset" className="mt-3 rounded-lb-md border border-lb-border bg-lb-sunken p-3">
              <p className="m-0 text-sm text-lb-text">This deletes the local data and its backups. Type RESET to continue.</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input aria-label="Type RESET" value={word} onChange={(e) => setWord(e.target.value)} className="lb-field rounded-lb-md border border-lb-border bg-lb-surface px-3 py-2 text-sm text-lb-text" />
                <button type="button" className={btn} onClick={() => setConfirmReset(false)}>Cancel</button>
                <button
                  type="button"
                  disabled={locked || word !== 'RESET'}
                  className="rounded-lb-md bg-lb-accent px-4 py-2 text-sm text-lb-accent-contrast disabled:opacity-50"
                  onClick={() => { setConfirmReset(false); void run('reset', () => window.lb.tools.reset('RESET')); }}
                >
                  Delete and resync
                </button>
              </div>
            </div>
          ) : null}
        </Tool>
        <Tool
          icon={DownloadSimple}
          title="Export diagnostics"
          text="Save one zip with a summary and the logs for support. It holds no company data, no passphrase and no license key."
          action={<button type="button" className={btn} disabled={locked} onClick={() => void run('diagnostics', () => window.lb.tools.diagnostics())}>{busy === 'diagnostics' ? 'Saving' : 'Export zip'}</button>}
        />
        <Tool
          icon={FolderOpen}
          title="Open data folder"
          text="Show the folder where LazyBooks keeps its logs, settings and local data."
          action={<button type="button" className={btn} disabled={locked} onClick={() => void run('folder', () => window.lb.tools.openFolder())}>Open folder</button>}
        />
      </ul>
    </div>
  );
}
