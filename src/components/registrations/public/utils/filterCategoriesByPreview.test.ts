import { CommonModels } from "@/data/common/common.models";

import {
  calculateAgeOnDate,
  filterCategoriesByPreview,
} from "./filterCategoriesByPreview";

const baseCategory = (
  overrides: Partial<CommonModels.CategoryResponseDto>,
): CommonModels.CategoryResponseDto =>
  ({
    id: "cat-1",
    name: "Test",
    discipline: "kata",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  }) as CommonModels.CategoryResponseDto;

describe("calculateAgeOnDate", () => {
  it("counts full years on competition day", () => {
    expect(
      calculateAgeOnDate("2010-11-22T12:00:00.000Z", "2026-11-21T12:00:00.000Z"),
    ).toBe(15);
    expect(
      calculateAgeOnDate("2010-11-20T12:00:00.000Z", "2026-11-21T12:00:00.000Z"),
    ).toBe(16);
  });
});

describe("filterCategoriesByPreview", () => {
  const competitionDate = "2026-11-21T12:00:00.000Z";

  it("matches gender, age, and optional weight", () => {
    const categories = [
      baseCategory({
        id: "a",
        name: "Male U16",
        gender: "male",
        ageMin: 12,
        ageMax: 16,
      }),
      baseCategory({
        id: "b",
        name: "Female -45",
        gender: "female",
        ageMin: 12,
        ageMax: 16,
        weightMax: 45,
      }),
      baseCategory({
        id: "c",
        name: "Open",
        gender: null,
        ageMin: 0,
        ageMax: 0,
      }),
    ];

    const matches = filterCategoriesByPreview(categories, {
      dateOfBirth: "2012-05-01T12:00:00.000Z",
      gender: "male",
      weightKg: 50,
      competitionDate,
    });

    expect(matches.map((c) => c.id).sort()).toEqual(["a", "c"]);
  });
});
