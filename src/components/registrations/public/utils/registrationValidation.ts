import { DateUtils } from "@/util/date.utils";

import type { CoachDetails, DraftParticipant, WizardStep } from "../types";

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
