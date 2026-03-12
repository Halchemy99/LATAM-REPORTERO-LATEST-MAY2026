'use client';

import { useState, useEffect } from 'react';
import { useTranslation, useUserRole, useContentMode } from '@/lib/providers';
import { mockArticles, mockWriters, getLocalizedContent } from '@/lib/mock-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ContributorReputation from '@/components/ContributorReputation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Clock, Users, Headphones, Video, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const { t, locale } = useTranslation();
  const { canAccessHumanContent } = useUserRole();
  const { mode, setMode } = useContentMode();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get localized text
  const L = (content) => getLocalizedContent(content, locale);

  useEffect(() => {
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 500);
  }, []);

  const featuredArticle = articles.find(a => a.featured) || articles[0];
  const latestArticles = articles.filter(a => !a.featured).slice(0, 5);
  const sideArticles = articles.filter(a => !a.featured).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Skeleton className="col-span-8 h-[500px]" />
            <div className="col-span-4 space-y-4">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Editorial Hero Grid */}
        <section className="container py-8 md:py-12">
          <div className="editorial-grid">
            {/* Featured Article - Large */}
            {featuredArticle && (
              <article className="editorial-grid-hero group" data-testid="featured-article">
                <Link href={`/article/${featuredArticle.slug}`} className="block">
                  <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden mb-4">
                    <img
                      src={featuredArticle.mainImage}
                      alt={L(featuredArticle.title)}
                      className="w-full h-full object-cover image-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <Badge className="mb-3 bg-red-600 hover:bg-red-700 uppercase tracking-wider text-xs">
                        {t(`categories.${featuredArticle.category}`) || featuredArticle.category}
                      </Badge>
                      <h1 className="headline-hero text-white mb-3">
                        {L(featuredArticle.title)}
                      </h1>
                      <p className="text-lg opacity-90 mb-4 max-w-2xl">
                        {L(featuredArticle.excerpt)}
                      </p>
                      <div className="flex items-center gap-4 text-sm opacity-80">
                        <span>{locale === 'es' ? 'Por' : locale === 'pt' ? 'Por' : 'By'} {featuredArticle.author.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredArticle.readTime} {locale === 'es' ? 'min de lectura' : locale === 'pt' ? 'min de leitura' : 'min read'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Side Articles */}
            <div className="editorial-grid-side space-y-4">
              {sideArticles.map((article, index) => (
                <article 
                  key={article.id} 
                  className={`group ${index < sideArticles.length - 1 ? 'border-b pb-4' : ''}`}
                  data-testid={`side-article-${index}`}
                >
                  <Link href={`/article/${article.slug}`} className="block">
                    <Badge variant="outline" className="mb-2 text-xs uppercase tracking-wider">
                      {t(`regions.${article.region}`) || article.region}
                    </Badge>
                    <h3 className="headline-card mb-2 group-hover:text-primary transition-colors">
                      {L(article.title)}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {L(article.excerpt)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{article.author.name}</span>
                      <span>•</span>
                      <span>{article.readTime} min</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Thick Divider */}
        <div className="container">
          <div className="editorial-divider-thick" />
        </div>

        {/* Latest News Section */}
        <section className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="headline-section">{t('news.latest')}</h2>
            <Link href="/solutions">
              <Button variant="ghost" className="group">
                {t('news.allStories')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestArticles.slice(0, 3).map((article) => (
              <article key={article.id} className="group" data-testid={`latest-article-${article.id}`}>
                <Link href={`/article/${article.slug}`}>
                  <div className="relative aspect-[16/10] overflow-hidden mb-4">
                    <img
                      src={article.mainImage}
                      alt={L(article.title)}
                      className="w-full h-full object-cover image-zoom"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs uppercase tracking-wider">
                        {t(`categories.${article.category}`) || article.category}
                      </Badge>
                      {article.isEditoriallyReviewed && (
                        <Badge className="badge-reviewed text-xs">{locale === 'es' ? 'Revisado' : locale === 'pt' ? 'Revisado' : 'Reviewed'}</Badge>
                      )}
                    </div>
                    <h3 className="headline-card group-hover:text-primary transition-colors">
                      {L(article.title)}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {L(article.excerpt)}
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-sm">
                        <div className="font-medium">{article.author.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {new Date(article.publishedAt).toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'pt' ? 'pt-BR' : 'en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Media Section - Podcast/Video Teasers */}
        <section className="bg-foreground text-background py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Podcast */}
              <div className="flex gap-6 items-start">
                <div className="w-24 h-24 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Headphones className="h-12 w-12" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2 border-background/30 text-background/70">
                    Podcast
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                    Voces de América Latina
                  </h3>
                  <p className="text-background/70 mb-4">
                    {locale === 'es' ? 'Conversaciones semanales con periodistas, activistas y agentes de cambio de toda la región.' :
                     locale === 'pt' ? 'Conversas semanais com jornalistas, ativistas e agentes de mudança de toda a região.' :
                     'Weekly conversations with journalists, activists, and changemakers across the region.'}
                  </p>
                  <Button variant="secondary" size="sm">
                    {locale === 'es' ? 'Escuchar Ahora' : locale === 'pt' ? 'Ouvir Agora' : 'Listen Now'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Video */}
              <div className="flex gap-6 items-start">
                <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Video className="h-12 w-12" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2 border-background/30 text-background/70">
                    Video
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                    {locale === 'es' ? 'Serie Documental' : locale === 'pt' ? 'Série Documental' : 'Documentary Series'}
                  </h3>
                  <p className="text-background/70 mb-4">
                    {locale === 'es' ? 'Narrativas visuales profundas de comunidades que impulsan el cambio en América Latina.' :
                     locale === 'pt' ? 'Narrativas visuais profundas de comunidades que impulsionam mudanças na América Latina.' :
                     'In-depth visual storytelling from communities driving change across Latin America.'}
                  </p>
                  <Button variant="secondary" size="sm">
                    {locale === 'es' ? 'Ver Ahora' : locale === 'pt' ? 'Assistir Agora' : 'Watch Now'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contributors / Masthead Section */}
        <section className="container py-16">
          <div className="text-center mb-12">
            <h2 className="headline-section mb-4">
              {locale === 'es' ? 'Nuestros Colaboradores' : locale === 'pt' ? 'Nossos Colaboradores' : 'Our Contributors'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {locale === 'es' ? 'Periodistas experimentados y reporteros comunitarios que ofrecen cobertura orientada a soluciones desde toda América Latina.' :
               locale === 'pt' ? 'Jornalistas experientes e repórteres comunitários trazendo cobertura orientada a soluções de toda a América Latina.' :
               'Experienced journalists and community reporters bringing you solutions-oriented coverage from across Latin America.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockWriters.slice(0, 4).map((writer) => (
              <Card key={writer.id} className="editorial-card" data-testid={`contributor-${writer.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={writer.avatar}
                      alt={writer.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{writer.name}</h3>
                      <p className="text-sm text-muted-foreground">{L(writer.specialty)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ContributorReputation contributor={writer} variant="default" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {L(writer.bio)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/writers">
              <Button variant="outline">
                {locale === 'es' ? 'Ver Todos los Colaboradores' : locale === 'pt' ? 'Ver Todos os Colaboradores' : 'View All Contributors'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y">
          <div className="container py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  500+
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {locale === 'es' ? 'Artículos' : locale === 'pt' ? 'Artigos' : 'Articles'}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  50+
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {locale === 'es' ? 'Colaboradores' : locale === 'pt' ? 'Colaboradores' : 'Contributors'}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  12
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {locale === 'es' ? 'Países' : locale === 'pt' ? 'Países' : 'Countries'}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  3
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {locale === 'es' ? 'Idiomas' : locale === 'pt' ? 'Idiomas' : 'Languages'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter variant="hero" />
      </main>

      <Footer />
    </div>
  );
}
