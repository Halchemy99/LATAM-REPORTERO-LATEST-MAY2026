'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation, useUserRole } from '@/lib/providers';
import { getArticles, getCategories, deleteArticle, updateArticleStatus } from '@/lib/supabase/cms';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  Loader2,
  ArrowUpDown
} from 'lucide-react';

const STATUS_BADGES = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
  in_review: { label: 'In Review', className: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Approved', className: 'bg-blue-100 text-blue-800' },
  scheduled: { label: 'Scheduled', className: 'bg-purple-100 text-purple-800' },
  published: { label: 'Published', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-600' }
};

export default function ArticlesListPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { user, canEditStories, canAccessAdminDashboard } = useUserRole();
  
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadData();
  }, [statusFilter, categoryFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articlesData, categoriesData] = await Promise.all([
        getArticles({
          status: statusFilter === 'all' ? null : statusFilter,
          category: categoryFilter === 'all' ? null : categoryFilter
        }),
        getCategories()
      ]);
      setArticles(articlesData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteArticle(deleteId);
      setArticles(articles.filter(a => a.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateArticleStatus(id, newStatus);
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getLocalizedTitle = (article) => {
    return article[`title_${locale}`] || article.title_en || 'Untitled';
  };

  const getCategoryName = (article) => {
    if (!article.category) return '-';
    return article.category[`name_${locale}`] || article.category.name_en;
  };

  const filteredArticles = articles.filter(article => {
    if (!searchTerm) return true;
    const title = getLocalizedTitle(article).toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  });

  // Check permissions
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please log in to access the CMS.</p>
          <Button asChild>
            <Link href="/auth/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Articles
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your articles and content
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white"
            onClick={() => router.push('/editor/articles/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(STATUS_BADGES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat[`name_${locale}`] || cat.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Articles Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#8c52ff]" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first article to get started'}
            </p>
            <Button 
              className="bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white"
              onClick={() => router.push('/editor/articles/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id} className="group">
                    <TableCell>
                      <Link href={`/editor/articles/${article.id}`} className="block">
                        <div className="flex items-center gap-3 hover:opacity-80 cursor-pointer">
                          {article.featured_image && (
                            <img
                              src={article.featured_image}
                              alt=""
                              className="w-12 h-8 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="font-medium line-clamp-1">
                              {getLocalizedTitle(article)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              /{article.slug}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {article.category && (
                        <Badge variant="outline">
                          {getCategoryName(article)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_BADGES[article.status]?.className}>
                        {STATUS_BADGES[article.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {article.author?.name || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {article.updated_at 
                          ? new Date(article.updated_at).toLocaleDateString()
                          : '-'}
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
                          <DropdownMenuItem onClick={() => router.push(`/editor/articles/${article.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {article.status === 'published' && (
                            <DropdownMenuItem onClick={() => window.open(`/article/${article.slug}`, '_blank')}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {article.status === 'draft' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(article.id, 'in_review')}>
                              <Clock className="h-4 w-4 mr-2" />
                              Submit for Review
                            </DropdownMenuItem>
                          )}
                          {(article.status === 'in_review' || article.status === 'approved') && canAccessAdminDashboard && (
                            <DropdownMenuItem onClick={() => handleStatusChange(article.id, 'published')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          {article.status === 'in_review' && canAccessAdminDashboard && (
                            <DropdownMenuItem onClick={() => handleStatusChange(article.id, 'rejected')}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeleteId(article.id)}
                          >
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
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The article and all its content blocks will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
