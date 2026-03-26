/**
 * SchemaLibrary
 * 
 * Pre-built schema templates for common use cases.
 * One-click apply to structured data with AI customization.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { 
  Library, 
  ChevronDown, 
  Building2,
  FileText,
  ShoppingBag,
  HelpCircle,
  ListChecks,
  Calendar,
  ChefHat,
  User,
  Newspaper,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { useSEOFormState } from '../hooks/useSEOFormState';
import type { PageData } from '@/hooks/queries/usePageData';

interface SchemaLibraryProps {
  pageData: PageData;
  formState: ReturnType<typeof useSEOFormState>;
}

interface SchemaTemplate {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  template: (pageData: PageData) => object;
}

const SCHEMA_TEMPLATES: SchemaTemplate[] = [
  {
    id: 'article',
    name: 'Article',
    icon: Newspaper,
    description: 'Blog posts, news articles',
    template: (pageData) => ({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": pageData.page_title,
      "description": pageData.page_description || "",
      "url": pageData.page_url,
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": "Your Organization"
      }
    })
  },
  {
    id: 'organization',
    name: 'Organization',
    icon: Building2,
    description: 'Company, business',
    template: (pageData) => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": pageData.page_title,
      "url": window.location.origin,
      "logo": pageData.og_image_url || "",
      "description": pageData.page_description || ""
    })
  },
  {
    id: 'local-business',
    name: 'Local Business',
    icon: Building2,
    description: 'Physical store/office',
    template: (pageData) => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": pageData.page_title,
      "url": pageData.page_url,
      "image": pageData.og_image_url || "",
      "description": pageData.page_description || "",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "",
        "addressLocality": "",
        "addressRegion": "",
        "postalCode": "",
        "addressCountry": ""
      }
    })
  },
  {
    id: 'product',
    name: 'Product',
    icon: ShoppingBag,
    description: 'E-commerce product',
    template: (pageData) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": pageData.page_title,
      "description": pageData.page_description || "",
      "image": pageData.og_image_url || "",
      "offers": {
        "@type": "Offer",
        "price": "",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    })
  },
  {
    id: 'faq',
    name: 'FAQ Page',
    icon: HelpCircle,
    description: 'FAQ section',
    template: () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Question 1?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Answer 1"
          }
        }
      ]
    })
  },
  {
    id: 'howto',
    name: 'How-To',
    icon: ListChecks,
    description: 'Step-by-step guide',
    template: (pageData) => ({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": pageData.page_title,
      "description": pageData.page_description || "",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Step 1",
          "text": "Description of step 1"
        }
      ]
    })
  },
  {
    id: 'event',
    name: 'Event',
    icon: Calendar,
    description: 'Conference, meetup',
    template: (pageData) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      "name": pageData.page_title,
      "description": pageData.page_description || "",
      "startDate": "",
      "endDate": "",
      "location": {
        "@type": "Place",
        "name": "",
        "address": ""
      }
    })
  },
  {
    id: 'person',
    name: 'Person',
    icon: User,
    description: 'Author, founder',
    template: (pageData) => ({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": pageData.page_title,
      "url": pageData.page_url,
      "image": pageData.og_image_url || "",
      "description": pageData.page_description || "",
      "sameAs": []
    })
  },
  {
    id: 'recipe',
    name: 'Recipe',
    icon: ChefHat,
    description: 'Cooking recipe',
    template: (pageData) => ({
      "@context": "https://schema.org",
      "@type": "Recipe",
      "name": pageData.page_title,
      "description": pageData.page_description || "",
      "image": pageData.og_image_url || "",
      "recipeIngredient": [],
      "recipeInstructions": []
    })
  }
];

export function SchemaLibrary({ pageData, formState }: SchemaLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const applySchema = (template: SchemaTemplate) => {
    const currentSchemaStr = formState.formData.structuredData;
    let currentSchema = null;
    
    if (currentSchemaStr.trim()) {
      try {
        currentSchema = JSON.parse(currentSchemaStr);
      } catch {
        currentSchema = null;
      }
    }

    const newSchema = template.template(pageData);
    
    // Merge with existing schema
    const finalSchema = Array.isArray(currentSchema) 
      ? [...currentSchema, newSchema]
      : currentSchema 
        ? [currentSchema, newSchema]
        : newSchema;

    formState.updateField('structuredData', JSON.stringify(finalSchema, null, 2));
    toast.success(`${template.name} schema added - remember to save!`);
    setIsOpen(false);
  };

  // Check which schemas are already applied
  const appliedSchemas = new Set<string>();
  try {
    const currentSchema = formState.formData.structuredData;
    if (currentSchema) {
      const parsed = JSON.parse(currentSchema);
      const schemas = Array.isArray(parsed) ? parsed : [parsed];
      schemas.forEach((s: any) => {
        const type = s['@type']?.toLowerCase();
        if (type) {
          SCHEMA_TEMPLATES.forEach(t => {
            if (t.template(pageData)['@type']?.toLowerCase() === type) {
              appliedSchemas.add(t.id);
            }
          });
        }
      });
    }
  } catch {
    // Ignore parse errors
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between h-6 text-[10px]"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-1.5">
            <Library className="h-2.5 w-2.5" />
            Schema Library
            {appliedSchemas.size > 0 && (
              <Badge variant="secondary" className="text-[8px] h-4">
                {appliedSchemas.size} active
              </Badge>
            )}
          </span>
          <ChevronDown className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-1.5 animate-accordion-down">
        <div className="grid grid-cols-3 gap-1">
          {SCHEMA_TEMPLATES.map((template) => {
            const Icon = template.icon;
            const isApplied = appliedSchemas.has(template.id);
            
            return (
              <Button
                key={template.id}
                variant={isApplied ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "h-auto py-1.5 px-1 flex-col gap-0.5",
                  isApplied && "border-primary/50"
                )}
                onClick={() => applySchema(template)}
                title={template.description}
              >
                <Icon className="h-3 w-3" />
                <span className="text-[8px] leading-none">{template.name}</span>
                {!isApplied && (
                  <Plus className="h-2 w-2 text-muted-foreground" />
                )}
              </Button>
            );
          })}
        </div>
        <p className="text-[8px] text-muted-foreground mt-1.5 text-center">
          Click to add schema. Edit in Raw mode for customization.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
