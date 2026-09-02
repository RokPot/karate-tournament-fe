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
        participants: mapParticipantsToPublicProfiles(participants),
      },
    });
    // Fetch once when entering the categories step, not when local assignments change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canFetch, tournamentId, mutate, reset]);

  const categoryItems = useMemo(
    () =>
      canFetch
        ? (items ?? []).filter((item) => item.participants.length > 0)
        : [],
    [canFetch, items],
  );

  return {
    categoryItems,
    isLoading: canFetch && isPending && !items,
    isError,
  };
}
