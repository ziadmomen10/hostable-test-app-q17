/**
 * Section Registry
 * 
 * Plugin-based architecture for section panels. Register section types once
 * and the editor will automatically detect, parse, and render appropriate settings.
 */

import { 
  SectionType, 
  PricingSectionData, 
  LogoCarouselData, 
  PlanData,
  HeroSectionData,
  FeaturesSectionData,
  FAQSectionData,
  TestimonialsSectionData,
  CTASectionData,
  TrustedBySectionData,
  HostingServicesSectionData,
  WhyChooseSectionData,
  NeedHelpSectionData,
  StatsCounterSectionData,
  StepsSectionData,
  AnnouncementBannerSectionData,
  IconFeaturesSectionData,
  AlternatingFeaturesSectionData,
  OSSelectorSectionData,
  DataCenterSectionData,
  BentoGridSectionData,
  AwardsSectionData,
  PlansComparisonSectionData,
  BlogGridSectionData,
  ContactSectionData,
  ServerSpecsSectionData,
  VideoSectionData,
} from '@/types/pageEditor';
import { 
  DollarSign, 
  Image, 
  LucideIcon, 
  Layout, 
  Zap, 
  HelpCircle, 
  MessageSquare, 
  Megaphone,
  Shield,
  Server,
  Award,
  Headphones,
  BarChart3,
  ListOrdered,
  Bell,
  Grid3X3,
  Columns,
  Monitor,
  Globe,
  LayoutGrid,
  Trophy,
  Table,
  Newspaper,
  Phone,
  HardDrive,
  Video,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface SectionConfig {
  type: SectionType;
  displayName: string;
  icon: LucideIcon;
  detectFromComponent: (component: any) => boolean;
  parseData: (attrs: Record<string, any>, element?: HTMLElement | null) => any;
  serializeData: (data: any) => Record<string, string>;
}

// ============================================================================
// Registry
// ============================================================================

const sectionRegistry = new Map<SectionType, SectionConfig>();

export function registerSection(config: SectionConfig): void {
  sectionRegistry.set(config.type, config);
}

export function getSectionConfig(type: SectionType): SectionConfig | undefined {
  return sectionRegistry.get(type);
}

export function detectSectionFromComponent(component: any): SectionConfig | null {
  for (const config of sectionRegistry.values()) {
    if (config.detectFromComponent(component)) {
      return config;
    }
  }
  return null;
}

export function getAllRegisteredSections(): SectionConfig[] {
  return Array.from(sectionRegistry.values());
}

// ============================================================================
// Pricing Section Parsers/Serializers
// ============================================================================

export const parsePricingDataFromAttributes = (attrs: Record<string, string>): PricingSectionData => {
  const planCount = parseInt(attrs['data-plan-count'] || '4', 10);
  
  // Parse section-level unified features
  let features: { id: string; icon: string; label: string }[] = [];
  const featuresJson = attrs['data-features'];
  if (featuresJson) {
    try {
      features = JSON.parse(featuresJson);
    } catch (e) {
      console.warn('Failed to parse features JSON:', e);
    }
  }
  
  const plans: PlanData[] = [];
  for (let i = 1; i <= 10; i++) {
    // Parse legacy features (for backward compatibility)
    const legacyFeaturesStr = attrs[`data-plan-${i}-features`] || '';
    const legacyFeatures = legacyFeaturesStr.split('|').filter(Boolean).map((f: string) => {
      const [icon, ...labelParts] = f.split(':');
      return { icon, label: labelParts.join(':') };
    });
    
    // Parse per-plan feature values
    let featureValues: Record<string, boolean | string> = {};
    const featureValuesJson = attrs[`data-plan-${i}-feature-values`];
    if (featureValuesJson) {
      try {
        featureValues = JSON.parse(featureValuesJson);
      } catch (e) {
        console.warn('Failed to parse feature values JSON:', e);
      }
    }
    
    plans.push({
      name: attrs[`data-plan-${i}-name`] || '',
      description: attrs[`data-plan-${i}-desc`] || '',
      originalPrice: attrs[`data-plan-${i}-original-price`] || '',
      price: attrs[`data-plan-${i}-price`] || '',
      discount: attrs[`data-plan-${i}-discount`] || '',
      period: attrs[`data-plan-${i}-period`] || '/mo',
      buttonText: attrs[`data-plan-${i}-button`] || 'Get Started',
      isHighlighted: attrs[`data-plan-${i}-highlighted`] === 'true',
      featureValues,
      features: legacyFeatures.length > 0 ? legacyFeatures : undefined,
    });
  }
  
  return {
    title: attrs['data-title'] || '',
    subtitle: attrs['data-subtitle'] || '',
    planCount,
    useCarousel: attrs['data-use-carousel'] === 'true',
    carouselAutoScroll: attrs['data-carousel-auto-scroll'] === 'true',
    showNavigationArrows: attrs['data-show-nav-arrows'] !== 'false',
    features,
    plans,
  };
};

export const serializePricingDataToAttributes = (data: PricingSectionData): Record<string, string> => {
  const attrs: Record<string, string> = {
    'data-title': data.title,
    'data-subtitle': data.subtitle,
    'data-plan-count': String(data.planCount),
    'data-use-carousel': String(data.useCarousel),
    'data-carousel-auto-scroll': String(data.carouselAutoScroll ?? false),
    'data-show-nav-arrows': String(data.showNavigationArrows ?? true),
    'data-features': JSON.stringify(data.features || []),
  };
  
  data.plans.forEach((plan, i) => {
    const idx = i + 1;
    attrs[`data-plan-${idx}-name`] = plan.name;
    attrs[`data-plan-${idx}-desc`] = plan.description;
    attrs[`data-plan-${idx}-original-price`] = plan.originalPrice;
    attrs[`data-plan-${idx}-price`] = plan.price;
    attrs[`data-plan-${idx}-discount`] = plan.discount;
    attrs[`data-plan-${idx}-period`] = plan.period;
    attrs[`data-plan-${idx}-button`] = plan.buttonText;
    attrs[`data-plan-${idx}-highlighted`] = String(plan.highlighted);
    attrs[`data-plan-${idx}-feature-values`] = JSON.stringify(plan.featureValues || {});
    
    // Also serialize legacy features for backward compatibility
    if (plan.features && plan.features.length > 0) {
      attrs[`data-plan-${idx}-features`] = plan.features
        .map(f => `${f.icon}:${f.label}`)
        .join('|');
    }
  });
  
  return attrs;
};

// ============================================================================
// Logo Carousel Parsers/Serializers
// ============================================================================

export const parseLogoCarouselDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): LogoCarouselData => {
  let logos: { src: string; alt: string }[] = [];
  const logosJson = attrs['data-logos'];
  
  if (logosJson) {
    try {
      logos = JSON.parse(logosJson);
    } catch (e) {
      console.warn('Failed to parse logos JSON:', e);
    }
  }
  
  if (logos.length === 0 && element) {
    const images = element.querySelectorAll('img');
    const seen = new Set<string>();
    images.forEach((img: HTMLImageElement) => {
      const src = img.getAttribute('src') || '/placeholder.svg';
      if (!seen.has(src)) {
        seen.add(src);
        logos.push({
          src,
          alt: img.getAttribute('alt') || 'Logo',
        });
      }
    });
  }
  
  return {
    variant: (attrs['data-variant'] as 'dark' | 'light') || 'dark',
    speed: parseInt(attrs['data-speed'] || '50', 10),
    pauseOnHover: attrs['data-pause-on-hover'] !== 'false',
    customBackground: attrs['data-custom-bg'] || '',
    customBorder: attrs['data-custom-border'] || '',
    logoOpacity: parseInt(attrs['data-logo-opacity'] || '70', 10),
    logos,
  };
};

export const serializeLogoCarouselDataToAttributes = (data: LogoCarouselData): Record<string, string> => {
  return {
    'data-variant': data.variant,
    'data-speed': String(data.speed),
    'data-pause-on-hover': String(data.pauseOnHover),
    'data-custom-bg': data.customBackground,
    'data-custom-border': data.customBorder,
    'data-logo-opacity': String(data.logoOpacity),
    'data-logos': JSON.stringify(data.logos),
  };
};

// ============================================================================
// Hero Section Parsers/Serializers
// ============================================================================

export const parseHeroDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): HeroSectionData => {
  let services: { icon: string; label: string }[] = [];
  const servicesJson = attrs['data-services'];
  
  if (servicesJson) {
    try {
      services = JSON.parse(servicesJson);
    } catch (e) {
      console.warn('Failed to parse services JSON:', e);
    }
  }
  
  // Fallback: parse from DOM
  if (services.length === 0 && element) {
    const serviceEls = element.querySelectorAll('[class*="flex"][class*="gap"] > span');
    serviceEls.forEach((el) => {
      const text = el.textContent?.trim() || '';
      if (text.includes('✓') || text.includes('✔')) {
        services.push({ icon: '✓', label: text.replace(/[✓✔]/g, '').trim() });
      }
    });
  }
  
  return {
    badge: attrs['data-badge'] || '',
    title: attrs['data-title'] || element?.querySelector('h1')?.textContent?.split(/Powered|AI/)[0]?.trim() || '',
    highlightedText: attrs['data-highlighted'] || 'Powered by AI',
    subtitle: attrs['data-subtitle'] || '',
    primaryButtonText: attrs['data-primary-btn'] || 'Get Started',
    primaryButtonUrl: attrs['data-primary-link'] || '#',
    secondaryButtonText: attrs['data-secondary-btn'] || 'Learn More',
    priceText: attrs['data-price-text'] || '/month',
    originalPrice: attrs['data-original-price'] || '',
    discountedPrice: attrs['data-discounted-price'] || '',
    services,
  };
};

export const serializeHeroDataToAttributes = (data: HeroSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge,
    'data-title': data.title,
    'data-highlighted': data.highlightedText,
    'data-subtitle': data.subtitle,
    'data-primary-btn': data.primaryButtonText,
    'data-primary-link': data.primaryButtonUrl,
    'data-secondary-btn': data.secondaryButtonText,
    'data-price-text': data.priceText,
    'data-original-price': data.originalPrice,
    'data-discounted-price': data.discountedPrice,
    'data-services': JSON.stringify(data.services),
  };
};

// ============================================================================
// Features Section Parsers/Serializers
// ============================================================================

export const parseFeaturesDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): FeaturesSectionData => {
  let features: { icon: string; title: string; description: string }[] = [];
  const featuresJson = attrs['data-features'];
  
  if (featuresJson) {
    try {
      features = JSON.parse(featuresJson);
    } catch (e) {
      console.warn('Failed to parse features JSON:', e);
    }
  }
  
  // Fallback: parse from DOM
  if (features.length === 0 && element) {
    const featureCards = element.querySelectorAll('[class*="rounded-2xl"][class*="p-8"], [class*="rounded-2xl"][class*="p-6"]');
    featureCards.forEach((card) => {
      const iconEl = card.querySelector('span[class*="text-3xl"], span[class*="text-2xl"]');
      const titleEl = card.querySelector('h3');
      const descEl = card.querySelector('p');
      features.push({
        icon: iconEl?.textContent?.trim() || '⭐',
        title: titleEl?.textContent?.trim() || '',
        description: descEl?.textContent?.trim() || '',
      });
    });
  }
  
  return {
    badge: attrs['data-badge'] || element?.querySelector('[class*="uppercase"][class*="tracking"]')?.textContent?.trim() || 'FEATURES',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || '',
    subtitle: attrs['data-subtitle'] || element?.querySelector('h2 + p')?.textContent?.trim() || '',
    features,
  };
};

export const serializeFeaturesDataToAttributes = (data: FeaturesSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge,
    'data-title': data.title,
    'data-subtitle': data.subtitle,
    'data-features': JSON.stringify(data.features),
  };
};

// ============================================================================
// FAQ Section Parsers/Serializers
// ============================================================================

export const parseFAQDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): FAQSectionData => {
  let faqs: { question: string; answer: string }[] = [];
  const faqsJson = attrs['data-faqs'];
  
  if (faqsJson) {
    try {
      faqs = JSON.parse(faqsJson);
    } catch (e) {
      console.warn('Failed to parse FAQs JSON:', e);
    }
  }
  
  // Fallback: parse from DOM
  if (faqs.length === 0 && element) {
    const faqItems = element.querySelectorAll('[class*="rounded-xl"][class*="p-6"], [class*="bg-gray-50"][class*="p-6"]');
    faqItems.forEach((item) => {
      const questionEl = item.querySelector('button span, [class*="font-semibold"]');
      const answerEl = item.querySelector('[class*="mt-4"], [class*="text-gray"]');
      if (questionEl && answerEl) {
        faqs.push({
          question: questionEl.textContent?.trim() || '',
          answer: answerEl.textContent?.trim() || '',
        });
      }
    });
  }
  
  return {
    badge: attrs['data-badge'] || 'FAQ',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Frequently Asked Questions',
    faqs,
  };
};

export const serializeFAQDataToAttributes = (data: FAQSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge,
    'data-title': data.title,
    'data-faqs': JSON.stringify(data.faqs),
  };
};

// ============================================================================
// Testimonials Section Parsers/Serializers
// ============================================================================

export const parseTestimonialsDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): TestimonialsSectionData => {
  let testimonials: { name: string; role: string; avatar: string; rating: number; text: string }[] = [];
  const testimonialsJson = attrs['data-testimonials'];
  
  if (testimonialsJson) {
    try {
      testimonials = JSON.parse(testimonialsJson);
    } catch (e) {
      console.warn('Failed to parse testimonials JSON:', e);
    }
  }
  
  // Fallback: parse from DOM
  if (testimonials.length === 0 && element) {
    const cards = element.querySelectorAll('[class*="rounded-2xl"][class*="border"]');
    cards.forEach((card) => {
      const stars = card.querySelectorAll('[style*="color: hsl(45"]').length || 5;
      const textEl = card.querySelector('p[class*="text-gray-700"], p[class*="mb-6"]');
      const nameEl = card.querySelector('[class*="font-semibold"][class*="text-gray-900"]');
      const roleEl = card.querySelector('[class*="text-sm"][class*="text-gray-500"]');
      const avatarEl = card.querySelector('img');
      
      testimonials.push({
        name: nameEl?.textContent?.trim() || 'Customer',
        role: roleEl?.textContent?.trim() || '',
        avatar: avatarEl?.getAttribute('src') || '/placeholder.svg',
        rating: stars,
        text: textEl?.textContent?.trim() || '',
      });
    });
  }
  
  return {
    badge: attrs['data-badge'] || 'TESTIMONIALS',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'What Our Customers Say',
    testimonials,
  };
};

export const serializeTestimonialsDataToAttributes = (data: TestimonialsSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge,
    'data-title': data.title,
    'data-testimonials': JSON.stringify(data.testimonials),
  };
};

// ============================================================================
// CTA Section Parsers/Serializers
// ============================================================================

export const parseCTADataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): CTASectionData => {
  return {
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Ready to Get Started?',
    subtitle: attrs['data-subtitle'] || element?.querySelector('p')?.textContent?.trim() || '',
    primaryButtonText: attrs['data-primary-btn'] || element?.querySelector('button')?.textContent?.trim() || 'Start Now',
    secondaryButtonText: attrs['data-secondary-btn'] || element?.querySelectorAll('button')[1]?.textContent?.trim() || 'Contact Sales',
  };
};

export const serializeCTADataToAttributes = (data: CTASectionData): Record<string, string> => {
  return {
    'data-title': data.title,
    'data-subtitle': data.subtitle,
    'data-primary-btn': data.primaryButtonText,
    'data-secondary-btn': data.secondaryButtonText,
  };
};

// ============================================================================
// Trusted By Section Parsers/Serializers
// ============================================================================

export const parseTrustedByDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): TrustedBySectionData => {
  let platforms: { name: string; rating: number; reviewCount: string; logo?: string }[] = [];
  let companies: { name: string; logo?: string }[] = [];
  
  const platformsJson = attrs['data-platforms'];
  const companiesJson = attrs['data-companies'];
  
  if (platformsJson) {
    try { platforms = JSON.parse(platformsJson); } catch (e) { }
  }
  if (companiesJson) {
    try { companies = JSON.parse(companiesJson); } catch (e) { }
  }
  
  // Fallback: parse from DOM
  if (platforms.length === 0 && element) {
    const badgeCards = element.querySelectorAll('[class*="flex"][class*="items-center"][class*="gap-4"][class*="p-4"]');
    badgeCards.forEach((card) => {
      const platformEl = card.querySelector('[class*="font-semibold"]');
      const ratingEl = card.querySelector('[class*="text-sm"][class*="text-gray-500"]');
      const ratingText = ratingEl?.textContent?.split('•')[0]?.trim() || '5.0';
      platforms.push({
        name: platformEl?.textContent?.trim() || '',
        rating: parseFloat(ratingText) || 5.0,
        reviewCount: ratingEl?.textContent?.split('•')[1]?.trim() || '',
      });
    });
  }
  
  if (companies.length === 0 && element) {
    const companyEls = element.querySelectorAll('[class*="flex-wrap"][class*="justify-center"] > span');
    companyEls.forEach((el) => {
      const name = el.textContent?.trim();
      if (name) companies.push({ name });
    });
  }
  
  return {
    title: attrs['data-title'] || 'Trusted by leading companies worldwide',
    platforms,
    companies,
  };
};

export const serializeTrustedByDataToAttributes = (data: TrustedBySectionData): Record<string, string> => {
  return {
    'data-title': data.title,
    'data-platforms': JSON.stringify(data.platforms),
    'data-companies': JSON.stringify(data.companies),
  };
};

// ============================================================================
// Hosting Services Section Parsers/Serializers
// ============================================================================

export const parseHostingServicesDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): HostingServicesSectionData => {
  let services: { icon: string; title: string; description: string; price: string }[] = [];
  const servicesJson = attrs['data-services'];
  
  if (servicesJson) {
    try { services = JSON.parse(servicesJson); } catch (e) { }
  }
  
  // Fallback: parse from DOM
  if (services.length === 0 && element) {
    const cards = element.querySelectorAll('[class*="rounded-2xl"][class*="p-6"]');
    cards.forEach((card) => {
      const iconEl = card.querySelector('[class*="text-2xl"]');
      const titleEl = card.querySelector('h3');
      const descEl = card.querySelector('p[class*="text-gray-600"]');
      const priceEl = card.querySelector('[class*="font-bold"][style*="color"]');
      services.push({
        icon: iconEl?.textContent?.trim() || '🌐',
        title: titleEl?.textContent?.trim() || '',
        description: descEl?.textContent?.trim() || '',
        price: priceEl?.textContent?.trim() || '',
      });
    });
  }
  
  return {
    badge: attrs['data-badge'] || 'SERVICES',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Our Hosting Services',
    subtitle: attrs['data-subtitle'] || '',
    services,
  };
};

export const serializeHostingServicesDataToAttributes = (data: HostingServicesSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge,
    'data-title': data.title,
    'data-subtitle': data.subtitle,
    'data-services': JSON.stringify(data.services),
  };
};

// ============================================================================
// Why Choose Section Parsers/Serializers
// ============================================================================

export const parseWhyChooseDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): WhyChooseSectionData => {
  let reasons: { icon: string; title: string; description: string }[] = [];
  const reasonsJson = attrs['data-reasons'];
  
  if (reasonsJson) {
    try { reasons = JSON.parse(reasonsJson); } catch (e) { }
  }
  
  // Fallback: parse from DOM
  if (reasons.length === 0 && element) {
    const cards = element.querySelectorAll('[class*="bg-white"][class*="rounded-2xl"][class*="p-6"]');
    cards.forEach((card) => {
      const iconEl = card.querySelector('[class*="text-2xl"]');
      const titleEl = card.querySelector('h3');
      const descEl = card.querySelector('p');
      reasons.push({
        icon: iconEl?.textContent?.trim() || '⭐',
        title: titleEl?.textContent?.trim() || '',
        description: descEl?.textContent?.trim() || '',
      });
    });
  }
  
  return {
    badge: attrs['data-badge'] || 'WHY CHOOSE US',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'The Hosting Advantage',
    subtitle: attrs['data-subtitle'] || '',
    reasons,
  };
};

export const serializeWhyChooseDataToAttributes = (data: WhyChooseSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge,
    'data-title': data.title,
    'data-subtitle': data.subtitle,
    'data-reasons': JSON.stringify(data.reasons),
  };
};

// ============================================================================
// Need Help Section Parsers/Serializers
// ============================================================================

export const parseNeedHelpDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): NeedHelpSectionData => {
  let options: { icon: string; title: string; description: string; buttonText: string; buttonLink: string }[] = [];
  const optionsJson = attrs['data-options'];
  
  if (optionsJson) {
    try { options = JSON.parse(optionsJson); } catch (e) { }
  }
  
  // Fallback: parse from DOM
  if (options.length === 0 && element) {
    const cards = element.querySelectorAll('[class*="rounded-2xl"][class*="p-6"]');
    cards.forEach((card) => {
      const iconEl = card.querySelector('[class*="text-2xl"], [class*="text-3xl"]');
      const titleEl = card.querySelector('h3');
      const descEl = card.querySelector('p');
      const btnEl = card.querySelector('button, a');
      options.push({
        icon: iconEl?.textContent?.trim() || '💬',
        title: titleEl?.textContent?.trim() || '',
        description: descEl?.textContent?.trim() || '',
        buttonText: btnEl?.textContent?.trim() || 'Contact',
        buttonLink: btnEl?.getAttribute('href') || '#',
      });
    });
  }
  
  return {
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Need Help?',
    subtitle: attrs['data-subtitle'] || '',
    options,
  };
};

export const serializeNeedHelpDataToAttributes = (data: NeedHelpSectionData): Record<string, string> => {
  return {
    'data-title': data.title,
    'data-subtitle': data.subtitle,
    'data-options': JSON.stringify(data.options),
  };
};

// ============================================================================
// Legacy Helper Functions (for backwards compatibility)
// ============================================================================

export const detectSectionType = (component: any): SectionType | null => {
  const config = detectSectionFromComponent(component);
  return config?.type || null;
};

export const parseSectionData = (
  type: SectionType,
  component: any
): any => {
  const config = getSectionConfig(type);
  if (!config) return null;
  
  const attrs = component.getAttributes();
  const el = component.getEl();
  return config.parseData(attrs, el);
};

export const serializeSectionData = (
  type: SectionType,
  data: unknown
): Record<string, string> => {
  const config = getSectionConfig(type);
  if (!config) return {};
  return config.serializeData(data);
};

// ============================================================================
// Register All Sections
// ============================================================================

// Pricing Section
registerSection({
  type: 'pricing',
  displayName: 'Pricing Section',
  icon: DollarSign,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return (
      attrs['data-section'] === 'pricing' ||
      attrs['data-component'] === 'PricingSection' ||
      attrs['data-plan-count'] !== undefined
    );
  },
  parseData: parsePricingDataFromAttributes,
  serializeData: serializePricingDataToAttributes,
});

// Logo Carousel Section
registerSection({
  type: 'logo-carousel',
  displayName: 'Logo Carousel',
  icon: Image,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return (
      attrs['data-section'] === 'logo-carousel' ||
      attrs['data-component'] === 'LogoCarousel' ||
      attrs['data-logo-opacity'] !== undefined
    );
  },
  parseData: parseLogoCarouselDataFromAttributes,
  serializeData: serializeLogoCarouselDataToAttributes,
});

// Hero Section
registerSection({
  type: 'hero',
  displayName: 'Hero Section',
  icon: Layout,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'hero';
  },
  parseData: parseHeroDataFromAttributes,
  serializeData: serializeHeroDataToAttributes,
});

// Features Section
registerSection({
  type: 'features',
  displayName: 'Features Section',
  icon: Zap,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'features';
  },
  parseData: parseFeaturesDataFromAttributes,
  serializeData: serializeFeaturesDataToAttributes,
});

// FAQ Section
registerSection({
  type: 'faq',
  displayName: 'FAQ Section',
  icon: HelpCircle,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'faq';
  },
  parseData: parseFAQDataFromAttributes,
  serializeData: serializeFAQDataToAttributes,
});

// Testimonials Section
registerSection({
  type: 'testimonials',
  displayName: 'Testimonials',
  icon: MessageSquare,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'testimonials';
  },
  parseData: parseTestimonialsDataFromAttributes,
  serializeData: serializeTestimonialsDataToAttributes,
});

// CTA Section
registerSection({
  type: 'cta',
  displayName: 'Call to Action',
  icon: Megaphone,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'cta';
  },
  parseData: parseCTADataFromAttributes,
  serializeData: serializeCTADataToAttributes,
});

// Trusted By Section
registerSection({
  type: 'trusted-by',
  displayName: 'Trusted By',
  icon: Shield,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'trusted-by';
  },
  parseData: parseTrustedByDataFromAttributes,
  serializeData: serializeTrustedByDataToAttributes,
});

// Hosting Services Section
registerSection({
  type: 'hosting-services',
  displayName: 'Hosting Services',
  icon: Server,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'hosting-services';
  },
  parseData: parseHostingServicesDataFromAttributes,
  serializeData: serializeHostingServicesDataToAttributes,
});

// Why Choose Section
registerSection({
  type: 'why-choose',
  displayName: 'Why Choose Us',
  icon: Award,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'why-choose';
  },
  parseData: parseWhyChooseDataFromAttributes,
  serializeData: serializeWhyChooseDataToAttributes,
});

// Need Help Section
registerSection({
  type: 'need-help',
  displayName: 'Need Help',
  icon: Headphones,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'need-help';
  },
  parseData: parseNeedHelpDataFromAttributes,
  serializeData: serializeNeedHelpDataToAttributes,
});

// ============================================================================
// New Section Parsers/Serializers (Phase 2)
// ============================================================================

// Stats Counter Section
export const parseStatsCounterDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): StatsCounterSectionData => {
  let stats: StatsCounterSectionData['stats'] = [];
  const statsJson = attrs['data-stats'];
  
  if (statsJson) {
    try { stats = JSON.parse(statsJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || 'BY THE NUMBERS',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Trusted by Thousands',
    subtitle: attrs['data-subtitle'] || '',
    stats,
  };
};

export const serializeStatsCounterDataToAttributes = (data: StatsCounterSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title,
    'data-subtitle': data.subtitle || '',
    'data-stats': JSON.stringify(data.stats),
  };
};

// Steps Section
export const parseStepsDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): StepsSectionData => {
  let steps: StepsSectionData['steps'] = [];
  const stepsJson = attrs['data-steps'];
  
  if (stepsJson) {
    try { steps = JSON.parse(stepsJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || 'HOW IT WORKS',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Get Started',
    subtitle: attrs['data-subtitle'] || '',
    layout: (attrs['data-layout'] as 'horizontal' | 'vertical') || 'horizontal',
    steps,
  };
};

export const serializeStepsDataToAttributes = (data: StepsSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title,
    'data-subtitle': data.subtitle || '',
    'data-layout': data.layout,
    'data-steps': JSON.stringify(data.steps),
  };
};

// Announcement Banner Section
export const parseAnnouncementBannerDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): AnnouncementBannerSectionData => {
  return {
    text: attrs['data-text'] || element?.querySelector('p')?.textContent?.trim() || 'Special Offer!',
    linkText: attrs['data-link-text'] || '',
    linkUrl: attrs['data-link-url'] || '',
    backgroundColor: attrs['data-bg-color'] || 'hsl(82, 77%, 55%)',
    textColor: attrs['data-text-color'] || 'hsl(150, 20%, 10%)',
    dismissible: attrs['data-dismissible'] !== 'false',
  };
};

export const serializeAnnouncementBannerDataToAttributes = (data: AnnouncementBannerSectionData): Record<string, string> => {
  return {
    'data-text': data.text,
    'data-link-text': data.linkText || '',
    'data-link-url': data.linkUrl || '',
    'data-bg-color': data.backgroundColor || '',
    'data-text-color': data.textColor || '',
    'data-dismissible': String(data.dismissible),
  };
};

// Icon Features Section
export const parseIconFeaturesDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): IconFeaturesSectionData => {
  let features: IconFeaturesSectionData['features'] = [];
  const featuresJson = attrs['data-features'];
  
  if (featuresJson) {
    try { features = JSON.parse(featuresJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || 'WHAT WE OFFER',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Everything You Need',
    subtitle: attrs['data-subtitle'] || '',
    columns: (parseInt(attrs['data-columns'] || '3', 10) as 2 | 3 | 4) || 3,
    features,
  };
};

export const serializeIconFeaturesDataToAttributes = (data: IconFeaturesSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title,
    'data-subtitle': data.subtitle || '',
    'data-columns': String(data.columns),
    'data-features': JSON.stringify(data.features),
  };
};

// Alternating Features Section
export const parseAlternatingFeaturesDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): AlternatingFeaturesSectionData => {
  let blocks: AlternatingFeaturesSectionData['blocks'] = [];
  const blocksJson = attrs['data-blocks'];
  
  if (blocksJson) {
    try { blocks = JSON.parse(blocksJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || '',
    title: attrs['data-title'] || '',
    blocks,
  };
};

export const serializeAlternatingFeaturesDataToAttributes = (data: AlternatingFeaturesSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title || '',
    'data-blocks': JSON.stringify(data.blocks),
  };
};

// ============================================================================
// Register New Sections (Phase 2)
// ============================================================================

// Stats Counter Section
registerSection({
  type: 'stats-counter',
  displayName: 'Stats Counter',
  icon: BarChart3,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'stats-counter';
  },
  parseData: parseStatsCounterDataFromAttributes,
  serializeData: serializeStatsCounterDataToAttributes,
});

// Steps Section
registerSection({
  type: 'steps',
  displayName: 'Steps',
  icon: ListOrdered,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'steps';
  },
  parseData: parseStepsDataFromAttributes,
  serializeData: serializeStepsDataToAttributes,
});

// Announcement Banner Section
registerSection({
  type: 'announcement-banner',
  displayName: 'Announcement Banner',
  icon: Bell,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'announcement-banner';
  },
  parseData: parseAnnouncementBannerDataFromAttributes,
  serializeData: serializeAnnouncementBannerDataToAttributes,
});

// Icon Features Section
registerSection({
  type: 'icon-features',
  displayName: 'Icon Features',
  icon: Grid3X3,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'icon-features';
  },
  parseData: parseIconFeaturesDataFromAttributes,
  serializeData: serializeIconFeaturesDataToAttributes,
});

// Alternating Features Section
registerSection({
  type: 'alternating-features',
  displayName: 'Alternating Features',
  icon: Columns,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'alternating-features';
  },
  parseData: parseAlternatingFeaturesDataFromAttributes,
  serializeData: serializeAlternatingFeaturesDataToAttributes,
});

// ============================================================================
// Phase 3 Section Parsers/Serializers
// ============================================================================

// OS Selector Section
export const parseOSSelectorDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): OSSelectorSectionData => {
  let items: OSSelectorSectionData['items'] = [];
  let categories: string[] = [];
  
  const itemsJson = attrs['data-items'];
  const categoriesJson = attrs['data-categories'];
  
  if (itemsJson) {
    try { items = JSON.parse(itemsJson); } catch (e) { }
  }
  if (categoriesJson) {
    try { categories = JSON.parse(categoriesJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || 'ONE-CLICK INSTALL',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Choose Your OS',
    subtitle: attrs['data-subtitle'] || '',
    categories: categories.length > 0 ? categories : ['Operating Systems'],
    items,
  };
};

export const serializeOSSelectorDataToAttributes = (data: OSSelectorSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title,
    'data-subtitle': data.subtitle || '',
    'data-categories': JSON.stringify(data.categories),
    'data-items': JSON.stringify(data.items),
  };
};

// Data Center Section
export const parseDataCenterDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): DataCenterSectionData => {
  let locations: DataCenterSectionData['locations'] = [];
  const locationsJson = attrs['data-locations'];
  
  if (locationsJson) {
    try { locations = JSON.parse(locationsJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || 'GLOBAL NETWORK',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Data Centers',
    subtitle: attrs['data-subtitle'] || '',
    locations,
  };
};

export const serializeDataCenterDataToAttributes = (data: DataCenterSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title,
    'data-subtitle': data.subtitle || '',
    'data-locations': JSON.stringify(data.locations),
  };
};

// Bento Grid Section
export const parseBentoGridDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): BentoGridSectionData => {
  let items: BentoGridSectionData['items'] = [];
  const itemsJson = attrs['data-items'];
  
  if (itemsJson) {
    try { items = JSON.parse(itemsJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || 'WHY US',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'The Complete Solution',
    subtitle: attrs['data-subtitle'] || '',
    items,
  };
};

export const serializeBentoGridDataToAttributes = (data: BentoGridSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title,
    'data-subtitle': data.subtitle || '',
    'data-items': JSON.stringify(data.items),
  };
};

// Awards Section
export const parseAwardsDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): AwardsSectionData => {
  let awards: AwardsSectionData['awards'] = [];
  const awardsJson = attrs['data-awards'];
  
  if (awardsJson) {
    try { awards = JSON.parse(awardsJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || 'RECOGNITION',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Award-Winning',
    subtitle: attrs['data-subtitle'] || '',
    awards,
  };
};

export const serializeAwardsDataToAttributes = (data: AwardsSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title,
    'data-subtitle': data.subtitle || '',
    'data-awards': JSON.stringify(data.awards),
  };
};

// Plans Comparison Section
export const parsePlansComparisonDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): PlansComparisonSectionData => {
  let plans: PlansComparisonSectionData['plans'] = [];
  let features: PlansComparisonSectionData['features'] = [];
  
  const plansJson = attrs['data-plans'];
  const featuresJson = attrs['data-comp-features'];
  
  if (plansJson) {
    try { plans = JSON.parse(plansJson); } catch (e) { }
  }
  if (featuresJson) {
    try { features = JSON.parse(featuresJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || 'COMPARE PLANS',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Find Your Perfect Plan',
    subtitle: attrs['data-subtitle'] || '',
    plans,
    features,
  };
};

export const serializePlansComparisonDataToAttributes = (data: PlansComparisonSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title,
    'data-subtitle': data.subtitle || '',
    'data-plans': JSON.stringify(data.plans),
    'data-comp-features': JSON.stringify(data.features),
  };
};

// ============================================================================
// Register Phase 3 Sections
// ============================================================================

// OS Selector Section
registerSection({
  type: 'os-selector',
  displayName: 'OS Selector',
  icon: Monitor,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'os-selector';
  },
  parseData: parseOSSelectorDataFromAttributes,
  serializeData: serializeOSSelectorDataToAttributes,
});

// Data Center Section
registerSection({
  type: 'data-center',
  displayName: 'Data Centers',
  icon: Globe,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'data-center';
  },
  parseData: parseDataCenterDataFromAttributes,
  serializeData: serializeDataCenterDataToAttributes,
});

// Bento Grid Section
registerSection({
  type: 'bento-grid',
  displayName: 'Bento Grid',
  icon: LayoutGrid,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'bento-grid';
  },
  parseData: parseBentoGridDataFromAttributes,
  serializeData: serializeBentoGridDataToAttributes,
});

// Awards Section
registerSection({
  type: 'awards',
  displayName: 'Awards',
  icon: Trophy,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'awards';
  },
  parseData: parseAwardsDataFromAttributes,
  serializeData: serializeAwardsDataToAttributes,
});

// Plans Comparison Section
registerSection({
  type: 'plans-comparison',
  displayName: 'Plans Comparison',
  icon: Table,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'plans-comparison';
  },
  parseData: parsePlansComparisonDataFromAttributes,
  serializeData: serializePlansComparisonDataToAttributes,
});

// ============================================================================
// Phase 4 Section Parsers/Serializers
// ============================================================================

// Blog Grid Section
export const parseBlogGridDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): BlogGridSectionData => {
  let articles: BlogGridSectionData['articles'] = [];
  const articlesJson = attrs['data-articles'];
  
  if (articlesJson) {
    try { articles = JSON.parse(articlesJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || 'BLOG',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Latest Articles',
    subtitle: attrs['data-subtitle'] || '',
    articles,
  };
};

export const serializeBlogGridDataToAttributes = (data: BlogGridSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title,
    'data-subtitle': data.subtitle || '',
    'data-articles': JSON.stringify(data.articles),
  };
};

// Contact Section
export const parseContactDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): ContactSectionData => {
  let channels: ContactSectionData['channels'] = [];
  const channelsJson = attrs['data-channels'];
  
  if (channelsJson) {
    try { channels = JSON.parse(channelsJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || 'CONTACT',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Get in Touch',
    subtitle: attrs['data-subtitle'] || '',
    channels,
  };
};

export const serializeContactDataToAttributes = (data: ContactSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title,
    'data-subtitle': data.subtitle || '',
    'data-channels': JSON.stringify(data.channels),
  };
};

// Server Specs Section
export const parseServerSpecsDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): ServerSpecsSectionData => {
  let specs: ServerSpecsSectionData['specs'] = [];
  const specsJson = attrs['data-specs'];
  
  if (specsJson) {
    try { specs = JSON.parse(specsJson); } catch (e) { }
  }
  
  return {
    badge: attrs['data-badge'] || 'SERVERS',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || 'Server Configurations',
    subtitle: attrs['data-subtitle'] || '',
    specs,
  };
};

export const serializeServerSpecsDataToAttributes = (data: ServerSpecsSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title,
    'data-subtitle': data.subtitle || '',
    'data-specs': JSON.stringify(data.specs),
  };
};

// Video Section
export const parseVideoDataFromAttributes = (
  attrs: Record<string, string>,
  element?: HTMLElement | null
): VideoSectionData => {
  return {
    badge: attrs['data-badge'] || '',
    title: attrs['data-title'] || element?.querySelector('h2')?.textContent?.trim() || '',
    subtitle: attrs['data-subtitle'] || '',
    videoUrl: attrs['data-video-url'] || '',
    thumbnailUrl: attrs['data-thumbnail-url'] || '',
    overlayText: attrs['data-overlay-text'] || '',
    autoplay: attrs['data-autoplay'] === 'true',
  };
};

export const serializeVideoDataToAttributes = (data: VideoSectionData): Record<string, string> => {
  return {
    'data-badge': data.badge || '',
    'data-title': data.title || '',
    'data-subtitle': data.subtitle || '',
    'data-video-url': data.videoUrl,
    'data-thumbnail-url': data.thumbnailUrl || '',
    'data-overlay-text': data.overlayText || '',
    'data-autoplay': String(data.autoplay || false),
  };
};

// ============================================================================
// Register Phase 4 Sections
// ============================================================================

// Blog Grid Section
registerSection({
  type: 'blog-grid',
  displayName: 'Blog Grid',
  icon: Newspaper,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'blog-grid';
  },
  parseData: parseBlogGridDataFromAttributes,
  serializeData: serializeBlogGridDataToAttributes,
});

// Contact Section
registerSection({
  type: 'contact',
  displayName: 'Contact',
  icon: Phone,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'contact';
  },
  parseData: parseContactDataFromAttributes,
  serializeData: serializeContactDataToAttributes,
});

// Server Specs Section
registerSection({
  type: 'server-specs',
  displayName: 'Server Specs',
  icon: HardDrive,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'server-specs';
  },
  parseData: parseServerSpecsDataFromAttributes,
  serializeData: serializeServerSpecsDataToAttributes,
});

// Video Section
registerSection({
  type: 'video',
  displayName: 'Video',
  icon: Video,
  detectFromComponent: (component: any) => {
    const attrs = component.getAttributes();
    return attrs['data-section'] === 'video';
  },
  parseData: parseVideoDataFromAttributes,
  serializeData: serializeVideoDataToAttributes,
});
