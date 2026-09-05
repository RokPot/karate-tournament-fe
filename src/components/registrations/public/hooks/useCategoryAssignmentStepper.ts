import { useCallback, useEffect, useState } from "react";

export type CategoryAssignmentPhase = "assign" | "overview";

export function useCategoryAssignmentStepper(
  categoryCount: number,
  categoryKey: string,
) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [phase, setPhase] = useState<CategoryAssignmentPhase>("assign");
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    setCategoryIndex(0);
    setPhase("assign");
    setDirection(1);
  }, [categoryCount, categoryKey]);

  const isFirstCategory = categoryIndex <= 0;
  const isLastCategory =
    categoryCount === 0 || categoryIndex >= categoryCount - 1;
  const safeIndex =
    categoryCount <= 0 ? 0 : Math.min(categoryIndex, categoryCount - 1);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setPhase("assign");
    setCategoryIndex((index) => Math.max(0, index - 1));
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setCategoryIndex((index) => {
      if (categoryCount === 0 || index >= categoryCount - 1) {
        return index;
      }
      return index + 1;
    });
  }, [categoryCount]);

  const goOverview = useCallback(() => {
    setDirection(1);
    setPhase("overview");
  }, []);

  const goBackFromOverview = useCallback(() => {
    setDirection(-1);
    setPhase("assign");
    setCategoryIndex(Math.max(0, categoryCount - 1));
  }, [categoryCount]);

  return {
    categoryIndex: safeIndex,
    phase,
    direction,
    isFirstCategory,
    isLastCategory,
    goPrev,
    goNext,
    goOverview,
    goBackFromOverview,
  };
}
