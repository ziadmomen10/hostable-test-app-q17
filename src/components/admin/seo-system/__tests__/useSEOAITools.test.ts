/**
 * useSEOAITools Tests
 * 
 * Tests for AI-powered SEO tools hook - 17 test cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Polyfill waitFor
const waitFor = async (callback: () => void | Promise<void>, options: { timeout?: number } = {}) => {
  const timeout = options.timeout || 1000;
  const startTime = Date.now();
  
  while (true) {
    try {
      await callback();
      return;
    } catch (error) {
      if (Date.now() - startTime > timeout) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
};
import { useSEOAITools } from '../hooks/useSEOAITools';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      not: vi.fn().mockResolvedValue({ data: [], error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('useSEOAITools', () => {
  const defaultOptions = {
    pageId: 'test-page-id',
    languageCode: 'en',
    content: 'Test page content for AI analysis',
    pageTitle: 'Test Page Title',
    pageUrl: '/test-page',
    focusKeyword: 'test keyword',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============= Initial State Tests =============
  describe('Initial State', () => {
    it('should start with no loading states', () => {
      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      expect(result.current.isAnyLoading).toBe(false);
      expect(result.current.isLoading.generate_meta).toBe(false);
      expect(result.current.isLoading.generate_faq).toBe(false);
    });

    it('should start with no error', () => {
      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      expect(result.current.error).toBeNull();
    });
  });

  // ============= Generate Meta Tests =============
  describe('Generate Meta', () => {
    it('should call edge function with correct action', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: {
          title: 'Generated Title',
          description: 'Generated Description',
          titleCharCount: 15,
          descriptionCharCount: 21,
        },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      await act(async () => {
        await result.current.generateMeta();
      });

      expect(supabase.functions.invoke).toHaveBeenCalledWith(
        'seo-ai-tools',
        expect.objectContaining({
          body: expect.objectContaining({
            action: 'generate_meta',
            pageId: 'test-page-id',
          }),
        })
      );
    });

    it('should return meta suggestion on success', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: {
          title: 'AI Generated Title for SEO',
          description: 'AI generated meta description that is optimized for search engines.',
          titleCharCount: 26,
          descriptionCharCount: 63,
          reasoning: 'Based on content analysis',
        },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      let response;
      await act(async () => {
        response = await result.current.generateMeta();
      });

      expect(response).toEqual(expect.objectContaining({
        title: 'AI Generated Title for SEO',
        description: expect.any(String),
      }));
      expect(toast.success).toHaveBeenCalled();
    });

    it('should set loading state during generation', async () => {
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      vi.mocked(supabase.functions.invoke).mockReturnValue(pendingPromise as any);

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      // Start generation without awaiting
      act(() => {
        result.current.generateMeta();
      });

      // Should be loading
      expect(result.current.isLoading.generate_meta).toBe(true);
      expect(result.current.isAnyLoading).toBe(true);

      // Resolve the promise
      await act(async () => {
        resolvePromise!({ data: { title: 'Test', description: 'Test' }, error: null });
      });

      // Should no longer be loading
      expect(result.current.isLoading.generate_meta).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: new Error('API Error'),
      });

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      await act(async () => {
        await result.current.generateMeta();
      });

      expect(result.current.error).toBeDefined();
      expect(toast.error).toHaveBeenCalled();
    });

    it('should show rate limit toast', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { error: 'Rate limit exceeded' },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      await act(async () => {
        await result.current.generateMeta();
      });

      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Rate limit')
      );
    });
  });

  // ============= Generate FAQ Tests =============
  describe('Generate FAQ', () => {
    it('should generate FAQ schema', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: {
          faqs: [
            { question: 'What is SEO?', answer: 'SEO is...' },
            { question: 'How does it work?', answer: 'It works by...' },
          ],
          schema: { "@type": "FAQPage" },
        },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      let response;
      await act(async () => {
        response = await result.current.generateFAQ();
      });

      expect(response?.faqs).toHaveLength(2);
      expect(response?.schema).toBeDefined();
    });

    it('should show toast with FAQ count', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: {
          faqs: [
            { question: 'Q1', answer: 'A1' },
            { question: 'Q2', answer: 'A2' },
            { question: 'Q3', answer: 'A3' },
          ],
          schema: {},
        },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      await act(async () => {
        await result.current.generateFAQ();
      });

      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('3')
      );
    });
  });

  // ============= Keywords Tests =============
  describe('Keywords', () => {
    it('should return primary keyword', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: {
          primaryKeyword: {
            keyword: 'main keyword',
            reasoning: 'High search volume',
          },
          secondaryKeywords: [],
          placementMatrix: {},
        },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      let response;
      await act(async () => {
        response = await result.current.suggestKeywords();
      });

      expect(response?.primaryKeyword.keyword).toBe('main keyword');
    });

    it('should return secondary keywords array', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: {
          primaryKeyword: { keyword: 'main', reasoning: '' },
          secondaryKeywords: [
            { keyword: 'related 1', type: 'lsi', usage: 'Use in subheadings' },
            { keyword: 'related 2', type: 'long-tail', usage: 'Use in content' },
          ],
          placementMatrix: {},
        },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      let response;
      await act(async () => {
        response = await result.current.suggestKeywords();
      });

      expect(response?.secondaryKeywords).toHaveLength(2);
      expect(response?.secondaryKeywords[0].type).toBe('lsi');
    });
  });

  // ============= Voice Optimization Tests =============
  describe('Voice Optimization', () => {
    it('should generate featured snippet', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: {
          featuredSnippet: {
            question: 'What is SEO?',
            answer: 'SEO is the practice of optimizing websites for search engines.',
            type: 'paragraph',
          },
          conversationalRewrites: [],
          suggestedQuestions: [],
        },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      let response;
      await act(async () => {
        response = await result.current.optimizeVoice();
      });

      expect(response?.featuredSnippet).toBeDefined();
      expect(response?.featuredSnippet.type).toBe('paragraph');
    });
  });

  // ============= Entity Building Tests =============
  describe('Entity Building', () => {
    it('should generate organization schema', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: {
          schema: {
            "@type": "Organization",
            "name": "Test Company",
            "url": "https://example.com",
          },
          suggestions: ['Add social links'],
          missingElements: ['logo'],
        },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      let response;
      await act(async () => {
        response = await result.current.buildEntity({
          type: 'Organization',
          name: 'Test Company',
          url: 'https://example.com',
        });
      });

      expect(response?.schema['@type']).toBe('Organization');
      expect(toast.success).toHaveBeenCalled();
    });
  });

  // ============= Fact Enrichment Tests =============
  describe('Fact Enrichment', () => {
    it('should return suggestions and density', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: {
          suggestions: [
            {
              type: 'statistic',
              suggestion: 'Add: 85% of websites use SEO',
              placement: 'Introduction',
              citabilityImpact: 'high',
            },
          ],
          currentFactDensity: 'low',
          overallRecommendation: 'Add more statistics',
        },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools(defaultOptions));

      let response;
      await act(async () => {
        response = await result.current.enrichFacts();
      });

      expect(response?.suggestions).toHaveLength(1);
      expect(response?.currentFactDensity).toBe('low');
    });
  });

  // ============= Language Support Tests =============
  describe('Language Support', () => {
    it('should fetch translated content for non-English', async () => {
      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === 'languages') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'ar-id' }, error: null }),
          };
        }
        if (table === 'pages') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { page_url: '/test' }, error: null }),
          };
        }
        if (table === 'translations') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            like: vi.fn().mockReturnThis(),
            not: vi.fn().mockResolvedValue({ 
              data: [
                { key: 'page.test.title', value: 'العنوان' },
              ], 
              error: null 
            }),
          };
        }
        return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { title: 'عنوان جديد', description: 'وصف بالعربية' },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools({
        ...defaultOptions,
        languageCode: 'ar',
      }));

      await act(async () => {
        await result.current.generateMeta();
      });

      // Verify that languages table was queried for Arabic
      expect(supabase.from).toHaveBeenCalledWith('languages');
    });
  });

  // ============= Context Passing Tests =============
  describe('Context Passing', () => {
    it('should pass focusKeyword in context', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { title: 'Test', description: 'Test' },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools({
        ...defaultOptions,
        focusKeyword: 'specific keyword',
      }));

      await act(async () => {
        await result.current.generateMeta();
      });

      expect(supabase.functions.invoke).toHaveBeenCalledWith(
        'seo-ai-tools',
        expect.objectContaining({
          body: expect.objectContaining({
            context: expect.objectContaining({
              focusKeyword: 'specific keyword',
            }),
          }),
        })
      );
    });

    it('should pass pageTitle in context', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { title: 'Test', description: 'Test' },
        error: null,
      });

      const { result } = renderHook(() => useSEOAITools({
        ...defaultOptions,
        pageTitle: 'My Page Title',
      }));

      await act(async () => {
        await result.current.generateMeta();
      });

      expect(supabase.functions.invoke).toHaveBeenCalledWith(
        'seo-ai-tools',
        expect.objectContaining({
          body: expect.objectContaining({
            context: expect.objectContaining({
              pageTitle: 'My Page Title',
            }),
          }),
        })
      );
    });
  });
});
