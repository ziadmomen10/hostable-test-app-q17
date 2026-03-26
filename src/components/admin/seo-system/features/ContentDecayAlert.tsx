/**
 * ContentDecayAlert
 * 
 * Warning banner component for stale content detection.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Sparkles,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useContentDecay, type DecayStatus } from '../hooks/useContentDecay';

interface ContentDecayAlertProps {
  pageId: string;
  pageContent?: string;
  compact?: boolean;
}

const severityStyles: Record<DecayStatus['severity'], { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  fresh: {
    bg: 'bg-green-50/50 dark:bg-green-500/10',
    border: 'border-green-200 dark:border-green-500/30',
    text: 'text-green-600 dark:text-green-400',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  aging: {
    bg: 'bg-yellow-50/50 dark:bg-yellow-500/10',
    border: 'border-yellow-200 dark:border-yellow-500/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  stale: {
    bg: 'bg-orange-50/50 dark:bg-orange-500/10',
    border: 'border-orange-200 dark:border-orange-500/30',
    text: 'text-orange-600 dark:text-orange-400',
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  critical: {
    bg: 'bg-red-50/50 dark:bg-red-500/10',
    border: 'border-red-200 dark:border-red-500/30',
    text: 'text-red-600 dark:text-red-400',
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
};

export function ContentDecayAlert({ pageId, pageContent, compact = false }: ContentDecayAlertProps) {
  const {
    freshness,
    decayStatus,
    isLoading,
    checkFreshness,
    isChecking,
    generateSuggestions,
    isGeneratingSuggestions,
  } = useContentDecay(pageId);

  if (!pageId || isLoading) return null;

  const style = severityStyles[decayStatus.severity];
  const suggestions = freshness?.refresh_suggestions || [];

  // Compact mode - just show badge
  if (compact) {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "h-5 px-1.5 text-[9px]",
          style.border, style.bg, style.text
        )}
      >
        {style.icon}
        <span className="ml-1">{decayStatus.freshnessScore}%</span>
      </Badge>
    );
  }

  // Full alert mode
  return (
    <div className={cn(
      "p-2 rounded-md border",
      style.border, style.bg
    )}>
      <div className="flex items-start gap-2">
        <span className={cn("mt-0.5 shrink-0", style.text)}>
          {style.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className={cn("text-xs font-medium", style.text)}>
            Content Freshness: {decayStatus.freshnessScore}%
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {decayStatus.message}
            {decayStatus.monthsSinceUpdate > 0 && (
              <span> · Updated {decayStatus.monthsSinceUpdate} month{decayStatus.monthsSinceUpdate !== 1 ? 's' : ''} ago</span>
            )}
          </p>
          
          {/* Refresh Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-[9px] font-medium text-muted-foreground">Suggestions:</p>
              {suggestions.slice(0, 3).map((suggestion, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-1.5 text-[10px] text-muted-foreground"
                >
                  <Sparkles className="h-2.5 w-2.5 mt-0.5 text-purple-500" />
                  <span>{suggestion.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[9px]"
            onClick={() => checkFreshness()}
            disabled={isChecking}
          >
            {isChecking ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
          
          {decayStatus.severity !== 'fresh' && pageContent && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[9px]"
              onClick={() => generateSuggestions(pageContent)}
              disabled={isGeneratingSuggestions}
            >
              {isGeneratingSuggestions ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
