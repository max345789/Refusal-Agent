'use client';

import { useStore } from '@/hooks/useStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { Menu } from 'lucide-react';

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { store, isLoading } = useStore();

  return (
    <header className="nb-surface flex h-16 items-center justify-between bg-white px-6">
      <div className="flex items-baseline gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="mr-1 inline-flex items-center justify-center nb-surface-soft bg-white px-2 py-2 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="font-heading text-base font-black uppercase tracking-wider text-text-primary">
          Control Panel
        </div>
        <div className="nb-chip px-3 py-1 text-[11px] font-black uppercase tracking-wider">
          API:3000
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isLoading ? (
          <Skeleton className="h-6 w-32" />
        ) : store ? (
          <span className="nb-chip inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider">
            <span className="h-2.5 w-2.5 rounded-full bg-highlight border-2 border-ink" />
            <span>{store.name}</span>
          </span>
        ) : (
          <span className="nb-chip px-4 py-2 text-xs font-black uppercase tracking-wider">
            No store
          </span>
        )}
      </div>
    </header>
  );
}
