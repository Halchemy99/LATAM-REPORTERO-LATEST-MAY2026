'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SocialBar, SOCIAL_LINKS, InstagramIcon, TikTokIcon, YouTubeIcon } from '@/components/SocialVideo';
import VideoModal from '@/components/VideoModal';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink, Video, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/providers';

// TikTok / Instagram videos are added manually via the admin panel or this config.
// Format: { platform, title, videoUrl, thumbnailUrl }
const MANUAL_SOCIAL_VIDEOS = [];

function VideoCard({ platform, title, thumbnail, videoId, videoUrl, views, date, onClick }) {
  const PlatformIcon =
    platform === 'youtube' ? YouTubeIcon
    : platform === 'tiktok' ? TikTokIcon
    : InstagramIcon;

  const platformColors = {
    youtube: 'bg-red-600',
    tiktok: 'bg-black',
    instagram: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
  };

  const isPlayable = platform === 'youtube' && videoId;

  const handleClick = (e) => {
    if (isPlayable) {
      e.preventDefault();
      onClick?.({ platform, videoId, title });
    }
  };

  const Wrapper = isPlayable ? 'button' : 'a';
  const wrapperProps = isPlayable
    ? { onClick: handleClick, className: 'group block w-full text-left' }
    : { href: videoUrl, target: '_blank', rel: 'noopener noreferrer', className: 'group block' };

  return (
    <Wrapper {...wrapperProps}>
      <div className="relative aspect-[9/16] overflow-hidden bg-gray-100">
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
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 flex items-center justify-center bg-white/90">
            <Play className="h-6 w-6 text-[#6111ff] ml-1" />
          </div>
        </div>

        {/* Platform badge */}
        <div
          className={`absolute top-2 left-2 ${platformColors[platform]} text-white px-2 py-0.5 text-[10px] font-mono uppercase flex items-center gap-1`}
        >
          <PlatformIcon className="h-3 w-3" />
          {platform === 'youtube' ? 'YouTube' : platform === 'tiktok' ? 'TikTok' : 'Reels'}
        </div>

        {/* "Opens externally" badge for non-embeddable */}
        {!isPlayable && (
          <div className="absolute top-2 right-2 bg-black/50 text-white/70 px-1.5 py-0.5 text-[9px] font-mono uppercase flex items-center gap-0.5">
            <ExternalLink className="h-2.5 w-2.5" />
          </div>
        )}
      </div>

      <div className="mt-2">
        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-[#6111ff] transition-colors text-left">
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
    </Wrapper>
  );
}

export default function WatchPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [loadingYoutube, setLoadingYoutube] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // { platform, videoId, title }

  useEffect(() => {
    const fetchYoutube = async () => {
      try {
        const res = await fetch('/api/videos/youtube?maxResults=16');
        const data = await res.json();
        if (data.videos) setYoutubeVideos(data.videos);
      } catch {
        // silently fall back to empty
      } finally {
        setLoadingYoutube(false);
      }
    };
    fetchYoutube();
  }, []);

  // Merge YouTube + manual social videos
  const allVideos = [
    ...youtubeVideos.map((v) => ({
      platform: 'youtube',
      title: v.title,
      thumbnail: v.thumbnail,
      videoId: v.id,
      videoUrl: `https://www.youtube.com/watch?v=${v.id}`,
      date: new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })),
    ...MANUAL_SOCIAL_VIDEOS,
  ];

  const filteredVideos =
    activeTab === 'all' ? allVideos : allVideos.filter((v) => v.platform === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SocialBar />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#6111ff] via-[#600fff] to-purple-900 text-white py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm mb-6">
                <Play className="h-4 w-4" />
                {t('watch.title')}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('watch.title')} LATAM Reportero
              </h1>
              <p className="text-lg text-white/80 mb-8">
                {t('watch.subtitle')}
              </p>

              {/* Platform follow buttons */}
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
                    <div className="text-xs text-gray-500">Subscribe</div>
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
                    <div className="text-xs text-gray-500">Follow</div>
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
                    <div className="text-xs text-gray-500">Follow</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Video grid */}
        <div className="container py-12">
          {/* Filter tabs */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveTab('all')}
                className={activeTab === 'all' ? 'bg-[#6111ff] hover:bg-[#4a0dd6]' : ''}
              >
                <Video className="h-4 w-4 mr-2" />
                {t('watch.allVideos')}
              </Button>
              <Button
                variant={activeTab === 'youtube' ? 'default' : 'outline'}
                onClick={() => setActiveTab('youtube')}
                className={activeTab === 'youtube' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <YouTubeIcon className="h-4 w-4 mr-2" />
                YouTube
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
                Instagram
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              {filteredVideos.length} {t('videos')}
            </div>
          </div>

          {/* Loading state */}
          {loadingYoutube && activeTab !== 'tiktok' && activeTab !== 'instagram' && (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-sm font-mono">Loading videos…</span>
            </div>
          )}

          {/* Empty state for TikTok/Instagram */}
          {!loadingYoutube &&
            filteredVideos.length === 0 &&
            (activeTab === 'tiktok' || activeTab === 'instagram') && (
              <div className="text-center py-20">
                <div className="text-gray-400 mb-4">
                  {activeTab === 'tiktok' ? (
                    <TikTokIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  ) : (
                    <InstagramIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  )}
                </div>
                <p className="text-gray-500 mb-2">Follow us on {activeTab === 'tiktok' ? 'TikTok' : 'Instagram'}</p>
                <a
                  href={activeTab === 'tiktok' ? SOCIAL_LINKS.tiktok : SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#6111ff] hover:underline text-sm"
                >
                  {activeTab === 'tiktok' ? SOCIAL_LINKS.tiktok : SOCIAL_LINKS.instagram}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

          {/* Video grid */}
          {filteredVideos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredVideos.map((video, idx) => (
                <VideoCard
                  key={video.videoId || idx}
                  {...video}
                  onClick={setActiveModal}
                />
              ))}
            </div>
          )}

          {/* Follow CTAs */}
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">{t('Want to see more?')}</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <YouTubeIcon className="h-4 w-4 text-red-600" />
                  {t('Subscribe on YouTube')}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <TikTokIcon className="h-4 w-4" />
                  {t('Follow on TikTok')}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-black text-white py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">{t('Never Miss an Update')}</h2>
              <p className="text-white/70 mb-8">
                {t('Turn on notifications to get breaking news alerts and daily summaries delivered straight to your feed.')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <YouTubeIcon className="h-5 w-5" />
                  {t('Subscribe & Ring the Bell')}
                </a>
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <TikTokIcon className="h-5 w-5" />
                  {t('Follow + Turn On Alerts')}
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <InstagramIcon className="h-5 w-5" />
                  {t('Follow + Add to Favorites')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Video modal */}
      {activeModal && (
        <VideoModal
          platform={activeModal.platform}
          videoId={activeModal.videoId}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
