/**
 * SectionOverlay
 * 
 * Portal-based overlay for section-level visual feedback:
 * - Selection border for selected section
 * - Hover border for hovered section
 * - 8 resize handles positioned via getBoundingClientRect()
 * - Resize preview dimensions badge
 * 
 * Uses Zustand store directly for better performance.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  useEditorStore, 
  useSelectedSectionId,
  useEditorMode, 
  useResizeContext,
} from '@/stores/editorStore';
import type { ResizeContext } from '@/stores/editorStore';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface SectionBounds {
  top: number;
  left: number;
  width: number;
  height: number;
}

// ============================================================================
// Hook to track section bounds
// ============================================================================

function useSectionBoundsTracker(sectionId: string | null) {
  const [bounds, setBounds] = useState<SectionBounds | null>(null);
  
  const updateBounds = useCallback(() => {
    if (!sectionId) {
      setBounds(null);
      return;
    }
    
    const el = document.querySelector(`[data-section-id="${sectionId}"][data-section-wrapper]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setBounds({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setBounds(null);
    }
  }, [sectionId]);
  
  useEffect(() => {
    updateBounds();
    
    window.addEventListener('scroll', updateBounds, true);
    window.addEventListener('resize', updateBounds);
    
    let rafId: number;
    const rafUpdate = () => {
      updateBounds();
      rafId = requestAnimationFrame(rafUpdate);
    };
    rafId = requestAnimationFrame(rafUpdate);
    
    return () => {
      window.removeEventListener('scroll', updateBounds, true);
      window.removeEventListener('resize', updateBounds);
      cancelAnimationFrame(rafId);
    };
  }, [updateBounds]);
  
  return bounds;
}

// ============================================================================
// Component
// ============================================================================

export function SectionOverlay() {
  // Use Zustand store directly
  const selectedSectionId = useSelectedSectionId();
  const updateSectionProps = useEditorStore(state => state.updateSectionProps);
  
  const editorMode = useEditorMode();
  const resizeContext = useResizeContext();
  const startResize = useEditorStore(state => state.startResize);
  const endResize = useEditorStore(state => state.endResize);
  
  // Track hovered section separately
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  
  const selectedBounds = useSectionBoundsTracker(selectedSectionId);
  const hoveredBounds = useSectionBoundsTracker(
    hoveredSectionId !== selectedSectionId ? hoveredSectionId : null
  );
  
  // Local state for live resize preview
  const [resizePreview, setResizePreview] = useState<{ width: number; height: number } | null>(null);
  
  // Track hovered sections via global mouse events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const sectionEl = target.closest('[data-section-wrapper]');
      
      if (sectionEl) {
        const sectionId = sectionEl.getAttribute('data-section-id');
        setHoveredSectionId(sectionId);
      } else {
        setHoveredSectionId(null);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Handle resize start
  const handleResizeStart = useCallback((
    e: React.MouseEvent,
    direction: ResizeContext['direction']
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedSectionId || !selectedBounds) return;
    
    startResize({
      sectionId: selectedSectionId,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: selectedBounds.width,
      startHeight: selectedBounds.height,
    });
    
    setResizePreview({ width: selectedBounds.width, height: selectedBounds.height });
  }, [selectedSectionId, selectedBounds, startResize]);
  
  // Global mouse listeners for resize
  useEffect(() => {
    if (editorMode !== 'resizing' || !resizeContext || !resizeContext.sectionId) return;
    if (resizeContext.elementPath) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeContext.startX;
      const deltaY = e.clientY - resizeContext.startY;
      
      let newWidth = resizeContext.startWidth;
      let newHeight = resizeContext.startHeight;
      
      if (resizeContext.direction.includes('e')) newWidth += deltaX;
      if (resizeContext.direction.includes('w')) newWidth -= deltaX;
      if (resizeContext.direction.includes('s')) newHeight += deltaY;
      if (resizeContext.direction.includes('n')) newHeight -= deltaY;
      
      newWidth = Math.max(200, newWidth);
      newHeight = Math.max(100, newHeight);
      
      setResizePreview({ width: newWidth, height: newHeight });
    };
    
    const handleMouseUp = () => {
      if (resizePreview && resizeContext.sectionId) {
        // Use store directly for document mutation
        updateSectionProps(resizeContext.sectionId, {
          minHeight: `${resizePreview.height}px`,
          maxWidth: `${resizePreview.width}px`,
        });
      }
      setResizePreview(null);
      endResize();
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setResizePreview(null);
        endResize();
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editorMode, resizeContext, resizePreview, endResize, updateSectionProps]);
  
  if (!selectedBounds && !hoveredBounds) {
    return null;
  }
  
  const handleBase = "absolute w-3 h-3 bg-white border-2 border-primary rounded-sm pointer-events-auto hover:bg-primary/20 hover:scale-125 transition-transform cursor-pointer";
  const edgeHandleBase = "absolute bg-muted-foreground/30 hover:bg-primary rounded-full pointer-events-auto transition-colors";
  
  const overlayContent = (
    <>
      {hoveredBounds && editorMode !== 'resizing' && (
        <div
          className="fixed pointer-events-none z-[9996] border-2 border-dashed border-primary/30 transition-all duration-75"
          style={{
            top: hoveredBounds.top - window.scrollY,
            left: hoveredBounds.left - window.scrollX,
            width: hoveredBounds.width,
            height: hoveredBounds.height,
          }}
        />
      )}
      
      {selectedBounds && (
        <div
          className="fixed pointer-events-none z-[9997] border-2 border-primary shadow-lg transition-all duration-75"
          style={{
            top: selectedBounds.top - window.scrollY,
            left: selectedBounds.left - window.scrollX,
            width: selectedBounds.width,
            height: selectedBounds.height,
          }}
        >
          {editorMode !== 'inline-editing' && (
            <>
              <div 
                className={cn(edgeHandleBase, "bottom-0 left-4 right-4 h-1 cursor-ns-resize")}
                onMouseDown={(e) => handleResizeStart(e, 's')}
              >
                <div className="w-16 h-1 mx-auto" />
              </div>
              <div 
                className={cn(edgeHandleBase, "right-0 top-4 bottom-4 w-1 cursor-ew-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'e')}
              >
                <div className="h-16 w-1 my-auto absolute top-1/2 -translate-y-1/2" />
              </div>
              <div 
                className={cn(edgeHandleBase, "left-0 top-4 bottom-4 w-1 cursor-ew-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'w')}
              >
                <div className="h-16 w-1 my-auto absolute top-1/2 -translate-y-1/2" />
              </div>
              <div 
                className={cn(edgeHandleBase, "top-0 left-4 right-4 h-1 cursor-ns-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'n')}
              >
                <div className="w-16 h-1 mx-auto" />
              </div>
              
              <div 
                className={cn(handleBase, "-bottom-1.5 -right-1.5 cursor-nwse-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'se')}
              />
              <div 
                className={cn(handleBase, "-bottom-1.5 -left-1.5 cursor-nesw-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'sw')}
              />
              <div 
                className={cn(handleBase, "-top-1.5 -right-1.5 cursor-nesw-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'ne')}
              />
              <div 
                className={cn(handleBase, "-top-1.5 -left-1.5 cursor-nwse-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'nw')}
              />
            </>
          )}
        </div>
      )}
      
      {editorMode === 'resizing' && resizePreview && selectedBounds && !resizeContext?.elementPath && (
        <div
          className="fixed pointer-events-none z-[10000] border-2 border-blue-500 bg-blue-500/10"
          style={{
            top: selectedBounds.top - window.scrollY,
            left: selectedBounds.left - window.scrollX,
            width: resizePreview.width,
            height: resizePreview.height,
          }}
        >
          <div className="absolute -top-6 left-0 px-2 py-0.5 bg-blue-500 text-white text-[10px] font-mono rounded">
            {Math.round(resizePreview.width)} × {Math.round(resizePreview.height)}
          </div>
        </div>
      )}
    </>
  );
  
  return createPortal(overlayContent, document.body);
}

export default SectionOverlay;
