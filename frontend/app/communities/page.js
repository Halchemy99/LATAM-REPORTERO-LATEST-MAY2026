'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import { mockCommunities } from '@/lib/mock-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, MessageSquare, Search, Globe, ArrowRight } from 'lucide-react';

export default function CommunitiesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filteredCommunities = mockCommunities.filter(community => {
    if (search) {
      return community.name.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  // Add flag emojis for visual appeal
  const flags = {
    mexico: '🇲🇽',
    brazil: '🇧🇷',
    argentina: '🇦🇷',
    chile: '🇨🇱',
    colombia: '🇨🇴',
    peru: '🇵🇪',
    venezuela: '🇻🇪',
    ecuador: '🇪🇨'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">{t('nav.communities')}</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Join regional news communities to discuss stories, share insights, and connect with readers who care about Latin America.
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="py-6 border-b">
          <div className="container">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search communities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        {/* Communities Grid */}
        <section className="py-8">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map(community => (
                <Card key={community.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-3xl">{flags[community.region] || '🌎'}</span>
                        <span>{community.name}</span>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{community.members.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{community.activeDiscussions} active discussions</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with readers and journalists covering {community.name}. Share insights and discuss the latest solutions-oriented stories.
                    </p>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        Join Community
                      </Button>
                      <Button variant="outline">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCommunities.length === 0 && (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No communities found</h3>
                <p className="text-muted-foreground">Try adjusting your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-muted/30">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">Want to start a new community?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Premium subscribers can create and moderate regional communities. Upgrade your account to get started.
            </p>
            <Link href="/pricing">
              <Button size="lg">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
