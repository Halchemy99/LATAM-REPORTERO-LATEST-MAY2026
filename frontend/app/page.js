'use client';

import { useState, useEffect } from 'react';
import { useTranslation, useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, Clock, Bot, User, Users, Play, Lock,
  TrendingUp, FileText, Sparkles
} from 'lucide-react';
import Link from 'next/link';

function StoryCard({ article, size = 'medium', showVideo = false }) {
  const isAI = article.isAiGenerated;
  
  const sizeClasses = {
    large: 'col-span-2 row-span-2',
    medium: 'col-span-1',
    small: 'col-span-1',
    list: 'col-span-full'
  };

  const slug = typeof article.slug === 'object' ? article.slug.current : article.slug;
  const readTime = article.readTime || 5;
  const category = article.category || 'general';
  const region = article.region || 'latam';
  const authorName = 'LATAM Reportero';
  const image = article.featuredImage || null;

  return (
    <article 
      className={`group ${sizeClasses[size]} border-b border-[#23103A]/10 pb-4 hover:bg-[#23103A]/[0.02] transition-colors`}
      data-testid={`story-card-${article._id}`}
    >
      <Link href={`/article/${slug}`} className="block">
        {(size === 'large' || size === 'medium') && image && (
          <div className="relative aspect-[16/10] overflow-hidden mb-3">
            <img
              src={image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            {showVideo && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <Play className="h-5 w-5 text-[#23103A] ml-0.5" />
                </div>
              </div>
            )}
            <div className="absolute top-2 left-2">
              {isAI ? (
                <Badge className="bg-[#6B38D6] text-white rounded-none font-mono text-[10px] uppercase tracking-wider gap-1">
                  <Bot className="h-3 w-3" />
                  AI
                </Badge>
              ) : (
                <Badge className="bg-emerald-600 text-white rounded-none font-mono text-[10px] uppercase tracking-wider gap-1">
                  <User className="h-3 w-3" />
                  Human
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#D35A3D]">
            {category}
          </span>
          <span className="text-[#23103A]/30">|</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#5C5566]">
            {region}
          </span>
          {(size === 'small' || size === 'list') && (
            <>
              <span className="text-[#23103A]/30">|</span>
              {isAI ? (
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B38D6] flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  AI
                </span>
              ) : (
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Human
                </span>
              )}
            </>
          )}
        </div>
        
        <h3 className={`font-serif font-semibold text-[#23103A] group-hover:text-[#D35A3D] transition-colors leading-tight mb-2 ${
          size === 'large' ? 'text-2xl md:text-3xl' : 
          size === 'medium' ? 'text-lg md:text-xl' : 
          'text-base'
        }`}>
          {article.title}
        </h3>
        
        {(size === 'large' || size === 'medium') && article.standfirst && (
          <p className="text-sm text-[#5C5566] line-clamp-2 mb-2">
            {article.standfirst}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-xs text-[#5C5566]">
          <span>{authorName}</span>
          <span className="text-[#23103A]/30">&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readTime} min
          </span>
        </div>
      </Link>
    </article>
  );
}

function TopicSection({ title, icon: Icon, articles }) {
  if (!articles || articles.length === 0) return null;
  
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#23103A]">
        <Icon className="h-4 w-4 text-[#D35A3D]" />
        <h2 className="text-sm font-mono uppercase tracking-wider text-[#23103A] font-semibold">
          {title}
        </h2>
      </div>
      <div className="space-y-3">
        {articles.slice(0, 4).map((article) => (
          <StoryCard 
            key={article._id} 
            article={article} 
            size="small"
          />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { t, locale } = useTranslation();
  const { isSubscribed } = useUserRole();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${API_URL}/api/sanity/articles?language=${locale}&limit=20`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.articles && data.articles.length > 0) {
            setArticles(data.articles);
          } else {
            const allResp = await fetch(`${API_URL}/api/sanity/articles/all?limit=20`);
            if (allResp.ok) {
              const allData = await allResp.json();
              setArticles(allData.articles || []);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [locale, API_URL]);

  const topStories = articles.slice(0, 5);
  const latestNews = articles.slice(5, 15);
  const investigations = articles.filter(a => {
    const cat = (a.category || '').toLowerCase();
    return cat.includes('politic') || cat.includes('investigation') || cat.includes('human-rights');
  });
  const environment = articles.filter(a => {
    const cat = (a.category || '').toLowerCase();
    return cat.includes('environ') || cat.includes('climate') || cat.includes('energy');
  });
  const economy = articles.filter(a => {
    const cat = (a.category || '').toLowerCase();
    return cat.includes('econom') || cat.includes('finance') || cat.includes('technology');
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F2]">
        <Header />
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-[#23103A]/10 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      <Header />
      
      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Main Stories */}
          <div className="lg:col-span-8">
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#23103A]">
                <h2 className="text-sm font-mono uppercase tracking-wider text-[#23103A] font-semibold">
                  Top Stories
                </h2>
                <Link href="/solutions" className="text-xs font-mono uppercase tracking-wider text-[#D35A3D] hover:underline flex items-center gap-1">
                  All Stories <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topStories[0] && (
                  <div className="md:col-span-2">
                    <StoryCard 
                      article={topStories[0]} 
                      size="large"
                    />
                  </div>
                )}
                
                {topStories.slice(1, 5).map((article, idx) => (
                  <StoryCard 
                    key={article._id} 
                    article={article} 
                    size="medium"
                    showVideo={idx === 1}
                  />
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#23103A]">
                <h2 className="text-sm font-mono uppercase tracking-wider text-[#23103A] font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#D35A3D]" />
                  Latest
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {latestNews.map((article) => (
                  <StoryCard 
                    key={article._id} 
                    article={article} 
                    size="small"
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {!isSubscribed && (
              <div className="bg-[#23103A] text-white p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="h-4 w-4 text-[#D35A3D]" />
                  <span className="text-xs font-mono uppercase tracking-wider">Subscriber Exclusive</span>
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">
                  Human-Written Journalism
                </h3>
                <p className="text-sm text-white/70 mb-4">
                  Access investigative stories written by our journalists across Latin America.
                </p>
                <Link href="/pricing">
                  <Button className="w-full bg-[#D35A3D] hover:bg-[#B84A30] text-white rounded-none text-sm">
                    Subscribe Now
                  </Button>
                </Link>
              </div>
            )}

            <TopicSection 
              title="Investigations"
              icon={FileText}
              articles={investigations}
            />

            <TopicSection 
              title="Environment"
              icon={Sparkles}
              articles={environment}
            />

            <TopicSection 
              title="Economy"
              icon={TrendingUp}
              articles={economy}
            />

            <div className="bg-[#F7F5F2] border border-[#23103A]/10 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-[#D35A3D]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#23103A]">Community</span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#23103A] mb-2">
                Join the Conversation
              </h3>
              <p className="text-sm text-[#5C5566] mb-4">
                Connect with readers and journalists in regional WhatsApp & Signal groups.
              </p>
              <Link href="/community">
                <Button variant="outline" className="w-full rounded-none border-[#23103A]/20 text-sm">
                  Explore Community
                </Button>
              </Link>
            </div>
          </aside>
        </div>

        {/* Empty State */}
        {articles.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-[#5C5566] text-lg mb-4">No articles available yet.</p>
            <p className="text-[#5C5566] text-sm">Content is being generated. Check back soon.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
