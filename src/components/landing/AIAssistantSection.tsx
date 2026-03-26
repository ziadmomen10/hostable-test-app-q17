import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Bot, Zap, ArrowRight } from 'lucide-react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement } from '@/components/editor/EditableElement';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer } from '@/components/landing/shared';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import type { SectionStyleProps } from '@/types/elementSettings';
import { gapClasses } from '@/types/sectionSettings';

interface AIAssistantSectionProps {
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const AIAssistantSection = ({ sectionId, styleOverrides, layoutProps }: AIAssistantSectionProps) => {
  const gapClass = gapClasses[layoutProps?.gap || 'default'];
  
  const capabilities = [
    { text: 'Server optimization recommendations' },
    { text: 'Security threat detection' },
    { text: 'Performance monitoring' },
    { text: 'Instant troubleshooting' }
  ];

  const { SortableWrapper, getItemProps } = useArrayItems('capabilities', capabilities);

  return (
    <SectionContainer variant="dark" padding="lg" styleOverrides={styleOverrides}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-dark-bg-light border border-primary/30 rounded-full px-4 py-2 mb-8">
          <Bot className="w-5 h-5 text-primary" />
          <EditableElement
            as="span"
            sectionId={sectionId}
            path="badge"
            className="text-primary text-sm font-medium"
          >
            AI-Powered
          </EditableElement>
        </div>

        <EditableElement
          as="h2"
          sectionId={sectionId}
          path="title"
          className="text-3xl lg:text-5xl font-bold mb-6 text-white"
        >
          <RichTextRenderer content="AI Assistant to Help You Manage Your Server" />
        </EditableElement>

        <EditableElement
          as="p"
          sectionId={sectionId}
          path="subtitle"
          className="text-white/60 text-lg mb-8 max-w-2xl mx-auto"
        >
          <RichTextRenderer content="Our intelligent AI assistant monitors your server 24/7, provides optimization recommendations, and helps you troubleshoot issues instantly." />
        </EditableElement>

        {/* Chat Demo */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-lg mx-auto mb-8">
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="bg-primary text-dark-bg rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%]">
                <p className="text-sm">Why is my website loading slowly?</p>
              </div>
            </div>
            
            <div className="flex justify-start">
              <div className="bg-dark-bg-light text-white rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-primary text-xs font-medium">OnceAI</span>
                </div>
                <p className="text-sm text-white/80">
                  I've analyzed your server. Your images are unoptimized. I can compress them now to improve load time by 40%.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <input 
              placeholder="Ask OnceAI anything..."
              className="flex-1 bg-dark-bg-light border border-dark-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
            />
            <Button className="bg-primary hover:bg-primary/90 text-dark-bg">
              <MessageSquare className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Capabilities */}
        <SortableWrapper>
          <div className={`flex flex-wrap justify-center ${gapClass} mb-8`}>
            {capabilities.map((cap, index) => (
              <SortableItem
                key={`cap-${index}`}
                {...getItemProps(index)}
              >
                <div className="flex items-center gap-2 bg-dark-card border border-dark-border rounded-lg px-4 py-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <EditableElement
                    as="span"
                    sectionId={sectionId}
                    path={`capabilities.${index}.text`}
                    className="text-white/80 text-sm"
                  >
                    <RichTextRenderer content={cap.text} />
                  </EditableElement>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableWrapper>

        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 text-dark-bg font-semibold"
        >
          <EditableElement
            as="span"
            sectionId={sectionId}
            path="buttonText"
          >
            Try OnceAI Free
          </EditableElement>
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </SectionContainer>
  );
};

export default AIAssistantSection;
