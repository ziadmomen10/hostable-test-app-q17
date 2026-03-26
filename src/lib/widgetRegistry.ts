/**
 * Widget Registry
 * 
 * Maps widget types to their React components for rendering.
 * This is the central registry for all widget types used in the grid system.
 */

import React from 'react';
import { GridWidgetType, GridWidget } from '@/types/grid';

// ============================================================================
// Widget Component Props
// ============================================================================

export interface WidgetProps {
  /** Widget data */
  widget: GridWidget;
  /** Section ID containing this widget */
  sectionId: string;
  /** Column ID containing this widget */
  columnId: string;
  /** Index within the column */
  index: number;
  /** Whether the editor is in edit mode */
  isEditing: boolean;
}

// ============================================================================
// Generic Widget Renderer
// ============================================================================

/**
 * Generic widget component that renders widget content based on its props.
 * This is used as a fallback for widgets without specific renderers.
 */
export function GenericWidget({ widget }: WidgetProps): React.ReactElement {
  const { props } = widget;
  
  // Try to render common patterns
  if (props.title || props.label) {
    return React.createElement('div', { className: 'p-4 border border-border rounded-lg bg-card' },
      props.icon && React.createElement('div', { className: 'w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3' },
        React.createElement('span', { className: 'text-primary text-sm' }, props.icon)
      ),
      React.createElement('h4', { className: 'font-semibold text-foreground' }, props.title || props.label),
      props.description && React.createElement('p', { className: 'text-sm text-muted-foreground mt-1' }, props.description),
      props.price && React.createElement('p', { className: 'text-primary font-medium mt-2' }, props.price)
    );
  }

  // Fallback: render as JSON for debugging
  return React.createElement('div', { className: 'p-4 border border-dashed border-muted-foreground/30 rounded bg-muted/10' },
    React.createElement('pre', { className: 'text-xs text-muted-foreground overflow-hidden' }, 
      JSON.stringify(props, null, 2).substring(0, 200)
    )
  );
}

// ============================================================================
// Widget Type Registry
// ============================================================================

/**
 * Registry of widget type to component mappings.
 * Components are lazy-loaded where possible for performance.
 */
const widgetRegistry: Partial<Record<GridWidgetType, React.ComponentType<WidgetProps>>> = {
  // All widgets use generic renderer for now
  // Specific widgets will be added as needed
};

/**
 * Get the component for a widget type.
 * Falls back to GenericWidget if no specific component is registered.
 */
export function getWidgetComponent(type: GridWidgetType): React.ComponentType<WidgetProps> {
  return widgetRegistry[type] || GenericWidget;
}

/**
 * Register a widget component for a type.
 * Used for extending the registry with custom widgets.
 */
export function registerWidgetComponent(
  type: GridWidgetType,
  component: React.ComponentType<WidgetProps>
): void {
  widgetRegistry[type] = component;
}

/**
 * Check if a specific widget type has a registered component.
 */
export function hasWidgetComponent(type: GridWidgetType): boolean {
  return type in widgetRegistry;
}

// ============================================================================
// Widget Factory
// ============================================================================

/**
 * Create a new widget instance with default props.
 */
export function createWidget(
  type: GridWidgetType,
  props: Record<string, any> = {}
): GridWidget {
  return {
    id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    props,
  };
}
