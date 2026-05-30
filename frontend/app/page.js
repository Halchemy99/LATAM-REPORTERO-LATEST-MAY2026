'use client';

import { useState, useEffect } from 'react';
import { useTranslation, useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { VideoHighlightsSection } from '@/components/SocialVideo';
import VerifiedBadge from '@/components/VerifiedBadge';
import {
  ArrowRight,
  Clock,
  Bot,
  Users,
  Mail,
  CheckCircle,
  Loader2,
  Newspaper,
  Coffee,
  Layers,
  Link2,
  Sparkles,
  Play,
} from 'lucide-react';

// ---------- Content type metadata ----------
const CONTENT_TYPE_META = {
  'morning-brief': {
    label: 'Morning Brief',
    icon: Coffee,
    color: '#6111ff',
    description: 'Today, distilled in 5 minutes.',
  },
  'press-review': {
    label: 'Press Review',
    icon: Newspaper,
    color: '#6111ff',
    description: 'What the region is reading. Curated.',
  },
  'deep-dive': {
    label: 'Deep Dive',
    icon: Layers,
    color: '#1a1a1a',
    description: 'Original reporting & analysis.',
  },
  'video-post': {
    label: 'Watch',
    icon: Play,
    color: '#6111ff',
    description: 'Story-led, video-first.',
  },
  article: {
    label: 'Wire',
    icon: Bot,
    color: '#666666',
    description: 'Aggregated newsfeed.',
  },
};

function getMeta(contentType) {
  return CONTENT_TYPE_META[contentType] || CONTENT_TYPE_META.article;
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

// ---------- Reusable badges ----------
function ContentTypeTag({ contentType, dark = false }) {
  const meta = getMeta(contentType);
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.12em] ${
        dark ? 'bg-white text-[#1a1a1a]' : 'bg-[#1a1a1a] text-white'
      }`}
      data-testid={`content-type-tag-${contentType}`}
    >
      <Icon className="h-3 w-3" style={{ color: meta.color }} />
      {meta.label}
    </span>
  );
}

function Byline({ article, className = '' }) {
  const author = article.authorName || 'LATAM Reportero';
  const date = formatDate(article.publishedAt);
  const verificationLevel = article.authorVerificationLevel ||
    (article.authorVerified ? 'id-verified' : null);

  return (
    <div className={`flex items-center gap-2 text-xs text-[#666666] ${className}`}>
      <span className="flex items-center gap-1">
        <span className="font-medium">{author}</span>
        {verificationLevel && (
          <VerifiedBadge level={verificationLevel} size="xs" />
        )}
      </span>
      {date && (
        <>
          <span className="opacity-30">&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {date}
          </span>
        </>
      )}
    </div>
  );
}

// ---------- Hero (Editor's Pick) — cinematic full-bleed ----------
function HeroEditor({ article }) {
  const { t } = useTranslation();
  if (!article) return null;
  const meta = getMeta(article.contentType);
  const HeroIcon = meta.icon;
  const slug = typeof article.slug === 'object' ? article.slug.current : article.slug;
  const image = article.featuredImage;

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: '82vh' }}
      data-testid="homepage-hero"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        {image ? (
          <img
            src={image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background:
                'linear-gradient(135deg, #1a0a3a 0%, #0d0d0d 50%, #1a1a1a 100%)',
            }}
          />
        )}
        {/* Gradient: transparent top-right → near-black bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.65) 45%, rgba(10,10,10,0.10) 100%)',
          }}
        />
        {/* Left fade for text legibility on desktop */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              'linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.30) 55%, transparent 100%)',
          }}
        />
      </div>

      {/* Content — anchored to bottom-left */}
      <div
        className="relative z-10 container flex flex-col justify-end pb-10 lg:pb-14"
        style={{ minHeight: '82vh' }}
      >
        <div className="max-w-3xl">
          {/* Category + type tags */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <ContentTypeTag contentType={article.contentType} dark />
            {article.region && (
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/45">
                {article.region}
              </span>
            )}
          </div>

          {/* Headline */}
          <Link href={`/article/${slug}`} className="group block">
            <h1
              className="font-serif font-semibold text-white leading-[0.96] mb-5 group-hover:text-[#c4a8ff] transition-colors duration-200"
              style={{
                fontFamily: 'Marcellus, Georgia, serif',
                fontSize: 'clamp(2.4rem, 6vw, 5rem)',
              }}
            >
              {article.title}
            </h1>
            {article.standfirst && (
              <p className="text-base lg:text-lg text-white/68 mb-6 leading-relaxed max-w-2xl">
                {article.standfirst}
              </p>
            )}
          </Link>

          {/* Byline + CTA */}
          <div className="flex items-center gap-4 flex-wrap">
            <Byline article={article} className="!text-white/60" />
            <Link href={`/article/${slug}`}>
              <Button
                className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white rounded-none text-sm gap-2 transition-colors"
                data-testid="hero-read-now"
              >
                {t("Read now")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Purple hairline at very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6111ff]" />
    </section>
  );
}

// ---------- Section header ----------
function SectionHeader({ title, subtitle, href, accent = '#6111ff' }) {
  return (
    <div className="flex items-baseline justify-between mb-6">
      <div>
        <h2
          className="font-serif font-semibold text-[#1a1a1a] leading-none"
          style={{ fontSize: '1.6rem' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#999999] mt-1.5">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="text-[11px] font-mono uppercase tracking-wider flex items-center gap-1 transition-colors"
          style={{ color: accent }}
        >
          All <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

// ---------- Cards ----------
function BriefCard({ article }) {
  const slug = typeof article.slug === 'object' ? article.slug.current : article.slug;
  return (
    <article
      className="group py-4 border-b border-[#1a1a1a]/10 last:border-0"
      data-testid={`brief-card-${article._id}`}
    >
      <Link href={`/article/${slug}`} className="block">
        <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#999999] mb-2">
          {formatDate(article.publishedAt)}
          {article.region && (
            <span className="ml-2 text-[#6111ff]">{article.region}</span>
          )}
        </div>
        <h3
          className="font-serif font-semibold text-[#1a1a1a] group-hover:text-[#6111ff] transition-colors leading-[1.15]"
          style={{ fontSize: '1.25rem' }}
        >
          {article.title}
        </h3>
        {article.standfirst && (
          <p className="text-sm text-[#666666] line-clamp-2 mt-1.5 leading-relaxed">
            {article.standfirst}
          </p>
        )}
      </Link>
    </article>
  );
}

function DeepDiveCard({ article }) {
  const slug = typeof article.slug === 'object' ? article.slug.current : article.slug;
  const image = article.featuredImage;
  return (
    <article
      className="group flex flex-col"
      data-testid={`deep-dive-card-${article._id}`}
    >
      <Link href={`/article/${slug}`} className="block">
        {/* Image — cinematic portrait crop */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a] mb-4">
          {image ? (
            <img
              src={image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background:
                  'linear-gradient(135deg, #1a1a1a 0%, #2a1260 100%)',
              }}
            />
          )}
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/20 transition-colors duration-300" />
          {/* Category chip bottom-left */}
          <div className="absolute bottom-3 left-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/80 bg-[#6111ff] px-2 py-0.5">
              {article.category || 'Investigation'}
            </span>
          </div>
        </div>

        {/* Text below image */}
        <h3
          className="font-serif font-semibold text-[#1a1a1a] group-hover:text-[#6111ff] transition-colors leading-[1.1] mb-2"
          style={{ fontSize: '1.35rem' }}
        >
          {article.title}
        </h3>
        {article.standfirst && (
          <p className="text-sm text-[#666666] line-clamp-2 mb-3 leading-relaxed">
            {article.standfirst}
          </p>
        )}
        <Byline article={article} />
      </Link>
    </article>
  );
}

function WireCard({ article }) {
  const slug = typeof article.slug === 'object' ? article.slug.current : article.slug;
  return (
    <article
      className="group flex gap-3 py-3 border-b border-[#1a1a1a]/10"
      data-testid={`wire-card-${article._id}`}
    >
      <Link href={`/article/${slug}`} className="flex gap-3 w-full">
        {article.featuredImage && (
          <div className="w-24 h-20 flex-shrink-0 overflow-hidden">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#666666] mb-1">
            <Bot className="h-3 w-3 text-[#666666]" />
            <span>{article.category || 'wire'}</span>
            <span className="opacity-30">|</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          <h4 className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#6111ff] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h4>
        </div>
      </Link>
    </article>
  );
}

function EmptyStateMini({ icon: Icon, text }) {
  return (
    <div className="border border-dashed border-[#1a1a1a]/20 p-6 text-center bg-white/40">
      <Icon className="h-6 w-6 text-[#6111ff] mx-auto mb-2" />
      <p className="text-sm text-[#666666]">{text}</p>
    </div>
  );
}

function NewsletterCta() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      await fetch(`${baseUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // show success regardless — newsletter is resilient
    }
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3" data-testid="newsletter-success">
        <CheckCircle className="h-5 w-5 text-[#6111ff] flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-white">{t("You're in. Check your inbox.")}</p>
          <p className="text-xs text-white/50 mt-0.5">{t("First brief arrives tomorrow morning.")}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" data-testid="newsletter-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 min-w-0 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-3 py-2 text-sm focus:outline-none focus:border-white/50"
        data-testid="newsletter-email-input"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white px-4 py-2 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-60 whitespace-nowrap"
        data-testid="newsletter-submit"
      >
        {status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>{t("Get it free")} <ArrowRight className="h-3.5 w-3.5" /></>
        )}
      </button>
    </form>
  );
}

// ---------- Page ----------
export default function HomePage() {
  const { locale, t } = useTranslation();
  const { isSubscribed } = useUserRole();
  const [data, setData] = useState({
    hero: null,
    morningBriefs: [],
    pressReviews: [],
    deepDives: [],
    videoPosts: [],
    latest: [],
  });
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

  useEffect(() => {
    let cancelled = false;
    const fetchHomepage = async () => {
      setLoading(true);
      try {
        const resp = await fetch(
          `${API_URL}/api/sanity/homepage?language=${locale}`
        );
        if (resp.ok) {
          const json = await resp.json();
          if (cancelled) return;
          const hero = json.hero || (json.latest && json.latest[0]) || null;
          setData({
            hero,
            morningBriefs: json.morningBriefs || [],
            pressReviews: json.pressReviews || [],
            deepDives: json.deepDives || [],
            videoPosts: json.videoPosts || [],
            latest: json.latest || [],
          });
        }
      } catch (err) {
        if (!cancelled) console.error('Error fetching homepage:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchHomepage();
    return () => {
      cancelled = true;
    };
  }, [locale, API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F6]" data-testid="home-loading">
        <Header />
        <div className="container py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-[#1a1a1a]/10 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-32 bg-[#1a1a1a]/10 rounded" />
              <div className="h-32 bg-[#1a1a1a]/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { hero, morningBriefs, pressReviews, deepDives, latest } = data;

  const shownIds = new Set(
    [
      hero?._id,
      ...morningBriefs.map((a) => a._id),
      ...pressReviews.map((a) => a._id),
      ...deepDives.map((a) => a._id),
    ].filter(Boolean)
  );
  const wireFeed = latest.filter((a) => !shownIds.has(a._id)).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F9F6F6]" data-testid="home-page">
      <Header showSearch={false} />

      {/* Edition dateline */}
      <div className="border-b border-[#1a1a1a]/10 bg-[#F9F6F6]">
        <div className="container py-2 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6111ff]">
            LATAM Reportero · Independent
          </span>
        </div>
      </div>

      {/* Editorial masthead — publication identity, commands the page before the lead story */}
      <div className="bg-[#F9F6F6] border-b-2 border-[#1a1a1a]">
        <div className="container py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-end">
            <div className="lg:col-span-9">
              <h2
                className="font-display font-extrabold text-[#1a1a1a] leading-[0.93] tracking-tight"
                style={{ fontSize: 'clamp(3rem, 8.5vw, 7.5rem)' }}
              >
                {t('Latin America')}<br />
                <em className="not-italic" style={{ color: '#6111ff' }}>{t('explained.')}</em>{' '}
                {t('Fully.')}
              </h2>
            </div>
            <div className="lg:col-span-3 lg:pb-2">
              <p className="text-sm text-[#666666] leading-relaxed border-l-2 border-[#1a1a1a]/15 pl-4">
                {t("Explanatory journalism. Free every weekday. No paywall, no agenda.")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HERO: Editor's curated voice */}
      <HeroEditor article={hero} />

      {/* WATCH: Social video — story-driven, central */}
      <VideoHighlightsSection />

      <main className="container py-12">
        {/* CURATED VOICE */}
        <section
          className="mb-14 grid grid-cols-1 lg:grid-cols-2 gap-10"
          data-testid="section-curated"
        >
          <div>
            <SectionHeader
              icon={Coffee}
              title={t("Morning Brief")}
              subtitle={t("Latin America, distilled before coffee")}
              href="/investigations?type=morning-brief"
            />
            {morningBriefs.length > 0 ? (
              <div className="space-y-5">
                {morningBriefs.map((a) => (
                  <BriefCard key={a._id} article={a} />
                ))}
              </div>
            ) : (
              <EmptyStateMini
                icon={Coffee}
                text={t("Tomorrow's brief is coming. Subscribe to get it by email.")}
              />
            )}
          </div>

          <div>
            <SectionHeader
              icon={Newspaper}
              title={t("Press Review")}
              subtitle={t("What we're reading across the region")}
              href="/investigations?type=press-review"
            />
            {pressReviews.length > 0 ? (
              <div className="space-y-5">
                {pressReviews.map((a) => (
                  <BriefCard key={a._id} article={a} />
                ))}
              </div>
            ) : (
              <EmptyStateMini
                icon={Link2}
                text={t("Fresh press reviews land every weekday afternoon.")}
              />
            )}
          </div>
        </section>

        {/* DEEP DIVES */}
        <section className="mb-14" data-testid="section-deep-dives">
          <SectionHeader
            icon={Layers}
            title={t("Deep Dives")}
            subtitle={t("Original investigations & long-form analysis")}
            href="/investigations"
            accent="#1a1a1a"
          />
          {deepDives.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {deepDives.map((a) => (
                <DeepDiveCard key={a._id} article={a} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-[#1a1a1a]/20 p-8 text-center">
              <Layers className="h-8 w-8 text-[#6111ff] mx-auto mb-3" />
              <p className="text-[#1a1a1a] font-serif text-lg mb-2">
                {t("Original reporting is in the works.")}
              </p>
              <p className="text-sm text-[#666666] mb-4">
                {t("Want to contribute? We're opening up to guest reporters across LATAM.")}
              </p>
              <Link href="/submit">
                <Button
                  variant="outline"
                  className="rounded-none border-[#1a1a1a]/20 text-sm"
                  data-testid="pitch-cta"
                >
                  {t("Pitch a story")}
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* NEWSLETTER (FREE) + COMMUNITY */}
        <section id="newsletter" className="mb-14">
          {/* Newsletter — full-width dark slab */}
          <div className="bg-[#0d0d0d] text-white p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" data-testid="newsletter-cta">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#6111ff] block mb-4">
                {t("Free daily brief")}
              </span>
              <h3
                className="font-display font-extrabold text-white leading-[0.95] mb-4 tracking-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                {t("Latin America, before your coffee.")}
              </h3>
              <p className="text-sm text-white/55 leading-relaxed">
                {t("Weekday Morning Briefs and the weekly Press Review. No paywall. No account needed.")}
              </p>
            </div>
            <div>
              <NewsletterCta />
            </div>
          </div>

          {/* Community — coming soon strip */}
          <div className="border-t border-[#1a1a1a]/10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" data-testid="community-cta">
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white bg-[#1a1a1a]/30 px-2 py-0.5 text-[#666666] border border-[#1a1a1a]/15">
                {t("Coming soon")}
              </span>
              <div>
                <p className="text-sm font-medium text-[#1a1a1a]">
                  {t("Community membership")}
                </p>
                <p className="text-xs text-[#666666] mt-0.5">
                  {t("Signal groups, reporter access, member calls. Launching when it's ready.")}
                </p>
              </div>
            </div>
            <Link href="/community" className="flex-shrink-0">
              <Button
                variant="outline"
                className="rounded-none border-[#1a1a1a]/20 text-xs gap-1.5 text-[#666666] whitespace-nowrap"
                data-testid="community-join-btn"
              >
                {t("Get notified")} <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </section>

        {/* WIRE FEED */}
        {wireFeed.length > 0 && (
          <section className="mb-8" data-testid="section-wire">
            <SectionHeader
              icon={Sparkles}
              title={t("Also on the Wire")}
              subtitle={t("Aggregated headlines. AI-tagged, not our voice")}
              accent="#666666"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {wireFeed.map((a) => (
                <WireCard key={a._id} article={a} />
              ))}
            </div>
            <p className="text-[11px] text-[#666666] mt-4 italic">
              {t("Wire items are pulled from public RSS sources and shown for context. Our editorial voice lives in Morning Briefs, Press Reviews and Deep Dives above.")}
            </p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
