import React, { useCallback } from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2AffiliateHeroSectionData, V2AffiliateBenefitItem } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2AffiliateHeroSectionData & BaseSectionData;
  onChange: (data: V2AffiliateHeroSectionData & BaseSectionData) => void;
}

export function V2AffiliateHeroSettingsContent({ data, onChange }: Props) {
  const { updateField, updateArray, dataRef } = useDataChangeHandlers(data, onChange);

  const addBenefit = useCallback(() => {
    updateArray('benefits', [...(dataRef.current.benefits || []), { text: 'New Benefit' }]);
  }, [updateArray, dataRef]);

  const removeBenefit = useCallback((index: number) => {
    updateArray('benefits', (dataRef.current.benefits || []).filter((_, i) => i !== index));
  }, [updateArray, dataRef]);

  const updateBenefit = useCallback((index: number, value: string) => {
    updateArray('benefits', (dataRef.current.benefits || []).map((benefit, i) =>
      i === index ? { ...benefit, text: value } : benefit
    ));
  }, [updateArray, dataRef]);

  return (
    <div className="space-y-6 p-3">
      {/* Text Content */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Content
        </h4>
        
        <div className="space-y-1.5">
          <Label className="text-xs">Badge Text</Label>
          <DebouncedInput
            value={data.badge || ''}
            onChange={(value) => updateField('badge', value)}
            placeholder="e.g., hostonce Partner Program"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <DebouncedInput
            value={data.title || ''}
            onChange={(value) => updateField('title', value)}
            placeholder="e.g., Earn More by Promoting Hostonce"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Subtitle</Label>
          <DebouncedInput
            value={data.subtitle || ''}
            onChange={(value) => updateField('subtitle', value)}
            placeholder="e.g., Join an affiliate program..."
            className="h-8 text-xs"
            debounceMs={300}
            multiline
            rows={3}
          />
        </div>
      </div>

      {/* Benefits List */}
      <div className="pt-4 border-t space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Benefits
          </h4>
          <Button
            onClick={addBenefit}
            size="sm"
            variant="outline"
            className="h-7 px-2"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
        
        {(data.benefits || []).map((benefit, index) => (
          <div key={index} className="flex items-start gap-2">
            <DebouncedInput
              value={benefit.text || ''}
              onChange={(value) => updateBenefit(index, value)}
              placeholder="e.g., Up to 60% Commission"
              className="h-8 text-xs flex-1"
              debounceMs={300}
            />
            <Button
              onClick={() => removeBenefit(index)}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Primary Button */}
      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Primary Button
        </h4>
        
        <div className="space-y-1.5">
          <Label className="text-xs">Button Text</Label>
          <DebouncedInput
            value={data.buttonText || ''}
            onChange={(value) => updateField('buttonText', value)}
            placeholder="e.g., Become an Affiliate"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Button Link</Label>
          <DebouncedInput
            value={data.buttonLink || ''}
            onChange={(value) => updateField('buttonLink', value)}
            placeholder="e.g., /affiliate"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
      </div>

      {/* Secondary Button */}
      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Secondary Button
        </h4>
        
        <div className="space-y-1.5">
          <Label className="text-xs">Button Text</Label>
          <DebouncedInput
            value={data.secondaryButtonText || ''}
            onChange={(value) => updateField('secondaryButtonText', value)}
            placeholder="e.g., Log In"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Button Link</Label>
          <DebouncedInput
            value={data.secondaryButtonLink || ''}
            onChange={(value) => updateField('secondaryButtonLink', value)}
            placeholder="e.g., /login"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
      </div>

    </div>
  );
}

export default V2AffiliateHeroSettingsContent;
