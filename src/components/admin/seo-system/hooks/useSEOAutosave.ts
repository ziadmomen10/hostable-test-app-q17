/**
 * useSEOAutosave
 * 
 * Extracted autosave timer logic from SEORightPanel.
 * Handles debounced auto-saving with context-aware guards.
 * 
 * Gap A2: SEORightPanel refactoring
 */

import { useEffect, useRef, useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseSEOAutosaveOptions {
  isDirty: boolean;
  isPending: boolean;
  pageId: string;
  languageCode: string;
  saveMutation: UseMutationResult<any, Error, void, unknown>;
  delay?: number; // Default: 30 seconds
}

export function useSEOAutosave({
  isDirty,
  isPending,
  pageId,
  languageCode,
  saveMutation,
  delay = 30000,
}: UseSEOAutosaveOptions) {
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [autosaveError, setAutosaveError] = useState(false);

  // Autosave effect with error handling
  useEffect(() => {
    if (isDirty && !isPending) {
      // Clear existing timeout
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
      
      // Clear any previous error when user makes new changes
      setAutosaveError(false);
      
      // Set new autosave timeout
      autosaveTimeoutRef.current = setTimeout(() => {
        saveMutation.mutate(undefined, {
          onError: () => {
            setAutosaveError(true);
            toast.error('Autosave failed - please save manually');
          },
          onSuccess: () => {
            setAutosaveError(false);
          },
        });
      }, delay);
      
      return () => {
        if (autosaveTimeoutRef.current) {
          clearTimeout(autosaveTimeoutRef.current);
        }
      };
    }
  }, [isDirty, isPending, saveMutation, delay]);

  // Clear autosave timeout on language/page change to prevent wrong-language saves
  useEffect(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = null;
    }
  }, [pageId, languageCode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    autosaveError,
    clearAutosaveError: () => setAutosaveError(false),
  };
}
