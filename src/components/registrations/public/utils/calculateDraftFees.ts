import { CommonModels } from "@/data/common/common.models";

import type { DraftParticipant, DraftTeam } from "../types";
import {
  generateUniqueTeamNames,
  type TeamNameFormatter,
} from "./generateTeamNames";
import { getTeamCategoryIds } from "./teamOverlap";

export type DraftFeeParticipantLine = {
  clientId: string;
  name: string;
  categoryCount: number;
  amount: number;
};

export type DraftFeeTeamLine = {
  clientId: string;
  categoryId: string;
  categoryName: string;
  name: string;
  amount: number;
};

export type DraftFeesEstimate = {
  participants: DraftFeeParticipantLine[];
  teams: DraftFeeTeamLine[];
  total: number;
};

export function amountForIndividualCategoryCount(
  fees: CommonModels.TournamentFeeScheduleDto,
  categoryCount: number,
): number {
  if (categoryCount <= 0) {
    return 0;
  }
  if (categoryCount === 1) {
    return fees.oneCategory;
  }
  if (categoryCount === 2) {
    return fees.twoCategories;
  }
  return fees.threeOrMoreCategories;
}

export function calculateDraftFees(
  participants: DraftParticipant[],
  teams: DraftTeam[],
  categories: CommonModels.CategoryResponseDto[],
  fees: CommonModels.TournamentFeeScheduleDto,
  clubName: string | undefined,
  teamNameFormatter: TeamNameFormatter,
): DraftFeesEstimate {
  const teamCategoryIds = getTeamCategoryIds(categories);
  const teamNames = generateUniqueTeamNames(
    teams,
    categories,
    clubName,
    teamNameFormatter,
  );

  const participantLines: DraftFeeParticipantLine[] = participants.flatMap(
    (participant) => {
      const categoryCount = participant.categoryIds.filter(
        (id) => !teamCategoryIds.has(id),
      ).length;
      if (categoryCount === 0) {
        return [];
      }
      return [
        {
          clientId: participant.clientId,
          name: `${participant.firstName} ${participant.lastName}`.trim(),
          categoryCount,
          amount: amountForIndividualCategoryCount(fees, categoryCount),
        },
      ];
    },
  );

  const teamLines: DraftFeeTeamLine[] = teams.map((team) => {
    const categoryName =
      categories.find((category) => category.id === team.categoryId)?.name ??
      team.categoryId;
    return {
      clientId: team.clientId,
      categoryId: team.categoryId,
      categoryName,
      name: teamNames.get(team.clientId) ?? categoryName,
      amount: fees.team,
    };
  });

  const total =
    participantLines.reduce((sum, line) => sum + line.amount, 0) +
    teamLines.reduce((sum, line) => sum + line.amount, 0);

  return {
    participants: participantLines,
    teams: teamLines,
    total,
  };
}
