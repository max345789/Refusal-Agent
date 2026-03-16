const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type Ticket = {
  id: string;
  customerMessage: string;
  aiResponse: string | null;
  decision: string | null;
  policyClause: string | null;
  reason: string | null;
  alternativeOffer: string | null;
  createdAt: string;
};

export type Analytics = {
  totalTickets: number;
  approved: number;
  denied: number;
  pending: number;
  last24Hours: number;
};

export type Store = {
  id: string;
  name: string;
  apiKey?: string;
  policyText?: string;
  createdAt: string;
};

async function request<T>(
  path: string,
  options: RequestInit & { apiKey?: string } = {}
): Promise<T> {
  const { apiKey, ...init } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  health: () => request<{ status: string }>('/health'),

  getTickets: (apiKey: string, limit = 50) =>
    request<{ tickets: Ticket[] }>(`/api/tickets?limit=${limit}`, { apiKey }),

  getAnalytics: (apiKey: string) =>
    request<Analytics>('/api/analytics', { apiKey }),

  createStore: (body: { name: string; policy_text: string }) =>
    request<Store>('/api/stores', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getStores: (apiKey: string) =>
    request<{ stores: Store[] }>('/api/stores', { apiKey }),

  analyzeRefund: (
    apiKey: string,
    body: { customer_message: string; order_data?: Record<string, unknown>; async?: boolean }
  ) =>
    request<{
      ticketId: string;
      decision?: string;
      policy_clause?: string;
      reason?: string;
      response_message?: string;
      alternative_offer?: string;
      message?: string;
    }>('/api/analyze-refund', {
      method: 'POST',
      apiKey,
      body: JSON.stringify(body),
    }),
};
