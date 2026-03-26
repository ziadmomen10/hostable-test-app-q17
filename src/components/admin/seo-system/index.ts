/**
 * SEO System - Decoupled from Page Builder
 * 
 * This module provides SEO, AEO, and GEO optimization tools
 * with zero dependencies on the editor modules.
 */

// Core components
export { SEODashboard } from './SEODashboard';
export { SEOPageSelector } from './SEOPageSelector';
export { SEOPagePreview } from './SEOPagePreview';
export { SEOScoreGauge } from './SEOScoreGauge';
export { SEOLanguageSelector } from './SEOLanguageSelector';

// Panels
export { OverviewPanel } from './panels/OverviewPanel';
export { MetaPanel } from './panels/MetaPanel';
export { ContentPanel } from './panels/ContentPanel';
export { TechnicalPanel } from './panels/TechnicalPanel';
export { AEOPanel } from './panels/AEOPanel';
export { GEOPanel } from './panels/GEOPanel';

// Hooks
export { useSEOAnalysis } from './hooks/useSEOAnalysis';
export { useBrokenLinkChecker } from './hooks/useBrokenLinkChecker';
