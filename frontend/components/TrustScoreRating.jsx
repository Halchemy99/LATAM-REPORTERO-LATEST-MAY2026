'use client';

import { Star, StarHalf } from 'lucide-react';

export default function TrustScoreRating({ score, showNumber = true, size = 'default' }) {
  const sizeClass = size === 'large' ? 'h-5 w-5' : size === 'small' ? 'h-3 w-3' : 'h-4 w-4';
  
  const fullStars = Math.floor(score);
  const hasHalf = score - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${sizeClass} fill-yellow-400 text-yellow-400`} />
      ))}
      
      {/* Half star */}
      {hasHalf && (
        <div className="relative">
          <Star className={`${sizeClass} text-gray-300`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${sizeClass} fill-yellow-400 text-yellow-400`} />
          </div>
        </div>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${sizeClass} text-gray-300`} />
      ))}
      
      {showNumber && (
        <span className="ml-1 text-sm text-muted-foreground">{score.toFixed(1)}</span>
      )}
    </div>
  );
}
