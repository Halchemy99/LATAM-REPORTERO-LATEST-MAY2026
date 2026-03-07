'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation, useUserRole } from '@/lib/providers';
import { mockArticles } from '@/lib/mock-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Edit, 
  FileText, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

export default function EditorDashboardPage() {
  const { t } = useTranslation();
  const { user, canEditStories, isLoading } = useUserRole();
  const router = useRouter();
  const [pendingArticles, setPendingArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('approve');

  useEffect(() => {
    if (!isLoading && (!user || !canEditStories)) {
      router.push('/auth/login');
    }
    // Create mock pending articles
    const pending = mockArticles.slice(0, 4).map((a, i) => ({
      ...a,
      id: `pending-${i}`,
      status: i === 0 ? 'pending_review' : i === 1 ? 'pending_review' : 'draft',
      submittedAt: '2025-06-09',
      submittedBy: 'Carlos Mendez'
    }));
    setPendingArticles(pending);
  }, [user, canEditStories, isLoading, router]);

  if (isLoading || !user || !canEditStories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  const handleApprove = (article) => {
    setSelectedArticle(article);
    setDialogAction('approve');
    setShowDialog(true);
  };

  const handleReject = (article) => {
    setSelectedArticle(article);
    setDialogAction('reject');
    setShowDialog(true);
  };

  const confirmAction = () => {
    if (dialogAction === 'approve') {
      setPendingArticles(pendingArticles.filter(a => a.id !== selectedArticle.id));
      toast.success('Article approved and published!');
    } else {
      setPendingArticles(pendingArticles.map(a => 
        a.id === selectedArticle.id ? { ...a, status: 'rejected' } : a
      ));
      toast.success('Article rejected with feedback sent to author.');
    }
    setShowDialog(false);
    setFeedback('');
    setSelectedArticle(null);
  };

  const stats = {
    pendingReview: pendingArticles.filter(a => a.status === 'pending_review').length,
    approvedThisWeek: 12,
    rejectedThisWeek: 3
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Edit className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Editor Dashboard</h1>
              <p className="text-muted-foreground">Review and manage submitted articles</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('editor.pendingReview')}</p>
                    <p className="text-3xl font-bold text-amber-600">{stats.pendingReview}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved This Week</p>
                    <p className="text-3xl font-bold text-green-600">{stats.approvedThisWeek}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected This Week</p>
                    <p className="text-3xl font-bold text-red-600">{stats.rejectedThisWeek}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Queue */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">
                {t('editor.reviewQueue')} ({stats.pendingReview})
              </TabsTrigger>
              <TabsTrigger value="recent">Recently Reviewed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="space-y-4">
                {pendingArticles.filter(a => a.status === 'pending_review').length > 0 ? (
                  pendingArticles
                    .filter(a => a.status === 'pending_review')
                    .map(article => (
                      <Card key={article.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <img
                              src={article.mainImage}
                              alt={article.title}
                              className="w-full md:w-48 h-32 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <Badge variant="outline" className="mb-2">
                                    {t(`categories.${article.category}`)}
                                  </Badge>
                                  <h3 className="text-lg font-semibold">{article.title}</h3>
                                </div>
                                <Badge className="bg-amber-100 text-amber-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending Review
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {article.excerpt}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                  Submitted by <span className="font-medium">{article.submittedBy}</span> on {article.submittedAt}
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleReject(article)}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    {t('editor.reject')}
                                  </Button>
                                  <Button 
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApprove(article)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {t('editor.approve')}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                      <p className="text-muted-foreground">No articles pending review at the moment.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center py-8">
                    Recently reviewed articles will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Approve/Reject Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approve Article' : 'Reject Article'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve' 
                ? 'This article will be published immediately.'
                : 'Please provide feedback to help the author improve their submission.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {dialogAction === 'reject' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('editor.feedback')}</label>
              <Textarea
                placeholder="Explain why this article is being rejected..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={confirmAction}
              className={dialogAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={dialogAction === 'reject' ? 'destructive' : 'default'}
            >
              {dialogAction === 'approve' ? 'Approve & Publish' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
