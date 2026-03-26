import type { LegalContentSection } from '@/types/newSectionTypes';

export const complaintsPolicyContent: LegalContentSection[] = [
  // ── 1. Our Commitment ──────────────────────────────────────────────────────
  {
    heading: '1. Our Commitment',
    paragraphs: [
      'We are committed to providing a high standard of service to all customers. If you are dissatisfied with any aspect of our services, we welcome the opportunity to review and resolve your concerns fairly and promptly.',
    ],
  },

  // ── 2. How to Make a Complaint ─────────────────────────────────────────────
  {
    heading: '2. How to Make a Complaint',
    paragraphs: [
      'Customers may submit a complaint by completing the contact form available at: [[ultahost.com/contact]]',
      'When submitting a complaint, please include:',
    ],
    lists: {
      items: [
        'Your name and contact details',
        'The domain name(s) or service concerned',
        'A clear description of the issue',
      ],
    },
    trailingParagraphs: [
      'This information helps us investigate and resolve complaints efficiently.',
    ],
  },

  // ── 3. Acknowledgement and Response Times ─────────────────────────────────
  {
    heading: '3. Acknowledgement and Response Times',
    lists: {
      items: [
        'All complaints will be acknowledged within 5 business days of receipt.',
        'We will investigate the complaint and aim to provide a substantive response as soon as reasonably possible.',
        'If additional time is required due to the complexity of the matter, we will keep the customer informed of progress.',
      ],
    },
  },

  // ── 4. Escalation Process ─────────────────────────────────────────────────
  {
    heading: '4. Escalation Process',
    paragraphs: [
      'If a customer is not satisfied with the initial response or resolution, they may request escalation of their complaint.',
    ],
    lists: {
      items: [
        'Escalated complaints will be reviewed by a senior member of the team who was not involved in the initial response.',
        'A further response will be provided outlining our findings and any actions taken.',
      ],
    },
  },

  // ── 5. Final Review ───────────────────────────────────────────────────────
  {
    heading: '5. Final Review',
    paragraphs: [
      'If the customer remains dissatisfied following escalation, they may request a final internal review. Our final response will clearly outline our position and conclude our internal complaints handling process.',
    ],
  },

  // ── 6. External Escalation ────────────────────────────────────────────────
  {
    heading: '6. External Escalation',
    paragraphs: [
      'After completion of our internal complaints process, customers may have the right to raise the matter with relevant third parties such as the applicable domain registry or dispute resolution providers, in accordance with their policies.',
    ],
  },

  // ── 7. Record Keeping ─────────────────────────────────────────────────────
  {
    heading: '7. Record Keeping',
    paragraphs: [
      'We maintain records of complaints and their outcomes to support continuous service improvement and ensure compliance with applicable registry requirements.',
    ],
  },
];
