import { CommonModels } from "@/data/common/common.models";
import { DateUtils } from "@/util/date.utils";

export type CategoryPreviewFilters = {
  dateOfBirth: string;
  gender: CommonModels.CategoryGenderEnum;
  weightKg?: number;
  competitionDate: string;
};

/** Age in full years on a specific calendar day (competition day). */
export function calculateAgeOnDate(
  birthDate: string,
  onDate: string,
): number | undefined {
  const birth = DateUtils.parseDate(birthDate);
  const on = DateUtils.parseDate(onDate);
  if (!birth || !on) return undefined;
  if (birth.getTime() > on.getTime()) return undefined;

  let years = on.getFullYear() - birth.getFullYear();
  const birthdayNotYet =
    on.getMonth() < birth.getMonth() ||
    (on.getMonth() === birth.getMonth() && on.getDate() < birth.getDate());
  if (birthdayNotYet) {
    years -= 1;
  }
  return Math.floor(years);
}

function isUnboundedMin(value: number | null | undefined): boolean {
  return value == null || value === 0;
}

function isUnboundedMax(value: number | null | undefined): boolean {
  return value == null || value === 0;
}

function matchesAge(
  age: number,
  ageMin: number | null | undefined,
  ageMax: number | null | undefined,
): boolean {
  if (!isUnboundedMin(ageMin) && age < (ageMin as number)) return false;
  if (!isUnboundedMax(ageMax) && age > (ageMax as number)) return false;
  return true;
}

function matchesWeight(
  weightKg: number | undefined,
  weightMin: number | null | undefined,
  weightMax: number | null | undefined,
): boolean {
  const hasLimit = !isUnboundedMin(weightMin) || !isUnboundedMax(weightMax);
  if (weightKg == null) {
    return !hasLimit;
  }
  if (!isUnboundedMin(weightMin) && weightKg < (weightMin as number)) {
    return false;
  }
  if (!isUnboundedMax(weightMax) && weightKg > (weightMax as number)) {
    return false;
  }
  return true;
}

function matchesGender(
  gender: CommonModels.CategoryGenderEnum,
  categoryGender: CommonModels.CategoryGenderEnum | null | undefined,
): boolean {
  if (categoryGender == null) return true;
  return categoryGender === gender;
}

/** Client-side category preview (age on competition day, gender, optional weight). */
export function filterCategoriesByPreview(
  categories: CommonModels.CategoryResponseDto[],
  filters: CategoryPreviewFilters,
): CommonModels.CategoryResponseDto[] {
  const age = calculateAgeOnDate(filters.dateOfBirth, filters.competitionDate);
  if (age === undefined) return [];

  return categories.filter(
    (category) =>
      matchesGender(filters.gender, category.gender) &&
      matchesAge(age, category.ageMin, category.ageMax) &&
      matchesWeight(filters.weightKg, category.weightMin, category.weightMax),
  );
}
