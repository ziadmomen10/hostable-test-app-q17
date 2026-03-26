import { Megaphone } from 'lucide-react';
import { V2CareerCtaSection } from '@/components/design-v2/sections/V2CareerCtaSection';
import V2CareerCtaSettingsContent from '@/components/admin/sections/V2CareerCtaSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-cta',
  displayName: 'V2 Career CTA',
  icon: Megaphone,
  category: 'content',
  component: V2CareerCtaSection,
  settingsComponent: createSettingsWrapper(V2CareerCtaSettingsContent),
  defaultProps: {
    badgeIcon: 'https://c.animaapp.com/2X7idWIf/img/icon.svg',
    badgeText: 'POWERED BY AI',
    title: 'Elevate Your Business\nwith HostOnce',
    subtitle: 'Stop building. Start launching. HostOnce combines smart AI generation with lightning-fast hosting for instant results and zero downtime.',
    buttonText: 'Claim Discount, See Plans',
    buttonLink: '#',
  },
  description: 'V2 career page CTA banner with gradient background and decorative blurs.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page',
  pageGroupOrder: 1,
  translatableProps: ['badgeText', 'title', 'subtitle', 'buttonText'],
  dndArrays: [],
});
