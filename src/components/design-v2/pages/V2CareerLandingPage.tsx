import { V2CareerHero2Section } from "../sections/V2CareerHero2Section";
import { V2CareerGallery2Section } from "../sections/V2CareerGallery2Section";
import { V2CareerTalentPool2Section } from "../sections/V2CareerTalentPool2Section";
import { V2CareerValues2Section } from "../sections/V2CareerValues2Section";
import { V2CareerBenefits2Section } from "../sections/V2CareerBenefits2Section";
import { V2CareerFaq2Section } from "../sections/V2CareerFaq2Section";
import { V2CareerCta3Section } from "../sections/V2CareerCta3Section";
import { V2SiteFooterSection } from "../sections/V2SiteFooterSection";

export const V2CareerLandingPage = () => {
  return (
    <main
      className="flex flex-col w-full max-w-[1920px] mx-auto items-start relative bg-white"
      data-model-id="2f3val"
    >
      <V2CareerHero2Section />
      <V2CareerGallery2Section />
      <V2CareerTalentPool2Section />
      <V2CareerValues2Section />
      <V2CareerBenefits2Section />
      <V2CareerFaq2Section />
      <V2CareerCta3Section />
      <V2SiteFooterSection />
    </main>
  );
};
