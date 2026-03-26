/**
 * Section DnD Context
 * 
 * Provides DnD configuration to child components within a section.
 * This allows array items to automatically get sortable behavior.
 */

import React, { createContext, useContext } from 'react';
import { SectionDndConfig, getSectionDndConfig } from '@/lib/sectionDndConfig';

interface SectionDndContextValue {
  sectionId: string;
  sectionType: string;
  config: SectionDndConfig | undefined;
  isEditing: boolean;
}

const SectionDndContext = createContext<SectionDndContextValue | null>(null);

interface SectionDndProviderProps {
  sectionId: string;
  sectionType: string;
  isEditing: boolean;
  children: React.ReactNode;
}

/**
 * Provider that wraps section components to provide DnD context.
 * Child components can use useSectionDnd() to access DnD configuration.
 */
export function SectionDndProvider({ 
  sectionId, 
  sectionType, 
  isEditing, 
  children 
}: SectionDndProviderProps) {
  const config = getSectionDndConfig(sectionType);
  
  return (
    <SectionDndContext.Provider value={{
      sectionId,
      sectionType,
      config,
      isEditing,
    }}>
      {children}
    </SectionDndContext.Provider>
  );
}

/**
 * Hook to access section DnD context.
 * Returns null if not within a SectionDndProvider.
 */
export function useSectionDnd(): SectionDndContextValue | null {
  return useContext(SectionDndContext);
}

/**
 * Hook that throws if not within a SectionDndProvider.
 * Use when DnD context is required.
 */
export function useSectionDndRequired(): SectionDndContextValue {
  const context = useContext(SectionDndContext);
  if (!context) {
    throw new Error('useSectionDndRequired must be used within a SectionDndProvider');
  }
  return context;
}
