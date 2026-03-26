/**
 * Section Registry
 * 
 * Central registry for all section definitions with helper functions.
 */

import React from 'react';
import { SectionType } from '@/types/pageEditor';
import { SectionDefinition, SectionInstanceData } from './types';

// ============================================================================
// Registry Storage
// ============================================================================

const sectionDefinitions: Map<SectionType, SectionDefinition> = new Map();

// ============================================================================
// Registration
// ============================================================================

/**
 * Register a section definition in the global registry.
 */
export function registerSection(def: SectionDefinition): void {
  sectionDefinitions.set(def.type, def);
}

/**
 * Create a settings wrapper component for a settings content component.
 * This is a Higher-Order Component (HOC) pattern.
 */
export function createSettingsWrapper(SettingsComponent: React.ComponentType<any>) {
  return ({ data, onChange, sectionId }: { data: any; onChange: (data: any) => void; sectionId?: string }) => (
    React.createElement(SettingsComponent, { data, onChange, sectionId })
  );
}

// ============================================================================
// Getters
// ============================================================================

/**
 * Get a section definition by type.
 */
export function getSectionDefinition(type: SectionType): SectionDefinition | undefined {
  return sectionDefinitions.get(type);
}

/**
 * Get all registered section definitions.
 */
export function getAllSectionDefinitions(): SectionDefinition[] {
  return Array.from(sectionDefinitions.values());
}

/**
 * Get sections filtered by category.
 */
export function getSectionsByCategory(category: SectionDefinition['category']): SectionDefinition[] {
  return getAllSectionDefinitions().filter(def => def.category === category);
}

// ============================================================================
// Instance Factory
// ============================================================================

/**
 * Create a new section instance with default props.
 */
export function createSectionInstance(
  type: SectionType,
  overrideProps?: Record<string, any>
): SectionInstanceData | null {
  const definition = getSectionDefinition(type);
  if (!definition) return null;

  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    props: { ...definition.defaultProps, ...overrideProps },
    order: 0,
    visible: true,
    translationKeys: undefined,
  };
}

// ============================================================================
// Export the registry map (for advanced use cases)
// ============================================================================

export { sectionDefinitions };
