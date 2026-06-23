import { RegistrationsModels } from "@/data/registrations/registrations.models";

import type { DraftParticipant } from "../types";

export function mapParticipantToPublicProfile(
  participant: DraftParticipant,
): RegistrationsModels.PublicParticipantProfileDto {
  return {
    firstName: participant.firstName.trim(),
    lastName: participant.lastName.trim(),
    weight: participant.weight,
    dateOfBirth: participant.dateOfBirth,
    gender: participant.gender,
    beltLevel: participant.beltLevel,
  };
}

export function mapParticipantsToPublicProfiles(
  participants: DraftParticipant[],
): RegistrationsModels.PublicParticipantProfileDto[] {
  return participants.map(mapParticipantToPublicProfile);
}
