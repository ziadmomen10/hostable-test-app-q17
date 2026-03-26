import { Star } from 'lucide-react';
import { V2CareerHeroSection } from '@/components/design-v2/sections/V2CareerHeroSection';
import V2CareerHeroSettingsContent from '@/components/admin/sections/V2CareerHeroSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-hero',
  displayName: 'V2 Career Hero',
  icon: Star,
  category: 'layout',
  component: V2CareerHeroSection,
  settingsComponent: createSettingsWrapper(V2CareerHeroSettingsContent),
  defaultProps: {
    badge: 'Career at Hostonce',
    title: 'Join Our Innovative Team and Help Shape the Future of Web Hosting',
    buttonText: 'Explore Job Openings',
    buttonLink: '#',
  },
  description: 'V2 career page hero with centered headline, CTA, and decorative image collage.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page',
  pageGroupOrder: 7,
  translatableProps: ['badge', 'title', 'buttonText'],
  dndArrays: [],
});
