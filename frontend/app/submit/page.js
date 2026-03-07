'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation, useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  PenTool, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp,
  Save,
  Send,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

export default function SubmitStoryPage() {
  const { t } = useTranslation();
  const { user, canSubmitStories, isLoading } = useUserRole();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    region: '',
    problem: '',
    solutions: '',
    impact: '',
    sources: ''
  });
  const [saving, setSaving] = useState(false);

  if (!isLoading && (!user || !canSubmitStories)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <PenTool className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-bold mb-2">Contributor Access Required</h2>
              <p className="text-muted-foreground mb-4">
                You need to be a contributor to submit stories. Please log in with a contributor account or apply to become one.
              </p>
              <Button onClick={() => router.push('/auth/login')}>
                Log In
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      toast.success('Draft saved!');
      setSaving(false);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.problem || !formData.solutions || !formData.impact) {
      toast.error('Please fill in all required sections');
      return;
    }
    toast.success('Story submitted for review!');
    router.push('/contributor/dashboard');
  };

  const categories = ['environment', 'economy', 'health', 'education', 'politics', 'technology', 'culture', 'society'];
  const regions = ['mexico', 'brazil', 'argentina', 'chile', 'colombia', 'peru', 'venezuela', 'ecuador'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <PenTool className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{t('contributor.submitStory')}</h1>
              <p className="text-muted-foreground">Follow the Problem → Solutions → Impact format</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Title, category, and summary of your story</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a compelling headline..."
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {t(`categories.${cat}`) || cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Region *</Label>
                    <Select value={formData.region} onValueChange={(v) => handleChange('region', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map(reg => (
                          <SelectItem key={reg} value={reg}>
                            {t(`regions.${reg}`) || reg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt / Summary</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="A brief summary of your story (1-2 sentences)..."
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Problem Section */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  {t('article.problem')} *
                </CardTitle>
                <CardDescription>
                  Describe the problem or challenge your story addresses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What is the problem? Who is affected? What are the stakes?..."
                  value={formData.problem}
                  onChange={(e) => handleChange('problem', e.target.value)}
                  rows={6}
                  className="border-red-200 focus:border-red-500"
                  required
                />
              </CardContent>
            </Card>

            {/* Solutions Section */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Lightbulb className="h-5 w-5" />
                  {t('article.solutions')} *
                </CardTitle>
                <CardDescription>
                  What solutions are being implemented or proposed?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What solutions exist? Who is implementing them? How do they work?..."
                  value={formData.solutions}
                  onChange={(e) => handleChange('solutions', e.target.value)}
                  rows={6}
                  className="border-blue-200 focus:border-blue-500"
                  required
                />
              </CardContent>
            </Card>

            {/* Impact Section */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="h-5 w-5" />
                  {t('article.impact')} *
                </CardTitle>
                <CardDescription>
                  What measurable impact have these solutions had?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What results have been achieved? Include data and metrics if available..."
                  value={formData.impact}
                  onChange={(e) => handleChange('impact', e.target.value)}
                  rows={6}
                  className="border-green-200 focus:border-green-500"
                  required
                />
              </CardContent>
            </Card>

            {/* Sources */}
            <Card>
              <CardHeader>
                <CardTitle>{t('article.sources')}</CardTitle>
                <CardDescription>
                  List your sources (one per line). Include links where possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Source 1 - https://example.com
Source 2 - Interview with...
Source 3 - Official report from..."
                  value={formData.sources}
                  onChange={(e) => handleChange('sources', e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Submit for Review
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
