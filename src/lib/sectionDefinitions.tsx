/**
 * Section Definitions Registry
 * 
 * This file now re-exports from the modular section definitions.
 * All section registrations are in src/lib/sections/definitions/*.ts
 */

// Re-export everything from the new modular structure
export {
  registerSection,
  createSettingsWrapper,
  getSectionDefinition,
  getAllSectionDefinitions,
  getSectionsByCategory,
  createSectionInstance,
  sectionDefinitions,
} from './sections';

export type { SectionDefinition, SectionInstanceData, DndArrayConfig } from './sections';

// Default export for backwards compatibility
import { sectionDefinitions } from './sections';
export default sectionDefinitions;
