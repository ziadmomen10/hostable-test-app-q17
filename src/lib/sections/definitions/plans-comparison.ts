/**
 * Plans Comparison Section Definition
 */

import { Table } from 'lucide-react';
import PlansComparisonSection from '@/components/landing/PlansComparisonSection';
import PlansComparisonSettingsContent from '@/components/admin/sections/PlansComparisonSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultPlansComparisonProps = {
  badge: 'COMPARE',
  title: 'Compare Plans',
  subtitle: 'Find the perfect plan for your needs',
  plans: [
    { name: 'Starter', price: 9, period: '/mo' },
    { name: 'Pro', price: 29, period: '/mo', isPopular: true },
    { name: 'Business', price: 59, period: '/mo' },
    { name: 'Enterprise', price: 99, period: '/mo' },
  ],
  features: [
    { feature: 'Websites', values: ['1', '10', '50', 'Unlimited'] },
    { feature: 'Storage', values: ['10GB SSD', '100GB NVMe', '250GB NVMe', 'Unlimited NVMe'] },
    { feature: 'Bandwidth', values: ['100GB', 'Unlimited', 'Unlimited', 'Unlimited'] },
    { feature: 'Email Accounts', values: ['1', '10', '50', 'Unlimited'] },
    { feature: 'Free SSL', values: ['✓', '✓', '✓', '✓'] },
    { feature: 'Daily Backups', values: ['—', '✓', '✓', '✓'] },
    { feature: 'Priority Support', values: ['—', '—', '✓', '✓'] },
    { feature: 'Dedicated IP', values: ['—', '—', '—', '✓'] },
  ],
};

registerSection({
  type: 'plans-comparison',
  displayName: 'Plans Comparison',
  icon: Table,
  category: 'commerce',
  component: PlansComparisonSection,
  settingsComponent: createSettingsWrapper(PlansComparisonSettingsContent),
  defaultProps: defaultPlansComparisonProps,
  description: 'Side-by-side plan comparison table',
  pageGroup: 'VPS Hosting',
  pageGroupOrder: 7,
  translatableProps: ['badge', 'title', 'subtitle', 'plans.*.name', 'plans.*.buttonText', 'features.*.feature'],
  usesDataWrapper: true,
});
