import Pill from "@/components/ui/Pill";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { useTranslation } from "react-i18next";

import {
  getParticipantLabel,
  getParticipantsWithSelections,
} from "../utils/registrationValidation";
import type { DraftParticipant } from "../types";

interface SelectedRegistrationsSummaryProps {
  participants: DraftParticipant[];
  tournamentCategories: CommonModels.CategoryResponseDto[];
  compact?: boolean;
}

export function SelectedRegistrationsSummary({
  participants,
  tournamentCategories,
  compact = false,
}: SelectedRegistrationsSummaryProps) {
  const { t } = useTranslation();
  const withSelections = getParticipantsWithSelections(participants);

  if (withSelections.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-primary-300 bg-primary-75 p-4">
      <Typography size="body-paragraph-m" variant="prominent-2">
        {t("registrations.public.selectedRegistrations.title")}
      </Typography>
      {!compact && (
        <Typography size="body-paragraph-s" className="text-secondary-200">
          {t("registrations.public.selectedRegistrations.hint")}
        </Typography>
      )}
      <div className="flex flex-col gap-3">
        {withSelections.map((participant) => {
          const labels = participant.categoryIds.map(
            (id) =>
              tournamentCategories.find((category) => category.id === id)
                ?.name ?? id,
          );

          return (
            <div key={participant.clientId} className="flex flex-col gap-1.5">
              <Typography size="body-paragraph-s" variant="prominent-2">
                {getParticipantLabel(
                  participant,
                  participants.indexOf(participant),
                )}
              </Typography>
              <div className="flex flex-row flex-wrap gap-1">
                {labels.map((label) => (
                  <Pill key={`${participant.clientId}-${label}`}>
                    <Typography size="body-paragraph-xs">{label}</Typography>
                  </Pill>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
