'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Headphones, Play, Pause, Loader2, RotateCcw, Volume2, VolumeX } from 'lucide-react';

function extractPlainText(body) {
  if (!body || !Array.isArray(body)) return '';
  return body
    .filter(block => block._type === 'block' && block.children)
    .map(block => block.children.map(child => child.text || '').join(''))
    .join('\n\n');
}

export default function ArticlePodcastPlayer({ article }) {
  const [status, setStatus] = useState('idle'); // idle | loading | playing | paused | error
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  const generateAudio = async () => {
    if (status === 'playing' && audioRef.current) {
      audioRef.current.pause();
      setStatus('paused');
      return;
    }
    if (status === 'paused' && audioRef.current) {
      audioRef.current.play();
      setStatus('playing');
      return;
    }

    setStatus('loading');
    try {
      const text = article.standfirst
        ? `${article.title}. ${article.standfirst}. ${extractPlainText(article.body)}`
        : `${article.title}. ${extractPlainText(article.body)}`;

      const resp = await fetch(`${API_URL}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 12000) })
      });

      if (!resp.ok) throw new Error('TTS failed');

      const data = await resp.json();
      const audioBytes = Uint8Array.from(atob(data.audio_base64), c => c.charCodeAt(0));
      const blob = new Blob([audioBytes], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
      audio.addEventListener('ended', () => {
        setStatus('idle');
        setProgress(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
      });

      await audio.play();
      setStatus('playing');

      intervalRef.current = setInterval(() => {
        if (audio.currentTime && audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 200);
    } catch (err) {
      console.error('TTS error:', err);
      setStatus('error');
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setStatus('playing');
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setMuted(!muted);
    }
  };

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentTime = audioRef.current?.currentTime || 0;

  return (
    <div className="bg-[#23103A] p-4 mb-6" data-testid="podcast-player">
      <div className="flex items-center gap-3">
        <Headphones className="h-4 w-4 text-[#D35A3D] flex-shrink-0" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">Listen to this article</span>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={generateAudio}
          disabled={status === 'loading'}
          className="h-9 w-9 rounded-full bg-[#D35A3D] hover:bg-[#B84A30] text-white flex-shrink-0"
          data-testid="podcast-play-btn"
        >
          {status === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : status === 'playing' ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          {/* Progress bar */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              if (audioRef.current && duration) {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                audioRef.current.currentTime = pct * duration;
                setProgress(pct * 100);
              }
            }}
          >
            <div className="h-full bg-[#D35A3D] transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-white/40 font-mono">{formatTime(currentTime)}</span>
            <span className="text-[10px] text-white/40 font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {(status === 'playing' || status === 'paused') && (
          <>
            <button onClick={restart} className="text-white/40 hover:text-white" title="Restart">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button onClick={toggleMute} className="text-white/40 hover:text-white" title={muted ? 'Unmute' : 'Mute'}>
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
          </>
        )}
      </div>

      {status === 'loading' && (
        <p className="text-[10px] text-white/30 mt-2 font-mono">Generating audio with AI... this may take a moment</p>
      )}
      {status === 'error' && (
        <p className="text-[10px] text-[#D35A3D] mt-2 font-mono">Audio generation failed. Try again later.</p>
      )}
    </div>
  );
}
