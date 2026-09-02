import type { DraftTeam } from "../types";

export function teamMemberIds(team: Pick<DraftTeam, "starterIds" | "reserveIds">): string[] {
  return [...team.starterIds, ...team.reserveIds];
}

export function teamRosterKey(ids: string[]): string {
  return [...new Set(ids)].sort().join("|");
}

export function isDuplicateTeam(
  members: string[],
  existingTeams: DraftTeam[],
): boolean {
  const key = teamRosterKey(members);
  if (!key) {
    return false;
  }
  return existingTeams.some(
    (team) => teamRosterKey(teamMemberIds(team)) === key,
  );
}

export function canAddMember(
  candidateId: string,
  currentMembers: string[],
  existingTeams: DraftTeam[],
): boolean {
  if (currentMembers.includes(candidateId)) {
    return false;
  }

  return !isDuplicateTeam([...currentMembers, candidateId], existingTeams);
}

export type TeamMemberAvailability = "unused" | "reusable" | "blocked";

export function classifyTeamMember(
  candidateId: string,
  currentMembers: string[],
  existingTeams: DraftTeam[],
): TeamMemberAvailability {
  if (!canAddMember(candidateId, currentMembers, existingTeams)) {
    return "blocked";
  }

  const alreadyUsed = existingTeams.some((team) =>
    teamMemberIds(team).includes(candidateId),
  );
  return alreadyUsed ? "reusable" : "unused";
}

export function isTeamCategory(category: {
  discipline: string;
  teamSize?: number | null;
}): boolean {
  return (
    (category.discipline === "kata-team" ||
      category.discipline === "kumite-team") &&
    category.teamSize != null &&
    category.teamSize > 0
  );
}

export function getTeamCategoryIds(
  categories: { id: string; discipline: string; teamSize?: number | null }[],
): Set<string> {
  return new Set(
    categories.filter(isTeamCategory).map((category) => category.id),
  );
}
