/**
 * LiveSectionRenderer
 * 
 * Renders a single section for live/public viewing with translation support.
 * Uses the section registry to find the appropriate component and applies translations.
 * 
 * FIXED: Forces re-render on language change and handles loading states properly.
 */

import React, { useMemo } from 'react';
import { SectionInstance } from '@/types/reactEditor';
import { getSectionDefinition } from '@/lib/sections/registry';
import { SectionStyleWrapper } from '@/components/editor/SectionStyleWrapper';
import { useLiveTranslations } from '@/hooks/useLiveTranslations';
import { Skeleton } from '@/components/ui/skeleton';

interface LiveSectionRendererProps {
  section: SectionInstance;
}

export function LiveSectionRenderer({ section }: LiveSectionRendererProps) {
  const {
    resolveTranslatedProps, 
    messagesVersion, 
    currentLanguage, 
    isDefaultLanguage,
    isLoading 
  } = useLiveTranslations();
  
  // Get the section definition
  const definition = useMemo(() => getSectionDefinition(section.type), [section.type]);
  
  // Resolve translated props - memoize to prevent unnecessary recalculations
  // Include messagesVersion in deps to recalculate when translations update
  const resolvedProps = useMemo(() => {
    return resolveTranslatedProps(section);
  }, [section, resolveTranslatedProps, messagesVersion, currentLanguage]);
  
  if (!definition) {
    console.warn(`[LiveSectionRenderer] Unknown section type: ${section.type}`);
    return null;
  }

  const Component = definition.component;
  
  // Build component props based on whether section uses data wrapper
  const componentProps = definition.usesDataWrapper
    ? { data: resolvedProps }
    : resolvedProps;

  // Show subtle loading indicator while translations are loading for non-default language
  // Only show if we have translation keys bound (otherwise no need to wait)
  const hasTranslationKeys = Object.keys(section.translationKeys || {}).length > 0;
  if (!isDefaultLanguage && isLoading && hasTranslationKeys) {
    return (
      <div className="animate-pulse py-4">
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  // Use a key that includes language to force complete re-mount when language changes
  // This ensures all component state is reset and props are re-read
  return (
    <SectionStyleWrapper
      key={`${section.id}-${currentLanguage}-${messagesVersion}`}
      styleOverrides={section.style}
    >
      <Component {...componentProps} />
    </SectionStyleWrapper>
  );
}

export default LiveSectionRenderer;
