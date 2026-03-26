/**
 * ContentPanel
 * 
 * Compact content analysis with horizontal stat strip,
 * mutual exclusion collapsibles, and merged keyword analysis.
 * 
 * Optimized for narrow right panel (~320-420px).
 * Enhanced with broken link checker integration (Gap 7.1).
 */

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Type, 
  Clock,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Target,
  BookOpen,
  Globe,
  Loader2,
  Link2Off,
  Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReadabilityCard } from '../ReadabilityCard';
import { KeywordMatrix } from '../KeywordMatrix';
import { InternalLinkAnalyzer } from '../InternalLinkAnalyzer';
import { CompetitorAnalyzer } from '../CompetitorAnalyzer';
import { ImageSEOChecker } from '../ImageSEOChecker';
import { AIContentRewriter } from '../AIContentRewriter';
import { useBrokenLinkChecker } from '../hooks/useBrokenLinkChecker';
import { ContentBriefGenerator } from '../features';
import { extractTextFromContent } from '../hooks/useSEOAnalysis';
import type { PageData } from '@/hooks/queries/usePageData';
import type { useSEOFormState } from '../hooks/useSEOFormState';

interface ContentPanelProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  formState?: ReturnType<typeof useSEOFormState>;
}

type OpenSection = 'readability' | 'keyword' | 'links' | 'competitor' | 'images' | 'rewriter' | 'linkcheck' | 'brief' | null;

export function ContentPanel({ pageId, pageData, languageCode, formState }: ContentPanelProps) {
  // Mutual exclusion: only one section can be open at a time
  const [openSection, setOpenSection] = useState<OpenSection>(null);

  // Broken link checker hook (Gap 7.1)
  const { checkLinks, isChecking, summary: linkCheckSummary, reset: resetLinkCheck } = useBrokenLinkChecker();

  const toggleSection = (section: OpenSection) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  // Use formState for live keyword data if available
  const focusKeywordFromForm = formState?.formData.focusKeyword || '';
  const metaTitleFromForm = formState?.formData.metaTitle || '';
  const metaDescFromForm = formState?.formData.metaDescription || '';

  // Gap 5.3: Use shared extractTextFromContent utility instead of local extractText
  const analysis = useMemo(() => {
    const content = pageData.content || '';
    const textContent = extractTextFromContent(content);

    const words = textContent.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200);
    const h1Count = (content.match(/"type"\s*:\s*"h1"/gi) || []).length;
    const h2Count = (content.match(/"type"\s*:\s*"h2"/gi) || []).length;

    const focusKeyword = focusKeywordFromForm.toLowerCase();
    let keywordCount = 0;
    let keywordDensity = 0;
    if (focusKeyword && wordCount > 0) {
      const regex = new RegExp(focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      keywordCount = (textContent.match(regex) || []).length;
      keywordDensity = (keywordCount / wordCount) * 100;
    }

    const imageCount = (content.match(/"imageUrl"\s*:|"image"\s*:/gi) || []).length;
    const linkCount = (content.match(/"href"\s*:|"link"\s*:/gi) || []).length;

    return {
      wordCount,
      readingTime,
      h1Count,
      h2Count,
      keywordCount,
      keywordDensity,
      imageCount,
      linkCount,
      focusKeyword,
      textContent,
    };
  }, [pageData.content, focusKeywordFromForm]);

  return (
    <div className="space-y-2">
      {/* Horizontal Scrollable Stats Strip */}
      <ScrollArea className="w-full">
        <div className="flex gap-1.5 pb-1">
          <MiniStatPill 
            icon={Type} 
            value={`${analysis.wordCount}w`}
            status={analysis.wordCount >= 300 ? 'good' : 'warning'}
          />
          <MiniStatPill 
            icon={Clock} 
            value={`${analysis.readingTime}m`}
            status="neutral"
          />
          <MiniStatPill 
            icon={Heading1} 
            value={`${analysis.h1Count}×H1`}
            status={analysis.h1Count === 1 ? 'good' : analysis.h1Count === 0 ? 'error' : 'warning'}
          />
          <MiniStatPill 
            icon={Heading2} 
            value={`${analysis.h2Count}×H2`}
            status={analysis.h2Count >= 2 ? 'good' : 'warning'}
          />
          <MiniStatPill 
            icon={ImageIcon} 
            value={`${analysis.imageCount}img`}
            status={analysis.imageCount >= 1 ? 'good' : 'warning'}
          />
          <MiniStatPill 
            icon={LinkIcon} 
            value={`${analysis.linkCount}lnk`}
            status={analysis.linkCount >= 1 ? 'good' : 'warning'}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Collapsible Readability Analysis - Gap 5.1: aria-expanded */}
      <Collapsible open={openSection === 'readability'} onOpenChange={() => toggleSection('readability')}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
            aria-expanded={openSection === 'readability'}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" />
              Readability
            </span>
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform duration-200",
              openSection === 'readability' && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 animate-accordion-down">
          <ReadabilityCard content={pageData.content || ''} />
        </CollapsibleContent>
      </Collapsible>

      {/* Collapsible Keyword Analysis (Matrix + Density merged) - Gap 5.1: aria-expanded */}
      <Collapsible open={openSection === 'keyword'} onOpenChange={() => toggleSection('keyword')}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
            aria-expanded={openSection === 'keyword'}
          >
            <span className="flex items-center gap-1.5">
              <Target className="h-3 w-3" />
              Keyword Analysis
              {analysis.focusKeyword && (
                <Badge variant="secondary" className="text-[8px] h-4 ml-1">
                  {analysis.keywordDensity.toFixed(1)}%
                </Badge>
              )}
            </span>
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform duration-200",
              openSection === 'keyword' && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 space-y-2 animate-accordion-down">
          {analysis.focusKeyword ? (
            <>
              {/* Keyword Matrix */}
              <KeywordMatrix 
                focusKeyword={focusKeywordFromForm}
                pageData={pageData}
                metaTitle={metaTitleFromForm || undefined}
                metaDescription={metaDescFromForm || undefined}
              />
              
              {/* Compact Density Info */}
              <div className="flex items-center gap-2 p-1.5 rounded bg-muted/20">
                <span className="text-[9px] text-muted-foreground">Density:</span>
                <Progress 
                  value={Math.min((analysis.keywordDensity / 3) * 100, 100)} 
                  className="h-1 flex-1"
                />
                <span className={cn(
                  "text-[10px] font-medium",
                  getDensityColor(analysis.keywordDensity)
                )}>
                  {analysis.keywordDensity.toFixed(1)}%
                </span>
                <span className="text-[8px] text-muted-foreground">(1-3% optimal)</span>
              </div>

              {/* Quick Placement Check - uses formState for live updates (Gap 1.2) */}
              <div className="flex items-center gap-2 flex-wrap">
                <PlacementBadge 
                  label="Title" 
                  checked={(metaTitleFromForm || pageData.page_title)?.toLowerCase().includes(analysis.focusKeyword)} 
                />
                <PlacementBadge 
                  label="Desc" 
                  checked={(metaDescFromForm || pageData.page_description)?.toLowerCase().includes(analysis.focusKeyword)} 
                />
                <PlacementBadge 
                  label="URL" 
                  checked={pageData.page_url?.toLowerCase().includes(analysis.focusKeyword.replace(/\s+/g, '-'))} 
                />
              </div>
            </>
          ) : (
            <div className="text-center py-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
              <p className="text-[10px]">No focus keyword set</p>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Collapsible Internal Link Analyzer - Gap 5.1: aria-expanded */}
      <Collapsible open={openSection === 'links'} onOpenChange={() => toggleSection('links')}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
            aria-expanded={openSection === 'links'}
          >
            <span className="flex items-center gap-1.5">
              <LinkIcon className="h-3 w-3" />
              Internal Links
            </span>
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform duration-200",
              openSection === 'links' && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 animate-accordion-down">
          <InternalLinkAnalyzer 
            content={pageData.content || ''}
            pageUrl={pageData.page_url}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Collapsible Competitor Analysis - Gap 5.1: aria-expanded */}
      <Collapsible open={openSection === 'competitor'} onOpenChange={() => toggleSection('competitor')}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
            aria-expanded={openSection === 'competitor'}
          >
            <span className="flex items-center gap-1.5">
              <Globe className="h-3 w-3" />
              Competitor Analysis
            </span>
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform duration-200",
              openSection === 'competitor' && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 animate-accordion-down">
          <CompetitorAnalyzer pageData={pageData} />
        </CollapsibleContent>
      </Collapsible>

      {/* Collapsible Image SEO - Gap 5.1: aria-expanded */}
      <Collapsible open={openSection === 'images'} onOpenChange={() => toggleSection('images')}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
            aria-expanded={openSection === 'images'}
          >
            <span className="flex items-center gap-1.5">
              <ImageIcon className="h-3 w-3" />
              Image SEO
            </span>
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform duration-200",
              openSection === 'images' && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 animate-accordion-down">
          <ImageSEOChecker content={pageData.content || ''} pageTitle={pageData.page_title} focusKeyword={focusKeywordFromForm || undefined} />
        </CollapsibleContent>
      </Collapsible>

      {/* Collapsible AI Rewriter - Gap 5.1: aria-expanded */}
      <Collapsible open={openSection === 'rewriter'} onOpenChange={() => toggleSection('rewriter')}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
            aria-expanded={openSection === 'rewriter'}
          >
            <span className="flex items-center gap-1.5">
              <Target className="h-3 w-3" />
              AI Rewriter
            </span>
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform duration-200",
              openSection === 'rewriter' && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 animate-accordion-down">
          <AIContentRewriter 
            pageId={pageId} 
            languageCode={languageCode}
            focusKeyword={focusKeywordFromForm || undefined}
            onApplyToMeta={formState ? (text) => formState.updateField('metaDescription', text) : undefined}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Collapsible Broken Link Checker - Gap 5.1: aria-expanded */}
      <Collapsible open={openSection === 'linkcheck'} onOpenChange={() => toggleSection('linkcheck')}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
            aria-expanded={openSection === 'linkcheck'}
          >
            <span className="flex items-center gap-1.5">
              <Link2Off className="h-3 w-3" />
              Link Checker
              {linkCheckSummary && linkCheckSummary.broken > 0 && (
                <Badge variant="destructive" className="text-[8px] h-3.5 px-1">
                  {linkCheckSummary.broken}
                </Badge>
              )}
            </span>
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform duration-200",
              openSection === 'linkcheck' && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 animate-accordion-down">
          <BrokenLinkCheckerUI 
            content={pageData.content || ''}
            checkLinks={checkLinks}
            isChecking={isChecking}
            summary={linkCheckSummary}
            onReset={resetLinkCheck}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Phase 2: Content Brief Generator */}
      <Collapsible open={openSection === 'brief'} onOpenChange={() => toggleSection('brief')}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-6 text-[10px]"
            aria-expanded={openSection === 'brief'}
          >
            <span className="flex items-center gap-1.5">
              <Wand2 className="h-3 w-3" />
              Content Brief
            </span>
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform duration-200",
              openSection === 'brief' && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1.5 animate-accordion-down">
          {/* Gap 1.2: Pass missing props to ContentBriefGenerator */}
          <ContentBriefGenerator 
            pageId={pageId}
            languageCode={languageCode}
            focusKeyword={focusKeywordFromForm || undefined}
            pageContent={pageData.content || undefined}
            pageTitle={pageData.page_title}
            pageUrl={pageData.page_url}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// Ultra-compact stat pill
interface MiniStatPillProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  status: 'good' | 'warning' | 'error' | 'neutral';
}

function MiniStatPill({ icon: Icon, value, status }: MiniStatPillProps) {
  const config = {
    good: 'text-green-600 bg-green-500/10 border-green-200/50 dark:border-green-500/20',
    warning: 'text-yellow-600 bg-yellow-500/10 border-yellow-200/50 dark:border-yellow-500/20',
    error: 'text-red-600 bg-red-500/10 border-red-200/50 dark:border-red-500/20',
    neutral: 'text-muted-foreground bg-muted/50 border-border',
  };

  return (
    <div className={cn(
      "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[9px] font-medium shrink-0",
      config[status]
    )}>
      <Icon className="h-2.5 w-2.5" />
      <span>{value}</span>
    </div>
  );
}

function PlacementBadge({ label, checked }: { label: string; checked: boolean }) {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-[8px] h-4 gap-0.5",
        checked 
          ? "border-green-500/50 text-green-600 bg-green-500/5" 
          : "border-yellow-500/50 text-yellow-600 bg-yellow-500/5"
      )}
    >
      {checked ? <CheckCircle2 className="h-2 w-2" /> : <AlertTriangle className="h-2 w-2" />}
      {label}
    </Badge>
  );
}

// Gap 5.3: Removed duplicate extractText - now imported from useSEOAnalysis

function getDensityColor(density: number): string {
  if (density >= 1 && density <= 3) return 'text-green-500';
  if (density > 0 && density < 1) return 'text-yellow-500';
  if (density > 3) return 'text-red-500';
  return 'text-muted-foreground';
}

// Gap 7.1 - Broken Link Checker UI
interface BrokenLinkCheckerUIProps {
  content: string;
  checkLinks: (urls: string[]) => Promise<any>;
  isChecking: boolean;
  summary: import('../hooks/useBrokenLinkChecker').LinkCheckSummary | null;
  onReset: () => void;
}

function BrokenLinkCheckerUI({ content, checkLinks, isChecking, summary, onReset }: BrokenLinkCheckerUIProps) {
  // Extract links from page content
  const extractLinks = (): string[] => {
    const links: string[] = [];
    const hrefRegex = /"href"\s*:\s*"([^"]+)"/gi;
    const linkRegex = /"link"\s*:\s*"([^"]+)"/gi;
    const urlRegex = /"url"\s*:\s*"([^"]+)"/gi;
    
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
      if (match[1].startsWith('http')) links.push(match[1]);
    }
    while ((match = linkRegex.exec(content)) !== null) {
      if (match[1].startsWith('http')) links.push(match[1]);
    }
    while ((match = urlRegex.exec(content)) !== null) {
      if (match[1].startsWith('http')) links.push(match[1]);
    }
    
    return [...new Set(links)]; // Dedupe
  };

  const handleCheck = () => {
    const links = extractLinks();
    if (links.length === 0) {
      return;
    }
    checkLinks(links);
  };

  const links = extractLinks();

  if (summary) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">
            {summary.total} links checked
          </span>
          <Button variant="ghost" size="sm" className="h-5 text-[9px]" onClick={onReset}>
            Clear
          </Button>
        </div>
        
        <div className="flex gap-1.5 flex-wrap">
          <Badge variant="outline" className={cn(
            "text-[8px] h-4",
            summary.ok > 0 ? "border-green-500/50 text-green-600" : "border-muted"
          )}>
            <CheckCircle2 className="h-2 w-2 mr-0.5" />
            {summary.ok} OK
          </Badge>
          <Badge variant="outline" className={cn(
            "text-[8px] h-4",
            summary.broken > 0 ? "border-red-500/50 text-red-600" : "border-muted"
          )}>
            <Link2Off className="h-2 w-2 mr-0.5" />
            {summary.broken} Broken
          </Badge>
          <Badge variant="outline" className={cn(
            "text-[8px] h-4",
            summary.redirects > 0 ? "border-yellow-500/50 text-yellow-600" : "border-muted"
          )}>
            <AlertTriangle className="h-2 w-2 mr-0.5" />
            {summary.redirects} Redirects
          </Badge>
        </div>
        
        {summary.broken > 0 && (
          <ScrollArea className="max-h-[100px]">
            <div className="space-y-0.5">
              {summary.results.filter(r => r.isBroken).map((result, i) => (
                <div key={i} className="text-[9px] p-1 rounded bg-red-500/5 border border-red-500/20 truncate">
                  {result.status}: {result.url}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[9px] text-muted-foreground">
        Check external links for 404s and redirects.
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px]">{links.length} external links found</span>
        <Button 
          size="sm" 
          className="h-5 text-[9px]"
          onClick={handleCheck}
          disabled={isChecking || links.length === 0}
        >
          {isChecking ? (
            <>
              <Loader2 className="h-2.5 w-2.5 animate-spin mr-1" />
              Checking...
            </>
          ) : (
            'Check Links'
          )}
        </Button>
      </div>
      {links.length === 0 && (
        <p className="text-[8px] text-muted-foreground">
          No external links found in page content.
        </p>
      )}
    </div>
  );
}
