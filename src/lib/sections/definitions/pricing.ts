/**
 * Pricing Section Definition
 */

import { DollarSign } from 'lucide-react';
import PricingSection from '@/components/landing/PricingSection';
import PricingSettingsContent from '@/components/admin/sections/PricingSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultPricingProps = {
  title: 'Simple, Transparent Pricing',
  subtitle: 'Choose the plan that works best for you',
  planCount: 3,
  useCarousel: false,
  features: [],
  plans: [
    {
      name: 'Starter',
      description: 'Perfect for small projects',
      originalPrice: 29,
      price: 19,
      discount: '35%',
      period: '/mo',
      buttonText: 'Get Started',
      isHighlighted: false,
      features: [
        { icon: 'Globe', label: '1 Website' },
        { icon: 'HardDrive', label: '10 GB SSD Storage' },
        { icon: 'ArrowLeftRight', label: 'Unlimited Bandwidth' },
        { icon: 'Mail', label: 'Free Email Account' },
        { icon: 'ShieldCheck', label: 'Free SSL Certificate' },
      ],
    },
    {
      name: 'Pro',
      description: 'Best for growing businesses',
      originalPrice: 79,
      price: 49,
      discount: '40%',
      period: '/mo',
      buttonText: 'Get Started',
      isHighlighted: true,
      features: [
        { icon: 'Globe', label: 'Unlimited Websites' },
        { icon: 'HardDrive', label: '100 GB NVMe Storage' },
        { icon: 'ArrowLeftRight', label: 'Unlimited Bandwidth' },
        { icon: 'Mail', label: 'Free Business Email' },
        { icon: 'ShieldCheck', label: 'Free SSL Certificate' },
        { icon: 'CloudUpload', label: 'Daily Backups' },
        { icon: 'Zap', label: 'Priority Support' },
      ],
    },
    {
      name: 'Enterprise',
      description: 'For large scale operations',
      originalPrice: 199,
      price: 149,
      discount: '25%',
      period: '/mo',
      buttonText: 'Contact Sales',
      isHighlighted: false,
      features: [
        { icon: 'Globe', label: 'Unlimited Websites' },
        { icon: 'HardDrive', label: 'Unlimited NVMe Storage' },
        { icon: 'ArrowLeftRight', label: 'Unlimited Bandwidth' },
        { icon: 'Mail', label: 'Premium Business Email' },
        { icon: 'ShieldCheck', label: 'Wildcard SSL' },
        { icon: 'CloudUpload', label: 'Real-time Backups' },
        { icon: 'Headphones', label: 'Dedicated Support' },
        { icon: 'Server', label: 'Dedicated Resources' },
      ],
    },
  ],
};

registerSection({
  type: 'pricing',
  displayName: 'Pricing Plans',
  icon: DollarSign,
  category: 'commerce',
  component: PricingSection,
  settingsComponent: createSettingsWrapper(PricingSettingsContent),
  defaultProps: defaultPricingProps,
  description: 'Display pricing plans with features comparison',
  pageGroup: 'General',
  pageGroupOrder: 3,
  translatableProps: [
    'title', 'subtitle',
    'plans.*.name', 'plans.*.description', 'plans.*.buttonText',
    'plans.*.period',  // Only period is translatable (e.g., "/mo" → "/شهريًا")
    'plans.*.features.*.label',
    'features.*.name',
  ],
});
