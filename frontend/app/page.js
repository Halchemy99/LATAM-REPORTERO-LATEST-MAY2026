'use client';

import { useState, useEffect } from 'react';
import { useTranslation, useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Clock,
  Bot,
  Users,
  Lock,
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
    color: '#6110ff',
    description: 'Today, distilled in 5 minutes.',
  },
  'press-review': {
    label: 'Press Review',
    icon: Newspaper,
    color: '#6110ff',
    description: 'What the region is reading — curated.',
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
    color: '#6110ff',
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
  return (
    <div className={`flex items-center gap-2 text-xs text-[#666666] ${className}`}>
      <span className="font-medium">{author}</span>
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

// ---------- Hero (Editor's Pick) ----------
function HeroEditor({ article }) {
  if (!article) return null;
  const meta = getMeta(article.contentType);
  const HeroIcon = meta.icon;
  const slug = typeof article.slug === 'object' ? article.slug.current : article.slug;
  const image = article.featuredImage;

  return (
    <section
      className="relative bg-[#1a1a1a] text-white overflow-hidden mb-10"
      data-testid="homepage-hero"
    >
      <div className="container py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <ContentTypeTag contentType={article.contentType} dark />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
              {meta.description}
            </span>
          </div>
          <Link href={`/article/${slug}`} className="group block">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.05] font-semibold mb-4 group-hover:text-[#cbb3ff] transition-colors">
              {article.title}
            </h1>
            {article.standfirst && (
              <p className="text-base lg:text-lg text-white/75 mb-5 leading-relaxed max-w-2xl">
                {article.standfirst}
              </p>
            )}
          </Link>
          <div className="flex items-center gap-4 flex-wrap">
            <Byline article={article} className="!text-white/70" />
            <Link href={`/article/${slug}`}>
              <Button
                className="bg-[#6110ff] hover:bg-[#4a0dd6] text-white rounded-none text-sm gap-2"
                data-testid="hero-read-now"
              >
                Read now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden border-l-4 border-[#6110ff]">
            {image ? (
              <img
                src={image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#6110ff] to-[#1a1a1a] flex items-center justify-center">
                <HeroIcon className="h-16 w-16 text-white/40" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#6110ff]" />
    </section>
  );
}

// ---------- Section header ----------
function SectionHeader({ icon: Icon, title, subtitle, href, accent = '#6110ff' }) {
  return (
    <div className="flex items-end justify-between mb-5 pb-2 border-b-2 border-[#1a1a1a]">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" style={{ color: accent }} />
        <div>
          <h2 className="text-sm font-mono uppercase tracking-[0.15em] text-[#1a1a1a] font-semibold">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-[#666666] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="text-xs font-mono uppercase tracking-wider text-[#6110ff] hover:underline flex items-center gap-1"
        >
          See all <ArrowRight className="h-3 w-3" />
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
      className="group border-l-2 border-[#6110ff]/30 hover:border-[#6110ff] pl-4 py-2 transition-colors"
      data-testid={`brief-card-${article._id}`}
    >
      <Link href={`/article/${slug}`} className="block">
        <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#666666] mb-1">
          {formatDate(article.publishedAt)}
          {article.region && (
            <>
              <span className="opacity-30 mx-1.5">|</span>
              {article.region}
            </>
          )}
        </div>
        <h3 className="font-serif text-base md:text-lg font-semibold text-[#1a1a1a] group-hover:text-[#6110ff] transition-colors leading-snug">
          {article.title}
        </h3>
        {article.standfirst && (
          <p className="text-sm text-[#666666] line-clamp-2 mt-1.5">
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
      className="group flex flex-col bg-white border border-[#1a1a1a]/10 hover:border-[#6110ff] transition-colors"
      data-testid={`deep-dive-card-${article._id}`}
    >
      <Link href={`/article/${slug}`} className="block">
        {image && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <ContentTypeTag contentType="deep-dive" />
            </div>
          </div>
        )}
        <div className="p-4">
          {!image && (
            <div className="mb-2">
              <ContentTypeTag contentType="deep-dive" />
            </div>
          )}
          <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#6110ff] mb-1.5">
            {article.category || 'Original'}
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] group-hover:text-[#6110ff] transition-colors leading-snug mb-2">
            {article.title}
          </h3>
          {article.standfirst && (
            <p className="text-sm text-[#666666] line-clamp-2 mb-3">
              {article.standfirst}
            </p>
          )}
          <Byline article={article} />
        </div>
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
          <h4 className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#6110ff] transition-colors line-clamp-2 leading-snug">
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
      <Icon className="h-6 w-6 text-[#6110ff] mx-auto mb-2" />
      <p className="text-sm text-[#666666]">{text}</p>
    </div>
  );
}

// ---------- Page ----------
export default function HomePage() {
  const { locale } = useTranslation();
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
      <div className="min-h-screen bg-[#F7F5F2]" data-testid="home-loading">
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
    <div className="min-h-screen bg-[#F7F5F2]" data-testid="home-page">
      <Header />

      {/* HERO: Editor's curated voice */}
      <HeroEditor article={hero} />

      <main className="container py-12">
        {/* CURATED VOICE */}
        <section
          className="mb-14 grid grid-cols-1 lg:grid-cols-2 gap-10"
          data-testid="section-curated"
        >
          <div>
            <SectionHeader
              icon={Coffee}
              title="Morning Brief"
              subtitle="Latin America, distilled before coffee"
              href="/solutions?type=morning-brief"
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
                text="Tomorrow's brief is coming. Subscribe to get it by email."
              />
            )}
          </div>

          <div>
            <SectionHeader
              icon={Newspaper}
              title="Press Review"
              subtitle="What we're reading across the region"
              href="/solutions?type=press-review"
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
                text="Fresh press reviews land every weekday afternoon."
              />
            )}
          </div>
        </section>

        {/* DEEP DIVES */}
        <section className="mb-14" data-testid="section-deep-dives">
          <SectionHeader
            icon={Layers}
            title="Deep Dives"
            subtitle="Original investigations & long-form analysis"
            href="/solutions?type=deep-dive"
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
              <Layers className="h-8 w-8 text-[#6110ff] mx-auto mb-3" />
              <p className="text-[#1a1a1a] font-serif text-lg mb-2">
                Original reporting is in the works.
              </p>
              <p className="text-sm text-[#666666] mb-4">
                Want to contribute? We&apos;re opening up to guest reporters across LATAM.
              </p>
              <Link href="/submit">
                <Button
                  variant="outline"
                  className="rounded-none border-[#1a1a1a]/20 text-sm"
                  data-testid="pitch-cta"
                >
                  Pitch a story
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* SUBSCRIBER + COMMUNITY ROW */}
        <section className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {!isSubscribed ? (
            <div
              className="bg-[#1a1a1a] text-white p-6"
              data-testid="subscriber-cta"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-4 w-4 text-[#6110ff]" />
                <span className="text-xs font-mono uppercase tracking-wider">
                  Subscriber Exclusive
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">
                Daily Brief in your inbox
              </h3>
              <p className="text-sm text-white/70 mb-4">
                Weekday Morning Briefs + the weekly Press Review, delivered before
                you start scrolling.
              </p>
              <Link href="/pricing">
                <Button className="bg-[#6110ff] hover:bg-[#4a0dd6] text-white rounded-none text-sm">
                  Subscribe — from $5/mo
                </Button>
              </Link>
            </div>
          ) : (
            <div
              className="bg-white border border-[#1a1a1a]/10 p-6"
              data-testid="member-thanks"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#6110ff]">
                  Member
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1a1a1a] mb-2">
                Welcome back.
              </h3>
              <p className="text-sm text-[#666666] mb-4">
                Your support keeps this newswire independent. Manage your account
                or jump back into the latest briefs.
              </p>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="rounded-none border-[#1a1a1a]/20 text-sm"
                >
                  Your account
                </Button>
              </Link>
            </div>
          )}

          <div className="bg-white border border-[#1a1a1a]/10 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-[#6110ff]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#1a1a1a]">
                Community
              </span>
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#1a1a1a] mb-2">
              Join the conversation
            </h3>
            <p className="text-sm text-[#666666] mb-4">
              Regional WhatsApp & Signal groups for readers, contributors, and our
              newsroom.
            </p>
            <Link href="/community">
              <Button
                variant="outline"
                className="rounded-none border-[#1a1a1a]/20 text-sm"
              >
                Explore community
              </Button>
            </Link>
          </div>
        </section>

        {/* WIRE FEED */}
        {wireFeed.length > 0 && (
          <section className="mb-8" data-testid="section-wire">
            <SectionHeader
              icon={Sparkles}
              title="Also on the Wire"
              subtitle="Aggregated headlines — AI-tagged, not our voice"
              accent="#666666"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {wireFeed.map((a) => (
                <WireCard key={a._id} article={a} />
              ))}
            </div>
            <p className="text-[11px] text-[#666666] mt-4 italic">
              Wire items are pulled from public RSS sources and shown for context.
              Our editorial voice lives in Morning Briefs, Press Reviews and Deep
              Dives above.
            </p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
