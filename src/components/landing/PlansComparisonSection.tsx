/**
 * Plans Comparison Section
 * Full-width comparison table for hosting plans
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { PlansComparisonSectionData } from '@/types/newSectionTypes';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { Button } from '@/components/ui/button';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import { useI18n } from '@/contexts/I18nContext';
import { PriceDisplay } from '@/components/PriceDisplay';
import { parseLocalizedNumber } from '@/lib/utils/parseLocalizedNumber';
import type { SectionStyleProps } from '@/types/elementSettings';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

interface PlansComparisonSectionProps {
  data?: PlansComparisonSectionData;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultData: PlansComparisonSectionData = {
  badge: 'COMPARE PLANS',
  title: 'Find Your Perfect Plan',
  subtitle: 'Compare features across all our hosting plans',
  plans: [
    { name: 'Starter', price: 2.99, period: '/mo', isPopular: false },
    { name: 'Business', price: 5.99, period: '/mo', isPopular: true },
    { name: 'Pro', price: 9.99, period: '/mo', isPopular: false },
    { name: 'Enterprise', price: 19.99, period: '/mo', isPopular: false },
  ],
  features: [
    { feature: 'Websites', values: ['1', '10', 'Unlimited', 'Unlimited'] },
    { feature: 'Storage', values: ['10GB SSD', '50GB SSD', '100GB NVMe', 'Unlimited NVMe'] },
    { feature: 'Bandwidth', values: ['100GB', 'Unlimited', 'Unlimited', 'Unlimited'] },
    { feature: 'Free SSL', values: [true, true, true, true] },
    { feature: 'Free Domain', values: [false, true, true, true] },
    { feature: 'Daily Backups', values: [false, true, true, true] },
    { feature: 'CDN Included', values: [false, false, true, true] },
    { feature: 'Priority Support', values: [false, false, true, true] },
    { feature: 'Dedicated IP', values: [false, false, false, true] },
    { feature: 'Staging Environment', values: [false, false, true, true] },
  ],
};

const PlansComparisonSection: React.FC<PlansComparisonSectionProps> = ({ 
  data = defaultData, 
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}) => {
  const plans = data.plans || [];
  const features = data.features || [];
  const { isRTL } = useI18n();
  
  // Use centralized DnD hooks
  const plansDnd = useArrayItems('plans', plans);
  const featuresDnd = useArrayItems('features', features);

  return (
    <SectionContainer 
      variant="muted"
      padding="lg" 
      data-section="plans-comparison"
      styleOverrides={styleOverrides}
    >
      <SectionHeader
        sectionId={sectionId}
        badge={data.badge}
        title={data.title || ''}
        subtitle={data.subtitle}
        subtitleClassName="max-w-2xl"
      />

      {/* Comparison Table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[640px]">
          {/* Header */}
          <thead>
            <tr>
              <th className={`${isRTL ? 'text-right' : 'text-left'} py-4 px-4 text-muted-foreground font-medium text-sm`}>Features</th>
              <plansDnd.SortableWrapper>
                {plans.map((plan, index) => (
                  <th key={index} className="text-center py-4 px-4 relative">
                    <SortableItem
                      {...plansDnd.getItemProps(index)}
                    >
                      <div 
                        className={`rounded-t-2xl py-4 px-2 ${plan.isPopular ? 'bg-primary shadow-lg' : 'bg-card'}`}
                      >
                        {plan.isPopular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-foreground text-background">
                            Most Popular
                          </span>
                        )}
                        <EditableElement
                          path={`plans.${index}.name`}
                          sectionId={sectionId}
                          className={`font-bold text-lg ${plan.isPopular ? 'text-primary-foreground' : 'text-foreground'}`}
                        >
                          <RichTextRenderer content={plan.name} />
                        </EditableElement>
                        <div className={`text-sm mt-1 ${plan.isPopular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {typeof plan.price === 'number' || !isNaN(parseLocalizedNumber(plan.price)) ? (
                            <>
                              <PriceDisplay amount={parseLocalizedNumber(plan.price)} decimals={2} />
                              <span>{plan.period || '/mo'}</span>
                            </>
                          ) : (
                            <EditableElement
                              path={`plans.${index}.price`}
                              sectionId={sectionId}
                            >
                              <RichTextRenderer content={plan.price} />
                            </EditableElement>
                          )}
                        </div>
                      </div>
                    </SortableItem>
                  </th>
                ))}
              </plansDnd.SortableWrapper>
            </tr>
          </thead>

          {/* Body */}
          <featuresDnd.SortableWrapper>
            <tbody>
              {features.map((row, rowIndex) => (
                <tr
                  key={`${sectionId}-features-${rowIndex}`}
                  className={rowIndex % 2 === 0 ? 'bg-card' : 'bg-muted/30'}
                >
                  <EditableElement
                    as="td"
                    path={`features.${rowIndex}.feature`}
                    sectionId={sectionId}
                    className={`py-4 px-4 text-foreground font-medium text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <RichTextRenderer content={row.feature} />
                  </EditableElement>
                  {row.values.map((value, colIndex) => {
                    const isPopular = plans[colIndex]?.isPopular;
                    return (
                      <td 
                        key={colIndex} 
                        className={`text-center py-4 px-4 ${isPopular ? 'bg-primary/5' : ''}`}
                      >
                        {typeof value === 'boolean' ? (
                          value ? (
                            <span className="inline-flex w-6 h-6 rounded-full items-center justify-center bg-primary text-primary-foreground">
                              ✓
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50">—</span>
                          )
                        ) : (
                          <EditableInline
                            path={`features.${rowIndex}.values.${colIndex}`}
                            sectionId={sectionId}
                            className={`text-sm ${isPopular ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                          >
                            <RichTextRenderer content={value} />
                          </EditableInline>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </featuresDnd.SortableWrapper>

          {/* Footer - CTA buttons */}
          <tfoot>
            <tr>
              <td className="py-6 px-4"></td>
              {plans.map((plan, index) => (
                <td key={index} className="text-center py-6 px-4">
                  <Button
                    variant={plan.isPopular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </SectionContainer>
  );
};

export default PlansComparisonSection;
