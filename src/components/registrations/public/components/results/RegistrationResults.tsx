import { Button } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";

import type { BulkRegistrationResponse, DraftParticipant } from "../../types";
import { RegistrationResultRow } from "./RegistrationResultRow";

interface RegistrationResultsProps {
  results: BulkRegistrationResponse;
  participants: DraftParticipant[];
  categories: CommonModels.CategoryResponseDto[];
  onStartOver: () => void;
}

export function RegistrationResults({
  results,
  participants,
  categories,
  onStartOver,
}: RegistrationResultsProps) {
  const { t } = useTranslation();

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => map.set(category.id, category.name));
    results.results.forEach((item) => {
      if (item.registration?.categoryId) {
        const name = map.get(item.registration.categoryId);
        if (name) {
          map.set(item.registration.categoryId, name);
        }
      }
    });
    return map;
  }, [categories, results.results]);

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <Typography size="h3">{t("registrations.public.results.title")}</Typography>

      <div className="flex flex-col gap-2">
        {results.results.map((result) => {
          const participant = participants[result.participantIndex];
          const categoryId =
            participant?.categoryIds[result.registrationIndex] ??
            result.registration?.categoryId;
          const categoryName = categoryId
            ? categoryNameById.get(categoryId)
            : undefined;

          return (
            <RegistrationResultRow
              key={`${result.participantIndex}-${result.registrationIndex}`}
              result={result}
              participant={participant}
              participantIndex={result.participantIndex}
              categoryName={categoryName}
            />
          );
        })}
      </div>

      <Button variant="contained" onClick={onStartOver}>
        {t("registrations.public.results.startOver")}
      </Button>
    </div>
  );
}