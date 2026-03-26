import { Megaphone } from 'lucide-react';
import { V2JobPostCtaSection } from '@/components/design-v2/sections/V2JobPostCtaSection';
import V2JobPostCtaSettingsContent from '@/components/admin/sections/V2JobPostCtaSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-job-post-cta',
  displayName: 'V2 Job Post CTA',
  icon: Megaphone,
  category: 'content',
  component: V2JobPostCtaSection,
  settingsComponent: createSettingsWrapper(V2JobPostCtaSettingsContent),
  defaultProps: {
    badgeIcon: 'https://c.animaapp.com/NhtbVbns/img/icon.svg',
    badgeText: 'POWERED BY AI',
    title: 'Elevate Your Business\nwith HostOnce',
    subtitle: 'Stop building. Start launching. HostOnce combines smart AI generation with lightning-fast hosting for instant results and zero downtime.',
    buttonText: 'Claim Discount, See Plans',
    buttonLink: '#',
  },
  description: 'Job post CTA banner with dark green background, badge, title, and action button.',
  usesDataWrapper: true,
  pageGroup: 'V2 Job Post',
  pageGroupOrder: 5,
  translatableProps: ['badgeText', 'title', 'subtitle', 'buttonText'],
  dndArrays: [],
});
