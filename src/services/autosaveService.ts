/**
 * Autosave Service
 * 
 * Extracted autosave logic from EditorProvider.
 * Handles debounced saving of page data to Supabase.
 * 
 * This service is a pure utility hook that:
 * - Subscribes to store changes
 * - Debounces save operations
 * - Handles save on unmount
 * - Reports save status
 */

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEditorStore } from '@/stores/editorStore';
import { PageData } from '@/types/reactEditor';
import { logger } from '@/lib/logger';

// ============================================================================
// Types
// ============================================================================

interface AutosaveConfig {
  pageId: string;
  debounceMs?: number;
  onSave?: (pageData: PageData) => Promise<void>;
}

interface AutosaveResult {
  saveNow: () => Promise<boolean>;
  isSaving: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_DEBOUNCE_MS = 2000;

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * useAutosave hook
 * 
 * Automatically saves page data when changes are detected.
 * Handles debouncing, status updates, and save on unmount.
 */
export function useAutosave({ 
  pageId, 
  debounceMs = DEFAULT_DEBOUNCE_MS,
  onSave 
}: AutosaveConfig): AutosaveResult {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  
  const {
    pageData,
    hasUnsavedChanges,
    requiresImmediateSave,
    isSaving,
    setAutosaveStatus,
    markSaved,
    setSaving,
  } = useEditorStore();

  /**
   * Perform the actual save operation
   */
  const performSave = useCallback(async (data: PageData): Promise<boolean> => {
    try {
      // VALIDATION: Ensure pageData has proper format before saving
      if (!data.version || !Array.isArray(data.sections)) {
        logger.autosave.error('Invalid pageData format - missing version or sections', {
          hasVersion: !!data.version,
          hasSections: Array.isArray(data.sections),
          dataType: typeof data,
        });
        return false;
      }

      // CRITICAL SAFEGUARD: Prevent saving empty sections when original had content
      // This protects against accidental data wipes from race conditions or stale state
      // EXCEPTION: If requiresImmediateSave is true, this is an intentional user action (e.g., delete section)
      const { originalPageData, requiresImmediateSave: isIntentionalAction } = useEditorStore.getState();
      const currentSectionsCount = data.sections?.length || 0;
      const originalSectionsCount = originalPageData?.sections?.length || 0;

      // Only block if this is NOT an intentional user action
      if (currentSectionsCount === 0 && originalSectionsCount > 0 && !isIntentionalAction) {
        logger.autosave.error('BLOCKED: Attempted to save empty sections when original had content', {
          originalCount: originalSectionsCount,
          currentCount: currentSectionsCount,
        });
        return false; // Block the save to prevent data loss
      }

      if (originalSectionsCount > 0 && currentSectionsCount < originalSectionsCount * 0.5 && !isIntentionalAction) {
        logger.autosave.warn('Significant section reduction detected', {
          originalCount: originalSectionsCount,
          currentCount: currentSectionsCount,
        });
      }

      // Ensure the data has proper structure (prevent saving just sections array)
      const normalizedData: PageData = {
        id: data.id || pageId,
        version: data.version || 1,
        sections: data.sections,
        metadata: data.metadata || {
          title: 'Page',
          lastModified: new Date().toISOString(),
        },
      };

      const updateTimestamp = new Date().toISOString();
      
      // Perform update and then verify it actually happened
      // Supabase returns 204 even when RLS blocks updates
      const { error } = await supabase
        .from('pages')
        .update({
          content: JSON.stringify(normalizedData),
          updated_at: updateTimestamp,
        })
        .eq('id', pageId);

      if (error) {
        logger.autosave.error('Autosave failed', { error: error.message });
        return false;
      }
      
      // Verify the update actually happened by checking the updated_at timestamp
      const { data: verifyData, error: verifyError } = await supabase
        .from('pages')
        .select('updated_at')
        .eq('id', pageId)
        .single();
      
      if (verifyError) {
        logger.autosave.error('Verification query failed - save may not have persisted:', verifyError);
        return false;
      } else {
        // Compare timestamps with tolerance for format/precision differences
        const savedTime = new Date(verifyData?.updated_at || 0).getTime();
        const expectedTime = new Date(updateTimestamp).getTime();
        const timeDiff = Math.abs(savedTime - expectedTime);

        // Allow 10 second tolerance (network delays, clock skew, DB processing)
        if (timeDiff > 10000) {
          logger.autosave.error('Save verification failed: timestamp mismatch (possible RLS block or concurrent edit)', {
            expected: updateTimestamp,
            actual: verifyData?.updated_at,
            diffMs: timeDiff
          });
          return false;
        }
      }

      // Call optional onSave callback
      if (onSave) {
        await onSave(normalizedData);
      }

      logger.autosave.info('Page saved successfully', { 
        pageId, 
        sectionsCount: normalizedData.sections.length 
      });
      return true;
    } catch (error) {
      logger.autosave.error('Save failed:', error);
      return false;
    }
  }, [pageId, onSave]);

  /**
   * Manual save function - saves immediately, returns success status
   */
  const saveNow = useCallback(async (): Promise<boolean> => {
    if (!pageData || isSavingRef.current) return false;

    isSavingRef.current = true;
    setSaving(true);
    setAutosaveStatus('saving');

    try {
      const success = await performSave(pageData);
      if (success) {
        // Update originalPageData to reflect the new saved state
        // This ensures future save operations use the correct baseline
        useEditorStore.setState({ originalPageData: JSON.parse(JSON.stringify(pageData)) });
        markSaved();
        setAutosaveStatus('saved');
        logger.autosave.info('Manual save successful');
        return true;
      } else {
        setAutosaveStatus('error');
        return false;
      }
    } finally {
      isSavingRef.current = false;
      setSaving(false);
    }
  }, [pageData, performSave, setSaving, setAutosaveStatus, markSaved]);

  /**
   * Debounced autosave effect (or immediate for critical changes)
   */
  useEffect(() => {
    // Skip if no changes, no data, or already saving
    if (!hasUnsavedChanges || !pageData || isSaving) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Immediate save for critical/destructive operations (section delete, reorder)
    if (requiresImmediateSave) {
      logger.autosave.info('Immediate save triggered for critical change');
      
      (async () => {
        if (isSavingRef.current) return;
        isSavingRef.current = true;
        setAutosaveStatus('saving');

        try {
          const success = await performSave(pageData);
          if (success) {
            // Update originalPageData to reflect the new saved state
            useEditorStore.setState({ 
              originalPageData: JSON.parse(JSON.stringify(pageData)),
              requiresImmediateSave: false 
            });
            markSaved();
            logger.autosave.info('Immediate save successful');
          } else {
            setAutosaveStatus('error');
          }
        } finally {
          isSavingRef.current = false;
        }
      })();

      return;
    }

    // Normal debounced save for regular edits
    logger.autosave.debug('Changes detected, scheduling save...');
    setAutosaveStatus('pending');

    // Schedule save
    timeoutRef.current = setTimeout(async () => {
      if (isSavingRef.current) return;

      isSavingRef.current = true;
      setAutosaveStatus('saving');
      logger.autosave.debug('Executing debounced save...');

      try {
        const success = await performSave(pageData);
        if (success) {
          // Update originalPageData to reflect the new saved state
          useEditorStore.setState({ originalPageData: JSON.parse(JSON.stringify(pageData)) });
          markSaved();
          logger.autosave.info('Debounced save successful');
        } else {
          setAutosaveStatus('error');
        }
      } finally {
        isSavingRef.current = false;
      }
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, requiresImmediateSave, pageData, isSaving, debounceMs, performSave, setAutosaveStatus, markSaved]);

  /**
   * Warn user before leaving with unsaved changes
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const { hasUnsavedChanges: hasChanges } = useEditorStore.getState();
      
      if (hasChanges) {
        // Show browser warning for unsaved changes
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  /**
   * Save on unmount if there are unsaved changes
   */
  useEffect(() => {
    return () => {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Get current state at unmount time
      const { pageData: currentData, hasUnsavedChanges: hasChanges } = useEditorStore.getState();
      
      if (hasChanges && currentData) {
        logger.autosave.info('Saving on unmount...');
        
        // Fire and forget - we're unmounting so we can't wait
        supabase
          .from('pages')
          .update({
            content: JSON.stringify(currentData),
            updated_at: new Date().toISOString(),
          })
          .eq('id', pageId)
          .then(({ error }) => {
            if (error) {
              logger.autosave.error('Unmount save failed:', error);
            } else {
              logger.autosave.info('Unmount save successful');
            }
          });
      }
    };
  }, [pageId]);

  return {
    saveNow,
    isSaving,
  };
}

export default useAutosave;
