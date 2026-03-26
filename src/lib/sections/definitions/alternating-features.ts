/**
 * Alternating Features Section Definition
 */

import { Columns } from 'lucide-react';
import AlternatingFeaturesSection from '@/components/landing/AlternatingFeaturesSection';
import AlternatingFeaturesSettingsContent from '@/components/admin/sections/AlternatingFeaturesSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultAlternatingFeaturesProps = {
  badge: 'FEATURES',
  title: 'Everything You Need to Succeed',
  blocks: [
    {
      title: 'Lightning Fast Performance',
      description: 'Experience blazing fast load times with our optimized infrastructure powered by NVMe SSDs and LiteSpeed web servers.',
      image: '/placeholder.svg',
      imagePosition: 'right' as const,
      bullets: ['NVMe SSD Storage', 'HTTP/3 Support', 'Global CDN Included', 'LiteSpeed Cache'],
      buttonText: 'Learn More',
      buttonLink: '#performance',
    },
    {
      title: 'Enterprise-Grade Security',
      description: 'Keep your website and data safe with our comprehensive security suite that protects against all modern threats.',
      image: '/placeholder.svg',
      imagePosition: 'left' as const,
      bullets: ['Free SSL Certificates', 'DDoS Protection', 'Daily Backups', 'Malware Scanning'],
      buttonText: 'Explore Security',
      buttonLink: '#security',
    },
    {
      title: '24/7 Expert Support',
      description: 'Our team of hosting experts is available around the clock to help you with any questions or issues.',
      image: '/placeholder.svg',
      imagePosition: 'right' as const,
      bullets: ['Live Chat Support', 'Phone Support', 'Ticket System', 'Knowledge Base'],
      buttonText: 'Contact Us',
      buttonLink: '#support',
    },
  ],
};

registerSection({
  type: 'alternating-features',
  displayName: 'Alternating Features',
  icon: Columns,
  category: 'content',
  component: AlternatingFeaturesSection,
  settingsComponent: createSettingsWrapper(AlternatingFeaturesSettingsContent),
  defaultProps: defaultAlternatingFeaturesProps,
  description: 'Features with alternating image positions',
  pageGroup: 'General',
  pageGroupOrder: 12,
  translatableProps: ['blocks.*.title', 'blocks.*.description', 'blocks.*.bullets.*'],
  usesDataWrapper: true,
});
