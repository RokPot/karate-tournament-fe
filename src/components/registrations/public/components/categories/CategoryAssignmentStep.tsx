import { Typography } from "@/components/ui/text/Typography/Typography";
import { useTranslation } from "react-i18next";

import { LoadingState } from "@/components/shared/layout/LoadingState";

import { CommonModels } from "@/data/common/common.models";
import type { useCategoryAssignments } from "../../hooks/useCategoryAssignments";
import type { UseDraftParticipantsReturn } from "../../hooks/useDraftParticipants";
import type { useSuitableParticipantsByCategory } from "../../hooks/useSuitableParticipantsByCategory";

import { SelectedRegistrationsSummary } from "../SelectedRegistrationsSummary";
import { CategoryParticipantsSection } from "./CategoryParticipantsSection";

interface CategoryAssignmentStepProps {
  draft: UseDraftParticipantsReturn;
  suitable: ReturnType<typeof useSuitableParticipantsByCategory>;
  assignments: ReturnType<typeof useCategoryAssignments>;
  tournamentCategories: CommonModels.CategoryResponseDto[];
}

export function CategoryAssignmentStep({
  draft,
  suitable,
  assignments,
  tournamentCategories,
}: CategoryAssignmentStepProps) {
  const { t } = useTranslation();
  const { participants } = draft;

  if (suitable.isLoading) {
    return (
      <div className="px-6 py-6">
        <Typography size="body-paragraph-s" className="mb-2 text-secondary-200">
          {t("registrations.public.categoriesLoading")}
        </Typography>
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <div className="flex flex-col gap-1">
        <Typography size="h3">
          {t("registrations.public.steps.categories")}
        </Typography>
        <Typography size="body-paragraph-s" className="text-secondary-200">
          {t("registrations.public.categoriesHint")}
        </Typography>
      </div>

      <SelectedRegistrationsSummary
        participants={participants}
        tournamentCategories={tournamentCategories}
        compact
      />

      {suitable.categoryItems.length === 0 ? (
        <Typography size="body-paragraph-m">
          {t("registrations.public.noCategories")}
        </Typography>
      ) : (
        <div className="flex flex-col gap-4">
          {suitable.categoryItems.map((item) => (
            <CategoryParticipantsSection
              key={item.category.id}
              item={item}
              draftParticipants={participants}
              isAssigned={assignments.isAssigned}
              onToggle={assignments.toggleAssignment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
