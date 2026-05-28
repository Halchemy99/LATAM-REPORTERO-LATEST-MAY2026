'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ExternalLink } from 'lucide-react';

// Social media URLs
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/latamreportero/',
  tiktok: 'https://www.tiktok.com/@latamreportero',
  youtube: 'https://www.youtube.com/@LatamReportero',
  linkedin: 'https://www.linkedin.com/company/latam-reportero/',
};

// Instagram Icon
const InstagramIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// TikTok Icon
const TikTokIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// YouTube Icon
const YouTubeIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// LinkedIn Icon
const LinkedInIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Slim Social Bar - Goes at top of page
export function SocialBar() {
  return (
    <div className="bg-black text-white py-1.5">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs">
          <Play className="h-3 w-3 text-[#6111ff]" />
          <span className="text-white/70">Watch the latest:</span>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={SOCIAL_LINKS.youtube} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:text-[#6111ff] transition-colors"
          >
            <YouTubeIcon className="h-4 w-4" />
            <span className="hidden sm:inline">YouTube</span>
          </a>
          <a 
            href={SOCIAL_LINKS.tiktok} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:text-[#6111ff] transition-colors"
          >
            <TikTokIcon className="h-4 w-4" />
            <span className="hidden sm:inline">TikTok</span>
          </a>
          <a 
            href={SOCIAL_LINKS.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:text-[#6111ff] transition-colors"
          >
            <InstagramIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
          <a 
            href={SOCIAL_LINKS.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:text-[#6111ff] transition-colors"
          >
            <LinkedInIcon className="h-4 w-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// Video Card Component
export function VideoCard({ platform, title, thumbnail, videoUrl, views, date }) {
  const PlatformIcon = platform === 'youtube' ? YouTubeIcon : platform === 'tiktok' ? TikTokIcon : InstagramIcon;
  const platformColors = {
    youtube: 'bg-red-600',
    tiktok: 'bg-black',
    instagram: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400'
  };
  
  return (
    <a 
      href={videoUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-100">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#6111ff] to-[#600fff] flex items-center justify-center">
            <PlatformIcon className="h-12 w-12 text-white/50" />
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="h-6 w-6 text-[#6111ff] ml-1" />
          </div>
        </div>
        
        {/* Platform badge */}
        <div className={`absolute top-2 left-2 ${platformColors[platform]} text-white px-2 py-0.5 rounded text-[10px] font-medium uppercase flex items-center gap-1`}>
          <PlatformIcon className="h-3 w-3" />
          {platform === 'youtube' ? 'Shorts' : platform === 'tiktok' ? 'TikTok' : 'Reels'}
        </div>
      </div>
      
      <div className="mt-2">
        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-[#6111ff] transition-colors">
          {title}
        </h4>
        {(views || date) && (
          <p className="text-xs text-gray-500 mt-1">
            {views && <span>{views} views</span>}
            {views && date && <span> · </span>}
            {date && <span>{date}</span>}
          </p>
        )}
      </div>
    </a>
  );
}

// ---------- Cinematic Watch Section — Vice/editorial level ----------
const PLATFORM_META = {
  tiktok: {
    Icon: TikTokIcon,
    label: 'TikTok',
    bg: 'bg-[#010101]',
    href: SOCIAL_LINKS.tiktok,
  },
  instagram: {
    Icon: InstagramIcon,
    label: 'Reels',
    bg: 'bg-gradient-to-br from-purple-700 to-pink-500',
    href: SOCIAL_LINKS.instagram,
  },
  youtube: {
    Icon: YouTubeIcon,
    label: 'Shorts',
    bg: 'bg-[#FF0000]',
    href: SOCIAL_LINKS.youtube,
  },
};

function WatchCard({ platform, title, thumbnail, videoUrl, reporter, verified }) {
  const meta = PLATFORM_META[platform] || PLATFORM_META.tiktok;
  const Icon = meta.Icon;

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative"
      data-testid={`watch-card-${platform}`}
    >
      {/* Portrait frame */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 brightness-75 group-hover:brightness-90"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#000]" />
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Platform chip — top left */}
        <div className={`absolute top-3 left-3 ${meta.bg} text-white flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider`}>
          <Icon className="h-2.5 w-2.5" />
          {meta.label}
        </div>

        {/* Play button — center, shows on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <Play className="h-5 w-5 text-white ml-0.5" />
          </div>
        </div>

        {/* Text — pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-sm font-semibold leading-snug mb-1.5 line-clamp-3"
            style={{ fontSize: '0.95rem' }}>
            {title}
          </p>
          {reporter && (
            <div className="flex items-center gap-1.5">
              <span className="text-white/55 text-[10px] font-mono uppercase tracking-wider">
                {reporter}
              </span>
              {verified && (
                <span title="ID Verified Journalist"
                  className="inline-flex items-center justify-center h-3 w-3 rounded-full bg-[#6111ff] flex-shrink-0">
                  <svg viewBox="0 0 10 10" fill="none" className="w-full h-full p-[1.5px]">
                    <polyline points="2,5.5 4,7.5 8,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

// Video Highlights Section - For homepage
export function VideoHighlightsSection() {
  const videos = [
    {
      platform: 'tiktok',
      title: 'Inside the Amazon: the deforestation fight no one is covering',
      thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.tiktok,
      reporter: 'Ana Lima',
      verified: true,
    },
    {
      platform: 'instagram',
      title: "Argentina's economy in 60 seconds. What you need to know now",
      thumbnail: 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.instagram,
      reporter: 'Matías Romero',
      verified: true,
    },
    {
      platform: 'tiktok',
      title: "Mexico City's water crisis is getting worse. Here's why.",
      thumbnail: 'https://images.unsplash.com/photo-1568632234180-0e6c08735d01?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.tiktok,
      reporter: 'Carlos Vega',
      verified: false,
    },
    {
      platform: 'youtube',
      title: "Colombia's peace process. One reporter on the ground",
      thumbnail: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.youtube,
      reporter: 'Valentina Cruz',
      verified: true,
    },
    {
      platform: 'tiktok',
      title: "Venezuela. What's actually happening on the streets right now",
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.tiktok,
      reporter: 'Pedro Díaz',
      verified: true,
    },
    {
      platform: 'instagram',
      title: "Chile's lithium boom and who isn't benefiting",
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.instagram,
      reporter: 'Sofía Herrera',
      verified: true,
    },
    {
      platform: 'youtube',
      title: 'Peru: election chaos explained simply',
      thumbnail: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.youtube,
      reporter: 'José Quispe',
      verified: false,
    },
    {
      platform: 'tiktok',
      title: 'Brazil election: what the numbers really show',
      thumbnail: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.tiktok,
      reporter: 'Camila Santos',
      verified: true,
    },
  ];

  return (
    <section className="bg-[#0d0d0d] py-10 lg:py-14" data-testid="watch-section">
      <div className="container">
        {/* Header row */}
        <div className="flex items-end justify-between mb-7 pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6111ff] mb-1.5">
              Story-driven · 60 seconds
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-white leading-none"
              >
              Watch
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {[
              { Icon: TikTokIcon, href: SOCIAL_LINKS.tiktok, label: 'TikTok' },
              { Icon: InstagramIcon, href: SOCIAL_LINKS.instagram, label: 'Reels' },
              { Icon: YouTubeIcon, href: SOCIAL_LINKS.youtube, label: 'Shorts' },
            ].map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-[11px] font-mono uppercase tracking-wider">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </a>
            ))}
            <Link href="/watch"
              className="hidden md:flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-[#6111ff] hover:text-white transition-colors ml-2">
              All videos <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Cards grid — 4 wide on desktop, 2 rows of 4 = 8 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-3">
          {videos.map((v, i) => (
            <WatchCard key={i} {...v} />
          ))}
        </div>

        {/* Footer follow CTA */}
        <div className="mt-7 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/35 font-mono uppercase tracking-wider">
            Follow @latamreportero for daily video journalism
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: TikTokIcon, href: SOCIAL_LINKS.tiktok, label: 'Follow on TikTok' },
              { Icon: InstagramIcon, href: SOCIAL_LINKS.instagram, label: 'Follow on Instagram' },
              { Icon: YouTubeIcon, href: SOCIAL_LINKS.youtube, label: 'Subscribe on YouTube' },
            ].map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 text-white/60 hover:border-white/40 hover:text-white transition-all text-[10px] font-mono uppercase tracking-wider">
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{label.split(' on ')[1] || label.split(' ')[2]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Sidebar Widget
export function SocialSidebarWidget() {
  return (
    <div className="bg-black text-white rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Play className="h-5 w-5 text-[#6111ff]" />
        <h3 className="font-bold text-sm uppercase tracking-wider">Watch & Follow</h3>
      </div>
      
      <p className="text-xs text-white/70 mb-4">
        Get news in 60 seconds on your favorite platform
      </p>
      
      <div className="space-y-2">
        <a 
          href={SOCIAL_LINKS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
            <YouTubeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">YouTube Shorts</div>
            <div className="text-[10px] text-white/50">@LatamReportero</div>
          </div>
        </a>
        
        <a 
          href={SOCIAL_LINKS.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-black border border-white/20 flex items-center justify-center">
            <TikTokIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">TikTok</div>
            <div className="text-[10px] text-white/50">@latamreportero</div>
          </div>
        </a>
        
        <a 
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
            <InstagramIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">Instagram Reels</div>
            <div className="text-[10px] text-white/50">@latamreportero</div>
          </div>
        </a>
      </div>
    </div>
  );
}

// Follow CTA Banner - Can be used between sections
export function FollowBanner() {
  return (
    <div className="bg-gradient-to-r from-[#6111ff] to-[#600fff] text-white py-4">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Play className="h-6 w-6" />
          <div>
            <p className="font-medium">Get news in 60 seconds</p>
            <p className="text-xs text-white/70">Follow us on your favorite platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <a 
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <YouTubeIcon className="h-4 w-4" />
            YouTube
          </a>
          <a 
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <TikTokIcon className="h-4 w-4" />
            TikTok
          </a>
          <a 
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}

export { InstagramIcon, TikTokIcon, YouTubeIcon, LinkedInIcon };
