/**
 * EditorModeContext
 * 
 * A simple context to indicate if we're in editor mode.
 * This is separate from editorStore to avoid circular dependencies
 * when EditableElement needs to know if it should show translation badges.
 * 
 * Also provides pageData for translation status checking without importing editorStore.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import type { PageData } from '@/types/reactEditor';

interface EditorModeContextValue {
  isEditorMode: boolean;
  showTranslationBadges: boolean;
  pageData: PageData | null;
}

const EditorModeContext = createContext<EditorModeContextValue>({
  isEditorMode: false,
  showTranslationBadges: false,
  pageData: null,
});

export function EditorModeProvider({ 
  children,
  isEditorMode = false,
  showTranslationBadges = false,
  pageData = null,
}: { 
  children: ReactNode;
  isEditorMode?: boolean;
  showTranslationBadges?: boolean;
  pageData?: PageData | null;
}) {
  return (
    <EditorModeContext.Provider value={{ isEditorMode, showTranslationBadges, pageData }}>
      {children}
    </EditorModeContext.Provider>
  );
}

export function useEditorModeContext() {
  return useContext(EditorModeContext);
}

export default EditorModeContext;
