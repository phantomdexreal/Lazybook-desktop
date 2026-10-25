/*
LazyBooks | src/renderer/components/EmptyState.tsx
Responsibility: Empty state block (icon, title, explanation, optional action)
Introduced by: Phase 4 (ui-shell)
STATUS: IMPLEMENTED (Phase 4)
*/
import type { Icon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

export function EmptyState({ icon: IconC, title, children }: { icon: Icon; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lb-lg border border-lb-border bg-lb-surface p-6 max-w-xl">
      <IconC size={32} weight="duotone" className="text-lb-accent" aria-hidden="true" />
      <h2 className="text-base font-semibold text-lb-text m-0">{title}</h2>
      {children ? <div className="text-sm text-lb-muted leading-relaxed">{children}</div> : null}
    </div>
  );
}
