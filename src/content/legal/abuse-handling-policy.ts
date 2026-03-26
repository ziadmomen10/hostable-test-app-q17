import type { LegalContentSection } from '@/types/newSectionTypes';

export const abuseHandlingPolicyContent: LegalContentSection[] = [
  // ── Intro ──────────────────────────────────────────────────────────────────
  {
    heading: '',
    paragraphs: [
      'UltaHost provides both hosting and domain name registration services. All abuse reports involving domain names registered and/or hosted with us are carefully reviewed, investigated, and documented. Where applicable, appropriate action will be taken based on the nature and severity of the reported issue.',
      'For cases involving critical threats, such as phishing, malware distribution, child pornography or other forms of serious abuse, immediate domain suspension may be enforced without prior notice. For less severe abuse alerts, a warning notification will be sent to the domain license holder, allowing them the opportunity to rectify the issue within a specified timeframe.',
      'As an ICANN-accredited registrar, UltaHost strictly adheres to Section 3.18 of the Registrar Accreditation Agreement (RAA), which mandates the timely handling of abuse reports and cooperation with relevant authorities.',
    ],
  },

  // ── Whois Inaccuracy ───────────────────────────────────────────────────────
  {
    heading: 'Who is Inaccuracy',
    lists: {
      items: [
        'Please complete the required fields to [[submit a report]] concerning potential WHOIS Inaccuracy.',
        'Once submitted, you will receive an acknowledgment either automatically or through an Ultahost Abuse representative.',
        'Upon receipt of the report, our Domains Team will contact the Registered Name Holder (RNH), allowing them five (5) days to correct or update the inaccurate contact information.',
        'Failure to address the issue within the given timeframe may result in the suspension of the domain.',
        'In the event of a suspension, the RNH will be formally notified and instructed to submit valid proof confirming that the necessary updates have been made in order to restore the domain.',
        'A response outlining the resolution of the report will be provided to the reporter within 10 days of receipt.',
      ],
    },
  },

  // ── Phishing/419 Scam ──────────────────────────────────────────────────────
  {
    heading: 'Phishing/419 Scam',
    lists: {
      items: [
        'To report suspicious or harmful activity, kindly complete the fields in our [[online form]].',
        'Upon submission, you will either receive an automatic confirmation or be contacted directly by a member of the Ultahost Abuse Team.',
        'Our Abuse Team will thoroughly review the complaint and determine the nature and severity of the issue.',
        'If the domain is found to be compromised or hosting illicit content, a formal warning will be issued to the domain holder. Should the content remain active, suspension of the domain may follow.',
        'For cases involving confirmed malicious intent (such as phishing attempts, malware distribution, financial scams, or child exploitation content), the domain will be immediately disabled without prior notice.',
        'In the event of a suspension, the registrant will be notified and requested to submit valid proof that the reported content or issue has been fully addressed before the domain can be reinstated.',
        'A response outlining the resolution of the report will be provided to the reporter within 10 days of receipt.',
      ],
    },
  },

  // ── Trademark Infringement ─────────────────────────────────────────────────
  {
    heading: 'Trademark Infringement',
    lists: {
      items: [
        'If you are reporting unauthorized use of a trademark or service mark in relation to goods and/or services, we encourage rights holders to seek resolution through established mechanisms such as the Uniform Domain Name Dispute Resolution Policy (UDRP) or the Uniform Rapid Suspension System (URS). For detailed guidance, please refer to: [[ICANN Dispute Resolution Procedures]].',
        'Once a Notification of Complaint is received from the World Intellectual Property Organization (WIPO), the domain name in question will be placed on clientHold status, rendering it inactive.',
        'For ongoing disputes handled by WIPO, we are prepared to provide relevant domain information upon legitimate request.',
        'Following a final decision in a dispute, we will implement the required actions in accordance with the ruling within ten (10) business days of its receipt.',
      ],
    },
  },

  // ── Content Violation ──────────────────────────────────────────────────────
  {
    heading: 'Content Violation',
    lists: {
      items: [
        'When a copyright violation is reported on a domain managed or hosted through Ultahost, our Abuse Team will assess, record, and investigate the claim accordingly.',
        'The Registered Name Holder (RNH) will be notified and requested to either take down the allegedly infringing content or submit valid documentation confirming their right to use it.',
        'If no corrective action is taken within 72 hours of notification, the domain may be subject to suspension.',
        'The complainant will be informed of the result of the investigation within seven (7) days from the date the report was received.',
      ],
    },
  },
];
