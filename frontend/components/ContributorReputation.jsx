'use client';

import { CheckCircle, Award, Clock, FileText, ThumbsUp, Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * ContributorReputation - Reddit-like reputation system for journalists
 * Replaces numerical trust scores with transparent credibility signals
 */
export default function ContributorReputation({ 
  contributor, 
  variant = 'default', // 'default' | 'compact' | 'full'
  showStats = true 
}) {
  if (!contributor) return null;

  const {
    verified = false,
    isEditor = false,
    isEditoriallyReviewed = false,
    articleCount = 0,
    yearsContributing = 0,
    upvotes = 0,
    role = 'contributor'
  } = contributor;

  // Determine badges to show
  const badges = [];

  if (verified) {
    badges.push({
      id: 'verified',
      label: 'Verified Contributor',
      shortLabel: 'Verified',
      icon: CheckCircle,
      className: 'badge-verified',
      tooltip: 'Identity verified by LATAM Reportero editorial team'
    });
  }

  if (role === 'editor' || isEditor) {
    badges.push({
      id: 'editor',
      label: 'Editorial Staff',
      shortLabel: 'Editor',
      icon: Shield,
      className: 'badge-editor',
      tooltip: 'Member of the editorial team'
    });
  }

  if (yearsContributing >= 2) {
    badges.push({
      id: 'longtime',
      label: `${yearsContributing}+ Years`,
      shortLabel: `${yearsContributing}yr`,
      icon: Clock,
      className: 'badge-longtime',
      tooltip: `Contributing since ${new Date().getFullYear() - yearsContributing}`
    });
  }

  if (isEditoriallyReviewed) {
    badges.push({
      id: 'reviewed',
      label: 'Editorially Reviewed',
      shortLabel: 'Reviewed',
      icon: Award,
      className: 'badge-reviewed',
      tooltip: 'Work regularly reviewed by editorial board'
    });
  }

  // Compact variant - just icons
  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-1" data-testid="contributor-reputation-compact">
          {badges.slice(0, 3).map(badge => (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <span className={`contributor-badge ${badge.className} p-1`}>
                  <badge.icon className="h-3 w-3" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{badge.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    );
  }

  // Full variant - with stats
  if (variant === 'full') {
    return (
      <TooltipProvider>
        <div className="space-y-3" data-testid="contributor-reputation-full">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {badges.map(badge => (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <span className={`contributor-badge ${badge.className}`}>
                    <badge.icon className="h-3.5 w-3.5" />
                    {badge.label}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badge.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Stats */}
          {showStats && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{articleCount} articles</span>
              </div>
              {upvotes > 0 && (
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{upvotes.toLocaleString()} upvotes</span>
                </div>
              )}
            </div>
          )}
        </div>
      </TooltipProvider>
    );
  }

  // Default variant
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2" data-testid="contributor-reputation">
        {badges.map(badge => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <span className={`contributor-badge ${badge.className}`}>
                <badge.icon className="h-3.5 w-3.5" />
                {badge.shortLabel}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{badge.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {showStats && articleCount > 0 && (
          <span className="text-xs text-muted-foreground">
            {articleCount} articles
          </span>
        )}
      </div>
    </TooltipProvider>
  );
}

/**
 * Simple badge for inline use in article bylines
 */
export function ContributorBadge({ type, label }) {
  const badgeConfig = {
    verified: { icon: CheckCircle, className: 'badge-verified' },
    editor: { icon: Shield, className: 'badge-editor' },
    longtime: { icon: Clock, className: 'badge-longtime' },
    reviewed: { icon: Award, className: 'badge-reviewed' },
  };

  const config = badgeConfig[type];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span className={`contributor-badge ${config.className}`} data-testid={`badge-${type}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
