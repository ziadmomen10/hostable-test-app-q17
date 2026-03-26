/**
 * HistoryPanel
 * 
 * Ultra-compact SEO change history timeline with rollback capability.
 * Follows compact UI standards: h-5 rows, text-[9px] timestamps.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History, 
  RotateCcw, 
  ChevronDown, 
  Clock,
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSEOHistory, formatFieldName, formatChangeType } from '../hooks/useSEOHistory';
import type { PageData } from '@/hooks/queries/usePageData';

interface HistoryPanelProps {
  pageId: string;
  pageData: PageData;
  languageCode: string;
  formState: ReturnType<typeof import('../hooks/useSEOFormState').useSEOFormState>;
}

// Map DB field names to formState field names
const DB_TO_FORM_FIELD: Record<string, keyof ReturnType<typeof import('../hooks/useSEOFormState').useSEOFormState>['formData']> = {
  meta_title: 'metaTitle',
  meta_description: 'metaDescription',
  focus_keyword: 'focusKeyword',
  secondary_keywords: 'secondaryKeywords',
  og_title: 'ogTitle',
  og_description: 'ogDescription',
  og_image_url: 'ogImageUrl',
  canonical_url: 'canonicalUrl',
  no_index: 'noIndex',
  no_follow: 'noFollow',
  structured_data: 'structuredData',
};

export function HistoryPanel({ pageId, pageData, languageCode, formState }: HistoryPanelProps) {
  const [limit, setLimit] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Callback to update form state after rollback
  // Callback to update form state after rollback (Gap 2.1 - handle null for all string fields)
  const handleRollbackComplete = (fieldName: string, value: string | null) => {
    const formField = DB_TO_FORM_FIELD[fieldName];
    if (formField && formState) {
      // Parse the value appropriately based on field type
      let parsedValue: any = value;
      if (formField === 'noIndex' || formField === 'noFollow') {
        parsedValue = value === 'true';
      } else if (formField === 'secondaryKeywords') {
        try {
          parsedValue = value ? JSON.parse(value) : [];
        } catch {
          parsedValue = [];
        }
      } else if (formField === 'structuredData') {
        // Keep as string for structuredData
        parsedValue = value || '';
      } else {
        // String fields - ensure not null to prevent controlled input issues
        parsedValue = value ?? '';
      }
      formState.updateField(formField, parsedValue);
    }
  };

  const { history, isLoading, rollback, isRollingBack } = useSEOHistory({
    pageId,
    languageCode,
    limit,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-[10px]">Loading history...</span>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <History className="h-6 w-6 mx-auto mb-2 opacity-50" />
        <p className="text-[10px]">No history yet</p>
        <p className="text-[9px] mt-1">Changes will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Compact Filter */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <History className="h-3 w-3" />
          {history.length} changes
        </span>
        <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
          <SelectTrigger className="h-5 w-20 text-[9px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10" className="text-[10px]">Last 10</SelectItem>
            <SelectItem value="20" className="text-[10px]">Last 20</SelectItem>
            <SelectItem value="50" className="text-[10px]">Last 50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline */}
      <ScrollArea className="h-[280px]">
        <div className="space-y-1 pr-2">
          {history.map((entry) => (
            <HistoryEntry
              key={entry.id}
              entry={entry}
              isExpanded={expandedId === entry.id}
              onToggle={() => setExpandedId(prev => prev === entry.id ? null : entry.id)}
              onRollback={() => rollback(entry, handleRollbackComplete)}
              isRollingBack={isRollingBack}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface HistoryEntryProps {
  entry: {
    id: string;
    change_type: string;
    field_name: string | null;
    old_value: string | null;
    new_value: string | null;
    created_at: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
  onRollback: () => void;
  isRollingBack: boolean;
}

function HistoryEntry({ entry, isExpanded, onToggle, onRollback, isRollingBack }: HistoryEntryProps) {
  const timeAgo = formatDistanceToNow(new Date(entry.created_at), { addSuffix: false });
  const fieldLabel = entry.field_name ? formatFieldName(entry.field_name) : 'Unknown';
  const changeLabel = formatChangeType(entry.change_type);
  
  const canRollback = entry.field_name && entry.old_value !== null && entry.change_type !== 'rollback';

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className={cn(
          "flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors",
          "hover:bg-muted/50",
          isExpanded && "bg-muted/30"
        )}>
          {/* Timeline Dot */}
          <div className={cn(
            "h-2 w-2 rounded-full shrink-0",
            entry.change_type === 'rollback' ? "bg-yellow-500" :
            entry.change_type === 'ai_generated' ? "bg-purple-500" :
            "bg-primary"
          )} />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-medium truncate">{fieldLabel}</span>
              <Badge variant="outline" className="text-[8px] h-3.5 px-1 shrink-0">
                {changeLabel}
              </Badge>
            </div>
            <span className="text-[9px] text-muted-foreground">{timeAgo} ago</span>
          </div>
          
          <ChevronDown className={cn(
            "h-3 w-3 text-muted-foreground transition-transform shrink-0",
            isExpanded && "rotate-180"
          )} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-1 pl-4 animate-accordion-down">
        <div className="space-y-1.5 pb-2">
          {/* Old Value */}
          {entry.old_value && (
            <div className="space-y-0.5">
              <span className="text-[8px] uppercase text-muted-foreground">Previous</span>
              <div className="text-[9px] p-1 rounded bg-red-500/5 border border-red-500/20 line-clamp-2">
                {truncateValue(entry.old_value)}
              </div>
            </div>
          )}
          
          {/* New Value */}
          {entry.new_value && (
            <div className="space-y-0.5">
              <span className="text-[8px] uppercase text-muted-foreground">New</span>
              <div className="text-[9px] p-1 rounded bg-green-500/5 border border-green-500/20 line-clamp-2">
                {truncateValue(entry.new_value)}
              </div>
            </div>
          )}
          
          {/* Rollback Button */}
          {canRollback && (
            <Button
              variant="outline"
              size="sm"
              className="h-5 text-[9px] w-full mt-1"
              onClick={(e) => {
                e.stopPropagation();
                onRollback();
              }}
              disabled={isRollingBack}
            >
              {isRollingBack ? (
                <Loader2 className="h-2.5 w-2.5 animate-spin mr-1" />
              ) : (
                <RotateCcw className="h-2.5 w-2.5 mr-1" />
              )}
              Rollback
            </Button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function truncateValue(value: string, maxLength = 100): string {
  if (value.length <= maxLength) return value;
  return value.substring(0, maxLength) + '...';
}
