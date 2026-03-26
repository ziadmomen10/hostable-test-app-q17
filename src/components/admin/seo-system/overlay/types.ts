/**
 * SEO Overlay Types
 * 
 * Type definitions for the enhanced SEO overlay system.
 */

export type ElementType = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'img-ok' | 'img-missing' | 'img-lazy' | 'img-broken'
  | 'link-internal' | 'link-external' | 'link-empty'
  | 'schema' | 'meta-title' | 'meta-description' | 'canonical' | 'robots'
  | 'og' | 'twitter' | 'hreflang'
  | 'a11y-contrast' | 'a11y-label' | 'a11y-landmark';

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export type IssueType = 
  | 'missing-h1' | 'duplicate-h1' | 'heading-skip'
  | 'missing-alt' | 'empty-alt' | 'broken-image'
  | 'empty-link' | 'broken-link'
  | 'missing-title' | 'title-too-short' | 'title-too-long'
  | 'missing-description' | 'description-too-short' | 'description-too-long'
  | 'missing-canonical' | 'noindex' | 'nofollow'
  | 'missing-og' | 'missing-twitter'
  | 'missing-lang' | 'duplicate-id'
  | 'contrast-issue' | 'missing-label' | 'tap-target-small';

export interface HighlightedElement {
  id: string;
  type: ElementType;
  text: string;
  tagName: string;
  details: {
    charCount?: number;
    src?: string;
    href?: string;
    alt?: string;
    rel?: string;
    target?: string;
    width?: number;
    height?: number;
    isLazy?: boolean;
    schemaType?: string;
    content?: string;
    level?: number;
    siblingCount?: number;
    domain?: string;
    isNofollow?: boolean;
    wordCount?: number;
  };
  issue?: IssueType;
  severity?: IssueSeverity;
  position: { top: number; left: number; width: number; height: number };
  aiSuggestion?: string;
}

export interface SEOOverlayStats {
  // Headings
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
  headingHierarchyValid: boolean;
  duplicateH1: boolean;
  
  // Images
  imgOk: number;
  imgMissing: number;
  imgLazy: number;
  imgBroken: number;
  
  // Links
  internal: number;
  external: number;
  externalNofollow: number;
  emptyLinks: number;
  
  // Meta & Schema
  hasTitle: boolean;
  titleLength: number;
  titleContent: string;
  hasDescription: boolean;
  descriptionLength: number;
  descriptionContent: string;
  hasCanonical: boolean;
  canonicalUrl: string | null;
  robotsDirective: string | null;
  isNoindex: boolean;
  isNofollow: boolean;
  schema: string[];
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  hreflangCount: number;
  hasLangAttr: boolean;
  langAttr: string | null;
  hasViewport: boolean;
  
  // Accessibility
  missingFormLabels: number;
  duplicateIds: number;
  ariaLandmarks: string[];
  
  // Content
  wordCount: number;
  paragraphCount: number;
}

export interface SEOOverlayFilters {
  h1: boolean;
  h2h6: boolean;
  images: boolean;
  linksInternal: boolean;
  linksExternal: boolean;
  schema: boolean;
  meta: boolean;
  accessibility: boolean;
  issuesOnly: boolean;
  keywordFocused: boolean;
}

export interface SEOOverlayIssue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  title: string;
  description: string;
  elementId?: string;
  fix?: {
    tab: string;
    section?: string;
    action?: string;
  };
}

export type OverlayMode = 'default' | 'heatmap-keyword' | 'heatmap-content' | 'heatmap-links' | 'accessibility';

// Message types for iframe communication
export interface OverlayStatsMessage {
  type: 'seo-overlay-stats';
  stats: SEOOverlayStats;
  elements: HighlightedElement[];
  issues: SEOOverlayIssue[];
}

export interface OverlayElementClickMessage {
  type: 'seo-overlay-element-click';
  element: HighlightedElement;
}

export interface OverlayElementHoverMessage {
  type: 'seo-overlay-element-hover';
  element: HighlightedElement | null;
}

export interface OverlayScrollCompleteMessage {
  type: 'seo-overlay-scroll-complete';
}

export type OverlayMessage = 
  | OverlayStatsMessage 
  | OverlayElementClickMessage 
  | OverlayElementHoverMessage 
  | OverlayScrollCompleteMessage;

// Default filter state
export const DEFAULT_FILTERS: SEOOverlayFilters = {
  h1: true,
  h2h6: true,
  images: true,
  linksInternal: true,
  linksExternal: true,
  schema: true,
  meta: true,
  accessibility: true,
  issuesOnly: false,
  keywordFocused: false,
};

// Issue severity ranking
export const SEVERITY_ORDER: Record<IssueSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};
