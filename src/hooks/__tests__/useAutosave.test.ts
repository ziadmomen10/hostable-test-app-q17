import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the useUpdatePage hook before importing useAutosave
const mockMutate = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock('../queries/usePageMutations', () => ({
  useUpdatePage: () => ({
    mutate: mockMutate,
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

import { useAutosave } from '../queries/useAutosave';

describe('useAutosave', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.useFakeTimers();
    vi.clearAllMocks();

    // Setup default mock behavior
    mockMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Status Management', () => {
    it('should start with idle status', () => {
      const { result } = renderHook(() => useAutosave('test-page-id'), {
        wrapper: createWrapper(),
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.isSaving).toBe(false);
      expect(result.current.isSaved).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should reset status to idle', () => {
      const { result } = renderHook(() => useAutosave('test-page-id'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.status).toBe('idle');
    });
  });

  describe('Debounced Save', () => {
    it('should debounce multiple rapid saves', () => {
      const { result } = renderHook(
        () => useAutosave('test-page-id', { debounceMs: 1000 }),
        { wrapper: createWrapper() }
      );

      act(() => {
        result.current.save('<p>Content 1</p>', '.test1 {}');
        result.current.save('<p>Content 2</p>', '.test2 {}');
        result.current.save('<p>Content 3</p>', '.test3 {}');
      });

      // Before debounce completes
      expect(mockMutate).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Only the last save should be called
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '<p>Content 3</p>',
          css_content: '.test3 {}',
        }),
        expect.any(Object)
      );
    });

    it('should use default debounce of 2000ms', () => {
      const { result } = renderHook(() => useAutosave('test-page-id'), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.save('<p>Test</p>', '.test {}');
      });

      act(() => {
        vi.advanceTimersByTime(1500);
      });
      expect(mockMutate).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  describe('Immediate Save', () => {
    it('should save immediately without debounce', async () => {
      mockMutateAsync.mockResolvedValue({});

      const { result } = renderHook(() => useAutosave('test-page-id'), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.saveImmediately('<p>Immediate</p>', '.immediate {}');
      });

      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: '<p>Immediate</p>',
          css_content: '.immediate {}',
        })
      );
    });

    it('should clear pending debounced save when saving immediately', async () => {
      mockMutateAsync.mockResolvedValue({});

      const { result } = renderHook(
        () => useAutosave('test-page-id', { debounceMs: 2000 }),
        { wrapper: createWrapper() }
      );

      act(() => {
        result.current.save('<p>Debounced</p>', '.debounced {}');
      });

      await act(async () => {
        await result.current.saveImmediately('<p>Immediate</p>', '.immediate {}');
      });

      // Advance past debounce time
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Only immediate save should have been called
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('Skip Unchanged Content', () => {
    it('should skip save if content is unchanged', () => {
      const { result } = renderHook(
        () => useAutosave('test-page-id', { debounceMs: 100 }),
        { wrapper: createWrapper() }
      );

      // First save
      act(() => {
        result.current.save('<p>Same content</p>', '.same {}');
        vi.advanceTimersByTime(100);
      });

      expect(mockMutate).toHaveBeenCalledTimes(1);
      mockMutate.mockClear();

      // Second save with same content
      act(() => {
        result.current.save('<p>Same content</p>', '.same {}');
        vi.advanceTimersByTime(100);
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('should save if CSS content changes', () => {
      const { result } = renderHook(
        () => useAutosave('test-page-id', { debounceMs: 100 }),
        { wrapper: createWrapper() }
      );

      act(() => {
        result.current.save('<p>Content</p>', '.style1 {}');
        vi.advanceTimersByTime(100);
      });

      mockMutate.mockClear();

      act(() => {
        result.current.save('<p>Content</p>', '.style2 {}');
        vi.advanceTimersByTime(100);
      });

      expect(mockMutate).toHaveBeenCalled();
    });
  });

  describe('Callbacks', () => {
    it('should call onSaveStart when save begins', () => {
      const onSaveStart = vi.fn();

      const { result } = renderHook(
        () => useAutosave('test-page-id', { debounceMs: 100, onSaveStart }),
        { wrapper: createWrapper() }
      );

      act(() => {
        result.current.save('<p>Test</p>', '.test {}');
        vi.advanceTimersByTime(100);
      });

      expect(onSaveStart).toHaveBeenCalled();
    });

    it('should call onSaveComplete on successful save', () => {
      const onSaveComplete = vi.fn();

      const { result } = renderHook(
        () => useAutosave('test-page-id', { debounceMs: 100, onSaveComplete }),
        { wrapper: createWrapper() }
      );

      act(() => {
        result.current.save('<p>Test</p>', '.test {}');
        vi.advanceTimersByTime(100);
      });

      expect(onSaveComplete).toHaveBeenCalled();
    });

    it('should call onSaveError on failed save', () => {
      const onSaveError = vi.fn();
      const testError = new Error('Save failed');

      mockMutate.mockImplementation((data, options) => {
        if (options?.onError) {
          options.onError(testError);
        }
      });

      const { result } = renderHook(
        () => useAutosave('test-page-id', { debounceMs: 100, onSaveError }),
        { wrapper: createWrapper() }
      );

      act(() => {
        result.current.save('<p>Test</p>', '.test {}');
        vi.advanceTimersByTime(100);
      });

      expect(onSaveError).toHaveBeenCalledWith(testError);
    });
  });

  describe('Status Transitions', () => {
    it('should transition through saving -> saved states', async () => {
      const statusHistory: string[] = [];

      const { result } = renderHook(
        () => useAutosave('test-page-id', { debounceMs: 100 }),
        { wrapper: createWrapper() }
      );

      // Capture initial status
      statusHistory.push(result.current.status);

      act(() => {
        result.current.save('<p>Test</p>', '.test {}');
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // After successful save
      statusHistory.push(result.current.status);

      expect(statusHistory).toContain('idle');
      expect(result.current.status).toBe('saved');
    });

    it('should set error status on failure', () => {
      mockMutate.mockImplementation((data, options) => {
        if (options?.onError) {
          options.onError(new Error('Failed'));
        }
      });

      const { result } = renderHook(
        () => useAutosave('test-page-id', { debounceMs: 100 }),
        { wrapper: createWrapper() }
      );

      act(() => {
        result.current.save('<p>Test</p>', '.test {}');
        vi.advanceTimersByTime(100);
      });

      expect(result.current.status).toBe('error');
      expect(result.current.isError).toBe(true);
    });
  });
});
