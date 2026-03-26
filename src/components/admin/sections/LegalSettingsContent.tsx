import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { LegalLayoutSectionData, LegalItem } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: LegalLayoutSectionData & BaseSectionData;
  onChange: (data: LegalLayoutSectionData & BaseSectionData) => void;
}

export function LegalSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateItem = (index: number, field: keyof LegalItem, value: string) => {
    const items = [...(data.items || [])];
    items[index] = { ...items[index], [field]: value };
    updateField('items', items);
  };

  const addItem = () => {
    const items = [...(data.items || [])];
    const newItemNumber = items.length + 1;
    items.push({
      id: crypto.randomUUID(),
      label: `Legal Item ${newItemNumber}`,
      title: `Legal Item ${newItemNumber} Title`,
      subtitle: 'This document contains important information about your rights and obligations.',
      slug: `legal-item-${newItemNumber}`,
      content: `This is placeholder content for Legal Item ${newItemNumber}. Replace with actual legal document content.`,
    });
    updateField('items', items);
  };

  const deleteItem = (index: number) => {
    const items = [...(data.items || [])];
    items.splice(index, 1);
    updateField('items', items);
  };

  return (
    <div className="space-y-6 p-3">
      {/* Legal Items */}
      <div className="pt-4 border-t space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Legal Items
          </h4>
          <Button
            type="button"
            onClick={addItem}
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Item
          </Button>
        </div>

        {(data.items || []).map((item, i) => (
          <div key={item.id || i} className="space-y-2 border rounded-lg p-3 bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Item {i + 1}
              </span>
              {(data.items || []).length > 1 && (
                <Button
                  type="button"
                  onClick={() => deleteItem(i)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Sidebar Label</Label>
              <DebouncedInput
                value={item.label || ''}
                onChange={(v) => updateItem(i, 'label', v)}
                className="h-8 text-xs"
                debounceMs={300}
                placeholder="e.g., Terms & Conditions"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Content Title</Label>
              <DebouncedInput
                value={item.title || ''}
                onChange={(v) => updateItem(i, 'title', v)}
                className="h-8 text-xs"
                debounceMs={300}
                placeholder="e.g., Terms and Conditions"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Subtitle (shown below title)</Label>
              <Textarea
                value={item.subtitle || ''}
                onChange={(e) => updateItem(i, 'subtitle', e.target.value)}
                className="text-xs min-h-[60px]"
                placeholder="Kindly read these terms carefully..."
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Slug (URL-friendly)</Label>
              <DebouncedInput
                value={item.slug || ''}
                onChange={(v) => updateItem(i, 'slug', v)}
                className="h-8 text-xs"
                debounceMs={300}
                placeholder="e.g., terms-conditions"
              />
              <p className="text-xs text-muted-foreground">
                Use lowercase letters, numbers, and hyphens only
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Content</Label>
              <Textarea
                value={item.content || ''}
                onChange={(e) => updateItem(i, 'content', e.target.value)}
                className="text-xs min-h-[120px]"
                placeholder="Enter the legal document content here..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LegalSettingsContent;
