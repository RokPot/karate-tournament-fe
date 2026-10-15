import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { RegistrationsModels } from "@/data/registrations/registrations.models";

interface RosterSavedResultsProps {
  roster: RegistrationsModels.RosterResponseDto;
  onEdit: () => void;
  onDone: () => void;
}

export function RosterSavedResults({
  roster,
  onEdit,
  onDone,
}: RosterSavedResultsProps) {
  const { t } = useTranslation();
  const total = roster.fees?.total;

  return (
    <div className="flex flex-col items-center gap-6 px-6 py-10">
      <Typography size="h3">
        {t("registrations.public.continue.savedTitle")}
      </Typography>
      <Typography size="body-paragraph-m" className="text-neutral-200">
        {t("registrations.public.continue.savedBody")}
      </Typography>
      {total != null && (
        <Typography size="body-paragraph-m">
          {t("registrations.public.continue.savedFees", {
            total: total.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }),
          })}
        </Typography>
      )}
      <div className="flex flex-row flex-wrap justify-center gap-3">
        <Button variant="contained" onClick={onEdit}>
          {t("registrations.public.continue.editAgain")}
        </Button>
        <Button variant="outlined" onClick={onDone}>
          {t("registrations.public.continue.done")}
        </Button>
      </div>
    </div>
  );
}
