import { Button } from "@mui/material";
import { animate, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { LandingImagePlaceholder } from "@/components/landing/LandingImagePlaceholder";
import { useLandingScrollContainer } from "@/components/landing/LandingScrollContext";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { RouteConfig } from "@/config/route.config";

export const LandingHeroSection = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const container = useLandingScrollContainer();
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    container,
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const mountScale = useMotionValue(shouldReduceMotion ? 1 : 0.62);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.68]);
  const imageScale = useTransform([mountScale, scrollScale], ([mounted, scrolled]) => Number(mounted) * Number(scrolled));

  useEffect(() => {
    if (shouldReduceMotion) {
      mountScale.set(1);
      return () => undefined;
    }

    const controls = animate(mountScale, 1, {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => {
      controls.stop();
    };
  }, [mountScale, shouldReduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[calc(100dvh-72px)] items-center overflow-hidden bg-gold-gradient-subtle px-4 pb-12 pt-8 t:px-10 m:px-16"
    >
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 m:grid-cols-2">
        <motion.div
          className="flex flex-col gap-6"
          style={
            shouldReduceMotion
              ? undefined
              : {
                  y: copyY,
                  opacity: copyOpacity,
                }
          }
        >
          <Typography as="h1" size="display-d6" sizeMobile="h2" variant="prominent-1" className="text-secondary-500">
            {t("landing.hero.title")}
          </Typography>
          <Typography size="body-paragraph-lg" className="max-w-[34rem] text-secondary-200">
            {t("landing.hero.subtitle")}
          </Typography>
          <div>
            <Button variant="contained" size="large" onClick={() => router.push(RouteConfig.signup)}>
              {t("landing.hero.cta")}
            </Button>
          </div>
        </motion.div>
        <motion.div style={shouldReduceMotion ? undefined : { scale: imageScale }} className="origin-center">
          <LandingImagePlaceholder label={t("landing.hero.imageLabel")} aspectRatio="aspect-[4/5] m:aspect-[5/6]" />
        </motion.div>
      </div>
    </section>
  );
};
