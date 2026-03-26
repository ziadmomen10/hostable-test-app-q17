/**
 * Rich Text Renderer
 * 
 * Renders RichTextContent (string or TipTap JSON) as React elements
 * NO dangerouslySetInnerHTML - pure React rendering
 */

import React from 'react';
import type { JSONContent } from '@tiptap/react';
import { cn } from '@/lib/utils';
import { RichTextContent, isRichTextJSON } from '@/types/richText';

interface RichTextRendererProps {
  content: RichTextContent;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

/**
 * Renders rich text content as React elements
 * Handles both plain strings and TipTap JSON
 */
export function RichTextRenderer({ 
  content, 
  className,
  as: Component = 'span' 
}: RichTextRendererProps) {
  // Plain string - render as-is
  if (typeof content === 'string') {
    return <Component className={className}>{content}</Component>;
  }

  // TipTap JSON - render recursively
  if (isRichTextJSON(content)) {
    return (
      <Component className={className}>
        <TiptapNode node={content} />
      </Component>
    );
  }

  // Fallback for unknown content
  return <Component className={className}>{String(content || '')}</Component>;
}

/**
 * Recursively renders a TipTap JSON node
 */
function TiptapNode({ node }: { node: JSONContent }): React.ReactElement | null {
  // Text node - apply marks and render
  if (node.type === 'text') {
    return <TextNode node={node} />;
  }

  // Get children
  const children = node.content?.map((child, index) => (
    <TiptapNode key={index} node={child} />
  ));

  // Block elements
  switch (node.type) {
    case 'doc':
      return <>{children}</>;

    case 'paragraph': {
      const style = getAlignmentStyle(node.attrs?.textAlign);
      // For inline display, use span; for block display use p
      return <span style={style}>{children || <br />}</span>;
    }

    case 'heading': {
      const level = node.attrs?.level || 1;
      const style = getAlignmentStyle(node.attrs?.textAlign);
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      return <Tag style={style}>{children}</Tag>;
    }

    case 'bulletList':
      return <ul className="list-disc list-inside">{children}</ul>;

    case 'orderedList':
      return <ol className="list-decimal list-inside">{children}</ol>;

    case 'listItem':
      return <li>{children}</li>;

    case 'hardBreak':
      return <br />;

    case 'link': {
      const href = node.attrs?.href || '#';
      return (
        <a 
          href={href} 
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    default:
      // Unknown node type - just render children
      return <>{children}</>;
  }
}

/**
 * Renders a text node with its marks (formatting)
 */
function TextNode({ node }: { node: JSONContent }): React.ReactElement {
  let element: React.ReactElement = <>{node.text || ''}</>;

  // Apply marks in order
  if (node.marks) {
    for (const mark of node.marks) {
      switch (mark.type) {
        case 'bold':
          element = <strong>{element}</strong>;
          break;
        case 'italic':
          element = <em>{element}</em>;
          break;
        case 'underline':
          element = <u>{element}</u>;
          break;
        case 'strike':
          element = <s>{element}</s>;
          break;
        case 'code':
          element = <code className="bg-muted px-1 py-0.5 rounded text-sm">{element}</code>;
          break;
        case 'textStyle': {
          const color = mark.attrs?.color;
          if (color) {
            element = <span style={{ color }}>{element}</span>;
          }
          break;
        }
        case 'highlight': {
          const bgColor = mark.attrs?.color || '#fef08a';
          element = <mark style={{ backgroundColor: bgColor }}>{element}</mark>;
          break;
        }
        case 'link': {
          const href = mark.attrs?.href || '#';
          element = (
            <a 
              href={href} 
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {element}
            </a>
          );
          break;
        }
      }
    }
  }

  return element;
}

/**
 * Gets CSS style for text alignment
 */
function getAlignmentStyle(align?: string): React.CSSProperties | undefined {
  if (!align || align === 'left') return undefined;
  return { textAlign: align as 'center' | 'right' | 'justify' };
}

export default RichTextRenderer;
