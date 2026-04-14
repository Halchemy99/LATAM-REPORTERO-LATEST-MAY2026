'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Mic, MicOff, Search, X, ArrowRight } from 'lucide-react';

export default function GlobalSearchBar({ locale = 'en' }) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const router = useRouter();

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const placeholders = {
    en: "Search stories, regions, topics...",
    es: "Buscar historias, regiones, temas...",
    pt: "Pesquisar histórias, regiões, tópicos..."
  };

  // Voice recognition using OpenAI Whisper
  const startVoiceInput = async () => {
    setError('');
    
    // Check for microphone support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Voice input not supported in this browser');
      return;
    }

    try {
      setIsListening(true);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsListening(false);
        setIsProcessing(true);
        
        // Create audio blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Send to backend for Whisper transcription
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
          const response = await fetch(`${baseUrl}/api/transcribe`, {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.text) {
              setQuery(data.text);
              handleSearch(data.text);
            }
          } else {
            setError('Transcription failed');
          }
        } catch (err) {
          setError('Voice processing error');
        } finally {
          setIsProcessing(false);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Record for 5 seconds max
      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 5000);

    } catch (err) {
      setIsListening(false);
      setError('Microphone access denied');
    }
  };

  const stopVoiceInput = () => {
    setIsListening(false);
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    setIsProcessing(true);
    setShowResults(true);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/ai-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full bg-[#1a1a1a] border-b border-[#1a1a1a]" data-testid="global-search-bar">
      <div className="container">
        <div className="flex items-center h-10 gap-2">
          {/* Search Icon */}
          <Search className="h-3.5 w-3.5 text-white/50 flex-shrink-0" />
          
          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results && setShowResults(true)}
            placeholder={placeholders[locale] || placeholders.en}
            className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none font-sans"
            data-testid="global-search-input"
          />
          
          {/* Loading indicator */}
          {isProcessing && (
            <Loader2 className="h-3.5 w-3.5 text-white/50 animate-spin" />
          )}
          
          {/* Clear button */}
          {query && !isProcessing && (
            <button
              onClick={clearSearch}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          
          {/* Voice button */}
          <button
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            disabled={isProcessing}
            className={`p-1.5 rounded transition-colors ${
              isListening 
                ? 'bg-[#6110ff] text-white' 
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
            title="Voice search"
            data-testid="voice-search-btn"
          >
            {isListening ? (
              <MicOff className="h-3.5 w-3.5" />
            ) : (
              <Mic className="h-3.5 w-3.5" />
            )}
          </button>
          
          {/* Search button */}
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || isProcessing}
            className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white transition-colors disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </div>
      
      {/* Results dropdown */}
      {showResults && results && (
        <div 
          ref={resultsRef}
          className="absolute left-0 right-0 bg-white border-b border-[#1a1a1a]/15 shadow-lg z-50"
        >
          <div className="container py-4">
            {results.articles && results.articles.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-[#666666]">{results.answer}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {results.articles.slice(0, 3).map((article) => (
                    <a
                      key={article.id}
                      href={`/article/${article.slug}`}
                      onClick={() => setShowResults(false)}
                      className="flex items-start gap-3 p-3 hover:bg-[#1a1a1a]/5 transition-colors group"
                    >
                      {article.image && (
                        <img 
                          src={article.image} 
                          alt=""
                          className="w-16 h-12 object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono uppercase text-[#6110ff] mb-1">
                          {article.category}
                        </p>
                        <h4 className="text-sm font-medium text-[#1a1a1a] line-clamp-2 group-hover:text-[#6110ff]">
                          {article.title}
                        </h4>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#1a1a1a]/30 group-hover:text-[#6110ff] flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#666666]">No results found for "{query}"</p>
            )}
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="container">
          <p className="text-xs text-[#6110ff] py-1">{error}</p>
        </div>
      )}
    </div>
  );
}
