import { CommonModels } from "@/data/common/common.models";

import type { DraftParticipant } from "../types";

const STAFF_ROLES: CommonModels.UserEnum[] = [
  CommonModels.UserEnum.admin,
  CommonModels.UserEnum.club_owner,
  CommonModels.UserEnum.club_coach,
];

export function isClubMemberParticipant(
  member: CommonModels.UserResponseDto,
): boolean {
  const roles = member.roles;
  if (STAFF_ROLES.some((role) => roles.includes(role))) {
    return false;
  }
  return roles.includes(CommonModels.UserEnum.club_member);
}

export function mapMemberToDraftParticipant(
  member: CommonModels.UserResponseDto,
): DraftParticipant | null {
  if (!isClubMemberParticipant(member)) {
    return null;
  }

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
