'use client';

import Link from 'next/link';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';

const SECTIONS = [
  { label: 'Morning Brief', href: '/?type=morning-brief' },
  { label: 'Press Review', href: '/?type=press-review' },
  { label: 'Deep Dives', href: '/solutions?type=deep-dive' },
  { label: 'Regions', href: '/' },
];

const NEWSROOM = [
  { label: 'Methodology', href: '/transparency' },
  { label: 'Editorial Standards', href: '/transparency' },
  { label: 'Funding & Independence', href: '/transparency' },
  { label: 'AI Disclosure', href: '/transparency' },
];

const COMMUNITY = [
  { label: 'Pitch a story', href: '/submit' },
  { label: 'Membership', href: '/pricing' },
  { label: 'Create account', href: '/auth/signup' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[#F7F5F2] border-t border-[#1a1a1a]/10"
      data-testid="footer"
    >
      {/* Subscribe band */}
      <div className="border-b border-[#1a1a1a]/10">
        <div className="container py-10 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6110ff] mb-2">
              The Wire for Latin America
            </p>
            <h2
              className="font-serif text-2xl lg:text-3xl font-semibold text-[#1a1a1a] leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Get the Morning Brief in your inbox.
              <span className="block text-[#666666] font-normal text-lg lg:text-xl mt-1">
                Latin America, before your coffee. Weekday mornings.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <Link href="/auth/signup">
              <button
                className="group flex items-center justify-between w-full bg-[#1a1a1a] hover:bg-[#6110ff] text-white px-5 py-4 transition-colors"
                data-testid="footer-subscribe-btn"
              >
                <span className="text-sm font-medium uppercase tracking-[0.1em]">
                  Subscribe — free to start
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <p className="text-[11px] text-[#666666] mt-2">
              No spam. Cancel anytime. Read by editors, founders & analysts across LATAM.
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
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              LATAM<span className="text-[#6110ff]">.</span>
            </span>
            <span className="ml-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666]">
              Reportero
            </span>
          </Link>
          <p className="text-sm text-[#666666] leading-relaxed max-w-xs mt-4">
            A wire service for the next generation. Curated briefs, press reviews
            and original reporting on Latin America — built for how people actually
            read in 2026.
          </p>
          <a
            href="mailto:hello@latamreportero.com"
            className="inline-flex items-center gap-2 text-sm text-[#1a1a1a] hover:text-[#6110ff] transition-colors mt-5"
            data-testid="footer-email-link"
          >
            <Mail className="h-3.5 w-3.5" />
            hello@latamreportero.com
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
      <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6110ff] mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-sm text-[#1a1a1a]/80 hover:text-[#6110ff] transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
