'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import Newsletter from '@/components/Newsletter';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MessageCircle, Wallet } from 'lucide-react';

// Custom TikTok icon (lucide-react doesn't have one)
const TikTokIcon = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-[#E7DAC4]/20">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand & Newsletter */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8c52ff] to-[#6111ff] flex items-center justify-center rounded-sm">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'Raleway, sans-serif' }}>L</span>
              </div>
              <span className="ml-2.5 text-lg font-bold tracking-tight" style={{ fontFamily: 'Raleway, sans-serif' }}>
                LATAM <span className="text-[#8c52ff]">Reportero</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs" style={{ fontFamily: 'Source Serif 4, serif' }}>
              Solutions-oriented journalism for Latin America. Independent, transparent, community-driven.
            </p>
            <Newsletter variant="footer" />
          </div>

          {/* Journalism */}
          <div>
            <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider" style={{ fontFamily: 'Raleway, sans-serif' }}>Journalism</h3>
            <ul className="space-y-2">
              <li><Link href="/solutions" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors">All Stories</Link></li>
              <li><Link href="/writers" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors">Contributors</Link></li>
              <li><Link href="/methodology" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors">Methodology</Link></li>
              <li><Link href="/solutions?category=environment" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors">Environment</Link></li>
              <li><Link href="/solutions?category=economy" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors">Economy</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider" style={{ fontFamily: 'Raleway, sans-serif' }}>Community</h3>
            <ul className="space-y-2">
              <li><Link href="/community" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors">Join Network</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors">Membership</Link></li>
              <li><Link href="/contributor/login" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors">Become a Writer</Link></li>
              <li>
                <a href="https://signal.group" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> Signal Groups
                </a>
              </li>
            </ul>
          </div>

          {/* Transparency */}
          <div>
            <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider" style={{ fontFamily: 'Raleway, sans-serif' }}>Transparency</h3>
            <ul className="space-y-2">
              <li><Link href="/transparency/funding" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors">Our Funding</Link></li>
              <li><Link href="/transparency/editorial" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors">Editorial Policy</Link></li>
              <li><Link href="/transparency/data" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors">Data Privacy</Link></li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-[#8c52ff] link-underline transition-colors flex items-center gap-1">
                  <Wallet className="h-3 w-3" /> Crypto Donation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#8c52ff]/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-muted-foreground hover:text-[#8c52ff] transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-[#8c52ff] transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/latamreportero/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#8c52ff] transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@latamreportero" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#8c52ff] transition-colors" aria-label="TikTok">
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/latam-reportero/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#8c52ff] transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:contact@latamreportero.com" className="text-muted-foreground hover:text-[#8c52ff] transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-xs text-muted-foreground" style={{ fontFamily: 'Raleway, sans-serif' }}>
              <Link href="/transparency/editorial" className="hover:text-[#8c52ff] transition-colors">Terms</Link>
              <Link href="/transparency/data" className="hover:text-[#8c52ff] transition-colors">Privacy</Link>
              <Link href="/sitemap.xml" className="hover:text-[#8c52ff] transition-colors">Sitemap</Link>
            </div>

            {/* Copyright */}
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Raleway, sans-serif' }}>
              © {new Date().getFullYear()} LATAM Reportero. Independent journalism.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
