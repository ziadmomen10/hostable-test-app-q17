/**
 * useInternalLinkSuggestions
 * 
 * Hook for AI-powered internal link suggestions.
 * Analyzes all pages and suggests linking opportunities.
 */

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LinkSuggestion {
  targetPageId: string;
  targetUrl: string;
  targetTitle: string;
  anchorText: string;
  relevanceScore: 'high' | 'medium' | 'low';
  reason: string;
}

interface UseInternalLinkSuggestionsOptions {
  pageId: string;
  pageUrl: string;
  content: string;
  focusKeyword?: string;
}

export function useInternalLinkSuggestions({
  pageId,
  pageUrl,
  content,
  focusKeyword,
}: UseInternalLinkSuggestionsOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]);

  // Fetch all pages for linking opportunities
  const { data: allPages } = useQuery({
    queryKey: ['all-pages-for-linking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('id, page_url, page_title, page_description, page_keywords')
        .eq('is_active', true)
        .neq('id', pageId);

      if (error) throw error;
      return data;
    },
  });

  const generateSuggestions = useCallback(async () => {
    if (!allPages || allPages.length === 0) {
      toast.error('No other pages available for linking');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('seo-ai-tools', {
        body: {
          action: 'suggest_internal_links',
          pageId,
          content: content.substring(0, 3000),
          context: {
            pageUrl,
            focusKeyword,
            availablePages: allPages.map(p => ({
              id: p.id,
              url: p.page_url,
              title: p.page_title,
              description: p.page_description,
              keywords: p.page_keywords,
            })),
          },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const aiSuggestions = data?.suggestions || [];
      setSuggestions(aiSuggestions);
      toast.success(`Found ${aiSuggestions.length} link opportunities`);
    } catch (err) {
      // Fallback to simple keyword-based matching
      const fallbackSuggestions = generateFallbackSuggestions(
        content,
        allPages || [],
        focusKeyword
      );
      setSuggestions(fallbackSuggestions);
      
      if (fallbackSuggestions.length > 0) {
        toast.success(`Found ${fallbackSuggestions.length} link opportunities`);
      } else {
        toast.error('Could not generate suggestions');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [pageId, pageUrl, content, focusKeyword, allPages]);

  return {
    suggestions,
    isGenerating,
    generateSuggestions,
    clearSuggestions: () => setSuggestions([]),
  };
}

// Fallback: Simple keyword matching when AI is unavailable
function generateFallbackSuggestions(
  content: string,
  pages: Array<{
    id: string;
    page_url: string;
    page_title: string;
    page_description: string | null;
    page_keywords: string | null;
  }>,
  focusKeyword?: string
): LinkSuggestion[] {
  const contentLower = content.toLowerCase();
  const suggestions: LinkSuggestion[] = [];

  for (const page of pages) {
    // Check if page title appears in content
    const titleLower = page.page_title.toLowerCase();
    const titleWords = titleLower.split(/\s+/).filter(w => w.length > 3);
    
    let matchScore = 0;
    let matchReason = '';

    // Title word matches
    for (const word of titleWords) {
      if (contentLower.includes(word)) {
        matchScore++;
      }
    }

    // Keyword matches
    if (page.page_keywords) {
      const keywords = page.page_keywords.toLowerCase().split(',').map(k => k.trim());
      for (const keyword of keywords) {
        if (keyword && contentLower.includes(keyword)) {
          matchScore += 2;
          matchReason = `Contains keyword "${keyword}"`;
        }
      }
    }

    // Focus keyword relation
    if (focusKeyword && page.page_keywords?.toLowerCase().includes(focusKeyword.toLowerCase())) {
      matchScore += 3;
      matchReason = `Related to focus keyword`;
    }

    if (matchScore >= 2) {
      suggestions.push({
        targetPageId: page.id,
        targetUrl: page.page_url,
        targetTitle: page.page_title,
        anchorText: page.page_title,
        relevanceScore: matchScore >= 4 ? 'high' : matchScore >= 2 ? 'medium' : 'low',
        reason: matchReason || 'Topically related content',
      });
    }
  }

  return suggestions
    .sort((a, b) => {
      const scoreOrder = { high: 3, medium: 2, low: 1 };
      return scoreOrder[b.relevanceScore] - scoreOrder[a.relevanceScore];
    })
    .slice(0, 5);
}
