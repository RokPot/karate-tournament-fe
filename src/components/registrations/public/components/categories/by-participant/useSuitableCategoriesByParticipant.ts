import { useEffect, useMemo } from "react";

import type { DraftParticipant } from "@/components/registrations/public/types";
import { mapParticipantsToPublicProfiles } from "@/components/registrations/public/utils/mapParticipantToPublicProfile";
import { isParticipantComplete } from "@/components/registrations/public/utils/registrationValidation";
import { RegistrationsQueries } from "@/data/registrations/registrations.queries";

import { deriveAthleteAssignmentItems } from "./deriveAthleteAssignmentItems";

export type { ParticipantEligibleCategories } from "./deriveAthleteAssignmentItems";

interface UseSuitableCategoriesByParticipantParams {
  tournamentId: string;
  participants: DraftParticipant[];
  enabled?: boolean;
}

function participantProfilesKey(participants: DraftParticipant[]): string {
  return participants
    .map((participant) =>
      [
        participant.clientId,
        participant.firstName,
        participant.lastName,
        participant.dateOfBirth,
        participant.gender,
        participant.beltLevel,
        participant.weight ?? "",
      ].join("\0"),
    )
    .join("|");
}

export function useSuitableCategoriesByParticipant({
  tournamentId,
  participants,
  enabled = true,
}: UseSuitableCategoriesByParticipantParams) {
  const canFetch =
    enabled &&
    !!tournamentId &&
    participants.length > 0 &&
    participants.every((participant) => isParticipantComplete(participant));
  const profilesKey = participantProfilesKey(participants);

  const { mutate, data: items, isPending, isError, reset } =
    RegistrationsQueries.useGetBulkPublicSuitableCategories();

  useEffect(() => {
    if (!canFetch) {
      reset();
      return;
    }

    mutate({
      data: {
        tournamentId,
        participants: mapParticipantsToPublicProfiles(participants),
      },
    });
    // Fetch when athlete profiles change, not when category assignments change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canFetch, tournamentId, profilesKey, mutate, reset]);

  const { participantItems, teamItems } = useMemo(() => {
    if (!canFetch) {
      return { participantItems: [], teamItems: [] };
    }
    return deriveAthleteAssignmentItems(participants, items);
  }, [canFetch, items, participants]);

  return {
    participantItems,
    teamItems,
    isLoading: canFetch && isPending && !items,
    isError,
  };
}
