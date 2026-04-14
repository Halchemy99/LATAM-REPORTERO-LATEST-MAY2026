'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUserRole } from '@/lib/providers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import GlobalSearchBar from '@/components/GlobalSearchBar';
import Footer from '@/components/Footer';
import { 
  Lock, Users, MessageCircle, Shield, Crown, ExternalLink,
  MapPin, ArrowRight, CheckCircle
} from 'lucide-react';

// Regional community groups
const COMMUNITY_GROUPS = [
  {
    region: 'Mexico',
    slug: 'mexico',
    members: 847,
    whatsapp: 'https://chat.whatsapp.com/example-mexico',
    signal: 'https://signal.group/example-mexico',
    description: 'News, analysis, and discussions about Mexico'
  },
  {
    region: 'Brazil',
    slug: 'brazil',
    members: 1203,
    whatsapp: 'https://chat.whatsapp.com/example-brazil',
    signal: 'https://signal.group/example-brazil',
    description: 'Brazilian news and Portuguese discussions'
  },
  {
    region: 'Argentina',
    slug: 'argentina',
    members: 634,
    whatsapp: 'https://chat.whatsapp.com/example-argentina',
    signal: 'https://signal.group/example-argentina',
    description: 'Argentine politics, economy, and culture'
  },
  {
    region: 'Colombia',
    slug: 'colombia',
    members: 521,
    whatsapp: 'https://chat.whatsapp.com/example-colombia',
    signal: 'https://signal.group/example-colombia',
    description: 'Colombian news and regional updates'
  },
  {
    region: 'Chile',
    slug: 'chile',
    members: 389,
    whatsapp: 'https://chat.whatsapp.com/example-chile',
    signal: 'https://signal.group/example-chile',
    description: 'Chilean society, politics, and environment'
  },
  {
    region: 'Peru',
    slug: 'peru',
    members: 298,
    whatsapp: 'https://chat.whatsapp.com/example-peru',
    signal: 'https://signal.group/example-peru',
    description: 'Peruvian news and Andean region coverage'
  },
  {
    region: 'Central America',
    slug: 'central-america',
    members: 456,
    whatsapp: 'https://chat.whatsapp.com/example-central',
    signal: 'https://signal.group/example-central',
    description: 'Guatemala, Honduras, El Salvador, Nicaragua, Costa Rica, Panama'
  },
  {
    region: 'Caribbean',
    slug: 'caribbean',
    members: 312,
    whatsapp: 'https://chat.whatsapp.com/example-caribbean',
    signal: 'https://signal.group/example-caribbean',
    description: 'Cuba, Dominican Republic, Haiti, Puerto Rico, Jamaica'
  },
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
  const { user, isSubscribed, role } = useUserRole();
  const [selectedPlatform, setSelectedPlatform] = useState('whatsapp');
  
  // Check if user has access
  const hasAccess = isSubscribed || ['contributor', 'editor', 'admin'].includes(role);

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      <Header />
      <GlobalSearchBar />
      
      <main className="container py-12">
        {/* Hero */}
        <div className="max-w-3xl mb-12">
          <Badge className="mb-4 bg-[#1a1a1a] text-white rounded-none font-mono text-xs uppercase tracking-wider">
            <Users className="h-3 w-3 mr-1" />
            Subscriber Community
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#1a1a1a] mb-6 leading-tight">
            Join the Conversation
          </h1>
          <p className="text-xl text-[#666666] leading-relaxed">
            Connect with fellow readers, journalists, and experts in our regional community groups. 
            Discuss stories, share insights, and stay informed.
          </p>
        </div>

        {/* Access Gate for Non-Subscribers */}
        {!hasAccess && (
          <div className="bg-white border-2 border-[#6110ff]/30 p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#6110ff]/10 flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-[#6110ff]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">
                  Community Access for Subscribers
                </h2>
                <p className="text-[#666666] mb-4">
                  Our regional WhatsApp and Signal groups are exclusive to subscribers. 
                  Join to connect with journalists, experts, and engaged readers across Latin America.
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-[#666666]">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>8 regional groups</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#666666]">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>4,600+ active members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#666666]">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Direct access to reporters</span>
                  </div>
                </div>
                <Link href="/pricing">
                  <Button className="bg-[#6110ff] hover:bg-[#4a0dd6] text-white rounded-none gap-2">
                    <Crown className="h-4 w-4" />
                    Subscribe to Access Community
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Platform Toggle */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-sm text-[#666666]">Choose platform:</span>
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
                  <MapPin className="h-4 w-4 text-[#6110ff]" />
                  <h3 className="font-semibold text-[#1a1a1a]">{group.region}</h3>
                </div>
                <p className="text-sm text-[#666666] mb-3 line-clamp-2">
                  {group.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#666666] font-mono">
                    {group.members.toLocaleString()} members
                  </span>
                  {hasAccess ? (
                    <a
                      href={selectedPlatform === 'whatsapp' ? group.whatsapp : group.signal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1 text-sm font-medium ${
                        selectedPlatform === 'whatsapp' 
                          ? 'text-[#25D366] hover:text-[#1da851]' 
                          : 'text-[#3A76F0] hover:text-[#2a5fc0]'
                      }`}
                    >
                      Join
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-[#666666]">
                      <Lock className="h-3 w-3" />
                      Locked
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
            Community Guidelines
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-[#6110ff] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">Respect & Civility</h3>
                <p className="text-sm text-[#666666]">
                  Engage respectfully. No personal attacks, harassment, or hate speech.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <MessageCircle className="h-5 w-5 text-[#6110ff] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">Stay On Topic</h3>
                <p className="text-sm text-[#666666]">
                  Keep discussions relevant to LATAM news and the group's region.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Users className="h-5 w-5 text-[#6110ff] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">No Spam</h3>
                <p className="text-sm text-[#666666]">
                  No promotional content, chain messages, or repetitive posts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA for Non-Subscribers */}
        {!hasAccess && (
          <section className="bg-[#1a1a1a] text-white p-8 text-center">
            <h2 className="text-2xl font-serif font-semibold mb-4">
              Ready to Join the Conversation?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Subscribe to access all regional community groups, plus exclusive human-written 
              journalism and early access to investigations.
            </p>
            <Link href="/pricing">
              <Button className="bg-[#6110ff] hover:bg-[#4a0dd6] text-white rounded-none gap-2">
                View Subscription Plans
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
