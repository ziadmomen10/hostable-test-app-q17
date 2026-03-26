/**
 * OS Selector Section Definition
 */

import { Monitor } from 'lucide-react';
import OSSelectorSection from '@/components/landing/OSSelectorSection';
import OSSelectorSettingsContent from '@/components/admin/sections/OSSelectorSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultOSSelectorProps = {
  badge: 'OPERATING SYSTEMS',
  title: 'Choose Your OS',
  subtitle: 'We support all major operating systems with one-click deployment.',
  categories: ['Linux', 'Windows'],
  items: [
    { icon: 'Terminal', name: 'Ubuntu', category: 'Linux' },
    { icon: 'Terminal', name: 'CentOS', category: 'Linux' },
    { icon: 'Terminal', name: 'Debian', category: 'Linux' },
    { icon: 'Terminal', name: 'AlmaLinux', category: 'Linux' },
    { icon: 'Monitor', name: 'Windows Server 2022', category: 'Windows' },
    { icon: 'Monitor', name: 'Windows Server 2019', category: 'Windows' },
  ],
};

registerSection({
  type: 'os-selector',
  displayName: 'OS Selector',
  icon: Monitor,
  category: 'interactive',
  component: OSSelectorSection,
  settingsComponent: createSettingsWrapper(OSSelectorSettingsContent),
  defaultProps: defaultOSSelectorProps,
  description: 'Operating system selection grid',
  pageGroup: 'VPS Hosting',
  pageGroupOrder: 4,
  translatableProps: ['badge', 'title', 'subtitle', 'items.*.name'],
  usesDataWrapper: true,
});
