import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { useCategoryAssignments } from "../hooks/useCategoryAssignments";
import { useDraftParticipants } from "../hooks/useDraftParticipants";
import { useSuitableParticipantsByCategory } from "../hooks/useSuitableParticipantsByCategory";
import { usePublicRegistrationSubmit } from "../hooks/usePublicRegistrationSubmit";
import { useRegistrationWizard } from "../hooks/useRegistrationWizard";
import { useTournamentCategories } from "../hooks/useTournamentCategories";
import { canAdvanceFromStep } from "../utils/registrationValidation";
import { CategoryAssignmentStep } from "./categories/CategoryAssignmentStep";
import type { CoachDetailsFormHandle } from "./coach/CoachDetailsForm";
import { CoachDetailsStep } from "./coach/CoachDetailsStep";
import { ParticipantsStep } from "./participants/ParticipantsStep";
import { RegistrationResults } from "./results/RegistrationResults";
import { WizardStepNav } from "./WizardStepNav";

interface PublicRegistrationWizardProps {
  tournamentId: string;
}

export function PublicRegistrationWizard({
  tournamentId,
}: PublicRegistrationWizardProps) {
  const { t } = useTranslation();
  const coachFormRef = useRef<CoachDetailsFormHandle>(null);

  const draft = useDraftParticipants();
  const wizard = useRegistrationWizard({
    participants: draft.participants,
  });
  const suitable = useSuitableParticipantsByCategory({
    tournamentId,
    participants: draft.participants,
    enabled: wizard.step === "categories" || wizard.step === "coach",
  });
  const { categories } = useTournamentCategories(tournamentId);
  const assignments = useCategoryAssignments(draft);
  const submitState = usePublicRegistrationSubmit(tournamentId, {
    onSuccess: () => wizard.goToResults(),
  });

  const handleNext = () => {
    if (!canAdvanceFromStep(wizard.step, draft.participants)) {
      return;
    }
    wizard.goNext();
  };

  const handleSubmit = async () => {
    const coach = await coachFormRef.current?.submit();
    if (!coach) {
      return;
    }
    submitState.submit(coach, draft.participants);
  };

  const handleStartOver = () => {
    draft.setParticipants([]);
    submitState.resetResults();
    wizard.resetToStart();
  };

  if (wizard.isResultsStep && submitState.results) {
    return (
      <RegistrationResults
        results={submitState.results}
        participants={draft.participants}
        categories={categories}
        onStartOver={handleStartOver}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col md:px-10 lg:px-20">
      {wizard.step === "participants" && <ParticipantsStep draft={draft} />}
      {wizard.step === "categories" && (
        <CategoryAssignmentStep
          draft={draft}
          suitable={suitable}
          assignments={assignments}
          tournamentCategories={categories}
        />
      )}
      {wizard.step === "coach" && (
        <CoachDetailsStep
          formRef={coachFormRef}
          participants={draft.participants}
          tournamentCategories={categories}
          disabled={submitState.isSubmitting}
        />
      )}

      {!wizard.isResultsStep && (
        <>
          {wizard.step !== "coach" &&
            !canAdvanceFromStep(wizard.step, draft.participants) && (
              <Typography
                size="body-paragraph-s"
                className="px-6 text-secondary-200"
              >
                {wizard.step === "participants"
                  ? t("registrations.public.validation.noParticipants")
                  : t("registrations.public.validation.assignAtLeastOne")}
              </Typography>
            )}
        </>
      )}
      <WizardStepNav
        isFirstStep={wizard.isFirstStep}
        isLastFormStep={wizard.isLastFormStep}
        canGoNext={wizard.canGoNext}
        isSubmitting={submitState.isSubmitting}
        onBack={wizard.goBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
