/**
 * Hosting Services Section Definition
 */

import { Server } from 'lucide-react';
import HostingServicesSection from '@/components/landing/HostingServicesSection';
import HostingServicesSettingsContent from '@/components/admin/sections/HostingServicesSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultHostingServicesProps = {
  badge: 'SERVICES',
  title: 'Hosting Services to Elevate Your Business',
  subtitle: 'Everything you need to launch, grow, and scale your online presence with confidence.',
  services: [
    { icon: 'Globe', title: 'Domain Names', description: 'Register your perfect domain name with over 500 extensions available.', price: 'From $9.99/yr' },
    { icon: 'Server', title: 'Web Hosting', description: 'Lightning-fast hosting with NVMe storage and LiteSpeed servers.', price: 'From $2.99/mo' },
    { icon: 'Cloud', title: 'Cloud Hosting', description: 'Scalable cloud infrastructure with automatic failover and load balancing.', price: 'From $4.99/mo' },
    { icon: 'ShieldCheck', title: 'SSL Certificates', description: 'Secure your website with industry-standard encryption and trust badges.', price: 'Free with hosting' },
    { icon: 'Zap', title: 'VPS Hosting', description: 'Full root access with dedicated resources and guaranteed performance.', price: 'From $12.99/mo' },
    { icon: 'Database', title: 'Dedicated Servers', description: 'Enterprise-grade hardware with full customization and maximum performance.', price: 'From $89.99/mo' },
  ],
};

registerSection({
  type: 'hosting-services',
  displayName: 'Hosting Services',
  icon: Server,
  category: 'commerce',
  component: HostingServicesSection,
  settingsComponent: createSettingsWrapper(HostingServicesSettingsContent),
  defaultProps: defaultHostingServicesProps,
  description: 'Display hosting service offerings',
  pageGroup: 'VPS Hosting',
  pageGroupOrder: 1,
  translatableProps: [
    'badge', 'title', 'subtitle',
    'services.*.title', 'services.*.description',
    // NOTE: services.*.price removed - prices are converted dynamically via PriceDisplay
  ],
});
