'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustScoreRating from '@/components/TrustScoreRating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  CheckCircle, 
  FileText, 
  Eye, 
  RefreshCw,
  MessageSquare
} from 'lucide-react';

export default function TrustScorePage() {
  const { t } = useTranslation();

  const factors = [
    {
      name: 'Accuracy',
      icon: <CheckCircle className="h-6 w-6" />,
      weight: 30,
      description: 'How often the journalist\'s claims are verified as accurate by fact-checkers and reader reports.',
      color: 'text-green-600'
    },
    {
      name: 'Sourcing',
      icon: <FileText className="h-6 w-6" />,
      weight: 25,
      description: 'Quality and variety of sources cited. Primary sources, official data, and expert interviews score higher.',
      color: 'text-blue-600'
    },
    {
      name: 'Transparency',
      icon: <Eye className="h-6 w-6" />,
      weight: 20,
      description: 'Disclosure of methodology, potential conflicts of interest, and limitations of reporting.',
      color: 'text-purple-600'
    },
    {
      name: 'Corrections',
      icon: <RefreshCw className="h-6 w-6" />,
      weight: 15,
      description: 'How quickly and thoroughly the journalist corrects errors when they occur.',
      color: 'text-orange-600'
    },
    {
      name: 'Engagement',
      icon: <MessageSquare className="h-6 w-6" />,
      weight: 10,
      description: 'Reader feedback, ratings, and community trust metrics.',
      color: 'text-cyan-600'
    }
  ];

  const exampleScores = [
    { score: 4.8, label: 'Excellent', description: 'Consistently accurate, well-sourced, transparent reporting' },
    { score: 4.0, label: 'Good', description: 'Reliable reporting with occasional minor issues' },
    { score: 3.0, label: 'Average', description: 'Mixed track record, some concerns about sourcing' },
    { score: 2.0, label: 'Below Average', description: 'Frequent issues with accuracy or sourcing' },
    { score: 1.0, label: 'Poor', description: 'Significant concerns, not recommended' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('article.trustScore')}</h1>
              <p className="text-xl text-muted-foreground">
                Our Trust Score system helps readers evaluate journalist credibility based on five key factors. Scores range from 0 to 5 stars.
              </p>
            </div>
          </div>
        </section>

        {/* Factors */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">How Trust Scores Are Calculated</h2>
            <div className="space-y-6">
              {factors.map((factor) => (
                <Card key={factor.name}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className={`${factor.color} flex-shrink-0`}>
                        {factor.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{factor.name}</h3>
                          <span className="text-sm text-muted-foreground">({factor.weight}% weight)</span>
                        </div>
                        <p className="text-muted-foreground">{factor.description}</p>
                      </div>
                      <div className="w-full md:w-48">
                        <Progress value={factor.weight} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Score Examples */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Score Interpretation</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {exampleScores.map((example) => (
                <Card key={example.score}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-3">
                      <TrustScoreRating score={example.score} showNumber={false} size="large" />
                    </div>
                    <p className="text-2xl font-bold mb-1">{example.score}</p>
                    <p className="font-medium text-sm mb-2">{example.label}</p>
                    <p className="text-xs text-muted-foreground">{example.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How to Rate */}
        <section className="py-12">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">How Premium Subscribers Can Rate</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Premium subscribers can contribute to Trust Scores by rating journalists after reading their articles. Your ratings help the community identify reliable reporting.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Read at least 3 articles from a journalist before rating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Rate based on the 5 factors above</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Your ratings are weighted by your own engagement history</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
