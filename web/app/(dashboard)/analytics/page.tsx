'use client';

import { PageTransition } from '@/components/animations/PageTransition';
import { RefundCharts } from '@/components/charts/RefundCharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { getApiKey } from '@/lib/auth';
import { Skeleton } from '@/components/ui/Skeleton';
import { BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

export default function AnalyticsPage() {
  const apiKey = typeof window !== 'undefined' ? getApiKey() : null;
  const { data: analytics, isLoading, error } = useAnalytics();

  if (!apiKey) {
    return (
      <PageTransition>
        <div className="nb-surface bg-white p-12 text-center">
          <BarChart3 className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">Add your store API key in Settings to view analytics.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div>
        <PageHeader
          title="Analytics"
          subtitle="Refund requests, decisions, and trends."
        />

        {isLoading && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        )}
        {error && (
          <div className="mt-6 nb-surface bg-white p-6 text-danger">{error.message}</div>
        )}
        {analytics && <RefundCharts analytics={analytics} />}
      </div>
    </PageTransition>
  );
}
