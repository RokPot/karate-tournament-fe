import { CommonModels } from "@/data/common/common.models";
import { RegistrationsModels } from "@/data/registrations/registrations.models";

export type RegistrantMode = "single" | "club";

/** Form steps used by validation / legacy wizard helpers. */
export type WizardStep =
  | "contact"
  | "participants"
  | "categories"
  | "results";

/** URL `step` query values (includes review overview). */
export type RegistrationFlowStep =
  | "contact"
  | "participants"
  | "categories"
  | "review"
  | "results";

export const REGISTRATION_FLOW_STEPS: RegistrationFlowStep[] = [
  "contact",
  "participants",
  "categories",
  "review",
  "results",
];

export function isRegistrantMode(value: unknown): value is RegistrantMode {
  return value === "single" || value === "club";
}

export function isRegistrationFlowStep(
  value: unknown,
): value is RegistrationFlowStep {
  return (
    value === "contact" ||
    value === "participants" ||
    value === "categories" ||
    value === "review" ||
    value === "results"
  );
}

export interface DraftTeam {
  clientId: string;
  categoryId: string;
  starterIds: string[];
  reserveIds: string[];
}

export interface DraftParticipant {
  clientId: string;
  firstName: string;
  lastName: string;
  gender: CommonModels.ParticipantGenderEnum;
  dateOfBirth: string;
  weight: number;
  beltLevel: CommonModels.BeltEnum;
  categoryIds: string[];
}

export type ParticipantAttributes = Pick<
  DraftParticipant,
  "firstName" | "lastName" | "gender" | "dateOfBirth" | "weight" | "beltLevel"
>;

export interface CoachDetails {
  email: string;
  firstName: string;
  lastName: string;
  clubName?: string;
}

export type BulkRegistrationResponse =
  RegistrationsModels.BulkPublicRegistrationResponseDto;
