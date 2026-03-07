'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PollWidget from '@/components/PollWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Share2, Flag, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

// Mock poll data
const mockPollsData = {
  '1': {
    id: '1',
    title: 'What is the most pressing environmental issue in Latin America?',
    description: 'Help us understand community priorities for environmental coverage. Your input shapes our reporting focus.',
    options: ['Deforestation', 'Water scarcity', 'Air pollution', 'Plastic waste'],
    category: 'environment',
    region: 'Regional',
    created_at: '2026-03-01',
    ends_at: '2026-04-01',
    created_by: 'LATAM Reportero Editorial Team'
  },
  '2': {
    id: '2',
    title: 'Should governments invest more in renewable energy?',
    description: 'Share your perspective on energy policy priorities.',
    options: ['Yes, significantly more', 'Yes, moderately more', 'Current levels are fine', 'No, focus elsewhere'],
    category: 'economy',
    region: 'Regional',
    created_at: '2026-03-05',
    ends_at: '2026-04-05',
    created_by: 'LATAM Reportero Editorial Team'
  },
  '3': {
    id: '3',
    title: 'How do you primarily get your news?',
    description: 'Help us understand media consumption habits in Latin America.',
    options: ['Social media', 'News websites', 'TV/Radio', 'Newspapers', 'Word of mouth'],
    category: 'technology',
    region: 'Regional',
    created_at: '2026-03-06',
    ends_at: '2026-04-06',
    created_by: 'LATAM Reportero Editorial Team'
  }
};

export default function PollDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const pollId = params.id;
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from Supabase
    // For now, use mock data
    const mockPoll = mockPollsData[pollId];
    if (mockPoll) {
      setPoll(mockPoll);
    }
    setLoading(false);
  }, [pollId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading poll...</div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2">Poll Not Found</h2>
              <p className="text-muted-foreground mb-4">This poll may have been removed or doesn't exist.</p>
              <Link href="/polls">
                <Button>View All Polls</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          {/* Back button */}
          <Link href="/polls" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Link>

          {/* Poll Widget */}
          <PollWidget poll={poll} />

          {/* Poll Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Poll Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {new Date(poll.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ends</p>
                    <p className="text-sm font-medium">
                      {new Date(poll.ends_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Region</p>
                  <p className="text-sm font-medium">{poll.region}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Created by</p>
                <p className="text-sm font-medium">{poll.created_by}</p>
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
