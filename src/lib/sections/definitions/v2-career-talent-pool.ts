import { UserPlus } from 'lucide-react';
import { V2CareerTalentPoolSection } from '@/components/design-v2/sections/V2CareerTalentPoolSection';
import V2CareerTalentPoolSettingsContent from '@/components/admin/sections/V2CareerTalentPoolSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-talent-pool',
  displayName: 'V2 Career Talent Pool',
  icon: UserPlus,
  category: 'content',
  component: V2CareerTalentPoolSection,
  settingsComponent: createSettingsWrapper(V2CareerTalentPoolSettingsContent),
  defaultProps: {
    badge: "Can't Find Your Role?",
    title: 'Jump Into Our Talent Pool',
    subtitle: "Can't see a role that fits your skills? We'd still love to hear from you. Send us your CV and tell us why you'd be a great addition to our team.",
    buttonText: 'Submit CV',
    buttonLink: '#',
    backgroundImage: 'https://c.animaapp.com/IfGcrHC1/img/image.png',
  },
  description: 'V2 career page talent pool banner with dark card, background image, and floating badge.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page',
  pageGroupOrder: 2,
  translatableProps: ['badge', 'title', 'subtitle', 'buttonText'],
  dndArrays: [],
});
