import { CommonModels } from "@/data/common/common.models";
import { RegistrationsModels } from "@/data/registrations/registrations.models";

export type WizardStep = "participants" | "categories" | "coach" | "results";

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
