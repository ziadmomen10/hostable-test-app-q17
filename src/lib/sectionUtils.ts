/**
 * Section Utilities
 * 
 * Helper functions for working with sections, especially for
 * handling the `usesDataWrapper` pattern where some sections
 * store their props under `props.data.*` instead of `props.*`.
 */

import { SectionInstance } from '@/types/reactEditor';
import { getSectionDefinition } from './sectionDefinitions';
import { 
  getNestedValue as getNestedValueHelper, 
  getNestedString as getNestedStringHelper 
} from '@/lib/utils/objectHelpers';

/**
 * Gets the actual props container for a section.
 * 
 * IMPORTANT: Props are ALWAYS stored flat, regardless of `usesDataWrapper`.
 * The `usesDataWrapper` flag only affects how props are passed to components
 * at render time (wrapped in a `data` prop), NOT how they are stored.
 * 
 * Translation engine, settings panel, and all data operations should always
 * use this function which returns the flat props directly.
 */
export function getSectionPropsContainer(section: SectionInstance): Record<string, any> {
  // Props are ALWAYS stored flat: section.props = { title, badge, items: [...] }
  // The usesDataWrapper flag is a presentation-layer concern only
  return section.props || {};
}

/**
 * Gets a nested value from an object using a dot-separated path.
 * Handles array indices (e.g., "features.0.title").
 * @deprecated Import from '@/lib/utils/objectHelpers' instead
 */
export function getNestedValue(obj: Record<string, any>, path: string): any {
  return getNestedValueHelper(obj, path);
}

/**
 * Gets a nested string value from an object using a dot-separated path.
 * Returns null if the value is not a string.
 * @deprecated Import from '@/lib/utils/objectHelpers' instead
 */
export function getNestedString(obj: Record<string, any>, path: string): string | null {
  return getNestedStringHelper(obj, path);
}

/**
 * Gets a translatable value from a section, handling both
 * regular sections and sections with `usesDataWrapper: true`.
 */
export function getSectionPropValue(section: SectionInstance, propPath: string): any {
  const propsContainer = getSectionPropsContainer(section);
  return getNestedValue(propsContainer, propPath);
}

/**
 * Gets a translatable string value from a section, handling both
 * regular sections and sections with `usesDataWrapper: true`.
 */
export function getSectionPropString(section: SectionInstance, propPath: string): string | null {
  const propsContainer = getSectionPropsContainer(section);
  return getNestedString(propsContainer, propPath);
}
