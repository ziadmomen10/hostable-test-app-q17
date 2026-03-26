/**
 * EditableText
 * 
 * A contentEditable component for inline text editing.
 * - Syncs value to store on blur or Enter (single-line)
 * - Cancels on Escape
 * - Supports multiline mode
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  isEditing: boolean;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  as?: keyof JSX.IntrinsicElements;
}

// ============================================================================
// Component
// ============================================================================

export function EditableText({
  value,
  onChange,
  isEditing,
  onEditStart,
  onEditEnd,
  multiline = false,
  className,
  placeholder = 'Click to edit...',
  as: Component = 'span',
}: EditableTextProps) {
  const editRef = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState(value);
  
  // Sync local value when prop changes (and not editing)
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);
  
  // Focus and select all when entering edit mode
  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(editRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);
  
  // Handle input changes
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    setLocalValue(e.currentTarget.textContent || '');
  }, []);
  
  // Handle blur - save value
  const handleBlur = useCallback(() => {
    if (localValue !== value) {
      onChange(localValue);
    }
    onEditEnd?.();
  }, [localValue, value, onChange, onEditEnd]);
  
  // Handle key events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enter saves (unless multiline)
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      if (localValue !== value) {
        onChange(localValue);
      }
      onEditEnd?.();
    }
    
    // Escape cancels
    if (e.key === 'Escape') {
      e.preventDefault();
      setLocalValue(value); // Reset to original
      if (editRef.current) {
        editRef.current.textContent = value;
      }
      onEditEnd?.();
    }
  }, [localValue, value, onChange, onEditEnd, multiline]);
  
  // Handle double-click to enter edit mode
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEditStart?.();
  }, [onEditStart]);
  
  // Non-editing display
  if (!isEditing) {
    return (
      <Component
        className={cn(
          'cursor-text transition-colors',
          'hover:bg-primary/5 rounded',
          className
        )}
        onDoubleClick={handleDoubleClick}
      >
        {value || <span className="text-muted-foreground/50">{placeholder}</span>}
      </Component>
    );
  }
  
  // Editing mode with contentEditable
  return (
    <div
      ref={editRef}
      contentEditable
      suppressContentEditableWarning
      className={cn(
        'outline-none ring-2 ring-primary rounded px-1 -mx-1',
        'bg-background min-w-[50px]',
        className
      )}
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(localValue) }}
    />
  );
}

export default EditableText;
