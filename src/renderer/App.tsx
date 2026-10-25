import { useEffect, useState } from 'react';
import type { ActivationState } from '../shared/ipc';
import { Shell, type PageId } from './components/Shell';
import { ActivatePage, BlockedPage } from './pages/Activate';
import { DevicesPage } from './pages/Devices';
import { LogsPage } from './pages/Logs';
import { ToolsPage } from './pages/Tools';
import { SettingsPage } from './pages/Settings';
import { StatusPage } from './pages/Status';

export function App() {
  const [page, setPage] = useState<PageId>('status');
  const [act, setAct] = useState<ActivationState | null>(null);
  useEffect(() => {
    void window.lb.activation.get().then(setAct);
    return window.lb.activation.onEvent(setAct);
  }, []);
  if (!act) return null;
  if (act.stage !== 'active') return <ActivatePage state={act} />;
  if (act.blocking) return <BlockedPage state={act} />;
  return (
    <Shell page={page} onNavigate={setPage}>
      {page === 'status' ? (
        <StatusPage />
      ) : page === 'devices' ? (
        <DevicesPage onNavigateSettings={() => setPage('settings')} />
      ) : page === 'tools' ? (
        <ToolsPage />
      ) : page === 'logs' ? (
        <LogsPage />
      ) : (
        <SettingsPage />
      )}
    </Shell>
  );
}
