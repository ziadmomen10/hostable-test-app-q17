import React from 'react';
import { EditableInline } from '@/components/editor/EditableElement';

interface FooterLink {
  text: string;
  href: string;
  icon?: string;
}

interface SocialLink {
  icon: string;
  alt: string;
  href: string;
}

interface V2SiteFooterSectionProps {
  data?: {
    logoUrl?: string;
    copyrightText?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2SiteFooterSection: React.FC<V2SiteFooterSectionProps> = ({ data, sectionId }) => {
  const logoUrl = data?.logoUrl ?? 'https://c.animaapp.com/L22lErDL/img/logo-1.svg';
  const copyrightText = data?.copyrightText ?? '© 2025 Hostonce - All rights reserved';

  const socialLinks: SocialLink[] = [
    { icon: 'https://c.animaapp.com/L22lErDL/img/social-icons.svg', alt: 'Facebook', href: '#' },
    { icon: 'https://c.animaapp.com/L22lErDL/img/social-icons-1.svg', alt: 'Twitter', href: '#' },
    { icon: 'https://c.animaapp.com/L22lErDL/img/social-icons-2.svg', alt: 'LinkedIn', href: '#' },
    { icon: 'https://c.animaapp.com/L22lErDL/img/social-icons-3.svg', alt: 'Instagram', href: '#' },
  ];

  const hostingSolutions: FooterLink[] = [
    { icon: 'https://c.animaapp.com/L22lErDL/img/icon-25.svg', text: 'Shared Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/L22lErDL/img/icon-26.svg', text: 'Wordpress Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/L22lErDL/img/icon-27.svg', text: 'VPS Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/L22lErDL/img/icon-28.svg', text: 'VDS Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/L22lErDL/img/icon-29.svg', text: 'Dedicated Server Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/L22lErDL/img/icon-30.svg', text: 'Windows VPS Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/L22lErDL/img/icon-31.svg', text: 'Mac Hosting', href: '#' },
  ];

  const domainSolutions: FooterLink[] = [
    { icon: 'https://c.animaapp.com/L22lErDL/img/icon-32.svg', text: 'Domain Names', href: '#' },
    { icon: 'https://c.animaapp.com/L22lErDL/img/icon-33.svg', text: 'SSL Certificates', href: '#' },
    { text: 'WHOIS Checker', href: '#' },
    { text: 'Domain DNS Checker', href: '#' },
    { text: 'Domain SSL Checker', href: '#' },
    { text: 'Website Uptime Checker', href: '#' },
  ];

  const mostPopular: FooterLink[] = [
    { text: 'PHP Hosting', href: '#' },
    { text: 'Linux Hosting', href: '#' },
    { text: 'Node.js Hosting', href: '#' },
    { text: 'CyberPanel Hosting', href: '#' },
    { text: 'ISPmanager Hosting', href: '#' },
  ];

  const hostingServices: FooterLink[] = [
    { text: 'Reseller Hosting', href: '#' },
    { text: 'Social Network Hosting', href: '#' },
    { text: 'Ecommerce Hosting', href: '#' },
    { text: 'Email Hosting', href: '#' },
    { text: 'CRM Hosting', href: '#' },
    { text: 'Envato Hosting', href: '#' },
  ];

  const helpLinks: FooterLink[] = [
    { text: 'Contact Us', href: '#' },
    { text: 'Report Abuse', href: '#' },
    { text: 'Knowledge Base', href: '#' },
    { text: 'Blog', href: '#' },
  ];

  const quickLinks: FooterLink[] = [
    { text: 'USA, VPS', href: '#' },
    { text: 'Europe, Germany VPS', href: '#' },
    { text: 'Canada, Toronto VPS', href: '#' },
    { text: 'Asia, India VPS', href: '#' },
  ];

  const tutorials: FooterLink[] = [
    { text: 'All Tutorials', href: '#' },
    { text: 'WordPress Tutorials', href: '#' },
    { text: 'Domain Tutorials', href: '#' },
    { text: 'SEO Tutorials', href: '#' },
    { text: 'How-To Tutorials', href: '#' },
    { text: 'Hosting Video Tutorials', href: '#' },
  ];

  const information: FooterLink[] = [
    { text: 'About Us', href: '#' },
    { text: 'Affiliate Program', href: '#' },
    { text: 'Data Center & Servers', href: '#' },
    { text: 'UltaHost Reviews', href: '#' },
    { text: 'Partners', href: '#' },
    { text: 'Free Website Migration', href: '#' },
  ];

  const compare: FooterLink[] = [
    { text: 'Bluehost vs. UltaHost', href: '#' },
    { text: 'DreamHost vs. UltaHost', href: '#' },
    { text: 'Contabo vs. UltaHost', href: '#' },
    { text: 'Godaddy vs. UltaHost', href: '#' },
    { text: 'SiteGround vs. UltaHost', href: '#' },
    { text: 'Compare More', href: '#' },
  ];

  const legalLinks: FooterLink[] = [
    { text: 'Cancellation & Refunds Policy', href: '#' },
    { text: 'Terms and Conditions', href: '#' },
    { text: 'Privacy Policy', href: '#' },
    { text: 'Sitemap', href: '#' },
    { text: 'Legal', href: '#' },
  ];

  const linkClass = "relative [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-neutral-600 text-sm tracking-[0] leading-[16.8px] hover:text-colors-neutral-800 transition-colors";

  return (
    <footer className="w-full relative bg-colors-neutral-25">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col items-center justify-center gap-[var(--spacing-10x)] pt-[var(--spacing-30x)] pr-[var(--spacing-60x)] pb-[var(--spacing-30x)] pl-[var(--spacing-60x)]">
        <div className="flex flex-col w-full items-center justify-center gap-[var(--spacing-10x)] relative flex-[0_0_auto]">
          <div className="flex items-center gap-40 relative self-stretch w-full flex-[0_0_auto]">

            {/* Brand column */}
            <div className="flex flex-col w-[207px] h-[486px] items-start justify-between relative">
              <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
                <img
                  className="relative w-[168px] h-8 aspect-[5.25]"
                  alt="Hostonce Logo"
                  src={logoUrl}
                />
                <nav className="flex items-center gap-[var(--spacing-3x)] relative self-stretch w-full flex-[0_0_auto]" aria-label="Social media links">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="flex w-8 h-8 items-center justify-center gap-2.5 p-3 relative rounded-lg border border-solid border-colors-translucent-dark-8 hover:border-colors-neutral-600 transition-colors"
                      aria-label={social.alt}
                    >
                      <img className="relative w-3 h-3 mt-[-2.00px] mb-[-2.00px] ml-[-2.00px] mr-[-2.00px]" alt={social.alt} src={social.icon} />
                    </a>
                  ))}
                </nav>
              </div>
              <img
                className="relative self-stretch w-full flex-[0_0_auto] mb-[-1.00px] ml-[-1.00px]"
                alt="Accepted payment methods"
                src="https://c.animaapp.com/L22lErDL/img/payment-icons.svg"
              />
            </div>

            <div className="relative self-stretch w-px bg-colors-neutral-25 opacity-[0.01]" />

            {/* Link columns */}
            <div className="relative w-[1074px] h-[493px]">
              <nav className="inline-flex flex-col items-start gap-[var(--spacing-4x)] absolute top-0 left-0" aria-label="Hosting Solutions">
                <h3 className="relative w-fit mt-[-1.00px] font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-neutral-700 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)] whitespace-nowrap [font-style:var(--body-small-m-font-style)]">
                  Hosting Solutions
                </h3>
                <ul className="flex flex-col items-start gap-[var(--spacing-4x)] relative self-stretch w-full flex-[0_0_auto]">
                  {hostingSolutions.map((item, index) => (
                    <li key={index} className="inline-flex items-center justify-center gap-[var(--spacing-2x)] relative flex-[0_0_auto]">
                      <img className="relative w-6 h-6" alt="" src={item.icon} />
                      <a href={item.href} className={`${linkClass} w-fit whitespace-nowrap`}>{item.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="inline-flex flex-col items-start gap-[var(--spacing-4x)] absolute top-0 left-[269px]" aria-label="Domain Solutions">
                <h3 className="relative w-fit mt-[-1.00px] font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)] whitespace-nowrap [font-style:var(--body-small-m-font-style)]">
                  Domain Solutions
                </h3>
                <ul className="flex flex-col items-start gap-[var(--spacing-4x)] relative self-stretch w-full flex-[0_0_auto]">
                  {domainSolutions.map((item, index) => (
                    <li key={index} className={item.icon ? "inline-flex items-center justify-center gap-[var(--spacing-2x)] relative flex-[0_0_auto]" : ""}>
                      {item.icon && <img className="relative w-6 h-6" alt="" src={item.icon} />}
                      <a href={item.href} className={`${linkClass} ${item.icon ? "w-fit whitespace-nowrap" : "self-stretch"}`}>{item.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="inline-flex flex-col items-start gap-[var(--spacing-4x)] absolute top-0 left-[502px]" aria-label="Most Popular">
                <h3 className="relative w-fit mt-[-1.00px] font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)] whitespace-nowrap [font-style:var(--body-small-m-font-style)]">
                  Most Popular
                </h3>
                <ul className="inline-flex flex-col items-start gap-[var(--spacing-4x)] relative flex-[0_0_auto]">
                  {mostPopular.map((item, index) => (
                    <li key={index}><a href={item.href} className={linkClass}>{item.text}</a></li>
                  ))}
                </ul>
              </nav>

              <nav className="inline-flex flex-col items-start gap-[var(--spacing-4x)] absolute top-0 left-[723px]" aria-label="Hosting Services">
                <h3 className="relative w-fit mt-[-1.00px] font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)] whitespace-nowrap [font-style:var(--body-small-m-font-style)]">
                  Hosting Services
                </h3>
                <ul className="inline-flex flex-col items-start gap-[var(--spacing-4x)] relative flex-[0_0_auto]">
                  {hostingServices.map((item, index) => (
                    <li key={index}><a href={item.href} className={linkClass}>{item.text}</a></li>
                  ))}
                </ul>
              </nav>

              <nav className="inline-flex flex-col items-start gap-[var(--spacing-4x)] absolute top-0 left-[949px]" aria-label="Help">
                <h3 className="relative w-fit mt-[-1.00px] font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)] whitespace-nowrap [font-style:var(--body-small-m-font-style)]">
                  Help
                </h3>
                <ul className="inline-flex flex-col items-start gap-[var(--spacing-4x)] relative flex-[0_0_auto]">
                  {helpLinks.map((item, index) => (
                    <li key={index}><a href={item.href} className={linkClass}>{item.text}</a></li>
                  ))}
                  <li>
                    <a href="#" className="inline-flex gap-[var(--spacing-2x)] items-center relative flex-[0_0_auto] hover:opacity-80 transition-opacity">
                      <span className={`${linkClass} whitespace-nowrap`}>Career</span>
                      <span className="inline-flex items-center justify-center gap-[var(--spacing-x)] pt-[var(--spacing-x)] pr-[var(--spacing-2x)] pl-[var(--spacing-2x)] pb-1.5 relative flex-[0_0_auto] bg-colors-translucent-primary-8 rounded-[99px] border border-solid border-colors-translucent-primary-8">
                        <span className="relative w-fit mt-[-1.00px] [font-family:'Satoshi-Medium',Helvetica] font-medium text-colors-primary-700 text-[10px] tracking-[0] leading-[10px] whitespace-nowrap">
                          We&apos;re Hiring!
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>

              <nav className="inline-flex flex-col items-start gap-[var(--spacing-4x)] absolute top-[337px] left-0" aria-label="Quick Links">
                <h3 className="relative w-fit mt-[-1.00px] font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)] whitespace-nowrap [font-style:var(--body-small-m-font-style)]">
                  Quick Links
                </h3>
                <ul className="inline-flex flex-col items-start gap-[var(--spacing-4x)] relative flex-[0_0_auto]">
                  {quickLinks.map((item, index) => (
                    <li key={index}><a href={item.href} className={linkClass}>{item.text}</a></li>
                  ))}
                </ul>
              </nav>

              <nav className="inline-flex flex-col items-start gap-[var(--spacing-4x)] absolute top-[269px] left-[269px]" aria-label="Tutorials">
                <h3 className="relative w-fit mt-[-1.00px] font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)] whitespace-nowrap [font-style:var(--body-small-m-font-style)]">
                  Tutorials
                </h3>
                <ul className="inline-flex flex-col items-start gap-[var(--spacing-4x)] relative flex-[0_0_auto]">
                  {tutorials.map((item, index) => (
                    <li key={index}><a href={item.href} className={linkClass}>{item.text}</a></li>
                  ))}
                </ul>
              </nav>

              <nav className="inline-flex flex-col items-start gap-[var(--spacing-4x)] absolute top-[222px] left-[502px]" aria-label="Information">
                <h3 className="relative w-fit mt-[-1.00px] font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)] whitespace-nowrap [font-style:var(--body-small-m-font-style)]">
                  Information
                </h3>
                <ul className="inline-flex flex-col items-start gap-[var(--spacing-4x)] relative flex-[0_0_auto]">
                  {information.map((item, index) => (
                    <li key={index}>
                      {index === 4 ? (
                        <a href={item.href} className="flex gap-[var(--spacing-x)] self-stretch w-full items-center relative flex-[0_0_auto] hover:opacity-80 transition-opacity">
                          <span className={`${linkClass} whitespace-nowrap`}>Servers Status</span>
                          <span className="relative w-4 h-4">
                            <span className="absolute top-0 left-0 w-4 h-4 bg-colors-primary-700 rounded-lg aspect-[1] opacity-10" />
                            <span className="absolute top-[calc(50.00%_-_2px)] left-[calc(50.00%_-_3px)] w-1.5 h-1.5 bg-colors-primary-700 rounded-[3px] aspect-[1]" />
                          </span>
                        </a>
                      ) : (
                        <a href={item.href} className={linkClass}>{item.text}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="inline-flex flex-col items-start gap-[var(--spacing-4x)] absolute top-[255px] left-[723px]" aria-label="Compare">
                <h3 className="relative w-fit mt-[-1.00px] font-body-small-m font-[number:var(--body-small-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-small-m-font-size)] tracking-[var(--body-small-m-letter-spacing)] leading-[var(--body-small-m-line-height)] whitespace-nowrap [font-style:var(--body-small-m-font-style)]">
                  Compare
                </h3>
                <ul className="inline-flex flex-col items-start gap-[var(--spacing-4x)] relative flex-[0_0_auto]">
                  {compare.map((item, index) => (
                    <li key={index}><a href={item.href} className={linkClass}>{item.text}</a></li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <hr className="relative w-px h-[1602px] mt-[-267.50px] mb-[-743.50px] bg-colors-translucent-dark-8 rotate-[-90.00deg] border-0" />

          <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
            <EditableInline sectionId={sectionId} path="copyrightText" className="relative w-fit mt-[-1.00px] [font-family:'Satoshi-Regular',Helvetica] font-normal text-colors-neutral-600 text-sm tracking-[0] leading-[16.8px] whitespace-nowrap">
              {copyrightText}
            </EditableInline>
            <nav className="inline-flex items-center gap-[var(--spacing-6x)] relative flex-[0_0_auto]" aria-label="Legal">
              {legalLinks.map((item, index) => (
                <a key={index} href={item.href} className={`${linkClass} whitespace-nowrap`}>{item.text}</a>
              ))}
            </nav>
          </div>
        </div>

        <div className="absolute top-0 left-[534px] w-px h-[662px] bg-[#ffffff1a]" aria-hidden="true" />
      </div>
    </footer>
  );
};

export default V2SiteFooterSection;
