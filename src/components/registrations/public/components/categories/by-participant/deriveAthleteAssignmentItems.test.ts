import type { DraftParticipant } from "@/components/registrations/public/types";
import { CommonModels } from "@/data/common/common.models";
import { RegistrationsModels } from "@/data/registrations/registrations.models";

import { expect } from "@playwright/test";
import { describe, it, } from "node:test";
import { deriveAthleteAssignmentItems } from "./deriveAthleteAssignmentItems";

const category = (
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

const participant = (
  overrides: Partial<DraftParticipant>,
): DraftParticipant => ({
  clientId: "p-1",
  firstName: "Ada",
  lastName: "Lovelace",
  gender: "female",
  dateOfBirth: "2012-05-01T00:00:00.000Z",
  beltLevel: "10-kyu",
  categoryIds: [],
  ...overrides,
});

const bulkItem = (
  categories: CommonModels.CategoryResponseDto[],
  overrides: Partial<RegistrationsModels.PublicParticipantSuitableCategoriesItemDto> = {},
): RegistrationsModels.PublicParticipantSuitableCategoriesItemDto => ({
  firstName: "Ada",
  lastName: "Lovelace",
  dateOfBirth: "2012-05-01T00:00:00.000Z",
  gender: "female",
  beltLevel: "10-kyu",
  categories,
  ...overrides,
});

describe("deriveAthleteAssignmentItems", () => {
  const kata = category({ id: "kata", name: "Kata" });
  const kumite = category({
    id: "kumite",
    name: "Kumite -45",
    discipline: "yako-soku-kumite",
    weightMax: 45,
  });
  const team = category({
    id: "team",
    name: "Kata team",
    discipline: "kata-team",
    teamSize: 3,
  });
  const weightedTeam = category({
    id: "k-team",
    name: "Kumite team",
    discipline: "kumite-team",
    teamSize: 3,
    weightMax: 50,
  });

  it("lists individual categories and groups team categories across athletes", () => {
    const ada = participant({ clientId: "p-1" });
    const tok = participant({
      clientId: "p-2",
      firstName: "Tok",
      lastName: "Pok",
    });

    const result = deriveAthleteAssignmentItems(
      [ada, tok],
      [
        bulkItem([kata, team]),
        bulkItem([kata, team], { firstName: "Tok", lastName: "Pok" }),
      ],
    );

    expect(result.participantItems[0]?.categories.map((item) => item.id)).toEqual([
      "kata",
    ]);
    expect(result.participantItems[1]?.categories.map((item) => item.id)).toEqual([
      "kata",
    ]);
    expect(result.teamItems).toHaveLength(1);
    expect(result.teamItems[0]?.category.id).toBe("team");
    expect(
      result.teamItems[0]?.participants.map((item) => item.participantIndex),
    ).toEqual([0, 1]);
  });

  it("keeps the eligible list from the API and only splits team vs individual", () => {
    const ada = participant({});

    const result = deriveAthleteAssignmentItems(
      [ada],
      [bulkItem([kata, kumite, weightedTeam])],
    );

    expect(result.participantItems[0]?.categories.map((item) => item.id)).toEqual([
      "kata",
      "kumite",
    ]);
    expect(result.teamItems.map((item) => item.category.id)).toEqual(["k-team"]);
  });
});
