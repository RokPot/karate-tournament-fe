import { Button, LinearProgress } from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { CategoryRegistrationsModal } from "@/components/registrations/public/components/categories/CategoryRegistrationsModal";
import { CategoryTeamAssignmentSection } from "@/components/registrations/public/components/categories/CategoryTeamAssignmentSection";
import { SelectedRegistrationsSummary } from "@/components/registrations/public/components/SelectedRegistrationsSummary";
import type { useCategoryAssignments } from "@/components/registrations/public/hooks/useCategoryAssignments";
import { useCategoryAssignmentStepper } from "@/components/registrations/public/hooks/useCategoryAssignmentStepper";
import type { UseDraftParticipantsReturn } from "@/components/registrations/public/hooks/useDraftParticipants";
import type { UseDraftTeamsReturn } from "@/components/registrations/public/hooks/useDraftTeams";
import { canAdvanceFromCategories } from "@/components/registrations/public/utils/registrationValidation";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";

import { AssignmentModeToggle } from "./AssignmentModeToggle";
import { ParticipantCategoriesSection } from "./ParticipantCategoriesSection";
import type { useSuitableCategoriesByParticipant } from "./useSuitableCategoriesByParticipant";
export type CategoryAssignmentMode = "category" | "athlete";

const PANEL_SLIDE_PX = 32;
const PANEL_TRANSITION = { duration: 0.3, ease: "easeOut" as const };

const panelVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction * PANEL_SLIDE_PX,
  }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -PANEL_SLIDE_PX,
  }),
};

const panelTransformTemplate = ({ x }: { x?: number | string }) => {
  const offset = typeof x === "number" ? x : Number.parseFloat(String(x ?? 0));
  if (!offset) {
    return "none";
  }
  return `translateX(${typeof x === "number" ? `${x}px` : x})`;
};

type AssignScreen =
  | { type: "participant"; key: string; participantIndex: number }
  | { type: "team"; key: string; teamIndex: number };

interface ParticipantAssignmentStepProps {
  draft: UseDraftParticipantsReturn;
  suitable: ReturnType<typeof useSuitableCategoriesByParticipant>;
  assignments: ReturnType<typeof useCategoryAssignments>;
  teamsDraft: UseDraftTeamsReturn;
  tournamentCategories: CommonModels.CategoryResponseDto[];
  assignmentMode: CategoryAssignmentMode;
  onAssignmentModeChange: (mode: CategoryAssignmentMode) => void;
  onWizardBack: () => void;
  onWizardNext: () => void;
  reviewMode?: boolean;
  onEnterReview?: () => void;
  onLeaveReview?: () => void;
  overviewNextLabel?: string;
  isSubmitting?: boolean;
}

export function ParticipantAssignmentStep({
  draft,
  suitable,
  assignments,
  teamsDraft,
  tournamentCategories,
  assignmentMode,
  onAssignmentModeChange,
  onWizardBack,
  onWizardNext,
  reviewMode = false,
  onEnterReview,
  onLeaveReview,
  overviewNextLabel,
  isSubmitting = false,
}: ParticipantAssignmentStepProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const { participants } = draft;
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] =
    useState(false);

  const screens = useMemo((): AssignScreen[] => {
    const participantScreens = suitable.participantItems.map((item) => ({
      type: "participant" as const,
      key: `participant-${item.participant.clientId}`,
      participantIndex: item.participantIndex,
    }));
    const teamScreens = suitable.teamItems.map((item, teamIndex) => ({
      type: "team" as const,
      key: `team-${item.category.id}`,
      teamIndex,
    }));
    return [...participantScreens, ...teamScreens];
  }, [suitable.participantItems, suitable.teamItems]);

  const screenKey = screens.map((screen) => screen.key).join("|");
  const stepper = useCategoryAssignmentStepper(screens.length, screenKey);

  const phase = reviewMode ? "overview" : "assign";
  const currentScreen = screens[stepper.categoryIndex];
  const totalScreens = screens.length;
  const progressValue =
    totalScreens === 0 ? 0 : ((stepper.categoryIndex + 1) / totalScreens) * 100;
  const canContinue = canAdvanceFromCategories(participants);

  const currentParticipantItem =
    currentScreen?.type === "participant"
      ? suitable.participantItems[currentScreen.participantIndex]
      : undefined;
  const currentTeamItem =
    currentScreen?.type === "team"
      ? suitable.teamItems[currentScreen.teamIndex]
      : undefined;

  const handleBack = () => {
    if (phase === "overview") {
      onLeaveReview?.();
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
      onEnterReview?.();
      return;
    }
    stepper.goNext();
  };

  let progressLabel = "";
  if (currentScreen?.type === "participant" && currentParticipantItem) {
    progressLabel =
      `${currentParticipantItem.participant.firstName} ${currentParticipantItem.participant.lastName}`.trim();
  } else if (currentScreen?.type === "team") {
    progressLabel = currentTeamItem?.category.name ?? "";
  }

  let nextLabel = t("registrations.public.next");
  if (phase === "overview") {
    nextLabel = overviewNextLabel ?? t("registrations.public.stepper.continue");
  } else if (stepper.isLastCategory) {
    nextLabel = t("registrations.public.stepper.confirm");
  }

  if (suitable.isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="px-6 py-6">
          <Typography size="body-paragraph-s" className="mb-2 text-neutral-200">
            {t("registrations.public.categoriesLoading")}
          </Typography>
          <LoadingState />
        </div>
        <StepperNav
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
      <div className="flex flex-col gap-6 px-6 py-6">
        {phase === "assign" && (
          <>
            <div className="flex flex-col gap-3">
              <Typography as="h3" size="h3">
                {t("registrations.public.steps.categories")}
              </Typography>
              <AssignmentModeToggle
                value={assignmentMode}
                onChange={onAssignmentModeChange}
              />
              <Typography size="body-paragraph-s" className="text-neutral-200">
                {t("registrations.public.byAthlete.hint")}
              </Typography>
            </div>

            {totalScreens === 0 ? (
              <Typography size="body-paragraph-m">
                {t("registrations.public.noCategories")}
              </Typography>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-baseline justify-between gap-3">
                  <Typography size="body-paragraph-s" variant="prominent-2">
                    {t("registrations.public.stepper.progress", {
                      current: stepper.categoryIndex + 1,
                      total: totalScreens,
                    })}
                  </Typography>
                  {progressLabel ? (
                    <Typography
                      size="body-paragraph-s"
                      className="truncate text-neutral-200"
                    >
                      {progressLabel}
                    </Typography>
                  ) : null}
                </div>
                <LinearProgress variant="determinate" value={progressValue} />
              </div>
            )}
          </>
        )}

        <div className="overflow-x-clip">
          <AnimatePresence mode="wait" custom={stepper.direction}>
            {phase === "overview" && (
              <motion.div
                key="overview"
                custom={stepper.direction}
                variants={panelVariants}
                initial={shouldReduceMotion ? false : "enter"}
                animate="center"
                exit={shouldReduceMotion ? undefined : "exit"}
                transition={PANEL_TRANSITION}
                transformTemplate={panelTransformTemplate}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-1">
                  <Typography as="h3" size="h3">
                    {t("registrations.public.stepper.overviewTitle")}
                  </Typography>
                </div>
                <SelectedRegistrationsSummary
                  participants={participants}
                  tournamentCategories={tournamentCategories}
                  teams={teamsDraft.teams}
                  groupBy="participant"
                  emptyLabel={t("registrations.public.stepper.emptyCategory")}
                />
                {!canContinue && (
                  <Typography
                    size="body-paragraph-s"
                    className="text-neutral-200"
                  >
                    {t("registrations.public.validation.assignAtLeastOne")}
                  </Typography>
                )}
              </motion.div>
            )}
            {phase === "assign" &&
              currentScreen?.type === "participant" &&
              currentParticipantItem && (
                <motion.div
                  key={currentScreen.key}
                  custom={stepper.direction}
                  variants={panelVariants}
                  initial={shouldReduceMotion ? false : "enter"}
                  animate="center"
                  exit={shouldReduceMotion ? undefined : "exit"}
                  transition={PANEL_TRANSITION}
                  transformTemplate={panelTransformTemplate}
                >
                  <ParticipantCategoriesSection
                    item={currentParticipantItem}
                    isAssigned={assignments.isAssigned}
                    onToggle={assignments.toggleAssignment}
                  />
                </motion.div>
              )}
            {phase === "assign" &&
              currentScreen?.type === "team" &&
              currentTeamItem && (
                <motion.div
                  key={currentScreen.key}
                  custom={stepper.direction}
                  variants={panelVariants}
                  initial={shouldReduceMotion ? false : "enter"}
                  animate="center"
                  exit={shouldReduceMotion ? undefined : "exit"}
                  transition={PANEL_TRANSITION}
                  transformTemplate={panelTransformTemplate}
                >
                  <CategoryTeamAssignmentSection
                    item={currentTeamItem}
                    draftParticipants={participants}
                    teams={teamsDraft.teams}
                    onAddTeam={(starterIds, reserveIds) =>
                      teamsDraft.addTeam(
                        currentTeamItem.category.id,
                        starterIds,
                        reserveIds,
                      )
                    }
                    onUpdateTeam={(teamId, starterIds, reserveIds) =>
                      teamsDraft.updateTeam(teamId, starterIds, reserveIds)
                    }
                    onRemoveTeam={teamsDraft.removeTeam}
                  />
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>

      <StepperNav
        backLabel={t("registrations.public.back")}
        nextLabel={nextLabel}
        viewRegistrationsLabel={t(
          "registrations.public.stepper.viewRegistrations",
        )}
        onBack={handleBack}
        onNext={phase === "overview" ? onWizardNext : handleNext}
        onViewRegistrations={() => setIsRegistrationsModalOpen(true)}
        showViewRegistrations={phase === "assign"}
        nextDisabled={
          phase === "overview"
            ? !canContinue || isSubmitting
            : totalScreens === 0
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

interface StepperNavProps {
  backLabel: string;
  nextLabel: string;
  viewRegistrationsLabel: string;
  onBack: () => void;
  onNext: () => void;
  onViewRegistrations: () => void;
  showViewRegistrations?: boolean;
  nextDisabled?: boolean;
}

function StepperNav({
  backLabel,
  nextLabel,
  viewRegistrationsLabel,
  onBack,
  onNext,
  onViewRegistrations,
  showViewRegistrations = true,
  nextDisabled = false,
}: StepperNavProps) {
  return (
    <div className="mt-auto flex flex-row flex-wrap items-center justify-between gap-4 border-t border-secondary-300 px-6 py-4">
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
