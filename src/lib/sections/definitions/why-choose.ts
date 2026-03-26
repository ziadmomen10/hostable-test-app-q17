/**
 * Why Choose Section Definition
 */

import { Award } from 'lucide-react';
import WhyChooseSection from '@/components/landing/WhyChooseSection';
import WhyChooseSettingsContent from '@/components/admin/sections/WhyChooseSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultWhyChooseProps = {
  badge: 'WHY US',
  title: 'Why Choose HostOnce',
  subtitle: 'We combine cutting-edge technology with exceptional support to deliver hosting that just works.',
  reasons: [
    { icon: 'Zap', title: 'Lightning Fast', description: 'NVMe SSD storage and LiteSpeed servers for blazing performance.' },
    { icon: 'Shield', title: 'Secure & Protected', description: 'Free SSL, DDoS protection, and daily backups included.' },
    { icon: 'Clock', title: '99.9% Uptime', description: 'Guaranteed uptime with redundant infrastructure and monitoring.' },
    { icon: 'Headphones', title: '24/7 Expert Support', description: 'Real humans ready to help you anytime, day or night.' },
    { icon: 'Server', title: 'Easy Management', description: 'Intuitive control panel makes managing your hosting a breeze.' },
    { icon: 'Globe', title: 'Global CDN', description: 'Content delivery network with 200+ edge locations worldwide.' },
  ],
};

registerSection({
  type: 'why-choose',
  displayName: 'Why Choose Us',
  icon: Award,
  category: 'content',
  component: WhyChooseSection,
  settingsComponent: createSettingsWrapper(WhyChooseSettingsContent),
  defaultProps: defaultWhyChooseProps,
  description: 'Highlight your unique selling points',
  pageGroup: 'VPS Hosting',
  pageGroupOrder: 2,
  translatableProps: [
    'badge', 'title', 'subtitle',
    'reasons.*.title', 'reasons.*.description',
  ],
});
