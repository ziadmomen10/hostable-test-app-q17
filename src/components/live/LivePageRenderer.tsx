/**
 * LivePageRenderer
 * 
 * Complete page renderer for production that renders all visible sections
 * using LiveSectionRenderer. This is the production equivalent of EditorCanvas.
 * 
 * Features:
 * - Zero editor dependencies
 * - Filters out hidden sections
 * - Sorts sections by order
 * - Clean, minimal output
 * 
 * Part of Phase 6: Editor vs Live Renderer Split
 */

import React from 'react';
import { LiveSectionRenderer } from './LiveSectionRenderer';
import { PageData } from '@/types/reactEditor';

// ============================================================================
// Props
// ============================================================================

interface LivePageRendererProps {
  pageData: PageData;
}

// ============================================================================
// Component
// ============================================================================

export function LivePageRenderer({ pageData }: LivePageRendererProps) {
  // Filter out hidden sections and sort by order
  const visibleSections = pageData.sections
    .filter(section => section.visible !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {visibleSections.map(section => (
        <LiveSectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}

export default LivePageRenderer;
