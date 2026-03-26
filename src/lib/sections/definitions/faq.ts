/**
 * FAQ Section Definition
 */

import { HelpCircle } from 'lucide-react';
import FAQSection from '@/components/landing/FAQSection';
import FAQSettingsContent from '@/components/admin/sections/FAQSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultFAQProps = {
  badge: 'FAQ',
  title: 'Frequently Asked Questions',
  subtitle: "Got questions? We've got answers. If you can't find what you're looking for, reach out to our support team.",
  faqs: [
    { question: 'What is web hosting?', answer: 'Web hosting is a service that allows you to publish your website on the internet. It stores your website files on a server and makes them accessible to visitors.' },
    { question: 'Do you offer a money-back guarantee?', answer: 'Yes! We offer a 30-day money-back guarantee on all hosting plans. If you\'re not satisfied, you can get a full refund.' },
    { question: 'Can I upgrade my plan later?', answer: 'Absolutely! You can upgrade your hosting plan at any time through your control panel. The price difference will be prorated.' },
    { question: 'Do you provide free SSL certificates?', answer: 'Yes, all our hosting plans include free SSL certificates powered by Let\'s Encrypt. Your website will be secured with HTTPS automatically.' },
    { question: 'What kind of support do you offer?', answer: 'We offer 24/7 support via live chat, email, and phone. Our expert team is always ready to help you with any issues.' },
    { question: 'Can I migrate my existing website?', answer: 'Yes! We offer free website migration for all new customers. Our team will handle the entire process for you seamlessly.' },
  ],
};

registerSection({
  type: 'faq',
  displayName: 'FAQ Section',
  icon: HelpCircle,
  category: 'content',
  component: FAQSection,
  settingsComponent: createSettingsWrapper(FAQSettingsContent),
  defaultProps: defaultFAQProps,
  description: 'Frequently asked questions accordion',
  pageGroup: 'General',
  pageGroupOrder: 5,
  translatableProps: [
    'badge', 'title', 'subtitle',
    'faqs.*.question', 'faqs.*.answer',
  ],
});
