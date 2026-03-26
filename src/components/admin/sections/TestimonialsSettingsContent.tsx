/**
 * TestimonialsSettingsContent Component
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Star, MessageSquareQuote } from 'lucide-react';
import { TestimonialsSectionData, TestimonialItem } from '@/types/pageEditor';
import { SectionHeaderFields, ItemListEditor } from './shared';
import { StarRating } from './shared/ItemFieldRenderers';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import { DebouncedInput } from '@/components/ui/debounced-input';

interface TestimonialsSettingsContentProps {
  data: TestimonialsSectionData;
  onChange: (data: TestimonialsSectionData) => void;
}

const TestimonialsSettingsContent: React.FC<TestimonialsSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  const handleTestimonialsChange = useCallback((testimonials: TestimonialItem[]) => {
    updateArray('testimonials', testimonials);
  }, [updateArray]);

  const getItemIcon = useCallback((item: TestimonialItem) => {
    return <StarRating rating={item.rating} />;
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
        titlePlaceholder="What Our Customers Say"
        subtitlePlaceholder="See what our customers have to say about us"
      />

      <ItemListEditor
        items={data.testimonials}
        onItemsChange={handleTestimonialsChange}
        createNewItem={() => ({
          name: 'New Customer',
          role: 'CEO at Company',
          avatar: '/placeholder.svg',
          rating: 5,
          text: 'Write a testimonial here...',
        })}
        getItemTitle={(item) => item.name || 'Unnamed Customer'}
        getItemSubtitle={(item) => item.role || ''}
        getItemIcon={getItemIcon}
        addItemLabel="Add Testimonial"
        emptyMessage="No testimonials yet. Add customer reviews to build trust."
        emptyStateIcon={<MessageSquareQuote className="h-10 w-10 text-muted-foreground/50 mb-2" />}
        maxItems={10}
        minItems={0}
        showDuplicateButton
        renderItem={(item, index, onUpdate) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name</Label>
                <DebouncedInput
                  value={item.name}
                  onChange={(v) => onUpdate({ name: v })}
                  placeholder="Customer name"
                  className="h-8"
                  debounceMs={300}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Role</Label>
                <DebouncedInput
                  value={item.role}
                  onChange={(v) => onUpdate({ role: v })}
                  placeholder="CEO at Company"
                  className="h-8"
                  debounceMs={300}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Rating</Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[item.rating]}
                  onValueChange={([val]) => onUpdate({ rating: val })}
                  min={1}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <div className="flex items-center gap-1 w-16">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Testimonial Text</Label>
              <DebouncedInput
                value={item.text}
                onChange={(v) => onUpdate({ text: v })}
                placeholder="Customer testimonial..."
                multiline
                rows={3}
                className="resize-none"
                debounceMs={300}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Avatar URL</Label>
              <div className="flex items-center gap-2">
                {item.avatar && (
                  <img
                    src={item.avatar}
                    alt="Avatar preview"
                    className="h-8 w-8 rounded-full object-cover border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <DebouncedInput
                  value={item.avatar}
                  onChange={(v) => onUpdate({ avatar: v })}
                  placeholder="/placeholder.svg"
                  className="flex-1 h-8"
                  debounceMs={300}
                />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default TestimonialsSettingsContent;
