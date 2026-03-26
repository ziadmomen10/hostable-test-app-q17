import { ListOrdered } from 'lucide-react';
import { V2AffiliateHowItWorksSection } from '@/components/design-v2/sections/V2AffiliateHowItWorksSection';
import V2AffiliateHowItWorksSettingsContent from '@/components/admin/sections/V2AffiliateHowItWorksSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-affiliate-how-it-works',
  displayName: 'V2 Affiliate Guide',
  icon: ListOrdered,
  category: 'content',
  component: V2AffiliateHowItWorksSection,
  settingsComponent: createSettingsWrapper(V2AffiliateHowItWorksSettingsContent),
  defaultProps: {
    title: 'How It Works',
    subtitle: 'Everything you need to find, secure, and manage your perfect online address in five simple steps.',
    steps: [
      {
        id: '1',
        badge: 'STEP 01',
        title: 'Create an Account',
        description: 'Sign up takes less than a minute. Get instant access to your affiliate dashboard and resources.',
        image: '/lovable-uploads/proba1.png',
      },
      {
        id: '2',
        badge: 'STEP 02',
        title: 'Share Your Link',
        description: 'Sign up takes less than a minute. Get instant access to your affiliate dashboard and resources.',
        image: '/lovable-uploads/proba2.png',
      },
      {
        id: '3',
        badge: 'STEP 03',
        title: 'Get Paid',
        description: 'Sign up takes less than a minute. Get instant access to your affiliate dashboard and resources.',
        image: '/lovable-uploads/proba3.png',
      },
    ],
  },
  description: 'V2 Affiliate Partner Program how it works section with three steps showing the process to join and earn commissions.',
  usesDataWrapper: true,
  pageGroup: 'V2 Affiliate Partner Program',
  pageGroupOrder: 2,
  translatableProps: ['title', 'subtitle', 'steps.*.badge', 'steps.*.title', 'steps.*.description'],
  dndArrays: [{ path: 'steps', strategy: 'grid' }],
});
