import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Coins } from 'lucide-react';
import { 
  CRYPTO_CURRENCIES, 
  CryptoCurrency, 
  TOP_CRYPTOS,
  CRYPTO_CATEGORIES,
  getCategoryLabel,
  getCategoryColor 
} from '@/data/cryptoCurrencies';

interface BulkAddCryptoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingCryptoCodes: string[];
  onAddCryptos: (cryptos: CryptoCurrency[]) => Promise<void>;
  isAdding: boolean;
}

type QuickAddOption = 'top10' | 'layer1' | 'defi' | 'stablecoins' | 'meme' | 'all';

export const BulkAddCryptoDialog: React.FC<BulkAddCryptoDialogProps> = ({
  open,
  onOpenChange,
  existingCryptoCodes,
  onAddCryptos,
  isAdding,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());

  // Filter out already existing cryptos
  const availableCryptos = useMemo(() => {
    return CRYPTO_CURRENCIES.filter(c => !existingCryptoCodes.includes(c.code));
  }, [existingCryptoCodes]);

  // Filter by search query
  const filteredCryptos = useMemo(() => {
    if (!searchQuery.trim()) return availableCryptos;
    const query = searchQuery.toLowerCase();
    return availableCryptos.filter(
      c => c.name.toLowerCase().includes(query) || 
           c.code.toLowerCase().includes(query)
    );
  }, [availableCryptos, searchQuery]);

  // Quick add handlers
  const handleQuickAdd = (option: QuickAddOption) => {
    let codesToAdd: string[] = [];
    
    switch (option) {
      case 'top10':
        codesToAdd = TOP_CRYPTOS.filter(code => !existingCryptoCodes.includes(code));
        break;
      case 'layer1':
        codesToAdd = CRYPTO_CATEGORIES.layer1
          .filter(c => !existingCryptoCodes.includes(c.code))
          .map(c => c.code);
        break;
      case 'defi':
        codesToAdd = CRYPTO_CATEGORIES.defi
          .filter(c => !existingCryptoCodes.includes(c.code))
          .map(c => c.code);
        break;
      case 'stablecoins':
        codesToAdd = CRYPTO_CATEGORIES.stablecoin
          .filter(c => !existingCryptoCodes.includes(c.code))
          .map(c => c.code);
        break;
      case 'meme':
        codesToAdd = CRYPTO_CATEGORIES.meme
          .filter(c => !existingCryptoCodes.includes(c.code))
          .map(c => c.code);
        break;
      case 'all':
        codesToAdd = availableCryptos.map(c => c.code);
        break;
    }
    
    setSelectedCodes(new Set(codesToAdd));
  };

  const toggleCrypto = (code: string) => {
    setSelectedCodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  const handleAdd = async () => {
    const cryptosToAdd = CRYPTO_CURRENCIES.filter(c => selectedCodes.has(c.code));
    // Filter out any that are already in the existing list (in case state is stale)
    const trulyNewCryptos = cryptosToAdd.filter(c => !existingCryptoCodes.includes(c.code));
    if (trulyNewCryptos.length === 0) {
      return;
    }
    await onAddCryptos(trulyNewCryptos);
    setSelectedCodes(new Set());
    setSearchQuery('');
  };

  const handleClose = () => {
    setSelectedCodes(new Set());
    setSearchQuery('');
    onOpenChange(false);
  };

  // Group filtered cryptos by category
  const groupedCryptos = useMemo(() => {
    const groups: Record<string, CryptoCurrency[]> = {};
    filteredCryptos.forEach(crypto => {
      if (!groups[crypto.category]) {
        groups[crypto.category] = [];
      }
      groups[crypto.category].push(crypto);
    });
    return groups;
  }, [filteredCryptos]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Add Cryptocurrencies
          </DialogTitle>
          <DialogDescription>
            Select cryptocurrencies to add. {availableCryptos.length} available to add.
          </DialogDescription>
        </DialogHeader>

        {/* Quick Add Buttons */}
        <div className="flex flex-wrap gap-2 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAdd('top10')}
            disabled={isAdding}
          >
            Top 10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAdd('layer1')}
            disabled={isAdding}
          >
            Layer 1 ({CRYPTO_CATEGORIES.layer1.filter(c => !existingCryptoCodes.includes(c.code)).length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAdd('defi')}
            disabled={isAdding}
          >
            DeFi ({CRYPTO_CATEGORIES.defi.filter(c => !existingCryptoCodes.includes(c.code)).length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAdd('stablecoins')}
            disabled={isAdding}
          >
            Stablecoins ({CRYPTO_CATEGORIES.stablecoin.filter(c => !existingCryptoCodes.includes(c.code)).length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAdd('meme')}
            disabled={isAdding}
          >
            Meme ({CRYPTO_CATEGORIES.meme.filter(c => !existingCryptoCodes.includes(c.code)).length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAdd('all')}
            disabled={isAdding}
          >
            Select All
          </Button>
          {selectedCodes.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCodes(new Set())}
              disabled={isAdding}
            >
              Clear Selection
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Crypto List */}
        <ScrollArea className="flex-1 max-h-[350px] border rounded-md">
          <div className="p-4 space-y-4">
            {Object.entries(groupedCryptos).map(([category, cryptos]) => (
              <div key={category}>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                  {getCategoryLabel(category as CryptoCurrency['category'])} ({cryptos.length})
                </h4>
                <div className="space-y-1">
                  {cryptos.map((crypto) => (
                    <label
                      key={crypto.code}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedCodes.has(crypto.code)}
                        onCheckedChange={() => toggleCrypto(crypto.code)}
                      />
                      <span className="font-mono text-sm w-16">{crypto.code}</span>
                      <span className="flex-1">{crypto.name}</span>
                      <span className="text-lg">{crypto.symbol}</span>
                      <Badge 
                        variant="secondary" 
                        className={getCategoryColor(crypto.category)}
                      >
                        {getCategoryLabel(crypto.category)}
                      </Badge>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            {filteredCryptos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery 
                  ? 'No cryptocurrencies match your search.' 
                  : 'All cryptocurrencies have been added.'}
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedCodes.size} selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isAdding}>
              Cancel
            </Button>
            <Button 
              onClick={handleAdd} 
              disabled={selectedCodes.size === 0 || isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                `Add ${selectedCodes.size} Cryptocurrencies`
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
