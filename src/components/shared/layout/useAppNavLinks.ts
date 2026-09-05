import { RouteConfig } from "@/config/route.config";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBuilding,
  faHome,
  faTags,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface AppNavLink {
  href: string;
  label: string;
  icon: IconProp;
}

export const useAppNavLinks = (): AppNavLink[] => {
  const { t } = useTranslation();
  const {
    isAdmin,
    isClubOwner,
    isClubCoach,
    isClubCompetitor,
    isFreeCompetitor,
    isJudge,
  } = useAuthRoles();

  return useMemo(() => {
    const home: AppNavLink = {
      href: RouteConfig.dashboard,
      label: t("nav.home"),
      icon: faHome,
    };
    const clubs: AppNavLink = {
      href: RouteConfig.clubs,
      label: t("clubs.title"),
      icon: faBuilding,
    };
    const categories: AppNavLink = {
      href: RouteConfig.categories,
      label: t("shared.categories"),
      icon: faTags,
    };
    const tournaments: AppNavLink = {
      href: RouteConfig.tournaments,
      label: t("shared.tournaments"),
      icon: faTrophy,
    };

    if (isAdmin) {
      return [home, clubs, categories, tournaments];
    }
    if (isClubOwner || isClubCoach) {
      return [home, categories, tournaments];
    }
    if (isClubCompetitor || isFreeCompetitor || isJudge) {
      return [home];
    }
    return [home];
  }, [
    isAdmin,
    isClubCoach,
    isClubCompetitor,
    isClubOwner,
    isFreeCompetitor,
    isJudge,
    t,
  ]);
};
