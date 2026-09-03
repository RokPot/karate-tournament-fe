import { Button, LinearProgress } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";

import type { useCategoryAssignments } from "../../hooks/useCategoryAssignments";
import { useCategoryAssignmentStepper } from "../../hooks/useCategoryAssignmentStepper";
import type { UseDraftParticipantsReturn } from "../../hooks/useDraftParticipants";
import type { UseDraftTeamsReturn } from "../../hooks/useDraftTeams";
import type { useSuitableParticipantsByCategory } from "../../hooks/useSuitableParticipantsByCategory";
import { canAdvanceFromCategories } from "../../utils/registrationValidation";
import { isTeamCategory } from "../../utils/teamOverlap";
import { SelectedRegistrationsSummary } from "../SelectedRegistrationsSummary";
import { CategoryParticipantsSection } from "./CategoryParticipantsSection";
import { CategoryRegistrationsModal } from "./CategoryRegistrationsModal";
import { CategoryTeamAssignmentSection } from "./CategoryTeamAssignmentSection";

interface CategoryAssignmentStepProps {
  draft: UseDraftParticipantsReturn;
  suitable: ReturnType<typeof useSuitableParticipantsByCategory>;
  assignments: ReturnType<typeof useCategoryAssignments>;
  teamsDraft: UseDraftTeamsReturn;
  tournamentCategories: CommonModels.CategoryResponseDto[];
  onWizardBack: () => void;
  onWizardNext: () => void;
}

export function CategoryAssignmentStep({
  draft,
  suitable,
  assignments,
  teamsDraft,
  tournamentCategories,
  onWizardBack,
  onWizardNext,
}: CategoryAssignmentStepProps) {
  const { t } = useTranslation();
  const { participants } = draft;
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] =
    useState(false);

  const categoryKey = useMemo(
    () => suitable.categoryItems.map((item) => item.category.id).join("|"),
    [suitable.categoryItems],
  );
  const stepper = useCategoryAssignmentStepper(
    suitable.categoryItems.length,
    categoryKey,
  );

  const currentItem = suitable.categoryItems[stepper.categoryIndex];
  const totalCategories = suitable.categoryItems.length;
  const progressValue =
    totalCategories === 0
      ? 0
      : ((stepper.categoryIndex + 1) / totalCategories) * 100;
  const canContinue = canAdvanceFromCategories(participants);

  const handleBack = () => {
    if (stepper.phase === "overview") {
      stepper.goBackFromOverview();
      return;
    }
    if (stepper.isFirstCategory) {
      onWizardBack();
      return;
    }
    stepper.goPrev();
  };

  const handleNext = () => {
    if (stepper.isLastCategory) {
      stepper.goOverview();
      return;
    }
    stepper.goNext();
  };

  if (suitable.isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="px-6 py-6">
          <Typography size="body-paragraph-s" className="mb-2 text-secondary-200">
            {t("registrations.public.categoriesLoading")}
          </Typography>
          <LoadingState />
        </div>
        <CategoryStepperNav
          backLabel={t("registrations.public.back")}
          nextLabel={t("registrations.public.next")}
          viewRegistrationsLabel={t(
            "registrations.public.stepper.viewRegistrations",
          )}
          onBack={onWizardBack}
          onNext={handleNext}
          onViewRegistrations={() => setIsRegistrationsModalOpen(true)}
          showViewRegistrations={false}
          nextDisabled
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {stepper.phase === "overview" ? (
        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="flex flex-col gap-1">
            <Typography size="h3">
              {t("registrations.public.stepper.overviewTitle")}
            </Typography>
          </div>
          <SelectedRegistrationsSummary
            participants={participants}
            tournamentCategories={tournamentCategories}
            teams={teamsDraft.teams}
            groupBy="category"
            emptyLabel={t("registrations.public.stepper.emptyCategory")}
          />
          {!canContinue && (
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("registrations.public.validation.assignAtLeastOne")}
            </Typography>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="flex flex-col gap-1">
            <Typography size="h3">
              {t("registrations.public.steps.categories")}
            </Typography>
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("registrations.public.categoriesHint")}
            </Typography>
          </div>

          {totalCategories === 0 ? (
            <Typography size="body-paragraph-m">
              {t("registrations.public.noCategories")}
            </Typography>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-baseline justify-between gap-3">
                  <Typography size="body-paragraph-s" variant="prominent-2">
                    {t("registrations.public.stepper.progress", {
                      current: stepper.categoryIndex + 1,
                      total: totalCategories,
                    })}
                  </Typography>
                  {currentItem && (
                    <Typography
                      size="body-paragraph-s"
                      className="truncate text-secondary-200"
                    >
                      {currentItem.category.name}
                    </Typography>
                  )}
                </div>
                <LinearProgress variant="determinate" value={progressValue} />
              </div>

              {currentItem &&
                (isTeamCategory(currentItem.category) ? (
                  <CategoryTeamAssignmentSection
                    item={currentItem}
                    draftParticipants={participants}
                    teams={teamsDraft.teams}
                    onAddTeam={(starterIds, reserveIds) =>
                      teamsDraft.addTeam(
                        currentItem.category.id,
                        starterIds,
                        reserveIds,
                      )
                    }
                    onUpdateTeam={(teamId, starterIds, reserveIds) =>
                      teamsDraft.updateTeam(teamId, starterIds, reserveIds)
                    }
                    onRemoveTeam={teamsDraft.removeTeam}
                  />
                ) : (
                  <CategoryParticipantsSection
                    item={currentItem}
                    draftParticipants={participants}
                    isAssigned={assignments.isAssigned}
                    onToggle={assignments.toggleAssignment}
                  />
                ))}
            </>
          )}
        </div>
      )}

      <CategoryStepperNav
        backLabel={t("registrations.public.back")}
        nextLabel={
          stepper.phase === "overview"
            ? t("registrations.public.stepper.continue")
            : stepper.isLastCategory
              ? t("registrations.public.stepper.confirm")
              : t("registrations.public.next")
        }
        viewRegistrationsLabel={t(
          "registrations.public.stepper.viewRegistrations",
        )}
        onBack={handleBack}
        onNext={
          stepper.phase === "overview" ? onWizardNext : handleNext
        }
        onViewRegistrations={() => setIsRegistrationsModalOpen(true)}
        showViewRegistrations={stepper.phase === "assign"}
        nextDisabled={
          stepper.phase === "overview" ? !canContinue : totalCategories === 0
        }
      />

      <CategoryRegistrationsModal
        open={isRegistrationsModalOpen}
        onClose={() => setIsRegistrationsModalOpen(false)}
        participants={participants}
        tournamentCategories={tournamentCategories}
        teams={teamsDraft.teams}
      />
    </div>
  );
}

interface CategoryStepperNavProps {
  backLabel: string;
  nextLabel: string;
  viewRegistrationsLabel: string;
  onBack: () => void;
  onNext: () => void;
  onViewRegistrations: () => void;
  showViewRegistrations?: boolean;
  nextDisabled?: boolean;
}

function CategoryStepperNav({
  backLabel,
  nextLabel,
  viewRegistrationsLabel,
  onBack,
  onNext,
  onViewRegistrations,
  showViewRegistrations = true,
  nextDisabled = false,
}: CategoryStepperNavProps) {
  return (
    <div className="mt-auto flex flex-row flex-wrap items-center justify-between gap-4 border-t border-primary-300 px-6 py-4">
      <Button variant="outlined" onClick={onBack}>
        {backLabel}
      </Button>
      {showViewRegistrations && (
        <Button variant="text" onClick={onViewRegistrations}>
          {viewRegistrationsLabel}
        </Button>
      )}
      <Button variant="contained" onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </Button>
    </div>
  );
}
