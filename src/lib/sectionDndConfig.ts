/**
 * Section DnD Configuration Registry
 * 
 * Centralized configuration for drag-and-drop behavior across all section types.
 * This eliminates the need for manual DnD setup in each section component.
 * 
 * Each section type defines which arrays are sortable and how they should behave.
 */

export type DndStrategy = 'grid' | 'vertical' | 'horizontal';
export type HandlePosition = 'left' | 'top-left' | 'top-right';

export interface ArrayDndConfig {
  /** Path to the array in section props (e.g., "features", "items", "plans") */
  path: string;
  /** Layout strategy for sorting */
  strategy: DndStrategy;
  /** Position of the drag handle */
  handlePosition: HandlePosition;
}

export interface SectionDndConfig {
  /** Arrays within this section that should be sortable */
  arrays: ArrayDndConfig[];
}

/**
 * Registry of DnD configurations for all section types.
 * 
 * To add DnD support for a new section:
 * 1. Add an entry here with the section type as key
 * 2. Define which arrays should be sortable
 * 3. The section will automatically get DnD support
 */
export const sectionDndRegistry: Record<string, SectionDndConfig> = {
  // Grid-based sections
  'bento-grid': {
    arrays: [{ path: 'items', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'pricing': {
    arrays: [{ path: 'plans', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'features': {
    arrays: [{ path: 'features', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'icon-features': {
    arrays: [{ path: 'features', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'testimonials': {
    arrays: [{ path: 'testimonials', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'why-choose': {
    arrays: [{ path: 'reasons', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'trusted-by': {
    arrays: [{ path: 'logos', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'awards': {
    arrays: [{ path: 'awards', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'blog-grid': {
    arrays: [{ path: 'articles', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'hosting-services': {
    arrays: [{ path: 'services', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'data-center': {
    arrays: [{ path: 'locations', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'server-specs': {
    arrays: [{ path: 'specs', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'plans-comparison': {
    arrays: [{ path: 'plans', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'os-selector': {
    arrays: [{ path: 'items', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'contact': {
    arrays: [{ path: 'channels', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'logo-carousel': {
    arrays: [{ path: 'logos', strategy: 'horizontal', handlePosition: 'top-left' }]
  },

  // Horizontal sections
  'steps': {
    arrays: [{ path: 'steps', strategy: 'horizontal', handlePosition: 'top-left' }]
  },
  'stats-counter': {
    arrays: [{ path: 'stats', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'hero': {
    arrays: [{ path: 'services', strategy: 'horizontal', handlePosition: 'top-left' }]
  },
  'cta': {
    arrays: [{ path: 'benefits', strategy: 'horizontal', handlePosition: 'top-left' }]
  },
  'need-help': {
    arrays: [{ path: 'options', strategy: 'grid', handlePosition: 'top-left' }]
  },

  // V2 Affiliate Partner Program
  'v2-affiliate-how-it-works': {
    arrays: [{ path: 'steps', strategy: 'grid', handlePosition: 'top-left' }]
  },

  // Vertical sections
  'faq': {
    arrays: [{ path: 'faqs', strategy: 'vertical', handlePosition: 'left' }]
  },
  'alternating-features': {
    arrays: [{ path: 'blocks', strategy: 'vertical', handlePosition: 'left' }]
  },

  // Additional sections (migrated from legacy DnD)
  'ai-builder': {
    arrays: [{ path: 'features', strategy: 'horizontal', handlePosition: 'top-left' }]
  },
  'host-once': {
    arrays: [{ path: 'features', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'migration': {
    arrays: [
      { path: 'steps', strategy: 'vertical', handlePosition: 'left' },
      { path: 'benefits', strategy: 'horizontal', handlePosition: 'top-left' }
    ]
  },
  'domain': {
    arrays: [
      { path: 'extensions', strategy: 'horizontal', handlePosition: 'top-left' },
      { path: 'features', strategy: 'horizontal', handlePosition: 'top-left' }
    ]
  },
  'ai-assistant': {
    arrays: [{ path: 'capabilities', strategy: 'horizontal', handlePosition: 'top-left' }]
  },
  'careers': {
    arrays: [{ path: 'jobs', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'partners': {
    arrays: [{ path: 'partners', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'team-members': {
    arrays: [{ path: 'members', strategy: 'grid', handlePosition: 'top-left' }]
  },
  // V2 Design sections
  'v2-business-suite': {
    arrays: [{ path: 'cards', strategy: 'horizontal', handlePosition: 'top-left' }]
  },
  'v2-hosting-options': {
    arrays: [{ path: 'hostingOptions', strategy: 'grid', handlePosition: 'top-left' }]
  },
  // v2-benefits intentionally omitted — bento layout is positional, not sortable
  // V2 Career Page sections
  'v2-career-benefits': {
    arrays: [{ path: 'benefits', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'v2-career-values': {
    arrays: [{ path: 'values', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'v2-career-faq': {
    arrays: [{ path: 'faqs', strategy: 'vertical', handlePosition: 'left' }]
  },
  'v2-career-openings': {
    arrays: [{ path: 'categories', strategy: 'vertical', handlePosition: 'left' }]
  },
  // V2 Career Page 2 sections
  'v2-career-values2': {
    arrays: [{ path: 'values', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'v2-career-benefits2': {
    arrays: [{ path: 'benefits', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'v2-career-faq2': {
    arrays: [{ path: 'faqs', strategy: 'vertical', handlePosition: 'left' }]
  },
  'v2-hostings-features': {
    arrays: [{ path: 'hostings', strategy: 'grid', handlePosition: 'top-left' }]
  },
  // V2 Affiliate Partner Program sections
  'v2-affiliate-hero': {
    arrays: [{ path: 'benefits', strategy: 'horizontal', handlePosition: 'top-left' }]
  },
  'v2-affiliate-who-is-it-for': {
    arrays: [{ path: 'items', strategy: 'grid', handlePosition: 'top-left' }]
  },
  // V2 Job Detail sections
  'v2-job-faq': {
    arrays: [{ path: 'faqs', strategy: 'vertical', handlePosition: 'top-left' }]
  },
  // V2 Job Post sections
  'v2-job-post-navbar': {
    arrays: [],
  },
  'v2-job-post-hero': {
    arrays: [{ path: 'jobDetails', strategy: 'horizontal', handlePosition: 'top-left' }]
  },
  'v2-job-post-description': {
    arrays: [{ path: 'sections', strategy: 'vertical', handlePosition: 'left' }]
  },
  'v2-job-post-gallery': {
    arrays: [{ path: 'images', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'v2-job-post-faq': {
    arrays: [{ path: 'faqs', strategy: 'vertical', handlePosition: 'left' }]
  },
  // V2 Affiliate Partner Program sections
  'v2-affiliate-about': {
    arrays: [{ path: 'cards', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'v2-affiliate-payment-methods': {
    arrays: [{ path: 'methods', strategy: 'grid', handlePosition: 'top-left' }]
  },
  'v2-affiliate-faq': {
    arrays: [{ path: 'faqs', strategy: 'vertical', handlePosition: 'left' }]
  },
  'v2-affiliate-reviews': {
    arrays: [{ path: 'reviews', strategy: 'grid', handlePosition: 'top-left' }]
  },
  // Legal section
  'legal': {
    arrays: [{ path: 'items', strategy: 'vertical', handlePosition: 'left' }]
  },
};

/**
 * Get DnD configuration for a section type.
 * 
 * Priority:
 * 1. Check the hardcoded registry (for existing sections)
 * 2. Check section definition's dndArrays (for new sections)
 * 3. Return undefined if no config found
 */
export function getSectionDndConfig(sectionType: string): SectionDndConfig | undefined {
  // First check hardcoded registry
  const registryConfig = sectionDndRegistry[sectionType];
  if (registryConfig) {
    return registryConfig;
  }

  // Future: Could auto-infer from section definition's dndArrays field
  // For now, sections must be registered in sectionDndRegistry
  return undefined;
}

/**
 * Get array DnD configuration for a specific array path within a section
 */
export function getArrayDndConfig(sectionType: string, arrayPath: string): ArrayDndConfig | undefined {
  const sectionConfig = getSectionDndConfig(sectionType);
  return sectionConfig?.arrays.find(a => a.path === arrayPath);
}

/**
 * Check if a section type has DnD support
 */
export function hasDndSupport(sectionType: string): boolean {
  return getSectionDndConfig(sectionType) !== undefined;
}
