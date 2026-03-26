/**
 * SEOPagePreview
 * 
 * Full-screen canvas iframe preview with floating toolbar.
 * Enhanced with comprehensive SEO overlay system for visual element highlighting,
 * issue detection, keyboard shortcuts, and deep integration with SEO tools.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { seoQueryKeys } from './hooks/queryKeys';
import { 
  Monitor, 
  Smartphone, 
  RefreshCw, 
  ExternalLink,
  Loader2,
  ZoomIn,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Keyboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSEOOverlayEnhanced, SEOOverlayPanel, SEOOverlayFilters as FilterType, HighlightedElement, SEOOverlayKeyboardHelp } from './overlay';
import { ExportPopover } from './ExportPopover';
import type { PageData } from '@/hooks/queries/usePageData';

interface SEOPagePreviewProps {
  pageUrl: string;
  pageTitle: string;
  pageId: string;
  pageData: PageData;
  languageCode?: string;
  focusKeyword?: string;
  previewKey?: number; // Force refresh when this changes
  onAnalyze?: () => void;
  onGenerateAll?: () => void;
  onNavigate?: (target: { tab: string; section?: string }) => void;
  isAnalyzing?: boolean;
  isGenerating?: boolean;
  isDirty?: boolean; // Gap 4.3 - for export warning
}

type DeviceType = 'desktop' | 'mobile';
type ZoomLevel = 50 | 75 | 100;

export function SEOPagePreview({ 
  pageUrl, 
  pageTitle, 
  pageId,
  pageData,
  languageCode = 'en',
  focusKeyword,
  previewKey = 0,
  onAnalyze,
  onGenerateAll,
  onNavigate,
  isAnalyzing,
  isGenerating,
  isDirty,
}: SEOPagePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [zoom, setZoom] = useState<ZoomLevel>(100);
  const [isLoading, setIsLoading] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gap 1.1 - Fetch seoData for unified overlay scoring
  // Gap A1 - Use centralized query keys
  const { data: seoData } = useQuery({
    queryKey: seoQueryKeys.pageSeo(pageId, languageCode),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_id', pageId)
        .eq('language_code', languageCode)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!pageId,
  });

  // Enhanced SEO Overlay hook with pageData and seoData for unified scoring (Gap 1.1)
  const {
    enabled: overlayEnabled,
    stats,
    issues,
    issueCounts,
    filters,
    error: overlayError,
    toggleOverlay,
    toggleFilter,
    rescan: rescanOverlay,
    scrollToElement,
  } = useSEOOverlayEnhanced(iframeRef, {
    focusKeyword,
    pageData,
    seoData,
    onNavigate,
    onElementClick: (element: HighlightedElement) => {
      console.log('Element clicked:', element);
    }
  });

  // Soft refresh using contentWindow.location.reload() instead of key change
  // This is less jarring than full iframe recreation
  // Gap F4: Add cache-busting for reliable refresh
  const handleRefresh = () => {
    if (iframeRef.current?.contentWindow) {
      setIsLoading(true);
      try {
        // Gap F4: Add cache-busting query param for hard refresh
        const currentSrc = iframeRef.current.src;
        const url = new URL(currentSrc, window.location.origin);
        url.searchParams.set('_t', String(Date.now()));
        iframeRef.current.src = url.toString();
      } catch {
        // Fallback for cross-origin - reset src with cache bust
        iframeRef.current.src = iframeRef.current.src.split('?')[0] + '?_t=' + Date.now();
      }
    }
  };

  // Effect to trigger soft refresh when previewKey changes
  useEffect(() => {
    if (previewKey > 0 && iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.location.reload();
      } catch {
        // Cross-origin fallback handled by key prop
      }
    }
  }, [previewKey]);

  const handleLoad = () => {
    setIsLoading(false);
    // Re-apply overlay if enabled after iframe loads
    if (overlayEnabled) {
      setTimeout(rescanOverlay, 100);
    }
  };

  const cycleZoom = () => {
    const levels: ZoomLevel[] = [100, 75, 50];
    const currentIndex = levels.indexOf(zoom);
    const nextIndex = (currentIndex + 1) % levels.length;
    setZoom(levels[nextIndex]);
  };

  const handleOpenExternal = () => {
    window.open(previewUrl, '_blank');
  };

  // Handle jump to element
  const handleJumpTo = useCallback((elementId: string) => {
    scrollToElement(elementId);
  }, [scrollToElement]);

  // Handle issue fix navigation
  const handleFix = useCallback((issue: { fix?: { tab: string; section?: string } }) => {
    if (issue.fix && onNavigate) {
      onNavigate(issue.fix);
    }
  }, [onNavigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Only handle if preview area is focused or no specific element is focused
      const isPreviewFocused = containerRef.current?.contains(document.activeElement) || 
                                document.activeElement === document.body;
      
      if (!isPreviewFocused) return;

      switch (e.key.toLowerCase()) {
        case 'o':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleOverlay();
          }
          break;
        case 'escape':
          if (overlayEnabled) {
            e.preventDefault();
            toggleOverlay();
          }
          break;
        case 'r':
          // ⌘R / Ctrl+R triggers re-analyze
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onAnalyze?.();
          } else if (overlayEnabled) {
            // Plain 'r' in overlay mode rescans overlay
            e.preventDefault();
            rescanOverlay();
          }
          break;
        case '1':
          if (overlayEnabled) {
            e.preventDefault();
            toggleFilter('h1');
          }
          break;
        case '2':
          if (overlayEnabled) {
            e.preventDefault();
            toggleFilter('h2h6');
          }
          break;
        case '3':
          if (overlayEnabled) {
            e.preventDefault();
            toggleFilter('images');
          }
          break;
        case '4':
          if (overlayEnabled) {
            e.preventDefault();
            toggleFilter('linksInternal');
          }
          break;
        case '5':
          if (overlayEnabled) {
            e.preventDefault();
            toggleFilter('linksExternal');
          }
          break;
        case '6':
          if (overlayEnabled) {
            e.preventDefault();
            toggleFilter('schema');
          }
          break;
        case '7':
          if (overlayEnabled) {
            e.preventDefault();
            toggleFilter('meta');
          }
          break;
        case '8':
          if (overlayEnabled) {
            e.preventDefault();
            toggleFilter('accessibility');
          }
          break;
        case 'i':
          if (overlayEnabled && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleFilter('issuesOnly');
          }
          break;
        case 'k':
          if (overlayEnabled && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleFilter('keywordFocused');
          }
          break;
        case '?':
          if (overlayEnabled) {
            e.preventDefault();
            setShowKeyboardHelp(true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [overlayEnabled, toggleOverlay, rescanOverlay, toggleFilter]);

  // Build preview URL with language param
  const baseUrl = pageUrl.startsWith('/') ? pageUrl : `/${pageUrl}`;
  const previewUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}lang=${languageCode}`;

  return (
    <div ref={containerRef} className="absolute inset-0" tabIndex={-1}>
      {/* Enhanced SEO Overlay Panel */}
      {overlayEnabled && (
        <SEOOverlayPanel
          stats={stats}
          issues={issues}
          issueCounts={issueCounts}
          filters={filters}
          onToggleFilter={toggleFilter}
          onClose={toggleOverlay}
          onRescan={rescanOverlay}
          onJumpTo={handleJumpTo}
          onFix={handleFix}
          error={overlayError}
        />
      )}

      {/* Iframe Container - fills entire space */}
      <div className={cn(
        "h-full w-full",
        device === 'desktop' 
          ? '' 
          : 'flex items-center justify-center bg-muted/20'
      )}>
        <div 
          className={cn(
            "relative overflow-hidden",
            device === 'desktop'
              ? 'w-full h-full'
              : 'w-[375px] h-[667px] max-w-[calc(100%-2rem)] rounded-2xl shadow-xl border bg-white'
          )}
          style={{ 
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: device === 'desktop' ? 'top left' : 'center center',
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10 backdrop-blur-sm transition-opacity duration-300">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Loading preview...</span>
              </div>
            </div>
          )}
          <iframe
            key={`preview-${languageCode}`}
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-0 transition-opacity duration-200"
            style={{ opacity: isLoading ? 0.7 : 1 }}
            title={`Preview: ${pageTitle}`}
            onLoad={handleLoad}
          />
        </div>
      </div>

      {/* Floating Toolbar - absolute positioned at bottom center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-1 p-1 bg-background/90 backdrop-blur-md rounded-full border shadow-lg">
          <TooltipProvider delayDuration={200}>
            {/* Device Toggle */}
            <div className="flex items-center border-r pr-1 mr-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={device === 'desktop' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => setDevice('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Desktop view</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={device === 'mobile' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => setDevice('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Mobile view</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Zoom */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-full gap-1 text-xs"
                  onClick={cycleZoom}
                >
                  <ZoomIn className="h-4 w-4" />
                  {zoom}%
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Cycle zoom level</p>
              </TooltipContent>
            </Tooltip>

            {/* Refresh */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={handleRefresh}
                >
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Refresh preview</p>
              </TooltipContent>
            </Tooltip>

            {/* Divider */}
            <div className="w-px h-5 bg-border mx-1" />

            {/* SEO Overlay Toggle - Enhanced */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={overlayEnabled ? "default" : "ghost"}
                  size="sm" 
                  className={cn(
                    "h-8 rounded-full gap-1 px-2",
                    overlayEnabled && "bg-primary text-primary-foreground"
                  )}
                  onClick={toggleOverlay}
                >
                  {overlayEnabled ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span className="text-xs">Overlay</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">Overlay</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">
                  {overlayEnabled ? 'Hide' : 'Show'} SEO Overlay 
                  <span className="ml-1 text-muted-foreground">(O)</span>
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Divider */}
            <div className="w-px h-5 bg-border mx-1" />

            {/* Re-analyze */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 rounded-full p-0"
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                >
                  <RotateCcw className={cn("h-4 w-4", isAnalyzing && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Re-analyze page (⌘R)</p>
              </TooltipContent>
            </Tooltip>

            {/* AI Generate */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 rounded-full p-0"
                  onClick={onGenerateAll}
                  disabled={isGenerating}
                >
                  <Sparkles className={cn("h-4 w-4", isGenerating && "animate-pulse")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">AI Generate All Meta</p>
              </TooltipContent>
            </Tooltip>

            {/* Export - Using ExportPopover (Gap 4.3 - pass isDirty) */}
            <ExportPopover
              pageId={pageId}
              pageData={pageData}
              languageCode={languageCode}
              isDirty={isDirty}
            />

            {/* External Link */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 rounded-full p-0"
                  onClick={handleOpenExternal}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Open in new tab</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Keyboard shortcut hint when overlay is active */}
        {overlayEnabled && (
          <div 
            className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[9px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full cursor-pointer hover:bg-background/90 transition-colors"
            onClick={() => setShowKeyboardHelp(true)}
          >
            <Keyboard className="h-3 w-3" />
            <span>Press ? for shortcuts</span>
          </div>
        )}
      </div>

      {/* Keyboard Help Modal */}
      <SEOOverlayKeyboardHelp 
        open={showKeyboardHelp} 
        onOpenChange={setShowKeyboardHelp} 
      />
    </div>
  );
}
