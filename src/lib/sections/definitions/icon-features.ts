/**
 * Icon Features Section Definition
 */

import { Grid3X3 } from 'lucide-react';
import IconFeaturesSection from '@/components/landing/IconFeaturesSection';
import IconFeaturesSettingsContent from '@/components/admin/sections/IconFeaturesSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultIconFeaturesProps = {
  badge: 'FEATURES',
  title: 'Everything You Need to Succeed',
  subtitle: 'Powerful features designed to help you build, grow, and scale.',
  columns: 3 as const,
  features: [
    { icon: 'Zap', title: 'Fast Performance', description: 'Lightning-fast servers with NVMe SSD storage and optimized caching.' },
    { icon: 'Shield', title: 'Security First', description: 'Free SSL, DDoS protection, and automatic malware scanning included.' },
    { icon: 'Globe', title: 'Global CDN', description: 'Content delivery from 200+ edge locations for faster load times.' },
    { icon: 'BarChart3', title: 'Analytics', description: 'Real-time traffic and performance insights at your fingertips.' },
    { icon: 'Settings', title: 'Easy Setup', description: 'One-click installs for WordPress, Joomla, and 400+ applications.' },
    { icon: 'Headphones', title: '24/7 Support', description: 'Expert help available around the clock via chat, phone, and email.' },
  ],
};

registerSection({
  type: 'icon-features',
  displayName: 'Icon Features',
  icon: Grid3X3,
  category: 'content',
  component: IconFeaturesSection,
  settingsComponent: createSettingsWrapper(IconFeaturesSettingsContent),
  defaultProps: defaultIconFeaturesProps,
  description: 'Features with icons in a grid',
  pageGroup: 'General',
  pageGroupOrder: 11,
  translatableProps: [
    'badge', 'title', 'subtitle',
    'features.*.title', 'features.*.description',
  ],
  usesDataWrapper: true,
});
