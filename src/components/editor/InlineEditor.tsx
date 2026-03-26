/**
 * InlineEditor
 * 
 * A portal-based inline editor that appears directly on top of the selected element.
 * Now powered by TipTap for rich text editing with:
 * - Text formatting (bold, italic, underline, strikethrough, code)
 * - Text colors and highlights
 * - Links
 * - Undo/Redo
 * - Keyboard shortcuts
 * 
 * Uses Zustand store directly for better performance.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  useEditorStore, 
  useSelection,
} from '@/stores/editorStore';
import { getElementById } from '@/stores/elementRegistry';
import { TiptapEditor } from './tiptap';
import { RichTextContent, isRichTextJSON } from '@/types/richText';

// ============================================================================
// Helper: Get nested value by path
// ============================================================================

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

// ============================================================================
// Types
// ============================================================================

interface EditorPosition {
  top: number;
  left: number;
  width: number;
  height: number;
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  lineHeight: string;
  textAlign: string;
  color: string;
  padding: string;
  letterSpacing: string;
}

// ============================================================================
// Component
// ============================================================================

export function InlineEditor() {
  const selection = useSelection();
  
  // Get store actions directly
  const updateElementValue = useEditorStore(state => state.updateElementValue);
  const stopInlineEdit = useEditorStore(state => state.stopInlineEdit);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<EditorPosition | null>(null);
  const [localValue, setLocalValue] = useState<RichTextContent>('');
  const [originalValue, setOriginalValue] = useState<RichTextContent>('');
  
  // Initialize and position the editor
  useEffect(() => {
    console.log('[InlineEditor] Effect triggered:', {
      isInlineEditing: selection.isInlineEditing,
      sectionId: selection.sectionId,
      elementPath: selection.elementPath,
    });
    
    if (!selection.isInlineEditing || !selection.sectionId || !selection.elementPath) {
      setPosition(null);
      return;
    }
    
    // Try registry first, fall back to DOM query
    const registration = getElementById(selection.sectionId, selection.elementPath);
    let targetEl = registration?.ref.current;
    
    if (!targetEl) {
      targetEl = document.querySelector(
        `[data-editable="${selection.elementPath}"][data-section-id="${selection.sectionId}"]`
      ) as HTMLElement;
    }
    
    if (!targetEl) {
      setPosition(null);
      return;
    }
    
    // Mark element as being edited
    targetEl.setAttribute('data-inline-editing', 'true');
    
    // Get computed styles to match
    const computedStyles = window.getComputedStyle(targetEl);
    const rect = targetEl.getBoundingClientRect();
    
    setPosition({
      top: rect.top,
      left: rect.left,
      width: Math.max(rect.width, 100),
      height: rect.height,
      fontSize: computedStyles.fontSize,
      fontWeight: computedStyles.fontWeight,
      fontFamily: computedStyles.fontFamily,
      lineHeight: computedStyles.lineHeight,
      textAlign: computedStyles.textAlign,
      color: computedStyles.color,
      padding: computedStyles.padding || '4px 8px',
      letterSpacing: computedStyles.letterSpacing,
    });
    
    // Read value from store
    const state = useEditorStore.getState();
    const freshSection = state.pageData?.sections
      .find(s => s.id === selection.sectionId);
    
    if (freshSection) {
      const currentValue = getNestedValue(freshSection.props, selection.elementPath) || '';
      setLocalValue(currentValue);
      setOriginalValue(currentValue);
    }
    
    return () => {
      if (targetEl) {
        targetEl.removeAttribute('data-inline-editing');
      }
    };
  }, [selection.isInlineEditing, selection.sectionId, selection.elementPath]);
  
  // Save changes - stores RichTextContent (string or JSON)
  const handleSave = useCallback((content: RichTextContent, _plainText: string) => {
    // Deep compare for JSON content to detect formatting changes
    const hasChanged = isRichTextJSON(content) || isRichTextJSON(originalValue)
      ? JSON.stringify(content) !== JSON.stringify(originalValue)
      : content !== originalValue;
    
    if (hasChanged && selection.sectionId && selection.elementPath) {
      console.log('[InlineEditor] Saving rich content:', { 
        path: selection.elementPath, 
        isJSON: isRichTextJSON(content),
        content 
      });
      updateElementValue(selection.sectionId, selection.elementPath, content);
    }
    stopInlineEdit();
  }, [originalValue, selection.sectionId, selection.elementPath, updateElementValue, stopInlineEdit]);
  
  const handleCancel = useCallback(() => {
    stopInlineEdit();
  }, [stopInlineEdit]);
  
  // Save when clicking outside the editor container
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current?.contains(e.target as Node)) {
      console.log('[InlineEditor] Backdrop clicked - triggering save');
      // The SimpleRichEditor will handle the actual save via its blur handler
    }
  }, []);
  
  if (!selection.isInlineEditing || !position) {
    return null;
  }
  
  const isMultiline = selection.elementPath?.includes('description') || 
                      selection.elementPath?.includes('content') ||
                      selection.elementPath?.includes('body') ||
                      selection.elementPath?.includes('paragraph') ||
                      selection.elementPath?.includes('text');
  
  const editorContent = (
    <div
      className="fixed z-[10001] pointer-events-auto"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        minHeight: position.height,
        background: 'transparent',
      }}
      ref={containerRef}
    >
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={handleBackdropClick}
      />
      
      <TiptapEditor
        initialValue={localValue}
        onSave={handleSave}
        onCancel={handleCancel}
        multiline={isMultiline}
        style={{
          fontSize: position.fontSize,
          fontWeight: position.fontWeight,
          fontFamily: position.fontFamily,
          lineHeight: position.lineHeight,
          textAlign: position.textAlign as any,
          color: position.color,
          padding: position.padding,
          letterSpacing: position.letterSpacing,
        }}
      />
      
    </div>
  );
  
  return createPortal(editorContent, document.body);
}

export default InlineEditor;
