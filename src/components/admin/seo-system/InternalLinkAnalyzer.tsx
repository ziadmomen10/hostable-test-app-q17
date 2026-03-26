/**
 * InternalLinkAnalyzer
 * 
 * Compact link analysis with inline badge stats,
 * collapsible link lists, and single-line suggestions.
 * 
 * Optimized for narrow right panel (~320-420px).
 */

import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Link2, 
  ExternalLink, 
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Loader2,
  Copy,
  Check,
  LinkIcon,
  XCircle,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInternalLinkSuggestions, type LinkSuggestion } from './hooks/useInternalLinkSuggestions';
import { useBrokenLinkChecker } from './hooks/useBrokenLinkChecker';
import { toast } from 'sonner';

interface InternalLinkAnalyzerProps {
  content: string;
  pageUrl: string;
  pageId?: string;
  focusKeyword?: string;
  className?: string;
}

interface LinkInfo {
  href: string;
  text: string;
  isInternal: boolean;
}

export function InternalLinkAnalyzer({ content, pageUrl, pageId, focusKeyword, className }: InternalLinkAnalyzerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [externalOpen, setExternalOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const analysis = useMemo(() => {
    return analyzeLinks(content, pageUrl);
  }, [content, pageUrl]);

  // AI Link Suggestions
  const { 
    suggestions, 
    isGenerating, 
    generateSuggestions 
  } = useInternalLinkSuggestions({
    pageId: pageId || '',
    pageUrl,
    content,
    focusKeyword,
  });

  // Broken Link Checker
  const allUrls = [...analysis.internalLinks, ...analysis.externalLinks].map(l => l.href);
  const {
    isChecking,
    checkLinks,
    summary: linkCheckSummary,
  } = useBrokenLinkChecker();
  
  const handleCheckLinks = () => {
    checkLinks(allUrls);
  };

  const internalRatio = analysis.totalLinks > 0 
    ? Math.round((analysis.internalLinks.length / analysis.totalLinks) * 100)
    : 0;

  const isHealthy = analysis.internalLinks.length >= 2 && internalRatio >= 50;

  if (analysis.totalLinks === 0) {
    return (
      <div className={cn("text-center py-2 text-muted-foreground", className)}>
        <Link2 className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
        <p className="text-[10px]">No links detected</p>
        <p className="text-[9px]">Add internal links to improve SEO</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {/* Inline Stats Row */}
      <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
        <Badge variant="secondary" className="h-5 gap-1">
          <Link2 className="h-2.5 w-2.5 text-blue-500" />
          {analysis.internalLinks.length} internal
        </Badge>
        <Badge variant="secondary" className="h-5 gap-1">
          <ExternalLink className="h-2.5 w-2.5 text-purple-500" />
          {analysis.externalLinks.length} external
        </Badge>
        <Badge 
          variant="outline" 
          className={cn(
            "h-5",
            internalRatio >= 50 ? "text-green-600 border-green-500/50" : "text-yellow-600 border-yellow-500/50"
          )}
        >
          {internalRatio}% ratio
        </Badge>
      </div>

      {/* Health Status */}
      <div className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded text-[10px]",
        isHealthy ? "bg-green-500/10" : "bg-yellow-500/10"
      )}>
        {isHealthy ? (
          <>
            <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
            <span className="text-green-700 dark:text-green-400">Good structure</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-3 w-3 text-yellow-500 shrink-0" />
            <span className="text-yellow-700 dark:text-yellow-400">
              {analysis.internalLinks.length < 2 ? 'Add more internal links' : 'Increase internal link ratio'}
            </span>
          </>
        )}
      </div>

      {/* Check Links Button */}
      {allUrls.length > 0 && (
        <div className="space-y-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-5 text-[9px] gap-1"
            onClick={handleCheckLinks}
            disabled={isChecking}
          >
            {isChecking ? (
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
            ) : (
              <LinkIcon className="h-2.5 w-2.5" />
            )}
            {isChecking ? 'Checking links...' : 'Check for Broken Links'}
          </Button>
          
          {/* Link Check Results */}
          {linkCheckSummary && (
            <div className="flex items-center gap-1 flex-wrap text-[9px]">
              {linkCheckSummary.ok > 0 && (
                <Badge variant="outline" className="h-4 gap-0.5 text-[8px] text-green-600 border-green-500/50">
                  <CheckCircle2 className="h-2 w-2" />
                  {linkCheckSummary.ok} OK
                </Badge>
              )}
              {linkCheckSummary.broken > 0 && (
                <Badge variant="outline" className="h-4 gap-0.5 text-[8px] text-red-600 border-red-500/50">
                  <XCircle className="h-2 w-2" />
                  {linkCheckSummary.broken} broken
                </Badge>
              )}
              {linkCheckSummary.accessDenied > 0 && (
                <Badge variant="outline" className="h-4 gap-0.5 text-[8px] text-yellow-600 border-yellow-500/50">
                  <ShieldAlert className="h-2 w-2" />
                  {linkCheckSummary.accessDenied} blocked
                </Badge>
              )}
              {linkCheckSummary.redirects > 0 && (
                <Badge variant="outline" className="h-4 gap-0.5 text-[8px] text-blue-600 border-blue-500/50">
                  <ArrowRight className="h-2 w-2" />
                  {linkCheckSummary.redirects} redirects
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {/* Collapsible Internal Links */}
      {analysis.internalLinks.length > 0 && (
        <Collapsible open={internalOpen} onOpenChange={setInternalOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-between h-5 text-[9px] px-1 text-muted-foreground"
            >
              <span className="flex items-center gap-1">
                <Link2 className="h-2.5 w-2.5 text-blue-500" />
                View {analysis.internalLinks.length} internal links
              </span>
              <ChevronDown className={cn(
                "h-2.5 w-2.5 transition-transform",
                internalOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-0.5">
            <ScrollArea className="max-h-[60px]">
              <div className="space-y-0.5 pr-1">
                {analysis.internalLinks.slice(0, 5).map((link, i) => (
                  <LinkRow key={i} link={link} />
                ))}
                {analysis.internalLinks.length > 5 && (
                  <p className="text-[8px] text-muted-foreground pl-1">
                    +{analysis.internalLinks.length - 5} more
                  </p>
                )}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Collapsible External Links */}
      {analysis.externalLinks.length > 0 && (
        <Collapsible open={externalOpen} onOpenChange={setExternalOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-between h-5 text-[9px] px-1 text-muted-foreground"
            >
              <span className="flex items-center gap-1">
                <ExternalLink className="h-2.5 w-2.5 text-purple-500" />
                View {analysis.externalLinks.length} external links
              </span>
              <ChevronDown className={cn(
                "h-2.5 w-2.5 transition-transform",
                externalOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-0.5">
            <ScrollArea className="max-h-[50px]">
              <div className="space-y-0.5 pr-1">
                {analysis.externalLinks.slice(0, 3).map((link, i) => (
                  <LinkRow key={i} link={link} isExternal />
                ))}
                {analysis.externalLinks.length > 3 && (
                  <p className="text-[8px] text-muted-foreground pl-1">
                    +{analysis.externalLinks.length - 3} more
                  </p>
                )}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Single-line Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="space-y-0.5 pt-1 border-t">
          {analysis.suggestions.slice(0, 2).map((suggestion, i) => (
            <div key={i} className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary" />
              <span className="truncate">{suggestion}</span>
            </div>
          ))}
        </div>
      )}

      {/* AI Link Suggestions */}
      {pageId && (
        <div className="pt-1 border-t space-y-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-5 text-[9px] gap-1"
            onClick={generateSuggestions}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
            ) : (
              <Sparkles className="h-2.5 w-2.5" />
            )}
            {isGenerating ? 'Finding links...' : 'AI Suggest Links'}
          </Button>

          {suggestions.length > 0 && (
            <Collapsible open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-between h-5 text-[9px] px-1 text-muted-foreground"
                >
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-purple-500" />
                    {suggestions.length} AI suggestions
                  </span>
                  <ChevronDown className={cn(
                    "h-2.5 w-2.5 transition-transform",
                    suggestionsOpen && "rotate-180"
                  )} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-0.5">
                <ScrollArea className="max-h-[80px]">
                  <div className="space-y-1 pr-1">
                    {suggestions.map((suggestion, i) => (
                      <SuggestionRow key={i} suggestion={suggestion} />
                    ))}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      )}
    </div>
  );
}

// AI Suggestion Row
function SuggestionRow({ suggestion }: { suggestion: LinkSuggestion }) {
  const [copied, setCopied] = useState(false);

  const copyAnchor = () => {
    navigator.clipboard.writeText(suggestion.anchorText);
    setCopied(true);
    toast.success('Anchor text copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const relevanceColors = {
    high: 'text-green-600 bg-green-500/10',
    medium: 'text-yellow-600 bg-yellow-500/10',
    low: 'text-muted-foreground bg-muted/50',
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded bg-muted/20 text-[8px]">
      <Badge variant="outline" className={cn("h-3 text-[7px] px-0.5", relevanceColors[suggestion.relevanceScore])}>
        {suggestion.relevanceScore}
      </Badge>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{suggestion.anchorText}</div>
        <div className="text-muted-foreground truncate">→ {suggestion.targetUrl}</div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 shrink-0"
        onClick={copyAnchor}
      >
        {copied ? (
          <Check className="h-2 w-2 text-green-500" />
        ) : (
          <Copy className="h-2 w-2" />
        )}
      </Button>
    </div>
  );
}

// Compact link row
function LinkRow({ link, isExternal = false }: { link: LinkInfo; isExternal?: boolean }) {
  const displayUrl = link.href.length > 35 
    ? link.href.substring(0, 32) + '...' 
    : link.href;

  return (
    <div className="flex items-center gap-1 text-[8px] p-0.5 rounded bg-muted/20">
      {isExternal ? (
        <ExternalLink className="h-2 w-2 text-purple-500 shrink-0" />
      ) : (
        <Link2 className="h-2 w-2 text-blue-500 shrink-0" />
      )}
      <span className="truncate text-muted-foreground" title={link.href}>
        {displayUrl}
      </span>
    </div>
  );
}

// Analyze links in content
function analyzeLinks(content: string, pageUrl: string) {
  const internalLinks: LinkInfo[] = [];
  const externalLinks: LinkInfo[] = [];
  const suggestions: string[] = [];

  // Extract links from JSON content
  const hrefMatches = content.matchAll(/"href"\s*:\s*"([^"]+)"/gi);
  const linkMatches = content.matchAll(/"link"\s*:\s*"([^"]+)"/gi);
  const urlMatches = content.matchAll(/"url"\s*:\s*"([^"]+)"/gi);

  const allUrls = new Set<string>();
  
  for (const match of [...hrefMatches, ...linkMatches, ...urlMatches]) {
    const url = match[1];
    if (!url || allUrls.has(url)) continue;
    allUrls.add(url);

    const linkInfo: LinkInfo = {
      href: url,
      text: '',
      isInternal: isInternalUrl(url, pageUrl),
    };

    if (linkInfo.isInternal) {
      internalLinks.push(linkInfo);
    } else {
      externalLinks.push(linkInfo);
    }
  }

  // Generate concise suggestions
  if (internalLinks.length === 0) {
    suggestions.push('Add 2-3 internal links to related pages');
  } else if (internalLinks.length < 3) {
    suggestions.push('Add more internal links');
  }

  if (externalLinks.length === 0) {
    suggestions.push('Link to authoritative sources');
  }

  const totalLinks = internalLinks.length + externalLinks.length;
  if (totalLinks > 0 && (internalLinks.length / totalLinks) < 0.5) {
    suggestions.push('Increase internal link ratio');
  }

  return {
    internalLinks,
    externalLinks,
    totalLinks,
    suggestions,
  };
}

// Check if URL is internal
function isInternalUrl(url: string, pageUrl: string): boolean {
  if (url.startsWith('/') || url.startsWith('#')) return true;
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return false;
  
  try {
    const baseUrl = window.location.origin;
    const urlObj = new URL(url, baseUrl);
    const pageObj = new URL(pageUrl.startsWith('/') ? baseUrl + pageUrl : pageUrl, baseUrl);
    
    return urlObj.hostname === pageObj.hostname;
  } catch {
    return url.startsWith('/');
  }
}
