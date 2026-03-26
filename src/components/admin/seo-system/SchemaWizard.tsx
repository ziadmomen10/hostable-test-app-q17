/**
 * SchemaWizard
 * 
 * Compact visual JSON-LD template builder with horizontal scrollable pills,
 * h-6 inputs, and tighter spacing.
 * 
 * Optimized for narrow right panel (~320-420px).
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Building2, 
  Package, 
  HelpCircle, 
  FileText, 
  MapPin,
  Globe,
  Code,
  ChevronDown,
  Plus,
  X,
  Sparkles,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SchemaWizardProps {
  value: string;
  onChange: (json: string) => void;
  pageTitle: string;
  pageUrl: string;
  className?: string;
}

type SchemaType = 'Organization' | 'Product' | 'FAQPage' | 'Article' | 'LocalBusiness' | 'WebPage';

interface SchemaTemplate {
  id: SchemaType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  fields: SchemaField[];
}

interface SchemaField {
  name: string;
  label: string;
  type: 'text' | 'url' | 'textarea' | 'array' | 'price' | 'date';
  required?: boolean;
  placeholder?: string;
  arrayItemLabel?: string;
}

const SCHEMA_TEMPLATES: SchemaTemplate[] = [
  {
    id: 'Organization',
    name: 'Org',
    icon: Building2,
    description: 'Company or brand info',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Company Name' },
      { name: 'url', label: 'URL', type: 'url', placeholder: 'https://example.com' },
      { name: 'logo', label: 'Logo', type: 'url', placeholder: 'https://example.com/logo.png' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description...' },
      { name: 'sameAs', label: 'Social Links', type: 'array', arrayItemLabel: 'Profile URL' },
    ],
  },
  {
    id: 'Product',
    name: 'Product',
    icon: Package,
    description: 'Product with price',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Product Name' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Product description...' },
      { name: 'image', label: 'Image', type: 'url', placeholder: 'https://example.com/product.jpg' },
      { name: 'price', label: 'Price', type: 'price', placeholder: '99.99' },
      { name: 'sku', label: 'SKU', type: 'text', placeholder: 'ABC123' },
    ],
  },
  {
    id: 'FAQPage',
    name: 'FAQ',
    icon: HelpCircle,
    description: 'Q&A pairs',
    fields: [
      { name: 'faqs', label: 'FAQ Items', type: 'array', arrayItemLabel: 'Q&A Pair' },
    ],
  },
  {
    id: 'Article',
    name: 'Article',
    icon: FileText,
    description: 'Blog/news article',
    fields: [
      { name: 'headline', label: 'Headline', type: 'text', required: true, placeholder: 'Article Title' },
      { name: 'author', label: 'Author', type: 'text', placeholder: 'John Doe' },
      { name: 'datePublished', label: 'Date', type: 'date' },
      { name: 'image', label: 'Image', type: 'url', placeholder: 'https://example.com/image.jpg' },
      { name: 'description', label: 'Summary', type: 'textarea', placeholder: 'Article summary...' },
    ],
  },
  {
    id: 'LocalBusiness',
    name: 'Local',
    icon: MapPin,
    description: 'Physical location',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Business Name' },
      { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main St' },
      { name: 'city', label: 'City', type: 'text', placeholder: 'New York' },
      { name: 'phone', label: 'Phone', type: 'text', placeholder: '+1-555-555-5555' },
      { name: 'openingHours', label: 'Hours', type: 'text', placeholder: 'Mo-Fr 09:00-17:00' },
    ],
  },
  {
    id: 'WebPage',
    name: 'Page',
    icon: Globe,
    description: 'Basic page info',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Page Title' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Page description...' },
      { name: 'url', label: 'URL', type: 'url', placeholder: 'https://example.com/page' },
    ],
  },
];

export function SchemaWizard({ value, onChange, pageTitle, pageUrl, className }: SchemaWizardProps) {
  const [activeTemplate, setActiveTemplate] = useState<SchemaType>('Organization');
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [rawJsonOpen, setRawJsonOpen] = useState(false);

  // Detect current schema type from value
  const currentSchemaType = useMemo(() => {
    try {
      const parsed = JSON.parse(value);
      return parsed['@type'] as SchemaType;
    } catch {
      return null;
    }
  }, [value]);

  const template = SCHEMA_TEMPLATES.find(t => t.id === activeTemplate)!;

  // Update form field
  const updateField = useCallback((fieldName: string, fieldValue: any) => {
    setFormValues(prev => ({ ...prev, [fieldName]: fieldValue }));
  }, []);

  // Generate JSON-LD from form values
  const generateSchema = useCallback(() => {
    const schema: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': activeTemplate,
    };

    // Process each field based on template type
    if (activeTemplate === 'Organization') {
      if (formValues.name) schema.name = formValues.name;
      if (formValues.url) schema.url = formValues.url;
      if (formValues.logo) schema.logo = formValues.logo;
      if (formValues.description) schema.description = formValues.description;
      if (formValues.sameAs?.length) schema.sameAs = formValues.sameAs.filter(Boolean);
    } else if (activeTemplate === 'Product') {
      if (formValues.name) schema.name = formValues.name;
      if (formValues.description) schema.description = formValues.description;
      if (formValues.image) schema.image = formValues.image;
      if (formValues.sku) schema.sku = formValues.sku;
      if (formValues.price) {
        schema.offers = {
          '@type': 'Offer',
          price: formValues.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        };
      }
    } else if (activeTemplate === 'FAQPage') {
      schema.mainEntity = (formValues.faqs || [])
        .filter((faq: any) => faq?.question && faq?.answer)
        .map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        }));
    } else if (activeTemplate === 'Article') {
      if (formValues.headline) schema.headline = formValues.headline;
      if (formValues.author) {
        schema.author = { '@type': 'Person', name: formValues.author };
      }
      if (formValues.datePublished) schema.datePublished = formValues.datePublished;
      if (formValues.image) schema.image = formValues.image;
      if (formValues.description) schema.description = formValues.description;
    } else if (activeTemplate === 'LocalBusiness') {
      if (formValues.name) schema.name = formValues.name;
      if (formValues.address || formValues.city) {
        schema.address = {
          '@type': 'PostalAddress',
          streetAddress: formValues.address,
          addressLocality: formValues.city,
        };
      }
      if (formValues.phone) schema.telephone = formValues.phone;
      if (formValues.openingHours) schema.openingHours = formValues.openingHours;
    } else if (activeTemplate === 'WebPage') {
      if (formValues.name) schema.name = formValues.name;
      if (formValues.description) schema.description = formValues.description;
      if (formValues.url) schema.url = formValues.url;
    }

    return JSON.stringify(schema, null, 2);
  }, [activeTemplate, formValues]);

  // Apply generated schema
  const handleApply = () => {
    const json = generateSchema();
    onChange(json);
    toast.success('Schema applied');
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generateSchema());
    toast.success('Copied to clipboard');
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-2", className)}>
        {/* Horizontal Scrollable Template Pills */}
        <ScrollArea className="w-full">
          <div className="flex gap-1 pb-1">
            {SCHEMA_TEMPLATES.map(t => {
              const Icon = t.icon;
              const isActive = activeTemplate === t.id;
              const isCurrent = currentSchemaType === t.id;
              return (
                <Tooltip key={t.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        "h-6 w-6 p-0 shrink-0",
                        isCurrent && !isActive && "border-primary"
                      )}
                      onClick={() => setActiveTemplate(t.id)}
                    >
                      <Icon className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-muted-foreground">{t.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Template Description */}
        <p className="text-[9px] text-muted-foreground">{template.name}: {template.description}</p>

        {/* Compact Form Fields */}
        <div className="space-y-1.5">
          {template.fields.map(field => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={formValues[field.name]}
              onChange={(v) => updateField(field.name, v)}
              pageTitle={pageTitle}
              pageUrl={pageUrl}
            />
          ))}
        </div>

        {/* Compact Actions */}
        <div className="flex gap-1">
          <Button size="sm" className="flex-1 h-6 text-[10px]" onClick={handleApply}>
            <Sparkles className="h-2.5 w-2.5 mr-1" />
            Apply
          </Button>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={handleCopy}>
            <Copy className="h-2.5 w-2.5" />
          </Button>
        </div>

        {/* Raw JSON Toggle */}
        <Collapsible open={rawJsonOpen} onOpenChange={setRawJsonOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full h-5 text-[9px] text-muted-foreground">
              <Code className="h-2.5 w-2.5 mr-1" />
              {rawJsonOpen ? 'Hide' : 'Show'} JSON
              <ChevronDown className={cn("h-2.5 w-2.5 ml-1 transition-transform", rawJsonOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-1">
            <Textarea
              value={generateSchema()}
              readOnly
              className="font-mono text-[9px] h-20 resize-none"
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TooltipProvider>
  );
}

// Field renderer component
function FieldRenderer({ 
  field, 
  value, 
  onChange,
  pageTitle,
  pageUrl 
}: { 
  field: SchemaField; 
  value: any; 
  onChange: (v: any) => void;
  pageTitle: string;
  pageUrl: string;
}) {
  if (field.type === 'array' && field.name === 'faqs') {
    return <FAQArrayField value={value || []} onChange={onChange} />;
  }

  if (field.type === 'array') {
    return <ArrayField field={field} value={value || []} onChange={onChange} />;
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-0.5">
        <Label className="text-[9px]">{field.label}</Label>
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="text-[10px] min-h-[40px] resize-none"
        />
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <Label className="text-[9px]">{field.label}</Label>
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        type={field.type === 'date' ? 'date' : 'text'}
        className="h-6 text-[10px]"
      />
    </div>
  );
}

// Array field for simple lists
function ArrayField({ field, value, onChange }: { field: SchemaField; value: string[]; onChange: (v: string[]) => void }) {
  const addItem = () => onChange([...value, '']);
  const removeItem = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const updateItem = (i: number, v: string) => {
    const newValue = [...value];
    newValue[i] = v;
    onChange(newValue);
  };

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between">
        <Label className="text-[9px]">{field.label}</Label>
        <Button variant="ghost" size="sm" className="h-4 px-1 text-[8px]" onClick={addItem}>
          <Plus className="h-2 w-2 mr-0.5" /> Add
        </Button>
      </div>
      <div className="space-y-0.5">
        {value.map((item, i) => (
          <div key={i} className="flex gap-0.5">
            <Input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={field.arrayItemLabel || 'Item'}
              className="h-5 text-[9px] flex-1"
            />
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => removeItem(i)}>
              <X className="h-2.5 w-2.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// FAQ array field with Q&A pairs
function FAQArrayField({ value, onChange }: { value: Array<{ question: string; answer: string }>; onChange: (v: any) => void }) {
  const addItem = () => onChange([...value, { question: '', answer: '' }]);
  const removeItem = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const updateItem = (i: number, key: string, v: string) => {
    const newValue = [...value];
    newValue[i] = { ...newValue[i], [key]: v };
    onChange(newValue);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-[9px]">FAQ Items</Label>
        <Button variant="ghost" size="sm" className="h-4 px-1 text-[8px]" onClick={addItem}>
          <Plus className="h-2 w-2 mr-0.5" /> Add Q&A
        </Button>
      </div>
      <ScrollArea className="max-h-[120px]">
        <div className="space-y-1 pr-1">
          {value.map((item, i) => (
            <div key={i} className="p-1.5 rounded bg-muted/30 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-medium text-muted-foreground">Q{i + 1}</span>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => removeItem(i)}>
                  <X className="h-2 w-2" />
                </Button>
              </div>
              <Input
                value={item.question}
                onChange={(e) => updateItem(i, 'question', e.target.value)}
                placeholder="Question"
                className="h-5 text-[9px]"
              />
              <Textarea
                value={item.answer}
                onChange={(e) => updateItem(i, 'answer', e.target.value)}
                placeholder="Answer"
                className="text-[9px] min-h-[30px] resize-none"
              />
            </div>
          ))}
        </div>
      </ScrollArea>
      {value.length === 0 && (
        <p className="text-[9px] text-muted-foreground text-center py-1">
          Add Q&A pairs to build FAQ schema
        </p>
      )}
    </div>
  );
}
