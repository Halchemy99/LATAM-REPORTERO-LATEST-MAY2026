'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import Newsletter from '@/components/Newsletter';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MessageCircle, Wallet } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand & Newsletter */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-lg" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>L</span>
              </div>
              <span className="ml-2 text-lg font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                LATAM Reportero
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Solutions-oriented journalism for Latin America. Independent, transparent, community-driven.
            </p>
            <Newsletter variant="footer" />
          </div>

          {/* Journalism */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 uppercase text-xs tracking-wider">Journalism</h3>
            <ul className="space-y-2">
              <li><Link href="/solutions" className="text-sm text-muted-foreground hover:text-foreground link-underline">All Stories</Link></li>
              <li><Link href="/writers" className="text-sm text-muted-foreground hover:text-foreground link-underline">Contributors</Link></li>
              <li><Link href="/methodology" className="text-sm text-muted-foreground hover:text-foreground link-underline">Methodology</Link></li>
              <li><Link href="/solutions?category=environment" className="text-sm text-muted-foreground hover:text-foreground link-underline">Environment</Link></li>
              <li><Link href="/solutions?category=economy" className="text-sm text-muted-foreground hover:text-foreground link-underline">Economy</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 uppercase text-xs tracking-wider">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/community" className="text-sm text-muted-foreground hover:text-foreground link-underline">Join Network</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground link-underline">Membership</Link></li>
              <li><Link href="/contributor/login" className="text-sm text-muted-foreground hover:text-foreground link-underline">Become a Writer</Link></li>
              <li>
                <a href="https://signal.group" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground link-underline flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> Signal Groups
                </a>
              </li>
            </ul>
          </div>

          {/* Transparency */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 uppercase text-xs tracking-wider">Transparency</h3>
            <ul className="space-y-2">
              <li><Link href="/transparency/funding" className="text-sm text-muted-foreground hover:text-foreground link-underline">Our Funding</Link></li>
              <li><Link href="/transparency/editorial" className="text-sm text-muted-foreground hover:text-foreground link-underline">Editorial Policy</Link></li>
              <li><Link href="/transparency/data" className="text-sm text-muted-foreground hover:text-foreground link-underline">Data Privacy</Link></li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground link-underline flex items-center gap-1">
                  <Wallet className="h-3 w-3" /> Crypto Donation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/latamreportero/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/latam-reportero/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:contact@latamreportero.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href="/transparency/editorial" className="hover:text-foreground">Terms</Link>
              <Link href="/transparency/data" className="hover:text-foreground">Privacy</Link>
              <Link href="/sitemap.xml" className="hover:text-foreground">Sitemap</Link>
            </div>

            {/* Copyright */}
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} LATAM Reportero. Independent journalism.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
