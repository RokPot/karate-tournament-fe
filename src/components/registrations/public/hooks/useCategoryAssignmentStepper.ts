import { useCallback, useEffect, useState } from "react";

export type CategoryAssignmentPhase = "assign" | "overview";

export function useCategoryAssignmentStepper(
  categoryCount: number,
  categoryKey: string,
) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [phase, setPhase] = useState<CategoryAssignmentPhase>("assign");

  useEffect(() => {
    setCategoryIndex(0);
    setPhase("assign");
  }, [categoryCount, categoryKey]);

  const isFirstCategory = categoryIndex <= 0;
  const isLastCategory =
    categoryCount === 0 || categoryIndex >= categoryCount - 1;
  const safeIndex =
    categoryCount <= 0 ? 0 : Math.min(categoryIndex, categoryCount - 1);

  const goPrev = useCallback(() => {
    setPhase("assign");
    setCategoryIndex((index) => Math.max(0, index - 1));
  }, []);

  const goNext = useCallback(() => {
    setCategoryIndex((index) => {
      if (categoryCount === 0 || index >= categoryCount - 1) {
        return index;
      }
      return index + 1;
    });
  }, [categoryCount]);

  const goOverview = useCallback(() => {
    setPhase("overview");
  }, []);

  const goBackFromOverview = useCallback(() => {
    setPhase("assign");
    setCategoryIndex(Math.max(0, categoryCount - 1));
  }, [categoryCount]);

  return {
    categoryIndex: safeIndex,
    phase,
    isFirstCategory,
    isLastCategory,
    goPrev,
    goNext,
    goOverview,
    goBackFromOverview,
  };
}
