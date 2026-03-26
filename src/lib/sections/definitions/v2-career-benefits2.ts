import { Award } from 'lucide-react';
import { V2CareerBenefits2Section } from '@/components/design-v2/sections/V2CareerBenefits2Section';
import V2CareerBenefits2SettingsContent from '@/components/admin/sections/V2CareerBenefits2SettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-benefits2',
  displayName: 'V2 Career Benefits 2',
  icon: Award,
  category: 'layout',
  component: V2CareerBenefits2Section,
  settingsComponent: createSettingsWrapper(V2CareerBenefits2SettingsContent),
  defaultProps: {
    title: 'Why Build Your Career at Hostonce?',
    subtitle: "At Ultahost, you'll find purpose, progress, and a place where your career is just getting started.",
    buttonText: 'Become an Affiliate',
    buttonLink: '#',
    benefits: [
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/kkRHn6VJ/img/icon-49.svg', title: 'Remote Flexibility', description: 'Work from anywhere with a schedule that supports your focus, freedom, and work-life balance.' },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/kkRHn6VJ/img/icon-50.svg', title: 'Inclusive Culture', description: 'Diverse teams, open minds, and a collaborative space where everyone is respected and empowered.' },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/kkRHn6VJ/img/icon-51.svg', title: 'Career Growth', description: 'Diverse teams, open minds, and a collaborative space where everyone is respected and empowered.' },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/kkRHn6VJ/img/icon-52.svg', title: 'Skill Growth', description: 'Learn by doing, access mentorship, and build hands-on experience through real projects that move fast.' },
    ],
  },
  description: '"Why Build Your Career" 2×2 benefit cards layout.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page 2',
  pageGroupOrder: 5,
  translatableProps: ['title', 'subtitle', 'buttonText', 'benefits.*.title', 'benefits.*.description'],
  dndArrays: [{ path: 'benefits', strategy: 'grid' }],
});
