/**
 * Elementor-Style Grid System Types
 * 
 * Enforces a strict 3-level layout hierarchy:
 * Section → Column → Widget
 * 
 * This is the SINGLE, MANDATORY layout model for the entire editor.
 */

// ============================================================================
// Drag Types (Explicit Discriminators)
// ============================================================================

/** Explicit drag type discriminator - no guessing */
export const DRAG_TYPES = {
  SECTION: 'section',
  COLUMN: 'column',
  WIDGET: 'widget',
  BLOCK: 'block', // For dragging from block library to canvas
} as const;

export type DragType = typeof DRAG_TYPES[keyof typeof DRAG_TYPES];

// ============================================================================
// Responsive Configuration
// ============================================================================

/** Responsive width configuration for columns */
export interface ResponsiveWidth {
  /** Desktop width (e.g., "1/3", "33.33%", "auto") */
  desktop: string;
  /** Tablet width override */
  tablet?: string;
  /** Mobile width override */
  mobile?: string;
}

/** Responsive gap configuration */
export interface ResponsiveGap {
  desktop: string;
  tablet?: string;
  mobile?: string;
}

// ============================================================================
// Widget (Atomic Content Unit)
// ============================================================================

/**
 * Widget: The atomic content unit inside a column.
 * Widgets are layout-agnostic and NEVER control layout.
 * 
 * A widget maps to a single item from section array props
 * (e.g., one feature, one testimonial, one pricing plan).
 */
export interface GridWidget {
  /** Unique identifier within the section */
  id: string;

  /** Widget type (maps to widget registry) */
  type: GridWidgetType;

  /** Widget content/configuration props */
  props: Record<string, any>;

  /** Source prop path for back-mapping to legacy format */
  sourcePath?: string;
}

/**
 * Known widget types that map to existing section content.
 * These are derived from the array items in section props.
 */
export type GridWidgetType =
  // Hero
  | 'service-item'
  // Pricing
  | 'plan-card'
  // Features
  | 'feature-card'
  // FAQ
  | 'faq-item'
  // Testimonials
  | 'testimonial-card'
  // CTA
  | 'benefit-item'
  // Trusted By
  | 'platform-badge'
  | 'company-logo'
  // Hosting Services
  | 'service-card'
  // Why Choose
  | 'reason-item'
  // Need Help
  | 'help-option-card'
  // Stats Counter
  | 'stat-counter'
  // Steps
  | 'step-item'
  // Icon Features
  | 'icon-feature'
  // Alternating Features
  | 'alternating-block'
  // OS Selector
  | 'os-option'
  // Data Center
  | 'location-item'
  // Bento Grid
  | 'bento-card'
  // Awards
  | 'award-badge'
  // Plans Comparison
  | 'comparison-column'
  | 'comparison-row'
  // Blog Grid
  | 'blog-card'
  // Contact
  | 'contact-channel'
  // Logo Carousel
  | 'logo-item'
  // Team Members
  | 'team-member-card'
  // Careers
  | 'job-card'
  // Partners
  | 'partner-card'
  // V2 Design
  | 'v2-service-card'
  | 'v2-hosting-option'
  | 'v2-benefit-card'
  // V2 Career Page
  | 'v2-career-cta-widget'
  | 'v2-career-talent-pool-widget'
  | 'v2-career-benefit-item'
  | 'v2-career-value-item'
  | 'v2-career-gallery-image'
  | 'v2-career-faq-item'
  | 'v2-career-hero-widget'
  | 'v2-career-job-category'
  // V2 Career Page 2
  | 'v2-career-hero2-widget'
  | 'v2-career-gallery2-image'
  | 'v2-career-talent-pool2-widget'
  | 'v2-career-value2-item'
  | 'v2-career-benefit2-item'
  | 'v2-career-faq2-item'
  | 'v2-career-cta3-widget'
  // V2 Design additional
  | 'v2-site-benefits-widget'
  | 'v2-hostings-feature-item'
  // V2 Job Detail
  | 'v2-job-title-hero-widget'
  | 'v2-job-description-widget'
  | 'v2-job-gallery-widget'
  | 'v2-job-faq-item'
  | 'v2-job-cta-widget'
  | 'v2-site-footer-widget'
  // V2 Job Post sections
  | 'v2-job-post-navbar-widget'
  | 'v2-job-post-hero-detail'
  | 'v2-job-post-description-item'
  | 'v2-job-post-gallery-image'
  | 'v2-job-post-faq-item'
  // V2 Affiliate Partner Program
  | 'v2-affiliate-hero-widget'
  | 'v2-affiliate-benefit-item'
  | 'v2-affiliate-how-it-works-step-item'
  | 'v2-affiliate-about-card'
  | 'v2-affiliate-migration-widget'
  | 'v2-affiliate-who-is-it-for-widget'
  | 'v2-affiliate-who-is-it-for-item'
  | 'v2-affiliate-payment-methods-widget'
  | 'v2-affiliate-payment-method-item'
  | 'v2-affiliate-faq-widget'
  | 'v2-affiliate-faq-item'
  | 'v2-affiliate-review-item'
  // Legal section
  | 'legal-item'
  // Generic (for unknown types)
  | 'generic';

// ============================================================================
// Column (Layout Container for Widgets)
// ============================================================================

/**
 * Column: Layout container for widgets.
 * Columns own width and alignment. Widgets adapt automatically.
 */
export interface GridColumn {
  /** Unique identifier within the section */
  id: string;

  /** Column width (responsive) */
  width: ResponsiveWidth;

  /** Vertical alignment of widgets within the column */
  alignment?: 'start' | 'center' | 'end' | 'stretch';

  /** Gap between widgets in this column */
  gap?: string;

  /** Widgets contained in this column */
  widgets: GridWidget[];
}

// ============================================================================
// Section Grid (Layout Definition)
// ============================================================================

/**
 * SectionGrid: The layout definition for a section.
 * Every section MUST have or derive a grid.
 */
export interface SectionGrid {
  /** Columns in this section */
  columns: GridColumn[];

  /** Gap between columns */
  gap?: string;

  /** Horizontal alignment of the grid */
  alignment?: 'start' | 'center' | 'end' | 'stretch';

  /** Responsive column count overrides */
  responsive?: {
    tablet?: { columns: number };
    mobile?: { columns: number };
  };
}

// ============================================================================
// Normalized Section (Runtime Representation)
// ============================================================================

/**
 * A section that has been normalized to the grid model.
 * This is the runtime representation used for rendering.
 */
export interface NormalizedSection {
  /** Original section ID */
  id: string;

  /** Section type */
  type: string;

  /** Grid layout definition */
  grid: SectionGrid;

  /** Non-array props (header, badge, title, etc.) */
  headerProps: Record<string, any>;

  /** Original props for fallback */
  originalProps: Record<string, any>;

  /** Whether this section was normalized at runtime */
  isNormalized: boolean;
}

// ============================================================================
// Normalization Rules
// ============================================================================

/**
 * Rule for normalizing a section type to grid format.
 */
export interface NormalizationRule {
  /** Section type this rule applies to */
  sectionType: string;

  /** Array property paths to extract as widgets */
  arrayPaths: ArrayToWidgetMapping[];

  /** Default column layout (e.g., 3 = 3-column grid) */
  defaultColumns: number;

  /** Props to keep at section level (not in widgets) */
  headerProps: string[];

  /** Whether section wraps data in a 'data' prop */
  usesDataWrapper: boolean;
}

/**
 * Mapping from array property to widget type.
 */
export interface ArrayToWidgetMapping {
  /** Path to the array in section props (e.g., "features", "plans") */
  arrayPath: string;

  /** Widget type to create from each array item */
  widgetType: GridWidgetType;

  /** Optional: specific column distribution (null = auto) */
  columnDistribution?: 'single' | 'auto' | number;
}

// ============================================================================
// Grid DnD Types
// ============================================================================

export type GridDragType = 'section' | 'column' | 'widget';

export interface GridDragData {
  /** Discriminator type - MUST be checked on every drag operation */
  type: DragType;
  /** Section being dragged or containing the dragged element */
  sectionId: string;
  /** Column ID (for column and widget drags) */
  columnId?: string;
  /** Widget ID (for widget drags) */
  widgetId?: string;
  /** Index within parent container */
  index: number;
}

export interface GridDropTarget {
  sectionId: string;
  columnId?: string;
  index: number;
  position: 'before' | 'after';
}

// ============================================================================
// Grid Action Types (for store)
// ============================================================================

export type GridAction =
  // Widget operations
  | { type: 'REORDER_WIDGET'; sectionId: string; columnId: string; sourceIndex: number; destIndex: number }
  | { type: 'MOVE_WIDGET'; sectionId: string; sourceColumnId: string; sourceIndex: number; destColumnId: string; destIndex: number }
  | { type: 'ADD_WIDGET'; sectionId: string; columnId: string; widget: GridWidget; index?: number }
  | { type: 'REMOVE_WIDGET'; sectionId: string; columnId: string; widgetIndex: number }

  // Column operations
  | { type: 'ADD_COLUMN'; sectionId: string; column: GridColumn; index?: number }
  | { type: 'REMOVE_COLUMN'; sectionId: string; columnId: string }
  | { type: 'REORDER_COLUMN'; sectionId: string; sourceIndex: number; destIndex: number }
  | { type: 'UPDATE_COLUMN_WIDTH'; sectionId: string; columnId: string; width: ResponsiveWidth };

// ============================================================================
// Utility Types
// ============================================================================

/** Type guard to check if a section has explicit grid */
export function hasExplicitGrid(section: { grid?: SectionGrid }): section is { grid: SectionGrid } {
  return section.grid !== undefined && section.grid.columns.length > 0;
}

/** Generate unique widget ID */
export function generateWidgetId(): string {
  return `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Generate unique column ID */
export function generateColumnId(): string {
  return `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** 
 * Validate drag type compatibility - prevents cross-type drops 
 * Returns true if the drop is allowed
 */
export function isValidDrop(activeType: DragType, overType: DragType | undefined): boolean {
  if (!overType) return false;

  // Same type drops are always valid
  if (activeType === overType) return true;

  // Widget can drop on column (insertion at position 0)
  if (activeType === DRAG_TYPES.WIDGET && overType === DRAG_TYPES.COLUMN) return true;

  // All other cross-type drops are invalid
  return false;
}
