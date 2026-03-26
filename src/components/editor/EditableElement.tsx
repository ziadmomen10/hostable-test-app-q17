/**
 * EditableElement
 * 
 * UNIFIED WRAPPER for all editable elements in sections.
 * This component ensures consistent:
 * - data-* attributes for overlay targeting
 * - Click/double-click handling for selection/editing
 * - Hover state management
 * - Placeholder display for empty content
 * - Element registration in the registry for fast lookup
 * - **Automatic rich text rendering** for TipTap JSON content
 * - **Translation status indicators** showing bound/missing/stale/translated
 * 
 * GOLDEN RULE: Every editable element in every section MUST use this wrapper.
 */

import React, { useCallback, forwardRef, ElementType, ComponentPropsWithoutRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { registerElement, createElementId } from '@/stores/elementRegistry';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { isRichTextJSON, RichTextContent } from '@/types/richText';
import { useTranslationStatus, TranslationStatusType } from '@/hooks/useTranslationStatus';
import { useEditorModeContext } from '@/contexts/EditorModeContext';

// ============================================================================
// Translation Status Badge
// ============================================================================

const statusConfig: Record<TranslationStatusType, { symbol: string; color: string; bgColor: string }> = {
  translated: { symbol: '✓', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/50' },
  stale: { symbol: '⚠', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/50' },
  missing: { symbol: '!', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/50' },
  unbound: { symbol: '−', color: 'text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800' },
};

function TranslationStatusBadge({ status, tooltip }: { status: TranslationStatusType; tooltip: string }) {
  const config = statusConfig[status];
  
  return (
    <span 
      className={cn(
        "absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold z-50 pointer-events-none",
        config.color,
        config.bgColor,
        "border border-background shadow-sm"
      )}
      title={tooltip}
    >
      {config.symbol}
    </span>
  );
}
// ============================================================================
// Types
// ============================================================================

export type EditableElementType = 'text' | 'richtext' | 'image' | 'button' | 'link' | 'array-item';

type PolymorphicRef<T extends ElementType> = ComponentPropsWithoutRef<T>['ref'];

type PolymorphicProps<T extends ElementType, P = object> = P & {
  /** The HTML element to render as */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof P | 'as'>;

interface EditableBaseProps {
  /** The section ID this element belongs to */
  sectionId?: string;
  /** Path to the property in section props (e.g., "title", "services.0.label") */
  path: string;
  /** Type of editable element */
  type?: EditableElementType;
  /** Whether this element can be resized */
  resizable?: boolean;
  /** Whether this element can be dragged (for array items) */
  draggable?: boolean;
  /** Array path for drag/drop context (e.g., "services") */
  arrayPath?: string;
  /** Index within array for drag/drop */
  index?: number;
  /** Content to render */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Placeholder text when content is empty (only for text types) */
  placeholder?: string;
  /** Whether the content is empty (shows placeholder) */
  isEmpty?: boolean;
  /** Custom onClick handler (in addition to selection) */
  onClick?: (e: React.MouseEvent) => void;
  /** Custom styles */
  style?: React.CSSProperties;
}

export type EditableElementProps<T extends ElementType = 'div'> = PolymorphicProps<T, EditableBaseProps>;

// ============================================================================
// Component
// ============================================================================

type EditableElementComponent = <T extends ElementType = 'div'>(
  props: EditableElementProps<T> & { ref?: PolymorphicRef<T> }
) => React.ReactElement | null;

export const EditableElement: EditableElementComponent = forwardRef(function EditableElement<
  T extends ElementType = 'div'
>(
  {
    as,
    sectionId,
    path,
    type = 'text',
    resizable = false,
    draggable = false,
    arrayPath,
    index,
    children,
    className,
    placeholder = 'Click to edit',
    isEmpty = false,
    onClick,
    style,
    ...rest
  }: EditableElementProps<T>,
  forwardedRef: PolymorphicRef<T>
) {
  const Component = as || 'div';
  const internalRef = useRef<HTMLElement>(null);
  
  // Use internal ref for registration
  const elementRef = internalRef;
  
  // Check if in editor mode using context (avoids circular dependency with editorStore)
  const { isEditorMode, showTranslationBadges } = useEditorModeContext();
  
  // Get translation status for this element (only computed when translation badges are enabled)
  const translationStatusResult = useTranslationStatus(
    showTranslationBadges ? sectionId : undefined, 
    path
  );
  
  // Register element in registry for fast lookup
  useEffect(() => {
    if (!sectionId) return;
    
    const id = createElementId(sectionId, path);
    const unregister = registerElement({
      id,
      sectionId,
      path,
      type,
      ref: elementRef,
      resizable,
      draggable,
    });
    
    return unregister;
  }, [sectionId, path, type, resizable, draggable, elementRef]);
  
  // Handle click - selection is handled by EditorCanvas event delegation
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Stop propagation so EditorCanvas can handle selection
    e.stopPropagation();
    onClick?.(e);
  }, [onClick]);

  // Compute data attributes
  const dataAttributes: Record<string, string | undefined> = {
    'data-editable': path,
    'data-section-id': sectionId,
    'data-element-type': type,
    'data-resizable': resizable ? 'true' : undefined,
    'data-draggable': draggable ? 'true' : undefined,
  };

  // Add array-specific attributes for drag/drop
  if (arrayPath !== undefined) {
    dataAttributes['data-array-path'] = arrayPath;
  }
  if (index !== undefined) {
    dataAttributes['data-index'] = String(index);
  }

  // Show placeholder for empty content
  const showPlaceholder = isEmpty && (type === 'text' || type === 'richtext');

  // Filter out undefined data attributes
  const filteredDataAttrs = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, v]) => v !== undefined)
  );

  // Render children - automatically handle TipTap JSON content
  const renderContent = () => {
    if (showPlaceholder) return placeholder;
    
    // If children is TipTap JSON or could be RichTextContent, use RichTextRenderer
    if (isRichTextJSON(children)) {
      return <RichTextRenderer content={children as RichTextContent} />;
    }
    
    // For React elements or plain strings, render as-is
    return children;
  };

  return (
    <Component
      ref={(node: any) => {
        // Update internal ref for registry
        (internalRef as React.MutableRefObject<HTMLElement | null>).current = node;
        // Forward ref if provided
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<any>).current = node;
        }
      }}
      className={cn(
        // Base styles for editability
        'transition-colors duration-100 relative',
        // Placeholder styling
        showPlaceholder && 'text-muted-foreground/50 italic',
        className
      )}
      style={style}
      onClick={handleClick}
      {...filteredDataAttrs}
      {...rest}
    >
      {renderContent()}
      {/* Translation status badge */}
      {translationStatusResult && (
        <TranslationStatusBadge 
          status={translationStatusResult.status} 
          tooltip={translationStatusResult.tooltip} 
        />
      )}
    </Component>
  );
}) as EditableElementComponent;

// ============================================================================
// Inline variant that renders as span by default (can be polymorphic too)
// ============================================================================

type EditableInlineComponent = <T extends ElementType = 'span'>(
  props: EditableElementProps<T> & { ref?: PolymorphicRef<T> }
) => React.ReactElement | null;

export const EditableInline: EditableInlineComponent = forwardRef(function EditableInline<
  T extends ElementType = 'span'
>(
  {
    as,
    sectionId,
    path,
    type = 'text',
    resizable = false,
    draggable = false,
    arrayPath,
    index,
    children,
    className,
    placeholder = 'Click to edit',
    isEmpty = false,
    onClick,
    style,
    ...rest
  }: EditableElementProps<T>,
  forwardedRef: PolymorphicRef<T>
) {
  const Component = as || 'span';
  const internalRef = useRef<HTMLElement>(null);
  
  // Use internal ref for registration
  const elementRef = internalRef;
  
  // Check if in editor mode using context (avoids circular dependency with editorStore)
  const { showTranslationBadges } = useEditorModeContext();
  
  // Get translation status for this element (only computed when translation badges are enabled)
  const translationStatusResult = useTranslationStatus(
    showTranslationBadges ? sectionId : undefined, 
    path
  );
  
  // Register element in registry for fast lookup
  useEffect(() => {
    if (!sectionId) return;
    
    const id = createElementId(sectionId, path);
    const unregister = registerElement({
      id,
      sectionId,
      path,
      type,
      ref: elementRef,
      resizable,
      draggable,
    });
    
    return unregister;
  }, [sectionId, path, type, resizable, draggable, elementRef]);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(e);
  }, [onClick]);

  const dataAttributes: Record<string, string | undefined> = {
    'data-editable': path,
    'data-section-id': sectionId,
    'data-element-type': type,
    'data-resizable': resizable ? 'true' : undefined,
    'data-draggable': draggable ? 'true' : undefined,
  };

  if (arrayPath !== undefined) {
    dataAttributes['data-array-path'] = arrayPath;
  }
  if (index !== undefined) {
    dataAttributes['data-index'] = String(index);
  }

  const showPlaceholder = isEmpty && (type === 'text' || type === 'richtext');

  const filteredDataAttrs = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, v]) => v !== undefined)
  );

  // Render children - automatically handle TipTap JSON content
  const renderContent = () => {
    if (showPlaceholder) return placeholder;
    
    // If children is TipTap JSON or could be RichTextContent, use RichTextRenderer
    if (isRichTextJSON(children)) {
      return <RichTextRenderer content={children as RichTextContent} />;
    }
    
    // For React elements or plain strings, render as-is
    return children;
  };

  return (
    <Component
      ref={(node: any) => {
        // Update internal ref for registry
        (internalRef as React.MutableRefObject<HTMLElement | null>).current = node;
        // Forward ref if provided
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<any>).current = node;
        }
      }}
      className={cn(
        'transition-colors duration-100 relative',
        showPlaceholder && 'text-muted-foreground/50 italic',
        className
      )}
      style={style}
      onClick={handleClick}
      {...filteredDataAttrs}
      {...rest}
    >
      {renderContent()}
      {/* Translation status badge */}
      {translationStatusResult && (
        <TranslationStatusBadge 
          status={translationStatusResult.status} 
          tooltip={translationStatusResult.tooltip} 
        />
      )}
    </Component>
  );
}) as EditableInlineComponent;

export default EditableElement;
