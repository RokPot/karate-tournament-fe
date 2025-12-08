import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

import { ThinPageWrapper } from "@/components/shared/layout/ThinPageWrapper";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { RouteConfig } from "@/config/route.config";
import { ErrorHandler } from "@/util/vendor/error-handling";

export interface ErrorFallbackProps {
  error: unknown;
  resetError: () => void;
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const { t } = useTranslation();

  const navigateToBugReport = () => {
    const rootUrl = `${window.location.protocol}//${window.location.host}`;
    const bugReportLink = `${rootUrl}${RouteConfig.bugReport}?source=${encodeURIComponent(
      window.location.href,
    )}&message=${encodeURIComponent(ErrorHandler.getErrorMessage(error) || "Something went wrong")}`;
    window.location.assign(bugReportLink);
  };

  return (
    <ThinPageWrapper>
      <main className="flex flex-col items-center justify-center gap-2 p-8">
        <Typography size="special-label-5" variant="prominent-1" as="h2">
          {t("shared.errorFallback.heading")}
        </Typography>
        <Typography size="h4" className="text-danger text-center">
          {t("shared.errorFallback.subheading", {
            error: ErrorHandler.getErrorMessage(error),
          })}
        </Typography>
        <Button variant="outlined" onClick={resetError}>
          {t("shared.errorFallback.retryBtn")}
        </Button>

        <Button type="button" onClick={navigateToBugReport}>
          {t("shared.errorFallback.reportABugBtn")}
        </Button>
      </main>
    </ThinPageWrapper>
  );
};
