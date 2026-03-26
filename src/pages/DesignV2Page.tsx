import React from 'react';
import V2BusinessSuiteSection from '@/components/design-v2/sections/V2BusinessSuiteSection';
import V2HostingOptionsSection from '@/components/design-v2/sections/V2HostingOptionsSection';
import V2SectionBenefits from '@/components/design-v2/sections/V2SectionBenefits';

/**
 * DesignV2Page - Clean skeleton for V2 redesign
 * 
 * Design System Tokens:
 * - Font: Satoshi (loaded via CSS)
 * - Primary gradient: #3E6B03 → #709424 → #9CB751
 * - Neutral scale: 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 * 
 * Send Anima exports section by section to populate this page.
 */
const DesignV2Page: React.FC = () => {
  return (
    <div className="v2-design-scope min-h-screen bg-white font-['Satoshi',sans-serif]">
      {/* V2 Navbar - Coming soon */}
      
      {/* V2 Sections */}
      <main>
        <V2BusinessSuiteSection />
        <V2HostingOptionsSection />
        <V2SectionBenefits />
      </main>
      
      {/* V2 Footer - Coming soon */}
    </div>
  );
};

export default DesignV2Page;
