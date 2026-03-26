import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Shield, HeadphonesIcon } from 'lucide-react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement } from '@/components/editor/EditableElement';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer } from '@/components/landing/shared';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import type { SectionStyleProps } from '@/types/elementSettings';
import { gapClasses } from '@/types/sectionSettings';

interface MigrationSectionProps {
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const MigrationSection = ({ sectionId, styleOverrides, layoutProps }: MigrationSectionProps) => {
  const gapClass = gapClasses[layoutProps?.gap || 'default'];
  const benefits = [
    { icon: Clock, text: 'Zero Downtime Migration' },
    { icon: Shield, text: 'Full Data Security' },
    { icon: HeadphonesIcon, text: 'Expert Support Team' },
  ];

  const steps = [
    { text: 'Submit migration request' },
    { text: 'We backup your data' },
    { text: 'Transfer to our servers' },
    { text: 'Test & verify everything' },
    { text: 'Go live with zero downtime' }
  ];

  const stepsDnd = useArrayItems('steps', steps);
  const benefitsDnd = useArrayItems('benefits', benefits);

  return (
    <SectionContainer variant="muted" padding="lg" className="bg-muted/50" styleOverrides={styleOverrides}>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content - Steps */}
        <div className="relative">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <EditableElement
              as="h3"
              sectionId={sectionId}
              path="processTitle"
              className="text-xl font-bold text-foreground mb-6"
            >
              <RichTextRenderer content="Migration Process" />
            </EditableElement>
            <stepsDnd.SortableWrapper>
              <div className={`space-y-4 ${gapClass}`}>
                {steps.map((step, index) => (
                  <SortableItem
                    key={`step-${index}`}
                    {...stepsDnd.getItemProps(index)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-bold text-sm">{index + 1}</span>
                      </div>
                      <EditableElement
                        as="p"
                        sectionId={sectionId}
                        path={`steps.${index}.text`}
                        className="text-foreground"
                      >
                        <RichTextRenderer content={step.text} />
                      </EditableElement>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </stepsDnd.SortableWrapper>
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
              <RichTextRenderer content="Free Migration" />
            </EditableElement>
            <EditableElement
              as="h2"
              sectionId={sectionId}
              path="title"
              className="text-3xl lg:text-4xl font-bold text-foreground leading-tight"
            >
              <RichTextRenderer content="Migrate to HostOnce with Expert Support" />
            </EditableElement>
          </div>

          <EditableElement
            as="p"
            sectionId={sectionId}
            path="subtitle"
            className="text-muted-foreground"
          >
            <RichTextRenderer content="Moving your website has never been easier. Our expert team handles everything from backup to go-live, ensuring zero downtime during the transition." />
          </EditableElement>

          {/* Benefits */}
          <benefitsDnd.SortableWrapper>
            <div className={`flex flex-wrap ${gapClass}`}>
              {benefits.map((benefit, index) => (
                <SortableItem
                  key={`benefit-${index}`}
                  {...benefitsDnd.getItemProps(index)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <EditableElement
                      as="span"
                      sectionId={sectionId}
                      path={`benefits.${index}.text`}
                      className="text-foreground font-medium"
                    >
                      <RichTextRenderer content={benefit.text} />
                    </EditableElement>
                  </div>
                </SortableItem>
              ))}
            </div>
          </benefitsDnd.SortableWrapper>

          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <EditableElement
              as="span"
              sectionId={sectionId}
              path="buttonText"
            >
              Start Free Migration
            </EditableElement>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
};

export default MigrationSection;
