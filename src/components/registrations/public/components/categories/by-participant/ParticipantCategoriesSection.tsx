import { Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

import { getParticipantLabel } from "@/components/registrations/public/utils/registrationValidation";
import { Typography } from "@/components/ui/text/Typography/Typography";

import type { ParticipantEligibleCategories } from "./deriveAthleteAssignmentItems";

interface ParticipantCategoriesSectionProps {
  item: ParticipantEligibleCategories;
  isAssigned: (categoryId: string, clientId: string) => boolean;
  onToggle: (categoryId: string, clientId: string) => void;
}

export function ParticipantCategoriesSection({
  item,
  isAssigned,
  onToggle,
}: ParticipantCategoriesSectionProps) {
  const { t } = useTranslation();
  const { participant, participantIndex, categories } = item;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-secondary-200 bg-white p-4">
      <Typography size="body-paragraph-lg" variant="prominent-2">
        {getParticipantLabel(participant, participantIndex)}
      </Typography>

      {categories.length === 0 ? (
        <Typography size="body-paragraph-s" className="text-neutral-200">
          {t("registrations.public.byAthlete.noEligible")}
        </Typography>
      ) : (
        <div className="flex flex-col gap-1 pl-1">
          {categories.map((category) => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={isAssigned(category.id, participant.clientId)}
                  onChange={() => onToggle(category.id, participant.clientId)}
                />
              }
              label={
                <Typography as="span" size="body-paragraph-m">
                  {category.name}
                  <Typography
                    as="span"
                    size="body-paragraph-xs"
                    className="ml-2 text-neutral-200"
                  >
                    {t(`discipline.${category.discipline}`)}
                  </Typography>
                </Typography>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
