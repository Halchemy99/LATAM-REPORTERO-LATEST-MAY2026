'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ArrowLeft, PenLine, Server, Globe, Users,
  Zap, Shield, TrendingUp, Clock, Heart
} from 'lucide-react';

// ─────────────────────────────────────────────
// ADMIN: update these numbers each month
// ─────────────────────────────────────────────
const FUNDING = {
  month: 'May 2026',
  monthly_reader_revenue: 0,       // £ from subscriptions this month
  monthly_total_costs: 312,        // £ total running costs
  reader_count: 0,                 // paid subscribers
  currency: '£',

  costs: [
    {
      name: 'Journalism & Reporting',
      monthly: 0,
      percentage: 55,
      color: '#6111ff',
      bg: 'bg-[#6111ff]',
      icon: PenLine,
      desc: 'Journalist fees, source protection, fact-checking, investigative reporting',
      examples: ['Reporter day rates', 'Source travel', 'Legal review', 'Fact-checkers'],
    },
    {
      name: 'Technology & Hosting',
      monthly: 92,
      percentage: 29,
      color: '#3b82f6',
      bg: 'bg-blue-500',
      icon: Server,
      desc: 'Railway, Netlify, Supabase, Sanity CMS, APIs',
      examples: ['Railway backend £5', 'Supabase £25', 'Sanity CMS £0', 'Netlify £19', 'APIs £43'],
    },
    {
      name: 'Translation & Language',
      monthly: 33,
      percentage: 10,
      color: '#10b981',
      bg: 'bg-emerald-500',
      icon: Globe,
      desc: 'Claude AI translation + DeepL + human editorial review for ES/PT/EN',
      examples: ['Anthropic API £10', 'DeepL Pro £20', 'Editorial review £3'],
    },
    {
      name: 'Operations',
      monthly: 187,
      percentage: 6,
      color: '#f59e0b',
      bg: 'bg-amber-500',
      icon: Shield,
      desc: 'Legal, admin, secure comms, domain registration',
      examples: ['Domains £20', 'Secure email £10', 'Legal reserve £167'],
    },
  ],
};

const SECONDS_IN_MONTH = 30 * 24 * 60 * 60;
const PER_SECOND = FUNDING.monthly_total_costs / SECONDS_IN_MONTH;

function useElapsedThisMonth() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const initial = (now - start) / 1000;
    setElapsed(initial);
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return elapsed;
}

function LiveCounter({ value, prefix = '£', decimals = 4, className = '' }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (Math.abs(value - prev.current) < 0.001) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const start = prev.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplay(start + (end - start) * progress);
      if (progress < 1) requestAnimationFrame(animate);
      else prev.current = end;
    };
    requestAnimationFrame(animate);
  }, [value]);
  return (
    <span className={className}>
      {prefix}{display.toFixed(decimals)}
    </span>
  );
}

function PerMinuteTicker({ t }) {
  const elapsed = useElapsedThisMonth();
  const spent = elapsed * PER_SECOND;
  const perMinute = PER_SECOND * 60;

  return (
    <div className="bg-[#0d0d0d] border border-[#6111ff]/20 p-6 mb-2">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#6111ff] animate-pulse" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6111ff]">
          {t('Live — updating every second')}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">{t('Spent this month')}</p>
          <LiveCounter
            value={spent}
            decimals={2}
            className="text-3xl font-mono font-bold text-white"
          />
          <p className="text-white/30 text-xs mt-1">{t('of')} £{FUNDING.monthly_total_costs.toLocaleString()} {t('budget')}</p>
        </div>
        <div>
          <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">{t('Per minute')}</p>
          <span className="text-3xl font-mono font-bold text-[#6111ff]">
            £{perMinute.toFixed(5)}
          </span>
          <p className="text-white/30 text-xs mt-1">{t('every 60 seconds')}</p>
        </div>
        <div>
          <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">{t('Per day')}</p>
          <span className="text-3xl font-mono font-bold text-white">
            £{(FUNDING.monthly_total_costs / 30).toFixed(2)}
          </span>
          <p className="text-white/30 text-xs mt-1">{t('keeping LATAM Reportero alive')}</p>
        </div>
      </div>
    </div>
  );
}

function CostBar({ item, elapsed, t }) {
  const itemPerSecond = (item.monthly / SECONDS_IN_MONTH);
  const spent = elapsed * itemPerSecond;
  const Icon = item.icon;

  return (
    <div className="bg-white border border-[#1a1a1a]/10 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2" style={{ backgroundColor: item.color + '15' }}>
            <Icon className="h-4 w-4" style={{ color: item.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-[#1a1a1a] text-sm">{t(item.name)}</h3>
            <p className="text-xs text-[#666666] mt-0.5">{t(item.desc)}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-lg font-mono font-bold text-[#1a1a1a]">
            £{item.monthly}/mo
          </div>
          <div className="text-xs font-mono text-[#666666]">
            {item.percentage}% {t('of budget')}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[#1a1a1a]/8 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-none"
          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
        />
      </div>

      {/* Live spent counter */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {item.examples.map(ex => (
            <span key={ex} className="text-[9px] font-mono text-[#666666] bg-[#1a1a1a]/5 px-1.5 py-0.5">
              {ex}
            </span>
          ))}
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <div className="text-[10px] font-mono text-[#666666] uppercase tracking-wider">{t('spent this month')}</div>
          <LiveCounter
            value={spent}
            decimals={3}
            className="text-sm font-mono font-bold"
            style={{ color: item.color }}
          />
        </div>
      </div>
    </div>
  );
}

export default function FundingTransparencyPage() {
  const { t } = useTranslation();
  const elapsed = useElapsedThisMonth();
  const totalSpent = elapsed * PER_SECOND;
  const percentSpent = Math.min((totalSpent / FUNDING.monthly_total_costs) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <div className="bg-[#1a1a1a] text-white py-12">
          <div className="container max-w-4xl">
            <Link href="/transparency" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors mb-8">
              <ArrowLeft className="h-3 w-3" /> {t('Transparency hub')}
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-[#6111ff]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                {t('Financial transparency')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
              {t('Where your money goes')}
            </h1>
            <p className="text-white/60 max-w-2xl leading-relaxed">
              {t('Every penny of reader funding is tracked here in real time. No corporate owners. No hidden advertisers. This is what independent journalism actually costs.')}
            </p>
          </div>
        </div>

        <div className="container max-w-4xl py-10 space-y-6">

          {/* Live ticker */}
          <PerMinuteTicker t={t} />

          {/* Month progress bar */}
          <div className="bg-white border border-[#1a1a1a]/10 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#1a1a1a]">{FUNDING.month} {t('budget progress')}</span>
              <span className="text-sm font-mono text-[#666666]">
                £{totalSpent.toFixed(2)} {t('of')} £{FUNDING.monthly_total_costs}
              </span>
            </div>
            <div className="h-2 bg-[#1a1a1a]/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6111ff] rounded-full transition-all duration-1000"
                style={{ width: `${percentSpent.toFixed(4)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[#666666]">1 May</span>
              <span className="text-xs text-[#666666]">31 May</span>
            </div>
          </div>

          {/* Cost breakdown */}
          <div>
            <h2 className="text-lg font-serif font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#6111ff]" />
              {t('Real costs, broken down live')}
            </h2>
            <div className="space-y-3">
              {FUNDING.costs.map(item => (
                <CostBar key={item.name} item={item} elapsed={elapsed} t={t} />
              ))}
            </div>
          </div>

          {/* What £8/month means */}
          <div className="bg-[#1a1a1a] text-white p-8">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-4 w-4 text-[#6111ff]" />
              <h2 className="text-lg font-semibold">{t('What your subscription pays for')}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { amount: '£8/mo',   label: 'Standard subscriber',  funds: '~1.5 hours of reporting time' },
                { amount: '£15/mo',  label: 'Supporter',            funds: '~3 hours + covers hosting' },
                { amount: '£50/mo',  label: 'Champion',             funds: '~1 full investigative day' },
                { amount: '£150/mo', label: 'Founding member',      funds: '~3 investigation days' },
              ].map(tier => (
                <div key={tier.amount} className="border border-white/10 p-4">
                  <div className="text-2xl font-mono font-bold text-[#6111ff] mb-1">{tier.amount}</div>
                  <div className="text-sm font-semibold text-white mb-1">{t(tier.label)}</div>
                  <div className="text-xs text-white/50">{t(tier.funds)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial independence pledge */}
          <div className="border-l-4 border-[#6111ff] bg-white p-6">
            <h3 className="font-semibold text-[#1a1a1a] mb-2">{t('Editorial independence — non-negotiable')}</h3>
            <p className="text-sm text-[#666666] leading-relaxed">
              {t('No single funder controls more than 30% of our revenue. Advertisers have zero editorial access. Grants are unconditional. This page updates automatically — we cannot hide what we spend, and we wouldn\'t want to.')}
            </p>
          </div>

          {/* Subscribe CTA */}
          {FUNDING.monthly_reader_revenue === 0 && (
            <div className="bg-[#6111ff]/8 border border-[#6111ff]/20 p-6 text-center">
              <p className="text-sm text-[#1a1a1a] font-medium mb-1">
                {t('Reader revenue: £0 this month')}
              </p>
              <p className="text-sm text-[#666666] mb-4">
                {t("We're running on reserves. Be the first subscriber — 100% goes to journalism.")}
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-[#6111ff] text-white text-sm font-semibold px-6 py-3 hover:bg-[#4a0dd6] transition-colors"
              >
                {t('Support independent LATAM journalism')}
              </Link>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
