/**
 * Grid Normalization Engine
 * 
 * Converts existing section data into Elementor-style grid format at RUNTIME.
 * This ensures backward compatibility - saved data is NOT modified.
 * 
 * The normalization process:
 * 1. Detect section type
 * 2. Extract array properties (features, plans, etc.)
 * 3. Map each array item to a widget in a column
 * 4. Preserve header props at section level
 * 5. Generate grid definition
 */

import { SectionInstance } from '@/types/reactEditor';
import { SectionType } from '@/types/pageEditor';
import {
  SectionGrid,
  GridColumn,
  GridWidget,
  GridWidgetType,
  NormalizedSection,
  NormalizationRule,
  ArrayToWidgetMapping,
  generateWidgetId,
  generateColumnId,
  hasExplicitGrid,
} from '@/types/grid';

// ============================================================================
// Normalization Rules Registry
// ============================================================================

/**
 * Rules for normalizing each section type.
 * This maps section types to their array properties and widget types.
 */
export const normalizationRules: Record<SectionType, NormalizationRule> = {
  // Hero section
  'hero': {
    sectionType: 'hero',
    arrayPaths: [
      { arrayPath: 'services', widgetType: 'service-item', columnDistribution: 'auto' }
    ],
    defaultColumns: 7, // Hero services are typically horizontal
    headerProps: ['badge', 'title', 'subtitle', 'primaryButtonText', 'primaryButtonUrl', 'secondaryButtonText', 'secondaryButtonUrl', 'backgroundImage', 'showBadge'],
    usesDataWrapper: false,
  },

  // Pricing section
  'pricing': {
    sectionType: 'pricing',
    arrayPaths: [
      { arrayPath: 'plans', widgetType: 'plan-card', columnDistribution: 'auto' }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle', 'billingToggleEnabled', 'defaultBillingPeriod'],
    usesDataWrapper: false,
  },

  // Features section
  'features': {
    sectionType: 'features',
    arrayPaths: [
      { arrayPath: 'features', widgetType: 'feature-card', columnDistribution: 2 }
    ],
    defaultColumns: 2,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: false,
  },

  // FAQ section
  'faq': {
    sectionType: 'faq',
    arrayPaths: [
      { arrayPath: 'faqs', widgetType: 'faq-item', columnDistribution: 'single' }
    ],
    defaultColumns: 1,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: false,
  },

  // Testimonials section
  'testimonials': {
    sectionType: 'testimonials',
    arrayPaths: [
      { arrayPath: 'testimonials', widgetType: 'testimonial-card', columnDistribution: 3 }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: false,
  },

  // CTA section
  'cta': {
    sectionType: 'cta',
    arrayPaths: [
      { arrayPath: 'benefits', widgetType: 'benefit-item', columnDistribution: 'auto' }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle', 'primaryButtonText', 'primaryButtonUrl', 'secondaryButtonText', 'secondaryButtonUrl'],
    usesDataWrapper: false,
  },

  // Trusted By section
  'trusted-by': {
    sectionType: 'trusted-by',
    arrayPaths: [
      { arrayPath: 'platforms', widgetType: 'platform-badge', columnDistribution: 3 },
      { arrayPath: 'companies', widgetType: 'company-logo', columnDistribution: 'auto' }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: false,
  },

  // Hosting Services section
  'hosting-services': {
    sectionType: 'hosting-services',
    arrayPaths: [
      { arrayPath: 'services', widgetType: 'service-card', columnDistribution: 3 }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: false,
  },

  // Why Choose section
  'why-choose': {
    sectionType: 'why-choose',
    arrayPaths: [
      { arrayPath: 'reasons', widgetType: 'reason-item', columnDistribution: 3 }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: false,
  },

  // Need Help section
  'need-help': {
    sectionType: 'need-help',
    arrayPaths: [
      { arrayPath: 'options', widgetType: 'help-option-card', columnDistribution: 3 }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: false,
  },

  // Stats Counter section
  'stats-counter': {
    sectionType: 'stats-counter',
    arrayPaths: [
      { arrayPath: 'stats', widgetType: 'stat-counter', columnDistribution: 4 }
    ],
    defaultColumns: 4,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  // Steps section
  'steps': {
    sectionType: 'steps',
    arrayPaths: [
      { arrayPath: 'steps', widgetType: 'step-item', columnDistribution: 'auto' }
    ],
    defaultColumns: 4,
    headerProps: ['badge', 'title', 'subtitle', 'layout'],
    usesDataWrapper: true,
  },

  // Icon Features section
  'icon-features': {
    sectionType: 'icon-features',
    arrayPaths: [
      { arrayPath: 'features', widgetType: 'icon-feature', columnDistribution: 3 }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  // Alternating Features section
  'alternating-features': {
    sectionType: 'alternating-features',
    arrayPaths: [
      { arrayPath: 'blocks', widgetType: 'alternating-block', columnDistribution: 'single' }
    ],
    defaultColumns: 1, // Alternating blocks are full-width, stacked
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  // OS Selector section
  'os-selector': {
    sectionType: 'os-selector',
    arrayPaths: [
      { arrayPath: 'items', widgetType: 'os-option', columnDistribution: 4 }
    ],
    defaultColumns: 4,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  // Data Center section
  'data-center': {
    sectionType: 'data-center',
    arrayPaths: [
      { arrayPath: 'locations', widgetType: 'location-item', columnDistribution: 3 }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle', 'mapImage'],
    usesDataWrapper: true,
  },

  // Bento Grid section
  'bento-grid': {
    sectionType: 'bento-grid',
    arrayPaths: [
      { arrayPath: 'items', widgetType: 'bento-card', columnDistribution: 'auto' }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  // Awards section
  'awards': {
    sectionType: 'awards',
    arrayPaths: [
      { arrayPath: 'awards', widgetType: 'award-badge', columnDistribution: 'auto' }
    ],
    defaultColumns: 6,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  // Plans Comparison section
  'plans-comparison': {
    sectionType: 'plans-comparison',
    arrayPaths: [
      { arrayPath: 'plans', widgetType: 'comparison-column', columnDistribution: 'auto' },
      { arrayPath: 'features', widgetType: 'comparison-row', columnDistribution: 'single' }
    ],
    defaultColumns: 4,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  // Blog Grid section
  'blog-grid': {
    sectionType: 'blog-grid',
    arrayPaths: [
      { arrayPath: 'articles', widgetType: 'blog-card', columnDistribution: 3 }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  // Contact section
  'contact': {
    sectionType: 'contact',
    arrayPaths: [
      { arrayPath: 'channels', widgetType: 'contact-channel', columnDistribution: 3 }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle', 'formTitle', 'formSubtitle'],
    usesDataWrapper: true,
  },

  // Logo Carousel section
  'logo-carousel': {
    sectionType: 'logo-carousel',
    arrayPaths: [
      { arrayPath: 'logos', widgetType: 'logo-item', columnDistribution: 'auto' }
    ],
    defaultColumns: 6,
    headerProps: ['badge', 'title', 'subtitle', 'speed', 'direction'],
    usesDataWrapper: false,
  },

  // Sections without array content (single-column layout)
  'video': {
    sectionType: 'video',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badge', 'title', 'subtitle', 'videoUrl', 'thumbnailUrl', 'autoplay'],
    usesDataWrapper: true,
  },

  'server-specs': {
    sectionType: 'server-specs',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  'announcement-banner': {
    sectionType: 'announcement-banner',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['message', 'linkText', 'linkUrl', 'backgroundColor', 'textColor'],
    usesDataWrapper: true,
  },

  // Team Members section
  'team-members': {
    sectionType: 'team-members',
    arrayPaths: [
      { arrayPath: 'members', widgetType: 'team-member-card', columnDistribution: 3 }
    ],
    defaultColumns: 3,
    headerProps: ['title', 'subtitle', 'showSocialLinks', 'columns'],
    usesDataWrapper: true,
  },

  // Careers section
  'careers': {
    sectionType: 'careers',
    arrayPaths: [
      { arrayPath: 'jobs', widgetType: 'job-card', columnDistribution: 3 }
    ],
    defaultColumns: 3,
    headerProps: ['badge', 'title', 'subtitle', 'columns'],
    usesDataWrapper: true,
  },

  // Partners section
  'partners': {
    sectionType: 'partners',
    arrayPaths: [
      { arrayPath: 'partners', widgetType: 'partner-card', columnDistribution: 4 }
    ],
    defaultColumns: 4,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  // V2 Design sections
  'v2-business-suite': {
    sectionType: 'v2-business-suite',
    arrayPaths: [{ arrayPath: 'cards', widgetType: 'v2-service-card', columnDistribution: 5 }],
    defaultColumns: 5,
    headerProps: ['badge', 'title'],
    usesDataWrapper: true,
  },
  'v2-hosting-options': {
    sectionType: 'v2-hosting-options',
    arrayPaths: [{ arrayPath: 'hostingOptions', widgetType: 'v2-hosting-option', columnDistribution: 4 }],
    defaultColumns: 4,
    headerProps: ['title', 'showPromoBanner'],
    usesDataWrapper: true,
  },
  'v2-benefits': {
    sectionType: 'v2-benefits',
    arrayPaths: [{ arrayPath: 'benefits', widgetType: 'v2-benefit-card', columnDistribution: 2 }],
    defaultColumns: 2,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  // V2 Career Page sections
  'v2-career-cta': {
    sectionType: 'v2-career-cta',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badgeIcon', 'badgeText', 'title', 'subtitle', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },
  'v2-career-talent-pool': {
    sectionType: 'v2-career-talent-pool',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badge', 'title', 'subtitle', 'buttonText', 'buttonLink', 'backgroundImage'],
    usesDataWrapper: true,
  },
  'v2-career-benefits': {
    sectionType: 'v2-career-benefits',
    arrayPaths: [{ arrayPath: 'benefits', widgetType: 'v2-career-benefit-item', columnDistribution: 2 }],
    defaultColumns: 2,
    headerProps: ['title', 'subtitle', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },
  'v2-career-values': {
    sectionType: 'v2-career-values',
    arrayPaths: [{ arrayPath: 'values', widgetType: 'v2-career-value-item', columnDistribution: 2 }],
    defaultColumns: 2,
    headerProps: ['badge', 'title', 'subtitle', 'image'],
    usesDataWrapper: true,
  },
  'v2-career-gallery': {
    sectionType: 'v2-career-gallery',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['images'],
    usesDataWrapper: true,
  },

  'v2-career-faq': {
    sectionType: 'v2-career-faq',
    arrayPaths: [{ arrayPath: 'faqs', widgetType: 'v2-career-faq-item', columnDistribution: 'single' }],
    defaultColumns: 1,
    headerProps: ['title', 'subtitle', 'contactText', 'contactLabel', 'contactImage'],
    usesDataWrapper: true,
  },
  'v2-career-hero': {
    sectionType: 'v2-career-hero',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badge', 'title', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },
  'v2-career-openings': {
    sectionType: 'v2-career-openings',
    arrayPaths: [{ arrayPath: 'categories', widgetType: 'v2-career-job-category', columnDistribution: 'single' }],
    defaultColumns: 1,
    headerProps: ['title', 'subtitle', 'searchPlaceholder'],
    usesDataWrapper: true,
  },

  // V2 Career Page 2 sections
  'v2-career-hero2': {
    sectionType: 'v2-career-hero2',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badge', 'title', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },
  'v2-career-gallery2': {
    sectionType: 'v2-career-gallery2',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['images'],
    usesDataWrapper: true,
  },
  'v2-career-talent-pool2': {
    sectionType: 'v2-career-talent-pool2',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badge', 'title', 'subtitle', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },
  'v2-career-values2': {
    sectionType: 'v2-career-values2',
    arrayPaths: [{ arrayPath: 'values', widgetType: 'v2-career-value2-item', columnDistribution: 2 }],
    defaultColumns: 2,
    headerProps: ['badge', 'title', 'subtitle', 'image'],
    usesDataWrapper: true,
  },
  'v2-career-benefits2': {
    sectionType: 'v2-career-benefits2',
    arrayPaths: [{ arrayPath: 'benefits', widgetType: 'v2-career-benefit2-item', columnDistribution: 2 }],
    defaultColumns: 2,
    headerProps: ['title', 'subtitle', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },
  'v2-career-faq2': {
    sectionType: 'v2-career-faq2',
    arrayPaths: [{ arrayPath: 'faqs', widgetType: 'v2-career-faq2-item', columnDistribution: 'single' }],
    defaultColumns: 1,
    headerProps: ['title', 'subtitle', 'contactText', 'contactLabel', 'contactImage'],
    usesDataWrapper: true,
  },
  'v2-career-cta3': {
    sectionType: 'v2-career-cta3',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badgeIcon', 'badgeText', 'title', 'subtitle', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },
  'v2-site-benefits': {
    sectionType: 'v2-site-benefits',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badge', 'title', 'card1Title', 'card1Subtitle', 'card2Title', 'card2Subtitle', 'card3Title', 'card3Subtitle', 'card4Title', 'card4Subtitle', 'card5Title', 'card5Subtitle'],
    usesDataWrapper: true,
  },
  'v2-hostings-features': {
    sectionType: 'v2-hostings-features',
    arrayPaths: [{ arrayPath: 'hostings', widgetType: 'v2-hostings-feature-item', columnDistribution: 4 }],
    defaultColumns: 4,
    headerProps: ['title', 'subtitle'],
    usesDataWrapper: true,
  },

  // V2 Job Detail sections
  'v2-job-title-hero': {
    sectionType: 'v2-job-title-hero',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['title', 'jobDetails'],
    usesDataWrapper: true,
  },
  'v2-job-description': {
    sectionType: 'v2-job-description',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['sections', 'buttons', 'contactItems'],
    usesDataWrapper: true,
  },
  'v2-job-gallery': {
    sectionType: 'v2-job-gallery',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['images'],
    usesDataWrapper: true,
  },
  'v2-job-faq': {
    sectionType: 'v2-job-faq',
    arrayPaths: [{ arrayPath: 'faqs', widgetType: 'v2-job-faq-item', columnDistribution: 'single' }],
    defaultColumns: 1,
    headerProps: ['title', 'subtitle', 'contactText', 'contactLabel', 'contactImage'],
    usesDataWrapper: true,
  },
  'v2-job-cta': {
    sectionType: 'v2-job-cta',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badgeText', 'title', 'subtitle', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },
  'v2-site-footer': {
    sectionType: 'v2-site-footer',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['logoUrl', 'copyrightText'],
    usesDataWrapper: true,
  },

  // V2 Job Post sections
  'v2-job-post-navbar': {
    sectionType: 'v2-job-post-navbar',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['bannerText'],
    usesDataWrapper: true,
  },
  'v2-job-post-hero': {
    sectionType: 'v2-job-post-hero',
    arrayPaths: [{ arrayPath: 'jobDetails', widgetType: 'v2-job-post-hero-detail', columnDistribution: 'single' }],
    defaultColumns: 1,
    headerProps: ['title'],
    usesDataWrapper: true,
  },
  'v2-job-post-description': {
    sectionType: 'v2-job-post-description',
    arrayPaths: [{ arrayPath: 'sections', widgetType: 'v2-job-post-description-item', columnDistribution: 'single' }],
    defaultColumns: 1,
    headerProps: ['applyText', 'shareText'],
    usesDataWrapper: true,
  },
  'v2-job-post-gallery': {
    sectionType: 'v2-job-post-gallery',
    arrayPaths: [{ arrayPath: 'images', widgetType: 'v2-job-post-gallery-image' }],
    defaultColumns: 2,
    headerProps: [],
    usesDataWrapper: true,
  },
  'v2-job-post-faq': {
    sectionType: 'v2-job-post-faq',
    arrayPaths: [{ arrayPath: 'faqs', widgetType: 'v2-job-post-faq-item', columnDistribution: 'single' }],
    defaultColumns: 1,
    headerProps: ['title', 'subtitle', 'contactText', 'contactLabel', 'contactImage'],
    usesDataWrapper: true,
  },
  'v2-job-post-cta': {
    sectionType: 'v2-job-post-cta',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badgeText', 'title', 'subtitle', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },
  'v2-job-post-footer': {
    sectionType: 'v2-job-post-footer',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['logoUrl', 'copyrightText'],
    usesDataWrapper: true,
  },

  // V2 Affiliate Partner Program sections
  'v2-affiliate-hero': {
    sectionType: 'v2-affiliate-hero',
    arrayPaths: [
      { arrayPath: 'benefits', widgetType: 'v2-affiliate-benefit-item', columnDistribution: 'single' }
    ],
    defaultColumns: 1,
    headerProps: ['badge', 'title', 'subtitle', 'buttonText', 'buttonLink', 'secondaryButtonText', 'secondaryButtonLink'],
    usesDataWrapper: true,
  },
  'v2-affiliate-how-it-works': {
    sectionType: 'v2-affiliate-how-it-works',
    arrayPaths: [
      { arrayPath: 'steps', widgetType: 'v2-affiliate-how-it-works-step-item', columnDistribution: 3 }
    ],
    defaultColumns: 3,
    headerProps: ['title', 'subtitle'],
    usesDataWrapper: true,
  },
  'v2-affiliate-about': {
    sectionType: 'v2-affiliate-about',
    arrayPaths: [
      { arrayPath: 'cards', widgetType: 'v2-affiliate-about-card', columnDistribution: 2 }
    ],
    defaultColumns: 2,
    headerProps: ['title', 'subtitle'],
    usesDataWrapper: true,
  },
  'v2-affiliate-migration': {
    sectionType: 'v2-affiliate-migration',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badgeLogo', 'badgeText', 'title', 'subtitle', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },
  'v2-affiliate-who-is-it-for': {
    sectionType: 'v2-affiliate-who-is-it-for',
    arrayPaths: [
      { arrayPath: 'items', widgetType: 'v2-affiliate-who-is-it-for-item', columnDistribution: 'auto' }
    ],
    defaultColumns: 1,
    headerProps: ['title', 'subtitle', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },

  'v2-affiliate-payment-methods': {
    sectionType: 'v2-affiliate-payment-methods',
    arrayPaths: [
      { arrayPath: 'methods', widgetType: 'v2-affiliate-payment-method-item', columnDistribution: 2 }
    ],
    defaultColumns: 2,
    headerProps: ['badge', 'title', 'subtitle'],
    usesDataWrapper: true,
  },

  'v2-affiliate-faq': {
    sectionType: 'v2-affiliate-faq',
    arrayPaths: [
      { arrayPath: 'faqs', widgetType: 'v2-affiliate-faq-item', columnDistribution: 'single' }
    ],
    defaultColumns: 1,
    headerProps: ['title', 'subtitle', 'reachOutText', 'reachOutLink', 'honeyAIText', 'honeyAILink'],
    usesDataWrapper: true,
  },

  'v2-affiliate-call-to-action': {
    sectionType: 'v2-affiliate-call-to-action',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: ['badgeIcon', 'badgeText', 'title', 'subtitle', 'buttonText', 'buttonLink'],
    usesDataWrapper: true,
  },

  'v2-affiliate-reviews': {
    sectionType: 'v2-affiliate-reviews',
    arrayPaths: [
      { arrayPath: 'reviews', widgetType: 'v2-affiliate-review-item', columnDistribution: 2 }
    ],
    defaultColumns: 2,
    headerProps: ['title', 'rightImage', 'footerImage'],
    usesDataWrapper: true,
  },

  // Legal section
  'legal': {
    sectionType: 'legal',
    arrayPaths: [
      { arrayPath: 'items', widgetType: 'legal-item', columnDistribution: 'single' }
    ],
    defaultColumns: 1,
    headerProps: ['title', 'subtitle', 'defaultActiveSlug'],
    usesDataWrapper: true,
  },

  // Generic fallback for unknown section types
  'generic': {
    sectionType: 'generic',
    arrayPaths: [],
    defaultColumns: 1,
    headerProps: [],
    usesDataWrapper: false,
  },
};

// ============================================================================
// Normalization Functions
// ============================================================================

/**
 * Get the actual props object from a section, handling data wrapper sections
 */
function getActualProps(section: SectionInstance, rule: NormalizationRule): Record<string, any> {
  if (rule.usesDataWrapper && section.props.data) {
    return section.props.data;
  }
  return section.props;
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

/**
 * Extract header props from section props
 */
function extractHeaderProps(props: Record<string, any>, headerPropKeys: string[]): Record<string, any> {
  const headerProps: Record<string, any> = {};
  for (const key of headerPropKeys) {
    if (props[key] !== undefined) {
      headerProps[key] = props[key];
    }
  }
  return headerProps;
}

/**
 * Create widgets from an array property
 */
function createWidgetsFromArray(
  items: any[],
  widgetType: GridWidgetType,
  arrayPath: string
): GridWidget[] {
  return items.map((item, index) => ({
    id: generateWidgetId(),
    type: widgetType,
    props: typeof item === 'object' ? { ...item } : { value: item },
    sourcePath: `${arrayPath}.${index}`,
  }));
}

/**
 * Distribute widgets into columns based on distribution strategy
 */
function distributeWidgetsToColumns(
  widgets: GridWidget[],
  distribution: 'single' | 'auto' | number,
  defaultColumns: number
): GridColumn[] {
  if (widgets.length === 0) {
    // Return a single empty column
    return [{
      id: generateColumnId(),
      width: { desktop: '100%' },
      alignment: 'stretch',
      widgets: [],
    }];
  }

  // Single column: all widgets stacked
  if (distribution === 'single') {
    return [{
      id: generateColumnId(),
      width: { desktop: '100%' },
      alignment: 'stretch',
      widgets,
    }];
  }

  // Fixed column count
  const columnCount = distribution === 'auto'
    ? Math.min(widgets.length, defaultColumns)
    : distribution;

  // Calculate column width
  const widthPercent = `${(100 / columnCount).toFixed(2)}%`;

  // One widget per column (standard grid layout)
  return widgets.map(widget => ({
    id: generateColumnId(),
    width: {
      desktop: widthPercent,
      tablet: columnCount > 2 ? '50%' : widthPercent,
      mobile: '100%',
    },
    alignment: 'start' as const,
    widgets: [widget],
  }));
}

/**
 * Normalize a section into the grid model.
 * This is the main entry point for normalization.
 */
export function normalizeSection(section: SectionInstance): NormalizedSection {
  // If section already has explicit grid, use it directly
  if (hasExplicitGrid(section)) {
    return {
      id: section.id,
      type: section.type,
      grid: section.grid,
      headerProps: extractHeaderProps(
        section.props,
        normalizationRules[section.type]?.headerProps || []
      ),
      originalProps: section.props,
      isNormalized: false, // Already has grid
    };
  }

  // Get normalization rule for this section type
  const rule = normalizationRules[section.type];
  if (!rule) {
    console.warn(`[GridNormalizer] No normalization rule for section type: ${section.type}`);
    // Fallback: single column with all props
    return {
      id: section.id,
      type: section.type,
      grid: {
        columns: [{
          id: generateColumnId(),
          width: { desktop: '100%' },
          widgets: [],
        }],
        gap: '1rem',
      },
      headerProps: section.props,
      originalProps: section.props,
      isNormalized: true,
    };
  }

  // Get actual props (handle data wrapper)
  const actualProps = getActualProps(section, rule);

  // Extract header props
  const headerProps = extractHeaderProps(actualProps, rule.headerProps);

  // Process each array path to create widgets
  const allColumns: GridColumn[] = [];

  for (const mapping of rule.arrayPaths) {
    const array = getNestedValue(actualProps, mapping.arrayPath);

    if (!Array.isArray(array) || array.length === 0) {
      continue;
    }

    // Create widgets from array items
    const widgets = createWidgetsFromArray(array, mapping.widgetType, mapping.arrayPath);

    // Distribute widgets to columns
    const columns = distributeWidgetsToColumns(
      widgets,
      mapping.columnDistribution ?? 'auto',
      rule.defaultColumns
    );

    allColumns.push(...columns);
  }

  // If no columns were created, add an empty placeholder
  if (allColumns.length === 0) {
    allColumns.push({
      id: generateColumnId(),
      width: { desktop: '100%' },
      alignment: 'stretch',
      widgets: [],
    });
  }

  // Create the grid definition
  const grid: SectionGrid = {
    columns: allColumns,
    gap: '1.5rem',
    alignment: 'center',
    responsive: {
      tablet: { columns: Math.min(2, allColumns.length) },
      mobile: { columns: 1 },
    },
  };

  return {
    id: section.id,
    type: section.type,
    grid,
    headerProps,
    originalProps: section.props,
    isNormalized: true,
  };
}

/**
 * Normalize all sections in a page
 */
export function normalizePageSections(sections: SectionInstance[]): NormalizedSection[] {
  return sections.map(normalizeSection);
}

// ============================================================================
// Denormalization (Grid → Legacy Props)
// ============================================================================

/**
 * Convert grid back to legacy props format for saving.
 * This ensures backward compatibility with existing saved data.
 */
export function denormalizeGrid(
  normalizedSection: NormalizedSection,
  sectionType: SectionType
): Record<string, any> {
  const rule = normalizationRules[sectionType];
  if (!rule) {
    return normalizedSection.originalProps;
  }

  // Start with header props
  const props = { ...normalizedSection.headerProps };

  // Rebuild arrays from widgets
  for (const mapping of rule.arrayPaths) {
    const items: any[] = [];

    for (const column of normalizedSection.grid.columns) {
      for (const widget of column.widgets) {
        if (widget.type === mapping.widgetType) {
          items.push(widget.props);
        }
      }
    }

    // Set the array back in props
    if (items.length > 0) {
      props[mapping.arrayPath] = items;
    }
  }

  // Handle data wrapper sections
  if (rule.usesDataWrapper) {
    return { data: props };
  }

  return props;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the widget type for a section's array items
 */
export function getWidgetTypeForSection(
  sectionType: SectionType,
  arrayPath: string
): GridWidgetType | null {
  const rule = normalizationRules[sectionType];
  if (!rule) return null;

  const mapping = rule.arrayPaths.find(m => m.arrayPath === arrayPath);
  return mapping?.widgetType || null;
}

/**
 * Check if a section type uses data wrapper
 */
export function usesDataWrapper(sectionType: SectionType): boolean {
  return normalizationRules[sectionType]?.usesDataWrapper ?? false;
}

/**
 * Get array paths for a section type
 */
export function getArrayPaths(sectionType: SectionType): string[] {
  return normalizationRules[sectionType]?.arrayPaths.map(m => m.arrayPath) ?? [];
}
