import { useState, useCallback, useRef, useEffect } from 'react';
import { useUpdatePage } from './usePageMutations';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutosaveOptions {
  debounceMs?: number;
  onSaveStart?: () => void;
  onSaveComplete?: () => void;
  onSaveError?: (error: Error) => void;
}

export const useAutosave = (
  pageId: string | undefined,
  options: UseAutosaveOptions = {}
) => {
  const { debounceMs = 2000, onSaveStart, onSaveComplete, onSaveError } = options;
  
  const [status, setStatus] = useState<SaveStatus>('idle');
  const updatePage = useUpdatePage({ showToast: false });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<{ content: string; css: string } | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const save = useCallback(
    (content: string, cssContent: string) => {
      if (!pageId) return;

      // Skip if content hasn't changed
      if (
        lastSavedRef.current?.content === content &&
        lastSavedRef.current?.css === cssContent
      ) {
        return;
      }

      // Clear any pending save
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce the save
      timeoutRef.current = setTimeout(() => {
        setStatus('saving');
        onSaveStart?.();

        updatePage.mutate(
          {
            pageId,
            updates: { content, css_content: cssContent },
          },
          {
            onSuccess: () => {
              lastSavedRef.current = { content, css: cssContent };
              setStatus('saved');
              onSaveComplete?.();
              
              // Reset to idle after 3 seconds
              setTimeout(() => {
                setStatus((current) => (current === 'saved' ? 'idle' : current));
              }, 3000);
            },
            onError: (error) => {
              setStatus('error');
              onSaveError?.(error as Error);
            },
          }
        );
      }, debounceMs);
    },
    [pageId, debounceMs, updatePage, onSaveStart, onSaveComplete, onSaveError]
  );

  const saveImmediately = useCallback(
    async (content: string, cssContent: string) => {
      if (!pageId) return;

      // Clear any pending debounced save
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setStatus('saving');
      onSaveStart?.();

      try {
        await updatePage.mutateAsync({
          pageId,
          updates: { content, css_content: cssContent },
        });
        
        lastSavedRef.current = { content, css: cssContent };
        setStatus('saved');
        onSaveComplete?.();
      } catch (error) {
        setStatus('error');
        onSaveError?.(error as Error);
        throw error;
      }
    },
    [pageId, updatePage, onSaveStart, onSaveComplete, onSaveError]
  );

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setStatus('idle');
    lastSavedRef.current = null;
  }, []);

  return {
    save,
    saveImmediately,
    reset,
    status,
    isSaving: status === 'saving',
    isSaved: status === 'saved',
    isError: status === 'error',
    isPending: updatePage.isPending,
  };
};
