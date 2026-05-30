'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import VerifiedBadge from '@/components/VerifiedBadge';
import {
  Layers,
  Coffee,
  Newspaper,
  Filter,
  X,
  ArrowRight,
  Clock,
  Search,
} from 'lucide-react';

const CONTENT_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'deep-dive', label: 'Deep Dives' },
  { value: 'morning-brief', label: 'Morning Brief' },
  { value: 'press-review', label: 'Press Review' },
];

const REGIONS = [
  'all',
  'Argentina',
  'Bolivia',
  'Brazil',
  'Chile',
  'Colombia',
  'Ecuador',
  'Mexico',
  'Paraguay',
  'Peru',
  'Uruguay',
  'Venezuela',
];

function ArticleCard({ article }) {
  const slug = typeof article.slug === 'object' ? article.slug.current : article.slug;
  const image = article.featuredImage;
  const verificationLevel = article.authorVerificationLevel ||
    (article.authorVerified ? 'id-verified' : null);

  return (
    <article className="group bg-white border border-[#1a1a1a]/10 hover:border-[#6111ff] transition-colors flex flex-col">
      <Link href={`/article/${slug}`} className="block flex-1">
        {image && (
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#6111ff] bg-[#6111ff]/8 px-2 py-0.5">
              {article.contentType === 'deep-dive'
                ? 'Deep Dive'
                : article.contentType === 'morning-brief'
                ? 'Morning Brief'
                : article.contentType === 'press-review'
                ? 'Press Review'
                : article.category || 'Investigation'}
            </span>
            {article.region && (
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#666666]">
                {article.region}
              </span>
            )}
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
            <span className="flex items-center gap-1">
              <span className="font-medium">{article.authorName || 'LATAM Reportero'}</span>
              {verificationLevel && <VerifiedBadge level={verificationLevel} size="xs" />}
            </span>
            {article.publishedAt && (
              <>
                <span className="opacity-30">&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function InvestigationsPage() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [contentType, setContentType] = useState(searchParams.get('type') || 'all');
  const [region, setRegion] = useState('all');

  const API_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${API_URL}/api/sanity/articles?limit=30`);
        if (resp.ok) {
          const data = await resp.json();
          setArticles(data.articles || []);
        }
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [API_URL]);

  const filtered = articles.filter((a) => {
    if (contentType !== 'all' && a.contentType !== contentType) return false;
    if (region !== 'all' && a.region !== region) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.title?.toLowerCase().includes(q) ||
        a.standfirst?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const hasFilters = search || contentType !== 'all' || region !== 'all';

  const clearFilters = () => {
    setSearch('');
    setContentType('all');
    setRegion('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
      <Header />

      <main className="flex-1">
        {/* Page header */}
        <div className="bg-[#1a1a1a] text-white">
          <div className="container py-10">
            <div className="flex items-center gap-3 mb-3">
              <Layers className="h-5 w-5 text-[#6111ff]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
                Reporting
              </span>
            </div>
            <h1
              className="font-serif text-4xl md:text-5xl font-semibold text-white mb-3 leading-tight"
              
            >
              Deep Dives & Investigations
            </h1>
            <p className="text-white/70 text-base max-w-xl leading-relaxed">
              Original investigations, long-form analysis, and contextual explainers. Every piece assumes you&apos;re smart and new to the region. No assumed knowledge, no jargon.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-[#1a1a1a]/10 bg-white">
          <div className="container py-4">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#666666]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stories..."
                  className="w-full pl-8 pr-3 py-2 border border-[#1a1a1a]/15 bg-transparent text-sm focus:outline-none focus:border-[#6111ff] text-[#1a1a1a] placeholder:text-[#666666]/60"
                />
              </div>

              {/* Content type tabs */}
              <div className="flex gap-1">
                {CONTENT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setContentType(t.value)}
                    className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                      contentType === t.value
                        ? 'bg-[#1a1a1a] text-white'
                        : 'border border-[#1a1a1a]/15 text-[#666666] hover:border-[#1a1a1a]/40'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Region selector */}
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="border border-[#1a1a1a]/15 bg-white text-sm px-3 py-1.5 focus:outline-none focus:border-[#6111ff] text-[#1a1a1a] max-w-[160px]"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r === 'all' ? 'All regions' : r}
                  </option>
                ))}
              </select>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#1a1a1a] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container py-10">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[360px]" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <>
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-6">
                {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((a) => (
                  <ArticleCard key={a._id} article={a} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Filter className="h-8 w-8 text-[#6111ff] mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold text-[#1a1a1a] mb-2">
                No stories match those filters
              </h3>
              <p className="text-[#666666] mb-6 text-sm">
                Try removing some filters or searching with different terms.
              </p>
              <Button
                onClick={clearFilters}
                className="rounded-none bg-[#1a1a1a] hover:bg-[#6111ff] text-white"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
