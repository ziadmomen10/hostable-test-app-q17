import type { LegalListItem, LegalContentSection } from '@/types/newSectionTypes';

export type { LegalListItem, LegalContentSection };

export const cookiePolicyContent: LegalContentSection[] = [
  // Intro paragraph
  {
    heading: "",
    paragraphs: [
      "This Cookie Policy outlines how UltaHost (\"we,\" \"us,\" or \"our\"), a web-based data hosting company, utilizes cookies and similar technologies on our website. As a company operating in the USA, with servers located in the USA, Germany, India, Singapore, and other countries we are committed to ensuring the privacy and security of our users' personal information. This Cookie Policy is governed by privacy laws including but not limited to, the California Consumer Privacy Act (CCPA), General Data Protection Regulation (GDPR) of the European Union, and the Personal Data Protection Act (PDPA) of Singapore.",
    ],
  },

  // ── Introduction ──────────────────────────────────────────────────────────
  {
    heading: "Introduction",
  },
  {
    heading: "What are Cookies?",
    isSubSection: true,
    paragraphs: [
      "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites function more efficiently, provide a better user experience, and collect information about your browsing activities.",
    ],
  },
  {
    heading: "Purpose of this Cookie Policy",
    isSubSection: true,
    paragraphs: [
      "This Cookie Policy explains how we use cookies, the types of cookies we use, and the information we collect through them. By using our website, you consent to the use of cookies in accordance with this policy.",
    ],
  },

  // ── Types of Cookies We Use ───────────────────────────────────────────────
  {
    heading: "Types of Cookies We Use",
  },
  {
    heading: "Necessary Cookies",
    isSubSection: true,
    paragraphs: [
      "Necessary cookies are essential for the proper functioning of our website. They enable you to navigate the site and use its features, such as accessing secure areas or enabling language preferences. These cookies do not gather any personal information and are crucial for the website to perform correctly.",
    ],
  },
  {
    heading: "Performance Cookies",
    isSubSection: true,
    paragraphs: [
      "Performance cookies collect anonymous information about how visitors use our website. They help us understand how users interact with our site, which pages are visited most frequently, and if any errors occur. This data is aggregated and does not identify individuals. We use this information to improve our website's performance and enhance the user experience.",
    ],
  },
  {
    heading: "Functionality Cookies",
    isSubSection: true,
    paragraphs: [
      "Functionality cookies allow our website to remember your choices and preferences, such as login credentials, language selection, or customization options. These cookies enhance your browsing experience by providing personalized features. The information collected by functionality cookies is anonymized and cannot track your browsing activity on other websites.",
    ],
  },
  {
    heading: "Targeting and Advertising Cookies",
    isSubSection: true,
    paragraphs: [
      "Targeting and advertising cookies are used to deliver relevant advertisements to you based on your interests. These cookies track your browsing habits across different websites and may collect personally identifiable information. We do not use these cookies directly, but some third-party services we integrate, such as advertising networks or social media platforms, may use them when you interact with their content on our website.",
    ],
  },
  {
    heading: "Third-Party Cookies",
    isSubSection: true,
    paragraphs: [
      "In addition to the cookies, we use directly, third-party cookies may be placed on your device when you visit our website. These cookies are not under our control, and we recommend reviewing the respective third parties' cookie policies for more information on their practices.",
    ],
  },

  // ── Cookie Consent and Management ────────────────────────────────────────
  {
    heading: "Cookie Consent and Management",
  },
  {
    heading: "Cookie Consent",
    isSubSection: true,
    paragraphs: [
      "When you visit our website for the first time, a cookie banner will appear, requesting your consent to the use of cookies. By clicking \"Accept\" or continuing to use our website without modifying your browser settings, you consent to the use of cookies as described in this policy.",
    ],
  },
  {
    heading: "Managing Cookies",
    isSubSection: true,
    paragraphs: [
      "Most web browsers allow you to manage your cookie preferences. You can configure your browser settings to accept, reject, or delete cookies. Please note that blocking or deleting cookies may affect the functionality and user experience of our website.",
    ],
  },

  // ── Data Protection and Privacy ───────────────────────────────────────────
  {
    heading: "Data Protection and Privacy",
  },
  {
    heading: "Data Collection and Usage",
    isSubSection: true,
    paragraphs: [
      "We respect your privacy and handle your personal information in accordance with our Privacy Policy. The cookies we use do not collect personally identifiable information unless explicitly provided by you.",
    ],
  },
  {
    heading: "Data Transfers",
    isSubSection: true,
    paragraphs: [
      "As an international company, we may transfer personal data collected through cookies to countries outside of your residence. These transfers are necessary for the operation and maintenance of our website and the services we provide. By using our website and accepting this Cookie Policy, you consent to such transfers.",
    ],
  },

  // ── Standalone sections ───────────────────────────────────────────────────
  {
    heading: "Data Retention",
    paragraphs: [
      "We retain personal data collected through cookies for as long as necessary to fulfill the purposes outlined in this clause unless a longer retention period is required or permitted by law. The specific retention period may depend on the type of personal data collected and the context in which it was obtained.",
    ],
  },
  {
    heading: "Data Sharing and International Transfers",
    paragraphs: [
      "We may share personal data collected through cookies with trusted third-party service providers who assist us in operating our website, analyzing data, and providing related services. These service providers are contractually bound to process personal data only on our behalf and in accordance with our instructions.",
      "In certain circumstances, we may also disclose personal data if required by law or to protect our legal rights.",
      "Please note that personal data collected through cookies may be transferred to and processed in countries other than your own, including countries outside the European Economic Area (EEA). When we transfer personal data to countries that may not provide the same level of data protection as your jurisdiction, we will implement appropriate safeguards as required by applicable data protection laws.",
    ],
  },
  {
    heading: "Your Rights and Choices",
    paragraphs: [
      "As a data subject, you have certain rights regarding the personal data we hold about you. These rights may include the right to access, correct, update, delete, or restrict the processing of your personal data. You may also have the right to object to the processing of your personal data or withdraw your consent, where applicable.",
      "To exercise your rights or make any requests related to your personal data, please contact us using the information provided in our [[Privacy Policy]].",
    ],
  },

  // ── Use of Information ────────────────────────────────────────────────────
  {
    heading: "Use of Information",
    paragraphs: [
      "As a data subject, you have certain rights regarding the personal data we hold about you. These rights may include the right to access, correct, update, delete, or restrict the processing of your personal data. You may also have the right to object to the processing of your personal data or withdraw your consent, where applicable.",
      "To exercise your rights or make any requests related to your personal data, please contact us using the information provided in our [[Privacy Policy]].",
    ],
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Enhancing Website Functionality and Performance",
          subItems: [
            "The information collected through cookies is primarily used to enhance the functionality and performance of our website. We may use this information to:",
            "Ensure proper website operation: Cookies enable essential features such as secure login, language preferences, and user interface customization. The collected information helps us deliver a seamless and personalized browsing experience.",
            "Optimize website performance: By analyzing data collected through cookies, we gain insights into user behavior, preferences, and trends. This analysis allows us to improve our website's performance, user experience, and overall functionality.",
          ],
        },
      ],
    },
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Personalization and Communication",
          subItems: [
            "We may use the information collected through cookies to personalize your browsing experience and communicate with you. This includes:",
            "Remembering your preferences: Cookies allow us to remember your preferences, such as language selection, region, or customization options. This personalization enhances your user experience and makes subsequent visits more convenient.",
            "Communication and engagement: If you provide your contact information or subscribe to our services, we may use the collected information to communicate with you, respond to your inquiries, and provide information about our products, services, and promotions.",
          ],
        },
      ],
    },
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Analytics and Research",
          subItems: [
            "We utilize the information collected through cookies for analytics and research purposes. This includes:",
            "Website analytics: We analyze aggregated data to understand website usage, visitor demographics, and other metrics. This analysis helps us measure the effectiveness of our marketing efforts, optimize our services, and improve the overall user experience.",
            "Research and development: The data collected through cookies aids in conducting research and development activities to enhance our products, services, and technologies. This includes identifying market trends, evaluating customer preferences, and developing new features and functionalities.",
          ],
        },
      ],
    },
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Legal Compliance and Security",
          subItems: [
            "We may use the information collected through cookies to ensure compliance with applicable laws, regulations, and industry standards. This includes:",
            "Compliance with legal obligations: The information collected through cookies helps us fulfil our legal obligations, respond to lawful requests, and comply with applicable regulations, such as data protection and privacy laws.",
            "Security and fraud prevention: We employ measures to protect our website and users' information from unauthorized access, misuse, or fraudulent activities. The information collected through cookies helps us monitor and detect security threats and prevent potential risks.",
          ],
        },
      ],
    },
  },

  // ── Rights of Data Owner ──────────────────────────────────────────────────
  {
    heading: "Rights of Data Owner",
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Right to Access and Transparency",
          subItems: [
            "You have the right to access the personal information that we collect through cookies and understand how it is used. This includes the right to:",
            "Request information: You can request details about the personal data we hold about you, the purposes of processing, and any third parties with whom we share your data.",
            "Obtain a copy: Upon request, we will provide you with a copy of your personal data in a structured, commonly used, and machine-readable format, where feasible.",
          ],
        },
      ],
    },
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Right to Rectification and Update",
          subItems: [
            "You have the right to ensure the accuracy and completeness of your personal information. If you believe that the information collected through cookies is inaccurate or outdated, you can exercise the right to rectification by:",
            "Requesting correction: You can request us to correct any inaccurate or incomplete personal data we hold about you.",
            "Providing updates: You have the responsibility to inform us of any changes or updates to your personal data to ensure its accuracy.",
          ],
        },
      ],
    },
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Right to Erasure (Right to be Forgotten)",
          subItems: [
            "You have the right to request the deletion or removal of your personal information collected through cookies in certain circumstances. This includes situations where:",
            "The data is no longer necessary for the purposes for which it was collected.",
            "You withdraw your consent and there is no other legal basis for processing.",
            "You object to the processing, and there are no overriding legitimate grounds for continued processing.",
            "The data was unlawfully processed.",
            "The data must be erased to comply with a legal obligation.",
          ],
        },
      ],
    },
  },
  // Closing note for Right to Erasure - separate paragraph outside grey box
  {
    heading: "",
    paragraphs: [
      "Please note that this right is subject to legal obligations and legitimate interests that may require us to retain certain data for a specified period.",
    ],
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Right to Restrict Processing",
          subItems: [
            "You have the right to request the restriction of processing of your personal data in certain situations. This means that we will store your personal information but not actively process it. You can exercise this right:",
            "When you contest the accuracy of your personal data, and we are verifying its accuracy.",
            "When the processing is unlawful, and you request restriction instead of deletion.",
            "When we no longer need the data, but you require it for the establishment, exercise, or defence of legal claims.",
            "When you have objected to the processing, pending the verification of whether our legitimate grounds override your rights.",
          ],
        },
      ],
    },
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Right to Data Portability",
          subItems: [
            "You have the right to receive your personal data, which you have provided to us, in a structured, commonly used, and machine-readable format. You can also request us to transmit this data to another data controller, where technically feasible.",
          ],
        },
      ],
    },
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Right to Object",
          subItems: [
            "You have the right to object to the processing of your personal data based on legitimate interests or for direct marketing purposes. If you object to such processing, we will cease processing your data unless we can demonstrate compelling legitimate grounds that override your interests, rights, and freedoms.",
          ],
        },
      ],
    },
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Right to Withdraw Consent",
          subItems: [
            "If we rely on your consent as the legal basis for processing your personal data collected through cookies, you have the right to withdraw your consent at any time. This withdrawal does not affect the lawfulness of processing based on consent before its withdrawal.",
          ],
        },
      ],
    },
  },
  {
    heading: "",
    lists: {
      items: [
        {
          text: "Exercising Your Rights and Contacting Us",
          subItems: [
            "To exercise your rights as a data owner/user or make any requests related to your personal data collected through cookies, please contact us using the information provided in our Privacy Policy. We will promptly review and respond to your requests in accordance with applicable data protection laws.",
          ],
        },
      ],
    },
  },

  // Green banners
  {
    heading: "",
    banner: "Note: Certain rights may be subject to exceptions or limitations under the applicable laws. We will inform you of any such exceptions or limitations when you exercise your rights.",
  },
  {
    heading: "",
    banner: "Note: In certain circumstances, as required by law, we may withhold access to your information or we may not consent to your request when we have the right to do so under applicable data protection legislation.",
  },

  // ── Cookie Tables ─────────────────────────────────────────────────────────
  {
    heading: "The Hostonce Specifically Website Uses the Following Cookies:",
    paragraphs: [
      "slaask-token-spk-xxx-xxx-xxx-xxx-xxx: This is a cookie used by our chat support software, it allows the proper functioning of the chat system while you are browsing.",
    ],
  },
  {
    heading: "The Hostonce Customer Area Uses the Following Cookies:",
    lists: {
      plain: false,
      noBox: true,
      items: [
        "WHMCSxxxxxxxxx: This is a session cookie used by our customer area to ensure that you are properly logged into your customer account.",
        "_GRECAPTCHA: This is a cookie used by our Google Recaptcha anti-robot system.",
        "slaask-token-spk-xxx-xxx-xxx-xxx-xxx: This is a cookie used by our chat support software, it allows the proper functioning of the chat system while you are browsing.",
        "stripe_mid: This is a cookie used by our payment processor by credit card Stripe, this cookie allows an anti-fraud analysis when paying by credit card.",
      ],
    },
  },

  // ── Closing ───────────────────────────────────────────────────────────────
  {
    heading: "",
    paragraphs: [
      "If you would like more information regarding the processing of your personal data or if you wish to exercise your rights, please contact us at [[info@ultahost.com]]",
      "You have the right to lodge a complaint with the relevant supervisory authority (data protection).",
    ],
  },
];
