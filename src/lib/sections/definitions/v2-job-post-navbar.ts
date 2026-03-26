import { Navigation } from 'lucide-react';
import { V2JobPostNavbarSection } from '@/components/design-v2/sections/V2JobPostNavbarSection';
import V2JobPostNavbarSettingsContent from '@/components/admin/sections/V2JobPostNavbarSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-job-post-navbar',
  displayName: 'V2 Job Post Navbar',
  icon: Navigation,
  category: 'content',
  component: V2JobPostNavbarSection,
  settingsComponent: createSettingsWrapper(V2JobPostNavbarSettingsContent),
  defaultProps: {
    bannerText: 'Get 40% Off All Hosting Services For A Limited Time!',
  },
  description: 'Promo banner with countdown timer and navigation header.',
  usesDataWrapper: true,
  pageGroup: 'V2 Job Post',
  pageGroupOrder: 0,
  translatableProps: ['bannerText'],
  dndArrays: [],
});
