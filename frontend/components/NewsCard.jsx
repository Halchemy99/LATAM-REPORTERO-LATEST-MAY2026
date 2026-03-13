'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import { getLocalizedContent } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock, Bot, User } from 'lucide-react';
import { format } from 'date-fns';

export default function NewsCard({ article }) {
  const { t, locale } = useTranslation();
  
  // Helper to safely get localized content
  const getContent = (content) => getLocalizedContent(content, locale);

  const categoryColors = {
    environment: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    economy: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    education: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    politics: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    technology: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  };

  const renderStars = (score) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= Math.round(score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Link href={`/article/${article.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.mainImage}
            alt={article.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={categoryColors[article.category] || 'bg-gray-100 text-gray-800'}>
              {t(`categories.${article.category}`) || article.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant={article.isAiGenerated ? 'secondary' : 'default'} className="flex items-center gap-1">
              {article.isAiGenerated ? (
                <><Bot className="h-3 w-3" /> AI</>
              ) : (
                <><User className="h-3 w-3" /> Human</>
              )}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {getContent(article.title)}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {getContent(article.excerpt)}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{article.author?.name || 'AI Analysis'}</span>
              {article.trustScore && renderStars(article.trustScore)}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readTime} {t('news.minuteRead')}
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {format(new Date(article.publishedAt), 'MMM d, yyyy')}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
