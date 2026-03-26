import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Save, Settings, FileText, Search, Code, HelpCircle, Globe, Plus, Trash2, ExternalLink, RefreshCw, Eye, EyeOff, CheckSquare, Square, Languages, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProCodeEditor } from '@/components/ProCodeEditor';
import AdminSectionHeader from '@/components/admin/AdminSectionHeader';
import { ReactPageEditor } from '@/components/editor';
import { parsePageContent } from '@/lib/pageDataMigration';

interface PageData {
  id: string;
  page_url: string;
  page_title: string;
  page_description: string | null;
  page_keywords: string | null;
  cloned_from_id: string | null;
  country: string | null;
  supported_languages: string[];
  show_price_switcher: boolean;
  header_image_url: string | null;
  og_image_url: string | null;
  content: string | null;
  css_content: string | null;
  is_active: boolean;
  default_currency: string | null;
  blog_tags: string | null;
  hidden_sections: string[];
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

interface Language {
  id: string;
  code: string;
  name: string;
  native_name?: string;
  direction?: string;
}

interface Translation {
  id: string;
  language_id: string;
  namespace: string;
  key: string;
  value: string | null;
  language_code?: string;
}

interface PageSection {
  id: string;
  name: string;
  visible: boolean;
}

const AdminPageEditor: React.FC = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resettingCache, setResettingCache] = useState(false);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [translationKeys, setTranslationKeys] = useState<string[]>([]);
  const [editingTranslation, setEditingTranslation] = useState<{
    key: string;
    translations: Record<string, string>;
  } | null>(null);
  const [newTranslationKey, setNewTranslationKey] = useState('');
  const [uploadingHeader, setUploadingHeader] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const [visualEditorHasUnsaved, setVisualEditorHasUnsaved] = useState(false);

  // Extract sections from HTML content
  const extractSectionsFromContent = (content: string): PageSection[] => {
    const sections: PageSection[] = [];
    
    // Pattern 1: Look for HTML comments like <!-- Section Name -->
    const commentRegex = /<!--\s*(.+?)\s*-->/g;
    let match;
    while ((match = commentRegex.exec(content)) !== null) {
      const sectionName = match[1].trim();
      if (sectionName && !sectionName.toLowerCase().includes('end') && sectionName.length < 50) {
        const sectionId = sectionName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (!sections.find(s => s.id === sectionId)) {
          sections.push({
            id: sectionId,
            name: sectionName,
            visible: true
          });
        }
      }
    }

    // Pattern 2: Look for <section> tags with id or data-section attributes
    const sectionTagRegex = /<section[^>]*(?:id=["']([^"']+)["']|data-section=["']([^"']+)["'])[^>]*>/gi;
    while ((match = sectionTagRegex.exec(content)) !== null) {
      const sectionId = match[1] || match[2];
      if (sectionId && !sections.find(s => s.id === sectionId)) {
        const sectionName = sectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        sections.push({
          id: sectionId,
          name: sectionName,
          visible: true
        });
      }
    }

    // Pattern 3: Look for div with class containing "section"
    const divSectionRegex = /<div[^>]*class=["'][^"']*section[^"']*["'][^>]*(?:id=["']([^"']+)["'])?[^>]*>/gi;
    while ((match = divSectionRegex.exec(content)) !== null) {
      const sectionId = match[1];
      if (sectionId && !sections.find(s => s.id === sectionId)) {
        const sectionName = sectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        sections.push({
          id: sectionId,
          name: sectionName,
          visible: true
        });
      }
    }

    return sections;
  };

  // Update sections when content changes
  useEffect(() => {
    if (pageData?.content) {
      const extractedSections = extractSectionsFromContent(pageData.content);
      const hiddenSections = pageData.hidden_sections || [];
      
      const sectionsWithVisibility = extractedSections.map(section => ({
        ...section,
        visible: !hiddenSections.includes(section.id)
      }));
      
      setPageSections(sectionsWithVisibility);
    }
  }, [pageData?.content, pageData?.hidden_sections]);

  const handleResetCache = async () => {
    if (!pageData) return;
    
    setResettingCache(true);
    try {
      const { data: configData, error: configError } = await supabase
        .from('admin_config')
        .select('key, value')
        .in('key', ['cloudflare_api_token', 'cloudflare_zone_id']);

      if (configError) throw configError;

      const cfConfig = configData?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);

      if (!cfConfig?.cloudflare_api_token || !cfConfig?.cloudflare_zone_id) {
        toast.error("Cloudflare not configured", {
          description: "Please add Cloudflare API token and Zone ID in Settings → Integrations."
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('purge-cloudflare-cache', {
        body: {
          pageUrl: pageData.page_url,
          apiToken: cfConfig.cloudflare_api_token,
          zoneId: cfConfig.cloudflare_zone_id,
        },
      });

      if (error) throw error;

      toast.success("Cache purged successfully", {
        description: `Cache for ${pageData.page_url} has been reset.`
      });
    } catch (error) {
      console.error('Error resetting cache:', error);
      toast.error("Cache reset failed", {
        description: "Failed to purge Cloudflare cache. Check your API credentials."
      });
    } finally {
      setResettingCache(false);
    }
  };

  useEffect(() => {
    if (pageId) {
      fetchPageData();
      fetchLanguages();
      fetchCurrencies();
    }
  }, [pageId]);

  useEffect(() => {
    if (pageData) {
      fetchTranslationsForPage();
    }
  }, [pageData]);

  const fetchPageData = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (error) throw error;
      setPageData({
        ...data,
        hidden_sections: (data as any).hidden_sections || []
      });
    } catch (error) {
      console.error('Error fetching page:', error);
      toast.error("Failed to load page data");
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('id, code, name, native_name, direction')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setLanguages(data || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('id, code, name, symbol')
        .eq('is_active', true);

      if (error) throw error;
      setCurrencies(data || []);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  const getPageNamespace = (pageUrl: string): string => {
    if (pageUrl === '/' || pageUrl === '/home') return 'homepage';
    if (pageUrl.includes('vps')) return 'vps_hosting';
    if (pageUrl.includes('hosting')) return 'hosting';
    if (pageUrl.includes('domain')) return 'domain';
    return pageUrl.replace(/^\//, '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'page';
  };

  const fetchTranslationsForPage = async () => {
    if (!pageData) return;
    
    try {
      const namespace = getPageNamespace(pageData.page_url);
      const namespacesToFetch = [namespace, 'header', 'footer'];
      
      const { data: translationsData, error } = await supabase
        .from('translations')
        .select(`
          id,
          language_id,
          namespace,
          key,
          value
        `)
        .in('namespace', namespacesToFetch);

      if (error) throw error;

      const { data: languagesData, error: langError } = await supabase
        .from('languages')
        .select('id, code, name')
        .eq('is_active', true);

      if (langError) throw langError;

      const languageMap = (languagesData || []).reduce((acc, lang) => {
        acc[lang.id] = lang.code;
        return acc;
      }, {} as Record<string, string>);

      const transformedTranslations = (translationsData || []).map(t => ({
        ...t,
        language_code: languageMap[t.language_id] || ''
      }));

      setTranslations(transformedTranslations);

      const keysByNamespace = transformedTranslations.reduce((acc, t) => {
        if (!acc[t.namespace]) acc[t.namespace] = new Set();
        acc[t.namespace].add(t.key);
        return acc;
      }, {} as Record<string, Set<string>>);

      const allKeys = Object.entries(keysByNamespace).flatMap(([namespace, keySet]) =>
        Array.from(keySet).map(key => `${namespace}.${key}`)
      );

      setTranslationKeys(allKeys);

    } catch (error) {
      console.error('Error fetching translations:', error);
      toast.error("Failed to load translation keys");
    }
  };

  const handleInputChange = (field: string, value: any) => {
    console.log('Input changed:', { field, value: typeof value === 'string' ? value.substring(0, 100) + '...' : value });
    setPageData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSectionToggle = (sectionId: string, visible: boolean) => {
    setPageSections(prev => 
      prev.map(s => s.id === sectionId ? { ...s, visible } : s)
    );
    
    // Update hidden_sections in pageData
    const newHiddenSections = visible
      ? (pageData?.hidden_sections || []).filter(id => id !== sectionId)
      : [...(pageData?.hidden_sections || []), sectionId];
    
    handleInputChange('hidden_sections', newHiddenSections);
  };

  const handleSave = async () => {
    if (!pageData) return;

    console.log('Starting page save...', { pageId, content: pageData.content?.substring(0, 100) + '...' });
    setSaving(true);
    try {
      const retryCount = 3;
      let lastError;
      
      for (let i = 0; i < retryCount; i++) {
        try {
          console.log(`Saving attempt ${i + 1}...`);
          const { error } = await supabase
            .from('pages')
            .update({
              page_url: pageData.page_url,
              page_title: pageData.page_title,
              page_description: pageData.page_description,
              page_keywords: pageData.page_keywords,
              supported_languages: pageData.supported_languages,
              show_price_switcher: pageData.show_price_switcher,
              header_image_url: pageData.header_image_url,
              og_image_url: pageData.og_image_url,
              content: pageData.content,
              css_content: pageData.css_content,
              blog_tags: pageData.blog_tags,
              default_currency: pageData.default_currency,
              hidden_sections: pageData.hidden_sections as any,
              updated_at: new Date().toISOString(),
            })
            .eq('id', pageId);

          if (error) throw error;
          
          console.log('Page saved successfully!');
          break;
        } catch (error) {
          lastError = error;
          console.log(`Save attempt ${i + 1} failed:`, error);
          
          if (i < retryCount - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      }
      
      if (lastError) throw lastError;

      toast.success("Page updated successfully");
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error("Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'header' | 'og') => {
    const setLoading = type === 'header' ? setUploadingHeader : setUploadingOg;
    
    try {
      console.log('Starting image upload:', { fileName: file.name, size: file.size, type });
      setLoading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${pageId}-${type}-${Date.now()}.${fileExt}`;
      const filePath = `pages/${fileName}`;

      console.log('Uploading to path:', filePath);
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, getting public URL...');
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);
      
      const fieldName = type === 'header' ? 'header_image_url' : 'og_image_url';
      handleInputChange(fieldName, publicUrl);
      
      await handleSave();

      toast.success(`${type === 'header' ? 'Header' : 'OG'} image uploaded successfully`);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload image: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const addTranslationKey = async () => {
    if (!newTranslationKey.trim() || !pageData) return;
    
    try {
      const fullKey = newTranslationKey.trim();
      let namespace: string;
      let key: string;
      
      if (fullKey.includes('.')) {
        const parts = fullKey.split('.');
        namespace = parts[0];
        key = parts.slice(1).join('.');
      } else {
        namespace = getPageNamespace(pageData.page_url);
        key = fullKey;
      }
      
      if (translationKeys.includes(`${namespace}.${key}`)) {
        toast.error("Translation key already exists");
        return;
      }

      const translationsToCreate = languages.map(lang => ({
        language_id: lang.id,
        namespace,
        key,
        value: ''
      }));

      const { error } = await supabase
        .from('translations')
        .insert(translationsToCreate);

      if (error) throw error;

      await fetchTranslationsForPage();
      setNewTranslationKey('');
      
      toast.success("Translation key added successfully");
    } catch (error) {
      console.error('Error adding translation key:', error);
      toast.error("Failed to add translation key");
    }
  };

  const removeTranslationKey = async (fullKey: string) => {
    if (!pageData) return;
    
    try {
      const [namespace, ...keyParts] = fullKey.split('.');
      const key = keyParts.join('.');
      
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('namespace', namespace)
        .eq('key', key);

      if (error) throw error;

      await fetchTranslationsForPage();
      
      toast.success("Translation key removed successfully");
    } catch (error) {
      console.error('Error removing translation key:', error);
      toast.error("Failed to remove translation key");
    }
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = faqs.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    );
    setFaqs(updated);
  };

  const handleSaveTranslation = async () => {
    if (!editingTranslation || !pageData) return;
    
    try {
      const fullKey = editingTranslation.key;
      const [namespace, ...keyParts] = fullKey.split('.');
      const key = keyParts.join('.');
      const { translations: newTranslations } = editingTranslation;

      const updates = Object.entries(newTranslations).map(([langCode, value]) => {
        const language = languages.find(l => l.code === langCode);
        if (!language) return null;
        
        return {
          language_id: language.id,
          namespace,
          key,
          value: value || null
        };
      }).filter(Boolean);

      const { error } = await supabase
        .from('translations')
        .upsert(updates, { 
          onConflict: 'language_id,namespace,key' 
        });

      if (error) throw error;

      await fetchTranslationsForPage();
      setEditingTranslation(null);
      
      toast.success("Translations saved successfully");
    } catch (error) {
      console.error('Error saving translations:', error);
      toast.error("Failed to save translations");
    }
  };

  const handleFetchBlogs = async () => {
    if (!pageData?.blog_tags?.trim()) {
      toast.error("Please enter blog tags first");
      return;
    }

    try {
      toast.info("Fetching blogs with tags: " + pageData.blog_tags);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error("Failed to fetch blogs");
    }
  };

  const updateModalTranslation = (langCode: string, value: string) => {
    if (!editingTranslation) return;
    
    setEditingTranslation({
      ...editingTranslation,
      translations: { ...editingTranslation.translations, [langCode]: value }
    });
  };

  // Filter languages based on search
  const filteredLanguages = useMemo(() => {
    if (!languageSearch.trim()) return languages;
    const search = languageSearch.toLowerCase();
    return languages.filter(lang => 
      lang.name.toLowerCase().includes(search) ||
      lang.code.toLowerCase().includes(search) ||
      lang.native_name?.toLowerCase().includes(search)
    );
  }, [languages, languageSearch]);

  // Language selection helpers
  const handleSelectAllLanguages = () => {
    handleInputChange('supported_languages', languages.map(l => l.code));
  };

  const handleUnselectAllLanguages = () => {
    handleInputChange('supported_languages', []);
  };

  const handleLanguageToggle = (langCode: string, checked: boolean) => {
    const currentLangs = pageData?.supported_languages || [];
    const newLangs = checked 
      ? [...currentLangs, langCode]
      : currentLangs.filter(c => c !== langCode);
    handleInputChange('supported_languages', newLangs);
  };

  const selectedLangCount = pageData?.supported_languages?.length || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading page editor...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <Button onClick={() => navigate('/a93jf02kd92ms71x8qp4/pages')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-8 pb-24">
      {/* Header with Modern Glassmorphism Design */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/a93jf02kd92ms71x8qp4/pages')}
                className="rounded-xl bg-background/70 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pages
              </Button>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{pageData.page_title}</h1>
                <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                  </span>
                  Edit Mode
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="default"
                size="sm"
                onClick={() => setShowVisualEditor(true)}
                className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Palette className="h-4 w-4 mr-1.5" />
                Visual Editor
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  const previewUrl = `${window.location.origin}${pageData.page_url}`;
                  window.open(previewUrl, '_blank');
                }}
                className="rounded-lg bg-background/70 border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Preview
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleResetCache}
                disabled={resettingCache}
                className="rounded-lg bg-background/70 border-border/50 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-500 transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${resettingCache ? 'animate-spin' : ''}`} />
                {resettingCache ? 'Resetting...' : 'Reset Cache'}
              </Button>
              <Button 
                onClick={() => {
                  console.log('Save button clicked!');
                  handleSave();
                }} 
                disabled={saving}
                className="rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="configure" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="configure" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="language-keys" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Language Keys
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQs
          </TabsTrigger>
        </TabsList>

        {/* Configure Tab */}
        <TabsContent value="configure">
          <div className="space-y-6">
            {/* Basic Configuration Card */}
            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader>
                <CardTitle>Basic Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="page_url">Page URL</Label>
                  <Input
                    id="page_url"
                    value={pageData.page_url}
                    onChange={(e) => handleInputChange('page_url', e.target.value)}
                    placeholder="/about-us"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter the URL path for this page (e.g., /about-us, /contact)
                  </p>
                </div>

                <div>
                  <Label htmlFor="default_currency">Default Currency</Label>
                  <Select
                    value={pageData.default_currency || ''}
                    onValueChange={(value) => handleInputChange('default_currency', value)}
                  >
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                      <SelectValue placeholder="Select default currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.id} value={currency.code}>
                          {currency.name} ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="show_price_switcher">Show Price Switcher</Label>
                  <Select
                    value={pageData.show_price_switcher ? 'true' : 'false'}
                    onValueChange={(value) => handleInputChange('show_price_switcher', value === 'true')}
                  >
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="header_image">Page Header Image</Label>
                  <div className="space-y-2">
                    <Input
                      id="header_image"
                      type="file"
                      accept="image/*"
                      disabled={uploadingHeader}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'header');
                      }}
                    />
                    {uploadingHeader && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading header image...</span>
                      </div>
                    )}
                    {pageData.header_image_url && !uploadingHeader && (
                      <div className="relative w-32 h-20 border rounded-lg overflow-hidden">
                        <img
                          src={pageData.header_image_url}
                          alt="Header"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="og_image">Page OG Image</Label>
                  <div className="space-y-2">
                    <Input
                      id="og_image"
                      type="file"
                      accept="image/*"
                      disabled={uploadingOg}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'og');
                      }}
                    />
                    {uploadingOg && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading OG image...</span>
                      </div>
                    )}
                    {pageData.og_image_url && !uploadingOg && (
                      <div className="relative w-32 h-20 border rounded-lg overflow-hidden">
                        <img
                          src={pageData.og_image_url}
                          alt="OG Image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Show/Hide Page Sections Card */}
            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <CardTitle>Show/Hide Page Sections</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Control which sections are visible on this page. Hidden sections will not be displayed to visitors.
                </p>
              </CardHeader>
              <CardContent>
                {pageSections.length > 0 ? (
                  <div className="space-y-2">
                    {pageSections.map((section) => (
                      <div 
                        key={section.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-1 h-8 rounded-full ${section.visible ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                          <div>
                            <p className="font-medium text-foreground">{section.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {section.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded ${section.visible ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                            {section.visible ? 'Visible' : 'Hidden'}
                          </span>
                          <Switch
                            checked={section.visible}
                            onCheckedChange={(checked) => handleSectionToggle(section.id, checked)}
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <EyeOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No sections detected</p>
                    <p className="text-sm mt-1">
                      Add sections to your HTML content using:
                    </p>
                    <div className="mt-3 space-y-2 text-xs">
                      <code className="block bg-muted px-3 py-2 rounded">&lt;!-- Section Name --&gt;</code>
                      <code className="block bg-muted px-3 py-2 rounded">&lt;section id="section-id"&gt;...&lt;/section&gt;</code>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Page Supported Languages Card */}
            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    <CardTitle>Page Supported Languages</CardTitle>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedLangCount} of {languages.length} selected
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select which languages this page should be available in. Leave empty to support all languages.
                </p>
              </CardHeader>
              <CardContent>
                {/* Search and Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search languages..."
                      value={languageSearch}
                      onChange={(e) => setLanguageSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSelectAllLanguages}
                      className="flex items-center gap-1.5"
                    >
                      <CheckSquare className="h-4 w-4" />
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleUnselectAllLanguages}
                      className="flex items-center gap-1.5"
                    >
                      <Square className="h-4 w-4" />
                      Unselect All
                    </Button>
                  </div>
                </div>

                {/* Languages Grid */}
                <ScrollArea className="h-[300px] rounded-lg border border-border/50">
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredLanguages.map((lang) => {
                      const isSelected = pageData.supported_languages?.includes(lang.code);
                      const isRTL = lang.direction === 'rtl';
                      
                      return (
                        <div
                          key={lang.id}
                          onClick={() => handleLanguageToggle(lang.code, !isSelected)}
                          className={`
                            relative p-3 rounded-lg border cursor-pointer transition-all duration-200
                            ${isSelected 
                              ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                              : 'border-border/50 bg-muted/20 hover:bg-muted/40'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleLanguageToggle(lang.code, checked as boolean)}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">
                                {lang.name}
                              </p>
                              {lang.native_name && lang.native_name !== lang.name && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {lang.native_name}
                                </p>
                              )}
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                                  {lang.code}
                                </span>
                                {isRTL && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                    RTL
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {filteredLanguages.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>No languages found matching "{languageSearch}"</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="language_selection">Select Language</Label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                    <SelectValue placeholder="Choose language to edit" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.id} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  First select a language to edit its SEO content
                </p>
              </div>

              {selectedLanguage && (
                <>
                  <div>
                    <Label htmlFor="page_title">Page Title ({selectedLanguage.toUpperCase()})</Label>
                    <Input
                      id="page_title"
                      value={pageData.page_title}
                      onChange={(e) => handleInputChange('page_title', e.target.value)}
                      placeholder="About Us"
                    />
                    {(() => {
                      const len = pageData.page_title?.length || 0;
                      const getColor = () => {
                        if (len === 0) return 'text-muted-foreground';
                        if (len < 30) return 'text-orange-500';
                        if (len <= 60) return 'text-green-500';
                        return 'text-red-500';
                      };
                      const getMessage = () => {
                        if (len === 0) return 'Enter a title (50-60 characters recommended)';
                        if (len < 30) return 'Too short - add more details';
                        if (len <= 60) return 'Good length';
                        return 'Too long - search engines may truncate';
                      };
                      return (
                        <div className={`text-sm mt-1 flex items-center gap-2 ${getColor()}`}>
                          <span className={`w-2 h-2 rounded-full ${len === 0 ? 'bg-muted-foreground' : len < 30 ? 'bg-orange-500' : len <= 60 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span>{len}/60 characters</span>
                          <span>•</span>
                          <span>{getMessage()}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <Label htmlFor="page_description">Page Description ({selectedLanguage.toUpperCase()})</Label>
                    <Textarea
                      id="page_description"
                      value={pageData.page_description || ''}
                      onChange={(e) => handleInputChange('page_description', e.target.value)}
                      placeholder="Brief description of the page"
                    />
                    {(() => {
                      const len = (pageData.page_description || '').length;
                      const getColor = () => {
                        if (len === 0) return 'text-muted-foreground';
                        if (len < 70) return 'text-orange-500';
                        if (len <= 160) return 'text-green-500';
                        return 'text-red-500';
                      };
                      const getMessage = () => {
                        if (len === 0) return 'Enter a description (120-160 characters recommended)';
                        if (len < 70) return 'Too short - add more details for SEO';
                        if (len <= 160) return 'Good length';
                        return 'Too long - search engines will truncate';
                      };
                      return (
                        <div className={`text-sm mt-1 flex items-center gap-2 ${getColor()}`}>
                          <span className={`w-2 h-2 rounded-full ${len === 0 ? 'bg-muted-foreground' : len < 70 ? 'bg-orange-500' : len <= 160 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span>{len}/160 characters</span>
                          <span>•</span>
                          <span>{getMessage()}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <Label htmlFor="page_keywords">Page Keywords ({selectedLanguage.toUpperCase()})</Label>
                    <Input
                      id="page_keywords"
                      value={pageData.page_keywords || ''}
                      onChange={(e) => handleInputChange('page_keywords', e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="header_image_lang">Page Header Image ({selectedLanguage.toUpperCase()})</Label>
                    <div className="space-y-2">
                      <Input
                        id="header_image_lang"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'header');
                        }}
                      />
                      {pageData.header_image_url && (
                        <div className="relative w-32 h-20 border rounded-lg overflow-hidden">
                          <img
                            src={pageData.header_image_url}
                            alt="Header"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="blog_tags">Blog Tags (Slug)</Label>
                    <Input
                      id="blog_tags"
                      value={pageData.blog_tags || ''}
                      onChange={(e) => handleInputChange('blog_tags', e.target.value)}
                      placeholder="vps-germany,hosting-in-usa"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Write the tags slug you want to fetch for this page, separated by comma. E.g: vps-germany,hosting-in-usa
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleFetchBlogs} className="w-full">
                      Fetch Blogs
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Tab with Sub-tabs */}
        <TabsContent value="code">
          <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
            <CardContent className="pt-6">
              <Tabs defaultValue="html" className="w-full">
                <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted/60 p-1 mb-4 gap-0.5 border border-border/50">
                  <TabsTrigger 
                    value="html" 
                    className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                  >
                    <Code className="h-3.5 w-3.5" />
                    HTML
                  </TabsTrigger>
                  <TabsTrigger 
                    value="css" 
                    className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    CSS
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="html">
                  <ProCodeEditor
                    value={pageData.content || ''}
                    onChange={(value) => handleInputChange('content', value)}
                    language="html"
                    height="550px"
                    saving={saving}
                  />
                </TabsContent>

                <TabsContent value="css">
                  <ProCodeEditor
                    value={pageData.css_content || ''}
                    onChange={(value) => handleInputChange('css_content', value)}
                    language="css"
                    height="550px"
                    saving={saving}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language Keys Tab */}
        <TabsContent value="language-keys">
          <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Language Translation Keys</CardTitle>
                <div className="flex items-center gap-2">
                  <Input
                    value={newTranslationKey}
                    onChange={(e) => setNewTranslationKey(e.target.value)}
                    placeholder="Enter key (e.g., hero_title or header.menu_item)"
                    className="w-64"
                    onKeyPress={(e) => e.key === 'Enter' && addTranslationKey()}
                  />
                  <Button onClick={addTranslationKey} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Translation Key
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Editing: <code className="bg-muted px-2 py-1 rounded text-sm">
                  {pageData ? getPageNamespace(pageData.page_url) : 'loading...'}
                </code> (current page) + <code className="bg-muted px-2 py-1 rounded text-sm">header</code> + <code className="bg-muted px-2 py-1 rounded text-sm">footer</code>
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left font-medium">Translation Key</th>
                      <th className="p-4 text-left font-medium">Languages</th>
                      <th className="p-4 text-center font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {translationKeys.map((fullKey) => {
                      const [namespace, ...keyParts] = fullKey.split('.');
                      const key = keyParts.join('.');
                      const keyTranslations = translations.filter(t => t.namespace === namespace && t.key === key);
                      const translationMap = keyTranslations.reduce((acc, t) => {
                        acc[t.language_code || ''] = t.value || '';
                        return acc;
                      }, {} as Record<string, string>);
                      
                      const namespaceColor = namespace === 'header' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            namespace === 'footer' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
                      
                      return (
                        <tr key={fullKey} className="border-b hover:bg-white/[0.05] transition-colors duration-200">
                          <td className="p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded-md text-xs font-medium ${namespaceColor}`}>
                                {namespace}
                              </span>
                              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                {key}
                              </code>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Full key: <code className="bg-muted/50 px-1 py-0.5 rounded text-xs">{fullKey}</code>
                            </p>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {languages.map((language) => {
                                const hasTranslation = translationMap[language.code]?.trim();
                                return (
                                  <span
                                    key={language.id}
                                    className={`px-2 py-1 rounded-md text-xs ${
                                      hasTranslation
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                    }`}
                                    title={hasTranslation ? `Has translation: ${hasTranslation.substring(0, 50)}...` : 'No translation'}
                                  >
                                    {language.code.toUpperCase()}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button 
                                onClick={() => setEditingTranslation({ key: fullKey, translations: translationMap })}
                                variant="outline" 
                                size="sm"
                              >
                                Edit Translations
                              </Button>
                              <Button 
                                onClick={() => removeTranslationKey(fullKey)} 
                                variant="outline" 
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {translationKeys.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No translation keys found for this page, header, or footer.</p>
                    <p className="text-sm mt-2">
                      Add keys like: <code className="bg-muted px-2 py-1 rounded">hero_title</code> (current page),{' '}
                      <code className="bg-muted px-2 py-1 rounded">header.menu_item</code>, or{' '}
                      <code className="bg-muted px-2 py-1 rounded">footer.copyright</code>
                    </p>
                  </div>
                )}
              </div>
              
              {languages.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> No active languages found. Please activate languages in the system settings to add translations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs">
          <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Frequently Asked Questions</CardTitle>
                <Button onClick={addFaq} variant="outline" size="sm">
                  Add FAQ
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-white/[0.08] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">FAQ #{index + 1}</h4>
                    <Button 
                      onClick={() => removeFaq(index)} 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`question-${index}`}>Question</Label>
                      <Input
                        id={`question-${index}`}
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        placeholder="What is your return policy?"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`answer-${index}`}>Answer</Label>
                      <Textarea
                        id={`answer-${index}`}
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        placeholder="Our return policy allows..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {faqs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No FAQs added yet. Click "Add FAQ" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Translation Edit Modal */}
      <Dialog open={!!editingTranslation} onOpenChange={() => setEditingTranslation(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/[0.08]">
          <DialogHeader>
            <DialogTitle>
              Edit Translations for: <code className="bg-muted px-2 py-1 rounded text-sm">{editingTranslation?.key}</code>
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Full key: <code className="bg-muted px-2 py-1 rounded text-sm">
                {pageData ? getPageNamespace(pageData.page_url) : ''}.{editingTranslation?.key}
              </code>
            </p>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            {languages.map((language) => (
              <div key={language.id} className="space-y-2">
                <Label htmlFor={`modal-translation-${language.code}`}>
                  {language.name} ({language.code.toUpperCase()})
                </Label>
                <Textarea
                  id={`modal-translation-${language.code}`}
                  value={editingTranslation?.translations[language.code] || ''}
                  onChange={(e) => updateModalTranslation(language.code, e.target.value)}
                  placeholder={`Translation in ${language.name}`}
                  rows={4}
                  className="resize-none"
                />
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTranslation(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTranslation}>
              Save Translations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* React-Native Page Editor */}
      {/* Phase 2 Fix: Track unsaved changes and warn before closing */}
      {showVisualEditor && (
        <div className="fixed inset-0 z-50">
          <ReactPageEditor
            pageId={pageId!}
            pageTitle={pageData.page_title}
            pageUrl={pageData.page_url}
            initialPageData={parsePageContent(
              pageData.content,
              pageId!,
              { title: pageData.page_title }
            )}
            onSave={async (newPageData) => {
              // Save as JSON string
              setPageData(prev => prev ? { 
                ...prev, 
                content: JSON.stringify(newPageData) 
              } : null);
              setVisualEditorHasUnsaved(false);
            }}
            onUnsavedChange={setVisualEditorHasUnsaved}
            onClose={() => {
              // Phase 2: Warn if there are unsaved changes (synced from store)
              if (visualEditorHasUnsaved) {
                const confirm = window.confirm(
                  'You have unsaved changes in the visual editor. Are you sure you want to close?'
                );
                if (!confirm) return;
              }
              setShowVisualEditor(false);
              setVisualEditorHasUnsaved(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPageEditor;
