'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUserRole, useTranslation } from '@/lib/providers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Lock, Users, MessageCircle, Shield, Crown,
  MapPin, ArrowRight, CheckCircle
} from 'lucide-react';

// Regional community groups
const COMMUNITY_GROUPS = [
  { region: 'Mexico', slug: 'mexico', members: 847, description: 'News, analysis, and discussions about Mexico' },
  { region: 'Brazil', slug: 'brazil', members: 1203, description: 'Brazilian news and Portuguese discussions' },
  { region: 'Argentina', slug: 'argentina', members: 634, description: 'Argentine politics, economy, and culture' },
  { region: 'Colombia', slug: 'colombia', members: 521, description: 'Colombian news and regional updates' },
  { region: 'Chile', slug: 'chile', members: 389, description: 'Chilean society, politics, and environment' },
  { region: 'Peru', slug: 'peru', members: 298, description: 'Peruvian news and Andean region coverage' },
  { region: 'Central America', slug: 'central-america', members: 456, description: 'Guatemala, Honduras, El Salvador, Nicaragua, Costa Rica, Panama' },
  { region: 'Caribbean', slug: 'caribbean', members: 312, description: 'Cuba, Dominican Republic, Haiti, Puerto Rico, Jamaica' },
];

// WhatsApp icon component
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Signal icon component
const SignalIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c4.639 0 8.4 3.761 8.4 8.4s-3.761 8.4-8.4 8.4-8.4-3.761-8.4-8.4S7.361 3.6 12 3.6zm0 2.4a6 6 0 100 12 6 6 0 000-12zm0 2.4a3.6 3.6 0 110 7.2 3.6 3.6 0 010-7.2z"/>
  </svg>
);

export default function CommunityPage() {
  const { t } = useTranslation();
  const { user, isSubscribed, role } = useUserRole();
  const [selectedPlatform, setSelectedPlatform] = useState('whatsapp');

  const hasAccess = isSubscribed || ['contributor', 'editor', 'admin'].includes(role);

  return (
    <div className="min-h-screen bg-[#F9F6F6]">
      <Header />

      <main className="container py-12">
        {/* Hero */}
        <div className="max-w-3xl mb-12">
          <Badge className="mb-4 bg-[#1a1a1a] text-white rounded-none font-mono text-xs uppercase tracking-wider">
            <Users className="h-3 w-3 mr-1" />
            Subscriber Community
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#1a1a1a] mb-6 leading-tight">
            {t('community.title')}
          </h1>
          <p className="text-xl text-[#666666] leading-relaxed">
            {t('community.subtitle')}
          </p>
        </div>

        {/* Access Gate for Non-Subscribers */}
        {!hasAccess && (
          <div className="bg-white border-2 border-[#6111ff]/30 p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#6111ff]/10 flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-[#6111ff]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">
                  {t('community.subscriberTitle')}
                </h2>
                <p className="text-[#666666] mb-4">
                  {t('community.subscriberDesc')}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-[#666666]">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>8 regional groups</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#666666]">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>4,600+ {t('community.members')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#666666]">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Direct access to reporters</span>
                  </div>
                </div>
                <Link href="/pricing">
                  <Button className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white rounded-none gap-2">
                    <Crown className="h-4 w-4" />
                    {t('community.subscribeBtn')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Platform Toggle */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-sm text-[#666666]">{t('community.choosePlatform')}</span>
          <div className="flex gap-1 bg-[#1a1a1a]/5 p-1">
            <button
              onClick={() => setSelectedPlatform('whatsapp')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedPlatform === 'whatsapp'
                  ? 'bg-[#25D366] text-white'
                  : 'text-[#666666] hover:bg-[#1a1a1a]/5'
              }`}
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </button>
            <button
              onClick={() => setSelectedPlatform('signal')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedPlatform === 'signal'
                  ? 'bg-[#3A76F0] text-white'
                  : 'text-[#666666] hover:bg-[#1a1a1a]/5'
              }`}
            >
              <SignalIcon className="h-4 w-4" />
              Signal
            </button>
          </div>
        </div>

        {/* Regional Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {COMMUNITY_GROUPS.map((group) => (
            <Card
              key={group.slug}
              className={`rounded-none border-[#1a1a1a]/10 ${!hasAccess ? 'opacity-75' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-[#6111ff]" />
                  <h3 className="font-semibold text-[#1a1a1a]">{group.region}</h3>
                </div>
                <p className="text-sm text-[#666666] mb-3 line-clamp-2">
                  {group.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#666666] font-mono">
                    {group.members.toLocaleString()} {t('community.members')}
                  </span>
                  {hasAccess ? (
                    <Link
                      href="/newsletter"
                      className="flex items-center gap-1 text-sm font-medium text-[#6111ff] hover:text-[#4a0dd6]"
                    >
                      {t('community.notifyMe')}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-[#666666]">
                      <Lock className="h-3 w-3" />
                      {t('community.locked')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Guidelines */}
        <section className="bg-white border border-[#1a1a1a]/10 p-8 mb-12">
          <h2 className="text-2xl font-serif font-semibold text-[#1a1a1a] mb-6">
            {t('community.guidelinesTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-[#6111ff] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">{t('community.respectTitle')}</h3>
                <p className="text-sm text-[#666666]">{t('community.respectDesc')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MessageCircle className="h-5 w-5 text-[#6111ff] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">{t('community.onTopicTitle')}</h3>
                <p className="text-sm text-[#666666]">{t('community.onTopicDesc')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Users className="h-5 w-5 text-[#6111ff] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">{t('community.noSpamTitle')}</h3>
                <p className="text-sm text-[#666666]">{t('community.noSpamDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA for Non-Subscribers */}
        {!hasAccess && (
          <section className="bg-[#1a1a1a] text-white p-8 text-center">
            <h2 className="text-2xl font-serif font-semibold mb-4">
              {t('community.readyTitle')}
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              {t('community.readyDesc')}
            </p>
            <Link href="/pricing">
              <Button className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white rounded-none gap-2">
                {t('community.viewPlans')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
