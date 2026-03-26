/**
 * Slate Editor
 * 
 * A rich text editor component using Slate.js with:
 * - Text formatting (bold, italic, underline, strikethrough, code)
 * - Block formatting (headings, lists) for multiline mode
 * - Links
 * - Undo/Redo with slate-history
 * - Keyboard shortcuts
 */

import React, { useState, useCallback, useMemo, useEffect, useRef, CSSProperties } from 'react';
import { createEditor, Descendant, Editor, Transforms } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';
import { Element } from './Element';
import { Leaf } from './Leaf';
import { SlateFormattingToolbar } from './SlateFormattingToolbar';
import { deserializeHtml, serializeToHtml, isSimpleText, extractPlainText } from '@/lib/slateSerializers';
import { cn } from '@/lib/utils';
import { TextFormat } from '@/types/slate.d';

// ============================================================================
// Hotkey Configuration
// ============================================================================

const HOTKEYS: Record<string, TextFormat> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+shift+s': 'strikethrough',
  'mod+`': 'code',
};

// ============================================================================
// Custom Editor Plugin
// ============================================================================

const withInlineLinks = (editor: Editor) => {
  const { isInline } = editor;
  
  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  };
  
  return editor;
};

// ============================================================================
// Component
// ============================================================================

interface SlateEditorProps {
  initialValue: string;
  onSave: (htmlValue: string, plainText: string) => void;
  onCancel: () => void;
  style?: CSSProperties;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function SlateEditor({
  initialValue,
  onSave,
  onCancel,
  style,
  className,
  multiline = false,
  placeholder = 'Enter text...',
}: SlateEditorProps) {
  // Create editor instance (stable across renders)
  const editor = useMemo(
    () => withInlineLinks(withHistory(withReact(createEditor()))),
    []
  );
  
  // Parse initial value and track original for comparison
  const initialSlateValue = useMemo(() => deserializeHtml(initialValue), [initialValue]);
  const originalValueRef = useRef(initialValue);
  
  // Editor state
  const [value, setValue] = useState<Descendant[]>(initialSlateValue);
  
  // Focus the editor on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        ReactEditor.focus(editor);
        // Select all content
        Transforms.select(editor, {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        });
      } catch (e) {
        // Editor might not be mounted yet
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [editor]);
  
  // Render callbacks (memoized for performance)
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  
  // Save handler
  const handleSave = useCallback(() => {
    const htmlValue = serializeToHtml(value);
    const plainText = extractPlainText(value);
    
    // Only save if content changed
    if (htmlValue !== originalValueRef.current) {
      // If it's simple text with no formatting, save as plain text
      if (isSimpleText(value)) {
        onSave(plainText, plainText);
      } else {
        onSave(htmlValue, plainText);
      }
    } else {
      onCancel();
    }
  }, [value, onSave, onCancel]);
  
  // Handle keyboard events
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Hotkeys for formatting
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        const isActive = Editor.marks(editor)?.[mark];
        if (isActive) {
          Editor.removeMark(editor, mark);
        } else {
          Editor.addMark(editor, mark, true);
        }
        return;
      }
    }
    
    // Undo/Redo (handled by slate-history, but we need to prevent default)
    if (isHotkey('mod+z', event)) {
      event.preventDefault();
      editor.undo();
      return;
    }
    
    if (isHotkey('mod+shift+z', event) || isHotkey('mod+y', event)) {
      event.preventDefault();
      editor.redo();
      return;
    }
    
    // Escape to cancel
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
      return;
    }
    
    // Enter behavior
    if (event.key === 'Enter') {
      if (!multiline) {
        // Single line: Enter saves
        event.preventDefault();
        handleSave();
        return;
      }
      // Multiline: Shift+Enter for soft break, Enter for new paragraph
      if (event.shiftKey) {
        event.preventDefault();
        editor.insertText('\n');
        return;
      }
      // Let Slate handle normal Enter (new paragraph)
    }
  }, [editor, multiline, handleSave, onCancel]);
  
  // Handle blur (save on click outside)
  const handleBlur = useCallback(() => {
    // Small delay to allow clicking toolbar buttons
    setTimeout(() => {
      // Check if focus moved outside the editor
      const activeElement = document.activeElement;
      const editorElement = ReactEditor.toDOMNode(editor, editor);
      
      if (!editorElement.contains(activeElement)) {
        handleSave();
      }
    }, 100);
  }, [editor, handleSave]);
  
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={setValue}
    >
      <div 
        className={cn(
          'outline-none ring-2 ring-primary rounded min-w-[100px]',
          'animate-in zoom-in-95 fade-in duration-150',
          'bg-transparent',
          className
        )}
        style={style}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="outline-none"
          spellCheck
          autoFocus
        />
      </div>
      
      {/* Formatting toolbar (appears on text selection) */}
      <SlateFormattingToolbar multiline={multiline} />
    </Slate>
  );
}

export default SlateEditor;
