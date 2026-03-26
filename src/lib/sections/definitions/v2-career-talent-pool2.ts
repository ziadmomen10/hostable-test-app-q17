import { Users } from 'lucide-react';
import { V2CareerTalentPool2Section } from '@/components/design-v2/sections/V2CareerTalentPool2Section';
import V2CareerTalentPool2SettingsContent from '@/components/admin/sections/V2CareerTalentPool2SettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-talent-pool2',
  displayName: 'V2 Career Talent Pool 2',
  icon: Users,
  category: 'layout',
  component: V2CareerTalentPool2Section,
  settingsComponent: createSettingsWrapper(V2CareerTalentPool2SettingsContent),
  defaultProps: {
    badge: "Can't Find Your Role?",
    title: 'Jump Into Our Talent Pool',
    subtitle: "Can't see a role that fits your skills? We'd still love to hear from you. Send us your CV and tell us why you'd be a great addition to our team. Let's see where your ambition and talent might take you.",
    buttonText: 'Submit CV',
    buttonLink: '#',
  },
  description: 'Dark talent pool card with background image and Submit CV CTA.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page 2',
  pageGroupOrder: 3,
  translatableProps: ['badge', 'title', 'subtitle', 'buttonText'],
  dndArrays: [],
});
