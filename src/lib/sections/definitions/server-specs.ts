/**
 * Server Specs Section Definition
 */

import { HardDrive } from 'lucide-react';
import ServerSpecsSection from '@/components/landing/ServerSpecsSection';
import ServerSpecsSettingsContent from '@/components/admin/sections/ServerSpecsSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultServerSpecsProps = {
  badge: 'SERVERS',
  title: 'Server Specifications',
  subtitle: 'Choose the configuration that fits your needs.',
  specs: [
    { name: 'Starter VPS', cpu: '2 vCPU', ram: '4GB', storage: '50GB NVMe SSD', bandwidth: '2TB', price: '$19/mo' },
    { name: 'Growth VPS', cpu: '4 vCPU', ram: '8GB', storage: '100GB NVMe SSD', bandwidth: '4TB', price: '$39/mo' },
    { name: 'Business VPS', cpu: '6 vCPU', ram: '16GB', storage: '200GB NVMe SSD', bandwidth: '6TB', price: '$69/mo' },
    { name: 'Enterprise VPS', cpu: '8 vCPU', ram: '32GB', storage: '400GB NVMe SSD', bandwidth: '8TB', price: '$129/mo' },
  ],
};

registerSection({
  type: 'server-specs',
  displayName: 'Server Specs',
  icon: HardDrive,
  category: 'commerce',
  component: ServerSpecsSection,
  settingsComponent: createSettingsWrapper(ServerSpecsSettingsContent),
  defaultProps: defaultServerSpecsProps,
  description: 'Server specifications table',
  pageGroup: 'VPS Hosting',
  pageGroupOrder: 6,
  translatableProps: ['badge', 'title', 'subtitle', 'specs.*.name'],
  // NOTE: specs.*.price removed - prices should be displayed via PriceDisplay for currency conversion
  usesDataWrapper: true,
});
