/**
 * SimpleRichEditor
 * 
 * A lightweight rich text editor using native contenteditable.
 * Replaces TipTap to avoid complex focus management issues.
 * 
 * Features:
 * - Native contenteditable for editing
 * - document.execCommand for formatting
 * - Selection-based toolbar visibility
 * - Simple HTML/text output
 */

import React, { useRef, useEffect, useState, useCallback, CSSProperties } from 'react';
import { SimpleToolbar } from './SimpleToolbar';
import { cn } from '@/lib/utils';
import { RichTextContent, isRichTextJSON, extractPlainText } from '@/types/richText';

// ============================================================================
// Types
// ============================================================================

interface SimpleRichEditorProps {
  initialValue: RichTextContent;
  onSave: (content: RichTextContent, plainText: string) => void;
  onCancel: () => void;
  style?: CSSProperties;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Convert RichTextContent to HTML string for editing
 */
function toHtml(content: RichTextContent): string {
  if (typeof content === 'string') {
    // Escape HTML entities and preserve line breaks
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }
  
  // TipTap JSON format - extract text content
  if (isRichTextJSON(content)) {
    return extractPlainText(content)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }
  
  return '';
}

/**
 * Check if HTML contains any formatting
 */
function hasFormatting(html: string): boolean {
  // Check for common formatting tags
  const formattingTags = /<(b|strong|i|em|u|s|strike|code|span|a|font)\b/i;
  return formattingTags.test(html);
}

/**
 * Extract plain text from HTML
 */
function htmlToPlainText(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

// ============================================================================
// Component
// ============================================================================

export function SimpleRichEditor({
  initialValue,
  onSave,
  onCancel,
  style,
  className,
  multiline = false,
  placeholder = 'Enter text...',
}: SimpleRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const isInteractingRef = useRef(false);
  const originalValueRef = useRef(initialValue);
  
  // Initialize editor content
  useEffect(() => {
    console.log('[SimpleRichEditor] Initializing with value:', initialValue);
    if (editorRef.current) {
      const html = toHtml(initialValue);
      console.log('[SimpleRichEditor] Setting HTML:', html);
      editorRef.current.innerHTML = html;
      // Focus and place cursor at end
      editorRef.current.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
      console.log('[SimpleRichEditor] Editor initialized and focused');
    }
  }, []);
  
  // Format command
  const format = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);
  
  // Add link
  const addLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
    editorRef.current?.focus();
  }, []);
  
  // Update toolbar position based on selection
  const updateToolbarPosition = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !containerRef.current) {
      return;
    }
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Position above the selection
    setToolbarPosition({
      top: rect.top - containerRect.top - 40,
      left: Math.max(0, rect.left - containerRect.left),
    });
  }, []);
  
  // Handle selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      // Check if selection is within our editor
      if (!editorRef.current || !selection) {
        setShowToolbar(false);
        return;
      }
      
      const isInEditor = editorRef.current.contains(selection.anchorNode);
      const hasSelection = !selection.isCollapsed;
      
      if (isInEditor && hasSelection) {
        setShowToolbar(true);
        updateToolbarPosition();
      } else if (!isInteractingRef.current) {
        setShowToolbar(false);
      }
    };
    
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateToolbarPosition]);
  
  // Handle save
  const handleSave = useCallback(() => {
    if (!editorRef.current) return;
    
    const html = editorRef.current.innerHTML;
    const plainText = htmlToPlainText(html);
    
    // If no formatting, save as plain text
    if (!hasFormatting(html)) {
      onSave(plainText, plainText);
    } else {
      // Save as HTML string
      onSave(html, plainText);
    }
  }, [onSave]);
  
  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Escape to cancel
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
      return;
    }
    
    // Enter to save (single-line mode)
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
      return;
    }
    
    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          format('bold');
          break;
        case 'i':
          e.preventDefault();
          format('italic');
          break;
        case 'u':
          e.preventDefault();
          format('underline');
          break;
        case 'k':
          e.preventDefault();
          addLink();
          break;
      }
    }
  }, [multiline, handleSave, onCancel, format, addLink]);
  
  // Handle blur (save on click outside)
  const handleBlur = useCallback((e: React.FocusEvent) => {
    // Use relatedTarget for more reliable focus detection
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    
    console.log('[SimpleRichEditor] Blur event, relatedTarget:', relatedTarget?.tagName);
    
    // If focus moved to something inside our container, ignore
    if (containerRef.current?.contains(relatedTarget)) {
      console.log('[SimpleRichEditor] Focus stayed in container, ignoring blur');
      return;
    }
    
    // Check for popover (they're rendered in portals)
    const popoverContent = document.querySelector('[data-radix-popper-content-wrapper]');
    if (popoverContent?.contains(relatedTarget)) {
      console.log('[SimpleRichEditor] Focus moved to popover, ignoring blur');
      return;
    }
    
    // If actively interacting with toolbar, wait
    if (isInteractingRef.current) {
      console.log('[SimpleRichEditor] Toolbar interaction in progress, ignoring blur');
      return;
    }
    
    // Delay save to ensure we're truly blurring
    setTimeout(() => {
      // Double-check we're still not focused
      if (!containerRef.current?.contains(document.activeElement)) {
        console.log('[SimpleRichEditor] Blur confirmed, saving');
        handleSave();
      } else {
        console.log('[SimpleRichEditor] Focus returned to editor, skipping save');
      }
    }, 200);
  }, [handleSave]);
  
  // Track toolbar interactions
  const handleToolbarMouseDown = useCallback(() => {
    isInteractingRef.current = true;
    console.log('[SimpleRichEditor] Toolbar interaction started');
  }, []);
  
  const handleToolbarMouseUp = useCallback(() => {
    // Longer timeout to ensure blur check completes first
    setTimeout(() => {
      isInteractingRef.current = false;
      console.log('[SimpleRichEditor] Toolbar interaction ended');
    }, 250);
  }, []);
  
  return (
    <div
      ref={containerRef}
      className={cn(
        'relative outline-none ring-2 ring-primary rounded min-w-[100px]',
        'animate-in zoom-in-95 fade-in duration-150',
        'bg-transparent',
        className
      )}
      style={style}
      data-simple-rich-editor
    >
      {/* Toolbar - positioned above selection */}
      {showToolbar && (
        <div
          className="absolute z-[10002]"
          style={{
            top: toolbarPosition.top,
            left: toolbarPosition.left,
          }}
          onMouseDown={handleToolbarMouseDown}
          onMouseUp={handleToolbarMouseUp}
        >
          <SimpleToolbar
            onFormat={format}
            onAddLink={addLink}
          />
        </div>
      )}
      
      {/* Editable content */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className={cn(
          'outline-none min-h-[1em]',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground'
        )}
        data-placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      
      {/* Keyboard hints */}
      <div className="absolute -bottom-6 left-0 text-[10px] text-muted-foreground bg-background/90 px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
        {multiline ? (
          <>
            <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">Shift+Enter</kbd> for line break, 
            <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono ml-1">Esc</kbd> to cancel
          </>
        ) : (
          <>
            <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">Enter</kbd> to save, 
            <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono ml-1">Esc</kbd> to cancel
          </>
        )}
      </div>
    </div>
  );
}

export default SimpleRichEditor;
