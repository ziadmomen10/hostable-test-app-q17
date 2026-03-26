/**
 * Awards Section Definition
 */

import { Trophy } from 'lucide-react';
import AwardsSection from '@/components/landing/AwardsSection';
import AwardsSettingsContent from '@/components/admin/sections/AwardsSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultAwardsProps = {
  badge: 'AWARDS',
  title: 'Awards & Recognition',
  subtitle: 'Recognized by industry leaders for excellence in hosting.',
  awards: [
    { image: '/placeholder.svg', name: 'Best Web Hosting 2024', year: '2024', organization: 'HostingAdvice' },
    { image: '/placeholder.svg', name: 'Top Rated Support', year: '2024', organization: 'TrustPilot' },
    { image: '/placeholder.svg', name: 'Fastest Hosting', year: '2023', organization: 'WebHostingGeeks' },
    { image: '/placeholder.svg', name: 'Best Value Hosting', year: '2023', organization: 'PCMag' },
  ],
};

registerSection({
  type: 'awards',
  displayName: 'Awards',
  icon: Trophy,
  category: 'content',
  component: AwardsSection,
  settingsComponent: createSettingsWrapper(AwardsSettingsContent),
  defaultProps: defaultAwardsProps,
  description: 'Display awards and recognition',
  pageGroup: 'VPS Hosting',
  pageGroupOrder: 8,
  translatableProps: ['badge', 'title', 'awards.*.name'],
  usesDataWrapper: true,
});
