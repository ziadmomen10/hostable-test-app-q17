/**
 * Features Section Definition
 */

import { Zap } from 'lucide-react';
import FeaturesSection from '@/components/landing/FeaturesSection';
import FeaturesSettingsContent from '@/components/admin/sections/FeaturesSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultFeaturesProps = {
  title: 'Example Title Goes Here',
  subtitle: 'Everything you need to build, grow, and scale your online presence.',
  buttonText: 'Explore All Features',
  buttonUrl: '#features',
  features: [
    {
      icon: 'Zap',
      title: 'The Fastest Way to Get Online',
      description: 'Our optimized infrastructure delivers 20x faster loading times compared to traditional hosting providers.',
      highlights: [
        { text: 'NVMe SSD Storage' },
        { text: 'LiteSpeed Web Server' },
        { text: 'Global CDN Included' }
      ]
    },
    {
      icon: 'Shield',
      title: 'Start Secure with Enterprise-level Protection',
      description: 'Every account comes with enterprise-grade security features to keep your website safe.',
      highlights: [
        { text: 'Free SSL Certificates' },
        { text: 'DDoS Protection' },
        { text: 'Daily Malware Scans' }
      ]
    }
  ],
};

registerSection({
  type: 'features',
  displayName: 'Features Grid',
  icon: Zap,
  category: 'content',
  component: FeaturesSection,
  settingsComponent: createSettingsWrapper(FeaturesSettingsContent),
  defaultProps: defaultFeaturesProps,
  description: 'Showcase your features in a grid layout',
  pageGroup: 'General',
  pageGroupOrder: 2,
  translatableProps: [
    'badge', 'title', 'subtitle', 'buttonText',
    'features.*.title', 'features.*.description',
    'features.*.highlights.*.text',
  ],
});
