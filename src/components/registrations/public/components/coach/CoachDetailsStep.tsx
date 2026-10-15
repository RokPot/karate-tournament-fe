import type { ReactNode, Ref } from "react";

import type { CoachDetails } from "../../types";
import { CoachDetailsForm, CoachDetailsFormHandle } from "./CoachDetailsForm";

interface CoachDetailsStepProps {
  formRef: Ref<CoachDetailsFormHandle>;
  initialValues?: CoachDetails | null;
  disabled?: boolean;
  children?: ReactNode;
}

export function CoachDetailsStep({
  formRef,
  initialValues,
  disabled,
  children,
}: CoachDetailsStepProps) {
  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <CoachDetailsForm
        ref={formRef}
        disabled={disabled}
        initialValues={initialValues}
      />
      {children}
    </div>
  );
}
