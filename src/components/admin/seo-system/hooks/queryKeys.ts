/**
 * SEO Query Keys Factory
 * 
 * Centralized query key management for React Query cache.
 * Ensures consistency across all SEO-related queries.
 * 
 * Gap A1: Centralize query keys
 */

export const seoQueryKeys = {
  all: ['seo'] as const,
  
  // Page SEO data
  pageSeo: (pageId: string, languageCode: string) => 
    ['page-seo', pageId, languageCode] as const,
  
  // All language variants for a page
  pageSeoLanguages: (pageId: string) => 
    ['page-seo-languages', pageId] as const,
  
  // Analysis scores
  analysis: (pageId: string, languageCode: string) => 
    ['seo-analysis', pageId, languageCode] as const,
  
  // SEO history
  history: (pageId: string, languageCode: string) => 
    ['seo-history', pageId, languageCode] as const,
  
  // Topic clusters
  topicClusters: () => ['seo-topic-clusters'] as const,
  
  // Content briefs
  contentBrief: (pageId: string, languageCode: string) => 
    ['seo-content-brief', pageId, languageCode] as const,
  
  // Score history - Gap A1: Added days parameter for complete centralization
  scoreHistory: (pageId: string, languageCode: string, days: number) => 
    ['seo-score-history', pageId, languageCode, days] as const,
};
