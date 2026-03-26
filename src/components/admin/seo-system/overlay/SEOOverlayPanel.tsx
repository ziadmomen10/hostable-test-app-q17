/**
 * SEOOverlayPanel
 * 
 * Enhanced floating panel with filters, score, issues, element stats,
 * Meta & Technical section, and improved loading/error states.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  X, 
  ChevronDown, 
  ChevronUp,
  Settings2,
  HelpCircle,
  Heading1,
  Image,
  Link2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Code2,
  FileText,
  FileCode,
  Accessibility,
  RefreshCw,
  AlertCircle,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SEOOverlayFilters } from './SEOOverlayFilters';
import { SEOOverlayIssuesList } from './SEOOverlayIssuesList';
import { SEOOverlayKeyboardHelp } from './SEOOverlayKeyboardHelp';
import type { SEOOverlayStats, SEOOverlayFilters as FilterType, SEOOverlayIssue } from './types';

interface SEOOverlayPanelProps {
  stats: (SEOOverlayStats & { score: number; totalImages: number; totalLinks: number; totalHeadings: number }) | null;
  issues: SEOOverlayIssue[];
  issueCounts: { critical: number; high: number; medium: number; low: number };
  filters: FilterType;
  onToggleFilter: (key: keyof FilterType) => void;
  onClose: () => void;
  onRescan: () => void;
  onJumpTo: (elementId: string) => void;
  onFix?: (issue: SEOOverlayIssue) => void;
  error?: string | null;
}

export function SEOOverlayPanel({
  stats,
  issues,
  issueCounts,
  filters,
  onToggleFilter,
  onClose,
  onRescan,
  onJumpTo,
  onFix,
  error
}: SEOOverlayPanelProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showIssues, setShowIssues] = useState(true);
  const [showMeta, setShowMeta] = useState(true);
  const [showElements, setShowElements] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const totalIssues = issueCounts.critical + issueCounts.high + issueCounts.medium + issueCounts.low;
  
  // Determine current mode for display
  const currentMode = filters.issuesOnly ? 'Issues Only' : 
                      filters.keywordFocused ? 'Keyword Focus' : 
                      'All Elements';

  // Error state with retry
  if (error) {
    return (
      <div className="absolute top-14 left-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3 w-80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-destructive flex items-center gap-1.5">
            <AlertCircle className="h-3 w-3" />
            Overlay Error
          </span>
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mb-3">{error}</p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-6 text-[10px]"
            onClick={onRescan}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 h-6 text-[10px]"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (!stats) {
    return (
      <div className="absolute top-14 left-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3 w-56">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Scanning page...
          </span>
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-[9px] text-muted-foreground mt-1">
          Analyzing headings, images, links, and more...
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <>
      <div className="absolute top-14 left-4 z-50 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg w-80 max-h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold">SEO Overlay</span>
            <span className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-bold",
              getScoreColor(stats.score)
            )}>
              {stats.score}/100
            </span>
            <span className="text-[9px] text-muted-foreground">
              {currentMode}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 p-0"
              onClick={onRescan}
              title="Re-scan page"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 p-0"
              onClick={() => setShowFilters(!showFilters)}
              title="Toggle filters"
            >
              <Settings2 className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 p-0"
              onClick={() => setShowKeyboardHelp(true)}
              title="Keyboard shortcuts"
            >
              <HelpCircle className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onClose} title="Close overlay">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Filters (collapsible) */}
        {showFilters && (
          <div className="p-2 border-b bg-muted/30 shrink-0">
            <SEOOverlayFilters
              filters={filters}
              onToggle={onToggleFilter}
              issueCount={totalIssues}
            />
          </div>
        )}

        {/* Content - scrollable */}
        <div className="flex-1 overflow-auto">
          {/* Issues Section */}
          <Collapsible open={showIssues} onOpenChange={setShowIssues}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-[10px] font-semibold">
                    Issues
                    {totalIssues > 0 && (
                      <span className="ml-1 text-[9px] font-normal text-muted-foreground">
                        ({totalIssues})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {issueCounts.critical > 0 && (
                    <span className="px-1 rounded bg-red-100 text-red-700 text-[8px] font-semibold">
                      {issueCounts.critical}
                    </span>
                  )}
                  {issueCounts.high > 0 && (
                    <span className="px-1 rounded bg-orange-100 text-orange-700 text-[8px] font-semibold">
                      {issueCounts.high}
                    </span>
                  )}
                  {showIssues ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-2 pb-2">
                <SEOOverlayIssuesList
                  issues={issues}
                  onJumpTo={onJumpTo}
                  onFix={onFix}
                  maxHeight={180}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Meta & Technical Section */}
          <Collapsible open={showMeta} onOpenChange={setShowMeta}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 hover:bg-muted/50 transition-colors text-left border-t">
                <div className="flex items-center gap-1.5">
                  <FileCode className="h-3 w-3" />
                  <span className="text-[10px] font-semibold">Meta & Technical</span>
                </div>
                {showMeta ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-2 space-y-1.5">
                {/* Title */}
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-medium">Title</span>
                  <span className={cn(
                    "px-1.5 rounded font-medium",
                    stats.titleLength >= 50 && stats.titleLength <= 60 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : stats.titleLength === 0 
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  )}>
                    {stats.titleLength} chars {stats.titleLength === 0 ? '✗' : stats.titleLength >= 50 && stats.titleLength <= 60 ? '✓' : ''}
                  </span>
                </div>
                
                {/* Description */}
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-medium">Description</span>
                  <span className={cn(
                    "px-1.5 rounded font-medium",
                    stats.descriptionLength >= 150 && stats.descriptionLength <= 160 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : stats.descriptionLength === 0 
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  )}>
                    {stats.descriptionLength} chars {stats.descriptionLength === 0 ? '✗' : stats.descriptionLength >= 150 && stats.descriptionLength <= 160 ? '✓' : ''}
                  </span>
                </div>
                
                {/* Canonical */}
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-medium">Canonical</span>
                  <span className={cn(
                    "px-1.5 rounded font-medium",
                    stats.hasCanonical 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  )}>
                    {stats.hasCanonical ? '✓ Set' : '? Not set'}
                  </span>
                </div>
                
                {/* Language */}
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-medium">Language</span>
                  <span className={cn(
                    "px-1.5 rounded font-medium",
                    stats.hasLangAttr 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  )}>
                    {stats.langAttr || 'Not set'}
                  </span>
                </div>
                
                {/* Robots */}
                {(stats.robotsDirective || stats.isNoindex || stats.isNofollow) && (
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="font-medium">Robots</span>
                    <span className={cn(
                      "px-1.5 rounded font-medium",
                      stats.isNoindex || stats.isNofollow 
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    )}>
                      {stats.isNoindex ? '⚠ Noindex' : ''}{stats.isNoindex && stats.isNofollow ? ', ' : ''}{stats.isNofollow ? '⚠ Nofollow' : ''}
                      {!stats.isNoindex && !stats.isNofollow ? stats.robotsDirective || 'index, follow' : ''}
                    </span>
                  </div>
                )}
                
                {/* Hreflang */}
                {stats.hreflangCount > 0 && (
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="font-medium">Hreflang</span>
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 rounded font-medium">
                      {stats.hreflangCount} languages
                    </span>
                  </div>
                )}
                
                {/* Open Graph & Twitter */}
                <div className="flex items-center gap-2 text-[9px] pt-1 border-t mt-1.5">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded font-medium",
                    stats.hasOpenGraph 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  )}>
                    {stats.hasOpenGraph ? '✓' : '?'} OG
                  </span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded font-medium",
                    stats.hasTwitterCard 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  )}>
                    {stats.hasTwitterCard ? '✓' : '?'} Twitter
                  </span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded font-medium",
                    stats.hasViewport 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {stats.hasViewport ? '✓' : '✗'} Viewport
                  </span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Elements Section */}
          <Collapsible open={showElements} onOpenChange={setShowElements}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 hover:bg-muted/50 transition-colors text-left border-t">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3 w-3" />
                  <span className="text-[10px] font-semibold">All Elements</span>
                </div>
                {showElements ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-2 space-y-2">
                {/* Headings */}
                <div className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1">
                    <Heading1 className="h-3 w-3 text-blue-500" />
                    <span className="font-medium">H1</span>
                  </div>
                  <span className={cn(
                    "px-1.5 rounded font-semibold",
                    stats.h1 === 1 ? "bg-green-100 text-green-700" : 
                    stats.h1 === 0 ? "bg-red-100 text-red-700" : 
                    "bg-yellow-100 text-yellow-700"
                  )}>
                    {stats.h1} {stats.h1 === 1 ? '✓' : stats.h1 === 0 ? 'Missing!' : 'Duplicates!'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-teal-500 flex items-center justify-center text-[6px] text-white font-bold">H</div>
                    <span className="font-medium">H2-H6</span>
                  </div>
                  <span className="text-muted-foreground">
                    {stats.h2 + stats.h3 + stats.h4 + stats.h5 + stats.h6}
                    <span className="text-[8px] ml-1 opacity-70">
                      ({stats.h2}/{stats.h3}/{stats.h4}/{stats.h5}/{stats.h6})
                    </span>
                  </span>
                </div>

                <div className="border-t my-1" />

                {/* Images */}
                <div className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span className="font-medium">Images OK</span>
                  </div>
                  <span className="text-muted-foreground">{stats.imgOk}</span>
                </div>

                {stats.imgMissing > 0 && (
                  <div className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="font-medium text-red-600">Missing Alt</span>
                    </div>
                    <span className="px-1.5 rounded bg-red-100 text-red-700 font-semibold">
                      {stats.imgMissing} ⚠
                    </span>
                  </div>
                )}

                {stats.imgLazy > 0 && (
                  <div className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⚡</span>
                      <span className="font-medium">Lazy Loading</span>
                    </div>
                    <span className="text-muted-foreground">{stats.imgLazy}</span>
                  </div>
                )}

                <div className="border-t my-1" />

                {/* Links */}
                <div className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1">
                    <Link2 className="h-3 w-3 text-blue-500" />
                    <span className="font-medium">Internal</span>
                  </div>
                  <span className="text-muted-foreground">{stats.internal}</span>
                </div>

                <div className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">External</span>
                  </div>
                  <span className="text-muted-foreground">
                    {stats.external}
                    {stats.externalNofollow > 0 && (
                      <span className="text-[8px] ml-1 opacity-70">
                        ({stats.externalNofollow} nofollow)
                      </span>
                    )}
                  </span>
                </div>

                {stats.emptyLinks > 0 && (
                  <div className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                      <span className="font-medium text-yellow-600">Empty Links</span>
                    </div>
                    <span className="px-1.5 rounded bg-yellow-100 text-yellow-700 font-semibold">
                      {stats.emptyLinks}
                    </span>
                  </div>
                )}

                <div className="border-t my-1" />

                {/* Schema & Meta */}
                <div className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1">
                    <Code2 className="h-3 w-3 text-yellow-500" />
                    <span className="font-medium">Schema</span>
                  </div>
                  <span className={cn(
                    "px-1.5 rounded font-medium",
                    stats.schema.length > 0 
                      ? "bg-green-100 text-green-700" 
                      : "text-muted-foreground"
                  )}>
                    {stats.schema.length > 0 ? stats.schema.join(', ') : 'None'}
                  </span>
                </div>

                {/* Accessibility */}
                {(stats.missingFormLabels > 0 || stats.duplicateIds > 0) && (
                  <>
                    <div className="border-t my-1" />
                    <div className="flex items-center justify-between text-[9px]">
                      <div className="flex items-center gap-1">
                        <Accessibility className="h-3 w-3 text-purple-500" />
                        <span className="font-medium">A11y Issues</span>
                      </div>
                      <span className="px-1.5 rounded bg-purple-100 text-purple-700 font-semibold">
                        {stats.missingFormLabels + stats.duplicateIds}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Footer */}
        <div className="p-2 border-t bg-muted/30 shrink-0">
          <div className="flex flex-wrap gap-1 text-[8px]">
            <span className={cn(
              "px-1.5 py-0.5 rounded font-medium",
              stats.hasTitle ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {stats.hasTitle ? '✓' : '✗'} Title
            </span>
            <span className={cn(
              "px-1.5 py-0.5 rounded font-medium",
              stats.hasDescription ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {stats.hasDescription ? '✓' : '✗'} Desc
            </span>
            <span className={cn(
              "px-1.5 py-0.5 rounded font-medium",
              stats.hasCanonical ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            )}>
              {stats.hasCanonical ? '✓' : '?'} Canon
            </span>
            <span className={cn(
              "px-1.5 py-0.5 rounded font-medium",
              stats.hasOpenGraph ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            )}>
              {stats.hasOpenGraph ? '✓' : '?'} OG
            </span>
            <span className={cn(
              "px-1.5 py-0.5 rounded font-medium",
              !stats.isNoindex ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {stats.isNoindex ? '⚠ Noindex' : '✓ Index'}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-muted font-medium">
              {stats.wordCount} words
            </span>
          </div>
        </div>
      </div>

      <SEOOverlayKeyboardHelp 
        open={showKeyboardHelp} 
        onOpenChange={setShowKeyboardHelp} 
      />
    </>
  );
}
