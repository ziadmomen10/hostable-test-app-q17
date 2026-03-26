/**
 * RightSidePanel Component
 * 
 * Right sidebar for the Visual Page Editor containing:
 * - Unified Settings header
 * - Single scrollable area with:
 *   - Element traits when selected
 *   - Section-specific settings (dynamic based on registry)
 *   - Layers panel
 */

import React, { useMemo } from 'react';
import { Layers, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PricingSettingsContent from '../sections/PricingSettingsContent';
import LogoCarouselSettingsContent from '../sections/LogoCarouselSettingsContent';
import FAQSettingsContent from '../sections/FAQSettingsContent';
import FeaturesSettingsContent from '../sections/FeaturesSettingsContent';
import TestimonialsSettingsContent from '../sections/TestimonialsSettingsContent';
import CTASettingsContent from '../sections/CTASettingsContent';
import TrustedBySettingsContent from '../sections/TrustedBySettingsContent';
import HostingServicesSettingsContent from '../sections/HostingServicesSettingsContent';
import WhyChooseSettingsContent from '../sections/WhyChooseSettingsContent';
import HeroSettingsContent from '../sections/HeroSettingsContent';
import NeedHelpSettingsContent from '../sections/NeedHelpSettingsContent';
import StatsCounterSettingsContent from '../sections/StatsCounterSettingsContent';
import StepsSettingsContent from '../sections/StepsSettingsContent';
import AnnouncementBannerSettingsContent from '../sections/AnnouncementBannerSettingsContent';
import IconFeaturesSettingsContent from '../sections/IconFeaturesSettingsContent';
import AlternatingFeaturesSettingsContent from '../sections/AlternatingFeaturesSettingsContent';
import OSSelectorSettingsContent from '../sections/OSSelectorSettingsContent';
import DataCenterSettingsContent from '../sections/DataCenterSettingsContent';
import BentoGridSettingsContent from '../sections/BentoGridSettingsContent';
import AwardsSettingsContent from '../sections/AwardsSettingsContent';
import PlansComparisonSettingsContent from '../sections/PlansComparisonSettingsContent';
import BlogGridSettingsContent from '../sections/BlogGridSettingsContent';
import ContactSettingsContent from '../sections/ContactSettingsContent';
import ServerSpecsSettingsContent from '../sections/ServerSpecsSettingsContent';
import VideoSettingsContent from '../sections/VideoSettingsContent';
import { 
  PricingSectionData, 
  LogoCarouselData,
  FAQSectionData,
  FeaturesSectionData,
  TestimonialsSectionData,
  CTASectionData,
  TrustedBySectionData,
  HostingServicesSectionData,
  WhyChooseSectionData,
  HeroSectionData,
  NeedHelpSectionData,
  StatsCounterSectionData,
  StepsSectionData,
  AnnouncementBannerSectionData,
  IconFeaturesSectionData,
  AlternatingFeaturesSectionData,
  OSSelectorSectionData,
  DataCenterSectionData,
  BentoGridSectionData,
  AwardsSectionData,
  PlansComparisonSectionData,
  BlogGridSectionData,
  ContactSectionData,
  ServerSpecsSectionData,
  VideoSectionData,
  SectionType 
} from '@/types/pageEditor';
import { getSectionConfig } from '../sections/SectionRegistry';

export interface RightSidePanelProps {
  /** Whether an element is currently selected */
  hasSelectedElement: boolean;
  
  // Unified Section Panel
  activeSectionPanel: {
    type: SectionType;
    component: any;
  } | null;
  onSectionPanelClose: () => void;
  onSectionDataChange: (data: any, type: SectionType) => void;
}

// Dynamic section panel that renders the appropriate settings component
const DynamicSectionPanel: React.FC<{
  sectionType: SectionType;
  component: any;
  onClose: () => void;
  onDataChange: (data: any, type: SectionType) => void;
}> = ({ sectionType, component, onClose, onDataChange }) => {
  const config = getSectionConfig(sectionType);
  
  // Memoize parsed data to prevent re-parsing on every render
  const sectionData = useMemo(() => {
    if (!config) return null;
    const attrs = component.getAttributes();
    const el = component.getEl();
    return config.parseData(attrs, el);
  }, [config, component]);
  
  if (!config || !sectionData) return null;

  const Icon = config.icon;

  // Render the appropriate settings component based on section type
  const renderSettingsContent = () => {
    switch (sectionType) {
      case 'pricing':
        return (
          <PricingSettingsContent
            data={sectionData as PricingSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'logo-carousel':
        return (
          <LogoCarouselSettingsContent
            data={sectionData as LogoCarouselData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'hero':
        return (
          <HeroSettingsContent
            data={sectionData as HeroSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'features':
        return (
          <FeaturesSettingsContent
            data={sectionData as FeaturesSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'faq':
        return (
          <FAQSettingsContent
            data={sectionData as FAQSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'testimonials':
        return (
          <TestimonialsSettingsContent
            data={sectionData as TestimonialsSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'cta':
        return (
          <CTASettingsContent
            data={sectionData as CTASectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'trusted-by':
        return (
          <TrustedBySettingsContent
            data={sectionData as TrustedBySectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'hosting-services':
        return (
          <HostingServicesSettingsContent
            data={sectionData as HostingServicesSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'why-choose':
        return (
          <WhyChooseSettingsContent
            data={sectionData as WhyChooseSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'need-help':
        return (
          <NeedHelpSettingsContent
            data={sectionData as NeedHelpSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'stats-counter':
        return (
          <StatsCounterSettingsContent
            data={sectionData as StatsCounterSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'steps':
        return (
          <StepsSettingsContent
            data={sectionData as StepsSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'announcement-banner':
        return (
          <AnnouncementBannerSettingsContent
            data={sectionData as AnnouncementBannerSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'icon-features':
        return (
          <IconFeaturesSettingsContent
            data={sectionData as IconFeaturesSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'alternating-features':
        return (
          <AlternatingFeaturesSettingsContent
            data={sectionData as AlternatingFeaturesSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'os-selector':
        return (
          <OSSelectorSettingsContent
            data={sectionData as OSSelectorSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'data-center':
        return (
          <DataCenterSettingsContent
            data={sectionData as DataCenterSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'bento-grid':
        return (
          <BentoGridSettingsContent
            data={sectionData as BentoGridSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'awards':
        return (
          <AwardsSettingsContent
            data={sectionData as AwardsSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'plans-comparison':
        return (
          <PlansComparisonSettingsContent
            data={sectionData as PlansComparisonSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'blog-grid':
        return (
          <BlogGridSettingsContent
            data={sectionData as BlogGridSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'contact':
        return (
          <ContactSettingsContent
            data={sectionData as ContactSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'server-specs':
        return (
          <ServerSpecsSettingsContent
            data={sectionData as ServerSpecsSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      case 'video':
        return (
          <VideoSettingsContent
            data={sectionData as VideoSectionData}
            onChange={(data) => onDataChange(data, sectionType)}
          />
        );
      default:
        return (
          <div className="p-4 text-center text-xs text-muted-foreground">
            <p>Settings panel for "{sectionType}" coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="border-b">
      <div className="p-2 border-b bg-muted/30 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {config.displayName}
        </span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onClose}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      {renderSettingsContent()}
    </div>
  );
};

export const RightSidePanel: React.FC<RightSidePanelProps> = React.memo(({
  hasSelectedElement,
  activeSectionPanel,
  onSectionPanelClose,
  onSectionDataChange,
}) => {
  return (
    <div className="w-72 h-full border-l bg-card flex flex-col min-h-0 overflow-hidden">
      {/* Fixed Header */}
      <div className="p-3 border-b shrink-0">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </h3>
      </div>
      
      {/* Single Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-auto">
        {/* Element Traits - only when element selected */}
        {hasSelectedElement && (
          <div className="border-b">
            <div className="p-2 border-b bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground">Element Properties</span>
            </div>
            <div id="traits-container" className="p-2" />
          </div>
        )}
        
        {/* Dynamic Section Settings Panel */}
        {activeSectionPanel && (
          <DynamicSectionPanel
            sectionType={activeSectionPanel.type}
            component={activeSectionPanel.component}
            onClose={onSectionPanelClose}
            onDataChange={onSectionDataChange}
          />
        )}
        
        {/* Layers Section */}
        <div>
          <div className="p-2 border-b bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Layers className="h-3 w-3" />
              Layers
            </span>
          </div>
          <div id="layers-container" className="p-2" />
        </div>
      </div>
    </div>
  );
});

RightSidePanel.displayName = 'RightSidePanel';

export default RightSidePanel;
