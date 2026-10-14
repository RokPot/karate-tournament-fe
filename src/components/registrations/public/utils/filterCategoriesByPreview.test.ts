import { CommonModels } from "@/data/common/common.models";

import { expect } from "@playwright/test";
import { describe, it } from "node:test";
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

  it("excludes weight-limited categories when weight is missing", () => {
    const categories = [
      baseCategory({
        id: "kata",
        name: "Kata",
        gender: "male",
        ageMin: 12,
        ageMax: 16,
      }),
      baseCategory({
        id: "kumite",
        name: "Kumite -45",
        gender: "male",
        ageMin: 12,
        ageMax: 16,
        weightMax: 45,
      }),
    ];

    const matches = filterCategoriesByPreview(categories, {
      dateOfBirth: "2012-05-01T12:00:00.000Z",
      gender: "male",
      competitionDate,
    });

    expect(matches.map((c) => c.id)).toEqual(["kata"]);
  });

  it("keeps open-weight categories and drops min/max bounds when weight is missing", () => {
    const categories = [
      baseCategory({ id: "open", gender: "male", ageMin: 12, ageMax: 16 }),
      baseCategory({
        id: "zero-bounds",
        gender: "male",
        ageMin: 12,
        ageMax: 16,
        weightMin: 0,
        weightMax: 0,
      }),
      baseCategory({
        id: "min-only",
        gender: "male",
        ageMin: 12,
        ageMax: 16,
        weightMin: 40,
      }),
      baseCategory({
        id: "max-only",
        gender: "male",
        ageMin: 12,
        ageMax: 16,
        weightMax: 45,
      }),
    ];

    const matches = filterCategoriesByPreview(categories, {
      dateOfBirth: "2012-05-01T12:00:00.000Z",
      gender: "male",
      competitionDate,
    });

    expect(matches.map((c) => c.id).sort()).toEqual(["open", "zero-bounds"]);
  });

  it("applies min and max when weight is present", () => {
    const categories = [
      baseCategory({
        id: "in-range",
        gender: "male",
        ageMin: 12,
        ageMax: 16,
        weightMin: 40,
        weightMax: 45,
      }),
      baseCategory({
        id: "too-light",
        gender: "male",
        ageMin: 12,
        ageMax: 16,
        weightMin: 50,
        weightMax: 55,
      }),
    ];

    const matches = filterCategoriesByPreview(categories, {
      dateOfBirth: "2012-05-01T12:00:00.000Z",
      gender: "male",
      weightKg: 42,
      competitionDate,
    });

    expect(matches.map((c) => c.id)).toEqual(["in-range"]);
  });
});
