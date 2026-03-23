'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X, 
  Sparkles, 
  Loader2, 
  ArrowRight,
  Clock,
  MessageCircle,
  Send
} from 'lucide-react';

export default function AISearchBar({ locale = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const placeholders = {
    en: "Ask AI to find articles... e.g., 'water solutions in cities'",
    es: "Pregunta a la IA... ej., 'soluciones de agua en ciudades'",
    pt: "Pergunte à IA... ex., 'soluções de água em cidades'"
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    
    // Add user message to conversation
    const userMessage = { role: 'user', content: searchQuery };
    setConversation(prev => [...prev, userMessage]);
    setQuery('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/ai-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          session_id: sessionId,
          history: conversation
        })
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      
      // Add AI response to conversation
      const aiMessage = {
        role: 'assistant',
        content: data.answer,
        articles: data.articles
      };
      setConversation(prev => [...prev, aiMessage]);
      setSessionId(data.session_id);
      setSuggestions(data.follow_up_suggestions || []);

    } catch (error) {
      console.error('AI Search error:', error);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: locale === 'es' 
          ? 'Lo siento, hubo un error. Por favor intenta de nuevo.'
          : locale === 'pt'
          ? 'Desculpe, ocorreu um erro. Por favor tente novamente.'
          : 'Sorry, there was an error. Please try again.',
        articles: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const resetConversation = () => {
    setConversation([]);
    setSessionId(null);
    setSuggestions([]);
    setQuery('');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2 bg-gradient-to-r from-[#8c52ff]/10 to-[#6111ff]/10 border-[#8c52ff]/30 hover:border-[#8c52ff] hover:bg-[#8c52ff]/20 transition-all"
        data-testid="ai-search-trigger"
      >
        <Sparkles className="h-4 w-4 text-[#8c52ff]" />
        <span className="hidden sm:inline">
          {locale === 'es' ? 'Buscar con IA' : locale === 'pt' ? 'Buscar com IA' : 'AI Search'}
        </span>
        <Search className="h-4 w-4 sm:hidden" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl max-h-[80vh] bg-background rounded-2xl shadow-2xl border border-[#8c52ff]/20 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        data-testid="ai-search-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#8c52ff]/5 to-[#6111ff]/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gradient-to-r from-[#8c52ff] to-[#6111ff]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold" style={{ fontFamily: 'Raleway, sans-serif' }}>
                {locale === 'es' ? 'Búsqueda Inteligente' : locale === 'pt' ? 'Busca Inteligente' : 'AI Search'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {locale === 'es' ? 'Encuentra artículos con lenguaje natural' : locale === 'pt' ? 'Encontre artigos com linguagem natural' : 'Find articles using natural language'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {conversation.length > 0 && (
              <Button variant="ghost" size="sm" onClick={resetConversation}>
                {locale === 'es' ? 'Nueva búsqueda' : locale === 'pt' ? 'Nova busca' : 'New search'}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]">
          {conversation.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="mb-4">
                {locale === 'es' 
                  ? 'Pregúntame sobre cualquier tema para encontrar artículos relevantes'
                  : locale === 'pt'
                  ? 'Pergunte-me sobre qualquer tópico para encontrar artigos relevantes'
                  : 'Ask me about any topic to find relevant articles'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['environmental solutions', 'fintech in Argentina', 'education reform'].map((example) => (
                  <Badge 
                    key={example}
                    variant="outline"
                    className="cursor-pointer hover:bg-[#8c52ff]/10 hover:border-[#8c52ff]"
                    onClick={() => {
                      setQuery(example);
                      handleSearch(example);
                    }}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            conversation.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                  {msg.role === 'user' ? (
                    <div className="bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white px-4 py-2 rounded-2xl rounded-tr-md">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-md">
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      
                      {/* Article Results */}
                      {msg.articles && msg.articles.length > 0 && (
                        <div className="space-y-2">
                          {msg.articles.map((article) => (
                            <Link 
                              key={article.id} 
                              href={`/article/${article.slug}`}
                              onClick={() => setIsOpen(false)}
                            >
                              <Card className="hover:border-[#8c52ff]/50 transition-colors cursor-pointer">
                                <CardContent className="p-3 flex gap-3">
                                  {article.image && (
                                    <img 
                                      src={article.image} 
                                      alt={article.title}
                                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="text-xs">
                                        {article.category}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {article.read_time} min
                                      </span>
                                    </div>
                                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-[#8c52ff]">
                                      {article.title}
                                    </h4>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 self-center" />
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-md">
                <Loader2 className="h-5 w-5 animate-spin text-[#8c52ff]" />
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Follow-up Suggestions */}
        {suggestions.length > 0 && conversation.length > 0 && !loading && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <Badge 
                key={idx}
                variant="outline"
                className="cursor-pointer hover:bg-[#8c52ff]/10 hover:border-[#8c52ff] text-xs"
                onClick={() => handleSearch(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[locale] || placeholders.en}
              className="flex-1 bg-background"
              disabled={loading}
              data-testid="ai-search-input"
            />
            <Button 
              onClick={() => handleSearch()}
              disabled={!query.trim() || loading}
              className="bg-gradient-to-r from-[#8c52ff] to-[#6111ff] hover:from-[#9d6bff] hover:to-[#7a2fff]"
              data-testid="ai-search-submit"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
