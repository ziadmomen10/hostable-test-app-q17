import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement } from '@/components/editor/EditableElement';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer } from '@/components/landing/shared';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import type { SectionStyleProps } from '@/types/elementSettings';
import { gapClasses } from '@/types/sectionSettings';

interface HostOnceSectionProps {
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const HostOnceSection = ({ sectionId, styleOverrides, layoutProps }: HostOnceSectionProps) => {
  const gapClass = gapClasses[layoutProps?.gap || 'default'];
  const features = [
    'Free Domain Name',
    'Unlimited Storage',
    'Free SSL Certificate',
    'Daily Backups',
    '1-Click WordPress Install',
    '30-Day Money Back'
  ];

  const { SortableWrapper, getItemProps } = useArrayItems('features', features);

  return (
    <SectionContainer variant="dark" padding="lg" className="overflow-hidden" styleOverrides={styleOverrides}>
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
              <RichTextRenderer content="Host Once and" />
            </EditableElement>
            <EditableElement
              as="h2"
              sectionId={sectionId}
              path="title"
              className="text-4xl lg:text-5xl font-bold leading-tight text-white"
            >
              <RichTextRenderer content="Never Worry Again" />
            </EditableElement>
          </div>

          <EditableElement
            as="p"
            sectionId={sectionId}
            path="subtitle"
            className="text-white/60 text-lg"
          >
            <RichTextRenderer content="Our all-inclusive hosting packages come with everything you need to get your website up and running. No hidden fees, no surprises." />
          </EditableElement>

          <SortableWrapper>
            <div className={`grid sm:grid-cols-2 ${gapClass}`}>
              {features.map((feature, index) => (
                <SortableItem
                  key={`feature-${index}`}
                  {...getItemProps(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-dark-bg" />
                    </div>
                    <EditableElement
                      as="span"
                      sectionId={sectionId}
                      path={`features.${index}`}
                      className="text-white/80"
                    >
                      <RichTextRenderer content={feature} />
                    </EditableElement>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableWrapper>

          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-dark-bg font-semibold px-8"
          >
            <EditableElement
              as="span"
              sectionId={sectionId}
              path="buttonText"
            >
              Get Started Now
            </EditableElement>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Right Content - Dashboard Preview */}
        <div className="relative">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-2xl">
            {/* Dashboard Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            {/* Dashboard Content */}
            <div className="space-y-4">
              <div className="bg-dark-bg-light rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60 text-sm">Server Status</span>
                  <span className="text-primary text-sm font-medium">Online</span>
                </div>
                <div className="w-full bg-dark-border rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-[95%]"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-bg-light rounded-lg p-4">
                  <p className="text-white/60 text-xs mb-1">CPU Usage</p>
                  <p className="text-white text-xl font-bold">24%</p>
                </div>
                <div className="bg-dark-bg-light rounded-lg p-4">
                  <p className="text-white/60 text-xs mb-1">Memory</p>
                  <p className="text-white text-xl font-bold">1.2GB</p>
                </div>
              </div>

              <div className="bg-dark-bg-light rounded-lg p-4">
                <p className="text-white/60 text-xs mb-2">Bandwidth This Month</p>
                <div className="flex items-end gap-1">
                  {[40, 65, 45, 80, 55, 70, 90].map((height, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-primary rounded-t"
                      style={{ height: `${height}px` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default HostOnceSection;
