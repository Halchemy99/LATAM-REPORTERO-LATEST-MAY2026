'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Globe, Users, Newspaper } from 'lucide-react';
import { useTranslation } from '@/lib/providers';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-[#1a1a1a] text-white">
          <div className="container py-12 md:py-16">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 mb-4">
              {t('about.label')}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.05] mb-5 max-w-3xl">
              {t('about.headline')}
            </h1>
            <p className="text-white/65 text-lg max-w-2xl leading-relaxed">
              {t('about.description')}
            </p>
          </div>
        </div>

        {/* Mission */}
        <section className="container py-14 max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-5">
            {t('about.missionTitle')}
          </h2>
          <div className="space-y-4 text-[#444444] text-base leading-relaxed">
            <p>
              Latin America contains 650 million people, 20 distinct political systems, the world&apos;s largest rainforest, and some of the most innovative journalism anywhere on earth. It is consistently undercovered in English-language media.
            </p>
            <p>
              When it does appear in global newsrooms, it&apos;s usually through the lens of crisis. A coup, a hurricane, a cartel story. The ordinary complexity of the region&apos;s politics, its cities, its economic experiments, its cultural output — that largely doesn&apos;t make it out.
            </p>
            <p>
              We started LATAM Reportero to close that gap. Not with wire aggregation or press-release journalism, but with explanatory, contextual storytelling that assumes you&apos;re intelligent and new to the region. Every piece we publish has to answer the question: <em>&ldquo;why does this matter, and what does it mean?&rdquo;</em>
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="bg-white border-t border-b border-[#1a1a1a]/10">
          <div className="container py-14">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[#1a1a1a] font-semibold mb-8">
              {t('about.howWeWork')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-8 h-8 bg-[#6111ff] flex items-center justify-center mb-4">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] mb-2">
                  {t('about.contextTitle')}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {t('about.contextDesc')}
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-[#6111ff] flex items-center justify-center mb-4">
                  <Newspaper className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] mb-2">
                  {t('about.explanatoryTitle')}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {t('about.explanatoryDesc')}
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-[#6111ff] flex items-center justify-center mb-4">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] mb-2">
                  {t('about.independentTitle')}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {t('about.independentDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI disclosure */}
        <section className="container py-14 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-4">
            {t('about.aiTitle')}
          </h2>
          <p className="text-[#444444] text-base leading-relaxed mb-4">
            {t('about.aiP1')}
          </p>
          <p className="text-[#444444] text-base leading-relaxed">
            {t('about.aiP2')}
          </p>
          <div className="mt-6">
            <Link href="/transparency">
              <Button variant="outline" className="rounded-none border-[#1a1a1a]/20 gap-2 text-sm">
                {t('about.transparencyBtn')}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-[#1a1a1a] text-white">
          <div className="container py-12">
            <div className="max-w-2xl">
              <h2 className="font-serif text-2xl font-semibold mb-4">
                {t('about.contactTitle')}
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                {t('about.contactDesc')}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:contacto@latamreportero.com">
                  <Button className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white rounded-none gap-2">
                    <Mail className="h-4 w-4" />
                    contacto@latamreportero.com
                  </Button>
                </a>
                <Link href="/submit">
                  <Button variant="outline" className="rounded-none border-white/30 text-white hover:bg-white/10 gap-2">
                    {t('about.pitchStory')}
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
