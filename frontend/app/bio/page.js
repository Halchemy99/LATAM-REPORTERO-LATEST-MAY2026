'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Loader2, Newspaper, Globe, Users } from 'lucide-react';

// /bio — TikTok and Instagram bio link destination
// Single page, zero nav, one primary CTA (newsletter), secondary links

const SOCIAL_LINKS = [
  { label: 'TikTok', handle: '@latamreportero', href: 'https://tiktok.com/@latamreportero', color: '#000000' },
  { label: 'Instagram', handle: '@latamreportero', href: 'https://instagram.com/latamreportero', color: '#E1306C' },
  { label: 'YouTube', handle: '@latamreportero', href: 'https://youtube.com/@latamreportero', color: '#FF0000' },
];

function NewsletterMini() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      await fetch(`${baseUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch { }
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 p-4 bg-[#6111ff]/15 border border-[#6111ff]/30">
        <CheckCircle className="h-5 w-5 text-[#6111ff] flex-shrink-0" />
        <div>
          <p className="text-white text-sm font-medium">You&apos;re in.</p>
          <p className="text-white/50 text-xs mt-0.5">First brief arrives tomorrow morning.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 min-w-0 bg-white/8 border border-white/20 text-white placeholder:text-white/35 px-4 py-3 text-sm focus:outline-none focus:border-[#6111ff]"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white px-4 py-3 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>Free <ArrowRight className="h-3.5 w-3.5" /></>
        )}
      </button>
    </form>
  );
}

export default function BioPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <span
            className="text-3xl font-bold tracking-tight text-white"
            
          >
            LATAM<span className="text-[#6111ff]">.</span>
          </span>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/35 mt-1">
            Reportero · Independent journalism
          </p>
        </div>

        {/* Primary CTA — newsletter */}
        <div className="bg-white/5 border border-white/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-4 w-4 text-[#6111ff]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">
              Free daily brief
            </span>
          </div>
          <p className="text-white text-sm leading-relaxed mb-4">
            Latin America explained, every weekday morning. Free. No account needed.
          </p>
          <NewsletterMini />
        </div>

        {/* Secondary links */}
        <Link href="/" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-white/25 transition-colors group">
          <div className="flex items-center gap-3">
            <Newspaper className="h-4 w-4 text-[#6111ff]" />
            <span className="text-white text-sm font-medium">Read the latest stories</span>
          </div>
          <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
        </Link>

        <Link href="/investigations" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-white/25 transition-colors group">
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-[#6111ff]" />
            <span className="text-white text-sm font-medium">Deep dives & investigations</span>
          </div>
          <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
        </Link>

        <Link href="/community" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-white/25 transition-colors group">
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-[#6111ff]" />
            <span className="text-white text-sm font-medium">Community (coming soon)</span>
          </div>
          <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
        </Link>

        {/* Social links */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/30 mb-3 text-center">
            Follow us
          </p>
          <div className="flex justify-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/5 border border-white/10 hover:border-white/30 text-white/60 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
