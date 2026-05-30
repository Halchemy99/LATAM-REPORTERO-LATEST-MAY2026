'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VerifiedBadge from '@/components/VerifiedBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin, Mail, Globe, ArrowLeft, Clock,
  Twitter, Instagram, Linkedin, Youtube, ExternalLink
} from 'lucide-react';
import { useTranslation } from '@/lib/providers';

// TikTok icon (not in lucide)
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/>
  </svg>
);

const VERIFICATION_COLORS = {
  'staff': 'bg-[#6111ff] text-white',
  'id-verified': 'bg-emerald-600 text-white',
  'expert': 'bg-blue-600 text-white',
  'contributor': 'bg-[#1a1a1a] text-white',
  'stringer': 'bg-orange-500 text-white',
};

function ArticleCard({ article }) {
  const slug = typeof article.slug === 'object' ? article.slug.current : article.slug;
  return (
    <Link href={`/article/${slug}`} className="group flex gap-4 p-4 bg-white border border-[#1a1a1a]/10 hover:border-[#6111ff] transition-colors">
      {article.featuredImage && (
        <img src={article.featuredImage} alt="" className="w-20 h-16 object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-mono uppercase tracking-wider text-[#6111ff]">
          {article.category || 'Report'}
        </span>
        <h3 className="text-sm font-semibold text-[#1a1a1a] group-hover:text-[#6111ff] transition-colors line-clamp-2 mt-0.5 mb-1">
          {article.title}
        </h3>
        {article.publishedAt && (
          <span className="text-xs text-[#666666] flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function WriterProfilePage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [author, setAuthor] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const [authorRes, articlesRes] = await Promise.all([
          fetch(`${baseUrl}/api/sanity/author/${slug}`),
          fetch(`${baseUrl}/api/sanity/articles?author=${encodeURIComponent(slug)}&limit=20`),
        ]);
        if (authorRes.ok) {
          const data = await authorRes.json();
          setAuthor(data.author || null);
        }
        if (articlesRes.ok) {
          const data = await articlesRes.json();
          setArticles(data.articles || []);
        }
      } catch (err) {
        console.error('Error loading writer:', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  const verificationColor = author?.verificationLevel
    ? VERIFICATION_COLORS[author.verificationLevel]
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
      <Header />
      <main className="flex-1">

        {loading ? (
          <div className="bg-[#1a1a1a] h-64 animate-pulse" />
        ) : author ? (
          <>
            {/* Hero */}
            <div className="bg-[#1a1a1a] text-white">
              <div className="container py-12">
                <Link href="/writers" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors mb-8">
                  <ArrowLeft className="h-3 w-3" /> {t('writers.backToAll')}
                </Link>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {author.avatarUrl ? (
                      <img
                        src={author.avatarUrl}
                        alt={author.name}
                        className="w-28 h-28 rounded-full object-cover border-2 border-white/10"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-[#6111ff]/20 border-2 border-[#6111ff]/30 flex items-center justify-center">
                        <span className="text-3xl font-serif font-semibold text-[#6111ff]">
                          {author.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-serif font-semibold">{author.name}</h1>
                      {author.isVerified && (
                        <VerifiedBadge level={author.verificationLevel} size="md" />
                      )}
                    </div>

                    {/* Trust tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {author.verificationLevel && verificationColor && (
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 ${verificationColor}`}>
                          {t(`writers.verificationLevels.${author.verificationLevel}`)}
                        </span>
                      )}
                      {author.pressCredentials?.map(cred => (
                        <span key={cred} className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-white/10 text-white/70">
                          {cred}
                        </span>
                      ))}
                    </div>

                    {author.title && (
                      <p className="text-white/60 text-sm mb-1">{author.title}</p>
                    )}
                    {author.location && (
                      <p className="text-white/40 text-sm flex items-center gap-1.5 mb-4">
                        <MapPin className="h-3.5 w-3.5" /> {author.location}
                      </p>
                    )}

                    {author.bio && (
                      <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-2xl">
                        {author.bio}
                      </p>
                    )}

                    {/* Specialties */}
                    {author.specialties?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {author.specialties.map(s => (
                          <span key={s} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border border-white/20 text-white/50">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Social Links */}
                    <div className="flex items-center gap-3">
                      {author.twitter && (
                        <a href={author.twitter} target="_blank" rel="noopener noreferrer"
                          className="text-white/40 hover:text-white transition-colors" title="X / Twitter">
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {author.instagram && (
                        <a href={author.instagram} target="_blank" rel="noopener noreferrer"
                          className="text-white/40 hover:text-white transition-colors" title="Instagram">
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                      {author.tiktok && (
                        <a href={author.tiktok} target="_blank" rel="noopener noreferrer"
                          className="text-white/40 hover:text-white transition-colors" title="TikTok">
                          <TikTokIcon className="h-4 w-4" />
                        </a>
                      )}
                      {author.linkedin && (
                        <a href={author.linkedin} target="_blank" rel="noopener noreferrer"
                          className="text-white/40 hover:text-white transition-colors" title="LinkedIn">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {author.youtube && (
                        <a href={author.youtube} target="_blank" rel="noopener noreferrer"
                          className="text-white/40 hover:text-white transition-colors" title="YouTube">
                          <Youtube className="h-4 w-4" />
                        </a>
                      )}
                      {author.website && (
                        <a href={author.website} target="_blank" rel="noopener noreferrer"
                          className="text-white/40 hover:text-white transition-colors" title="Website">
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      {author.email && (
                        <a href={`mailto:${author.email}`}
                          className="text-white/40 hover:text-white transition-colors" title="Email">
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="container py-12">
              <h2 className="text-xl font-serif font-semibold text-[#1a1a1a] mb-6">
                {t('writers.storiesBy')} {author.name}
                {articles.length > 0 && (
                  <span className="ml-2 text-sm font-sans font-normal text-[#666666]">
                    ({articles.length})
                  </span>
                )}
              </h2>

              {articles.length > 0 ? (
                <div className="space-y-3 max-w-2xl">
                  {articles.map(article => (
                    <ArticleCard key={article._id || article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="max-w-2xl py-12 text-center border border-[#1a1a1a]/10 bg-white">
                  <p className="text-[#666666] mb-4">{t('writers.noStories')}</p>
                  <Link href="/investigations">
                    <Button variant="outline" className="rounded-none">{t('writers.browseAll')}</Button>
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="container py-24 text-center">
            <h1 className="text-2xl font-serif font-semibold mb-4">{t('writers.label')} not found</h1>
            <Link href="/writers">
              <Button className="bg-[#6111ff] text-white rounded-none">{t('writers.backToAll')}</Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
