import { Briefcase } from 'lucide-react';
import { V2CareerOpeningsSection } from '@/components/design-v2/sections/V2CareerOpeningsSection';
import V2CareerOpeningsSettingsContent from '@/components/admin/sections/V2CareerOpeningsSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-openings',
  displayName: 'V2 Career Openings',
  icon: Briefcase,
  category: 'content',
  component: V2CareerOpeningsSection,
  settingsComponent: createSettingsWrapper(V2CareerOpeningsSettingsContent),
  defaultProps: {
    title: 'Find Suitable Openings',
    subtitle: '67 Openings Currently',
    searchPlaceholder: 'Search for a position',
    categories: [
      {
        id: 1, category: 'Executive Leadership', categoryIcon: 'https://c.animaapp.com/AKIVmJIk/img/icon-1.svg',
        jobs: [
          { id: 1, title: 'Chief Product Officer (CPO)', description: 'Leads product vision, strategy, execution, and cross-functional product alignment.', location: 'Remote', type: 'Full Time' },
          { id: 2, title: 'Chief Customer Officer (CCO)', description: 'Owns customer experience, retention, loyalty, and post-sales success strategy.', location: 'Remote', type: 'Full Time' },
          { id: 3, title: 'Chief Operating Officer (COO)', description: 'Leads company operations, team execution, and cross-departmental performance.', location: 'Remote', type: 'Full Time' },
          { id: 4, title: 'Executive Assistant in IT & Tech', description: 'Supports executives with scheduling, communication, and tech operations.', location: 'Remote', type: 'Full Time' },
        ],
      },
      { id: 2, category: 'Customer Success', categoryIcon: 'https://c.animaapp.com/AKIVmJIk/img/icon-10.svg', jobs: [] },
      { id: 3, category: 'Blockchain & Web3', categoryIcon: 'https://c.animaapp.com/AKIVmJIk/img/icon-12.svg', jobs: [] },
      { id: 4, category: 'Artificial Intelligence', categoryIcon: 'https://c.animaapp.com/AKIVmJIk/img/icon-14.svg', jobs: [] },
      { id: 5, category: 'Product Management', categoryIcon: 'https://c.animaapp.com/AKIVmJIk/img/icon-18.svg', jobs: [] },
    ],
  },
  description: 'V2 career page job openings with category accordion, search, and filter bar.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page',
  pageGroupOrder: 8,
  translatableProps: ['title', 'subtitle', 'searchPlaceholder'],
  dndArrays: [{ path: 'categories', strategy: 'vertical', handlePosition: 'left' }],
});
