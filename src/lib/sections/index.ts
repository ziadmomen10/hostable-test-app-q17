/**
 * Section Definitions - Barrel Export
 * 
 * Imports and registers all section definitions, then re-exports the registry API.
 */

// Import registry functions first
export {
  registerSection,
  createSettingsWrapper,
  getSectionDefinition,
  getAllSectionDefinitions,
  getSectionsByCategory,
  createSectionInstance,
  sectionDefinitions,
} from './registry';

// Export types
export type { SectionDefinition, SectionInstanceData, DndArrayConfig } from './types';

// Import all section definitions (side-effect imports that register sections)
import './definitions/hero';
import './definitions/pricing';
import './definitions/features';
import './definitions/faq';
import './definitions/testimonials';
import './definitions/cta';
import './definitions/trusted-by';
import './definitions/hosting-services';
import './definitions/why-choose';
import './definitions/need-help';
import './definitions/logo-carousel';
import './definitions/stats-counter';
import './definitions/steps';
import './definitions/announcement-banner';
import './definitions/icon-features';
import './definitions/alternating-features';
import './definitions/os-selector';
import './definitions/data-center';
import './definitions/bento-grid';
import './definitions/awards';
import './definitions/plans-comparison';
import './definitions/blog-grid';
import './definitions/contact';
import './definitions/server-specs';
import './definitions/video';
import './definitions/team-members';
import './definitions/careers';
import './definitions/partners';
import './definitions/legal';
import './definitions/v2-business-suite';
import './definitions/v2-hosting-options';
import './definitions/v2-benefits';
import './definitions/v2-career-cta';
import './definitions/v2-career-talent-pool';
import './definitions/v2-career-benefits';
import './definitions/v2-career-values';
import './definitions/v2-career-gallery';
import './definitions/v2-career-faq';
import './definitions/v2-career-hero';
import './definitions/v2-career-openings';
import './definitions/v2-career-hero2';
import './definitions/v2-career-gallery2';
import './definitions/v2-career-talent-pool2';
import './definitions/v2-career-values2';
import './definitions/v2-career-benefits2';
import './definitions/v2-career-faq2';
import './definitions/v2-career-cta3';
import './definitions/v2-site-benefits';
import './definitions/v2-hostings-features';
import './definitions/v2-job-title-hero';
import './definitions/v2-job-description';
import './definitions/v2-job-gallery';
import './definitions/v2-job-faq';
import './definitions/v2-job-cta';
import './definitions/v2-site-footer';
import './definitions/v2-job-post-navbar';
import './definitions/v2-job-post-hero';
import './definitions/v2-job-post-description';
import './definitions/v2-job-post-gallery';
import './definitions/v2-job-post-faq';
import './definitions/v2-job-post-cta';
import './definitions/v2-job-post-footer';
import './definitions/v2-affiliate-hero';
import './definitions/v2-affiliate-how-it-works';
import './definitions/v2-affiliate-about';
import './definitions/v2-affiliate-migration';
import './definitions/v2-affiliate-who-is-it-for';
import './definitions/v2-affiliate-payment-methods';
import './definitions/v2-affiliate-faq';
import './definitions/v2-affiliate-call-to-action';
import './definitions/v2-affiliate-reviews';
