/**
 * Contact Section Component
 * Displays contact channels (chat, phone, email, ticket) in a grid
 */

import React from 'react';
import { ContactSectionData, ContactChannel } from '@/types/newSectionTypes';
import { MessageCircle, Phone, Mail, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

interface ContactSectionProps {
  data?: ContactSectionData;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const iconMap: Record<string, React.ElementType> = {
  'MessageCircle': MessageCircle,
  'Phone': Phone,
  'Mail': Mail,
  'Ticket': Ticket,
};

const defaultChannels: ContactChannel[] = [
  {
    icon: 'MessageCircle',
    type: 'chat',
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    value: 'Available 24/7',
    buttonText: 'Start Chat',
  },
  {
    icon: 'Phone',
    type: 'phone',
    title: 'Phone Support',
    description: 'Speak directly with our experts',
    value: '+1 (800) 123-4567',
    buttonText: 'Call Now',
  },
  {
    icon: 'Mail',
    type: 'email',
    title: 'Email Us',
    description: 'Get a response within 2 hours',
    value: 'support@hostonce.com',
    buttonText: 'Send Email',
  },
  {
    icon: 'Ticket',
    type: 'ticket',
    title: 'Submit Ticket',
    description: 'Create a support ticket for complex issues',
    value: 'Track your requests',
    buttonText: 'Create Ticket',
  },
];

const defaultData: ContactSectionData = {
  badge: 'CONTACT US',
  title: 'Get In Touch',
  subtitle: "We're here to help. Choose your preferred contact method.",
  channels: defaultChannels,
};

const ContactSection: React.FC<ContactSectionProps> = ({ data = defaultData, sectionId, isEditing = false, styleOverrides, layoutProps }) => {
  const channels = data.channels || [];
  const { SortableWrapper, getItemProps } = useArrayItems('channels', channels);
  
  // Use layoutProps for grid configuration
  const columns = layoutProps?.columns ?? 4;
  const gridColsClass = getGridColsClass(columns, 'md');
  const gapClass = getGapClass(layoutProps?.gap);
  
  return (
    <SectionContainer variant="light" padding="lg" styleOverrides={styleOverrides}>
      <SectionHeader
        sectionId={sectionId}
        badge={data.badge}
        title={data.title || ''}
        subtitle={data.subtitle}
        badgeClassName="text-sm font-semibold uppercase tracking-wider text-primary bg-transparent px-0 py-0"
        subtitleClassName="max-w-2xl"
      />

      <SortableWrapper>
        <div className={`grid ${gridColsClass} ${gapClass}`}>
          {channels.map((channel, index) => {
            const IconComponent = iconMap[channel.icon] || MessageCircle;
            
            return (
              <SortableItem
                key={`${sectionId}-channels-${index}`}
                {...getItemProps(index)}
                className="h-full"
              >
                <div className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-shadow h-full">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <EditableElement
                    as="h3"
                    sectionId={sectionId}
                    path={`channels.${index}.title`}
                    className="font-bold text-lg text-card-foreground mb-2"
                    isEmpty={!channel.title}
                    placeholder="Channel title"
                  >
                    <RichTextRenderer content={channel.title || ''} />
                  </EditableElement>
                  <EditableElement
                    as="p"
                    sectionId={sectionId}
                    path={`channels.${index}.description`}
                    className="text-muted-foreground text-sm mb-4"
                    isEmpty={!channel.description}
                    placeholder="Channel description"
                  >
                    <RichTextRenderer content={channel.description || ''} />
                  </EditableElement>
                  <EditableElement
                    as="p"
                    sectionId={sectionId}
                    path={`channels.${index}.value`}
                    className="text-sm font-medium text-foreground mb-4"
                    isEmpty={!channel.value}
                    placeholder="Contact value"
                  >
                    <RichTextRenderer content={channel.value || ''} />
                  </EditableElement>
                  <Button className="w-full" variant="outline">
                    <EditableInline
                      sectionId={sectionId}
                      path={`channels.${index}.buttonText`}
                    >
                      <RichTextRenderer content={channel.buttonText} />
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

export default ContactSection;
