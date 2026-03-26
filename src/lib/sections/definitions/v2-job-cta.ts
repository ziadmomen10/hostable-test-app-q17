import { Megaphone } from 'lucide-react';
import { V2JobCtaSection } from '@/components/design-v2/sections/V2JobCtaSection';
import V2JobCtaSettingsContent from '@/components/admin/sections/V2JobCtaSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-job-cta',
  displayName: 'V2 Job CTA',
  icon: Megaphone,
  category: 'layout',
  component: V2JobCtaSection,
  settingsComponent: createSettingsWrapper(V2JobCtaSettingsContent),
  defaultProps: {
    badgeText: 'POWERED BY AI',
    title: 'Elevate Your Business\nwith HostOnce',
    subtitle: 'Stop building. Start launching. HostOnce combines smart AI generation with lightning-fast hosting for instant results and zero downtime.',
    buttonText: 'Claim Discount, See Plans',
    buttonLink: '#',
  },
  description: 'Job detail CTA section with green gradient background.',
  usesDataWrapper: true,
  pageGroup: 'V2 Job Detail',
  pageGroupOrder: 5,
  translatableProps: ['badgeText', 'title', 'subtitle', 'buttonText'],
  dndArrays: [],
});
