import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Loader2, Globe, Share2, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SEOPreview, calculateSEOScore } from './SEOPreview';

interface SEOData {
  id?: string;
  page_id: string;
  language_code: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  og_type: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  no_index: boolean;
  no_follow: boolean;
  structured_data: any;
  seo_score: number;
  seo_issues: any[];
}

interface Language {
  id: string;
  code: string;
  name: string;
}

interface SEOEditorProps {
  pageId: string;
  pageUrl: string;
  pageTitle: string;
  languages: Language[];
}

const defaultSEOData: Omit<SEOData, 'page_id'> = {
  language_code: 'en',
  meta_title: '',
  meta_description: '',
  canonical_url: '',
  og_title: '',
  og_description: '',
  og_image_url: '',
  og_type: 'website',
  twitter_card: 'summary_large_image',
  twitter_title: '',
  twitter_description: '',
  no_index: false,
  no_follow: false,
  structured_data: null,
  seo_score: 0,
  seo_issues: []
};

export const SEOEditor: React.FC<SEOEditorProps> = ({
  pageId,
  pageUrl,
  pageTitle,
  languages
}) => {
  
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [seoData, setSeoData] = useState<SEOData>({ ...defaultSEOData, page_id: pageId });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch SEO data for selected language
  const fetchSEOData = async (langCode: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_id', pageId)
        .eq('language_code', langCode)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSeoData(data as SEOData);
      } else {
        // Initialize with defaults, using page title as initial meta title
        setSeoData({
          ...defaultSEOData,
          page_id: pageId,
          language_code: langCode,
          meta_title: pageTitle,
          canonical_url: pageUrl
        });
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEOData(selectedLanguage);
  }, [pageId, selectedLanguage]);

  const handleChange = (field: keyof SEOData, value: any) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Calculate SEO score before saving
      const { score, issues } = calculateSEOScore(seoData, pageUrl);
      
      const dataToSave = {
        page_id: seoData.page_id,
        language_code: seoData.language_code,
        meta_title: seoData.meta_title,
        meta_description: seoData.meta_description,
        canonical_url: seoData.canonical_url || null,
        og_title: seoData.og_title || null,
        og_description: seoData.og_description || null,
        og_image_url: seoData.og_image_url || null,
        og_type: seoData.og_type,
        twitter_card: seoData.twitter_card,
        twitter_title: seoData.twitter_title || null,
        twitter_description: seoData.twitter_description || null,
        no_index: seoData.no_index,
        no_follow: seoData.no_follow,
        structured_data: seoData.structured_data,
        seo_score: score,
        seo_issues: issues as any
      };

      const { error } = await supabase
        .from('page_seo')
        .upsert(dataToSave, { 
          onConflict: 'page_id,language_code'
        });

      if (error) throw error;

      toast.success(`SEO settings saved - Score: ${score}/100`);

      // Log activity
      await supabase.from('activity_logs').insert({
        activity_type: 'seo_updated',
        title: 'SEO settings updated',
        description: `SEO for ${pageUrl} (${selectedLanguage}) - Score: ${score}`,
        entity_type: 'page_seo',
        entity_id: pageId,
        metadata: { language: selectedLanguage, score }
      });

    } catch (error: any) {
      console.error('Error saving SEO:', error);
      toast.error(error.message || 'Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const CharCounter: React.FC<{ value: string; max: number; optimal: { min: number; max: number } }> = 
    ({ value, max, optimal }) => {
      const len = value?.length || 0;
      const isOptimal = len >= optimal.min && len <= optimal.max;
      const isTooLong = len > max;
      
      return (
        <span className={`text-xs ${
          isTooLong ? 'text-red-500' : 
          isOptimal ? 'text-green-500' : 
          'text-muted-foreground'
        }`}>
          {len}/{max} {isOptimal && '✓'}
        </span>
      );
    };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor Column */}
      <div className="space-y-4">
        {/* Language Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[180px] bg-white/[0.04] border-white/[0.08]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save SEO
          </Button>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-1">
              <Settings2 className="h-3 w-3" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              Social
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Basic SEO */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Meta Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <CharCounter value={seoData.meta_title} max={70} optimal={{ min: 30, max: 60 }} />
                  </div>
                  <Input
                    id="meta_title"
                    value={seoData.meta_title}
                    onChange={e => handleChange('meta_title', e.target.value)}
                    placeholder="Enter page title for search engines"
                    maxLength={70}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Aim for 30-60 characters. Include your main keyword.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <CharCounter value={seoData.meta_description} max={160} optimal={{ min: 120, max: 160 }} />
                  </div>
                  <Textarea
                    id="meta_description"
                    value={seoData.meta_description}
                    onChange={e => handleChange('meta_description', e.target.value)}
                    placeholder="Compelling description that encourages clicks"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Aim for 120-160 characters. Include a call-to-action.
                  </p>
                </div>

                <div>
                  <Label htmlFor="canonical_url">Canonical URL</Label>
                  <Input
                    id="canonical_url"
                    value={seoData.canonical_url}
                    onChange={e => handleChange('canonical_url', e.target.value)}
                    placeholder={pageUrl}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to use page URL. Set if you have duplicate content.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media */}
          <TabsContent value="social" className="space-y-4 mt-4">
            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Open Graph (Facebook, LinkedIn)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="og_title">OG Title</Label>
                  <Input
                    id="og_title"
                    value={seoData.og_title}
                    onChange={e => handleChange('og_title', e.target.value)}
                    placeholder={seoData.meta_title || 'Same as meta title'}
                    maxLength={70}
                  />
                </div>

                <div>
                  <Label htmlFor="og_description">OG Description</Label>
                  <Textarea
                    id="og_description"
                    value={seoData.og_description}
                    onChange={e => handleChange('og_description', e.target.value)}
                    placeholder={seoData.meta_description || 'Same as meta description'}
                    maxLength={200}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="og_image_url">OG Image URL</Label>
                  <Input
                    id="og_image_url"
                    value={seoData.og_image_url}
                    onChange={e => handleChange('og_image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 1200x630px for best display on social platforms.
                  </p>
                </div>

                <div>
                  <Label htmlFor="og_type">OG Type</Label>
                  <Select value={seoData.og_type} onValueChange={v => handleChange('og_type', v)}>
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="profile">Profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Twitter Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="twitter_card">Card Type</Label>
                  <Select value={seoData.twitter_card} onValueChange={v => handleChange('twitter_card', v)}>
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="twitter_title">Twitter Title</Label>
                  <Input
                    id="twitter_title"
                    value={seoData.twitter_title}
                    onChange={e => handleChange('twitter_title', e.target.value)}
                    placeholder={seoData.og_title || 'Same as OG title'}
                    maxLength={70}
                  />
                </div>

                <div>
                  <Label htmlFor="twitter_description">Twitter Description</Label>
                  <Textarea
                    id="twitter_description"
                    value={seoData.twitter_description}
                    onChange={e => handleChange('twitter_description', e.target.value)}
                    placeholder={seoData.og_description || 'Same as OG description'}
                    maxLength={200}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced */}
          <TabsContent value="advanced" className="space-y-4 mt-4">
            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Indexing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>No Index</Label>
                    <p className="text-xs text-muted-foreground">
                      Prevent search engines from indexing this page
                    </p>
                  </div>
                  <Switch
                    checked={seoData.no_index}
                    onCheckedChange={v => handleChange('no_index', v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>No Follow</Label>
                    <p className="text-xs text-muted-foreground">
                      Prevent search engines from following links on this page
                    </p>
                  </div>
                  <Switch
                    checked={seoData.no_follow}
                    onCheckedChange={v => handleChange('no_follow', v)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Structured Data (JSON-LD)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={seoData.structured_data ? JSON.stringify(seoData.structured_data, null, 2) : ''}
                  onChange={e => {
                    try {
                      const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                      handleChange('structured_data', parsed);
                    } catch {
                      // Invalid JSON, keep as-is for editing
                    }
                  }}
                  placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                  rows={6}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: Add Schema.org structured data for rich snippets.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Column */}
      <div className="space-y-4">
        <SEOPreview 
          seoData={seoData}
          pageUrl={pageUrl}
        />
      </div>
    </div>
  );
};

export default SEOEditor;
