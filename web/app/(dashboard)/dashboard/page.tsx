'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ticket, BarChart3, ArrowRight, TrendingUp, MessageSquare } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageTransition } from '@/components/animations/PageTransition';
import { SkeuoCard } from '@/components/ui/SkeuoCard';
import { SkeuoButton } from '@/components/ui/SkeuoButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useStore } from '@/hooks/useStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { getApiKey } from '@/lib/auth';

function AnalyzeRefundCard() {
  const queryClient = useQueryClient();
  const apiKey = typeof window !== 'undefined' ? getApiKey() : null;
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<{
    decision?: string;
    response_message?: string;
    alternative_offer?: string;
  } | null>(null);
  const analyze = useMutation({
    mutationFn: (msg: string) => api.analyzeRefund(apiKey!, { customer_message: msg }),
    onSuccess: (data) => {
      setResult({
        decision: data.decision,
        response_message: data.response_message,
        alternative_offer: data.alternative_offer,
      });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
  if (!apiKey) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
      <SkeuoCard hover={false}>
        <div className="flex items-center gap-2 text-text-secondary mb-3">
          <MessageSquare className="h-5 w-5" />
          <span className="font-heading text-sm font-black uppercase tracking-wider">Analyze a refund request</span>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste customer refund request..."
          rows={3}
          className="nb-textarea"
        />
        <SkeuoButton
          size="sm"
          className="mt-3"
          onClick={() => analyze.mutate(message)}
          disabled={!message.trim() || analyze.isPending}
          loading={analyze.isPending}
        >
          Analyze
        </SkeuoButton>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-5 nb-surface-soft bg-white p-5 text-sm border border-[rgba(18,18,18,0.20)]"
          >
            <p className="font-heading text-xs font-black uppercase tracking-wider text-text-secondary">
              Decision: <span className="text-text-primary">{result.decision ?? '—'}</span>
            </p>
            {result.response_message && <p className="mt-2 text-text-primary">{result.response_message}</p>}
            {result.alternative_offer && <p className="mt-1 text-text-secondary">Alternative: {result.alternative_offer}</p>}
          </motion.div>
        )}
      </SkeuoCard>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { store, isLoading: storeLoading, apiKey } = useStore();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  if (!apiKey) {
    return (
      <PageTransition>
        <div className="nb-surface bg-white p-12 text-center max-w-md mx-auto">
          <p className="text-text-secondary mb-4">
            No store connected. Add your API key in Settings or create a store.
          </p>
          <Link href="/dashboard/stores">
            <span className="nb-link font-heading font-black uppercase tracking-wider text-primary">
              Go to Stores →
            </span>
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div>
        <PageHeader
          title="Dashboard"
          subtitle={storeLoading ? 'Loading...' : store ? `Welcome back, ${store.name}` : ''}
        />

        {analyticsLoading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <SkeuoCard key={i} hover={false}>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-10 w-16 mt-2" />
              </SkeuoCard>
            ))}
          </div>
        ) : analytics ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <SkeuoCard hover={false}>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Ticket className="h-5 w-5" />
                  <span className="text-sm font-medium">Total tickets</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-text-primary">{analytics.totalTickets}</p>
              </SkeuoCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SkeuoCard hover={false}>
                <div className="flex items-center gap-2 text-text-secondary">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm font-medium">Denied</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-danger">{analytics.denied}</p>
              </SkeuoCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <SkeuoCard hover={false}>
                <div className="flex items-center gap-2 text-text-secondary">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium">Last 24h</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-primary">{analytics.last24Hours}</p>
              </SkeuoCard>
            </motion.div>
          </div>
        ) : null}

        <AnalyzeRefundCard />

          <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/tickets">
            <motion.span
              className="nb-surface nb-pressable inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-black uppercase tracking-wider text-text-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View tickets
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </Link>
          <Link href="/analytics">
            <motion.span
              className="nb-surface nb-pressable inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-black uppercase tracking-wider text-text-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View analytics
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
