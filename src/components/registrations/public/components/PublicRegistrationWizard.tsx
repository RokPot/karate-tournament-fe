import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { RegistrationsModels } from "@/data/registrations/registrations.models";

import { isSingleAthleteMode } from "../constants";
import { useCategoryAssignments } from "../hooks/useCategoryAssignments";
import { useContinueRegistration } from "../hooks/useContinueRegistration";
import type { UseRegistrationDraftReturn } from "../hooks/useRegistrationDraft";
import { usePublicRegistrationSubmit } from "../hooks/usePublicRegistrationSubmit";
import { useSeedClubParticipants } from "../hooks/useSeedClubParticipants";
import { useSuitableParticipantsByCategory } from "../hooks/useSuitableParticipantsByCategory";
import { useTournamentCategories } from "../hooks/useTournamentCategories";
import type { RegistrantMode, RegistrationFlowStep } from "../types";
import { canAdvanceFromStep } from "../utils/registrationValidation";
import {
  progressIndexForStep,
  pushRegistrationStep,
  wizardStepForFlowStep,
} from "../utils/registrationUrl";
import { CategoryAssignmentStep } from "./categories/CategoryAssignmentStep";
import type { CoachDetailsFormHandle } from "./coach/CoachDetailsForm";
import { CoachDetailsStep } from "./coach/CoachDetailsStep";
import { ContinueRosterPanel } from "./coach/ContinueRosterPanel";
import { ParticipantsStep } from "./participants/ParticipantsStep";
import { RegistrationResults } from "./results/RegistrationResults";
import { RosterSavedResults } from "./results/RosterSavedResults";
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
  const [savedRoster, setSavedRoster] =
    useState<RegistrationsModels.RosterResponseDto | null>(null);

  const {
    contactDetails,
    setContactDetails,
    draft,
    teamsDraft,
    clearDraft,
    clearStoredDraft,
    persistMode,
    replaceParticipants,
    replaceTeams,
  } = draftBag;

  const continueFlow = useContinueRegistration(tournamentId, {
    onCommit: (mapped) => {
      setContactDetails(mapped.coach);
      replaceParticipants(mapped.participants);
      replaceTeams(mapped.teams);
    },
  });

  const singleAthlete = isSingleAthleteMode(registrantMode);
  const maxParticipants = singleAthlete ? 1 : undefined;

  const { seededCount, resetSeed } = useSeedClubParticipants(draft, {
    enabled: !singleAthlete && !continueFlow.blocksClubSeed,
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

  const isWorking = submitState.isSubmitting || continueFlow.isBusy;

  const handleNext = async () => {
    if (step === "contact") {
      const contact = await contactFormRef.current?.submit();
      if (!contact) {
        return;
      }
      setContactDetails(contact);
      const next = continueFlow.beginNewRegistration(contact);
      if (next.resetDraft) {
        replaceParticipants([]);
        replaceTeams([]);
        resetSeed();
      }
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
      continueFlow.showForm();
      void goToStep("contact");
      return;
    }
    if (step === "categories") {
      void goToStep("participants");
    }
  };

  const handleSubmit = async () => {
    if (!contactDetails) {
      return;
    }
    if (!canAdvanceFromStep("categories", draft.participants)) {
      return;
    }
    if (continueFlow.isContinuing) {
      const result = await continueFlow.save({
        coach: contactDetails,
        participants: draft.participants,
        teams: teamsDraft.teams,
        categories,
      });
      if (result.ok) {
        setSavedRoster(result.roster);
        void goToStep("results");
      } else if (result.reason === "expired") {
        void goToStep("contact");
      }
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
    continueFlow.resetContinue();
    setSavedRoster(null);
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

  const handleEditSubmitted = () => {
    if (!contactDetails) {
      return;
    }
    submitState.resetResults();
    void continueFlow.startEdit(contactDetails);
    void goToStep("contact");
  };

  if (step === "results" && savedRoster) {
    return (
      <RosterSavedResults
        roster={savedRoster}
        onEdit={() => {
          setSavedRoster(null);
          void goToStep("participants");
        }}
        onDone={handleStartOver}
      />
    );
  }

  if (step === "results" && submitState.results) {
    return (
      <RegistrationResults
        results={submitState.results}
        participants={draft.participants}
        categories={categories}
        onStartOver={handleStartOver}
        onEdit={contactDetails ? handleEditSubmitted : undefined}
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
  const saveLabel = continueFlow.isContinuing
    ? t("registrations.public.continue.save")
    : t("registrations.public.submit");
  const savingLabel = continueFlow.isContinuing
    ? t("registrations.public.continue.saving")
    : t("registrations.public.submitting");

  return (
    <div className="flex flex-1 flex-col">
      <WizardProgress
        currentIndex={progressIndexForStep(step)}
        labels={progressLabels}
      />

      {continueFlow.conflictRoster && (
        <div className="mx-6 mt-4 flex flex-col gap-3 rounded-lg border border-secondary-300 bg-secondary-75 p-4 md:mx-10 lg:mx-20">
          <Typography size="body-paragraph-m">
            {t("registrations.public.continue.conflict")}
          </Typography>
          <Button
            variant="contained"
            onClick={continueFlow.acceptConflict}
            disabled={continueFlow.isBusy}
          >
            {t("registrations.public.continue.reload")}
          </Button>
        </div>
      )}

      <div className="flex flex-1 flex-col md:px-10 lg:px-20">
        {step === "contact" && (
          <CoachDetailsStep
            formRef={contactFormRef}
            initialValues={contactDetails ?? continueFlow.coach}
            disabled={isWorking}
          >
            <ContinueRosterPanel
              phase={continueFlow.phase}
              email={continueFlow.coach?.email ?? contactDetails?.email}
              clubName={continueFlow.coach?.clubName ?? contactDetails?.clubName}
              foundAt={continueFlow.foundAt}
              debugCode={continueFlow.debugCode}
              statusMessage={continueFlow.statusMessage}
              replacePrompt={continueFlow.replacePrompt}
              isBusy={continueFlow.isBusy}
              onCheck={(values) => {
                void continueFlow
                  .checkExisting({
                    email: values.email,
                    firstName: contactDetails?.firstName ?? "",
                    lastName: contactDetails?.lastName ?? "",
                    clubName: values.clubName,
                  })
                  .then((route) => {
                    if (route.type === "resume") {
                      void goToStep("participants");
                    }
                  });
              }}
              onContinue={() => {
                void continueFlow.beginContinue();
              }}
              onVerify={(code) => {
                void continueFlow.verifyCode(code).then((route) => {
                  if (route === "applied") {
                    void goToStep("participants");
                  }
                });
              }}
              onResend={() => {
                void continueFlow.beginContinue();
              }}
              onConfirmReplace={() => {
                if (continueFlow.confirmReplace()) {
                  void goToStep("participants");
                }
              }}
              onCancelReplace={continueFlow.cancelReplace}
            />
          </CoachDetailsStep>
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
            onWizardNext={() => {
              void handleSubmit();
            }}
            overviewNextLabel={isWorking ? savingLabel : saveLabel}
            isSubmitting={isWorking}
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
                  ? !continueFlow.isBusy
                  : canAdvanceFromStep("participants", draft.participants)
              }
              isSubmitting={isWorking}
              onBack={handleBack}
              onNext={() => {
                void handleNext();
              }}
              onSubmit={() => {
                void handleSubmit();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
