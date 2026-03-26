import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, Layout, Palette, ArrowRight } from 'lucide-react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement } from '@/components/editor/EditableElement';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer } from '@/components/landing/shared';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import type { SectionStyleProps } from '@/types/elementSettings';
import { gapClasses } from '@/types/sectionSettings';

interface AIBuilderSectionProps {
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const AIBuilderSection = ({ sectionId, styleOverrides, layoutProps }: AIBuilderSectionProps) => {
  const gapClass = gapClasses[layoutProps?.gap || 'large'];
  const features = [
    { icon: Wand2, text: 'AI-Powered Design' },
    { icon: Layout, text: 'Drag & Drop Editor' },
    { icon: Palette, text: '100+ Templates' },
  ];

  const { SortableWrapper, getItemProps } = useArrayItems('features', features);

  return (
    <SectionContainer variant="muted" padding="lg" className="bg-muted/50" styleOverrides={styleOverrides}>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content - Website Preview */}
        <div className="relative">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
            {/* Browser Header */}
            <div className="bg-muted px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 flex-1 bg-background rounded px-3 py-1 text-xs text-muted-foreground">
                yourbusiness.com
              </div>
            </div>
            
            {/* Website Content */}
            <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <div className="text-2xl font-bold text-foreground mb-2">
                  Fashion
                </div>
                <div className="text-4xl font-black text-foreground italic">
                  Here & Always
                </div>
                <Button className="mt-4 bg-foreground text-background">Shop Now</Button>
              </div>
            </div>
          </div>

          {/* AI Badge */}
          <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">AI Generated</span>
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-8">
          <div>
            <EditableElement
              as="p"
              sectionId={sectionId}
              path="badge"
              className="text-primary font-semibold mb-4"
            >
              <RichTextRenderer content="Website Builder" />
            </EditableElement>
            <EditableElement
              as="h2"
              sectionId={sectionId}
              path="title"
              className="text-3xl lg:text-4xl font-bold text-foreground leading-tight"
            >
              <RichTextRenderer content="Build Your Website with AI in Minutes, Not Weeks" />
            </EditableElement>
          </div>

          <EditableElement
            as="p"
            sectionId={sectionId}
            path="subtitle"
            className="text-muted-foreground"
          >
            <RichTextRenderer content="Our AI-powered website builder creates stunning, professional websites in seconds. Just describe what you need, and watch the magic happen." />
          </EditableElement>

          {/* Features */}
          <SortableWrapper>
            <div className={`flex flex-wrap ${gapClass}`}>
              {features.map((feature, index) => (
                <SortableItem
                  key={`feature-${index}`}
                  {...getItemProps(index)}
                >
                  <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                    <feature.icon className="w-5 h-5 text-primary" />
                    <EditableElement
                      as="span"
                      sectionId={sectionId}
                      path={`features.${index}.text`}
                      className="text-foreground text-sm font-medium"
                    >
                      <RichTextRenderer content={feature.text} />
                    </EditableElement>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableWrapper>

          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <EditableElement
              as="span"
              sectionId={sectionId}
              path="buttonText"
            >
              Try AI Builder Free
            </EditableElement>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AIBuilderSection;
