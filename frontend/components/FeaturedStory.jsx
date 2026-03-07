'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, Bot, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function FeaturedStory({ article }) {
  const { t } = useTranslation();

  if (!article) return null;

  const renderStars = (score) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= Math.round(score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image */}
        <div className="relative aspect-[16/10] md:aspect-auto">
          <img
            src={article.mainImage}
            alt={article.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden" />
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-primary text-primary-foreground">
              {t('news.featured')}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {t(`categories.${article.category}`) || article.category}
            </Badge>
            <Badge variant={article.isAiGenerated ? 'secondary' : 'default'} className="flex items-center gap-1">
              {article.isAiGenerated ? (
                <><Bot className="h-3 w-3" /> AI Verified</>
              ) : (
                <><User className="h-3 w-3" /> Human Written</>
              )}
            </Badge>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
            {article.title}
          </h2>

          <p className="text-muted-foreground mb-6 line-clamp-3">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {article.author?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{article.author?.name || 'AI Analysis'}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {renderStars(article.trustScore)}
                  <span>{article.trustScore?.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime} {t('news.minuteRead')}
              </span>
              <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          <Link href={`/article/${article.slug}`}>
            <Button className="w-full md:w-auto group">
              {t('news.readMore')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
