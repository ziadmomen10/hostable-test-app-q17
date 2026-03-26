import { LayoutTemplate } from 'lucide-react';
import { V2JobPostFooterSection } from '@/components/design-v2/sections/V2JobPostFooterSection';
import V2JobPostFooterSettingsContent from '@/components/admin/sections/V2JobPostFooterSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-job-post-footer',
  displayName: 'V2 Job Post Footer',
  icon: LayoutTemplate,
  category: 'layout',
  component: V2JobPostFooterSection,
  settingsComponent: createSettingsWrapper(V2JobPostFooterSettingsContent),
  defaultProps: {
    logoUrl: 'https://c.animaapp.com/aoJp9WE5/img/logo.svg',
    copyrightText: '© 2025 Hostonce - All rights reserved',
  },
  description: 'Full site footer with logo, social icons, 9 link column navs, payment icons, and legal links.',
  usesDataWrapper: true,
  pageGroup: 'V2 Job Post',
  pageGroupOrder: 6,
  translatableProps: ['copyrightText'],
  dndArrays: [],
});
