import { Megaphone } from 'lucide-react';
import { V2CareerCta3Section } from '@/components/design-v2/sections/V2CareerCta3Section';
import V2CareerCta3SettingsContent from '@/components/admin/sections/V2CareerCta3SettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-cta3',
  displayName: 'V2 CTA Green Gradient',
  icon: Megaphone,
  category: 'layout',
  component: V2CareerCta3Section,
  settingsComponent: createSettingsWrapper(V2CareerCta3SettingsContent),
  defaultProps: {
    badgeText: 'POWERED BY AI',
    title: 'Elevate Your Business\nwith HostOnce',
    subtitle: 'Stop building. Start launching. HostOnce combines smart AI generation with lightning-fast hosting for instant results and zero downtime.',
    buttonText: 'Claim Discount, See Plans',
    buttonLink: '#',
  },
  description: 'Green gradient CTA section with AI badge and action button.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page 2',
  pageGroupOrder: 7,
  translatableProps: ['badgeText', 'title', 'subtitle', 'buttonText'],
  dndArrays: [],
});
