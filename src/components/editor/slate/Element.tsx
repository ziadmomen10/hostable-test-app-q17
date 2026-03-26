/**
 * Slate Element Renderer
 * 
 * Renders block-level elements (paragraphs, headings, lists, links).
 */

import React from 'react';
import { RenderElementProps } from 'slate-react';

export function Element({ attributes, children, element }: RenderElementProps) {
  switch (element.type) {
    case 'heading-one':
      return (
        <h1 {...attributes} className="text-2xl font-bold mb-2">
          {children}
        </h1>
      );
      
    case 'heading-two':
      return (
        <h2 {...attributes} className="text-xl font-semibold mb-2">
          {children}
        </h2>
      );
      
    case 'heading-three':
      return (
        <h3 {...attributes} className="text-lg font-medium mb-1">
          {children}
        </h3>
      );
      
    case 'bulleted-list':
      return (
        <ul {...attributes} className="list-disc list-inside ml-4 my-1">
          {children}
        </ul>
      );
      
    case 'numbered-list':
      return (
        <ol {...attributes} className="list-decimal list-inside ml-4 my-1">
          {children}
        </ol>
      );
      
    case 'list-item':
      return (
        <li {...attributes} className="my-0.5">
          {children}
        </li>
      );
      
    case 'link':
      return (
        <a
          {...attributes}
          href={element.url}
          className="text-primary underline hover:text-primary/80"
          onClick={(e) => {
            // Prevent navigation while editing
            e.preventDefault();
          }}
        >
          {children}
        </a>
      );
      
    case 'paragraph':
    default:
      return (
        <p {...attributes} className="my-0">
          {children}
        </p>
      );
  }
}

export default Element;
