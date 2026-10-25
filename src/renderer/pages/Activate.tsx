/*
LazyBooks | src/renderer/pages/Activate.tsx
Responsibility: Activation + connector login (license key step, connector sign-in step, blocking screens)
Introduced by: Phase 5 (activation)
STATUS: IMPLEMENTED (Phase 5)
*/
import { Prohibit, ShieldCheck, SignIn, Key, WarningCircle } from '@phosphor-icons/react';
import { useState, type FormEvent, type ReactNode } from 'react';
import type { ActivationState } from '../../shared/ipc';

const FIELD = 'lb-field w-full rounded-lb-md border border-lb-border-strong bg-lb-sunken px-3 py-2 text-sm text-lb-text';
const BTN = 'rounded-lb-md bg-lb-accent px-4 py-2 text-sm font-medium text-lb-accent-contrast disabled:opacity-50';

function Frame({ icon: IconC, title, subtitle, children }: { icon: typeof Key; title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center bg-lb-bg p-8">
      <div className="w-full max-w-md rounded-lb-lg border border-lb-border bg-lb-surface p-8">
        <IconC size={32} weight="duotone" className="mb-3 text-lb-accent" aria-hidden="true" />
        <h1 className="m-0 text-xl font-semibold text-lb-text">{title}</h1>
        <p className="m-0 mb-6 mt-1 text-sm text-lb-muted">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

function ErrorLine({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="mb-0 mt-4 flex items-start gap-2 text-sm text-lb-danger">
      <WarningCircle size={18} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

export function ActivatePage({ state }: { state: ActivationState }) {
  if (!state.masterConfigured) {
    return (
      <Frame icon={Prohibit} title="Activation unavailable" subtitle="This build has no registry address configured.">
        <p className="m-0 text-sm text-lb-muted">Install the official LazyBooks connector, or ask your administrator for a configured build.</p>
      </Frame>
    );
  }
  if (!state.secureStorage) {
    return (
      <Frame icon={Prohibit} title="Secure storage unavailable" subtitle="This PC cannot encrypt saved credentials.">
        <p className="m-0 text-sm text-lb-muted">LazyBooks will not store a license or password without encryption. Sign in to a normal Windows user account and try again.</p>
      </Frame>
    );
  }
  return state.stage === 'needs-license' ? <LicenseStep /> : <LoginStep state={state} />;
}

function LicenseStep() {
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await window.lb.activation.resolve(key);
    setBusy(false);
    if (!r.ok) setError(r.message);
  }

  return (
    <Frame icon={Key} title="Activate LazyBooks" subtitle="Enter the license key your administrator gave you.">
      <form onSubmit={(e) => void submit(e)}>
        <label htmlFor="license-key" className="mb-1 block text-sm text-lb-muted">License key</label>
        <input id="license-key" className={`${FIELD} mb-4 font-mono`} value={key} onChange={(e) => setKey(e.target.value)} placeholder="LB-XXXX-XXXX-XXXX-XXXX" autoComplete="off" spellCheck={false} autoFocus />
        <button type="submit" className={BTN} disabled={busy || key.trim() === ''}>{busy ? 'Checking...' : 'Continue'}</button>
        <ErrorLine message={error} />
      </form>
    </Frame>
  );
}

function LoginStep({ state }: { state: ActivationState }) {
  const [email, setEmail] = useState(state.email ?? '');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await window.lb.activation.login(email, password);
    setBusy(false);
    if (!r.ok) setError(r.message);
    else setPassword('');
  }

  return (
    <Frame icon={SignIn} title={state.companyName ?? 'Connector sign-in'} subtitle="Sign in with the connector email and password your administrator issued.">
      <p className="m-0 mb-4 flex items-center gap-2 text-xs text-lb-muted">
        <ShieldCheck size={16} weight="bold" aria-hidden="true" className="text-lb-success" />
        <span className="font-mono">{state.licenseKeyMasked}</span>
      </p>
      <form onSubmit={(e) => void submit(e)}>
        <label htmlFor="connector-email" className="mb-1 block text-sm text-lb-muted">Connector email</label>
        <input id="connector-email" type="email" className={`${FIELD} mb-4`} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" autoFocus />
        <label htmlFor="connector-password" className="mb-1 block text-sm text-lb-muted">Password</label>
        <input id="connector-password" type="password" className={`${FIELD} mb-4`} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        <div className="flex items-center gap-3">
          <button type="submit" className={BTN} disabled={busy || email.trim() === '' || password === ''}>{busy ? 'Signing in...' : 'Sign in'}</button>
          <button type="button" className="text-sm text-lb-muted underline" onClick={() => void window.lb.activation.deactivate()}>Use a different license</button>
        </div>
        <ErrorLine message={error} />
      </form>
    </Frame>
  );
}

/** Blocking screen for maintenance, contract too old, update required, license expired/inactive. */
export function BlockedPage({ state }: { state: ActivationState }) {
  const b = state.blocking;
  if (!b) return null;
  const title =
    b.code === 'LB_MAINTENANCE' ? 'Under maintenance'
    : b.code === 'LB_UPDATE_REQUIRED' || b.code === 'LB_CONTRACT_TOO_OLD' ? 'Update required'
    : b.code === 'LB_LICENSE_EXPIRED' ? 'License expired'
    : 'License not active';
  return (
    <Frame icon={Prohibit} title={title} subtitle={state.companyName ?? 'LazyBooks'}>
      <p className="m-0 text-sm text-lb-text">{b.message}</p>
      {state.offline ? <p className="mb-0 mt-3 text-xs text-lb-muted">Offline: showing the last known state.</p> : null}
    </Frame>
  );
}
