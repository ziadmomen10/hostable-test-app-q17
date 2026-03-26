/**
 * ElementSettings
 * 
 * Settings panel router for element-level editing.
 * Detects element type from path and routes to specialized settings:
 * - ImageSettings for images/logos
 * - ButtonSettings for buttons/CTAs
 * - IconSettings for icons
 * - TextSettings for text content (default)
 */

import React, { useMemo, useCallback } from 'react';
import { useSelection, useEditorStore } from '@/stores/editorStore';
import { 
  ImageSettings, 
  ButtonSettings, 
  TextSettings, 
  IconSettings 
} from './settings';

// ============================================================================
// Element Type Detection
// ============================================================================

type ElementSettingsType = 'image' | 'button' | 'icon' | 'text';

/**
 * Infers the element type from the element path.
 * Used to route to the appropriate specialized settings component.
 */
function inferElementType(elementPath: string): ElementSettingsType {
  const path = elementPath.toLowerCase();
  
  // Image patterns - URLs, media, visual content
  if (
    path.includes('image') || 
    path.includes('logo') || 
    path.includes('src') || 
    path.includes('background') || 
    path.includes('avatar') || 
    path.includes('photo') ||
    path.includes('thumbnail') ||
    path.includes('banner') ||
    path.includes('cover')
  ) {
    return 'image';
  }
  
  // Button patterns - actions, CTAs
  if (
    path.includes('button') || 
    path.includes('cta') || 
    path.includes('action') ||
    path.includes('submit') ||
    (path.includes('link') && path.includes('primary'))
  ) {
    return 'button';
  }
  
  // Icon patterns - but not icon text labels
  if (path.includes('icon') && !path.includes('icontext') && !path.includes('iconlabel')) {
    return 'icon';
  }
  
  // Default to text for everything else
  return 'text';
}

// ============================================================================
// Component
// ============================================================================

export function ElementSettings() {
  const selection = useSelection();
  const clearSelection = useEditorStore(state => state.clearSelection);
  
  // Handle close
  const handleClose = useCallback(() => {
    clearSelection();
  }, [clearSelection]);
  
  // Detect element type from path
  const elementType = useMemo(() => {
    if (!selection.elementPath) return 'text';
    return inferElementType(selection.elementPath);
  }, [selection.elementPath]);
  
  // If not element selected, return null
  if (selection.type !== 'element' || !selection.sectionId || !selection.elementPath) {
    return null;
  }
  
  // Route to specialized settings component based on element type
  switch (elementType) {
    case 'image':
      return (
        <ImageSettings 
          sectionId={selection.sectionId} 
          elementPath={selection.elementPath}
          onClose={handleClose}
        />
      );
    case 'button':
      return (
        <ButtonSettings 
          sectionId={selection.sectionId} 
          elementPath={selection.elementPath}
          onClose={handleClose}
        />
      );
    case 'icon':
      return (
        <IconSettings 
          sectionId={selection.sectionId} 
          elementPath={selection.elementPath}
          onClose={handleClose}
        />
      );
    default:
      return (
        <TextSettings 
          sectionId={selection.sectionId} 
          elementPath={selection.elementPath}
          onClose={handleClose}
        />
      );
  }
}

export default ElementSettings;
