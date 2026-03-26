/**
 * ExportPopover
 * 
 * Compact export options popover for SEO reports.
 * Supports JSON, CSV, and formatted report exports.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  FileText,
  Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { seoQueryKeys } from './hooks/queryKeys';
import type { PageData } from '@/hooks/queries/usePageData';

interface ExportPopoverProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  trigger?: React.ReactNode;
  isDirty?: boolean; // Gap 4.3 - prop-based dirty detection instead of DOM query
}

export function ExportPopover({ pageId, pageData, languageCode, trigger, isDirty }: ExportPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: seoData } = useQuery({
    queryKey: seoQueryKeys.pageSeo(pageId, languageCode),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_id', pageId)
        .eq('language_code', languageCode)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!pageId,
  });

  // Gap 4.3 - Use prop-based isDirty when available, fallback to DOM query for backwards compatibility
  const handleOpenChange = (open: boolean) => {
    if (open) {
      if (isDirty !== undefined) {
        // Use prop if provided (preferred)
        setHasUnsavedChanges(isDirty);
      } else {
        // Fallback to DOM query for backwards compatibility
        const unsavedBadge = document.querySelector('[class*="Unsaved"]');
        setHasUnsavedChanges(!!unsavedBadge);
      }
    }
    setIsOpen(open);
  };

  const exportJSON = async () => {
    setIsExporting('json');
    try {
      const exportData = {
        page: {
          id: pageId,
          title: pageData.page_title,
          url: pageData.page_url,
          language: languageCode,
        },
        seo: seoData || {},
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `seo-${pageData.page_url.replace(/\//g, '-')}-${languageCode}.json`);
      toast.success('JSON exported');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setIsExporting(null);
      setIsOpen(false);
    }
  };

  const exportCSV = async () => {
    setIsExporting('csv');
    try {
      const rows = [
        ['Field', 'Value'],
        ['Page Title', pageData.page_title || ''],
        ['Page URL', pageData.page_url || ''],
        ['Language', languageCode],
        ['Meta Title', seoData?.meta_title || ''],
        ['Meta Title Length', String(seoData?.meta_title?.length || 0)],
        ['Meta Description', seoData?.meta_description || ''],
        ['Meta Description Length', String(seoData?.meta_description?.length || 0)],
        ['Focus Keyword', seoData?.focus_keyword || ''],
        ['Canonical URL', seoData?.canonical_url || ''],
        ['No Index', String(seoData?.no_index || false)],
        ['No Follow', String(seoData?.no_follow || false)],
        ['OG Title', seoData?.og_title || ''],
        ['OG Description', seoData?.og_description || ''],
        ['OG Image', seoData?.og_image_url || ''],
        ['SEO Score', String(seoData?.seo_score || 0)],
      ];

      const csvContent = rows.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      downloadBlob(blob, `seo-${pageData.page_url.replace(/\//g, '-')}-${languageCode}.csv`);
      toast.success('CSV exported');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setIsExporting(null);
      setIsOpen(false);
    }
  };

  const exportReport = async () => {
    setIsExporting('report');
    try {
      const titleLen = seoData?.meta_title?.length || 0;
      const descLen = seoData?.meta_description?.length || 0;

      const report = `
SEO REPORT
==========
Generated: ${new Date().toLocaleString()}

PAGE INFORMATION
----------------
Title: ${pageData.page_title}
URL: ${pageData.page_url}
Language: ${languageCode}

META TAGS
---------
Meta Title (${titleLen}/60): ${seoData?.meta_title || 'Not set'}
Status: ${titleLen >= 30 && titleLen <= 60 ? '✓ Good' : '⚠ Needs attention'}

Meta Description (${descLen}/160): ${seoData?.meta_description || 'Not set'}
Status: ${descLen >= 120 && descLen <= 160 ? '✓ Good' : '⚠ Needs attention'}

Focus Keyword: ${seoData?.focus_keyword || 'Not set'}

TECHNICAL SEO
-------------
Canonical URL: ${seoData?.canonical_url || 'Using page URL'}
No Index: ${seoData?.no_index ? 'Yes' : 'No'}
No Follow: ${seoData?.no_follow ? 'Yes' : 'No'}

SOCIAL MEDIA
------------
OG Title: ${seoData?.og_title || 'Not set'}
OG Description: ${seoData?.og_description || 'Not set'}
OG Image: ${seoData?.og_image_url || 'Not set'}

STRUCTURED DATA
---------------
${seoData?.structured_data ? JSON.stringify(seoData.structured_data, null, 2) : 'None configured'}

RECOMMENDATIONS
---------------
${generateRecommendations(seoData, pageData)}
`.trim();

      const blob = new Blob([report], { type: 'text/plain' });
      downloadBlob(blob, `seo-report-${pageData.page_url.replace(/\//g, '-')}-${languageCode}.txt`);
      toast.success('Report exported');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setIsExporting(null);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
            <Download className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1" align="end">
        <div className="space-y-0.5">
          {/* Unsaved changes warning (Gap 3.2) */}
          {hasUnsavedChanges && (
            <div className="text-[9px] text-yellow-600 bg-yellow-500/10 px-2 py-1 rounded mb-1">
              ⚠️ Exports saved data only
            </div>
          )}
          <span className="text-[9px] text-muted-foreground px-2">Export As</span>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-6 text-[10px]"
            onClick={exportJSON}
            disabled={isExporting !== null}
          >
            {isExporting === 'json' ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
            ) : (
              <FileJson className="h-3 w-3 mr-1.5" />
            )}
            JSON
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-6 text-[10px]"
            onClick={exportCSV}
            disabled={isExporting !== null}
          >
            {isExporting === 'csv' ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
            ) : (
              <FileSpreadsheet className="h-3 w-3 mr-1.5" />
            )}
            CSV
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-6 text-[10px]"
            onClick={exportReport}
            disabled={isExporting !== null}
          >
            {isExporting === 'report' ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
            ) : (
              <FileText className="h-3 w-3 mr-1.5" />
            )}
            Report
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateRecommendations(seoData: any, pageData: any): string {
  const recommendations: string[] = [];
  
  const titleLen = seoData?.meta_title?.length || 0;
  const descLen = seoData?.meta_description?.length || 0;

  if (titleLen === 0) {
    recommendations.push('• Add a meta title (30-60 characters recommended)');
  } else if (titleLen < 30) {
    recommendations.push('• Meta title is too short - aim for at least 30 characters');
  } else if (titleLen > 60) {
    recommendations.push('• Meta title is too long - aim for under 60 characters');
  }

  if (descLen === 0) {
    recommendations.push('• Add a meta description (120-160 characters recommended)');
  } else if (descLen < 120) {
    recommendations.push('• Meta description is too short - aim for at least 120 characters');
  } else if (descLen > 160) {
    recommendations.push('• Meta description is too long - aim for under 160 characters');
  }

  if (!seoData?.focus_keyword) {
    recommendations.push('• Set a focus keyword to optimize content');
  }

  if (!seoData?.og_image_url) {
    recommendations.push('• Add an Open Graph image for social sharing');
  }

  if (!seoData?.structured_data) {
    recommendations.push('• Add structured data (JSON-LD schema) for rich results');
  }

  return recommendations.length > 0 
    ? recommendations.join('\n') 
    : '✓ Great job! All major SEO elements are in place.';
}
