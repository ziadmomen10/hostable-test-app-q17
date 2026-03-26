import React from 'react';
import { HelpCircle } from 'lucide-react';
import { SectionHeaderFields, ItemListEditor } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2CareerFaqSectionData, V2CareerFaqItem } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2CareerFaqSectionData & BaseSectionData;
  onChange: (data: V2CareerFaqSectionData & BaseSectionData) => void;
}

export function V2CareerFaqSettingsContent({ data, onChange }: Props) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        title={data.title}
        subtitle={data.subtitle}
        onTitleChange={(title) => updateField('title', title)}
        onSubtitleChange={(subtitle) => updateField('subtitle', subtitle)}
      />

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contact Card</h4>
        <div className="space-y-1.5">
          <Label className="text-xs">Contact Text</Label>
          <DebouncedInput value={data.contactText || ''} onChange={(v) => updateField('contactText', v)} className="h-8 text-xs" debounceMs={300} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Contact Label</Label>
          <DebouncedInput value={data.contactLabel || ''} onChange={(v) => updateField('contactLabel', v)} className="h-8 text-xs" debounceMs={300} />
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">FAQ Items</h4>
        <ItemListEditor
          items={data.faqs || []}
          onItemsChange={(faqs) => updateArray('faqs', faqs)}
          createNewItem={() => ({ question: 'New question?', answer: '' })}
          getItemTitle={(item: V2CareerFaqItem) => item.question || 'Untitled'}
          getItemIcon={() => <HelpCircle className="h-3 w-3 text-primary" />}
          minItems={1}
          maxItems={20}
          addItemLabel="Add FAQ"
          collapsible
          confirmDelete
          renderItem={(item: V2CareerFaqItem, _i: number, onUpdate: (u: Partial<V2CareerFaqItem>) => void) => (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Question</Label>
                <DebouncedInput value={item.question} onChange={(v) => onUpdate({ question: v })} className="h-8 text-xs" debounceMs={300} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Answer</Label>
                <DebouncedInput value={item.answer || ''} onChange={(v) => onUpdate({ answer: v })} multiline rows={3} className="resize-none text-xs" debounceMs={300} />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default V2CareerFaqSettingsContent;
