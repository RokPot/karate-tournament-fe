import { useCallback, useEffect, useRef, useState } from "react";

import type { DraftTeam } from "../types";
import { teamMemberIds } from "../utils/teamOverlap";
import type { UseDraftParticipantsReturn } from "./useDraftParticipants";

function createTeamId(): string {
  return crypto.randomUUID();
}

function sameTeamMembers(a: DraftTeam, b: DraftTeam): boolean {
  return (
    a.clientId === b.clientId &&
    a.categoryId === b.categoryId &&
    a.starterIds.join(",") === b.starterIds.join(",") &&
    a.reserveIds.join(",") === b.reserveIds.join(",")
  );
}

function pruneTeams(teams: DraftTeam[], validIds: Set<string>): DraftTeam[] {
  return teams.flatMap((team) => {
    const starterIds = team.starterIds.filter((id) => validIds.has(id));
    if (starterIds.length !== team.starterIds.length) {
      return [];
    }
    return [
      {
        ...team,
        starterIds,
        reserveIds: team.reserveIds.filter((id) => validIds.has(id)),
      },
    ];
  });
}

export function useDraftTeams(draft: UseDraftParticipantsReturn) {
  const [teams, setTeams] = useState<DraftTeam[]>([]);
  const seenCategoryIdsRef = useRef<Set<string>>(new Set());
  const setParticipants = draft.setParticipants;

  const addTeam = useCallback(
    (categoryId: string, starterIds: string[], reserveIds: string[]) => {
      const team: DraftTeam = {
        clientId: createTeamId(),
        categoryId,
        starterIds,
        reserveIds,
      };
      seenCategoryIdsRef.current.add(categoryId);
      setTeams((prev) => [...prev, team]);
    },
    [],
  );

  const removeTeam = useCallback((teamId: string) => {
    setTeams((prev) => {
      const removed = prev.find((team) => team.clientId === teamId);
      if (removed) {
        seenCategoryIdsRef.current.add(removed.categoryId);
      }
      return prev.filter((team) => team.clientId !== teamId);
    });
  }, []);

  const resetTeams = useCallback(() => {
    setTeams([]);
  }, []);

  const getTeamsForCategory = useCallback(
    (categoryId: string) => teams.filter((team) => team.categoryId === categoryId),
    [teams],
  );

  useEffect(() => {
    const validIds = new Set(
      draft.participants.map((participant) => participant.clientId),
    );
    const pruned = pruneTeams(teams, validIds);
    const teamsUnchanged =
      pruned.length === teams.length &&
      pruned.every((team, index) => sameTeamMembers(team, teams[index]!));

    if (!teamsUnchanged) {
      setTeams(pruned);
      return;
    }

    const categoryIds = new Set([
      ...seenCategoryIdsRef.current,
      ...teams.map((team) => team.categoryId),
    ]);
    seenCategoryIdsRef.current = categoryIds;
    if (categoryIds.size === 0) {
      return;
    }

    setParticipants((prev) => {
      let changed = false;
      const next = prev.map((participant) => {
        let categoryIdsForParticipant = participant.categoryIds;
        for (const categoryId of categoryIds) {
          const members = new Set(
            teams
              .filter((team) => team.categoryId === categoryId)
              .flatMap(teamMemberIds),
          );
          const hasCategory = categoryIdsForParticipant.includes(categoryId);
          const shouldHaveCategory = members.has(participant.clientId);
          if (hasCategory === shouldHaveCategory) {
            continue;
          }
          changed = true;
          categoryIdsForParticipant = shouldHaveCategory
            ? [...categoryIdsForParticipant, categoryId]
            : categoryIdsForParticipant.filter((id) => id !== categoryId);
        }
        if (categoryIdsForParticipant === participant.categoryIds) {
          return participant;
        }
        return { ...participant, categoryIds: categoryIdsForParticipant };
      });
      return changed ? next : prev;
    });
  }, [draft.participants, setParticipants, teams]);

  return {
    teams,
    addTeam,
    removeTeam,
    resetTeams,
    getTeamsForCategory,
  };
}

export type UseDraftTeamsReturn = ReturnType<typeof useDraftTeams>;
