import { CommonModels } from "@/data/common/common.models";

import type { WizardStep } from "./types";

export const WIZARD_STEPS: WizardStep[] = [
  "participants",
  "categories",
  "coach",
];

export const PARTICIPANT_FORM_DEFAULTS = {
  firstName: "",
  lastName: "",
  gender: "" as CommonModels.ParticipantGenderEnum | "",
  birthYear: undefined as number | undefined,
  weight: undefined as number | undefined,
  beltLevel: "" as CommonModels.BeltEnum | "",
};

export const COACH_FORM_DEFAULTS = {
  email: "",
  firstName: "",
  lastName: "",
  clubName: "",
};
