import { cx } from "class-variance-authority";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Link } from "@/components/ui/text/Link/Link";
import { Typography } from "@/components/ui/text/Typography/Typography";

type TournamentDetailTab = "overview" | "registrations" | "brackets";

type TournamentDetailShellProps = {
  header: ReactNode;
  children: ReactNode;
  tabs: { id: TournamentDetailTab; href: string }[];
  activeTab: TournamentDetailTab;
};

export const TournamentDetailShell = ({
  header,
  children,
  tabs,
  activeTab,
}: TournamentDetailShellProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-secondary-75 p-6">
      {header}
      <nav
        className="flex flex-row flex-wrap gap-1 overflow-x-auto"
        aria-label={t("tournaments.detail.tabs.label")}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              shallow
              className={cx(
                "flex shrink-0 flex-row items-center rounded-m px-3 py-2 no-underline!",
                isActive
                  ? "bg-secondary-100 font-weight-500 text-primary-300"
                  : "text-neutral-500 hover:bg-secondary-100 hover:text-primary-300! dark:text-white",
              )}
            >
              <Typography size="body-paragraph-s" as="span">
                {t(`tournaments.detail.tabs.${tab.id}`)}
              </Typography>
            </Link>
          );
        })}
      </nav>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
};
