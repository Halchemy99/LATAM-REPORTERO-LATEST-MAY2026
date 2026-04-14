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

// Slim Social Bar - Goes at top of page
export function SocialBar() {
  return (
    <div className="bg-black text-white py-1.5">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs">
          <Play className="h-3 w-3 text-[#6110ff]" />
          <span className="text-white/70">Watch the latest:</span>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={SOCIAL_LINKS.youtube} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:text-[#6110ff] transition-colors"
          >
            <YouTubeIcon className="h-4 w-4" />
            <span className="hidden sm:inline">YouTube</span>
          </a>
          <a 
            href={SOCIAL_LINKS.tiktok} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:text-[#6110ff] transition-colors"
          >
            <TikTokIcon className="h-4 w-4" />
            <span className="hidden sm:inline">TikTok</span>
          </a>
          <a 
            href={SOCIAL_LINKS.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:text-[#6110ff] transition-colors"
          >
            <InstagramIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Instagram</span>
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
          <div className="w-full h-full bg-gradient-to-br from-[#6110ff] to-[#600fff] flex items-center justify-center">
            <PlatformIcon className="h-12 w-12 text-white/50" />
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="h-6 w-6 text-[#6110ff] ml-1" />
          </div>
        </div>
        
        {/* Platform badge */}
        <div className={`absolute top-2 left-2 ${platformColors[platform]} text-white px-2 py-0.5 rounded text-[10px] font-medium uppercase flex items-center gap-1`}>
          <PlatformIcon className="h-3 w-3" />
          {platform === 'youtube' ? 'Shorts' : platform === 'tiktok' ? 'TikTok' : 'Reels'}
        </div>
      </div>
      
      <div className="mt-2">
        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-[#6110ff] transition-colors">
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

// Video Highlights Section - For homepage
export function VideoHighlightsSection() {
  // Sample video data - in production, fetch from YouTube/TikTok APIs
  const videos = [
    {
      platform: 'youtube',
      title: 'Breaking: Major climate agreement reached in Brazil',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.youtube,
      views: '12K',
      date: '2 days ago'
    },
    {
      platform: 'tiktok',
      title: 'What you need to know about Mexico\'s new policy',
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.tiktok,
      views: '45K',
      date: '1 day ago'
    },
    {
      platform: 'instagram',
      title: 'Inside the Amazon: Solutions for deforestation',
      thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.instagram,
      views: '8.5K',
      date: '3 days ago'
    },
    {
      platform: 'youtube',
      title: 'Argentina economy explained in 60 seconds',
      thumbnail: 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=400&h=700&fit=crop',
      videoUrl: SOCIAL_LINKS.youtube,
      views: '23K',
      date: '5 days ago'
    },
  ];

  return (
    <section className="py-8 border-t border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[#6110ff] flex items-center justify-center">
                <Play className="h-4 w-4 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Watch Now
              </h2>
              <p className="text-xs text-gray-500">Latest videos from our social channels</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <YouTubeIcon className="h-5 w-5 text-red-600" />
            </a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <TikTokIcon className="h-5 w-5" />
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <InstagramIcon className="h-5 w-5 text-pink-600" />
            </a>
            <Link href="/watch">
              <Button variant="outline" size="sm" className="ml-2 border-[#6110ff] text-[#6110ff] hover:bg-[#6110ff] hover:text-white">
                View All
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {videos.map((video, idx) => (
            <VideoCard key={idx} {...video} />
          ))}
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
        <Play className="h-5 w-5 text-[#6110ff]" />
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
    <div className="bg-gradient-to-r from-[#6110ff] to-[#600fff] text-white py-4">
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

export { InstagramIcon, TikTokIcon, YouTubeIcon };
