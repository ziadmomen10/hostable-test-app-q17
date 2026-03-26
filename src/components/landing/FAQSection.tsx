/**
 * FAQ Section
 * Frequently asked questions with accordion
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { ElementPosition } from '@/types/reactEditor';
import type { FAQSectionProps, FAQItem } from '@/types/sectionProps';
import type { SectionStyleProps } from '@/types/elementSettings';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import { gapClasses } from '@/types/sectionSettings';

interface FAQItemWithPosition extends FAQItem {
  position?: ElementPosition;
}

const defaultFaqs: FAQItemWithPosition[] = [
  {
    question: 'What is web hosting?',
    answer: 'Web hosting is a service that allows you to publish your website on the internet. When you purchase hosting, you rent space on a server where your website files are stored and made accessible to visitors.',
  },
  {
    question: 'Do you offer a money-back guarantee?',
    answer: "Yes! We offer a 30-day money-back guarantee on all hosting plans. If you're not satisfied with our service, you can request a full refund within the first 30 days.",
  },
  {
    question: 'Can I upgrade my plan later?',
    answer: 'Absolutely! You can upgrade your hosting plan at any time through your control panel. The upgrade is instant and your website will experience zero downtime.',
  },
  {
    question: 'Is SSL included with hosting?',
    answer: "Yes, all our hosting plans include free SSL certificates. We use Let's Encrypt to automatically install and renew SSL certificates for all your domains.",
  },
  {
    question: 'How do I migrate my existing website?',
    answer: 'We offer free website migration for all new customers. Our expert team will handle the entire migration process, ensuring zero downtime and complete data integrity.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We provide 24/7 support via live chat, phone, and email. Our support team consists of technical experts who can help with any hosting-related issues.',
  },
];

const FAQSection = ({
  badge,
  title = 'Frequently Asked Questions',
  subtitle = "Got questions? We've got answers. If you can't find what you're looking for, reach out to our support team.",
  faqs = defaultFaqs,
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}: FAQSectionProps & { 
  sectionId?: string; 
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}) => {
  const faqItems = faqs as FAQItemWithPosition[];
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('faqs', faqItems);
  
  return (
    <SectionContainer variant="light" padding="lg" styleOverrides={styleOverrides}>
      <SectionHeader
        sectionId={sectionId}
        badge={badge}
        title={title}
        subtitle={subtitle}
        subtitleClassName="max-w-2xl"
      />

      {/* FAQ Accordion - SortableWrapper handles DnD context automatically */}
      <div className="max-w-3xl mx-auto relative">
        <SortableWrapper>
          <Accordion type="single" collapsible className={gapClasses[layoutProps?.gap || 'default']}>
            {faqItems.map((faq, index) => (
              <SortableItem
                key={`${sectionId}-faqs-${index}`}
                {...getItemProps(index)}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6"
                >
                  <AccordionTrigger className="text-foreground font-semibold hover:no-underline py-6">
                    <EditableInline
                      sectionId={sectionId}
                      path={`faqs.${index}.question`}
                    >
                      <RichTextRenderer content={faq.question} />
                    </EditableInline>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    <EditableElement
                      sectionId={sectionId}
                      path={`faqs.${index}.answer`}
                    >
                      <RichTextRenderer content={faq.answer} />
                    </EditableElement>
                  </AccordionContent>
                </AccordionItem>
              </SortableItem>
            ))}
          </Accordion>
        </SortableWrapper>
      </div>
    </SectionContainer>
  );
};

export default FAQSection;
