import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText, Plus, Edit, Trash2, Loader2, ArrowUpDown, ArrowUp, ArrowDown, Globe, CheckCircle2, AlertCircle, XCircle, Copy, Link2, MoreHorizontal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AdminSectionHeader from '@/components/admin/AdminSectionHeader';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';

interface Page {
  id: string;
  created_at: string;
  updated_at: string;
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
  is_active: boolean;
  content: string | null;
  overall_coverage: number | null;
  total_translatable_elements: number | null;
  elements_with_keys: number | null;
  keys_coverage_percentage: number | null;
  cloned_from?: {
    page_title: string;
  };
}

interface Language {
  id: string;
  code: string;
  name: string;
}

interface LanguageCoverage {
  page_id: string;
  language_code: string;
  language_name: string;
  coverage_percentage: number;
  translated_count: number;
  total_keys: number;
}

type SortColumn = 'created_at' | 'updated_at' | 'page_title' | 'overall_coverage';
type SortDirection = 'asc' | 'desc';
type CoverageFilter = 'all' | 'complete' | 'partial' | 'low';

const AdminPagesPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [pages, setPages] = useState<Page[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageCoverage, setLanguageCoverage] = useState<LanguageCoverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [cloneSourcePage, setCloneSourcePage] = useState<Page | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [cloneLoading, setCloneLoading] = useState(false);
  const [headerImageUploading, setHeaderImageUploading] = useState(false);
  const [ogImageUploading, setOgImageUploading] = useState(false);

  // Clone form state
  const [cloneFormData, setCloneFormData] = useState({
    page_url: '',
    page_title: '',
    country: ''
  });

  // Search, filter, and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [coverageFilter, setCoverageFilter] = useState<CoverageFilter>('all');
  const [parentPageFilter, setParentPageFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    page_url: '',
    page_title: '',
    page_description: '',
    page_keywords: '',
    cloned_from_id: 'none',
    country: '',
    supported_languages: [] as string[],
    show_price_switcher: true,
    header_image_url: '',
    og_image_url: ''
  });

  useEffect(() => {
    fetchPages();
    fetchLanguages();
    fetchLanguageCoverage();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select(`
          *,
          cloned_from:cloned_from_id(page_title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Failed to load pages.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('id, code, name')
        .eq('is_active', true);

      if (error) throw error;
      setLanguages(data || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const fetchLanguageCoverage = async () => {
    try {
      const { data, error } = await supabase
        .from('page_translation_coverage')
        .select('*');

      if (error) throw error;
      setLanguageCoverage(data || []);
    } catch (error) {
      console.error('Error fetching language coverage:', error);
    }
  };

  // Get original pages that have clones (for the filter dropdown) with clone counts
  const originalPagesWithClones = useMemo(() => {
    const cloneCountMap = new Map<string, number>();
    pages.filter(p => p.cloned_from_id).forEach(p => {
      cloneCountMap.set(p.cloned_from_id!, (cloneCountMap.get(p.cloned_from_id!) || 0) + 1);
    });
    return pages
      .filter(p => cloneCountMap.has(p.id))
      .map(p => ({ ...p, cloneCount: cloneCountMap.get(p.id) || 0 }));
  }, [pages]);

  // Filtered and sorted pages
  const filteredAndSortedPages = useMemo(() => {
    let result = [...pages];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(page => 
        page.page_title.toLowerCase().includes(query) ||
        page.page_url.toLowerCase().includes(query) ||
        (page.page_description?.toLowerCase().includes(query))
      );
    }

    // Apply coverage filter
    if (coverageFilter !== 'all') {
      result = result.filter(page => {
        const coverage = page.overall_coverage ?? 0;
        switch (coverageFilter) {
          case 'complete':
            return coverage >= 90;
          case 'partial':
            return coverage >= 50 && coverage < 90;
          case 'low':
            return coverage < 50;
          default:
            return true;
        }
      });
    }

    // Apply parent page filter (show clones of selected parent)
    if (parentPageFilter !== 'all') {
      result = result.filter(page => page.cloned_from_id === parentPageFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortColumn) {
        case 'page_title':
          comparison = a.page_title.localeCompare(b.page_title);
          break;
        case 'overall_coverage':
          comparison = (a.overall_coverage ?? 0) - (b.overall_coverage ?? 0);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'updated_at':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [pages, searchQuery, coverageFilter, parentPageFilter, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const getCoverageColor = (coverage: number | null) => {
    const value = coverage ?? 0;
    if (value >= 90) return 'bg-emerald-500';
    if (value >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getCoverageBadgeVariant = (coverage: number | null): 'default' | 'secondary' | 'destructive' => {
    const value = coverage ?? 0;
    if (value >= 90) return 'default';
    if (value >= 50) return 'secondary';
    return 'destructive';
  };

  const getCoverageIcon = (coverage: number | null) => {
    const value = coverage ?? 0;
    if (value >= 90) return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (value >= 50) return <AlertCircle className="h-4 w-4 text-amber-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getPageLanguageCoverage = (pageId: string) => {
    return languageCoverage.filter(lc => lc.page_id === pageId);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageToggle = (languageCode: string) => {
    setFormData(prev => ({
      ...prev,
      supported_languages: prev.supported_languages.includes(languageCode)
        ? prev.supported_languages.filter(lang => lang !== languageCode)
        : [...prev.supported_languages, languageCode]
    }));
  };

  const uploadImage = async (file: File, type: 'header' | 'og') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `pages/${type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleImageUpload = async (file: File, type: 'header' | 'og') => {
    if (type === 'header') {
      setHeaderImageUploading(true);
    } else {
      setOgImageUploading(true);
    }

    try {
      const imageUrl = await uploadImage(file, type);
      handleInputChange(type === 'header' ? 'header_image_url' : 'og_image_url', imageUrl);
      toast.success(`${type === 'header' ? 'Header' : 'OG'} image uploaded successfully.`);
    } catch (error) {
      toast.error(`Failed to upload ${type === 'header' ? 'header' : 'OG'} image.`);
    } finally {
      if (type === 'header') {
        setHeaderImageUploading(false);
      } else {
        setOgImageUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    console.log('Form submission started', formData);
    
    if (!formData.page_url || !formData.page_title) {
      toast.error('Page URL and title are required.');
      return;
    }

    console.log('Form validation passed');
    setFormLoading(true);

    try {
      const pageData = {
        ...formData,
        page_url: formData.page_url.startsWith('/') ? formData.page_url : `/${formData.page_url}`,
        cloned_from_id: formData.cloned_from_id === 'none' || !formData.cloned_from_id ? null : formData.cloned_from_id,
      };

      console.log('Page data to submit:', pageData);

      if (selectedPage) {
        console.log('Updating existing page:', selectedPage.id);
        const { error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', selectedPage.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }

        toast.success('Page updated successfully.');
      } else {
        console.log('Creating new page');
        
        const { error, data } = await supabase
          .from('pages')
          .insert([pageData]);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }

        console.log('Insert successful:', data);

        toast.success('Page created successfully and is now accessible.');
      }

      setDialogOpen(false);
      resetForm();
      fetchPages();
    } catch (error: any) {
      console.error('Error saving page:', error);
      toast.error(error.message || 'Failed to save page.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (page: Page) => {
    navigate(`/a93jf02kd92ms71x8qp4/pages/edit/${page.id}`);
  };

  const handleDelete = async () => {
    if (!selectedPage) return;

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', selectedPage.id);

      if (error) throw error;

      toast.success('Page deleted successfully.');

      setDeleteDialogOpen(false);
      setSelectedPage(null);
      fetchPages();
    } catch (error: any) {
      console.error('Error deleting page:', error);
      toast.error(error.message || 'Failed to delete page.');
    }
  };

  const resetForm = () => {
    setFormData({
      page_url: '',
      page_title: '',
      page_description: '',
      page_keywords: '',
      cloned_from_id: 'none',
      country: '',
      supported_languages: [],
      show_price_switcher: true,
      header_image_url: '',
      og_image_url: ''
    });
    setSelectedPage(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openCloneDialog = (page: Page) => {
    setCloneSourcePage(page);
    setCloneFormData({
      page_url: `${page.page_url}-copy`,
      page_title: `${page.page_title} (Copy)`,
      country: page.country || ''
    });
    setCloneDialogOpen(true);
  };

  const handleCloneSubmit = async () => {
    if (!cloneSourcePage) return;

    if (!cloneFormData.page_url || !cloneFormData.page_title) {
      toast.error('Page URL and title are required.');
      return;
    }

    setCloneLoading(true);

    try {
      const newPageData = {
        page_url: cloneFormData.page_url.startsWith('/') ? cloneFormData.page_url : `/${cloneFormData.page_url}`,
        page_title: cloneFormData.page_title,
        page_description: cloneSourcePage.page_description,
        page_keywords: cloneSourcePage.page_keywords,
        country: cloneFormData.country || cloneSourcePage.country,
        cloned_from_id: cloneSourcePage.id,
        supported_languages: cloneSourcePage.supported_languages,
        show_price_switcher: cloneSourcePage.show_price_switcher,
        header_image_url: cloneSourcePage.header_image_url,
        og_image_url: cloneSourcePage.og_image_url,
        content: cloneSourcePage.content,
        is_active: true,
        overall_coverage: 0,
        total_translatable_elements: 0,
        elements_with_keys: 0,
        keys_coverage_percentage: 0,
      };

      const { error } = await supabase
        .from('pages')
        .insert([newPageData]);

      if (error) throw error;

      toast.success(`Page cloned successfully as "${cloneFormData.page_title}".`);

      setCloneDialogOpen(false);
      setCloneSourcePage(null);
      fetchPages();
    } catch (error: any) {
      console.error('Error cloning page:', error);
      toast.error(error.message || 'Failed to clone page.');
    } finally {
      setCloneLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminSectionHeader
        title="Manage Pages"
        subtitle="Create, edit, and manage your website pages"
        searchPlaceholder="Search by title, URL, or description..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={[
          {
            label: 'Add New Page',
            icon: <Plus className="h-4 w-4 mr-2" />,
            onClick: openAddDialog,
            variant: 'default'
          }
        ]}
      />

      {/* Filter Bar */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Coverage:</span>
          <Select value={coverageFilter} onValueChange={(value: CoverageFilter) => setCoverageFilter(value)}>
            <SelectTrigger className="w-[180px] h-9 bg-white/[0.04] border-white/[0.08]">
              <SelectValue placeholder="Filter by coverage" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Pages</SelectItem>
              <SelectItem value="complete">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Fully Translated (90%+)
                </div>
              </SelectItem>
              <SelectItem value="partial">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Partial (50-89%)
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Low Coverage (&lt;50%)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge variant="outline" className="text-muted-foreground">
          {filteredAndSortedPages.length} {filteredAndSortedPages.length === 1 ? 'page' : 'pages'}
        </Badge>
        {originalPagesWithClones.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Clones of:</span>
            <Select value={parentPageFilter} onValueChange={setParentPageFilter}>
              <SelectTrigger className="w-[200px] h-9 bg-white/[0.04] border-white/[0.08]">
                <SelectValue placeholder="Select parent page" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Pages</SelectItem>
                {originalPagesWithClones.map(page => (
                  <SelectItem key={page.id} value={page.id}>
                    <div className="flex items-center gap-2">
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      {page.page_title}
                      <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                        {page.cloneCount}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Add/Edit Page Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/[0.08]">
          <DialogHeader>
            <DialogTitle>
              {selectedPage ? 'Edit Page' : 'Add New Page'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="page_url">Page URL *</Label>
                <Input
                  id="page_url"
                  value={formData.page_url}
                  onChange={(e) => handleInputChange('page_url', e.target.value)}
                  placeholder="/about-us"
                  className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                />
              </div>

              <div>
                <Label htmlFor="page_title">Page Title *</Label>
                <Input
                  id="page_title"
                  value={formData.page_title}
                  onChange={(e) => handleInputChange('page_title', e.target.value)}
                  placeholder="About Us"
                  className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                />
              </div>

              <div>
                <Label htmlFor="page_description">Page Description</Label>
                <Textarea
                  id="page_description"
                  value={formData.page_description}
                  onChange={(e) => handleInputChange('page_description', e.target.value)}
                  placeholder="Brief description of the page"
                  className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                />
              </div>

              <div>
                <Label htmlFor="page_keywords">Page Keywords</Label>
                <Input
                  id="page_keywords"
                  value={formData.page_keywords}
                  onChange={(e) => handleInputChange('page_keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                />
              </div>

              <div>
                <Label htmlFor="cloned_from">Page Clone</Label>
                <Select
                  value={formData.cloned_from_id}
                  onValueChange={(value) => handleInputChange('cloned_from_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select page to clone from" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {pages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.page_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="US, UK, DE, etc."
                  className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Page Supported Languages</Label>
                <Select
                  value={formData.supported_languages.length === 0 ? "all" : "specific"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      handleInputChange('supported_languages', []);
                    } else {
                      if (formData.supported_languages.length === 0) {
                        handleInputChange('supported_languages', [languages[0]?.code || '']);
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language support" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages (Default)</SelectItem>
                    <SelectItem value="specific">Specific Languages</SelectItem>
                  </SelectContent>
                </Select>
                
                {formData.supported_languages.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm">Select Specific Languages</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 p-4 border rounded-md">
                      {languages.map((language) => (
                        <div key={language.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={language.code}
                            checked={formData.supported_languages.includes(language.code)}
                            onCheckedChange={() => handleLanguageToggle(language.code)}
                          />
                          <Label htmlFor={language.code} className="text-sm">
                            {language.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label>Show Price Switcher</Label>
                <Select
                  value={formData.show_price_switcher.toString()}
                  onValueChange={(value) => handleInputChange('show_price_switcher', value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Page Header Image</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'header');
                    }}
                    disabled={headerImageUploading}
                  />
                  {headerImageUploading && (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}
                  {formData.header_image_url && (
                    <div className="mt-2">
                      <img 
                        src={formData.header_image_url} 
                        alt="Header preview" 
                        className="h-24 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>OG Image</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'og');
                    }}
                    disabled={ogImageUploading}
                  />
                  {ogImageUploading && (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}
                  {formData.og_image_url && (
                    <div className="mt-2">
                      <img 
                        src={formData.og_image_url} 
                        alt="OG preview" 
                        className="h-24 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={formLoading}
            >
              {formLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {selectedPage ? 'Update' : 'Create'} Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
        <CardContent className="p-0">
          {filteredAndSortedPages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {pages.length === 0 ? 'No pages found' : 'No matching pages'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {pages.length === 0 
                  ? 'Start creating pages to manage your website content.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/[0.02] hover:bg-white/[0.02]">
                    <TableHead 
                      className="cursor-pointer select-none font-semibold"
                      onClick={() => handleSort('page_title')}
                    >
                      <div className="flex items-center">
                        Page Name
                        {getSortIcon('page_title')}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">Cloned From</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead 
                      className="cursor-pointer select-none font-semibold"
                      onClick={() => handleSort('overall_coverage')}
                    >
                      <div className="flex items-center">
                        Translation Coverage
                        {getSortIcon('overall_coverage')}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">Languages</TableHead>
                    <TableHead 
                      className="cursor-pointer select-none font-semibold"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        Created
                        {getSortIcon('created_at')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none font-semibold"
                      onClick={() => handleSort('updated_at')}
                    >
                      <div className="flex items-center">
                        Last Updated
                        {getSortIcon('updated_at')}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedPages.map((page, index) => {
                    const pageLangCoverage = getPageLanguageCoverage(page.id);
                    const coverage = page.overall_coverage ?? 0;
                    
                    return (
                      <TableRow 
                        key={page.id} 
                        className={`
                          transition-colors duration-200
                          ${index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}
                          hover:bg-white/[0.05]
                        `}
                      >
                        <TableCell>
                          <div className="min-w-[200px]">
                            <div className="font-medium text-foreground">{page.page_title}</div>
                            <div className="text-sm text-muted-foreground">{page.page_url}</div>
                            {page.country && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {page.country}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {page.cloned_from?.page_title ? (
                            <Badge variant="secondary" className="gap-1">
                              <Link2 className="h-3 w-3" />
                              {page.cloned_from.page_title}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">Original</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={page.is_active ? 'default' : 'secondary'}>
                            {page.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <div className="cursor-pointer min-w-[180px]">
                                <div className="flex items-center gap-2 mb-1">
                                  {getCoverageIcon(coverage)}
                                  <span className="text-sm font-medium">
                                    {coverage.toFixed(0)}%
                                  </span>
                                </div>
                                <Progress 
                                  value={coverage} 
                                  className="h-2 w-full"
                                  indicatorClassName={getCoverageColor(coverage)}
                                />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">Translation Coverage</span>
                                  <Badge variant={getCoverageBadgeVariant(coverage)}>
                                    {coverage.toFixed(1)}%
                                  </Badge>
                                </div>
                                {pageLangCoverage.length > 0 ? (
                                  <ScrollArea className="max-h-[300px]">
                                    <div className="space-y-2 pr-4">
                                      {pageLangCoverage.map(lc => (
                                        <div key={lc.language_code} className="space-y-1">
                                          <div className="flex items-center justify-between text-sm">
                                            <span>{lc.language_name}</span>
                                            <span className="text-muted-foreground">
                                              {lc.translated_count}/{lc.total_keys} ({lc.coverage_percentage.toFixed(0)}%)
                                            </span>
                                          </div>
                                          <Progress 
                                            value={lc.coverage_percentage} 
                                            className="h-1.5"
                                            indicatorClassName={getCoverageColor(lc.coverage_percentage)}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    No translation data available
                                  </p>
                                )}
                                <div className="pt-2 border-t text-xs text-muted-foreground">
                                  <div>Elements with keys: {page.elements_with_keys ?? 0}</div>
                                  <div>Total elements: {page.total_translatable_elements ?? 0}</div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {page.supported_languages?.length > 0 
                                ? page.supported_languages.length 
                                : languages.length}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(page.created_at), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(page.created_at), { addSuffix: true })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(page.updated_at), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(page.updated_at), { addSuffix: true })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-popover">
                                <DropdownMenuItem onClick={() => handleEdit(page)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Page
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openCloneDialog(page)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Clone Page
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => { setSelectedPage(page); setDeleteDialogOpen(true); }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Page
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clone Page Dialog */}
      <Dialog open={cloneDialogOpen} onOpenChange={setCloneDialogOpen}>
        <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5" />
              Clone Page
            </DialogTitle>
          </DialogHeader>
          
          {cloneSourcePage && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="text-sm text-muted-foreground mb-1">Cloning from:</div>
                <div className="font-medium">{cloneSourcePage.page_title}</div>
                <div className="text-sm text-muted-foreground">{cloneSourcePage.page_url}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="clone_page_url">New Page URL *</Label>
                  <Input
                    id="clone_page_url"
                    value={cloneFormData.page_url}
                    onChange={(e) => setCloneFormData(prev => ({ ...prev, page_url: e.target.value }))}
                    placeholder="/vps-hosting-india"
                    className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                  />
                </div>

                <div>
                  <Label htmlFor="clone_page_title">New Page Title *</Label>
                  <Input
                    id="clone_page_title"
                    value={cloneFormData.page_title}
                    onChange={(e) => setCloneFormData(prev => ({ ...prev, page_title: e.target.value }))}
                    placeholder="VPS Hosting India"
                    className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                  />
                </div>

                <div>
                  <Label htmlFor="clone_country">Country</Label>
                  <Input
                    id="clone_country"
                    value={cloneFormData.country}
                    onChange={(e) => setCloneFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="India, UAE, UK, etc."
                    className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCloneDialogOpen(false)}
                  disabled={cloneLoading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCloneSubmit}
                  disabled={cloneLoading}
                >
                  {cloneLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Clone Page
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedPage?.page_title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminPagesPage;
