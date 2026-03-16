'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CreditCard, Sparkles, Shield, LifeBuoy, Rocket } from 'lucide-react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const STORAGE_KEY = 'rb_help_chat_public_v1';

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((m) => m && typeof m.text === 'string' && (m.role === 'user' || m.role === 'assistant'));
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
  } catch {
    // ignore storage failures
  }
}

function normalize(input: string) {
  return input.trim().toLowerCase();
}

function cannedReply(input: string) {
  const q = normalize(input);
  if (!q) return null;

  if (q.includes('price') || q.includes('pricing') || q.includes('plan')) {
    return 'Pricing is on the Pricing page. If you share your refund volume, I can suggest a plan.';
  }
  if (q.includes('how') || q.includes('works') || q.includes('use') || q.includes('usage')) {
    return 'Refusal Bot analyzes refund requests against your policy and generates a decision plus a customer-ready response.';
  }
  if (q.includes('security') || q.includes('privacy') || q.includes('data')) {
    return 'Use HTTPS everywhere, store secrets server-side only, and rotate keys. Tell me your deploy platform and I can list the exact settings.';
  }
  if (q.includes('support') || q.includes('contact') || q.includes('help')) {
    return 'Use the Support button below or email support@refusal.bot.';
  }
  return null;
}

export function HelpChat() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const history = loadHistory();
    if (history.length) {
      setMessages(history);
      return;
    }
    const seed: ChatMessage[] = [
      {
        id: uid(),
        role: 'assistant',
        ts: Date.now(),
        text:
          'Need help? Ask about pricing, how it works, security, or support.',
      },
    ];
    setMessages(seed);
  }, []);

  useEffect(() => {
    saveHistory(messages);
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, [messages]);

  async function pushAssistant(text: string) {
    setMessages((prev) => [...prev, { id: uid(), role: 'assistant', text, ts: Date.now() }]);
  }

  async function onSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: uid(), role: 'user', text: trimmed, ts: Date.now() }]);
    setDraft('');

    const canned = cannedReply(trimmed);
    if (canned) {
      await pushAssistant(canned);
      return;
    }

    await pushAssistant("Try: 'pricing', 'how it works', 'security', or 'support'.");
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([
      {
        id: uid(),
        role: 'assistant',
        ts: Date.now(),
        text: 'Chat reset. Ask about pricing, how it works, security, or support.',
      },
    ]);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      <div className="flex items-end justify-end">
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-[min(420px,calc(100vw-40px))] nb-surface bg-white"
            >
              <div className="flex items-center justify-between border-b-[3px] border-ink px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="nb-chip bg-warning px-3 py-1 text-[11px] font-black uppercase tracking-wider">
                    Help
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-text-secondary">Public site</div>
                </div>
                <button
                  className="nb-surface-soft bg-white px-2 py-1"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div ref={listRef} className="max-h-[360px] overflow-auto px-4 py-4">
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={[
                        'max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed',
                        m.role === 'user' ? 'ml-auto' : 'mr-auto',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'border-2 border-ink px-3 py-2',
                          m.role === 'user' ? 'bg-primary text-white' : 'bg-white',
                        ].join(' ')}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-[3px] border-ink px-4 py-3">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Link
                    className="nb-chip nb-pressable inline-flex items-center gap-2 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-wider"
                    href="/pricing"
                    onClick={() => setOpen(false)}
                  >
                    <CreditCard className="h-4 w-4" />
                    Pricing
                  </Link>
                  <Link
                    className="nb-chip nb-pressable inline-flex items-center gap-2 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-wider"
                    href="/start"
                    onClick={() => setOpen(false)}
                  >
                    <Rocket className="h-4 w-4" />
                    Get started
                  </Link>
                  <button
                    className="nb-chip nb-pressable inline-flex items-center gap-2 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-wider"
                    onClick={() => pushAssistant('Refusal Bot: policy-backed decisions, clear reasons, and customer-ready messages.')}
                  >
                    <Sparkles className="h-4 w-4" />
                    How It Works
                  </button>
                  <button
                    className="nb-chip nb-pressable inline-flex items-center gap-2 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-wider"
                    onClick={() => pushAssistant('Security tip: use HTTPS, rotate keys, and keep secrets server-side only.')}
                  >
                    <Shield className="h-4 w-4" />
                    Security
                  </button>
                  <a
                    className="nb-chip nb-pressable inline-flex items-center gap-2 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-wider"
                    href="mailto:support@refusal.bot"
                    onClick={() => setOpen(false)}
                  >
                    <LifeBuoy className="h-4 w-4" />
                    Support
                  </a>
                  <button
                    className="nb-chip nb-pressable inline-flex items-center gap-2 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-wider"
                    onClick={reset}
                  >
                    Reset
                  </button>
                </div>

                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSend(draft);
                  }}
                >
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="nb-input flex-1"
                    placeholder="Ask for help..."
                  />
                  <button
                    type="submit"
                    className="nb-surface nb-pressable bg-secondary text-white px-4 py-3 font-black uppercase tracking-wider"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {!open ? (
          <button
            className="nb-surface nb-pressable bg-secondary text-white px-5 py-4 font-heading text-sm font-black uppercase tracking-wider"
            onClick={() => setOpen(true)}
          >
            Help
          </button>
        ) : null}
      </div>
    </div>
  );
}
