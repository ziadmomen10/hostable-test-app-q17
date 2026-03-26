import type { LegalContentSection } from '@/types/newSectionTypes';

export const cancellationRefundsPolicyContent: LegalContentSection[] = [
  // ── Intro ──────────────────────────────────────────────────────────────────
  {
    heading: '',
    lastRevised: '26/05/2025',
    paragraphs: [
      'Products purchased from UltaHost, inc may be refunded only if canceled within the refund period specified below in this policy. Some products have different policies or requirements for a refund associated with them, including some products that are not eligible for a refund under any circumstance.',
      'Only requests submitted through the Client Area are considered as valid and will be reviewed by The Company. Please see below for refund terms applicable to such products.',
      'After the cancellation becomes effective, Ultahost cannot be held in charge of loss of data due to suspension or termination.',
    ],
    banner: 'Hostonce holds the right to change, update or terminate any aspect of this site or the services, including without limitation of prices and fees for the same, at any time.',
  },

  // ── Standard Refund Terms ──────────────────────────────────────────────────
  {
    heading: 'Standard Refund Terms',
    table: {
      headers: ['Canceled', 'Policy'],
      rows: [
        {
          cells: [
            '1-30 Days',
            [
              'You are eligible for a refund on the hosting services below (Shared, VPS, WordPress, Windows Shared Hosting, Radio Hosting, Reseller Hosting, and Game Hosting).',
              'We are not able to refund Cpanels, or Domain registration fees during initial purchases or renewals.',
            ],
          ],
        },
        {
          cells: [
            '30+ Days',
            'No refunds will be given after 30 days of using one of our services.',
          ],
        },
      ],
    },
    trailingParagraphs: [
      'No Refund After Account Closure. If eligible for a refund, it is necessary for you to request a refund prior to account closure. You may elect to close your account with us at any time, but upon account closure, you will no longer be eligible for a refund as otherwise permitted under this Refund Policy.',
    ],
  },

  // ── 30-day Money-back Restrictions ────────────────────────────────────────
  {
    heading: 'The Following Restrictions and Limitations Apply to Our 30-day Money-back Guarantee:',
    lists: {
      items: [
        'Refunds are not valid for Dedicated Servers Plans, VDS Servers above 96.50$ price, administrative fees, install fees for custom software, or ( cPanels, ispmanager, Cyberpanel Addons, Plesk, SSL certificates), or Domain name purchases.',
        'Standard Refund Offer valid only for the first package purchased for billing accounts less than 30 days old.',
        'Refunds for an account with more than one Hosting order are not eligible. (EX: Buying 3 VPS servers and using them for 20 day then asking for refund)',
        'Adding Funds / Account Credit Balance Deposits are non-refundable.',
        'Plans purchased using a special promotion, promo code, or special discount link, are non-refundable.',
        'Packages paid for with cryptocurrencies, checks, money orders, or bank wire transfers are not eligible for a refund.',
      ],
    },
  },

  // ── Refunds by Hosting Plan ────────────────────────────────────────────────
  {
    heading: 'Refunds by Hosting Plan',
    paragraphs: [
      'The refund policy for hosting accounts has been updated. The following changes are now in effect for all new hosting accounts created on or after 4/1/2022.',
    ],
  },

  // ── Shared & Reseller & WordPress Hosting ─────────────────────────────────
  {
    heading: 'Shared & Reseller & WordPress Hosting',
    isSubSection: true,
    lists: {
      items: [
        'UltaHost offers a full refund on Shared - Reseller -WordPress hosting fees if your plan is canceled within the first 30 days of opening the account. This applies to monthly and annual plans, as biennial and triennial plans are not eligible for a refund.',
        'Yearly plans are refunded the current subscription cost within 30 days of the annual subscription renewal.',
        'Refunds are not available when canceling any contract period on an account with multiple Shared - WordPress Hosting Plans. Offer is valid only for the first package purchased.',
        'If your plan includes a free domain name and you cancel within 1 year, our standard fee of $16.99 for the domain name (and any applicable taxes) (the "Domain Name Fee") will be deducted from your refund.',
      ],
    },
  },

  // ── VPS Hosting ────────────────────────────────────────────────────────────
  {
    heading: 'VPS Hosting (Linux & Windows)',
    isSubSection: true,
    lists: {
      items: [
        'You can cancel your hosting plan within the first 30 days for a full refund.',
        'Refunds are not available when canceling a yearly or biennial or triennial VPS hosting plan.',
        'Offer valid only for the first package purchased for billing accounts less than 30 days old.',
        'Upfront Payments or adding funds to your Account Credit Balance, cannot be refunded after using any of our VPS servers. However, you are free to use the balance to buy any of our services.',
      ],
    },
  },

  // ── VDS Hosting ────────────────────────────────────────────────────────────
  {
    heading: 'VDS Hosting (Linux & Windows & Mac)',
    isSubSection: true,
    lists: {
      items: [
        'You can cancel your hosting plan within the first 7 days for a full refund.',
        'Refunds are not available when canceling a yearly or biennial or triennial VDS hosting plan.',
        'Offer valid only for the first package purchased for billing accounts less than 7 days old, and with VDS purchases of less than 96.50$.',
        'Refunds are not available when canceling any contract period on an account with multiple VDS Servers Plans.',
        'Adding funds to your Account Credit Balance, cannot be refunded after using any of our VDS servers. However, you are free to use the balance to buy any of our services.',
      ],
    },
  },

  // ── Dedicated Server ───────────────────────────────────────────────────────
  {
    heading: 'Dedicated Server (Bare Metal Servers)',
    isSubSection: true,
    lists: {
      items: [
        'Since Ultahost offers free rack installation for all of our dedicated servers, therefore Refunds are not available when canceling any contract period of any of our Dedicated hosting plans.',
      ],
    },
  },

  // ── MAC Hosting ────────────────────────────────────────────────────────────
  {
    heading: 'MAC Hosting',
    isSubSection: true,
    lists: {
      items: [
        'You can cancel your Mac VPS hosting plan within the first 15 days for a full refund.',
        'Our VDS Refund Policy applies also to our MAC VDS hosting plan.',
        'Refunds are not available when canceling any contract period of any of our MAC Dedicated hosting plans.',
      ],
    },
  },

  // ── Other Popular Hosting ──────────────────────────────────────────────────
  {
    heading: 'Other Popular Hosting',
    isSubSection: true,
    lists: {
      items: [
        'You can cancel your Mac VPS hosting plan within the first 15 days for a full refund.',
        'Our VDS Refund Policy applies also to our MAC VDS hosting plan.',
        'Refunds are not available when canceling any contract period of any of our MAC Dedicated hosting plans.',
      ],
    },
  },

  // ── Professional Services ──────────────────────────────────────────────────
  {
    heading: 'Professional Services',
    isSubSection: true,
    lists: {
      items: [
        'If an Expert Service has already been performed, then it is non-refundable (if not yet performed, eligible for a refund within 30 days of the date of the transaction).',
        'This concern needs further check and assistance coming from our Professional Services team.',
        'Please contact our customer service representative for further details.',
      ],
    },
  },

  // ── Chargeback and Disputes ────────────────────────────────────────────────
  {
    heading: 'Chargeback and Disputes',
    paragraphs: [
      'Should you think that your billing or charges are incorrect, it is absolutely necessary for you to reach out to us in writing. We both agree to collaborate with each other honestly and gracefully toward settling any conflict concerning billing. If a "chargeback" or PayPal dispute is triggered due to this disagreement, the Service(s) shall be suspended until the debate has been settled up. For reactivating your Service(s), all pending payments must first be paid off.',
      'In addition to the outstanding balance, there could be a chargeback fee associated with pre-arbitrations and chargebacks. The magnitude of this fee - as well as when it is charged off - depends on your case.',
      'You can find more information about these fees in your billing ticket connected to the respective issue or dispute. If you\'re uncertain where to locate these details, don\'t hesitate to get in touch with us for further assistance!',
      'If a Chargeback is initiated, your Ultahost account will be blocked and you won\'t have the chance to buy or use it again. Also, all data stored in the said Ultahost account like content, features or capacity may be terminated without warning leading to loss of information.',
    ],
  },

  // ── To Resume Your Use ─────────────────────────────────────────────────────
  {
    heading: 'To Resume Your Use of Ultahost Services and Be Able to Once Again Checkout Using a Credit Card, You Must:',
    isSubSection: true,
    lists: {
      items: [
        'To Resolve your disputed transaction, it is necessary to provide either proof of payment or an obscured photo of the credit card with only the first six and last four digits visible.',
        'Pay any applicable fees in full, including any fees and expenses incurred by Ultahost and/or any third-party services for each Chargeback received (including fees for Ultahost Services provided prior to the Chargeback, handling and processing charges, and fees incurred by the payment processor).',
      ],
    },
    trailingParagraphs: [
      'In cases of blatant payment or criminal fraud chargebacks, the service will be discontinued without any opportunity for recovery. This policy is non-negotiable and enforced permanently.',
      'Before filing a Chargeback or reversing any payments made to Ultahost, we strongly encourage you to first contact our Customer Support team. Taking this step will help avoid the unwarranted cancellation of your Ultahost Services and account blockage, along with additional fees for an erroneous chargeback. Furthermore, all charges paid for the services purchased from Ultahost must be re-paid in full if a chargeback is filed without contacting our support team beforehand.',
      'We maintain the right to dispute any Chargeback we receive, including by providing evidence of authorization from the User in question and proof that they made use of our Services. We will give the credit card company or financial institution whatever information is needed to prove this.',
    ],
  },

  // ── Refund Policy for Latin American Customers ─────────────────────────────
  {
    heading: 'Refund Policy for Latin American Customers',
    isSubSection: true,
    paragraphs: [
      'Refunds are available to customers in Latin America under the following circumstances:',
    ],
    lists: {
      noBox: false,
      items: [
        'Unauthorized or fraudulent transactions',
        'Discrepancies between invoiced amounts and website prices',
        'Duplicate charges',
      ],
    },
    trailingParagraphs: [
      'All approved refunds will be processed within five (5) business days of receiving your notification.',
    ],
  },

  // ── Refund FAQs ────────────────────────────────────────────────────────────
  {
    heading: 'Refund FAQs',
    paragraphs: [
      'You can find here a list of frequently asked questions and answers about us.',
    ],
    faq: [
      { question: 'Will I get a refund by changing from a Yearly plan to a Monthly plan?' },
      { question: 'If I cancel hosting services, will I receive a refund automatically?' },
      { question: 'Will I get a refund after Upgrading or Downgrading to a new service?' },
      { question: 'Is Ultahost refundable?' },
      { question: 'How long do Ultahost refunds take?' },
      { question: 'Can you cancel Ultahost domain and get a refund?' },
    ],
  },
];
