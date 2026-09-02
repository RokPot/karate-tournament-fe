import { useTranslation } from "react-i18next";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingScrollProvider } from "@/components/landing/LandingScrollContext";
import { LandingCtaSection } from "@/components/landing/sections/LandingCtaSection";
import { LandingFeaturesSection } from "@/components/landing/sections/LandingFeaturesSection";
import { LandingHeroSection } from "@/components/landing/sections/LandingHeroSection";
import { useLenisScroll } from "@/components/landing/useLenisScroll";
import { AppHead } from "@/components/shared/head/AppHead";

const LandingPage = () => {
  const { t } = useTranslation();
  useLenisScroll();

  return (
    <>
      <AppHead title={t("landing.head.title")} description={t("landing.head.description")} />
      <LandingScrollProvider>
        <div id="landing-scroll-content" className="flex flex-col">
          <LandingHeader />
          <LandingHeroSection />
          <LandingFeaturesSection />
          <LandingCtaSection />
        </div>
      </LandingScrollProvider>
    </>
  );
};

export default LandingPage;
