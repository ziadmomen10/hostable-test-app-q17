/**
 * Pricing Section
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Cpu,
  MemoryStick,
  HardDrive,
  ArrowLeftRight,
  Network,
  ShieldCheck,
  Lock,
  CloudUpload,
  Wrench,
  Zap,
  Users,
  ArrowRightLeft,
  Headphones,
  BadgeCheck,
  Mail,
  Server,
  Database,
  Wifi,
  Clock,
  RefreshCw,
  Shield,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { SortableItem } from '@/components/editor/SortableItem';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import { PriceDisplay, PriceStrikethrough } from '@/components/PriceDisplay';
import { parseLocalizedNumber } from '@/lib/utils/parseLocalizedNumber';
import type { ElementPosition } from '@/types/reactEditor';
import type { SectionStyleProps } from '@/types/elementSettings';

// Professional icon mapping
const iconMap: Record<string, LucideIcon> = {
  Globe,
  Cpu,
  MemoryStick,
  HardDrive,
  ArrowLeftRight,
  Network,
  ShieldCheck,
  Lock,
  CloudUpload,
  Wrench,
  Zap,
  Users,
  ArrowRightLeft,
  Headphones,
  BadgeCheck,
  Mail,
  Server,
  Database,
  Wifi,
  Clock,
  RefreshCw,
  Shield,
  Check,
};

interface PlanFeature {
  icon: string;
  label: string;
}

interface Plan {
  name: string;
  description: string;
  originalPrice: string;
  price: string;
  discount: string;
  period: string;
  buttonText: string;
  features: PlanFeature[];
  isHighlighted?: boolean;
  position?: ElementPosition;
}

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
  plans: Plan[];
  useCarousel?: boolean;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Pricing Card Component
const PricingCard: React.FC<{ plan: Plan; planIndex: number; sectionId?: string }> = ({ plan, planIndex, sectionId }) => {
  const IconCheck = Check;
  
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`relative overflow-visible bg-card rounded-2xl border-2 p-6 transition-shadow hover:shadow-xl h-full ${
        plan.isHighlighted
          ? 'border-primary shadow-lg shadow-primary/20'
          : 'border-border'
      }`}
    >
      {/* Most Popular Badge */}
      {plan.isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-4">
        <EditableElement
          as="h3"
          sectionId={sectionId}
          path={`plans.${planIndex}.name`}
          className="text-xl font-bold text-card-foreground mb-1"
          isEmpty={!plan.name}
          placeholder="Plan Name"
        >
          <RichTextRenderer content={plan.name} />
        </EditableElement>
        <EditableElement
          as="p"
          sectionId={sectionId}
          path={`plans.${planIndex}.description`}
          className="text-sm text-muted-foreground"
          isEmpty={!plan.description}
          placeholder="Plan description"
        >
          <RichTextRenderer content={plan.description} />
        </EditableElement>
      </div>

      {/* Pricing */}
      <div className="mb-4">
        {plan.originalPrice && (
          <EditableInline
            sectionId={sectionId}
            path={`plans.${planIndex}.originalPrice`}
            className="text-muted-foreground text-sm mr-2"
          >
            <PriceStrikethrough 
              amount={parseLocalizedNumber(plan.originalPrice)} 
              decimals={0}
              className="text-muted-foreground text-sm"
            />
          </EditableInline>
        )}
        {plan.discount && (
          <EditableInline
            sectionId={sectionId}
            path={`plans.${planIndex}.discount`}
            className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2"
          >
            <RichTextRenderer content={`Save ${plan.discount}%`} />
          </EditableInline>
        )}
        <div className="flex items-baseline gap-1">
          <EditableInline
            sectionId={sectionId}
            path={`plans.${planIndex}.price`}
            className="text-3xl font-bold text-card-foreground"
          >
            <PriceDisplay 
              amount={parseLocalizedNumber(plan.price)} 
              decimals={0}
              className="text-3xl font-bold text-card-foreground"
            />
          </EditableInline>
          <EditableInline
            sectionId={sectionId}
            path={`plans.${planIndex}.period`}
            className="text-muted-foreground"
          >
            <RichTextRenderer content={plan.period} />
          </EditableInline>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        className={`w-full mb-6 ${
          plan.isHighlighted
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
        size="lg"
      >
        <EditableInline
          sectionId={sectionId}
          path={`plans.${planIndex}.buttonText`}
        >
          <RichTextRenderer content={plan.buttonText} />
        </EditableInline>
      </Button>

      {/* Divider */}
      <div className="border-t border-border mb-4" />

      {/* Features List */}
      {plan.features && plan.features.length > 0 && (
        <ul className="space-y-3">
          {plan.features.map((feature, featureIndex) => {
            const IconComponent = iconMap[feature.icon] || IconCheck;
            return (
              <li
                key={featureIndex}
                className="flex items-center gap-3 text-sm text-card-foreground"
              >
                <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <EditableInline
                  sectionId={sectionId}
                  path={`plans.${planIndex}.features.${featureIndex}.label`}
                  isEmpty={!feature.label}
                  placeholder="Feature"
                >
                  <RichTextRenderer content={feature.label} />
                </EditableInline>
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
};

export const PricingSection: React.FC<PricingSectionProps> = ({
  title = "Web Hosting Plans That Scale With You",
  subtitle = "Reliable, fast, and secure hosting solutions for every need",
  plans = [],
  useCarousel = false,
  sectionId,
  isEditing = false,
  styleOverrides,
  layoutProps,
}) => {
  const shouldUseCarousel = useCarousel || plans.length > 4;
  
  // Use layout props for grid configuration with smart fallbacks
  const gridColsClass = getGridColsClass(layoutProps?.columns ?? Math.min(plans.length, 4));
  const gapClass = getGapClass(layoutProps?.gap);
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('plans', plans);

  return (
    <SectionContainer variant="light" padding="lg" className="overflow-visible" styleOverrides={styleOverrides}>
      <SectionHeader
        sectionId={sectionId}
        title={title}
        subtitle={subtitle}
        alignment="center"
        size="md"
      />

      {/* Pricing Cards - Grid or Carousel */}
      {shouldUseCarousel ? (
        <div className="pt-6 relative px-14">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {plans.map((plan, index) => (
                <CarouselItem key={index} className="pl-4 pt-6 md:basis-1/2 lg:basis-1/3">
                  <PricingCard plan={plan} planIndex={index} sectionId={sectionId} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10 bg-background border-border hover:bg-muted shadow-md" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 bg-background border-border hover:bg-muted shadow-md" />
          </Carousel>
          {/* Mobile swipe indicator */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            <span className="text-sm text-muted-foreground">← Swipe to see more →</span>
          </div>
        </div>
      ) : (
        <SortableWrapper>
          <div className={`grid ${gridColsClass} ${gapClass} pt-6 relative`}>
            {plans.map((plan, index) => (
              <SortableItem
                key={`${sectionId}-plans-${index}`}
                {...getItemProps(index)}
              >
                <motion.div
                  variants={item}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <PricingCard plan={plan} planIndex={index} sectionId={sectionId} />
                </motion.div>
              </SortableItem>
            ))}
          </div>
        </SortableWrapper>
      )}
    </SectionContainer>
  );
};

export default PricingSection;
