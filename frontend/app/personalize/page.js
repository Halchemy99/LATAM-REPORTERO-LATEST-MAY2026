'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation, useUserRole } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Globe, MapPin, Tag, Save, Check } from 'lucide-react';
import { toast } from 'sonner';

const REGIONS = [
  { id: 'mexico', name: 'Mexico', flag: '🇲🇽' },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷' },
  { id: 'argentina', name: 'Argentina', flag: '🇦🇷' },
  { id: 'colombia', name: 'Colombia', flag: '🇨🇴' },
  { id: 'chile', name: 'Chile', flag: '🇨🇱' },
  { id: 'peru', name: 'Peru', flag: '🇵🇪' },
  { id: 'venezuela', name: 'Venezuela', flag: '🇻🇪' },
  { id: 'central-america', name: 'Central America', flag: '🌎' },
  { id: 'caribbean', name: 'Caribbean', flag: '🏝️' },
];

const CATEGORIES = [
  { id: 'environment', name: 'Environment', icon: '🌿' },
  { id: 'economy', name: 'Economy', icon: '💰' },
  { id: 'politics', name: 'Politics', icon: '🏛️' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'culture', name: 'Culture', icon: '🎨' },
  { id: 'security', name: 'Security', icon: '🛡️' },
];

export default function PersonalizePage() {
  const { t } = useTranslation();
  const { user, isLoading } = useUserRole();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [preferences, setPreferences] = useState({
    language: 'en',
    regions: [],
    categories: [],
    emailDigest: true,
    pushNotifications: false
  });

  useEffect(() => {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading preferences:', e);
      }
    }
  }, []);

  const toggleRegion = (regionId) => {
    setPreferences(prev => ({
      ...prev,
      regions: prev.regions.includes(regionId)
        ? prev.regions.filter(r => r !== regionId)
        : [...prev.regions, regionId]
    }));
  };

  const toggleCategory = (categoryId) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // If user is logged in, save to database
      if (user?.id) {
        const supabase = createClient();
        await supabase
          .from('users')
          .update({
            preferred_language: preferences.language,
            preferred_regions: preferences.regions,
            preferred_categories: preferences.categories
          })
          .eq('id', user.id);
      }
      
      setSaved(true);
      toast.success('Preferences saved!');
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Personalize Your News</h1>
              <p className="text-muted-foreground">Customize your news feed to see what matters to you</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Language */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language Preference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={preferences.language}
                  onValueChange={(v) => setPreferences(prev => ({ ...prev, language: v }))}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                    <SelectItem value="pt">🇧🇷 Português</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Regions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Preferred Regions
                </CardTitle>
                <CardDescription>Select the regions you want to follow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {REGIONS.map((region) => (
                    <div
                      key={region.id}
                      onClick={() => toggleRegion(region.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
                        preferences.regions.includes(region.id)
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <span className="text-xl">{region.flag}</span>
                      <span className="font-medium">{region.name}</span>
                      {preferences.regions.includes(region.id) && (
                        <Check className="h-4 w-4 text-primary ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Preferred Topics
                </CardTitle>
                <CardDescription>Select the topics you're interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors text-center ${
                        preferences.categories.includes(category.id)
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-digest" className="font-medium">Email Digest</Label>
                    <p className="text-sm text-muted-foreground">Receive a daily summary of top stories</p>
                  </div>
                  <Checkbox
                    id="email-digest"
                    checked={preferences.emailDigest}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailDigest: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push" className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified about breaking news</p>
                  </div>
                  <Checkbox
                    id="push"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving} className="min-w-[150px]">
                {saved ? (
                  <><Check className="h-4 w-4 mr-2" /> Saved!</>
                ) : saving ? (
                  'Saving...'
                ) : (
                  <><Save className="h-4 w-4 mr-2" /> Save Preferences</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
