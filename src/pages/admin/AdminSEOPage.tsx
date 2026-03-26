/**
 * AdminSEOPage
 * 
 * Main SEO Studio page - completely decoupled from the Page Builder.
 * Provides SEO, AEO, and GEO optimization tools for any page.
 */

import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { SEODashboard } from '@/components/admin/seo-system/SEODashboard';
import { useSEOAnalysis } from '@/components/admin/seo-system/hooks/useSEOAnalysis';
import { usePageDataById, usePagesList } from '@/hooks/queries/usePageData';
import { Loader2 } from 'lucide-react';

const AdminSEOPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get language from URL query param, default to 'en'
  const selectedLanguage = searchParams.get('lang') || 'en';
  
  // Get list of pages for selector
  const { data: pages, isLoading: pagesLoading } = usePagesList({ isActive: true });
  
  // Get selected page data if pageId is provided
  const { data: pageData, isLoading: pageLoading } = usePageDataById(pageId);
  
  // Get SEO scores for compact bar
  const { seoScore, aeoScore, geoScore, isLoading: scoresLoading } = useSEOAnalysis(
    pageId || '', 
    selectedLanguage
  );
  
  const handlePageSelect = (selectedPageId: string) => {
    navigate(`/a93jf02kd92ms71x8qp4/seo/${selectedPageId}?lang=${selectedLanguage}`);
  };

  const handleLanguageChange = (langCode: string) => {
    setSearchParams({ lang: langCode });
  };

  if (pagesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main Content */}
      <div className="flex-1 min-h-0">
        {pageId ? (
          pageLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pageData ? (
            <SEODashboard 
              pageId={pageId} 
              pageData={pageData} 
              languageCode={selectedLanguage}
              pages={pages || []}
              onPageSelect={handlePageSelect}
              onLanguageChange={handleLanguageChange}
              seoScore={seoScore}
              aeoScore={aeoScore}
              geoScore={geoScore}
              scoresLoading={scoresLoading}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Page not found</p>
            </div>
          )
        ) : (
          /* No page selected - show dashboard with left panel only */
          <SEODashboard 
            pageId=""
            pageData={{ id: '', page_title: '', page_url: '' } as any}
            languageCode={selectedLanguage}
            pages={pages || []}
            onPageSelect={handlePageSelect}
            onLanguageChange={handleLanguageChange}
            seoScore={0}
            aeoScore={0}
            geoScore={0}
            scoresLoading={false}
          />
        )}
      </div>
    </div>
  );
};

export default AdminSEOPage;
