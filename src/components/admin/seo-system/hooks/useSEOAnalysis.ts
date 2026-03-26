/**
 * useSEOAnalysis
 * 
 * Hook for calculating SEO, AEO, and GEO scores using weighted scoring algorithm.
 * Independent from editor state - reads directly from database.
 * 
 * Gap L4: Fixed cache thrashing by separating data fetching from score calculation.
 * - Query always uses 30s staleTime (no refetching during typing)
 * - useMemo recalculates scores client-side when liveFormData changes
 * 
 * Exports scoring functions for use in overlay and other components.
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { seoQueryKeys } from './queryKeys';

interface SEOAnalysisResult {
  seoScore: number;
  aeoScore: number;
  geoScore: number;
  seoDetails: ScoreDetails;
  aeoDetails: ScoreDetails;
  geoDetails: ScoreDetails;
  issues: SEOIssue[];
  isLoading: boolean;
  error: Error | null;
}

export interface ScoreDetails {
  score: number;
  maxScore: number;
  breakdown: ScoreBreakdownItem[];
}

export interface ScoreBreakdownItem {
  category: string;
  label: string;
  points: number;
  maxPoints: number;
  status: 'pass' | 'partial' | 'fail';
  message?: string;
}

export interface SEOIssue {
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  tab?: string; // Which tab to navigate to for fix
}

// Scoring weights configuration - exported for consistency
export const SEO_WEIGHTS = {
  title: { exists: 5, length: 10, keyword: 10 },           // 25 total
  description: { exists: 5, length: 10, keyword: 5 },      // 20 total
  focusKeyword: { set: 10, density: 5, placement: 5 },     // 20 total
  og: { title: 5, description: 5, image: 5 },              // 15 total
  schema: { exists: 15, complete: 5 },                      // 20 total
};

export const AEO_WEIGHTS = {
  questionContent: { exists: 15, multiple: 5 },            // 20 total
  faqSchema: { exists: 20, items: 5 },                     // 25 total
  listContent: { exists: 10, structured: 5 },              // 15 total
  conversational: { exists: 15, natural: 5 },              // 20 total
  directAnswers: { exists: 15, concise: 5 },               // 20 total
};

export const GEO_WEIGHTS = {
  entitySchema: { exists: 15, complete: 10 },              // 25 total
  sameAsLinks: { exists: 10, multiple: 5 },                // 15 total
  factDensity: { low: 5, medium: 12, high: 20 },          // 20 total
  citations: { exists: 15, multiple: 5 },                  // 20 total
  brandSchema: { exists: 15, complete: 5 },                // 20 total
};

/**
 * Extract plain text from JSON content or HTML string
 * Strips JSON structure/property names and HTML tags
 */
export function extractTextFromContent(content: string): string {
  if (!content) return '';
  
  // Try parsing as JSON first
  try {
    const parsed = JSON.parse(content);
    return extractTextRecursive(parsed);
  } catch {
    // Not JSON, strip HTML tags
    return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}

function extractTextRecursive(obj: any): string {
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number') return String(obj);
  if (Array.isArray(obj)) return obj.map(extractTextRecursive).join(' ');
  if (obj && typeof obj === 'object') {
    // Only extract from text-like properties, skip structural ones
    const textProps = ['text', 'content', 'title', 'subtitle', 'description', 'heading', 
                       'paragraph', 'label', 'value', 'alt', 'caption', 'quote', 'body',
                       'question', 'answer', 'name', 'message'];
    const texts: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      // Skip structural/type properties
      if (['type', 'id', 'className', 'style', 'props', 'variant', 'size'].includes(key)) {
        continue;
      }
      // Prioritize known text properties
      if (textProps.includes(key.toLowerCase()) || typeof value === 'string') {
        texts.push(extractTextRecursive(value));
      } else if (typeof value === 'object') {
        texts.push(extractTextRecursive(value));
      }
    }
    return texts.join(' ');
  }
  return '';
}

/**
 * Live form data interface for real-time score preview
 * Gap L1: Real-time score preview from formState
 */
interface LiveFormData {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  structuredData?: string;
}

/**
 * Safe JSON parse helper
 */
function safeJsonParse(str: string): any {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export function useSEOAnalysis(
  pageId: string, 
  languageCode: string = 'en',
  liveFormData?: LiveFormData
): SEOAnalysisResult {
  // Gap L4 & A1: Fetch data with centralized query keys and stable staleTime
  // Query fetches raw data only - no liveFormData in query key
  const { data, isLoading, error } = useQuery({
    queryKey: seoQueryKeys.analysis(pageId, languageCode),
    queryFn: async () => {
      // Fetch page SEO data for specific language
      const { data: seoData, error: seoError } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_id', pageId)
        .eq('language_code', languageCode)
        .maybeSingle();

      if (seoError) throw seoError;

      // Fetch base page data
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('page_title, page_description, content, page_url')
        .eq('id', pageId)
        .single();

      if (pageError) throw pageError;

      // For non-default languages, fetch translated content for accurate analysis
      let analyzableContent = { ...pageData };
      
      if (languageCode !== 'en' && pageData) {
        // Get language ID
        const { data: langData } = await supabase
          .from('languages')
          .select('id')
          .eq('code', languageCode)
          .maybeSingle();
        
        if (langData) {
          // Fetch page-specific translations (using page.{slug}.* pattern)
          const pageSlug = pageData.page_url?.replace(/^\//, '') || '';
          const { data: translations } = await supabase
            .from('translations')
            .select('key, value')
            .eq('language_id', langData.id)
            .like('key', `page.${pageSlug}.%`)
            .not('value', 'is', null);
          
          if (translations?.length) {
            // Build translated content from translation keys
            let translatedContent = pageData.content || '';
            translations.forEach(t => {
              // Replace source text with translated value in content analysis
              if (t.value) {
                // These translations affect the displayed content
                translatedContent += ` ${t.value}`;
              }
            });
            
            analyzableContent = {
              ...pageData,
              content: translatedContent,
              // Use SEO-specific title/description if set, otherwise keep original
              page_title: seoData?.meta_title || pageData.page_title,
              page_description: seoData?.meta_description || pageData.page_description,
            };
          }
        }
      }

      // Return raw data - score calculation moved to useMemo
      return { 
        rawPageData: analyzableContent,
        rawSeoData: seoData,
      };
    },
    enabled: !!pageId,
    staleTime: 30 * 1000, // Gap L4: Always 30s staleTime - no more cache thrashing
  });

  // Gap L4: Compute scores client-side using useMemo
  // This recalculates instantly when liveFormData changes without network requests
  const computedScores = useMemo(() => {
    if (!data) {
      return {
        seoScore: 0,
        aeoScore: 0,
        geoScore: 0,
        seoDetails: { score: 0, maxScore: 100, breakdown: [] } as ScoreDetails,
        aeoDetails: { score: 0, maxScore: 100, breakdown: [] } as ScoreDetails,
        geoDetails: { score: 0, maxScore: 100, breakdown: [] } as ScoreDetails,
        issues: [] as SEOIssue[],
      };
    }

    // Merge live form data with DB data for real-time preview
    const effectiveSeoData = liveFormData ? {
      ...data.rawSeoData,
      meta_title: liveFormData.metaTitle ?? data.rawSeoData?.meta_title,
      meta_description: liveFormData.metaDescription ?? data.rawSeoData?.meta_description,
      focus_keyword: liveFormData.focusKeyword ?? data.rawSeoData?.focus_keyword,
      structured_data: liveFormData.structuredData 
        ? safeJsonParse(liveFormData.structuredData)
        : data.rawSeoData?.structured_data,
    } : data.rawSeoData;

    // Calculate scores with merged data
    const seoDetails = calculateSEOScore(data.rawPageData, effectiveSeoData);
    const aeoDetails = calculateAEOScore(data.rawPageData, effectiveSeoData);
    const geoDetails = calculateGEOScore(data.rawPageData, effectiveSeoData);
    const issues = collectIssues(data.rawPageData, effectiveSeoData, seoDetails, aeoDetails, geoDetails);

    return {
      seoScore: seoDetails.score,
      aeoScore: aeoDetails.score,
      geoScore: geoDetails.score,
      seoDetails,
      aeoDetails,
      geoDetails,
      issues,
    };
  }, [data, liveFormData]);

  return {
    ...computedScores,
    isLoading,
    error: error as Error | null,
  };
}

// SEO Score Calculation with Weighted Algorithm - exported for overlay use
export function calculateSEOScore(pageData: any, seoData: any): ScoreDetails {
  const breakdown: ScoreBreakdownItem[] = [];
  let totalScore = 0;
  let maxScore = 0;

  const title = seoData?.meta_title || pageData?.page_title || '';
  const description = seoData?.meta_description || pageData?.page_description || '';
  const focusKeyword = seoData?.focus_keyword || '';
  const rawContent = pageData?.content || '';
  const structuredData = seoData?.structured_data;

  // Extract text content for accurate keyword analysis
  const textContent = extractTextFromContent(rawContent);

  // Title Analysis (25 points)
  const titleMax = SEO_WEIGHTS.title.exists + SEO_WEIGHTS.title.length + SEO_WEIGHTS.title.keyword;
  maxScore += titleMax;
  let titlePoints = 0;
  let titleStatus: 'pass' | 'partial' | 'fail' = 'fail';
  
  if (title.length > 0) {
    titlePoints += SEO_WEIGHTS.title.exists;
    if (title.length >= 30 && title.length <= 60) {
      titlePoints += SEO_WEIGHTS.title.length;
    } else if (title.length > 0) {
      titlePoints += Math.round(SEO_WEIGHTS.title.length * 0.5);
    }
    if (focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())) {
      titlePoints += SEO_WEIGHTS.title.keyword;
    }
    titleStatus = titlePoints >= titleMax * 0.8 ? 'pass' : 'partial';
  }
  totalScore += titlePoints;
  breakdown.push({
    category: 'seo',
    label: 'Meta Title',
    points: titlePoints,
    maxPoints: titleMax,
    status: titleStatus,
    message: titleStatus === 'pass' ? 'Well optimized' : 'Could be improved',
  });

  // Description Analysis (20 points)
  const descMax = SEO_WEIGHTS.description.exists + SEO_WEIGHTS.description.length + SEO_WEIGHTS.description.keyword;
  maxScore += descMax;
  let descPoints = 0;
  let descStatus: 'pass' | 'partial' | 'fail' = 'fail';
  
  if (description.length > 0) {
    descPoints += SEO_WEIGHTS.description.exists;
    if (description.length >= 120 && description.length <= 160) {
      descPoints += SEO_WEIGHTS.description.length;
    } else if (description.length > 0) {
      descPoints += Math.round(SEO_WEIGHTS.description.length * 0.5);
    }
    if (focusKeyword && description.toLowerCase().includes(focusKeyword.toLowerCase())) {
      descPoints += SEO_WEIGHTS.description.keyword;
    }
    descStatus = descPoints >= descMax * 0.8 ? 'pass' : 'partial';
  }
  totalScore += descPoints;
  breakdown.push({
    category: 'seo',
    label: 'Meta Description',
    points: descPoints,
    maxPoints: descMax,
    status: descStatus,
    message: descStatus === 'pass' ? 'Well optimized' : 'Could be improved',
  });

  // Focus Keyword (20 points) - Using extracted text content
  const kwMax = SEO_WEIGHTS.focusKeyword.set + SEO_WEIGHTS.focusKeyword.density + SEO_WEIGHTS.focusKeyword.placement;
  maxScore += kwMax;
  let kwPoints = 0;
  let kwStatus: 'pass' | 'partial' | 'fail' = 'fail';
  
  if (focusKeyword) {
    kwPoints += SEO_WEIGHTS.focusKeyword.set;
    
    // Check density using extracted text (not raw JSON)
    const keywordRegex = new RegExp(focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const keywordCount = (textContent.match(keywordRegex) || []).length;
    if (keywordCount >= 2) {
      kwPoints += SEO_WEIGHTS.focusKeyword.density;
    } else if (keywordCount >= 1) {
      kwPoints += Math.round(SEO_WEIGHTS.focusKeyword.density * 0.5);
    }
    
    // Check placement (in first 200 chars of extracted text)
    if (textContent.substring(0, 200).toLowerCase().includes(focusKeyword.toLowerCase())) {
      kwPoints += SEO_WEIGHTS.focusKeyword.placement;
    }
    
    kwStatus = kwPoints >= kwMax * 0.8 ? 'pass' : 'partial';
  }
  totalScore += kwPoints;
  breakdown.push({
    category: 'seo',
    label: 'Focus Keyword',
    points: kwPoints,
    maxPoints: kwMax,
    status: kwStatus,
    message: focusKeyword ? (kwStatus === 'pass' ? 'Well placed' : 'Needs better placement') : 'Not set',
  });

  // Open Graph (15 points)
  const ogMax = SEO_WEIGHTS.og.title + SEO_WEIGHTS.og.description + SEO_WEIGHTS.og.image;
  maxScore += ogMax;
  let ogPoints = 0;
  if (seoData?.og_title) ogPoints += SEO_WEIGHTS.og.title;
  if (seoData?.og_description) ogPoints += SEO_WEIGHTS.og.description;
  if (seoData?.og_image_url) ogPoints += SEO_WEIGHTS.og.image;
  const ogStatus = ogPoints >= ogMax ? 'pass' : ogPoints > 0 ? 'partial' : 'fail';
  totalScore += ogPoints;
  breakdown.push({
    category: 'seo',
    label: 'Open Graph',
    points: ogPoints,
    maxPoints: ogMax,
    status: ogStatus,
    message: ogStatus === 'pass' ? 'Complete' : 'Missing some tags',
  });

  // Structured Data (20 points)
  const schemaMax = SEO_WEIGHTS.schema.exists + SEO_WEIGHTS.schema.complete;
  maxScore += schemaMax;
  let schemaPoints = 0;
  let schemaStatus: 'pass' | 'partial' | 'fail' = 'fail';
  
  if (structuredData) {
    schemaPoints += SEO_WEIGHTS.schema.exists;
    const schemaStr = JSON.stringify(structuredData);
    // Check for completeness (has @type, name, etc.)
    if (schemaStr.includes('@type') && (schemaStr.includes('name') || schemaStr.includes('headline'))) {
      schemaPoints += SEO_WEIGHTS.schema.complete;
    }
    schemaStatus = schemaPoints >= schemaMax * 0.8 ? 'pass' : 'partial';
  }
  totalScore += schemaPoints;
  breakdown.push({
    category: 'seo',
    label: 'Structured Data',
    points: schemaPoints,
    maxPoints: schemaMax,
    status: schemaStatus,
    message: structuredData ? (schemaStatus === 'pass' ? 'Valid schema' : 'Schema incomplete') : 'Not implemented',
  });

  return {
    score: Math.round((totalScore / maxScore) * 100),
    maxScore: 100,
    breakdown,
  };
}

// AEO Score Calculation - exported for overlay use
export function calculateAEOScore(pageData: any, seoData: any): ScoreDetails {
  const breakdown: ScoreBreakdownItem[] = [];
  let totalScore = 0;
  let maxScore = 0;

  const rawContent = pageData?.content || '';
  const textContent = extractTextFromContent(rawContent);
  const structuredData = seoData?.structured_data;
  const structuredDataStr = JSON.stringify(structuredData || {});

  // Question Content (20 points)
  const qMax = AEO_WEIGHTS.questionContent.exists + AEO_WEIGHTS.questionContent.multiple;
  maxScore += qMax;
  let qPoints = 0;
  const questionCount = (textContent.match(/\?/g) || []).length;
  if (questionCount > 0) {
    qPoints += AEO_WEIGHTS.questionContent.exists;
    if (questionCount >= 3) {
      qPoints += AEO_WEIGHTS.questionContent.multiple;
    }
  }
  totalScore += qPoints;
  breakdown.push({
    category: 'aeo',
    label: 'Question Content',
    points: qPoints,
    maxPoints: qMax,
    status: qPoints >= qMax * 0.8 ? 'pass' : qPoints > 0 ? 'partial' : 'fail',
  });

  // FAQ Schema (25 points)
  const faqMax = AEO_WEIGHTS.faqSchema.exists + AEO_WEIGHTS.faqSchema.items;
  maxScore += faqMax;
  let faqPoints = 0;
  if (structuredDataStr.includes('FAQPage')) {
    faqPoints += AEO_WEIGHTS.faqSchema.exists;
    // Check if has multiple FAQ items
    const faqItemCount = (structuredDataStr.match(/"Question"/g) || []).length;
    if (faqItemCount >= 3) {
      faqPoints += AEO_WEIGHTS.faqSchema.items;
    }
  }
  totalScore += faqPoints;
  breakdown.push({
    category: 'aeo',
    label: 'FAQ Schema',
    points: faqPoints,
    maxPoints: faqMax,
    status: faqPoints >= faqMax * 0.8 ? 'pass' : faqPoints > 0 ? 'partial' : 'fail',
  });

  // List Content (15 points)
  const listMax = AEO_WEIGHTS.listContent.exists + AEO_WEIGHTS.listContent.structured;
  maxScore += listMax;
  let listPoints = 0;
  const hasLists = rawContent.includes('<ul>') || rawContent.includes('<ol>') || rawContent.includes('"items"');
  if (hasLists) {
    listPoints += AEO_WEIGHTS.listContent.exists;
    // Check for numbered/structured lists
    if (rawContent.includes('<ol>') || rawContent.includes('"steps"')) {
      listPoints += AEO_WEIGHTS.listContent.structured;
    }
  }
  totalScore += listPoints;
  breakdown.push({
    category: 'aeo',
    label: 'List Content',
    points: listPoints,
    maxPoints: listMax,
    status: listPoints >= listMax * 0.8 ? 'pass' : listPoints > 0 ? 'partial' : 'fail',
  });

  // Conversational Content (20 points) - Use extracted text
  const convMax = AEO_WEIGHTS.conversational.exists + AEO_WEIGHTS.conversational.natural;
  maxScore += convMax;
  let convPoints = 0;
  const conversationalPatterns = /how to|what is|why|when|where|who|can i|should i/gi;
  const convMatches = (textContent.match(conversationalPatterns) || []).length;
  if (convMatches > 0) {
    convPoints += AEO_WEIGHTS.conversational.exists;
    if (convMatches >= 3) {
      convPoints += AEO_WEIGHTS.conversational.natural;
    }
  }
  totalScore += convPoints;
  breakdown.push({
    category: 'aeo',
    label: 'Conversational',
    points: convPoints,
    maxPoints: convMax,
    status: convPoints >= convMax * 0.8 ? 'pass' : convPoints > 0 ? 'partial' : 'fail',
  });

  // Direct Answers (20 points)
  const answerMax = AEO_WEIGHTS.directAnswers.exists + AEO_WEIGHTS.directAnswers.concise;
  maxScore += answerMax;
  let answerPoints = 0;
  // Check for answer-like patterns in extracted text
  const answerPatterns = /^(the|a|an|it is|they are|you can|this is)/gim;
  const sentenceMatches = textContent.split(/[.!?]/).filter(s => s.trim().match(answerPatterns));
  if (sentenceMatches.length > 0) {
    answerPoints += AEO_WEIGHTS.directAnswers.exists;
    // Check for concise answers (sentences under 30 words)
    const conciseAnswers = sentenceMatches.filter(s => s.split(/\s+/).length <= 30);
    if (conciseAnswers.length >= 2) {
      answerPoints += AEO_WEIGHTS.directAnswers.concise;
    }
  }
  totalScore += answerPoints;
  breakdown.push({
    category: 'aeo',
    label: 'Direct Answers',
    points: answerPoints,
    maxPoints: answerMax,
    status: answerPoints >= answerMax * 0.8 ? 'pass' : answerPoints > 0 ? 'partial' : 'fail',
  });

  return {
    score: Math.round((totalScore / maxScore) * 100),
    maxScore: 100,
    breakdown,
  };
}

// GEO Score Calculation - exported for overlay use
export function calculateGEOScore(pageData: any, seoData: any): ScoreDetails {
  const breakdown: ScoreBreakdownItem[] = [];
  let totalScore = 0;
  let maxScore = 0;

  const rawContent = pageData?.content || '';
  const textContent = extractTextFromContent(rawContent);
  const structuredData = seoData?.structured_data;
  const structuredDataStr = JSON.stringify(structuredData || {});

  // Entity Schema (25 points)
  const entityMax = GEO_WEIGHTS.entitySchema.exists + GEO_WEIGHTS.entitySchema.complete;
  maxScore += entityMax;
  let entityPoints = 0;
  const hasEntitySchema = structuredDataStr.includes('Organization') || 
                          structuredDataStr.includes('Person') ||
                          structuredDataStr.includes('LocalBusiness');
  if (hasEntitySchema) {
    entityPoints += GEO_WEIGHTS.entitySchema.exists;
    // Check for completeness
    if (structuredDataStr.includes('sameAs') && structuredDataStr.includes('url')) {
      entityPoints += GEO_WEIGHTS.entitySchema.complete;
    }
  }
  totalScore += entityPoints;
  breakdown.push({
    category: 'geo',
    label: 'Entity Schema',
    points: entityPoints,
    maxPoints: entityMax,
    status: entityPoints >= entityMax * 0.8 ? 'pass' : entityPoints > 0 ? 'partial' : 'fail',
  });

  // SameAs Links (15 points)
  const sameAsMax = GEO_WEIGHTS.sameAsLinks.exists + GEO_WEIGHTS.sameAsLinks.multiple;
  maxScore += sameAsMax;
  let sameAsPoints = 0;
  const sameAsCount = (structuredDataStr.match(/"sameAs"/g) || []).length;
  if (sameAsCount > 0) {
    sameAsPoints += GEO_WEIGHTS.sameAsLinks.exists;
    if (sameAsCount >= 3) {
      sameAsPoints += GEO_WEIGHTS.sameAsLinks.multiple;
    }
  }
  totalScore += sameAsPoints;
  breakdown.push({
    category: 'geo',
    label: 'SameAs Links',
    points: sameAsPoints,
    maxPoints: sameAsMax,
    status: sameAsPoints >= sameAsMax * 0.8 ? 'pass' : sameAsPoints > 0 ? 'partial' : 'fail',
  });

  // Fact Density (20 points) - Use extracted text
  const factMax = GEO_WEIGHTS.factDensity.high;
  maxScore += factMax;
  let factPoints = 0;
  // Count fact indicators: numbers, percentages, dates, statistics
  const factPatterns = /\d+%|\d{4}|\$[\d,]+|\d+\s*(million|billion|thousand|kg|km|miles)/gi;
  const factCount = (textContent.match(factPatterns) || []).length;
  if (factCount >= 5) {
    factPoints = GEO_WEIGHTS.factDensity.high;
  } else if (factCount >= 2) {
    factPoints = GEO_WEIGHTS.factDensity.medium;
  } else if (factCount >= 1) {
    factPoints = GEO_WEIGHTS.factDensity.low;
  }
  totalScore += factPoints;
  breakdown.push({
    category: 'geo',
    label: 'Fact Density',
    points: factPoints,
    maxPoints: factMax,
    status: factPoints >= factMax * 0.8 ? 'pass' : factPoints > 0 ? 'partial' : 'fail',
  });

  // Citations (20 points)
  const citationMax = GEO_WEIGHTS.citations.exists + GEO_WEIGHTS.citations.multiple;
  maxScore += citationMax;
  let citationPoints = 0;
  // Check for citation patterns
  const citationPatterns = /according to|source:|cited|reference|study shows|research indicates/gi;
  const citationCount = (textContent.match(citationPatterns) || []).length;
  if (citationCount > 0) {
    citationPoints += GEO_WEIGHTS.citations.exists;
    if (citationCount >= 2) {
      citationPoints += GEO_WEIGHTS.citations.multiple;
    }
  }
  totalScore += citationPoints;
  breakdown.push({
    category: 'geo',
    label: 'Citations',
    points: citationPoints,
    maxPoints: citationMax,
    status: citationPoints >= citationMax * 0.8 ? 'pass' : citationPoints > 0 ? 'partial' : 'fail',
  });

  // Brand Schema (20 points)
  const brandMax = GEO_WEIGHTS.brandSchema.exists + GEO_WEIGHTS.brandSchema.complete;
  maxScore += brandMax;
  let brandPoints = 0;
  const hasBrandSchema = structuredDataStr.includes('Brand') || 
                         structuredDataStr.includes('logo') ||
                         structuredDataStr.includes('founder');
  if (hasBrandSchema) {
    brandPoints += GEO_WEIGHTS.brandSchema.exists;
    // Check for brand completeness
    if (structuredDataStr.includes('logo') && structuredDataStr.includes('name')) {
      brandPoints += GEO_WEIGHTS.brandSchema.complete;
    }
  }
  totalScore += brandPoints;
  breakdown.push({
    category: 'geo',
    label: 'Brand Schema',
    points: brandPoints,
    maxPoints: brandMax,
    status: brandPoints >= brandMax * 0.8 ? 'pass' : brandPoints > 0 ? 'partial' : 'fail',
  });

  return {
    score: Math.round((totalScore / maxScore) * 100),
    maxScore: 100,
    breakdown,
  };
}

// Issue Collection
function collectIssues(
  pageData: any, 
  seoData: any, 
  seoDetails: ScoreDetails, 
  aeoDetails: ScoreDetails, 
  geoDetails: ScoreDetails
): SEOIssue[] {
  const issues: SEOIssue[] = [];

  // SEO Issues
  seoDetails.breakdown.forEach(item => {
    if (item.status === 'fail') {
      issues.push({
        type: item.label.toLowerCase().replace(/\s+/g, '_'),
        severity: 'error',
        message: `${item.label} is missing or not configured`,
        tab: 'meta',
      });
    } else if (item.status === 'partial') {
      issues.push({
        type: item.label.toLowerCase().replace(/\s+/g, '_'),
        severity: 'warning',
        message: `${item.label} could be improved`,
        tab: 'meta',
      });
    }
  });

  // AEO Issues
  aeoDetails.breakdown.forEach(item => {
    if (item.status === 'fail') {
      issues.push({
        type: item.label.toLowerCase().replace(/\s+/g, '_'),
        severity: 'warning',
        message: `${item.label} is missing - important for voice search`,
        tab: 'aeo',
      });
    }
  });

  // GEO Issues
  geoDetails.breakdown.forEach(item => {
    if (item.status === 'fail') {
      issues.push({
        type: item.label.toLowerCase().replace(/\s+/g, '_'),
        severity: 'info',
        message: `${item.label} could boost AI citability`,
        tab: 'geo',
      });
    }
  });

  return issues;
}
