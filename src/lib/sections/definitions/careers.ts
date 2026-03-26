/**
 * Careers Section Definition
 */

import { Briefcase } from 'lucide-react';
import CareersSection from '@/components/landing/CareersSection';
import CareersSettingsContent from '@/components/admin/sections/CareersSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultCareersProps = {
  badge: "We're Hiring",
  title: 'Join Our Team',
  subtitle: 'Explore exciting career opportunities and grow with us',
  columns: 3,
  jobs: [
    {
      id: 'job-1',
      title: 'Senior React Developer',
      department: 'Engineering',
      location: 'New York, NY',
      type: 'Full-time',
      remote: true,
      description: 'Build beautiful, scalable web applications using React and TypeScript.',
      applyUrl: '#',
    },
    {
      id: 'job-2',
      title: 'Product Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Full-time',
      remote: true,
      description: 'Create intuitive user experiences and design systems.',
      applyUrl: '#',
    },
    {
      id: 'job-3',
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Remote',
      type: 'Contract',
      remote: true,
      description: 'Manage cloud infrastructure and CI/CD pipelines.',
      applyUrl: '#',
    },
  ],
};

registerSection({
  type: 'careers',
  displayName: 'Careers',
  icon: Briefcase,
  category: 'content',
  component: CareersSection,
  settingsComponent: createSettingsWrapper(CareersSettingsContent),
  defaultProps: defaultCareersProps,
  description: 'Display open job positions and career opportunities',
  pageGroup: 'Career Page',
  pageGroupOrder: 2,
  translatableProps: [
    'badge', 'title', 'subtitle',
    'jobs.*.title', 'jobs.*.department', 'jobs.*.location', 'jobs.*.description',
  ],
  usesDataWrapper: true,
  dndArrays: [
    { path: 'jobs', strategy: 'grid' },
  ],
});
