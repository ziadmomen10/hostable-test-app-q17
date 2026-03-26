import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string | null;
  direction: string | null;
  is_active: boolean | null;
  is_default: boolean | null;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  is_active: boolean | null;
  is_default: boolean | null;
}

export const languageKeys = {
  all: ['languages'] as const,
  list: (filters: { activeOnly?: boolean }) => [...languageKeys.all, filters] as const,
};

export const currencyKeys = {
  all: ['currencies'] as const,
  list: (filters: { activeOnly?: boolean }) => [...currencyKeys.all, filters] as const,
};

export const useLanguages = (activeOnly = true) => {
  return useQuery({
    queryKey: languageKeys.list({ activeOnly }),
    queryFn: async () => {
      let query = supabase.from('languages').select('*');
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data as Language[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - languages change rarely
  });
};

export const useCurrencies = (activeOnly = true) => {
  return useQuery({
    queryKey: currencyKeys.list({ activeOnly }),
    queryFn: async () => {
      let query = supabase.from('currencies').select('*');
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data as Currency[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - currencies change rarely
  });
};

export const useDefaultLanguage = () => {
  const { data: languages } = useLanguages();
  return languages?.find(l => l.is_default) || languages?.[0];
};

export const useDefaultCurrency = () => {
  const { data: currencies } = useCurrencies();
  return currencies?.find(c => c.is_default) || currencies?.[0];
};
