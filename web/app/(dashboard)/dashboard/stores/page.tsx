'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Store, Key, Copy, Check, Webhook } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';
import { SkeuoButton } from '@/components/ui/SkeuoButton';
import { SkeuoCard } from '@/components/ui/SkeuoCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { setStoredStore } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(1, 'Store name is required'),
  policy_text: z.string().min(1, 'Policy text is required'),
});

type FormData = z.infer<typeof schema>;

export default function StoresPage() {
  const queryClient = useQueryClient();
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const createStore = useMutation({
    mutationFn: (data: FormData) => api.createStore(data),
    onSuccess: (store) => {
      if (store.apiKey) {
        setCreatedKey(store.apiKey);
        setStoredStore({
          id: store.id,
          name: store.name,
          apiKey: store.apiKey,
        });
        queryClient.invalidateQueries({ queryKey: ['stores'] });
      }
    },
  });

  const copyKey = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const apiUrl =
    typeof window !== 'undefined'
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/webhooks/shopify/refund-request`
      : '';

  return (
    <PageTransition>
      <div>
        <PageHeader
          title="Store setup"
          subtitle="Create a store, paste your return policy, and get your API key."
        />

        <div className="mt-8 max-w-2xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <SkeuoCard hover={false}>
              <div className="flex items-center gap-2 mb-4">
                <Store className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-sm font-black uppercase tracking-wider text-text-primary">
                  Create store
                </h2>
              </div>
              <form
                onSubmit={handleSubmit((data) => createStore.mutate(data))}
                className="space-y-4"
              >
                <div>
                  <label className="nb-label block text-text-primary mb-2">
                    Store name
                  </label>
                  <input
                    {...register('name')}
                    className="nb-input"
                    placeholder="My Store"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-danger">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="nb-label block text-text-primary mb-2">
                    Return / refund policy (paste full text)
                  </label>
                  <textarea
                    {...register('policy_text')}
                    rows={6}
                    className="nb-textarea"
                    placeholder="Paste your store refund policy here..."
                  />
                  {errors.policy_text && (
                    <p className="mt-1 text-sm text-danger">{errors.policy_text.message}</p>
                  )}
                </div>
                <SkeuoButton
                  type="submit"
                  loading={createStore.isPending}
                  disabled={createStore.isPending}
                >
                  Create store & get API key
                </SkeuoButton>
              </form>
            </SkeuoCard>
          </motion.div>

          {createdKey && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <SkeuoCard hover={false}>
                <div className="flex items-center gap-2 mb-3">
                  <Key className="h-5 w-5 text-highlight" />
                  <h2 className="font-heading text-sm font-black uppercase tracking-wider text-text-primary">
                    Your API key
                  </h2>
                </div>
                <p className="text-sm text-text-secondary mb-2">
                  Use this key in the <code className="bg-gray-100 px-1 rounded">X-API-Key</code> header for all API requests. Save it securely—it won&apos;t be shown again in full.
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 nb-surface-soft bg-white px-3 py-2 text-sm font-mono truncate border border-[rgba(18,18,18,0.20)]">
                    {createdKey}
                  </code>
                  <SkeuoButton variant="secondary" size="sm" onClick={copyKey}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </SkeuoButton>
                </div>
              </SkeuoCard>
              <SkeuoCard hover={false}>
                <div className="flex items-center gap-2 mb-3">
                  <Webhook className="h-5 w-5 text-secondary" />
                  <h2 className="font-heading text-sm font-black uppercase tracking-wider text-text-primary">
                    Webhook endpoint
                  </h2>
                </div>
                <p className="text-sm text-text-secondary mb-2">
                  POST refund requests to this URL with <code className="bg-gray-100 px-1 rounded">X-API-Key</code> and body: <code className="bg-gray-100 px-1 rounded text-xs">{'{"customer_message":"...", "order_data":{}}'}</code>
                </p>
                <code className="block nb-surface-soft bg-white px-3 py-2 text-sm font-mono break-all border border-[rgba(18,18,18,0.20)]">
                  {apiUrl}
                </code>
              </SkeuoCard>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
