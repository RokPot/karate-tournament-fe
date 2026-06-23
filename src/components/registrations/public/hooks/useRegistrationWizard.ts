import { useCallback, useState } from "react";

import { WIZARD_STEPS } from "../constants";
import { canAdvanceFromStep } from "../utils/registrationValidation";
import type { DraftParticipant, WizardStep } from "../types";

interface UseRegistrationWizardParams {
  participants: DraftParticipant[];
}

export function useRegistrationWizard({
  participants,
}: UseRegistrationWizardParams) {
  const [step, setStep] = useState<WizardStep>("participants");

  const stepIndex = WIZARD_STEPS.indexOf(
    step === "results" ? "coach" : step,
  );

  const canGoNext = canAdvanceFromStep(step, participants);

  const goNext = useCallback(() => {
    setStep((current) => {
      const currentIndex = WIZARD_STEPS.indexOf(
        current === "results" ? "coach" : current,
      );
      if (currentIndex < 0 || currentIndex >= WIZARD_STEPS.length - 1) {
        return current;
      }
      if (!canAdvanceFromStep(current, participants)) {
        return current;
      }
      return WIZARD_STEPS[currentIndex + 1]!;
    });
  }, [participants]);

  const goBack = useCallback(() => {
    setStep((current) => {
      if (current === "results") {
        return "coach";
      }
      const currentIndex = WIZARD_STEPS.indexOf(current);
      if (currentIndex <= 0) {
        return current;
      }
      return WIZARD_STEPS[currentIndex - 1]!;
    });
  }, []);

  const goToResults = useCallback(() => {
    setStep("results");
  }, []);

  const resetToStart = useCallback(() => {
    setStep("participants");
  }, []);

  const isFirstStep = stepIndex <= 0;
  const isLastFormStep = step === "coach";

  return {
    step,
    stepIndex,
    canGoNext,
    goNext,
    goBack,
    goToResults,
    resetToStart,
    isFirstStep,
    isLastFormStep,
    isResultsStep: step === "results",
  };
}

export type UseRegistrationWizardReturn = ReturnType<
  typeof useRegistrationWizard
>;
