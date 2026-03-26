/**
 * HeroSettingsContent Component
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { HeroSectionData, HeroServiceItem } from '@/types/pageEditor';
import { TranslatableField } from '@/components/editor/TranslatableField';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface HeroSettingsContentProps {
  data: HeroSectionData;
  onChange: (data: HeroSectionData) => void;
  sectionId?: string;
}

const HeroSettingsContent: React.FC<HeroSettingsContentProps> = ({
  data,
  onChange,
  sectionId,
}) => {
  const { updateField, updateArray, dataRef } = useDataChangeHandlers(data, onChange);

  const addService = useCallback(() => {
    updateArray('services', [...dataRef.current.services, { icon: '✓', label: 'New Feature' }]);
  }, [updateArray, dataRef]);

  const removeService = useCallback((index: number) => {
    updateArray('services', dataRef.current.services.filter((_, i) => i !== index));
  }, [updateArray, dataRef]);

  const updateService = useCallback((index: number, field: keyof HeroServiceItem, value: string) => {
    updateArray('services', dataRef.current.services.map((service, i) =>
      i === index ? { ...service, [field]: value } : service
    ));
  }, [updateArray, dataRef]);

  const moveService = useCallback((index: number, direction: 'up' | 'down') => {
    const services = dataRef.current.services;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= services.length) return;
    const newServices = [...services];
    [newServices[index], newServices[newIndex]] = [newServices[newIndex], newServices[index]];
    updateArray('services', newServices);
  }, [updateArray, dataRef]);

  return (
    <div className="space-y-4 p-3">
      {/* Text Content */}
      <div className="space-y-3">
        {sectionId ? (
          <>
            <TranslatableField
              sectionId={sectionId}
              propPath="badge"
              label="Badge Text"
              value={data.badge}
              onChange={(value) => updateField('badge', value)}
              placeholder="New Feature"
            />
            <TranslatableField
              sectionId={sectionId}
              propPath="title"
              label="Main Title"
              value={data.title}
              onChange={(value) => updateField('title', value)}
              placeholder="4x Faster & Secure Hosting"
              multiline
              rows={2}
            />
            <TranslatableField
              sectionId={sectionId}
              propPath="highlightedText"
              label="Highlighted Text"
              value={data.highlightedText}
              onChange={(value) => updateField('highlightedText', value)}
              placeholder="Powered by AI"
            />
            <TranslatableField
              sectionId={sectionId}
              propPath="subtitle"
              label="Subtitle"
              value={data.subtitle}
              onChange={(value) => updateField('subtitle', value)}
              placeholder="Starting from..."
              multiline
              rows={2}
            />
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">Badge Text</Label>
              <DebouncedInput
                value={data.badge}
                onChange={(value) => updateField('badge', value)}
                placeholder="New Feature"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Main Title</Label>
              <DebouncedInput
                value={data.title}
                onChange={(value) => updateField('title', value)}
                placeholder="4x Faster & Secure Hosting"
                className="text-sm"
                multiline
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Highlighted Text</Label>
              <DebouncedInput
                value={data.highlightedText}
                onChange={(value) => updateField('highlightedText', value)}
                placeholder="Powered by AI"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Subtitle</Label>
              <DebouncedInput
                value={data.subtitle}
                onChange={(value) => updateField('subtitle', value)}
                placeholder="Starting from..."
                className="text-xs"
                multiline
                rows={2}
              />
            </div>
          </>
        )}
      </div>

      {/* Pricing Section */}
      <div className="border-t pt-3 space-y-3">
        <Label className="text-xs font-medium flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          Pricing Display
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Original Price</Label>
            <DebouncedInput
              value={data.originalPrice}
              onChange={(value) => updateField('originalPrice', value)}
              placeholder="$3.99"
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Discounted Price</Label>
            <DebouncedInput
              value={data.discountedPrice}
              onChange={(value) => updateField('discountedPrice', value)}
              placeholder="$2.99"
              className="h-7 text-xs"
            />
          </div>
        </div>
        {sectionId ? (
          <TranslatableField
            sectionId={sectionId}
            propPath="priceText"
            label="Price Text"
            value={data.priceText}
            onChange={(value) => updateField('priceText', value)}
            placeholder="/month"
          />
        ) : (
          <DebouncedInput
            value={data.priceText}
            onChange={(value) => updateField('priceText', value)}
            placeholder="/month"
            className="h-7 text-xs"
          />
        )}
      </div>

      {/* Buttons Section */}
      <div className="border-t pt-3 space-y-3">
        <Label className="text-xs font-medium">Buttons</Label>
        {sectionId ? (
          <>
            <TranslatableField
              sectionId={sectionId}
              propPath="primaryButtonText"
              label="Primary Button Text"
              value={data.primaryButtonText}
              onChange={(value) => updateField('primaryButtonText', value)}
              placeholder="Get Started"
            />
            <div className="space-y-1.5">
              <Label className="text-xs">Primary Button URL</Label>
              <DebouncedInput
                value={data.primaryButtonUrl}
                onChange={(value) => updateField('primaryButtonUrl', value)}
                placeholder="/signup"
                className="h-8 text-sm"
              />
            </div>
            <TranslatableField
              sectionId={sectionId}
              propPath="secondaryButtonText"
              label="Secondary Button Text"
              value={data.secondaryButtonText}
              onChange={(value) => updateField('secondaryButtonText', value)}
              placeholder="Learn More"
            />
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">Primary Button Text</Label>
              <DebouncedInput
                value={data.primaryButtonText}
                onChange={(value) => updateField('primaryButtonText', value)}
                placeholder="Get Started"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Primary Button URL</Label>
              <DebouncedInput
                value={data.primaryButtonUrl}
                onChange={(value) => updateField('primaryButtonUrl', value)}
                placeholder="/signup"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Secondary Button Text</Label>
              <DebouncedInput
                value={data.secondaryButtonText}
                onChange={(value) => updateField('secondaryButtonText', value)}
                placeholder="Learn More"
                className="h-8 text-sm"
              />
            </div>
          </>
        )}
      </div>

      {/* Service Features Section */}
      <div className="border-t pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Service Features ({data.services.length})</Label>
          <Button size="sm" variant="outline" className="h-6 text-xs" onClick={addService}>
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>

        <div className="border rounded-lg divide-y max-h-[200px] overflow-y-auto">
          {data.services.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted-foreground">
              No features. Click "Add" to create one.
            </div>
          ) : (
            data.services.map((service, index) => (
              <div key={index} className="flex items-center gap-2 p-2">
                <div className="flex flex-col gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => moveService(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => moveService(index, 'down')}
                    disabled={index === data.services.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <DebouncedInput
                  value={service.icon}
                  onChange={(value) => updateService(index, 'icon', value)}
                  className="h-7 w-10 text-center text-sm"
                  debounceMs={300}
                />
                <DebouncedInput
                  value={service.label}
                  onChange={(value) => updateService(index, 'label', value)}
                  placeholder="Feature label"
                  className="h-7 text-xs flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeService(index)}
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

export default HeroSettingsContent;
