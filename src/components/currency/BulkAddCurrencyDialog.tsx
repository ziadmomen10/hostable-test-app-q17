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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Search, Globe2 } from 'lucide-react';
import { 
  WORLD_CURRENCIES, 
  MAJOR_CURRENCIES, 
  G20_CURRENCIES,
  WorldCurrency,
  TOTAL_CURRENCIES_COUNT 
} from '@/data/worldCurrencies';

type BulkAddMode = 'major' | 'g20' | 'all' | 'custom';

interface BulkAddCurrencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingCurrencyCodes: string[];
  onAddCurrencies: (currencies: WorldCurrency[]) => Promise<void>;
  isAdding: boolean;
}

export const BulkAddCurrencyDialog: React.FC<BulkAddCurrencyDialogProps> = ({
  open,
  onOpenChange,
  existingCurrencyCodes,
  onAddCurrencies,
  isAdding,
}) => {
  const [mode, setMode] = useState<BulkAddMode>('custom');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());

  // Filter out existing currencies
  const existingSet = useMemo(() => new Set(existingCurrencyCodes), [existingCurrencyCodes]);
  
  const availableCurrencies = useMemo(() => 
    WORLD_CURRENCIES.filter(c => !existingSet.has(c.code)), 
    [existingSet]
  );

  const availableMajor = useMemo(() => 
    MAJOR_CURRENCIES.filter(c => !existingSet.has(c.code)), 
    [existingSet]
  );

  const availableG20 = useMemo(() => 
    G20_CURRENCIES.filter(c => !existingSet.has(c.code)), 
    [existingSet]
  );

  const filteredCurrencies = useMemo(() => {
    if (!searchQuery.trim()) return availableCurrencies;
    const query = searchQuery.toLowerCase();
    return availableCurrencies.filter(c =>
      c.code.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query) ||
      c.country.toLowerCase().includes(query)
    );
  }, [availableCurrencies, searchQuery]);

  const getCurrenciesToAdd = (): WorldCurrency[] => {
    switch (mode) {
      case 'major':
        return availableMajor;
      case 'g20':
        return availableG20;
      case 'all':
        return availableCurrencies;
      case 'custom':
        return availableCurrencies.filter(c => selectedCodes.has(c.code));
    }
  };

  const handleToggleCurrency = (code: string) => {
    setSelectedCodes(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedCodes(new Set(filteredCurrencies.map(c => c.code)));
  };

  const handleDeselectAll = () => {
    setSelectedCodes(new Set());
  };

  const handleAdd = async () => {
    const currencies = getCurrenciesToAdd();
    await onAddCurrencies(currencies);
    setSelectedCodes(new Set());
    setSearchQuery('');
    setMode('custom');
  };

  const currenciesToAddCount = getCurrenciesToAdd().length;

  const getRegionColor = (region: WorldCurrency['region']) => {
    const colors: Record<WorldCurrency['region'], string> = {
      major: 'bg-blue-500',
      europe: 'bg-purple-500',
      asia: 'bg-orange-500',
      americas: 'bg-green-500',
      africa: 'bg-yellow-500',
      oceania: 'bg-cyan-500',
      middle_east: 'bg-red-500',
      crypto: 'bg-gray-500',
    };
    return colors[region] || 'bg-gray-500';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5" />
            Add World Currencies
          </DialogTitle>
          <DialogDescription>
            Add currencies from our list of {TOTAL_CURRENCIES_COUNT}+ world currencies.
            {availableCurrencies.length} currencies available to add.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Add Options */}
          <RadioGroup 
            value={mode} 
            onValueChange={(v) => setMode(v as BulkAddMode)}
            className="grid grid-cols-2 gap-3"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="major" id="major" />
              <Label htmlFor="major" className="flex-1 cursor-pointer">
                <div className="font-medium">Major Currencies ({availableMajor.length})</div>
                <div className="text-xs text-muted-foreground">USD, EUR, GBP, JPY, etc.</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="g20" id="g20" />
              <Label htmlFor="g20" className="flex-1 cursor-pointer">
                <div className="font-medium">G20 Currencies ({availableG20.length})</div>
                <div className="text-xs text-muted-foreground">World's major economies</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="flex-1 cursor-pointer">
                <div className="font-medium">All Currencies ({availableCurrencies.length})</div>
                <div className="text-xs text-muted-foreground">Complete list</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="flex-1 cursor-pointer">
                <div className="font-medium">Custom Selection</div>
                <div className="text-xs text-muted-foreground">Pick individually</div>
              </Label>
            </div>
          </RadioGroup>

          {/* Search - Only for custom mode */}
          {mode === 'custom' && (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search currencies by name, code, or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Clear
              </Button>
            </div>
          )}

          {/* Preview label */}
          <div className="text-sm text-muted-foreground">
            {mode === 'custom' 
              ? `${selectedCodes.size} currencies selected`
              : `Preview: ${currenciesToAddCount} currencies to add`
            }
          </div>

          {/* Currency List - Always visible */}
          <ScrollArea className="h-[300px] border rounded-lg">
            <div className="p-2 grid gap-1">
              {(mode === 'custom' ? filteredCurrencies : getCurrenciesToAdd()).map((currency) => (
                <div
                  key={currency.code}
                  onClick={() => mode === 'custom' && handleToggleCurrency(currency.code)}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    mode === 'custom' 
                      ? selectedCodes.has(currency.code)
                        ? 'bg-primary/10 border border-primary cursor-pointer'
                        : 'hover:bg-muted/50 border border-transparent cursor-pointer'
                      : 'bg-muted/30 border border-transparent'
                  }`}
                >
                  {mode === 'custom' && (
                    <Checkbox
                      checked={selectedCodes.has(currency.code)}
                      onCheckedChange={() => handleToggleCurrency(currency.code)}
                    />
                  )}
                  <span className="font-mono text-lg w-10">{currency.symbol}</span>
                  <div className="flex-1">
                    <div className="font-medium">{currency.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {currency.code} • {currency.country}
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${getRegionColor(currency.region)}`} />
                </div>
              ))}

              {(mode === 'custom' ? filteredCurrencies : getCurrenciesToAdd()).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  {mode === 'custom' && searchQuery ? 'No currencies match your search' : 'All currencies have been added'}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedCodes(new Set());
              setSearchQuery('');
              setMode('custom');
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={currenciesToAddCount === 0 || isAdding}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add {currenciesToAddCount} {currenciesToAddCount === 1 ? 'Currency' : 'Currencies'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
