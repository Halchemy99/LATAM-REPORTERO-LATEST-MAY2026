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
      <div className={`newsletter-section text-center ${className}`} data-testid="newsletter-hero">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <Mail className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Stay Informed
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get solutions-oriented journalism delivered weekly. 
            Stories that matter for Latin America.
          </p>
          
          {isSubscribed ? (
            <div className="flex items-center justify-center gap-3 text-lg">
              <CheckCircle className="h-6 w-6" />
              <span>Thanks for subscribing! Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-inherit placeholder:text-inherit/60 h-12"
                data-testid="newsletter-email-hero"
              />
              <Button 
                type="submit" 
                variant="secondary" 
                size="lg"
                disabled={isLoading}
                className="whitespace-nowrap h-12"
                data-testid="newsletter-submit-hero"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}
          
          <p className="text-sm mt-4 opacity-70">
            Join 10,000+ readers. Unsubscribe anytime.
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-muted/50 rounded-lg p-8 ${className}`} data-testid="newsletter-default">
      <div className="max-w-xl mx-auto text-center">
        <Mail className="h-10 w-10 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          Subscribe to our newsletter
        </h3>
        <p className="text-muted-foreground mb-6">
          Get the latest solutions journalism from Latin America delivered to your inbox every week.
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
              className="flex-1 h-12"
              data-testid="newsletter-email-default"
            />
            <Button 
              type="submit" 
              size="lg"
              disabled={isLoading}
              className="h-12"
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
