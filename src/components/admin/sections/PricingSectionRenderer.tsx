import React from 'react';
import { motion } from 'framer-motion';
import {
  Globe, Cpu, MemoryStick, HardDrive, ArrowLeftRight, Network,
  ShieldCheck, Lock, CloudUpload, Wrench, Zap, Users, ArrowRightLeft,
  Headphones, BadgeCheck, Mail, Server, Database, Wifi, Clock,
  RefreshCw, Shield, Check, type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PricingSectionData, PlanData } from '@/types/pageEditor';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Globe, Cpu, MemoryStick, HardDrive, ArrowLeftRight, Network,
  ShieldCheck, Lock, CloudUpload, Wrench, Zap, Users, ArrowRightLeft,
  Headphones, BadgeCheck, Mail, Server, Database, Wifi, Clock,
  RefreshCw, Shield, Check,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface PricingCardProps {
  plan: PlanData;
  index: number;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, index }) => {
  const IconCheck = Check;

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`relative overflow-visible bg-card rounded-2xl border-2 p-6 transition-shadow hover:shadow-xl h-full ${
        plan.highlighted
          ? 'border-primary shadow-lg shadow-primary/20 ring-2 ring-primary'
          : 'border-border'
      }`}
      data-plan-index={index}
    >
      {/* Most Popular Badge */}
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground whitespace-nowrap">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-card-foreground mb-1">
          {plan.name || `Plan ${index + 1}`}
        </h3>
        <p className="text-sm text-muted-foreground">
          {plan.description}
        </p>
      </div>

      {/* Pricing */}
      <div className="mb-4">
        {plan.originalPrice && (
          <span className="text-muted-foreground line-through text-sm mr-2">
            ${plan.originalPrice}
          </span>
        )}
        {plan.discount && (
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
            Save {plan.discount}%
          </span>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-card-foreground">
            ${plan.price || '0'}
          </span>
          <span className="text-muted-foreground">{plan.period || '/mo'}</span>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        className={`w-full mb-6 ${
          plan.highlighted
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
        size="lg"
      >
        {plan.buttonText || 'Get Started'}
      </Button>

      {/* Divider */}
      <div className="border-t border-border mb-4" />

      {/* Features List */}
      <ul className="space-y-3">
        {plan.features.map((feature, featureIndex) => {
          const IconComponent = iconMap[feature.icon] || IconCheck;
          return (
            <li
              key={featureIndex}
              className="flex items-center gap-3 text-sm text-card-foreground"
            >
              <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>{feature.label}</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};

interface PricingSectionRendererProps {
  data: PricingSectionData;
  className?: string;
}

export const PricingSectionRenderer: React.FC<PricingSectionRendererProps> = ({
  data,
  className = '',
}) => {
  const visiblePlans = data.plans.slice(0, data.planCount);

  return (
    <section 
      className={`py-16 lg:py-24 bg-background overflow-visible ${className}`}
      data-section="pricing"
      data-component="PricingSection"
    >
      <div className="container mx-auto px-6 lg:px-8 overflow-visible">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {data.title || 'Web Hosting Plans That Scale With You'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {data.subtitle || 'Reliable, fast, and secure hosting solutions for every need'}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className={`grid gap-6 pt-6 ${
            visiblePlans.length === 1 ? 'max-w-sm mx-auto' :
            visiblePlans.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' :
            visiblePlans.length === 3 ? 'md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto' :
            'md:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {visiblePlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSectionRenderer;
