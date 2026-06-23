import { RegistrationsModels } from "@/data/registrations/registrations.models";

import type { CoachDetails, DraftParticipant } from "../types";

export function mapToBulkDto(
  tournamentId: string,
  coach: CoachDetails,
  participants: DraftParticipant[],
): RegistrationsModels.BulkPublicRegistrationDto {
  const trimmedClubName = coach.clubName?.trim();

  return {
    email: coach.email,
    firstName: coach.firstName.trim(),
    lastName: coach.lastName.trim(),
    ...(trimmedClubName ? { clubName: trimmedClubName } : {}),
    tournamentId,
    participants: participants
      .filter((participant) => participant.categoryIds.length > 0)
      .map((participant) => ({
        firstName: participant.firstName.trim(),
        lastName: participant.lastName.trim(),
        weight: participant.weight,
        dateOfBirth: participant.dateOfBirth,
        gender: participant.gender,
        beltLevel: participant.beltLevel,
        registrations: participant.categoryIds.map((categoryId) => ({
          categoryId,
        })),
      })),
  };
}
