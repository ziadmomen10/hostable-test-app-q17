import { Briefcase } from 'lucide-react';
import { V2JobPostHeroSection } from '@/components/design-v2/sections/V2JobPostHeroSection';
import V2JobPostHeroSettingsContent from '@/components/admin/sections/V2JobPostHeroSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-job-post-hero',
  displayName: 'V2 Job Post Hero',
  icon: Briefcase,
  category: 'content',
  component: V2JobPostHeroSection,
  settingsComponent: createSettingsWrapper(V2JobPostHeroSettingsContent),
  defaultProps: {
    title: 'Business Development Manager',
    jobDetails: [
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/GP8l9Rh9/img/icon.svg', label: 'Location', value: 'Remote' },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/GP8l9Rh9/img/icon-1.svg', label: 'Commitment', value: 'Full-time' },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/GP8l9Rh9/img/icon-2.svg', label: 'Department', value: 'Executive Leadership' },
    ],
  },
  description: 'Job post hero with promo banner, countdown timer, job title, and detail chips.',
  usesDataWrapper: true,
  pageGroup: 'V2 Job Post',
  pageGroupOrder: 1,
  translatableProps: ['title', 'jobDetails.*.label', 'jobDetails.*.value'],
  dndArrays: [{ path: 'jobDetails', strategy: 'horizontal' }],
});
