/**
 * SEOLeftPanel
 * 
 * Ultra-compact left sidebar with merged navigation and horizontal score layout.
 * Space optimized: ~168px total height (from ~356px) = 188px saved.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SEOPageSelector } from './SEOPageSelector';
import { SEOLanguageSelector } from './SEOLanguageSelector';
import { CombinedScoreRing } from './CombinedScoreRing';
import { ExportPopover } from './ExportPopover';
import { ChevronLeft, RotateCcw, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { PageData } from '@/hooks/queries/usePageData';

interface SEOLeftPanelProps {
  pages: PageData[];
  selectedPageId?: string;
  selectedLanguage: string;
  selectedPageData?: PageData;
  onPageSelect: (pageId: string) => void;
  onLanguageChange: (lang: string) => void;
  seoScore: number;
  aeoScore: number;
  geoScore: number;
  isLoading?: boolean;
  onCollapse: () => void;
  onAnalyze?: () => void;
  onGenerateAll?: () => void;
  isAnalyzing?: boolean;
  isGenerating?: boolean;
  isDirty?: boolean; // Gap 1.1: Pass isDirty for ExportPopover
}

export function SEOLeftPanel({
  pages,
  selectedPageId,
  selectedLanguage,
  selectedPageData,
  onPageSelect,
  onLanguageChange,
  seoScore,
  aeoScore,
  geoScore,
  isLoading,
  onCollapse,
  onAnalyze,
  onGenerateAll,
  isAnalyzing,
  isGenerating,
  isDirty,
}: SEOLeftPanelProps) {
  return (
    <div className="h-full flex flex-col bg-background border-r">
      {/* Compact Header - 28px */}
      <div className="flex items-center justify-between px-2 py-1 border-b shrink-0 h-7">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Navigation</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={onCollapse}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {/* Unified Navigation Row - Page + Language side by side - 36px */}
          <div className="flex gap-1.5">
            <div className="flex-1 min-w-0">
              <SEOPageSelector
                pages={pages}
                selectedPageId={selectedPageId}
                onSelect={onPageSelect}
              />
            </div>
            {selectedPageId && (
              <div className="w-20 shrink-0">
                <SEOLanguageSelector
                  pageId={selectedPageId}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={onLanguageChange}
                />
              </div>
            )}
          </div>

          {/* Scores - Horizontal Layout - ~72px */}
          {selectedPageId && (
            <CombinedScoreRing
              seoScore={seoScore}
              aeoScore={aeoScore}
              geoScore={geoScore}
              isLoading={isLoading}
            />
          )}

          {/* Quick Actions - Optional - 32px */}
          {selectedPageId && (
            <div className="flex gap-1 pt-1">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-7 text-[10px] px-2"
                      onClick={onAnalyze}
                      disabled={isAnalyzing}
                    >
                      <RotateCcw className={cn("h-3 w-3 mr-1", isAnalyzing && "animate-spin")} />
                      Analyze
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Re-analyze page (⌘R)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-7 text-[10px] px-2"
                      onClick={onGenerateAll}
                      disabled={isGenerating}
                    >
                      <Sparkles className={cn("h-3 w-3 mr-1", isGenerating && "animate-pulse")} />
                      AI
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Generate all meta with AI</p>
                  </TooltipContent>
                </Tooltip>
                {selectedPageId && selectedPageData && (
                  <ExportPopover
                    pageId={selectedPageId}
                    pageData={selectedPageData}
                    languageCode={selectedLanguage}
                    isDirty={isDirty} // Gap 1.1: Pass isDirty prop
                  />
                )}
              </TooltipProvider>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
