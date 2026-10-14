import { useTranslation } from "react-i18next";

import { formatEuroAmount } from "@/components/tournaments/TournamentFeeScheduleSummary";
import { Typography } from "@/components/ui/text/Typography/Typography";

import type { DraftFeesEstimate } from "../utils/calculateDraftFees";

interface RegistrationFeesEstimateProps {
  estimate: DraftFeesEstimate;
}

export function RegistrationFeesEstimate({
  estimate,
}: RegistrationFeesEstimateProps) {
  const { t } = useTranslation();

  if (estimate.participants.length === 0 && estimate.teams.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-secondary-300 bg-secondary-75 p-4">
      <Typography size="body-paragraph-m" variant="prominent-2">
        {t("registrations.public.feesEstimate.title")}
      </Typography>
      {estimate.participants.map((line) => (
        <div
          key={line.clientId}
          className="flex items-center justify-between gap-3"
        >
          <Typography size="body-paragraph-s" as="span">
            {t("registrations.submissions.participantFee", {
              name: line.name,
              count: line.categoryCount,
            })}
          </Typography>
          <Typography size="body-paragraph-s" as="span">
            {formatEuroAmount(line.amount)}
          </Typography>
        </div>
      ))}
      {estimate.teams.map((line) => (
        <div
          key={line.clientId}
          className="flex items-center justify-between gap-3"
        >
          <Typography size="body-paragraph-s" as="span">
            {t("registrations.submissions.teamFee", {
              name: line.name,
              category: line.categoryName,
            })}
          </Typography>
          <Typography size="body-paragraph-s" as="span">
            {formatEuroAmount(line.amount)}
          </Typography>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3">
        <Typography size="body-paragraph-m" variant="prominent-2" as="span">
          {t("registrations.submissions.total")}
        </Typography>
        <Typography size="body-paragraph-m" variant="prominent-2" as="span">
          {formatEuroAmount(estimate.total)}
        </Typography>
      </div>
    </div>
  );
}
