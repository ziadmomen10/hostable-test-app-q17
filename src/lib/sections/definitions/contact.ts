/**
 * Contact Section Definition
 */

import { Phone } from 'lucide-react';
import ContactSection from '@/components/landing/ContactSection';
import ContactSettingsContent from '@/components/admin/sections/ContactSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultContactProps = {
  badge: 'CONTACT',
  title: 'Get In Touch',
  subtitle: 'We\'d love to hear from you. Reach out through any of these channels.',
  channels: [
    { icon: 'Mail', type: 'email' as const, title: 'Email Us', description: 'We\'ll respond within 24 hours', value: 'support@example.com', buttonText: 'Send Email' },
    { icon: 'Phone', type: 'phone' as const, title: 'Call Us', description: 'Available 24/7 for urgent issues', value: '+1 (800) 123-4567', buttonText: 'Call Now' },
    { icon: 'MessageSquare', type: 'chat' as const, title: 'Live Chat', description: 'Instant support from our team', value: '', buttonText: 'Start Chat' },
    { icon: 'MapPin', type: 'address' as const, title: 'Visit Us', description: 'Our headquarters location', value: '123 Tech Street, San Francisco, CA 94105', buttonText: 'Get Directions' },
  ],
};

registerSection({
  type: 'contact',
  displayName: 'Contact Section',
  icon: Phone,
  category: 'content',
  component: ContactSection,
  settingsComponent: createSettingsWrapper(ContactSettingsContent),
  defaultProps: defaultContactProps,
  description: 'Contact information and channels',
  pageGroup: 'Contact Page',
  pageGroupOrder: 1,
  translatableProps: [
    'badge', 'title', 'subtitle',
    'channels.*.title', 'channels.*.description', 'channels.*.buttonText',
  ],
  usesDataWrapper: true,
});
