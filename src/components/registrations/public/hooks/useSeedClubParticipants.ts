import { useCallback, useEffect, useRef, useState } from "react";

import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { useAuthUser } from "@/hooks/useAuthUser";

import { mapMemberToDraftParticipant } from "../utils/mapMemberToDraftParticipant";
import type { UseDraftParticipantsReturn } from "./useDraftParticipants";

export function useSeedClubParticipants(draft: UseDraftParticipantsReturn) {
  const authUser = useAuthUser();
  const clubId = authUser?.clubId ?? "";
  const hasSeededRef = useRef(false);
  const [seededCount, setSeededCount] = useState(0);
  const setParticipants = draft.setParticipants;
  const participantCount = draft.participants.length;

  const { data: members } = ClubsQueries.useGetMembers(
    { id: clubId },
    { enabled: !!clubId },
  );

  useEffect(() => {
    if (hasSeededRef.current || !members) {
      return;
    }

    if (participantCount > 0) {
      hasSeededRef.current = true;
      return;
    }

    const mapped = members.flatMap((member) => {
      const participant = mapMemberToDraftParticipant(member);
      return participant ? [participant] : [];
    });

    if (mapped.length > 0) {
      setParticipants(mapped);
      setSeededCount(mapped.length);
    }
    hasSeededRef.current = true;
  }, [members, participantCount, setParticipants]);

  const resetSeed = useCallback(() => {
    hasSeededRef.current = false;
    setSeededCount(0);
  }, []);

  return { seededCount, resetSeed };
}
