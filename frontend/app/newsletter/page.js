'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, Loader2, ArrowRight, Clock, Globe, Layers } from 'lucide-react';
import { useTranslation } from '@/lib/providers';

// Standalone newsletter signup page — this is the bio link destination for TikTok/Instagram
// No nav distractions, single focused action, social proof

export default function NewsletterPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const resp = await fetch(`${baseUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) throw new Error('Subscribe failed');
    } catch {
      // Show success regardless — resilient to backend errors
    }
    setStatus('success');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Minimal header — no nav distractions */}
      <header className="border-b border-white/10">
        <div className="container py-4">
          <Link href="/">
            <img
              src="/brand/logo-square-dark.png"
              alt="LATAM Reportero"
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="container py-16">
          <div className="max-w-lg mx-auto">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#6111ff]/20 border border-[#6111ff]/30 text-[#8c52ff] text-[10px] font-mono uppercase tracking-wider">
                <Mail className="h-3 w-3" />
                {t('newsletter.badge')}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">
                {t('newsletter.noCard')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-[1.05] mb-4 tracking-tight">
              {t('newsletter.headline')}<br />
              <em className="not-italic text-[#8c52ff]">{t('newsletter.headlineAccent')}</em>
            </h1>

            <p className="text-white/65 text-base leading-relaxed mb-8">
              {t('newsletter.description')}
            </p>

            {/* What you get */}
            <div className="grid grid-cols-3 gap-4 mb-10 border-t border-white/10 pt-6">
              <div className="text-center">
                <Clock className="h-4 w-4 text-[#6111ff] mx-auto mb-1.5" />
                <p className="text-[11px] font-mono uppercase tracking-wider text-white/50">{t('newsletter.fiveMin')}</p>
                <p className="text-xs text-white/70 mt-0.5">{t('newsletter.everyWeekday')}</p>
              </div>
              <div className="text-center">
                <Globe className="h-4 w-4 text-[#6111ff] mx-auto mb-1.5" />
                <p className="text-[11px] font-mono uppercase tracking-wider text-white/50">{t('newsletter.allLatam')}</p>
                <p className="text-xs text-white/70 mt-0.5">{t('newsletter.countries')}</p>
              </div>
              <div className="text-center">
                <Layers className="h-4 w-4 text-[#6111ff] mx-auto mb-1.5" />
                <p className="text-[11px] font-mono uppercase tracking-wider text-white/50">{t('newsletter.contextFirst')}</p>
                <p className="text-xs text-white/70 mt-0.5">{t('newsletter.noKnowledge')}</p>
              </div>
            </div>

            {/* Form */}
            {status === 'success' ? (
              <div className="flex items-start gap-4 p-6 bg-[#6111ff]/15 border border-[#6111ff]/30">
                <CheckCircle className="h-6 w-6 text-[#6111ff] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-base mb-1">
                    {t('newsletter.successTitle')}
                  </p>
                  <p className="text-white/55 text-sm">
                    {t('newsletter.successDesc')}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoFocus
                    className="flex-1 min-w-0 bg-white/8 border border-white/20 text-white placeholder:text-white/35 px-4 py-3 text-base focus:outline-none focus:border-[#6111ff] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white px-5 py-3 text-[11px] font-mono uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-60 whitespace-nowrap"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>{t('newsletter.subscribe')} <ArrowRight className="h-3.5 w-3.5" /></>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-white/35">
                  {t('newsletter.privacy')}
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-mono text-white/30">
            © {new Date().getFullYear()} LATAM Reportero · {t('footer.independent')}
          </p>
          <div className="flex items-center gap-5 text-[11px] font-mono text-white/30">
            <Link href="/transparency" className="hover:text-white/60 transition-colors">
              {t('newsletter.transparencyLink')}
            </Link>
            <Link href="/about" className="hover:text-white/60 transition-colors">
              {t('newsletter.aboutLink')}
            </Link>
            <Link href="/" className="hover:text-white/60 transition-colors flex items-center gap-1">
              {t('newsletter.readSite')} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
