import { CommonModels } from "@/data/common/common.models";

const BELT_RANK_ORDER = CommonModels.BeltEnumSchema.options;

export namespace BeltUtils {
  /** Higher index = higher rank (10-kyu → … → 10-dan). Missing belts sort as -1. */
  export function getBeltRank(
    belt?: CommonModels.BeltEnum | null,
  ): number {
    if (!belt) return -1;
    return BELT_RANK_ORDER.indexOf(belt);
  }

  export function compareMemberName(
    a: Pick<CommonModels.UserResponseDto, "firstName" | "lastName">,
    b: Pick<CommonModels.UserResponseDto, "firstName" | "lastName">,
  ): number {
    const nameA = [a.lastName, a.firstName].filter(Boolean).join(" ").toLocaleLowerCase();
    const nameB = [b.lastName, b.firstName].filter(Boolean).join(" ").toLocaleLowerCase();
    return nameA.localeCompare(nameB);
  }
}
