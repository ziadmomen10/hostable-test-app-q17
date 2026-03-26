import { HandCoins } from 'lucide-react';
import { V2AffiliateHeroSection } from '@/components/design-v2/sections/V2AffiliateHeroSection';
import V2AffiliateHeroSettingsContent from '@/components/admin/sections/V2AffiliateHeroSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-affiliate-hero',
  displayName: 'V2 Affiliate Hero',
  icon: HandCoins,
  category: 'content',
  component: V2AffiliateHeroSection,
  settingsComponent: createSettingsWrapper(V2AffiliateHeroSettingsContent),
  defaultProps: {
    badge: 'Partner Program',
    title: 'Earn More by\nPromoting Hostonce',
    subtitle: 'Join an affiliate program that values your partnership and empower your audience with reliable hosting solutions loved by millions.',
    benefits: [
      { text: 'Up to 60% Commission' },
      { text: 'No Approval Required' },
      { text: 'Monthly & Yearly Plan Commission' },
    ],
    buttonText: 'Become an Affiliate',
    buttonLink: '#',
    secondaryButtonText: 'Log In',
    secondaryButtonLink: '#',
  },
  description: 'V2 Affiliate Partner Program hero section with title, subtitle, benefits list, CTA buttons, hero image, and Trustpilot reviews.',
  usesDataWrapper: true,
  pageGroup: 'V2 Affiliate Partner Program',
  pageGroupOrder: 1,
  translatableProps: ['badge', 'title', 'subtitle', 'benefits.*.text', 'buttonText', 'secondaryButtonText'],
  dndArrays: [],
});
