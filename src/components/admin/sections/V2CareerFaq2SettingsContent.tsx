import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2CareerFaq2SectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2CareerFaq2SectionData & BaseSectionData;
  onChange: (data: V2CareerFaq2SectionData & BaseSectionData) => void;
}

export function V2CareerFaq2SettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateFaq = (index: number, field: string, value: string) => {
    const faqs = [...(data.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: value };
    updateField('faqs', faqs);
  };

  return (
    <div className="space-y-6 p-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Title</Label>
        <Textarea value={data.title || ''} onChange={(e) => updateField('title', e.target.value)} className="text-xs min-h-[60px]" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Subtitle</Label>
        <DebouncedInput value={data.subtitle || ''} onChange={(v) => updateField('subtitle', v)} className="h-8 text-xs" debounceMs={300} />
      </div>

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
        <div className="space-y-1.5">
          <Label className="text-xs">Contact Image URL</Label>
          <DebouncedInput value={data.contactImage || ''} onChange={(v) => updateField('contactImage', v)} className="h-8 text-xs" debounceMs={300} />
        </div>
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">FAQ Items</h4>
        {(data.faqs || []).map((faq, i) => (
          <div key={faq.id || i} className="space-y-1.5 border-b pb-3">
            <Label className="text-xs">Question</Label>
            <DebouncedInput value={faq.question || ''} onChange={(v) => updateFaq(i, 'question', v)} className="h-8 text-xs" debounceMs={300} />
            <Label className="text-xs">Answer</Label>
            <Textarea value={faq.answer || ''} onChange={(e) => updateFaq(i, 'answer', e.target.value)} className="text-xs min-h-[40px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default V2CareerFaq2SettingsContent;
