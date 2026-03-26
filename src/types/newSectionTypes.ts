// ============================================================================
// New Section Types - Phase 2
// ============================================================================
import type { BaseSectionData } from './baseSectionTypes';

// Stats Counter Section
export interface StatItem {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  icon?: string;
}

export interface StatsCounterSectionData extends BaseSectionData {
  stats: StatItem[];
}

// Steps Section
export interface StepItem {
  number: number;
  title: string;
  description: string;
  icon?: string;
}

export interface StepsSectionData extends BaseSectionData {
  layout: 'horizontal' | 'vertical';
  steps: StepItem[];
}

// Announcement Banner Section
export interface AnnouncementBannerSectionData extends BaseSectionData {
  text: string;
  linkText?: string;
  linkUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  dismissible: boolean;
}

// Icon Features Section (Simple feature grid)
export interface IconFeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface IconFeaturesSectionData extends BaseSectionData {
  columns: 2 | 3 | 4;
  features: IconFeatureItem[];
}

// Alternating Features Section
export interface AlternatingFeatureBlock {
  title: string;
  description: string;
  image: string;
  imagePosition: 'left' | 'right';
  bullets?: string[];
  buttonText?: string;
  buttonLink?: string;
}

export interface AlternatingFeaturesSectionData extends BaseSectionData {
  blocks: AlternatingFeatureBlock[];
}

// Comparison Table Section
export interface ComparisonProvider {
  name: string;
  isHighlighted?: boolean;
}

export interface ComparisonFeature {
  name: string;
  values: (boolean | string)[];
}

export interface ComparisonTableSectionData extends BaseSectionData {
  providers: ComparisonProvider[];
  features: ComparisonFeature[];
}

// Bento Grid Section
export interface BentoGridItem {
  title: string;
  description: string;
  icon?: string;
  image?: string;
  size: 'small' | 'medium' | 'large';
  span?: 1 | 2;
}

export interface BentoGridSectionData extends BaseSectionData {
  items: BentoGridItem[];
}

// Awards Section
export interface AwardItem {
  image: string;
  name: string;
  year?: string;
  description?: string;
}

export interface AwardsSectionData extends BaseSectionData {
  awards: AwardItem[];
}

// OS Selector Section
export interface OSItem {
  icon: string;
  name: string;
  category: string;
  badge?: string;
}

export interface OSSelectorSectionData extends BaseSectionData {
  categories: string[];
  items: OSItem[];
}

// Data Center Section
export interface DataCenterLocation {
  city: string;
  country: string;
  flag: string;
  region: string;
  latency?: string;
}

export interface DataCenterSectionData extends BaseSectionData {
  locations: DataCenterLocation[];
}

// Contact Section
export interface ContactChannel {
  icon: string;
  type: 'chat' | 'phone' | 'email' | 'ticket';
  title: string;
  description: string;
  value: string;
  buttonText: string;
}

export interface ContactSectionData extends BaseSectionData {
  channels: ContactChannel[];
}

// Blog Grid Section
export interface BlogArticle {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date?: string;
  link?: string;
}

export interface BlogGridSectionData extends BaseSectionData {
  articles: BlogArticle[];
}

// Server Specs Section
export interface ServerSpec {
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  price: string;
  isPopular?: boolean;
}

export interface ServerSpecsSectionData extends BaseSectionData {
  specs: ServerSpec[];
}

// Plans Comparison Section
export interface PlanColumn {
  name: string;
  price: number | string; // numeric for conversion, string for legacy
  period?: string; // e.g., '/mo'
  isPopular?: boolean;
}

export interface PlanFeatureRow {
  feature: string;
  values: (boolean | string)[];
}

export interface PlansComparisonSectionData extends BaseSectionData {
  plans: PlanColumn[];
  features: PlanFeatureRow[];
}

// Video Section
export interface VideoSectionData extends BaseSectionData {
  videoUrl: string;
  thumbnailUrl?: string;
  overlayText?: string;
  autoplay?: boolean;
}

// Careers Section
export interface JobItem {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;         // "Full-time", "Part-time", "Contract", etc.
  remote: boolean;
  description: string;
  applyUrl: string;
}

export interface CareersSectionData extends BaseSectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  jobs: JobItem[];
  columns?: 2 | 3 | 4;
}

// ============================================================================
// V2 Design — V2 Business Suite Section
// ============================================================================

export interface V2ServiceCard {
  id: string;
  title: string;
  price: string;
  logo: string;
  mainImage: string;
  frameIcon: string;
  bgGradient: string;
}

export interface V2BusinessSuiteSectionData extends BaseSectionData {
  cards: V2ServiceCard[];
}

// ============================================================================
// V2 Design — V2 Hosting Options Section
// ============================================================================

export interface V2HostingOption {
  id: number;
  icon: string;
  title: string;
  price: string;
  bestFor: string;
  ratingBars: number;
  isWordPress?: boolean;
}

export interface V2HostingOptionsSectionData extends BaseSectionData {
  hostingOptions: V2HostingOption[];
  showPromoBanner: boolean;
}

// ============================================================================
// V2 Design — V2 Benefits Section
// ============================================================================

export interface V2BenefitCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  backgroundImage?: string;
  bgColor: string;
  size: 'large' | 'medium' | 'full';
}

export interface V2BenefitsSectionData extends BaseSectionData {
  benefits: V2BenefitCard[];
}

// ============================================================================
// V2 Career Page — CTA Section
// ============================================================================

export interface V2CareerCtaSectionData extends BaseSectionData {
  badgeIcon?: string;
  badgeText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
}

// ============================================================================
// V2 Affiliate Partner Program — Hero Section
// ============================================================================

export interface V2AffiliateBenefitItem {
  text: string;
}

export interface V2AffiliateHeroSectionData extends BaseSectionData {
  badge?: string;
  title: string;
  subtitle: string;
  benefits: V2AffiliateBenefitItem[];
  buttonText: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

// ============================================================================
// V2 Affiliate Page — How It Works Section
// ============================================================================

export interface V2AffiliateHowItWorksStepItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
}

export interface V2AffiliateHowItWorksSectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  steps: V2AffiliateHowItWorksStepItem[];
}
// V2 Affiliate Partner Program — Migration Section
// ============================================================================

export interface V2AffiliateMigrationSectionData extends BaseSectionData {
  badgeLogo?: string;
  badgeText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
}

// ============================================================================
// V2 Affiliate Partner Program — Who Is It For Section
// ============================================================================

export interface V2AffiliateWhoIsItForItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}
// V2 Affiliate Partner Program — Payment Methods Section
// ============================================================================

export interface V2AffiliatePaymentMethodItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface V2AffiliateWhoIsItForSectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
  items: V2AffiliateWhoIsItForItem[];
}
export interface V2AffiliatePaymentMethodsSectionData extends BaseSectionData {
  badge?: string;
  title: string;
  subtitle: string;
  methods: V2AffiliatePaymentMethodItem[];
}
// V2 Affiliate Partner Program — FAQ Section
// ============================================================================

export interface V2AffiliateFaqItem {
  id: string;
  question: string;
  answer?: string;
}

export interface V2AffiliateFaqSectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  reachOutText: string;
  reachOutLink: string;
  honeyAIText: string;
  honeyAILink: string;
  faqs: V2AffiliateFaqItem[];
}

// ============================================================================
// V2 Affiliate Partner Program — Call to Action Section
// ============================================================================

export interface V2AffiliateCallToActionSectionData extends BaseSectionData {
  badgeIcon?: string;
  badgeText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
}

// ============================================================================
// V2 Affiliate Partner Program — Reviews Section
// ============================================================================

export interface ReviewItem {
  id: string;
  starIcon: string;
  rating: number;
  text: string;
  authorAvatar: string;
  authorName: string;
  badge: string;
}

export interface V2AffiliateReviewsSectionData extends BaseSectionData {
  title: string;
  rightImage: string;
  footerImage: string;
  reviews: ReviewItem[];
}

// ============================================================================
// V2 Career Page — Talent Pool Section
// ============================================================================

export interface V2CareerTalentPoolSectionData extends BaseSectionData {
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
  backgroundImage: string;
}

// ============================================================================
// V2 Career Page — Benefits Section
// ============================================================================

export interface V2CareerBenefitItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface V2CareerBenefitsSectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
  benefits: V2CareerBenefitItem[];
}

// ============================================================================
// V2 Career Page — Values Section
// ============================================================================

export interface V2CareerValueItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface V2CareerValuesSectionData extends BaseSectionData {
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  values: V2CareerValueItem[];
}

// ============================================================================
// V2 Career Page — Gallery Section
// ============================================================================

export interface V2CareerGalleryImage {
  id: number;
  src: string;
  alt: string;
}

export interface V2CareerGallerySectionData extends BaseSectionData {
  images: V2CareerGalleryImage[];
}

// ============================================================================
// V2 Career Page — FAQ Section
// ============================================================================

export interface V2CareerFaqItem {
  question: string;
  answer?: string;
}

export interface V2CareerFaqSectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  contactText?: string;
  contactLabel?: string;
  contactImage?: string;
  faqs: V2CareerFaqItem[];
}

// ============================================================================
// V2 Career Page — Hero Section
// ============================================================================

export interface V2CareerHeroSectionData extends BaseSectionData {
  badge: string;
  title: string;
  buttonText: string;
  buttonLink?: string;
}

// ============================================================================
// V2 Career Page — Openings Section
// ============================================================================

export interface V2CareerJob {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
}

export interface V2CareerJobCategory {
  id: number;
  category: string;
  categoryIcon: string;
  jobs: V2CareerJob[];
}

export interface V2CareerOpeningsSectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
  categories: V2CareerJobCategory[];
}

// ============================================================================
// V2 Career Page 2 — Hero2 Section
// ============================================================================

export interface V2CareerHero2SectionData extends BaseSectionData {
  badge: string;
  title: string;
  buttonText: string;
  buttonLink?: string;
}

// ============================================================================
// V2 Career Page 2 — Talent Pool2 Section
// ============================================================================

export interface V2CareerTalentPool2SectionData extends BaseSectionData {
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
}

// ============================================================================
// V2 Career Page 2 — CTA3 Section
// ============================================================================

export interface V2CareerCta3SectionData extends BaseSectionData {
  badgeIcon?: string;
  badgeText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
}

// ============================================================================
// V2 Career Page 2 — Values2 Section
// ============================================================================

export interface V2CareerValue2Item {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface V2CareerValues2SectionData extends BaseSectionData {
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  values: V2CareerValue2Item[];
}

// ============================================================================
// V2 Career Page 2 — Benefits2 Section
// ============================================================================

export interface V2CareerBenefit2Item {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface V2CareerBenefits2SectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
  benefits: V2CareerBenefit2Item[];
}

// ============================================================================
// V2 Career Page 2 — Gallery2 Section
// ============================================================================

export interface V2CareerGallery2Image {
  id: string;
  src: string;
  alt: string;
}

export interface V2CareerGallery2SectionData extends BaseSectionData {
  images: V2CareerGallery2Image[];
}

// ============================================================================
// V2 Career Page 2 — FAQ2 Section
// ============================================================================

export interface V2CareerFaq2Item {
  id: string;
  question: string;
  answer?: string;
}

export interface V2CareerFaq2SectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  contactText?: string;
  contactLabel?: string;
  contactImage?: string;
  faqs: V2CareerFaq2Item[];
}

// ============================================================================
// V2 Design — Site Benefits Section
// ============================================================================

export interface V2SiteBenefitsSectionData extends BaseSectionData {
  badge: string;
  title: string;
  card1Title: string;
  card1Subtitle: string;
  card2Title: string;
  card2Subtitle: string;
  card3Title: string;
  card3Subtitle: string;
  card4Title: string;
  card4Subtitle: string;
  card5Title: string;
  card5Subtitle: string;
}

// ============================================================================
// V2 Design — Hostings Features Section
// ============================================================================

export interface V2HostingsFeatureItem {
  id: string;
  icon: string;
  title: string;
  price: string;
  bestFor: string;
  ratingBars: number;
}

export interface V2HostingsFeaturesSectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  hostings: V2HostingsFeatureItem[];
}

// ============================================================================
// V2 Job Detail — Title Hero Section
// ============================================================================

export interface V2JobDetailItem {
  icon: string;
  label: string;
  value: string;
}

export interface V2JobTitleHeroSectionData extends BaseSectionData {
  title: string;
  jobDetails: V2JobDetailItem[];
}

// ============================================================================
// V2 Job Detail — Description Section
// ============================================================================

export interface V2JobDescriptionSectionItem {
  title: string;
  content: string;
  hasHighlight: boolean;
}

export interface V2JobDescriptionButton {
  text: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

export interface V2JobDescriptionContactItem {
  icon: string;
  text: string;
}

export interface V2JobDescriptionSectionData extends BaseSectionData {
  sections: V2JobDescriptionSectionItem[];
  buttons: V2JobDescriptionButton[];
  contactItems: V2JobDescriptionContactItem[];
}

// ============================================================================
// V2 Job Detail — Gallery Section
// ============================================================================

export interface V2JobGalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface V2JobGallerySectionData extends BaseSectionData {
  images: V2JobGalleryImage[];
}

// ============================================================================
// V2 Job Detail — FAQ Section
// ============================================================================

export interface V2JobFaqItem {
  id: string;
  question: string;
  answer?: string;
}

export interface V2JobFaqSectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  contactText: string;
  contactLabel: string;
  contactImage: string;
  faqs: V2JobFaqItem[];
}

// ============================================================================
// V2 Job Detail — CTA Section
// ============================================================================

export interface V2JobCtaSectionData extends BaseSectionData {
  badgeText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

// ============================================================================
// V2 Design — Site Footer Section
// ============================================================================

export interface V2SiteFooterSectionData extends BaseSectionData {
  logoUrl: string;
  copyrightText: string;
}

// Partners Section
export interface PartnerItem {
  id?: string;
  logo: string;
  name: string;
  description: string;
  website?: string;
}

export interface PartnersSectionData extends BaseSectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  partners: PartnerItem[];
}

// ============================================================================
// V2 Job Post sections
// ============================================================================

export interface V2JobPostHeroDetailItem {
  id: string;
  icon: string;
  label: string;
  value: string;
}

export interface V2JobPostNavbarSectionData extends BaseSectionData {
  bannerText: string;
}

export interface V2JobPostHeroSectionData extends BaseSectionData {
  title: string;
  jobDetails: V2JobPostHeroDetailItem[];
}

export interface V2JobPostDescriptionItem {
  id: string;
  title: string;
  content: string;
  hasHighlight: boolean;
  highlightHeight?: string;
}

export interface V2JobPostContactDetailItem {
  id: string;
  icon: string;
  text: string;
}

export interface V2JobPostDescriptionSectionData extends BaseSectionData {
  applyText: string;
  shareText: string;
  sections: V2JobPostDescriptionItem[];
  contactItems: V2JobPostContactDetailItem[];
}

export interface V2JobPostGalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface V2JobPostGallerySectionData extends BaseSectionData {
  images: V2JobPostGalleryImage[];
}

export interface V2JobPostFaqItem {
  id: string;
  question: string;
  answer?: string;
}

export interface V2JobPostFaqSectionData extends BaseSectionData {
  title: string;
  subtitle: string;
  contactText: string;
  contactLabel: string;
  contactImage: string;
  faqs: V2JobPostFaqItem[];
}

export interface V2JobPostCtaSectionData extends BaseSectionData {
  badgeIcon?: string;
  badgeText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
}

export interface V2JobPostFooterSectionData extends BaseSectionData {
  logoUrl: string;
  copyrightText: string;
}

// ============================================================================
// V2 Affiliate Partner Program — About Section
// ============================================================================

export interface V2AffiliateAboutItem {
  id: string;
  image: string;
  tagline: string;
  title: string;
  description: string;
}

export interface V2AffiliateAboutSectionData extends BaseSectionData {
  title?: string;
  subtitle?: string;
  cards: V2AffiliateAboutItem[];
}

// ============================================================================
// Legal Layout Section
// ============================================================================

export interface LegalListItem {
  text: string;
  subItems?: string[];
}

export interface LegalTableCell {
  // string = single paragraph cell; string[] = multi-paragraph cell
  content: string | string[];
}

export interface LegalTableRow {
  cells: (string | string[])[];
}

export interface LegalFaqItem {
  question: string;
}

export interface LegalContentSection {
  heading: string;
  isSubSection?: boolean;
  lastRevised?: string;
  paragraphs?: string[];
  trailingParagraphs?: string[];
  lists?: {
    items: (string | LegalListItem)[];
    nested?: boolean;
    plain?: boolean;
    noBox?: boolean;
  };
  table?: {
    headers: string[];
    rows: LegalTableRow[];
  };
  faq?: LegalFaqItem[];
  banner?: string;
}

export interface LegalItem {
  id: string;
  label: string;        // Sidebar navigation text (e.g., "Terms and Conditions")
  title: string;        // Header title for the page (e.g., "General Terms And Conditions")
  subtitle?: string;    // Per-item subtitle shown below header title
  slug: string;         // URL-friendly identifier (e.g., "terms-and-conditions")
  content?: string;     // Optional: fallback content if no content file exists
  sections?: any[];     // Content sections (heading, paragraphs, lists, banner) - loaded from static files
}

export interface LegalLayoutSectionData extends BaseSectionData {
  subtitle?: string;           // Page subtitle (shown below header title)
  defaultActiveSlug?: string;  // Which item to show initially
  items: LegalItem[];          // Array of legal documents/pages
}

