import { Heart } from 'lucide-react';
import { V2CareerBenefitsSection } from '@/components/design-v2/sections/V2CareerBenefitsSection';
import V2CareerBenefitsSettingsContent from '@/components/admin/sections/V2CareerBenefitsSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-benefits',
  displayName: 'V2 Career Benefits',
  icon: Heart,
  category: 'content',
  component: V2CareerBenefitsSection,
  settingsComponent: createSettingsWrapper(V2CareerBenefitsSettingsContent),
  defaultProps: {
    title: 'Why Build Your Career at Hostonce?',
    subtitle: "At Ultahost, you'll find purpose, progress, and a place where your career is just getting started.",
    buttonText: 'Become an Affiliate',
    buttonLink: '#',
    benefits: [
      { id: 1, icon: 'https://c.animaapp.com/I1qx8eSi/img/icon-1.svg', title: 'Remote Flexibility', description: 'Work from anywhere with a schedule that supports your focus, freedom, and work-life balance.' },
      { id: 2, icon: 'https://c.animaapp.com/I1qx8eSi/img/icon-2.svg', title: 'Inclusive Culture', description: 'Diverse teams, open minds, and a collaborative space where everyone is respected and empowered.' },
      { id: 3, icon: 'https://c.animaapp.com/I1qx8eSi/img/icon-3.svg', title: 'Career Growth', description: 'Diverse teams, open minds, and a collaborative space where everyone is respected and empowered.' },
      { id: 4, icon: 'https://c.animaapp.com/I1qx8eSi/img/icon-4.svg', title: 'Skill Growth', description: 'Learn by doing, access mentorship, and build hands-on experience through real projects that move fast.' },
    ],
  },
  description: 'V2 career page benefits with two-column layout: header left, 2x2 card grid right.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page',
  pageGroupOrder: 3,
  translatableProps: [
    'title', 'subtitle', 'buttonText',
    'benefits.0.title', 'benefits.0.description',
    'benefits.1.title', 'benefits.1.description',
    'benefits.2.title', 'benefits.2.description',
    'benefits.3.title', 'benefits.3.description',
  ],
  dndArrays: [{ path: 'benefits', strategy: 'grid', handlePosition: 'top-left' }],
});
