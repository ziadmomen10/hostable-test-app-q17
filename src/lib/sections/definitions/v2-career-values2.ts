import { Heart } from 'lucide-react';
import { V2CareerValues2Section } from '@/components/design-v2/sections/V2CareerValues2Section';
import V2CareerValues2SettingsContent from '@/components/admin/sections/V2CareerValues2SettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-values2',
  displayName: 'V2 Career Values 2',
  icon: Heart,
  category: 'layout',
  component: V2CareerValues2Section,
  settingsComponent: createSettingsWrapper(V2CareerValues2SettingsContent),
  defaultProps: {
    badge: '4 PRINCIPLES',
    title: 'Our Core Values',
    subtitle: "We don't just host data; we empower the people who build it. Our culture is built on a foundation of speed, security, and a relentless drive to simplify the digital world for our global community.",
    image: 'https://c.animaapp.com/kkRHn6VJ/img/sole.png',
    values: [
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/kkRHn6VJ/img/icon-44.svg', title: 'Innovation First', description: 'We empower our team to experiment with the latest tech stacks and AI-driven solutions to redefine what hosting can be.' },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/kkRHn6VJ/img/icon-45.svg', title: 'Customer-Centric Growth', description: 'We empower our team to experiment with the latest tech stacks and AI-driven solutions to redefine what hosting can be.' },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/kkRHn6VJ/img/icon-46.svg', title: 'Global Collaboration', description: 'With a network spanning 25+ global locations, we embrace a diverse, remote-friendly environment.' },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/kkRHn6VJ/img/icon-47.svg', title: 'Uncompromising Excellence', description: 'We hold ourselves to a 99.9% standard—from our server uptime to the quality of our professional support.' },
    ],
  },
  description: '"Our Core Values" 4-principles section with side image.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page 2',
  pageGroupOrder: 4,
  translatableProps: ['badge', 'title', 'subtitle', 'values.*.title', 'values.*.description'],
  dndArrays: [{ path: 'values', strategy: 'grid' }],
});
