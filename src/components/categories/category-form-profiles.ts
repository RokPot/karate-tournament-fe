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
      team: false,
      subDiscipline: true,
    },
    require: {
      age: true,
      weight: false,
      belt: true,
      team: false,
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

export function getCategoryFormProfile(
  discipline: CommonModels.DisciplineEnum | undefined,
): CategoryFormProfile | null {
  if (!discipline) {
    return null;
  }
  return categoryFormProfiles[discipline];
}

export type CategoryFormValidationPath = keyof CategoryFormValues;

export type CategoryFormValidationError = {
  path: CategoryFormValidationPath;
  message: string;
};

function isMissingNumber(value: number | null | undefined): boolean {
  return value === undefined || value === null;
}

function isMissingBelt(value: CommonModels.BeltEnum | null | undefined): boolean {
  return value === undefined || value === null;
}

export function validateCategoryForm(
  data: CategoryFormValues,
): CategoryFormValidationError[] {
  const profile = categoryFormProfiles[data.discipline];
  const errors: CategoryFormValidationError[] = [];

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
  }
  if (!profile.show.subDiscipline) {
    setValue("subDiscipline", null);
  }
}

function toNormalizedCategoryPayload(
  data: CategoryFormValues,
): CategoriesModels.CreateCategoryDto {
  const { discipline } = data;
  const profile = categoryFormProfiles[discipline];

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
    teamSize: profile.show.team ? (data.teamSize ?? null) : null,
    teamReservesSize: profile.show.team ? (data.teamReservesSize ?? null) : null,
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
  };
}

export function toCreateCategoryPayload(
  data: CategoryFormValues,
): CategoriesModels.CreateCategoryDto {
  return toNormalizedCategoryPayload(data);
}

export function toUpdateCategoryPayload(
  data: CategoryFormValues,
): CategoriesModels.UpdateCategoryDto {
  return toNormalizedCategoryPayload(data);
}
