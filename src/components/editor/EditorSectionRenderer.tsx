// Force rebuild v2 - 2026-01-24
/**
 * EditorSectionRenderer
 * 
 * Editor-specific section renderer that wraps sections with DnD support.
 * 
 * Uses the centralized SectionDndProvider to automatically provide DnD
 * capabilities to all section arrays based on the sectionDndRegistry.
 * 
 * CRITICAL: Uses version-based key to force complete component remount
 * when section props change, ensuring canvas always reflects latest data.
 * 
 * Hierarchy:
 * - EditorSectionRenderer
 *   - SectionDndProvider (provides DnD context)
 *     - Section Component (uses useArrayItems for DnD)
 *       - SortableItem (for each array item)
 * 
 * Part of Phase 6: Editor vs Live Renderer Split
 */

import React, { useMemo } from 'react';
import { getSectionDefinition } from '@/lib/sectionDefinitions.tsx';
import { SectionInstance } from '@/types/reactEditor';
import { Badge } from '@/components/ui/badge';
import { Languages } from 'lucide-react';
import { SectionDndProvider } from '@/contexts/SectionDndContext';
import { useSectionByIdFresh } from '@/stores/editorStore';
import { SectionStyleWrapper } from './SectionStyleWrapper';
import { useI18n } from '@/contexts/I18nContext';
import { setNestedValue } from '@/lib/translationResolver';

/**
 * Direct translation key resolution - bypasses hook closure issues
 * by working directly with the messages object passed as parameter
 */
function resolveTranslationKeyDirect(key: string, messages: Record<string, string>): string | null {
  const messagesCount = Object.keys(messages).length;
  
  // 1. Direct lookup
  if (messages[key]) {
    console.log('[EditorSectionRenderer] ✓ Direct match:', key);
    return messages[key];
  }
  
  // 2. Namespace prefix lookup (e.g., Test.page.test.xxx for page.test.xxx)
  if (key.startsWith('page.')) {
    const parts = key.split('.');
    if (parts.length >= 2) {
      const slugPart = parts[1];
      const capitalizedSlug = slugPart.charAt(0).toUpperCase() + slugPart.slice(1);
      const namespacedKey = `${capitalizedSlug}.${key}`;
      if (messages[namespacedKey]) {
        console.log('[EditorSectionRenderer] ✓ Namespace match:', namespacedKey);
        return messages[namespacedKey];
      }
    }
  }
  
  // 3. Suffix match - find any key that ends with our key
  for (const [msgKey, msgValue] of Object.entries(messages)) {
    if (msgKey.endsWith(`.${key}`)) {
      console.log('[EditorSectionRenderer] ✓ Suffix match:', msgKey);
      return msgValue;
    }
  }
  
  // No match found
  if (messagesCount > 0) {
    console.warn('[EditorSectionRenderer] ✗ No match for key:', key, 'in', messagesCount, 'messages');
  }
  
  return null;
}

// ============================================================================
// Props
// ============================================================================

interface SectionRendererProps {
  section: SectionInstance;
  isEditing?: boolean;
  showTranslationPreview?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function EditorSectionRenderer({ 
  section: sectionProp, 
  isEditing = false,
  showTranslationPreview = true,
}: SectionRendererProps) {
  // FORCE LOG - Must appear in console to verify code is running
  console.log('=== ESR LOADED ===', Date.now(), sectionProp.type, sectionProp.id?.slice(-8));
  
  // CRITICAL: Use version-based subscription to force re-renders
  // This avoids useShallow comparison issues with nested section objects
  // Version subscription (primitive) triggers re-render, then we fetch fresh section
  const { section, version } = useSectionByIdFresh(sectionProp.id);
  
  // Get all i18n state directly from context - no hook closures!
  const { messagesVersion, messages, isLoading: i18nLoading, currentLanguage } = useI18n();
  const currentLangCode = currentLanguage?.code;
  
  // Unconditional debug logging - always fires to help diagnose issues
  console.warn('[EditorSectionRenderer] Translation state:', {
    sectionId: sectionProp.id.slice(-8),
    sectionType: sectionProp.type,
    version,
    currentLang: currentLangCode,
    messagesVersion,
    messagesCount: Object.keys(messages).length,
    translationKeysCount: Object.keys(sectionProp.translationKeys || {}).length,
    sampleMessageKeys: Object.keys(messages).slice(0, 5),
    i18nLoading,
  });
  
  const definition = getSectionDefinition(sectionProp.type);
  
  // DIRECT translation resolution - bypasses hook closure issues
  // by using the messages object directly from context
  // CRITICAL: This useMemo MUST be before early returns to satisfy React Hooks rules
  const { resolvedProps, hasTranslations } = useMemo(() => {
    // Use sectionProp if section from store not available yet
    const sectionData = section || sectionProp;
    const translationKeys = sectionData.translationKeys || {};
    const hasTranslations = Object.keys(translationKeys).length > 0;
    
    // Skip if no keys or default language
    const isDefault = !currentLangCode || currentLangCode === 'en';
    if (!hasTranslations || isDefault) {
      console.log('[EditorSectionRenderer] Skipping resolution:', { isDefault, hasTranslations });
      return { resolvedProps: sectionData.props || {}, hasTranslations };
    }
    
    console.log('[EditorSectionRenderer] Resolving translations for', Object.keys(translationKeys).length, 'keys');
    
    // Deep clone props to avoid mutation - start with this object
    let resolved = JSON.parse(JSON.stringify(sectionData.props || {}));
    
    // Prop paths that should NEVER be translated (numeric values for currency conversion)
    const numericPropPatterns = ['price', 'Price', 'originalPrice', 'discountedPrice', 'discount'];
    const isNumericProp = (propPath: string) => 
      numericPropPatterns.some(pattern => propPath.toLowerCase().includes(pattern.toLowerCase()));
    
    // Resolve each translation key directly with current messages
    for (const [propPath, key] of Object.entries(translationKeys)) {
      if (!key || typeof key !== 'string') continue;
      
      // CRITICAL: Skip numeric props that shouldn't be translated
      // These are converted dynamically via PriceDisplay component
      if (isNumericProp(propPath)) {
        console.log('[EditorSectionRenderer] Skipping numeric prop:', propPath);
        continue;
      }
      
      const translatedValue = resolveTranslationKeyDirect(key, messages);
      if (translatedValue) {
        console.log('[EditorSectionRenderer] Applied translation:', propPath, '→', translatedValue.substring(0, 30));
        // setNestedValue from translationResolver mutates in place
        setNestedValue(resolved, propPath, translatedValue);
      }
    }
    
    return { resolvedProps: resolved, hasTranslations };
  }, [section, sectionProp, messages, messagesVersion, currentLangCode]);
  
  // Early return if section not found in store (should rarely happen)
  if (!section) {
    console.warn('[EditorSectionRenderer] Section not found in store:', sectionProp.id);
    return null;
  }
  
  // Show loading skeleton while translations are loading for non-default language
  const isNonDefaultLanguage = currentLangCode && currentLangCode !== 'en';
  const hasTranslationKeysForLoading = Object.keys(section.translationKeys || {}).length > 0;
  if (isNonDefaultLanguage && i18nLoading && hasTranslationKeysForLoading) {
    return (
      <div className="animate-pulse py-4">
        <div className="h-32 w-full bg-muted rounded-lg" />
      </div>
    );
  }

  // Use version + language + messages count in key to force re-mount when anything changes
  const componentKey = `${section.id}-v${version}-lang${currentLangCode || 'en'}-msg${messagesVersion}-cnt${Object.keys(messages).length}`;

  if (!definition) {
    return (
      <div className="p-8 bg-destructive/10 border border-destructive text-destructive text-center">
        <p className="font-medium">Unknown section type: {section.type}</p>
        <p className="text-sm mt-1">This section type is not registered in the section definitions.</p>
      </div>
    );
  }

  const Component = definition.component;

  // Determine if section uses data wrapper from definition (no more hardcoded list!)
  const needsDataWrapper = definition.usesDataWrapper ?? false;
  
  // Build layout props from section.style and section.props
  const layoutProps = {
    contentWidth: section.style?.containerWidth,
    columns: section.props?.columns,
    gap: section.props?.gap,
    contentAlignment: section.props?.contentAlignment,
  };
  
  // Props for the section component - include styleOverrides and layoutProps
  const componentProps = needsDataWrapper 
    ? { 
        data: resolvedProps, 
        sectionId: section.id, 
        isEditing,
        styleOverrides: section.style,
        layoutProps,
      } 
    : { 
        ...resolvedProps, 
        sectionId: section.id, 
        isEditing,
        styleOverrides: section.style,
        layoutProps,
      };

  // Wrap section with DnD provider for automatic array sorting support
  return (
    <SectionDndProvider
      sectionId={section.id}
      sectionType={section.type}
      isEditing={isEditing}
    >
      <div 
        data-section-id={section.id} 
        data-section-type={section.type}
        className="relative"
      >
        {/* Translation indicator badge */}
        {hasTranslations && isEditing && (
          <div className="absolute top-2 right-2 z-10 pointer-events-none">
            <Badge 
              variant="secondary" 
              className="text-[10px] h-5 gap-1 bg-primary/10 text-primary border-primary/20"
            >
              <Languages className="h-3 w-3" />
              Translated
            </Badge>
          </div>
        )}
        
        {/* Section component - DnD provided via SectionDndContext */}
        {/* Key forces re-mount when props change, ensuring canvas reflects settings */}
        {/* SectionStyleWrapper applies layout styles (alignment, etc.) */}
        <SectionStyleWrapper
          styleOverrides={section.style}
          layoutProps={layoutProps}
        >
          <Component key={componentKey} {...componentProps} />
        </SectionStyleWrapper>
      </div>
    </SectionDndProvider>
  );
}

export default EditorSectionRenderer;
