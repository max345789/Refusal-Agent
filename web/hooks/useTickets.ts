'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { getApiKey } from '@/lib/auth';

export function useTickets(limit = 50) {
  const apiKey = typeof window !== 'undefined' ? getApiKey() : null;
  return useQuery({
    queryKey: ['tickets', apiKey, limit],
    queryFn: () => api.getTickets(apiKey!, limit),
    enabled: !!apiKey,
  });
}
