import React from 'react';
import { SectionHeaderFields } from '@/components/admin/sections/shared';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2CareerTalentPoolSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2CareerTalentPoolSectionData & BaseSectionData;
  onChange: (data: V2CareerTalentPoolSectionData & BaseSectionData) => void;
}

export function V2CareerTalentPoolSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

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
        onShowBadgeChange={(show) => updateField('badge', show ? "Can't Find Your Role?" : '')}
      />

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Button
        </h4>
        <div className="space-y-1.5">
          <Label className="text-xs">Button Text</Label>
          <DebouncedInput
            value={data.buttonText || ''}
            onChange={(value) => updateField('buttonText', value)}
            placeholder="e.g., Submit CV"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Button Link</Label>
          <DebouncedInput
            value={data.buttonLink || ''}
            onChange={(value) => updateField('buttonLink', value)}
            placeholder="e.g., /careers/apply"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Background
        </h4>
        <div className="space-y-1.5">
          <Label className="text-xs">Background Image URL</Label>
          <DebouncedInput
            value={data.backgroundImage || ''}
            onChange={(value) => updateField('backgroundImage', value)}
            placeholder="https://..."
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
      </div>
    </div>
  );
}

export default V2CareerTalentPoolSettingsContent;
