import React, { Suspense, lazy, useMemo, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useParams, Navigate, useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { SEOHead } from '@/components/SEOHead';
import { Loader2 } from 'lucide-react';
import { getPageFileName } from '@/lib/pageFileManager';
import { usePageTranslations } from '@/hooks/usePageTranslations';
import { LogoCarousel } from '@/components/landing/LogoCarousel';
import { PricingSection } from '@/components/landing/PricingSection';
import { usePageDataByUrl, usePageRealtime, PageData } from '@/hooks/queries';
import { LiveSectionRenderer } from '@/components/live';
import { isPageDataJson, parsePageContent } from '@/lib/pageDataMigration';
import { useI18n } from '@/contexts/I18nContext';

interface DynamicPageProps {
  pageName?: string;
}

// Extract logo carousel data from HTML content
const extractLogoCarouselData = (html: string): { 
  logos: { src: string; alt: string }[]; 
  speed: number; 
  pauseOnHover: boolean;
  variant: 'dark' | 'light';
} | null => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const carouselSection = doc.querySelector('[data-component="LogoCarousel"]');
  
  if (!carouselSection) return null;
  
  // Try to get logos from JSON data attribute first (preferred method)
  const logosJson = carouselSection.getAttribute('data-logos');
  let logos: { src: string; alt: string }[] = [];
  
  if (logosJson) {
    try {
      logos = JSON.parse(logosJson);
    } catch (e) {
      console.warn('Failed to parse logos JSON:', e);
    }
  }
  
  // Fallback: extract from images with deduplication (for backward compatibility)
  if (logos.length === 0) {
    const images = carouselSection.querySelectorAll('img');
    const seen = new Set<string>();
    logos = Array.from(images)
      .map(img => ({
        src: img.getAttribute('src') || '/placeholder.svg',
        alt: img.getAttribute('alt') || 'Company logo'
      }))
      .filter(logo => {
        if (seen.has(logo.src)) return false;
        seen.add(logo.src);
        return true;
      });
  }
  
  const speed = parseInt(carouselSection.getAttribute('data-speed') || '50', 10);
  const pauseOnHover = carouselSection.getAttribute('data-pause-on-hover') !== 'false';
  const variant = (carouselSection.getAttribute('data-variant') || 'dark') as 'dark' | 'light';
  
  return { logos, speed, pauseOnHover, variant };
};

// Extract pricing section data from HTML content
const extractPricingSectionData = (html: string): {
  title: string;
  subtitle: string;
  useCarousel: boolean;
  plans: Array<{
    name: string;
    description: string;
    originalPrice: string;
    price: string;
    discount: string;
    period: string;
    buttonText: string;
    features: Array<{ icon: string; label: string }>;
    isHighlighted: boolean;
  }>;
} | null => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const pricingSection = doc.querySelector('[data-component="PricingSection"]');
  
  if (!pricingSection) return null;
  
  const title = pricingSection.getAttribute('data-title') || 'Web Hosting Plans That Scale With You';
  const subtitle = pricingSection.getAttribute('data-subtitle') || 'Reliable, fast, and secure hosting solutions';
  const useCarousel = pricingSection.getAttribute('data-use-carousel') === 'true';
  const planCount = parseInt(pricingSection.getAttribute('data-plan-count') || '4', 10);
  
  const plans = [];
  
  for (let i = 1; i <= planCount; i++) {
    const name = pricingSection.getAttribute(`data-plan-${i}-name`);
    if (!name) continue;
    
    const featuresStr = pricingSection.getAttribute(`data-plan-${i}-features`) || '';
    const features = featuresStr.split('|').filter(Boolean).map(f => {
      const [icon, ...labelParts] = f.split(':');
      return { icon, label: labelParts.join(':') };
    });
    
    // Per-plan highlight (check individual plan attribute)
    const isHighlighted = pricingSection.getAttribute(`data-plan-${i}-highlighted`) === 'true';
    
    plans.push({
      name,
      description: pricingSection.getAttribute(`data-plan-${i}-desc`) || '',
      originalPrice: pricingSection.getAttribute(`data-plan-${i}-original-price`) || '',
      price: pricingSection.getAttribute(`data-plan-${i}-price`) || '',
      discount: pricingSection.getAttribute(`data-plan-${i}-discount`) || '',
      period: pricingSection.getAttribute(`data-plan-${i}-period`) || '/mo',
      buttonText: pricingSection.getAttribute(`data-plan-${i}-button`) || 'Get Started',
      features,
      isHighlighted,
    });
  }
  
  return { title, subtitle, useCarousel, plans };
};

// Component that renders JSON sections-based pages (new React Page Builder format)
const SectionsContent: React.FC<{ pageData: PageData }> = ({ pageData }) => {
  // CRITICAL FIX: Subscribe to messagesVersion to trigger re-renders when translations load
  const { messagesVersion } = useI18n();
  
  const parsedContent = useMemo(() => {
    return parsePageContent(pageData.content, pageData.id, {
      title: pageData.page_title,
    });
  }, [pageData.content, pageData.id, pageData.page_title]);

  if (!parsedContent || parsedContent.sections.length === 0) {
    return (
      <PageLayout>
        <SEOHead 
          title={pageData.page_title}
          description={pageData.page_description || undefined}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">No content yet. Edit this page in the admin panel.</p>
        </div>
      </PageLayout>
    );
  }

  // Use messagesVersion as a key dependency to force child re-renders when translations update
  // This ensures LiveSectionRenderer components re-compute translated props
  return (
    <PageLayout key={`page-${messagesVersion}`}>
      <SEOHead 
        title={pageData.page_title}
        description={pageData.page_description || undefined}
        keywords={pageData.page_keywords || undefined}
        ogImage={pageData.og_image_url || undefined}
      />
      {parsedContent.sections
        .filter(section => section.visible !== false)
        .sort((a, b) => a.order - b.order)
        .map(section => (
          <LiveSectionRenderer
            key={`${section.id}-${messagesVersion}`}
            section={section}
          />
        ))
      }
    </PageLayout>
  );
};

// Component that renders translated content (legacy HTML format)
const TranslatedContent: React.FC<{ pageData: PageData }> = ({ pageData }) => {
  // Process content for image replacements
  let processedContent = pageData.content || '';
  if (pageData.header_image_url) {
    processedContent = processedContent.replace(
      /src="[^"]*(?:lovable-uploads|storage\.v1\.object\.public)[^"]*"/gi,
      `src="${pageData.header_image_url}"`
    );
  }

  // Apply translations based on current language
  const { translatedContent, isTranslating } = usePageTranslations(
    pageData.page_url,
    processedContent
  );

  // Extract logo carousel data if present
  const logoCarouselData = useMemo(() => {
    return extractLogoCarouselData(translatedContent || '');
  }, [translatedContent]);

  // Extract pricing section data if present
  const pricingData = useMemo(() => {
    return extractPricingSectionData(translatedContent || '');
  }, [translatedContent]);

  // Remove dynamic component placeholders from HTML and replace with comment markers
  const processedHtml = useMemo(() => {
    if (!translatedContent) return translatedContent;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(translatedContent, 'text/html');
    
    // Replace LogoCarousel with comment marker
    if (logoCarouselData) {
      const carouselSection = doc.querySelector('[data-component="LogoCarousel"]');
      if (carouselSection) {
        const marker = doc.createComment('REACT_COMPONENT:LogoCarousel');
        carouselSection.parentNode?.replaceChild(marker, carouselSection);
      }
    }
    
    // Replace PricingSection with comment marker
    if (pricingData) {
      const pricingSection = doc.querySelector('[data-component="PricingSection"]');
      if (pricingSection) {
        const marker = doc.createComment('REACT_COMPONENT:PricingSection');
        pricingSection.parentNode?.replaceChild(marker, pricingSection);
      }
    }
    
    return doc.body.innerHTML;
  }, [translatedContent, logoCarouselData, pricingData]);

  if (isTranslating) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  // Render content with React components replacing comment markers
  const renderContentWithComponents = () => {
    if (!processedHtml) return null;
    
    // Split by comment markers - captures the component name
    const parts = processedHtml.split(/<!--REACT_COMPONENT:(LogoCarousel|PricingSection)-->/);
    
    return parts.map((part, index) => {
      // Check if this part is a component name (from the regex capture group)
      if (part === 'LogoCarousel' && logoCarouselData) {
        return (
          <LogoCarousel
            key={`carousel-${index}`}
            logos={logoCarouselData.logos}
            speed={logoCarouselData.speed}
            pauseOnHover={logoCarouselData.pauseOnHover}
            variant={logoCarouselData.variant}
          />
        );
      }
      
      if (part === 'PricingSection' && pricingData) {
        return (
          <PricingSection
            key={`pricing-${index}`}
            title={pricingData.title}
            subtitle={pricingData.subtitle}
            plans={pricingData.plans}
            useCarousel={pricingData.useCarousel}
          />
        );
      }
      
      // Regular HTML content
      if (part.trim()) {
        return <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(part) }} />;
      }
      
      return null;
    });
  };

  return (
    <PageLayout>
      <SEOHead 
        title={pageData.page_title}
        description={pageData.page_description || undefined}
        keywords={pageData.page_keywords || undefined}
        ogImage={pageData.og_image_url || undefined}
      />
      {pageData.css_content && (
        <style dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pageData.css_content) }} />
      )}
      {renderContentWithComponents()}
    </PageLayout>
  );
};

const DynamicPage: React.FC<DynamicPageProps> = ({ pageName }) => {
  const { '*': pagePath } = useParams();
  const [searchParams] = useSearchParams();
  const currentPath = pageName || pagePath || '';
  
  const { currentLanguage, changeLanguage, isLoading: i18nLoading } = useI18n();
  
  // Detect ?lang parameter from URL (used by SEO preview iframe)
  const urlLang = searchParams.get('lang');
  
  // Sync language from URL parameter - critical for SEO preview iframe
  useEffect(() => {
    if (urlLang && currentLanguage?.code !== urlLang) {
      console.log('[DynamicPage] URL lang detected, switching to:', urlLang);
      changeLanguage(urlLang);
    }
  }, [urlLang, currentLanguage?.code, changeLanguage]);
  
  // Use React Query for data fetching with caching
  const { data: pageData, isLoading, error } = usePageDataByUrl(currentPath);
  
  // Set up real-time subscription using the new hook
  usePageRealtime(pageData?.id);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !pageData) {
    return <Navigate to="/404" replace />;
  }

  // If there's content in the database, check the format
  if (pageData.content) {
    // Check if content is new JSON sections format from React Page Builder
    if (isPageDataJson(pageData.content)) {
      return <SectionsContent pageData={pageData} />;
    }
    // Fall back to legacy HTML content renderer
    return <TranslatedContent pageData={pageData} />;
  }

  // Otherwise, try to load the React component
  const fileName = getPageFileName(pageData.page_url);
  
  const PageComponent = lazy(() => 
    import(`./dynamic/${fileName}.tsx`).catch(() => ({
      default: () => (
        <PageLayout>
          <div className="container mx-auto px-6 py-12">
            {/* Header Image */}
            {pageData.header_image_url && (
              <div className="mb-8">
                <img
                  src={pageData.header_image_url}
                  alt={pageData.page_title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Page Content */}
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-6">{pageData.page_title}</h1>
              
              {pageData.page_description && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground mb-8">
                    {pageData.page_description}
                  </p>
                </div>
              )}

              {/* Page Content */}
              <div className="prose prose-lg max-w-none">
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-semibold mb-4">No Content Yet</h2>
                  <p className="text-muted-foreground">
                    Edit this page in the admin panel to add your content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageLayout>
      )
    }))
  );

  return (
    <Suspense fallback={
      <PageLayout>
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </PageLayout>
    }>
      <PageComponent />
    </Suspense>
  );
};

export default DynamicPage;