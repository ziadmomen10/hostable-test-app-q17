/**
 * useSEOFormState Tests
 * 
 * Tests for SEO form state management hook - 15 test cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Polyfill waitFor using vitest
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
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSEOFormState, SEOFormData } from '../hooks/useSEOFormState';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      insert: vi.fn().mockReturnThis(),
    })),
  },
}));

// Create wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useSEOFormState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============= Initial State Tests =============
  describe('Initial State', () => {
    it('should start with loading state true', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should initialize with default form data', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.formData.metaTitle).toBe('');
        expect(result.current.formData.metaDescription).toBe('');
        expect(result.current.formData.focusKeyword).toBe('');
      });
    });

    it('should use page fallbacks when SEO data is missing', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ 
          pageId: 'test-id', 
          languageCode: 'en',
          pageTitle: 'Fallback Title',
          pageDescription: 'Fallback Description',
          pageOgImage: 'https://example.com/image.jpg'
        }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.formData.metaTitle).toBe('Fallback Title');
        expect(result.current.formData.metaDescription).toBe('Fallback Description');
        expect(result.current.formData.ogImageUrl).toBe('https://example.com/image.jpg');
      });
    });
  });

  // ============= Form Updates Tests =============
  describe('Form Updates', () => {
    it('should update single field correctly', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.hasInitialized).toBe(true);
      });

      act(() => {
        result.current.updateField('metaTitle', 'New Title');
      });

      expect(result.current.formData.metaTitle).toBe('New Title');
    });

    it('should update multiple fields at once with updateFields', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.hasInitialized).toBe(true);
      });

      act(() => {
        result.current.updateFields({
          metaTitle: 'Batch Title',
          metaDescription: 'Batch Description',
          focusKeyword: 'batch keyword',
        });
      });

      expect(result.current.formData.metaTitle).toBe('Batch Title');
      expect(result.current.formData.metaDescription).toBe('Batch Description');
      expect(result.current.formData.focusKeyword).toBe('batch keyword');
    });
  });

  // ============= Dirty Detection Tests =============
  describe('Dirty Detection', () => {
    it('should not be dirty initially', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.hasInitialized).toBe(true);
      });

      expect(result.current.isDirty).toBe(false);
    });

    it('should be dirty after field change', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.hasInitialized).toBe(true);
      });

      act(() => {
        result.current.updateField('metaTitle', 'Changed Title');
      });

      expect(result.current.isDirty).toBe(true);
    });

    it('should reset to original data and clear dirty state', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ 
          pageId: 'test-id', 
          languageCode: 'en',
          pageTitle: 'Original Title'
        }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.hasInitialized).toBe(true);
      });

      act(() => {
        result.current.updateField('metaTitle', 'Changed Title');
      });

      expect(result.current.isDirty).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.formData.metaTitle).toBe('Original Title');
      expect(result.current.isDirty).toBe(false);
    });

    it('should mark as clean after calling markClean', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.hasInitialized).toBe(true);
      });

      act(() => {
        result.current.updateField('metaTitle', 'New Title');
      });

      expect(result.current.isDirty).toBe(true);

      act(() => {
        result.current.markClean();
      });

      expect(result.current.isDirty).toBe(false);
    });
  });

  // ============= Language Records Tests =============
  describe('Language Records', () => {
    it('should create SEO record for non-English languages when missing', async () => {
      const insertMock = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: { id: 'new-record', meta_title: 'Test', language_code: 'ar' }, 
          error: null 
        }),
      });
      
      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === 'page_seo') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            insert: insertMock,
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ 
          pageId: 'test-id', 
          languageCode: 'ar',
          pageTitle: 'Arabic Title'
        }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.hasInitialized).toBe(true);
      });

      // Verify insert was called for non-English language
      expect(insertMock).toHaveBeenCalled();
    });

    it('should skip record creation for English (default) language', async () => {
      const insertMock = vi.fn();
      
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        insert: insertMock,
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.hasInitialized).toBe(true);
      });

      // Insert should NOT be called for English
      expect(insertMock).not.toHaveBeenCalled();
    });
  });

  // ============= Structured Data Tests =============
  describe('Structured Data', () => {
    it('should serialize structured data as JSON string', async () => {
      const mockStructuredData = { "@type": "Article", "name": "Test" };
      
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ 
          data: { 
            id: 'test-seo',
            structured_data: mockStructuredData,
            meta_title: 'Test Title'
          }, 
          error: null 
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.hasInitialized).toBe(true);
      });

      expect(result.current.formData.structuredData).toContain('"@type"');
      expect(result.current.formData.structuredData).toContain('"Article"');
    });

    it('should handle empty structured data', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ 
          data: { 
            id: 'test-seo',
            structured_data: null,
            meta_title: 'Test'
          }, 
          error: null 
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.hasInitialized).toBe(true);
      });

      expect(result.current.formData.structuredData).toBe('');
    });
  });

  // ============= SEO Record ID Tests =============
  describe('SEO Record ID', () => {
    it('should expose seoId when record exists', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ 
          data: { id: 'existing-seo-record-id', meta_title: 'Test' }, 
          error: null 
        }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.seoId).toBe('existing-seo-record-id');
      });
    });

    it('should return undefined seoId when record is missing', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });
      vi.mocked(supabase.from).mockImplementation(mockFrom);

      const { result } = renderHook(
        () => useSEOFormState({ pageId: 'test-id', languageCode: 'en' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.hasInitialized).toBe(true);
      });

      expect(result.current.seoId).toBeUndefined();
    });
  });
});
