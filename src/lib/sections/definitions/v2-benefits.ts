import { Sparkles } from 'lucide-react';
import { V2BenefitsSection } from '@/components/design-v2/sections/V2SectionBenefits';
import V2BenefitsSettingsContent from '@/components/admin/sections/V2BenefitsSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-benefits',
  displayName: 'V2 Benefits',
  icon: Sparkles,
  category: 'content',
  component: V2BenefitsSection,
  settingsComponent: createSettingsWrapper(V2BenefitsSettingsContent),
  defaultProps: {
    badge: 'BENEFITS',
    title: 'Host Once, and Never Worry Again',
    subtitle: 'Stop building. Start launching. HostOnce combines smart AI generation with lightning-fast hosting for instant results and zero downtime.',
    benefits: [
      {
        id: 'security',
        title: 'Enterprise-grade Security and Compliance',
        description: 'Your data is protected by firewalls, real-time malware scanning, and advanced DDoS defense.',
        icon: 'https://c.animaapp.com/dkLoZgXd/img/icon.svg',
        backgroundImage: 'https://c.animaapp.com/dkLoZgXd/img/background.png',
        bgColor: '#accc5414',
        size: 'large',
      },
      {
        id: 'ai-tools',
        title: 'AI-Powered Tools',
        description: 'Our AI assistant for one-click setup, maintenance, and optimization.',
        icon: 'https://c.animaapp.com/dkLoZgXd/img/icon-4.svg',
        bgColor: '#eebe1f14',
        size: 'medium',
      },
      {
        id: 'backups',
        title: 'Automatic Backups',
        description: '24/7 priority access to our expert support team.',
        icon: 'https://c.animaapp.com/dkLoZgXd/img/icon-5.svg',
        backgroundImage: 'https://c.animaapp.com/dkLoZgXd/img/background-1.png',
        bgColor: '#f6a64f14',
        size: 'medium',
      },
      {
        id: 'performance',
        title: 'Unbeatable Performance',
        description: 'We guarantee industry-leading speed and 99.9% uptime.',
        icon: 'https://c.animaapp.com/dkLoZgXd/img/icon-6.svg',
        backgroundImage: 'https://c.animaapp.com/dkLoZgXd/img/background-2.png',
        bgColor: '#00b67a0a',
        size: 'large',
      },
      {
        id: 'guarantee',
        title: '30 Day Money-back Guarantee',
        description: 'We guarantee industry-leading speed and 99.9% uptime.',
        icon: 'https://c.animaapp.com/dkLoZgXd/img/icon-7.svg',
        backgroundImage: 'https://c.animaapp.com/dkLoZgXd/img/background-3.png',
        bgColor: '#21759b0a',
        size: 'full',
      },
    ],
  },
  description: 'V2 design bento-style benefits grid with 5 feature cards.',
  usesDataWrapper: true,
  pageGroup: 'V2 Design',
  pageGroupOrder: 3,
  translatableProps: [
    'badge', 'title', 'subtitle',
    'benefits.0.title', 'benefits.0.description',
    'benefits.1.title', 'benefits.1.description',
    'benefits.2.title', 'benefits.2.description',
    'benefits.3.title', 'benefits.3.description',
    'benefits.4.title', 'benefits.4.description',
  ],
  dndArrays: [],
});
