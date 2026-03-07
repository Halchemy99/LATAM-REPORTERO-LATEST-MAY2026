'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { mockArticles } from '@/lib/mock-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  PenTool,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Plus,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContributorDashboardPage() {
  const { t } = useTranslation();
  const { user, canSubmitStories, isLoading } = useUserRole();
  const router = useRouter();
  const [myArticles, setMyArticles] = useState([]);

  useEffect(() => {
    if (!isLoading && (!user || !canSubmitStories)) {
      router.push('/auth/login');
    }
    // Create mock articles for this contributor
    const articles = [
      { ...mockArticles[1], status: 'published', earnings: 45.50 },
      { ...mockArticles[2], status: 'pending_review', earnings: 0 },
      { ...mockArticles[3], status: 'draft', earnings: 0 },
      { ...mockArticles[4], status: 'rejected', earnings: 0, rejectionReason: 'Needs more sources and fact verification.' }
    ].map((a, i) => ({ ...a, id: `my-${i}` }));
    setMyArticles(articles);
  }, [user, canSubmitStories, isLoading, router]);

  if (isLoading || !user || !canSubmitStories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  const stats = {
    published: myArticles.filter(a => a.status === 'published').length,
    pending: myArticles.filter(a => a.status === 'pending_review').length,
    drafts: myArticles.filter(a => a.status === 'draft').length,
    totalEarnings: myArticles.reduce((sum, a) => sum + (a.earnings || 0), 0)
  };

  const statusColors = {
    published: 'bg-green-100 text-green-800',
    pending_review: 'bg-amber-100 text-amber-800',
    draft: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    published: <CheckCircle className="h-4 w-4" />,
    pending_review: <Clock className="h-4 w-4" />,
    draft: <Edit className="h-4 w-4" />,
    rejected: <XCircle className="h-4 w-4" />
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <PenTool className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Contributor Dashboard</h1>
                <p className="text-muted-foreground">Manage your stories and track earnings</p>
              </div>
            </div>
            <Link href="/submit">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('contributor.submitStory')}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('contributor.published')}</p>
                    <p className="text-3xl font-bold text-green-600">{stats.published}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('contributor.pending')}</p>
                    <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('contributor.drafts')}</p>
                    <p className="text-3xl font-bold">{stats.drafts}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-600">£{stats.totalEarnings.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Articles */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">{t('contributor.myStories')}</TabsTrigger>
              <TabsTrigger value="drafts">{t('contributor.drafts')} ({stats.drafts})</TabsTrigger>
              <TabsTrigger value="pending">{t('contributor.pending')} ({stats.pending})</TabsTrigger>
              <TabsTrigger value="published">{t('contributor.published')} ({stats.published})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {myArticles.map(article => (
                  <Card key={article.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <img
                          src={article.mainImage}
                          alt={article.title}
                          className="w-full md:w-40 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{article.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {t(`categories.${article.category}`)} • {t(`regions.${article.region}`)}
                              </p>
                            </div>
                            <Badge className={statusColors[article.status]}>
                              {statusIcons[article.status]}
                              <span className="ml-1 capitalize">{article.status.replace('_', ' ')}</span>
                            </Badge>
                          </div>
                          
                          {article.status === 'rejected' && article.rejectionReason && (
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg mb-3">
                              <p className="text-sm text-red-800 dark:text-red-200">
                                <strong>Rejection Reason:</strong> {article.rejectionReason}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {article.earnings > 0 && (
                                <span className="text-green-600 font-medium">
                                  £{article.earnings.toFixed(2)} earned
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {article.status === 'published' && (
                                <Link href={`/article/${article.slug}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Button>
                                </Link>
                              )}
                              {(article.status === 'draft' || article.status === 'rejected') && (
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              )}
                              {article.status === 'draft' && (
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="drafts">
              <div className="space-y-4">
                {myArticles.filter(a => a.status === 'draft').map(article => (
                  <Card key={article.id}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{article.excerpt}</p>
                      <Button size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Continue Editing
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="space-y-4">
                {myArticles.filter(a => a.status === 'pending_review').map(article => (
                  <Card key={article.id}>
                    <CardContent className="p-6">
                      <Badge className="bg-amber-100 text-amber-800 mb-2">
                        <Clock className="h-3 w-3 mr-1" />
                        Under Review
                      </Badge>
                      <h3 className="font-semibold mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Your article is being reviewed by our editorial team. You'll be notified once it's approved.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="published">
              <div className="space-y-4">
                {myArticles.filter(a => a.status === 'published').map(article => (
                  <Card key={article.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold mb-2">{article.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                          <p className="text-sm text-green-600 font-medium">
                            Earnings: £{(article.earnings || 0).toFixed(2)}
                          </p>
                        </div>
                        <Link href={`/article/${article.slug}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
