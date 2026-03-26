/**
 * Need Help Section
 * Support options with icons
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { NeedHelpSectionProps, SupportOption } from '@/types/sectionProps';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

// Use centralized icon map, with MessageSquare fallback for MessageCircle
const iconMap = { ...ICON_MAP, MessageCircle: MessageSquare };

const defaultOptions: SupportOption[] = [
  {
    icon: 'MessageSquare',
    title: 'Live Chat',
    description: 'Chat with our support team in real-time for instant help.',
    actionText: 'Start Chat',
    availability: '24/7',
  },
  {
    icon: 'Phone',
    title: 'Phone Support',
    description: 'Speak directly with our technical experts.',
    actionText: 'Call Now',
    availability: '24/7',
  },
  {
    icon: 'Mail',
    title: 'Email Support',
    description: "Send us an email and we'll respond within 2 hours.",
    actionText: 'Send Email',
    availability: '< 2hr response',
  },
  {
    icon: 'FileText',
    title: 'Knowledge Base',
    description: 'Browse our extensive library of guides and tutorials.',
    actionText: 'Browse Articles',
    availability: '500+ articles',
  },
];

const NeedHelpSection = ({
  badge,
  title = 'Need Help?',
  subtitle = 'Our award-winning support team is here to help you 24/7. Choose your preferred contact method.',
  options = defaultOptions,
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}: NeedHelpSectionProps & { 
  sectionId?: string; 
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}) => {
  // Use layoutProps for grid configuration
  const columns = layoutProps?.columns ?? 4;
  const gridColsClass = getGridColsClass(columns, 'md');
  const gapClass = getGapClass(layoutProps?.gap);
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('options', options);

  return (
    <SectionContainer variant="muted" padding="lg" className="bg-muted/50" styleOverrides={styleOverrides}>
      <SectionHeader
        sectionId={sectionId}
        badge={badge}
        title={title}
        subtitle={subtitle}
        alignment="center"
        size="md"
      />

      {/* Support Options Grid - SortableWrapper handles DnD context automatically */}
      <SortableWrapper>
        <div className={`grid ${gridColsClass} ${gapClass}`}>
          {options.map((option, index) => {
            const IconComponent = iconMap[option.icon] || MessageSquare;
            
            return (
              <SortableItem
                key={`${sectionId}-options-${index}`}
                {...getItemProps(index)}
                className="h-full"
              >
                <div className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/50 hover:shadow-lg transition-all h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <EditableElement
                    path={`options.${index}.title`}
                    sectionId={sectionId}
                    as="h3"
                    className="text-lg font-semibold text-foreground mb-2"
                  >
                    <RichTextRenderer content={option.title} />
                  </EditableElement>
                  <EditableElement
                    path={`options.${index}.description`}
                    sectionId={sectionId}
                    as="p"
                    className="text-muted-foreground text-sm mb-4"
                  >
                    <RichTextRenderer content={option.description} />
                  </EditableElement>
                  {option.availability && (
                    <EditableElement
                      path={`options.${index}.availability`}
                      sectionId={sectionId}
                      as="p"
                      className="text-xs text-primary font-medium mb-4"
                    >
                      {option.availability}
                    </EditableElement>
                  )}
                  <Button variant="outline" className="w-full">
                    <EditableInline
                      path={`options.${index}.actionText`}
                      sectionId={sectionId}
                    >
                      <RichTextRenderer content={option.actionText} />
                    </EditableInline>
                  </Button>
                </div>
              </SortableItem>
            );
          })}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
};

export default NeedHelpSection;
