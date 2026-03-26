// HostOnce Homepage - Professional Landing Page
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { SEOHead } from '@/components/SEOHead';
import HeroSection from '@/components/landing/HeroSection';
import TrustedBySection from '@/components/landing/TrustedBySection';
import HostingServicesSection from '@/components/landing/HostingServicesSection';
import WhyChooseSection from '@/components/landing/WhyChooseSection';
import HostOnceSection from '@/components/landing/HostOnceSection';
import DomainSection from '@/components/landing/DomainSection';
import AIBuilderSection from '@/components/landing/AIBuilderSection';
import AIAssistantSection from '@/components/landing/AIAssistantSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import MigrationSection from '@/components/landing/MigrationSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import NeedHelpSection from '@/components/landing/NeedHelpSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';

const Index = () => {
  return (
    <PageLayout>
      <SEOHead 
        title="HostOnce - Web Hosting That Scales With You"
        description="Reliable, fast, and secure hosting solutions for your business. VPS hosting, shared hosting, domain registration and more."
        keywords="web hosting, VPS hosting, cloud hosting, domain registration, shared hosting"
        ogType="website"
        twitterCard="summary_large_image"
      />
      <HeroSection />
      <TrustedBySection />
      <HostingServicesSection />
      <WhyChooseSection />
      <HostOnceSection />
      <DomainSection />
      <AIBuilderSection />
      <AIAssistantSection />
      <FeaturesSection />
      <MigrationSection />
      <TestimonialsSection />
      <NeedHelpSection />
      <FAQSection />
      <CTASection />
    </PageLayout>
  );
};

export default Index;
