import { useCallback } from "react";

import type { UseDraftParticipantsReturn } from "./useDraftParticipants";

export function useCategoryAssignments(draft: UseDraftParticipantsReturn) {
  const { participants, setParticipants } = draft;

  const isAssigned = useCallback(
    (categoryId: string, clientId: string) => {
      const participant = participants.find((p) => p.clientId === clientId);
      return participant?.categoryIds.includes(categoryId) ?? false;
    },
    [participants],
  );

  const toggleAssignment = useCallback(
    (categoryId: string, clientId: string) => {
      setParticipants((prev) =>
        prev.map((participant) => {
          if (participant.clientId !== clientId) {
            return participant;
          }
          const hasCategory = participant.categoryIds.includes(categoryId);
          return {
            ...participant,
            categoryIds: hasCategory
              ? participant.categoryIds.filter((id) => id !== categoryId)
              : [...participant.categoryIds, categoryId],
          };
        }),
      );
    },
    [setParticipants],
  );

  return {
    isAssigned,
    toggleAssignment,
  };
}
