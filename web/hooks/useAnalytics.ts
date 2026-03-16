'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getApiKey } from '@/lib/auth';

export function useAnalytics() {
  const apiKey = typeof window !== 'undefined' ? getApiKey() : null;
  return useQuery({
    queryKey: ['analytics', apiKey],
    queryFn: () => api.getAnalytics(apiKey!),
    enabled: !!apiKey,
  });
}
