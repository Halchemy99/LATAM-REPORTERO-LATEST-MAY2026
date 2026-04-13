'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { sanitizeHtml } from '@/lib/sanitize';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Bot, 
  FileText, 
  CheckCircle, 
  XCircle,
  MoreHorizontal,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Rss,
  PenTool,
  Plus,
  ExternalLink,
  Clock,
  Tag,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

// Use the backend URL from environment - works in both dev and production
const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_BASE_URL || process.env.REACT_APP_BACKEND_URL || '') 
  : '';

export default function AIDraftInboxPage() {
  const { t, locale } = useTranslation();
  const { user, role, token, canAccessAdminDashboard, isLoading } = useUserRole();
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);
  const [draftsLoading, setDraftsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('draft');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch drafts from Sanity via backend API
  const fetchDrafts = useCallback(async () => {
    setDraftsLoading(true);
    try {
      const params = new URLSearchParams({
        language: locale || 'en',
        ai_only: 'true'
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }

      const response = await fetch(`${API_URL}/api/sanity/articles?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch drafts');
      }
      
      const data = await response.json();
      setDrafts(data.articles || []);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      toast.error('Failed to load drafts');
      setDrafts([]);
    } finally {
      setDraftsLoading(false);
    }
  }, [statusFilter, categoryFilter, locale]);

  useEffect(() => {
    if (!isLoading && (!user || !canAccessAdminDashboard)) {
      router.push('/auth/login');
    }
    if (!isLoading && user && canAccessAdminDashboard) {
      fetchDrafts();
    }
  }, [user, canAccessAdminDashboard, isLoading, router, fetchDrafts]);

  // Handle approve (publish) - updates status in Sanity
  const handleApprove = async (draft) => {
    setActionLoading(draft._id);
    try {
      const response = await fetch(`${API_URL}/api/sanity/article/${draft._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'published' })
      });
      
      if (response.ok) {
        toast.success('Article published successfully!');
        fetchDrafts();
        setPreviewOpen(false);
      } else {
        const error = await response.json();
        toast.error('Failed to publish: ' + (error.detail || 'Unknown error'));
      }
    } catch (error) {
      toast.error('Error publishing article');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle reject
  const handleReject = async (draft) => {
    setActionLoading(draft._id);
    try {
      const response = await fetch(`${API_URL}/api/sanity/article/${draft._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      
      if (response.ok) {
        toast.success('Article rejected');
        fetchDrafts();
        setPreviewOpen(false);
      } else {
        const error = await response.json();
        toast.error('Failed to reject: ' + (error.detail || 'Unknown error'));
      }
    } catch (error) {
      toast.error('Error rejecting article');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete
  const handleDelete = async (draft) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    
    setActionLoading(draft._id);
    try {
      const response = await fetch(`${API_URL}/api/sanity/article/${draft._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        toast.success('Draft deleted');
        fetchDrafts();
        setPreviewOpen(false);
      } else {
        const error = await response.json();
        toast.error('Failed to delete: ' + (error.detail || 'Unknown error'));
      }
    } catch (error) {
      toast.error('Error deleting draft');
    } finally {
      setActionLoading(null);
    }
  };

  // Trigger RSS Ingestion
  const handleTriggerIngestion = async () => {
    toast.info('Starting RSS ingestion...');
    try {
      const response = await fetch(`${API_URL}/api/rss/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success(`Ingestion complete! Processed ${result.processed} articles.`);
        fetchDrafts();
      } else {
        toast.error('Ingestion failed');
      }
    } catch (error) {
      toast.error('Error triggering ingestion');
    }
  };

  // Filter drafts by search
  const filteredDrafts = drafts.filter(d => {
    if (!search) return true;
    return d.title?.toLowerCase().includes(search.toLowerCase()) ||
           d.sourceFeed?.toLowerCase().includes(search.toLowerCase()) ||
           d.category?.toLowerCase().includes(search.toLowerCase());
  });

  // Stats
  const stats = {
    total: drafts.length,
    draft: drafts.filter(d => d.status === 'draft' || !d.status).length,
    published: drafts.filter(d => d.status === 'published').length,
    rejected: drafts.filter(d => d.status === 'rejected').length,
    fromRss: drafts.filter(d => d.sourceFeed).length
  };

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  const categoryColors = {
    politics: 'bg-purple-100 text-purple-800',
    health: 'bg-pink-100 text-pink-800',
    environment: 'bg-green-100 text-green-800',
    economy: 'bg-blue-100 text-blue-800',
    education: 'bg-orange-100 text-orange-800',
    'human-rights': 'bg-red-100 text-red-800',
    technology: 'bg-cyan-100 text-cyan-800',
    energy: 'bg-amber-100 text-amber-800'
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('common.loading') || 'Loading...'}</div>
      </div>
    );
  }

  if (!user || !canAccessAdminDashboard) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">AI Draft Inbox</h1>
                <p className="text-muted-foreground">Review and publish AI-generated content from RSS feeds</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleTriggerIngestion}>
                <Rss className="h-4 w-4 mr-2" />
                Run RSS Ingestion
              </Button>
              <Button onClick={fetchDrafts} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <FileText className="h-6 w-6 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Drafts</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                  </div>
                  <Clock className="h-6 w-6 text-yellow-500/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-500/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  </div>
                  <XCircle className="h-6 w-6 text-red-500/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">From RSS</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.fromRss}</p>
                  </div>
                  <Rss className="h-6 w-6 text-blue-500/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, source, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="politics">Politics</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="human-rights">Human Rights</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Drafts Table */}
          <Card>
            <CardContent className="p-0">
              {draftsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading drafts...</span>
                </div>
              ) : filteredDrafts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-4 opacity-50" />
                  <p>No drafts found</p>
                  <p className="text-sm mt-1">Run RSS ingestion to fetch new articles</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrafts.map((draft) => (
                      <TableRow key={draft._id} className="group">
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium line-clamp-2">{draft.title}</p>
                            {draft.standfirst && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{draft.standfirst}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={categoryColors[draft.category] || 'bg-gray-100 text-gray-800'}>
                            {draft.category || 'uncategorized'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Rss className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{draft.sourceFeed || 'Manual'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm capitalize">{draft.region || 'latam'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[draft.status] || statusColors.draft}>
                            {draft.status || 'draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(draft.publishedAt || draft.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedDraft(draft); setPreviewOpen(true); }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              {draft.sourceUrl && (
                                <DropdownMenuItem asChild>
                                  <a href={draft.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Original
                                  </a>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {draft.status !== 'published' && (
                                <DropdownMenuItem onClick={() => handleApprove(draft)} className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              {draft.status !== 'rejected' && (
                                <DropdownMenuItem onClick={() => handleReject(draft)} className="text-yellow-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(draft)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Preview Dialog */}
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedDraft?.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 flex-wrap">
                  <Badge className={categoryColors[selectedDraft?.category] || 'bg-gray-100'}>
                    {selectedDraft?.category}
                  </Badge>
                  <Badge variant="outline">
                    <Globe className="h-3 w-3 mr-1" />
                    {selectedDraft?.region}
                  </Badge>
                  {selectedDraft?.sourceFeed && (
                    <Badge variant="outline">
                      <Rss className="h-3 w-3 mr-1" />
                      {selectedDraft?.sourceFeed}
                    </Badge>
                  )}
                  <Badge className={statusColors[selectedDraft?.status] || statusColors.draft}>
                    {selectedDraft?.status || 'draft'}
                  </Badge>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Standfirst */}
                {selectedDraft?.standfirst && (
                  <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <p className="text-lg font-medium">{selectedDraft.standfirst}</p>
                  </div>
                )}
                
                {/* Source Link */}
                {selectedDraft?.sourceUrl && (
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="h-4 w-4" />
                    <a 
                      href={selectedDraft.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Original Source
                    </a>
                  </div>
                )}
                
                {/* Body Content */}
                {selectedDraft?.body && (
                  <div>
                    <h4 className="font-semibold mb-2">Content</h4>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedDraft.body) }} />
                  </div>
                )}
                
                {/* Problem Section */}
                {selectedDraft?.problem && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                    <h4 className="font-semibold mb-2 text-red-700 dark:text-red-400 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                      Problem
                    </h4>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedDraft.problem) }} />
                  </div>
                )}
                
                {/* Solutions Section */}
                {selectedDraft?.solutions && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                      Solutions
                    </h4>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedDraft.solutions) }} />
                  </div>
                )}
                
                {/* Impact Section */}
                {selectedDraft?.impact && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                      Impact
                    </h4>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedDraft.impact) }} />
                  </div>
                )}
                
                {/* Metadata */}
                <div className="border-t pt-4 text-sm text-muted-foreground">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Published: {formatDate(selectedDraft?.publishedAt)}</div>
                    <div>Language: {selectedDraft?.language?.toUpperCase()}</div>
                    <div>Slug: {selectedDraft?.slug}</div>
                    <div>ID: {selectedDraft?._id}</div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                {selectedDraft?.status !== 'rejected' && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleReject(selectedDraft)}
                    disabled={actionLoading === selectedDraft?._id}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
                {selectedDraft?.status !== 'published' && (
                  <Button 
                    onClick={() => handleApprove(selectedDraft)}
                    disabled={actionLoading === selectedDraft?._id}
                  >
                    {actionLoading === selectedDraft?._id ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Publish
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
