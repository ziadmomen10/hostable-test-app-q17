import { Users } from 'lucide-react';
import { V2AffiliateWhoIsItForSection } from '@/components/design-v2/sections/V2AffiliateWhoIsItForSection';
import V2AffiliateWhoIsItForSettingsContent from '@/components/admin/sections/V2AffiliateWhoIsItForSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-affiliate-who-is-it-for',
  displayName: 'V2 Affiliate Who Is It For',
  icon: Users,
  category: 'content',
  component: V2AffiliateWhoIsItForSection,
  settingsComponent: createSettingsWrapper(V2AffiliateWhoIsItForSettingsContent),
  defaultProps: {
    title: 'Who is Our Affiliate Program For?',
    subtitle: 'Every Guide is trained and excited to work with you, whether you need help with a password reset or you\'re looking for a team to build your complete web presence.',
    buttonText: 'Become an Affiliate',
    buttonLink: '#',
    items: [
      {
        id: crypto.randomUUID(),
        icon: '/lovable-uploads/WhoIsItFor/Icon-developers.png',
        title: 'Developers',
        description: 'Recommend trusted hosting solutions to your clients and network. Earn competitive commissions on every referral.',
      },
      {
        id: crypto.randomUUID(),
        icon: '/lovable-uploads/WhoIsItFor/Icon-Agencies.png',
        title: 'Agencies',
        description: 'Expand your service offerings. Earn new income by providing your clients with reliable Ultahost solutions.',
      },
      {
        id: crypto.randomUUID(),
        icon: '/lovable-uploads/WhoIsItFor/Icon-Affiliate-Marketers.png',
        title: 'Affiliate Marketers',
        description: 'Maximize your earnings in the hosting niche with high conversion rates and competitive commissions.',
      },
      {
        id: crypto.randomUUID(),
        icon: '/lovable-uploads/WhoIsItFor/Icon-Hostonce-Customers.png',
        title: 'Hostonce Customers',
        description: 'Love Ultahost? Refer friends and family to the hosting you trust and get rewarded for every sign-up.',
      },
      {
        id: crypto.randomUUID(),
        icon: '/lovable-uploads/WhoIsItFor/Icon-Content-Publishers.png',
        title: 'Content Publishers',
        description: 'Monetize your platform by recommending reliable hosting. Earn commissions by providing value to your audience.',
      },
      {
        id: crypto.randomUUID(),
        icon: '/lovable-uploads/WhoIsItFor/Icon-Influecers.png',
        title: 'Influencers',
        description: 'Transform your influence into income. Promote Ultahost to your followers and earn on every successful referral.',
      },
    ],
  },
  description: 'V2 affiliate program target audience showcase with icon cards.',
  usesDataWrapper: true,
  pageGroup: 'V2 Affiliate Partner Program',
  pageGroupOrder: 3,
  translatableProps: ['title', 'subtitle', 'buttonText', 'items.*.title', 'items.*.description'],
  dndArrays: [{ path: 'items', strategy: 'grid' }],
});
