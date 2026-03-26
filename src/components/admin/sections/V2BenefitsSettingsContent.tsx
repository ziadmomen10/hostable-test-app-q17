/**
 * V2 Benefits Section Settings
 */
import React from 'react';
import { Sparkles } from 'lucide-react';
import { SectionHeaderFields, ItemListEditor } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2BenefitsSectionData, V2BenefitCard } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface V2BenefitsSettingsContentProps {
  data: V2BenefitsSectionData & BaseSectionData;
  onChange: (data: V2BenefitsSectionData & BaseSectionData) => void;
}

export function V2BenefitsSettingsContent({ data, onChange }: V2BenefitsSettingsContentProps) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(badge) => updateField('badge', badge)}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
        showBadge={!!data.badge}
        onShowBadgeChange={(show) => updateField('badge', show ? 'BENEFITS' : undefined)}
      />

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">
          Benefit Cards
        </h4>
        <ItemListEditor
          items={data.benefits || []}
          onItemsChange={(benefits) => updateArray('benefits', benefits)}
          createNewItem={() => ({
            id: crypto.randomUUID(),
            title: 'New Benefit',
            description: 'Describe this benefit.',
            icon: '',
            bgColor: '#accc5414',
            size: 'medium' as const,
          })}
          getItemTitle={(item: V2BenefitCard) => item.title || 'Untitled Benefit'}
          getItemSubtitle={(item: V2BenefitCard) => item.size}
          getItemIcon={() => <Sparkles className="h-3 w-3 text-primary" />}
          minItems={1}
          maxItems={8}
          addItemLabel="Add Benefit Card"
          collapsible
          confirmDelete
          renderItem={(item: V2BenefitCard, _index: number, onUpdate: (updates: Partial<V2BenefitCard>) => void) => (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <DebouncedInput
                  value={item.title}
                  onChange={(value) => onUpdate({ title: value })}
                  placeholder="e.g., Enterprise-grade Security"
                  className="h-8 text-xs"
                  debounceMs={300}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <DebouncedInput
                  value={item.description}
                  onChange={(value) => onUpdate({ description: value })}
                  placeholder="Describe this benefit..."
                  multiline
                  rows={2}
                  className="resize-none text-xs"
                  debounceMs={300}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Card Size</Label>
                <select
                  value={item.size}
                  onChange={(e) => onUpdate({ size: e.target.value as 'large' | 'medium' | 'full' })}
                  className="w-full h-8 text-xs border border-input rounded-md px-2 bg-background"
                >
                  <option value="large">Large (wide — 62%)</option>
                  <option value="medium">Medium (narrow — 38%)</option>
                  <option value="full">Full width</option>
                </select>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default V2BenefitsSettingsContent;
