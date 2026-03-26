/**
 * Props interfaces for all landing section components
 * These enable the editor to pass saved data to components
 */

// ============================================================================
// Hero Section
// ============================================================================

export interface HeroServiceItem {
  icon: string;
  label: string;
}

export interface HeroSectionProps {
  badge?: string;
  title?: string;
  highlightedText?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  priceText?: string;
  services?: HeroServiceItem[];
}

// ============================================================================
// Features Section
// ============================================================================

export interface FeatureHighlight {
  text: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  highlights: FeatureHighlight[];
}

export interface FeaturesSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
  buttonText?: string;
  buttonUrl?: string;
}

// ============================================================================
// CTA Section
// ============================================================================

export interface CTABenefit {
  text: string;
}

export interface CTASectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  benefits?: CTABenefit[];
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}

// ============================================================================
// FAQ Section
// ============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  faqs?: FAQItem[];
}

// ============================================================================
// Testimonials Section
// ============================================================================

export interface TestimonialItem {
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  rating: number;
  text: string;
}

export interface TestimonialsSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  testimonials?: TestimonialItem[];
}

// ============================================================================
// Trusted By Section
// ============================================================================

export interface TrustedCompany {
  name: string;
  logo?: string;
}

export interface ReviewPlatform {
  name: string;
  rating: number;
  reviewCount: string;
  logo?: string;
}

export interface TrustedBySectionProps {
  badge?: string;
  title?: string;
  platforms?: ReviewPlatform[];
  companies?: TrustedCompany[];
}

// ============================================================================
// Why Choose Section
// ============================================================================

export interface ReasonItem {
  icon: string;
  title: string;
  description: string;
}

export interface WhyChooseSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  reasons?: ReasonItem[];
}

// ============================================================================
// Contact Section
// ============================================================================

export interface ContactChannel {
  icon: string;
  title: string;
  description: string;
  value: string;
  buttonText: string;
  buttonUrl?: string;
}

export interface ContactSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  channels?: ContactChannel[];
}

// ============================================================================
// Need Help Section
// ============================================================================

export interface SupportOption {
  icon: string;
  title: string;
  description: string;
  actionText: string;
  availability?: string;
}

export interface NeedHelpSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  options?: SupportOption[];
}

// ============================================================================
// Hosting Services Section
// ============================================================================

export interface HostingService {
  icon: string;
  title: string;
  description: string;
  price: string;
}

export interface HostingServicesSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  services?: HostingService[];
}

// ============================================================================
// Stats Counter Section
// ============================================================================

export interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

export interface StatsCounterSectionProps {
  badge?: string;
  title?: string;
  stats?: StatItem[];
}

// ============================================================================
// Steps Section
// ============================================================================

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface StepsSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  steps?: StepItem[];
}

// ============================================================================
// Icon Features Section
// ============================================================================

export interface IconFeature {
  icon: string;
  title: string;
  description: string;
}

export interface IconFeaturesSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  columns?: number;
  features?: IconFeature[];
}
