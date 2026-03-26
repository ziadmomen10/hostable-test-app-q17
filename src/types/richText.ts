/**
 * Rich Text Content Types
 * 
 * Defines types for rich text content that can be either:
 * - Plain string (backward compatible)
 * - TipTap JSON document structure
 */

// Inline type — mirrors @tiptap/react JSONContent without the runtime dependency
export type JSONContent = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: JSONContent[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
  [key: string]: unknown;
};

/**
 * Content can be plain string OR TipTap JSON
 * This allows backward compatibility with existing string content
 */
export type RichTextContent = string | JSONContent;

/**
 * Type guard to check if content is TipTap JSON structure
 */
export function isRichTextJSON(value: unknown): value is JSONContent {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  // TipTap JSON always has a 'type' property
  if (typeof obj.type !== 'string') return false;
  
  // Root document has type 'doc'
  // Or it could be a fragment with content array
  return obj.type === 'doc' || Array.isArray(obj.content);
}

/**
 * Check if a string contains HTML tags
 */
export function containsHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

/**
 * Extract plain text from RichTextContent
 */
export function extractPlainText(content: RichTextContent): string {
  if (typeof content === 'string') {
    // Strip HTML tags if present
    return content.replace(/<[^>]*>/g, '').trim();
  }
  
  // Extract text from TipTap JSON recursively
  return extractTextFromNode(content);
}

function extractTextFromNode(node: JSONContent): string {
  if (node.type === 'text') {
    return node.text || '';
  }
  
  if (node.content && Array.isArray(node.content)) {
    return node.content.map(extractTextFromNode).join('');
  }
  
  return '';
}

/**
 * Check if content is simple text with no formatting
 * Returns true ONLY if content is plain text with no marks/formatting at all
 */
export function isSimpleText(content: RichTextContent): boolean {
  if (typeof content === 'string') {
    return !containsHtml(content);
  }
  
  // Check TipTap JSON - simple if it's just a doc with plain text paragraphs (no marks)
  if (content.type !== 'doc') return false;
  if (!content.content) return true; // Empty doc
  
  // Check ALL nodes recursively for any marks
  return !hasAnyMarks(content);
}

/**
 * Recursively check if any text node in the content has marks (formatting)
 */
function hasAnyMarks(node: JSONContent): boolean {
  // Text node with marks = has formatting
  if (node.type === 'text') {
    return !!(node.marks && node.marks.length > 0);
  }
  
  // Check all child nodes
  if (node.content && Array.isArray(node.content)) {
    return node.content.some(child => hasAnyMarks(child));
  }
  
  return false;
}

/**
 * Create a simple TipTap document from plain text
 */
export function createSimpleDoc(text: string): JSONContent {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: text ? [{ type: 'text', text }] : [],
      },
    ],
  };
}
