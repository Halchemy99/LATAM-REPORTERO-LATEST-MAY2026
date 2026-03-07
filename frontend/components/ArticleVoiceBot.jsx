'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Loader2, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

export default function ArticleVoiceBot({ article }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Add initial greeting when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'greeting',
        role: 'assistant',
        content: `Hi! I'm your Article Assistant. I've read this article about "${article?.title || 'this topic'}". Ask me anything about the content, and I'll help you understand it better!`
      }]);
    }
  }, [isOpen, article?.title, messages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/voicebot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          article: {
            title: article?.title,
            excerpt: article?.excerpt,
            problem: article?.problem,
            solutions: article?.solutions,
            impact: article?.impact,
            category: article?.category,
            region: article?.region
          },
          history: messages.slice(-10) // Send last 10 messages for context
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: data.response
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
        data-testid="voicebot-toggle"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card 
      className={`fixed bottom-6 right-6 z-50 shadow-2xl transition-all duration-200 ${
        isMinimized ? 'w-[300px] h-auto' : 'w-[380px] h-[500px]'
      }`}
      data-testid="voicebot-container"
    >
      {/* Header */}
      <CardHeader className="p-3 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Article Assistant
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsMinimized(!isMinimized)}
              data-testid="voicebot-minimize"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
              data-testid="voicebot-close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(500px-52px)]">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                    data-testid={`voicebot-message-${message.role}`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this article..."
              disabled={isLoading}
              className="flex-1"
              data-testid="voicebot-input"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()}
              data-testid="voicebot-send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
