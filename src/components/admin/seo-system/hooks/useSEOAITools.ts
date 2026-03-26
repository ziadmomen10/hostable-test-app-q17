/**
 * useSEOAITools
 * 
 * Hook for AI-powered SEO tool integrations.
 * Provides methods to generate meta, FAQ, voice optimizations, etc.
 * 
 * Gap S1: Includes offline caching layer for resilience
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Gap S1: AI Cache Configuration
const AI_CACHE_KEY = 'seo-ai-cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedResult<T> {
  data: T;
  timestamp: number;
  pageId: string;
  languageCode: string;
  action: string;
}

// Cache helper functions
function getCacheKey(pageId: string, languageCode: string, action: string): string {
  return `${pageId}-${languageCode}-${action}`;
}

function getCache(): Record<string, CachedResult<any>> {
  try {
    const cached = localStorage.getItem(AI_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
}

function setCache(cache: Record<string, CachedResult<any>>): void {
  try {
    localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage errors
  }
}

function getCachedResult<T>(pageId: string, languageCode: string, action: string): CachedResult<T> | null {
  const cache = getCache();
  const key = getCacheKey(pageId, languageCode, action);
  const cached = cache[key];
  
  if (!cached) return null;
  
  // Check if cache is expired
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    // Remove expired entry
    delete cache[key];
    setCache(cache);
    return null;
  }
  
  return cached;
}

function cacheResult<T>(pageId: string, languageCode: string, action: string, data: T): void {
  const cache = getCache();
  const key = getCacheKey(pageId, languageCode, action);
  
  cache[key] = {
    data,
    timestamp: Date.now(),
    pageId,
    languageCode,
    action,
  };
  
  setCache(cache);
}

// Response Types
export interface MetaSuggestion {
  title: string;
  description: string;
  titleCharCount: number;
  descriptionCharCount: number;
  reasoning?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQResult {
  faqs: FAQItem[];
  schema: any; // JSON-LD schema
}

export interface VoiceOptimization {
  featuredSnippet: {
    question: string;
    answer: string;
    type: 'paragraph' | 'list' | 'table';
  };
  conversationalRewrites: Array<{
    original: string;
    rewritten: string;
    improvement: string;
  }>;
  suggestedQuestions: string[];
}

export interface EntitySchema {
  schema: any; // JSON-LD schema
  suggestions: string[];
  missingElements: string[];
}

export interface FactEnrichment {
  suggestions: Array<{
    type: 'statistic' | 'research' | 'definition' | 'comparison' | 'example';
    suggestion: string;
    placement: string;
    citabilityImpact: 'high' | 'medium' | 'low';
  }>;
  currentFactDensity: 'low' | 'medium' | 'high';
  overallRecommendation: string;
}

export interface KeywordSuggestion {
  primaryKeyword: {
    keyword: string;
    reasoning: string;
  };
  secondaryKeywords: Array<{
    keyword: string;
    type: 'lsi' | 'long-tail' | 'question' | 'related';
    usage: string;
  }>;
  placementMatrix: {
    title: boolean;
    h1: boolean;
    h2: boolean;
    firstParagraph: boolean;
    url: boolean;
    metaDescription: boolean;
  };
}

// New Phase 2 Response Types
export interface ContentBriefResult {
  targetWordCount: number;
  headingStructure: Array<{ level: 'h1' | 'h2' | 'h3'; text: string }>;
  questionsToAnswer: Array<{ question: string; searchIntent: string; priority: string }>;
  semanticKeywords: Array<{ keyword: string; intent: 'informational' | 'navigational' | 'transactional' | 'commercial' }>;
  competitorInsights?: string;
}

export interface AICitationResult {
  citableSnippets: Array<{
    snippet: string;
    type: 'definition' | 'statistic' | 'fact' | 'quote' | 'comparison';
    citabilityScore: number;
  }>;
  statisticSuggestions?: string[];
  overallCitabilityScore: number;
  recommendations: string[];
}

export interface LLMVisibilityResult {
  overallScore: number;
  breakdown: {
    factDensity: number;
    directAnswers: number;
    authoritySignals: number;
    structuredData: number;
    uniqueInsights: number;
  };
  strengths: string[];
  improvements: string[];
}

export interface AnswerBoxResult {
  paragraphFormat: { question: string; answer: string };
  listFormat: { question: string; items: string[]; listType: 'ordered' | 'unordered' };
  tableFormat?: { question: string; headers: string[]; rows: string[][] };
  definitionFormat?: { term: string; definition: string };
  recommendedFormat: 'paragraph' | 'list' | 'table' | 'definition';
}

export interface RefreshSuggestionsResult {
  urgency: 'low' | 'medium' | 'high' | 'critical';
  outdatedElements: Array<{ element: string; issue: string; suggestion: string }>;
  newSections: Array<{ title: string; description: string; priority: 'low' | 'medium' | 'high' }>;
  competitorGaps?: string[];
  overallRecommendation: string;
}

export interface EntityInput {
  type: 'Organization' | 'Person';
  name?: string;
  url?: string;
  socialLinks?: string[];
}

type ActionType = 'generate_meta' | 'generate_faq' | 'optimize_voice' | 'build_entity' | 'enrich_facts' | 'suggest_keywords' | 'generate_content_brief' | 'optimize_ai_citation' | 'analyze_llm_visibility' | 'optimize_answer_box' | 'generate_refresh_suggestions';

interface UseSEOAIToolsOptions {
  pageId: string;
  languageCode: string;
  content?: string;
  pageTitle?: string;
  pageUrl?: string;
  focusKeyword?: string;
}

export function useSEOAITools(options: UseSEOAIToolsOptions) {
  const [loadingStates, setLoadingStates] = useState<Record<ActionType, boolean>>({
    generate_meta: false,
    generate_faq: false,
    optimize_voice: false,
    build_entity: false,
    enrich_facts: false,
    suggest_keywords: false,
    generate_content_brief: false,
    optimize_ai_citation: false,
    analyze_llm_visibility: false,
    optimize_answer_box: false,
    generate_refresh_suggestions: false,
  });
  const [error, setError] = useState<Error | null>(null);

  // Fetch translated content for non-English languages
  const getTranslatedContent = useCallback(async (): Promise<string> => {
    if (options.languageCode === 'en' || !options.pageId) {
      return options.content || '';
    }

    try {
      // Get language ID
      const { data: langData } = await supabase
        .from('languages')
        .select('id')
        .eq('code', options.languageCode)
        .maybeSingle();
      
      if (!langData) return options.content || '';

      // Get page slug from URL
      const { data: pageData } = await supabase
        .from('pages')
        .select('page_url')
        .eq('id', options.pageId)
        .single();
      
      const pageSlug = pageData?.page_url?.replace(/^\//, '') || '';
      
      // Fetch translations for this page
      const { data: translations } = await supabase
        .from('translations')
        .select('key, value')
        .eq('language_id', langData.id)
        .like('key', `page.${pageSlug}.%`)
        .not('value', 'is', null);
      
      if (translations?.length) {
        // Combine translated values for AI analysis
        const translatedParts = translations.map(t => t.value).filter(Boolean);
        return translatedParts.join('\n\n');
      }
    } catch (err) {
      console.warn('[useSEOAITools] Failed to fetch translations:', err);
    }

    return options.content || '';
  }, [options.languageCode, options.pageId, options.content]);

  // Gap S1: Generic API call handler with offline caching
  const callAPI = useCallback(async <T>(
    action: ActionType, 
    additionalContext?: Record<string, any>
  ): Promise<T | null> => {
    setLoadingStates(prev => ({ ...prev, [action]: true }));
    setError(null);

    try {
      // Get translated content for non-English languages
      const contentForAI = await getTranslatedContent();
      
      const { data, error: fnError } = await supabase.functions.invoke('seo-ai-tools', {
        body: {
          action,
          pageId: options.pageId,
          languageCode: options.languageCode,
          content: contentForAI,
          context: {
            pageTitle: options.pageTitle,
            pageUrl: options.pageUrl,
            focusKeyword: options.focusKeyword,
            ...additionalContext,
          },
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      // Gap S1: Cache successful result
      cacheResult(options.pageId, options.languageCode, action, data);

      return data as T;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      // Gap S1: Try to return cached result on failure
      const cached = getCachedResult<T>(options.pageId, options.languageCode, action);
      if (cached) {
        toast.info('Using cached result (AI service unavailable)', {
          description: 'Results may be outdated',
          duration: 5000,
        });
        return cached.data;
      }
      
      // Show user-friendly toast for common errors
      if (error.message.includes('Rate limit')) {
        toast.error("Rate limit exceeded. Please wait a moment and try again.");
      } else if (error.message.includes('credits exhausted') || error.message.includes('Payment')) {
        toast.error("AI credits exhausted. Switch provider in System Settings or add credits.");
      } else if (error.message.includes('not configured')) {
        toast.error("AI API key not configured. Check Supabase Edge Function secrets.");
      } else if (error.message.includes('Invalid') && error.message.includes('API key')) {
        toast.error("Invalid API key. Check your key in Supabase Edge Function secrets.");
      } else {
        toast.error(`AI generation failed: ${error.message}`);
      }
      
      return null;
    } finally {
      setLoadingStates(prev => ({ ...prev, [action]: false }));
    }
  }, [options, getTranslatedContent]);

  // Generate Meta Title & Description
  const generateMeta = useCallback(async (): Promise<MetaSuggestion | null> => {
    const result = await callAPI<MetaSuggestion>('generate_meta');
    if (result) {
      toast.success("Meta generated - AI has created title and description suggestions");
    }
    return result;
  }, [callAPI]);

  // Generate FAQ Schema
  const generateFAQ = useCallback(async (): Promise<FAQResult | null> => {
    const result = await callAPI<FAQResult>('generate_faq');
    if (result) {
      toast.success(`FAQ generated - ${result.faqs?.length || 0} items with schema`);
    }
    return result;
  }, [callAPI]);

  // Optimize for Voice Search
  const optimizeVoice = useCallback(async (): Promise<VoiceOptimization | null> => {
    const result = await callAPI<VoiceOptimization>('optimize_voice');
    if (result) {
      toast.success("Voice optimization complete - featured snippet ready");
    }
    return result;
  }, [callAPI]);

  // Build Entity Authority Schema
  const buildEntity = useCallback(async (entityData: EntityInput): Promise<EntitySchema | null> => {
    const result = await callAPI<EntitySchema>('build_entity', { entityData });
    if (result) {
      toast.success("Entity schema generated with suggestions");
    }
    return result;
  }, [callAPI]);

  // Enrich Facts
  const enrichFacts = useCallback(async (): Promise<FactEnrichment | null> => {
    const result = await callAPI<FactEnrichment>('enrich_facts');
    if (result) {
      toast.success(`Fact enrichment complete - ${result.suggestions?.length || 0} suggestions`);
    }
    return result;
  }, [callAPI]);

  // Suggest Keywords
  const suggestKeywords = useCallback(async (): Promise<KeywordSuggestion | null> => {
    const result = await callAPI<KeywordSuggestion>('suggest_keywords');
    if (result) {
      toast.success(`Keywords suggested - ${result.secondaryKeywords?.length || 0} related terms`);
    }
    return result;
  }, [callAPI]);

  // Phase 2: Generate Content Brief
  const generateContentBrief = useCallback(async (): Promise<ContentBriefResult | null> => {
    const result = await callAPI<ContentBriefResult>('generate_content_brief');
    if (result) {
      toast.success(`Content brief generated - ${result.headingStructure?.length || 0} headings suggested`);
    }
    return result;
  }, [callAPI]);

  // Phase 2: Optimize AI Citation
  const optimizeAICitation = useCallback(async (): Promise<AICitationResult | null> => {
    const result = await callAPI<AICitationResult>('optimize_ai_citation');
    if (result) {
      toast.success(`AI citation optimized - ${result.citableSnippets?.length || 0} citable snippets`);
    }
    return result;
  }, [callAPI]);

  // Phase 2: Analyze LLM Visibility
  const analyzeLLMVisibility = useCallback(async (): Promise<LLMVisibilityResult | null> => {
    const result = await callAPI<LLMVisibilityResult>('analyze_llm_visibility');
    if (result) {
      toast.success(`LLM visibility analyzed - Score: ${result.overallScore}/100`);
    }
    return result;
  }, [callAPI]);

  // Phase 2: Optimize Answer Box
  const optimizeAnswerBox = useCallback(async (): Promise<AnswerBoxResult | null> => {
    const result = await callAPI<AnswerBoxResult>('optimize_answer_box');
    if (result) {
      toast.success(`Answer box optimized - Recommended: ${result.recommendedFormat}`);
    }
    return result;
  }, [callAPI]);

  // Phase 2: Generate Refresh Suggestions
  const generateRefreshSuggestions = useCallback(async (): Promise<RefreshSuggestionsResult | null> => {
    const result = await callAPI<RefreshSuggestionsResult>('generate_refresh_suggestions');
    if (result) {
      toast.success(`Refresh suggestions - Urgency: ${result.urgency}`);
    }
    return result;
  }, [callAPI]);

  return {
    // Methods
    generateMeta,
    generateFAQ,
    optimizeVoice,
    buildEntity,
    enrichFacts,
    suggestKeywords,
    // Phase 2 Methods
    generateContentBrief,
    optimizeAICitation,
    analyzeLLMVisibility,
    optimizeAnswerBox,
    generateRefreshSuggestions,
    // State
    isLoading: loadingStates,
    isAnyLoading: Object.values(loadingStates).some(Boolean),
    error,
  };
}
