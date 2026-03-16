'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, FileCheck, BarChart3 } from 'lucide-react';
import { SkeuoButton } from '@/components/ui/SkeuoButton';
import { SkeuoCard } from '@/components/ui/SkeuoCard';
import { FadeIn } from '@/components/animations/FadeIn';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-40 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="nb-surface bg-white px-5 py-3">
            <Link href="/" className="font-heading text-lg font-black tracking-tight text-text-primary">
              Refusal Bot
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="nb-link text-sm font-black uppercase tracking-wider text-text-primary">
              Pricing
            </Link>
            <Link href="/start">
              <SkeuoButton size="sm">Get Started</SkeuoButton>
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero */}
      <header className="relative overflow-hidden px-6 pt-12 pb-24 md:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(47,107,255,0.10)] via-transparent to-transparent" />
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 nb-surface bg-secondary opacity-20"
          animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 left-10 w-56 h-56 nb-surface bg-warning opacity-20"
          animate={{ y: [0, 10, 0], rotate: [0, -1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <FadeIn delay={0.1}>
            <div className="mx-auto inline-block nb-surface bg-white px-6 py-5">
              <h1 className="font-heading text-4xl font-black tracking-tight text-text-primary md:text-5xl lg:text-6xl">
                Protect Your Revenue from Refund Abuse
              </h1>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}>
            <p className="mt-6 text-lg text-text-secondary md:text-xl max-w-2xl mx-auto">
              AI that enforces your store policies automatically.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <Link href="/start">
              <SkeuoButton size="lg" className="mt-8">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </SkeuoButton>
            </Link>
          </FadeIn>
        </div>
      </header>

      {/* Problem */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn delay={0.1}>
            <h2 className="text-2xl font-bold text-text-primary md:text-3xl">
              Refund abuse hurts your bottom line
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-text-secondary">
              Customers sometimes request refunds that don&apos;t match your policy. Handling each case manually is slow and inconsistent. Refusal Bot analyzes every request against your rules and suggests polite, policy-backed responses—so you save time and protect revenue.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-2xl font-bold text-text-primary text-center mb-12">
              How it works
            </h2>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '1', title: 'Connect your store', desc: 'Add your return policy and get an API key.' },
              { step: '2', title: 'Send refund requests', desc: 'Use the API or webhook when a customer asks for a refund.' },
              { step: '3', title: 'Get AI responses', desc: 'Receive approve/deny decisions and ready-to-send replies.' },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.1}>
                <SkeuoCard delay={i * 0.1}>
                  <span className="text-3xl font-bold text-primary/60">{item.step}</span>
                  <h3 className="mt-2 font-semibold text-text-primary">{item.title}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{item.desc}</p>
                </SkeuoCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-gradient-to-b from-[rgba(255,255,255,0.30)] to-background">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <h2 className="text-2xl font-bold text-text-primary text-center mb-12">
              Core features
            </h2>
          </FadeIn>
          <div className="grid gap-8 md:grid-cols-3">
            <FadeIn delay={0}>
              <SkeuoCard>
                <Shield className="h-10 w-10 text-primary" />
                <h3 className="mt-4 font-semibold text-text-primary">AI refund analysis</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Every request is evaluated against your policy. Get clear approve/deny decisions and reasoning in seconds.
                </p>
              </SkeuoCard>
            </FadeIn>
            <FadeIn delay={0.1}>
              <SkeuoCard>
                <FileCheck className="h-10 w-10 text-secondary" />
                <h3 className="mt-4 font-semibold text-text-primary">Policy enforcement</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Responses cite the exact policy clause. Suggest alternatives like store credit or exchange when a full refund isn&apos;t allowed.
                </p>
              </SkeuoCard>
            </FadeIn>
            <FadeIn delay={0.2}>
              <SkeuoCard>
                <BarChart3 className="h-10 w-10 text-highlight" />
                <h3 className="mt-4 font-semibold text-text-primary">Revenue analytics</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  See how many requests were denied, approved, and track volume over time—all in one dashboard.
                </p>
              </SkeuoCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="text-2xl font-bold text-text-primary">Simple pricing</h2>
            <p className="mt-4 text-text-secondary">
              Start free. Scale as you grow.
            </p>
            <Link href="/pricing" className="inline-block mt-6">
              <SkeuoButton variant="secondary">View pricing</SkeuoButton>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <FadeIn>
          <div className="mx-auto max-w-2xl nb-surface bg-white p-12 text-center">
            <h2 className="text-2xl font-bold text-text-primary">
              Ready to protect your revenue?
            </h2>
            <p className="mt-3 text-text-secondary">
              Join stores that use Refusal Bot to enforce policies fairly and automatically.
            </p>
            <Link href="/start" className="inline-block mt-6">
              <SkeuoButton size="lg">Start Free Trial</SkeuoButton>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-sm text-text-secondary">© Refusal Bot. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-sm text-text-secondary hover:text-primary">Pricing</Link>
            <a href="mailto:support@refusal.bot" className="text-sm text-text-secondary hover:text-primary">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
