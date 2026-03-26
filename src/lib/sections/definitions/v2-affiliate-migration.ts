import { UserPlus } from 'lucide-react';
import { V2AffiliateMigrationSection } from '@/components/design-v2/sections/V2AffiliateMigrationSection';
import V2AffiliateMigrationSettingsContent from '@/components/admin/sections/V2AffiliateMigrationSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-affiliate-migration',
  displayName: 'V2 Affiliate Migration',
  icon: UserPlus,
  category: 'content',
  component: V2AffiliateMigrationSection,
  settingsComponent: createSettingsWrapper(V2AffiliateMigrationSettingsContent),
  defaultProps: {
    badgeLogo: '/lovable-uploads/migration/Logo-hostonce.png',
    badgeText: 'Partner Program',
    title: 'Start Earning Today',
    subtitle: 'Join the HostOnce partnership program for free. Get your unique link, recommend the future of hosting, and earn up to 60% commission on every sale.',
    buttonText: 'Become an Affiliate',
    buttonLink: '#',
  },
  description: 'V2 affiliate partner program migration CTA section with badge and centered content.',
  usesDataWrapper: true,
  pageGroup: 'V2 Affiliate Partner Program',
  pageGroupOrder: 4,
  translatableProps: ['badgeText', 'title', 'subtitle', 'buttonText'],
  dndArrays: [],
});
