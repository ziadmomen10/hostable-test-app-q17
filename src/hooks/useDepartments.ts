import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Department {
  id: string;
  name: string;
  icon_url: string | null;
  created_at: string;
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments' as any)
        .select('*')
        .order('name');
      if (error) throw error;
      return (data || []) as unknown as Department[];
    },
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; icon_url?: string }) => {
      const { data, error } = await supabase
        .from('departments' as any)
        .insert(input as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as Department;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('departments' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}
