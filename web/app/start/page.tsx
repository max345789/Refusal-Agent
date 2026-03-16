'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Rocket, Store, ScrollText } from 'lucide-react';
import { SkeuoButton } from '@/components/ui/SkeuoButton';
import { SkeuoCard } from '@/components/ui/SkeuoCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { api } from '@/lib/api';
import { setStoredStore } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(2, 'Store name is required'),
  policy_text: z.string().min(50, 'Paste at least 50 characters of your policy'),
});

type FormData = z.infer<typeof schema>;

export default function StartPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setErrorMsg(null);
    try {
      const store = await api.createStore({
        name: data.name.trim(),
        policy_text: data.policy_text.trim(),
      });
      if (!store.apiKey) throw new Error('API key missing from server response');

      setStoredStore({
        id: store.id,
        name: store.name,
        apiKey: store.apiKey,
      });

      router.push('/dashboard');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Failed to create store');
    }
  }

  return (
    <div className="min-h-screen bg-background px-6 py-14">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="Get Started"
          subtitle="Create your workspace, paste your policy, and start analyzing refund requests."
          right={
            <div className="nb-chip bg-white px-4 py-2 text-xs font-black uppercase tracking-wider">
              2 minutes
            </div>
          }
        />

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <SkeuoCard hover={false} className="bg-white">
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="h-5 w-5 text-secondary" />
                <h2 className="font-heading text-sm font-black uppercase tracking-wider">
                  Create your store
                </h2>
              </div>

              {errorMsg ? (
                <div className="nb-surface-soft bg-white p-4 border border-[rgba(18,18,18,0.20)] text-danger text-sm mb-4">
                  {errorMsg}
                </div>
              ) : null}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="nb-label block text-text-primary mb-2">
                    Store name
                  </label>
                  <div className="relative">
                    <Store className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    <input className="nb-input pl-10" placeholder="Acme Shop" {...register('name')} />
                  </div>
                  {errors.name ? (
                    <p className="mt-2 text-sm text-danger">{errors.name.message}</p>
                  ) : null}
                </div>

                <div>
                  <label className="nb-label block text-text-primary mb-2">
                    Refund policy
                  </label>
                  <div className="relative">
                    <ScrollText className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-text-secondary" />
                    <textarea
                      className="nb-textarea pl-10"
                      rows={8}
                      placeholder="Paste your full return/refund policy here..."
                      {...register('policy_text')}
                    />
                  </div>
                  <p className="nb-help mt-2">
                    This is used to cite relevant clauses in AI responses.
                  </p>
                  {errors.policy_text ? (
                    <p className="mt-2 text-sm text-danger">{errors.policy_text.message}</p>
                  ) : null}
                </div>

                <SkeuoButton type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-full">
                  Start analyzing
                </SkeuoButton>
              </form>
            </SkeuoCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <SkeuoCard hover={false} className="bg-white">
              <h2 className="font-heading text-sm font-black uppercase tracking-wider mb-3">
                What happens next
              </h2>
              <ol className="space-y-3 text-sm">
                <li className="nb-surface-soft bg-white p-4 border border-[rgba(18,18,18,0.20)]">
                  You are redirected to the dashboard.
                </li>
                <li className="nb-surface-soft bg-white p-4 border border-[rgba(18,18,18,0.20)]">
                  Paste a refund request and get a decision plus response copy.
                </li>
                <li className="nb-surface-soft bg-white p-4 border border-[rgba(18,18,18,0.20)]">
                  When ready, wire your store/webhook to call the API.
                </li>
              </ol>
              <p className="nb-help mt-5">
                Tip: You can clear your local key any time by resetting the browser storage.
              </p>
            </SkeuoCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

