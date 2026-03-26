/**
 * Slate Leaf Renderer
 * 
 * Renders inline formatting (bold, italic, underline, etc.)
 */

import React from 'react';
import { RenderLeafProps } from 'slate-react';
import { FormattedText } from '@/types/slate.d';

export function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  const formatted = leaf as FormattedText;
  
  if (formatted.bold) {
    children = <strong>{children}</strong>;
  }
  
  if (formatted.italic) {
    children = <em>{children}</em>;
  }
  
  if (formatted.underline) {
    children = <u>{children}</u>;
  }
  
  if (formatted.strikethrough) {
    children = <s>{children}</s>;
  }
  
  if (formatted.code) {
    children = (
      <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  }
  
  return <span {...attributes}>{children}</span>;
}

export default Leaf;
