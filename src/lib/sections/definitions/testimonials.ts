/**
 * Testimonials Section Definition
 */

import { MessageSquare } from 'lucide-react';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import TestimonialsSettingsContent from '@/components/admin/sections/TestimonialsSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultTestimonialsProps = {
  badge: 'TESTIMONIALS',
  title: "Don't Take Our Word For It",
  subtitle: 'See what our customers have to say about their experience with HostOnce.',
  testimonials: [
    { name: 'Sarah Johnson', role: 'E-commerce Owner', avatar: 'S', rating: 5, text: 'Switching to HostOnce was the best decision for my online store. Page load times dropped by 60% and my sales increased significantly.' },
    { name: 'Michael Chen', role: 'Web Developer', avatar: 'M', rating: 5, text: 'The developer tools and SSH access make HostOnce perfect for my projects. I can deploy with confidence knowing the infrastructure is solid.' },
    { name: 'Emily Davis', role: 'Blogger', avatar: 'E', rating: 5, text: 'I was nervous about migrating my 5-year-old blog, but the HostOnce team made it seamless. Zero downtime and everything works perfectly!' },
  ],
};

registerSection({
  type: 'testimonials',
  displayName: 'Testimonials',
  icon: MessageSquare,
  category: 'content',
  component: TestimonialsSection,
  settingsComponent: createSettingsWrapper(TestimonialsSettingsContent),
  defaultProps: defaultTestimonialsProps,
  description: 'Customer testimonials and reviews',
  pageGroup: 'General',
  pageGroupOrder: 4,
  translatableProps: [
    'badge', 'title', 'subtitle',
    'testimonials.*.name', 'testimonials.*.role', 'testimonials.*.text',
  ],
});
