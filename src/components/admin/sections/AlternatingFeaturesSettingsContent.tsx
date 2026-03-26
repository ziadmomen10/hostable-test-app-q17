/**
 * AlternatingFeaturesSettingsContent Component
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Layers } from 'lucide-react';
import { AlternatingFeaturesSectionData, AlternatingFeatureBlock } from '@/types/newSectionTypes';
import { SectionHeaderFields, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface AlternatingFeaturesSettingsContentProps {
  data: AlternatingFeaturesSectionData;
  onChange: (data: AlternatingFeaturesSectionData) => void;
}

const AlternatingFeaturesSettingsContent: React.FC<AlternatingFeaturesSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateField, updateArray, dataRef } = useDataChangeHandlers(data, onChange);

  const handleBlocksChange = useCallback((blocks: AlternatingFeatureBlock[]) => {
    updateArray('blocks', blocks);
  }, [updateArray]);

  const createNewBlock = useCallback((): AlternatingFeatureBlock => ({
    title: 'New Feature',
    description: 'Feature description here',
    image: '/placeholder.svg',
    imagePosition: dataRef.current.blocks.length % 2 === 0 ? 'right' : 'left',
    bullets: [],
    buttonText: '',
    buttonLink: '',
  }), [dataRef]);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        badge={data.badge}
        title={data.title || ''}
        onBadgeChange={(v) => updateField('badge', v)}
        onTitleChange={(v) => updateField('title', v)}
        badgeLabel="Badge Text"
        titleLabel="Section Title (optional)"
        titlePlaceholder="Features"
      />

      <div className="border-t pt-4">
        <h4 className="font-medium text-sm mb-3">Feature Blocks</h4>
        <ItemListEditor
          items={data.blocks}
          onItemsChange={handleBlocksChange}
          createNewItem={createNewBlock}
          getItemTitle={(block) => block.title || 'Untitled Block'}
          getItemSubtitle={(block) => `Image ${block.imagePosition}`}
          getItemIcon={() => <Layers className="h-3 w-3 text-muted-foreground" />}
          addItemLabel="Add Feature Block"
          emptyMessage="No feature blocks. Add one to get started."
          emptyStateIcon={<Layers className="h-10 w-10 text-muted-foreground/50 mb-2" />}
          minItems={1}
          maxItems={10}
          showDuplicateButton
          confirmDelete
          renderItem={(block, index, onUpdate) => {
            const addBullet = () => {
              const newBullets = [...(block.bullets || []), 'New bullet point'];
              onUpdate({ bullets: newBullets });
            };

            const updateBullet = (bulletIndex: number, value: string) => {
              const newBullets = [...(block.bullets || [])];
              newBullets[bulletIndex] = value;
              onUpdate({ bullets: newBullets });
            };

            const removeBullet = (bulletIndex: number) => {
              const newBullets = (block.bullets || []).filter((_, i) => i !== bulletIndex);
              onUpdate({ bullets: newBullets });
            };

            return (
              <div className="space-y-3 pt-2">
                <div>
                  <Label className="text-xs">Title</Label>
                  <DebouncedInput
                    value={block.title}
                    onChange={(value) => onUpdate({ title: value })}
                    placeholder="Feature title"
                    className="h-9"
                    debounceMs={300}
                  />
                </div>

                <div>
                  <Label className="text-xs">Description</Label>
                  <DebouncedInput
                    value={block.description}
                    onChange={(value) => onUpdate({ description: value })}
                    placeholder="Feature description..."
                    multiline
                    rows={3}
                    className="resize-none"
                    debounceMs={300}
                  />
                </div>

                <div>
                  <Label className="text-xs">Image URL</Label>
                  <DebouncedInput
                    value={block.image}
                    onChange={(value) => onUpdate({ image: value })}
                    placeholder="/images/feature.jpg"
                    className="h-9"
                    debounceMs={300}
                  />
                </div>

                <div>
                  <Label className="text-xs">Image Position</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={block.imagePosition === 'left' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onUpdate({ imagePosition: 'left' })}
                      className="flex-1"
                    >
                      Left
                    </Button>
                    <Button
                      type="button"
                      variant={block.imagePosition === 'right' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onUpdate({ imagePosition: 'right' })}
                      className="flex-1"
                    >
                      Right
                    </Button>
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Bullet Points</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addBullet}
                      className="h-6 px-2 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                  {(block.bullets || []).map((bullet, bIndex) => (
                    <div key={bIndex} className="flex gap-2">
                      <DebouncedInput
                        value={bullet}
                        onChange={(value) => updateBullet(bIndex, value)}
                        className="h-8 text-sm"
                        debounceMs={300}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeBullet(bIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <Label className="text-xs">Button Text</Label>
                    <DebouncedInput
                      value={block.buttonText || ''}
                      onChange={(value) => onUpdate({ buttonText: value })}
                      placeholder="Learn More"
                      className="h-8"
                      debounceMs={300}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Button Link</Label>
                    <DebouncedInput
                      value={block.buttonLink || ''}
                      onChange={(value) => onUpdate({ buttonLink: value })}
                      placeholder="#"
                      className="h-8"
                      debounceMs={300}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default AlternatingFeaturesSettingsContent;
