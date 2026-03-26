import { HelpCircle } from 'lucide-react';
import { V2JobPostFaqSection } from '@/components/design-v2/sections/V2JobPostFaqSection';
import V2JobPostFaqSettingsContent from '@/components/admin/sections/V2JobPostFaqSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-job-post-faq',
  displayName: 'V2 Job Post FAQ',
  icon: HelpCircle,
  category: 'content',
  component: V2JobPostFaqSection,
  settingsComponent: createSettingsWrapper(V2JobPostFaqSettingsContent),
  defaultProps: {
    title: 'Frequently Asked\nQuestions',
    subtitle: 'Get clear answers about our career openings.',
    contactText: 'Still got questions?',
    contactLabel: 'Reach Out to Us',
    contactImage: 'https://c.animaapp.com/09apcVRN/img/main@2x.png',
    faqs: [
      { id: crypto.randomUUID(), question: 'How Can I Apply for a Job at Ultahost?' },
      { id: crypto.randomUUID(), question: 'Does Ultahost Offer Remote or Hybrid Positions?' },
      { id: crypto.randomUUID(), question: "What's the Recruitment Process Like at Ultahost?" },
      { id: crypto.randomUUID(), question: 'Can I Apply for Multiple Positions at Once?' },
      { id: crypto.randomUUID(), question: 'Does Ultahost Offer Internships or Entry-level Opportunities?' },
      { id: crypto.randomUUID(), question: 'What Makes Ultahost a Great Place to Work?' },
      { id: crypto.randomUUID(), question: 'How many people work at Ultahost in 2025?' },
      { id: crypto.randomUUID(), question: 'Is It Necessary to Have a Web Hosting Plan to Use Private Email?' },
      { id: crypto.randomUUID(), question: 'What Salary Range Can I Expect at Ultahost?' },
    ],
  },
  description: 'Job post FAQ accordion with contact CTA on the left panel.',
  usesDataWrapper: true,
  pageGroup: 'V2 Job Post',
  pageGroupOrder: 4,
  translatableProps: ['title', 'subtitle', 'contactText', 'contactLabel', 'faqs.*.question', 'faqs.*.answer'],
  dndArrays: [{ path: 'faqs', strategy: 'vertical' }],
});
