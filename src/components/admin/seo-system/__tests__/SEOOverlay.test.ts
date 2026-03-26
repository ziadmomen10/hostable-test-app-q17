/**
 * SEOOverlay Tests
 * 
 * Tests for overlay types, filters, and utilities - 23 test cases
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_FILTERS,
  SEVERITY_ORDER,
  type SEOOverlayFilters,
  type SEOOverlayStats,
  type HighlightedElement,
  type SEOOverlayIssue,
  type IssueSeverity,
} from '../overlay/types';

describe('SEOOverlay Types and Utilities', () => {
  // ============= DEFAULT_FILTERS Tests =============
  describe('DEFAULT_FILTERS', () => {
    it('should have all filter categories enabled by default', () => {
      expect(DEFAULT_FILTERS.h1).toBe(true);
      expect(DEFAULT_FILTERS.h2h6).toBe(true);
      expect(DEFAULT_FILTERS.images).toBe(true);
      expect(DEFAULT_FILTERS.linksInternal).toBe(true);
      expect(DEFAULT_FILTERS.linksExternal).toBe(true);
      expect(DEFAULT_FILTERS.schema).toBe(true);
      expect(DEFAULT_FILTERS.meta).toBe(true);
      expect(DEFAULT_FILTERS.accessibility).toBe(true);
    });

    it('should have issuesOnly disabled by default', () => {
      expect(DEFAULT_FILTERS.issuesOnly).toBe(false);
    });

    it('should have keywordFocused disabled by default', () => {
      expect(DEFAULT_FILTERS.keywordFocused).toBe(false);
    });
  });

  // ============= SEVERITY_ORDER Tests =============
  describe('SEVERITY_ORDER', () => {
    it('should rank critical as 0 (highest priority)', () => {
      expect(SEVERITY_ORDER.critical).toBe(0);
    });

    it('should rank high as 1', () => {
      expect(SEVERITY_ORDER.high).toBe(1);
    });

    it('should rank medium as 2', () => {
      expect(SEVERITY_ORDER.medium).toBe(2);
    });

    it('should rank low as 3 (lowest priority)', () => {
      expect(SEVERITY_ORDER.low).toBe(3);
    });

    it('should allow sorting issues by severity', () => {
      const issues: { severity: IssueSeverity; title: string }[] = [
        { severity: 'low', title: 'Minor issue' },
        { severity: 'critical', title: 'Critical issue' },
        { severity: 'medium', title: 'Medium issue' },
        { severity: 'high', title: 'High issue' },
      ];

      const sorted = [...issues].sort(
        (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
      );

      expect(sorted[0].severity).toBe('critical');
      expect(sorted[1].severity).toBe('high');
      expect(sorted[2].severity).toBe('medium');
      expect(sorted[3].severity).toBe('low');
    });
  });

  // ============= Stats Interface Tests =============
  describe('Stats Interface', () => {
    it('should accept valid stats object', () => {
      const stats: SEOOverlayStats = {
        h1: 1,
        h2: 3,
        h3: 5,
        h4: 2,
        h5: 0,
        h6: 0,
        headingHierarchyValid: true,
        duplicateH1: false,
        imgOk: 10,
        imgMissing: 2,
        imgLazy: 5,
        imgBroken: 0,
        internal: 15,
        external: 5,
        externalNofollow: 2,
        emptyLinks: 0,
        hasTitle: true,
        titleLength: 55,
        titleContent: 'Test Page Title',
        hasDescription: true,
        descriptionLength: 150,
        descriptionContent: 'Test description',
        hasCanonical: true,
        canonicalUrl: 'https://example.com/page',
        robotsDirective: 'index,follow',
        isNoindex: false,
        isNofollow: false,
        schema: ['Article', 'Organization'],
        hasOpenGraph: true,
        hasTwitterCard: true,
        hreflangCount: 3,
        hasLangAttr: true,
        langAttr: 'en',
        hasViewport: true,
        missingFormLabels: 0,
        duplicateIds: 0,
        ariaLandmarks: ['main', 'nav', 'footer'],
        wordCount: 1500,
        paragraphCount: 20,
      };

      expect(stats.h1).toBe(1);
      expect(stats.imgOk).toBe(10);
      expect(stats.hasTitle).toBe(true);
    });
  });

  // ============= Element Interface Tests =============
  describe('Element Interface', () => {
    it('should accept valid element without issue', () => {
      const element: HighlightedElement = {
        id: 'h1-001',
        type: 'h1',
        text: 'Main Heading',
        tagName: 'H1',
        details: {
          charCount: 12,
          level: 1,
        },
        position: { top: 100, left: 50, width: 200, height: 30 },
      };

      expect(element.type).toBe('h1');
      expect(element.issue).toBeUndefined();
    });

    it('should accept element with issue', () => {
      const element: HighlightedElement = {
        id: 'img-002',
        type: 'img-missing',
        text: '',
        tagName: 'IMG',
        details: {
          src: '/image.jpg',
          alt: undefined,
        },
        issue: 'missing-alt',
        severity: 'high',
        position: { top: 200, left: 100, width: 400, height: 300 },
        aiSuggestion: 'Add descriptive alt text: "Product showcase image"',
      };

      expect(element.issue).toBe('missing-alt');
      expect(element.severity).toBe('high');
      expect(element.aiSuggestion).toBeDefined();
    });
  });

  // ============= Issue Interface Tests =============
  describe('Issue Interface', () => {
    it('should accept valid issue', () => {
      const issue: SEOOverlayIssue = {
        id: 'issue-001',
        type: 'missing-h1',
        severity: 'critical',
        title: 'Missing H1 Heading',
        description: 'The page does not have an H1 heading which is important for SEO.',
      };

      expect(issue.severity).toBe('critical');
      expect(issue.type).toBe('missing-h1');
    });

    it('should accept issue with fix information', () => {
      const issue: SEOOverlayIssue = {
        id: 'issue-002',
        type: 'title-too-short',
        severity: 'medium',
        title: 'Title Too Short',
        description: 'The meta title should be at least 30 characters.',
        elementId: 'meta-title',
        fix: {
          tab: 'meta',
          section: 'title',
          action: 'Expand the title to at least 30 characters',
        },
      };

      expect(issue.fix).toBeDefined();
      expect(issue.fix?.tab).toBe('meta');
      expect(issue.elementId).toBe('meta-title');
    });
  });

  // ============= Filter Logic Tests =============
  describe('Filter Logic', () => {
    it('should allow toggling individual filters', () => {
      const filters: SEOOverlayFilters = { ...DEFAULT_FILTERS };
      
      // Toggle h1 off
      filters.h1 = false;
      expect(filters.h1).toBe(false);
      expect(filters.h2h6).toBe(true); // Others unchanged
    });

    it('should support issues-only mode', () => {
      const filters: SEOOverlayFilters = { ...DEFAULT_FILTERS, issuesOnly: true };
      
      expect(filters.issuesOnly).toBe(true);
      
      // Simulate filtering elements
      const elements: HighlightedElement[] = [
        {
          id: '1',
          type: 'h1',
          text: 'Good H1',
          tagName: 'H1',
          details: {},
          position: { top: 0, left: 0, width: 100, height: 20 },
          // No issue
        },
        {
          id: '2',
          type: 'img-missing',
          text: '',
          tagName: 'IMG',
          details: {},
          position: { top: 0, left: 0, width: 100, height: 100 },
          issue: 'missing-alt',
          severity: 'high',
        },
      ];

      const filtered = filters.issuesOnly 
        ? elements.filter(el => el.issue) 
        : elements;

      expect(filtered).toHaveLength(1);
      expect(filtered[0].issue).toBe('missing-alt');
    });

    it('should support combined filters', () => {
      const filters: SEOOverlayFilters = {
        ...DEFAULT_FILTERS,
        h1: true,
        h2h6: false,
        images: true,
        linksInternal: false,
        linksExternal: false,
        schema: false,
        meta: false,
        accessibility: false,
        issuesOnly: false,
        keywordFocused: false,
      };

      const elements: HighlightedElement[] = [
        { id: '1', type: 'h1', text: 'H1', tagName: 'H1', details: {}, position: { top: 0, left: 0, width: 100, height: 20 } },
        { id: '2', type: 'h2', text: 'H2', tagName: 'H2', details: {}, position: { top: 0, left: 0, width: 100, height: 20 } },
        { id: '3', type: 'img-ok', text: 'Image', tagName: 'IMG', details: {}, position: { top: 0, left: 0, width: 100, height: 100 } },
        { id: '4', type: 'link-internal', text: 'Link', tagName: 'A', details: {}, position: { top: 0, left: 0, width: 100, height: 20 } },
      ];

      const filtered = elements.filter(el => {
        if (el.type === 'h1') return filters.h1;
        if (el.type.startsWith('h')) return filters.h2h6;
        if (el.type.startsWith('img')) return filters.images;
        if (el.type.startsWith('link')) return filters.linksInternal || filters.linksExternal;
        return true;
      });

      expect(filtered).toHaveLength(2); // h1 and img-ok
      expect(filtered.map(e => e.type)).toContain('h1');
      expect(filtered.map(e => e.type)).toContain('img-ok');
    });
  });

  // ============= Keyword Focus Tests =============
  describe('Keyword Focus', () => {
    it('should filter by keyword presence', () => {
      const focusKeyword = 'SEO';
      
      const elements: HighlightedElement[] = [
        { id: '1', type: 'h1', text: 'Learn SEO Basics', tagName: 'H1', details: {}, position: { top: 0, left: 0, width: 100, height: 20 } },
        { id: '2', type: 'h2', text: 'Marketing Guide', tagName: 'H2', details: {}, position: { top: 0, left: 0, width: 100, height: 20 } },
        { id: '3', type: 'h3', text: 'SEO Tips and Tricks', tagName: 'H3', details: {}, position: { top: 0, left: 0, width: 100, height: 20 } },
      ];

      const keywordFiltered = elements.filter(el => 
        el.text.toLowerCase().includes(focusKeyword.toLowerCase())
      );

      expect(keywordFiltered).toHaveLength(2);
      expect(keywordFiltered[0].text).toContain('SEO');
      expect(keywordFiltered[1].text).toContain('SEO');
    });
  });

  // ============= Issue Priority Tests =============
  describe('Issue Priority', () => {
    it('should group issues by severity', () => {
      const issues: SEOOverlayIssue[] = [
        { id: '1', type: 'missing-h1', severity: 'critical', title: 'Missing H1', description: '' },
        { id: '2', type: 'missing-alt', severity: 'high', title: 'Missing Alt', description: '' },
        { id: '3', type: 'title-too-short', severity: 'medium', title: 'Short Title', description: '' },
        { id: '4', type: 'missing-h1', severity: 'critical', title: 'Another Critical', description: '' },
        { id: '5', type: 'contrast-issue', severity: 'low', title: 'Contrast', description: '' },
      ];

      const grouped = issues.reduce((acc, issue) => {
        if (!acc[issue.severity]) acc[issue.severity] = [];
        acc[issue.severity].push(issue);
        return acc;
      }, {} as Record<IssueSeverity, SEOOverlayIssue[]>);

      expect(grouped.critical).toHaveLength(2);
      expect(grouped.high).toHaveLength(1);
      expect(grouped.medium).toHaveLength(1);
      expect(grouped.low).toHaveLength(1);
    });

    it('should count total issues', () => {
      const issues: SEOOverlayIssue[] = [
        { id: '1', type: 'missing-h1', severity: 'critical', title: 'Issue 1', description: '' },
        { id: '2', type: 'missing-alt', severity: 'high', title: 'Issue 2', description: '' },
        { id: '3', type: 'title-too-short', severity: 'medium', title: 'Issue 3', description: '' },
      ];

      expect(issues.length).toBe(3);

      const criticalCount = issues.filter(i => i.severity === 'critical').length;
      expect(criticalCount).toBe(1);
    });
  });

  // ============= Score Calculation Tests =============
  describe('Score Calculation', () => {
    const calculateOverlayScore = (stats: Partial<SEOOverlayStats>): number => {
      let score = 100;

      // H1 checks
      if (stats.h1 === 0) score -= 20;
      if (stats.duplicateH1) score -= 15;

      // Image checks
      if (stats.imgMissing && stats.imgMissing > 0) {
        score -= Math.min(stats.imgMissing * 5, 20);
      }

      // Title checks
      if (!stats.hasTitle) score -= 15;
      if (stats.titleLength && (stats.titleLength < 30 || stats.titleLength > 60)) {
        score -= 5;
      }

      // Description checks
      if (!stats.hasDescription) score -= 10;

      return Math.max(0, score);
    };

    it('should start with base score of 100', () => {
      const score = calculateOverlayScore({
        h1: 1,
        duplicateH1: false,
        imgMissing: 0,
        hasTitle: true,
        titleLength: 50,
        hasDescription: true,
      });

      expect(score).toBe(100);
    });

    it('should deduct for missing H1', () => {
      const score = calculateOverlayScore({
        h1: 0,
        duplicateH1: false,
        imgMissing: 0,
        hasTitle: true,
        titleLength: 50,
        hasDescription: true,
      });

      expect(score).toBe(80); // -20 for missing H1
    });

    it('should deduct for duplicate H1', () => {
      const score = calculateOverlayScore({
        h1: 2,
        duplicateH1: true,
        imgMissing: 0,
        hasTitle: true,
        titleLength: 50,
        hasDescription: true,
      });

      expect(score).toBe(85); // -15 for duplicate H1
    });

    it('should deduct for images missing alt text', () => {
      const score = calculateOverlayScore({
        h1: 1,
        duplicateH1: false,
        imgMissing: 3,
        hasTitle: true,
        titleLength: 50,
        hasDescription: true,
      });

      expect(score).toBe(85); // -15 for 3 images (5*3=15)
    });
  });
});
