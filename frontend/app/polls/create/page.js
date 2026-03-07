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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2, Save, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['environment', 'economy', 'politics', 'health', 'education', 'technology', 'culture'];
const REGIONS = ['mexico', 'brazil', 'argentina', 'colombia', 'chile', 'peru', 'venezuela', 'central-america', 'caribbean', 'regional'];

export default function CreatePollPage() {
  const { t } = useTranslation();
  const { user, role, canAccessAdminDashboard } = useUserRole();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    title_es: '',
    description: '',
    description_es: '',
    options: ['', ''],
    category: '',
    region: '',
    ends_at: ''
  });

  const canCreate = role === 'admin' || role === 'editor';

  if (!canCreate) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">Only editors and admins can create polls.</p>
              <Link href="/polls">
                <Button>View Polls</Button>
              </Link>
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

  const addOption = () => {
    if (formData.options.length >= 6) {
      toast.error('Maximum 6 options allowed');
      return;
    }
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) {
      toast.error('Minimum 2 options required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const updateOption = (index, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    const validOptions = formData.options.filter(o => o.trim());
    if (validOptions.length < 2) {
      toast.error('At least 2 options are required');
      return;
    }
    
    setSaving(true);
    
    try {
      const supabase = createClient();
      
      const pollData = {
        title: formData.title,
        title_es: formData.title_es || null,
        description: formData.description || null,
        description_es: formData.description_es || null,
        options: validOptions,
        category: formData.category || null,
        region: formData.region || null,
        ends_at: formData.ends_at || null,
        created_by: user?.id
      };

      const { data, error } = await supabase
        .from('polls')
        .insert(pollData)
        .select()
        .single();

      if (error) {
        console.error('Error creating poll:', error);
        toast.error('Failed to create poll: ' + error.message);
      } else {
        toast.success('Poll created successfully!');
        router.push('/polls');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error creating poll');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-2xl">
          <Link href="/polls" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Create Poll</h1>
              <p className="text-muted-foreground">Engage the community with a new poll</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle>Poll Question</CardTitle>
                <CardDescription>The main question you want to ask</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title (English) *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="What do you want to ask?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_es">Title (Spanish)</Label>
                  <Input
                    id="title_es"
                    value={formData.title_es}
                    onChange={(e) => handleChange('title_es', e.target.value)}
                    placeholder="¿Qué quieres preguntar?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Additional context for the poll"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle>Poll Options</CardTitle>
                <CardDescription>Add 2-6 options for voters to choose from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={formData.options.length <= 2}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  disabled={formData.options.length >= 6}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Poll Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="ends_at">End Date</Label>
                  <Input
                    id="ends_at"
                    type="date"
                    value={formData.ends_at}
                    onChange={(e) => handleChange('ends_at', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Link href="/polls">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Creating...' : 'Create Poll'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
