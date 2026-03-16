'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SkeuoButton } from '@/components/ui/SkeuoButton';
import { SkeuoCard } from '@/components/ui/SkeuoCard';
import { FadeIn } from '@/components/animations/FadeIn';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'Get started with core analysis',
    features: ['Up to 100 refund analyses/month', '1 store', 'API access', 'Email support'],
    cta: 'Start free',
    href: '/start',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    desc: 'For growing stores',
    features: ['Unlimited analyses', 'Up to 5 stores', 'Webhooks', 'Priority support', 'Analytics'],
    cta: 'Start trial',
    href: '/start',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'High volume and custom needs',
    features: ['Unlimited everything', 'SSO', 'Dedicated support', 'SLA'],
    cta: 'Contact sales',
    href: 'mailto:sales@refusal.bot?subject=Refusal%20Bot%20Enterprise',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <h1 className="font-heading text-4xl font-black uppercase tracking-wider text-text-primary text-center md:text-5xl">
              Pricing
            </h1>
            <p className="mt-4 text-center text-text-secondary">
              Simple plans that scale with your store.
            </p>
          </FadeIn>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className={[
                    'nb-surface nb-pressable p-8',
                    plan.highlighted ? 'bg-primary text-white' : 'bg-white text-ink',
                  ].join(' ')}
                >
                  <h2 className="font-heading text-xl font-black uppercase tracking-wider">{plan.name}</h2>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-black">{plan.price}</span>
                    {plan.period && <span className={plan.highlighted ? 'text-white/80' : 'text-text-secondary'}>{plan.period}</span>}
                  </div>
                  <p className={`mt-2 text-sm ${plan.highlighted ? 'text-white/85' : 'text-text-secondary'}`}>{plan.desc}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className={`h-4 w-4 shrink-0 ${plan.highlighted ? 'text-warning' : 'text-highlight'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className="mt-8 block">
                    <SkeuoButton
                      variant={plan.highlighted ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      {plan.cta}
                    </SkeuoButton>
                  </Link>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
