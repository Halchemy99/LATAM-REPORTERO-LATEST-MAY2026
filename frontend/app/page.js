'use client';

import { useState, useEffect } from 'react';
import { useTranslation, useUserRole, useContentMode } from '@/lib/providers';
import { mockArticles, mockWriters, getLocalizedContent } from '@/lib/mock-data';
import { getArticles } from '@/lib/supabase/cms';
import Header from '@/components/Header';
import GlobalSearchBar from '@/components/GlobalSearchBar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ContributorReputation from '@/components/ContributorReputation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Clock, Users, Headphones, Video, TrendingUp, Bot, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const { t, locale } = useTranslation();
  const { canAccessHumanContent } = useUserRole();
  const { mode, setMode } = useContentMode();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingCMS, setUsingCMS] = useState(false);

  // Helper to get localized text for mock data
  const L = (content) => getLocalizedContent(content, locale);
  
  // Helper to get title from CMS or mock article
  const getTitle = (article) => {
    if (usingCMS) {
      return article[`title_${locale}`] || article.title_en || 'Untitled';
    }
    return L(article.title);
  };
  
  // Helper to get excerpt from CMS or mock article  
  const getExcerpt = (article) => {
    if (usingCMS) {
      return article[`standfirst_${locale}`] || article.standfirst_en || '';
    }
    return L(article.excerpt);
  };
  
  // Helper to get category name
  const getCategoryName = (article) => {
    if (usingCMS) {
      if (article.category) {
        return article.category[`name_${locale}`] || article.category.name_en || article.category.slug;
      }
      return locale === 'es' ? 'General' : locale === 'pt' ? 'Geral' : 'General';
    }
    if (!article.category) return 'General';
    return t(`categories.${article.category}`) || article.category;
  };
  
  // Helper to get region
  const getRegion = (article) => {
    if (usingCMS) {
      return article.region || 'latin-america';
    }
    return article.region || 'latin-america';
  };
  
  // Helper to get region display name
  const getRegionName = (article) => {
    const region = getRegion(article);
    const regionName = t(`regions.${region}`);
    // If translation returns the key itself, show a fallback
    if (regionName === `regions.${region}` || !regionName) {
      return locale === 'es' ? 'América Latina' : locale === 'pt' ? 'América Latina' : 'Latin America';
    }
    return regionName;
  };
  
  // Helper to get author name
  const getAuthorName = (article) => {
    if (usingCMS) {
      if (article.author) {
        return article.author.name || 'Staff Writer';
      }
      return 'Staff Writer';
    }
    return article.author?.name || 'Staff Writer';
  };
  
  // Helper to get author avatar
  const getAuthorAvatar = (article) => {
    if (usingCMS && article.author) {
      return article.author.avatar_url || '/placeholder-avatar.png';
    }
    return article.author?.avatar || '/placeholder-avatar.png';
  };
  
  // Helper to get main image
  const getMainImage = (article) => {
    if (usingCMS) {
      return article.featured_image || null;
    }
    return article.mainImage || null;
  };
  
  // Helper to check if article has image
  const hasImage = (article) => {
    if (usingCMS) {
      return !!article.featured_image;
    }
    return !!article.mainImage;
  };
  
  // Helper to get article slug
  const getSlug = (article) => {
    return article.slug;
  };
  
  // Helper to get read time
  const getReadTime = (article) => {
    if (usingCMS) {
      return article.read_time || 5;
    }
    return article.readTime || 5;
  };
  
  // Helper to check if featured
  const isFeatured = (article) => {
    if (usingCMS) {
      return article.is_featured;
    }
    return article.featured;
  };
  
  // Helper to check if reviewed
  const isReviewed = (article) => {
    if (usingCMS) {
      return article.status === 'published';
    }
    return article.isEditoriallyReviewed;
  };
  
  // Helper to get published date
  const getPublishedAt = (article) => {
    if (usingCMS) {
      return article.published_at || article.created_at;
    }
    return article.publishedAt;
  };

  useEffect(() => {
    const loadArticles = async () => {
      try {
        // Try to fetch from CMS first
        const cmsArticles = await getArticles({ status: 'published', limit: 10 });
        
        if (cmsArticles && cmsArticles.length > 0) {
          setArticles(cmsArticles);
          setUsingCMS(true);
        } else {
          // Fallback to mock data
          setArticles(mockArticles);
          setUsingCMS(false);
        }
      } catch (error) {
        console.log('CMS fetch failed, using mock data:', error.message);
        setArticles(mockArticles);
        setUsingCMS(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadArticles();
  }, []);

  const featuredArticle = articles.find(a => isFeatured(a)) || articles[0];
  const latestArticles = articles.filter(a => !isFeatured(a)).slice(0, 5);
  const sideArticles = articles.filter(a => !isFeatured(a)).slice(0, 3);

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
    <div className="min-h-screen flex flex-col bg-[#F7F5F2]">
      <Header />
      <GlobalSearchBar locale={locale} />
      
      <main className="flex-1">
        {/* Editorial Hero Grid */}
        <section className="container py-8 md:py-12">
          <div className="editorial-grid">
            {/* Featured Article - Large */}
            {featuredArticle && (
              <article className="editorial-grid-hero group" data-testid="featured-article">
                <Link href={`/article/${getSlug(featuredArticle)}`} className="block">
                  <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden mb-4 rounded-lg">
                    {hasImage(featuredArticle) ? (
                      <img
                        src={getMainImage(featuredArticle)}
                        alt={getTitle(featuredArticle)}
                        className="w-full h-full object-cover image-zoom"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
                        <div className="text-center px-8">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white/80" style={{ fontFamily: 'Playfair Display, serif' }}>
                              {getTitle(featuredArticle).charAt(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                      <Badge className="mb-3 bg-gradient-to-r from-[#8c52ff] to-[#6111ff] hover:from-[#9d6bff] hover:to-[#7a2fff] uppercase tracking-wider text-xs border-0">
                        {getCategoryName(featuredArticle)}
                      </Badge>
                      <h1 className="headline-hero text-white mb-3">
                        {getTitle(featuredArticle)}
                      </h1>
                      <p className="text-lg opacity-90 mb-4 max-w-2xl" style={{ fontFamily: 'Source Serif 4, serif' }}>
                        {getExcerpt(featuredArticle)}
                      </p>
                      <div className="flex items-center gap-4 text-sm opacity-80" style={{ fontFamily: 'Raleway, sans-serif' }}>
                        <span>{locale === 'es' ? 'Por' : locale === 'pt' ? 'Por' : 'By'} {getAuthorName(featuredArticle)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {getReadTime(featuredArticle)} {locale === 'es' ? 'min de lectura' : locale === 'pt' ? 'min de leitura' : 'min read'}
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
                  className={`group ${index < sideArticles.length - 1 ? 'border-b border-[#8c52ff]/10 pb-4' : ''}`}
                  data-testid={`side-article-${index}`}
                >
                  <Link href={`/article/${getSlug(article)}`} className="block">
                    <Badge className="mb-2 category-tag-beige text-xs uppercase tracking-wider">
                      {getRegionName(article)}
                    </Badge>
                    <h3 className="headline-card mb-2 group-hover:text-[#8c52ff] transition-colors">
                      {getTitle(article)}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2" style={{ fontFamily: 'Source Serif 4, serif' }}>
                      {getExcerpt(article)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground" style={{ fontFamily: 'Raleway, sans-serif' }}>
                      <span>{getAuthorName(article)}</span>
                      <span>•</span>
                      <span>{getReadTime(article)} min</span>
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
                <Link href={`/article/${getSlug(article)}`}>
                  <div className="relative aspect-[16/10] overflow-hidden mb-4 rounded-lg">
                    {hasImage(article) ? (
                      <img
                        src={getMainImage(article)}
                        alt={getTitle(article)}
                        className="w-full h-full object-cover image-zoom"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#8c52ff]/20 via-[#6111ff]/30 to-[#1a1a2e] flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#8c52ff]/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-[#8c52ff]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {getTitle(article).charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs uppercase tracking-wider">
                        {getCategoryName(article)}
                      </Badge>
                      {isReviewed(article) && (
                        <Badge className="badge-reviewed text-xs">{locale === 'es' ? 'Revisado' : locale === 'pt' ? 'Revisado' : 'Reviewed'}</Badge>
                      )}
                    </div>
                    <h3 className="headline-card group-hover:text-primary transition-colors">
                      {getTitle(article)}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {getExcerpt(article)}
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8c52ff] to-[#6111ff] flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {getAuthorName(article).split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{getAuthorName(article)}</div>
                        <div className="text-muted-foreground text-xs">
                          {new Date(getPublishedAt(article)).toLocaleDateString(locale === 'es' ? 'es-ES' : locale === 'pt' ? 'pt-BR' : 'en-US', { 
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
        <section className="py-16" style={{ background: 'linear-gradient(135deg, #6111ff 0%, #8c52ff 100%)' }}>
          <div className="container text-white">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Podcast */}
              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-white/20">
                      <Headphones className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                      {locale === 'es' ? 'Podcast LATAM' : locale === 'pt' ? 'Podcast LATAM' : 'LATAM Podcast'}
                    </h3>
                  </div>
                  <p className="text-white/80 mb-6" style={{ fontFamily: 'Source Serif 4, serif' }}>
                    {locale === 'es' 
                      ? 'Entrevistas semanales con expertos y actores del cambio en América Latina.' 
                      : locale === 'pt'
                      ? 'Entrevistas semanais com especialistas e agentes de mudança na América Latina.'
                      : 'Weekly interviews with experts and changemakers across Latin America.'}
                  </p>
                  <Button variant="secondary" className="bg-white text-[#6111ff] hover:bg-white/90">
                    {locale === 'es' ? 'Escuchar Ahora' : locale === 'pt' ? 'Ouvir Agora' : 'Listen Now'}
                  </Button>
                </CardContent>
              </Card>

              {/* Video */}
              <Card className="bg-white/10 border-white/20 backdrop-blur">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-white/20">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                      {locale === 'es' ? 'Documentales' : locale === 'pt' ? 'Documentários' : 'Documentaries'}
                    </h3>
                  </div>
                  <p className="text-white/80 mb-6" style={{ fontFamily: 'Source Serif 4, serif' }}>
                    {locale === 'es'
                      ? 'Historias en profundidad que capturan soluciones innovadoras en acción.'
                      : locale === 'pt'
                      ? 'Histórias aprofundadas que capturam soluções inovadoras em ação.'
                      : 'In-depth stories capturing innovative solutions in action.'}
                  </p>
                  <Button variant="secondary" className="bg-white text-[#6111ff] hover:bg-white/90">
                    {locale === 'es' ? 'Ver Videos' : locale === 'pt' ? 'Ver Vídeos' : 'Watch Videos'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Top Writers Section */}
        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="headline-section">
              {locale === 'es' ? 'Escritores Destacados' : locale === 'pt' ? 'Escritores em Destaque' : 'Top Writers'}
            </h2>
            <Link href="/writers">
              <Button variant="ghost" className="group">
                {locale === 'es' ? 'Ver Todos' : locale === 'pt' ? 'Ver Todos' : 'View All'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockWriters.slice(0, 4).map((writer) => (
              <Link key={writer.id} href={`/writers/${writer.id}`} className="group">
                <Card className="text-center p-6 hover:shadow-lg transition-all">
                  <img
                    src={writer.avatar}
                    alt={writer.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-[#8c52ff]/10 group-hover:ring-[#8c52ff]/30 transition-all"
                  />
                  <h3 className="font-semibold mb-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {writer.name}
                  </h3>
                  <p className="text-sm text-[#8c52ff] mb-2">
                    {L(writer.specialty)}
                  </p>
                  <div className="flex justify-center">
                    <ContributorReputation score={writer.trustScore} size="sm" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Topics */}
        <section className="bg-muted/30 py-12">
          <div className="container">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-[#8c52ff]" />
              <h2 className="headline-section">{t('news.trending')}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {['Climate Action', 'Indigenous Rights', 'Urban Innovation', 'Renewable Energy', 'Food Security', 'Digital Inclusion'].map((topic, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="px-4 py-2 text-sm hover:bg-[#8c52ff] hover:text-white cursor-pointer transition-colors"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
