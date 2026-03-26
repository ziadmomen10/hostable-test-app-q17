/**
 * Section Settings Types
 * 
 * Type definitions and CSS class mappings for section layout and styling.
 * For base section interfaces, see src/types/baseSectionTypes.ts
 */

// ============================================================================
// Type Aliases - Used by section components and settings
// ============================================================================

export type ContentWidth = 'narrow' | 'default' | 'wide' | 'full';
export type ContentAlignment = 'left' | 'center' | 'right';
export type SpacingPreset = 'none' | 'small' | 'default' | 'large' | 'xlarge';
export type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6;

// ============================================================================
// CSS Class Mappings - Convert preset values to Tailwind classes
// ============================================================================

export const contentWidthClasses: Record<ContentWidth, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1400px]',
  full: 'max-w-full',
};

export const contentAlignmentClasses: Record<ContentAlignment, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};

export const gapClasses: Record<SpacingPreset, string> = {
  none: 'gap-0',
  small: 'gap-4',
  default: 'gap-6',
  large: 'gap-8',
  xlarge: 'gap-12',
};

export const columnGridClasses: Record<ColumnCount, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
};
