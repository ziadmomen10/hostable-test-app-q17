/**
 * Hosting Services Section
 * Service offerings with icons and pricing
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { Globe, Server, Cloud, ShieldCheck, Zap, Database } from 'lucide-react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { HostingServicesSectionProps, HostingService } from '@/types/sectionProps';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Server,
  Cloud,
  ShieldCheck,
  Zap,
  Database,
};

const defaultServices: HostingService[] = [
  {
    icon: 'Globe',
    title: 'Domain Names',
    description: 'Register your perfect domain name with competitive pricing and free WHOIS protection.',
    price: 'From $9.99/yr',
  },
  {
    icon: 'Server',
    title: 'Web Hosting',
    description: 'Lightning-fast hosting with NVMe storage, free SSL, and one-click installs.',
    price: 'From $2.99/mo',
  },
  {
    icon: 'Cloud',
    title: 'Cloud Hosting',
    description: 'Scalable cloud infrastructure with automatic failover and load balancing.',
    price: 'From $4.99/mo',
  },
  {
    icon: 'ShieldCheck',
    title: 'SSL Certificates',
    description: 'Secure your website with industry-standard encryption and trust badges.',
    price: 'Free with hosting',
  },
  {
    icon: 'Zap',
    title: 'VPS Hosting',
    description: 'Full root access with dedicated resources and instant provisioning.',
    price: 'From $12.99/mo',
  },
  {
    icon: 'Database',
    title: 'Dedicated Servers',
    description: 'Enterprise-grade hardware with 24/7 monitoring and management.',
    price: 'From $89.99/mo',
  },
];

const HostingServicesSection = ({
  badge,
  title = 'Hosting Services to Elevate Your Business',
  subtitle = 'Everything you need to launch, grow, and scale your online presence with confidence.',
  services = defaultServices,
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}: HostingServicesSectionProps & {
  sectionId?: string; 
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}) => {
  // Use layoutProps for grid configuration
  const columns = layoutProps?.columns ?? 3;
  const gridColsClass = getGridColsClass(columns, 'md');
  const gapClass = getGapClass(layoutProps?.gap);
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('services', services);
  
  return (
    <SectionContainer variant="light" padding="lg" styleOverrides={styleOverrides}>
      <SectionHeader
        sectionId={sectionId}
        badge={badge}
        title={title}
        subtitle={subtitle}
        alignment="center"
        size="md"
      />

      {/* Services Grid - SortableWrapper handles DnD context automatically */}
      <SortableWrapper>
        <div className={`grid ${gridColsClass} ${gapClass}`}>
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Globe;
            
            return (
              <SortableItem
                key={`${sectionId}-services-${index}`}
                {...getItemProps(index)}
              >
                <div className="group p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <EditableElement
                    path={`services.${index}.title`}
                    sectionId={sectionId}
                    as="h3"
                    className="text-xl font-semibold text-foreground mb-2"
                  >
                    <RichTextRenderer content={service.title} />
                  </EditableElement>
                  <EditableElement
                    path={`services.${index}.description`}
                    sectionId={sectionId}
                    as="p"
                    className="text-muted-foreground text-sm mb-4"
                  >
                    <RichTextRenderer content={service.description} />
                  </EditableElement>
                  <EditableElement
                    path={`services.${index}.price`}
                    sectionId={sectionId}
                    as="p"
                    className="text-primary font-semibold"
                  >
                    <RichTextRenderer content={service.price || ''} />
                  </EditableElement>
                </div>
              </SortableItem>
            );
          })}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
};

export default HostingServicesSection;
