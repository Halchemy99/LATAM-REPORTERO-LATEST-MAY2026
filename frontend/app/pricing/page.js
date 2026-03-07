'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, X, Sparkles, Crown, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function PricingPage() {
  const { t } = useTranslation();
  const { role, user } = useUserRole();
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: t('pricing.free'),
      description: t('pricing.freeDesc'),
      price: 0,
      period: '',
      icon: <Star className="h-6 w-6" />,
      features: [
        { text: t('pricing.features.aiContent'), included: true },
        { text: t('pricing.features.humanContent'), included: false },
        { text: t('pricing.features.communities'), included: false },
        { text: t('pricing.features.bookmark'), included: true },
        { text: t('pricing.features.trustScore'), included: false },
        { text: t('pricing.features.micropayments'), included: false },
        { text: t('pricing.features.earlyAccess'), included: false }
      ],
      buttonText: role === 'free' ? t('pricing.currentPlan') : 'Get Started',
      current: role === 'free',
      highlighted: false
    },
    {
      id: 'monthly',
      name: t('pricing.monthly'),
      description: t('pricing.monthlyDesc'),
      price: 1,
      period: t('pricing.perMonth'),
      icon: <Zap className="h-6 w-6" />,
      features: [
        { text: t('pricing.features.aiContent'), included: true },
        { text: t('pricing.features.humanContent'), included: true },
        { text: t('pricing.features.communities'), included: true },
        { text: t('pricing.features.bookmark'), included: true },
        { text: t('pricing.features.trustScore'), included: true },
        { text: t('pricing.features.micropayments'), included: true },
        { text: t('pricing.features.earlyAccess'), included: false }
      ],
      buttonText: ['paid', 'contributor', 'editor', 'admin'].includes(role) ? t('pricing.currentPlan') : t('pricing.upgrade'),
      current: ['paid', 'contributor', 'editor', 'admin'].includes(role),
      highlighted: false
    },
    {
      id: 'annual',
      name: t('pricing.annual'),
      description: t('pricing.annualDesc'),
      price: 10,
      period: t('pricing.perYear'),
      icon: <Crown className="h-6 w-6" />,
      features: [
        { text: t('pricing.features.aiContent'), included: true },
        { text: t('pricing.features.humanContent'), included: true },
        { text: t('pricing.features.communities'), included: true },
        { text: t('pricing.features.bookmark'), included: true },
        { text: t('pricing.features.trustScore'), included: true },
        { text: t('pricing.features.micropayments'), included: true },
        { text: t('pricing.features.earlyAccess'), included: true }
      ],
      buttonText: t('pricing.upgrade'),
      current: false,
      highlighted: true,
      savings: 'Save 17%'
    },
    {
      id: 'lifetime',
      name: t('pricing.lifetime'),
      description: t('pricing.lifetimeDesc'),
      price: 100,
      period: t('pricing.oneTime'),
      icon: <Sparkles className="h-6 w-6" />,
      features: [
        { text: t('pricing.features.aiContent'), included: true },
        { text: t('pricing.features.humanContent'), included: true },
        { text: t('pricing.features.communities'), included: true },
        { text: t('pricing.features.bookmark'), included: true },
        { text: t('pricing.features.trustScore'), included: true },
        { text: t('pricing.features.micropayments'), included: true },
        { text: t('pricing.features.earlyAccess'), included: true }
      ],
      buttonText: t('pricing.upgrade'),
      current: false,
      highlighted: false
    }
  ];

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers through Stripe.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.'
    },
    {
      question: 'What is the difference between AI and Human content?',
      answer: 'AI-verified content is automatically generated and fact-checked using our AI systems. Human-written content is created by our verified journalists and goes through our editorial process.'
    },
    {
      question: 'How do micropayments work?',
      answer: '85% of your micropayment goes directly to the journalist. You can tip any amount starting from $1.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'We offer a 30-day money-back guarantee for annual and lifetime plans. Monthly subscriptions can be cancelled anytime.'
    }
  ];

  const handleSubscribe = (planId) => {
    if (planId === 'free') {
      toast.info('You can use free features without signing up!');
      return;
    }
    toast.success(`Demo: Redirecting to Stripe checkout for ${planId} plan...`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('pricing.title')}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.highlighted ? 'border-primary shadow-lg scale-105' : ''} ${plan.current ? 'border-green-500' : ''}`}
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
                  <CardHeader className="text-center pb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">£{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    <ul className="space-y-3 text-sm text-left">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-muted-foreground'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.highlighted ? 'default' : plan.current ? 'outline' : 'secondary'}
                      disabled={plan.current}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-muted/30">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
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
      </main>

      <Footer />
    </div>
  );
}
