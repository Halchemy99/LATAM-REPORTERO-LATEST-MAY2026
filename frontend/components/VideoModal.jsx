'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function VideoModal({ videoId, platform = 'youtube', embedUrl, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const src =
    embedUrl ||
    (platform === 'youtube'
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
      : null);

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-xs font-mono uppercase tracking-wider"
        >
          <X className="h-4 w-4" />
          Close
        </button>

        {/* Player */}
        {src ? (
          <div className="relative aspect-video bg-black">
            <iframe
              src={src}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="Video player"
            />
          </div>
        ) : (
          <div className="aspect-video bg-[#111] flex items-center justify-center text-white/40 text-sm">
            Video not available for embedding — opening on platform…
          </div>
        )}
      </div>
    </div>
  );
}
