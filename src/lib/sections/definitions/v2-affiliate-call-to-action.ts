import { Megaphone } from 'lucide-react';
import { V2AffiliateCallToActionSection } from '@/components/design-v2/sections/V2AffiliateCallToActionSection';
import V2AffiliateCallToActionSettingsContent from '@/components/admin/sections/V2AffiliateCallToActionSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-affiliate-call-to-action',
  displayName: 'V2 Affiliate Call to Action',
  icon: Megaphone,
  category: 'content',
  component: V2AffiliateCallToActionSection,
  settingsComponent: createSettingsWrapper(V2AffiliateCallToActionSettingsContent),
  defaultProps: {
    badgeIcon: '/lovable-uploads/CallToAction/Icon-Ai.png',
    badgeText: 'POWERED BY AI',
    title: 'Elevate Your Business\nwith HostOnce',
    subtitle: 'Stop building. Start launching. HostOnce combines smart AI generation with lightning-fast hosting for instant results and zero downtime.',
    buttonText: 'Claim Discount, See Plans',
    buttonLink: '#',
  },
  description: 'V2 affiliate partner program Call to Action section with background image, AI badge, and call-to-action button.',
  usesDataWrapper: true,
  pageGroup: 'V2 Affiliate Partner Program',
  pageGroupOrder: 5,
  translatableProps: ['badgeText', 'title', 'subtitle', 'buttonText'],
  dndArrays: [],
});
