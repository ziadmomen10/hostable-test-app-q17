/**
 * OverviewPanel
 * 
 * Ultra-compact overview with horizontal stat strip and collapsed issues.
 * Target height: ~80px collapsed (from ~180px) = 100px saved.
 * 
 * Enhanced: Uses formState for live issue recalculation.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ChevronDown,
  ListChecks,
  BarChart3,
  Clock
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSEOAnalysis } from '../hooks/useSEOAnalysis';
import { KeywordRankTracker } from '../KeywordRankTracker';
import { SEOTaskChecklist, ScoreTrendChart, ContentDecayAlert } from '../features';
import type { PageData } from '@/hooks/queries/usePageData';
import type { useSEOFormState } from '../hooks/useSEOFormState';

interface OverviewPanelProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  formState?: ReturnType<typeof useSEOFormState>;
}

export function OverviewPanel({ pageId, pageData, languageCode, formState }: OverviewPanelProps) {
  const [issuesOpen, setIssuesOpen] = useState(false);

  // Gap 1.1 + L1 + L4: Get actual computed scores using live form data for real-time updates
  // useSEOAnalysis now returns issues directly calculated with live data
  const liveFormData = formState ? {
    metaTitle: formState.formData.metaTitle,
    metaDescription: formState.formData.metaDescription,
    focusKeyword: formState.formData.focusKeyword,
    structuredData: formState.formData.structuredData,
  } : undefined;
  
  const { seoScore, aeoScore, geoScore, issues } = useSEOAnalysis(pageId, languageCode, liveFormData);

  // Calculate issue counts
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  // Quick stats from live form state
  const titleLength = (formState?.formData.metaTitle || pageData.page_title || '').length;
  const descLength = (formState?.formData.metaDescription || pageData.page_description || '').length;
  const hasKeyword = !!formState?.formData.focusKeyword;
  const hasOgImage = !!formState?.formData.ogImageUrl || !!pageData.og_image_url;

  const titleOk = titleLength >= 30 && titleLength <= 60;
  const descOk = descLength >= 120 && descLength <= 160;

  return (
    <div className="space-y-2">
      {/* Ultra-compact Horizontal Stat Strip */}
      <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30 border text-xs">
        <StatChip 
          label="Title" 
          value={`${titleLength}c`} 
          ok={titleOk} 
          warning={titleLength > 0 && !titleOk}
        />
        <StatChip 
          label="Desc" 
          value={`${descLength}c`} 
          ok={descOk}
          warning={descLength > 0 && !descOk}
        />
        <StatChip 
          label="KW" 
          value={hasKeyword ? '✓' : '—'} 
          ok={hasKeyword}
        />
        <StatChip 
          label="OG" 
          value={hasOgImage ? '✓' : '—'} 
          ok={hasOgImage}
        />
      </div>

      {/* Compact Health Summary Row */}
      <div className="flex items-center gap-2 px-1">
        {errorCount > 0 && (
          <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-red-200 bg-red-50/50 text-red-600 dark:bg-red-500/10 dark:border-red-500/30">
            <AlertCircle className="h-3 w-3 mr-0.5" />
            {errorCount}
          </Badge>
        )}
        {warningCount > 0 && (
          <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-yellow-200 bg-yellow-50/50 text-yellow-600 dark:bg-yellow-500/10 dark:border-yellow-500/30">
            <AlertTriangle className="h-3 w-3 mr-0.5" />
            {warningCount}
          </Badge>
        )}
        {infoCount > 0 && (
          <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-blue-200 bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/30">
            <Info className="h-3 w-3 mr-0.5" />
            {infoCount}
          </Badge>
        )}
        {issues.length === 0 && (
          <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-green-200 bg-green-50/50 text-green-600 dark:bg-green-500/10 dark:border-green-500/30">
            <CheckCircle2 className="h-3 w-3 mr-0.5" />
            All clear
          </Badge>
        )}
        <span className="text-[10px] text-muted-foreground ml-auto">{languageCode.toUpperCase()}</span>
      </div>

      {/* Collapsible Issues List */}
      {issues.length > 0 && (
        <Collapsible open={issuesOpen} onOpenChange={setIssuesOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between h-7 px-2 text-xs"
            >
              <span>View Issues ({issues.length})</span>
              <ChevronDown className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                issuesOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-1 animate-accordion-down">
            <div className="space-y-1">
              {issues.map((issue, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 p-1.5 rounded-md bg-muted/30 text-xs"
                >
                  {issue.severity === 'error' && (
                    <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
                  )}
                  {issue.severity === 'warning' && (
                    <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 shrink-0" />
                  )}
                  {issue.severity === 'info' && (
                    <Info className="h-3 w-3 text-blue-500 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="leading-tight">{issue.message}</p>
                    <span className="text-[9px] text-muted-foreground">{issue.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Keyword Rank Tracker */}
      <div className="pt-2 border-t">
        <p className="text-[9px] font-medium mb-1 text-muted-foreground">Keyword Tracking</p>
        <KeywordRankTracker 
          pageId={pageId} 
          focusKeyword={formState?.formData.focusKeyword || undefined}
        />
      </div>

      {/* Phase 2: Score Trend Chart - Gap 1.1: Using actual computed scores */}
      <div className="pt-2 border-t">
        <ScoreTrendChart 
          pageId={pageId}
          languageCode={languageCode}
          currentScores={{
            seo: seoScore,
            aeo: aeoScore,
            geo: geoScore,
            issuesCount: issues.length,
          }}
        />
      </div>

      {/* Phase 2: Content Decay Alert */}
      <div className="pt-2 border-t">
        <ContentDecayAlert 
          pageId={pageId}
          pageContent={pageData.content || undefined}
        />
      </div>

      {/* Phase 2: SEO Task Checklist */}
      <div className="pt-2 border-t">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between h-7 px-2 text-xs"
            >
              <span className="flex items-center gap-1.5">
                <ListChecks className="h-3 w-3" />
                SEO Tasks
              </span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-1.5 animate-accordion-down">
            <SEOTaskChecklist 
              pageId={pageId}
              languageCode={languageCode}
              issues={issues}
              seoScore={seoScore}
              aeoScore={aeoScore}
              geoScore={geoScore}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

// Ultra-compact stat chip
function StatChip({ 
  label, 
  value, 
  ok, 
  warning 
}: { 
  label: string; 
  value: string; 
  ok: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-muted-foreground">{label}:</span>
      <span className={cn(
        "font-medium",
        ok ? "text-green-600 dark:text-green-400" : 
        warning ? "text-yellow-600 dark:text-yellow-400" : 
        "text-muted-foreground"
      )}>
        {value}
      </span>
    </div>
  );
}
