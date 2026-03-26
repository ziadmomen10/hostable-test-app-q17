/**
 * Stats Counter Section Definition
 */

import { BarChart3 } from 'lucide-react';
import StatsCounterSection from '@/components/landing/StatsCounterSection';
import StatsCounterSettingsContent from '@/components/admin/sections/StatsCounterSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultStatsCounterProps = {
  badge: 'BY THE NUMBERS',
  title: 'Trusted by Thousands Worldwide',
  subtitle: 'Our commitment to excellence in hosting speaks through our numbers.',
  stats: [
    { value: '99.9', label: 'Uptime Guarantee', suffix: '%', icon: '📈' },
    { value: '50', label: 'Happy Customers', suffix: 'K+', icon: '👥' },
    { value: '24', label: 'Expert Support', suffix: '/7', icon: '🎧' },
    { value: '15', label: 'Data Centers', suffix: '+', icon: '🌍' },
  ],
};

registerSection({
  type: 'stats-counter',
  displayName: 'Stats Counter',
  icon: BarChart3,
  category: 'content',
  component: StatsCounterSection,
  settingsComponent: createSettingsWrapper(StatsCounterSettingsContent),
  defaultProps: defaultStatsCounterProps,
  description: 'Display statistics with animated counters',
  pageGroup: 'General',
  pageGroupOrder: 9,
  translatableProps: ['badge', 'title', 'subtitle', 'stats.*.label', 'stats.*.value', 'stats.*.suffix'],
  usesDataWrapper: true,
});
