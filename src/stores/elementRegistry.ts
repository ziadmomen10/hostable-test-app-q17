/**
 * Element Registry
 * 
 * A centralized registry for tracking mounted editable elements.
 * This allows for faster overlay positioning without DOM queries.
 * 
 * Elements register on mount and unregister on unmount.
 * The registry provides bounds and element lookup by ID.
 */

import { useCallback, useEffect, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface ElementRegistration {
  /** Unique identifier: `${sectionId}::${path}` */
  id: string;
  /** Section this element belongs to */
  sectionId: string;
  /** Property path within section props */
  path: string;
  /** Type of editable element */
  type: 'text' | 'richtext' | 'image' | 'button' | 'link' | 'array-item';
  /** React ref to the DOM element */
  ref: React.RefObject<HTMLElement>;
  /** Whether this element can be resized */
  resizable: boolean;
  /** Whether this element can be dragged */
  draggable: boolean;
}

export interface ElementBounds {
  top: number;
  left: number;
  width: number;
  height: number;
}

// ============================================================================
// Registry Map (Module-level singleton)
// ============================================================================

const elementRegistry = new Map<string, ElementRegistration>();

// Subscribers for registry changes
type RegistrySubscriber = () => void;
const subscribers = new Set<RegistrySubscriber>();

function notifySubscribers() {
  subscribers.forEach(cb => cb());
}

// ============================================================================
// Registry Functions
// ============================================================================

/**
 * Generate a unique element ID from section ID and path
 */
export function createElementId(sectionId: string, path: string): string {
  return `${sectionId}::${path}`;
}

/**
 * Parse an element ID back into section ID and path
 */
export function parseElementId(id: string): { sectionId: string; path: string } | null {
  const parts = id.split('::');
  if (parts.length !== 2) return null;
  return { sectionId: parts[0], path: parts[1] };
}

/**
 * Register an element in the registry
 * Returns a cleanup function to unregister
 */
export function registerElement(registration: ElementRegistration): () => void {
  elementRegistry.set(registration.id, registration);
  notifySubscribers();
  
  return () => {
    unregisterElement(registration.id);
  };
}

/**
 * Unregister an element from the registry
 */
export function unregisterElement(id: string): void {
  if (elementRegistry.has(id)) {
    elementRegistry.delete(id);
    notifySubscribers();
  }
}

/**
 * Get an element registration by its full ID
 */
export function getElement(id: string): ElementRegistration | undefined {
  return elementRegistry.get(id);
}

/**
 * Get an element registration by section ID and path
 */
export function getElementById(sectionId: string, path: string): ElementRegistration | undefined {
  const id = createElementId(sectionId, path);
  return elementRegistry.get(id);
}

/**
 * Get the bounding rect of an element
 * Returns null if element not found or ref is null
 */
export function getElementBounds(id: string): ElementBounds | null {
  const registration = elementRegistry.get(id);
  if (!registration?.ref.current) return null;
  
  const rect = registration.ref.current.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Get bounds by section ID and path
 */
export function getElementBoundsByPath(sectionId: string, path: string): ElementBounds | null {
  const id = createElementId(sectionId, path);
  return getElementBounds(id);
}

/**
 * Get all registered elements
 */
export function getAllElements(): ElementRegistration[] {
  return Array.from(elementRegistry.values());
}

/**
 * Get all elements for a specific section
 */
export function getElementsBySection(sectionId: string): ElementRegistration[] {
  return Array.from(elementRegistry.values()).filter(
    reg => reg.sectionId === sectionId
  );
}

/**
 * Get the count of registered elements
 */
export function getElementCount(): number {
  return elementRegistry.size;
}

/**
 * Clear all elements (useful for testing or page navigation)
 */
export function clearRegistry(): void {
  elementRegistry.clear();
  notifySubscribers();
}

/**
 * Subscribe to registry changes
 * Returns unsubscribe function
 */
export function subscribeToRegistry(callback: RegistrySubscriber): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

// ============================================================================
// React Hooks
// ============================================================================

/**
 * Hook for components to register themselves
 */
export function useElementRegistration(
  sectionId: string | undefined,
  path: string,
  type: ElementRegistration['type'],
  options: {
    resizable?: boolean;
    draggable?: boolean;
  } = {}
) {
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!sectionId) return;
    
    const id = createElementId(sectionId, path);
    const registration: ElementRegistration = {
      id,
      sectionId,
      path,
      type,
      ref: ref as React.RefObject<HTMLElement>,
      resizable: options.resizable ?? false,
      draggable: options.draggable ?? false,
    };
    
    return registerElement(registration);
  }, [sectionId, path, type, options.resizable, options.draggable]);
  
  return ref;
}

/**
 * Hook to get element bounds (with subscription for updates)
 */
export function useElementBounds(sectionId: string | null, path: string | null) {
  const getBounds = useCallback(() => {
    if (!sectionId || !path) return null;
    return getElementBoundsByPath(sectionId, path);
  }, [sectionId, path]);
  
  return getBounds;
}

/**
 * Hook to access registry functions
 */
export function useElementRegistry() {
  return {
    register: registerElement,
    unregister: unregisterElement,
    getElement,
    getElementById,
    getBounds: getElementBounds,
    getBoundsByPath: getElementBoundsByPath,
    getAllElements,
    getElementsBySection,
    getCount: getElementCount,
  };
}
