import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2SiteFooterSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2SiteFooterSectionData & BaseSectionData;
  onChange: (data: V2SiteFooterSectionData & BaseSectionData) => void;
}

export function V2SiteFooterSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Logo URL</Label>
        <DebouncedInput value={data.logoUrl || ''} onChange={(v) => updateField('logoUrl', v)} className="h-8 text-xs" debounceMs={300} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Copyright Text</Label>
        <DebouncedInput value={data.copyrightText || ''} onChange={(v) => updateField('copyrightText', v)} className="h-8 text-xs" debounceMs={300} />
      </div>
    </div>
  );
}

export default V2SiteFooterSettingsContent;
