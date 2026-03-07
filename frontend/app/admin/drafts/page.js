'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
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
  Tag
} from 'lucide-react';
import { toast } from 'sonner';

// Trust tags list
const TRUST_TAGS = [
  'Primary source',
  'On-the-record',
  'Document-backed',
  'Independent reporting',
  'Multiple sources',
  'Analysis',
  'Opinion',
  'Developing story',
  'Community-supplied',
  'AI-assisted, editor-reviewed'
];

export default function AIDraftInboxPage() {
  const { t } = useTranslation();
  const { user, role, canAccessAdminDashboard, isLoading } = useUserRole();
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);
  const [draftsLoading, setDraftsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('needs_review');
  const [originFilter, setOriginFilter] = useState('all');
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Fetch drafts from Supabase
  const fetchDrafts = useCallback(async () => {
    setDraftsLoading(true);
    try {
      const supabase = createClient();
      
      let query = supabase
        .from('articles')
        .select('*')
        .eq('author_type', 'ai')
        .order('created_at', { ascending: false });
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      if (originFilter !== 'all') {
        query = query.eq('origin', originFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching drafts:', error);
        toast.error('Failed to load drafts');
        setDrafts([]);
      } else {
        setDrafts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error loading drafts');
      setDrafts([]);
    } finally {
      setDraftsLoading(false);
    }
  }, [statusFilter, originFilter]);

  useEffect(() => {
    if (!isLoading && (!user || !canAccessAdminDashboard)) {
      router.push('/auth/login');
    }
    if (!isLoading && user && canAccessAdminDashboard) {
      fetchDrafts();
    }
  }, [user, canAccessAdminDashboard, isLoading, router, fetchDrafts]);

  // Handle approve (publish)
  const handleApprove = async (draft) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('articles')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', draft.id);
      
      if (!error) {
        toast.success('Article published successfully!');
        fetchDrafts();
      } else {
        toast.error('Failed to publish: ' + error.message);
      }
    } catch (error) {
      toast.error('Error publishing article');
    }
  };

  // Handle reject
  const handleReject = async (draft) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('articles')
        .update({ status: 'rejected' })
        .eq('id', draft.id);
      
      if (!error) {
        toast.success('Article rejected');
        fetchDrafts();
      } else {
        toast.error('Failed to reject: ' + error.message);
      }
    } catch (error) {
      toast.error('Error rejecting article');
    }
  };

  // Handle delete
  const handleDelete = async (draft) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', draft.id);
      
      if (!error) {
        toast.success('Draft deleted');
        fetchDrafts();
      } else {
        toast.error('Failed to delete: ' + error.message);
      }
    } catch (error) {
      toast.error('Error deleting draft');
    }
  };

  // Filter drafts by search
  const filteredDrafts = drafts.filter(d => {
    if (!search) return true;
    return d.title?.toLowerCase().includes(search.toLowerCase()) ||
           d.source_name?.toLowerCase().includes(search.toLowerCase());
  });

  // Stats
  const stats = {
    needsReview: drafts.filter(d => d.status === 'needs_review').length,
    published: drafts.filter(d => d.status === 'published').length,
    rejected: drafts.filter(d => d.status === 'rejected').length,
    fromRss: drafts.filter(d => d.origin === 'rss').length,
    manual: drafts.filter(d => d.origin === 'manual').length
  };

  const statusColors = {
    needs_review: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800'
  };

  const originIcons = {
    rss: <Rss className="h-4 w-4" />,
    manual: <PenTool className="h-4 w-4" />
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
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
        <div className="container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">AI Draft Inbox</h1>
                <p className="text-muted-foreground">Review and publish AI-generated content</p>
              </div>
            </div>
            <Link href="/admin/drafts/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Manual Draft
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Needs Review</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.needsReview}</p>
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
                    <p className="text-2xl font-bold">{stats.fromRss}</p>
                  </div>
                  <Rss className="h-6 w-6 text-primary/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Manual</p>
                    <p className="text-2xl font-bold">{stats.manual}</p>
                  </div>
                  <PenTool className="h-6 w-6 text-primary/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drafts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="needs_review">Needs Review</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={originFilter} onValueChange={setOriginFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Origins</SelectItem>
                <SelectItem value="rss">RSS Feed</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchDrafts} disabled={draftsLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${draftsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Drafts Table */}
          <Card>
            {draftsLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading drafts...</span>
              </div>
            ) : filteredDrafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No AI drafts found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a manual draft or connect your RSS automation
                </p>
                <Link href="/admin/drafts/new" className="mt-4">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Draft
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trust Tags</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrafts.map(draft => (
                    <TableRow key={draft.id}>
                      <TableCell>
                        <div className="max-w-md">
                          <p className="font-medium truncate">{draft.title}</p>
                          {draft.source_name && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              {draft.source_name}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {originIcons[draft.origin]}
                          <span className="text-sm capitalize">{draft.origin}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[draft.status]}>
                          {draft.status?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {draft.trust_tags?.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {draft.trust_tags?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{draft.trust_tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(draft.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedDraft(draft);
                              setPreviewOpen(true);
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/drafts/${draft.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {draft.status === 'needs_review' && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(draft)} className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve & Publish
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReject(draft)} className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(draft)} className="text-destructive">
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
          </Card>

          {/* Preview Dialog */}
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedDraft?.title}</DialogTitle>
                <DialogDescription>
                  {selectedDraft?.source_name && (
                    <span className="flex items-center gap-1">
                      Source: {selectedDraft.source_name}
                      {selectedDraft.source_url && (
                        <a href={selectedDraft.source_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Trust Tags */}
                {selectedDraft?.trust_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedDraft.trust_tags.map((tag, i) => (
                      <Badge key={i} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Excerpt */}
                {selectedDraft?.excerpt && (
                  <div>
                    <h4 className="font-semibold mb-1">Excerpt</h4>
                    <p className="text-muted-foreground">{selectedDraft.excerpt}</p>
                  </div>
                )}
                
                {/* Body */}
                {selectedDraft?.body && (
                  <div>
                    <h4 className="font-semibold mb-1">Content</h4>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedDraft.body }} />
                  </div>
                )}
                
                {/* Problem Section */}
                {selectedDraft?.problem_section && (
                  <div>
                    <h4 className="font-semibold mb-1 text-red-600">Problem</h4>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedDraft.problem_section }} />
                  </div>
                )}
                
                {/* Solutions Section */}
                {selectedDraft?.solutions_section && (
                  <div>
                    <h4 className="font-semibold mb-1 text-green-600">Solutions</h4>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedDraft.solutions_section }} />
                  </div>
                )}
                
                {/* Impact Section */}
                {selectedDraft?.impact_section && (
                  <div>
                    <h4 className="font-semibold mb-1 text-blue-600">Impact</h4>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedDraft.impact_section }} />
                  </div>
                )}
              </div>
              
              <DialogFooter className="mt-4">
                {selectedDraft?.status === 'needs_review' && (
                  <>
                    <Button variant="outline" onClick={() => handleReject(selectedDraft)}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button onClick={() => handleApprove(selectedDraft)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve & Publish
                    </Button>
                  </>
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
