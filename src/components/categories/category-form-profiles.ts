import type { UseFormSetValue } from "react-hook-form";

import { CategoriesModels } from "@/data/categories/categories.models";
import { CommonModels } from "@/data/common/common.models";

export type CategoryFieldGroup = "age" | "weight" | "belt" | "team" | "subDiscipline";
export type CategoryFormValues = CategoriesModels.CreateCategoryDto;

export interface CategoryFormProfile {
  show: Record<CategoryFieldGroup, boolean>;
  require: Record<CategoryFieldGroup, boolean>;
}

export const categoryFormProfiles: Record<CommonModels.DisciplineEnum, CategoryFormProfile> = {
  kata: {
    show: {
      age: true,
      weight: false,
      belt: true,
      team: false,
      subDiscipline: false,
    },
    require: {
      age: true,
      weight: false,
      belt: true,
      team: false,
      subDiscipline: false,
    },
  },
  "kata-team": {
    show: {
      age: true,
      weight: false,
      belt: false,
      team: true,
      subDiscipline: false,
    },
    require: {
      age: true,
      weight: false,
      belt: false,
      team: true,
      subDiscipline: false,
    },
  },
  "yako-soku-kumite": {
    show: {
      age: true,
      weight: false,
      belt: true,
      team: true,
      subDiscipline: true,
    },
    require: {
      age: true,
      weight: false,
      belt: true,
      team: true,
      subDiscipline: true,
    },
  },
  "yiju-kumite": {
    show: {
      age: true,
      weight: true,
      belt: false,
      team: false,
      subDiscipline: false,
    },
    require: {
      age: true,
      weight: true,
      belt: false,
      team: false,
      subDiscipline: false,
    },
  },
  "kumite-team": {
    show: {
      age: true,
      weight: false,
      belt: false,
      team: true,
      subDiscipline: false,
    },
    require: {
      age: true,
      weight: false,
      belt: false,
      team: true,
      subDiscipline: false,
    },
  },
};

export type CategoryFormProfileOptions = {
  unrestrictedKata?: boolean;
  allowOtherCategories?: boolean;
};

function isOpenAgeBound(value: number | null | undefined): boolean {
  return value == null || value === 0;
}

export function isUnrestrictedKataCategory(
  category: Pick<
    CommonModels.CategoryResponseDto,
    "discipline" | "ageMin" | "ageMax" | "beltMin" | "beltMax"
  >,
): boolean {
  return (
    category.discipline === CommonModels.DisciplineEnum.kata &&
    isOpenAgeBound(category.ageMin) &&
    isOpenAgeBound(category.ageMax) &&
    !category.beltMin &&
    !category.beltMax
  );
}

function withUnrestrictedKataProfile(profile: CategoryFormProfile): CategoryFormProfile {
  return {
    show: {
      ...profile.show,
      age: false,
      weight: false,
      belt: false,
    },
    require: {
      ...profile.require,
      age: false,
      weight: false,
      belt: false,
    },
  };
}

export function getCategoryFormProfile(
  discipline: CommonModels.DisciplineEnum | undefined,
  options?: CategoryFormProfileOptions,
): CategoryFormProfile | null {
  if (!discipline) {
    return null;
  }
  const profile = categoryFormProfiles[discipline];
  if (discipline === CommonModels.DisciplineEnum.kata && options?.unrestrictedKata) {
    return withUnrestrictedKataProfile(profile);
  }
  return profile;
}

export type CategoryFormValidationPath = keyof CategoryFormValues;

export type CategoryFormValidationError = {
  path: CategoryFormValidationPath;
  message: string;
};

function isMissingNumber(
  value: number | null | undefined,
): value is null | undefined {
  return value === undefined || value === null;
}

function isMissingBelt(value: CommonModels.BeltEnum | null | undefined): boolean {
  return value === undefined || value === null;
}

export function validateCategoryForm(
  data: CategoryFormValues,
  options?: CategoryFormProfileOptions,
): CategoryFormValidationError[] {
  const profile = getCategoryFormProfile(data.discipline, options);
  const errors: CategoryFormValidationError[] = [];

  if (!profile) {
    return errors;
  }

  if (profile.require.age) {
    if (isMissingNumber(data.ageMin)) {
      errors.push({
        path: "ageMin",
        message: "Minimum age is required",
      });
    }
    if (isMissingNumber(data.ageMax)) {
      errors.push({
        path: "ageMax",
        message: "Maximum age is required",
      });
    }
  }

  if (profile.require.weight) {
    if (isMissingNumber(data.weightMin)) {
      errors.push({
        path: "weightMin",
        message: "Minimum weight is required",
      });
    }
    if (isMissingNumber(data.weightMax)) {
      errors.push({
        path: "weightMax",
        message: "Maximum weight is required",
      });
    }
  }

  if (profile.require.belt) {
    if (isMissingBelt(data.beltMin)) {
      errors.push({
        path: "beltMin",
        message: "Minimum belt is required",
      });
    }
    if (isMissingBelt(data.beltMax)) {
      errors.push({
        path: "beltMax",
        message: "Maximum belt is required",
      });
    }
  }

  if (profile.require.team) {
    if (isMissingNumber(data.teamSize)) {
      errors.push({
        path: "teamSize",
        message: "Team size is required",
      });
    }
    if (isMissingNumber(data.teamReservesSize)) {
      errors.push({
        path: "teamReservesSize",
        message: "Reserve slots is required",
      });
    }
  }

  if (profile.require.subDiscipline && !data.subDiscipline) {
    errors.push({
      path: "subDiscipline",
      message: "Sub-discipline is required",
    });
  }

  return errors;
}

export function otherCategorySeatErrors(
  data: CategoryFormValues,
  allowOtherCategories: boolean,
): CategoryFormValidationError[] {
  const profile = getCategoryFormProfile(data.discipline);
  if (
    !allowOtherCategories ||
    !profile?.show.team ||
    isMissingNumber(data.teamSize) ||
    data.teamSize <= 0
  ) {
    return [];
  }

  const errors: CategoryFormValidationError[] = [];
  if (!data.feederCategoryIds?.length) {
    errors.push({
      path: "feederCategoryIds",
      message: "otherCategoriesRequired",
    });
  }
  if (isMissingNumber(data.feederParticipantLimit) || data.feederParticipantLimit < 1) {
    errors.push({
      path: "feederParticipantLimit",
      message: "otherCategorySeatsRequired",
    });
  }
  return errors;
}

export function clearHiddenCategoryFields(
  discipline: CommonModels.DisciplineEnum,
  setValue: UseFormSetValue<CategoryFormValues>,
): void {
  const profile = categoryFormProfiles[discipline];

  if (!profile.show.age) {
    setValue("ageMin", undefined);
    setValue("ageMax", undefined);
  }
  if (!profile.show.weight) {
    setValue("weightMin", undefined);
    setValue("weightMax", undefined);
  }
  if (!profile.show.belt) {
    setValue("beltMin", null);
    setValue("beltMax", null);
  }
  if (!profile.show.team) {
    setValue("teamSize", undefined);
    setValue("teamReservesSize", undefined);
    setValue("feederCategoryIds", []);
    setValue("feederParticipantLimit", null);
  }
  if (!profile.show.subDiscipline) {
    setValue("subDiscipline", null);
  }
}

function toNormalizedCategoryPayload(
  data: CategoryFormValues,
  options?: CategoryFormProfileOptions,
): CategoriesModels.CreateCategoryDto {
  const { discipline } = data;
  const profile = getCategoryFormProfile(discipline, options) ?? categoryFormProfiles[discipline];
  const teamSize = profile.show.team ? (data.teamSize ?? null) : null;
  const allowOthers =
    options?.allowOtherCategories === true && teamSize != null && teamSize > 0;

  return {
    name: data.name,
    discipline,
    gender: data.gender ?? null,
    subDiscipline: profile.show.subDiscipline ? (data.subDiscipline ?? null) : null,
    ageMin: profile.show.age ? (data.ageMin ?? null) : null,
    ageMax: profile.show.age ? (data.ageMax ?? null) : null,
    weightMin: profile.show.weight ? (data.weightMin ?? null) : null,
    weightMax: profile.show.weight ? (data.weightMax ?? null) : null,
    beltMin: profile.show.belt ? (data.beltMin ?? null) : null,
    beltMax: profile.show.belt ? (data.beltMax ?? null) : null,
    teamSize,
    teamReservesSize: profile.show.team ? (data.teamReservesSize ?? null) : null,
    feederCategoryIds: allowOthers ? (data.feederCategoryIds ?? []) : [],
    feederParticipantLimit: allowOthers
      ? (data.feederParticipantLimit ?? null)
      : null,
  };
}

export function mapCategoryToFormValues(
  category: CommonModels.CategoryResponseDto,
): CategoryFormValues {
  return {
    name: category.name,
    discipline: category.discipline,
    subDiscipline: category.subDiscipline ?? null,
    gender: category.gender ?? null,
    ageMin: category.ageMin ?? undefined,
    ageMax: category.ageMax ?? undefined,
    weightMin: category.weightMin ?? undefined,
    weightMax: category.weightMax ?? undefined,
    beltMin: category.beltMin ?? null,
    beltMax: category.beltMax ?? null,
    teamSize: category.teamSize ?? undefined,
    teamReservesSize: category.teamReservesSize ?? undefined,
    feederCategoryIds: category.feederCategoryIds ?? [],
    feederParticipantLimit: category.feederParticipantLimit ?? null,
  };
}

export function toCreateCategoryPayload(
  data: CategoryFormValues,
  options?: CategoryFormProfileOptions,
): CategoriesModels.CreateCategoryDto {
  return toNormalizedCategoryPayload(data, options);
}

export function toUpdateCategoryPayload(
  data: CategoryFormValues,
  options?: CategoryFormProfileOptions,
): CategoriesModels.UpdateCategoryDto {
  return toNormalizedCategoryPayload(data, options);
}
