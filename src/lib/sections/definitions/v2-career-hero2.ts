import { Star } from 'lucide-react';
import { V2CareerHero2Section } from '@/components/design-v2/sections/V2CareerHero2Section';
import V2CareerHero2SettingsContent from '@/components/admin/sections/V2CareerHero2SettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-hero2',
  displayName: 'V2 Career Hero 2',
  icon: Star,
  category: 'layout',
  component: V2CareerHero2Section,
  settingsComponent: createSettingsWrapper(V2CareerHero2SettingsContent),
  defaultProps: {
    badge: 'Career at Hostonce',
    title: 'Join Our Innovative Team and Help Shape the Future of Web Hosting',
    buttonText: 'Explore Job Openings',
    buttonLink: '#',
  },
  description: 'V2 career hero with image collage and centered headline.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page 2',
  pageGroupOrder: 1,
  translatableProps: ['badge', 'title', 'buttonText'],
  dndArrays: [],
});
