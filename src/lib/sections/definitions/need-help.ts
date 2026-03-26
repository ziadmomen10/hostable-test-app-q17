/**
 * Need Help Section Definition
 */

import { Headphones } from 'lucide-react';
import NeedHelpSection from '@/components/landing/NeedHelpSection';
import NeedHelpSettingsContent from '@/components/admin/sections/NeedHelpSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultNeedHelpProps = {
  badge: 'SUPPORT',
  title: 'Need Help?',
  subtitle: 'Our award-winning support team is here to help you 24/7.',
  options: [
    { icon: 'MessageSquare', title: 'Live Chat', description: 'Chat with our support team in real-time for instant answers.', actionText: 'Start Chat', availability: '24/7' },
    { icon: 'Phone', title: 'Phone Support', description: 'Speak directly with our expert support representatives.', actionText: 'Call Now', availability: '24/7' },
    { icon: 'Mail', title: 'Email Support', description: "Send us an email and we'll respond within 2 hours.", actionText: 'Send Email', availability: '< 2hr response' },
    { icon: 'FileText', title: 'Knowledge Base', description: 'Browse our extensive library of tutorials and guides.', actionText: 'Browse Articles', availability: '500+ articles' },
  ],
};

registerSection({
  type: 'need-help',
  displayName: 'Need Help',
  icon: Headphones,
  category: 'content',
  component: NeedHelpSection,
  settingsComponent: createSettingsWrapper(NeedHelpSettingsContent),
  defaultProps: defaultNeedHelpProps,
  description: 'Support and help options',
  pageGroup: 'VPS Hosting',
  pageGroupOrder: 3,
  translatableProps: [
    'badge', 'title', 'subtitle',
    'options.*.title', 'options.*.description', 'options.*.buttonText', 'options.*.actionText', 'options.*.availability',
  ],
});
