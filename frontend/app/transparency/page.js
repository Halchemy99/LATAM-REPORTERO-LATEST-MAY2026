'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Mail,
  FileText,
  Bot,
  User,
  Edit3,
} from 'lucide-react';
import { useTranslation } from '@/lib/providers';

export default function TransparencyPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#F9F6F6]">
      <Header />

      <main className="container py-12">
        {/* Hero */}
        <div className="max-w-3xl mb-14">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#6111ff] mb-3">
            {t('transparency.title')}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a1a1a] mb-5 leading-tight">
            {t('transparency.subtitle')}
          </h1>
          <p className="text-lg text-[#666666] leading-relaxed">
            {t('LATAM Reportero is independently owned. We answer to our readers. Not advertisers. Not governments. Not investors. This page explains exactly how we fund our work, how we make editorial decisions, and what we do when we get things wrong.')}
          </p>
        </div>

        {/* Funding */}
        <section className="mb-14">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-6 flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#6111ff]" />
            {t('Funding & Independence')}
          </h2>
          <div className="bg-white border border-[#1a1a1a]/10 p-8">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-4 text-sm font-mono uppercase tracking-wider">
                  {t("How we're funded")}
                </h3>
                <ul className="space-y-3 text-[#444444] text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{t('Reader-supported through free newsletter and community memberships')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{t('No corporate ownership or investor equity')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{t('No advertising revenue or sponsored content. Ever.')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{t('No political party or government funding')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{t('Editorial decisions made solely by our editorial team')}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-4 text-sm font-mono uppercase tracking-wider">
                  {t('What we never do')}
                </h3>
                <ul className="space-y-3 text-[#444444] text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold text-base leading-none mt-0.5">✕</span>
                    <span>{t('Republish wire copy or press releases without original reporting')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold text-base leading-none mt-0.5">✕</span>
                    <span>{t('Accept pay-for-play or sponsored journalism')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold text-base leading-none mt-0.5">✕</span>
                    <span>{t('Sell user data or track readers for advertising purposes')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold text-base leading-none mt-0.5">✕</span>
                    <span>{t('Take funding from organisations we cover')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold text-base leading-none mt-0.5">✕</span>
                    <span>{t('Suppress or alter coverage under commercial pressure')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* AI disclosure */}
        <section className="mb-14">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-6 flex items-center gap-3">
            <Bot className="h-5 w-5 text-[#6111ff]" />
            {t('AI Disclosure')}
          </h2>
          <div className="bg-white border border-[#1a1a1a]/10 p-8 space-y-5 text-[#444444] text-sm leading-relaxed">
            <p>
              {t('We use AI tools in our workflow. We do not use them to replace editorial judgment. Here is exactly what we use AI for, and where we draw the line:')}
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="border-t-2 border-emerald-500 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-emerald-600" />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-700">{t('Human-written')}</span>
                </div>
                <p className="text-sm text-[#666666]">
                  {t('All Morning Briefs and Deep Dives are written and edited by human journalists. AI may have been used for research or translation assistance. That\'s disclosed in the byline.')}
                </p>
              </div>
              <div className="border-t-2 border-amber-500 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Edit3 className="h-4 w-4 text-amber-600" />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-amber-700">{t('AI-assisted')}</span>
                </div>
                <p className="text-sm text-[#666666]">
                  {t('Some pieces use AI for initial research aggregation or draft structure, then receive full human editing, fact-checking, and editorial review before publication.')}
                </p>
              </div>
              <div className="border-t-2 border-[#6111ff] pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4 text-[#6111ff]" />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#6111ff]">{t('Wire / aggregated')}</span>
                </div>
                <p className="text-sm text-[#666666]">
                  {t('Wire items in our feed are AI-aggregated from public sources and clearly labelled. They represent our monitoring function, not our editorial voice.')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial standards */}
        <section className="mb-14">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-6 flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#6111ff]" />
            {t('Editorial Standards')}
          </h2>
          <div className="space-y-4">
            {[
              {
                n: '1',
                titleKey: 'Source verification',
                bodyKey: 'Every claim traces back to a primary source. A named person, an official document, or a verified publication. We do not publish anonymised allegations without corroboration.',
              },
              {
                n: '2',
                titleKey: 'Context, not crisis',
                bodyKey: 'Every piece is written assuming the reader has never visited the country in question. We explain institutions, name political parties, and give the minimum historical context needed to understand the story. We do not write about a crisis without explaining what caused it.',
              },
              {
                n: '3',
                titleKey: 'No assumed knowledge',
                bodyKey: 'A name, a place, or a political party that has not appeared in this piece before is explained when it first appears. Readers should be able to understand any article with no prior reading of LATAM Reportero.',
              },
              {
                n: '4',
                titleKey: 'Multilingual publishing',
                bodyKey: 'Content is published in English. Spanish and Portuguese versions use AI-assisted translation reviewed for accuracy. When translations are published, this is disclosed.',
              },
              {
                n: '5',
                titleKey: 'Corrections policy',
                bodyKey: 'When we make a factual error, we correct it promptly and note the correction in the article. We do not silently edit published pieces. Email editorial@latamreportero.com to flag an error.',
              },
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

        {/* Contact */}
        <section className="bg-[#1a1a1a] text-white p-8">
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl font-semibold mb-3">
              {t('Questions, corrections, or tips?')}
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              {t('We take corrections seriously and welcome feedback on our reporting. If you have a tip, a pitch, or want to discuss our coverage, reach out directly.')}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:contacto@latamreportero.com">
                <Button className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white rounded-none gap-2">
                  <Mail className="h-4 w-4" />
                  contacto@latamreportero.com
                </Button>
              </a>
              <a href="mailto:tips@latamreportero.com">
                <Button variant="outline" className="rounded-none border-white/30 text-white hover:bg-white/10 gap-2">
                  tips@latamreportero.com
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
