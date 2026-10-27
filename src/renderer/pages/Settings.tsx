/*
LazyBooks | src/renderer/pages/Settings.tsx
Responsibility: Settings
Introduced by: Phase 35 (ui-settings) — see PHASES.md before editing.
STATUS: IMPLEMENTED (Phase 35; Tally, passphrase and license blocks from Phases 7, 21 and 5)
*/

import { useEffect, useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { PageHeader } from '../components/Shell';
import type { ActivationState, CryptoStatusView, PairingView, SettingsView, TallyDetectionView, ThemeMode, UpdateView } from '../../shared/ipc';
import { BATCH_PRESETS, autoUpdatePatch, batchSizeDefaultText, batchSizeError, batchSizeHelp, batchSizePatch, fyText, isDirty, toForm, toPatch, validate, type FormState } from '../lib/settingsForm';
import { canCheckNow, checkWaitSeconds, notesText, statusLine } from '../lib/updateView';

const MODES: Array<{ id: ThemeMode; label: string }> = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

function LicenseBlock() {
  const [a, setA] = useState<ActivationState | null>(null);
  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    void window.lb.activation.get().then(setA);
    return window.lb.activation.onEvent(setA);
  }, []);
  if (!a) return null;
  return (
    <section aria-labelledby="license" className="mt-6 max-w-xl rounded-lb-lg border border-lb-border bg-lb-surface p-6">
      <h2 id="license" className="m-0 mb-4 text-base font-semibold text-lb-text">License</h2>
      <dl className="m-0 grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
        <dt className="text-lb-muted">Company</dt><dd className="m-0 text-lb-text">{a.companyName ?? 'Unknown'}</dd>
        <dt className="text-lb-muted">License key</dt><dd className="m-0 font-mono text-lb-text">{a.licenseKeyMasked}</dd>
        <dt className="text-lb-muted">Connector login</dt><dd className="m-0 text-lb-text">{a.email}</dd>
        <dt className="text-lb-muted">Expires</dt><dd className="m-0 text-lb-text">{a.expiresAt ? new Date(a.expiresAt).toLocaleDateString() : 'No expiry'}</dd>
        <dt className="text-lb-muted">Registry</dt><dd className="m-0 text-lb-text">{a.offline ? 'Offline, using saved settings' : 'Connected'}</dd>
      </dl>
      <div className="mt-5">
        {confirm ? (
          <span className="flex items-center gap-3 text-sm">
            <span className="text-lb-text">Forget this license and sign out on this PC?</span>
            <button type="button" className="rounded-lb-md bg-lb-danger px-3 py-1.5 text-lb-accent-contrast" onClick={() => void window.lb.activation.deactivate()}>Deactivate</button>
            <button type="button" className="text-lb-muted underline" onClick={() => setConfirm(false)}>Cancel</button>
          </span>
        ) : (
          <button type="button" className="text-sm text-lb-muted underline" onClick={() => setConfirm(true)}>Deactivate this PC</button>
        )}
      </div>
    </section>
  );
}

function TallyBlock() {
  const [d, setD] = useState<TallyDetectionView | null>(null);
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('9000');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    void window.lb.tally.get().then((v) => {
      if (v) {
        setD(v);
        setHost(v.host);
        setPort(String(v.port));
      }
    });
    return window.lb.status.onEvent(() => {
      void window.lb.tally.get().then((v) => v && setD(v));
    });
  }, []);
  const portNum = Number(port);
  const valid = /^[A-Za-z0-9.-]+$/.test(host) && Number.isInteger(portNum) && portNum >= 1 && portNum <= 65535;
  const run = async (fn: () => Promise<TallyDetectionView | null>) => {
    setBusy(true);
    try {
      const v = await fn();
      if (v) setD(v);
    } finally {
      setBusy(false);
    }
  };
  const tone = d?.ok ? 'text-lb-success' : d?.state === 'choose_company' || d?.state === 'no_company' ? 'text-lb-warning' : 'text-lb-danger';
  return (
    <section aria-labelledby="tally" className="mt-6 max-w-xl rounded-lb-lg border border-lb-border bg-lb-surface p-6">
      <h2 id="tally" className="m-0 mb-4 text-base font-semibold text-lb-text">Tally</h2>
      <div className="grid grid-cols-[1fr_7rem] gap-3">
        <div>
          <label htmlFor="tally-host" className="mb-1 block text-sm text-lb-muted">Host</label>
          <input id="tally-host" value={host} onChange={(e) => setHost(e.target.value)} className="lb-field w-full rounded-lb-md border border-lb-border-strong bg-lb-sunken px-3 py-2 text-sm text-lb-text" />
        </div>
        <div>
          <label htmlFor="tally-port" className="mb-1 block text-sm text-lb-muted">Port</label>
          <input id="tally-port" inputMode="numeric" value={port} onChange={(e) => setPort(e.target.value)} className="lb-field w-full rounded-lb-md border border-lb-border-strong bg-lb-sunken px-3 py-2 text-sm text-lb-text" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="button" disabled={busy || !valid} onClick={() => void run(() => window.lb.tally.set(host.trim(), portNum))} className="rounded-lb-md bg-lb-accent px-4 py-2 text-sm text-lb-accent-contrast disabled:opacity-50">
          {busy ? 'Testing' : 'Save and test'}
        </button>
        {!valid ? <span className="text-sm text-lb-danger">Enter a host name and a port from 1 to 65535.</span> : null}
      </div>
      {d ? (
        <div className="mt-5" role="status">
          <p className={`m-0 text-sm ${tone}`}>{d.message}</p>
          {d.version ? <p className="mb-0 mt-2 text-sm text-lb-muted">Version: <span className="font-mono text-lb-text">{d.version}</span></p> : null}
          {d.companies.length > 0 ? (
            <ul className="m-0 mt-3 list-none p-0">
              {d.companies.map((c) => {
                const key = c.guid ?? c.name;
                const active = d.selected !== null && (d.selected.guid ?? d.selected.name) === key;
                return (
                  <li key={key} className="mb-2 flex items-center justify-between rounded-lb-md border border-lb-border px-3 py-2 text-sm">
                    <span className="text-lb-text">{c.name}{c.startingFrom && c.endingAt ? <span className="ml-2 text-lb-muted">{c.startingFrom} to {c.endingAt}</span> : null}</span>
                    {active ? <span className="text-lb-success">Selected</span> : <button type="button" className="text-lb-muted underline" onClick={() => void run(() => window.lb.tally.selectCompany(key))}>Use this company</button>}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : (
        <p className="mb-0 mt-5 text-sm text-lb-muted">Checking for TallyPrime.</p>
      )}
    </section>
  );
}

/** Data passphrase wizard (Phase 21): set it once, then show the pairing QR (no secret in it) for new devices. */
function SecurityBlock() {
  const [st, setSt] = useState<CryptoStatusView | null>(null);
  const [pair, setPair] = useState<PairingView | null>(null);
  const [changing, setChanging] = useState(false);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const refresh = async () => {
    const s = await window.lb.crypto.get();
    setSt(s);
    setPair(s.configured ? await window.lb.pairing.get() : null);
  };
  useEffect(() => {
    void refresh();
  }, []);
  if (!st) return null;
  const editing = !st.configured || changing;
  const min = st.minLength;
  const problem = p1.length < min ? `Use at least ${min} characters.` : p1 !== p2 ? 'The two entries do not match.' : null;
  const save = async () => {
    setBusy(true);
    setErr(null);
    try {
      const r = await window.lb.crypto.setup(p1);
      if (r.ok) {
        setP1('');
        setP2('');
        setChanging(false);
        await refresh();
      } else {
        setErr(r.message);
      }
    } finally {
      setBusy(false);
    }
  };
  return (
    <section aria-labelledby="security" className="mt-6 max-w-xl rounded-lb-lg border border-lb-border bg-lb-surface p-6">
      <h2 id="security" className="m-0 mb-2 text-base font-semibold text-lb-text">Data passphrase</h2>
      <p className="m-0 mb-4 text-sm text-lb-muted">
        Your data is encrypted on this PC before it is sent to your phones and other devices. Only people who know this passphrase can read it. It is never sent anywhere; write it down, because it cannot be recovered.
      </p>
      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!problem) void save();
          }}
        >
          {changing ? <p className="mt-0 text-sm text-lb-warning">Changing the passphrase disconnects every paired device. They must be paired again with the new one.</p> : null}
          <label htmlFor="pp1" className="mb-1 block text-sm text-lb-muted">Passphrase</label>
          <input id="pp1" type="password" autoComplete="new-password" value={p1} onChange={(e) => setP1(e.target.value)} className="lb-field mb-3 w-full rounded-lb-md border border-lb-border-strong bg-lb-sunken px-3 py-2 text-sm text-lb-text" />
          <label htmlFor="pp2" className="mb-1 block text-sm text-lb-muted">Type it again</label>
          <input id="pp2" type="password" autoComplete="new-password" value={p2} onChange={(e) => setP2(e.target.value)} className="lb-field mb-3 w-full rounded-lb-md border border-lb-border-strong bg-lb-sunken px-3 py-2 text-sm text-lb-text" />
          <div className="flex items-center gap-3">
            <button type="submit" disabled={busy || !!problem} className="rounded-lb-md bg-lb-accent px-4 py-2 text-sm text-lb-accent-contrast disabled:opacity-50">{busy ? 'Saving' : 'Save passphrase'}</button>
            {changing ? <button type="button" className="text-sm text-lb-muted underline" onClick={() => setChanging(false)}>Cancel</button> : null}
            {problem && (p1 || p2) ? <span className="text-sm text-lb-muted">{problem}</span> : null}
          </div>
          {err ? <p role="alert" className="mb-0 mt-3 text-sm text-lb-danger">{err}</p> : null}
        </form>
      ) : (
        <div>
          <p className={`m-0 text-sm ${st.state === 'ready' ? 'text-lb-success' : 'text-lb-warning'}`}>
            {st.state === 'ready' ? 'Passphrase is set and unlocked on this PC.' : 'A passphrase is set, but this PC could not unlock it. Set it again to continue syncing.'}
          </p>
          {pair ? (
            <div className="mt-4 flex items-start gap-5">
              <div className="h-40 w-40 shrink-0 rounded-lb-md border border-lb-border bg-lb-sunken p-2 text-lb-text" dangerouslySetInnerHTML={{ __html: pair.qrSvg }} />
              <p className="m-0 text-sm text-lb-muted">Scan this on a new phone to pair it. The code holds no secret: the person pairing still types the passphrase.</p>
            </div>
          ) : null}
          <div className="mt-4">
            <button type="button" className="text-sm text-lb-muted underline" onClick={() => setChanging(true)}>Change passphrase</button>
          </div>
        </div>
      )}
    </section>
  );
}

const inputCls = 'lb-field w-full rounded-lb-md border border-lb-border-strong bg-lb-sunken px-3 py-2 text-sm text-lb-text';

/** Sync, startup, cloud copy and language (Phase 35). One Save for the whole block; nothing is applied until then. */
function PreferencesBlock() {
  const [s, setS] = useState<SettingsView | null>(null);
  const [f, setF] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    void window.lb.settings.get().then((v) => {
      setS(v);
      setF(toForm(v));
    });
  }, []);
  if (!s || !f) return null;
  const errs = validate(f, s);
  const bad = Object.keys(errs).length > 0;
  const dirty = isDirty(f, s);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setF({ ...f, [k]: v });
    setMsg(null);
  };
  const save = async () => {
    setBusy(true);
    try {
      const r = await window.lb.settings.set(toPatch(f, s));
      setS(r.settings);
      setF(toForm(r.settings));
      setMsg(r.ok ? { ok: true, text: 'Saved.' } : { ok: false, text: r.message });
    } finally {
      setBusy(false);
    }
  };
  const err = (k: keyof FormState) => (errs[k] ? <p role="alert" className="m-0 mt-1 text-xs text-lb-danger">{errs[k]}</p> : null);
  return (
    <section aria-labelledby="prefs" className="mt-6 max-w-xl rounded-lb-lg border border-lb-border bg-lb-surface p-6">
      <h2 id="prefs" className="m-0 mb-4 text-base font-semibold text-lb-text">Sync and startup</h2>
      <dl className="m-0 mb-5 grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
        <dt className="text-lb-muted">Company</dt><dd className="m-0 text-lb-text">{s.company?.name ?? 'None selected (choose one under Tally)'}</dd>
        <dt className="text-lb-muted">Financial year</dt><dd className="m-0 text-lb-text">{fyText(s.fy)}</dd>
      </dl>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!bad && dirty) void save();
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="set-interval" className="mb-1 block text-sm text-lb-muted">Sync every (minutes)</label>
            <input id="set-interval" inputMode="numeric" value={f.intervalMin} onChange={(e) => set('intervalMin', e.target.value)} className={inputCls} />
            {err('intervalMin')}
          </div>
          <div>
            <label htmlFor="set-lookback" className="mb-1 block text-sm text-lb-muted">Re-read last (days)</label>
            <input id="set-lookback" inputMode="numeric" value={f.lookbackDays} onChange={(e) => set('lookbackDays', e.target.value)} className={inputCls} />
            {err('lookbackDays')}
          </div>
        </div>
        <p className="mb-0 mt-2 text-xs text-lb-muted">Re-reading recent days catches vouchers edited in Tally. Changes apply from the next sync. The Tally address and company are set under Tally below.</p>

        <label className="mt-4 flex items-center gap-2 text-sm text-lb-text">
          <input type="checkbox" checked={f.autostart} onChange={(e) => set('autostart', e.target.checked)} />
          Start LazyBooks when I sign in to Windows
        </label>
        <label className={`mt-3 flex items-center gap-2 text-sm ${s.cloudCopyAllowed ? 'text-lb-text' : 'text-lb-muted'}`}>
          <input type="checkbox" checked={f.cloudCopy} disabled={!s.cloudCopyAllowed && !s.cloudCopy} onChange={(e) => set('cloudCopy', e.target.checked)} />
          Keep an encrypted copy in the cloud for new devices
        </label>
        {!s.cloudCopyAllowed ? <p className="m-0 mt-1 text-xs text-lb-muted">Not part of your plan{s.cloudCopy ? ', so it is not active' : ''}.</p> : null}

        <label htmlFor="set-lang" className="mb-1 mt-4 block text-sm text-lb-muted">Language</label>
        <select id="set-lang" value={f.language} onChange={(e) => set('language', e.target.value as FormState['language'])} className={inputCls}>
          {s.languages.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>

        <div className="mt-5 flex items-center gap-3">
          <button type="submit" disabled={busy || bad || !dirty} className="rounded-lb-md bg-lb-accent px-4 py-2 text-sm text-lb-accent-contrast disabled:opacity-50">{busy ? 'Saving' : 'Save'}</button>
          {dirty ? <button type="button" className="text-sm text-lb-muted underline" onClick={() => { setF(toForm(s)); setMsg(null); }}>Discard changes</button> : null}
          {msg ? <span role="status" className={`text-sm ${msg.ok ? 'text-lb-success' : 'text-lb-danger'}`}>{msg.text}</span> : null}
        </div>
      </form>
    </section>
  );
}

/** Phase 47: vouchers per Tally request. Saved with its own button; a change applies from the next sync run. */
function SyncingBlock() {
  const [s, setS] = useState<SettingsView | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    void window.lb.settings.get().then((v) => {
      setS(v);
      setText(String(v.voucherBatchSize));
    });
  }, []);
  if (!s) return null;
  const problem = batchSizeError(text, s);
  const patch = problem ? {} : batchSizePatch(text, s);
  const dirty = Object.keys(patch).length > 0;
  const save = async () => {
    setBusy(true);
    try {
      const r = await window.lb.settings.set(patch);
      setS(r.settings);
      setText(String(r.settings.voucherBatchSize));
      setMsg(r.ok ? { ok: true, text: 'Saved. It applies from the next sync.' } : { ok: false, text: r.message });
    } finally {
      setBusy(false);
    }
  };
  return (
    <section aria-labelledby="syncing" className="mt-6 max-w-xl rounded-lb-lg border border-lb-border bg-lb-surface p-6">
      <h2 id="syncing" className="m-0 mb-4 text-base font-semibold text-lb-text">Syncing</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!problem && dirty) void save();
        }}
      >
        <label htmlFor="set-batch" className="mb-1 block text-sm text-lb-muted">Vouchers per batch</label>
        <input
          id="set-batch"
          inputMode="numeric"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setMsg(null);
          }}
          className={inputCls}
        />
        {problem ? <p role="alert" className="m-0 mt-1 text-xs text-lb-danger">{problem}</p> : null}
        <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Presets">
          {BATCH_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={text.trim() === String(n)}
              onClick={() => {
                setText(String(n));
                setMsg(null);
              }}
              className={`lb-seg rounded-lb-md border border-lb-border-strong px-3 py-1 text-sm ${text.trim() === String(n) ? 'bg-lb-accent text-lb-accent-contrast' : 'bg-lb-sunken text-lb-text hover:bg-lb-surface-raised'}`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className="text-sm text-lb-muted underline"
            onClick={() => {
              setText(batchSizeDefaultText());
              setMsg(null);
            }}
          >
            Reset to default
          </button>
        </div>
        <p className="mb-0 mt-3 text-xs text-lb-muted">{batchSizeHelp(s)}</p>
        <div className="mt-5 flex items-center gap-3">
          <button type="submit" disabled={busy || !!problem || !dirty} className="rounded-lb-md bg-lb-accent px-4 py-2 text-sm text-lb-accent-contrast disabled:opacity-50">{busy ? 'Saving' : 'Save'}</button>
          {msg ? <span role="status" className={`text-sm ${msg.ok ? 'text-lb-success' : 'text-lb-danger'}`}>{msg.text}</span> : null}
        </div>
      </form>
    </section>
  );
}

/** Phase 47: automatic update switch (saved at once), Check now, status line, release notes as plain text, Restart and update. */
function UpdatesBlock() {
  const [s, setS] = useState<SettingsView | null>(null);
  const [u, setU] = useState<UpdateView | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    void window.lb.settings.get().then(setS);
    void window.lb.update.state().then(setU);
  }, []);
  const downloading = u?.phase === 'downloading';
  useEffect(() => {
    // no event channel for updates: refresh fast while a download runs, slowly otherwise
    const t = window.setInterval(() => {
      setNowMs(Date.now());
      void window.lb.update.state().then(setU);
    }, downloading ? 1000 : 5000);
    return () => window.clearInterval(t);
  }, [downloading]);
  if (!s || !u) return null;
  const toggle = async (on: boolean) => {
    setErr(null);
    const r = await window.lb.settings.set(autoUpdatePatch(on));
    setS(r.settings);
    if (!r.ok) setErr(r.message);
    setU(await window.lb.update.state());
  };
  const check = async () => {
    setBusy(true);
    setErr(null);
    try {
      setU(await window.lb.update.check());
    } catch {
      setErr('The check could not be completed. Try again.');
    } finally {
      setBusy(false);
      setNowMs(Date.now());
    }
  };
  const wait = checkWaitSeconds(u, nowMs);
  const notes = u.phase === 'idle' ? null : notesText(u.notes);
  return (
    <section aria-labelledby="updates" className="mt-6 max-w-xl rounded-lb-lg border border-lb-border bg-lb-surface p-6">
      <h2 id="updates" className="m-0 mb-4 text-base font-semibold text-lb-text">Updates</h2>
      <dl className="m-0 mb-4 grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
        <dt className="text-lb-muted">Current version</dt><dd className="m-0 text-lb-text">{u.currentVersion}</dd>
      </dl>
      <label className="flex items-center gap-2 text-sm text-lb-text">
        <input type="checkbox" role="switch" checked={s.autoUpdateCheck} onChange={(e) => void toggle(e.target.checked)} />
        Check for updates automatically
      </label>
      {!s.autoUpdateCheck ? <p className="m-0 mt-1 text-xs text-lb-muted">Automatic checks are off. An update that is required to keep using LazyBooks is still installed.</p> : null}
      <p role="status" className="mb-0 mt-4 text-sm text-lb-text">{statusLine(u, nowMs, busy)}</p>
      {u.phase === 'downloading' && u.progress ? (
        <div className="mt-2 h-2 w-full overflow-hidden rounded-lb-md bg-lb-sunken" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={u.progress.percent}>
          <div className="h-full bg-lb-accent" style={{ width: `${u.progress.percent}%` }} />
        </div>
      ) : null}
      {notes ? <pre className="mb-0 mt-3 max-h-40 overflow-auto whitespace-pre-wrap rounded-lb-md bg-lb-sunken p-3 text-xs text-lb-muted">{notes}</pre> : null}
      {err ? <p role="alert" className="m-0 mt-2 text-xs text-lb-danger">{err}</p> : null}
      <div className="mt-5 flex items-center gap-3">
        <button type="button" disabled={!canCheckNow(u, nowMs, busy)} onClick={() => void check()} className="rounded-lb-md bg-lb-accent px-4 py-2 text-sm text-lb-accent-contrast disabled:opacity-50">
          {busy ? 'Checking' : wait > 0 ? `Check now (${wait} s)` : 'Check now'}
        </button>
        {u.phase === 'ready' ? (
          <button type="button" onClick={() => void window.lb.update.install()} className="rounded-lb-md border border-lb-border-strong bg-lb-sunken px-4 py-2 text-sm text-lb-text hover:bg-lb-surface-raised">Restart and update</button>
        ) : null}
      </div>
    </section>
  );
}

export function SettingsPage() {
  const { themes, theme, mode, invalidCustom, setTheme, setMode } = useTheme();
  return (
    <>
      <PageHeader title="Settings" subtitle="Appearance, sync, Tally connection, passphrase and license." />
      <section aria-labelledby="appearance" className="max-w-xl rounded-lb-lg border border-lb-border bg-lb-surface p-6">
        <h2 id="appearance" className="m-0 mb-4 text-base font-semibold text-lb-text">Appearance</h2>

        <label htmlFor="theme-select" className="mb-1 block text-sm text-lb-muted">Theme</label>
        <select
          id="theme-select"
          value={theme.slug}
          onChange={(e) => setTheme(e.target.value)}
          className="lb-field mb-5 w-full rounded-lb-md border border-lb-border-strong bg-lb-sunken px-3 py-2 text-sm text-lb-text"
        >
          {themes.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-1 p-0 text-sm text-lb-muted">Mode</legend>
          <div role="radiogroup" className="inline-flex overflow-hidden rounded-lb-md border border-lb-border-strong">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={mode === m.id}
                onClick={() => setMode(m.id)}
                className={`lb-seg px-4 py-2 text-sm ${
                  mode === m.id ? 'bg-lb-accent text-lb-accent-contrast' : 'bg-lb-sunken text-lb-text hover:bg-lb-surface-raised'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </fieldset>

        {invalidCustom > 0 ? (
          <p className="mb-0 mt-5 text-sm text-lb-warning" role="status">
            {invalidCustom} custom theme file{invalidCustom === 1 ? ' was' : 's were'} ignored because it failed validation (missing tokens or low contrast).
          </p>
        ) : null}
      </section>
      <PreferencesBlock />
      <SyncingBlock />
      <UpdatesBlock />
      <TallyBlock />
      <SecurityBlock />
      <LicenseBlock />
    </>
  );
}
