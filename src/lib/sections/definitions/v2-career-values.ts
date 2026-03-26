import { Compass } from 'lucide-react';
import { V2CareerValuesSection } from '@/components/design-v2/sections/V2CareerValuesSection';
import V2CareerValuesSettingsContent from '@/components/admin/sections/V2CareerValuesSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-values',
  displayName: 'V2 Career Values',
  icon: Compass,
  category: 'content',
  component: V2CareerValuesSection,
  settingsComponent: createSettingsWrapper(V2CareerValuesSettingsContent),
  defaultProps: {
    badge: '4 PRINCIPLES',
    title: 'Our Core Values',
    subtitle: "We don't just host data; we empower the people who build it. Our culture is built on a foundation of speed, security, and a relentless drive to simplify the digital world for our global community.",
    image: 'https://c.animaapp.com/NzJCLB5d/img/sole.png',
    values: [
      { id: 1, icon: 'https://c.animaapp.com/NzJCLB5d/img/icon.svg', title: 'Innovation First', description: 'We empower our team to experiment with the latest tech stacks and AI-driven solutions to redefine what hosting can be.' },
      { id: 2, icon: 'https://c.animaapp.com/NzJCLB5d/img/icon-1.svg', title: 'Customer-Centric Growth', description: 'We empower our team to experiment with the latest tech stacks and AI-driven solutions to redefine what hosting can be.' },
      { id: 3, icon: 'https://c.animaapp.com/NzJCLB5d/img/icon-2.svg', title: 'Global Collaboration', description: 'With a network spanning 25+ global locations, we embrace a diverse, remote-friendly environment.' },
      { id: 4, icon: 'https://c.animaapp.com/NzJCLB5d/img/icon-3.svg', title: 'Uncompromising Excellence', description: 'We hold ourselves to a 99.9% standard—from our server uptime to the quality of our professional support.' },
    ],
  },
  description: 'V2 career page core values with decorative image left and 2x2 value grid right.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page',
  pageGroupOrder: 4,
  translatableProps: [
    'badge', 'title', 'subtitle',
    'values.0.title', 'values.0.description',
    'values.1.title', 'values.1.description',
    'values.2.title', 'values.2.description',
    'values.3.title', 'values.3.description',
  ],
  dndArrays: [{ path: 'values', strategy: 'grid', handlePosition: 'top-left' }],
});
