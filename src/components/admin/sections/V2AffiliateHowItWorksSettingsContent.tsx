import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2AffiliateHowItWorksSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2AffiliateHowItWorksSectionData & BaseSectionData;
  onChange: (data: V2AffiliateHowItWorksSectionData & BaseSectionData) => void;
}

export function V2AffiliateHowItWorksSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateStep = (index: number, field: string, value: string) => {
    const steps = [...(data.steps || [])];
    steps[index] = { ...steps[index], [field]: value };
    updateField('steps', steps);
  };

  return (
    <div className="space-y-6 p-3">
      {/* Section Header */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Section Header
        </h4>

        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <DebouncedInput
            value={data.title || ''}
            onChange={(value) => updateField('title', value)}
            placeholder="e.g., How It Works"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Subtitle</Label>
          <DebouncedInput
            value={data.subtitle || ''}
            onChange={(value) => updateField('subtitle', value)}
            placeholder="e.g., Everything you need to find, secure, and manage..."
            className="h-8 text-xs"
            debounceMs={300}
            multiline
            rows={3}
          />
        </div>
      </div>

      {/* Step 1 */}
      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Step 1
        </h4>

        <div className="space-y-1.5">
          <Label className="text-xs">Badge Text</Label>
          <DebouncedInput
            value={data.steps?.[0]?.badge || ''}
            onChange={(value) => updateStep(0, 'badge', value)}
            placeholder="e.g., STEP 01"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <DebouncedInput
            value={data.steps?.[0]?.title || ''}
            onChange={(value) => updateStep(0, 'title', value)}
            placeholder="e.g., Create an Account"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Description</Label>
          <DebouncedInput
            value={data.steps?.[0]?.description || ''}
            onChange={(value) => updateStep(0, 'description', value)}
            placeholder="e.g., Sign up takes less than a minute..."
            className="h-8 text-xs"
            debounceMs={300}
            multiline
            rows={3}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Image URL</Label>
          <DebouncedInput
            value={data.steps?.[0]?.image || ''}
            onChange={(value) => updateStep(0, 'image', value)}
            placeholder="/lovable-uploads/proba1.png"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
      </div>

      {/* Step 2 */}
      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Step 2
        </h4>

        <div className="space-y-1.5">
          <Label className="text-xs">Badge Text</Label>
          <DebouncedInput
            value={data.steps?.[1]?.badge || ''}
            onChange={(value) => updateStep(1, 'badge', value)}
            placeholder="e.g., STEP 02"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <DebouncedInput
            value={data.steps?.[1]?.title || ''}
            onChange={(value) => updateStep(1, 'title', value)}
            placeholder="e.g., Share Your Link"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Description</Label>
          <DebouncedInput
            value={data.steps?.[1]?.description || ''}
            onChange={(value) => updateStep(1, 'description', value)}
            placeholder="e.g., Sign up takes less than a minute..."
            className="h-8 text-xs"
            debounceMs={300}
            multiline
            rows={3}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Image URL</Label>
          <DebouncedInput
            value={data.steps?.[1]?.image || ''}
            onChange={(value) => updateStep(1, 'image', value)}
            placeholder="/lovable-uploads/proba2.png"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
      </div>

      {/* Step 3 */}
      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Step 3
        </h4>

        <div className="space-y-1.5">
          <Label className="text-xs">Badge Text</Label>
          <DebouncedInput
            value={data.steps?.[2]?.badge || ''}
            onChange={(value) => updateStep(2, 'badge', value)}
            placeholder="e.g., STEP 03"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <DebouncedInput
            value={data.steps?.[2]?.title || ''}
            onChange={(value) => updateStep(2, 'title', value)}
            placeholder="e.g., Get Paid"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Description</Label>
          <DebouncedInput
            value={data.steps?.[2]?.description || ''}
            onChange={(value) => updateStep(2, 'description', value)}
            placeholder="e.g., Sign up takes less than a minute..."
            className="h-8 text-xs"
            debounceMs={300}
            multiline
            rows={3}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Image URL</Label>
          <DebouncedInput
            value={data.steps?.[2]?.image || ''}
            onChange={(value) => updateStep(2, 'image', value)}
            placeholder="/lovable-uploads/proba3.png"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
      </div>
    </div>
  );
}

export default V2AffiliateHowItWorksSettingsContent;
