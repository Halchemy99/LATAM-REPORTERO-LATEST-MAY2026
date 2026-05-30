'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/lib/providers';

const COUNTRY_NAMES = {
  'argentina': 'Argentina',
  'bolivia': 'Bolivia',
  'brazil': 'Brazil',
  'chile': 'Chile',
  'colombia': 'Colombia',
  'ecuador': 'Ecuador',
  'paraguay': 'Paraguay',
  'peru': 'Peru',
  'uruguay': 'Uruguay',
  'venezuela': 'Venezuela',
  'costa-rica': 'Costa Rica',
  'el-salvador': 'El Salvador',
  'guatemala': 'Guatemala',
  'honduras': 'Honduras',
  'nicaragua': 'Nicaragua',
  'panama': 'Panama',
  'mexico': 'Mexico',
  'cuba': 'Cuba',
  'dominican-republic': 'Dominican Republic',
  'haiti': 'Haiti',
  'puerto-rico': 'Puerto Rico',
};

function ArticleCard({ article }) {
  const slug = typeof article.slug === 'object' ? article.slug.current : article.slug;
  return (
    <article className="group bg-white border border-[#1a1a1a]/10 hover:border-[#6111ff] transition-colors flex flex-col">
      <Link href={`/article/${slug}`} className="block flex-1">
        {article.featuredImage && (
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#6111ff] bg-[#6111ff]/8 px-2 py-0.5">
              {article.category || 'Report'}
            </span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] group-hover:text-[#6111ff] transition-colors leading-snug mb-2">
            {article.title}
          </h3>
          {article.standfirst && (
            <p className="text-sm text-[#666666] line-clamp-3 mb-4 leading-relaxed">
              {article.standfirst}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-[#666666]">
            <span className="font-medium">{article.authorName || 'LATAM Reportero'}</span>
            {article.publishedAt && (
              <>
                <span className="opacity-30">&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function RegionPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const countryName = COUNTRY_NAMES[slug] || slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const resp = await fetch(`${baseUrl}/api/sanity/articles?limit=30&region=${encodeURIComponent(countryName)}`);
        if (resp.ok) {
          const data = await resp.json();
          setArticles(data.articles || []);
        }
      } catch (err) {
        console.error('Error loading region articles:', err);
      } finally {
        setLoading(false);
      }
    };
    if (countryName) load();
  }, [countryName]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-[#1a1a1a] text-white">
          <div className="container py-10">
            <Link
              href="/investigations"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors mb-6"
            >
              <ArrowLeft className="h-3 w-3" />
              {t('region.backToAll')}
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-5 w-5 text-[#6111ff]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
                {t('region.label')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold leading-tight mb-3">
              {countryName}
            </h1>
            <p className="text-white/50 text-sm">
              {t('region.latestFrom')} {countryName}
            </p>
          </div>
        </div>

        {/* Articles */}
        <div className="container py-12">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-[#1a1a1a]/10 h-64 animate-pulse" />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article._id || article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <MapPin className="h-10 w-10 text-[#6111ff]/30 mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-3">
                {t('region.noStoriesTitle')} {countryName}
              </h2>
              <p className="text-[#666666] mb-8 max-w-md mx-auto">
                {t('region.noStoriesDesc')}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/newsletter">
                  <Button className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white rounded-none gap-2">
                    {t('region.getNotified')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/investigations">
                  <Button variant="outline" className="rounded-none">
                    {t('region.browseAll')}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
