'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Sparkles, Crown, Star, Zap, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PricingPage() {
  const { t } = useTranslation();
  const { role, user } = useUserRole();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  // Check for payment status from URL params
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const status = searchParams.get('status');

    if (sessionId && status === 'success') {
      setCheckingPayment(true);
      pollPaymentStatus(sessionId);
    } else if (status === 'cancelled') {
      toast.info('Payment was cancelled');
    }
  }, [searchParams]);

  // Poll payment status
  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setCheckingPayment(false);
      toast.info('Payment status check timed out. Please check your email for confirmation.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? '' : ''}/api/payments/status/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      const data = await response.json();

      if (data.payment_status === 'paid') {
        setCheckingPayment(false);
        toast.success('Payment successful! Thank you for subscribing.');
        // Clean up URL
        window.history.replaceState({}, '', '/pricing');
        return;
      } else if (data.status === 'expired') {
        setCheckingPayment(false);
        toast.error('Payment session expired. Please try again.');
        return;
      }

      // Continue polling
      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setCheckingPayment(false);
      toast.error('Error checking payment status');
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Access to AI-verified news content',
      price: 0,
      period: '',
      icon: <Star className="h-6 w-6" />,
      features: [
        { text: 'AI-verified news articles', included: true },
        { text: 'Human-written journalism', included: false },
        { text: 'Community access', included: false },
        { text: 'Bookmark articles', included: true },
        { text: 'Contributor reputation view', included: false },
        { text: 'Support journalists directly', included: false },
        { text: 'Early access to features', included: false }
      ],
      buttonText: role === 'free' ? 'Current Plan' : 'Get Started',
      current: role === 'free',
      highlighted: false
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Full access to all content',
      price: 9.99,
      period: '/month',
      icon: <Zap className="h-6 w-6" />,
      features: [
        { text: 'AI-verified news articles', included: true },
        { text: 'Human-written journalism', included: true },
        { text: 'Community access', included: true },
        { text: 'Bookmark articles', included: true },
        { text: 'Contributor reputation view', included: true },
        { text: 'Support journalists directly', included: true },
        { text: 'Early access to features', included: false }
      ],
      buttonText: ['paid', 'contributor', 'editor', 'admin'].includes(role) ? 'Current Plan' : 'Subscribe',
      current: ['paid', 'contributor', 'editor', 'admin'].includes(role),
      highlighted: false
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Premium access with exclusive content',
      price: 19.99,
      period: '/month',
      icon: <Crown className="h-6 w-6" />,
      features: [
        { text: 'AI-verified news articles', included: true },
        { text: 'Human-written journalism', included: true },
        { text: 'Community access', included: true },
        { text: 'Bookmark articles', included: true },
        { text: 'Contributor reputation view', included: true },
        { text: 'Support journalists directly', included: true },
        { text: 'Early access to features', included: true }
      ],
      buttonText: 'Subscribe',
      current: false,
      highlighted: true,
      badge: 'Most Popular'
    }
  ];

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) through Stripe, our secure payment processor.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.'
    },
    {
      question: 'What is the difference between AI and Human content?',
      answer: 'AI-verified content is aggregated and fact-checked using our verification systems. Human-written content is created by our verified journalists and goes through our editorial review process.'
    },
    {
      question: 'How do I support journalists directly?',
      answer: 'Paid members can send micropayments to journalists. 85% goes directly to the contributor, supporting independent journalism.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.'
    },
    {
      question: 'How do I contact support?',
      answer: 'Email us at contact@latamreportero.com or reach out via our social media channels.'
    }
  ];

  const handleSubscribe = async (planId) => {
    if (planId === 'free') {
      toast.info('Free access is available without signing up!');
      return;
    }

    if (!user) {
      toast.info('Please sign in to subscribe');
      window.location.href = '/auth/login?redirect=/pricing';
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: planId,
          origin_url: window.location.origin
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create checkout session');
      }

      const data = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = data.checkout_url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Payment Processing Overlay */}
        {checkingPayment && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-96 text-center p-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
              <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
            </Card>
          </div>
        )}

        {/* Hero */}
        <section className="py-16 bg-foreground text-background">
          <div className="container text-center">
            <Badge variant="outline" className="mb-4 border-background/30 text-background/80">
              Support Independent Journalism
            </Badge>
            <h1 className="headline-hero mb-6">
              Membership Plans
            </h1>
            <p className="text-xl opacity-80 max-w-2xl mx-auto">
              Your subscription directly supports journalists across Latin America. 
              Choose the plan that works for you.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative editorial-card ${plan.highlighted ? 'border-2 border-primary shadow-lg' : ''} ${plan.current ? 'border-green-600' : ''}`}
                  data-testid={`plan-${plan.id}`}
                >
                  {plan.badge && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      {plan.badge}
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <span className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                        ${plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground text-sm"> USD{plan.period}</span>
                      )}
                    </div>
                    <ul className="space-y-3 text-sm text-left">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-muted-foreground/50'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${plan.highlighted ? 'bg-primary' : ''}`}
                      variant={plan.highlighted ? 'default' : plan.current ? 'outline' : 'secondary'}
                      disabled={plan.current || isProcessing}
                      onClick={() => handleSubscribe(plan.id)}
                      data-testid={`subscribe-${plan.id}`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {plan.current && <Check className="h-4 w-4 mr-2" />}
                          {plan.buttonText}
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Stripe Integration Note */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4" />
                Secure payments powered by Stripe
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-muted/30">
          <div className="container max-w-3xl">
            <h2 className="headline-section text-center mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter variant="default" className="container py-12" />
      </main>

      <Footer />
    </div>
  );
}
