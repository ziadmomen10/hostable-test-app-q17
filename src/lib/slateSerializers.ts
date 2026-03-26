/**
 * Slate Serializers
 * 
 * Utilities to convert between HTML strings and Slate document format.
 * This enables backward compatibility with existing HTML content.
 */

import { Descendant, Text } from 'slate';
import { CustomElement, FormattedText } from '@/types/slate.d';

// ============================================================================
// HTML → Slate Deserialization
// ============================================================================

/**
 * Convert an HTML string to Slate value format
 */
export function deserializeHtml(html: string): Descendant[] {
  // If empty or just whitespace, return empty paragraph
  if (!html || !html.trim()) {
    return [{ type: 'paragraph', children: [{ text: '' }] }];
  }

  // If plain text (no HTML tags), wrap in paragraph
  if (!containsHtml(html)) {
    return [{ type: 'paragraph', children: [{ text: html }] }];
  }

  // Parse HTML using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const result = deserializeNode(doc.body);
  
  // Ensure we always return at least one paragraph
  if (result.length === 0) {
    return [{ type: 'paragraph', children: [{ text: '' }] }];
  }
  
  return result;
}

/**
 * Recursively deserialize a DOM node to Slate nodes
 */
function deserializeNode(node: Node): Descendant[] {
  // Text node
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    // Skip empty text nodes that are just whitespace between elements
    if (!text.trim() && text.includes('\n')) {
      return [];
    }
    return [{ text }];
  }

  // Not an element node
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();
  
  // Get children
  const children: Descendant[] = Array.from(element.childNodes)
    .flatMap(child => deserializeNode(child));

  // Ensure children is not empty (Slate requires at least one child)
  const safeChildren = children.length > 0 ? children : [{ text: '' }];

  // Handle different HTML elements
  switch (tagName) {
    case 'body':
      // For body, we need to wrap inline content in paragraphs
      return normalizeBodyChildren(children);
      
    case 'p':
      return [{ type: 'paragraph', children: normalizeInlineChildren(safeChildren) }];
      
    case 'h1':
      return [{ type: 'heading-one', children: normalizeInlineChildren(safeChildren) }];
      
    case 'h2':
      return [{ type: 'heading-two', children: normalizeInlineChildren(safeChildren) }];
      
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return [{ type: 'heading-three', children: normalizeInlineChildren(safeChildren) }];
      
    case 'ul':
      return [{ type: 'bulleted-list', children: safeChildren as Descendant[] }];
      
    case 'ol':
      return [{ type: 'numbered-list', children: safeChildren as Descendant[] }];
      
    case 'li':
      return [{ type: 'list-item', children: normalizeInlineChildren(safeChildren) }];
      
    case 'a':
      return [{
        type: 'link',
        url: element.getAttribute('href') || '',
        children: normalizeInlineChildren(safeChildren),
      }];
      
    case 'strong':
    case 'b':
      return addMarkToChildren(safeChildren, 'bold');
      
    case 'em':
    case 'i':
      return addMarkToChildren(safeChildren, 'italic');
      
    case 'u':
      return addMarkToChildren(safeChildren, 'underline');
      
    case 's':
    case 'del':
    case 'strike':
      return addMarkToChildren(safeChildren, 'strikethrough');
      
    case 'code':
      return addMarkToChildren(safeChildren, 'code');
      
    case 'br':
      return [{ text: '\n' }];
      
    case 'div':
    case 'span':
      // For divs/spans, just return children
      return safeChildren;
      
    default:
      // Unknown element, just return children
      return safeChildren;
  }
}

/**
 * Add a mark to all text nodes in children
 */
function addMarkToChildren(children: Descendant[], mark: keyof FormattedText): Descendant[] {
  return children.map(child => {
    if (Text.isText(child)) {
      return { ...child, [mark]: true };
    }
    return child;
  });
}

/**
 * Normalize body children - wrap inline content in paragraphs
 */
function normalizeBodyChildren(children: Descendant[]): Descendant[] {
  const result: Descendant[] = [];
  let currentInlineGroup: Descendant[] = [];
  
  for (const child of children) {
    if (Text.isText(child)) {
      currentInlineGroup.push(child);
    } else if ('type' in child && isBlockElement(child.type)) {
      // Flush any accumulated inline content
      if (currentInlineGroup.length > 0) {
        result.push({ type: 'paragraph', children: currentInlineGroup });
        currentInlineGroup = [];
      }
      result.push(child);
    } else {
      currentInlineGroup.push(child);
    }
  }
  
  // Flush remaining inline content
  if (currentInlineGroup.length > 0) {
    result.push({ type: 'paragraph', children: currentInlineGroup });
  }
  
  return result;
}

/**
 * Normalize inline children - ensure no block elements in inline context
 */
function normalizeInlineChildren(children: Descendant[]): Descendant[] {
  return children.filter(child => {
    if (Text.isText(child)) return true;
    if ('type' in child && !isBlockElement(child.type)) return true;
    return false;
  });
}

/**
 * Check if an element type is a block element
 */
function isBlockElement(type: string): boolean {
  return ['paragraph', 'heading-one', 'heading-two', 'heading-three', 
          'bulleted-list', 'numbered-list', 'list-item'].includes(type);
}

// ============================================================================
// Slate → HTML Serialization
// ============================================================================

/**
 * Convert Slate value to HTML string
 */
export function serializeToHtml(value: Descendant[]): string {
  return value.map(node => serializeNode(node)).join('');
}

/**
 * Serialize a single Slate node to HTML
 */
function serializeNode(node: Descendant): string {
  // Text node with formatting
  if (Text.isText(node)) {
    let html = escapeHtml(node.text);
    
    if ((node as FormattedText).code) {
      html = `<code>${html}</code>`;
    }
    if ((node as FormattedText).strikethrough) {
      html = `<s>${html}</s>`;
    }
    if ((node as FormattedText).underline) {
      html = `<u>${html}</u>`;
    }
    if ((node as FormattedText).italic) {
      html = `<em>${html}</em>`;
    }
    if ((node as FormattedText).bold) {
      html = `<strong>${html}</strong>`;
    }
    
    return html;
  }

  // Element node
  const element = node as CustomElement;
  const children = element.children.map(child => serializeNode(child)).join('');

  switch (element.type) {
    case 'paragraph':
      return `<p>${children}</p>`;
    case 'heading-one':
      return `<h1>${children}</h1>`;
    case 'heading-two':
      return `<h2>${children}</h2>`;
    case 'heading-three':
      return `<h3>${children}</h3>`;
    case 'bulleted-list':
      return `<ul>${children}</ul>`;
    case 'numbered-list':
      return `<ol>${children}</ol>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'link':
      return `<a href="${escapeHtml(element.url)}">${children}</a>`;
    default:
      return children;
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a string contains HTML tags
 */
export function containsHtml(str: string): boolean {
  return /<[^>]+>/.test(str);
}

/**
 * Check if content is simple text (single paragraph, no formatting)
 * Used to determine if we can serialize back to plain text
 */
export function isSimpleText(value: Descendant[]): boolean {
  if (value.length !== 1) return false;
  
  const node = value[0];
  if (!('type' in node) || node.type !== 'paragraph') return false;
  
  const paragraph = node as CustomElement;
  if (paragraph.children.length !== 1) return false;
  
  const child = paragraph.children[0];
  if (!Text.isText(child)) return false;
  
  // Check if it has any formatting
  const formatted = child as FormattedText;
  return !formatted.bold && !formatted.italic && !formatted.underline && 
         !formatted.strikethrough && !formatted.code;
}

/**
 * Extract plain text from Slate value (strips all formatting)
 */
export function extractPlainText(value: Descendant[]): string {
  return value
    .map(node => extractNodeText(node))
    .join('\n')
    .trim();
}

function extractNodeText(node: Descendant): string {
  if (Text.isText(node)) {
    return node.text;
  }
  
  const element = node as CustomElement;
  return element.children.map(child => extractNodeText(child)).join('');
}
