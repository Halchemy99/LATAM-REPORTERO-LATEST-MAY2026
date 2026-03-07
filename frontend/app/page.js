'use client';

import { useState, useEffect } from 'react';
import { useTranslation, useUserRole, useContentMode } from '@/lib/providers';
import { mockArticles, mockWriters } from '@/lib/mock-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedStory from '@/components/FeaturedStory';
import NewsCard from '@/components/NewsCard';
import TrustScoreRating from '@/components/TrustScoreRating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Mail, CheckCircle, TrendingUp, Users, FileText } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { t } = useTranslation();
  const { canAccessHumanContent } = useUserRole();
  const { mode, setMode } = useContentMode();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 500);
  }, []);

  const featuredArticle = articles.find(a => a.featured) || articles[0];
  
  const filteredArticles = articles.filter(a => {
    if (!a.featured) {
      if (mode === 'ai') return a.isAiGenerated;
      if (mode === 'human') return !a.isAiGenerated;
      return true;
    }
    return false;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/solutions">
                  <Button size="lg" className="group">
                    {t('hero.cta')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline">
                    {t('nav.pricing')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Writers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">9</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>

            {/* Featured Story */}
            {loading ? (
              <Skeleton className="h-[400px] rounded-2xl" />
            ) : (
              <FeaturedStory article={featuredArticle} />
            )}
          </div>
        </section>

        {/* News Section */}
        <section className="py-12">
          <div className="container">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">{t('news.latest')}</h2>
              <Tabs value={mode} onValueChange={setMode} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                  <TabsTrigger value="all">{t('news.allStories')}</TabsTrigger>
                  <TabsTrigger value="human">{t('news.humanWritten')}</TabsTrigger>
                  <TabsTrigger value="ai">{t('news.aiVerified')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-[350px] rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {filteredArticles.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found for this filter.</p>
              </div>
            )}

            <div className="text-center mt-8">
              <Link href="/solutions">
                <Button variant="outline" size="lg">
                  View All Stories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Reporter Spotlight */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Reporter Spotlight</h2>
              <Link href="/writers">
                <Button variant="ghost" className="group">
                  View All Writers
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockWriters.slice(0, 4).map(writer => (
                <Card key={writer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                      <img
                        src={writer.avatar}
                        alt={writer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{writer.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{writer.specialty}</p>
                    <div className="flex justify-center mb-3">
                      <TrustScoreRating score={writer.trustScore} size="small" />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {writer.articleCount} articles
                      </Badge>
                      {writer.verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-primary">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center text-primary-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
              <p className="mb-8 opacity-90">
                Get weekly solutions-oriented journalism delivered to your inbox.
              </p>
              {subscribed ? (
                <div className="flex items-center justify-center gap-2 text-lg">
                  <CheckCircle className="h-6 w-6" />
                  Thanks for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                  <Button type="submit" variant="secondary" className="whitespace-nowrap">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
