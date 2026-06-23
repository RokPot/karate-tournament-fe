import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface WizardStepNavProps {
  isFirstStep: boolean;
  isLastFormStep: boolean;
  canGoNext: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit?: () => void;
}

export function WizardStepNav({
  isFirstStep,
  isLastFormStep,
  canGoNext,
  isSubmitting = false,
  onBack,
  onNext,
  onSubmit,
}: WizardStepNavProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row justify-between gap-4 border-t border-primary-300 px-6 py-4">
      <Button
        variant="outlined"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
      >
        {t("registrations.public.back")}
      </Button>
      {isLastFormStep ? (
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("registrations.public.submitting")
            : t("registrations.public.submit")}
        </Button>
      ) : (
        <Button variant="contained" onClick={onNext} disabled={!canGoNext}>
          {t("registrations.public.next")}
        </Button>
      )}
    </div>
  );
}
