/**
 * Slate Editor Components
 * 
 * Rich text editing with Slate.js
 */

export { SlateEditor } from './SlateEditor';
export { SlateFormattingToolbar } from './SlateFormattingToolbar';
export { Element } from './Element';
export { Leaf } from './Leaf';

// Re-export serializers for convenience
export { 
  deserializeHtml, 
  serializeToHtml, 
  containsHtml,
  isSimpleText,
  extractPlainText 
} from '@/lib/slateSerializers';
