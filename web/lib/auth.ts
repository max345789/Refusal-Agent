const STORE_KEY = 'refusal_bot_store';

export type StoredStore = {
  id: string;
  name: string;
  apiKey: string;
};

export function getStoredStore(): StoredStore | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredStore(store: StoredStore | null): void {
  if (typeof window === 'undefined') return;
  if (store) localStorage.setItem(STORE_KEY, JSON.stringify(store));
  else localStorage.removeItem(STORE_KEY);
}

export function getApiKey(): string | null {
  return getStoredStore()?.apiKey ?? null;
}
