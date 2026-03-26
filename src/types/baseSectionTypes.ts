/**
 * Base Section Types
 * 
 * Canonical type definitions for all section components.
 * This is the SINGLE SOURCE OF TRUTH for section architecture.
 * 
 * IMPORTANT: These types are ADDITIVE. Existing components continue
 * to work unchanged. Components can gradually adopt these interfaces.
 */

import type { SectionStyleProps } from './elementSettings';

// ============================================================================
// Layout Props - Standard layout controls passed to all sections
// ============================================================================

export type ContentWidth = 'narrow' | 'default' | 'wide' | 'full';
export type ContentAlignment = 'left' | 'center' | 'right';
export type SpacingPreset = 'none' | 'small' | 'default' | 'large' | 'xlarge';
export type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6;

export interface BaseLayoutProps {
  /** Container width preset */
  contentWidth?: ContentWidth;
  /** Number of columns for grid layouts */
  columns?: ColumnCount;
  /** Gap between grid items */
  gap?: SpacingPreset;
  /** Text/content alignment */
  contentAlignment?: ContentAlignment;
}

// ============================================================================
// Base Section Props - What EVERY section component should receive
// ============================================================================

export interface BaseSectionProps {
  /** Unique section ID for targeting */
  sectionId?: string;
  /** Whether the section is being edited */
  isEditing?: boolean;
  /** Style overrides from section settings (background, padding, etc.) */
  styleOverrides?: SectionStyleProps;
  /** Layout props for grid/alignment */
  layoutProps?: BaseLayoutProps;
}

// ============================================================================
// Base Section Data - Standard section data structure
// ============================================================================

export interface BaseSectionData {
  /** Badge/label text */
  badge?: string;
  /** Main title */
  title?: string;
  /** Subtitle/description */
  subtitle?: string;
}

// ============================================================================
// Array Section Data - For sections with repeatable items
// ============================================================================

export interface BaseArrayItem {
  /** Optional position for DnD tracking */
  position?: {
    sectionId?: string;
    path?: string;
    index?: number;
  };
}

// ============================================================================
// Base Settings Props - What every settings component receives
// ============================================================================

export interface BaseSettingsProps<TData = Record<string, unknown>> {
  /** Current section data */
  data: TData;
  /** Callback when data changes */
  onChange: (data: TData) => void;
  /** Section ID for translation keys */
  sectionId?: string;
}

// ============================================================================
// Settings Handler Helpers - Consistent data update pattern
// ============================================================================

export interface SettingsHandlers<TData> {
  /** Update a single field */
  updateField: <K extends keyof TData>(field: K, value: TData[K]) => void;
  /** Update an array field */
  updateArray: <K extends keyof TData>(field: K, value: TData[K]) => void;
  /** Reference to current data (for callbacks) */
  dataRef: React.MutableRefObject<TData>;
}

// ============================================================================
// Type Utilities
// ============================================================================

/**
 * Extend base props with section-specific data
 * Usage: type HeroSectionProps = SectionProps<HeroSectionData>
 */
export type SectionProps<TData extends BaseSectionData = BaseSectionData> = 
  BaseSectionProps & {
    data?: TData;
  } & Partial<TData>; // Allow spreading data directly

/**
 * Create settings props for a section
 * Usage: type HeroSettingsProps = SettingsProps<HeroSectionData>
 */
export type SettingsProps<TData> = BaseSettingsProps<TData>;
