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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trash2, 
  AlertCircle,
  Loader2,
  Coins,
  Search,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useCryptoRealtimePrices, useCryptoTimeAgo } from '@/hooks/useCryptoRealtimePrices';
import { CryptoPriceDisplay, CryptoChangeDisplay, CryptoConnectionStatus } from '@/components/currency/CryptoPriceDisplay';
import { BulkAddCryptoDialog } from '@/components/currency/BulkAddCryptoDialog';
import { CRYPTO_CURRENCIES, CryptoCurrency, getCategoryLabel, getCategoryColor } from '@/data/cryptoCurrencies';

interface Cryptocurrency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  is_active: boolean;
  created_at: string;
  exchange_rate?: number | null;
  rate_updated_at?: string | null;
}

const CryptoManagement: React.FC = () => {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cryptoToDelete, setCryptoToDelete] = useState<Cryptocurrency | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkAddDialogOpen, setBulkAddDialogOpen] = useState(false);
  const [bulkAdding, setBulkAdding] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);

  // Get crypto codes for real-time prices
  const cryptoCodes = useMemo(() => cryptos.map(c => c.code), [cryptos]);

  // Real-time crypto prices from Binance
  const {
    prices,
    priceChanges,
    lastUpdated,
    isConnected,
    isConnecting,
    connect,
  } = useCryptoRealtimePrices({
    cryptoCodes,
    autoConnect: cryptoCodes.length > 0,
  });

  const timeAgo = useCryptoTimeAgo(lastUpdated);

  useEffect(() => {
    fetchCryptos();
  }, []);

  const autoPopulateCryptos = async (existingCodes: string[]) => {
    const missingCryptos = CRYPTO_CURRENCIES.filter(
      c => !existingCodes.includes(c.code)
    );

    if (missingCryptos.length === 0) return [];

    setIsPopulating(true);
    
    const newCryptos = missingCryptos.map(c => ({
      code: c.code,
      name: c.name,
      symbol: c.symbol,
      is_active: true,
      is_default: false
    }));

    const { data, error } = await supabase
      .from('currencies')
      .insert(newCryptos)
      .select();

    if (error) {
      console.error('Error auto-populating cryptocurrencies:', error);
      return [];
    }

    toast.success(`Added ${data?.length || 0} cryptocurrencies`);
    return data || [];
  };

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      
      // Fetch currencies that are cryptocurrencies (by their codes)
      const allCryptoCodes = CRYPTO_CURRENCIES.map(c => c.code);
      
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .in('code', allCryptoCodes)
        .order('name', { ascending: true });

      if (error) throw error;

      const existingCryptos = data || [];
      
      // Auto-populate if fewer than 10 cryptos exist
      if (existingCryptos.length < 10) {
        const existingCodes = existingCryptos.map(c => c.code);
        const newCryptos = await autoPopulateCryptos(existingCodes);
        setCryptos([...existingCryptos, ...newCryptos].sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        setCryptos(existingCryptos);
      }
    } catch (error) {
      console.error('Error fetching cryptocurrencies:', error);
      toast.error('Failed to fetch cryptocurrencies');
    } finally {
      setLoading(false);
      setIsPopulating(false);
    }
  };

  const filteredCryptos = useMemo(() => {
    if (!searchQuery.trim()) return cryptos;
    const query = searchQuery.toLowerCase();
    return cryptos.filter(
      c => c.name.toLowerCase().includes(query) || 
           c.code.toLowerCase().includes(query) ||
           c.symbol.includes(query)
    );
  }, [cryptos, searchQuery]);

  const handleDeleteCrypto = async () => {
    if (!cryptoToDelete) return;

    try {
      setDeleting(true);

      const { error } = await supabase
        .from('currencies')
        .delete()
        .eq('id', cryptoToDelete.id);

      if (error) throw error;

      setCryptos(prev => prev.filter(crypto => crypto.id !== cryptoToDelete.id));
      
      toast.success('Cryptocurrency deleted successfully');
    } catch (error) {
      console.error('Error deleting cryptocurrency:', error);
      toast.error('Failed to delete cryptocurrency');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setCryptoToDelete(null);
    }
  };

  const handleBulkAddCryptos = async (cryptosToAdd: CryptoCurrency[]) => {
    if (cryptosToAdd.length === 0) return;

    try {
      setBulkAdding(true);

      // Query database for existing codes (get fresh data to prevent duplicates)
      const { data: existingData } = await supabase
        .from('currencies')
        .select('code')
        .in('code', cryptosToAdd.map(c => c.code));

      const existingCodes = new Set(existingData?.map(d => d.code) || []);
      
      // Filter out already existing ones
      const newCryptosToAdd = cryptosToAdd.filter(c => !existingCodes.has(c.code));
      
      if (newCryptosToAdd.length === 0) {
        toast.info('All selected cryptocurrencies already exist');
        setBulkAddDialogOpen(false);
        return;
      }

      const newCryptos = newCryptosToAdd.map(c => ({
        code: c.code,
        name: c.name,
        symbol: c.symbol,
        is_active: true,
        is_default: false
      }));

      const { data, error } = await supabase
        .from('currencies')
        .insert(newCryptos)
        .select();

      if (error) throw error;

      if (data) {
        setCryptos(prev => [...prev, ...data].sort((a, b) => a.name.localeCompare(b.name)));
      }
      
      const skippedCount = cryptosToAdd.length - newCryptosToAdd.length;
      if (skippedCount > 0) {
        toast.info(`${skippedCount} cryptocurrencies were skipped (already exist)`);
      }
      toast.success(`Added ${newCryptosToAdd.length} cryptocurrencies successfully`);
      setBulkAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding cryptocurrencies:', error);
      toast.error('Failed to add cryptocurrencies');
    } finally {
      setBulkAdding(false);
    }
  };

  const getCryptoCategory = (code: string): CryptoCurrency['category'] | null => {
    const crypto = CRYPTO_CURRENCIES.find(c => c.code === code);
    return crypto?.category || null;
  };

  if (loading) {
    return (
      <Card className="bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin" />
            {isPopulating && (
              <p className="text-sm text-muted-foreground">
                Setting up cryptocurrencies...
              </p>
            )}
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
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/[0.04] border-white/[0.08] focus:border-white/[0.16] transition-colors"
          />
        </div>
        <Button onClick={() => setBulkAddDialogOpen(true)} className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.08] transition-all">
          <Coins className="h-4 w-4 mr-2" />
          Add Cryptocurrencies
        </Button>
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-between bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-lg px-4 py-2">
        <CryptoConnectionStatus
          isConnected={isConnected}
          isConnecting={isConnecting}
          lastUpdated={timeAgo}
          cryptoCount={cryptos.length}
          onReconnect={connect}
        />
      </div>

      <Card className="bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
        <CardContent className="pt-6">
          {filteredCryptos.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No cryptocurrencies match your search.' : 'No cryptocurrencies added yet.'}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setBulkAddDialogOpen(true)}
              >
                <Coins className="h-4 w-4 mr-2" />
                Add Cryptocurrencies
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cryptocurrency</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Live Price (USD)</TableHead>
                  <TableHead>24h Change</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      DB Rate
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCryptos.map((crypto) => {
                  const category = getCryptoCategory(crypto.code);
                  return (
                    <TableRow key={crypto.id} className="hover:bg-white/[0.05] transition-colors duration-200">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{crypto.name}</span>
                          <span className="text-muted-foreground text-sm">({crypto.code})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-lg">{crypto.symbol}</span>
                      </TableCell>
                      <TableCell>
                        {category && (
                          <Badge 
                            variant="secondary"
                            className={getCategoryColor(category)}
                          >
                            {getCategoryLabel(category)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <CryptoPriceDisplay
                          currencyCode={crypto.code}
                          price={prices[crypto.code]}
                          loading={isConnecting && !prices[crypto.code]}
                          change={priceChanges[crypto.code]}
                          isConnected={isConnected}
                        />
                      </TableCell>
                      <TableCell>
                        <CryptoChangeDisplay change24h={prices[crypto.code]?.change24h} />
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-sm">
                                {crypto.exchange_rate != null ? (
                                  <span className="font-mono">{crypto.exchange_rate.toFixed(8)}</span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                                {crypto.rate_updated_at && (
                                  <div className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(crypto.rate_updated_at), { addSuffix: true })}
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Cached rate (1 USD = X {crypto.code})</p>
                              {crypto.rate_updated_at && (
                                <p className="text-xs opacity-70">
                                  Updated: {new Date(crypto.rate_updated_at).toLocaleString()}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCryptoToDelete(crypto);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Bulk Add Dialog */}
      <BulkAddCryptoDialog
        open={bulkAddDialogOpen}
        onOpenChange={setBulkAddDialogOpen}
        existingCryptoCodes={cryptos.map(c => c.code)}
        onAddCryptos={handleBulkAddCryptos}
        isAdding={bulkAdding}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cryptocurrency</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{cryptoToDelete?.name}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCrypto}
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
    </div>
  );
};

export default CryptoManagement;
