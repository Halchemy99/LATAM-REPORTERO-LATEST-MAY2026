'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import SanityPortableText from '@/components/SanityPortableText';
import ArticlePodcastPlayer from '@/components/ArticlePodcastPlayer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bookmark, Share2, Heart, MessageCircle, Clock,
  Send, Lock, ArrowLeft,
} from 'lucide-react';
import VerifiedBadge from '@/components/VerifiedBadge';
import { toast } from 'sonner';

export default function ArticlePage() {
  const params = useParams();
  const { t, locale } = useTranslation();
  const { user, role, canAccessHumanContent, isSubscribed } = useUserRole();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

  // Load article
  useEffect(() => {
    const loadArticle = async () => {
      const slug = params?.slug;
      if (!slug) return;
      
      try {
        setLoading(true);
        const resp = await fetch(`${API_URL}/api/sanity/article/${encodeURIComponent(slug)}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.article) {
            setArticle(data.article);
          }
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [params?.slug, API_URL]);

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      const slug = params?.slug;
      if (!slug) return;
      try {
        setCommentsLoading(true);
        const resp = await fetch(`${API_URL}/api/comments/${encodeURIComponent(slug)}`);
        if (resp.ok) {
          const data = await resp.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error('Error loading comments:', err);
      } finally {
        setCommentsLoading(false);
      }
    };
    loadComments();
  }, [params?.slug, API_URL]);

  // Load related articles
  useEffect(() => {
    if (!article) return;
    const loadRelated = async () => {
      try {
        const resp = await fetch(`${API_URL}/api/sanity/articles?language=${article.language || 'en'}&limit=20`);
        if (resp.ok) {
          const data = await resp.json();
          const related = (data.articles || [])
            .filter(a => a._id !== article._id && a.category === article.category)
            .slice(0, 3);
          setRelatedArticles(related);
        }
      } catch (err) {
        console.error('Error loading related:', err);
      }
    };
    loadRelated();
  }, [article, API_URL]);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleLike = () => setLiked(!liked);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    if (!user) {
      toast.error('Please log in to comment.');
      return;
    }
    
    if (!isSubscribed && !['contributor', 'editor', 'admin'].includes(role)) {
      toast.error('Only subscribers can leave comments. Please subscribe.');
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_slug: params.slug,
          user_email: user.email,
          user_name: user.name || user.email?.split('@')[0],
          content: comment,
          user_role: role
        }),
      });
      
      if (resp.ok) {
        const data = await resp.json();
        setComments(prev => [...prev, data.comment]);
        setComment('');
        toast.success('Comment added!');
      } else {
        const err = await resp.json();
        toast.error(err.detail || 'Failed to add comment.');
      }
    } catch (err) {
      toast.error('Failed to add comment.');
    }
  };

  const needsUpgrade = article && !article.isAiGenerated && !canAccessHumanContent;

  // Real read time: extract all text from Portable Text body, count words, ÷ 200
  const readTime = (() => {
    if (!article?.body) return 5;
    const extractText = (blocks) => {
      if (!Array.isArray(blocks)) return '';
      return blocks.flatMap(block => {
        if (block._type === 'block' && Array.isArray(block.children)) {
          return block.children.map(span => span.text || '').join(' ');
        }
        return '';
      }).join(' ');
    };
    const wordCount = extractText(article.body).trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  })();
  const articleSlug = article?.slug ? (typeof article.slug === 'object' ? article.slug.current : article.slug) : '';
  const canComment = user && (isSubscribed || ['contributor', 'editor', 'admin'].includes(role));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
        <Header />
        <main className="flex-1 container py-8">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-serif font-bold mb-4 text-[#1a1a1a]">Article Not Found</h1>
            <Link href="/">
              <Button className="rounded-none bg-[#1a1a1a]">Return Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F6]">
      <Header />
      
      <main className="flex-1">
        {/* Article Header */}
        <div className="bg-[#1a1a1a] text-white">
          <div className="container py-10">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Stories
            </Link>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-[#6111ff] text-white rounded-none font-mono text-xs uppercase tracking-wider">
                {article.category || 'General'}
              </Badge>
              {article.region && (
                <Badge variant="outline" className="text-white/80 border-white/30 rounded-none font-mono text-xs uppercase tracking-wider">
                  {article.region}
                </Badge>
              )}
              {article.aiDisclosure && (
                <Badge variant="outline" className="text-white/60 border-white/20 rounded-none font-mono text-xs uppercase tracking-wider">
                  {article.aiDisclosure}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 max-w-4xl leading-tight" data-testid="article-title">
              {article.title}
            </h1>
            
            {article.standfirst && (
              <p className="text-lg text-white/80 max-w-2xl font-serif leading-relaxed">
                {article.standfirst}
              </p>
            )}
            
            <div className="flex items-center gap-4 mt-6 text-sm text-white/60 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span>{article.authorName || 'LATAM Reportero'}</span>
                {(article.authorVerified || article.authorVerificationLevel) && (
                  <VerifiedBadge
                    level={article.authorVerificationLevel || 'id-verified'}
                    size="sm"
                  />
                )}
              </span>
              <span className="text-white/30">&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readTime} min read
              </span>
              {article.publishedAt && (
                <>
                  <span className="text-white/30">&bull;</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Action Bar */}
              <div className="flex items-center justify-between mb-8 p-4 bg-white border border-[#1a1a1a]/10">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handleLike} className="rounded-none" data-testid="like-btn">
                    <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : 'text-[#666666]'}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleBookmark} className="rounded-none" data-testid="bookmark-btn">
                    <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-[#6111ff] text-[#6111ff]' : 'text-[#666666]'}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-none" data-testid="share-btn">
                    <Share2 className="h-5 w-5 text-[#666666]" />
                  </Button>
                </div>
              </div>

              {/* Podcast Player */}
              <ArticlePodcastPlayer article={article} />

              {/* Paywall for Human Content */}
              {needsUpgrade ? (
                <Card className="border-[#6111ff]/30 bg-white">
                  <CardContent className="p-8 text-center">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-[#6111ff]" />
                    <h3 className="text-xl font-serif font-bold mb-2 text-[#1a1a1a]">Premium Content</h3>
                    <p className="text-[#666666] mb-6">
                      This human-written article requires a paid subscription to read.
                    </p>
                    <Link href="/pricing">
                      <Button className="bg-[#6111ff] hover:bg-[#4a0dd6] text-white rounded-none">Upgrade to Read</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-white border border-[#1a1a1a]/10 p-6 md:p-10">
                  <SanityPortableText content={article.body} />
                </div>
              )}

              {/* Comments Section */}
              <section className="mt-8 bg-white border border-[#1a1a1a]/10 p-6" data-testid="comments-section">
                <h3 className="text-lg font-serif font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-[#6111ff]" />
                  Comments ({comments.length})
                </h3>
                
                {canComment ? (
                  <form onSubmit={handleComment} className="flex gap-2 mb-6" data-testid="comment-form">
                    <Input
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="rounded-none border-[#1a1a1a]/20"
                      data-testid="comment-input"
                    />
                    <Button type="submit" className="rounded-none bg-[#1a1a1a]" data-testid="comment-submit">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10" data-testid="comment-gate">
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                      <Lock className="h-4 w-4 text-[#6111ff]" />
                      {!user ? (
                        <span>
                          <Link href="/auth/login" className="text-[#6111ff] hover:underline">Log in</Link> and subscribe to leave comments.
                        </span>
                      ) : (
                        <span>
                          Only subscribers can comment. <Link href="/pricing" className="text-[#6111ff] hover:underline">Subscribe now</Link>.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {commentsLoading ? (
                    <div className="text-sm text-[#666666]">Loading comments...</div>
                  ) : comments.length === 0 ? (
                    <div className="text-sm text-[#666666]">No comments yet. Be the first to share your thoughts.</div>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="border-b border-[#1a1a1a]/5 pb-3 last:border-0" data-testid={`comment-${c.id}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-[#1a1a1a]">{c.user_name}</span>
                          <span className="text-xs text-[#666666]">{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-[#666666]">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Articles */}
              <div className="bg-white border border-[#1a1a1a]/10 p-5">
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#1a1a1a] font-semibold mb-4 pb-2 border-b border-[#1a1a1a]/10">
                  Related Stories
                </h3>
                {relatedArticles.length > 0 ? (
                  <div className="space-y-4">
                    {relatedArticles.map((related) => {
                      const relSlug = typeof related.slug === 'object' ? related.slug.current : related.slug;
                      return (
                        <Link key={related._id} href={`/article/${relSlug}`} className="block group">
                          <h4 className="text-sm font-serif font-medium text-[#1a1a1a] group-hover:text-[#6111ff] transition-colors line-clamp-2 mb-1">
                            {related.title}
                          </h4>
                          <span className="text-xs text-[#666666] font-mono uppercase tracking-wider">
                            {related.category}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[#666666]">No related articles found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
