import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trash2, 
  Edit, 
  AlertCircle,
  Loader2,
  Globe2,
  Search,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useRealtimeExchangeRates, useTimeAgo } from '@/hooks/useRealtimeExchangeRates';
import { ExchangeRateDisplay, ConnectionStatus } from '@/components/currency/ExchangeRateDisplay';
import { BulkAddCurrencyDialog } from '@/components/currency/BulkAddCurrencyDialog';
import { WORLD_CURRENCIES, WorldCurrency, CRYPTO_CODES } from '@/data/worldCurrencies';

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  exchange_rate?: number | null;
  rate_updated_at?: string | null;
}

const FiatCurrencyManagement: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState<Currency | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currencyToEdit, setCurrencyToEdit] = useState<Currency | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    symbol: '',
    is_active: false,
    is_default: false
  });
  const [updating, setUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkAddDialogOpen, setBulkAddDialogOpen] = useState(false);
  const [bulkAdding, setBulkAdding] = useState(false);

  // Get currency codes for real-time rates (exclude crypto codes)
  const currencyCodes = useMemo(() => 
    currencies.filter(c => !CRYPTO_CODES.includes(c.code)).map(c => c.code), 
    [currencies]
  );

  // Real-time exchange rates
  const {
    rates: exchangeRates,
    rateChanges,
    lastUpdated,
    isConnected,
    isConnecting,
    connect,
  } = useRealtimeExchangeRates({
    currencies: currencyCodes,
    autoConnect: currencyCodes.length > 0,
  });

  const timeAgo = useTimeAgo(lastUpdated);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      
      // Fetch currencies that are NOT cryptocurrencies
      const { data: currenciesData, error: currenciesError } = await supabase
        .from('currencies')
        .select('*')
        .not('code', 'in', `(${CRYPTO_CODES.join(',')})`)
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

      if (currenciesError) throw currenciesError;

      setCurrencies(currenciesData || []);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      toast.error('Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  };

  const filteredCurrencies = useMemo(() => {
    if (!searchQuery.trim()) return currencies;
    const query = searchQuery.toLowerCase();
    return currencies.filter(
      c => c.name.toLowerCase().includes(query) || 
           c.code.toLowerCase().includes(query) ||
           c.symbol.includes(query)
    );
  }, [currencies, searchQuery]);

  const handleDeleteCurrency = async () => {
    if (!currencyToDelete) return;

    if (currencyToDelete.is_default) {
      toast.error('Cannot delete the default currency. Please set another currency as default first.');
      setDeleteDialogOpen(false);
      setCurrencyToDelete(null);
      return;
    }

    try {
      setDeleting(true);

      const { error } = await supabase
        .from('currencies')
        .delete()
        .eq('id', currencyToDelete.id);

      if (error) throw error;

      setCurrencies(prev => prev.filter(currency => currency.id !== currencyToDelete.id));
      
      toast.success('Currency deleted successfully');
    } catch (error) {
      console.error('Error deleting currency:', error);
      toast.error('Failed to delete currency');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setCurrencyToDelete(null);
    }
  };

  const handleEditCurrency = (currency: Currency) => {
    setCurrencyToEdit(currency);
    setEditForm({
      name: currency.name,
      symbol: currency.symbol,
      is_active: currency.is_active,
      is_default: currency.is_default
    });
    setEditDialogOpen(true);
  };

  const handleUpdateCurrency = async () => {
    if (!currencyToEdit) return;

    try {
      setUpdating(true);

      if (editForm.is_default && !currencyToEdit.is_default) {
        const { error: updateDefaultError } = await supabase
          .from('currencies')
          .update({ is_default: false })
          .neq('id', currencyToEdit.id);

        if (updateDefaultError) throw updateDefaultError;
      }

      const { error } = await supabase
        .from('currencies')
        .update({
          name: editForm.name,
          symbol: editForm.symbol,
          is_active: editForm.is_active,
          is_default: editForm.is_default
        })
        .eq('id', currencyToEdit.id);

      if (error) throw error;

      setCurrencies(prev => prev.map(currency => 
        currency.id === currencyToEdit.id 
          ? { ...currency, ...editForm }
          : editForm.is_default ? { ...currency, is_default: false } : currency
      ));

      toast.success('Currency updated successfully');

      setEditDialogOpen(false);
      setCurrencyToEdit(null);
    } catch (error) {
      console.error('Error updating currency:', error);
      toast.error('Failed to update currency');
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkAddCurrencies = async (currenciesToAdd: WorldCurrency[]) => {
    if (currenciesToAdd.length === 0) return;

    try {
      setBulkAdding(true);

      // Query database for existing codes (get fresh data to prevent duplicates)
      const { data: existingData } = await supabase
        .from('currencies')
        .select('code')
        .in('code', currenciesToAdd.map(c => c.code));

      const existingCodes = new Set(existingData?.map(d => d.code) || []);
      
      // Filter out already existing ones
      const newCurrenciesToAdd = currenciesToAdd.filter(c => !existingCodes.has(c.code));
      
      if (newCurrenciesToAdd.length === 0) {
        toast.info('All selected currencies already exist');
        setBulkAddDialogOpen(false);
        return;
      }

      const newCurrencies = newCurrenciesToAdd.map(c => ({
        code: c.code,
        name: c.name,
        symbol: c.symbol,
        is_active: true,
        is_default: false
      }));

      const { data, error } = await supabase
        .from('currencies')
        .insert(newCurrencies)
        .select();

      if (error) throw error;

      if (data) {
        setCurrencies(prev => [...prev, ...data]);
      }
      
      const skippedCount = currenciesToAdd.length - newCurrenciesToAdd.length;
      if (skippedCount > 0) {
        toast.info(`${skippedCount} currencies were skipped (already exist)`);
      }
      toast.success(`Added ${newCurrenciesToAdd.length} currencies successfully`);
      setBulkAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding currencies:', error);
      toast.error('Failed to add currencies');
    } finally {
      setBulkAdding(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search currencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/[0.04] border-white/[0.08] focus:border-white/[0.16] transition-colors"
          />
        </div>
        <Button onClick={() => setBulkAddDialogOpen(true)} className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.08] transition-all">
          <Globe2 className="h-4 w-4 mr-2" />
          Add Currencies
        </Button>
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-between bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-lg px-4 py-2">
        <ConnectionStatus
          isConnected={isConnected}
          isConnecting={isConnecting}
          lastUpdated={timeAgo}
          onReconnect={connect}
        />
        <div className="text-sm text-muted-foreground">
          {currencies.length} currencies • {Object.keys(exchangeRates).length} rates loaded
        </div>
      </div>

      <Card className="bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
        <CardContent className="pt-6">
          {filteredCurrencies.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No currencies match your search.' : 'No currencies found.'}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setBulkAddDialogOpen(true)}
              >
                <Globe2 className="h-4 w-4 mr-2" />
                Add World Currencies
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Live USD Rate</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      DB Rate
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCurrencies.map((currency) => (
                  <TableRow key={currency.id} className="hover:bg-white/[0.05] transition-colors duration-200">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{currency.name}</span>
                        <span className="text-muted-foreground text-sm">({currency.code})</span>
                        {currency.is_default && (
                          <Badge variant="default" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-lg">{currency.symbol}</span>
                    </TableCell>
                    <TableCell>
                      <ExchangeRateDisplay
                        currencyCode={currency.code}
                        rate={exchangeRates[currency.code]}
                        loading={isConnecting && !exchangeRates[currency.code]}
                        change={rateChanges[currency.code]}
                        isConnected={isConnected}
                      />
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-sm">
                              {currency.exchange_rate != null ? (
                                <span className="font-mono">{currency.exchange_rate.toFixed(4)}</span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                              {currency.rate_updated_at && (
                                <div className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(currency.rate_updated_at), { addSuffix: true })}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cached rate used for live pages</p>
                            {currency.rate_updated_at && (
                              <p className="text-xs opacity-70">
                                Updated: {new Date(currency.rate_updated_at).toLocaleString()}
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={currency.is_active ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {currency.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCurrency(currency)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrencyToDelete(currency);
                            setDeleteDialogOpen(true);
                          }}
                          disabled={currency.is_default}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
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

      {/* Bulk Add Dialog */}
      <BulkAddCurrencyDialog
        open={bulkAddDialogOpen}
        onOpenChange={setBulkAddDialogOpen}
        existingCurrencyCodes={currencies.map(c => c.code)}
        onAddCurrencies={handleBulkAddCurrencies}
        isAdding={bulkAdding}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Currency</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the currency "{currencyToDelete?.name}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCurrency}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-white/[0.08]">
          <DialogHeader>
            <DialogTitle>Edit Currency</DialogTitle>
            <DialogDescription>
              Update the currency information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Currency Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., US Dollar"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-symbol">Symbol</Label>
              <Input
                id="edit-symbol"
                value={editForm.symbol}
                onChange={(e) => setEditForm(prev => ({ ...prev, symbol: e.target.value }))}
                placeholder="e.g., $"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={editForm.is_active}
                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="edit-active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-default"
                checked={editForm.is_default}
                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_default: checked }))}
              />
              <Label htmlFor="edit-default">Set as Default</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setCurrencyToEdit(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCurrency}
              disabled={updating || !editForm.name.trim() || !editForm.symbol.trim()}
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Currency'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FiatCurrencyManagement;
