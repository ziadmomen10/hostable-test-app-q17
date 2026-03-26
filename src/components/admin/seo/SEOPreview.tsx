import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Globe, Search } from 'lucide-react';

interface SEOData {
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  no_index?: boolean;
  no_follow?: boolean;
}

interface SEOPreviewProps {
  seoData: SEOData;
  pageUrl: string;
  siteName?: string;
}

interface SEOIssue {
  type: 'error' | 'warning' | 'success';
  message: string;
  field: string;
}

export const calculateSEOScore = (seoData: SEOData, pageUrl: string): { score: number; issues: SEOIssue[] } => {
  const issues: SEOIssue[] = [];
  let score = 0;
  const maxScore = 100;
  
  // Meta Title (25 points)
  if (seoData.meta_title) {
    const titleLength = seoData.meta_title.length;
    if (titleLength >= 30 && titleLength <= 60) {
      score += 25;
      issues.push({ type: 'success', message: 'Title length is optimal (30-60 chars)', field: 'meta_title' });
    } else if (titleLength > 0 && titleLength < 30) {
      score += 15;
      issues.push({ type: 'warning', message: `Title too short (${titleLength} chars, aim for 30-60)`, field: 'meta_title' });
    } else if (titleLength > 60) {
      score += 15;
      issues.push({ type: 'warning', message: `Title too long (${titleLength} chars, may be truncated)`, field: 'meta_title' });
    }
  } else {
    issues.push({ type: 'error', message: 'Missing meta title', field: 'meta_title' });
  }
  
  // Meta Description (25 points)
  if (seoData.meta_description) {
    const descLength = seoData.meta_description.length;
    if (descLength >= 120 && descLength <= 160) {
      score += 25;
      issues.push({ type: 'success', message: 'Description length is optimal (120-160 chars)', field: 'meta_description' });
    } else if (descLength > 0 && descLength < 120) {
      score += 15;
      issues.push({ type: 'warning', message: `Description too short (${descLength} chars, aim for 120-160)`, field: 'meta_description' });
    } else if (descLength > 160) {
      score += 15;
      issues.push({ type: 'warning', message: `Description too long (${descLength} chars, may be truncated)`, field: 'meta_description' });
    }
  } else {
    issues.push({ type: 'error', message: 'Missing meta description', field: 'meta_description' });
  }
  
  // Open Graph (20 points)
  if (seoData.og_title && seoData.og_description) {
    score += 10;
    issues.push({ type: 'success', message: 'Open Graph title and description set', field: 'og_title' });
  } else if (seoData.og_title || seoData.og_description) {
    score += 5;
    issues.push({ type: 'warning', message: 'Incomplete Open Graph data', field: 'og_title' });
  } else {
    issues.push({ type: 'warning', message: 'No Open Graph data (social sharing may look poor)', field: 'og_title' });
  }
  
  if (seoData.og_image_url) {
    score += 10;
    issues.push({ type: 'success', message: 'Social share image set', field: 'og_image_url' });
  } else {
    issues.push({ type: 'warning', message: 'No social share image', field: 'og_image_url' });
  }
  
  // Canonical URL (15 points)
  if (seoData.canonical_url) {
    score += 15;
    issues.push({ type: 'success', message: 'Canonical URL set', field: 'canonical_url' });
  } else {
    score += 10; // Still okay without explicit canonical
    issues.push({ type: 'warning', message: 'No canonical URL (will use page URL)', field: 'canonical_url' });
  }
  
  // Indexing (15 points)
  if (!seoData.no_index) {
    score += 15;
    issues.push({ type: 'success', message: 'Page is indexable', field: 'no_index' });
  } else {
    issues.push({ type: 'warning', message: 'Page set to no-index (won\'t appear in search)', field: 'no_index' });
  }
  
  return { score: Math.min(score, maxScore), issues };
};

export const SEOPreview: React.FC<SEOPreviewProps> = ({ seoData, pageUrl, siteName = 'Your Site' }) => {
  const { score, issues } = calculateSEOScore(seoData, pageUrl);
  
  const displayTitle = seoData.meta_title || 'Page Title';
  const displayDescription = seoData.meta_description || 'No description available for this page.';
  const displayUrl = seoData.canonical_url || pageUrl;
  
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getScoreBadge = () => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <div className="space-y-4">
      {/* SEO Score */}
      <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
            <Badge className={getScoreBadge()}>{score}/100</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={score} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {score >= 80 ? 'Excellent! Your page is well optimized.' :
             score >= 60 ? 'Good, but there\'s room for improvement.' :
             'Needs work. Review the issues below.'}
          </p>
        </CardContent>
      </Card>
      
      {/* Google Preview */}
      <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Google Search Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
            {/* URL breadcrumb */}
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <Globe className="h-3 w-3" />
              <span className="truncate">{displayUrl}</span>
            </div>
            
            {/* Title */}
            <h3 className="text-lg text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer truncate">
              {displayTitle.length > 60 ? displayTitle.substring(0, 57) + '...' : displayTitle}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {displayDescription.length > 160 ? displayDescription.substring(0, 157) + '...' : displayDescription}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Social Preview */}
      {(seoData.og_title || seoData.og_image_url) && (
        <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Social Share Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
              {seoData.og_image_url && (
                <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={seoData.og_image_url} 
                    alt="Social preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{siteName}</p>
                <h4 className="font-medium text-sm mt-1 truncate">
                  {seoData.og_title || displayTitle}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {seoData.og_description || displayDescription}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Issues List */}
      <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">SEO Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {issues.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                {issue.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />}
                {issue.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />}
                {issue.type === 'error' && <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />}
                <span className={
                  issue.type === 'error' ? 'text-red-600 dark:text-red-400' :
                  issue.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-green-600 dark:text-green-400'
                }>
                  {issue.message}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOPreview;
