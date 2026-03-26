import { LayoutGrid } from 'lucide-react';
import { V2SiteBenefitsSection } from '@/components/design-v2/sections/V2SiteBenefitsSection';
import V2SiteBenefitsSettingsContent from '@/components/admin/sections/V2SiteBenefitsSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-site-benefits',
  displayName: 'V2 Site Benefits',
  icon: LayoutGrid,
  category: 'layout',
  component: V2SiteBenefitsSection,
  settingsComponent: createSettingsWrapper(V2SiteBenefitsSettingsContent),
  defaultProps: {
    badge: 'BENEFITS',
    title: 'Host Once, and Never Worry Again',
    card1Title: 'Enterprise-grade\nSecurity and Compliance',
    card1Subtitle: 'Your data is protected by firewalls, real-time malware scanning, and advanced DDoS defense.',
    card2Title: 'AI-Powered Tools',
    card2Subtitle: 'Our AI assistant for one-click setup, maintenance, and optimization',
    card3Title: 'Automatic Backups',
    card3Subtitle: '24/7 priority access to our expert support team.',
    card4Title: 'Unbeatable Performance',
    card4Subtitle: 'We guarantee industry-leading speed and 99.9% uptime.',
    card5Title: '30 Day Money-back Guarantee',
    card5Subtitle: 'We guarantee industry-leading speed and 99.9% uptime.',
  },
  description: 'Bento-grid hosting benefits with 5 positional cards.',
  usesDataWrapper: true,
  pageGroup: 'V2 Design',
  pageGroupOrder: 4,
  translatableProps: ['badge', 'title', 'card1Title', 'card1Subtitle', 'card2Title', 'card2Subtitle', 'card3Title', 'card3Subtitle', 'card4Title', 'card4Subtitle', 'card5Title', 'card5Subtitle'],
  dndArrays: [],
});
