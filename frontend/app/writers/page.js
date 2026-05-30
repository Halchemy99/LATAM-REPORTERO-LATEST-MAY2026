'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import { mockWriters, getLocalizedContent } from '@/lib/mock-data';
import { getAuthors } from '@/lib/supabase/cms';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SocialBar } from '@/components/SocialVideo';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, FileText, MapPin, ArrowRight, Users } from 'lucide-react';

export default function JournalistsPage() {
  const { t, locale } = useTranslation();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingCMS, setUsingCMS] = useState(false);

  useEffect(() => {
    const loadWriters = async () => {
      try {
        const cmsAuthors = await getAuthors();
        if (cmsAuthors && cmsAuthors.length > 0) {
          setWriters(
            cmsAuthors.map((author) => ({
              id: author.id,
              name: author.name,
              avatar: author.avatar_url || null,
              specialty: {
                en: author.expertise_en || author.title || 'Journalist',
                es: author.expertise_es || author.title || 'Periodista',
                pt: author.expertise_pt || author.title || 'Jornalista',
              },
              bio: {
                en: author.bio_en || '',
                es: author.bio_es || '',
                pt: author.bio_pt || '',
              },
              trustScore: author.trust_score || 85,
              articleCount: author.article_count || 0,
              region: author.region || '',
              verified: author.is_verified || false,
              isEditor: author.role === 'editor',
              slug: author.slug,
            }))
          );
          setUsingCMS(true);
        } else {
          setWriters(mockWriters);
        }
      } catch {
        setWriters(mockWriters);
      } finally {
        setLoading(false);
      }
    };
    loadWriters();
  }, []);

  const regions = ['all', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru'];

  const filtered = writers.filter((w) => {
    const matchesRegion = region === 'all' || w.region?.toLowerCase() === region.toLowerCase();
    if (!matchesRegion) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const spec = getLocalizedContent(w.specialty, locale) || '';
    return w.name.toLowerCase().includes(q) || spec.toLowerCase().includes(q);
  });

  const stats = {
    journalists: writers.length,
    verified: writers.filter((w) => w.verified).length,
    articles: writers.reduce((sum, w) => sum + (w.articleCount || 0), 0),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
      <SocialBar />
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <div className="bg-[#1a1a1a] text-white">
          <div className="container py-12 lg:py-16">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#6111ff] mb-3">
              {t('footer.newsroom')}
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl font-semibold leading-tight mb-4">
              {t('nav.writers')}
            </h1>
            <p className="text-white/60 max-w-xl text-base leading-relaxed mb-8">
              {t('Independent journalists covering Latin America. Every byline is human — verified, accountable, and ID-checked.')}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: stats.journalists, label: t('Journalists') },
                { value: stats.verified, label: t('ID Verified') },
                { value: stats.articles, label: t('Articles published') },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-3xl font-bold text-white">{value.toLocaleString()}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="border-b border-[#1a1a1a]/10 bg-white">
          <div className="container py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#666666]" />
              <Input
                placeholder={t('Search journalists…')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm rounded-none border-[#1a1a1a]/20 focus-visible:ring-0 focus-visible:border-[#6111ff] bg-white"
              />
            </div>

            {/* Region pills */}
            <div className="flex flex-wrap gap-1.5">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
                    region === r
                      ? 'bg-[#1a1a1a] text-white'
                      : 'bg-transparent text-[#666666] border border-[#1a1a1a]/15 hover:border-[#1a1a1a]/40 hover:text-[#1a1a1a]'
                  }`}
                >
                  {r === 'all' ? t('All') : r}
                </button>
              ))}
            </div>

            <div className="ml-auto text-[11px] font-mono text-[#666666] hidden sm:block">
              {filtered.length} {t('journalists')}
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="container py-10">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#1a1a1a]/10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-[#F9F6F6] p-6 animate-pulse">
                  <div className="w-20 h-20 bg-[#1a1a1a]/10 mb-4" />
                  <div className="h-4 bg-[#1a1a1a]/10 w-3/4 mb-2" />
                  <div className="h-3 bg-[#1a1a1a]/8 w-1/2 mb-4" />
                  <div className="h-3 bg-[#1a1a1a]/8 w-full mb-1" />
                  <div className="h-3 bg-[#1a1a1a]/8 w-4/5" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-10 w-10 mx-auto mb-4 text-[#1a1a1a]/20" />
              <p className="text-[#666666] text-sm">{t('No journalists found')}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#1a1a1a]/10">
              {filtered.map((writer) => {
                const specialty = getLocalizedContent(writer.specialty, locale);
                const bio = getLocalizedContent(writer.bio, locale);
                const profileHref = usingCMS
                  ? `/writers/${writer.slug || writer.id}`
                  : `/writers/${writer.id}`;

                return (
                  <article
                    key={writer.id}
                    className="bg-[#F9F6F6] p-6 group hover:bg-white transition-colors"
                  >
                    {/* Avatar */}
                    <div className="mb-4">
                      {writer.avatar ? (
                        <img
                          src={writer.avatar}
                          alt={writer.name}
                          className="w-20 h-20 object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-[#1a1a1a]/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-[#1a1a1a]/30">
                            {writer.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name + badges */}
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="font-semibold text-[#1a1a1a] text-base leading-tight">
                        {writer.name}
                      </h3>
                      {writer.verified && (
                        <CheckCircle
                          className="h-3.5 w-3.5 text-[#6111ff] flex-shrink-0 mt-0.5"
                          title="ID Verified"
                        />
                      )}
                    </div>

                    {/* Specialty */}
                    <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#6111ff] mb-1">
                      {specialty}
                    </p>

                    {/* Region */}
                    {writer.region && (
                      <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-[#666666] flex items-center gap-1 mb-3">
                        <MapPin className="h-2.5 w-2.5" />
                        {writer.region}
                      </p>
                    )}

                    {/* Bio */}
                    {bio && (
                      <p className="text-sm text-[#1a1a1a]/70 leading-relaxed line-clamp-3 mb-4">
                        {bio}
                      </p>
                    )}

                    {/* Footer row */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1a1a1a]/8">
                      <span className="text-[10px] font-mono text-[#666666] flex items-center gap-1">
                        <FileText className="h-2.5 w-2.5" />
                        {writer.articleCount} {t('articles')}
                      </span>
                      <Link
                        href={profileHref}
                        className="text-[10px] font-mono uppercase tracking-wider text-[#6111ff] hover:text-[#1a1a1a] flex items-center gap-1 transition-colors"
                      >
                        {t('Stories')} <ArrowRight className="h-2.5 w-2.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Join CTA ── */}
        <div className="border-t border-[#1a1a1a]/10 bg-white">
          <div className="container py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6111ff] mb-2">
                {t('For journalists')}
              </p>
              <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a]">
                {t('Cover Latin America with us')}
              </h2>
              <p className="text-sm text-[#666666] mt-1 max-w-md">
                {t('We work with independent journalists across the region. Pitch a story or apply to join the team.')}
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                href="/submit"
                className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#6111ff] text-white px-5 py-3 text-[11px] font-mono uppercase tracking-wider transition-colors"
              >
                {t('about.pitchStory')} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
