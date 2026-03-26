/**
 * useSEOOverlayEnhanced Hook
 * 
 * Enhanced SEO overlay state management with filters, element tracking,
 * issue prioritization, iframe communication, and better error handling.
 * 
 * Now uses unified scoring from useSEOAnalysis for consistency.
 */

import { useState, useEffect, useCallback, RefObject, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { OVERLAY_CSS, SCANNER_SCRIPT } from './scanner-script';
import { 
  SEOOverlayStats, 
  SEOOverlayFilters, 
  HighlightedElement, 
  SEOOverlayIssue,
  DEFAULT_FILTERS,
  OverlayMode,
  OverlayMessage
} from './types';
// Gap 4.2: Only import what's actually used
import { calculateSEOScore } from '../hooks/useSEOAnalysis';

const STORAGE_KEY = 'seo-overlay-filters';
const SCAN_TIMEOUT = 3000; // 3 seconds timeout for scanning

interface UseSEOOverlayEnhancedOptions {
  focusKeyword?: string;
  pageData?: any;
  seoData?: any;
  onElementClick?: (element: HighlightedElement) => void;
  onNavigate?: (target: { tab: string; section?: string }) => void;
}

export function useSEOOverlayEnhanced(
  iframeRef: RefObject<HTMLIFrameElement | null>,
  options: UseSEOOverlayEnhancedOptions = {}
) {
  const { focusKeyword, pageData, seoData, onElementClick, onNavigate } = options;
  
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<OverlayMode>('default');
  const [stats, setStats] = useState<SEOOverlayStats | null>(null);
  const [elements, setElements] = useState<HighlightedElement[]>([]);
  const [issues, setIssues] = useState<SEOOverlayIssue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HighlightedElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<HighlightedElement | null>(null);
  
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load filters from localStorage
  const [filters, setFilters] = useState<SEOOverlayFilters>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_FILTERS, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_FILTERS;
  });

  // Save filters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {}
  }, [filters]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  // Scanning timeout - show error if no stats received
  useEffect(() => {
    if (enabled && !stats && !error) {
      scanTimeoutRef.current = setTimeout(() => {
        if (!stats) {
          setError('Unable to scan page. This may be a cross-origin page or the content is still loading. Try refreshing the preview.');
        }
      }, SCAN_TIMEOUT);

      return () => {
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
        }
      };
    }
  }, [enabled, stats, error]);

  // Computed stats using unified scoring algorithm
  const computedStats = useMemo(() => {
    if (!stats) return null;
    
    const totalImages = stats.imgOk + stats.imgMissing + stats.imgBroken;
    const totalLinks = stats.internal + stats.external;
    const totalHeadings = stats.h1 + stats.h2 + stats.h3 + stats.h4 + stats.h5 + stats.h6;
    
    // Use unified scoring from useSEOAnalysis if page/seo data available
    let score: number;
    
    if (pageData && seoData) {
      // Use the same scoring algorithm as useSEOAnalysis for consistency
      const seoScoreDetails = calculateSEOScore(pageData, seoData);
      score = seoScoreDetails.score;
    } else {
      // Fallback to overlay-based scoring when no data passed
      score = 100;
      
      // Critical issues (-15 each)
      if (stats.h1 === 0) score -= 15;
      if (stats.duplicateH1) score -= 15;
      if (!stats.hasTitle) score -= 15;
      if (stats.isNoindex) score -= 15;
      
      // High issues (-10 each)
      if (stats.imgMissing > 0) score -= Math.min(10, stats.imgMissing * 3);
      if (!stats.hasDescription) score -= 10;
      
      // Medium issues (-5 each)
      if (!stats.headingHierarchyValid) score -= 5;
      if (stats.emptyLinks > 0) score -= 5;
      if (!stats.hasCanonical) score -= 5;
      if (!stats.hasLangAttr) score -= 5;
      if (stats.missingFormLabels > 0) score -= 5;
      
      // Low issues (-2 each)
      if (stats.titleLength < 30 || stats.titleLength > 60) score -= 2;
      if (stats.descriptionLength < 120 || stats.descriptionLength > 160) score -= 2;
      if (!stats.hasOpenGraph) score -= 2;
      if (stats.schema.length === 0) score -= 2;
      
      score = Math.max(0, Math.min(100, score));
    }
    
    return {
      ...stats,
      totalImages,
      totalLinks,
      totalHeadings,
      score
    };
  }, [stats, pageData, seoData]);

  // Filtered issues based on current mode
  const filteredIssues = useMemo(() => {
    if (!filters.issuesOnly) return issues;
    return issues;
  }, [issues, filters.issuesOnly]);

  // Issue counts by severity
  const issueCounts = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    issues.forEach(issue => {
      counts[issue.severity]++;
    });
    return counts;
  }, [issues]);

  // Listen for messages from iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data as OverlayMessage;
      
      if (data?.type === 'seo-overlay-stats') {
        // Clear timeout since we received data
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
          scanTimeoutRef.current = null;
        }
        
        console.log('[SEO Overlay] Scan complete:', {
          headings: data.stats.h1 + data.stats.h2 + data.stats.h3 + data.stats.h4 + data.stats.h5 + data.stats.h6,
          images: data.stats.imgOk + data.stats.imgMissing + data.stats.imgBroken,
          links: data.stats.internal + data.stats.external,
          issues: data.issues?.length || 0,
          meta: {
            title: data.stats.titleLength + ' chars',
            description: data.stats.descriptionLength + ' chars',
            canonical: data.stats.hasCanonical,
            lang: data.stats.langAttr
          }
        });
        
        setStats(data.stats);
        setElements(data.elements);
        setIssues(data.issues);
        setError(null);
      } else if (data?.type === 'seo-overlay-element-click') {
        setSelectedElement(data.element);
        onElementClick?.(data.element);
        
        // Navigate to fix location if issue has fix
        const issue = issues.find(i => i.elementId === data.element.id);
        if (issue?.fix) {
          onNavigate?.(issue.fix);
        }
      } else if (data?.type === 'seo-overlay-element-hover') {
        setHoveredElement(data.element);
      } else if (data?.type === 'seo-overlay-scroll-complete') {
        console.log('[SEO Overlay] Scroll to element complete');
      }
    };
    
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [issues, onElementClick, onNavigate]);

  // Check if iframe is same-origin
  const checkSameOrigin = useCallback((): boolean => {
    if (!iframeRef.current) return false;
    
    try {
      // Try to access contentDocument - this will throw if cross-origin
      const doc = iframeRef.current.contentDocument;
      return doc !== null;
    } catch {
      return false;
    }
  }, [iframeRef]);

  // Inject overlay into iframe
  const injectOverlay = useCallback(() => {
    console.log('[SEO Overlay] Starting injection...');
    
    if (!iframeRef.current) {
      console.warn('[SEO Overlay] Preview iframe not available');
      setError('Preview not available');
      return;
    }

    // Check same-origin first
    if (!checkSameOrigin()) {
      console.warn('[SEO Overlay] Cross-origin restriction detected');
      setError('Cross-origin restriction: Cannot analyze external pages. Open the page in a new tab or use PageSpeed Insights.');
      toast.error('SEO Overlay cannot analyze external pages');
      return;
    }

    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      
      if (!iframeDoc) {
        console.warn('[SEO Overlay] Cannot access iframe document');
        setError('Cannot access preview content. Try refreshing the page.');
        return;
      }

      console.log('[SEO Overlay] Injecting CSS and scanner script...');

      // Inject CSS if not already present
      if (!iframeDoc.getElementById('seo-overlay-styles')) {
        const style = iframeDoc.createElement('style');
        style.id = 'seo-overlay-styles';
        style.textContent = OVERLAY_CSS;
        iframeDoc.head.appendChild(style);
        console.log('[SEO Overlay] CSS injected');
      }

      // Inject and run scanner script
      const script = iframeDoc.createElement('script');
      script.id = 'seo-overlay-scanner';
      script.textContent = SCANNER_SCRIPT;
      iframeDoc.body.appendChild(script);
      script.remove();
      
      console.log('[SEO Overlay] Scanner script injected and executed');

      // Send enable command with current filters
      iframeRef.current.contentWindow?.postMessage({
        type: 'seo-overlay-enable',
        filters,
        focusKeyword
      }, '*');
      
      console.log('[SEO Overlay] Enable message sent to iframe with filters:', filters);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      console.error('[SEO Overlay] Injection failed:', e);
      if (errorMessage.includes('cross-origin') || errorMessage.includes('SecurityError')) {
        setError('Cross-origin restriction: Open page in new tab for analysis.');
      } else {
        setError('Failed to enable overlay: ' + errorMessage);
      }
    }
  }, [iframeRef, filters, focusKeyword, checkSameOrigin]);

  // Clear overlay
  const clearOverlay = useCallback(() => {
    if (!iframeRef.current) return;

    try {
      iframeRef.current.contentWindow?.postMessage({
        type: 'seo-overlay-disable'
      }, '*');
      
      setStats(null);
      setElements([]);
      setIssues([]);
      setSelectedElement(null);
      setHoveredElement(null);
      setError(null);
      
      // Clear timeout if any
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
    } catch (e) {
      console.warn('SEO Overlay clear failed:', e);
    }
  }, [iframeRef]);

  // Toggle overlay
  const toggleOverlay = useCallback(() => {
    if (enabled) {
      clearOverlay();
      setEnabled(false);
    } else {
      setError(null); // Clear previous errors
      injectOverlay();
      setEnabled(true);
    }
  }, [enabled, injectOverlay, clearOverlay]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SEOOverlayFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    
    if (enabled && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({
        type: 'seo-overlay-update-filters',
        filters: updated,
        focusKeyword
      }, '*');
    }
  }, [filters, enabled, iframeRef, focusKeyword]);

  // Toggle single filter
  const toggleFilter = useCallback((key: keyof SEOOverlayFilters) => {
    updateFilters({ [key]: !filters[key] });
  }, [filters, updateFilters]);

  // Rescan page
  const rescan = useCallback(() => {
    if (enabled) {
      setStats(null); // Reset stats to show loading
      setError(null); // Clear errors
      injectOverlay();
    }
  }, [enabled, injectOverlay]);

  // Scroll to element in iframe
  const scrollToElement = useCallback((elementId: string) => {
    if (!iframeRef.current || !enabled) return;
    
    iframeRef.current.contentWindow?.postMessage({
      type: 'seo-overlay-scroll-to',
      elementId
    }, '*');
  }, [iframeRef, enabled]);

  // Get element by ID
  const getElementById = useCallback((id: string) => {
    return elements.find(el => el.id === id);
  }, [elements]);

  // Get issues for element
  const getIssuesForElement = useCallback((elementId: string) => {
    return issues.filter(issue => issue.elementId === elementId);
  }, [issues]);

  return {
    // State
    enabled,
    mode,
    stats: computedStats,
    elements,
    issues: filteredIssues,
    issueCounts,
    filters,
    error,
    hoveredElement,
    selectedElement,
    
    // Actions
    setEnabled,
    setMode,
    toggleOverlay,
    updateFilters,
    toggleFilter,
    rescan,
    injectOverlay,
    clearOverlay,
    scrollToElement,
    
    // Helpers
    getElementById,
    getIssuesForElement,
  };
}
