import { Heading } from 'lucide-react';
import { V2JobTitleHeroSection } from '@/components/design-v2/sections/V2JobTitleHeroSection';
import V2JobTitleHeroSettingsContent from '@/components/admin/sections/V2JobTitleHeroSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-job-title-hero',
  displayName: 'V2 Job Title Hero',
  icon: Heading,
  category: 'layout',
  component: V2JobTitleHeroSection,
  settingsComponent: createSettingsWrapper(V2JobTitleHeroSettingsContent),
  defaultProps: {
    title: 'Business Development Manager',
    jobDetails: [
      { icon: 'https://c.animaapp.com/L22lErDL/img/icon.svg', label: 'Location', value: 'Remote' },
      { icon: 'https://c.animaapp.com/L22lErDL/img/icon-1.svg', label: 'Commitment', value: 'Full-time' },
      { icon: 'https://c.animaapp.com/L22lErDL/img/icon-2.svg', label: 'Department', value: 'Executive Leadership' },
    ],
  },
  description: 'Job listing hero with title and location/commitment/department chips.',
  usesDataWrapper: true,
  pageGroup: 'V2 Job Detail',
  pageGroupOrder: 1,
  translatableProps: ['title'],
  dndArrays: [],
});
