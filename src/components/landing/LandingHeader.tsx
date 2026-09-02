import { Button } from "@mui/material";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useLandingScrollContainer } from "@/components/landing/LandingScrollContext";
import { Link } from "@/components/ui/text/Link/Link";
import { RouteConfig } from "@/config/route.config";
import logo from "src/assets/images/logo-4.png";

export const LandingHeader = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const container = useLandingScrollContainer();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll({ container });
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  const headerHeight = useTransform(scrollY, [0, 120], [72, 60]);
  const logoScale = useTransform(scrollY, [0, 120], [1, 0.82]);

  return (
    <motion.header
      style={{
        height: shouldReduceMotion ? 72 : headerHeight,
      }}
      className={`sticky top-0 z-20 flex items-center justify-between px-4 transition-colors duration-300 t:px-10 m:px-16 ${
        isScrolled
          ? "border-b border-primary-300/80 bg-primary-200/90 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Link href={RouteConfig.home} className="flex items-center no-underline!">
        <motion.div style={{ scale: shouldReduceMotion ? 1 : logoScale }}>
          <Image src={logo} alt={t("appName")} width={52} height={52} />
        </motion.div>
      </Link>
      <nav className="flex items-center gap-3">
        <Link href="#features" className="hidden no-underline! t:inline">
          {t("landing.header.features")}
        </Link>
        <Button variant="outlined" onClick={() => router.push(RouteConfig.signin)}>
          {t("landing.header.signIn")}
        </Button>
        <Button variant="contained" onClick={() => router.push(RouteConfig.signup)}>
          {t("landing.header.getStarted")}
        </Button>
      </nav>
    </motion.header>
  );
};
