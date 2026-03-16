'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Ticket,
  BarChart3,
  Store,
  Settings,
} from 'lucide-react';

type Props = {
  open?: boolean;
  onClose?: () => void;
};

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, accent: 'bg-primary text-white' },
  { href: '/tickets', label: 'Tickets', icon: Ticket, accent: 'bg-warning text-ink' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, accent: 'bg-highlight text-ink' },
  { href: '/dashboard/stores', label: 'Stores', icon: Store, accent: 'bg-secondary text-white' },
  { href: '/settings', label: 'Settings', icon: Settings, accent: 'bg-white text-ink' },
];

export function Sidebar({ open = false, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop (pinned) */}
      <aside className="relative hidden h-full w-72 shrink-0 flex-col p-5 md:flex">
        <div className="nb-surface bg-white p-5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-black tracking-tight">
              Refusal Bot
            </span>
          </Link>
          <div className="mt-2 text-xs text-text-secondary">
            Neo-brutal admin UI
          </div>
        </div>
        <nav className="mt-5 flex-1 space-y-3">
          {nav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={[
                    'nb-surface nb-pressable flex items-center gap-3 px-4 py-3',
                    'font-heading text-sm font-black uppercase tracking-wider',
                    isActive ? item.accent : 'bg-white text-ink',
                  ].join(' ')}
                  whileHover={{ x: 1 }}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 nb-surface-soft bg-[rgba(255,255,255,0.70)] p-4 text-[11px] text-text-secondary">
          Tip: Set API key in Settings to unlock actions.
        </div>
      </aside>

      {/* Mobile (drawer) */}
      <motion.div
        className="fixed inset-0 z-[55] md:hidden"
        initial={false}
        animate={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        <motion.button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="absolute inset-0 bg-[rgba(18,18,18,0.35)]"
          initial={false}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.16 }}
        />
        <motion.aside
          className="absolute left-0 top-0 h-full w-[min(320px,calc(100vw-48px))] p-4"
          initial={false}
          animate={{ x: open ? 0 : -380 }}
          transition={{ type: 'spring', stiffness: 420, damping: 40 }}
        >
          <div className="nb-surface bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
                <span className="font-heading text-xl font-black tracking-tight">
                  Refusal Bot
                </span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="nb-surface-soft bg-white px-3 py-2 text-xs font-black uppercase tracking-wider"
              >
                Close
              </button>
            </div>
            <div className="mt-2 text-xs text-text-secondary">Neo-brutal admin UI</div>
          </div>

          <nav className="mt-4 space-y-3">
            {nav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={onClose}>
                  <div
                    className={[
                      'nb-surface nb-pressable flex items-center gap-3 px-4 py-3',
                      'font-heading text-sm font-black uppercase tracking-wider',
                      isActive ? item.accent : 'bg-white text-ink',
                    ].join(' ')}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </motion.aside>
      </motion.div>
    </>
  );
}
