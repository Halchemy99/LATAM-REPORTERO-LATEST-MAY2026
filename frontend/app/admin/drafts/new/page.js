'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Bot, 
  ArrowLeft,
  Save,
  Tag,
  FileText,
  Globe,
  Link as LinkIcon
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

// Categories
const CATEGORIES = [
  'environment',
  'economy',
  'politics',
  'health',
  'education',
  'technology',
  'culture',
  'security'
];

// Regions
const REGIONS = [
  'mexico',
  'brazil',
  'argentina',
  'colombia',
  'chile',
  'peru',
  'venezuela',
  'central-america',
  'caribbean',
  'regional'
];

export default function NewDraftPage() {
  const { t } = useTranslation();
  const { user, canAccessAdminDashboard, isLoading } = useUserRole();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    body: '',
    problem_section: '',
    solutions_section: '',
    impact_section: '',
    category: '',
    region: '',
    language: 'en',
    source_name: '',
    source_url: '',
    trust_tags: [],
    tags: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTrustTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      trust_tags: prev.trust_tags.includes(tag)
        ? prev.trust_tags.filter(t => t !== tag)
        : [...prev.trust_tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    setSaving(true);
    
    try {
      const supabase = createClient();
      
      // Generate slug
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now();
      
      const articleData = {
        title: formData.title,
        slug: slug,
        excerpt: formData.excerpt,
        body: formData.body,
        problem_section: formData.problem_section,
        solutions_section: formData.solutions_section,
        impact_section: formData.impact_section,
        category: formData.category || null,
        region: formData.region || null,
        language: formData.language,
        source_name: formData.source_name || null,
        source_url: formData.source_url || null,
        trust_tags: formData.trust_tags,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        status: 'needs_review',
        author_type: 'ai',
        origin: 'manual',
        author_id: user?.id || null,
        author_name: user?.name || user?.email || null
      };

      const { data, error } = await supabase
        .from('articles')
        .insert(articleData)
        .select()
        .single();

      if (error) {
        console.error('Error creating draft:', error);
        toast.error('Failed to create draft: ' + error.message);
      } else {
        toast.success('Draft created successfully!');
        router.push('/admin/drafts');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error creating draft');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  if (!user || !canAccessAdminDashboard) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/drafts">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Create Manual Draft</h1>
                <p className="text-muted-foreground">Create an AI-assisted draft for review</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter article title..."
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt / Summary</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of the article..."
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat} className="capitalize">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select value={formData.region} onValueChange={(v) => handleChange('region', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map(reg => (
                          <SelectItem key={reg} value={reg} className="capitalize">
                            {reg.replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="water, environment, infrastructure..."
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Sections */}
            <Card>
              <CardHeader>
                <CardTitle>Content (Problem / Solutions / Impact)</CardTitle>
                <CardDescription>
                  Structure your article using the solutions-oriented journalism format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="body" className="flex items-center gap-2">
                    Main Body
                    <Badge variant="outline">Optional if using sections below</Badge>
                  </Label>
                  <Textarea
                    id="body"
                    placeholder="Main article content..."
                    value={formData.body}
                    onChange={(e) => handleChange('body', e.target.value)}
                    rows={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="problem" className="text-red-600">Problem Section</Label>
                  <Textarea
                    id="problem"
                    placeholder="What is the problem being addressed?"
                    value={formData.problem_section}
                    onChange={(e) => handleChange('problem_section', e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="solutions" className="text-green-600">Solutions Section</Label>
                  <Textarea
                    id="solutions"
                    placeholder="What solutions are being implemented?"
                    value={formData.solutions_section}
                    onChange={(e) => handleChange('solutions_section', e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="impact" className="text-blue-600">Impact Section</Label>
                  <Textarea
                    id="impact"
                    placeholder="What is the measurable impact?"
                    value={formData.impact_section}
                    onChange={(e) => handleChange('impact_section', e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Source Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Source Information
                </CardTitle>
                <CardDescription>
                  Optional: Link to original source if this draft is based on external content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source_name">Source Name</Label>
                    <Input
                      id="source_name"
                      placeholder="e.g., Reuters, El País..."
                      value={formData.source_name}
                      onChange={(e) => handleChange('source_name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="source_url">Source URL</Label>
                    <Input
                      id="source_url"
                      type="url"
                      placeholder="https://..."
                      value={formData.source_url}
                      onChange={(e) => handleChange('source_url', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={formData.language} onValueChange={(v) => handleChange('language', v)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Trust Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Trust Tags
                </CardTitle>
                <CardDescription>
                  Select descriptive tags that indicate the nature and sourcing of this content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TRUST_TAGS.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={formData.trust_tags.includes(tag)}
                        onCheckedChange={() => toggleTrustTag(tag)}
                      />
                      <label
                        htmlFor={tag}
                        className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
                
                {formData.trust_tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Selected tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.trust_tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Link href="/admin/drafts">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
