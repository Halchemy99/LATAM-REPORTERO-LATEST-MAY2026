'use client';

import { useState, useEffect } from 'react';
import { useUserRole, useTranslation } from '@/lib/providers';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function BookmarkButton({ articleId, articleSlug, variant = 'ghost', size = 'icon', showText = false }) {
  const { user } = useUserRole();
  const { t } = useTranslation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkBookmark = async () => {
      if (!user?.id || !articleId) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('article_id', articleId)
        .single();

      if (!error && data) {
        setIsBookmarked(true);
      }
    };

    checkBookmark();
  }, [user?.id, articleId]);

  const toggleBookmark = async () => {
    if (!user) {
      toast.error(t('Please login to bookmark articles'));
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', articleId);

        if (!error) {
          setIsBookmarked(false);
          toast.success(t('Bookmark removed'));
        }
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            article_id: articleId
          });

        if (!error) {
          setIsBookmarked(true);
          toast.success(t('Article bookmarked!'));
        }
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      toast.error(t('Failed to update bookmark'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleBookmark}
      disabled={loading}
      className={isBookmarked ? 'text-primary' : ''}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-5 w-5" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
      {showText && (
        <span className="ml-2">{isBookmarked ? t('Saved') : t('Save')}</span>
      )}
    </Button>
  );
}
