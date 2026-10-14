import { useRouter } from "next/router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";

import { isSingleAthleteMode } from "../constants";
import { useCategoryAssignments } from "../hooks/useCategoryAssignments";
import type { UseRegistrationDraftReturn } from "../hooks/useRegistrationDraft";
import { usePublicRegistrationSubmit } from "../hooks/usePublicRegistrationSubmit";
import { useSeedClubParticipants } from "../hooks/useSeedClubParticipants";
import { useSuitableParticipantsByCategory } from "../hooks/useSuitableParticipantsByCategory";
import { useTournamentCategories } from "../hooks/useTournamentCategories";
import type {
  RegistrantMode,
  RegistrationFlowStep,
} from "../types";
import { canAdvanceFromStep } from "../utils/registrationValidation";
import {
  progressIndexForStep,
  pushRegistrationStep,
  wizardStepForFlowStep,
} from "../utils/registrationUrl";
import { CategoryAssignmentStep } from "./categories/CategoryAssignmentStep";
import type { CoachDetailsFormHandle } from "./coach/CoachDetailsForm";
import { CoachDetailsStep } from "./coach/CoachDetailsStep";
import { ParticipantsStep } from "./participants/ParticipantsStep";
import { RegistrationResults } from "./results/RegistrationResults";
import { WizardProgress } from "./WizardProgress";
import { WizardStepNav } from "./WizardStepNav";

interface PublicRegistrationWizardProps {
  tournamentId: string;
  registrantMode: RegistrantMode;
  step: RegistrationFlowStep;
  draftBag: UseRegistrationDraftReturn;
}

export function PublicRegistrationWizard({
  tournamentId,
  registrantMode,
  step,
  draftBag,
}: PublicRegistrationWizardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const contactFormRef = useRef<CoachDetailsFormHandle>(null);

  const {
    contactDetails,
    setContactDetails,
    draft,
    teamsDraft,
    clearDraft,
    clearStoredDraft,
    persistMode,
  } = draftBag;

  const singleAthlete = isSingleAthleteMode(registrantMode);
  const maxParticipants = singleAthlete ? 1 : undefined;

  const { seededCount, resetSeed } = useSeedClubParticipants(draft, {
    enabled: !singleAthlete,
  });

  const formStep = wizardStepForFlowStep(step);
  const isAssignmentStep = step === "categories" || step === "review";
  const suitable = useSuitableParticipantsByCategory({
    tournamentId,
    participants: draft.participants,
    enabled: isAssignmentStep,
  });
  const { categories, tournament } = useTournamentCategories(tournamentId);
  const assignments = useCategoryAssignments(draft);

  const goToStep = (next: RegistrationFlowStep) =>
    pushRegistrationStep(router, tournamentId, registrantMode, next);

  const submitState = usePublicRegistrationSubmit(tournamentId, {
    onSuccess: () => {
      clearStoredDraft();
      void goToStep("results");
    },
  });

  const progressLabels = [
    t("registrations.public.intro.stepper.contact"),
    t("registrations.public.intro.stepper.athletes"),
    t("registrations.public.intro.stepper.categories"),
    t("registrations.public.intro.stepper.review"),
  ];

  const handleNext = async () => {
    if (step === "contact") {
      const contact = await contactFormRef.current?.submit();
      if (!contact) {
        return;
      }
      setContactDetails(contact);
      void goToStep("participants");
      return;
    }

    if (step === "participants") {
      if (!canAdvanceFromStep("participants", draft.participants)) {
        return;
      }
      void goToStep("categories");
    }
  };

  const handleBack = () => {
    if (step === "participants") {
      void goToStep("contact");
      return;
    }
    if (step === "categories") {
      void goToStep("participants");
    }
  };

  const handleSubmit = () => {
    if (!contactDetails) {
      return;
    }
    if (!canAdvanceFromStep("categories", draft.participants)) {
      return;
    }
    submitState.submit(
      contactDetails,
      draft.participants,
      teamsDraft.teams,
      categories,
    );
  };

  const handleStartOver = () => {
    clearDraft();
    resetSeed();
    submitState.resetResults();
    persistMode(null);
    void router.replace(
      {
        pathname: router.pathname,
        query: { id: tournamentId },
      },
      undefined,
      { shallow: true },
    );
  };

  if (step === "results" && submitState.results) {
    return (
      <RegistrationResults
        results={submitState.results}
        participants={draft.participants}
        categories={categories}
        onStartOver={handleStartOver}
      />
    );
  }

  if (step === "results") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <Typography size="body-paragraph-m" className="text-neutral-200">
          {t("registrations.public.results.startOver")}
        </Typography>
        <button
          type="button"
          className="text-primary-300 underline"
          onClick={handleStartOver}
        >
          {t("registrations.public.results.startOver")}
        </button>
      </div>
    );
  }

  const isFirstStep = step === "contact";
  const showStepNav = step === "contact" || step === "participants";

  return (
    <div className="flex flex-1 flex-col">
      <WizardProgress
        currentIndex={progressIndexForStep(step)}
        labels={progressLabels}
      />

      <div className="flex flex-1 flex-col md:px-10 lg:px-20">
        {step === "contact" && (
          <CoachDetailsStep
            formRef={contactFormRef}
            initialValues={contactDetails}
            disabled={submitState.isSubmitting}
          />
        )}
        {step === "participants" && (
          <ParticipantsStep
            draft={draft}
            clubMembersLoadedCount={seededCount}
            maxParticipants={maxParticipants}
          />
        )}
        {isAssignmentStep && (
          <CategoryAssignmentStep
            draft={draft}
            suitable={suitable}
            assignments={assignments}
            teamsDraft={teamsDraft}
            tournamentCategories={categories}
            clubName={contactDetails?.clubName}
            fees={tournament?.fees}
            reviewMode={step === "review"}
            onEnterReview={() => void goToStep("review")}
            onLeaveReview={() => void goToStep("categories")}
            onWizardBack={() => void goToStep("participants")}
            onWizardNext={handleSubmit}
            overviewNextLabel={
              submitState.isSubmitting
                ? t("registrations.public.submitting")
                : t("registrations.public.submit")
            }
            isSubmitting={submitState.isSubmitting}
          />
        )}

        {showStepNav && (
          <>
            {step === "participants" &&
              !canAdvanceFromStep(formStep, draft.participants) && (
                <Typography
                  size="body-paragraph-s"
                  className="px-6 text-neutral-200"
                >
                  {t("registrations.public.validation.noParticipants")}
                </Typography>
              )}
            <WizardStepNav
              isFirstStep={isFirstStep}
              isLastFormStep={false}
              canGoNext={
                step === "contact"
                  ? true
                  : canAdvanceFromStep("participants", draft.participants)
              }
              isSubmitting={submitState.isSubmitting}
              onBack={handleBack}
              onNext={handleNext}
            />
          </>
        )}
      </div>
    </div>
  );
}
