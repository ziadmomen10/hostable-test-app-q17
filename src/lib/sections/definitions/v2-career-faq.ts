import { HelpCircle } from 'lucide-react';
import { V2CareerFaqSection } from '@/components/design-v2/sections/V2CareerFaqSection';
import V2CareerFaqSettingsContent from '@/components/admin/sections/V2CareerFaqSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-career-faq',
  displayName: 'V2 Career FAQ',
  icon: HelpCircle,
  category: 'content',
  component: V2CareerFaqSection,
  settingsComponent: createSettingsWrapper(V2CareerFaqSettingsContent),
  defaultProps: {
    title: 'Frequently Asked\nQuestions',
    subtitle: 'Get clear answers about our career openings.',
    contactText: 'Still got questions?',
    contactLabel: 'Reach Out to Us',
    contactImage: 'https://c.animaapp.com/gD1ZRAUQ/img/main@2x.png',
    faqs: [
      { question: 'How Can I Apply for a Job at Ultahost?', answer: '' },
      { question: 'Does Ultahost Offer Remote or Hybrid Positions?', answer: '' },
      { question: "What's the Recruitment Process Like at Ultahost?", answer: '' },
      { question: 'Can I Apply for Multiple Positions at Once?', answer: '' },
      { question: 'Does Ultahost Offer Internships or Entry-level Opportunities?', answer: '' },
      { question: 'What Makes Ultahost a Great Place to Work?', answer: '' },
      { question: 'How many people work at Ultahost in 2025?', answer: '' },
      { question: 'Is It Necessary to Have a Web Hosting Plan to Use Private Email?', answer: '' },
      { question: 'What Salary Range Can I Expect at Ultahost?', answer: '' },
    ],
  },
  description: 'V2 career page FAQ section with two-column layout and accordion.',
  usesDataWrapper: true,
  pageGroup: 'V2 Career Page',
  pageGroupOrder: 6,
  translatableProps: [
    'title', 'subtitle', 'contactText', 'contactLabel',
    'faqs.0.question', 'faqs.1.question', 'faqs.2.question',
    'faqs.3.question', 'faqs.4.question', 'faqs.5.question',
    'faqs.6.question', 'faqs.7.question', 'faqs.8.question',
  ],
  dndArrays: [{ path: 'faqs', strategy: 'vertical', handlePosition: 'left' }],
});
