import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { LandingImagePlaceholder } from "@/components/landing/LandingImagePlaceholder";
import { useLandingScrollContainer } from "@/components/landing/LandingScrollContext";
import { Typography } from "@/components/ui/text/Typography/Typography";

const FEATURES = [
  {
    titleKey: "landing.features.tournaments.title",
    descriptionKey: "landing.features.tournaments.description",
    x: -64,
    y: 32,
  },
  {
    titleKey: "landing.features.categories.title",
    descriptionKey: "landing.features.categories.description",
    x: 0,
    y: 72,
  },
  {
    titleKey: "landing.features.registrations.title",
    descriptionKey: "landing.features.registrations.description",
    x: 64,
    y: 32,
  },
] as const;

export const LandingFeaturesSection = () => {
  const { t } = useTranslation();
  const container = useLandingScrollContainer();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="features" className="bg-primary-75 px-4 py-16 t:px-10 m:px-16 m:py-24">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10">
        <motion.div
          className="flex max-w-[40rem] flex-col gap-3"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4, root: container }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Typography as="h2" size="h2" sizeMobile="h3" variant="prominent-1">
            {t("landing.features.title")}
          </Typography>
          <Typography size="body-paragraph-m" className="text-secondary-200">
            {t("landing.features.subtitle")}
          </Typography>
        </motion.div>
        <div className="grid gap-6 t:grid-cols-2 m:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <motion.article
              key={feature.titleKey}
              className="flex flex-col gap-4 rounded-2xl border border-primary-300 bg-primary-200 p-5"
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: feature.x,
                      y: feature.y,
                      scale: 0.88,
                    }
              }
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3, root: container }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
            >
              <LandingImagePlaceholder
                label={t("landing.features.imageLabel")}
                aspectRatio="aspect-[16/10]"
              />
              <Typography as="h3" size="h5" variant="prominent-1">
                {t(feature.titleKey)}
              </Typography>
              <Typography size="body-paragraph-s" className="text-secondary-200">
                {t(feature.descriptionKey)}
              </Typography>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
