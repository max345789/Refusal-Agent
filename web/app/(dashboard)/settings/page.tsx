'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Key, Save } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';
import { SkeuoButton } from '@/components/ui/SkeuoButton';
import { SkeuoCard } from '@/components/ui/SkeuoCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { getStoredStore, setStoredStore } from '@/lib/auth';
import { useStore } from '@/hooks/useStore';

const schema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
});

type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const { store } = useStore();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const stored = getStoredStore();
    if (stored?.apiKey) setValue('apiKey', stored.apiKey);
  }, [setValue]);

  const onSubmit = (data: FormData) => {
    setStoredStore({
      id: '',
      name: store?.name ?? 'Store',
      apiKey: data.apiKey.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PageTransition>
      <div>
        <PageHeader
          title="Settings"
          subtitle="Manage your store API key and preferences."
        />

        <div className="mt-8 max-w-xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <SkeuoCard hover={false}>
              <div className="flex items-center gap-2 mb-4">
                <Key className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-sm font-black uppercase tracking-wider text-text-primary">
                  Store API key
                </h2>
              </div>
              <p className="nb-help mb-4">
                Enter the API key from your store (created in Stores). This key is stored in your browser only.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    type="password"
                    {...register('apiKey')}
                    className="nb-input font-mono"
                    placeholder="rb_..."
                  />
                  {errors.apiKey && (
                    <p className="mt-1 text-sm text-danger">{errors.apiKey.message}</p>
                  )}
                </div>
                <SkeuoButton type="submit">
                  <Save className="h-4 w-4" />
                  {saved ? 'Saved' : 'Save API key'}
                </SkeuoButton>
              </form>
            </SkeuoCard>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
