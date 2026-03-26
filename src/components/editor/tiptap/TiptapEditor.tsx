/**
 * TipTap Editor (Now using SimpleRichEditor)
 * 
 * This is a compatibility wrapper that maintains the same interface
 * but uses the new SimpleRichEditor underneath.
 */

import React, { CSSProperties } from 'react';
import { SimpleRichEditor } from './SimpleRichEditor';
import { RichTextContent } from '@/types/richText';

// ============================================================================
// Component
// ============================================================================

interface TiptapEditorProps {
  initialValue: RichTextContent;
  onSave: (content: RichTextContent, plainText: string) => void;
  onCancel: () => void;
  style?: CSSProperties;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function TiptapEditor({
  initialValue,
  onSave,
  onCancel,
  style,
  className,
  multiline = false,
  placeholder = 'Enter text...',
}: TiptapEditorProps) {
  return (
    <SimpleRichEditor
      initialValue={initialValue}
      onSave={onSave}
      onCancel={onCancel}
      style={style}
      className={className}
      multiline={multiline}
      placeholder={placeholder}
    />
  );
}

export default TiptapEditor;
