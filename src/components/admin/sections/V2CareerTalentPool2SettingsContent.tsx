import React from 'react';
import { SectionHeaderFields } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2CareerTalentPool2SectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2CareerTalentPool2SectionData & BaseSectionData;
  onChange: (data: V2CareerTalentPool2SectionData & BaseSectionData) => void;
}

export function V2CareerTalentPool2SettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        onBadgeChange={(badge) => updateField('badge', badge)}
        onTitleChange={(title) => updateField('title', title)}
        showBadge={!!data.badge}
        onShowBadgeChange={(show) => updateField('badge', show ? "Can't Find Your Role?" : '')}
      />

      <div className="space-y-1.5">
        <Label className="text-xs">Subtitle</Label>
        <Textarea value={data.subtitle || ''} onChange={(e) => updateField('subtitle', e.target.value)} className="text-xs min-h-[60px]" />
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Button</h4>
        <div className="space-y-1.5">
          <Label className="text-xs">Button Text</Label>
          <DebouncedInput value={data.buttonText || ''} onChange={(v) => updateField('buttonText', v)} className="h-8 text-xs" debounceMs={300} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Button Link</Label>
          <DebouncedInput value={data.buttonLink || ''} onChange={(v) => updateField('buttonLink', v)} className="h-8 text-xs" debounceMs={300} />
        </div>
      </div>
    </div>
  );
}

export default V2CareerTalentPool2SettingsContent;
