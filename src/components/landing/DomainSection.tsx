import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Shield, Globe, RefreshCw } from 'lucide-react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement } from '@/components/editor/EditableElement';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer } from '@/components/landing/shared';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import type { SectionStyleProps } from '@/types/elementSettings';
import { gapClasses } from '@/types/sectionSettings';

interface DomainSectionProps {
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const DomainSection = ({ sectionId, styleOverrides, layoutProps }: DomainSectionProps) => {
  const gapClass = gapClasses[layoutProps?.gap || 'default'];
  const extensions = [
    { name: '.com', price: '$9.99/yr' },
    { name: '.net', price: '$11.99/yr' },
    { name: '.org', price: '$12.99/yr' },
    { name: '.io', price: '$29.99/yr' },
  ];

  const features = [
    { icon: Shield, text: 'Free WHOIS Privacy' },
    { icon: Globe, text: 'DNS Management' },
    { icon: RefreshCw, text: 'Auto-Renewal' },
  ];

  const extensionsDnd = useArrayItems('extensions', extensions);
  const featuresDnd = useArrayItems('features', features);

  return (
    <SectionContainer variant="light" padding="lg" styleOverrides={styleOverrides}>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div>
            <EditableElement
              as="p"
              sectionId={sectionId}
              path="badge"
              className="text-primary font-semibold mb-4"
            >
              <RichTextRenderer content="Domains" />
            </EditableElement>
            <EditableElement
              as="h2"
              sectionId={sectionId}
              path="title"
              className="text-3xl lg:text-4xl font-bold text-foreground leading-tight"
            >
              <RichTextRenderer content="Claim Your Perfect Domain Today" />
            </EditableElement>
          </div>

          <EditableElement
            as="p"
            sectionId={sectionId}
            path="subtitle"
            className="text-muted-foreground"
          >
            <RichTextRenderer content="Find and register your ideal domain name with our easy-to-use search tool. We offer competitive pricing on all popular extensions." />
          </EditableElement>

          {/* Search Box */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                placeholder="Find your perfect domain..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
              <EditableElement
                as="span"
                sectionId={sectionId}
                path="searchButtonText"
              >
                Search
              </EditableElement>
            </Button>
          </div>

          {/* Extensions */}
          <extensionsDnd.SortableWrapper>
            <div className={`flex flex-wrap ${gapClass}`}>
              {extensions.map((ext, index) => (
                <SortableItem
                  key={`ext-${index}`}
                  {...extensionsDnd.getItemProps(index)}
                >
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <EditableElement
                      as="span"
                      sectionId={sectionId}
                      path={`extensions.${index}.name`}
                      className="font-semibold text-foreground"
                    >
                      {ext.name}
                    </EditableElement>
                    <EditableElement
                      as="span"
                      sectionId={sectionId}
                      path={`extensions.${index}.price`}
                      className="text-muted-foreground text-sm ml-2"
                    >
                      {ext.price}
                    </EditableElement>
                  </div>
                </SortableItem>
              ))}
            </div>
          </extensionsDnd.SortableWrapper>

          {/* Features */}
          <featuresDnd.SortableWrapper>
            <div className={`flex flex-wrap ${gapClass}`}>
              {features.map((feature, index) => (
                <SortableItem
                  key={`feature-${index}`}
                  {...featuresDnd.getItemProps(index)}
                >
                  <div className="flex items-center gap-2">
                    <feature.icon className="w-5 h-5 text-primary" />
                    <EditableElement
                      as="span"
                      sectionId={sectionId}
                      path={`features.${index}.text`}
                      className="text-muted-foreground text-sm"
                    >
                      <RichTextRenderer content={feature.text} />
                    </EditableElement>
                  </div>
                </SortableItem>
              ))}
            </div>
          </featuresDnd.SortableWrapper>
        </div>

        {/* Right Content - Phone Mockup */}
        <div className="relative flex justify-center">
          <div className="bg-card border border-border rounded-3xl p-4 shadow-2xl max-w-[300px]">
            <div className="bg-muted rounded-2xl p-6 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">yourdomain.com</h3>
                <p className="text-sm text-muted-foreground">is available!</p>
              </div>
              <Button className="w-full bg-primary text-primary-foreground">
                Register Now - $9.99/yr
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default DomainSection;
