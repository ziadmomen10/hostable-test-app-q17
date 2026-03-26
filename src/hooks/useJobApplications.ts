import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface JobApplication {
  id: string;
  job_post_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  resume_url: string | null;
  cover_letter: string | null;
  created_at: string;
}

export function useJobApplications(jobPostId?: string) {
  return useQuery({
    queryKey: ['job-applications', jobPostId],
    queryFn: async () => {
      let query = supabase
        .from('job_applications' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (jobPostId) {
        query = query.eq('job_post_id', jobPostId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as JobApplication[];
    },
    enabled: !!jobPostId,
  });
}

export function useSubmitApplication() {
  return useMutation({
    mutationFn: async (input: {
      job_post_id: string;
      full_name: string;
      email: string;
      phone?: string;
      resume_url?: string;
      cover_letter?: string;
    }) => {
      const { data, error } = await supabase
        .from('job_applications' as any)
        .insert(input as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
}
