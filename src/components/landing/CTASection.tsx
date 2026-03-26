/**
 * CTA Section
 * Call-to-action with benefits and buttons
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer } from '@/components/landing/shared';
import type { CTASectionProps, CTABenefit } from '@/types/sectionProps';
import type { SectionStyleProps } from '@/types/elementSettings';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import { gapClasses } from '@/types/sectionSettings';

const defaultBenefits: CTABenefit[] = [
  { text: 'Free Domain Name' },
  { text: 'Free SSL Certificate' },
  { text: '30-Day Money Back' },
];

const CTASection = ({
  badge = '🎉 Limited Time Offer',
  title = 'Elevate Your Business with HostOnce',
  subtitle = 'Join thousands of satisfied customers and experience the difference of truly reliable hosting. Get started today with our special offer.',
  benefits = defaultBenefits,
  primaryButtonText = 'Get Started Now',
  primaryButtonUrl = '#pricing',
  secondaryButtonText = 'Contact Sales',
  secondaryButtonUrl = '#contact',
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}: CTASectionProps & { 
  sectionId?: string; 
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}) => {
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('benefits', benefits);

  return (
    <SectionContainer 
      variant="dark" 
      padding="md" 
      data-section={sectionId}
      data-section-type="cta"
      styleOverrides={styleOverrides}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center gap-2 bg-dark-card border border-primary/30 rounded-full px-4 py-2 mb-8">
            <EditableInline
              sectionId={sectionId}
              path="badge"
              className="text-primary text-sm font-medium"
            >
              <RichTextRenderer content={badge} />
            </EditableInline>
          </div>
        )}

        <EditableElement
          as="h2"
          sectionId={sectionId}
          path="title"
          className="text-3xl lg:text-5xl font-bold mb-6"
        >
          <RichTextRenderer content={title} />
        </EditableElement>

        {subtitle && (
          <EditableElement
            as="p"
            sectionId={sectionId}
            path="subtitle"
            className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto"
          >
            <RichTextRenderer content={subtitle} />
          </EditableElement>
        )}

        {/* Benefits - SortableWrapper handles DnD context automatically */}
        {benefits && benefits.length > 0 && (
          <SortableWrapper>
            <div className={`flex flex-wrap justify-center mb-10 ${gapClasses[layoutProps?.gap || 'default']}`}>
              {benefits.map((benefit, index) => (
                <SortableItem
                  key={`${sectionId}-benefits-${index}`}
                  {...getItemProps(index)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <EditableInline
                      sectionId={sectionId}
                      path={`benefits.${index}.text`}
                      className="text-gray-300"
                    >
                      <RichTextRenderer content={benefit.text} />
                    </EditableInline>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableWrapper>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-6 text-lg"
            asChild
          >
            <a href={primaryButtonUrl}>
              <EditableInline
                sectionId={sectionId}
                path="primaryButtonText"
              >
                <RichTextRenderer content={primaryButtonText} />
              </EditableInline>
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
          {secondaryButtonText && (
            <Button 
              variant="outline" 
              size="lg" 
              className="border-dark-border-light text-white hover:bg-dark-card px-10 py-6 text-lg"
              asChild
            >
              <a href={secondaryButtonUrl}>
                <EditableInline
                  sectionId={sectionId}
                  path="secondaryButtonText"
                >
                  <RichTextRenderer content={secondaryButtonText} />
                </EditableInline>
              </a>
            </Button>
          )}
        </div>

        {/* Trust Badge */}
        <EditableElement
          as="p"
          sectionId={sectionId}
          path="trustBadgeText"
          className="text-gray-500 text-sm mt-8"
        >
          No credit card required • Cancel anytime • 30-day money-back guarantee
        </EditableElement>
      </div>
    </SectionContainer>
  );
};

export default CTASection;
