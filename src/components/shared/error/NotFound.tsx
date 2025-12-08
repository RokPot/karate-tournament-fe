import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

import { ThinPageWrapper } from "@/components/shared/layout/ThinPageWrapper";
import { Typography } from "@/components/ui/text/Typography/Typography";

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <ThinPageWrapper>
      <main className="flex flex-col items-center justify-center gap-2 p-8 text-center">
        <Typography size="h2" variant="prominent-1" as="h2">
          {t("shared.notFound.heading")}
        </Typography>
        <Typography size="body-paragraph-m" className="text-danger text-center">
          {t("shared.notFound.subheading")}
        </Typography>
        <Button>{t("shared.notFound.homeBtn")}</Button>
      </main>
    </ThinPageWrapper>
  );
};
