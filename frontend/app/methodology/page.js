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

export default function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-[#1a1a1a] text-white">
          <div className="container py-12 md:py-16">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 mb-4">
              Methodology
            </p>
            <h1
              className="font-serif text-4xl md:text-5xl font-semibold text-white leading-[1.05] mb-5 max-w-3xl"
              
            >
              How we report on Latin America.
            </h1>
            <p className="text-white/65 text-lg max-w-2xl leading-relaxed">
              We are not a breaking-news operation. We are not investigative reporters. We explain what is happening in the region, and why it matters. That is a specific editorial discipline, and these are the standards we hold ourselves to.
            </p>
          </div>
        </div>

        {/* Story approach */}
        <section className="container py-14 max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-6">
            What every story must do
          </h2>
          <div className="space-y-4 text-[#444444] text-base leading-relaxed">
            <p>
              Every piece we publish has to answer two questions before it can be assigned: what is actually happening here, and why does it matter to someone who is curious about the region but not an expert in it?
            </p>
            <p>
              That second question is the hard one. Latin America is not a monolith. A story about fiscal policy in Chile means something different than one in Argentina. A story about indigenous land rights in Brazil requires different context than one in Mexico. We write each piece as if the reader is intelligent, globally aware, and completely new to this specific country or situation.
            </p>
            <p>
              We do not assume readers have read our previous coverage. We do not use abbreviations or acronyms without explaining them. We name political parties. We explain what institutions do. We give the minimum historical context needed to understand the present, every time.
            </p>
          </div>
        </section>

        {/* Three pillars */}
        <section className="bg-white border-t border-b border-[#1a1a1a]/10">
          <div className="container py-14">
            <h2 className="font-serif text-xl font-semibold text-[#1a1a1a] mb-8 font-mono uppercase tracking-wider text-sm">
              Our editorial approach
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-8 h-8 bg-[#6111ff] flex items-center justify-center mb-4">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] mb-2">
                  Context before event
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  We explain what is happening in full context. Not just what occurred, but the institutions involved, the history behind it, and who the people are. A reader should be able to understand our story without searching for background elsewhere.
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-[#6111ff] flex items-center justify-center mb-4">
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] mb-2">
                  Explanatory, not reactive
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  We are not a wire service. We do not publish the moment something happens. We publish when we can explain it properly. That means our briefs are written after the context is clear, not while it is still developing.
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-[#6111ff] flex items-center justify-center mb-4">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] mb-2">
                  Primary sources only
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  Every claim traces to a named person, an official document, or a verified publication. We do not publish anonymised allegations without corroboration from at least two independent sources.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story structure */}
        <section className="container py-14 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-6">
            How a brief is structured
          </h2>
          <div className="space-y-5">
            {[
              {
                n: '1',
                title: 'What happened',
                body: 'One or two sentences, factual and precise. Not a headline. Not a hook. The actual thing that occurred. Then the immediate context.',
              },
              {
                n: '2',
                title: 'Who is involved and why',
                body: 'Names, titles, institutions. Every person named in a brief has their role explained in the same sentence they appear. Every institution is described the first time it appears.',
              },
              {
                n: '3',
                title: 'What led here',
                body: 'The minimum historical or political context a reader needs to understand what is at stake. Not a history lesson. One to three paragraphs that prevent misreading.',
              },
              {
                n: '4',
                title: 'Why it matters beyond this moment',
                body: 'What does this mean for the country, the region, or a broader trend the reader should understand? This is the part that makes a brief worth reading over a wire summary.',
              },
            ].map((item) => (
              <div key={item.n} className="flex gap-4 items-start bg-white border border-[#1a1a1a]/10 p-5">
                <div className="w-7 h-7 bg-[#1a1a1a] text-white flex items-center justify-center font-mono text-xs flex-shrink-0">
                  {item.n}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-1 text-sm">{item.title}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">{item.body}</p>
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
                Full transparency
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Our full editorial standards, AI disclosure policy, corrections procedure, and funding information are on our Transparency page.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/transparency">
                  <Button className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white rounded-none gap-2">
                    <FileText className="h-4 w-4" />
                    Editorial standards
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="rounded-none border-white/30 text-white hover:bg-white/10 gap-2">
                    About us
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
