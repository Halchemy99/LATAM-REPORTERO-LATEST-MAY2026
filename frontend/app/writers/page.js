'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import { mockWriters, getLocalizedContent } from '@/lib/mock-data';
import { getAuthors } from '@/lib/supabase/cms';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustScoreRating from '@/components/TrustScoreRating';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, CheckCircle, FileText, MapPin, Users, Loader2 } from 'lucide-react';

export default function WritersPage() {
  const { t, locale } = useTranslation();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingCMS, setUsingCMS] = useState(false);

  useEffect(() => {
    const loadWriters = async () => {
      try {
        // Try to fetch from CMS first
        const cmsAuthors = await getAuthors();
        
        if (cmsAuthors && cmsAuthors.length > 0) {
          // Transform CMS authors to match the expected format
          const transformedAuthors = cmsAuthors.map(author => ({
            id: author.id,
            name: author.name,
            avatar: author.avatar_url || '/placeholder-avatar.png',
            specialty: {
              en: author.expertise_en || author.title || 'Journalist',
              es: author.expertise_es || author.title || 'Periodista',
              pt: author.expertise_pt || author.title || 'Jornalista'
            },
            bio: {
              en: author.bio_en || '',
              es: author.bio_es || '',
              pt: author.bio_pt || ''
            },
            trustScore: author.trust_score || 85,
            articleCount: author.article_count || 0,
            region: author.region || 'all-regions',
            verified: author.is_verified || false,
            slug: author.slug
          }));
          setWriters(transformedAuthors);
          setUsingCMS(true);
        } else {
          // Fallback to mock data
          setWriters(mockWriters);
          setUsingCMS(false);
        }
      } catch (error) {
        console.log('CMS authors fetch failed, using mock data:', error.message);
        setWriters(mockWriters);
        setUsingCMS(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadWriters();
  }, []);

  const filteredWriters = writers.filter(writer => {
    if (region !== 'all' && writer.region?.toLowerCase() !== region) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      const specialty = getLocalizedContent(writer.specialty, locale);
      return (
        writer.name.toLowerCase().includes(searchLower) ||
        (typeof specialty === 'string' && specialty.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const regions = ['all', 'mexico', 'brazil', 'argentina', 'chile', 'colombia', 'peru'];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
            <div className="container">
              <Skeleton className="h-10 w-48 mb-4" />
              <Skeleton className="h-6 w-96" />
            </div>
          </section>
          <section className="py-8">
            <div className="container">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                        <Skeleton className="h-5 w-32 mx-auto mb-2" />
                        <Skeleton className="h-4 w-24 mx-auto mb-3" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">{t('nav.writers')}</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t('Meet our verified journalists covering Latin America. Each writer has a Trust Score based on accuracy, sourcing, and community feedback.')}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b">
          <div className="container">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('Search writers...')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(reg => (
                    <SelectItem key={reg} value={reg}>
                      {reg === 'all' ? t('All Regions') : t(`regions.${reg}`) || reg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Writers Grid */}
        <section className="py-8">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWriters.map(writer => (
                <Card key={writer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-primary/10">
                        <img
                          src={writer.avatar}
                          alt={writer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{writer.name}</h3>
                      <p className="text-sm text-primary mb-2">{getLocalizedContent(writer.specialty, locale)}</p>
                      
                      <div className="flex justify-center mb-3">
                        <TrustScoreRating score={writer.trustScore} />
                      </div>

                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {writer.articleCount} {t('articles')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {writer.region}
                        </Badge>
                        {writer.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {t('Verified')}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {getLocalizedContent(writer.bio, locale)}
                      </p>

                      <Button variant="outline" className="w-full" size="sm" asChild>
                        <Link href={usingCMS ? `/writers/${writer.slug || writer.id}` : `/writers/${writer.id}`}>
                          {t('View Profile')}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredWriters.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">{t('No writers found')}</h3>
                <p className="text-muted-foreground">{t('Try adjusting your search or filters.')}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
