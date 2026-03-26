import { Footprints } from 'lucide-react';
import { V2SiteFooterSection } from '@/components/design-v2/sections/V2SiteFooterSection';
import V2SiteFooterSettingsContent from '@/components/admin/sections/V2SiteFooterSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-site-footer',
  displayName: 'V2 Site Footer',
  icon: Footprints,
  category: 'layout',
  component: V2SiteFooterSection,
  settingsComponent: createSettingsWrapper(V2SiteFooterSettingsContent),
  defaultProps: {
    logoUrl: 'https://c.animaapp.com/L22lErDL/img/logo-1.svg',
    copyrightText: '© 2025 Hostonce - All rights reserved',
  },
  description: 'Full site footer with 9 navigation columns, social links, and legal links.',
  usesDataWrapper: true,
  pageGroup: 'V2 Design',
  pageGroupOrder: 10,
  translatableProps: ['copyrightText'],
  dndArrays: [],
});
