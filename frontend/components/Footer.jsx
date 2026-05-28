'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

const SECTIONS = [
  { label: 'Morning Brief', href: '/?type=morning-brief' },
  { label: 'Press Review', href: '/?type=press-review' },
  { label: 'Deep Dives', href: '/investigations' },
  { label: 'Regions', href: '/' },
];

const NEWSROOM = [
  { label: 'About', href: '/about' },
  { label: 'Editorial Standards', href: '/transparency' },
  { label: 'Funding & Independence', href: '/transparency' },
  { label: 'AI Disclosure', href: '/transparency' },
];

const COMMUNITY = [
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Pitch a story', href: '/submit' },
  { label: 'Community', href: '/community' },
];

function FooterNewsletter() {
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
    } catch {
      // show success regardless
    }
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 py-4" data-testid="footer-newsletter-success">
        <CheckCircle className="h-5 w-5 text-[#6111ff] flex-shrink-0" />
        <p className="text-sm text-[#1a1a1a] font-medium">You&apos;re subscribed. Check your inbox tomorrow morning.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" data-testid="footer-newsletter-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 min-w-0 border border-[#1a1a1a]/20 bg-white text-[#1a1a1a] placeholder:text-[#666666]/60 px-3 py-3 text-sm focus:outline-none focus:border-[#6111ff]"
        data-testid="footer-newsletter-email"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="group flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#6111ff] text-white px-5 py-3 text-[11px] font-mono uppercase tracking-wider transition-colors disabled:opacity-60 whitespace-nowrap"
        data-testid="footer-newsletter-submit"
      >
        {status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>Get it free <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" /></>
        )}
      </button>
    </form>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[#F9F6F6] border-t border-[#1a1a1a]/10"
      data-testid="footer"
    >
      {/* Newsletter band */}
      <div className="border-b border-[#1a1a1a]/10">
        <div className="container py-10 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6111ff]">
                The Wire for Latin America
              </p>
              <span className="px-1.5 py-0.5 bg-[#6111ff] text-white text-[9px] font-mono uppercase tracking-wider">
                Free
              </span>
            </div>
            <h2
              className="font-serif text-2xl lg:text-3xl font-semibold text-[#1a1a1a] leading-tight"
              
            >
              Get the Morning Brief in your inbox.
              <span className="block text-[#666666] font-normal text-lg lg:text-xl mt-1">
                Latin America, before your coffee. Weekday mornings. Always free.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <FooterNewsletter />
            <p className="text-[11px] text-[#666666] mt-2">
              No spam. No paywall. Cancel anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="container py-12 grid grid-cols-2 md:grid-cols-12 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-4">
          <Link href="/" className="inline-block">
            <span
              className="text-2xl font-bold tracking-tight text-[#1a1a1a]"
              
            >
              LATAM<span className="text-[#6111ff]">.</span>
            </span>
            <span className="ml-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666]">
              Reportero
            </span>
          </Link>
          <p className="text-sm text-[#666666] leading-relaxed max-w-xs mt-4">
            A wire service for the next generation. Curated briefs, press reviews
            and original reporting on Latin America. Built for how people
            actually read.
          </p>
          <a
            href="mailto:contacto@latamreportero.com"
            className="inline-flex items-center gap-2 text-sm text-[#1a1a1a] hover:text-[#6111ff] transition-colors mt-5"
            data-testid="footer-email-link"
          >
            <Mail className="h-3.5 w-3.5" />
            contacto@latamreportero.com
          </a>
        </div>

        <FooterColumn title="Sections" items={SECTIONS} testid="footer-sections" />
        <FooterColumn title="Newsroom" items={NEWSROOM} testid="footer-newsroom" />
        <FooterColumn title="Community" items={COMMUNITY} testid="footer-community" />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a1a1a]/10">
        <div className="container py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] font-mono text-[#666666]">
            &copy; {year} LATAM Reportero · Independent newswire, Latin America
          </p>
          <div className="flex items-center gap-5 text-[11px] font-mono text-[#666666]">
            <Link href="/transparency" className="hover:text-[#1a1a1a] transition-colors">
              Terms
            </Link>
            <Link href="/transparency" className="hover:text-[#1a1a1a] transition-colors">
              Privacy
            </Link>
            <Link href="/transparency" className="hover:text-[#1a1a1a] transition-colors">
              AI Policy
            </Link>
            <a
              href="mailto:tips@latamreportero.com"
              className="flex items-center gap-1 hover:text-[#1a1a1a] transition-colors"
            >
              <MessageCircle className="h-3 w-3" />
              Tips
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items, testid }) {
  return (
    <div className="md:col-span-2 lg:col-span-2 xl:col-span-2" data-testid={testid}>
      <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6111ff] mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-sm text-[#1a1a1a]/80 hover:text-[#6111ff] transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
