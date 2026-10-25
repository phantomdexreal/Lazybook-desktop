/*
LazyBooks | src/renderer/components/Shell.tsx
Responsibility: App frame: left side rail (no burger menu) and page area
Introduced by: Phase 4 (ui-shell)
STATUS: IMPLEMENTED (Phase 4)
*/
import { DeviceMobile, Gauge, GearSix, ListMagnifyingGlass, Wrench, type Icon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

export type PageId = 'status' | 'devices' | 'tools' | 'logs' | 'settings';

const ITEMS: Array<{ id: PageId; label: string; icon: Icon }> = [
  { id: 'status', label: 'Status', icon: Gauge },
  { id: 'devices', label: 'Devices', icon: DeviceMobile },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'logs', label: 'Logs', icon: ListMagnifyingGlass },
  { id: 'settings', label: 'Settings', icon: GearSix },
];

export function Shell({ page, onNavigate, children }: { page: PageId; onNavigate(p: PageId): void; children: ReactNode }) {
  return (
    <div className="flex h-full">
      <nav aria-label="Main" className="flex w-24 shrink-0 flex-col gap-1 border-r border-lb-border bg-lb-sunken p-2">
        <div className="px-2 pb-3 pt-2 text-xs font-semibold tracking-wide text-lb-muted">LazyBooks</div>
        {ITEMS.map(({ id, label, icon: IconC }) => {
          const active = id === page;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={active ? 'page' : undefined}
              className={`lb-rail-btn flex flex-col items-center gap-1 rounded-lb-md px-2 py-3 text-xs ${
                active ? 'bg-lb-accent-soft text-lb-accent' : 'text-lb-muted hover:bg-lb-surface hover:text-lb-text'
              }`}
            >
              <IconC size={24} weight={active ? 'bold' : 'light'} aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
      <main className="min-w-0 flex-1 overflow-auto bg-lb-bg p-8">{children}</main>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="m-0 text-xl font-semibold text-lb-text">{title}</h1>
      {subtitle ? <p className="m-0 mt-1 text-sm text-lb-muted">{subtitle}</p> : null}
    </header>
  );
}
