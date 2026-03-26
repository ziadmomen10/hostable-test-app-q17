import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import { ItemListEditor } from '@/components/admin/sections/shared/ItemListEditor';
import { MessageSquareQuote } from 'lucide-react';
import type { V2AffiliateReviewsSectionData, ReviewItem } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2AffiliateReviewsSectionData & BaseSectionData;
  onChange: (data: V2AffiliateReviewsSectionData & BaseSectionData) => void;
}

export function V2AffiliateReviewsSettingsContent({ data, onChange }: Props) {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  return (
    <div className="space-y-6 p-3">
      {/* Section Header */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Section Title</Label>
          <DebouncedInput
            value={data.title || ''}
            onChange={(v) => updateField('title', v)}
            placeholder="e.g., Hear It From Our Partners"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Right Side Image URL</Label>
          <DebouncedInput
            value={data.rightImage || ''}
            onChange={(v) => updateField('rightImage', v)}
            placeholder="/lovable-uploads/reviews/Main.png"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Footer Image URL</Label>
          <DebouncedInput
            value={data.footerImage || ''}
            onChange={(v) => updateField('footerImage', v)}
            placeholder="/lovable-uploads/reviews/Trustpilot Reviews-footer.png"
            className="h-8 text-xs"
            debounceMs={300}
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="pt-4 border-t">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">
          Reviews
        </h4>
        <ItemListEditor
          items={data.reviews || []}
          onItemsChange={(reviews) => updateArray('reviews', reviews)}
          createNewItem={() => ({
            id: crypto.randomUUID(),
            starIcon: '/lovable-uploads/reviews/Icon-stars.png',
            rating: 5,
            text: 'My experience with HostOnce has been exceptional! The products that are offered along with the tools you can use for website.',
            authorAvatar: '/lovable-uploads/reviews/icon-lauren.png',
            authorName: 'Lauren Thompson',
            badge: 'Partner',
          })}
          getItemTitle={(item: ReviewItem) => item.authorName || 'Unnamed Review'}
          getItemIcon={() => <MessageSquareQuote className="h-3 w-3 text-primary" />}
          minItems={1}
          maxItems={10}
          addItemLabel="Add Review"
          collapsible
          confirmDelete
          renderItem={(item: ReviewItem, index: number, onUpdate: (updates: Partial<ReviewItem>) => void) => (
            <div className="space-y-3">
              {/* Review Text */}
              <div className="space-y-1.5">
                <Label className="text-xs">Review Text</Label>
                <DebouncedInput
                  value={item.text}
                  onChange={(value) => onUpdate({ text: value })}
                  placeholder="Review text..."
                  multiline
                  rows={3}
                  className="resize-none text-xs"
                  debounceMs={300}
                />
              </div>

              {/* Author Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Author Name</Label>
                  <DebouncedInput
                    value={item.authorName}
                    onChange={(value) => onUpdate({ authorName: value })}
                    placeholder="Lauren Thompson"
                    className="h-8 text-xs"
                    debounceMs={300}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Badge</Label>
                  <DebouncedInput
                    value={item.badge}
                    onChange={(value) => onUpdate({ badge: value })}
                    placeholder="hostonce Partner"
                    className="h-8 text-xs"
                    debounceMs={300}
                  />
                </div>
              </div>

              {/* Avatar & Star Icon */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Author Avatar URL</Label>
                  <DebouncedInput
                    value={item.authorAvatar}
                    onChange={(value) => onUpdate({ authorAvatar: value })}
                    placeholder="/lovable-uploads/reviews/icon-lauren.png"
                    className="h-8 text-xs"
                    debounceMs={300}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Star Icon URL</Label>
                  <DebouncedInput
                    value={item.starIcon}
                    onChange={(value) => onUpdate({ starIcon: value })}
                    placeholder="/lovable-uploads/reviews/Icon-stars.png"
                    className="h-8 text-xs"
                    debounceMs={300}
                  />
                </div>
              </div>

              {/* Rating Number */}
              <div className="space-y-1.5">
                <Label className="text-xs">Rating (1-5)</Label>
                <DebouncedInput
                  value={String(item.rating || 5)}
                  onChange={(value) => {
                    const num = parseInt(value) || 5;
                    onUpdate({ rating: Math.max(1, Math.min(5, num)) });
                  }}
                  type="number"
                  min={1}
                  max={5}
                  className="h-8 text-xs"
                  debounceMs={300}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default V2AffiliateReviewsSettingsContent;
