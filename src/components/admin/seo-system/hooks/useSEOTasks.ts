/**
 * useSEOTasks
 * 
 * Hook for managing dynamic SEO task checklist.
 * Auto-generates tasks based on page analysis and tracks completion.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SEOIssue } from './useSEOAnalysis';

export interface SEOTask {
  id: string;
  page_id: string;
  language_code: string;
  task_type: string;
  task_title: string;
  task_description: string | null;
  priority: 'high' | 'medium' | 'low';
  impact_score: number;
  category: string;
  is_completed: boolean;
  completed_at: string | null;
  auto_generated: boolean;
  created_at: string;
}

interface TaskGenerationInput {
  issues: SEOIssue[];
  seoScore: number;
  aeoScore: number;
  geoScore: number;
}

// Priority and impact mapping for issue types
const ISSUE_PRIORITY_MAP: Record<string, { priority: 'high' | 'medium' | 'low'; impact: number; category: string }> = {
  'missing-title': { priority: 'high', impact: 95, category: 'meta' },
  'short-title': { priority: 'medium', impact: 70, category: 'meta' },
  'long-title': { priority: 'medium', impact: 60, category: 'meta' },
  'missing-description': { priority: 'high', impact: 90, category: 'meta' },
  'short-description': { priority: 'medium', impact: 65, category: 'meta' },
  'long-description': { priority: 'low', impact: 50, category: 'meta' },
  'missing-keyword': { priority: 'high', impact: 85, category: 'keywords' },
  'keyword-not-in-title': { priority: 'medium', impact: 75, category: 'keywords' },
  'keyword-not-in-description': { priority: 'medium', impact: 70, category: 'keywords' },
  'missing-og-image': { priority: 'medium', impact: 60, category: 'social' },
  'missing-og-title': { priority: 'low', impact: 40, category: 'social' },
  'missing-og-description': { priority: 'low', impact: 40, category: 'social' },
  'missing-schema': { priority: 'high', impact: 80, category: 'technical' },
  'incomplete-schema': { priority: 'medium', impact: 55, category: 'technical' },
  'no-faq-schema': { priority: 'medium', impact: 65, category: 'aeo' },
  'low-question-content': { priority: 'medium', impact: 60, category: 'aeo' },
  'missing-entity-schema': { priority: 'high', impact: 75, category: 'geo' },
  'low-fact-density': { priority: 'medium', impact: 70, category: 'geo' },
};

export function useSEOTasks(pageId: string, languageCode: string = 'en') {
  const queryClient = useQueryClient();

  // Fetch existing tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['seo-tasks', pageId, languageCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_tasks')
        .select('*')
        .eq('page_id', pageId)
        .eq('language_code', languageCode)
        .order('impact_score', { ascending: false });

      if (error) throw error;
      return (data || []) as SEOTask[];
    },
    enabled: !!pageId,
    staleTime: 60 * 1000,
  });

  // Generate tasks from issues
  const generateTasksMutation = useMutation({
    mutationFn: async (input: TaskGenerationInput) => {
      const { issues, seoScore, aeoScore, geoScore } = input;
      
      // Delete existing auto-generated incomplete tasks
      await supabase
        .from('seo_tasks')
        .delete()
        .eq('page_id', pageId)
        .eq('language_code', languageCode)
        .eq('auto_generated', true)
        .eq('is_completed', false);

      // Generate new tasks from issues
      const newTasks = issues.map(issue => {
        const mapping = ISSUE_PRIORITY_MAP[issue.type] || { 
          priority: issue.severity === 'error' ? 'high' : issue.severity === 'warning' ? 'medium' : 'low',
          impact: issue.severity === 'error' ? 80 : issue.severity === 'warning' ? 50 : 30,
          category: 'general'
        };

        return {
          page_id: pageId,
          language_code: languageCode,
          task_type: issue.type,
          task_title: issue.message,
          task_description: getTaskDescription(issue.type),
          priority: mapping.priority,
          impact_score: mapping.impact,
          category: mapping.category,
          auto_generated: true,
        };
      });

      // Add score-based recommendations
      if (seoScore < 50) {
        newTasks.push({
          page_id: pageId,
          language_code: languageCode,
          task_type: 'improve-seo-score',
          task_title: 'SEO score is below 50% - requires attention',
          task_description: 'Focus on adding meta title, description, and focus keyword to improve SEO fundamentals.',
          priority: 'high' as const,
          impact_score: 90,
          category: 'overview',
          auto_generated: true,
        });
      }

      if (aeoScore < 40) {
        newTasks.push({
          page_id: pageId,
          language_code: languageCode,
          task_type: 'improve-aeo-score',
          task_title: 'Add FAQ schema and conversational content for voice search',
          task_description: 'Improve Answer Engine Optimization by adding FAQ schema and question-based content.',
          priority: 'medium' as const,
          impact_score: 70,
          category: 'aeo',
          auto_generated: true,
        });
      }

      if (geoScore < 40) {
        newTasks.push({
          page_id: pageId,
          language_code: languageCode,
          task_type: 'improve-geo-score',
          task_title: 'Add entity schema and improve fact density for AI citations',
          task_description: 'Improve Generative Engine Optimization by adding entity schema and citable facts.',
          priority: 'medium' as const,
          impact_score: 70,
          category: 'geo',
          auto_generated: true,
        });
      }

      if (newTasks.length === 0) return [];

      const { data, error } = await supabase
        .from('seo_tasks')
        .insert(newTasks)
        .select();

      if (error) throw error;
      return data as SEOTask[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-tasks', pageId, languageCode] });
    },
    onError: (error) => {
      console.error('[useSEOTasks] Generation error:', error);
    },
  });

  // Toggle task completion
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('seo_tasks')
        .update({
          is_completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-tasks', pageId, languageCode] });
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });

  // Delete a task
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('seo_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-tasks', pageId, languageCode] });
      toast.success('Task removed');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });

  // Add custom task
  const addTaskMutation = useMutation({
    mutationFn: async (task: { title: string; description?: string; priority?: 'high' | 'medium' | 'low' }) => {
      const { data, error } = await supabase
        .from('seo_tasks')
        .insert({
          page_id: pageId,
          language_code: languageCode,
          task_type: 'custom',
          task_title: task.title,
          task_description: task.description || null,
          priority: task.priority || 'medium',
          impact_score: 50,
          category: 'custom',
          auto_generated: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as SEOTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-tasks', pageId, languageCode] });
      toast.success('Task added');
    },
    onError: () => {
      toast.error('Failed to add task');
    },
  });

  // Stats
  const completedCount = tasks?.filter(t => t.is_completed).length || 0;
  const totalCount = tasks?.length || 0;
  const highPriorityPending = tasks?.filter(t => !t.is_completed && t.priority === 'high').length || 0;

  return {
    tasks: tasks || [],
    isLoading,
    error,
    completedCount,
    totalCount,
    highPriorityPending,
    generateTasks: generateTasksMutation.mutate,
    isGenerating: generateTasksMutation.isPending,
    toggleTask: toggleTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    addTask: addTaskMutation.mutate,
  };
}

// Helper function for task descriptions
function getTaskDescription(taskType: string): string {
  const descriptions: Record<string, string> = {
    'missing-title': 'Add a compelling meta title (30-60 characters) that includes your focus keyword.',
    'short-title': 'Expand your meta title to at least 30 characters for better visibility.',
    'long-title': 'Shorten your meta title to 60 characters or less to prevent truncation.',
    'missing-description': 'Add a meta description (120-160 characters) that summarizes your page content.',
    'short-description': 'Expand your meta description to at least 120 characters.',
    'long-description': 'Shorten your meta description to 160 characters or less.',
    'missing-keyword': 'Set a focus keyword to optimize your content around.',
    'keyword-not-in-title': 'Include your focus keyword in the meta title.',
    'keyword-not-in-description': 'Include your focus keyword in the meta description.',
    'missing-og-image': 'Add an Open Graph image (1200x630px recommended) for social sharing.',
    'missing-og-title': 'Add an Open Graph title for better social media previews.',
    'missing-og-description': 'Add an Open Graph description for social sharing.',
    'missing-schema': 'Add structured data (JSON-LD) to help search engines understand your content.',
    'incomplete-schema': 'Complete your structured data with required fields like name, description.',
    'no-faq-schema': 'Add FAQ schema to enable rich results for question-based searches.',
    'low-question-content': 'Add more question-based content for voice search optimization.',
    'missing-entity-schema': 'Add Organization or Person schema to establish entity authority.',
    'low-fact-density': 'Add more facts, statistics, and citable statements to your content.',
  };

  return descriptions[taskType] || 'Review and fix this SEO issue.';
}
