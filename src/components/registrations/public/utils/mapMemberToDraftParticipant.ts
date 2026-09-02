import { CommonModels } from "@/data/common/common.models";

import type { DraftParticipant } from "../types";

export function mapMemberToDraftParticipant(
  member: CommonModels.UserResponseDto,
): DraftParticipant | null {
  const firstName = member.firstName?.trim() ?? "";
  const lastName = member.lastName?.trim() ?? "";
  if (!firstName || !lastName) {
    return null;
  }

  return {
    clientId: member.id,
    firstName,
    lastName,
    gender: member.gender ?? ("" as CommonModels.ParticipantGenderEnum),
    dateOfBirth: member.dateOfBirth ?? "",
    weight: member.weight ?? Number.NaN,
    beltLevel: member.beltLevel ?? ("" as CommonModels.BeltEnum),
    categoryIds: [],
  };
}
