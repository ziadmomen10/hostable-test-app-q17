/**
 * Server Specs Section Component
 * Displays server specifications in a table layout
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { ServerSpecsSectionData, ServerSpec } from '@/types/newSectionTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { SectionStyleProps } from '@/types/elementSettings';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import { gapClasses } from '@/types/sectionSettings';

interface ServerSpecsSectionProps {
  data?: ServerSpecsSectionData;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultSpecs: ServerSpec[] = [
  { name: 'VPS Starter', cpu: '2 vCPU', ram: '4GB', storage: '50GB NVMe', bandwidth: '2TB', price: '$19/mo', isPopular: false },
  { name: 'VPS Pro', cpu: '4 vCPU', ram: '8GB', storage: '100GB NVMe', bandwidth: '4TB', price: '$39/mo', isPopular: true },
  { name: 'VPS Business', cpu: '8 vCPU', ram: '16GB', storage: '200GB NVMe', bandwidth: '8TB', price: '$79/mo', isPopular: false },
  { name: 'VPS Enterprise', cpu: '16 vCPU', ram: '32GB', storage: '400GB NVMe', bandwidth: 'Unlimited', price: '$159/mo', isPopular: false },
];

const defaultData: ServerSpecsSectionData = {
  badge: 'VPS HOSTING',
  title: 'Server Specifications',
  subtitle: 'Choose the configuration that fits your needs',
  specs: defaultSpecs,
};

const ServerSpecsSection: React.FC<ServerSpecsSectionProps> = ({ 
  data = defaultData, 
  sectionId, 
  isEditing = false,
  styleOverrides,
  layoutProps,
}) => {
  const specs = data.specs || [];
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('specs', specs);

  return (
    <SectionContainer variant="light" padding="lg" styleOverrides={styleOverrides}>
      <SectionHeader
        sectionId={sectionId}
        badge={data.badge}
        title={data.title || ''}
        subtitle={data.subtitle}
        subtitleClassName="max-w-2xl"
      />

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              {isEditing && <th className="w-8"></th>}
              <th className="text-left py-4 px-4 text-muted-foreground font-medium text-sm">
                Server Name
              </th>
              <th className="text-center py-4 px-4 text-muted-foreground font-medium text-sm">
                CPU
              </th>
              <th className="text-center py-4 px-4 text-muted-foreground font-medium text-sm">
                RAM
              </th>
              <th className="text-center py-4 px-4 text-muted-foreground font-medium text-sm">
                Storage
              </th>
              <th className="text-center py-4 px-4 text-muted-foreground font-medium text-sm">
                Bandwidth
              </th>
              <th className="text-center py-4 px-4 text-muted-foreground font-medium text-sm">
                Price
              </th>
              <th className="text-center py-4 px-4"></th>
            </tr>
          </thead>
          <SortableWrapper>
            <tbody>
              {specs.map((spec, index) => (
                <tr
                  key={`${sectionId}-specs-${index}`}
                  className={`border-b border-border ${
                    spec.isPopular ? 'bg-primary/5' : index % 2 === 0 ? 'bg-muted/30' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <EditableInline
                        path={`specs.${index}.name`}
                        sectionId={sectionId}
                        className="font-semibold text-foreground"
                      >
                        <RichTextRenderer content={spec.name} />
                      </EditableInline>
                      {spec.isPopular && (
                        <Badge variant="default" className="text-xs">Popular</Badge>
                      )}
                    </div>
                  </td>
                  <EditableElement
                    as="td"
                    path={`specs.${index}.cpu`}
                    sectionId={sectionId}
                    className="text-center py-4 px-4 text-muted-foreground text-sm"
                  >
                    <RichTextRenderer content={spec.cpu} />
                  </EditableElement>
                  <EditableElement
                    as="td"
                    path={`specs.${index}.ram`}
                    sectionId={sectionId}
                    className="text-center py-4 px-4 text-muted-foreground text-sm"
                  >
                    <RichTextRenderer content={spec.ram} />
                  </EditableElement>
                  <EditableElement
                    as="td"
                    path={`specs.${index}.storage`}
                    sectionId={sectionId}
                    className="text-center py-4 px-4 text-muted-foreground text-sm"
                  >
                    <RichTextRenderer content={spec.storage} />
                  </EditableElement>
                  <EditableElement
                    as="td"
                    path={`specs.${index}.bandwidth`}
                    sectionId={sectionId}
                    className="text-center py-4 px-4 text-muted-foreground text-sm"
                  >
                    <RichTextRenderer content={spec.bandwidth} />
                  </EditableElement>
                  <td className="text-center py-4 px-4">
                    <EditableInline
                      path={`specs.${index}.price`}
                      sectionId={sectionId}
                      className="font-bold text-foreground"
                    >
                      <RichTextRenderer content={spec.price} />
                    </EditableInline>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Button size="sm" variant={spec.isPopular ? 'default' : 'outline'}>
                      Configure
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </SortableWrapper>
        </table>
      </div>

      {/* Mobile Card View */}
      <SortableWrapper>
        <div className={`md:hidden grid ${gapClasses[layoutProps?.gap || 'default']}`}>
          {specs.map((spec, index) => (
            <SortableItem
              key={`${sectionId}-specs-mobile-${index}`}
              {...getItemProps(index)}
            >
              <div className={`p-4 rounded-xl border ${spec.isPopular ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <EditableInline
                      path={`specs.${index}.name`}
                      sectionId={sectionId}
                      className="font-semibold text-foreground"
                    >
                      <RichTextRenderer content={spec.name} />
                    </EditableInline>
                    {spec.isPopular && (
                      <Badge variant="default" className="text-xs">Popular</Badge>
                    )}
                  </div>
                  <EditableInline
                    path={`specs.${index}.price`}
                    sectionId={sectionId}
                    className="font-bold text-primary"
                  >
                    <RichTextRenderer content={spec.price} />
                  </EditableInline>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div><span className="text-muted-foreground">CPU:</span> {spec.cpu}</div>
                  <div><span className="text-muted-foreground">RAM:</span> {spec.ram}</div>
                  <div><span className="text-muted-foreground">Storage:</span> {spec.storage}</div>
                  <div><span className="text-muted-foreground">Bandwidth:</span> {spec.bandwidth}</div>
                </div>
                <Button size="sm" variant={spec.isPopular ? 'default' : 'outline'} className="w-full">
                  Configure
                </Button>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
};

export default ServerSpecsSection;
