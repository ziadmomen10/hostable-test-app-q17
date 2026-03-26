/**
 * Bento Grid Section Definition
 */

import { LayoutGrid } from 'lucide-react';
import BentoGridSection from '@/components/landing/BentoGridSection';
import BentoGridSettingsContent from '@/components/admin/sections/BentoGridSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultBentoGridProps = {
  badge: 'FEATURES',
  title: 'Feature Highlights',
  subtitle: 'Discover our capabilities and what makes us different.',
  items: [
    { title: 'Lightning Performance', description: 'NVMe SSDs and LiteSpeed servers deliver 20x faster load times.', size: 'large' as const, icon: 'Zap' },
    { title: 'Enterprise Security', description: 'Free SSL, DDoS protection, and daily backups included.', size: 'medium' as const, icon: 'Shield' },
    { title: 'Global CDN', description: 'Content delivery from 200+ locations.', size: 'small' as const, icon: 'Globe' },
    { title: '24/7 Support', description: 'Expert help anytime you need it.', size: 'small' as const, icon: 'Headphones' },
    { title: 'Easy Management', description: 'Intuitive control panel with one-click installs for 400+ apps.', size: 'medium' as const, icon: 'Settings' },
  ],
};

registerSection({
  type: 'bento-grid',
  displayName: 'Bento Grid',
  icon: LayoutGrid,
  category: 'layout',
  component: BentoGridSection,
  settingsComponent: createSettingsWrapper(BentoGridSettingsContent),
  defaultProps: defaultBentoGridProps,
  description: 'Modern bento-style grid layout',
  pageGroup: 'General',
  pageGroupOrder: 13,
  translatableProps: ['badge', 'title', 'subtitle', 'items.*.title', 'items.*.description'],
  usesDataWrapper: true,
});
