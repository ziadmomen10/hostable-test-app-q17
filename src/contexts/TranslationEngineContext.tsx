/**
 * Translation Engine Context
 * 
 * Provides translation engine state and actions to the editor.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslationEngine } from '@/hooks/useTranslationEngine';

// ============================================================================
// Types
// ============================================================================

type TranslationEngineContextValue = ReturnType<typeof useTranslationEngine> | null;

// ============================================================================
// Context
// ============================================================================

const TranslationEngineContext = createContext<TranslationEngineContextValue>(null);

// ============================================================================
// Provider
// ============================================================================

interface TranslationEngineProviderProps {
  pageId: string;
  pageUrl: string;
  targetLanguageCode?: string;
  children: ReactNode;
}

export function TranslationEngineProvider({ 
  pageId, 
  pageUrl,
  targetLanguageCode,
  children 
}: TranslationEngineProviderProps) {
  const translationEngine = useTranslationEngine(pageId, pageUrl, targetLanguageCode);
  
  return (
    <TranslationEngineContext.Provider value={translationEngine}>
      {children}
    </TranslationEngineContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useTranslationEngineContext() {
  const context = useContext(TranslationEngineContext);
  if (!context) {
    throw new Error('useTranslationEngineContext must be used within TranslationEngineProvider');
  }
  return context;
}

// Optional hook that doesn't throw if outside provider
export function useOptionalTranslationEngine() {
  return useContext(TranslationEngineContext);
}
