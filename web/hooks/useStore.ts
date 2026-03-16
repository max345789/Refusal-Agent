'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getApiKey } from '@/lib/auth';

export function useStore() {
  const apiKey = typeof window !== 'undefined' ? getApiKey() : null;
  const { data, isLoading, error } = useQuery({
    queryKey: ['stores', apiKey],
    queryFn: () => api.getStores(apiKey!),
    enabled: !!apiKey,
  });
  const store = data?.stores?.[0] ?? null;
  return { store, isLoading, error, apiKey };
}
