/**
 * Data Center Section Definition
 */

import { Globe } from 'lucide-react';
import DataCenterSection from '@/components/landing/DataCenterSection';
import DataCenterSettingsContent from '@/components/admin/sections/DataCenterSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultDataCenterProps = {
  badge: 'LOCATIONS',
  title: 'Global Data Centers',
  subtitle: 'Deploy closer to your users for faster performance and lower latency.',
  locations: [
    { city: 'New York', country: 'USA', flag: '🇺🇸', region: 'North America' },
    { city: 'Los Angeles', country: 'USA', flag: '🇺🇸', region: 'North America' },
    { city: 'London', country: 'UK', flag: '🇬🇧', region: 'Europe' },
    { city: 'Frankfurt', country: 'Germany', flag: '🇩🇪', region: 'Europe' },
    { city: 'Singapore', country: 'Singapore', flag: '🇸🇬', region: 'Asia Pacific' },
    { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', region: 'Asia Pacific' },
  ],
};

registerSection({
  type: 'data-center',
  displayName: 'Data Centers',
  icon: Globe,
  category: 'content',
  component: DataCenterSection,
  settingsComponent: createSettingsWrapper(DataCenterSettingsContent),
  defaultProps: defaultDataCenterProps,
  description: 'Global data center locations',
  pageGroup: 'VPS Hosting',
  pageGroupOrder: 5,
  translatableProps: ['badge', 'title', 'subtitle', 'locations.*.city', 'locations.*.country'],
  usesDataWrapper: true,
});
