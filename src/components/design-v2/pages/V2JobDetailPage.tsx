import { V2JobTitleHeroSection } from "../sections/V2JobTitleHeroSection";
import { V2JobDescriptionSection } from "../sections/V2JobDescriptionSection";
import { V2JobGallerySection } from "../sections/V2JobGallerySection";
import { V2JobFaqSection } from "../sections/V2JobFaqSection";
import { V2JobCtaSection } from "../sections/V2JobCtaSection";
import { V2SiteFooterSection } from "../sections/V2SiteFooterSection";

export const V2JobDetailPage = () => {
  return (
    <main
      className="flex flex-col w-full max-w-[1920px] mx-auto items-start relative bg-white"
      data-model-id="4302:1196628"
    >
      <V2JobTitleHeroSection />
      <V2JobDescriptionSection />
      <V2JobGallerySection />
      <V2JobFaqSection />
      <V2JobCtaSection />
      <V2SiteFooterSection />
    </main>
  );
};
