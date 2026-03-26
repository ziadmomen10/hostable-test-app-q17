/**
 * Hero Section Definition
 */

import { Layout } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import HeroSettingsContent from '@/components/admin/sections/HeroSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultHeroProps = {
  badge: 'Powered by AI',
  title: '20x Faster Web Hosting, Without Spending More',
  highlightedText: '20x Faster',
  subtitle: "Presenting Hostonce's super-fast yet affordable hosting.",
  primaryButtonText: 'See Plans & Pricing',
  primaryButtonUrl: '#pricing',
  priceText: 'From $2.99/month',
  services: [
    { icon: 'Laptop', label: 'AI Website Builder' },
    { icon: 'Globe', label: 'Domains' },
    { icon: 'Monitor', label: 'AI WordPress Builder and Hosting' },
    { icon: 'Mail', label: 'AI Powered Business Email' },
    { icon: 'Server', label: 'VPS Hosting' },
    { icon: 'HardDrive', label: 'Dedicated Hosting' },
    { icon: 'Server', label: 'VDS Hosting' },
  ],
};

registerSection({
  type: 'hero',
  displayName: 'Hero Section',
  icon: Layout,
  category: 'layout',
  component: HeroSection,
  settingsComponent: createSettingsWrapper(HeroSettingsContent),
  defaultProps: defaultHeroProps,
  description: 'A hero section with title, subtitle, and call-to-action buttons',
  pageGroup: 'General',
  pageGroupOrder: 1,
  translatableProps: [
    'badge', 'title', 'highlightedText', 'subtitle',
    'primaryButtonText', 'secondaryButtonText', 'priceText',
    'services.*.label',
  ],
});
