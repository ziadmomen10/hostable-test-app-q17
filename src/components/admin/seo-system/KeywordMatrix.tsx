/**
 * KeywordMatrix
 * 
 * Compact 4-column keyword placement grid with inline header.
 * Optimized for narrow right panel (~320-420px).
 */

import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { PageData } from '@/hooks/queries/usePageData';

interface KeywordMatrixProps {
  focusKeyword: string;
  pageData: PageData;
  metaTitle?: string;
  metaDescription?: string;
  className?: string;
}

interface PlacementCheck {
  label: string;
  shortLabel: string;
  found: boolean;
  count?: number;
}

export function KeywordMatrix({ 
  focusKeyword, 
  pageData, 
  metaTitle,
  metaDescription,
  className 
}: KeywordMatrixProps) {
  const placements = useMemo(() => {
    if (!focusKeyword) return [];
    
    const keyword = focusKeyword.toLowerCase();
    const keywordSlug = keyword.replace(/\s+/g, '-');
    const content = pageData.content || '';
    const title = (metaTitle || pageData.page_title || '').toLowerCase();
    const description = (metaDescription || pageData.page_description || '').toLowerCase();
    const url = (pageData.page_url || '').toLowerCase();
    
    // Extract text content
    let textContent = '';
    try {
      const parsed = JSON.parse(content);
      textContent = extractText(parsed).toLowerCase();
    } catch {
      textContent = content.toLowerCase();
    }
    
    // Get first 100 words
    const first100Words = textContent.split(/\s+/).slice(0, 100).join(' ');
    
    // Count H1 and H2 occurrences
    const h1Matches = (content.match(/"type"\s*:\s*"h1"[^}]*"text"\s*:\s*"[^"]*"/gi) || [])
      .filter(h => h.toLowerCase().includes(keyword)).length;
    const h2Matches = (content.match(/"type"\s*:\s*"h2"[^}]*"text"\s*:\s*"[^"]*"/gi) || [])
      .filter(h => h.toLowerCase().includes(keyword)).length;
    
    // Check image alt texts
    const altMatches = (content.match(/"alt"\s*:\s*"[^"]*"/gi) || [])
      .filter(a => a.toLowerCase().includes(keyword)).length;
    
    const checks: PlacementCheck[] = [
      {
        label: 'Meta Title',
        shortLabel: 'Title',
        found: title.includes(keyword),
      },
      {
        label: 'Meta Description',
        shortLabel: 'Desc',
        found: description.includes(keyword),
      },
      {
        label: 'URL Slug',
        shortLabel: 'URL',
        found: url.includes(keywordSlug) || url.includes(keyword.replace(/\s+/g, '')),
      },
      {
        label: 'H1 Heading',
        shortLabel: 'H1',
        found: h1Matches > 0,
        count: h1Matches,
      },
      {
        label: 'First 100 Words',
        shortLabel: '100w',
        found: first100Words.includes(keyword),
      },
      {
        label: 'Body Content',
        shortLabel: 'Body',
        found: textContent.includes(keyword),
        count: (textContent.match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length,
      },
      {
        label: 'Image Alt Text',
        shortLabel: 'Alt',
        found: altMatches > 0,
        count: altMatches,
      },
      {
        label: 'H2 Headings',
        shortLabel: 'H2s',
        found: h2Matches > 0,
        count: h2Matches,
      },
    ];
    
    return checks;
  }, [focusKeyword, pageData, metaTitle, metaDescription]);

  if (!focusKeyword) {
    return (
      <div className={cn("text-center py-3 text-muted-foreground", className)}>
        <Target className="h-6 w-6 mx-auto mb-1.5 text-yellow-500" />
        <p className="text-[10px]">Set a focus keyword to see placement matrix</p>
      </div>
    );
  }

  const foundCount = placements.filter(p => p.found).length;
  const totalCount = placements.length;
  const score = Math.round((foundCount / totalCount) * 100);

  return (
    <TooltipProvider>
      <div className={cn("space-y-2", className)}>
        {/* Compact Header: Keyword + Score + Progress inline */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] h-5 truncate max-w-[100px]">
            "{focusKeyword}"
          </Badge>
          <span className={cn(
            "text-[10px] font-bold shrink-0",
            score >= 75 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"
          )}>
            {foundCount}/{totalCount}
          </span>
          <Progress 
            value={score} 
            className="h-1 flex-1"
          />
          <span className={cn(
            "text-[10px] font-medium shrink-0",
            score >= 75 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"
          )}>
            {score}%
          </span>
        </div>

        {/* 4-Column Compact Grid */}
        <div className="grid grid-cols-4 gap-1">
          {placements.map((placement, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className={cn(
                  "flex items-center justify-center gap-0.5 p-1 rounded text-[9px] font-medium cursor-default",
                  placement.found 
                    ? "bg-green-500/10 text-green-700 dark:text-green-400" 
                    : "bg-muted/30 text-muted-foreground"
                )}>
                  {placement.found ? (
                    <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                  ) : (
                    <XCircle className="h-2.5 w-2.5 shrink-0" />
                  )}
                  <span className="truncate">{placement.shortLabel}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>{placement.label}</p>
                {placement.count !== undefined && placement.count > 0 && (
                  <p className="text-muted-foreground">Found {placement.count}×</p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

function extractText(obj: any): string {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(extractText).join(' ');
  if (obj && typeof obj === 'object') {
    return Object.values(obj).map(extractText).join(' ');
  }
  return '';
}
