import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { V2AffiliateFaqSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2AffiliateFaqSectionData & BaseSectionData;
  onChange: (data: V2AffiliateFaqSectionData & BaseSectionData) => void;
}

export function V2AffiliateFaqSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const faqs = [...(data.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: value };
    updateField('faqs', faqs);
  };

  const addFaq = () => {
    const faqs = [...(data.faqs || [])];
    faqs.push({ 
      id: crypto.randomUUID(), 
      question: 'New Question', 
      answer: 'New Answer' 
    });
    updateField('faqs', faqs);
  };

  const deleteFaq = (index: number) => {
    const faqs = [...(data.faqs || [])];
    faqs.splice(index, 1);
    updateField('faqs', faqs);
  };

  return (
    <div className="space-y-6 p-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Title</Label>
        <DebouncedInput 
          value={data.title || ''} 
          onChange={(v) => updateField('title', v)} 
          className="h-8 text-xs" 
          debounceMs={300} 
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Subtitle</Label>
        <Textarea 
          value={data.subtitle || ''} 
          onChange={(e) => updateField('subtitle', e.target.value)} 
          className="text-xs min-h-[40px]" 
        />
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Action Links</h4>
        
        <div className="space-y-1.5">
          <Label className="text-xs">Reach Out Text</Label>
          <Textarea 
            value={data.reachOutText || ''} 
            onChange={(e) => updateField('reachOutText', e.target.value)} 
            className="text-xs min-h-[40px]"
            placeholder="e.g., Still got questions?\nReach Out to Us"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Reach Out Link</Label>
          <DebouncedInput 
            value={data.reachOutLink || ''} 
            onChange={(v) => updateField('reachOutLink', v)} 
            className="h-8 text-xs" 
            debounceMs={300}
            placeholder="e.g., #contact"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">HoneyAI Text</Label>
          <DebouncedInput 
            value={data.honeyAIText || ''} 
            onChange={(v) => updateField('honeyAIText', v)} 
            className="h-8 text-xs" 
            debounceMs={300}
            placeholder="e.g., Ask HoneyAI™"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">HoneyAI Link</Label>
          <DebouncedInput 
            value={data.honeyAILink || ''} 
            onChange={(v) => updateField('honeyAILink', v)} 
            className="h-8 text-xs" 
            debounceMs={300}
            placeholder="e.g., /honey-ai"
          />
        </div>
      </div>

      <div className="pt-4 border-t space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            FAQ Items ({(data.faqs || []).length})
          </h4>
          <Button size="sm" variant="outline" className="h-6 text-xs" onClick={addFaq}>
            <Plus className="h-3 w-3 mr-1" />
            Add FAQ
          </Button>
        </div>

        {(!data.faqs || data.faqs.length === 0) ? (
          <div className="p-4 text-center text-xs text-muted-foreground border rounded-lg">
            No FAQ items. Click "Add FAQ" to create one.
          </div>
        ) : (
          data.faqs.map((faq, i) => (
            <div key={faq.id || i} className="space-y-1.5 border rounded-lg p-3 relative">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-semibold">FAQ {i + 1}</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => deleteFaq(i)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <Label className="text-xs">Question</Label>
              <DebouncedInput 
                value={faq.question || ''} 
                onChange={(v) => updateFaq(i, 'question', v)} 
                className="h-8 text-xs" 
                debounceMs={300} 
              />
              <Label className="text-xs">Answer</Label>
              <Textarea 
                value={faq.answer || ''} 
                onChange={(e) => updateFaq(i, 'answer', e.target.value)} 
                className="text-xs min-h-[40px]"
                rows={3}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default V2AffiliateFaqSettingsContent;
