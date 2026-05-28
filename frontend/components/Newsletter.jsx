'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Newsletter signup component with multiple variants
 */
export default function Newsletter({ variant = 'default', className = '' }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call - replace with actual newsletter service integration
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Inline variant for article pages
  if (variant === 'inline') {
    return (
      <div className={`border border-border rounded-lg p-6 ${className}`} data-testid="newsletter-inline">
        {isSubscribed ? (
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Thanks for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-semibold">Get stories like this in your inbox</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
                data-testid="newsletter-email-inline"
              />
              <Button type="submit" disabled={isLoading} data-testid="newsletter-submit-inline">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Weekly journalism. No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    );
  }

  // Footer variant - compact
  if (variant === 'footer') {
    return (
      <div className={className} data-testid="newsletter-footer">
        {isSubscribed ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="max-w-[200px]"
              data-testid="newsletter-email-footer"
            />
            <Button type="submit" size="sm" disabled={isLoading} data-testid="newsletter-submit-footer">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        )}
      </div>
    );
  }

  // Hero variant - large, prominent
  if (variant === 'hero') {
    return (
      <div className={`bg-[#1a1a1a] text-white ${className}`} data-testid="newsletter-hero">
        <div className="max-w-2xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6111ff] text-white text-[10px] font-mono uppercase tracking-[0.15em] mb-6">
            <Mail className="h-3 w-3" />
            Always Free · No Paywall
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-3 leading-tight" >
            Latin America in your inbox,<br />every morning.
          </h2>
          <p className="text-base mb-8 text-white/65 leading-relaxed" style={{ fontFamily: 'Source Serif 4, serif' }}>
            The Morning Brief + weekly Press Review. Weekday mornings.
            No account required. Cancel anytime.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-3 text-base">
              <CheckCircle className="h-5 w-5 text-[#6111ff]" />
              <span>You&apos;re in. First brief arrives tomorrow morning.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-11 rounded-none focus-visible:ring-0 focus-visible:border-white/50"
                data-testid="newsletter-email-hero"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="whitespace-nowrap h-11 rounded-none bg-[#6111ff] hover:bg-[#4a0dd6] text-white text-[11px] font-mono uppercase tracking-wider px-6"
                data-testid="newsletter-submit-hero"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Get it free <ArrowRight className="ml-1.5 h-4 w-4" /></>
                )}
              </Button>
            </form>
          )}

          <p className="text-[11px] mt-4 text-white/35 font-mono uppercase tracking-wider">
            Read by editors, founders & analysts across LATAM
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-[#E7DAC4]/30 rounded-lg p-8 ${className}`} data-testid="newsletter-default">
      <div className="max-w-xl mx-auto text-center">
        <Mail className="h-10 w-10 mx-auto mb-4 text-[#8c52ff]" />
        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
          Subscribe to our newsletter
        </h3>
        <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Source Serif 4, serif' }}>
          Latin America, explained. Free in your inbox every weekday morning.
        </p>
        
        {isSubscribed ? (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Successfully subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-12 border-[#8c52ff]/30 focus:border-[#8c52ff]"
              data-testid="newsletter-email-default"
            />
            <Button 
              type="submit" 
              size="lg"
              disabled={isLoading}
              className="h-12 bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white hover:shadow-lg hover:shadow-[#8c52ff]/30 transition-all"
              data-testid="newsletter-submit-default"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
