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
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
      <div className="flex flex-col gap-3">
        <Typography size="h2">{t("profile.title")}</Typography>
        <nav className="flex flex-row flex-wrap gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = currentPath === normalizePath(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "flex shrink-0 flex-row items-center gap-2 rounded-m px-3 py-2 no-underline!",
                  isActive
                    ? "bg-secondary-100 font-weight-500 text-primary-300"
                    : "text-neutral-500 hover:bg-secondary-100 hover:text-primary-300! dark:text-white",
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
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-5">{children}</div>
    </div>
  );
};
