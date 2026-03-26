// Shared types for the Page Editor system
import type { BaseSectionData } from './baseSectionTypes';
// ============================================================================
// Pricing Section Types
// ============================================================================

/**
 * Legacy feature type - kept for backward compatibility
 * @deprecated Use UnifiedFeature with featureValues instead
 */
export interface PlanFeature {
  icon: string;
  label: string;
}

/**
 * Unified feature defined at section level.
 * All plans share the same features, with per-plan value overrides.
 */
export interface UnifiedFeature {
  id: string;        // Unique ID for mapping
  icon: string;      // Lucide icon name
  label: string;     // Display text
}

/**
 * Plan data with unified feature support.
 * featureValues maps feature IDs to inclusion status or custom text.
 */
export interface PlanData {
  name: string;
  description: string;
  originalPrice: string;
  price: string;
  discount: string;
  period: string;
  buttonText: string;
  isHighlighted: boolean;
  /** @deprecated Use isHighlighted instead */
  highlighted?: boolean;
  /**
   * Per-plan feature values.
   * - true/false: feature included/excluded
   * - string: custom display text (e.g., "Unlimited", "10 GB")
   */
  featureValues: Record<string, boolean | string>;
  /**
   * @deprecated Legacy per-plan features. Use section-level features + featureValues instead.
   */
  features?: PlanFeature[];
}

/**
 * Pricing section data with unified features and carousel options.
 */
export interface PricingSectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  planCount: number;
  /** Enable horizontal carousel layout */
  useCarousel: boolean;
  /** Auto-scroll carousel when enabled */
  carouselAutoScroll?: boolean;
  /** Show navigation arrows in carousel mode */
  showNavigationArrows?: boolean;
  /** Section-level unified features */
  features: UnifiedFeature[];
  plans: PlanData[];
}

// ============================================================================
// Logo Carousel Types
// ============================================================================

export interface LogoData {
  src: string;
  alt: string;
}

export interface LogoCarouselData extends BaseSectionData {
  variant: 'dark' | 'light';
  speed: number;
  pauseOnHover: boolean;
  customBackground: string;
  customBorder: string;
  logoOpacity: number;
  logos: LogoData[];
}

// ============================================================================
// Hero Section Types
// ============================================================================

export interface HeroServiceItem {
  icon: string;
  label: string;
}

export interface HeroSectionData extends BaseSectionData {
  badge: string;
  title: string;
  highlightedText: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl?: string;
  priceText: string;
  originalPrice: string;
  discountedPrice: string;
  services: HeroServiceItem[];
}

// ============================================================================
// Features Section Types
// ============================================================================

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesSectionData extends BaseSectionData {
  badge: string;
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

// ============================================================================
// FAQ Section Types
// ============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionData extends BaseSectionData {
  badge: string;
  title: string;
  subtitle?: string;
  faqs: FAQItem[];
}

// ============================================================================
// Testimonials Section Types
// ============================================================================

export interface TestimonialItem {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface TestimonialsSectionData extends BaseSectionData {
  badge: string;
  title: string;
  subtitle?: string;
  testimonials: TestimonialItem[];
}

// ============================================================================
// CTA Section Types
// ============================================================================

export interface CTABenefit {
  text: string;
}

export interface CTASectionData extends BaseSectionData {
  badge?: string;
  title: string;
  subtitle: string;
  benefits?: CTABenefit[];
  primaryButtonText: string;
  primaryButtonUrl?: string;
  secondaryButtonText: string;
  secondaryButtonUrl?: string;
  trustBadgeText?: string;
}

// ============================================================================
// Trusted By Section Types
// ============================================================================

export interface ReviewPlatform {
  name: string;
  rating: number;
  reviewCount: string;
  logo?: string;
}

export interface TrustedCompany {
  name: string;
  logo?: string;
}

export interface TrustedBySectionData extends BaseSectionData {
  title: string;
  platforms: ReviewPlatform[];
  companies: TrustedCompany[];
}

// ============================================================================
// Hosting Services Section Types
// ============================================================================

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  price: string;
}

export interface HostingServicesSectionData extends BaseSectionData {
  badge: string;
  title: string;
  subtitle: string;
  services: ServiceItem[];
}

// ============================================================================
// Why Choose Section Types
// ============================================================================

export interface ReasonItem {
  icon: string;
  title: string;
  description: string;
}

export interface WhyChooseSectionData extends BaseSectionData {
  badge: string;
  title: string;
  subtitle: string;
  reasons: ReasonItem[];
}

// ============================================================================
// Need Help Section Types
// ============================================================================

export interface SupportOption {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface NeedHelpSectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  options: SupportOption[];
}

// ============================================================================
// Section Type Union
// ============================================================================

export type SectionType =
  | 'pricing'
  | 'logo-carousel'
  | 'hero'
  | 'features'
  | 'faq'
  | 'testimonials'
  | 'cta'
  | 'trusted-by'
  | 'hosting-services'
  | 'why-choose'
  | 'need-help'
  // Phase 2 section types
  | 'stats-counter'
  | 'steps'
  | 'announcement-banner'
  | 'icon-features'
  | 'alternating-features'
  // Phase 3 section types
  | 'os-selector'
  | 'data-center'
  | 'bento-grid'
  | 'awards'
  | 'plans-comparison'
  // Phase 4 section types
  | 'blog-grid'
  | 'contact'
  | 'server-specs'
  | 'video'
  // Phase 5 section types
  | 'team-members'
  | 'careers'
  // Phase 6 section types (documentation test)
  | 'partners'
  // Phase 7 — V2 Design sections
  | 'v2-business-suite'
  | 'v2-hosting-options'
  | 'v2-benefits'
  // V2 Career Page sections
  | 'v2-career-cta'
  | 'v2-career-talent-pool'
  | 'v2-career-benefits'
  | 'v2-career-values'
  | 'v2-career-gallery'
  | 'v2-career-faq'
  | 'v2-career-hero'
  | 'v2-career-openings'
  // V2 Career Page 2 sections
  | 'v2-career-hero2'
  | 'v2-career-gallery2'
  | 'v2-career-talent-pool2'
  | 'v2-career-values2'
  | 'v2-career-benefits2'
  | 'v2-career-faq2'
  | 'v2-career-cta3'
  // V2 Design additional sections
  | 'v2-site-benefits'
  | 'v2-hostings-features'
  // V2 Job Detail sections
  | 'v2-job-title-hero'
  | 'v2-job-description'
  | 'v2-job-gallery'
  | 'v2-job-faq'
  | 'v2-job-cta'
  | 'v2-site-footer'
  // V2 Job Post sections
  | 'v2-job-post-navbar'
  | 'v2-job-post-hero'
  | 'v2-job-post-description'
  | 'v2-job-post-gallery'
  | 'v2-job-post-faq'
  | 'v2-job-post-cta'
  | 'v2-job-post-footer'
  // V2 Affiliate Partner Program sections
  | 'v2-affiliate-hero'
  | 'v2-affiliate-how-it-works'
  | 'v2-affiliate-about'
  | 'v2-affiliate-migration'
  | 'v2-affiliate-who-is-it-for'
  | 'v2-affiliate-payment-methods'
  | 'v2-affiliate-faq'
  | 'v2-affiliate-call-to-action'
  | 'v2-affiliate-reviews'
  // Legal section types
  | 'legal'
  | 'generic';

export type SectionData =
  | PricingSectionData
  | LogoCarouselData
  | HeroSectionData
  | FeaturesSectionData
  | FAQSectionData
  | TestimonialsSectionData
  | CTASectionData
  | TrustedBySectionData
  | HostingServicesSectionData
  | WhyChooseSectionData
  | NeedHelpSectionData;

// ============================================================================
// Editor Section State
// ============================================================================

export interface SectionState<T = unknown> {
  id: string;
  type: SectionType;
  data: T;
  component?: any; // Optional component reference
}

export interface EditorSections {
  [sectionId: string]: SectionState;
}

// Re-export new section types
export * from './newSectionTypes';
