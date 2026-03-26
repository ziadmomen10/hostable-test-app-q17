/**
 * Page Data Migration Utilities
 * 
 * Converts between legacy HTML content and new JSON PageData format.
 * Supports bidirectional migration for gradual rollout.
 */

import { PageData, SectionInstance } from '@/types/reactEditor';
import { SectionType } from '@/types/pageEditor';

// ============================================================================
// Parse Section Type from HTML
// ============================================================================

function detectSectionType(element: Element): SectionType | null {
  const dataSection = element.getAttribute('data-section');
  if (dataSection) {
    return dataSection as SectionType;
  }

  // Detect from class names or content patterns
  const className = element.className || '';
  const innerHTML = element.innerHTML || '';

  // Hero detection
  if (className.includes('hero') || element.querySelector('h1')) {
    return 'hero';
  }

  // Pricing detection
  if (className.includes('pricing') || innerHTML.includes('data-plan-')) {
    return 'pricing';
  }

  // FAQ detection
  if (className.includes('faq') || innerHTML.includes('accordion')) {
    return 'faq';
  }

  // Features detection
  if (className.includes('features') || className.includes('feature')) {
    return 'features';
  }

  // CTA detection
  if (className.includes('cta') || (element.querySelectorAll('button').length >= 2 && element.querySelector('h2'))) {
    return 'cta';
  }

  // Testimonials detection
  if (className.includes('testimonial') || innerHTML.includes('rating')) {
    return 'testimonials';
  }

  // Logo carousel detection
  if (className.includes('logo') || className.includes('carousel') || className.includes('marquee')) {
    return 'logo-carousel';
  }

  return 'generic';
}

// ============================================================================
// Parse Section Props from HTML
// ============================================================================

function parseSectionProps(element: Element, type: SectionType): Record<string, any> {
  const attrs = element.attributes;
  const props: Record<string, any> = {};

  // Extract all data-* attributes as props
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr.name.startsWith('data-') && attr.name !== 'data-section') {
      const key = attr.name.replace('data-', '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      
      // Try to parse JSON values
      try {
        props[key] = JSON.parse(attr.value);
      } catch {
        // Keep as string if not valid JSON
        props[key] = attr.value;
      }
    }
  }

  // Type-specific parsing
  switch (type) {
    case 'hero':
      return parseHeroProps(element, props);
    case 'pricing':
      return parsePricingProps(element, props);
    case 'features':
      return parseFeaturesProps(element, props);
    case 'faq':
      return parseFAQProps(element, props);
    case 'testimonials':
      return parseTestimonialsProps(element, props);
    case 'cta':
      return parseCTAProps(element, props);
    default:
      return props;
  }
}

function parseHeroProps(element: Element, baseProps: Record<string, any>): Record<string, any> {
  const h1 = element.querySelector('h1');
  const subtitle = element.querySelector('h1 + p, .subtitle, [class*="subtitle"]');
  const buttons = element.querySelectorAll('button, a[class*="btn"], a[class*="button"]');

  return {
    title: baseProps.title || h1?.textContent?.trim() || 'Welcome',
    subtitle: baseProps.subtitle || subtitle?.textContent?.trim() || '',
    highlightedText: baseProps.highlighted || '',
    primaryButtonText: baseProps.primaryBtn || buttons[0]?.textContent?.trim() || 'Get Started',
    secondaryButtonText: baseProps.secondaryBtn || buttons[1]?.textContent?.trim() || 'Learn More',
    ...baseProps,
  };
}

function parsePricingProps(element: Element, baseProps: Record<string, any>): Record<string, any> {
  const title = element.querySelector('h2')?.textContent?.trim() || 'Pricing';
  const subtitle = element.querySelector('h2 + p')?.textContent?.trim() || '';
  
  // Parse plans from data attributes or DOM
  const plans = [];
  for (let i = 1; i <= 10; i++) {
    const name = baseProps[`plan${i}Name`];
    if (name) {
      plans.push({
        name,
        description: baseProps[`plan${i}Desc`] || '',
        price: baseProps[`plan${i}Price`] || '',
        originalPrice: baseProps[`plan${i}OriginalPrice`] || '',
        discount: baseProps[`plan${i}Discount`] || '',
        period: baseProps[`plan${i}Period`] || '/mo',
        buttonText: baseProps[`plan${i}Button`] || 'Get Started',
        highlighted: baseProps[`plan${i}Highlighted`] === 'true',
        featureValues: {},
      });
    }
  }

  return {
    title: baseProps.title || title,
    subtitle: baseProps.subtitle || subtitle,
    planCount: plans.length || 3,
    useCarousel: baseProps.useCarousel === 'true',
    plans: plans.length > 0 ? plans : undefined,
    ...baseProps,
  };
}

function parseFeaturesProps(element: Element, baseProps: Record<string, any>): Record<string, any> {
  const badge = element.querySelector('[class*="badge"], [class*="uppercase"]')?.textContent?.trim();
  const title = element.querySelector('h2')?.textContent?.trim();
  const subtitle = element.querySelector('h2 + p')?.textContent?.trim();

  // Try to parse features from DOM
  let features = baseProps.features;
  if (!features) {
    const featureCards = element.querySelectorAll('[class*="feature"], [class*="card"]');
    features = Array.from(featureCards).slice(0, 6).map(card => ({
      icon: card.querySelector('[class*="icon"]')?.textContent?.trim() || '⭐',
      title: card.querySelector('h3, h4')?.textContent?.trim() || '',
      description: card.querySelector('p')?.textContent?.trim() || '',
    })).filter(f => f.title);
  }

  return {
    badge: baseProps.badge || badge || 'FEATURES',
    title: baseProps.title || title || 'Features',
    subtitle: baseProps.subtitle || subtitle || '',
    features: features || [],
    ...baseProps,
  };
}

function parseFAQProps(element: Element, baseProps: Record<string, any>): Record<string, any> {
  const title = element.querySelector('h2')?.textContent?.trim();

  let faqs = baseProps.faqs;
  if (!faqs) {
    const faqItems = element.querySelectorAll('[class*="accordion"], [class*="faq"]');
    faqs = Array.from(faqItems).map(item => ({
      question: item.querySelector('button, [class*="trigger"], [class*="question"]')?.textContent?.trim() || '',
      answer: item.querySelector('[class*="content"], [class*="answer"], p')?.textContent?.trim() || '',
    })).filter(f => f.question);
  }

  return {
    badge: baseProps.badge || 'FAQ',
    title: baseProps.title || title || 'Frequently Asked Questions',
    faqs: faqs || [],
    ...baseProps,
  };
}

function parseTestimonialsProps(element: Element, baseProps: Record<string, any>): Record<string, any> {
  const title = element.querySelector('h2')?.textContent?.trim();

  return {
    badge: baseProps.badge || 'TESTIMONIALS',
    title: baseProps.title || title || 'What Our Customers Say',
    testimonials: baseProps.testimonials || [],
    ...baseProps,
  };
}

function parseCTAProps(element: Element, baseProps: Record<string, any>): Record<string, any> {
  const title = element.querySelector('h2')?.textContent?.trim();
  const subtitle = element.querySelector('p')?.textContent?.trim();
  const buttons = element.querySelectorAll('button');

  return {
    title: baseProps.title || title || 'Ready to Get Started?',
    subtitle: baseProps.subtitle || subtitle || '',
    primaryButtonText: baseProps.primaryBtn || buttons[0]?.textContent?.trim() || 'Get Started',
    secondaryButtonText: baseProps.secondaryBtn || buttons[1]?.textContent?.trim() || 'Contact Sales',
    ...baseProps,
  };
}

// ============================================================================
// Convert HTML to PageData
// ============================================================================

export function htmlToPageData(
  html: string,
  pageId: string,
  metadata?: { title?: string; description?: string }
): PageData {
  // Create a temporary DOM to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find all sections
  const sectionElements = doc.querySelectorAll('section, [data-section], main > div');
  
  const sections: SectionInstance[] = [];
  
  sectionElements.forEach((element, index) => {
    const type = detectSectionType(element);
    if (!type) return;

    const props = parseSectionProps(element, type);
    
    sections.push({
      id: element.id || `section-${index}-${Date.now()}`,
      type,
      props,
      order: index,
      visible: true,
    });
  });

  return {
    id: pageId,
    version: 1,
    sections,
    metadata: {
      title: metadata?.title || 'Untitled Page',
      description: metadata?.description,
      lastModified: new Date().toISOString(),
    },
  };
}

// ============================================================================
// Check if content is already PageData JSON
// ============================================================================

export function isPageDataJson(content: string | null): boolean {
  if (!content) return false;
  try {
    const parsed = JSON.parse(content);
    // Proper format: {"version": 1, "sections": [...]}
    if (parsed && typeof parsed === 'object' && 'sections' in parsed && 'version' in parsed) {
      return true;
    }
    // Malformed format: Just an array of sections [{...}, {...}]
    // This is still JSON page data, just saved in wrong format
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.type && parsed[0]?.props) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ============================================================================
// Parse content (handles both HTML and JSON)
// ============================================================================

export function parsePageContent(
  content: string | null,
  pageId: string,
  metadata?: { title?: string; description?: string }
): PageData | null {
  if (!content) {
    // Return empty page data
    return {
      id: pageId,
      version: 1,
      sections: [],
      metadata: {
        title: metadata?.title || 'New Page',
        lastModified: new Date().toISOString(),
      },
    };
  }

  // Try to parse as JSON
  try {
    const parsed = JSON.parse(content);
    
    // Proper format - already has version and sections
    if (parsed && typeof parsed === 'object' && 'sections' in parsed && 'version' in parsed) {
      return parsed as PageData;
    }
    
    // MALFORMED FORMAT FIX: Content is just an array of sections [{...}, {...}]
    // This can happen if pageData.sections was saved instead of pageData
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.type) {
      console.warn('[parsePageContent] Detected malformed array-only content, normalizing to PageData format');
      return {
        id: pageId,
        version: 1,
        sections: parsed,
        metadata: {
          title: metadata?.title || 'Page',
          lastModified: new Date().toISOString(),
        },
      };
    }
  } catch {
    // Not valid JSON, fall through to HTML parsing
  }

  // Convert from HTML
  return htmlToPageData(content, pageId, metadata);
}

// ============================================================================
// Export PageData as JSON string for saving
// ============================================================================

export function pageDataToJson(pageData: PageData): string {
  return JSON.stringify(pageData, null, 2);
}
