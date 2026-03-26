/**
 * SEOPageSelector
 * 
 * Compact dropdown with search for selecting which page to optimize.
 * Includes status indicators and score preview.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FileText, ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PageData } from '@/hooks/queries/usePageData';

interface SEOPageSelectorProps {
  pages: PageData[];
  selectedPageId?: string;
  onSelect: (pageId: string) => void;
}

export function SEOPageSelector({ pages, selectedPageId, onSelect }: SEOPageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const selectedPage = pages.find(p => p.id === selectedPageId);
  
  const filteredPages = pages.filter(p => 
    p.page_title.toLowerCase().includes(search.toLowerCase()) ||
    p.page_url.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (pageId: string) => {
    onSelect(pageId);
    setOpen(false);
    setSearch('');
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full h-8 justify-between text-xs px-2 font-normal"
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="truncate">
              {selectedPage?.page_title || 'Select page'}
            </span>
          </div>
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        {/* Search input */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages..."
              className="h-7 pl-7 text-xs"
              autoFocus
            />
          </div>
        </div>
        
        {/* Page list */}
        <ScrollArea className="max-h-[220px]">
          {filteredPages.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No pages found
            </div>
          ) : (
            <div className="p-1">
              {filteredPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handleSelect(page.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors",
                    page.id === selectedPageId 
                      ? "bg-accent" 
                      : "hover:bg-muted/50"
                  )}
                >
                  {/* Status dot */}
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    page.is_active ? "bg-green-500" : "bg-muted-foreground/30"
                  )} />
                  
                  {/* Page info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{page.page_title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{page.page_url}</p>
                  </div>
                  
                  {/* Selected check */}
                  {page.id === selectedPageId && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
