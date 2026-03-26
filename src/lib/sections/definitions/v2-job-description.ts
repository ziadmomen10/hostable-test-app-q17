import { FileText } from 'lucide-react';
import { V2JobDescriptionSection } from '@/components/design-v2/sections/V2JobDescriptionSection';
import V2JobDescriptionSettingsContent from '@/components/admin/sections/V2JobDescriptionSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-job-description',
  displayName: 'V2 Job Description',
  icon: FileText,
  category: 'content',
  component: V2JobDescriptionSection,
  settingsComponent: createSettingsWrapper(V2JobDescriptionSettingsContent),
  defaultProps: {
    sections: [
      {
        title: 'About the Role',
        content: 'UltaHost is seeking a results-driven Business Development Manager to lead new revenue opportunities, form strategic partnerships, and expand our global presence in hosting, cloud, and SaaS markets. You will be responsible for identifying new business segments, negotiating high-impact deals, and building B2B pipelines that support UltaHost\'s international growth strategy.\n\nYou will work closely with executive leadership, marketing, and technical teams to deliver commercial deals that scale our infrastructure, reseller network, affiliate operations, and SaaS partnerships.',
        hasHighlight: false,
      },
      {
        title: 'Key Responsibilities',
        content: '•  Identify, qualify, and pursue new B2B opportunities and strategic partners\n•  Develop and manage a pipeline of commercial deals in hosting, tech, and SaaS sectors\n•  Close reseller and white-label hosting agreements in priority markets\n•  Support entry into new regions (India, UK, Brazil, MENA) by negotiating local partnerships\n•  Manage partnerships with SaaS vendors (e.g., Extendify, payment gateways, control panel tools)\n•  Work closely with legal and infrastructure teams on contracts, pricing, and delivery\n•  Track revenue KPIs, forecast growth impact, and report to executive team\n•  Propose and execute go-to-market campaigns with commercial partners\n•  Coordinate with the marketing team for co-branded promotions, joint webinars, or integrations\n•  Represent UltaHost at conferences, expos, and business forums (online or in-person)',
        hasHighlight: true,
      },
      {
        title: 'Requirements',
        content: '•  4+ years in business development, partnerships, or strategic sales (preferably in hosting, SaaS, or tech)\n•  Proven ability to close commercial deals and build lasting partner relationships\n•  Strong negotiation, communication, and cross-functional coordination skills\n•  Familiarity with web hosting industry products and competitive landscape\n•  Experience working with affiliate systems, reseller models, or SaaS integration partners\n•  Fluent in English (additional languages are a plus: Arabic, Turkish, Spanish, Portuguese)\n•  Comfortable using CRM tools and reporting deal pipelines to leadership\n•  Able to travel for partnership events or vendor meetings if required',
        hasHighlight: true,
      },
      {
        title: 'Nice to Have',
        content: '•  Hosting background (reseller, B2B infrastructure, domain sales, etc.)\n•  Experience managing LTO (Lease-to-Own) or hardware vendor relationships\n•  Network of contacts in the cloud/hosting or software integration space\n•  Experience working with procurement, contract negotiation, and international tax/legal teams',
        hasHighlight: true,
      },
      {
        title: 'What We Offer',
        content: '•  Competitive salary plus commission and performance bonuses\n•  High-impact role with direct access to CEO and leadership\n•  Full remote flexibility or Dubai HQ access\n•  Opportunity to shape UltaHost\'s commercial growth and global expansion strategy',
        hasHighlight: true,
      },
    ],
    buttons: [
      { text: 'Apply Now', icon: 'https://c.animaapp.com/L22lErDL/img/icon-9.svg', bgColor: 'bg-[#c9f355]', textColor: 'text-colors-neutral-800' },
      { text: 'Share Job', icon: 'https://c.animaapp.com/L22lErDL/img/icon-10.svg', bgColor: 'bg-colors-neutral-800', textColor: 'text-colors-neutral-25' },
    ],
    contactItems: [
      { icon: 'https://c.animaapp.com/L22lErDL/img/icon-11.svg', text: '+1(302) 966-3941' },
      { icon: 'https://c.animaapp.com/L22lErDL/img/icon-12.svg', text: 'hr@ultahost.com' },
    ],
  },
  description: 'Job description with content sections, action buttons, and contact info.',
  usesDataWrapper: true,
  pageGroup: 'V2 Job Detail',
  pageGroupOrder: 2,
  translatableProps: ['sections.*.title', 'sections.*.content', 'buttons.*.text'],
  dndArrays: [],
});
