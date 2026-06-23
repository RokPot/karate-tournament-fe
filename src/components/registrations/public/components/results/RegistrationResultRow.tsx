import { Typography } from "@/components/ui/text/Typography/Typography";
import { RegistrationsModels } from "@/data/registrations/registrations.models";
import { useTranslation } from "react-i18next";

import { getParticipantLabel } from "../../utils/registrationValidation";
import type { DraftParticipant } from "../../types";

interface RegistrationResultRowProps {
  result: RegistrationsModels.BulkRegistrationResultItemDto;
  participant?: DraftParticipant;
  participantIndex: number;
  categoryName?: string;
}

export function RegistrationResultRow({
  result,
  participant,
  participantIndex,
  categoryName,
}: RegistrationResultRowProps) {
  const { t } = useTranslation();

  const participantLabel = participant
    ? getParticipantLabel(participant, participantIndex)
    : `${t("registrations.public.results.participant")} ${participantIndex + 1}`;

  return (
    <div
      className={`flex flex-col gap-1 rounded-lg border px-4 py-3 ${
        result.success
          ? "border-success-300 bg-success-50"
          : "border-danger-300 bg-danger-50"
      }`}
    >
      <Typography size="body-paragraph-m" variant="prominent-2">
        {result.success
          ? t("registrations.public.results.success")
          : t("registrations.public.results.failed")}
        {" · "}
        {participantLabel}
        {categoryName ? ` · ${categoryName}` : ""}
      </Typography>
      {!result.success && result.error && (
        <Typography size="body-paragraph-s" className="text-danger">
          {result.error}
        </Typography>
      )}
    </div>
  );
}
