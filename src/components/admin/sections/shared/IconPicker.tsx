/**
 * Visual icon selector component for section settings.
 * Displays icons in a grid layout with hover preview.
 * Features fuzzy search for easier icon discovery.
 */

import React, { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { AVAILABLE_ICONS, ICON_CATEGORIES, getIconComponent } from './iconConstants';
import { cn } from '@/lib/utils';

/**
 * Fuzzy match algorithm - returns a score (higher = better match)
 * Returns -1 if no match found
 */
const fuzzyMatch = (pattern: string, text: string): number => {
  pattern = pattern.toLowerCase();
  text = text.toLowerCase();
  
  // Exact match gets highest score
  if (text === pattern) return 1000;
  
  // Starts with pattern gets high score
  if (text.startsWith(pattern)) return 500 + (pattern.length / text.length) * 100;
  
  // Contains pattern gets medium score
  if (text.includes(pattern)) return 200 + (pattern.length / text.length) * 100;
  
  // Fuzzy character matching
  let patternIdx = 0;
  let score = 0;
  let consecutiveBonus = 0;
  let lastMatchIdx = -2;
  
  for (let i = 0; i < text.length && patternIdx < pattern.length; i++) {
    if (text[i] === pattern[patternIdx]) {
      // Bonus for consecutive matches
      if (i === lastMatchIdx + 1) {
        consecutiveBonus += 5;
      } else {
        consecutiveBonus = 0;
      }
      
      // Bonus for matching at word boundaries (after - or capital letters)
      const isWordBoundary = i === 0 || text[i - 1] === '-' || 
        (text[i - 1].toLowerCase() === text[i - 1] && text[i].toLowerCase() !== text[i]);
      
      score += 10 + consecutiveBonus + (isWordBoundary ? 15 : 0);
      lastMatchIdx = i;
      patternIdx++;
    }
  }
  
  // All pattern characters must be found
  if (patternIdx !== pattern.length) return -1;
  
  // Normalize by text length to prefer shorter matches
  return score * (pattern.length / text.length);
};

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, className }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const CurrentIcon = getIconComponent(value);

  const filteredIcons = useMemo(() => {
    let icons = AVAILABLE_ICONS;

    // Filter by category if selected
    if (activeCategory && ICON_CATEGORIES[activeCategory as keyof typeof ICON_CATEGORIES]) {
      const categoryIcons = ICON_CATEGORIES[activeCategory as keyof typeof ICON_CATEGORIES];
      icons = icons.filter(({ name }) => categoryIcons.includes(name));
    }

    // Filter and sort by fuzzy search
    if (search) {
      const scored = icons
        .map(icon => ({ ...icon, score: fuzzyMatch(search, icon.name) }))
        .filter(icon => icon.score > 0)
        .sort((a, b) => b.score - a.score);
      
      return scored;
    }

    return icons;
  }, [search, activeCategory]);

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('w-full justify-start gap-2', className)}
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="truncate">{value || 'Select icon'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons... (try 'srv' for server)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8"
              autoFocus
            />
          </div>
          {search && (
            <p className="text-xs text-muted-foreground mt-1">
              {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        
        {/* Category filters */}
        <div className="p-2 border-b">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-1 pb-1">
              <Button
                variant={activeCategory === null ? 'secondary' : 'ghost'}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setActiveCategory(null)}
              >
                All
              </Button>
              {Object.keys(ICON_CATEGORIES).map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-6 px-2 text-xs whitespace-nowrap"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Icon grid */}
        <ScrollArea className="h-64">
          <div className="grid grid-cols-6 gap-1 p-2">
            {filteredIcons.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                className={cn(
                  'flex items-center justify-center p-2 rounded-md hover:bg-accent transition-colors',
                  value === name && 'bg-primary text-primary-foreground hover:bg-primary'
                )}
                onClick={() => handleSelect(name)}
                title={name}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No icons found
            </div>
          )}
        </ScrollArea>

        {/* Selected icon name */}
        {value && (
          <div className="p-2 border-t text-xs text-center text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{value}</span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
