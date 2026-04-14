'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation, useUserRole } from '@/lib/providers';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import ContentModeToggle from '@/components/ContentModeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, User, LogOut, Bookmark, 
  ChevronDown, MapPin, FileText, TrendingUp, Sparkles, Radio,
  Search, X, Loader2, Mic, MicOff, ArrowRight
} from 'lucide-react';

const REGIONS = {
  'South America': [
    { name: 'Argentina', slug: 'argentina' },
    { name: 'Bolivia', slug: 'bolivia' },
    { name: 'Brazil', slug: 'brazil' },
    { name: 'Chile', slug: 'chile' },
    { name: 'Colombia', slug: 'colombia' },
    { name: 'Ecuador', slug: 'ecuador' },
    { name: 'Paraguay', slug: 'paraguay' },
    { name: 'Peru', slug: 'peru' },
    { name: 'Uruguay', slug: 'uruguay' },
    { name: 'Venezuela', slug: 'venezuela' },
  ],
  'Central America': [
    { name: 'Costa Rica', slug: 'costa-rica' },
    { name: 'El Salvador', slug: 'el-salvador' },
    { name: 'Guatemala', slug: 'guatemala' },
    { name: 'Honduras', slug: 'honduras' },
    { name: 'Nicaragua', slug: 'nicaragua' },
    { name: 'Panama', slug: 'panama' },
  ],
  'Mexico & Caribbean': [
    { name: 'Mexico', slug: 'mexico' },
    { name: 'Cuba', slug: 'cuba' },
    { name: 'Dominican Republic', slug: 'dominican-republic' },
    { name: 'Haiti', slug: 'haiti' },
    { name: 'Puerto Rico', slug: 'puerto-rico' },
  ],
};

const TOPICS = [
  { name: 'Investigations', slug: 'investigations', icon: FileText },
  { name: 'Analysis', slug: 'analysis', icon: TrendingUp },
  { name: 'Good News', slug: 'good-news', icon: Sparkles },
  { name: 'On the Ground', slug: 'on-the-ground', icon: Radio },
];

export default function Header() {
  const { t, locale } = useTranslation();
  const { user, role, logout, isSubscribed, token } = useUserRole();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target)) {
        setResults(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const placeholders = {
    en: "Ask AI: What solutions are addressing corruption in Venezuela?",
    es: "Pregunta a la IA: Que soluciones estan abordando la corrupcion?",
    pt: "Pergunte a IA: Quais solucoes estao abordando a corrupcao?"
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsProcessing(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const headers = { 'Content-Type': 'application/json' };
      // Pass auth token for subscription-aware search
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const resp = await fetch(`${baseUrl}/api/ai-search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query })
      });
      if (resp.ok) setResults(await resp.json());
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setResults(null);
  };

  // Whisper voice search
  const startVoiceInput = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return;
    try {
      setIsListening(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      mediaRecorder.onstop = async () => {
        setIsListening(false);
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
          const resp = await fetch(`${baseUrl}/api/transcribe`, { method: 'POST', body: formData });
          if (resp.ok) {
            const data = await resp.json();
            if (data.text) {
              setQuery(data.text);
              // Auto-search after transcription
              const searchResp = await fetch(`${baseUrl}/api/ai-search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: data.text })
              });
              if (searchResp.ok) setResults(await searchResp.json());
            }
          }
        } catch (err) {
          console.error('Voice error:', err);
        } finally {
          setIsProcessing(false);
        }
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setTimeout(() => { if (mediaRecorder.state === 'recording') mediaRecorder.stop(); }, 5000);
    } catch (err) {
      setIsListening(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full" data-testid="header">
      {/* Main Nav Bar */}
      <div className="bg-[#6110ff] text-white">
        <div className="container">
          <div className="flex h-11 items-center justify-between">
            <div className="flex items-center gap-5">
              <Link href="/" className="flex items-center gap-2 group" data-testid="logo-link">
                <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  LATAM <span className="text-[#600fff]">Reportero</span>
                </span>
              </Link>

              <nav className="hidden lg:flex items-center gap-0.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 text-white/80 hover:text-white hover:bg-white/10 rounded-none h-8 px-2.5 text-xs font-medium">
                      <MapPin className="h-3 w-3" />
                      Regions
                      <ChevronDown className="h-2.5 w-2.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[420px] p-4 rounded-none border-[#6110ff]/15" align="start">
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(REGIONS).map(([region, countries]) => (
                        <div key={region}>
                          <DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-wider text-[#666666] mb-1.5 px-0">
                            {region}
                          </DropdownMenuLabel>
                          {countries.map((country) => (
                            <DropdownMenuItem key={country.slug} asChild>
                              <Link href={`/region/${country.slug}`} className="text-xs text-[#6110ff] hover:text-[#600fff] cursor-pointer py-1">
                                {country.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/community">
                  <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-none h-8 px-2.5 text-xs font-medium">
                    Community
                  </Button>
                </Link>
                <Link href="/transparency">
                  <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-none h-8 px-2.5 text-xs font-medium">
                    Transparency
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="hidden sm:block">
                <ContentModeToggle isSubscribed={isSubscribed} userRole={role} />
              </div>
              <LanguageSelector />

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1 text-white/80 hover:text-white hover:bg-white/10 rounded-none h-8 px-2">
                      <User className="h-3.5 w-3.5" />
                      <span className="hidden md:inline text-xs max-w-[80px] truncate">
                        {user.name || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="h-2.5 w-2.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-none border-[#6110ff]/15">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-[#6110ff]">{user.name || user.email}</p>
                      <p className="text-[10px] text-[#666666] font-mono uppercase tracking-wider">{role}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/bookmarks" className="cursor-pointer text-xs">
                        <Bookmark className="mr-2 h-3.5 w-3.5" />
                        Saved Stories
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-[#600fff] text-xs">
                      <LogOut className="mr-2 h-3.5 w-3.5" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-none h-8 px-2.5 text-xs" data-testid="login-btn">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm" className="bg-[#600fff] hover:bg-[#B84A30] text-white rounded-none h-8 px-3 text-xs font-medium" data-testid="signup-btn">
                      Subscribe
                    </Button>
                  </Link>
                </div>
              )}

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 rounded-none h-8 w-8">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-[#F7F5F2] p-0">
                  <div className="p-4 bg-[#6110ff]">
                    <span className="text-lg font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      LATAM <span className="text-[#600fff]">Reportero</span>
                    </span>
                  </div>
                  <nav className="p-4 space-y-1">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#666666] mb-2 px-2">Navigation</p>
                    {[
                      { href: '/', label: 'Home' },
                      { href: '/community', label: 'Community' },
                      { href: '/transparency', label: 'Transparency' },
                      { href: '/pricing', label: 'Pricing' },
                    ].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                        className="block px-2 py-2 text-sm text-[#6110ff] hover:bg-[#6110ff]/5">
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="p-4 border-t border-[#6110ff]/10">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#666666] mb-2">Topics</p>
                    <div className="grid grid-cols-2 gap-1">
                      {TOPICS.map((topic) => (
                        <Link key={topic.slug} href={`/topic/${topic.slug}`} onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-1.5 p-2 text-xs text-[#6110ff] hover:bg-[#6110ff]/5">
                          <topic.icon className="h-3 w-3 text-[#600fff]" />
                          {topic.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  {!user && (
                    <div className="p-4 border-t border-[#6110ff]/10 space-y-2">
                      <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full rounded-none border-[#6110ff]/20 text-sm">Log In</Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full rounded-none bg-[#600fff] text-sm">Subscribe</Button>
                      </Link>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Always-visible AI Search Bar — thin strip */}
      <div className="bg-[#1A0B2E] border-b border-white/5" data-testid="global-search-bar">
        <div className="container">
          <div className="flex items-center h-8 gap-2">
            <Search className="h-3 w-3 text-[#600fff] flex-shrink-0" />
            <span className="text-[9px] font-mono uppercase tracking-wider text-white/30 hidden sm:inline flex-shrink-0">AI</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[locale] || placeholders.en}
              className="flex-1 bg-transparent text-white/90 text-xs placeholder:text-white/25 focus:outline-none"
              style={{ fontFamily: 'Inter, sans-serif' }}
              data-testid="global-search-input"
            />
            {isProcessing && <Loader2 className="h-3 w-3 text-[#600fff] animate-spin" />}
            {query && !isProcessing && (
              <button onClick={() => { setQuery(''); setResults(null); }} className="text-white/30 hover:text-white">
                <X className="h-3 w-3" />
              </button>
            )}
            {/* Whisper Voice Button */}
            <button
              onClick={isListening ? () => setIsListening(false) : startVoiceInput}
              disabled={isProcessing}
              className={`p-1 rounded-sm transition-colors ${
                isListening ? 'bg-[#600fff] text-white' : 'text-white/30 hover:text-white/60 hover:bg-white/5'
              }`}
              title="Voice search (Whisper)"
              data-testid="voice-search-btn"
            >
              {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
            </button>
            <button
              onClick={handleSearch}
              disabled={!query.trim() || isProcessing}
              className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-white/40 hover:text-white disabled:opacity-30 transition-colors"
              data-testid="search-submit-btn"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {results && (
          <div ref={resultsRef} className="bg-white border-b border-[#6110ff]/10 shadow-lg">
            <div className="container py-4">
              {results.articles?.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-[#666666] leading-relaxed">{results.answer}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {results.articles.slice(0, 3).map((article) => (
                      <Link key={article.id || article.slug} href={`/article/${article.slug}`}
                        onClick={() => setResults(null)}
                        className="flex items-start gap-3 p-3 hover:bg-[#6110ff]/5 transition-colors group border border-[#6110ff]/5">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-mono uppercase text-[#600fff] mb-1">{article.category}</p>
                          <h4 className="text-sm font-medium text-[#6110ff] line-clamp-2 group-hover:text-[#600fff]">{article.title}</h4>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-[#6110ff]/20 group-hover:text-[#600fff] flex-shrink-0 mt-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#666666]">No results found for &ldquo;{query}&rdquo;</p>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
