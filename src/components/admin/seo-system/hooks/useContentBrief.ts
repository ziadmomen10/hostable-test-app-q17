/**
 * useContentBrief
 * 
 * Hook for generating and managing AI-powered content briefs.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HeadingItem {
  level: 'h1' | 'h2' | 'h3';
  text: string;
  keywords?: string[];
}

export interface QuestionItem {
  question: string;
  searchIntent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  priority: 'high' | 'medium' | 'low';
}

export interface SemanticKeyword {
  keyword: string;
  type: 'lsi' | 'long-tail' | 'question' | 'related';
  searchIntent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  difficulty: 'easy' | 'medium' | 'hard';
  usage: string;
}

export interface ContentBrief {
  id: string;
  page_id: string;
  language_code: string;
  focus_keyword: string | null;
  target_word_count: number | null;
  heading_structure: HeadingItem[];
  questions_to_answer: QuestionItem[];
  semantic_keywords: SemanticKeyword[];
  competitor_insights: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export function useContentBrief(pageId: string, languageCode: string = 'en') {
  const queryClient = useQueryClient();

  // Fetch existing brief
  const { data: brief, isLoading, error } = useQuery({
    queryKey: ['content-brief', pageId, languageCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_content_briefs')
        .select('*')
        .eq('page_id', pageId)
        .eq('language_code', languageCode)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return {
          ...data,
          heading_structure: (Array.isArray(data.heading_structure) ? data.heading_structure : []) as unknown as HeadingItem[],
          questions_to_answer: (Array.isArray(data.questions_to_answer) ? data.questions_to_answer : []) as unknown as QuestionItem[],
          semantic_keywords: (Array.isArray(data.semantic_keywords) ? data.semantic_keywords : []) as unknown as SemanticKeyword[],
          competitor_insights: (data.competitor_insights || {}) as Record<string, any>,
        } as ContentBrief;
      }
      return null;
    },
    enabled: !!pageId,
    staleTime: 5 * 60 * 1000,
  });

  // Generate new brief via AI
  const generateBriefMutation = useMutation({
    mutationFn: async (input: { content: string; focusKeyword?: string; pageTitle?: string; pageUrl?: string }) => {
      const { data, error } = await supabase.functions.invoke('seo-ai-tools', {
        body: {
          action: 'generate_content_brief',
          pageId,
          languageCode,
          content: input.content,
          context: {
            pageTitle: input.pageTitle,
            pageUrl: input.pageUrl,
            focusKeyword: input.focusKeyword,
          },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Save to database
      // Gap 2.2: Transform questionsToAnswer if they're strings instead of objects
      const questionsToAnswer = (data.questionsToAnswer || []).map((q: any) => {
        if (typeof q === 'string') {
          return { question: q, searchIntent: 'informational' as const, priority: 'medium' as const };
        }
        return q;
      });
      
      // Gap 2.2: Transform semanticKeywords to ensure they have all required fields
      const semanticKeywords = (data.semanticKeywords || []).map((kw: any) => ({
        keyword: kw.keyword,
        type: kw.type || 'related',
        searchIntent: kw.searchIntent || kw.intent || 'informational',
        difficulty: kw.difficulty || 'medium',
        usage: kw.usage || 'Use in content',
      }));
      
      const briefData = {
        page_id: pageId,
        language_code: languageCode,
        focus_keyword: input.focusKeyword || null,
        target_word_count: data.targetWordCount || null,
        heading_structure: data.headingStructure || [],
        questions_to_answer: questionsToAnswer,
        semantic_keywords: semanticKeywords,
        competitor_insights: data.competitorInsights || {},
      };

      const { data: saved, error: saveError } = await supabase
        .from('seo_content_briefs')
        .upsert(briefData, {
          onConflict: 'page_id,language_code',
        })
        .select()
        .single();

      if (saveError) throw saveError;
      
      return {
        ...saved,
        heading_structure: (Array.isArray(saved.heading_structure) ? saved.heading_structure : []) as unknown as HeadingItem[],
        questions_to_answer: (Array.isArray(saved.questions_to_answer) ? saved.questions_to_answer : []) as unknown as QuestionItem[],
        semantic_keywords: (Array.isArray(saved.semantic_keywords) ? saved.semantic_keywords : []) as unknown as SemanticKeyword[],
        competitor_insights: (saved.competitor_insights || {}) as Record<string, any>,
      } as ContentBrief;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-brief', pageId, languageCode] });
      toast.success('Content brief generated successfully');
    },
    onError: (error) => {
      console.error('[useContentBrief] Generation error:', error);
      if (error.message.includes('Rate limit')) {
        toast.error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.message.includes('Payment')) {
        toast.error('Credits required. Please add credits to your workspace.');
      } else {
        toast.error('Failed to generate content brief');
      }
    },
  });

  // Delete brief
  const deleteBriefMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('seo_content_briefs')
        .delete()
        .eq('page_id', pageId)
        .eq('language_code', languageCode);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-brief', pageId, languageCode] });
      toast.success('Content brief deleted');
    },
  });

  return {
    brief,
    isLoading,
    error,
    generateBrief: generateBriefMutation.mutate,
    isGenerating: generateBriefMutation.isPending,
    deleteBrief: deleteBriefMutation.mutate,
    isDeleting: deleteBriefMutation.isPending,
  };
}
