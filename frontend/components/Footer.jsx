'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.about')}</h3>
            <ul className="space-y-2">
              <li><Link href="/methodology" className="text-sm text-muted-foreground hover:text-primary">Methodology</Link></li>
              <li><Link href="/methodology/trust-score" className="text-sm text-muted-foreground hover:text-primary">Trust Score</Link></li>
              <li><Link href="/writers" className="text-sm text-muted-foreground hover:text-primary">Our Writers</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.categories')}</h3>
            <ul className="space-y-2">
              <li><Link href="/solutions?category=environment" className="text-sm text-muted-foreground hover:text-primary">{t('categories.environment')}</Link></li>
              <li><Link href="/solutions?category=economy" className="text-sm text-muted-foreground hover:text-primary">{t('categories.economy')}</Link></li>
              <li><Link href="/solutions?category=health" className="text-sm text-muted-foreground hover:text-primary">{t('categories.health')}</Link></li>
              <li><Link href="/solutions?category=education" className="text-sm text-muted-foreground hover:text-primary">{t('categories.education')}</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.community')}</h3>
            <ul className="space-y-2">
              <li><Link href="/communities" className="text-sm text-muted-foreground hover:text-primary">Communities</Link></li>
              <li><Link href="/trending" className="text-sm text-muted-foreground hover:text-primary">Trending</Link></li>
              <li><Link href="/contributor/login" className="text-sm text-muted-foreground hover:text-primary">Become a Contributor</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li><Link href="/transparency" className="text-sm text-muted-foreground hover:text-primary">Transparency</Link></li>
              <li><Link href="/transparency/funding" className="text-sm text-muted-foreground hover:text-primary">Funding</Link></li>
              <li><Link href="/transparency/data" className="text-sm text-muted-foreground hover:text-primary">{t('footer.privacy')}</Link></li>
              <li><Link href="/transparency/editorial" className="text-sm text-muted-foreground hover:text-primary">{t('footer.terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <span className="ml-2 text-lg font-bold">LATAM <span className="text-primary">Reportero</span></span>
          </div>

          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></a>
          </div>

          <p className="text-sm text-muted-foreground">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
