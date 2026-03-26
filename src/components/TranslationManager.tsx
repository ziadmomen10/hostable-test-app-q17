import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useI18n } from '@/contexts/I18nContext';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Download, Languages, Search, Filter, Globe, BookOpen, Home, Wrench, AlertCircle, MessageSquare } from 'lucide-react';

interface Namespace {
  id: string;
  name: string;
  description: string | null;
}

interface Translation {
  id: string;
  language_id: string;
  namespace: string;
  key: string;
  value: string | null;
  version: number;
}

interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string | null;
  is_active: boolean;
  direction: string;
  created_at: string;
  updated_at: string;
}

const TranslationManager: React.FC = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [formData, setFormData] = useState({
    namespace: '',
    key: '',
    value: ''
  });

  const { refreshTranslations } = useI18n();
  const { t, common, ui } = useTranslation();

  // Get namespace icon
  const getNamespaceIcon = (namespace: string) => {
    switch (namespace) {
      case 'homepage': return Home;
      case 'navigation': return Globe;
      case 'domain': return Globe;
      case 'hosting': return Wrench;
      case 'support': return MessageSquare;
      case 'translations': return Languages;
      case 'admin': return Wrench;
      default: return BookOpen;
    }
  };

  // Get namespace color
  const getNamespaceColor = (namespace: string) => {
    switch (namespace) {
      case 'homepage': return 'bg-blue-100 text-blue-800';
      case 'navigation': return 'bg-green-100 text-green-800';
      case 'domain': return 'bg-purple-100 text-purple-800';
      case 'hosting': return 'bg-orange-100 text-orange-800';
      case 'support': return 'bg-pink-100 text-pink-800';
      case 'translations': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      fetchTranslations();
    }
  }, [selectedLanguage, selectedNamespace]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch languages
      const { data: languagesData, error: languagesError } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (languagesError) throw languagesError;

      // Fetch namespaces
      const { data: namespacesData, error: namespacesError } = await supabase
        .from('namespaces')
        .select('*')
        .order('name');

      if (namespacesError) throw namespacesError;

      setLanguages(languagesData || []);
      setNamespaces(namespacesData || []);
      
      // Set default language
      const defaultLanguage = languagesData?.find(lang => lang.is_default) || languagesData?.[0];
      if (defaultLanguage) {
        setSelectedLanguage(defaultLanguage.id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load translation data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTranslations = async () => {
    if (!selectedLanguage) return;

    try {
      let query = supabase
        .from('translations')
        .select('*')
        .eq('language_id', selectedLanguage);

      if (selectedNamespace && selectedNamespace !== 'all') {
        query = query.eq('namespace', selectedNamespace);
      }

      const { data, error } = await query
        .order('namespace')
        .order('key');

      if (error) throw error;
      setTranslations(data || []);
    } catch (error) {
      console.error('Error fetching translations:', error);
      toast.error('Failed to load translations.');
    }
  };

  const handleAddTranslation = () => {
    setEditingTranslation(null);
    setFormData({
      namespace: selectedNamespace !== 'all' ? selectedNamespace : namespaces[0]?.name || 'common',
      key: '',
      value: ''
    });
    setDialogOpen(true);
  };

  const handleEditTranslation = (translation: Translation) => {
    setEditingTranslation(translation);
    setFormData({
      namespace: translation.namespace,
      key: translation.key,
      value: translation.value || ''
    });
    setDialogOpen(true);
  };

  const handleSaveTranslation = async () => {
    if (!selectedLanguage || !formData.key.trim()) return;

    try {
      if (editingTranslation) {
        // Update existing translation
        const { error } = await supabase
          .from('translations')
          .update({
            namespace: formData.namespace,
            key: formData.key,
            value: formData.value,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTranslation.id);

        if (error) throw error;

        toast.success('Translation updated successfully.');
      } else {
        // Create new translation
        const { error } = await supabase
          .from('translations')
          .insert({
            language_id: selectedLanguage,
            namespace: formData.namespace,
            key: formData.key,
            value: formData.value
          });

        if (error) throw error;

        toast.success('Translation created successfully.');
      }

      setDialogOpen(false);
      fetchTranslations();
      refreshTranslations(); // Update the global i18n context
    } catch (error: any) {
      console.error('Error saving translation:', error);
      toast.error(error.message || 'Failed to save translation.');
    }
  };

  const handleDeleteTranslation = async (translationId: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', translationId);

      if (error) throw error;

      toast.success('Translation deleted successfully.');

      fetchTranslations();
      refreshTranslations(); // Update the global i18n context
    } catch (error: any) {
      console.error('Error deleting translation:', error);
      toast.error('Failed to delete translation.');
    }
  };

  // Filter translations based on search term
  const filteredTranslations = translations.filter(translation => 
    translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (translation.value && translation.value.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group translations by namespace for better organization
  const groupedTranslations = filteredTranslations.reduce((acc, translation) => {
    if (!acc[translation.namespace]) {
      acc[translation.namespace] = [];
    }
    acc[translation.namespace].push(translation);
    return acc;
  }, {} as Record<string, Translation[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading translation manager...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Languages className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Website Translation Manager</h1>
              <p className="text-muted-foreground font-normal">
                Translate all your website content in one place. Choose a language and content section to get started.
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language to Translate
              </Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      <div className="flex items-center gap-2">
                        <span>{language.native_name || language.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {language.code.toUpperCase()}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Content Section
              </Label>
              <Select value={selectedNamespace} onValueChange={setSelectedNamespace}>
                <SelectTrigger>
                  <SelectValue placeholder="All sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content Sections</SelectItem>
                  {namespaces.map((namespace) => {
                    const Icon = getNamespaceIcon(namespace.name);
                    return (
                      <SelectItem key={namespace.id} value={namespace.name}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="capitalize">{namespace.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Translations
              </Label>
              <Input
                placeholder="Search by key or text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex gap-2">
                <Button onClick={handleAddTranslation} disabled={!selectedLanguage} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {selectedLanguage ? (
        <div className="space-y-4">
          {Object.keys(groupedTranslations).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No translations found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm 
                    ? `No translations match "${searchTerm}". Try a different search term.`
                    : "Start adding translations to make your website multilingual."
                  }
                </p>
                <Button onClick={handleAddTranslation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Translation
                </Button>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedTranslations).map(([namespace, namespaceTranslations]) => {
              const Icon = getNamespaceIcon(namespace);
              const namespaceInfo = namespaces.find(n => n.name === namespace);
              
              return (
                <Card key={namespace}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getNamespaceColor(namespace)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="capitalize">{namespace}</span>
                        <Badge variant="outline" className="ml-2">
                          {namespaceTranslations.length} {namespaceTranslations.length === 1 ? 'translation' : 'translations'}
                        </Badge>
                      </div>
                    </CardTitle>
                    {namespaceInfo?.description && (
                      <p className="text-sm text-muted-foreground ml-12">
                        {namespaceInfo.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/3">Translation Key</TableHead>
                            <TableHead className="w-1/2">Current Text</TableHead>
                            <TableHead className="text-center w-32">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {namespaceTranslations.map((translation) => (
                            <TableRow key={translation.id}>
                              <TableCell>
                                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                  {translation.key}
                                </code>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-md">
                                  {translation.value ? (
                                    <span className="text-sm">{translation.value}</span>
                                  ) : (
                                    <span className="text-muted-foreground italic text-sm">
                                      No translation yet
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditTranslation(translation)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteTranslation(translation.id)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a Language</h3>
            <p className="text-muted-foreground text-center">
              Choose a language from the dropdown above to start managing translations.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Translation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTranslation ? 'Edit Translation' : 'Add New Translation'}
            </DialogTitle>
            <DialogDescription>
              {editingTranslation 
                ? 'Update the translation text for your website.' 
                : 'Create a new translation key for your website content.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="namespace">Content Section</Label>
              <Select 
                value={formData.namespace} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, namespace: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {namespaces.map((namespace) => {
                    const Icon = getNamespaceIcon(namespace.name);
                    return (
                      <SelectItem key={namespace.id} value={namespace.name}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="capitalize">{namespace.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="key">Translation Key</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                placeholder="welcome_title, button_save, etc."
              />
              <p className="text-xs text-muted-foreground">
                Use lowercase letters, numbers, and underscores only.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Translation Text</Label>
              <Textarea
                id="value"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Enter the text that users will see..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTranslation} disabled={!formData.key.trim()}>
              {editingTranslation ? 'Update Translation' : 'Add Translation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TranslationManager;