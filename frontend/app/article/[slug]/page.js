'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation, useUserRole } from '@/lib/providers';
import { mockArticles } from '@/lib/mock-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleVoiceBot from '@/components/ArticleVoiceBot';
import TrustScoreRating from '@/components/TrustScoreRating';
import NewsCard from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Bookmark,
  Share2,
  Heart,
  MessageCircle,
  Clock,
  Bot,
  User,
  ChevronDown,
  ExternalLink,
  DollarSign,
  Send,
  AlertTriangle,
  CheckCircle,
  Lock
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ArticlePage() {
  const params = useParams();
  const { t } = useTranslation();
  const { user, role, canAccessHumanContent } = useUserRole();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'Ana M.', text: 'This is an incredible initiative!', date: '2025-06-10' },
    { id: 2, user: 'Carlos R.', text: 'Would love to see this replicated in other cities.', date: '2025-06-09' }
  ]);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  useEffect(() => {
    const slug = params?.slug;
    if (slug) {
      setTimeout(() => {
        const found = mockArticles.find(a => a.slug === slug);
        setArticle(found || mockArticles[0]);
        setLoading(false);
      }, 300);
    }
  }, [params?.slug]);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, {
        id: comments.length + 1,
        user: user?.name || 'Guest',
        text: comment,
        date: new Date().toISOString().split('T')[0]
      }]);
      setComment('');
      toast.success('Comment added!');
    }
  };

  const relatedArticles = mockArticles
    .filter(a => a.id !== article?.id && a.category === article?.category)
    .slice(0, 3);

  // Check if user can access this article
  const needsUpgrade = article && !article.isAiGenerated && !canAccessHumanContent;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[400px] md:h-[500px]">
          <img
            src={article.mainImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary">
                  {t(`categories.${article.category}`) || article.category}
                </Badge>
                <Badge variant="outline" className="bg-black/30 text-white border-white/30">
                  {t(`regions.${article.region}`) || article.region}
                </Badge>
                <Badge 
                  className={article.isAiGenerated 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-green-600 text-white'
                  }
                >
                  {article.isAiGenerated ? (
                    <><Bot className="h-3 w-3 mr-1" /> AI Verified</>
                  ) : (
                    <><User className="h-3 w-3 mr-1" /> Human Written</>
                  )}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
                {article.title}
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                {article.excerpt}
              </p>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Author Info */}
              <div className="flex items-center justify-between mb-8 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {article.isAiGenerated ? (
                      <Bot className="h-6 w-6 text-primary" />
                    ) : (
                      <span className="text-primary font-semibold text-lg">
                        {article.author?.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{article.author?.name || 'AI Analysis'}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <TrustScoreRating score={article.trustScore} size="small" />
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime} {t('news.minuteRead')}
                      </span>
                      <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handleLike}>
                    <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleBookmark}>
                    <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Paywall for Human Content */}
              {needsUpgrade ? (
                <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="p-8 text-center">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-amber-600" />
                    <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                    <p className="text-muted-foreground mb-6">
                      This human-written article requires a paid subscription to read.
                    </p>
                    <Link href="/pricing">
                      <Button size="lg">Upgrade to Read</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Problem Section */}
                  <section className="mb-8">
                    <div className="problem-section">
                      <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        {t('article.problem')}
                      </h2>
                      <div 
                        className="article-content text-red-900/80 dark:text-red-200/80"
                        dangerouslySetInnerHTML={{ __html: article.problem }}
                      />
                    </div>
                  </section>

                  {/* Solutions Section */}
                  <section className="mb-8">
                    <div className="solutions-section">
                      <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        {t('article.solutions')}
                      </h2>
                      <div 
                        className="article-content text-blue-900/80 dark:text-blue-200/80"
                        dangerouslySetInnerHTML={{ __html: article.solutions }}
                      />
                    </div>
                  </section>

                  {/* Impact Section */}
                  <section className="mb-8">
                    <div className="impact-section">
                      <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        {t('article.impact')}
                      </h2>
                      <div 
                        className="article-content text-green-900/80 dark:text-green-200/80"
                        dangerouslySetInnerHTML={{ __html: article.impact }}
                      />
                    </div>
                  </section>

                  {/* Sources */}
                  {article.sources && article.sources.length > 0 && (
                    <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full justify-between mb-4">
                          {t('article.sources')} ({article.sources.length})
                          <ChevronDown className={`h-4 w-4 transition-transform ${sourcesOpen ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Card>
                          <CardContent className="p-4">
                            <ul className="space-y-2">
                              {article.sources.map((source, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                  <a href={source.url} className="text-primary hover:underline">
                                    {source.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </>
              )}

              {/* Comments Section */}
              <section className="mt-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t('article.comments')} ({comments.length})
                </h3>
                
                <form onSubmit={handleComment} className="flex gap-2 mb-6">
                  <Input
                    placeholder={t('article.addComment')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>

                <div className="space-y-4">
                  {comments.map((c) => (
                    <Card key={c.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{c.user}</span>
                          <span className="text-xs text-muted-foreground">{c.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{c.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Support Writer */}
              {!article.isAiGenerated && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      {t('article.supportWriter')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      85% of your contribution goes directly to {article.author?.name}.
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <Button variant="outline" onClick={() => toast.success('Demo: £1 tip sent!')}>$1</Button>
                      <Button variant="outline" onClick={() => toast.success('Demo: £5 tip sent!')}>$5</Button>
                      <Button variant="outline" onClick={() => toast.success('Demo: £10 tip sent!')}>$10</Button>
                    </div>
                    <Button className="w-full" onClick={() => toast.success('Demo: Custom tip!')}>Custom Amount</Button>
                  </CardContent>
                </Card>
              )}

              {/* Related Articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('article.relatedArticles')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedArticles.length > 0 ? (
                    relatedArticles.map((related) => (
                      <Link key={related.id} href={`/article/${related.slug}`}>
                        <div className="flex gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                          <img
                            src={related.mainImage}
                            alt={related.title}
                            className="w-20 h-16 object-cover rounded"
                          />
                          <div>
                            <h4 className="text-sm font-medium line-clamp-2">{related.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {related.readTime} {t('news.minuteRead')}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No related articles found.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ArticleVoiceBot - AI Assistant for article Q&A */}
      {article && !needsUpgrade && <ArticleVoiceBot article={article} />}
    </div>
  );
}
