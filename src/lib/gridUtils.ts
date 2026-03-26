/**
 * Grid Utilities
 * 
 * Shared utilities for grid column classes used across section components.
 * This ensures consistent layout behavior across the application.
 */

import type { ColumnCount, SpacingPreset } from '@/types/sectionSettings';

/**
 * Get Tailwind grid column classes for responsive layouts
 * @param columns - Number of columns (1-4)
 * @param breakpoint - Breakpoint to apply columns ('md' or 'lg')
 * @returns Tailwind grid classes string
 */
export function getGridColsClass(columns: ColumnCount | number | undefined, breakpoint: 'md' | 'lg' = 'lg'): string {
  const cols = columns ?? 3; // Default to 3 columns
  
  if (breakpoint === 'md') {
    switch (cols) {
      case 1: return 'md:grid-cols-1';
      case 2: return 'md:grid-cols-2';
      case 3: return 'md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'md:grid-cols-2 lg:grid-cols-4';
      default: return 'md:grid-cols-3';
    }
  }
  
  // lg breakpoint (default)
  switch (cols) {
    case 1: return 'lg:grid-cols-1';
    case 2: return 'lg:grid-cols-2';
    case 3: return 'lg:grid-cols-3';
    case 4: return 'lg:grid-cols-4';
    default: return 'lg:grid-cols-3';
  }
}

/**
 * Get Tailwind gap classes from spacing preset
 * @param gap - Spacing preset
 * @returns Tailwind gap class string
 */
export function getGapClass(gap: SpacingPreset | undefined): string {
  switch (gap) {
    case 'none': return 'gap-0';
    case 'small': return 'gap-4';
    case 'default': return 'gap-6';
    case 'large': return 'gap-8';
    case 'xlarge': return 'gap-12';
    default: return 'gap-6'; // Default
  }
}

/**
 * Get alignment classes from content alignment
 * @param alignment - Content alignment
 * @returns Tailwind alignment classes (text + items)
 */
export function getAlignmentClass(alignment: 'left' | 'center' | 'right' | undefined): string {
  switch (alignment) {
    case 'left': return 'text-left items-start';
    case 'center': return 'text-center items-center';
    case 'right': return 'text-right items-end';
    default: return ''; // No default - let component decide
  }
}

/**
 * Get grid item alignment classes for card layouts
 * @param alignment - Content alignment
 * @returns Tailwind justify-items class for grid
 */
export function getGridAlignmentClass(alignment: 'left' | 'center' | 'right' | undefined): string {
  switch (alignment) {
    case 'left': return 'justify-items-start';
    case 'center': return 'justify-items-center';
    case 'right': return 'justify-items-end';
    default: return ''; // No default
  }
}
