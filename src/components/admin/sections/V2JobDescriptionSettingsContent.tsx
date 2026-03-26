import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2JobDescriptionSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2JobDescriptionSectionData & BaseSectionData;
  onChange: (data: V2JobDescriptionSectionData & BaseSectionData) => void;
}

export function V2JobDescriptionSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateSection = (index: number, field: string, value: string) => {
    const sections = [...(data.sections || [])];
    sections[index] = { ...sections[index], [field]: value };
    updateField('sections', sections);
  };

  const updateButton = (index: number, field: string, value: string) => {
    const buttons = [...(data.buttons || [])];
    buttons[index] = { ...buttons[index], [field]: value };
    updateField('buttons', buttons);
  };

  const updateContact = (index: number, field: string, value: string) => {
    const contactItems = [...(data.contactItems || [])];
    contactItems[index] = { ...contactItems[index], [field]: value };
    updateField('contactItems', contactItems);
  };

  return (
    <div className="space-y-6 p-3">
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Content Sections</h4>
        {(data.sections || []).map((section, i) => (
          <div key={i} className="space-y-1.5 border-b pb-3">
            <Label className="text-xs">Section Title</Label>
            <DebouncedInput value={section.title || ''} onChange={(v) => updateSection(i, 'title', v)} className="h-8 text-xs" debounceMs={300} />
            <Label className="text-xs">Content</Label>
            <Textarea value={section.content || ''} onChange={(e) => updateSection(i, 'content', e.target.value)} className="text-xs min-h-[80px]" />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Action Buttons</h4>
        {(data.buttons || []).map((btn, i) => (
          <div key={i} className="space-y-1.5 border-b pb-3">
            <Label className="text-xs">Button Text</Label>
            <DebouncedInput value={btn.text || ''} onChange={(v) => updateButton(i, 'text', v)} className="h-8 text-xs" debounceMs={300} />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contact Info</h4>
        {(data.contactItems || []).map((contact, i) => (
          <div key={i} className="space-y-1.5 border-b pb-3">
            <Label className="text-xs">Text</Label>
            <DebouncedInput value={contact.text || ''} onChange={(v) => updateContact(i, 'text', v)} className="h-8 text-xs" debounceMs={300} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default V2JobDescriptionSettingsContent;
