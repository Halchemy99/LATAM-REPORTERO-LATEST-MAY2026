'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PollWidget from '@/components/PollWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Plus, TrendingUp, Clock } from 'lucide-react';

// Mock polls for demo
const mockPolls = [
  {
    id: '1',
    title: 'What is the most pressing environmental issue in Latin America?',
    description: 'Help us understand community priorities',
    options: ['Deforestation', 'Water scarcity', 'Air pollution', 'Plastic waste'],
    category: 'environment',
    region: 'regional',
    created_at: '2026-03-01',
    ends_at: '2026-04-01'
  },
  {
    id: '2',
    title: 'Should governments invest more in renewable energy?',
    options: ['Yes, significantly more', 'Yes, moderately more', 'Current levels are fine', 'No, focus elsewhere'],
    category: 'economy',
    region: 'regional',
    created_at: '2026-03-05',
    ends_at: '2026-04-05'
  },
  {
    id: '3',
    title: 'How do you primarily get your news?',
    options: ['Social media', 'News websites', 'TV/Radio', 'Newspapers', 'Word of mouth'],
    category: 'technology',
    region: 'regional',
    created_at: '2026-03-06',
    ends_at: '2026-04-06'
  }
];

export default function PollsPage() {
  const { t } = useTranslation();
  const { user, role } = useUserRole();
  const [polls, setPolls] = useState(mockPolls);
  const [activeTab, setActiveTab] = useState('active');

  const canCreatePoll = role === 'admin' || role === 'editor';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Community Polls</h1>
                <p className="text-muted-foreground">Share your voice on important topics</p>
              </div>
            </div>
            {canCreatePoll && (
              <Link href="/polls/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Poll
                </Button>
              </Link>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Active Polls
              </TabsTrigger>
              <TabsTrigger value="ended" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Ended
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="grid md:grid-cols-2 gap-6">
                {polls.map((poll) => (
                  <Link href={`/polls/${poll.id}`} key={poll.id}>
                    <PollWidget poll={poll} />
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ended">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No ended polls yet</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
