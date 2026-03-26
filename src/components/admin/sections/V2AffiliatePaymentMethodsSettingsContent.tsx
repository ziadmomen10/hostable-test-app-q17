import React from 'react';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import { Plus, Trash2 } from 'lucide-react';
import type { V2AffiliatePaymentMethodsSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

interface Props {
  data: V2AffiliatePaymentMethodsSectionData & BaseSectionData;
  onChange: (data: V2AffiliatePaymentMethodsSectionData & BaseSectionData) => void;
}

export function V2AffiliatePaymentMethodsSettingsContent({ data, onChange }: Props) {
  const { updateField } = useDataChangeHandlers(data, onChange);

  const updateMethod = (index: number, field: string, value: string) => {
    const methods = [...(data.methods || [])];
    methods[index] = { ...methods[index], [field]: value };
    updateField('methods', methods);
  };

  const addMethod = () => {
    const methods = [...(data.methods || [])];
    methods.push({
      id: crypto.randomUUID(),
      icon: '/lovable-uploads/payment/icon-paypal.png',
      title: 'New Payment Method',
      description: 'Description of the payment method.',
    });
    updateField('methods', methods);
  };

  const removeMethod = (index: number) => {
    const methods = [...(data.methods || [])];
    methods.splice(index, 1);
    updateField('methods', methods);
  };

  return (
    <div className="space-y-6 p-3">
      {/* Header Content */}
      <div className="space-y-1.5">
        <Label className="text-xs">Badge (Optional)</Label>
        <DebouncedInput 
          value={data.badge || ''} 
          onChange={(v) => updateField('badge', v)} 
          className="h-8 text-xs" 
          debounceMs={300}
          placeholder="e.g., PAYMENT OPTIONS"
        />
      </div>

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
          className="text-xs min-h-[60px]"
        />
      </div>

      {/* Payment Methods Array */}
      <div className="pt-4 border-t space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Payment Methods</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMethod}
            className="h-7 px-2 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>

        {(data.methods || []).map((method, i) => (
          <div key={method.id || i} className="space-y-1.5 border rounded-lg p-3 relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeMethod(i)}
              className="absolute top-2 right-2 h-6 w-6 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>

            <div className="space-y-1.5 pr-8">
              <Label className="text-xs">Icon URL</Label>
              <DebouncedInput 
                value={method.icon || ''} 
                onChange={(v) => updateMethod(i, 'icon', v)} 
                className="h-8 text-xs" 
                debounceMs={300}
                placeholder="https://..."
              />

              <Label className="text-xs">Title</Label>
              <DebouncedInput 
                value={method.title || ''} 
                onChange={(v) => updateMethod(i, 'title', v)} 
                className="h-8 text-xs" 
                debounceMs={300}
              />

              <Label className="text-xs">Description</Label>
              <Textarea 
                value={method.description || ''} 
                onChange={(e) => updateMethod(i, 'description', e.target.value)} 
                className="text-xs min-h-[60px]"
              />
            </div>
          </div>
        ))}

        {(data.methods || []).length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No payment methods yet. Click "Add" to create one.
          </p>
        )}
      </div>
    </div>
  );
}

export default V2AffiliatePaymentMethodsSettingsContent;
