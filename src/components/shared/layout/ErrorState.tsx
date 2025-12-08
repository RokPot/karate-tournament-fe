import { Button } from "@mui/material";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { ErrorHandler } from "@/util/vendor/error-handling";

interface IProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({ error, onRetry, className }: IProps) => {
  const { t } = useTranslation();

  return (
    <div className={clsx("flex flex-col items-center justify-center gap-2 text-center", className)}>
      <Typography size="body-paragraph-lg" className="text-danger">
        {ErrorHandler.getErrorMessage(error)}
      </Typography>

      {onRetry && (
        <Button type="button" onClick={onRetry} variant="contained">
          {t("shared.errorState.retryBtn")}
        </Button>
      )}
    </div>
  );
};
