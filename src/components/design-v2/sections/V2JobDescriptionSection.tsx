import React from 'react';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';

interface V2JobDescriptionSectionItem {
  title: string;
  content: string;
  hasHighlight: boolean;
}

interface V2JobDescriptionButton {
  text: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

interface V2JobDescriptionContactItem {
  icon: string;
  text: string;
}

interface V2JobDescriptionSectionProps {
  data?: {
    sections?: V2JobDescriptionSectionItem[];
    buttons?: V2JobDescriptionButton[];
    contactItems?: V2JobDescriptionContactItem[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

const defaultSections: V2JobDescriptionSectionItem[] = [
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
];

const defaultButtons: V2JobDescriptionButton[] = [
  { text: 'Apply Now', icon: 'https://c.animaapp.com/L22lErDL/img/icon-9.svg', bgColor: 'bg-[#c9f355]', textColor: 'text-colors-neutral-800' },
  { text: 'Share Job', icon: 'https://c.animaapp.com/L22lErDL/img/icon-10.svg', bgColor: 'bg-colors-neutral-800', textColor: 'text-colors-neutral-25' },
];

const defaultContactItems: V2JobDescriptionContactItem[] = [
  { icon: 'https://c.animaapp.com/L22lErDL/img/icon-11.svg', text: '+1(302) 966-3941' },
  { icon: 'https://c.animaapp.com/L22lErDL/img/icon-12.svg', text: 'hr@ultahost.com' },
];

export const V2JobDescriptionSection: React.FC<V2JobDescriptionSectionProps> = ({ data, sectionId }) => {
  const sections = data?.sections ?? defaultSections;
  const buttons = data?.buttons ?? defaultButtons;
  const contactItems = data?.contactItems ?? defaultContactItems;

  return (
    <section className="w-full relative bg-colors-neutral-25">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col items-center gap-[var(--spacing-15x)] pt-[var(--spacing-15x)] pb-[var(--spacing-15x)] px-0">
        <div className="inline-flex flex-col items-start gap-[var(--spacing-10x)] relative flex-[0_0_auto]">
          {sections.map((section, index) => (
            <article
              key={index}
              className="flex flex-col w-[960px] items-start gap-[var(--spacing-4x)] relative flex-[0_0_auto]"
            >
              <EditableElement as="h2" sectionId={sectionId} path={`sections.${index}.title`} className="relative self-stretch mt-[-1.00px] font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] [font-style:var(--heading-h4-font-style)]">
                {section.title}
              </EditableElement>

              {section.hasHighlight ? (
                <div className="relative self-stretch -ml-3 w-[calc(100%+24px)] flex">
                  <div className="w-1 shrink-0 bg-colors-translucent-dark-8" />
                  <div className="flex-1 bg-colors-translucent-dark-2 py-[var(--spacing-4x)] px-[var(--spacing-4x)]">
                    <EditableElement as="p" sectionId={sectionId} path={`sections.${index}.content`} className="font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] [font-style:var(--body-regular-font-style)] whitespace-pre-line">
                      {section.content}
                    </EditableElement>
                  </div>
                </div>
              ) : (
                <EditableElement as="p" sectionId={sectionId} path={`sections.${index}.content`} className="relative self-stretch font-body-regular font-[number:var(--body-regular-font-weight)] text-colors-neutral-600 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] [font-style:var(--body-regular-font-style)] whitespace-pre-line">
                  {section.content}
                </EditableElement>
              )}
            </article>
          ))}
        </div>

        <div className="inline-flex flex-col items-center gap-[var(--spacing-5x)] relative flex-[0_0_auto]">
          <div className="inline-flex items-center gap-[var(--spacing-4x)] relative flex-[0_0_auto]">
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`all-[unset] box-border items-center justify-center gap-[var(--spacing-2x)] pt-[var(--spacing-5x)] pr-[var(--spacing-8x)] pb-[var(--spacing-5x)] pl-[var(--spacing-8x)] ${button.bgColor} rounded-2xl overflow-hidden inline-flex relative flex-[0_0_auto] cursor-pointer hover:opacity-90 transition-opacity`}
                aria-label={button.text}
              >
                <EditableInline
                  sectionId={sectionId}
                  path={`buttons.${index}.text`}
                  className={`relative w-fit mt-[-1.00px] font-body-regular-b font-[number:var(--body-regular-b-font-weight)] ${button.textColor} text-[length:var(--body-regular-b-font-size)] tracking-[var(--body-regular-b-letter-spacing)] leading-[var(--body-regular-b-line-height)] whitespace-nowrap [font-style:var(--body-regular-b-font-style)]`}
                >
                  {button.text}
                </EditableInline>
                <img className="relative w-5 h-5" alt="" src={button.icon} />
              </button>
            ))}
          </div>

          <address className="flex items-center gap-[var(--spacing-4x)] pt-[var(--spacing-5x)] pr-[var(--spacing-8x)] pb-[var(--spacing-5x)] pl-[var(--spacing-8x)] relative flex-[0_0_auto] bg-colors-translucent-dark-2 rounded-2xl not-italic">
            {contactItems.map((contact, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <img
                    className="relative w-px h-6 object-cover"
                    alt=""
                    src="https://c.animaapp.com/L22lErDL/img/line-2.svg"
                  />
                )}
                <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                  <img className="relative w-4 h-4" alt="" src={contact.icon} />
                  <EditableInline sectionId={sectionId} path={`contactItems.${index}.text`} className="relative w-fit mt-[-1.00px] font-body-small font-[number:var(--body-small-font-weight)] text-colors-neutral-800 text-[length:var(--body-small-font-size)] tracking-[var(--body-small-letter-spacing)] leading-[var(--body-small-line-height)] whitespace-nowrap [font-style:var(--body-small-font-style)]">
                    {contact.text}
                  </EditableInline>
                </div>
              </React.Fragment>
            ))}
          </address>
        </div>
      </div>
    </section>
  );
};

export default V2JobDescriptionSection;
