/**
 * FeaturesSettingsContent Component
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { FeaturesSectionData, FeatureItem } from '@/types/pageEditor';
import { 
  SectionHeaderFields, 
  IconPicker, 
  getIconComponent, 
  ItemListEditor,
} from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import { DebouncedInput } from '@/components/ui/debounced-input';

interface FeaturesSettingsContentProps {
  data: FeaturesSectionData;
  onChange: (data: FeaturesSectionData) => void;
}

const FeaturesSettingsContent: React.FC<FeaturesSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  const handleFeaturesChange = useCallback((features: FeatureItem[]) => {
    updateArray('features', features);
  }, [updateArray]);

  const getItemIcon = useCallback((item: FeatureItem) => {
    const IconComponent = getIconComponent(item.icon || 'Star');
    return <IconComponent className="h-4 w-4 text-primary" />;
  }, []);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(v) => updateField('badge', v)}
        onTitleChange={(v) => updateField('title', v)}
        onSubtitleChange={(v) => updateField('subtitle', v)}
        badgeLabel="Badge Text"
        titleLabel="Section Title"
        subtitleLabel="Section Subtitle"
      />

      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">
          Features
        </h4>
        <ItemListEditor
          items={data.features}
          onItemsChange={handleFeaturesChange}
          createNewItem={() => ({ 
            icon: 'Star', 
            title: 'New Feature', 
            description: 'Describe this feature.' 
          })}
          getItemTitle={(item) => item.title || 'Untitled Feature'}
          getItemIcon={getItemIcon}
          addItemLabel="Add Feature"
          emptyMessage="No features yet. Add your first feature to get started."
          maxItems={12}
          minItems={0}
          showDuplicateButton
          renderItem={(item, index, onUpdate) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Icon</Label>
                  <IconPicker
                    value={item.icon || 'Star'}
                    onChange={(v) => onUpdate({ icon: v })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Title</Label>
                  <DebouncedInput
                    value={item.title}
                    onChange={(v) => onUpdate({ title: v })}
                    placeholder="Feature title"
                    className="h-9"
                    debounceMs={300}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <DebouncedInput
                  value={item.description}
                  onChange={(v) => onUpdate({ description: v })}
                  placeholder="Feature description"
                  multiline
                  rows={2}
                  className="resize-none"
                  debounceMs={300}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default FeaturesSettingsContent;
