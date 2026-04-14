'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SocialBar, VideoCard, SOCIAL_LINKS, InstagramIcon, TikTokIcon, YouTubeIcon } from '@/components/SocialVideo';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, ExternalLink, Users, Eye, Video } from 'lucide-react';

export default function WatchPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Sample video data - in production, fetch from APIs
  const allVideos = [
    // YouTube
    { platform: 'youtube', title: 'Breaking: Climate summit reaches historic agreement', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.youtube, views: '45K', date: '1 day ago' },
    { platform: 'youtube', title: 'Mexico\'s renewable energy revolution explained', thumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.youtube, views: '32K', date: '2 days ago' },
    { platform: 'youtube', title: 'Interview: Leading economist on Argentina\'s future', thumbnail: 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.youtube, views: '28K', date: '3 days ago' },
    { platform: 'youtube', title: 'How Brazil is fighting deforestation', thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.youtube, views: '67K', date: '4 days ago' },
    // TikTok
    { platform: 'tiktok', title: 'Venezuela update: What\'s happening now', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.tiktok, views: '120K', date: '6 hours ago' },
    { platform: 'tiktok', title: 'Colombia peace process in 60 seconds', thumbnail: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.tiktok, views: '89K', date: '1 day ago' },
    { platform: 'tiktok', title: 'Why Chile is leading on lithium', thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.tiktok, views: '56K', date: '2 days ago' },
    { platform: 'tiktok', title: 'Peru election explained simply', thumbnail: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.tiktok, views: '78K', date: '3 days ago' },
    // Instagram
    { platform: 'instagram', title: 'Behind the scenes: Our newsroom', thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.instagram, views: '34K', date: '12 hours ago' },
    { platform: 'instagram', title: 'This week in LATAM: Top 5 stories', thumbnail: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.instagram, views: '42K', date: '1 day ago' },
    { platform: 'instagram', title: 'Solutions spotlight: Water in Mexico City', thumbnail: 'https://images.unsplash.com/photo-1568632234180-0e6c08735d01?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.instagram, views: '29K', date: '2 days ago' },
    { platform: 'instagram', title: 'Reporter diary: Amazon rainforest', thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=700&fit=crop', videoUrl: SOCIAL_LINKS.instagram, views: '51K', date: '4 days ago' },
  ];

  const filteredVideos = activeTab === 'all' 
    ? allVideos 
    : allVideos.filter(v => v.platform === activeTab);

  const stats = {
    youtube: { followers: '125K', label: 'Subscribers' },
    tiktok: { followers: '340K', label: 'Followers' },
    instagram: { followers: '89K', label: 'Followers' },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SocialBar />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#6110ff] via-[#600fff] to-purple-900 text-white py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm mb-6">
                <Play className="h-4 w-4" />
                Video Hub
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Watch LATAM Reportero
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Get the news in 60 seconds. Follow us on your favorite platform for daily updates on Latin America.
              </p>
              
              {/* Platform buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
                >
                  <YouTubeIcon className="h-6 w-6 text-red-600" />
                  <div className="text-left">
                    <div className="font-bold">YouTube</div>
                    <div className="text-xs text-gray-500">{stats.youtube.followers} {stats.youtube.label}</div>
                  </div>
                </a>
                <a 
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
                >
                  <TikTokIcon className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-bold">TikTok</div>
                    <div className="text-xs text-gray-500">{stats.tiktok.followers} {stats.tiktok.label}</div>
                  </div>
                </a>
                <a 
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
                >
                  <InstagramIcon className="h-6 w-6 text-pink-600" />
                  <div className="text-left">
                    <div className="font-bold">Instagram</div>
                    <div className="text-xs text-gray-500">{stats.instagram.followers} {stats.instagram.label}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid Section */}
        <div className="container py-12">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveTab('all')}
                className={activeTab === 'all' ? 'bg-[#6110ff] hover:bg-[#4a0dd6]' : ''}
              >
                <Video className="h-4 w-4 mr-2" />
                All Videos
              </Button>
              <Button
                variant={activeTab === 'youtube' ? 'default' : 'outline'}
                onClick={() => setActiveTab('youtube')}
                className={activeTab === 'youtube' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <YouTubeIcon className="h-4 w-4 mr-2" />
                Shorts
              </Button>
              <Button
                variant={activeTab === 'tiktok' ? 'default' : 'outline'}
                onClick={() => setActiveTab('tiktok')}
                className={activeTab === 'tiktok' ? 'bg-black hover:bg-gray-800' : ''}
              >
                <TikTokIcon className="h-4 w-4 mr-2" />
                TikTok
              </Button>
              <Button
                variant={activeTab === 'instagram' ? 'default' : 'outline'}
                onClick={() => setActiveTab('instagram')}
                className={activeTab === 'instagram' ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600' : ''}
              >
                <InstagramIcon className="h-4 w-4 mr-2" />
                Reels
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              {filteredVideos.length} videos
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredVideos.map((video, idx) => (
              <VideoCard key={idx} {...video} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">Want to see more?</p>
            <div className="flex justify-center gap-3">
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <YouTubeIcon className="h-4 w-4 text-red-600" />
                  Subscribe on YouTube
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <TikTokIcon className="h-4 w-4" />
                  Follow on TikTok
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-black text-white py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Never Miss an Update
              </h2>
              <p className="text-white/70 mb-8">
                Turn on notifications to get breaking news alerts and daily summaries delivered straight to your feed.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <YouTubeIcon className="h-5 w-5" />
                  Subscribe & Ring the Bell
                </a>
                <a 
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <TikTokIcon className="h-5 w-5" />
                  Follow + Turn On Alerts
                </a>
                <a 
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <InstagramIcon className="h-5 w-5" />
                  Follow + Add to Favorites
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
