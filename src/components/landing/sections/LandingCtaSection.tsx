import { Button } from "@mui/material";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { LandingImagePlaceholder } from "@/components/landing/LandingImagePlaceholder";
import { useLandingScrollContainer } from "@/components/landing/LandingScrollContext";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { RouteConfig } from "@/config/route.config";

export const LandingCtaSection = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const container = useLandingScrollContainer();
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    container,
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const sectionScale = useTransform(scrollYProgress, [0, 0.55], [0.92, 1]);
  const copyX = useTransform(scrollYProgress, [0, 0.55], [-56, 0]);
  const imageX = useTransform(scrollYProgress, [0, 0.55], [72, 0]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.55], [8, 0]);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-gold-gradient px-4 py-16 t:px-10 m:px-16 m:py-24">
      <motion.div
        className="mx-auto grid w-full max-w-[1200px] items-center gap-10 m:grid-cols-[1.2fr_0.8fr]"
        style={shouldReduceMotion ? undefined : { scale: sectionScale }}
      >
        <motion.div
          className="flex flex-col gap-5"
          style={shouldReduceMotion ? undefined : { x: copyX }}
        >
          <Typography as="h2" size="h2" sizeMobile="h3" variant="prominent-1" className="text-secondary-500">
            {t("landing.cta.title")}
          </Typography>
          <Typography size="body-paragraph-m" className="max-w-[34rem] text-secondary-300">
            {t("landing.cta.subtitle")}
          </Typography>
          <div className="flex flex-wrap gap-3">
            <Button variant="contained" onClick={() => router.push(RouteConfig.signup)}>
              {t("landing.cta.primary")}
            </Button>
            <Button variant="outlined" onClick={() => router.push(RouteConfig.signin)}>
              {t("landing.cta.secondary")}
            </Button>
          </div>
        </motion.div>
        <motion.div style={shouldReduceMotion ? undefined : { x: imageX, rotate: imageRotate }}>
          <LandingImagePlaceholder label={t("landing.cta.imageLabel")} aspectRatio="aspect-[16/10]" />
        </motion.div>
      </motion.div>
    </section>
  );
};
