import React, { useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Clock, Headphones, Camera } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import LoadingBar from '@/components/LoadingBar';
import { SEOHead } from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/contexts/I18nContext';

type PageData = Database['public']['Tables']['pages']['Row'];

const VpsHostingPage = React.memo(() => {
  const { t } = useTranslation('vps_hosting');
  const { isRTL } = useI18n();
  
  const { data: pageData, isLoading, refetch } = useQuery<PageData | null>({
    queryKey: ['page-data', '/vps-hosting'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('page_url', '/vps-hosting')
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching page data:', error);
        return null;
      }
      return data;
    },
    staleTime: 0, // Always check for fresh data
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Subscribe to real-time updates for this page
  useEffect(() => {
    const channel = supabase
      .channel('vps-hosting-page-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pages',
          filter: `page_url=eq./vps-hosting`
        },
        (payload) => {
          console.log('Page updated, refetching...', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const features = useMemo(() => [
    { icon: Clock, text: t('feature_uptime') },
    { icon: Camera, text: t('feature_snapshot') },
    { icon: Shield, text: t('feature_ddos') },
    { icon: Headphones, text: t('feature_support') }
  ], [t]);

  // Update header image when pageData changes
  useEffect(() => {
    if (pageData?.header_image_url) {
      const headerImage = document.getElementById('header-image') as HTMLImageElement;
      if (headerImage) {
        headerImage.src = pageData.header_image_url;
      }
    }
  }, [pageData?.header_image_url]);

  const fallbackContent = useMemo(() => (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'rtl' : 'ltr'}`}>
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className={`text-4xl lg:text-6xl font-bold text-foreground leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('title_line1')}
                <br />
                <span className="text-primary">{t('title_line2')}</span>
              </h1>
              
              <p className={`text-lg text-muted-foreground leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('description')}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-muted-foreground">{t('starting_at')}</span>
              </div>
              <div className={`flex items-baseline gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-4xl lg:text-5xl font-bold text-foreground">{t('price')}</span>
                <span className="text-muted-foreground">{t('per_month')}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {t('save_offer')}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <Button size="lg" className="w-full sm:w-auto px-8">
                {t('view_plans')}
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>{t('risk_free')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('money_back')}
              </p>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <img 
              src={pageData?.header_image_url || "/src/assets/server-icon.svg"} 
              alt="Server infrastructure" 
              className="w-96 h-96 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  ), [features, pageData?.header_image_url, t, isRTL]);

  return (
    <PageLayout>
      <SEOHead 
        title={pageData?.page_title || "VPS Hosting - HostOnce"}
        description={pageData?.page_description || "High-performance VPS hosting with 99.9% uptime guarantee"}
        keywords={pageData?.page_keywords || "VPS hosting, virtual private server, cloud VPS, dedicated hosting"}
        ogImage={pageData?.og_image_url || undefined}
      />
      <LoadingBar isLoading={isLoading} />
      {pageData?.css_content && (
        <style dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pageData.css_content) }} />
      )}
      
      {isLoading ? null : pageData?.content ? (
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pageData.content) }} />
      ) : fallbackContent}
    </PageLayout>
  );
});
VpsHostingPage.displayName = 'VpsHostingPage';

export default VpsHostingPage;