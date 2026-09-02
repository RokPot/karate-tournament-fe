import { DateUtils } from "@/util/date.utils";
import { CommonModels } from "@/data/common/common.models";

import type { CoachDetails, DraftParticipant, WizardStep } from "../types";

export interface CategoryGroupedRegistrations {
  categoryId: string;
  categoryName: string;
  participants: DraftParticipant[];
}

export function isParticipantComplete(
  participant: Pick<
    DraftParticipant,
    "firstName" | "lastName" | "gender" | "dateOfBirth" | "weight" | "beltLevel"
  >,
): boolean {
  return (
    !!participant.firstName.trim() &&
    !!participant.lastName.trim() &&
    !!participant.gender &&
    !!participant.dateOfBirth &&
    participant.weight >= 0 &&
    Number.isFinite(participant.weight) &&
    !!participant.beltLevel
  );
}

export function canAdvanceFromParticipants(
  participants: DraftParticipant[],
): boolean {
  return (
    participants.length > 0 &&
    participants.every((p) => isParticipantComplete(p))
  );
}

/** At least one participant must be assigned to a category to continue. */
export function canAdvanceFromCategories(
  participants: DraftParticipant[],
): boolean {
  return participants.some((participant) => participant.categoryIds.length > 0);
}

export function isCoachFormValid(coach: CoachDetails): boolean {
  return (
    !!coach.email &&
    !!coach.firstName.trim() &&
    !!coach.lastName.trim()
  );
}

export function canAdvanceFromStep(
  step: WizardStep,
  participants: DraftParticipant[],
): boolean {
  switch (step) {
    case "participants":
      return canAdvanceFromParticipants(participants);
    case "categories":
      return canAdvanceFromCategories(participants);
    default:
      return false;
  }
}

export function getParticipantsWithSelections(
  participants: DraftParticipant[],
): DraftParticipant[] {
  return participants.filter(
    (participant) => participant.categoryIds.length > 0,
  );
}

export function getRegistrationsGroupedByCategory(
  participants: DraftParticipant[],
  tournamentCategories: CommonModels.CategoryResponseDto[],
): CategoryGroupedRegistrations[] {
  const groups: CategoryGroupedRegistrations[] = [];
  const seenCategoryIds = new Set<string>();

  for (const category of tournamentCategories) {
    seenCategoryIds.add(category.id);
    const assigned = participants.filter((participant) =>
      participant.categoryIds.includes(category.id),
    );
    if (assigned.length === 0) {
      continue;
    }
    groups.push({
      categoryId: category.id,
      categoryName: category.name,
      participants: assigned,
    });
  }

  const leftoverIds = new Set<string>();
  for (const participant of participants) {
    for (const categoryId of participant.categoryIds) {
      if (!seenCategoryIds.has(categoryId)) {
        leftoverIds.add(categoryId);
      }
    }
  }

  for (const categoryId of leftoverIds) {
    groups.push({
      categoryId,
      categoryName: categoryId,
      participants: participants.filter((participant) =>
        participant.categoryIds.includes(categoryId),
      ),
    });
  }

  return groups;
}

export function formatParticipantDateOfBirthLabel(dateOfBirth: string): string {
  const year = DateUtils.getBirthYearFromDateOfBirth(dateOfBirth);
  if (year === undefined) {
    return "-";
  }
  const age = DateUtils.formatAgeFromBirthDate(dateOfBirth);
  return age !== "-" ? `${year} (${age}y)` : String(year);
}

export function getParticipantLabel(
  participant: DraftParticipant,
  index: number,
): string {
  const name = `${participant.firstName} ${participant.lastName}`.trim();
  return `${name || `#${index + 1}`} · ${participant.gender} · ${formatParticipantDateOfBirthLabel(participant.dateOfBirth)} · ${participant.weight}kg`;
}
