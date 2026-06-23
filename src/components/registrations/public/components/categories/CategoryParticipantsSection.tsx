import { Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { RegistrationsModels } from "@/data/registrations/registrations.models";

import type { DraftParticipant } from "../../types";
import { getParticipantLabel } from "../../utils/registrationValidation";

interface CategoryParticipantsSectionProps {
  item: RegistrationsModels.CategorySuitableParticipantsItemDto;
  draftParticipants: DraftParticipant[];
  isAssigned: (categoryId: string, clientId: string) => boolean;
  onToggle: (categoryId: string, clientId: string) => void;
}

export function CategoryParticipantsSection({
  item,
  draftParticipants,
  isAssigned,
  onToggle,
}: CategoryParticipantsSectionProps) {
  const { t } = useTranslation();
  const { category } = item;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-primary-200 bg-white p-4">
      <div className="flex flex-col">
        <Typography size="body-paragraph-lg" variant="prominent-2">
          {category.name}
        </Typography>
        <Typography size="body-paragraph-xs" className="text-secondary-200">
          {t(`discipline.${category.discipline}`)}
        </Typography>
      </div>

      {item.participants.length === 0 ? (
        <Typography size="body-paragraph-s" className="text-secondary-200">
          {t("registrations.public.noEligibleParticipantsForCategory")}
        </Typography>
      ) : (
        <div className="flex flex-col gap-1 pl-1">
          {item.participants.map((suitable) => {
            const draft = draftParticipants[suitable.participantIndex];
            if (!draft) {
              return null;
            }

            return (
              <FormControlLabel
                key={`${category.id}-${draft.clientId}`}
                control={
                  <Checkbox
                    checked={isAssigned(category.id, draft.clientId)}
                    onChange={() => onToggle(category.id, draft.clientId)}
                  />
                }
                label={
                  <Typography size="body-paragraph-m">
                    {getParticipantLabel(draft, suitable.participantIndex)}
                  </Typography>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
