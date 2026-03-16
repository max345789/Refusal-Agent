'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';
import { useTickets } from '@/hooks/useTickets';
import { Skeleton, TableSkeleton } from '@/components/ui/Skeleton';
import { getApiKey } from '@/lib/auth';
import type { Ticket as TicketType } from '@/lib/api';
import { PageHeader } from '@/components/ui/PageHeader';

function TicketRow({ ticket }: { ticket: TicketType }) {
  const [expanded, setExpanded] = useState(false);
  const decisionColor =
    ticket.decision === 'approve'
      ? 'text-highlight'
      : ticket.decision === 'deny'
        ? 'text-danger'
        : 'text-text-secondary';

  return (
    <>
      <motion.tr
        layout
        className="border-b-2 border-[rgba(18,18,18,0.12)] cursor-pointer hover:bg-[rgba(255,184,0,0.12)]"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="py-4 px-4 max-w-xs">
          <p className="text-sm text-text-primary line-clamp-2">{ticket.customerMessage}</p>
        </td>
        <td className="py-4 px-4">
          <span className={`text-sm font-medium capitalize ${decisionColor}`}>
            {ticket.decision ?? '—'}
          </span>
        </td>
        <td className="py-4 px-4 max-w-[200px]">
          <p className="text-sm text-text-secondary line-clamp-2">{ticket.policyClause ?? '—'}</p>
        </td>
        <td className="py-4 px-4">
          <p className="text-sm text-text-secondary line-clamp-2">{ticket.aiResponse ?? '—'}</p>
        </td>
        <td className="py-4 px-4">
          <p className="text-sm text-text-secondary line-clamp-2">{ticket.alternativeOffer ?? '—'}</p>
        </td>
        <td className="py-4 px-4">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </td>
      </motion.tr>
      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[rgba(255,255,255,0.9)]"
          >
            <td colSpan={6} className="p-6">
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-text-secondary mb-2">Customer message</h4>
                  <p className="text-text-primary whitespace-pre-wrap">{ticket.customerMessage}</p>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-text-secondary mb-2">AI response</h4>
                  <p className="text-text-primary whitespace-pre-wrap">{ticket.aiResponse ?? '—'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-text-secondary mb-2">Policy clause</h4>
                  <p className="text-text-primary">{ticket.policyClause ?? '—'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-text-secondary mb-2">Alternative offer</h4>
                  <p className="text-text-primary">{ticket.alternativeOffer ?? '—'}</p>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default function TicketsPage() {
  const apiKey = typeof window !== 'undefined' ? getApiKey() : null;
  const { data, isLoading, error } = useTickets(50);

  if (!apiKey) {
    return (
      <PageTransition>
        <div className="nb-surface bg-white p-12 text-center">
          <MessageSquare className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">Add your store API key in Settings to view tickets.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div>
        <PageHeader
          title="Tickets"
          subtitle="Refund requests and AI analysis results."
        />

        {isLoading && <TableSkeleton rows={8} />}
        {error && (
          <div className="mt-6 nb-surface bg-white p-6 text-danger">
            {error.message}
          </div>
        )}
        {data?.tickets && data.tickets.length === 0 && (
          <div className="mt-8 nb-surface bg-white p-12 text-center">
            <MessageSquare className="h-12 w-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No tickets yet. Analyze a refund from the dashboard or via API.</p>
          </div>
        )}
        {data?.tickets && data.tickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 nb-surface bg-white overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-[rgba(47,107,255,0.12)] border-b-[3px] border-ink">
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-wider text-text-primary">Customer message</th>
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-wider text-text-primary">Decision</th>
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-wider text-text-primary">Policy clause</th>
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-wider text-text-primary">Suggested response</th>
                  <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-wider text-text-primary">Alternative</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {data.tickets.map((ticket) => (
                  <TicketRow key={ticket.id} ticket={ticket} />
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
