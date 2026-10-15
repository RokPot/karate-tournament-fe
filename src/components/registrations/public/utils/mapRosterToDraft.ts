import { CommonModels } from "@/data/common/common.models";
import { RegistrationsModels } from "@/data/registrations/registrations.models";

import type { CoachDetails, DraftParticipant, DraftTeam } from "../types";

export type MappedRosterDraft = {
  coach: CoachDetails;
  participants: DraftParticipant[];
  teams: DraftTeam[];
};

function idsAt(
  participants: DraftParticipant[],
  indexes: number[],
): string[] {
  return indexes.flatMap((index) => {
    const clientId = participants[index]?.clientId;
    return clientId ? [clientId] : [];
  });
}

export function mapRosterToDraft(
  roster: RegistrationsModels.RosterResponseDto,
): MappedRosterDraft {
  const participants: DraftParticipant[] = roster.participants.map(
    (participant) => ({
      clientId: participant.userId,
      userId: participant.userId,
      firstName: participant.firstName,
      lastName: participant.lastName,
      gender:
        participant.gender ??
        ("" as CommonModels.ParticipantGenderEnum),
      dateOfBirth: participant.dateOfBirth,
      weight: participant.weight ?? undefined,
      beltLevel:
        participant.beltLevel ?? ("" as CommonModels.BeltEnum),
      categoryIds: participant.registrations.map(
        (registration) => registration.categoryId,
      ),
    }),
  );

  const teams: DraftTeam[] = roster.teams.map((team) => ({
    clientId: team.id,
    id: team.id,
    name: team.name,
    categoryId: team.categoryId,
    starterIds: idsAt(participants, team.starters),
    reserveIds: idsAt(participants, team.reserves ?? []),
  }));

  const clubName = roster.clubName?.trim();

  return {
    coach: {
      email: roster.email,
      firstName: roster.firstName,
      lastName: roster.lastName,
      ...(clubName ? { clubName } : {}),
    },
    participants,
    teams,
  };
}
