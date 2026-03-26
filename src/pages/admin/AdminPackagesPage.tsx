import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Star,
  Copy,
  AlertCircle,
  Home,
  ChevronRight,
  Loader2,
  Key,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminSectionHeader from '@/components/admin/AdminSectionHeader';

interface PackageData {
  id: string;
  name_key: string;
  description_key: string | null;
  monthly_price: number;
  monthly_discounted_price: number | null;
  yearly_price: number;
  yearly_discounted_price: number | null;
  features: string[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface PackageFormData {
  name_key: string;
  description_key: string;
  monthly_price: string;
  monthly_discounted_price: string;
  yearly_price: string;
  yearly_discounted_price: string;
  features: string[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

const generateTranslationKey = (type: 'name' | 'desc', packageName: string): string => {
  const timestamp = Date.now();
  const slug = packageName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 20);
  return `lang_key_${timestamp}_${slug}_${type}`;
};

const defaultFormData: PackageFormData = {
  name_key: '',
  description_key: '',
  monthly_price: '0',
  monthly_discounted_price: '',
  yearly_price: '0',
  yearly_discounted_price: '',
  features: [],
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

const AdminPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState<PackageFormData>(defaultFormData);
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<PackageData | null>(null);
  const [newFeature, setNewFeature] = useState('');

  // Fetch packages
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      setPackages((data || []).map(pkg => ({
        ...pkg,
        features: Array.isArray(pkg.features) 
          ? (pkg.features as unknown as string[]) 
          : []
      })));
    } catch (error: any) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Filter packages
  const filteredPackages = packages.filter(pkg =>
    pkg.name_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pkg.description_key && pkg.description_key.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle add package
  const handleAdd = () => {
    setFormData({
      ...defaultFormData,
      name_key: generateTranslationKey('name', 'new_package'),
      description_key: generateTranslationKey('desc', 'new_package'),
    });
    setIsAddDialogOpen(true);
  };

  // Handle edit package
  const handleEdit = (pkg: PackageData) => {
    setEditingPackage(pkg);
    setFormData({
      name_key: pkg.name_key,
      description_key: pkg.description_key || '',
      monthly_price: pkg.monthly_price.toString(),
      monthly_discounted_price: pkg.monthly_discounted_price?.toString() || '',
      yearly_price: pkg.yearly_price.toString(),
      yearly_discounted_price: pkg.yearly_discounted_price?.toString() || '',
      features: pkg.features || [],
      is_featured: pkg.is_featured,
      is_active: pkg.is_active,
      sort_order: pkg.sort_order,
    });
    setIsEditDialogOpen(true);
  };

  // Handle clone package
  const handleClone = (pkg: PackageData) => {
    setFormData({
      name_key: generateTranslationKey('name', 'cloned_package'),
      description_key: generateTranslationKey('desc', 'cloned_package'),
      monthly_price: pkg.monthly_price.toString(),
      monthly_discounted_price: pkg.monthly_discounted_price?.toString() || '',
      yearly_price: pkg.yearly_price.toString(),
      yearly_discounted_price: pkg.yearly_discounted_price?.toString() || '',
      features: [...(pkg.features || [])],
      is_featured: false,
      is_active: true,
      sort_order: pkg.sort_order + 1,
    });
    setIsAddDialogOpen(true);
    toast.info('Package cloned. Modify and save as new.');
  };

  // Handle delete package
  const handleDelete = (pkg: PackageData) => {
    setPackageToDelete(pkg);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!packageToDelete) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', packageToDelete.id);

      if (error) throw error;

      toast.success('Package deleted successfully');
      fetchPackages();
    } catch (error: any) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    } finally {
      setSaving(false);
      setIsDeleteDialogOpen(false);
      setPackageToDelete(null);
    }
  };

  // Save package (add or edit)
  const handleSave = async (isEdit: boolean) => {
    try {
      setSaving(true);

      const packageData = {
        name_key: formData.name_key,
        description_key: formData.description_key || null,
        monthly_price: parseFloat(formData.monthly_price) || 0,
        monthly_discounted_price: formData.monthly_discounted_price 
          ? parseFloat(formData.monthly_discounted_price) 
          : null,
        yearly_price: parseFloat(formData.yearly_price) || 0,
        yearly_discounted_price: formData.yearly_discounted_price 
          ? parseFloat(formData.yearly_discounted_price) 
          : null,
        features: formData.features,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      };

      if (isEdit && editingPackage) {
        const { error } = await supabase
          .from('packages')
          .update(packageData)
          .eq('id', editingPackage.id);

        if (error) throw error;
        toast.success('Package updated successfully');
      } else {
        const { error } = await supabase
          .from('packages')
          .insert([packageData]);

        if (error) throw error;
        toast.success('Package created successfully');
      }

      fetchPackages();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingPackage(null);
      setFormData(defaultFormData);
    } catch (error: any) {
      console.error('Error saving package:', error);
      toast.error('Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  // Add feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Format price
  const formatPrice = (price: number | null, discounted: number | null) => {
    if (price === null) return '-';
    const formatted = `$${price.toFixed(2)}`;
    if (discounted !== null && discounted < price) {
      return (
        <span className="flex flex-col">
          <span className="text-muted-foreground line-through text-xs">${price.toFixed(2)}</span>
          <span className="text-primary font-medium">${discounted.toFixed(2)}</span>
        </span>
      );
    }
    return formatted;
  };

  // Package form component
  const PackageForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6">
      {/* Breadcrumb for edit */}
      {isEdit && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground pb-2">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-3 w-3" />
          <span>Packages</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Edit Package</span>
        </div>
      )}

      {/* Name Key */}
      <div className="space-y-2">
        <Label htmlFor="name_key" className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          Package Name (Translation Key)
        </Label>
        <Input
          id="name_key"
          value={formData.name_key}
          onChange={(e) => setFormData(prev => ({ ...prev, name_key: e.target.value }))}
          placeholder="lang_key_xxx_package_name"
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          This key will be used to translate the package name
        </p>
      </div>

      {/* Description Key */}
      <div className="space-y-2">
        <Label htmlFor="description_key" className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          Package Description (Translation Key)
        </Label>
        <Input
          id="description_key"
          value={formData.description_key}
          onChange={(e) => setFormData(prev => ({ ...prev, description_key: e.target.value }))}
          placeholder="lang_key_xxx_package_desc"
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Write small desc for this package...
        </p>
      </div>

      <Separator />

      {/* Monthly Pricing */}
      <div className="space-y-4">
        <h4 className="font-medium">Monthly Pricing</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthly_price">Package Actual Price</Label>
            <Input
              id="monthly_price"
              type="number"
              step="0.01"
              min="0"
              value={formData.monthly_price}
              onChange={(e) => setFormData(prev => ({ ...prev, monthly_price: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly_discounted_price">Package Discounted Price</Label>
            <Input
              id="monthly_discounted_price"
              type="number"
              step="0.01"
              min="0"
              value={formData.monthly_discounted_price}
              onChange={(e) => setFormData(prev => ({ ...prev, monthly_discounted_price: e.target.value }))}
              placeholder="0.00 (optional)"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Yearly Pricing */}
      <div className="space-y-4">
        <h4 className="font-medium">Yearly Pricing</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="yearly_price">Package Actual Price</Label>
            <Input
              id="yearly_price"
              type="number"
              step="0.01"
              min="0"
              value={formData.yearly_price}
              onChange={(e) => setFormData(prev => ({ ...prev, yearly_price: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearly_discounted_price">Package Discounted Price</Label>
            <Input
              id="yearly_discounted_price"
              type="number"
              step="0.01"
              min="0"
              value={formData.yearly_discounted_price}
              onChange={(e) => setFormData(prev => ({ ...prev, yearly_discounted_price: e.target.value }))}
              placeholder="0.00 (optional)"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div className="space-y-4">
        <h4 className="font-medium">Package Features</h4>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add a feature..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
          />
          <Button type="button" variant="outline" onClick={addFeature}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.features.length > 0 && (
          <ScrollArea className="h-32 border rounded-md p-2">
            <div className="space-y-1">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded text-sm"
                >
                  <span>{feature}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <Separator />

      {/* Options */}
      <div className="space-y-4">
        <h4 className="font-medium">Options</h4>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="is_featured">Featured Package</Label>
            <p className="text-xs text-muted-foreground">Highlight this package</p>
          </div>
          <Switch
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="is_active">Active</Label>
            <p className="text-xs text-muted-foreground">Show package on frontend</p>
          </div>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            min="0"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AdminSectionHeader
        title="Manage Packages"
        subtitle="Configure hosting packages, pricing, and feature sets"
        searchPlaceholder="Search packages..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={[
          {
            label: 'Add Package',
            icon: <Plus className="h-4 w-4 mr-2" />,
            onClick: handleAdd,
            variant: 'default'
          }
        ]}
      />

      <Card className="bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No packages configured yet</p>
              <p className="text-sm">Click "Add Package" to create your first hosting package.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package Name Key</TableHead>
                  <TableHead>Monthly</TableHead>
                  <TableHead>Yearly</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id} className="hover:bg-white/[0.05] transition-colors duration-200">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                            {pkg.name_key.length > 35 
                              ? pkg.name_key.substring(0, 35) + '...' 
                              : pkg.name_key}
                          </code>
                          {pkg.is_featured && (
                            <Badge variant="secondary" className="gap-1">
                              <Star className="h-3 w-3" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        {pkg.features && pkg.features.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {pkg.features.length} features
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatPrice(pkg.monthly_price, pkg.monthly_discounted_price)}
                    </TableCell>
                    <TableCell>
                      {formatPrice(pkg.yearly_price, pkg.yearly_discounted_price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                        {pkg.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClone(pkg)}
                          title="Clone package"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(pkg)}
                          title="Edit package"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(pkg)}
                          title="Delete package"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Package Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Add New Package
            </DialogTitle>
          </DialogHeader>
          <PackageForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSave(false)} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Package Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Package
            </DialogTitle>
          </DialogHeader>
          <PackageForm isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSave(true)} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this package? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminPackagesPage;
