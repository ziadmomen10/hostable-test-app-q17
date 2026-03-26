import type { LegalContentSection } from '@/types/newSectionTypes';

export const antiSpamPolicyContent: LegalContentSection[] = [
  // ── Intro ──────────────────────────────────────────────────────────────────
  {
    heading: 'UltaHost Anti-Spam Policy',
    paragraphs: [
      'This Anti-Spam Policy ("Policy") outlines the rules and regulations governing the use of email and messaging services provided by UltaHost ("Company"). By using our services, you agree to comply with this Policy, which is designed to ensure the integrity of our network and protect all users from spam-related activities. Violation of this Policy may result in suspension or termination of your account, as well as potential legal action.',
    ],
  },

  // ── 1. Definition of Spam ──────────────────────────────────────────────────
  {
    heading: '1. Definition of Spam',
    paragraphs: [
      'For the purposes of this Policy, "Spam" refers to any form of unsolicited commercial email ("UCE"), unsolicited bulk email ("UBE"), or any electronic communication that is sent without the explicit consent of the recipient. This includes, but is not limited to:',
    ],
    lists: {
      items: [
        'Sending messages to recipients without their prior opt-in consent.',
        'Sending fraudulent, misleading, or deceptive messages.',
        'Sending messages that contain malicious content, including phishing links, malware, or viruses.',
      ],
    },
  },

  // ── 2. Port 25 Rules ───────────────────────────────────────────────────────
  {
    heading: '2. Port 25 Rules',
    paragraphs: [
      'Port 25 is a common network port used for email communication. To prevent misuse and ensure compliance with anti-spam regulations, UltaHost enforces the following rules regarding Port 25:',
    ],
  },
  {
    heading: '2.1 Default Port 25 Access',
    isSubSection: true,
    lists: {
      items: [
        'Port 25 is open by default for all annual VPS hosting plans, except for the VPS Basic Plan.',
        'VPS Basic Plan customers do not have Port 25 enabled by default.',
      ],
    },
  },
  {
    heading: '2.2 Eligibility for Port 25 Access',
    isSubSection: true,
    lists: {
      items: [
        'Any VPS with a total payment exceeding $117 (whether billed quarterly, semi-annually, or annually, or 2+ years) is eligible to request Port 25 to be opened.',
        "Requests for Port 25 access are subject to review to ensure compliance with UltaHost's Anti-Spam Policy.",
        'For VDS Hosting (whether billed monthly or annually), Port 25 is open by request.',
      ],
    },
  },
  {
    heading: '2.3 Requesting Port 25 Access',
    isSubSection: true,
    lists: {
      items: [
        'Customers eligible for Port 25 access must contact UltaHost Support to submit their request. All requests will be reviewed to verify that the intended usage complies with our policies and does not contribute to spam or abuse.',
      ],
    },
  },
  {
    heading: '2.4 Compliance Monitoring',
    isSubSection: true,
    lists: {
      items: [
        'Accounts with Port 25 access are monitored for compliance with this Policy. Abuse of Port 25 for spamming or other prohibited activities may result in immediate account suspension or termination.',
      ],
    },
  },

  // ── 3. Prohibited Activities ───────────────────────────────────────────────
  {
    heading: '3. Prohibited Activities',
    paragraphs: [
      'The following activities are strictly prohibited when using UltaHost services:',
    ],
  },
  {
    heading: '3.1 Unsolicited Email',
    isSubSection: true,
    paragraphs: [
      'Sending unsolicited bulk or commercial messages, including advertising and promotional content, to individuals or entities who have not consented to receive such messages is prohibited.',
    ],
  },
  {
    heading: '3.2 Email Spoofing',
    isSubSection: true,
    paragraphs: [
      "Using forged email headers or other techniques to disguise the origin of emails sent through UltaHost's network is strictly forbidden.",
    ],
  },
  {
    heading: '3.3 Phishing and Fraudulent Content',
    isSubSection: true,
    paragraphs: [
      'Engaging in phishing activities or attempting to deceive recipients into disclosing sensitive information, such as passwords or financial details, is a violation of this Policy.',
    ],
  },
  {
    heading: '3.4 Use of Automated Tools',
    isSubSection: true,
    paragraphs: [
      'Using bots, scripts, or other automated tools to distribute bulk messages or spam is strictly prohibited.',
    ],
  },
  {
    heading: '3.5 Open Relays',
    isSubSection: true,
    paragraphs: [
      'Operating open email relays or proxies that can be exploited for spam or unsolicited communication is forbidden.',
    ],
  },

  // ── 4. Customer Responsibilities ──────────────────────────────────────────
  {
    heading: '4. Customer Responsibilities',
    paragraphs: [
      'Customers are required to:',
    ],
    lists: {
      items: [
        'Ensure Compliance: Use UltaHost services in compliance with this Policy and applicable laws.',
        'Secure Accounts: Implement strong passwords and security measures to prevent unauthorized access or misuse.',
        'Adopt Opt-In Practices: Use proper opt-in mechanisms for email marketing and provide recipients with a clear and accessible opt-out option.',
        'Monitor Activity: Regularly review account activity for signs of unauthorized or spam-related usage.',
      ],
    },
  },

  // ── 5. Enforcement and Consequences ───────────────────────────────────────
  {
    heading: '5. Enforcement and Consequences',
    paragraphs: [
      'UltaHost reserves the right to take the following actions in response to violations of this Policy:',
    ],
  },
  {
    heading: '5.1 Account Suspension or Termination',
    isSubSection: true,
    paragraphs: [
      'Accounts found in violation of this Policy may be suspended or terminated without prior notice.',
    ],
  },
  {
    heading: '5.2 Financial Penalties',
    isSubSection: true,
    paragraphs: [
      "UltaHost may impose financial penalties to recover costs associated with investigating and mitigating spam-related violations. These penalties may also include compensation for damage caused to UltaHost's reputation or network.",
    ],
  },
  {
    heading: '5.3 Legal Action',
    isSubSection: true,
    paragraphs: [
      'UltaHost will cooperate with law enforcement authorities and may pursue legal action against individuals or entities responsible for spamming or prohibited activities.',
    ],
  },
  {
    heading: '5.4 Blacklist Reporting',
    isSubSection: true,
    paragraphs: [
      'Violators may be reported to email blacklisting organizations, which could restrict future email communications from the violator.',
    ],
  },

  // ── 6. Reporting Violations ────────────────────────────────────────────────
  {
    heading: '6. Reporting Violations',
    paragraphs: [
      'If you suspect that an UltaHost customer is violating this Policy, please report the incident to [Insert Contact Email]. Include detailed information, such as full email headers and message content, to assist in our investigation.',
    ],
  },

  // ── 7. Compliance with Laws ────────────────────────────────────────────────
  {
    heading: '7. Compliance with Laws',
    paragraphs: [
      'This Policy complies with all relevant anti-spam regulations, including but not limited to:',
    ],
    lists: {
      items: [
        'The CAN-SPAM Act (USA): Governs commercial email practices and requires clear opt-out mechanisms.',
        'The General Data Protection Regulation (GDPR) (EU): Establishes lawful usage of personal data in electronic communications.',
        'Other Regional Laws: Includes applicable anti-spam laws in various jurisdictions where UltaHost operates.',
      ],
    },
    trailingParagraphs: [
      'Customers are responsible for understanding and adhering to these laws when using UltaHost services.',
    ],
  },

  // ── 8. Amendments ─────────────────────────────────────────────────────────
  {
    heading: '8. Amendments',
    paragraphs: [
      'UltaHost reserves the right to modify this Policy at any time without prior notice. Continued use of UltaHost services after changes constitutes acceptance of the updated Policy. We encourage customers to review this Policy periodically.',
    ],
  },

  // ── 8. Contact Information ─────────────────────────────────────────────────
  {
    heading: '8. Contact Information',
    paragraphs: [
      'For questions or concerns regarding this Policy, please contact us:',
      'Email: u-abuse@ultahost.com',
      'Effective Date: [21.07.2020]',
      'Last Updated: [27 November 2024]',
      'By using UltaHost services, you acknowledge and agree to comply with this Anti-Spam Policy in its entirety. Non-compliance may result in immediate action, including service suspension or termination. Thank you for your cooperation in maintaining a safe and secure hosting environment.',
    ],
  },
];
