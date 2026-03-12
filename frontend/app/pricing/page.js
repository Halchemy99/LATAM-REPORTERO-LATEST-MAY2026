'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import CryptoDonation from '@/components/CryptoDonation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Sparkles, Crown, Star, Zap, Wallet, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

// Pricing in USD
const PRICES_USD = {
  monthly: 1,
  annual: 10,
  lifetime: 250
};

// Pricing in MXN (approximate conversion)
const PRICES_MXN = {
  monthly: 20,
  annual: 200,
  lifetime: 5000
};

export default function PricingPage() {
  const { t } = useTranslation();
  const { role, user } = useUserRole();
  const [currency, setCurrency] = useState('usd');

  const prices = currency === 'usd' ? PRICES_USD : PRICES_MXN;
  const currencySymbol = currency === 'usd' ? '$' : '$';
  const currencyLabel = currency === 'usd' ? 'USD' : 'MXN';

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
      id: 'monthly',
      name: 'Monthly',
      description: 'Full access, billed monthly',
      price: prices.monthly,
      period: '/month',
      icon: <Zap className="h-6 w-6" />,
      stripePrice: currency === 'usd' ? 'price_monthly_usd' : 'price_monthly_mxn',
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
      id: 'annual',
      name: 'Annual',
      description: 'Best value, billed yearly',
      price: prices.annual,
      period: '/year',
      icon: <Crown className="h-6 w-6" />,
      stripePrice: currency === 'usd' ? 'price_annual_usd' : 'price_annual_mxn',
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
      savings: currency === 'usd' ? 'Save 17%' : 'Ahorra 17%'
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      description: 'One-time payment, forever access',
      price: prices.lifetime,
      period: ' one-time',
      icon: <Sparkles className="h-6 w-6" />,
      stripePrice: currency === 'usd' ? 'price_lifetime_usd' : 'price_lifetime_mxn',
      features: [
        { text: 'AI-verified news articles', included: true },
        { text: 'Human-written journalism', included: true },
        { text: 'Community access', included: true },
        { text: 'Bookmark articles', included: true },
        { text: 'Contributor reputation view', included: true },
        { text: 'Support journalists directly', included: true },
        { text: 'Early access to features', included: true }
      ],
      buttonText: 'Purchase',
      current: false,
      highlighted: false,
      badge: 'Best for supporters'
    }
  ];

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) through Stripe. We also accept cryptocurrency donations (ETH, BTC, USDC, ADA) via MetaMask.'
    },
    {
      question: 'Can I pay in Mexican Pesos (MXN)?',
      answer: 'Yes! We support both USD and MXN payments. Switch currencies using the toggle above the pricing cards.'
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
      answer: 'We offer a 30-day money-back guarantee for annual and lifetime plans. Monthly subscriptions can be cancelled anytime.'
    },
    {
      question: 'Can I donate cryptocurrency?',
      answer: 'Yes! We accept ETH, BTC, USDC, and ADA donations through MetaMask. Click the "Donate Crypto" button to contribute.'
    }
  ];

  const handleSubscribe = async (planId, stripePrice) => {
    if (planId === 'free') {
      toast.info('Free access is available without signing up!');
      return;
    }

    if (!user) {
      toast.info('Please sign in to subscribe');
      window.location.href = '/auth/login?redirect=/pricing';
      return;
    }

    // TODO: Integrate with Stripe when keys are available
    // This will redirect to Stripe Checkout
    toast.info(`Stripe integration pending. Plan: ${planId}, Price ID: ${stripePrice}`);
    
    /* 
    // Stripe integration code - ready for when keys are available:
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: stripePrice,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`
        })
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to start checkout');
    }
    */
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
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

        {/* Currency Toggle */}
        <section className="py-8 border-b">
          <div className="container">
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-muted-foreground">Select currency:</span>
              <Tabs value={currency} onValueChange={setCurrency} className="w-auto">
                <TabsList>
                  <TabsTrigger value="usd" className="gap-2">
                    <span>🇺🇸</span> USD
                  </TabsTrigger>
                  <TabsTrigger value="mxn" className="gap-2">
                    <span>🇲🇽</span> MXN
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <CryptoDonation variant="button" />
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative editorial-card ${plan.highlighted ? 'border-2 border-primary shadow-lg' : ''} ${plan.current ? 'border-green-600' : ''}`}
                  data-testid={`plan-${plan.id}`}
                >
                  {plan.highlighted && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  {plan.savings && (
                    <Badge className="absolute -top-3 right-4 bg-green-600">
                      {plan.savings}
                    </Badge>
                  )}
                  {plan.badge && (
                    <Badge className="absolute -top-3 right-4 bg-amber-600">
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
                        {currencySymbol}{plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground text-sm"> {currencyLabel}{plan.period}</span>
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
                      disabled={plan.current}
                      onClick={() => handleSubscribe(plan.id, plan.stripePrice)}
                      data-testid={`subscribe-${plan.id}`}
                    >
                      {plan.current && <Check className="h-4 w-4 mr-2" />}
                      {plan.buttonText}
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
