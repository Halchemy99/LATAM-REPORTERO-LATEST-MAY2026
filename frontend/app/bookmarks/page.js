'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, BookmarkX, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function BookmarksPage() {
  const { t } = useTranslation();
  const { user, isLoading } = useUserRole();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          id,
          created_at,
          article:articles (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setBookmarks(data);
      }
      setLoading(false);
    };
    
    if (user?.id) {
      fetchBookmarks();
    }
  }, [user?.id]);

  const removeBookmark = async (bookmarkId) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmarkId);
    
    if (!error) {
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      toast.success('Bookmark removed');
    } else {
      toast.error('Failed to remove bookmark');
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
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Bookmark className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Saved Articles</h1>
              <p className="text-muted-foreground">Your bookmarked articles for later reading</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : bookmarks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookmarkX className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Bookmarks Yet</h2>
                <p className="text-muted-foreground mb-4 text-center">
                  Start saving articles you want to read later by clicking the bookmark icon.
                </p>
                <Link href="/investigations">
                  <Button>Browse Articles</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="relative group">
                  {bookmark.article && (
                    <NewsCard article={bookmark.article} />
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeBookmark(bookmark.id)}
                  >
                    <BookmarkX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
