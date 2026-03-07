'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { mockArticles } from '@/lib/mock-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Bookmark, 
  FileText, 
  Settings, 
  CreditCard,
  TrendingUp,
  Clock,
  Star,
  Crown
} from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, role, isLoading } = useUserRole();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
    // Load bookmarks from localStorage
    const saved = localStorage.getItem('bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  const stats = {
    articlesRead: 24,
    bookmarked: bookmarks.length || 3,
    timeSpent: '4h 32m',
    trustScoresGiven: 12
  };

  const recentArticles = mockArticles.slice(0, 3);

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    editor: 'bg-orange-100 text-orange-800',
    contributor: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    free: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {t('dashboard.welcome')}, {user.name || user.email.split('@')[0]}!
              </h1>
              <div className="flex items-center gap-2">
                <Badge className={roleColors[role]}>
                  {role?.toUpperCase()} Account
                </Badge>
                {role === 'free' && (
                  <Link href="/pricing">
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      <Crown className="h-3 w-3 mr-1" /> Upgrade
                    </Badge>
                  </Link>
                )}
              </div>
            </div>
            <Link href="/profile">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                {t('nav.profile')}
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('dashboard.articlesRead')}</p>
                    <p className="text-3xl font-bold">{stats.articlesRead}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('dashboard.bookmarked')}</p>
                    <p className="text-3xl font-bold">{stats.bookmarked}</p>
                  </div>
                  <Bookmark className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Time This Week</p>
                    <p className="text-3xl font-bold">{stats.timeSpent}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Trust Scores Given</p>
                    <p className="text-3xl font-bold">{stats.trustScoresGiven}</p>
                  </div>
                  <Star className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="recent" className="space-y-6">
            <TabsList>
              <TabsTrigger value="recent">{t('dashboard.recentArticles')}</TabsTrigger>
              <TabsTrigger value="bookmarks">{t('nav.bookmarks')}</TabsTrigger>
              <TabsTrigger value="subscription">{t('dashboard.subscription')}</TabsTrigger>
            </TabsList>

            <TabsContent value="recent">
              <div className="grid md:grid-cols-3 gap-6">
                {recentArticles.map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
              <div className="text-center mt-6">
                <Link href="/solutions">
                  <Button variant="outline">View All Articles</Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="bookmarks">
              {bookmarks.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {mockArticles.slice(0, bookmarks.length).map(article => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Bookmarks Yet</h3>
                    <p className="text-muted-foreground mb-4">Save articles to read later by clicking the bookmark icon.</p>
                    <Link href="/solutions">
                      <Button>Explore Articles</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {t('dashboard.subscription')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold">
                        {role === 'free' ? 'Free Plan' : 'Premium Plan'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {role === 'free' 
                          ? 'Access to AI-verified content only' 
                          : 'Full access to all content'
                        }
                      </p>
                    </div>
                    <Badge className={roleColors[role]}>{role?.toUpperCase()}</Badge>
                  </div>

                  {role === 'free' && (
                    <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                      <h4 className="font-semibold mb-2">Upgrade to Premium</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get access to human-written premium content, community features, and more.
                      </p>
                      <Link href="/pricing">
                        <Button>
                          <Crown className="h-4 w-4 mr-2" />
                          View Plans
                        </Button>
                      </Link>
                    </div>
                  )}

                  {role !== 'free' && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Current Period</span>
                        <span>Jun 1 - Jun 30, 2025</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        Manage Subscription
                      </Button>
                    </div>
                  )}
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
