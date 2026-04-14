'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink, Settings, FileText, BarChart3 } from 'lucide-react';

const SANITY_STUDIO_URL = 'https://latamreportero.sanity.studio';

export default function AdminPage() {
  const { user, role, canAccessAdminDashboard, isLoading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !canAccessAdminDashboard)) {
      router.push('/auth/login');
    }
  }, [user, canAccessAdminDashboard, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !canAccessAdminDashboard) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Content Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage articles, drafts, and media through Sanity Studio
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sanity Studio Link */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#6110ff]" />
                  Sanity Studio
                </CardTitle>
                <CardDescription>
                  Full CMS for managing articles, drafts, and media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                  <li>• Review and publish AI-generated drafts</li>
                  <li>• Create and edit articles</li>
                  <li>• Manage media library</li>
                  <li>• Configure RSS feeds</li>
                </ul>
                <a 
                  href={SANITY_STUDIO_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-[#6110ff] hover:bg-[#4a0dd6]">
                    Open Sanity Studio
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Make.com Automation */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#6110ff]" />
                  Make.com Automation
                </CardTitle>
                <CardDescription>
                  Manage RSS ingestion and AI processing workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                  <li>• Configure RSS feed sources</li>
                  <li>• Adjust AI rewriting parameters</li>
                  <li>• Set scheduling and triggers</li>
                  <li>• Monitor automation logs</li>
                </ul>
                <a 
                  href="https://www.make.com/en/login" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full border-[#6110ff] text-[#6110ff] hover:bg-[#6110ff]/5">
                    Open Make.com
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#6110ff]" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <a href={`${SANITY_STUDIO_URL}/desk/article`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">All Articles</Button>
                </a>
                <a href={`${SANITY_STUDIO_URL}/desk/article;status=draft`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Drafts</Button>
                </a>
                <a href={`${SANITY_STUDIO_URL}/desk/media.asset`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Media Library</Button>
                </a>
                <a href={`${SANITY_STUDIO_URL}/desk/author`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Authors</Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
