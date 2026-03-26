/**
 * FAQSettingsContent Component
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import { FAQSectionData, FAQItem } from '@/types/pageEditor';
import { SectionHeaderFields, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface FAQSettingsContentProps {
  data: FAQSectionData;
  onChange: (data: FAQSectionData) => void;
}

const FAQSettingsContent: React.FC<FAQSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);

  const handleFaqsChange = useCallback((faqs: FAQItem[]) => {
    updateArray('faqs', faqs);
  }, [updateArray]);

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
        titlePlaceholder="Frequently Asked Questions"
        subtitlePlaceholder="Find answers to common questions"
      />

      <ItemListEditor
        items={data.faqs}
        onItemsChange={handleFaqsChange}
        createNewItem={() => ({ 
          question: 'New Question?', 
          answer: 'Enter your answer here.' 
        })}
        getItemTitle={(item) => item.question || 'Untitled Question'}
        getItemIcon={() => <HelpCircle className="h-4 w-4 text-primary" />}
        addItemLabel="Add FAQ Item"
        emptyMessage="No FAQ items yet. Add your first question to get started."
        emptyStateIcon={<HelpCircle className="h-10 w-10 text-muted-foreground/50 mb-2" />}
        maxItems={20}
        minItems={0}
        showDuplicateButton
        renderItem={(item, index, onUpdate) => (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Question</Label>
              <DebouncedInput
                value={item.question}
                onChange={(value) => onUpdate({ question: value })}
                placeholder="Enter question"
                className="h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Answer</Label>
              <DebouncedInput
                value={item.answer}
                onChange={(value) => onUpdate({ answer: value })}
                placeholder="Enter answer"
                multiline
                rows={3}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default FAQSettingsContent;
