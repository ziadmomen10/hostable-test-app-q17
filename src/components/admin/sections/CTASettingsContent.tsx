/**
 * CTASettingsContent Component
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { CTASectionData } from '@/types/pageEditor';
import { SectionHeaderFields } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface CTASettingsContentProps {
  data: CTASectionData;
  onChange: (data: CTASectionData) => void;
}

const CTASettingsContent: React.FC<CTASettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateField, updateArray, dataRef } = useDataChangeHandlers(data, onChange);

  const addBenefit = useCallback(() => {
    const benefits = dataRef.current.benefits || [];
    updateArray('benefits', [...benefits, { text: 'New Benefit' }]);
  }, [updateArray, dataRef]);

  const removeBenefit = useCallback((index: number) => {
    const benefits = dataRef.current.benefits || [];
    updateArray('benefits', benefits.filter((_, i) => i !== index));
  }, [updateArray, dataRef]);

  const updateBenefit = useCallback((index: number, value: string) => {
    const benefits = dataRef.current.benefits || [];
    updateArray('benefits', benefits.map((b, i) => i === index ? { text: value } : b));
  }, [updateArray, dataRef]);

  return (
    <div className="space-y-4 p-3">
      {/* Header Fields */}
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(v) => updateField('badge', v)}
        onTitleChange={(v) => updateField('title', v)}
        onSubtitleChange={(v) => updateField('subtitle', v)}
        badgeLabel="Badge"
        titleLabel="Headline"
        subtitleLabel="Supporting Text"
        titlePlaceholder="Ready to Get Started?"
        subtitlePlaceholder="Join thousands of satisfied customers..."
      />
      
      <div className="space-y-1.5">
        <Label className="text-xs">Trust Badge Text</Label>
        <DebouncedInput
          value={data.trustBadgeText || ''}
          onChange={(value) => updateField('trustBadgeText', value)}
          placeholder="No credit card required • Cancel anytime"
          className="h-8 text-sm"
          debounceMs={300}
        />
      </div>

      {/* Buttons Section */}
      <div className="border-t pt-3 space-y-3">
        <Label className="text-xs font-medium">Buttons</Label>
        
        <div className="space-y-3 p-3 border rounded-lg">
          <Label className="text-sm font-medium">Primary Button</Label>
          <div className="space-y-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Button Text</Label>
              <DebouncedInput
                value={data.primaryButtonText}
                onChange={(value) => updateField('primaryButtonText', value)}
                placeholder="Get Started Now"
                className="h-9"
                debounceMs={300}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Button URL</Label>
              <DebouncedInput
                value={data.primaryButtonUrl || ''}
                onChange={(value) => updateField('primaryButtonUrl', value)}
                placeholder="#pricing"
                className="h-9"
                debounceMs={300}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 p-3 border rounded-lg">
          <Label className="text-sm font-medium">Secondary Button</Label>
          <div className="space-y-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Button Text</Label>
              <DebouncedInput
                value={data.secondaryButtonText}
                onChange={(value) => updateField('secondaryButtonText', value)}
                placeholder="Contact Sales"
                className="h-9"
                debounceMs={300}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Button URL</Label>
              <DebouncedInput
                value={data.secondaryButtonUrl || ''}
                onChange={(value) => updateField('secondaryButtonUrl', value)}
                placeholder="#contact"
                className="h-9"
                debounceMs={300}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="border-t pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Benefits ({(data.benefits || []).length})</Label>
          <Button size="sm" variant="outline" className="h-6 text-xs" onClick={addBenefit}>
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>

        <div className="border rounded-lg divide-y max-h-[200px] overflow-y-auto">
          {(!data.benefits || data.benefits.length === 0) ? (
            <div className="p-3 text-center text-xs text-muted-foreground">
              No benefits. Click "Add" to create one.
            </div>
          ) : (
            data.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 p-2">
                <DebouncedInput
                  value={benefit.text}
                  onChange={(value) => updateBenefit(index, value)}
                  placeholder="Benefit text"
                  className="h-8 flex-1 text-sm"
                  debounceMs={300}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeBenefit(index)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CTASettingsContent;
