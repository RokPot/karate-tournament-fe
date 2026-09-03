import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { CommonModels } from "@/data/common/common.models";

const hasBoundedRange = (
  min: number | null | undefined,
  max: number | null | undefined,
) =>
  min !== null &&
  min !== undefined &&
  min >= 0 &&
  max !== null &&
  max !== undefined &&
  max >= 0;

export const useCategoryFormatters = () => {
  const { t } = useTranslation();

  const formatAgeRange = useCallback(
    (category: CommonModels.CategoryResponseDto) => {
      if (hasBoundedRange(category.ageMin, category.ageMax)) {
        if (category.ageMin === 0) {
          return t("categories.format.ageUpTo", { max: category.ageMax });
        }
        if (category.ageMax === 100) {
          return t("categories.format.ageFrom", { min: category.ageMin });
        }
        return t("categories.format.ageRange", {
          min: category.ageMin,
          max: category.ageMax,
        });
      }

      if (category.ageMin) {
        return t("categories.format.ageYears", { age: category.ageMin });
      }
      if (category.ageMax) {
        return t("categories.format.ageYears", { age: category.ageMax });
      }
      return t("categories.format.empty");
    },
    [t],
  );

  const formatWeightRange = useCallback(
    (category: CommonModels.CategoryResponseDto) => {
      if (hasBoundedRange(category.weightMin, category.weightMax)) {
        if (category.weightMin === 0) {
          return t("categories.format.weightUpTo", { max: category.weightMax });
        }
        if (category.weightMax === 100) {
          return t("categories.format.weightFrom", { min: category.weightMin });
        }
        return t("categories.format.weightRange", {
          min: category.weightMin,
          max: category.weightMax,
        });
      }
      if (category.weightMin) {
        return t("categories.format.weightKg", { weight: category.weightMin });
      }
      if (category.weightMax) {
        return t("categories.format.weightKg", { weight: category.weightMax });
      }
      return t("categories.format.empty");
    },
    [t],
  );

  const formatBeltRange = useCallback(
    (category: CommonModels.CategoryResponseDto) => {
      if (category.beltMin && category.beltMax) {
        return t("categories.format.beltRange", {
          min: t(`belt.${category.beltMin}`),
          max: t(`belt.${category.beltMax}`),
        });
      }
      if (category.beltMin) {
        return t("categories.format.beltSingle", {
          belt: t(`belt.${category.beltMin}`),
        });
      }
      if (category.beltMax) {
        return t("categories.format.beltSingle", {
          belt: t(`belt.${category.beltMax}`),
        });
      }
      return t("categories.format.empty");
    },
    [t],
  );

  const formatTeamSize = useCallback(
    (category: CommonModels.CategoryResponseDto) => {
      if (category.teamSize == null) {
        return t("categories.format.empty");
      }

      if (category.teamReservesSize != null) {
        return t("categories.format.teamSizeWithReserves", {
          size: category.teamSize,
          reserves: category.teamReservesSize,
          reservesLabel: t("categories.create.teamReservesShort"),
        });
      }

      return t("categories.format.teamSize", { size: category.teamSize });
    },
    [t],
  );

  return {
    emptyLabel: t("categories.format.empty"),
    formatAgeRange,
    formatWeightRange,
    formatBeltRange,
    formatTeamSize,
  };
};
