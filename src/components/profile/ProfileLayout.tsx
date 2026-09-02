import { Link } from "@/components/ui/text/Link/Link";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { RouteConfig } from "@/config/route.config";
import {
  faBuilding,
  faCog,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cx } from "class-variance-authority";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

export const ProfileLayout = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentPath = normalizePath(router.pathname);

  const navItems = [
    {
      href: RouteConfig.profile,
      label: t("profile.nav.overview"),
      icon: faUser,
    },
    {
      href: RouteConfig.profileClub,
      label: t("profile.nav.club"),
      icon: faBuilding,
    },
    {
      href: RouteConfig.profileAccount,
      label: t("profile.nav.account"),
      icon: faLock,
    },
    {
      href: RouteConfig.profilePreferences,
      label: t("profile.nav.preferences"),
      icon: faCog,
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <nav className="flex w-full flex-col gap-1 border-b border-primary-300 bg-primary-75 p-4 md:min-w-[260px] md:max-w-[260px] md:border-b-0 md:border-r">
        <Typography size="h3" className="mb-2 px-3">
          {t("profile.title")}
        </Typography>
        {navItems.map((item) => {
          const isActive = currentPath === normalizePath(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "flex flex-row items-center gap-2 rounded-md px-3 py-2 no-underline!",
                isActive
                  ? "bg-primary-100 font-weight-500 text-tertiary-300"
                  : "text-secondary-500 hover:bg-primary-100 hover:text-tertiary-300! dark:text-white",
              )}
            >
              <FontAwesomeIcon icon={item.icon} className="w-4" />
              <Typography size="body-paragraph-s" as="span">
                {item.label}
              </Typography>
            </Link>
          );
        })}
      </nav>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-4">
        {children}
      </div>
    </div>
  );
};
