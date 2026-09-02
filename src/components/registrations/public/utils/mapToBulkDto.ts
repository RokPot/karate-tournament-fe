import { CommonModels } from "@/data/common/common.models";
import { RegistrationsModels } from "@/data/registrations/registrations.models";

import type { CoachDetails, DraftParticipant, DraftTeam } from "../types";
import { getTeamCategoryIds, teamMemberIds } from "./teamOverlap";

export function mapToBulkDto(
  tournamentId: string,
  coach: CoachDetails,
  participants: DraftParticipant[],
  teams: DraftTeam[] = [],
  tournamentCategories: CommonModels.CategoryResponseDto[] = [],
): RegistrationsModels.BulkPublicRegistrationDto {
  const trimmedClubName = coach.clubName?.trim();
  const teamCategoryIds = getTeamCategoryIds(tournamentCategories);
  const teamMemberIdSet = new Set(teams.flatMap(teamMemberIds));

  const included = participants.filter((participant) => {
    const individualIds = participant.categoryIds.filter(
      (id) => !teamCategoryIds.has(id),
    );
    return individualIds.length > 0 || teamMemberIdSet.has(participant.clientId);
  });

  const indexByClientId = new Map(
    included.map((participant, index) => [participant.clientId, index]),
  );

  const mappedTeams =
    teams.length === 0
      ? undefined
      : teams.map((team) => ({
          categoryId: team.categoryId,
          starters: team.starterIds.map((id) => ({
            participantIndex: indexByClientId.get(id) ?? -1,
          })),
          reserves: team.reserveIds.map((id) => ({
            participantIndex: indexByClientId.get(id) ?? -1,
          })),
        }));

  return {
    email: coach.email,
    firstName: coach.firstName.trim(),
    lastName: coach.lastName.trim(),
    ...(trimmedClubName ? { clubName: trimmedClubName } : {}),
    tournamentId,
    participants: included.map((participant) => ({
      firstName: participant.firstName.trim(),
      lastName: participant.lastName.trim(),
      weight: participant.weight,
      dateOfBirth: participant.dateOfBirth,
      gender: participant.gender,
      beltLevel: participant.beltLevel,
      registrations: participant.categoryIds
        .filter((categoryId) => !teamCategoryIds.has(categoryId))
        .map((categoryId) => ({
          categoryId,
        })),
    })),
    ...(mappedTeams ? { teams: mappedTeams } : {}),
  };
}
