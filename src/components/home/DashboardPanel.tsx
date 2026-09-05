import { PropsWithChildren, ReactNode } from "react";

import { Typography } from "@/components/ui/text/Typography/Typography";

interface DashboardStatCardProps {
  label: string;
  value: number | string;
}

export const DashboardStatCard = ({ label, value }: DashboardStatCardProps) => {
  return (
    <div className="rounded-m bg-tertiary-100 p-4 shadow-2 bg-yellow-gradient-box border border-tertiary-75">
      <Typography size="body-paragraph-s" className="text-secondary-200">
        {label}
      </Typography>
      <Typography size="h2" className="text-tertiary-200">{value}</Typography>
    </div>
  );
};

interface DashboardPanelProps extends PropsWithChildren {
  title?: string;
  action?: ReactNode;
}

export const DashboardPanel = ({ title, action, children }: DashboardPanelProps) => {
  return (
    <section className="rounded-m bg-primary-200 p-4 shadow-1">
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title ? (
            <Typography size="h3">{title}</Typography>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
};
