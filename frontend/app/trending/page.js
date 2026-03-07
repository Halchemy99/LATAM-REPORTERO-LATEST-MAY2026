'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/providers';
import { mockTrendingTopics } from '@/lib/mock-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, Flame, Hash, ArrowUp, BarChart3 } from 'lucide-react';

export default function TrendingPage() {
  const { t } = useTranslation();
  const [region, setRegion] = useState('all');

  const regions = ['all', 'mexico', 'brazil', 'argentina', 'chile', 'colombia', 'peru', 'venezuela', 'ecuador'];

  const filteredTopics = mockTrendingTopics.filter(topic => {
    if (region !== 'all' && topic.region !== region && topic.region !== 'all') return false;
    return true;
  });

  // Sort by mention count
  const sortedTopics = [...filteredTopics].sort((a, b) => b.mentionCount - a.mentionCount);

  const categoryColors = {
    environment: 'bg-green-100 text-green-800',
    economy: 'bg-blue-100 text-blue-800',
    health: 'bg-red-100 text-red-800',
    education: 'bg-yellow-100 text-yellow-800',
    politics: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">{t('news.trending')}</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              AI-extracted trending topics from across Latin America. See what stories are making waves in each region.
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="py-6 border-b">
          <div className="container">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Filter by region:</span>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(reg => (
                    <SelectItem key={reg} value={reg}>
                      {reg === 'all' ? 'All Regions' : t(`regions.${reg}`) || reg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Trending Topics */}
        <section className="py-8">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Topics List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Top Topics
                </h2>
                {sortedTopics.map((topic, index) => (
                  <Card key={topic.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Hash className="h-4 w-4 text-primary" />
                            <span className="font-semibold">{topic.topic}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {t(`regions.${topic.region}`) || topic.region}
                            </Badge>
                            {topic.category && (
                              <Badge className={`text-xs ${categoryColors[topic.category] || ''}`}>
                                {t(`categories.${topic.category}`) || topic.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-green-600">
                            <ArrowUp className="h-4 w-4" />
                            <span className="font-semibold">{topic.mentionCount}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">mentions</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold flex items-center gap-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Topic Distribution
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(categoryColors).map(([cat, color]) => {
                        const count = sortedTopics.filter(t => t.category === cat).length;
                        const percentage = Math.round((count / sortedTopics.length) * 100) || 0;
                        return (
                          <div key={cat}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize">{t(`categories.${cat}`) || cat}</span>
                              <span>{percentage}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${color.replace('text-', 'bg-').replace('-800', '-500')}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">How We Track Trends</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our AI analyzes news sources, social media, and community discussions across Latin America to identify emerging topics and patterns.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Real-time analysis of 500+ regional sources</li>
                      <li>• Updated every 15 minutes</li>
                      <li>• Sentiment and impact scoring</li>
                      <li>• Cross-reference with verified news</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
