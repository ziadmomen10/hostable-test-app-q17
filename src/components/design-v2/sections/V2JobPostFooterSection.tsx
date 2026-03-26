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

interface V2JobPostFooterSectionProps {
  data?: {
    logoUrl?: string;
    copyrightText?: string;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2JobPostFooterSection: React.FC<V2JobPostFooterSectionProps> = ({ data, sectionId }) => {
  const logoUrl = data?.logoUrl ?? 'https://c.animaapp.com/aoJp9WE5/img/logo.svg';
  const copyrightText = data?.copyrightText ?? '© 2025 Hostonce - All rights reserved';

  const socialLinks: SocialLink[] = [
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/social-icons.svg', alt: 'Facebook', href: '#' },
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/social-icons-1.svg', alt: 'Twitter', href: '#' },
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/social-icons-2.svg', alt: 'LinkedIn', href: '#' },
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/social-icons-3.svg', alt: 'Instagram', href: '#' },
  ];

  const hostingSolutions: FooterLink[] = [
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/icon.svg', text: 'Shared Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/icon-1.svg', text: 'Wordpress Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/icon-2.svg', text: 'VPS Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/icon-3.svg', text: 'VDS Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/icon-4.svg', text: 'Dedicated Server Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/icon-5.svg', text: 'Windows VPS Hosting', href: '#' },
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/icon-6.svg', text: 'Mac Hosting', href: '#' },
  ];

  const domainSolutions: FooterLink[] = [
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/icon-7.svg', text: 'Domain Names', href: '#' },
    { icon: 'https://c.animaapp.com/aoJp9WE5/img/icon-8.svg', text: 'SSL Certificates', href: '#' },
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

  const linkClass = "font-['Satoshi',Helvetica] font-normal text-colors-neutral-600 text-sm tracking-[0] leading-[1.2] hover:text-colors-neutral-800 transition-colors";
  const headingClass = "font-['Satoshi',Helvetica] font-medium text-colors-neutral-800 text-sm tracking-[0] leading-[1.2] mb-4";

  const LinkColumn: React.FC<{ title: string; links: FooterLink[]; ariaLabel: string; children?: React.ReactNode }> = ({ title, links, ariaLabel, children }) => (
    <nav className="flex flex-col items-start" aria-label={ariaLabel}>
      <h3 className={headingClass}>{title}</h3>
      <ul className="flex flex-col items-start gap-[var(--spacing-3x)] list-none p-0 m-0">
        {links.map((item, index) => (
          <li key={index} className={item.icon ? "inline-flex items-center gap-[var(--spacing-2x)]" : ""}>
            {item.icon && <img className="w-5 h-5" alt="" src={item.icon} />}
            <a href={item.href} className={linkClass}>{item.text}</a>
          </li>
        ))}
        {children}
      </ul>
    </nav>
  );

  return (
    <footer className="w-full relative bg-colors-neutral-25">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col gap-[var(--spacing-10x)] py-[80px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        
        {/* Main grid: brand + link columns */}
        <div className="flex flex-col xl:flex-row gap-10 xl:gap-16">
          {/* Brand column */}
          <div className="flex flex-col w-full xl:w-[200px] shrink-0 gap-6 justify-between">
            <div className="flex flex-col gap-6">
              <img className="w-[168px] h-8 aspect-[5.25]" alt="Hostonce Logo" src={logoUrl} />
              <nav className="flex items-center gap-[var(--spacing-3x)]" aria-label="Social media links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="flex w-8 h-8 items-center justify-center rounded-lg border border-solid border-colors-translucent-dark-8 hover:border-colors-neutral-600 transition-colors"
                    aria-label={social.alt}
                  >
                    <img className="w-3 h-3" alt={social.alt} src={social.icon} />
                  </a>
                ))}
              </nav>
            </div>
            <img
              className="w-full max-w-[200px]"
              alt="Accepted payment methods"
              src="https://c.animaapp.com/aoJp9WE5/img/payment-icons.svg"
            />
          </div>

          {/* Link columns grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 flex-1">
            {/* Row 1 */}
            <LinkColumn title="Hosting Solutions" links={hostingSolutions} ariaLabel="Hosting Solutions" />
            <LinkColumn title="Domain Solutions" links={domainSolutions} ariaLabel="Domain Solutions" />
            <div className="flex flex-col gap-10">
              <LinkColumn title="Most Popular" links={mostPopular} ariaLabel="Most Popular" />
              <LinkColumn title="Information" links={information} ariaLabel="Information" />
            </div>
            <div className="flex flex-col gap-10">
              <LinkColumn title="Hosting Services" links={hostingServices} ariaLabel="Hosting Services" />
              <LinkColumn title="Compare" links={compare} ariaLabel="Compare" />
            </div>
            <div className="flex flex-col gap-10">
              <LinkColumn title="Help" links={helpLinks} ariaLabel="Help">
                <li>
                  <a href="#" className="inline-flex gap-[var(--spacing-2x)] items-center hover:opacity-80 transition-opacity">
                    <span className={`${linkClass} whitespace-nowrap`}>Career</span>
                    <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 bg-colors-translucent-primary-8 rounded-full border border-solid border-colors-translucent-primary-8">
                      <span className="font-['Satoshi',Helvetica] font-medium text-colors-primary-700 text-[10px] tracking-[0] leading-[10px] whitespace-nowrap">
                        We&apos;re Hiring!
                      </span>
                    </span>
                  </a>
                </li>
              </LinkColumn>
              <LinkColumn title="Quick Links" links={quickLinks} ariaLabel="Quick Links" />
              <LinkColumn title="Tutorials" links={tutorials} ariaLabel="Tutorials" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="w-full h-px bg-colors-translucent-dark-8 border-0" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <EditableInline sectionId={sectionId} path="copyrightText" className="font-['Satoshi',Helvetica] font-normal text-colors-neutral-600 text-sm tracking-[0] leading-[1.2] whitespace-nowrap">
            {copyrightText}
          </EditableInline>
          <nav className="flex flex-wrap items-center gap-[var(--spacing-4x)]" aria-label="Legal">
            {legalLinks.map((item, index) => (
              <a key={index} href={item.href} className={`${linkClass} whitespace-nowrap`}>{item.text}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default V2JobPostFooterSection;
