import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { isUnrestrictedKataCategory } from "@/components/categories/category-form-profiles";
import { CommonModels } from "@/data/common/common.models";

const isOpenBound = (value: number | null | undefined) =>
  value == null || value === 0;

const formatOpenRange = (
  min: number | null | undefined,
  max: number | null | undefined,
  copy: {
    from: (min: number) => string;
    upTo: (max: number) => string;
    range: (min: number, max: number) => string;
    empty: string;
  },
) => {
  const openMin = isOpenBound(min);
  const openMax = isOpenBound(max);

  if (!openMin && openMax) {
    return copy.from(min as number);
  }
  if (openMin && !openMax) {
    return copy.upTo(max as number);
  }
  if (!openMin && !openMax) {
    return copy.range(min as number, max as number);
  }
  return copy.empty;
};

export const useCategoryFormatters = () => {
  const { t } = useTranslation();

  const formatAgeRange = useCallback(
    (category: CommonModels.CategoryResponseDto) => {
      if (isUnrestrictedKataCategory(category)) {
        return t("categories.format.unrestricted");
      }
      return formatOpenRange(category.ageMin, category.ageMax, {
        from: (min) => t("categories.format.ageFrom", { min }),
        upTo: (max) => t("categories.format.ageUpTo", { max }),
        range: (min, max) => t("categories.format.ageRange", { min, max }),
        empty: t("categories.format.empty"),
      });
    },
    [t],
  );

  const formatWeightRange = useCallback(
    (category: CommonModels.CategoryResponseDto) =>
      formatOpenRange(category.weightMin, category.weightMax, {
        from: (min) => t("categories.format.weightFrom", { min }),
        upTo: (max) => t("categories.format.weightUpTo", { max }),
        range: (min, max) => t("categories.format.weightRange", { min, max }),
        empty: t("categories.format.empty"),
      }),
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

  const formatSummaryLine = useCallback(
    (category: CommonModels.CategoryResponseDto) => {
      const empty = t("categories.format.empty");
      const parts = [
        t(`discipline.${category.discipline}`),
        category.subDiscipline
          ? t(`subDiscipline.${category.subDiscipline}`)
          : null,
        category.gender ? t(`categories.create.${category.gender}`) : null,
        formatAgeRange(category),
        formatWeightRange(category),
        formatBeltRange(category),
        formatTeamSize(category),
      ].filter((part): part is string => Boolean(part) && part !== empty);

      return parts.join(" · ");
    },
    [formatAgeRange, formatBeltRange, formatTeamSize, formatWeightRange, t],
  );

  return {
    emptyLabel: t("categories.format.empty"),
    formatAgeRange,
    formatWeightRange,
    formatBeltRange,
    formatTeamSize,
    formatSummaryLine,
  };
};
