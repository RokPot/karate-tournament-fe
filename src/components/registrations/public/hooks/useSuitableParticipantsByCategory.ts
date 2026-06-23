import { useEffect, useMemo } from "react";

import { RegistrationsQueries } from "@/data/registrations/registrations.queries";

import type { DraftParticipant } from "../types";
import { mapParticipantsToPublicProfiles } from "../utils/mapParticipantToPublicProfile";
import { isParticipantComplete } from "../utils/registrationValidation";

interface UseSuitableParticipantsByCategoryParams {
  tournamentId: string;
  participants: DraftParticipant[];
  enabled?: boolean;
}

export function useSuitableParticipantsByCategory({
  tournamentId,
  participants,
  enabled = true,
}: UseSuitableParticipantsByCategoryParams) {
  const publicProfiles = useMemo(
    () => mapParticipantsToPublicProfiles(participants),
    [participants],
  );

  const canFetch =
    enabled &&
    !!tournamentId &&
    participants.length > 0 &&
    participants.every((participant) => isParticipantComplete(participant));

  const { mutate, data: items, isPending, isError, reset } =
    RegistrationsQueries.useGetSuitableParticipantsByCategory();

  useEffect(() => {
    if (!canFetch) {
      reset();
      return;
    }

    mutate({
      data: {
        tournamentId,
        participants: publicProfiles,
      },
    });
  }, [canFetch, tournamentId, publicProfiles, mutate, reset]);

  return {
    categoryItems: canFetch ? (items ?? []) : [],
    isLoading: canFetch && isPending,
    isError,
  };
}
