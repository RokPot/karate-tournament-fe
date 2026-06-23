import type { Ref } from "react";

import { CommonModels } from "@/data/common/common.models";

import { SelectedRegistrationsSummary } from "../SelectedRegistrationsSummary";
import type { DraftParticipant } from "../../types";
import { CoachDetailsForm, CoachDetailsFormHandle } from "./CoachDetailsForm";

interface CoachDetailsStepProps {
  formRef: Ref<CoachDetailsFormHandle>;
  participants: DraftParticipant[];
  tournamentCategories: CommonModels.CategoryResponseDto[];
  disabled?: boolean;
}

export function CoachDetailsStep({
  formRef,
  participants,
  tournamentCategories,
  disabled,
}: CoachDetailsStepProps) {
  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <SelectedRegistrationsSummary
        participants={participants}
        tournamentCategories={tournamentCategories}
      />
      <CoachDetailsForm ref={formRef} disabled={disabled} />
    </div>
  );
}
