'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Globe,
  Layers,
  Shield,
  FileText,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '@/lib/providers';

export default function MethodologyPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-[#1a1a1a] text-white">
          <div className="container py-12 md:py-16">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 mb-4">
              {t('methodology.title')}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white leading-[1.05] mb-5 max-w-3xl">
              {t('methodology.subtitle')}
            </h1>
            <p className="text-white/65 text-lg max-w-2xl leading-relaxed">
              We are not a breaking-news operation. We are not investigative reporters. We explain what is happening in the region, and why it matters. That is a specific editorial discipline, and these are the standards we hold ourselves to.
            </p>
          </div>
        </div>

        {/* Story approach */}
        <section className="container py-14 max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-6">
            {t('What every story must do')}
          </h2>
          <div className="space-y-4 text-[#444444] text-base leading-relaxed">
            <p>{t('Every piece we publish has to answer two questions before it can be assigned: what is actually happening here, and why does it matter to someone who is curious about the region but not an expert in it?')}</p>
            <p>{t('Latin America is not a monolith. A story about fiscal policy in Chile means something different than one in Argentina. We write each piece as if the reader is intelligent, globally aware, and completely new to this specific country or situation.')}</p>
            <p>{t('We do not assume readers have read our previous coverage. We name political parties. We explain what institutions do. We give the minimum historical context needed to understand the present, every time.')}</p>
          </div>
        </section>

        {/* Three pillars */}
        <section className="bg-white border-t border-b border-[#1a1a1a]/10">
          <div className="container py-14">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[#1a1a1a] font-semibold mb-8">
              {t('Our editorial approach')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-8 h-8 bg-[#6111ff] flex items-center justify-center mb-4">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] mb-2">
                  {t('Context before event')}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {t('We explain what is happening in full context — not just what occurred, but the institutions involved, the history behind it, and who the people are.')}
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-[#6111ff] flex items-center justify-center mb-4">
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] mb-2">
                  {t('Explanatory, not reactive')}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {t('We are not a wire service. We publish when we can explain it properly — after the context is clear, not while it is still developing.')}
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-[#6111ff] flex items-center justify-center mb-4">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] mb-2">
                  {t('Primary sources only')}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {t('Every claim traces to a named person, an official document, or a verified publication. We do not publish anonymised allegations without corroboration.')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story structure */}
        <section className="container py-14 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-6">
            {t('How a brief is structured')}
          </h2>
          <div className="space-y-5">
            {[
              { n: '1', titleKey: 'What happened',              bodyKey: 'One or two sentences, factual and precise. Not a headline. Not a hook. The actual thing that occurred.' },
              { n: '2', titleKey: 'Who is involved and why',    bodyKey: 'Names, titles, institutions. Every person named has their role explained in the same sentence they appear.' },
              { n: '3', titleKey: 'What led here',              bodyKey: 'The minimum historical or political context a reader needs to understand what is at stake. Not a history lesson.' },
              { n: '4', titleKey: 'Why it matters beyond this', bodyKey: 'What does this mean for the country, the region, or a broader trend the reader should understand?' },
            ].map((item) => (
              <div key={item.n} className="flex gap-4 items-start bg-white border border-[#1a1a1a]/10 p-5">
                <div className="w-7 h-7 bg-[#1a1a1a] text-white flex items-center justify-center font-mono text-xs flex-shrink-0">
                  {item.n}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-1 text-sm">{t(item.titleKey)}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">{t(item.bodyKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Standards link */}
        <section className="bg-[#1a1a1a] text-white">
          <div className="container py-12">
            <div className="max-w-2xl">
              <h2 className="font-serif text-2xl font-semibold mb-4">
                {t('Full transparency')}
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                {t('Our full editorial standards, AI disclosure policy, corrections procedure, and funding information are on our Transparency page.')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/transparency">
                  <Button className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white rounded-none gap-2">
                    <FileText className="h-4 w-4" />
                    {t('transparency.editorialTitle')}
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="rounded-none border-white/30 text-white hover:bg-white/10 gap-2">
                    {t('about.label')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
