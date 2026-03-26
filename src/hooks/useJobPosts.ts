import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface JobPost {
  id: string;
  title: string;
  slug: string;
  department_id: string;
  location_type: string;
  location_country: string | null;
  commitment_type: string;
  commitment_custom: string | null;
  about_the_role: string;
  key_responsibilities: string;
  requirements: string;
  nice_to_have: string | null;
  what_we_offer: string | null;
  apply_type: string;
  apply_external_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  department?: { id: string; name: string; icon_url: string | null };
}

export interface JobPostInput {
  title: string;
  slug: string;
  department_id: string;
  location_type: string;
  location_country?: string | null;
  commitment_type: string;
  commitment_custom?: string | null;
  about_the_role: string;
  key_responsibilities: string;
  requirements: string;
  nice_to_have?: string | null;
  what_we_offer?: string | null;
  apply_type: string;
  apply_external_url?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export function useJobPosts(activeOnly = false) {
  return useQuery({
    queryKey: ['job-posts', { activeOnly }],
    queryFn: async () => {
      const query = supabase
        .from('job_posts' as any)
        .select('*, department:departments(*)')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (activeOnly) {
        query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as JobPost[];
    },
  });
}

export function useJobPostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['job-post', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('job_posts' as any)
        .select('*, department:departments(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      if (error) throw error;
      return data as unknown as JobPost;
    },
    enabled: !!slug,
  });
}

export function useCreateJobPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: JobPostInput) => {
      const { data, error } = await supabase
        .from('job_posts' as any)
        .insert(input as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['job-posts'] }),
  });
}

export function useUpdateJobPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: JobPostInput & { id: string }) => {
      const { data, error } = await supabase
        .from('job_posts' as any)
        .update(input as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['job-posts'] }),
  });
}

export function useDeleteJobPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_posts' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['job-posts'] }),
  });
}

export function useToggleJobPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('job_posts' as any)
        .update({ is_active } as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['job-posts'] }),
  });
}
