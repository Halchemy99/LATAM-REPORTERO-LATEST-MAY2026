'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { 
  getArticleById,
  updateArticle, 
  getCategories, 
  getTags, 
  getAuthors,
  generateSlug,
  updateArticleStatus,
  saveArticleVersion,
  getArticleVersions,
  restoreArticleVersion,
  scheduleArticle,
  unscheduleArticle
} from '@/lib/supabase/cms';
import Header from '@/components/Header';
import BlockEditor from '@/components/cms/BlockEditor';
import { ArticleContent } from '@/components/cms/BlockRenderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
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
  ArrowLeft, 
  Save, 
  Eye, 
  Send, 
  Loader2,
  Image,
  Settings,
  FileText,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  History,
  Calendar,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const REGIONS = [
  { value: 'mexico', label: 'Mexico' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'chile', label: 'Chile' },
  { value: 'peru', label: 'Peru' },
  { value: 'venezuela', label: 'Venezuela' },
  { value: 'central-america', label: 'Central America' },
  { value: 'caribbean', label: 'Caribbean' },
  { value: 'all-regions', label: 'All Regions' }
];

const STATUS_BADGES = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
  in_review: { label: 'In Review', className: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Approved', className: 'bg-blue-100 text-blue-800' },
  scheduled: { label: 'Scheduled', className: 'bg-purple-100 text-purple-800' },
  published: { label: 'Published', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-600' }
};

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const { t, locale } = useTranslation();
  const { user, canAccessAdminDashboard } = useUserRole();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [authors, setAuthors] = useState([]);
  
  // Article form state
  const [article, setArticle] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [contentLocale, setContentLocale] = useState('en');
  
  // Version history state
  const [versions, setVersions] = useState([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  
  // Scheduling state
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  // Live preview state
  const [showLivePreview, setShowLivePreview] = useState(false);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articleData, categoriesData, tagsData, authorsData] = await Promise.all([
        getArticleById(params.id),
        getCategories(),
        getTags(),
        getAuthors()
      ]);
      
      if (articleData) {
        setArticle(articleData);
        setContentBlocks(articleData.content_blocks || []);
        setSelectedTags(articleData.tags?.map(t => t.id) || []);
      }
      
      setCategories(categoriesData || []);
      setTags(tagsData || []);
      setAuthors(authorsData || []);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (locale, value) => {
    setArticle(prev => ({
      ...prev,
      [`title_${locale}`]: value
    }));
  };
  
  const handleCustomSlugToggle = (useCustom) => {
    setArticle(prev => {
      if (useCustom) {
        return {
          ...prev,
          use_custom_slug: true,
          custom_slug: prev.custom_slug || prev.slug
        };
      } else {
        // Regenerate from title + date
        const dateStr = prev.created_at ? prev.created_at.split('T')[0] : new Date().toISOString().split('T')[0];
        const baseSlug = prev.title_en?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
        return {
          ...prev,
          use_custom_slug: false,
          slug: baseSlug ? `${baseSlug}-${dateStr}` : prev.slug
        };
      }
    });
  };
  
  const handleCustomSlugChange = (value) => {
    const cleanedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setArticle(prev => ({
      ...prev,
      custom_slug: cleanedSlug,
      slug: cleanedSlug
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const articleData = {
        ...article,
        content_blocks: contentBlocks,
        tags: selectedTags
      };
      
      // Remove fields that shouldn't be updated
      delete articleData.author;
      delete articleData.category;
      delete articleData.id;
      delete articleData.created_at;
      
      // Save version before updating
      try {
        await saveArticleVersion(params.id, article, contentBlocks, user?.id, 'Auto-save');
      } catch (versionError) {
        console.log('Version save skipped:', versionError.message);
      }
      
      await updateArticle(params.id, articleData);
      toast.success('Article saved successfully');
      
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Error saving article. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Version history handlers
  const loadVersions = async () => {
    try {
      setLoadingVersions(true);
      const versionsData = await getArticleVersions(params.id);
      setVersions(versionsData);
    } catch (error) {
      console.error('Error loading versions:', error);
      toast.error('Failed to load version history');
    } finally {
      setLoadingVersions(false);
    }
  };
  
  const handleRestoreVersion = async () => {
    if (!selectedVersion) return;
    
    try {
      setSaving(true);
      await restoreArticleVersion(params.id, selectedVersion.id);
      toast.success('Version restored successfully');
      setRestoreDialogOpen(false);
      setShowVersionHistory(false);
      // Reload article data
      loadData();
    } catch (error) {
      console.error('Error restoring version:', error);
      toast.error('Failed to restore version');
    } finally {
      setSaving(false);
    }
  };
  
  // Scheduling handlers
  const handleSchedule = async () => {
    if (!scheduleDate || !scheduleTime) {
      toast.error('Please select both date and time');
      return;
    }
    
    try {
      setSaving(true);
      const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      await scheduleArticle(params.id, scheduledAt);
      setArticle(prev => ({ ...prev, status: 'scheduled', scheduled_at: scheduledAt }));
      toast.success('Article scheduled for publishing');
      setShowScheduleDialog(false);
    } catch (error) {
      console.error('Error scheduling article:', error);
      toast.error('Failed to schedule article');
    } finally {
      setSaving(false);
    }
  };
  
  const handleUnschedule = async () => {
    try {
      setSaving(true);
      await unscheduleArticle(params.id);
      setArticle(prev => ({ ...prev, status: 'draft', scheduled_at: null }));
      toast.success('Article unscheduled');
    } catch (error) {
      console.error('Error unscheduling article:', error);
      toast.error('Failed to unschedule article');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true);
      await updateArticleStatus(params.id, newStatus);
      setArticle(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please log in to edit articles.</p>
          <Button asChild>
            <Link href="/auth/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#8c52ff]" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/editor/articles">Back to Articles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Editor Header */}
      <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/editor/articles')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="font-semibold truncate max-w-[200px]" style={{ fontFamily: 'Raleway, sans-serif' }}>
                {article[`title_${locale}`] || article.title_en || 'Untitled'}
              </h1>
              <Badge className={STATUS_BADGES[article.status]?.className}>
                {STATUS_BADGES[article.status]?.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {/* Version History Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowVersionHistory(true);
                  loadVersions();
                }}
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
              
              {/* Schedule Button */}
              {(article.status === 'draft' || article.status === 'approved') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScheduleDialog(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              )}
              
              {/* Unschedule Button */}
              {article.status === 'scheduled' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUnschedule}
                  disabled={saving}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Unschedule
                </Button>
              )}
              
              {/* Live Preview Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLivePreview(true)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Preview
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
              
              {/* Status Actions */}
              {article.status === 'draft' && (
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => handleStatusChange('in_review')}
                  disabled={saving}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Review
                </Button>
              )}
              {article.status === 'in_review' && canAccessAdminDashboard && (
                <>
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleStatusChange('published')}
                    disabled={saving}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleStatusChange('rejected')}
                    disabled={saving}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              {article.status === 'approved' && canAccessAdminDashboard && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white"
                  onClick={() => handleStatusChange('published')}
                  disabled={saving}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              )}
              {article.status === 'published' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/article/${article.slug}`, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Live
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container py-6">
        {previewMode ? (
          /* Preview Mode */
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-8 shadow-sm">
              <Badge className="mb-4 bg-gradient-to-r from-[#8c52ff] to-[#6111ff]">
                {categories.find(c => c.id === article.category_id)?.[`name_${contentLocale}`] || 'Category'}
              </Badge>
              <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>
                {article[`title_${contentLocale}`] || 'Article Title'}
              </h1>
              <p className="text-xl text-muted-foreground mb-8" style={{ fontFamily: 'Marcellus, serif' }}>
                {article[`standfirst_${contentLocale}`] || 'Article standfirst/summary'}
              </p>
              {article.featured_image && (
                <figure className="mb-8">
                  <img
                    src={article.featured_image}
                    alt={article.featured_image_alt}
                    className="w-full rounded-lg"
                  />
                  {(article.featured_image_caption || article.featured_image_credit) && (
                    <figcaption className="mt-2 text-sm text-muted-foreground italic">
                      {article.featured_image_caption}
                      {article.featured_image_credit && ` Photo: ${article.featured_image_credit}`}
                    </figcaption>
                  )}
                </figure>
              )}
              <ArticleContent blocks={contentBlocks} locale={contentLocale} />
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Standfirst */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#8c52ff]" />
                    Article Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="en">
                    <TabsList className="grid grid-cols-3 w-[200px] mb-4">
                      <TabsTrigger value="en">EN</TabsTrigger>
                      <TabsTrigger value="es">ES</TabsTrigger>
                      <TabsTrigger value="pt">PT</TabsTrigger>
                    </TabsList>
                    {['en', 'es', 'pt'].map(lang => (
                      <TabsContent key={lang} value={lang} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Title ({lang.toUpperCase()})</Label>
                          <Input
                            value={article[`title_${lang}`] || ''}
                            onChange={(e) => handleTitleChange(lang, e.target.value)}
                            placeholder="Enter article title"
                            className="text-lg font-semibold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Standfirst / Summary ({lang.toUpperCase()})</Label>
                          <Textarea
                            value={article[`standfirst_${lang}`] || ''}
                            onChange={(e) => setArticle(prev => ({ ...prev, [`standfirst_${lang}`]: e.target.value }))}
                            placeholder="Brief summary that appears below the headline"
                            rows={3}
                          />
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Article URL</Label>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="custom-slug-toggle" className="text-sm text-muted-foreground">
                          Custom URL
                        </Label>
                        <Switch
                          id="custom-slug-toggle"
                          checked={article.use_custom_slug || false}
                          onCheckedChange={handleCustomSlugToggle}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      <span className="flex items-center text-muted-foreground text-sm">/article/</span>
                      <Input
                        value={article.use_custom_slug ? (article.custom_slug || '') : (article.slug || '')}
                        onChange={(e) => {
                          if (article.use_custom_slug) {
                            handleCustomSlugChange(e.target.value);
                          }
                        }}
                        placeholder={article.use_custom_slug ? "your-custom-url" : "auto-generated-slug-YYYY-MM-DD"}
                        disabled={!article.use_custom_slug}
                        className={!article.use_custom_slug ? "bg-muted" : ""}
                      />
                    </div>
                    
                    {!article.use_custom_slug && (
                      <p className="text-xs text-muted-foreground">
                        URL format: title-YYYY-MM-DD (toggle Custom URL to change)
                      </p>
                    )}
                    {article.use_custom_slug && (
                      <p className="text-xs text-muted-foreground">
                        Enter your custom URL slug (only lowercase letters, numbers, and hyphens)
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Content Blocks */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-[#8c52ff]" />
                      Content Blocks
                    </CardTitle>
                    <Select value={contentLocale} onValueChange={setContentLocale}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <BlockEditor
                    blocks={contentBlocks}
                    onChange={setContentBlocks}
                    locale={contentLocale}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Image className="h-4 w-4 text-[#8c52ff]" />
                    Featured Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {article.featured_image ? (
                    <div className="relative">
                      <img
                        src={article.featured_image}
                        alt="Featured"
                        className="w-full rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setArticle(prev => ({ ...prev, featured_image: '' }))}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Enter image URL below
                      </p>
                    </div>
                  )}
                  <Input
                    value={article.featured_image || ''}
                    onChange={(e) => setArticle(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="https://..."
                  />
                  <Input
                    value={article.featured_image_alt || ''}
                    onChange={(e) => setArticle(prev => ({ ...prev, featured_image_alt: e.target.value }))}
                    placeholder="Alt text"
                  />
                  <Input
                    value={article.featured_image_caption || ''}
                    onChange={(e) => setArticle(prev => ({ ...prev, featured_image_caption: e.target.value }))}
                    placeholder="Caption"
                  />
                  <Input
                    value={article.featured_image_credit || ''}
                    onChange={(e) => setArticle(prev => ({ ...prev, featured_image_credit: e.target.value }))}
                    placeholder="Photo credit"
                  />
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Settings className="h-4 w-4 text-[#8c52ff]" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={article.category_id || ''}
                      onValueChange={(v) => setArticle(prev => ({ ...prev, category_id: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat[`name_${locale}`] || cat.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Select
                      value={article.author_id || ''}
                      onValueChange={(v) => setArticle(prev => ({ ...prev, author_id: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map(author => (
                          <SelectItem key={author.id} value={author.id}>
                            {author.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select
                      value={article.region || ''}
                      onValueChange={(v) => setArticle(prev => ({ ...prev, region: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map(region => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Premium Content</Label>
                    <Switch
                      checked={article.is_premium || false}
                      onCheckedChange={(v) => setArticle(prev => ({ ...prev, is_premium: v }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Featured Article</Label>
                    <Switch
                      checked={article.is_featured || false}
                      onCheckedChange={(v) => setArticle(prev => ({ ...prev, is_featured: v }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                        className={`cursor-pointer ${
                          selectedTags.includes(tag.id) 
                            ? 'bg-[#8c52ff] hover:bg-[#6111ff]' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag[`name_${locale}`] || tag.name_en}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SEO */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="en">
                    <TabsList className="grid grid-cols-3 w-full mb-4">
                      <TabsTrigger value="en">EN</TabsTrigger>
                      <TabsTrigger value="es">ES</TabsTrigger>
                      <TabsTrigger value="pt">PT</TabsTrigger>
                    </TabsList>
                    {['en', 'es', 'pt'].map(lang => (
                      <TabsContent key={lang} value={lang} className="space-y-4">
                        <div className="space-y-2">
                          <Label>SEO Title ({lang.toUpperCase()})</Label>
                          <Input
                            value={article[`seo_title_${lang}`] || ''}
                            onChange={(e) => setArticle(prev => ({ ...prev, [`seo_title_${lang}`]: e.target.value }))}
                            placeholder="SEO title (max 70 chars)"
                            maxLength={70}
                          />
                          <p className="text-xs text-muted-foreground">
                            {article[`seo_title_${lang}`]?.length || 0}/70
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>SEO Description ({lang.toUpperCase()})</Label>
                          <Textarea
                            value={article[`seo_description_${lang}`] || ''}
                            onChange={(e) => setArticle(prev => ({ ...prev, [`seo_description_${lang}`]: e.target.value }))}
                            placeholder="SEO description (max 160 chars)"
                            maxLength={160}
                            rows={3}
                          />
                          <p className="text-xs text-muted-foreground">
                            {article[`seo_description_${lang}`]?.length || 0}/160
                          </p>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </DialogTitle>
            <DialogDescription>
              View and restore previous versions of this article
            </DialogDescription>
          </DialogHeader>
          
          {loadingVersions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No previous versions found</p>
              <p className="text-sm">Versions are saved automatically when you save the article</p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => (
                <div 
                  key={version.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Version {versions.length - index}</span>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs">Latest</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(version.created_at).toLocaleString()}
                    </p>
                    {version.change_note && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {version.change_note}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedVersion(version);
                      setRestoreDialogOpen(true);
                    }}
                    disabled={index === 0}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Restore Version Confirmation Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this version?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace the current article content with the selected version. 
              The current version will be saved to history before restoring.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreVersion} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Restore Version
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Schedule Publishing Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Publishing
            </DialogTitle>
            <DialogDescription>
              Set a date and time for this article to be automatically published
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
            
            {scheduleDate && scheduleTime && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Scheduled for: </span>
                  {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={saving || !scheduleDate || !scheduleTime}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Calendar className="h-4 w-4 mr-2" />}
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Live Preview Dialog */}
      <Dialog open={showLivePreview} onOpenChange={setShowLivePreview}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Live Preview
            </DialogTitle>
            <DialogDescription>
              See how your article will appear to readers
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-lg p-6 bg-white">
            {/* Article Header */}
            <div className="mb-8">
              {article.category && (
                <Badge className="mb-4">{article.category.name_en}</Badge>
              )}
              <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                {article[`title_${contentLocale}`] || article.title_en}
              </h1>
              <p className="text-xl text-muted-foreground mb-6" style={{ fontFamily: 'Source Serif 4, serif' }}>
                {article[`standfirst_${contentLocale}`] || article.standfirst_en}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>By {article.author?.name || 'Staff Writer'}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Featured Image */}
            {article.featured_image && (
              <div className="mb-8">
                <img 
                  src={article.featured_image} 
                  alt={article.featured_image_alt || ''} 
                  className="w-full rounded-lg"
                />
                {article.featured_image_caption && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {article.featured_image_caption}
                  </p>
                )}
              </div>
            )}
            
            {/* Content Blocks */}
            <div className="prose max-w-none">
              <ArticleContent blocks={contentBlocks} locale={contentLocale} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
