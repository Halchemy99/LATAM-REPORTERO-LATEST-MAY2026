'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import { Facebook, Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react';

const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#1a1a1a] text-white" data-testid="footer">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              LATAM <span className="text-[#6110ff]">Reportero</span>
            </h2>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
              Independent, solutions-oriented journalism for Latin America. 
              Transparent. Community-driven. Every story follows Problem &rarr; Solutions &rarr; Impact.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/latamreportero/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#6110ff] transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@latamreportero" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#6110ff] transition-colors" aria-label="TikTok">
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/company/latam-reportero/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#6110ff] transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="mailto:contact@latamreportero.com" className="text-white/40 hover:text-[#6110ff] transition-colors" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Journalism */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/50 mb-4">Journalism</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">All Stories</Link></li>
              <li><Link href="/?category=politics" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">Investigations</Link></li>
              <li><Link href="/?category=environment" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">Environment</Link></li>
              <li><Link href="/?category=economy" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">Economy</Link></li>
              <li><Link href="/?category=health" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">Health</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/50 mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/community" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">Join Network</Link></li>
              <li><Link href="/pricing" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">Membership</Link></li>
              <li><Link href="/auth/signup" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">Create Account</Link></li>
              <li>
                <a href="https://signal.group" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors inline-flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> Signal
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/50 mb-4">Transparency</h3>
            <ul className="space-y-2">
              <li><Link href="/transparency" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">Editorial Standards</Link></li>
              <li><Link href="/transparency" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">Our Funding</Link></li>
              <li><Link href="/transparency" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">Data & Privacy</Link></li>
              <li><Link href="/transparency" className="text-sm text-white/70 hover:text-[#6110ff] transition-colors">AI Disclosure</Link></li>
            </ul>
          </div>

          {/* Subscribe */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/50 mb-4">Stay Informed</h3>
            <p className="text-sm text-white/60 mb-3">Solutions journalism delivered weekly.</p>
            <Link href="/auth/signup">
              <button className="w-full h-9 px-4 text-xs font-medium bg-[#6110ff] hover:bg-[#B84A30] text-white transition-colors" data-testid="footer-subscribe-btn">
                Subscribe Free
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-white/40" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              &copy; {new Date().getFullYear()} LATAM Reportero. Independent journalism for Latin America.
            </p>
            <div className="flex items-center gap-5 text-[11px] text-white/40" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              <Link href="/transparency" className="hover:text-white/70 transition-colors">Terms</Link>
              <Link href="/transparency" className="hover:text-white/70 transition-colors">Privacy</Link>
              <Link href="/transparency" className="hover:text-white/70 transition-colors">AI Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
