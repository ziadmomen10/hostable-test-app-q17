/**
 * SelectionOverlay
 * 
 * Renders visual overlays for:
 * - Hovered elements (dashed blue border)
 * - Selected elements (solid blue border with label)
 * - Inline editing mode (solid green border)
 * - Functional resize handles for RESIZABLE elements only
 * 
 * Uses element registry for fast element lookup.
 * Uses Zustand store directly for better performance.
 */

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  useEditorStore, 
  useSelection, 
  useHoveredElement,
  useEditorMode,
  useResizeContext,
} from '@/stores/editorStore';
import { getElementById, getElementBoundsByPath } from '@/stores/elementRegistry';
import type { ResizeContext } from '@/stores/editorStore';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface ElementBounds {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface OverlayState {
  hovered: ElementBounds | null;
  selected: ElementBounds | null;
  hoveredLabel: string;
  selectedLabel: string;
}

// ============================================================================
// Check if element has data-resizable attribute (DECLARATIVE approach)
// ============================================================================

function isElementResizable(sectionId: string | null, elementPath: string | null): boolean {
  if (!sectionId || !elementPath) return false;
  
  // Check registry first
  const registration = getElementById(sectionId, elementPath);
  if (registration?.resizable) {
    return true;
  }
  
  // Fallback: Find the element by its data attributes
  const el = document.querySelector(
    `[data-editable="${elementPath}"][data-section-id="${sectionId}"]`
  );
  
  // Check for explicit data-resizable="true" attribute
  if (el?.getAttribute('data-resizable') === 'true') {
    return true;
  }
  
  // Fallback: Check if path contains array index (backward compatibility)
  const parts = elementPath.split('.');
  return parts.some(part => !isNaN(Number(part)) && part !== '');
}

// ============================================================================
// Hook to track element bounds with throttling
// ============================================================================

function useElementBoundsTracker() {
  const [overlayState, setOverlayState] = useState<OverlayState>({
    hovered: null,
    selected: null,
    hoveredLabel: '',
    selectedLabel: '',
  });
  
  const selection = useSelection();
  const hoveredElement = useHoveredElement();
  const lastBoundsRef = useRef<OverlayState | null>(null);
  const lastUpdateRef = useRef<number>(0);
  
  const updateBounds = useCallback(() => {
    const now = performance.now();
    // Phase 5 Fix: Throttle to ~20fps (50ms) for smoother updates
    if (now - lastUpdateRef.current < 50) return;
    lastUpdateRef.current = now;
    
    const newState: OverlayState = {
      hovered: null,
      selected: null,
      hoveredLabel: '',
      selectedLabel: '',
    };
    
    if (hoveredElement && !selection.isInlineEditing) {
      // Try registry first
      const bounds = getElementBoundsByPath(hoveredElement.sectionId, hoveredElement.elementPath);
      if (bounds) {
        newState.hovered = bounds;
        newState.hoveredLabel = hoveredElement.elementPath;
      } else {
        // Fallback to DOM query
        const el = document.querySelector(
          `[data-editable="${hoveredElement.elementPath}"][data-section-id="${hoveredElement.sectionId}"]`
        );
        if (el) {
          const rect = el.getBoundingClientRect();
          newState.hovered = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          };
          newState.hoveredLabel = hoveredElement.elementPath;
        }
      }
    }
    
    if (selection.type === 'element' && selection.sectionId && selection.elementPath) {
      // Try registry first
      const bounds = getElementBoundsByPath(selection.sectionId, selection.elementPath);
      if (bounds) {
        newState.selected = bounds;
        newState.selectedLabel = selection.elementPath;
      } else {
        // Fallback to DOM query
        const el = document.querySelector(
          `[data-editable="${selection.elementPath}"][data-section-id="${selection.sectionId}"]`
        );
        if (el) {
          const rect = el.getBoundingClientRect();
          newState.selected = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          };
          newState.selectedLabel = selection.elementPath;
        } else if (lastBoundsRef.current?.selected) {
          // Keep last known position during brief DOM gaps
          newState.selected = lastBoundsRef.current.selected;
          newState.selectedLabel = lastBoundsRef.current.selectedLabel;
        }
      }
    }
    
    lastBoundsRef.current = newState;
    setOverlayState(newState);
  }, [selection, hoveredElement]);
  
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
  
  return overlayState;
}

// ============================================================================
// Overlay Component
// ============================================================================

export function SelectionOverlay() {
  const selection = useSelection();
  const { hovered, selected, hoveredLabel, selectedLabel } = useElementBoundsTracker();
  
  // Get store actions directly
  const updateElementPosition = useEditorStore(state => state.updateElementPosition);
  const startResize = useEditorStore(state => state.startResize);
  const endResize = useEditorStore(state => state.endResize);
  const editorMode = useEditorMode();
  const resizeContext = useResizeContext();
  
  // Check if selected element is resizable (DECLARATIVE via data-resizable)
  const canResize = useMemo(() => {
    return isElementResizable(selection.sectionId, selection.elementPath);
  }, [selection.sectionId, selection.elementPath]);
  
  // Local state for live resize preview
  const [resizePreview, setResizePreview] = useState<{
    width: number;
    height: number;
  } | null>(null);
  
  // Handle resize start
  const handleResizeStart = useCallback((
    e: React.MouseEvent,
    direction: ResizeContext['direction']
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selected || !selection.sectionId || !selection.elementPath) return;
    
    console.log('[SelectionOverlay] Starting resize for:', selection.elementPath);
    
    startResize({
      sectionId: selection.sectionId,
      elementPath: selection.elementPath,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: selected.width,
      startHeight: selected.height,
    });
    
    setResizePreview({ width: selected.width, height: selected.height });
  }, [selected, selection, startResize]);
  
  // Global mouse listeners for resize
  useEffect(() => {
    if (editorMode !== 'resizing' || !resizeContext) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeContext.startX;
      const deltaY = e.clientY - resizeContext.startY;
      
      let newWidth = resizeContext.startWidth;
      let newHeight = resizeContext.startHeight;
      
      if (resizeContext.direction.includes('e')) newWidth += deltaX;
      if (resizeContext.direction.includes('w')) newWidth -= deltaX;
      if (resizeContext.direction.includes('s')) newHeight += deltaY;
      if (resizeContext.direction.includes('n')) newHeight -= deltaY;
      
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(30, newHeight);
      
      setResizePreview({ width: newWidth, height: newHeight });
    };
    
    const handleMouseUp = () => {
      if (resizePreview && resizeContext.elementPath) {
        console.log('[SelectionOverlay] Committing resize:', {
          sectionId: resizeContext.sectionId,
          elementPath: resizeContext.elementPath,
          width: resizePreview.width,
          height: resizePreview.height,
        });
        
        // Use store directly for document mutation
        updateElementPosition(
          resizeContext.sectionId,
          resizeContext.elementPath,
          {
            width: `${resizePreview.width}px`,
            height: `${resizePreview.height}px`,
          }
        );
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
  }, [editorMode, resizeContext, resizePreview, endResize, updateElementPosition]);
  
  if (!hovered && !selected) {
    return null;
  }
  
  const handleBase = "absolute w-3 h-3 bg-white border-2 border-green-500 rounded-sm pointer-events-auto hover:bg-green-100 hover:scale-125 transition-transform";
  
  const overlayContent = (
    <>
      {hovered && editorMode !== 'resizing' && (!selected || 
        hovered.top !== selected.top || 
        hovered.left !== selected.left) && (
        <div
          className="fixed pointer-events-none z-[9998] border-2 border-dashed border-primary/50 transition-all duration-75"
          style={{
            top: hovered.top - window.scrollY,
            left: hovered.left - window.scrollX,
            width: hovered.width,
            height: hovered.height,
          }}
        >
          <div className="absolute -top-6 left-0 px-1.5 py-0.5 bg-primary/50 text-primary-foreground text-[10px] font-mono rounded">
            {hoveredLabel}
          </div>
        </div>
      )}
      
      {selected && (
        <div
          className={cn(
            'fixed z-[9999] border-2 transition-all duration-75 pointer-events-none',
            selection.isInlineEditing 
              ? 'border-green-500 border-dashed' 
              : 'border-green-500 border-dashed'
          )}
          style={{
            top: selected.top - window.scrollY,
            left: selected.left - window.scrollX,
            width: selected.width,
            height: selected.height,
            background: 'transparent',
          }}
        >
          <div 
            className={cn(
              'absolute -top-6 left-0 px-1.5 py-0.5 text-[10px] font-mono rounded flex items-center gap-1',
              selection.isInlineEditing 
                ? 'bg-green-500 text-white' 
                : 'bg-green-500 text-white'
            )}
          >
            {selection.isInlineEditing && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
            {selection.isInlineEditing ? 'Editing...' : selectedLabel}
          </div>
          
          {/* Phase 1: Only show resize handles for resizable elements (array items) */}
          {!selection.isInlineEditing && canResize && (
            <>
              <div 
                className={cn(handleBase, "-top-1.5 -left-1.5 cursor-nw-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'nw')}
              />
              <div 
                className={cn(handleBase, "-top-1.5 -right-1.5 cursor-ne-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'ne')}
              />
              <div 
                className={cn(handleBase, "-bottom-1.5 -left-1.5 cursor-sw-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'sw')}
              />
              <div 
                className={cn(handleBase, "-bottom-1.5 -right-1.5 cursor-se-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'se')}
              />
              
              <div 
                className={cn(handleBase, "-top-1.5 left-1/2 -translate-x-1/2 cursor-n-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'n')}
              />
              <div 
                className={cn(handleBase, "-bottom-1.5 left-1/2 -translate-x-1/2 cursor-s-resize")}
                onMouseDown={(e) => handleResizeStart(e, 's')}
              />
              <div 
                className={cn(handleBase, "top-1/2 -left-1.5 -translate-y-1/2 cursor-w-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'w')}
              />
              <div 
                className={cn(handleBase, "top-1/2 -right-1.5 -translate-y-1/2 cursor-e-resize")}
                onMouseDown={(e) => handleResizeStart(e, 'e')}
              />
            </>
          )}
        </div>
      )}
      
      {editorMode === 'resizing' && resizePreview && selected && (
        <div
          className="fixed pointer-events-none z-[10000] border-2 border-blue-500 bg-blue-500/10"
          style={{
            top: selected.top - window.scrollY,
            left: selected.left - window.scrollX,
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

export default SelectionOverlay;
