/**
 * SEOOverlayFilters
 * 
 * Compact filter bar for toggling overlay element visibility.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Heading1, 
  Heading2, 
  Image, 
  Link2, 
  ExternalLink, 
  Code2, 
  FileText, 
  Accessibility,
  AlertTriangle,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SEOOverlayFilters as FilterType } from './types';

interface SEOOverlayFiltersProps {
  filters: FilterType;
  onToggle: (key: keyof FilterType) => void;
  issueCount: number;
  className?: string;
}

const FILTER_CONFIG: Array<{
  key: keyof FilterType;
  icon: React.ElementType;
  label: string;
  shortcut?: string;
}> = [
  { key: 'h1', icon: Heading1, label: 'H1', shortcut: '1' },
  { key: 'h2h6', icon: Heading2, label: 'H2-H6', shortcut: '2' },
  { key: 'images', icon: Image, label: 'Images', shortcut: '3' },
  { key: 'linksInternal', icon: Link2, label: 'Internal Links', shortcut: '4' },
  { key: 'linksExternal', icon: ExternalLink, label: 'External Links', shortcut: '5' },
  { key: 'schema', icon: Code2, label: 'Schema', shortcut: '6' },
  { key: 'meta', icon: FileText, label: 'Meta Tags', shortcut: '7' },
  { key: 'accessibility', icon: Accessibility, label: 'Accessibility', shortcut: '8' },
];

export function SEOOverlayFilters({ 
  filters, 
  onToggle, 
  issueCount,
  className 
}: SEOOverlayFiltersProps) {
  return (
    <div className={cn("flex items-center gap-0.5 flex-wrap", className)}>
      {/* Element type filters */}
      {FILTER_CONFIG.map(({ key, icon: Icon, label, shortcut }) => (
        <Tooltip key={key}>
          <TooltipTrigger asChild>
            <Button
              variant={filters[key] ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-6 w-6 p-0 rounded",
                filters[key] && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={() => onToggle(key)}
            >
              <Icon className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-[10px]">
            <p>{label} {shortcut && <span className="text-muted-foreground ml-1">({shortcut})</span>}</p>
          </TooltipContent>
        </Tooltip>
      ))}

      {/* Divider */}
      <div className="w-px h-4 bg-border mx-1" />

      {/* Special filters */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={filters.issuesOnly ? "destructive" : "ghost"}
            size="sm"
            className={cn(
              "h-6 px-1.5 rounded text-[9px] gap-0.5",
              filters.issuesOnly && "bg-destructive text-destructive-foreground"
            )}
            onClick={() => onToggle('issuesOnly')}
          >
            <AlertTriangle className="h-3 w-3" />
            {issueCount > 0 && <span>{issueCount}</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-[10px]">
          <p>Issues Only (I)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={filters.keywordFocused ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "h-6 w-6 p-0 rounded",
              filters.keywordFocused && "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30"
            )}
            onClick={() => onToggle('keywordFocused')}
          >
            <Target className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-[10px]">
          <p>Keyword Focus (K)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
